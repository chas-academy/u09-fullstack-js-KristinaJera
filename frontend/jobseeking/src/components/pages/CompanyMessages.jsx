import { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { FaTrashAlt } from 'react-icons/fa';

Modal.setAppElement('#root');

const CompanyMessages = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [confirmDeleteModalIsOpen, setConfirmDeleteModalIsOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('https://u09-fullstack-js-kristinajera.onrender.com/api/company/messages', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setMessages(response.data.messages || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setErrorMessage('Failed to fetch messages.');
      }
    };
    fetchMessages();
  }, []);

  const openModal = (message) => {
    markAsRead(message._id);
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
        `https://u09-fullstack-js-kristinajera.onrender.com/api/company/messages/${selectedMessage._id}/reply`,
        { reply: replyText, sender: 'company' },
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
        conversation: [...selectedMessage.conversation, { sender: 'company', message: replyText }],
      };

      setSelectedMessage(updatedMessage);
      setMessages(messages.map(msg => msg._id === selectedMessage._id ? updatedMessage : msg));
      setReplyText('');
    } catch (error) {
      console.error('Error sending reply:', error);
      setErrorMessage('Failed to send reply.');
    }
  };

  const deleteMessage = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`https://u09-fullstack-js-kristinajera.onrender.com/api/company/messages/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log('Message deleted successfully, closing modal...');

      setMessages(messages.filter(msg => msg._id !== id));
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
      await axios.put(`https://u09-fullstack-js-kristinajera.onrender.com/api/company/messages/${id}/read`, null, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === id ? { ...msg, status: 'read' } : msg
        )
      );
    } catch (error) {
      console.error('Error marking message as read:', error);
      setErrorMessage('Failed to mark message as read.');
    }
  };

  const markAsUnread = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`https://u09-fullstack-js-kristinajera.onrender.com/api/company/messages/${id}/unread`, null, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setMessages(messages.map(msg => msg._id === id ? { ...msg, status: 'unread' } : msg));
    } catch (error) {
      console.error('Error marking message as unread:', error);
      setErrorMessage('Failed to mark message as unread.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Company Messages</h2>

      {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}

      <div className="message-list">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`message-preview p-4 mb-2 border rounded cursor-pointer transition-transform hover:scale-105 ${message.status === 'unread' ? 'bg-gray-100' : 'bg-white'}`}
            onClick={() => openModal(message)}
          >
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">{message.name}</div>
                <div className="text-gray-700">{message.message.slice(0, 50)}...</div>
              </div>
              <div className="flex items-center">
                <button
                  className="text-blue-500 hover:text-blue-700 mr-4"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent modal opening
                    message.status === 'unread' ? markAsRead(message._id) : markAsUnread(message._id);
                  }}
                >
                  {message.status === 'unread' ? 'Mark as Read' : 'Mark as Unread'}
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    openConfirmDeleteModal(message._id);
                  }}
                >
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for viewing and responding to messages */}
      {selectedMessage && (
        <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="w-4/5 lg:w-4/6 mx-auto mt-24">
          <div className="bg-white rounded-lg shadow-md py-5 px-4" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <h2 className="text-xl font-bold mb-4 text-center">Message Details</h2>
            <div className="mb-4">
              <strong>Name:</strong> <span className="text-gray-700">{selectedMessage.name}</span><br />
              <strong>Email:</strong> <span className="text-gray-700">{selectedMessage.email}</span><br />
              <strong>Message:</strong>
              <p className="text-gray-700 bg-gray-100">{selectedMessage.message}</p>
            </div>

            {/* Conversation History */}
            <div className="conversation mb-4">
              <h3 className="text-lg font-semibold mb-2">Conversation</h3>
              {selectedMessage.conversation.map((msg, index) => (
                <div key={index} className={`message mb-2 p-2 rounded ${msg.sender === 'company' ? 'bg-blue-200 text-right' : 'bg-gray-200 text-left'}`}>
                  <strong>{msg.sender}:</strong>
                  <span>{msg.message}</span>
                </div>
              ))}

              {/* Textarea for Reply */}
              <textarea
                className="border rounded w-full mt-4 resize-none"
                rows="3"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply..."
              />
              {errorMessage && <p className="text-red-600 mt-2">{errorMessage}</p>}
            </div>

            <div className="flex justify-end mt-4">
              <button className="bg-blue-500 text-white rounded px-4 py-2 mr-2" onClick={handleReply}>Send Reply</button>
              <button className="bg-gray-300 text-black rounded px-4 py-2" onClick={closeModal}>Close</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Confirmation Modal for Deleting Messages */}
      <Modal isOpen={confirmDeleteModalIsOpen} onRequestClose={closeConfirmDeleteModal} className="bg-white mt-28 p-5 w-4/5 lg:w-2/5 mx-auto">
        <div className='bg-white p-3'>
          <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
          <p>Are you sure you want to delete this message?</p>
          <div className="mt-4">
            <button
              className="bg-red-500 text-white rounded px-4 py-2 mr-2"
              onClick={() => {
                deleteMessage(messageToDelete);
              }}
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
        </div>
      </Modal>
    </div>
  );
};

export default CompanyMessages;

