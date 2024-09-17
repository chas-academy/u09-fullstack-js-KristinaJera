import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const SingleJob = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <div className="container px-5 py-24 mx-auto flex">
          {job && (
            <div className="mx-auto flex flex-col text-center w-full mb-10 p-8 shadow-lg bg-white rounded-lg">
              <h1 className="text-2xl font-medium text-gray-900">{job.jobTitle}</h1>
              <p className="leading-relaxed text-lg mt-4">{job.detail?.[0]?.desc}</p>
              <p className="mt-2">Location: {job.location}</p>
              <p>Salary: ${job.salary?.toLocaleString()}</p>
              <p>Vacancies: {job.vacancies}</p>
              <p>Experience Required: {job.experience} years</p>
              <p>Company: {job.company ? job.company.companyName : 'N/A'}</p>
              <h2 className="text-xl font-bold mt-8">Job Requirements:</h2>
              <ul className="list-disc list-inside">
                <li>{job.detail?.[0]?.requirements}</li>
              </ul>

              <button 
                className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-200"
              >
                Apply Here
              </button>
            </div>
          )}
        </div>
    </section>
  );
};

export default SingleJob;
