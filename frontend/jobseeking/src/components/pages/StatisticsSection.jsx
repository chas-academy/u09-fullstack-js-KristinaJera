import { useEffect, useState } from 'react';
import axios from 'axios';

const StatisticsSection = () => {
  const [stats, setStats] = useState({
    users: 0,
    companies: 0,
    jobs: 0,
  });

  const fetchStats = async () => {
    try {
      const [usersResponse, companiesResponse, jobsResponse] = await Promise.all([
        axios.get('http://localhost:3000/api/users'),
        axios.get('http://localhost:3000/api/companies'),
        axios.get('http://localhost:3000/api/jobs')
      ]);

      setStats({
        users: usersResponse.data.length,
        companies: companiesResponse.data.length,
        jobs: jobsResponse.data.length
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <section className="bg-gray-100 py-12">
      <div className="container mx-auto text-center">
        <div className="flex justify-center space-x-8">
          <div>
            <h2 className="text-3xl font-bold">{stats.users}</h2>
            <p>Users</p>
          </div>
          <div>
            <h2 className="text-3xl font-bold">{stats.companies}</h2>
            <p>Companies</p>
          </div>
          <div>
            <h2 className="text-3xl font-bold">{stats.jobs}</h2>
            <p>Jobs Listed</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
