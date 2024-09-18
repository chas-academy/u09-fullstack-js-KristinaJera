import express from 'express';
import { applyForJob, getUserApplications } from '../controllers/applicationController.js';
import upload from '../middlewares/multerConfig.js';

const router = express.Router();

// Route to apply for a job
router.post('/apply/:jobId',upload.single('resume'), applyForJob);

// Route to get all applications of a user
router.get('/user-applications/:userId', getUserApplications);

export default router;
