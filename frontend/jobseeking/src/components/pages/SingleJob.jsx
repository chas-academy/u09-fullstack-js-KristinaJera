import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const SingleJob = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false); // Manage form visibility

  useEffect(() => {
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
  }, [id]);

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
        <div className={`transition-all duration-500 ease-in-out ${showForm ? 'lg:w-1/2' : 'lg:w-2/3'} p-8 shadow-lg bg-white rounded-lg ${showForm ? 'lg:ml-5' : 'lg:mx-auto'}`}>
          {job && (
            <div className="mx-auto flex flex-col text-center w-full mb-10">
              {/* Job Title */}
              <h1 className="text-2xl font-medium text-gray-900">{job.jobTitle}</h1>

              {/* Job Description */}
              <p className="leading-relaxed text-lg mt-4">{job.detail?.[0]?.desc}</p>

              {/* Location */}
              <p className="mt-2">Location: {job.location}</p>

              {/* Salary */}
              <p>Salary: ${job.salary?.toLocaleString()}</p>

              {/* Vacancies */}
              <p>Vacancies: {job.vacancies}</p>

              {/* Experience Required */}
              <p>Experience Required: {job.experience} years</p>

              {/* Company */}
              <p>Company: {job.company ? job.company.companyName : 'N/A'}</p>

              {/* Job Requirements */}
              <h2 className="text-xl font-bold mt-8">Job Requirements:</h2>
              <ul className="list-disc list-inside">
                <li>{job.detail?.[0]?.requirements}</li>
              </ul>

              {/* Apply Button */}
              <button 
                className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-200"
                onClick={() => setShowForm(true)} // Show form when button is clicked
              >
                Apply Here
              </button>
            </div>
          )}
        </div>

        {/* Application Form Container (Large Screens) */}
        {showForm && (
          <div className="relative transition-all duration-500 ease-in-out p-8 shadow-lg bg-white rounded-lg right-0 top-0 h-full ml-5 hidden lg:block">
            <h2 className="text-2xl font-bold mb-4">Application Form</h2>
            <form className="flex flex-col space-y-3">
              <input 
                type="text" 
                placeholder="Your Name" 
                className="p-2 border text-md border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input 
                type="email" 
                placeholder="Your Email" 
                className="p-2 border text-md border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <textarea 
                placeholder="Why are you a good fit for this role?" 
                className="p-2 border text-md border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {/* CV Upload */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium">Upload your CV</label>
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx" 
                  className="p-4 border text-md border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Phone Number Input */}
              <input 
                type="tel" 
                placeholder="Your Phone Number" 
                className="p-2 border text-md border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <button 
                type="submit" 
                className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-200"
              >
                Submit Application
              </button>

              {/* Cancel Button */}
              <button 
                type="button" 
                className="mt-3 bg-red-500 text-white px-6 py-2 rounded hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
                onClick={() => setShowForm(false)} //Hide form on cancel
              >
                Cancel
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Application Form Container (Mobile Screens) */}
      <div className={`fixed inset-x-0 bottom-0 transition-transform duration-500 ease-in-out ${showForm ? 'translate-y-0' : 'translate-y-full'} bg-white shadow-lg rounded-lg p-8 z-50 lg:hidden`}>
        {showForm && (
          <>
            <h2 className="text-2xl font-bold mb-4">Application Form</h2>
            <form className="flex flex-col space-y-3">
              <input 
                type="text" 
                placeholder="Your Name" 
                className="p-2 border text-md border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input 
                type="email" 
                placeholder="Your Email" 
                className="p-2 border text-md border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <textarea 
                placeholder="Why are you a good fit for this role?" 
                className="p-2 border text-md border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {/* CV Upload */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium">Upload your CV</label>
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx" 
                  className="p-4 border text-md border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Phone Number Input */}
              <input 
                type="tel" 
                placeholder="Your Phone Number" 
                className="p-2 border text-md border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <button 
                type="submit" 
                className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-200"
              >
                Submit Application
              </button>

              {/* Cancel Button */}
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
    </section>
  );
};

export default SingleJob;
