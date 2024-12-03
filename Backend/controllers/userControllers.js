import { User } from "../models/usermodel.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";


export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
      const file = req.file;
      const fileUrl = getDataUri(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUrl.content)
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({
                message: "user already exist",
                success: false
            })
        }
        // password convert in hash
        const hashPassword = await bcrypt.hash(password, 10)//10 is salt value
        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashPassword,
            role,
            profile:{
                profilephoto: cloudResponse.secure_url
            }
        })
        return res.status(201).json({
            message: "Account created successfully ",
            success: true,
        })
    }
    catch (error) {
        console.log(error);

    }
}

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                message: "Incorrect Password,emial",
                success: false
            })
        }
        const ispasswordMatch = await bcrypt.compare(password, user.password)
        if (!ispasswordMatch) {
            return res.status(400).json({
                message: "Incorrect Password,emial",
                success: false
            })
        }
        //check role is correct or not
        if (role != user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            });
        };
        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });
        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
        }
        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        })

    }
    catch (error) {
        console.log(error);

    }
}

export const logout = async (req,res) => {
    try {
        return res.status(200).cookie("token", " ", {maxAge:0}).json({
            message: "Logged out successfully",
            success: true,
        })
    }
    catch (error) {
        console.log(error);

    }
}

export const updateProfile = async (req, res) => {

    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const file = req.file;
     //cloudinary set up
     const fileUri = getDataUri(file);
     
     const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
   
    


       let skillsArray;
        if (skills) {
            
             skillsArray = skills.split(",")
        }
        const userId = req.id;  //middleware authentication
        let user = await User.findById(userId)
        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false
            })
        }
        //updating data 
        if(fullname)  user.fullname = fullname
        if(email)  user.email = email
        if(phoneNumber)   user.phoneNumber = phoneNumber
        if(bio)  user.profile.bio = bio
        if(skills)  user.profile.skills = skillsArray
        

        //resume section
        
        if(cloudResponse){
            user.profile.resume = cloudResponse.secure_url // save the cloudinary url
            user.profile.resumeOriginalName = file.originalname // Save the original file name
        }
     
            
           
            
            

        await user.save();
        //create a new user
        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
        }

        return res.status(200).json({
            message: "Profile updated successfully.",
            user,
            success: true
        })

    }
    catch (error) {
        console.log(error);

    }
}