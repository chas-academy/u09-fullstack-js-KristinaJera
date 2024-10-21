import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../ConfirmationModal';

const CompanyListedJobs = ({ companyId }) => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!companyId) {
      console.error('Company ID is not provided');
      setError('Company ID is not available.');
      return;
    }

    const fetchJobs = async () => {
      try {
        const response = await axios.get(`https://u09-fullstack-js-kristinajera.onrender.com/api/company-jobs/${companyId}`);
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

  const handleUpdate = (job) => {
    navigate('/update-job', { state: { job } });
  };

  const handleOpenModal = (job) => {
    setSelectedJob(job);
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
    setSelectedJob(null);
  };

  const confirmDelete = async () => {
    if (!selectedJob) return;

    const token = localStorage.getItem('authToken');

    if (!token) {
      console.error("Token is missing");
      setError('Unauthorized: Token missing or malformed.');
      return;
    }

    try {
      const response = await axios.delete(`https://u09-fullstack-js-kristinajera.onrender.com/api/company-jobs/${selectedJob._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.data.success) {
        setJobs(jobs.filter(j => j._id !== selectedJob._id));
        alert(`Successfully deleted the job: "${selectedJob.jobTitle}"`);
      } else {
        setError('Failed to delete job');
      }
    } catch (error) {
      console.error('Error deleting job:', error.response?.data?.message || error.message);
      setError('An error occurred while deleting the job');
    } finally {
      handleCloseModal();
    }
  };

  const handleCreateJob = () => {
    navigate('/create-job');
  };

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 my-6 py-6 mx-auto">
        <h1 className="text-3xl font-bold text-indigo-600 text-center lg:mb-4 mb-6">Manage Your Job Listings</h1>
        <div className="flex lg:justify-end mb-10">
          <button
            onClick={handleCreateJob}
            className="text-white bg-indigo-500 border-0 py-2 px-4 focus:outline-none hover:bg-indigo-600 rounded"
          >
            Create New Job Listing
          </button>
        </div>

        {error && <div className="text-center py-4 text-red-500">{error}</div>}
        {jobs.length === 0 ? (
          <p className="text-center py-4">No jobs listed.</p>
        ) : (
          <div className="flex flex-wrap -mx-4 -my-8">
            {jobs.map(job => (
              <div key={job._id} className="py-8 px-4 lg:w-1/3 ">
                <div className="transition-transform transform hover:scale-105 duration-300 h-full flex flex-col items-start bg-white shadow-lg rounded-lg p-6 bg-gradient-to-r from-indigo-200 to-indigo-400">
                  <div className="flex-grow">
                    <h2 className="tracking-widest text-s title-font font-medium text-indigo-700 mb-1">
                      Job: {job.jobTitle || 'Job title not available'}
                    </h2>
                    <p className="leading-relaxed mb-1">Location: {job.location || 'N/A'}</p>
                    <p className="leading-relaxed mb-1">Salary: ${job.salary.toLocaleString() || 'N/A'}</p>
                    <p className="leading-relaxed mb-1">Vacancies: {job.vacancies || 'N/A'}</p>
                    <p className="leading-relaxed mb-1">Experience Required: {job.experience || 'N/A'} years</p>
                    <p className="leading-relaxed mb-1">Job Requirements: {job.detail?.[0]?.requirements || 'N/A'}</p>
                    <p className="leading-relaxed mb-1">Job Description: {job.detail?.[0]?.desc || 'N/A'}</p>
                    <p className="leading-relaxed mb-1">Posted Date: {new Date(job.postedDate).toLocaleDateString() || 'N/A'}</p>
                    <p className="leading-relaxed mb-1">Application Deadline: {new Date(job.applicationDeadline).toLocaleDateString() || 'N/A'}</p>
                  </div>
                  <div className="flex space-x-4 mt-4">
                    <button
                      onClick={() => handleUpdate(job)}
                      className="text-white bg-indigo-500 border-0 py-2 px-4 focus:outline-none hover:bg-indigo-600 rounded"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleOpenModal(job)}
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
  
        <ConfirmationModal 
          isOpen={modalIsOpen}
          onRequestClose={handleCloseModal}
          jobTitle={selectedJob ? selectedJob.jobTitle : ''}
          onConfirm={confirmDelete}
          actionType="delete" // You can modify this as needed
        />
      </div>
    </section>
  );
};
  
CompanyListedJobs.propTypes = {
  companyId: PropTypes.string.isRequired,
};
  
export default CompanyListedJobs;
