const express = require("express")
const User = require("../model")
const bcrypt = require("bcryptjs")
const generateToken = require("../utils")
const verifyToken = require("../middleware")
const nodemailer = require("nodemailer")
const router = express.Router()
router.get("/test",(req,res)=>
    res.json({message :"Api Testing Successfull"})
)

router.post("/user",async(req,res)=>{
    const{email,password} = req.body;
    const user = await User.findOne({email})
    if(!user){
    const hashedPassword = await bcrypt.hash(password,10)
    const newUser = new User({email,password:hashedPassword})
    await newUser.save()
    return res.json({message:"Successfully Created!"})
    }
    res.status(404).json({message:"User already exsists!"})

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
    const user = await User.findOne({email})
    if(!user){
        res.status(404).json({message:"User not found"})
    }
    const token = Math.random().toString(36).slice(-8)
    user.restPasswordToken = token;
    user.restPasswordExpires = Date.now() + 36000  //the code will be valid fr 1hr
    await user.save();

    const transporter = nodemailer
})
module.exports = router