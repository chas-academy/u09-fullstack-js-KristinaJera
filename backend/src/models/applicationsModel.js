import mongoose, { Schema } from "mongoose";

const applicationSchema = new Schema({
    jobId: { type: Schema.Types.ObjectId, ref: "Jobs", required: true },
    applicantId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    coverLetter: { type: String },
    resume: { type: String }, // Could store a URL or file path to the resume
    status: {
        type: String,
        enum: ["applied", "under review", "accepted", "rejected"],
        default: "applied"
    },
    dateApplied: { type: Date, default: Date.now }
});

const Applications = mongoose.model("Applications", applicationSchema);

export default Applications;
