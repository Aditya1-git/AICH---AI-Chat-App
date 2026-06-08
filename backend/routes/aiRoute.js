import express from "express";
import { protect } from "../middleware/protect.js";
import { getAiMessages, sendAiMessage } from "../controllers/aiController.js";

const router = express.Router();


router.get("/:id" , protect , getAiMessages);
router.post("/:id" , protect , sendAiMessage);

export default router;