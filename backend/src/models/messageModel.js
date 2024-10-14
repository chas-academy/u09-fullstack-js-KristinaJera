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
userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Users', 
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
  conversation: [{
    sender: {
      type: String,
      enum: ['user', 'company', 'admin'], // Define who can send messages
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now, // Timestamp for each message in the conversation
    },
  }],
});

// Create the Messages model
const Messages = mongoose.model("Messages", messageSchema);

export default Messages;
