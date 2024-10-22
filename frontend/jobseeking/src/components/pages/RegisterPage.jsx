import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const RegisterPage = ({ onClose }) => {
  const [registerType, setRegisterType] = useState('user');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    contact: '',
    location: '',
    profileUrl: '',
    jobTitle: '',
    about: '',
    name: '',
    companyName: '',
    companyCode: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const toggleRegisterType = (type) => setRegisterType(type);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      firstName,
      lastName,
      email,
      password,
      contact,
      location,
      profileUrl,
      jobTitle,
      about,
      name,
      companyName,
      companyCode
    } = formData;

    try {
      let endpoint = '';
      let data = {};

      if (registerType === 'user') {
        endpoint = 'https://u09-fullstack-js-kristinajera.onrender.com/api-v1/auth/register'; // User registration
        data = {
          firstName,
          lastName,
          email,
          password,
          contact,
          location,
          profileUrl,
          jobTitle,
          about
        };
      } else {
        endpoint = 'https://u09-fullstack-js-kristinajera.onrender.com/api-v1/auth/register-company'; // Company registration
        data = {
          name,
          email,
          password,
          companyName,
          companyCode
        };
      }

      const response = await axios.post(endpoint, data);
      setSuccess(response.data.message);
      setError('');

      // Navigate to the appropriate login page
      if (registerType === 'user') {
        navigate('/login');
      } else {
        navigate('/login-company');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'An error occurred');
      setSuccess('');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto relative my-10">
      <button onClick={onClose} className="absolute top-2 right-8 text-gray-500 hover:text-gray-700">
        &times;
      </button>
      <h2 className="text-2xl font-bold mb-3">
        Register as {registerType === 'user' ? 'Job Seeker' : 'Company'}
      </h2>

      {/* Toggle between Job Seeker and Company */}
      <div className="flex justify-center mb-2">
        <button
          onClick={() => toggleRegisterType('user')}
          className={`px-4 py-2 mr-2 rounded ${registerType === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
        >
          Job Seeker
        </button>
        <button
          onClick={() => toggleRegisterType('company')}
          className={`px-4 py-2 rounded ${registerType === 'company' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
        >
          Company
        </button>
      </div>

      {/* Conditional Form Fields */}
      <form onSubmit={handleSubmit}>
      {registerType === 'user' && (
          <>
            <div className="mb-1">
              <label className="block text-gray-700">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded"
                required
              />
            </div>
            <div className="mb-1">
              <label className="block text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded"
                required
              />
            </div>
            <div className="mb-1">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded"
                required
              />
            </div>
            <div className="mb-1">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded"
                required
              />
            </div>
          </>
        )}

        {registerType === 'company' && (
          <>
            <div className="mb-1">
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded"
                required
              />
            </div>
            <div className="mb-1">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded"
                required
              />
            </div>
            <div className="mb-1">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded"
                required
              />
            </div>
            <div className="mb-1">
              <label className="block text-gray-700">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded"
                required
              />
            </div>
            <div className="mb-1">
              <label className="block text-gray-700">Company Code</label>
              <input
                type="text"
                name="companyCode"
                value={formData.companyCode}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded"
              />
            </div>
          </>
        )}

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded w-full"
        >
          Register as {registerType === 'user' ? 'Job Seeker' : 'Company'}
        </button>
      </form>
   </div>
  );
};

RegisterPage.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default RegisterPage;