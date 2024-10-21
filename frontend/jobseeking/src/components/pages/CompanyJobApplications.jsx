import { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { FaTrash } from 'react-icons/fa';


const CompanyJobApplications = ({ currentUser }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Update application status function
  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      const token = localStorage.getItem("authToken");
      console.log("Token for update:", token); // Log the token

      const response = await axios.put(
        `https://u09-fullstack-js-kristinajera.onrender.com/api/applications/${applicationId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setApplications((prevApplications) =>
          prevApplications.map((app) =>
            app._id === applicationId ? { ...app, status: newStatus } : app
          )
        );
      } else {
        setError("Failed to update application status");
      }
    } catch (err) {
      console.error("Error updating application status:", err);
      setError("Error updating application status");
    }
  };

    // Delete application function
    const deleteApplication = async (applicationId) => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.delete(
          `https://u09-fullstack-js-kristinajera.onrender.com/api/delete-application/${applicationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (response.data.success) {
          setApplications((prevApplications) =>
            prevApplications.filter((app) => app._id !== applicationId)
          );
        } else {
          setError("Failed to delete application");
        }
      } catch (err) {
        console.error("Error deleting application:", err);
        setError("Error deleting application");
      }
    };

    const confirmDeleteApplication = (applicationId) => {
      if (window.confirm("Are you sure you want to delete this application?")) {
        deleteApplication(applicationId);
      }
    };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `https://u09-fullstack-js-kristinajera.onrender.com/api/company-applications/${currentUser._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          console.log("Fetched applications:", response.data.data);
          setApplications(response.data.data);
        } else {
          setError("Failed to fetch applications");
        }
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError("No applications Found");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [currentUser]);

  const handleResumeClick = (resumePath) => {
    window.open(`http://localhost:3000/${resumePath}`, "_blank");
  };

  if (loading) {
    return <div className="text-center py-4">Loading applications...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <section className="text-gray-600 body-font bg-gray-100">
      <div className="container mx-auto px-5 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-indigo-600">
            Job Applications Overview
          </h1>
          <p className="mt-4 text-lg text-indigo-500">
            Manage your applicants effectively and efficiently!
          </p>
          <p className="text-md text-indigo-500">
            Company: {currentUser.companyName}
          </p>
        </header>

        <div className="flex flex-wrap -mx-4 -my-8">
          {applications.length > 0 ? (
            applications.map((app) => (
              <div key={app._id} className="py-8 px-4 w-full md:w-1/2 lg:w-1/3">
                <div className="relative">
                  <div className="transition-transform transform hover:scale-105 duration-300 h-full flex flex-col items-start bg-white shadow-lg rounded-lg p-6 bg-gradient-to-r from-indigo-200 to-indigo-400">
                    <button
                      onClick={() => confirmDeleteApplication(app._id)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition duration-300"
                    >
                      <FaTrash />
                    </button>
                    <h3 className="text-lg font-semibold text-indigo-700">
                      {app.name}
                    </h3>
                    <p className="text-gray-700">
                      Job Title: {app.job?.jobTitle || "Not Available"}
                    </p>
                    <p className="text-gray-700">Email: {app.email}</p>
                    <p className="text-gray-700">Phone: {app.phone}</p>
                    <p className="text-gray-700">
                      Cover Letter: {app.coverLetter}
                    </p>
                    <p
                      className={`text-gray-700 ${
                        app.status === "Accepted"
                          ? "text-green-700"
                          : app.status === "Rejected"
                          ? "text-red-700"
                          : "text-indigo-700"
                      }`}
                    >
                      Status: {app.status}
                    </p>
                    <p className="text-gray-600">
                      Date Applied:{" "}
                      {new Date(app.dateApplied).toLocaleDateString()}
                    </p>
                    {app.resume && (
                      <button
                        onClick={() => handleResumeClick(app.resume)}
                        className="text-indigo-600 hover:underline mt-2"
                      >
                        View Resume
                      </button>
                    )}

                    {/* Buttons for status update */}
                    <div className="mt-4 flex justify-between">
                      <button
                        onClick={() =>
                          updateApplicationStatus(app._id, "Pending")
                        }
                        className={`px-3 mr-1 py-2 text-white rounded ${
                          app.status === "Pending"
                            ? "bg-blue-500"
                            : "bg-gray-400 hover:bg-blue-500"
                        }`}
                      >
                        Pending
                      </button>
                      <button
                        onClick={() =>
                          updateApplicationStatus(app._id, "Accepted")
                        }
                        className={`px-3 mr-1 py-2 text-white rounded ${
                          app.status === "Accepted"
                            ? "bg-green-500"
                            : "bg-gray-400 hover:bg-green-500"
                        }`}
                      >
                        Accepted
                      </button>
                      <button
                        onClick={() =>
                          updateApplicationStatus(app._id, "Rejected")
                        }
                        className={`px-3 py-2 text-white rounded ${
                          app.status === "Rejected"
                            ? "bg-red-500"
                            : "bg-gray-400 hover:bg-red-500"
                        }`}
                      >
                        Rejected
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-4 w-full">No applications found</p>
          )}
        </div>
      </div>
    </section>
  );
};

// PropTypes validation
CompanyJobApplications.propTypes = {
  currentUser: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    email: PropTypes.string,
    companyName: PropTypes.string,
    role: PropTypes.string,
  }).isRequired,
};

export default CompanyJobApplications;
