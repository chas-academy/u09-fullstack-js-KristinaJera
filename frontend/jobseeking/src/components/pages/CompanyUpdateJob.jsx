import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CompanyUpdateJob = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [job, setJob] = useState(location.state?.job || { detail: [{}] }); // Initialize with empty detail array
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!location.state?.job) {
      console.error('No job data provided');
      navigate('/company-jobs'); // Redirect if no job data is provided
    }
  }, [location.state, navigate]);

  const handleUpdate = async (jobId, updatedJob) => {
    try {
      console.log('Job ID:', jobId); // Log the jobId
  
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }
  
      const response = await axios.put(
        `http://localhost:3000/api/update-job/${jobId}`,
        updatedJob,
        { headers: { Authorization: `Bearer ${token}` } } // Include the token in headers
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
  
  const handleSubmit = (e) => {
    e.preventDefault();

    handleUpdate(job._id, {
      jobTitle: job.jobTitle,
      jobType: job.jobType,
      location: job.location,
      salary: job.salary,
      vacancies: job.vacancies,
      experiences: job.experience,
      detail: [{
        desc: job.detail[0]?.desc || '', // Ensure this is correctly set
        requirements: job.detail[0]?.requirements || '' // Ensure this is correctly set
      }]
    });
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
  

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        {error && <div className="text-center py-4 text-red-500">{error}</div>}
        <form onSubmit={handleSubmit} className="bg-white p-8 shadow-md rounded-lg">
          <h2 className="text-lg font-bold mb-4">Update Job</h2>
          <div className="mb-4">
            <label className="block text-gray-700">Job Title</label>
            <input
              type="text"
              name="jobTitle"
              value={job.jobTitle || ''}
              onChange={handleChange}
              className="form-input mt-1 block w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Job Type</label>
            <input
              type="text"
              name="jobType"
              value={job.jobType || ''}
              onChange={handleChange}
              className="form-input mt-1 block w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              value={job.location || ''}
              onChange={handleChange}
              className="form-input mt-1 block w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Salary</label>
            <input
              type="number"
              name="salary"
              value={job.salary || ''}
              onChange={handleChange}
              className="form-input mt-1 block w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Vacancies</label>
            <input
              type="number"
              name="vacancies"
              value={job.vacancies || ''}
              onChange={handleChange}
              className="form-input mt-1 block w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Experience Required</label>
            <input
              type="number"
              name="experience"
              value={job.experience || ''}
              onChange={handleChange}
              className="form-input mt-1 block w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Job Description</label>
            <textarea
              name="description"
              value={job.detail[0]?.desc || ''} // Ensure this is correctly set
              onChange={handleChange}
              className="form-textarea mt-1 block w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Requirements</label>
            <textarea
              name="requirements"
              value={job.detail[0]?.requirements || ''} // Ensure this is correctly set
              onChange={handleChange}
              className="form-textarea mt-1 block w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="text-white bg-blue-500 border-0 py-2 px-4 focus:outline-none hover:bg-blue-600 rounded"
          >
            Update Job
          </button>
        </form>
      </div>
    </section>
  );
};

export default CompanyUpdateJob;
