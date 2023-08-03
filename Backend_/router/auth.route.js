const express = require("express")
const User = require("../model/user.model")
const bcrypt = require("bcryptjs")
const generateToken = require("../utils/utils")
const verifyToken = require("../middleware/middleware")
const nodemailer = require("nodemailer")
const PendingUser = require("../model/pendingUser.model")
const router = express.Router()
router.get("/test",(req,res)=>
    res.json({message :"Api Testing Successfull"})
)

router.post("/user",async(req,res)=>{
    const{email,password,name} = req.body;
    const user = await User.findOne({email})
    if(!user){
    const hashedPassword = await bcrypt.hash(password,3)
    const newUser = new PendingUser({email,password:hashedPassword,name})
    await newUser.save()
    return res.json({message:"we will get back soon!"})
    }
    res.status(404).json({message:"User already exists!"})

})



router.post("/autenticate",async(req,res)=>{
    const {email,password} = req.body;
    const user = await User.findOne({email})
    if(!user){
    return res.status(404).json({message:"User not found!Try again!"})
    }
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        return res.status(401).json({message:"Incorrect Password:("})
    }
  const token = generateToken(user)
  res.json({token})
})
router.get("/data",verifyToken,(req,res)=>{
    res.json({message:`Welcome ${req.user.email}! This is protected data`})
})
router.post("/reset-password",async(req,res)=>{
    const {email} = req.body
    const user = await User.findOne({email})
   
    if(!user){
        res.status(404).json({message:"User not found"})
    }
    const token = Math.random().toString(36).slice(-8)
    user.restPasswordToken = token;
    user.restPasswordExpires = Date.now() + 360000  //the code will be valid fr 1hr
    await user.save();

    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:"abiramirajasekar002@gmail.com",
            pass:"trzmfdnsgxfkmsag"
        }
    })


    let htmlEmail = `<html>
    <body>
    <h2>Welcome to our website</h2>
    <h4>here is your reset password requesting code: </h4>
    </body>
    </html>`
    const message = {
        from:"abiramirajasekar002@gmail.com",
        to:user.email,
        subject:"Password reset request",
       
         html:`${htmlEmail} \n\n You are reciving this email because you(or someone else)has requested a password reset for your account.\n\n please use the following token to rest your password ${token}.If you did not request a password reset,Please ignore this mail.\n\n Thank you!`
        
    }
    transporter.sendMail(message,(err,info)=>{
        if(err){
            res.status(404).json({message:"Somethng went worng"})
        }
         res.status(200).json({message:"Password reset email sent"+ info.response})
    })
})

router.post("/reset-password/:token",async(req,res)=>{
    const {token}=req.params;
    const {password} = req.body;
    
    const user = await User.findOne({
        restPasswordToken:token,
        restPasswordExpires:{$gt:Date.now()},
    })
    if(!user){
        res.status(404).json({message:"Invalid token"})
    }
    const hashedPassword = await bcrypt.hash(password,10);
    user.password  = hashedPassword 
    user.restPasswordToken = null;
    user.restPasswordExpires = null;
    await user.save()
    res.json({message:"Password reset successfully"})
})
module.exports = router