import { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';

const UserAllJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [isJobDropdownOpen, setIsJobDropdownOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [jobOptions, setJobOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);

  const searchRef = useRef(null);
  const locationRef = useRef(null);

  const location = useLocation(); // Get the current URL

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('https://u09-fullstack-js-kristinajera.onrender.com/api/find-jobs');
        if (response.data && response.data.success && Array.isArray(response.data.data)) {
          setJobs(response.data.data);
          // Populate dropdown options
          const jobTitles = Array.from(new Set(response.data.data.map(job => job.jobTitle)));
          setJobOptions(jobTitles);
          const locations = Array.from(new Set(response.data.data.map(job => job.location)));
          setLocationOptions(locations);
        } else {
          setError('Unexpected response structure');
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Error fetching jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Filter and search jobs
  const applyFilters = useCallback(() => {
    const normalize = (str) => str?.toLowerCase().trim() || '';

    const filtered = jobs
      .filter((job) => {
        const lowerCaseTitle = normalize(job.jobTitle);
        const lowerCaseSearchQuery = normalize(searchQuery);
        const matchesQuery = lowerCaseTitle.includes(lowerCaseSearchQuery);

        const lowerCaseJobType = normalize(job.jobType);
        const lowerCaseSelectedJobType = normalize(selectedJobType);
        const matchesJobType = !selectedJobType || lowerCaseJobType === lowerCaseSelectedJobType;

        const lowerCaseExperience = normalize((job.experience ?? '').toString());
        const lowerCaseSelectedExperience = normalize(selectedExperience);
        const matchesExperience = !selectedExperience || lowerCaseExperience === lowerCaseSelectedExperience;

        const lowerCaseLocation = normalize(job.location);
        const lowerCaseSelectedLocation = normalize(selectedLocation);
        const matchesLocation = !selectedLocation || lowerCaseLocation.includes(lowerCaseSelectedLocation);

        return matchesQuery && matchesJobType && matchesExperience && matchesLocation;
      })
      .sort((a, b) => {
        if (sortOrder === 'az') return a.jobTitle.localeCompare(b.jobTitle);
        if (sortOrder === 'za') return b.jobTitle.localeCompare(a.jobTitle);
        if (sortOrder === 'newest') return new Date(b.datePosted) - new Date(a.datePosted);
        if (sortOrder === 'oldest') return new Date(a.datePosted) - new Date(b.datePosted);
        return 0;
      });

    setFilteredJobs(filtered);
  }, [jobs, searchQuery, selectedJobType, selectedExperience, selectedLocation, sortOrder]);

  // Apply filters when URL parameters or jobs change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQueryParam = params.get('searchQuery') || '';
    const selectedJobTypeParam = params.get('selectedJobType') || '';
    const selectedExperienceParam = params.get('selectedExperience') || '';
    const selectedLocationParam = params.get('selectedLocation') || '';
    const sortOrderParam = params.get('sortOrder') || '';

    setSearchQuery(searchQueryParam);
    setSelectedJobType(selectedJobTypeParam);
    setSelectedExperience(selectedExperienceParam);
    setSelectedLocation(selectedLocationParam);
    setSortOrder(sortOrderParam);
  }, [location.search]);

  // Re-apply filters when they are updated
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Handle click outside to close dropdowns
  useEffect(() => {
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

  if (loading) {
    return <div className="text-center py-4">Loading jobs...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <section className="text-gray-600 body-font">
      <div className="pb-5">
        {/* Filter Section */}
        <div className='px-2 py-5 bg-gradient-to-r from-blue-300 to-purple-300 mb-5'>
        <h1  className="text-4xl font-bold text-blue-800 text-center py-10 ">Search For Your Dream Job</h1>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 container mx-auto mb-8 px-5 lg:px-10 w-full">
          
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]" ref={searchRef}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsJobDropdownOpen(true);
              }}
              placeholder="Search jobs..."
              className="bg-gradient-to-r from-blue-100 to-purple-100 border p-2 rounded w-full"
            />
            {searchQuery && (
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                onClick={() => setSearchQuery('')}
              >
                ✕
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

          {/* Location Input */}
          <div className=" relative flex-1 min-w-[200px]" ref={locationRef}>
            <input
              type="text"
              value={selectedLocation}
              onChange={(e) => {
                setSelectedLocation(e.target.value);
                setIsLocationDropdownOpen(true);
              }}
              placeholder="Location..."
              className="border p-2 rounded w-full bg-gradient-to-r from-blue-100 to-purple-100"
            />
            {selectedLocation && (
              <button
                className="absolute top-2 right-2 text-gray-500"
                onClick={() => setSelectedLocation('')}
              >
                ✕
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

          {/* Experience Dropdown */}
          <div className=" relative flex-1 min-w-[200px]">
            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              className="border p-2 rounded w-full bg-gradient-to-r from-blue-100 to-purple-100"
            >
              <option value="">Experience (years)</option>
              {[...Array(31).keys()].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            {selectedExperience && (
              <button
                className="absolute top-2 right-6 text-gray-500"
                onClick={() => setSelectedExperience('')}
              >
                ✕
              </button>
            )}
          </div>

          {/* Job Type Dropdown */}
          <div className=" relative flex-1 min-w-[200px]">
            <select
              value={selectedJobType}
              onChange={(e) => setSelectedJobType(e.target.value)}
              className="border p-2  rounded w-full  bg-gradient-to-r from-blue-100 to-purple-100"
            >
              <option value="">Select Job Type</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contract">Contract</option>
            </select>
            {selectedJobType && (
              <button
                className="absolute top-2 right-6 text-gray-500"
                onClick={() => setSelectedJobType('')}
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort Order Dropdown */}
          <div className=" relative flex-1 min-w-[200px]">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border p-2 rounded w-full bg-gradient-to-r from-blue-100 to-purple-100"
            >
              <option value="">Sort By</option>
              <option value="az">A-Z</option>
              <option value="za">Z-A</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
            {sortOrder && (
              <button
                className="absolute top-2 right-6 text-gray-500"
                onClick={() => setSortOrder('')}
              >
                ✕
              </button>
            )}
          </div>
        
          {/* Clear All Button */}
          <div className="relative w-full sm:w-auto mt-2 sm:mt-0">
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedJobType('');
                setSelectedExperience('');
                setSelectedLocation('');
                setSortOrder('');
                applyFilters();
              }}
              className="bg-red-500 text-white px-4 py-2  rounded hover:bg-red-600 transition-all w-full sm:w-auto"
            >
              Clear All
            </button>
          </div>
        </div>
        </div>
        {/* Jobs List */}
        <div className="flex flex-wrap mx-auto container -my-8">
          {filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
              <div key={job._id} className="py-8 px-4 w-full sm:w-1/2 lg:w-1/3 transition-transform transform hover:scale-105 duration-300">
                <div className="h-full flex items-start bg-gradient-to-r from-blue-200 to-purple-200 shadow-lg rounded-lg p-6">
                  <div className="flex-grow">
                    <h2 className="tracking-widest text-xs title-font font-medium text-indigo-500 mb-1">{job.jobType}</h2>
                    <h1 className="title-font text-xl font-medium text-gray-900 mb-2">{job.jobTitle}</h1>
                    <p className="leading-relaxed mb-1">Location: {job.location}</p>
                    <p className="leading-relaxed mb-1">Salary: ${job.salary.toLocaleString()}</p>
                    <p className="leading-relaxed mb-1">Vacancies: {job.vacancies}</p>
                    <p className="leading-relaxed mb-1">Experience Required: {job.experience} years</p>
                    <p className="leading-relaxed mb-1">Company: {job.company ? job.company.companyName : 'N/A'}</p>
                    <Link to={`/job/${job._id}`} className="text-indigo-500 inline-flex items-center mt-3 hover:underline transition duration-200">
                      View More
                      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7l7 7-7 7"></path>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-4 w-full">No jobs found</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default UserAllJobs;


            