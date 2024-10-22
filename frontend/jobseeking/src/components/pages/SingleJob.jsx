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
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`https://u09-fullstack-js-kristinajera.onrender.com/api/job/${id}`);
        if (response.data && response.data.success) {
          setJob(response.data.data);
        } else {
          setError("Job not found");
        }
      } catch (err) {
        console.error("Error fetching job details:", err);
        setError("Error fetching job details");
      } finally {
        setLoading(false);
      }
    };

    const checkApplicationStatus = async () => {
      const userId = localStorage.getItem("userId");
      try {
        const response = await axios.get(
          `https://u09-fullstack-js-kristinajera.onrender.com/api/has-applied/${id}/${userId}`
        );
        if (response.data && response.data.hasApplied) {
          setHasApplied(true);
        }
      } catch (err) {
        console.error("Error checking application status:", err);
      }
    };

    fetchJobDetails();
    checkApplicationStatus();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (hasApplied) {
      setErrorMessage("You have already applied for this job.");
      setSuccessMessage(null);
      return;
    }

    if (!formData.resume) {
      setErrorMessage("Resume file is required.");
      setSuccessMessage(null);
      return;
    }

    const jobId = job._id;
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");

    const formDataToSend = new FormData();
    formDataToSend.append("resume", formData.resume);
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("coverLetter", formData.coverLetter);
    formDataToSend.append("userId", userId);

    try {
      const response = await axios.post(
        `https://u09-fullstack-js-kristinajera.onrender.com/api/apply/${jobId}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setSuccessMessage(
          <div>
            Application submitted successfully!{" "}
            <a href="/applied-jobs" className="text-blue-500 underline">
              Find your application here!
            </a>
          </div>
        );
        setShowForm(false);
        setHasApplied(true);
        setErrorMessage(null);
      } else {
        setErrorMessage(response.data.message);
        setSuccessMessage(null);
      }
    } catch (error) {
      console.error(
        "Error submitting application:",
        error.response?.data || error.message
      );
      setErrorMessage("An error occurred while submitting the application.");
      setSuccessMessage(null);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading job details...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <section className="relative text-gray-600 body-font right-8">
      <div className="container px-5 py-20 mx-auto flex flex-col lg:flex-row">
        {/* Job Information */}
        <div
          className={`transition-all duration-500 ease-in-out ${
            showForm ? "lg:w-1/2" : "lg:w-2/3"
          } mx-auto p-8 shadow-lg bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg`}
        >
          {job && (
            <div className="flex flex-col text-center w-full mb-10">
              <h1 className="text-3xl font-semibold text-gray-900">
                {job.jobTitle}
              </h1>
              <p className="leading-relaxed text-lg mt-4 text-gray-700">
                {job.detail?.[0]?.desc}
              </p>
              <p className="mt-2 text-gray-800 font-medium">
                Location: {job.location}
              </p>
              <p className="text-gray-800">
                Salary: ${job.salary?.toLocaleString()}
              </p>
              <p className="text-gray-800">Vacancies: {job.vacancies}</p>
              <p className="text-gray-800">
                Experience Required: {job.experience}
              </p>
              <p className="text-gray-800">
                Company: {job.company ? job.company.companyName : "N/A"}
              </p>

              <h2 className="text-xl font-bold mt-8 text-indigo-600">
                Job Requirements:
              </h2>
              <ul className="list-disc list-inside text-left mt-4 text-gray-700">
                <li>{job.detail?.[0]?.requirements}</li>
              </ul>

              {/* Apply Button */}
              {hasApplied ? (
                <button
                  className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-200"
                  onClick={() => {
                    setErrorMessage("You have already applied for this job.");
                    setSuccessMessage(null);
                  }}
                >
                  Apply Here
                </button>
              ) : (
                <button
                  className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-200"
                  onClick={() => setShowForm(true)}
                >
                  Apply Here
                </button>
              )}

              {/* Display Messages */}
              {errorMessage && (
                <div className="mt-6 text-red-500">{errorMessage}</div>
              )}
              {successMessage && (
                <div className="mt-6 text-green-500">{successMessage}</div>
              )}
            </div>
          )}
        </div>

        {/* Application Form */}
        {showForm && !hasApplied && (
          <div className="relative transition-all duration-500 ease-in-out p-8 shadow-lg bg-gradient-to-r from-purple-200 to-blue-200 rounded-lg right-10 top-0 h-full ml-5 lg:block hidden">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Application Form
            </h2>
            {successMessage && (
              <div className="mb-4 text-green-500">{successMessage}</div>
            )}
            {errorMessage && (
              <div className="mb-4 text-red-500">{errorMessage}</div>
            )}
            <form
              className="flex flex-col space-y-4"
              onSubmit={handleFormSubmit}
            >
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleInputChange}
                className="p-3 bg-gradient-to-r from-purple-100 to-blue-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 bg-white shadow-inner"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleInputChange}
                className="p-3 bg-gradient-to-r from-purple-100 to-blue-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 bg-white shadow-inner"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Your Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                className="p-3 bg-gradient-to-r from-purple-100 to-blue-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 bg-white shadow-inner"
              />
              <textarea
                name="coverLetter"
                placeholder="Why are you a good fit for this role?"
                value={formData.coverLetter}
                onChange={handleInputChange}
                className="p-3 bg-gradient-to-r from-purple-100 to-blue-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 bg-white shadow-inner"
              />
              <div className="flex flex-col">
                <label className="mb-2 font-medium text-gray-700">
                  Upload your CV
                </label>
                <input
                  type="file"
                  name="resume"
                  accept=".pdf,.doc,.docx"
                  onChange={handleInputChange}
                  className="p-3 bg-gradient-to-r from-purple-100 to-blue-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 bg-white shadow-inner"
                />
              </div>

              <button
                type="submit"
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-200"
              >
                Submit Application
              </button>

              <button
                type="button"
                className="mt-3 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        )}

        {/* Application Form Container (Mobile Screens) */}
        <div
          className={`fixed inset-x-0 bottom-0 transition-transform bg-gradient-to-r from-purple-200 to-blue-200 duration-500 ease-in-out ${
            showForm && !hasApplied ? "translate-y-0" : "translate-y-full"
          } bg-white shadow-lg rounded-lg p-8 z-50 lg:hidden`}
        >
          {showForm && !hasApplied && (
            <>
              <h2 className="text-2xl font-bold mb-4">Application Form</h2>
              {successMessage && (
                <div className="mb-4 text-green-500">{successMessage}</div>
              )}
              {errorMessage && (
                <div className="mb-4 text-red-500">{errorMessage}</div>
              )}
              <form
                className="flex flex-col space-y-4"
                onSubmit={handleFormSubmit}
              >
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="p-3 bg-gradient-to-r from-purple-100 to-blue-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 bg-white shadow-inner"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="p-3 bg-gradient-to-r from-purple-100 to-blue-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 bg-white shadow-inner"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Your Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="p-3 bg-gradient-to-r from-purple-100 to-blue-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 bg-white shadow-inner"
                />
                <textarea
                  name="coverLetter"
                  placeholder="Why are you a good fit for this role?"
                  value={formData.coverLetter}
                  onChange={handleInputChange}
                  className="p-3 bg-gradient-to-r from-purple-100 to-blue-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 bg-white shadow-inner"
                />
                <div className="flex flex-col">
                  <label className="mb-2 font-medium text-gray-700">
                    Upload your CV
                  </label>
                  <input
                    type="file"
                    name="resume"
                    accept=".pdf,.doc,.docx"
                    onChange={handleInputChange}
                    className="p-3 bg-gradient-to-r from-purple-100 to-blue-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 bg-white shadow-inner"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-200"
                >
                  Submit Application
                </button>

                <button
                  type="button"
                  className="mt-3 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-400 focus:outline-none               focus:ring-2 focus:ring-red-500 transition duration-200"
                  onClick={() => setShowForm(false)}
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
};

export default SingleJob;
