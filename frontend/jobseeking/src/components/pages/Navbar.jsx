import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";
import { HiMenuAlt3 } from "react-icons/hi";
import axios from "axios";

const Navbar = ({ user, onClick, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    setIsAuthenticated(!!storedUser);
  }, []);
  const fetchProfileImage = useCallback(async (userRole) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        console.error("No token found");
        return;
    }

    const endpoint = userRole === 'company'
        ? "https://u09-fullstack-js-kristinajera.onrender.com/api/get-company-profile"
        : "https://u09-fullstack-js-kristinajera.onrender.com/api/get-user-profile";

    try {
        const response = await axios.get(endpoint, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.data) {
            const data = response.data.data;
            const profileImageUrl = data.profileUrl ? `https://u09-fullstack-js-kristinajera.onrender.com${data.profileUrl}` : null;
            setProfileImage(profileImageUrl);
            console.log("Profile image URL:", profileImageUrl); // Add this line for debugging
        } else {
            console.error("No data returned from the server");
        }
    } catch (error) {
        console.error("Error fetching profile image:", error.response ? error.response.data : error.message);
    }
}, []);


useEffect(() => {
  if (isAuthenticated && user && (user.role === 'user' || user.role === 'company')) {
    fetchProfileImage(user.role);
  }
}, [isAuthenticated, user, fetchProfileImage]);

  const handleCloseNavbar = () => {
    setIsOpen(prev => !prev);
  };

  const handleLogOut = () => {
    localStorage.removeItem('user');
    onLogout();
    navigate('/');
  };

  const renderGeneralLinks = () => (
    <>
      <Link to="/" className="text-gray-700 hover:text-blue-500">Home</Link>
      <Link to="/resources" className="text-gray-700 hover:text-blue-500">Resources</Link>
      <Link to="/about-us" className="text-gray-700 hover:text-blue-500">About Us</Link>
      <Link to="/contact-us" className="text-gray-700 hover:text-blue-500">Contact Us</Link>
    </>
  );

  const renderAuthLinks = () => {
    if (!user || user.role !== 'user') return null;
    return (
      <>
        <Link to="/user-homepage" className="text-gray-700 hover:text-blue-500">Home</Link>
        <Link to="/applied-jobs" className="text-gray-700 hover:text-blue-500">Applied Jobs</Link>
        <Link to="/all-jobs" className="text-gray-700 hover:text-blue-500">All Jobs</Link>
        <Link to="/user-profile" className="text-gray-700 hover:text-blue-500">Profile</Link>
        <Link to="/user-messages" className="text-gray-700 hover:text-blue-500">Messages</Link>
      </>
    );
  };

  const renderAdminLinks = () => {
    if (!user || user.role !== 'admin') return null;
    return (
      <>
        <Link to="/admin-dashboard" className="text-gray-700 hover:text-blue-500">Admin Dashboard</Link>
        <Link to="/users-page" className="text-gray-700 hover:text-blue-500">All Users</Link>
        <Link to="/companies-page" className="text-gray-700 hover:text-blue-500">All Companies</Link>
        <Link to="/admin-reports" className="text-gray-700 hover:text-blue-500">Admin Reports</Link>
        <Link to="/admins-page" className="text-gray-700 hover:text-blue-500">All Admins</Link>
        <Link to="/admin-messages" className="text-gray-700 hover:text-blue-500">Messages</Link>
      </>
    );
  };

  const renderCompanyLinks = () => {
    console.log("Current user role:", user?.role); // Debugging output
    if (!user || user.role !== 'company') return null;
    return (
      <>
        <Link to="/company-homepage" className="text-gray-700 hover:text-blue-500">Home</Link>
        <Link to="/company-dashboard" className="text-gray-700 hover:text-blue-500">Dashboard</Link>
        <Link to="/company-listed-jobs" className="text-gray-700 hover:text-blue-500">Listed Jobs</Link>
        <Link to="/company-applications" className="text-gray-700 hover:text-blue-500">Applications</Link>
        <Link to="/company-profile" className="text-gray-700 hover:text-blue-500">Profile</Link>
        <Link to="/company-messages" className="text-gray-700 hover:text-blue-500">Messages</Link>
      </>
    );
  };
  

  const renderLinks = () => {
    if (isAuthenticated) {
      return (
        <>
          {renderAuthLinks()}
          {renderAdminLinks()}
          {renderCompanyLinks()}
        </>
      );
    } else {
      return renderGeneralLinks();
    }
  };

  return (
    <header className="sticky top-0 left-0 w-full bg-white shadow-md z-50">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">Jobseeking App</Link>

        {/* Navbar Links - Large Screens */}
        <div className="hidden lg:flex items-center space-x-4">
          {renderLinks()}
          {isAuthenticated && user && (
            <div className="flex items-center space-x-4">
              <p className="hidden lg:flex items-center space-x-2 text-gray-700 pl-8">
                Hello {user.companyName || user.firstName || user.username }
              </p>
              {user.role !== 'admin' && (
              <img
                src={profileImage || 'https://via.placeholder.com/150'}
                alt="User profile"
                className="w-10 h-10 rounded-full object-cover"
                onClick={onClick}
              />
            )}
              <button
                onClick={handleLogOut}
                className="text-gray-700 hover:text-blue-500"
              >
                Log Out
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="block lg:hidden text-slate-900 z-50 relative"
          onClick={handleCloseNavbar}
        >
          {isOpen ? <AiOutlineClose size={26} /> : <HiMenuAlt3 size={26} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`${isOpen ? "block" : "hidden"} lg:hidden bg-white px-4 py-6 absolute top-16 left-0 w-full z-50`}>
        <div className="grid grid-cols-1 gap-4">
          {renderLinks()}
        </div>
        {isAuthenticated && user && (
          <div className="flex flex-col items-start mt-4">
            <p className="flex items-center space-x-2 text-gray-700">
            {user.role !== 'admin' && (
              <img
                src={profileImage || 'https://via.placeholder.com/150'}
                alt="User profile"
                className="w-10 h-10 rounded-full object-cover"
                onClick={onClick}
              />
            )}
              <span>  Hello {user.companyName || user.firstName || user.username}</span>
            </p>
            <button
              onClick={handleLogOut}
              className="text-gray-700 hover:text-blue-500 mt-2"
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

Navbar.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string,
    email: PropTypes.string,
    companyName: PropTypes.string,
    firstName: PropTypes.string,
    username: PropTypes.string,
    profileUrl: PropTypes.string,
    role: PropTypes.string,
  }),
  onClick: PropTypes.func,
  onLogout: PropTypes.func.isRequired,
};

export default Navbar;
