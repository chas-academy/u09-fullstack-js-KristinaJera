import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineClose, AiOutlineLogout } from "react-icons/ai";
import { HiMenuAlt3 } from "react-icons/hi";

const Navbar = ({ user, onClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!user);
  const navigate = useNavigate();  // To programmatically navigate the user after logout

  useEffect(() => {
    // Check user authentication status on component mount
    const storedUser = localStorage.getItem('user');
    setIsAuthenticated(!!storedUser);
  }, []);

  const handleCloseNavbar = () => {
    setIsOpen((prev) => !prev);
  };

  const handleLogOut = () => {
    // Clear user session (example using localStorage)
    localStorage.removeItem('user');
    setIsAuthenticated(false); // Update the state to hide the logout button

    // Redirect to the login page or home page
    navigate('/user-auth');
  };

  return (
    <>
      <header className="absolute top-0 left-0 w-full bg-white shadow-md">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            Jobseeking App
          </Link>

          {/* Navbar Links - Large Screens */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link to="/" className="text-gray-700 hover:text-blue-500">
              Home
            </Link>
            <Link to="/resources" className="text-gray-700 hover:text-blue-500">
              Resources
            </Link>
            <Link to="/about-us" className="text-gray-700 hover:text-blue-500">
              About Us
            </Link>
            <Link to="/contact-us" className="text-gray-700 hover:text-blue-500">
              Contact Us
            </Link>

            {/* Conditional Links */}
            {user?.role === 'admin' && (
              <Link to="/admin-dashboard" className="text-gray-700 hover:text-blue-500">
                Admin Dashboard
              </Link>
            )}
            {user?.role === 'company' && (
              <Link to="/company-dashboard" className="text-gray-700 hover:text-blue-500">
                Company Dashboard
              </Link>
            )}

            {/* User Info and Logout Button */}
            {isAuthenticated && user?.firstName && (
              <div className="flex items-center space-x-4">
                <p className="text-gray-700">{user.firstName}</p>
                <img
                  src={user.profileUrl}
                  alt="User profile"
                  className="w-10 h-10 rounded-full object-cover cursor-pointer"
                  onClick={onClick}
                />
                <button
                  onClick={handleLogOut}
                  className="text-gray-700 hover:text-blue-500 flex items-center"
                >
                  <AiOutlineLogout className="mr-2 h-5 w-5" />
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
        <div
          className={`${
            isOpen ? "block" : "hidden"
          } lg:hidden bg-white px-4 py-6 absolute top-16 left-0 w-full z-50`}
        >
          <Link to="/" onClick={handleCloseNavbar} className="block mb-4">
            Home
          </Link>
          <Link to="/resources" onClick={handleCloseNavbar} className="block mb-4">
            Resources
          </Link>
          <Link to="/about-us" onClick={handleCloseNavbar} className="block mb-4">
            About Us
          </Link>
          <Link to="/contact-us" onClick={handleCloseNavbar} className="block mb-4">
            Contact Us
          </Link>

          {/* Conditional Links for Mobile */}
          {user?.role === 'admin' && (
            <Link to="/admin-dashboard" onClick={handleCloseNavbar} className="block mb-4 text-gray-700 hover:text-blue-500">
              Admin Dashboard
            </Link>
          )}
          {user?.role === 'company' && (
            <Link to="/company-dashboard" onClick={handleCloseNavbar} className="block mb-4 text-gray-700 hover:text-blue-500">
              Company Dashboard
            </Link>
          )}

          {/* Mobile User Info */}
          {isAuthenticated && user?.firstName && (
            <>
              <div className="flex items-center space-x-4 mb-4">
                <p>{user.firstName}</p>
                <img
                  src={user.profileUrl}
                  alt="User profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
              </div>
              <button
                onClick={handleLogOut}
                className="text-gray-700 hover:text-blue-500 flex items-center"
              >
                <AiOutlineLogout className="mr-2 h-5 w-5" />
                Log Out
              </button>
            </>
          )}
        </div>
      </header>
    </>
  );
};

// Adding PropTypes validation
Navbar.propTypes = {
  user: PropTypes.shape({
    firstName: PropTypes.string,
    profileUrl: PropTypes.string,
    role: PropTypes.string,  // Add role to the propTypes
  }),
  onClick: PropTypes.func,
};

export default Navbar;

