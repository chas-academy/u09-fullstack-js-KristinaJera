import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [filter, setFilter] = useState('all');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch messages on component mount
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://localhost:3000/api/admin/messages', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log('Response:', response.data); // Log the response data
        setMessages(response.data.messages || []); // Set messages directly
        setFilteredMessages(response.data.messages || []); // Set filtered messages initially
      } catch (error) {
        console.error('Error fetching messages:', error); // Log error details
        setErrorMessage('Failed to fetch messages.');
      }
    };

    fetchMessages();
  }, []);

  // Filter messages based on user type (user or company)
  const handleFilterChange = (e) => {
    const selectedFilter = e.target.value;
    setFilter(selectedFilter);

    if (selectedFilter === 'all') {
      setFilteredMessages(messages);
    } else {
      setFilteredMessages(messages.filter(msg => msg.role === selectedFilter));
    }
  };

  // Delete a message
  const deleteMessage = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`http://localhost:3000/api/admin/messages/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      // Update local state after deletion
      setMessages(messages.filter(msg => msg._id !== id));
      setFilteredMessages(filteredMessages.filter(msg => msg._id !== id));
    } catch (error) {
      console.error('Error deleting message:', error);
      setErrorMessage('Failed to delete message.');
    }
  };

  // Mark a message as read
  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`http://localhost:3000/api/admin/messages/${id}/read`, null, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      // Update local state after marking as read
      setMessages(messages.map(msg => msg._id === id ? { ...msg, status: 'read' } : msg));
      setFilteredMessages(filteredMessages.map(msg => msg._id === id ? { ...msg, status: 'read' } : msg));
    } catch (error) {
      console.error('Error marking message as read:', error);
      setErrorMessage('Failed to mark message as read.');
    }
  };

  // Mark a message as unread
  const markAsUnread = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`http://localhost:3000/api/admin/messages/${id}/unread`, null, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      // Update local state after marking as unread
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

      {/* Filter */}
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

      {/* Error Message */}
      {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}

      {/* Messages Table */}
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
              <tr key={message._id}>
                <td className="border px-4 py-2">{message.email}</td>
                <td className="border px-4 py-2">{message.message}</td>
                <td className="border px-4 py-2">{message.role}</td> {/* Displaying the role */}
                <td className="border px-4 py-2">{message.status}</td>
                <td className="border px-4 py-2">
                  {/* Delete button */}
                  <button
                    className="text-red-500 hover:text-red-700 mr-4"
                    onClick={() => deleteMessage(message._id)}
                  >
                    Delete
                  </button>
                  {/* Mark as read/unread button */}
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
    </div>
  );
};

export default AdminMessages;
