import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Jobs', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  resume: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  coverLetter: { type: String, required: true },
  status: {
    type: String,
    enum: ['applied', 'under review', 'accepted', 'rejected'],
    default: 'applied'
  },
  dateApplied: { type: Date, default: Date.now },
}, { timestamps: true });

const Applications = mongoose.model('Applications', applicationSchema);

export default Applications;
