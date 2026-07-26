require('dotenv').config();

const express= require('express');
const cors= require('cors');
const cookieParser= require('cookie-parser');

const mongoDb= require('./connection');
const signin_upRoute=require('./routes/signin_up');

const app=express();
const port= process.env.PORT;
const mongo_url=process.env.MONGO_URI;

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use('/auth',signin_upRoute);

app.get('/',(req,res)=>{
    res.send("Page under process...");
});

mongoDb(mongo_url)
    .then(()=>console.log("Database is running..."))
    .catch((err)=>console.log("Error occurs..."));

app.listen(port,()=>{
    console.log("Server is running...");
});