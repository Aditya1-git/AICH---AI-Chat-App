import express from 'express'
import { protect } from '../middleware/protect.js';
import { getMesssagesofaUser, getUsersForSidebar, sendMessages } from '../controllers/messageController.js';
const router = express.Router();

router.get("/users" , protect , getUsersForSidebar);
router.get("/:id" , protect , getMesssagesofaUser);

router.post("/send/:id" , protect , sendMessages);
export default router;