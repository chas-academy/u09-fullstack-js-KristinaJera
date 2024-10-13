import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'company', 'admin'],
    required: true,
  },
  status: {
    type: String,
    enum: ['unread', 'read'],
    default: 'unread',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Messages = mongoose.model("Messages", messageSchema);

export default Messages;