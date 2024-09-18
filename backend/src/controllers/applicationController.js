import Applications from "../models/applicationsModel.js";
import Jobs from "../models/jobsModel.js";
import Users from '../models/userModel.js'; 
import mongoose from "mongoose";

export const applyForJob = async (req, res) => {
    try {
      const { jobId } = req.params;
      const { userId } = req.body; // Extract userId from req.body
  
      console.log('Received jobId:', jobId);
      console.log('Received userId:', userId);
      
      if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return res.status(400).json({ success: false, message: 'Invalid job ID' });
      }
  
      const job = await Jobs.findById(jobId);
      if (!job) {
        return res.status(404).json({ success: false, message: 'Job not found' });
      }
  
      if (!userId) {
        return res.status(400).json({ success: false, message: 'User ID is required' });
      }
  
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'Resume file is required' });
      }
      
      const application = new Applications({
        job: jobId,
        user: userId,
        resume: req.file.path, // Store the file path or URL
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        coverLetter: req.body.coverLetter
      });
  
      await application.save();
      
      res.status(200).json({ success: true, message: 'Application submitted successfully' });
    } catch (error) {
      console.error('Error in applyForJob:', error);
      res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
  };

  export const getUserApplications = async (req, res) => {
    try {
      const { userId } = req.params;
  
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ success: false, message: 'Invalid user ID' });
      }
  
      const applications = await Applications.find({ user: userId })
        .populate('job', 'jobTitle jobType location salary vacancies experience company')
        .populate('user', 'name email phone') // Populating user details if needed
        .exec();
  
      if (!applications.length) {
        return res.status(404).json({ success: false, message: 'No applications found' });
      }
  
      res.status(200).json({ success: true, data: applications });
    } catch (error) {
      console.error('Error fetching user applications:', error.message);
      res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
  };