const express = require("express")
const User = require("../model/user.model")
const bcrypt = require("bcryptjs")
const generateToken = require("../utils/utils")
const verifyToken = require("../middleware/middleware")
const nodemailer = require("nodemailer")
const PendingUser = require("../model/pendingUser.model")
const rejectedUser = require("../model/rejectedUser.model")
const router = express.Router()

router.post("/admin/user/accept",async(req,res)=>{
 const{email} = req.body;
    const user = await PendingUser.findOne({email})
    const newUser = await User(user).save();
    await PendingUser.findOneAndDelete({_id:user.id})

    const token = Math.random().toString(36).slice(-8)
    user.restPasswordToken = token;
    user.restPasswordExpires = Date.now() + 360000  //the code will be valid fr 1hr
    await user.save();
    let htmlEmail = `<html>
    <body>
    <h2>Welcome to our website</h2>
    </body>
    </html>`
    const message = {
        from:"abiramirajasekar002@gmail.com",
        to:user.email,
        subject:"signup request",
         html:`${htmlEmail} \n\n Your are now eligible for this website.\n\n Thank you!`
    }

    transporter.sendMail(message,(err,info)=>{
        if(err){
            res.status(404).json({message:"Somethng went worng"})
        }
        res.status(201).json({message:`user has created succesfully!`})
    })

})


// rejected

router.post("/admin/user/reject",async(req,res)=>{
    const{email} = req.body;
       const user = await PendingUser.findOne({email})
       const newUser = await rejectedUser(user).save();
       await PendingUser.findOneAndDelete({_id:user.id})

       const token = Math.random().toString(36).slice(-8)
    user.restPasswordToken = token;
    user.restPasswordExpires = Date.now() + 360000  //the code will be valid fr 1hr
    await user.save();

       let htmlEmail = `<html>
       <body>
       <h2>Sorry we are not allow you to signup</h2>
       </body>
       </html>`
       const message = {
           from:"abiramirajasekar002@gmail.com",
           to:user.email,
           subject:"signup request",
            html:`${htmlEmail} \n\n sorry you are not meet certian qualification\n\n Thank you!`
       }
   
       transporter.sendMail(message,(err,info)=>{
           if(err){
               res.status(404).json({message:"Somethng went worng"})
           }
           res.status(201).json({message:`user has rejected succesfully!`})
       })



    res.status(201).json({message:`user has rejected succesfully!`})
 
    
   
   })