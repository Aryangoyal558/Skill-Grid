const mongoose=require("mongoose");

const questionSchema=new mongoose.Schema({

    assessment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"assessment",
        required:true
    },

    question:{
        type:String,
        required:true
    },

    options:[{
        type:String
    }],

    correctAnswer:{
        type:Number,
        required:true
    },

    marks:{
        type:Number,
        default:1
    }

},{timestamps:true});

const question=mongoose.model("question",questionSchema);

module.exports=question;