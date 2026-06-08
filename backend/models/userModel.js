import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            minLength: 5,
        },
        profilePic: {
            type: String,
            default: "",
        },
        credits:{
            type: Number,
            default: 40,
        },
    }, {
        timestamps : true
    }
)

const User = mongoose.model("User" , userSchema);
export default User;