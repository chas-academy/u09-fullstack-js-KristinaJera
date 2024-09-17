import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Assuming you're using react-router for navigation

const UserAllJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3000/api/find-jobs')
      .then(response => {
        if (response.data && response.data.success && Array.isArray(response.data.data)) {
          setJobs(response.data.data);
        } else {
          setError('Unexpected response structure');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching jobs:', err);
        setError('Error fetching jobs');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading jobs...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-wrap -mx-4 -my-8">
          {jobs.length > 0 ? (
            jobs.map(job => (
              <div key={job._id} className="py-8 px-4 lg:w-1/3">
                <div className="h-full flex items-start bg-white shadow-lg rounded-lg p-6">
                  <div className="flex-grow">
                    <h2 className="tracking-widest text-xs title-font font-medium text-indigo-500 mb-1">{job.jobType}</h2>
                    <h1 className="title-font text-xl font-medium text-gray-900 mb-2">{job.jobTitle}</h1>
                    <p className="leading-relaxed mb-1">Location: {job.location}</p>
                    <p className="leading-relaxed mb-1">Salary: ${job.salary.toLocaleString()}</p>
                    <p className="leading-relaxed mb-1">Vacancies: {job.vacancies}</p>
                    <p className="leading-relaxed mb-1">Experience Required: {job.experience} years</p>
                    <p className="leading-relaxed mb-1">Company: {job.company ? job.company.companyName : 'N/A'}</p>
                    <Link to={`/job/${job._id}`} className="text-indigo-500 inline-flex items-center mt-3">
                      View More
                      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7l7 7-7 7"></path></svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-4">No jobs found</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default UserAllJobs;
