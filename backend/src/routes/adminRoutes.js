import express from 'express';
import {
    createAdmin,
    getAdminById,
    getAllAdmins,
    deleteAdmin,
    updateAdmin,
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getAllCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany, 
    createCompany
} from '../controllers/adminController.js';
import { adminAuth, authMiddleware } from '../middlewares/authMiddleware.js';
import {
    getAllMessages,
    replyToMessage,
    markAsRead,
    deleteMessage,
    markAsUnread
} from '../controllers/messageController.js';  // Import message controller

const router = express.Router();

// Admin-related routes
router.post('/create-admin', adminAuth, createAdmin); // Route to create a new admin
router.get('/admins', adminAuth, getAllAdmins);
router.put('/admins/:adminId', adminAuth, updateAdmin);
router.delete('/admins/:adminId', adminAuth, deleteAdmin);
router.get('/admins/:adminId', adminAuth, getAdminById);

// User management routes
router.get('/users', adminAuth, getAllUsers); // Get all users
router.get('/users/:userId', adminAuth, getUserById); // Get user by ID
router.put('/users/:userId', adminAuth, updateUser); // Update user by ID
router.delete('/users/:userId', adminAuth, deleteUser); // Delete user by ID
// Route to create a new user account
router.post('/create-user', adminAuth, createUser);

// Company management routes
router.get('/companies', adminAuth, getAllCompanies); // Get all companies
router.get('/companies/:companyId', adminAuth, getCompanyById); // Get company by ID
router.put('/companies/:companyId', adminAuth, updateCompany); // Update company by ID
router.delete('/companies/:companyId', adminAuth, deleteCompany); // Delete company by ID
// Route to create a new company account
router.post('/create-company', adminAuth, createCompany);

// Message management routes
router.get('/messages', authMiddleware(['admin']), getAllMessages); // Get all messages
router.put('/messages/:id/read', authMiddleware(['admin']), markAsRead); // Mark message as read
router.delete('/messages/:id', authMiddleware(['admin']), deleteMessage); // Delete message
router.put('/messages/:id/unread', authMiddleware(['admin']), markAsUnread); // Mark message as unread
// Admin replies to a message
router.post('/messages/:id/reply', authMiddleware(['admin']), replyToMessage);

export default router;
