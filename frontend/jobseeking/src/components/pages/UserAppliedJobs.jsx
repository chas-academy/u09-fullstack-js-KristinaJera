import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const UserAppliedJobs = () => {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserApplications = useCallback(async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("User ID not found.");
        return;
      }

      const response = await axios.get(
        `https://u09-fullstack-js-kristinajera.onrender.com/api/user-applications/${userId}`
      );
      if (response.data.success) {
        setApplications(response.data.data);
      } else {
        setError("Failed to fetch user applications");
      }
    } catch (error) {
      console.error(
        "Error fetching user applications:",
        error.response?.data?.message || error.message
      );
      setError("An error occurred while fetching applications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserApplications();
  }, [fetchUserApplications]);

  const removeApplication = async (applicationId) => {
    try {
      const response = await axios.delete(
        `https://u09-fullstack-js-kristinajera.onrender.com/api/delete-application/${applicationId}`
      );
      if (response.data.success) {
        setApplications(
          applications.filter((app) => app._id !== applicationId)
        );
      } else {
        setError("Failed to remove application");
      }
    } catch (error) {
      console.error(
        "Error removing application:",
        error.response?.data?.message || error.message
      );
      setError("An error occurred while removing the application");
    }
  };

  return (
    <section className="text-gray-800 body-font">
      <div className="pb-12 mx-auto ">
        <div className="bg-gradient-to-r from-blue-300 to-purple-300 py-10 mb-8">
          <h1 className="text-4xl font-bold text-center mb-6">
            Your Job Applications
          </h1>
          <p className="text-lg text-center">
            Here are the jobs you have applied for:
          </p>
          {error && (
            <div className="text-center py-4 text-red-500 font-semibold">
              {error}
            </div>
          )}
        </div>
        {loading ? (
          <div className="text-center py-10">Loading applications...</div>
        ) : applications.length === 0 ? (
          <p className="text-center py-4 text-gray-500">
            No applications found.
          </p>
        ) : (
          <div className="flex flex-wrap -my-8 container mx-auto">
            {applications.map((app) => (
              <div
                key={app._id}
                className="py-8 px-4 lg:w-1/3 transition-transform transform hover:scale-105 duration-300"
              >
                <div className="h-full flex flex-col justify-between bg-gradient-to-r from-blue-100 to-purple-100 shadow-lg hover:shadow-xl rounded-lg p-6 transition-shadow duration-300">
                  <div className="flex-grow">
                    <h2 className="tracking-widest text-sm title-font font-semibold text-indigo-600 mb-1">
                      Job: {app.job?.jobTitle || "Job title not available"}
                    </h2>
                    <p className="leading-relaxed mb-1 font-medium">
                      Status: {app.status}
                    </p>
                    <p className="leading-relaxed mb-1">
                      Location: {app.job?.location || "N/A"}
                    </p>
                    <p className="leading-relaxed mb-1">
                      Salary: ${app.job?.salary.toLocaleString() || "N/A"}
                    </p>
                    <p className="leading-relaxed mb-1">
                      Vacancies: {app.job?.vacancies || "N/A"}
                    </p>
                    <p className="leading-relaxed mb-1">
                      Experience Required: {app.job?.experience || "N/A"} years
                    </p>
                    <p className="leading-relaxed mb-1">
                      Resume:{" "}
                      <a
                        href={app.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-500 hover:underline"
                      >
                        View Resume
                      </a>
                    </p>
                    <p className="leading-relaxed mb-1">
                      Cover Letter: {app.coverLetter || "N/A"}
                    </p>
                    <p className="leading-relaxed mb-1">
                      Applied On:{" "}
                      {new Date(app.dateApplied).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => removeApplication(app._id)}
                      className="mt-4 text-red-500 inline-flex items-center hover:underline transition duration-200 mr-3"
                    >
                      Remove Application
                    </button>
                    <Link
                      to={`/job/${app.job?._id}`}
                      className="text-indigo-600 inline-flex items-center mt-3 hover:underline transition duration-200"
                    >
                      View Job
                      <svg
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 ml-2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 12h14m-7-7l7 7-7 7"
                        ></path>
                      </svg>
                    </Link>
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
