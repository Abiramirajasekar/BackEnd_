const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    email:String,
    password:String,
    restPasswordToken:String,
    restPasswordExpires:Date,
})
const User = mongoose.model("user",UserSchema)

module.exports = User