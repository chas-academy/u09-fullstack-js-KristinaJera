// import React from 'react';
import { Link } from 'react-router-dom'; // Ensure you are using react-router-dom for navigation

const CompanyDashboard = () => {
  return (
    <div className="p-6 space-y-12">
      
      {/* Welcome Section */}
      <section className="bg-gradient-to-r from-teal-500 to-green-600 text-white py-12 rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome, Jobseekiing App!</h1>
          <p className="text-lg mb-6">
            Ready to connect with top talent? Manage your job listings, view applications, and update your company profile below.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/create-job">
              <button className="bg-white text-teal-600 px-6 py-3 rounded-lg font-semibold hover:bg-teal-100 transition duration-300">
                Post a Job
              </button>
            </Link>
            <Link to="/company-applications">
              <button className="bg-white text-teal-600 px-6 py-3 rounded-lg font-semibold hover:bg-teal-100 transition duration-300">
                View Applications
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="py-12 bg-gray-100 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-gray-700 mb-6 text-center">Quick Actions</h2>
        <p className="text-gray-600 text-center mb-8">
          Get things done faster with these one-click actions. Manage job listings, applications, and company details in just a few steps.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="relative bg-white p-6 shadow-md rounded-lg transform hover:scale-105 transition-transform duration-300">
            <div className="absolute inset-x-0 top-0 h-1 bg-teal-500"></div>
            <h3 className="text-2xl font-bold mb-4">Post a New Job</h3>
            <p className="text-gray-600 mb-6">Start your search for new talent by posting a job.</p>
            <Link to="/create-job">
              <button className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition duration-300">
                Create Job
              </button>
            </Link>
          </div>
          
          <div className="relative bg-white p-6 shadow-md rounded-lg transform hover:scale-105 transition-transform duration-300">
            <div className="absolute inset-x-0 top-0 h-1 bg-teal-500"></div>
            <h3 className="text-2xl font-bold mb-4">View Posted Jobs</h3>
            <p className="text-gray-600 mb-6">Review or update the positions your company has listed.</p>
            <Link to="/company-listed-jobs">
              <button className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition duration-300">
                Manage Jobs
              </button>
            </Link>
          </div>
          
          <div className="relative bg-white p-6 shadow-md rounded-lg transform hover:scale-105 transition-transform duration-300">
            <div className="absolute inset-x-0 top-0 h-1 bg-teal-500"></div>
            <h3 className="text-2xl font-bold mb-4">View Applications</h3>
            <p className="text-gray-600 mb-6">See who’s applied to your open positions and review their profiles.</p>
            <Link to="/company-applications">
              <button className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition duration-300">
                View Applications
              </button>
            </Link>
          </div>

        </div>
      </section>

      {/* Company Profile Section */}
      <section className="py-12 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-gray-700 mb-6 text-center">Manage Your Company Profile</h2>
        <p className="text-gray-600 text-center mb-8">
          Keep your company’s profile up to date with the latest information. Click below to edit your company name, contact info, and more.
        </p>
        <div className="text-center">
          <Link to="/company-profile">
            <button className="bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 transition duration-300">
              Go to Profile
            </button>
          </Link>
        </div>
      </section>
      
    </div>
  );
};

export default CompanyDashboard;
