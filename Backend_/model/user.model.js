const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    email:String,
    password:String,
    restPasswordToken:String,
    restPasswordExpires:Date,
    
})

// const resetSchema = new mongoose.Schema({
//     email:String
// })

const User = mongoose.model("user",UserSchema)
// const Reset = mongoose.model("reset",resetSchema)
module.exports = User