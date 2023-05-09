require("dotenv").config()
const express = require("express");
const mongoose =  require("mongoose");
const routes = require("./router");

const app = express()
app.use(express.json())
app.use("/api",routes)

// Connect to mongodb
mongoose.connect(process.env.DB_CONNECTION_URL,{
    useNewUrlParser:true,
    useUnifiedTopology: true,
})
const database = mongoose.connection
database.on("error",(err)=> console.log("ERROR:",err))
database.on("connected",()=>console.log("Database Connected"))


// app.get("/",(req,res=>{
//     res.send("Welcome!")})

app.listen(3000,()=>{
console.log("Successfully your server started!")
})
