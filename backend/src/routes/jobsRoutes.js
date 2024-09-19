import express from "express";
import {userAuth} from "../middlewares/authMiddleware.js";
import {createJob, deleteJobPost, getJobById, getJobPosts, updateJob, getCompanyJobs} from "../controllers/jobController.js";
import { getAllJobs } from "../controllers/adminController.js";
const router = express.Router()

//POST JOB
router.post("/upload-job", userAuth, createJob);

//UPDATE JOB
router.put("/update-job/:jobId", updateJob);

//GET JOB POST
router.get("/find-jobs", getJobPosts);
router.get("/job/:id", getJobById); 

// DELETE JOB POST 
router.delete("/delete-job/:id", userAuth, deleteJobPost)

// Route to get all jobs
router.get('/jobs', getAllJobs);
router.get('/company-jobs/:companyId', getCompanyJobs);
router.delete('/company-jobs/:id',userAuth, deleteJobPost);

export default router;