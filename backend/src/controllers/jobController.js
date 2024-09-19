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
    const userId = req.user.userId; // Retrieved from `userAuth` middleware

    if (!jobTitle || !jobType || !location || !salary || !requirements || !desc) {
      return next("Please Provide All Required Fields");
    }

    if (!mongoose.Types.ObjectId.isValid(userId))
      return res.status(404).send(`No Company with id: ${userId}`);

    const job = await Jobs.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job Not Found' });
    }

    // Ensure the user is authorized to update this job
    if (job.company.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Not Authorized' });
    }

    const jobPost = {
      jobTitle,
      jobType,
      location,
      salary,
      vacancies,
      experience,
      detail: { desc, requirements },
    };

    const updatedJob = await Jobs.findByIdAndUpdate(jobId, jobPost, { new: true });

    res.status(200).json({
      success: true,
      message: "Job Post Updated Successfully",
      job: updatedJob,
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
        select: 'companyName' 
      });
      
      console.log('Jobs fetched from backend:', jobs); 
  
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
      console.error('Error fetching jobs:', error); 
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

    // Validate job ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid job ID' });
    }

    // Find and delete the job post
    const job = await Jobs.findById(id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job Post Not Found' });
    }
    await Jobs.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Job Post Deleted Successfully.',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get jobs for a specific company
export const getCompanyJobs = async (req, res) => {
  try {
    const { companyId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({ success: false, message: 'Invalid company ID' });
    }

    // Pagination parameters
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const jobs = await Jobs.find({ company: companyId })
      .populate('company', 'companyName') // Optionally populate company details
      .skip(skip)
      .limit(parseInt(limit))
      .exec();

    const total = await Jobs.countDocuments({ company: companyId });

    res.status(200).json({
      success: true,
      data: jobs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching company jobs:', error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
};

