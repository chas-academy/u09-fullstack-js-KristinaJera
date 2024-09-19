import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const SingleJob = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    coverLetter: "",
    resume: null,
  });
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    // Fetch job details
    axios.get(`http://localhost:3000/api/job/${id}`)
      .then(response => {
        if (response.data && response.data.success) {
          setJob(response.data.data);
        } else {
          setError('Job not found');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching job details:', err);
        setError('Error fetching job details');
        setLoading(false);
      });

    // Check if the user has already applied for the job
    const userId = localStorage.getItem('userId');
    axios.get(`http://localhost:3000/api/has-applied/${id}/${userId}`)
      .then(response => {
        if (response.data && response.data.hasApplied) {
          setHasApplied(true);
        }
      })
      .catch(err => {
        console.error('Error checking application status:', err);
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === "file" ? files[0] : value
    }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
  
    if (hasApplied) {
      setErrorMessage('You have already applied for this job.');
      setSuccessMessage(null); // Clear success message
      return;
    }
  
    if (!formData.resume) {
      setErrorMessage('Resume file is required.');
      setSuccessMessage(null); // Clear success message
      return;
    }
  
    const jobId = job._id;
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
  
    if (!jobId || !userId) {
      console.error('Job ID or User ID is not defined!');
      return;
    }
  
    const formDataToSend = new FormData();
    formDataToSend.append('resume', formData.resume);
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('coverLetter', formData.coverLetter);
    formDataToSend.append('userId', userId);
  
    try {
      const response = await axios.post(`http://localhost:3000/api/apply/${jobId}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (response.data.success) {
        setSuccessMessage(
          <div>
            Application submitted successfully!{' '}
            <a href="/applied-jobs" className="text-blue-500 underline">
              Find your application here!
            </a>
          </div>
        );
        setShowForm(false);
        setHasApplied(true); // Set hasApplied to true after successful submission
        setErrorMessage(null); // Clear any previous errors
      } else {
        setErrorMessage(response.data.message);
        setSuccessMessage(null); // Clear success message
      }
    } catch (error) {
      console.error('Error submitting application:', error.response?.data || error.message);
      setErrorMessage('An error occurred while submitting the application.');
      setSuccessMessage(null); // Clear success message
    }
  };
  

  if (loading) {
    return <div className="text-center py-4">Loading job details...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <section className="relative text-gray-600 body-font">
    <div className="container px-5 py-20 mx-auto flex flex-col lg:flex-row">
      {/* Job Information */}
      <div className={`transition-all duration-500 ease-in-out ${showForm ? 'lg:w-1/2' : 'lg:w-2/3'} mx-auto p-8 shadow-lg bg-white rounded-lg`}>
        {job && (
          <div className="flex flex-col text-center w-full mb-10">
            <h1 className="text-2xl font-medium text-gray-900">{job.jobTitle}</h1>
            <p className="leading-relaxed text-lg mt-4">{job.detail?.[0]?.desc}</p>
            <p className="mt-2">Location: {job.location}</p>
            <p>Salary: ${job.salary?.toLocaleString()}</p>
            <p>Vacancies: {job.vacancies}</p>
            <p>Experience Required: {job.experience}</p>
            <p>Company: {job.company ? job.company.companyName : 'N/A'}</p>
            <h2 className="text-xl font-bold mt-8">Job Requirements:</h2>
            <ul className="list-disc list-inside">
              <li>{job.detail?.[0]?.requirements}</li>
            </ul>
  
            {/* Apply Button */}
            {hasApplied ? (
              <button 
                className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-200"
                onClick={() => {
                  setErrorMessage('You have already applied for this job.');
                  setSuccessMessage(null); // Clear success message
                }}  >
                Apply Here
              </button>
            ) : (
              <button 
                className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-200"
                onClick={() => setShowForm(true)} // Show form when button is clicked
              >
                Apply Here
              </button>
            )}
  
            {/* Display Messages */}
            {errorMessage && <div className="mt-6 text-red-500">{errorMessage}</div>}
            {successMessage && <div className="mt-6 text-green-500">{successMessage}</div>}
          </div>
        )}
      </div>
  
      {/* Application Form */}
      {showForm && !hasApplied && (
        <div className="relative transition-all duration-500 ease-in-out p-8 shadow-lg bg-white rounded-lg right-0 top-0 h-full ml-5 lg:block hidden">
          <h2 className="text-2xl font-bold mb-4">Application Form</h2>
          {successMessage && <div className="mb-4 text-green-500">{successMessage}</div>}
          {errorMessage && <div className="mb-4 text-red-500">{errorMessage}</div>}
          <form className="flex flex-col space-y-3" onSubmit={handleFormSubmit}>
            <input 
              type="text" 
              name="name"
              placeholder="Your Name" 
              value={formData.name}
              onChange={handleInputChange}
              className="p-2 border text-md border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input 
              type="email" 
              name="email"
              placeholder="Your Email" 
              value={formData.email}
              onChange={handleInputChange}
              className="p-2 border text-md border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input 
              type="tel" 
              name="phone"
              placeholder="Your Phone Number" 
              value={formData.phone}
              onChange={handleInputChange}
              className="p-2 border text-md border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <textarea 
              name="coverLetter"
              placeholder="Why are you a good fit for this role?" 
              value={formData.coverLetter}
              onChange={handleInputChange}
              className="p-2 border text-md border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex flex-col">
              <label className="mb-1 font-medium">Upload your CV</label>
              <input 
                type="file" 
                name="resume"
                accept=".pdf,.doc,.docx" 
                onChange={handleInputChange}
                className="p-4 border text-md border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
  
            <button 
              type="submit" 
              className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-200"
            >
              Submit Application
            </button>
  
            <button 
              type="button" 
              className="mt-3 bg-red-500 text-white px-6 py-2 rounded hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
              onClick={() => setShowForm(false)} // Hide form on cancel
            >
              Cancel
            </button>
          </form>
        </div>
      )}
  
      {/* Application Form Container (Mobile Screens) */}
      <div className={`fixed inset-x-0 bottom-0 transition-transform duration-500 ease-in-out ${showForm && !hasApplied ? 'translate-y-0' : 'translate-y-full'} bg-white shadow-lg rounded-lg p-8 z-50 lg:hidden`}>
        {showForm && !hasApplied && (
          <>
            <h2 className="text-2xl font-bold mb-4">Application Form</h2>
            {successMessage && <div className="mb-4 text-green-500">{successMessage}</div>}
            {errorMessage && <div className="mb-4 text-red-500">{errorMessage}</div>}
            <form className="flex flex-col space-y-3" onSubmit={handleFormSubmit}>
              <input 
                type="text" 
                name="name"
                placeholder="Your Name" 
                value={formData.name}
                onChange={handleInputChange}
                className="p-2 border text-md border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input 
                type="email" 
                name="email"
                placeholder="Your Email" 
                value={formData.email}
                onChange={handleInputChange}
                className="p-2 border text-md border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
                          <input 
              type="tel" 
              name="phone"
              placeholder="Your Phone Number" 
              value={formData.phone}
              onChange={handleInputChange}
              className="p-2 border text-md border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <textarea 
              name="coverLetter"
              placeholder="Why are you a good fit for this role?" 
              value={formData.coverLetter}
              onChange={handleInputChange}
              className="p-2 border text-md border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex flex-col">
              <label className="mb-1 font-medium">Upload your CV</label>
              <input 
                type="file" 
                name="resume"
                accept=".pdf,.doc,.docx" 
                onChange={handleInputChange}
                className="p-4 border text-md border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button 
              type="submit" 
              className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-200"
            >
              Submit Application
            </button>

            <button 
              type="button" 
              className="mt-3 bg-red-500 text-white px-6 py-2 rounded hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
              onClick={() => setShowForm(false)} // Hide form on cancel
            >
              Cancel
            </button>
          </form>
        </>
      )}
    </div>
  </div>
</section>
);
}
export default SingleJob;