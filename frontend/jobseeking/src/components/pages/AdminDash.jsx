// import React from 'react';
import { Link } from 'react-router-dom'; // Ensure you are using react-router-dom for navigation

const AdminDash = () => {
  return (
    <div className="p-6 space-y-12">
      
      {/* Welcome Section */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-12 rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to the Admin Dashboard!</h1>
          <p className="text-lg mb-6">
            Manage users, companies, and settings effectively with quick access to all admin functionalities.
          </p>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="py-12 bg-gray-100 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-gray-700 mb-6 text-center">Admin Actions</h2>
        <p className="text-gray-600 text-center mb-8">
          Take action on users, companies, and reports with the links below.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="relative bg-white p-6 shadow-md rounded-lg transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl font-bold mb-4">All Users</h3>
            <p className="text-gray-600 mb-6">View and manage all registered users.</p>
            <Link to="/users-page">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
                Go to Users
              </button>
            </Link>
          </div>
          
          <div className="relative bg-white p-6 shadow-md rounded-lg transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl font-bold mb-4">All Companies</h3>
            <p className="text-gray-600 mb-6">View and manage all registered companies.</p>
            <Link to="/companies-page">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
                Go to Companies
              </button>
            </Link>
          </div>
          
          <div className="relative bg-white p-6 shadow-md rounded-lg transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl font-bold mb-4">Admin Reports</h3>
            <p className="text-gray-600 mb-6">Access various reports related to users and companies.</p>
            <Link to="/admin-reports">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
                View Reports
              </button>
            </Link>
          </div>
        </div>
      </section>
      
    </div>
  );
};
export default AdminDash