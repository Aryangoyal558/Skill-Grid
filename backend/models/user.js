const mongoose= require('mongoose');

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        requird:true,
        minlength:6
    },
    role:{
        type:String,
        enum:['candidate','examiner','admin'],
        default:'candidate'
    },
    phone_no:{
        type:Number,
        unique:true,
        minlength:6000000000,
        maxlength:9999999999
    }
},{timestamps:true});

const user= mongoose.model('user',userSchema);

module.exports=user;