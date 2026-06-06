import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import authRoute from "./routes/authRoute.js"
import messageRoute from "./routes/messageRoute.js"
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();
const app = express();
const PORT = process.env.PORT;
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(cookieParser());

app.use("/api/auth" , authRoute);
app.use("/api/message" , messageRoute);

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT , () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (err) {
        console.error("Server failed to start:", err.message);
        process.exit(1);
    }
};

startServer();