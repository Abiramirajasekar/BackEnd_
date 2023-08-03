const mongoose = require("mongoose")

const PendingUserSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    
})

const PendingUser = mongoose.model("pendinguser",PendingUserSchema)

module.exports = PendingUser