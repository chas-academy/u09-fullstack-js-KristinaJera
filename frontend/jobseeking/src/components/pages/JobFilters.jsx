 import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const JobFilters = ({
  searchQuery,
  setSearchQuery,
  selectedJobType,
  setSelectedJobType,
  selectedExperience,
  setSelectedExperience,
  selectedLocation,
  setSelectedLocation,
  sortOrder,
  setSortOrder,
  jobOptions = [],
  locationOptions = [],
}) => {
  const [isJobDropdownOpen, setIsJobDropdownOpen] = React.useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = React.useState(false);
  const navigate = useNavigate();

  const searchRef = React.useRef(null);
  const locationRef = React.useRef(null);

  // Perform search and update URL
  const handleSearch = () => {
    const queryParams = new URLSearchParams({
      searchQuery,
      selectedJobType,
      selectedExperience,
      selectedLocation,
      sortOrder,
    }).toString();

    navigate(`/all-jobs?${queryParams}`);
  };

  // Handle click outside to close dropdowns
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsJobDropdownOpen(false);
      }
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setIsLocationDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="mb-1 flex flex-wrap items-center gap-2 sm:gap-4">
      {/* Search input */}
      <div className="relative flex-1 min-w-[200px]" ref={searchRef}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsJobDropdownOpen(true);
          }}
          placeholder="Search jobs..."
          className="border p-2 rounded w-full pr-8"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
          >
            &#x2715;
          </button>
        )}
        {isJobDropdownOpen && (
          <div className="absolute z-10 bg-white border mt-1 w-full max-h-60 overflow-auto">
            {jobOptions
              .filter(option => option.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((option, index) => (
                <div
                  key={index}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => {
                    setSearchQuery(option);
                    setIsJobDropdownOpen(false);
                  }}
                >
                  {option}
                </div>
              ))}
          </div>
        )}
      </div>
  
      {/* Location input */}
      <div className="relative flex-1 min-w-[200px]" ref={locationRef}>
        <input
          type="text"
          value={selectedLocation}
          onChange={(e) => {
            setSelectedLocation(e.target.value);
            setIsLocationDropdownOpen(true);
          }}
          placeholder="Location..."
          className="border p-2 rounded w-full pr-8"
        />
        {selectedLocation && (
          <button
            onClick={() => setSelectedLocation('')}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
          >
            &#x2715;
          </button>
        )}
        {isLocationDropdownOpen && (
          <div className="absolute z-10 bg-white border mt-1 w-full max-h-60 overflow-auto">
            {locationOptions
              .filter(option => option.toLowerCase().includes(selectedLocation.toLowerCase()))
              .map((option, index) => (
                <div
                  key={index}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => {
                    setSelectedLocation(option);
                    setIsLocationDropdownOpen(false);
                  }}
                >
                  {option}
                </div>
              ))}
          </div>
        )}
      </div>
  
      {/* Experience dropdown */}
      <div className="relative flex-1 min-w-[200px]">
        <select
          value={selectedExperience}
          onChange={(e) => setSelectedExperience(e.target.value)}
          className="border p-2 rounded w-full pr-8"
        >
          <option value="">Experience (years)</option>
          {[...Array(31).keys()].map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
        {selectedExperience && (
          <button
            onClick={() => setSelectedExperience('')}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400"
          >
            &#x2715;
          </button>
        )}
      </div>
  
      {/* Job Type dropdown */}
      <div className="relative flex-1 min-w-[200px]">
        <select
          value={selectedJobType}
          onChange={(e) => setSelectedJobType(e.target.value)}
          className="border p-2 rounded w-full pr-8"
        >
          <option value="">Select Job Type</option>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Contract">Contract</option>
        </select>
        {selectedJobType && (
          <button
            onClick={() => setSelectedJobType('')}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400"
          >
            &#x2715;
          </button>
        )}
      </div>
  
      {/* Sort dropdown */}
      <div className="relative ">
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border p-2 rounded w-full pr-8"
        >
          <option value="">Sort By</option>
          <option value="az">A-Z</option>
          <option value="za">Z-A</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
        {sortOrder && (
          <button
            onClick={() => setSortOrder('')}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400"
          >
            &#x2715;
          </button>
        )}
      </div>
  
      {/* Clear All button */}
      <button
        onClick={() => {
          setSearchQuery('');
          setSelectedJobType('');
          setSelectedExperience('');
          setSelectedLocation('');
          setSortOrder('');
        }}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-all flex-none"
      >
        Clear All
      </button>
  
      {/* Search button */}
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white px-4 py-2 rounded ml-2 hover:bg-blue-600 transition-all flex-none"
      >
        Search
      </button>
    </div>
  );  
};

JobFilters.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  selectedJobType: PropTypes.string.isRequired,
  setSelectedJobType: PropTypes.func.isRequired,
  selectedExperience: PropTypes.string.isRequired,
  setSelectedExperience: PropTypes.func.isRequired,
  selectedLocation: PropTypes.string.isRequired,
  setSelectedLocation: PropTypes.func.isRequired,
  sortOrder: PropTypes.string.isRequired,
  setSortOrder: PropTypes.func.isRequired,
  jobOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  locationOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default JobFilters;
