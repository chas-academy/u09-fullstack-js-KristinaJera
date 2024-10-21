import { useEffect, useState, useCallback } from 'react'; 
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StatisticsSection = () => {
  const [stats, setStats] = useState({
    users: 0,
    companies: 0,
    jobs: 0,
  });

  // State for bar chart data
  const [barChartData, setBarChartData] = useState({
    labels: ['Users', 'Companies', 'Jobs'],
    datasets: [
      {
        label: 'Counts',
        data: [], // Initialize empty data
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  });

  const fetchStats = useCallback(async () => {
    try {
      const [usersResponse, companiesResponse, jobsResponse] = await Promise.all([
        axios.get('https://u09-fullstack-js-kristinajera.onrender.com/api/users'),
        axios.get('https://u09-fullstack-js-kristinajera.onrender.com/api/companies'),
        axios.get('https://u09-fullstack-js-kristinajera.onrender.com/api/jobs'),
      ]);

      const userCount = usersResponse.data.length;
      const companyCount = companiesResponse.data.length;
      const jobCount = jobsResponse.data.length;

      setStats({
        users: userCount,
        companies: companyCount,
        jobs: jobCount,
      });

      // Update bar chart data
      setBarChartData((prevData) => ({
        ...prevData,
        datasets: [
          {
            ...prevData.datasets[0],
            data: [userCount, companyCount, jobCount], // Update with new data
          },
        ],
      }));

    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Calculate max value for y-axis
  const maxCount = Math.max(stats.users, stats.companies, stats.jobs) + 10; // Adding a buffer of 10

  return (
    <section className="bg-white py-12 shadow-md rounded-lg">
      <div className="container mx-auto text-center px-4">
        <h2 className="text-4xl font-bold mb-6 text-gray-800">Statistics Overview</h2>
        
        {/* Statistics Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-teal-50 p-6 rounded-lg shadow-md">
            <h2 className="text-4xl font-bold text-teal-600">{stats.users}</h2>
            <p className="text-gray-600">Users</p>
          </div>
          <div className="bg-indigo-50 p-6 rounded-lg shadow-md">
            <h2 className="text-4xl font-bold text-indigo-600">{stats.companies}</h2>
            <p className="text-gray-600">Companies</p>
          </div>
          <div className="bg-orange-50 p-6 rounded-lg shadow-md">
            <h2 className="text-4xl font-bold text-orange-600">{stats.jobs}</h2>
            <p className="text-gray-600">Jobs Listed</p>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-3xl font-semibold mb-4 text-center text-gray-800">Statistical Chart</h3>
          <Bar
            data={barChartData}
            options={{
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                  max: maxCount, // Set max value to dynamic maxCount
                  title: {
                    display: true,
                    text: 'Count',
                  },
                },
              },
              plugins: {
                legend: {
                  display: true,
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'User, Company, and Job Statistics',
                },
              },
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
