import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const LoginPage = ({ onClose, onLoginSuccess }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract loginType from the URL and fall back to 'user'
  const currentPath = location.pathname;
  const initialLoginType = 
    currentPath === '/login-company' ? 'company' :
    currentPath === '/login-admin' ? 'admin' :
    'user';

  const [loginType, setLoginType] = useState(initialLoginType);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Update loginType based on URL path change
  useEffect(() => {
    setLoginType(initialLoginType); // Update the state when the URL changes
  }, [initialLoginType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      let url = '';

      // Determine the URL based on the login type
      switch (loginType) {
        case 'admin':
          url = 'https://u09-fullstack-js-kristinajera.onrender.com/api-v1/auth/admin/login';
          break;
        case 'company':
          url = 'https://u09-fullstack-js-kristinajera.onrender.com/api-v1/auth/companies/login';
          break;
        case 'user':
          url = 'https://u09-fullstack-js-kristinajera.onrender.com/api-v1/auth/user/login';
          break;
        default:
          throw new Error('Invalid login type');
      }

      console.log(`Sending request to ${url} with email ${email}`);

      // Make the API request
      const response = await axios.post(url, { email, password });
      const data = response.data;

      console.log("Login successful, response data:", data);

      // Handle login success
      let userData;

      switch (loginType) {
        case 'company':
          userData = data.company;
          break;
        case 'user':
          userData = data.user;
          break;
        case 'admin':
          userData = data.admin;
          break;
        default:
          throw new Error('Invalid login type');
      }

      if (!userData) {
        throw new Error("Unknown account type or missing user data.");
      }

      // Log user data and role
      console.log(`Logged in as: ${loginType}`);
      console.log("User Data:", userData);

      localStorage.setItem('authToken', data.token); // Store the token
      localStorage.setItem('userId', userData._id); // Store the user ID

      onLoginSuccess(userData);

      // Navigate based on account type
      switch (userData.role) {
        case 'company':
          navigate('/company-homepage');
          break;
        case 'user':
          navigate('/user-homepage');
          break;
        case 'admin':
          navigate('/admin-dashboard');
          break;
        default:
          console.log("Unknown account type or missing role field.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  // Update the loginType both in the state and in the URL when buttons are clicked
  const toggleLoginType = (type) => {
    setLoginType(type);

    // Update the URL when the login type is changed by button click
    switch (type) {
      case 'company':
        navigate('/login-company');
        break;
      case 'admin':
        navigate('/login-admin');
        break;
      case 'user':
      default:
        navigate('/login');
        break;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto relative mt-16">
      <button onClick={onClose} className="absolute top-2 right-8 text-gray-500 hover:text-gray-700">
        &times;
      </button>
      <h2 className="text-2xl font-bold mb-3">
        {loginType === 'company' ? 'Company Login' : loginType === 'user' ? 'Job Seeker Login' : 'Admin Login'}
      </h2>

      {/* Toggle between Job Seeker, Company, and Admin */}
      <div className="flex justify-center mb-2">
        <button
          onClick={() => toggleLoginType('user')}
          className={`px-4 py-2 mr-2 rounded ${loginType === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
        >
          Job Seeker
        </button>
        <button
          onClick={() => toggleLoginType('company')}
          className={`px-4 py-2 mr-2 rounded ${loginType === 'company' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
        >
          Company
        </button>
        <button
          onClick={() => toggleLoginType('admin')}
          className={`px-4 py-2 rounded ${loginType === 'admin' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
        >
          Admin
        </button>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 p-2 w-full border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 p-2 w-full border rounded"
            required
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded w-full"
        >
          {loginType === 'company' ? 'Company Login' : loginType === 'user' ? 'Job Seeker Login' : 'Admin Login'}
        </button>
      </form>
    </div>
  );
};

LoginPage.propTypes = {
  onClose: PropTypes.func.isRequired,
  onLoginSuccess: PropTypes.func.isRequired,
};

export default LoginPage;
