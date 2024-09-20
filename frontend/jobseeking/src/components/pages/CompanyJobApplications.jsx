import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const CompanyJobApplications = ({ currentUser }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`http://localhost:3000/api/company/${currentUser._id}/applications`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setApplications(response.data.data);
        } else {
          setError('Failed to fetch applications');
        }
      } catch (err) {
        console.error(err);
        setError('Error fetching applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [currentUser]);

  const handleResumeClick = (resumePath) => {
    window.open(`http://localhost:3000/${resumePath}`, '_blank');
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
        {/* Header Section */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-indigo-600">Job Applications Overview</h1>
          <p className="mt-4 text-lg text-indigo-500">Manage your applicants effectively and efficiently!</p>
          <p className="text-md text-indigo-500">Company: {currentUser.companyName}</p>
        </header>

        {/* Applications List */}
        <div className="flex flex-wrap -mx-4 -my-8">
          {applications.length > 0 ? (
            applications.map((app) => (
              <div key={app._id} className="py-8 px-4 w-full md:w-1/2 lg:w-1/3">
                <div className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
                  <h3 className="text-lg font-semibold">{app.name}</h3>
                  <p className="text-gray-700">Email: {app.email}</p>
                  <p className="text-gray-700">Phone: {app.phone}</p>
                  <p className="text-gray-700">Cover Letter: {app.coverLetter}</p>
                  <p className={`text-gray-700 ${app.status === 'Accepted' ? 'text-green-500' : app.status === 'Rejected' ? 'text-red-500' : 'text-yellow-500'}`}>
                    Status: {app.status}
                  </p>
                  <p className="text-gray-500">Date Applied: {new Date(app.dateApplied).toLocaleDateString()}</p>
                  {app.resume && (
                    <button onClick={() => handleResumeClick(app.resume)} className="text-indigo-500 hover:underline">
                      View Resume
                    </button>
                  )}
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
