import Messages from '../models/messageModel.js';

// View all messages (Admin-only)
export const getAllMessages = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query; // Default page and limit

        // Fetch messages with pagination
        const messages = await Messages.find()
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const totalMessages = await Messages.countDocuments(); // Total message count for pagination

        res.json({ messages, totalPages: Math.ceil(totalMessages / limit) });
    } catch (error) {
        console.error('Error retrieving messages:', error); // Log the error for debugging
        res.status(500).json({ error: 'Failed to retrieve messages' });
    }
};

// Mark a message as "read" (Admin-only)
export const markAsRead = async (req, res) => {
    try {
        const message = await Messages.findById(req.params.id);
        if (!message) return res.status(404).json({ error: 'Message not found' });

        message.status = 'read';
        await message.save();
        res.json({ message: 'Message marked as read' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update message status' });
    }
};

// Delete a message (Admin-only)
export const deleteMessage = async (req, res) => {
    try {
        const message = await Messages.findByIdAndDelete(req.params.id);
        if (!message) return res.status(404).json({ error: 'Message not found' });

        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete message' });
    }
};

// Mark a message as "unread" (Admin-only)
export const markAsUnread = async (req, res) => {
    try {
        const message = await Messages.findById(req.params.id);
        if (!message) return res.status(404).json({ error: 'Message not found' });

        message.status = 'unread';
        await message.save();
        res.json({ message: 'Message marked as unread' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update message status' });
    }
};


export const submitMessage = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Extract userId and role from the decoded JWT user
        const userId = req.user.userId; // Ensure this is correctly set in your userAuth middleware
        const role = req.user.role;

        const newMessage = new Messages({
            name,
            email,
            message,
            userId, // Add the userId here
            role,
        });

        await newMessage.save();
        return res.status(201).json({ success: true, message: 'Message saved successfully!' });
    } catch (error) {
        console.error('Error saving message:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const replyToMessage = async (req, res) => {
    try {
        const { reply } = req.body; // Get the reply text from the request body
        const messageId = req.params.id; // Get the message ID from the request parameters

        // Validate reply text
        if (!reply) {
            return res.status(400).json({ error: 'Reply text is required' });
        }

        // Find the original message by ID
        const message = await Messages.findById(messageId);

        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        // Create a new reply object
        const replyObject = {
            sender: req.user.role, // The sender's role (user, company, admin)
            message: reply,
            timestamp: new Date(),
        };

        // Push the reply to the conversation array
        message.conversation.push(replyObject);

        // Save the updated message
        await message.save();

        res.status(200).json({ success: true, message: 'Reply sent successfully.' });
    } catch (error) {
        console.error('Error sending reply:', error);
        res.status(500).json({ error: 'Failed to send reply.' });
    }
};

// Get company messages
export const getCompanyMessages = async (req, res) => {
    try {
        const companyId = req.user.userId; // Extract company ID from req.user
        console.log('Fetching messages for company ID:', companyId);

        // Fetch messages where the company ID matches the authenticated user
        const messages = await Messages.find({ userId: companyId }).populate('conversation.sender');
        console.log('Fetched messages:', messages);

        res.json({ messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages.' });
    }
};

// Reply to a specific message
export const replyToCompanyMessage = async (req, res) => {
    const { reply } = req.body; // Get the reply text from the request body
    const messageId = req.params.id; // Get the message ID from the request parameters

    // Check for required fields
    if (!reply) {
        return res.status(400).json({ error: 'Reply text is required' });
    }

    try {
        const message = await Messages.findById(messageId);
        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        // Create a new reply object
        const replyObject = {
            sender: 'company', // The sender is the company
            message: reply,
            timestamp: new Date(),
        };

        // Append the reply to the conversation array
        message.conversation.push(replyObject);
        await message.save();

        res.status(200).json({ success: true, message: 'Reply sent successfully.' });
    } catch (error) {
        console.error('Error sending reply:', error);
        res.status(500).json({ error: 'Failed to send reply.' });
    }
};