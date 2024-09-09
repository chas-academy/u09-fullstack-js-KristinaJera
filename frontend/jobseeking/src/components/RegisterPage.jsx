// import React from 'react';
import PropTypes from 'prop-types';

export const RegisterPage = ({ onClose }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
      <button onClick={onClose} className="absolute top-2 right-8 text-gray-500 hover:text-gray-700">
        &times;
      </button>
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form>
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input type="text" className="mt-1 p-2 w-full border rounded" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input type="email" className="mt-1 p-2 w-full border rounded" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input type="password" className="mt-1 p-2 w-full border rounded" />
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Register</button>
      </form>
    </div>
  );
};

RegisterPage.propTypes = {
  onClose: PropTypes.func.isRequired,
};
