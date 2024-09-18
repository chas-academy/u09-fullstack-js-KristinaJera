import Applications from "../models/applicationsModel.js";
import Jobs from "../models/jobsModel.js";
import Users from '../models/userModel.js'; 
import mongoose from "mongoose";



export const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { userId } = req.body;

    // Check if the user has already applied for this job
    const existingApplication = await Applications.findOne({ jobId, userId });

    if (existingApplication) {
      return res.status(400).json({ success: false, message: 'You have already applied for this job.' });
    }

    // Proceed with the application if not already applied
    const newApplication = new Applications({
      job: jobId,
     user: userId,
     resume: req.file.path, // Store the file path or URL
     name: req.body.name,
     email: req.body.email,
     phone: req.body.phone,
     coverLetter: req.body.coverLetter
    });

    await newApplication.save();
    res.status(200).json({ success: true, message: 'Application submitted successfully.' });

  } catch (error) {
    console.error('Error applying for job:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const checkIfUserHasApplied = async (req, res) => {
  try {
    const { jobId, userId } = req.params;

    // Validate input
    if (!mongoose.Types.ObjectId.isValid(jobId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid jobId or userId' });
    }

    // Check if the user has applied for the job
    const application = await Applications.findOne({ job: jobId, user: userId });

    if (application) {
      // User has applied for the job
      return res.json({ success: true, hasApplied: true });
    } else {
      // User has not applied for the job
      return res.json({ success: true, hasApplied: false });
    }
  } catch (error) {
    console.error('Error checking application:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
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

  export const deleteApplication = async (req, res) => {
    try {
      const { applicationId } = req.params;
  
      if (!mongoose.Types.ObjectId.isValid(applicationId)) {
        return res.status(400).json({ success: false, message: 'Invalid application ID' });
      }
  
      const application = await Applications.findById(applicationId);
      if (!application) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }
  
      await Applications.findByIdAndDelete(applicationId);
      res.status(200).json({ success: true, message: 'Application removed successfully' });
    } catch (error) {
      console.error('Error deleting application:', error);
      res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
  };