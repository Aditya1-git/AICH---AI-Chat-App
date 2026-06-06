import cloudinary from "../lib/cloudinary.js";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js"


export const getUsersForSidebar = async (req , res) => {
    try{
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne:loggedInUserId}}).select("-password");
        res.status(200).json(filteredUsers);
    }catch(err){
        res.status(500).json({message: err.message});
    }
} 
  
export const getMesssagesofaUser = async (req,res) => {
    try{
        const { id : userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or:[
                {senderId: myId , receiverId: userToChatId},
                {senderId: userToChatId , receiverId: myId}
            ]
        })
        res.status(200).json(messages);
    }catch(err){
        res.status(500).json({message: err.message});
    }
}
export const sendMessages = async (req,res) => {
    try{
        const { text , image } = req.body;
        const { id: receiverId } = req.params
        const senderId = req.user._id;
        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl  = uploadResponse.secure_url;
        }
        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        })
        await newMessage.save();

        //todo: realtime funtionality goes here 
        

        res.status(201).json(newMessage);
    }catch(err){
            res.status(500).json({message: err.message});
    }
}
