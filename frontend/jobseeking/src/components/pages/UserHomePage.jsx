// import { useState } from 'react';
// import AboutUs from './AboutUs';
// import StatisticsSection from './StatisticsSection';
// import JobFilters from './JobFilters';
// import PropTypes from 'prop-types'; // Import PropTypes

// const UserHomepage = ({ jobTypes, experience }) => {
//   const [filters, setFilters] = useState({
//     searchQuery: '',
//     selectedJobType: '',
//     selectedExperience: '',
//     selectedLocation: '',
//     sortOrder: '',
//   });

//   const handleFilterChange = (newFilters) => {
//     setFilters(newFilters);
//     // You can now use these filters to filter your job listings
//   };

//   return (
//     <div className="user-homepage-container">
//       {/* Welcome Section */}
//       <div className="text-center py-10">
//         <h1 className="text-3xl font-bold">Welcome to Jobseeking App</h1>
//         <p className="mt-4 text-lg">
//           Find your dream job with ease. Use the search options below to narrow down your search.
//         </p>
//       </div>

//       {/* Job Filters Section */}
//       <JobFilters
//         jobTypes={jobTypes}
//         experience={experience}
//         onFilterChange={handleFilterChange}
//       />

//       {/* You can use the filters state here to filter jobs */}
//       <div className="mt-8">
//         {/* Your job listings or filtered job results */}
//         {/* Example: Render filtered jobs based on the `filters` state */}
//         {/* e.g., filters.searchQuery, filters.selectedJobType, etc. */}
//       </div>

//       {/* Statistics Section */}
//       <StatisticsSection />

//       {/* About Us Section */}
//       <AboutUs />
//     </div>
//   );
// };

// // Add PropTypes validation
// UserHomepage.propTypes = {
//   jobTypes: PropTypes.arrayOf(PropTypes.string), // Expecting array of strings
//   experience: PropTypes.arrayOf(
//     PropTypes.shape({
//       value: PropTypes.string.isRequired,
//       title: PropTypes.string.isRequired,
//     })
//   ), // Expecting array of objects with "value" and "title" properties
// };

// export default UserHomepage;

import { useState } from 'react';
import AboutUs from './AboutUs';
import StatisticsSection from './StatisticsSection';
import JobFilters from './JobFilters';
import PropTypes from 'prop-types';

const UserHomepage = ({ jobTypes, experience }) => {
  const [filters, setFilters] = useState({
    searchQuery: '',
    selectedJobType: '',
    selectedExperience: '',
    selectedLocation: '',
    sortOrder: '',
  });

  // Sample job list (replace with your actual data)
  const jobs = [
    { title: 'Software Developer', jobType: 'Full-Time', experience: 'Mid-Level', location: 'New York', datePosted: '2023-09-10' },
    { title: 'Data Analyst', jobType: 'Part-Time', experience: 'Entry-Level', location: 'Los Angeles', datePosted: '2023-09-15' },
    { title: 'UX Designer', jobType: 'Contract', experience: 'Senior-Level', location: 'San Francisco', datePosted: '2023-09-08' },
  ];

  const handleFilterChange = (newFilters) => {
    console.log('Filters updated:', newFilters);
    setFilters(newFilters);
  };

  // Normalize filter values to lower case
  const normalize = (str) => str?.toLowerCase().trim() || '';

  // Apply filters to jobs
  const filteredJobs = jobs
    .filter((job) => {
      const lowerCaseTitle = normalize(job.title);
      const lowerCaseSearchQuery = normalize(filters.searchQuery);
      const matchesQuery = lowerCaseTitle.includes(lowerCaseSearchQuery);

      const lowerCaseJobType = normalize(job.jobType);
      const lowerCaseSelectedJobType = normalize(filters.selectedJobType);
      const matchesJobType = !filters.selectedJobType || lowerCaseJobType === lowerCaseSelectedJobType;

      const lowerCaseExperience = normalize(job.experience);
      const lowerCaseSelectedExperience = normalize(filters.selectedExperience);
      const matchesExperience = !filters.selectedExperience || lowerCaseExperience === lowerCaseSelectedExperience;

      const lowerCaseLocation = normalize(job.location);
      const lowerCaseSelectedLocation = normalize(filters.selectedLocation);
      const matchesLocation = !filters.selectedLocation || lowerCaseLocation.includes(lowerCaseSelectedLocation);

      console.log(`Job: ${job.title}, Matches Query: ${matchesQuery}, Matches Job Type: ${matchesJobType}, Matches Experience: ${matchesExperience}, Matches Location: ${matchesLocation}`);

      return matchesQuery && matchesJobType && matchesExperience && matchesLocation;
    })
    .sort((a, b) => {
      if (filters.sortOrder === 'az') return a.title.localeCompare(b.title);
      if (filters.sortOrder === 'za') return b.title.localeCompare(a.title);
      if (filters.sortOrder === 'newest') return new Date(b.datePosted) - new Date(a.datePosted);
      if (filters.sortOrder === 'oldest') return new Date(a.datePosted) - new Date(b.datePosted);
      return 0;
    });

  console.log('Filtered Jobs:', filteredJobs);

  return (
    <div className="user-homepage-container">
      <div className="text-center py-10">
        <h1 className="text-3xl font-bold">Welcome to Jobseeking App</h1>
        <p className="mt-4 text-lg">
          Find your dream job with ease. Use the search options below to narrow down your search.
        </p>
      </div>

      <JobFilters
        jobTypes={jobTypes}
        experience={experience}
        onFilterChange={handleFilterChange}
      />

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Available Jobs</h2>
        {filteredJobs.length > 0 ? (
          <ul className="job-list">
            {filteredJobs.map((job, index) => (
              <li key={index} className="mb-4 p-4 border rounded">
                <h3 className="text-lg font-bold">{job.title}</h3>
                <p>Type: {job.jobType}</p>
                <p>Experience: {job.experience}</p>
                <p>Location: {job.location}</p>
                <p>Date Posted: {job.datePosted}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No jobs found.</p>
        )}
      </div>

      <StatisticsSection />
      <AboutUs />
    </div>
  );
};

UserHomepage.propTypes = {
  jobTypes: PropTypes.arrayOf(PropTypes.string),
  experience: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ),
};

export default UserHomepage;



