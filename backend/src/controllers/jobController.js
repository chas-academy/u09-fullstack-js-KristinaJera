import mongoose from 'mongoose'; 
import Companies from "../models/companiesModel.js";
import Jobs from "../models/jobsModel.js";

// Create a job
export const createJob = async (req, res, next) => {
  try {
    const {
      jobTitle,
      jobType,
      location,
      salary,
      vacancies,
      experience,
      desc,
      requirements,
    } = req.body;

    if (!jobTitle || !jobType || !location || !salary || !requirements || !desc) {
      return next("Please Provide All Required Fields");
    }

    const id = req.body.user.userId;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No Company with id: ${id}`);

    const jobPost = {
      jobTitle,
      jobType,
      location,
      salary,
      vacancies,
      experience,
      detail: { desc, requirements },
      company: id, // Reference to the company
    };

    const job = new Jobs(jobPost);
    await job.save();

    // Update the company information with job id
    const company = await Companies.findById(id);

    if (company) {
      company.jobPosts.push(job._id);
      await company.save();
    }

    res.status(200).json({
      success: true,
      message: "Job Posted Successfully",
      job,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

// Update a job
export const updateJob = async (req, res, next) => {
  try {
    const {
      jobTitle,
      jobType,
      location,
      salary,
      vacancies,
      experience,
      desc,
      requirements,
    } = req.body;
    const { jobId } = req.params;

    if (!jobTitle || !jobType || !location || !salary || !requirements || !desc) {
      return next("Please Provide All Required Fields");
    }

    const id = req.body.user.userId;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No Company with id: ${id}`);

    const jobPost = {
      jobTitle,
      jobType,
      location,
      salary,
      vacancies,
      experience,
      detail: { desc, requirements },
      _id: jobId,
    };

    await Jobs.findByIdAndUpdate(jobId, jobPost, { new: true });

    res.status(200).json({
      success: true,
      message: "Job Post Updated Successfully",
      job: jobPost,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getJobPosts = async (req, res, next) => {
    try {
      const jobs = await Jobs.find({}).populate({
        path: 'company',
        select: 'companyName' // Add other fields if needed
      });
      
      console.log('Jobs fetched from backend:', jobs); // Log for debugging
  
      if (jobs.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No jobs found'
        });
      }
  
      res.status(200).json({
        success: true,
        data: jobs
      });
    } catch (error) {
      console.error('Error fetching jobs:', error); // Log error
      res.status(500).json({
        success: false,
        message: 'Failed to fetch jobs',
        error: error.message
      });
    }
  };
  
  

// Get job by ID
export const getJobById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const job = await Jobs.findById(id).populate({
      path: 'company',
      select: 'companyName',
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job Post Not Found',
      });
    }

    const searchQuery = {
      $or: [
        { jobTitle: { $regex: job.jobTitle, $options: 'i' } },
        { jobType: { $regex: job.jobType, $options: 'i' } },
      ],
    };

    let queryResult = Jobs.find(searchQuery)
      .populate({
        path: 'company',
        select: 'companyName',
      })
      .sort({ _id: -1 });

    queryResult = queryResult.limit(6);
    const similarJobs = await queryResult;

    res.status(200).json({
      success: true,
      data: job,
      similarJobs,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

// Delete a job post
export const deleteJobPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Jobs.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: 'Job Post Deleted Successfully.',
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};
