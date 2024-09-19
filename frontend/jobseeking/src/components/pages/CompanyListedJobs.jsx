import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const CompanyListedJobs = ({ companyId }) => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!companyId) {
      console.error('Company ID is not provided');
      setError('Company ID is not available.');
      return;
    }

    const fetchJobs = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/company-jobs/${companyId}`);
        if (response.data.success) {
          setJobs(response.data.data);
        } else {
          setError('Failed to fetch jobs');
        }
      } catch (error) {
        console.error('Error fetching jobs:', error.response?.data?.message || error.message);
        setError('An error occurred while fetching jobs');
      }
    };

    fetchJobs();
  }, [companyId]);

  const handleUpdate = (jobId) => {
    console.log(`Update job with ID: ${jobId}`);
    // Implement the update functionality here
    // Redirect to update page or open a modal for updating
  };

  const handleDelete = async (jobId) => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/company-jobs/${jobId}`);
      if (response.data.success) {
        setJobs(jobs.filter(job => job._id !== jobId));
        console.log(`Deleted job with ID: ${jobId}`);
      } else {
        setError('Failed to delete job');
      }
    } catch (error) {
      console.error('Error deleting job:', error.response?.data?.message || error.message);
      setError('An error occurred while deleting the job');
    }
  };

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        {error && <div className="text-center py-4 text-red-500">{error}</div>}
        {jobs.length === 0 ? (
          <p className="text-center py-4">No jobs listed.</p>
        ) : (
          <div className="flex flex-wrap -mx-4 -my-8">
            {jobs.map(job => (
              <div key={job._id} className="py-8 px-4 lg:w-1/3">
                <div className="h-full flex flex-col items-start bg-white shadow-lg rounded-lg p-6">
                  <div className="flex-grow">
                    <h2 className="tracking-widest text-xs title-font font-medium text-indigo-500 mb-1">
                      Job: {job.jobTitle || 'Job title not available'}
                    </h2>
                    <p className="leading-relaxed mb-1">Location: {job.location || 'N/A'}</p>
                    <p className="leading-relaxed mb-1">Salary: ${job.salary.toLocaleString() || 'N/A'}</p>
                    <p className="leading-relaxed mb-1">Vacancies: {job.vacancies || 'N/A'}</p>
                    <p className="leading-relaxed mb-1">Experience Required: {job.experience || 'N/A'} years</p>
                    <p className="leading-relaxed mb-1">Job Description: {job.detail?.desc || 'N/A'}</p>
                    <p className="leading-relaxed mb-1">Posted Date: {new Date(job.postedDate).toLocaleDateString() || 'N/A'}</p>
                    <p className="leading-relaxed mb-1">Application Deadline: {new Date(job.applicationDeadline).toLocaleDateString() || 'N/A'}</p>
                  </div>
                  <div className="flex space-x-4 mt-4">
                    <button
                      onClick={() => handleUpdate(job._id)}
                      className="text-white bg-blue-500 border-0 py-2 px-4 focus:outline-none hover:bg-blue-600 rounded"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(job._id)}
                      className="text-white bg-red-500 border-0 py-2 px-4 focus:outline-none hover:bg-red-600 rounded"
                    >
                      Delete
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

CompanyListedJobs.propTypes = {
  companyId: PropTypes.string.isRequired
};

export default CompanyListedJobs;
