import express from "express";
import { checkAuth, login, logout, signup, updateProfile } from "../controllers/authController.js";
import { protect } from "../middleware/protect.js";

const router = express.Router();

router.post("/signup" , signup);
router.post("/login" , login);
router.post("/logout" , logout);

//route for profilePic change
router.put("/update-profile" , protect , updateProfile );

router.get("/check", protect , checkAuth);

export default router;