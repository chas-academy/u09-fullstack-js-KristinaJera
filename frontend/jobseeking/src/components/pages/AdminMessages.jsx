import { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false); // Modal state for message details
  const [confirmDeleteModalIsOpen, setConfirmDeleteModalIsOpen] = useState(false); // Confirmation modal state
  const [messageToDelete, setMessageToDelete] = useState(null); // State to hold the message ID to delete

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://localhost:3000/api/admin/messages', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setMessages(response.data.messages || []);
        setFilteredMessages(response.data.messages || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setErrorMessage('Failed to fetch messages.');
      }
    };
    fetchMessages();
  }, []);

  const handleFilterChange = (e) => {
    const selectedFilter = e.target.value;
    setFilter(selectedFilter);

    if (selectedFilter === 'all') {
      setFilteredMessages(messages);
    } else {
      setFilteredMessages(messages.filter(msg => msg.role === selectedFilter));
    }
  };

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

      const response = await axios.post(
        `http://localhost:3000/api/admin/messages/${selectedMessage._id}/reply`,
        { reply: replyText, sender: 'admin' },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Response from server:', response.data);
  
      const updatedMessage = {
        ...selectedMessage,
        conversation: [...selectedMessage.conversation, { sender: 'admin', message: replyText }],
      };

      setMessages(messages.map(msg => msg._id === selectedMessage._id ? updatedMessage : msg));
      setFilteredMessages(filteredMessages.map(msg => msg._id === selectedMessage._id ? updatedMessage : msg));
      closeModal();
    } catch (error) {
      console.error('Error sending reply:', error.response ? error.response.data : error.message);
      setErrorMessage('Failed to send reply.');
    }
  };

  const deleteMessage = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`http://localhost:3000/api/admin/messages/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setMessages(messages.filter(msg => msg._id !== id));
      setFilteredMessages(filteredMessages.filter(msg => msg._id !== id));
      closeConfirmDeleteModal(); // Close confirmation modal after deletion
    } catch (error) {
      console.error('Error deleting message:', error);
      setErrorMessage('Failed to delete message.');
    }
  };

  const openConfirmDeleteModal = (id) => {
    setMessageToDelete(id);
    setConfirmDeleteModalIsOpen(true);
  };

  const closeConfirmDeleteModal = () => {
    setMessageToDelete(null);
    setConfirmDeleteModalIsOpen(false);
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`http://localhost:3000/api/admin/messages/${id}/read`, null, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setMessages(messages.map(msg => msg._id === id ? { ...msg, status: 'read' } : msg));
      setFilteredMessages(filteredMessages.map(msg => msg._id === id ? { ...msg, status: 'read' } : msg));
    } catch (error) {
      console.error('Error marking message as read:', error);
      setErrorMessage('Failed to mark message as read.');
    }
  };

  const markAsUnread = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`http://localhost:3000/api/admin/messages/${id}/unread`, null, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setMessages(messages.map(msg => msg._id === id ? { ...msg, status: 'unread' } : msg));
      setFilteredMessages(filteredMessages.map(msg => msg._id === id ? { ...msg, status: 'unread' } : msg));
    } catch (error) {
      console.error('Error marking message as unread:', error);
      setErrorMessage('Failed to mark message as unread.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Contact Messages</h2>

      <div className="mb-4">
        <label htmlFor="filter" className="mr-2">Filter by:</label>
        <select
          id="filter"
          value={filter}
          onChange={handleFilterChange}
          className="border rounded p-2"
        >
          <option value="all">All</option>
          <option value="user">User</option>
          <option value="company">Company</option>
        </select>
      </div>

      {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Message</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMessages.map((message) => (
              <tr key={message._id} className={message.status === 'unread' ? 'bg-gray-100' : ''}>
                <td className="border px-4 py-2">{message.email}</td>
                <td className="border px-4 py-2">{message.message}</td>
                <td className="border px-4 py-2">{message.role}</td>
                <td className="border px-4 py-2">{message.status}</td>
                <td className="border px-4 py-2">
                  <button
                    className="text-blue-500 hover:text-blue-700 mr-4"
                    onClick={() => openModal(message)}
                  >
                    View / Reply
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700 mr-4"
                    onClick={() => openConfirmDeleteModal(message._id)} // Open confirmation modal
                  >
                    Delete
                  </button>
                  {message.status === 'unread' ? (
                    <button
                      className="text-green-500 hover:text-green-700"
                      onClick={() => markAsRead(message._id)}
                    >
                      Mark as Read
                    </button>
                  ) : (
                    <button
                      className="text-yellow-500 hover:text-yellow-700"
                      onClick={() => markAsUnread(message._id)}
                    >
                      Mark as Unread
                    </button>
                  )}
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
          <p><strong>Role:</strong> {selectedMessage.role}</p>
          <p><strong>Message:</strong> {selectedMessage.message}</p>

          {/* Conversation History */}
          <h3 className="text-xl font-semibold mt-4">Conversation</h3>
          <div className="conversation">
            {selectedMessage.conversation && selectedMessage.conversation.map((msg, index) => (
                          <div key={index} className={`message ${msg.sender === 'admin' ? 'bg-blue-200' : 'bg-gray-200'} p-2 rounded mb-2`}>
                          <strong>{msg.sender}:</strong> {msg.message}
                        </div>
                      ))}
                    </div>
          
                    <textarea
                      className="border rounded p-2 w-full mt-4"
                      rows="4"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply..."
                    />
                    {errorMessage && <p className="text-red-600">{errorMessage}</p>}
                    <button
                      className="bg-blue-500 text-white rounded px-4 py-2 mt-2"
                      onClick={handleReply}
                    >
                      Send Reply
                    </button>
                    <button
                      className="bg-gray-300 text-black rounded px-4 py-2 mt-2 ml-2"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                  </Modal>
                )}
          
                {/* Confirmation Modal for Deleting Messages */}
                <Modal isOpen={confirmDeleteModalIsOpen} onRequestClose={closeConfirmDeleteModal}>
                  <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
                  <p>Are you sure you want to delete this message?</p>
                  <div className="mt-4">
                    <button
                      className="bg-red-500 text-white rounded px-4 py-2 mr-2"
                      onClick={() => deleteMessage(messageToDelete)}
                    >
                      Yes, Delete
                    </button>
                    <button
                      className="bg-gray-300 text-black rounded px-4 py-2"
                      onClick={closeConfirmDeleteModal}
                    >
                      Cancel
                    </button>
                  </div>
                </Modal>
              </div>
            );
          };
          
          export default AdminMessages;
          