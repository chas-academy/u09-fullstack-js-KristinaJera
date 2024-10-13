import express from "express";
import {authMiddleware }from "../middlewares/authMiddleware.js";
import { submitMessage } from "../controllers/messageController.js";

const router = express.Router();

// Submit a message (user/company contact form)
router.post('/contact', authMiddleware(['user', 'company']), submitMessage);

  export default router;