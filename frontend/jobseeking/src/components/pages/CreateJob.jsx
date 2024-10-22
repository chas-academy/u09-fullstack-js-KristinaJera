import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import ConfirmationModal from '../ConfirmationModal';

const CreateJob = ({ companyId }) => {
  const [formData, setFormData] = useState({
    jobTitle: '',
    jobType: '',
    location: '',
    salary: '',
    vacancies: '',
    experiences: '',
    detail: [{ desc: '', requirements: '' }],
  });
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDetailChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      detail: [{
        ...prevState.detail[0],
        [name]: value,
      }],
    }));
  };

  const handleOpenModal = () => {
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for required fields
    if (
      !formData.jobTitle.trim() ||
      !formData.jobType.trim() ||
      !formData.location.trim() ||
      !formData.salary.toString().trim() ||
      !formData.vacancies.toString().trim() ||
      !formData.detail[0].desc.trim() ||
      !formData.detail[0].requirements.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    handleOpenModal(); // Open confirmation modal
  };

  const confirmCreateJob = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError("Unauthorized: Please log in.");
      return;
    }

    try {
      const response = await axios.post(`https://u09-fullstack-js-kristinajera.onrender.com/api/company-create-job/${companyId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        navigate(`/company-listed-jobs`);
      } else {
        setError('Failed to create job');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.message || 'An error occurred while creating the job');
    } finally {
      handleCloseModal(); 
    }
  };

  const handleCancel = () => {
    navigate('/company-listed-jobs');
  };

  return (
    <section className="text-gray-700 body-font h-screen flex flex-col items-center justify-center my-10">
      <h1 className="text-3xl font-bold text-indigo-600 text-center my-6">Post your jobs! And attract talents!</h1>
      <div className="container px-5 py-2 mx-auto">
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="bg-white p-5 bg-gradient-to-r from-indigo-300 to-indigo-500 shadow-md rounded-lg w-5/6 lg:w-3/5 mx-auto">
           {/* Responsive Grid Form Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          <div>
            <label htmlFor="jobTitle" className="block text-gray-800">Job Title</label>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleInputChange}
              className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-indigo-600 transition-colors duration-300"
              required
            />
          </div>
          <div>
            <label htmlFor="jobType" className="block text-gray-800">Job Type</label>
            <input
              type="text"
              id="jobType"
              name="jobType"
              value={formData.jobType}
              onChange={handleInputChange}
              className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-indigo-600 transition-colors duration-300"
              required
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-gray-800">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-indigo-600 transition-colors duration-300"
              required
            />
          </div>
          <div>
            <label htmlFor="salary" className="block text-gray-800">Salary</label>
            <input
              type="number"
              id="salary"
              name="salary"
              value={formData.salary}
              onChange={handleInputChange}
              className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-indigo-600 transition-colors duration-300"
              required
            />
          </div>
          <div>
            <label htmlFor="vacancies" className="block text-gray-800">Vacancies</label>
            <input
              type="number"
              id="vacancies"
              name="vacancies"
              value={formData.vacancies}
              onChange={handleInputChange}
              className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-indigo-600 transition-colors duration-300"
              required
            />
          </div>
          <div>
            <label htmlFor="experiences" className="block text-gray-800">Experience Required (years)</label>
            <input
              type="number"
              id="experiences"
              name="experiences"
              value={formData.experiences}
              onChange={handleInputChange}
              className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-indigo-600 transition-colors duration-300"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="desc" className="block text-gray-800">Job Description</label>
            <textarea
              id="desc"
              name="desc"
              value={formData.detail[0].desc}
              onChange={handleDetailChange}
              className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-indigo-600 transition-colors duration-300"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="requirements" className="block text-gray-800">Job Requirements</label>
            <textarea
              id="requirements"
              name="requirements"
              value={formData.detail[0].requirements}
              onChange={handleDetailChange}
              className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-indigo-600 transition-colors duration-300"
              required
            />
          </div>
          <div className="flex justify-end mt-5 lg:col-span-2">
            <button
              type="submit"
              className="text-white bg-indigo-900 hover:text-indigo-900 hover:bg-gray-300 py-2 px-4 rounded mr-2"
              >
              Create Job
            </button>
            <button
              type="button"
              onClick={handleCancel} // Cancel button functionality
              className="text-indigo-900 bg-gray-300 border-0 py-2 px-4 rounded "
          >
              Cancel
            </button>
          </div>
          </div>
        </form>
  
        <ConfirmationModal
          isOpen={modalIsOpen}
          onRequestClose={handleCloseModal}
          jobTitle={formData.jobTitle}
          onConfirm={confirmCreateJob}
          actionType="create"
        />
      </div>
    </section>
  );  
};

CreateJob.propTypes = {
  companyId: PropTypes.string.isRequired,
};

export default CreateJob;
