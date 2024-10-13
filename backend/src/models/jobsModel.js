import mongoose, { Schema } from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Companies" },
    jobTitle: {
      type: String,
      required: [true, "Job Title is required"],
    },
    jobType: {
      type: String,
      required: [true, "Job Type is required"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    salary: {
      type: Number,
      required: [true, "Salary is required"],
    },
    vacancies: {
      type: Number,
    },
    experiences: {
      type: Number,
      default: 0,
    },
    detail: [
      {
        desc: { type: String },
        requirements: { type: String },
      },
    ],
    applications: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Applications" },
    ],
  },
  { timestamps: true }
);

const Jobs = mongoose.model("Jobs", jobSchema);

export default Jobs;
