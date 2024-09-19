import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Assuming you're using react-router for navigation

const UserAppliedJobs = () => {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState(null);
  const fetchUserApplications = useCallback(async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('User ID not found.');
        return;
      }

      const response = await axios.get(`http://localhost:3000/api/user-applications/${userId}`);
      if (response.data.success) {
        setApplications(response.data.data);
      } else {
        setError('Failed to fetch user applications');
      }
    } catch (error) {
      console.error('Error fetching user applications:', error.response?.data?.message || error.message);
      setError('An error occurred while fetching applications');
    }
  }, []);

  useEffect(() => {
    fetchUserApplications();
  }, [fetchUserApplications]);

  const removeApplication = async (applicationId) => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/delete-application/${applicationId}`);
      if (response.data.success) {
        setApplications(applications.filter(app => app._id !== applicationId)); // Remove the deleted application from the state
      } else {
        setError('Failed to remove application');
      }
    } catch (error) {
      console.error('Error removing application:', error.response?.data?.message || error.message);
      setError('An error occurred while removing the application');
    }
  };

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        {error && <div className="text-center py-4 text-red-500">{error}</div>}
        {applications.length === 0 ? (
          <p className="text-center py-4">No applications found.</p>
        ) : (
          <div className="flex flex-wrap -mx-4 -my-8">
            {applications.map(app => (
              <div key={app._id} className="py-8 px-4 lg:w-1/3">
                <div className="h-full flex items-start bg-white shadow-lg rounded-lg p-6">
                  <div className="flex-grow">
                    <h2 className="tracking-widest text-xs title-font font-medium text-indigo-500 mb-1">
                      Job: {app.job?.jobTitle || 'Job title not available'}
                    </h2>
                    <p className="leading-relaxed mb-1">Status: {app.status}</p>
                    <p className="leading-relaxed mb-1">Location: {app.job?.location || 'N/A'}</p>
                    <p className="leading-relaxed mb-1">Salary: ${app.job?.salary.toLocaleString() || 'N/A'}</p>
                    <p className="leading-relaxed mb-1">Vacancies: {app.job?.vacancies || 'N/A'}</p>
                    <p className="leading-relaxed mb-1">Experience Required: {app.job?.experience || 'N/A'} years</p>
                    <p className="leading-relaxed mb-1">Resume: <a href={app.resume} target="_blank" rel="noopener noreferrer" className="text-indigo-500">View Resume</a></p>
                    <p className="leading-relaxed mb-1">Cover Letter: {app.coverLetter}</p>
                    <p className="leading-relaxed mb-1">Applied On: {new Date(app.dateApplied).toLocaleDateString()}</p>
                    <Link to={`/job/${app.job?._id}`} className="text-indigo-500 inline-flex items-center mt-3">
                      View Job
                      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7l7 7-7 7"></path></svg>
                    </Link>
                    {/* Remove Application Button */}
                    <button 
                      onClick={() => removeApplication(app._id)} 
                      className="text-red-500 inline-flex items-center mt-3 ml-4">
                      Remove Application
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default UserAppliedJobs;

