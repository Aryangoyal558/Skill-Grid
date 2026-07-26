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
        required:true,
        minlength:6
    },
    role:{
        type:String,
        enum:['candidate','examiner','admin'],
        default:'candidate'
    },
    phone_no:{
        type:Number,
    }
},{timestamps:true});

const user= mongoose.model('user',userSchema);

module.exports=user;