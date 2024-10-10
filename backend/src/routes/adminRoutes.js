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
import { adminAuth } from '../middlewares/authMiddleware.js';

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



export default router;
