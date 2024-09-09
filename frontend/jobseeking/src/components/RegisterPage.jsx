import { useState } from 'react';
import PropTypes from 'prop-types';

export const RegisterPage = ({ onClose }) => {
  const [registerType, setRegisterType] = useState('seeker'); // 'seeker' or 'company'

  const toggleRegisterType = (type) => setRegisterType(type);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto relative">
      <button onClick={onClose} className="absolute top-2 right-8 text-gray-500 hover:text-gray-700">
        &times;
      </button>
      <h2 className="text-2xl font-bold mb-3">
        Register as {registerType === 'seeker' ? 'Job Seeker' : 'Company'}
      </h2>

      {/* Toggle between Job Seeker and Company */}
      <div className="flex justify-center mb-2">
        <button
          onClick={() => toggleRegisterType('seeker')}
          className={`px-4 py-2 mr-2 rounded ${
            registerType === 'seeker' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'
          }`}
        >
          Job Seeker
        </button>
        <button
          onClick={() => toggleRegisterType('company')}
          className={`px-4 py-2 rounded ${
            registerType === 'company' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'
          }`}
        >
          Company
        </button>
      </div>

      {/* Common Form Fields */}
      <form>
        <div className="mb-1">
          <label className="block text-gray-700">Name</label>
          <input type="text" className="mt-1 p-2 w-full border rounded" />
        </div>
        <div className="mb-1">
          <label className="block text-gray-700">Email</label>
          <input type="email" className="mt-1 p-2 w-full border rounded" />
        </div>
        <div className="mb-1">
          <label className="block text-gray-700">Password</label>
          <input type="password" className="mt-1 p-2 w-full border rounded" />
        </div>

        {/* Conditional Fields for Company Registration */}
        {registerType === 'company' && (
          <>
            <div className="mb-1">
              <label className="block text-gray-700">Company Name</label>
              <input type="text" className="mt-1 p-2 w-full border rounded" />
            </div>
            <div className="mb-1">
              <label className="block text-gray-700">Company Code</label>
              <input type="text" className="mt-1 p-2 w-full border rounded" />
            </div>
          </>
        )}

        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded w-full">
          Register as {registerType === 'seeker' ? 'Job Seeker' : 'Company'}
        </button>
      </form>
    </div>
  );
};

RegisterPage.propTypes = {
  onClose: PropTypes.func.isRequired,
};
