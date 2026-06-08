import mongoose from "mongoose";
import Message from "../models/messageModel.js";

export const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not set");
        }

        const conn = await mongoose.connect(process.env.MONGODB_URI);

        console.log("Host:", conn.connection.host);
        console.log("Database:", conn.connection.name);

        const collections = await conn.connection.db.listCollections().toArray();
        console.log(
            "Collections:",
            collections.map(c => c.name)
        );
        const count = await Message.countDocuments();
        console.log("Message Count:", count);
    } catch (err) {
        console.log("MongoDB connection error : ", err.message);
        throw err;
    }
};