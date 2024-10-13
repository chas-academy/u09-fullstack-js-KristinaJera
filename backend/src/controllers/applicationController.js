import Applications from "../models/applicationsModel.js";
import Jobs from "../models/jobsModel.js";
import Users from "../models/userModel.js";
import mongoose from "mongoose";

export const updateApplicationStatus = async (req, res) => {
  const { applicationId } = req.params;
  const { status } = req.body;

  try {
    const application = await Applications.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    );

    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }
    res.status(200).json({ success: true, data: application });
  } catch (error) {
    console.error("Error updating application status:", error); // Log any errors
    res
      .status(500)
      .json({ success: false, message: "Error updating application status" });
  }
};

export const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.body.userId;

    const existingApplication = await Applications.findOne({
      job: jobId,
      user: userId,
    });

    if (existingApplication) {
      return res
        .status(400)
        .json({
          success: false,
          message: "You have already applied for this job.",
        });
    }

    const newApplication = new Applications({
      job: jobId,
      user: userId,
      resume: req.file.path,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      coverLetter: req.body.coverLetter,
    });

    await newApplication.save();
    res
      .status(200)
      .json({ success: true, message: "Application submitted successfully." });
  } catch (error) {
    console.error("Error applying for job:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const checkIfUserHasApplied = async (req, res) => {
  try {
    const { jobId, userId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(jobId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid jobId or userId" });
    }

    const application = await Applications.findOne({
      job: jobId,
      user: userId,
    });

    if (application) {
      // User has applied for the job
      return res.json({ success: true, hasApplied: true });
    } else {
      // User has not applied for the job
      return res.json({ success: true, hasApplied: false });
    }
  } catch (error) {
    console.error("Error checking application:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getCompanyApplications = async (req, res) => {
  try {
    const { companyId } = req.params;

    const jobs = await Jobs.find({ company: companyId }).select("_id");

    if (!jobs.length) {
      return res
        .status(404)
        .json({ success: false, message: "No jobs found for this company." });
    }

    const jobIds = jobs.map((job) => job._id);
    const applications = await Applications.find({ job: { $in: jobIds } })
      .populate("user", "name email phone")
      .populate("job", "jobTitle");

    return res.status(200).json({ success: true, data: applications });
  } catch (error) {
    console.error("Error fetching company applications:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getUserApplications = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID" });
    }

    const applications = await Applications.find({ user: userId })
      .populate(
        "job",
        "jobTitle jobType location salary vacancies experience company"
      )
      .populate("user", "name email phone")
      .exec();

    if (!applications.length) {
      return res
        .status(404)
        .json({ success: false, message: "No applications found" });
    }

    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    console.error("Error fetching user applications:", error.message);
    res
      .status(500)
      .json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid application ID" });
    }

    const application = await Applications.findById(applicationId);
    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }
    await Applications.findByIdAndDelete(applicationId);
    res
      .status(200)
      .json({ success: true, message: "Application removed successfully" });
  } catch (error) {
    console.error("Error deleting application:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
  }
};
