import mongoose from "mongoose";

const aiMessageSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiverId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    role:{
        type: String,
        enum: ["user" ,"assistant"],
        required: true,
    },
    content:{
        type: String,
        default: "",
    },
    image:{
        type: String,
        default: "",
    },
}, {timestamps: true});

const AiMessage = mongoose.model("AiMessage" , aiMessageSchema);
export default AiMessage;