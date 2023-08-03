const mongoose = require("mongoose")

const rejectedUserSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    
})

const rejectedUser = mongoose.model("rejecteduser",rejectedUserSchema)

module.exports = rejectedUser