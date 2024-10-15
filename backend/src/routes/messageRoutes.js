import express from "express";
import {authMiddleware, userAuth }from "../middlewares/authMiddleware.js";
import { submitMessage, getCompanyMessages, replyToCompanyMessage, markAsRead, markAsUnread, deleteMessage} from "../controllers/messageController.js";

const router = express.Router();

// Submit a message (user/company contact form)
router.post('/contact', authMiddleware(['user', 'company']), submitMessage);
// Route to get company messages
router.get('/company/messages', userAuth, getCompanyMessages);
// Route to reply to a specific message
router.post('/company/messages/:id/reply', userAuth, replyToCompanyMessage);

// Routes for all roles: users, admins, and companies
router.put('/user/messages/:id/read', userAuth, markAsRead);
router.put('/user/messages/:id/unread', userAuth, markAsUnread);
router.delete('/user/messages/:id', userAuth, deleteMessage);
router.put('/company/messages/:id/read', userAuth, markAsRead);
router.put('/company/messages/:id/unread', userAuth, markAsUnread);
router.delete('/company/messages/:id', userAuth, deleteMessage);


  export default router;