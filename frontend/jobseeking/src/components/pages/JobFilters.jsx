// import { useState } from 'react';
// import PropTypes from 'prop-types'; // Import PropTypes

// const JobFilters = ({ jobTypes = [], experience = [], onFilterChange }) => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedJobType, setSelectedJobType] = useState('');
//   const [selectedExperience, setSelectedExperience] = useState('');
//   const [selectedLocation, setSelectedLocation] = useState('');
//   const [sortOrder, setSortOrder] = useState('');

//   const handleFilterChange = () => {
//     onFilterChange({
//       searchQuery,
//       selectedJobType,
//       selectedExperience,
//       selectedLocation,
//       sortOrder,
//     });
//   };

//   return (
//     <div className="bg-gray-100 p-4 rounded-md flex flex-col md:flex-row items-center justify-between gap-4">
//       {/* Search Field */}
//       <input
//         type="text"
//         value={searchQuery}
//         onChange={(e) => setSearchQuery(e.target.value)}
//         placeholder="Search jobs..."
//         className="border p-2 rounded w-full max-w-md"
//         onKeyUp={handleFilterChange}
//       />

//       {/* Job Type Dropdown */}
//       <select
//         value={selectedJobType}
//         onChange={(e) => {
//           setSelectedJobType(e.target.value);
//           handleFilterChange();
//         }}
//         className="border p-2 rounded"
//       >
//         <option value="">Select Job Type</option>
//         {jobTypes.map((type, index) => (
//           <option key={index} value={type}>
//             {type}
//           </option>
//         ))}
//       </select>

//       {/* Experience Dropdown */}
//       <select
//         value={selectedExperience}
//         onChange={(e) => {
//           setSelectedExperience(e.target.value);
//           handleFilterChange();
//         }}
//         className="border p-2 rounded"
//       >
//         <option value="">Select Experience Level</option>
//         {experience.map((exp, index) => (
//           <option key={index} value={exp.value}>
//             {exp.title}
//           </option>
//         ))}
//       </select>

//       {/* Location Field */}
//       <input
//         type="text"
//         value={selectedLocation}
//         onChange={(e) => {
//           setSelectedLocation(e.target.value);
//           handleFilterChange();
//         }}
//         placeholder="Enter location..."
//         className="border p-2 rounded"
//       />

//       {/* Sort Dropdown */}
//       <select
//         value={sortOrder}
//         onChange={(e) => {
//           setSortOrder(e.target.value);
//           handleFilterChange();
//         }}
//         className="border p-2 rounded"
//       >
//         <option value="">Sort By</option>
//         <option value="az">A-Z</option>
//         <option value="za">Z-A</option>
//         <option value="newest">Newest</option>
//         <option value="oldest">Oldest</option>
//       </select>
//     </div>
//   );
// };

// // Add PropTypes validation
// JobFilters.propTypes = {
//   jobTypes: PropTypes.arrayOf(PropTypes.string), // Expecting array of strings
//   experience: PropTypes.arrayOf(
//     PropTypes.shape({
//       value: PropTypes.string.isRequired,
//       title: PropTypes.string.isRequired,
//     })
//   ), // Expecting array of objects with "value" and "title" properties
//   onFilterChange: PropTypes.func.isRequired, // onFilterChange is a required function
// };

// export default JobFilters;

import { useState } from 'react';
import PropTypes from 'prop-types';

const JobFilters = ({ jobTypes = [], experience = [], onFilterChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  const handleFilterChange = () => {
    console.log('Filter changed:', {
      searchQuery,
      selectedJobType,
      selectedExperience,
      selectedLocation,
      sortOrder
    });
    onFilterChange({
      searchQuery,
      selectedJobType,
      selectedExperience,
      selectedLocation,
      sortOrder
    });
  };

  return (
    <div className="bg-gray-100 p-4 rounded-md flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Search Field */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search jobs..."
        className="border p-2 rounded w-full max-w-md"
      />

      {/* Job Type Dropdown */}
      <select
        value={selectedJobType}
        onChange={(e) => {
          setSelectedJobType(e.target.value);
          handleFilterChange(); // Trigger filter change
        }}
        className="border p-2 rounded"
      >
        <option value="">Select Job Type</option>
        {jobTypes.map((type, index) => (
          <option key={index} value={type}>
            {type}
          </option>
        ))}
      </select>

      {/* Experience Dropdown */}
      <select
        value={selectedExperience}
        onChange={(e) => {
          setSelectedExperience(e.target.value);
          handleFilterChange(); // Trigger filter change
        }}
        className="border p-2 rounded"
      >
        <option value="">Select Experience Level</option>
        {experience.map((exp, index) => (
          <option key={index} value={exp.value}>
            {exp.title}
          </option>
        ))}
      </select>

      {/* Location Field */}
      <input
        type="text"
        value={selectedLocation}
        onChange={(e) => setSelectedLocation(e.target.value)}
        placeholder="Enter location..."
        className="border p-2 rounded"
      />

      {/* Sort Dropdown */}
      <select
        value={sortOrder}
        onChange={(e) => {
          setSortOrder(e.target.value);
          handleFilterChange(); // Trigger filter change
        }}
        className="border p-2 rounded"
      >
        <option value="">Sort By</option>
        <option value="az">A-Z</option>
        <option value="za">Z-A</option>
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
      </select>

      {/* Search Button */}
      <button
        onClick={handleFilterChange}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Search
      </button>
    </div>
  );
};

JobFilters.propTypes = {
  jobTypes: PropTypes.arrayOf(PropTypes.string),
  experience: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ),
  onFilterChange: PropTypes.func.isRequired,
};

export default JobFilters;






