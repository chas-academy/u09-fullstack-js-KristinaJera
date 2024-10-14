import express from "express";
import {userAuth} from "../middlewares/authMiddleware.js";
import {getUser, updateUser, getUserProfile, updateUserProfile, getUserMessages, replyToUserMessage} from "../controllers/userController.js";
import { getAllUsers } from "../controllers/adminController.js";
const router = express.Router();

//Get user 
router.post('/get-user', userAuth, getUser );
//Update user || Put
router.post('/update-user', userAuth, updateUser );
// Route to get all jobs
router.get('/users', getAllUsers);
// Route to get the user profile image
router.get('/get-user-profile', userAuth, getUserProfile);
router.post('/get-user-profile', userAuth, getUserProfile); // Ensure this matches your frontend request type

// Update User Profile Route
router.put('/update-user-profile', userAuth, updateUserProfile);

// Route to get user messages
router.get('/user/messages', userAuth, getUserMessages);

// Route to reply to a specific message
router.post('/user/messages/:id/reply', userAuth, replyToUserMessage);


export default router;