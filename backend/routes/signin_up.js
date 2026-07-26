const express= require('express');

const router=express.Router();

router.post('/signup',async(req,res)=>{
    const {name,email,password,con_pass,role,phone_no}= req.body;
    if(!name||!email||!password||!con_pass) return res.status(400).json({message:"All data fiels required..."});
    if(password!==con_pass) return res.status(401).json({message:"Password should be same as Confirm Password"});
    try{
        await User.create({
            name,
            email,
            password,
            role,
            phone_no
        });
        res.status(201).json({message:"User register Successfully"});
    }catch(err){
        return res.status(500).json({message:err.message});
    };
});

router.post('/login',async(req,res)=>{
    const {email,password}=req.body;
    if(!email||!password) return res.status(400).json({message:"All data fields required..."});
    try{
        const user_info=await User.findOne({
            email,
            password
        });
        if(!user_info) return res.status(401).json({message:"Invalid Credentials..."});
        res.status(200).json({message:`${user_info.name} Welcome`});
    }catch(err){
        res.status(500).json({message:err.message});
    };
});