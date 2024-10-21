import { useState, useEffect } from 'react';
import axios from 'axios';
import JobFilters from './JobFilters';
import { useNavigate } from 'react-router-dom';
import StatisticsSection from './StatisticsSection';
import AboutUs from './AboutUs';
import ContactUs from './ContactUs';
const UserHomepage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [jobOptions, setJobOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('https://u09-fullstack-js-kristinajera.onrender.com/api/find-jobs');
        if (response.data && response.data.success && Array.isArray(response.data.data)) {
          const jobs = response.data.data;
          const jobTitles = Array.from(new Set(jobs.map(job => job.jobTitle)));
          setJobOptions(jobTitles);
          const locations = Array.from(new Set(jobs.map(job => job.location)));
          setLocationOptions(locations);
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
      }
    };

    fetchJobs();
  }, []);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedJobType('');
    setSelectedExperience('');
    setSelectedLocation('');
    setSortOrder('');
  };

  const handleApplyFilters = () => {
    const queryParams = new URLSearchParams({
      searchQuery,
      selectedJobType,
      selectedExperience,
      selectedLocation,
      sortOrder,
    }).toString();

    navigate(`/all-jobs?${queryParams}`);
  };

  return (
    <section className="text-gray-600 body-font">
        <JobFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedJobType={selectedJobType}
          setSelectedJobType={setSelectedJobType}
          selectedExperience={selectedExperience}
          setSelectedExperience={setSelectedExperience}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          jobOptions={jobOptions}
          locationOptions={locationOptions}
          onClearFilters={handleClearFilters}
          onApplyFilters={handleApplyFilters}
        />
      <StatisticsSection/>
      <AboutUs/>
      <ContactUs/>
    </section>
  );
};

export default UserHomepage;
