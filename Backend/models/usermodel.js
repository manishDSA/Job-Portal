import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname:{
        type:String,
        required:true

    },
    email:{
        type:String,
        required:true,
        unique:true

    },
    phoneNumber:{
        type:Number,
        required:true

    },
    password:{
        type:String,
        required:true,
    },
    //option for sign in 
    role:{
        type:String,
        enum:["student","recruiter"],
    },
    profile:{
        bio:{type:String},
        skills:[{type:String}],
        resume:{type:String},// URL to resume file
        resumeOriginalName:{type:String},
        company:{type:mongoose.Schema.Types.ObjectId, ref:'Company'},
        profilephoto:{
            type:String,
            default:""
        }
          
    },
},{timestamps:true})

export const User = mongoose.model('User',userSchema)