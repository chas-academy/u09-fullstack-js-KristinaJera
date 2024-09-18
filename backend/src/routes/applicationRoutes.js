import express from 'express';
import { applyForJob, getUserApplications, deleteApplication, checkIfUserHasApplied } from '../controllers/applicationController.js';
import upload from '../middlewares/multerConfig.js';
import mongoose from 'mongoose';

const router = express.Router();

// Route to apply for a job
router.post('/apply/:jobId', upload.single('resume'), applyForJob);

// Route to get all applications of a user
router.get('/user-applications/:userId', getUserApplications);

// Route to delete an application
router.delete('/delete-application/:applicationId', deleteApplication);
// Endpoint to check if the user has applied for a specific job
router.get('/has-applied/:jobId/:userId', checkIfUserHasApplied);


export default router;
