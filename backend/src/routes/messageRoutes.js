import express from "express";
import {authMiddleware, userAuth }from "../middlewares/authMiddleware.js";
import { submitMessage, getCompanyMessages, replyToCompanyMessage } from "../controllers/messageController.js";

const router = express.Router();

// Submit a message (user/company contact form)
router.post('/contact', authMiddleware(['user', 'company']), submitMessage);
// Route to get company messages
router.get('/company/messages', userAuth, getCompanyMessages);
// Route to reply to a specific message
router.post('/company/messages/:id/reply', userAuth, replyToCompanyMessage);

  export default router;