
import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ onClose, onLoginSuccess }) => {
  const [loginType, setLoginType] = useState('user'); // Default to 'user'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      let url = '';

      // Determine the URL based on the login type
      switch (loginType) {
        case 'admin':
          url = 'http://localhost:3000/api-v1/auth/admin/login';
          break;
        case 'company':
          url = 'http://localhost:3000/api-v1/auth/companies/login';
          break;
        case 'user':
          url = 'http://localhost:3000/api-v1/auth/user/login';
          break;
        default:
          throw new Error('Invalid login type');
      }

      console.log(`Sending request to ${url} with email ${email}`);

      // Make the API request
      const response = await axios.post(url, { email, password });
      const data = response.data;

      console.log("Login successful, user data:", data);

      // Handle login success
      const userData = loginType === 'company' ? data.company : data.user;
      if (!userData || !userData.accountType) {
        console.log("Unknown account type or missing accountType field.");
        return;
      }

      onLoginSuccess(userData);

      // Navigate based on account type
      if (userData.accountType === 'company') {
        navigate('/company-homepage');
      } else if (userData.accountType === 'seeker') {
        navigate('/user-homepage');
      } else if (userData.accountType === 'admin') {
        navigate('/admin-dashboard');
      } else {
        console.log("Unknown account type or missing accountType field.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  const toggleLoginType = (type) => setLoginType(type);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto relative">
      <button onClick={onClose} className="absolute top-2 right-8 text-gray-500 hover:text-gray-700">
        &times;
      </button>
      <h2 className="text-2xl font-bold mb-3">
        {loginType === 'company' ? 'Company Login' : loginType === 'admin' ? 'Admin Login' : 'Job Seeker Login'}
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
          {loginType === 'company' ? 'Login as Company' : loginType === 'admin' ? 'Login as Admin' : 'Login as Job Seeker'}
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
