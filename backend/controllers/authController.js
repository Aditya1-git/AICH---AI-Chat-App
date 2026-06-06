import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";


export const signup = async (req,res) => {
    const {fullName , email , password} = req.body;
    try{
        if(!fullName || !email || !password){
            return res.status(400).json({message: "All fields are required"});
        }
        if(password.length < 5){
            return res.status(400).json({message: "Password must be at least 5 characters"});
        }
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message: "User already exists"});
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password , salt);

        const newUser = await User.create({ 
            fullName , 
            email , 
            password:hashedPassword 
        });

        if(newUser){
            //generate jwt token
            generateToken(newUser._id , res)
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            })
        }

    } catch(err){
        return res.status(500).json({message: err.message});
    }
};

export const login = async (req,res) => {
    const { email , password } = req.body;
    try{

        if(!email || !password){
            return res.status(400).json({message: "All fields are required"}); 
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "Invalid credentials"}); 
        }
        const isPasswordCorrect = await bcrypt.compare(password , user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message: "Invalid credentials"});
        }
        generateToken(user._id , res);
        
        res.status(200).json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePic: user.profilePic,
            })

    }catch(err){
        return res.status(500).json({message: err.message});
    }
}

export const logout = (req,res) => {
    try{
        res.cookie("jwt" , "" , {maxAge:0});
        res.status(200).json({message: "Logged out successfully"})
    }catch(err){
        return res.status(500).json({message: err.message});
    }
}

export const updateProfile = async (req,res) => {
     try{
        const {profilePic} = req.body;
        const userId = req.user._id;
        if(!profilePic){
            return res.status(400).json({message: "Profile Pic required"});
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
          const updateUser = await User.findByIdAndUpdate(
                userId,
                { profilePic: uploadResponse.secure_url },
                { returnDocument: "after" }
          );
        res.status(200).json(updateUser); 
     }catch(err){
        return res.status(500).json({message: err.message});
     }
}

export const checkAuth = (req,res) => {
    try{
        res.status(200).json(req.user);
    }catch(err){
        console.log("Error in checkAUth controller");
        res.status(500).json({message : err.message});
    }
}