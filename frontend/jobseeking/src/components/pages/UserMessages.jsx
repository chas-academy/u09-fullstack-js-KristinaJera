import { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';  
Modal.setAppElement('#root'); 

const UserMessages = () => {
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null); 
    const [replyText, setReplyText] = useState('');  // State for the reply text
    const [errorMessage, setErrorMessage] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false); // Modal state

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get('http://localhost:3000/api/user/messages', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                console.log('Fetched messages:', response.data.messages); // Log fetched messages
                setMessages(response.data.messages || []);
            } catch (error) {
                console.error('Error fetching messages:', error.response ? error.response.data : error.message);
                setErrorMessage('Failed to fetch messages.');
            }
        };
        fetchMessages();
    }, []);

    const openModal = (message) => {
        setSelectedMessage(message);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedMessage(null);
        setReplyText('');
    };

    const handleReply = async () => {
        try {
            const token = localStorage.getItem('authToken');

            if (!replyText) {
                setErrorMessage('Reply cannot be empty');
                return;
            }

            console.log('Sending reply:', replyText);
            console.log('Selected message ID:', selectedMessage._id);

            const response = await axios.post(
                `http://localhost:3000/api/user/messages/${selectedMessage._id}/reply`,
                { reply: replyText, sender: 'user' },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log('Response from server:', response.data);

            // Update local state with the new conversation
            const updatedMessage = {
                ...selectedMessage,
                conversation: [...selectedMessage.conversation, { sender: 'user', message: replyText }],
            };

            setMessages(messages.map(msg => msg._id === selectedMessage._id ? updatedMessage : msg));
            closeModal();
        } catch (error) {
            console.error('Error sending reply:', error.response ? error.response.data : error.message);
            setErrorMessage('Failed to send reply.');
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Your Messages</h2>

            {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">Message</th>
                            <th className="px-4 py-2">Status</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {messages.map((message) => (
                            <tr key={message._id} className={message.status === 'unread' ? 'bg-gray-100' : ''}>
                                <td className="border px-4 py-2">{message.email}</td>
                                <td className="border px-4 py-2">{message.message}</td>
                                <td className="border px-4 py-2">{message.status}</td>
                                <td className="border px-4 py-2">
                                    <button
                                        className="text-blue-500 hover:text-blue-700 mr-4"
                                        onClick={() => openModal(message)}
                                    >
                                        View / Reply
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal for viewing and responding to messages */}
            {selectedMessage && (
                <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
                    <h2 className="text-2xl font-bold mb-4">Message Details</h2>
                    <p><strong>Email:</strong> {selectedMessage.email}</p>
                    <p><strong>Message:</strong> {selectedMessage.message}</p>

                    {/* Conversation History */}
                    <h3 className="text-xl font-semibold mt-4">Conversation</h3>
                    <div className="conversation">
                        {selectedMessage.conversation && selectedMessage.conversation.map((msg, index) => (
                            <div key={index} className={`message ${msg.sender === 'user' ? 'bg-blue-100' : 'bg-gray-200'} p-2 my-2 rounded`}>
                                <p><strong>{msg.sender}:</strong> {msg.message}</p>
                            </div>
                        ))}
                    </div>

                    {/* Reply Input */}
                    <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)} 
                        placeholder="Type your response..."
                        className="w-full p-2 border rounded mt-4"
                    ></textarea>

                    <div className="mt-4">
                        <button className="bg-blue-500 text-white p-2 rounded" onClick={handleReply}>Send Reply</button>
                        <button className="bg-gray-500 text-white p-2 rounded ml-4" onClick={closeModal}>Close</button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default UserMessages;
