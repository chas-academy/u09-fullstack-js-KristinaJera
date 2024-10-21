import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ConfirmationModal from '../ConfirmationModal';

const CompanyUpdateJob = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [job, setJob] = useState(location.state?.job || { detail: [{}] });
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);

  useEffect(() => {
    if (!location.state?.job) {
      console.error('No job data provided');
      navigate('/company-jobs');
    }
  }, [location.state, navigate]);

  const handleUpdate = async (jobId, updatedJob) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.put(
        `https://u09-fullstack-js-kristinajera.onrender.com/api/update-job/${jobId}`,
        updatedJob,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        navigate('/company-listed-jobs');
      } else {
        setError('Failed to update job');
      }
    } catch (error) {
      console.error('Error updating job:', error.response?.data?.message || error.message);
      setError('An error occurred while updating the job');
    }
  };

  const confirmUpdate = () => {
    handleUpdate(job._id, {
      jobTitle: job.jobTitle,
      jobType: job.jobType,
      location: job.location,
      salary: job.salary,
      vacancies: job.vacancies,
      experiences: job.experience,
      detail: [{
        desc: job.detail[0]?.desc || '',
        requirements: job.detail[0]?.requirements || ''
      }]
    });
    setIsModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setModalAction('update');
    setIsModalOpen(true);
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === 'description') {
      setJob(prevJob => ({
        ...prevJob,
        detail: [{ ...prevJob.detail[0], desc: value }]
      }));
    } else if (name === 'requirements') {
      setJob(prevJob => ({
        ...prevJob,
        detail: [{ ...prevJob.detail[0], requirements: value }]
      }));
    } else {
      setJob(prevJob => ({
        ...prevJob,
        [name]: value
      }));
    }
  };
  
  const handleCancel = () => {
    navigate('/company-listed-jobs');
    setJob(location.state?.job || { detail: [{}] });
  };

  return (
    <section className="text-gray-700 body-font">
    <h1 className="text-3xl font-bold mt-10 text-indigo-600 text-center mb-6">
      Update your jobs! And attract talents!
    </h1>
    <div className="container px-5 py-2 mx-auto">
      {error && <div className="text-center py-4 text-red-500">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white p-5 bg-gradient-to-r from-indigo-300 to-indigo-500 shadow-md rounded-lg lg:max-w-2xl w-full mx-auto">
        <h2 className="text-lg font-bold mb-4">Update Job</h2>
  
        {/* Responsive Grid Form Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          <div>
            <label className="block text-gray-800">Job Title</label>
            <input
              type="text"
              name="jobTitle"
              value={job.jobTitle || ''}
              onChange={handleChange}
              className="form-input mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-300 transition-colors"
              required
            />
          </div>
  
          <div>
            <label className="block text-gray-800">Job Type</label>
            <input
              type="text"
              name="jobType"
              value={job.jobType || ''}
              onChange={handleChange}
              className="form-input mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-300 transition-colors"
              required
            />
          </div>
  
          <div>
            <label className="block text-gray-800">Location</label>
            <input
              type="text"
              name="location"
              value={job.location || ''}
              onChange={handleChange}
              className="form-input mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-300 transition-colors"
              required
            />
          </div>
  
          <div>
            <label className="block text-gray-800">Salary</label>
            <input
              type="number"
              name="salary"
              value={job.salary || ''}
              onChange={handleChange}
              className="form-input mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-300 transition-colors"
              required
            />
          </div>
  
          <div>
            <label className="block text-gray-800">Vacancies</label>
            <input
              type="number"
              name="vacancies"
              value={job.vacancies || ''}
              onChange={handleChange}
              className="form-input mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-300 transition-colors"
              required
            />
          </div>
  
          <div>
            <label className="block text-gray-800">Experience Required</label>
            <input
              type="number"
              name="experience"
              value={job.experience || ''}
              onChange={handleChange}
              className="form-input mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-300 transition-colors"
              required
            />
          </div>
  
          <div className="lg:col-span-2">
            <label className="block text-gray-800">Job Description</label>
            <textarea
              name="description"
              value={job.detail[0]?.desc || ''}
              onChange={handleChange}
              className="form-textarea mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-300 transition-colors"
              required
            />
          </div>
  
          <div className="lg:col-span-2">
            <label className="block text-gray-800">Requirements</label>
            <textarea
              name="requirements"
              value={job.detail[0]?.requirements || ''}
              onChange={handleChange}
              className="form-textarea mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-300 transition-colors"
              required
            />
          </div>
        </div>
  
        {/* Buttons */}
        <div className="flex justify-end mt-5 lg:col-span-2">
        <button
            type="submit"
            className="text-white bg-indigo-900 hover:text-indigo-900 hover:bg-gray-300 py-2 px-4 rounded mr-2"
          >
            Update Job
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="text-indigo-900 bg-gray-300 border-0 py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
      <ConfirmationModal 
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        jobTitle={job.jobTitle}
        onConfirm={confirmUpdate}
        actionType={modalAction}
      />
    </div>
  </section>  
);
}

export default CompanyUpdateJob;
