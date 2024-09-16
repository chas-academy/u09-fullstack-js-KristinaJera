// import { useState, useEffect } from "react";
// import PropTypes from "prop-types";
// import { Link, useNavigate } from "react-router-dom";
// import { AiOutlineClose } from "react-icons/ai";
// import { HiMenuAlt3 } from "react-icons/hi";

// const Navbar = ({ user, onClick,  onLogout }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(!!user);
//   const navigate = useNavigate();  // To programmatically navigate the user after logout

//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
//     setIsAuthenticated(!!storedUser);
//   }, []);

//   useEffect(() => {
//     setIsAuthenticated(!!user);
//   }, [user]);

//   // const isAuthenticated = !!user; // Updated to reflect actual user presence

//   const handleCloseNavbar = () => {
//     setIsOpen((prev) => !prev);
//   };

//   const handleLogOut = () => {
//     // Clear user session (example using localStorage)
//     localStorage.removeItem('user');
//     // Update the state to hide the logout button
//     // Assuming you'll update the state in App to reflect logout
//   onLogout();
//     // Redirect to the login page or home page
//     navigate('/');
//   };

//   return (
//     <>
//       <header className="absolute top-0 left-0 w-full bg-white shadow-md">
//         <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
//           {/* Logo */}
//           <Link to="/" className="text-2xl font-bold text-blue-600">
//             Jobseeking App
//           </Link>

//           {/* Navbar Links - Large Screens */}
//           <div className="hidden lg:flex items-center space-x-4">
//             <Link to="/" className="text-gray-700 hover:text-blue-500">
//               Home
//             </Link>
//             <Link to="/resources" className="text-gray-700 hover:text-blue-500">
//               Resources
//             </Link>
//             <Link to="/about-us" className="text-gray-700 hover:text-blue-500">
//               About Us
//             </Link>
//             <Link to="/contact-us" className="text-gray-700 hover:text-blue-500">
//               Contact Us
//             </Link>

//             {/* Conditional Links */}
//             {user?.accountType === 'admin' && (
//               <Link to="/admin-dashboard" className="text-gray-700 hover:text-blue-500">
//                 Admin Dashboard
//               </Link>
//             )}
//             {user?.accountType === 'company' && (
//               <Link to="/company-dashboard" className="text-gray-700 hover:text-blue-500">
//                 Company Dashboard
//               </Link>
//             )}

//             {/* User Info and Logout Button */}
//             {isAuthenticated && (
//               <div className="flex items-center space-x-4">
//                 <p className="text-gray-700">{user.companyName || user.firstName}</p>
//                 <img
//                   src={user.profileUrl}
//                   alt="User profile"
//                   className="w-10 h-10 rounded-full object-cover cursor-pointer"
//                   onClick={onClick}
//                 />
//                 <button
//                   onClick={handleLogOut}
//                   className="text-gray-700 hover:text-blue-500 flex items-center"
//                 >
//                   Log Out
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             className="block lg:hidden text-slate-900 z-50 relative"
//             onClick={handleCloseNavbar}
//           >
//             {isOpen ? <AiOutlineClose size={26} /> : <HiMenuAlt3 size={26} />}
//           </button>
//         </nav>

//         {/* Mobile Menu */}
//         <div
//           className={`${
//             isOpen ? "block" : "hidden"
//           } lg:hidden bg-white px-4 py-6 absolute top-16 left-0 w-full z-50`}
//         >
//           <Link to="/" onClick={handleCloseNavbar} className="block mb-4">
//             Home
//           </Link>
//           <Link to="/resources" onClick={handleCloseNavbar} className="block mb-4">
//             Resources
//           </Link>
//           <Link to="/about-us" onClick={handleCloseNavbar} className="block mb-4">
//             About Us
//           </Link>
//           <Link to="/contact-us" onClick={handleCloseNavbar} className="block mb-4">
//             Contact Us
//           </Link>

//           {/* Conditional Links for Mobile */}
//           {user?.accountType === 'admin' && (
//             <Link to="/admin-dashboard" onClick={handleCloseNavbar} className="block mb-4 text-gray-700 hover:text-blue-500">
//               Admin Dashboard
//             </Link>
//           )}
//           {user?.accountType === 'company' && (
//             <Link to="/company-dashboard" onClick={handleCloseNavbar} className="block mb-4 text-gray-700 hover:text-blue-500">
//               Company Dashboard
//             </Link>
//           )}

//           {/* Mobile User Info */}
//           {isAuthenticated && (
//             <>
//               <div className="flex items-center space-x-4 mb-4">
//                 <p>{user.companyName || user.firstName}</p>
//                 <img
//                   src={user.profileUrl}
//                   alt="User profile"
//                   className="w-10 h-10 rounded-full object-cover"
//                 />
//               </div>
//               <button
//                 onClick={handleLogOut}
//                 className="text-gray-700 hover:text-blue-500 flex items-center"
//               >
//                 Log Out
//               </button>
//             </>
//           )}
//         </div>
//       </header>
//     </>
//   );
// };


// Navbar.propTypes = {
//   user: PropTypes.shape({
//     _id: PropTypes.string,
//     email: PropTypes.string,
//     companyName: PropTypes.string,
//     firstName: PropTypes.string,
//     profileUrl: PropTypes.string,
//     accountType: PropTypes.string,
//   }),
//   onClick: PropTypes.func,
//   onLogout: PropTypes.func.isRequired,
// };

// export default Navbar;


// import { useState, useEffect } from "react";
// import PropTypes from "prop-types";
// import { Link, useNavigate } from "react-router-dom";
// import { AiOutlineClose } from "react-icons/ai";
// import { HiMenuAlt3 } from "react-icons/hi";

// const Navbar = ({ user, onClick, onLogout }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(!!user);
//   const navigate = useNavigate();  // To programmatically navigate the user after logout

//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
//     setIsAuthenticated(!!storedUser);
//   }, []);

//   useEffect(() => {
//     setIsAuthenticated(!!user);
//   }, [user]);

//   const handleCloseNavbar = () => {
//     setIsOpen((prev) => !prev);
//   };

//   const handleLogOut = () => {
//     // Clear user session (example using localStorage)
//     localStorage.removeItem('user');
//     // Update the state to hide the logout button
//     onLogout();
//     // Redirect to the landing page
//     navigate('/');
//   };

//   return (
//     <>
//       <header className="sticky top-0 left-0 w-full bg-white shadow-md">
//         <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
//           {/* Logo */}
//           <Link to="/" className="text-2xl font-bold text-blue-600">
//             Jobseeking App
//           </Link>

//           {/* Navbar Links - Large Screens */}
//           <div className="hidden lg:flex items-center space-x-4">
//             <Link to="/" className="text-gray-700 hover:text-blue-500">
//               Home
//             </Link>
//             <Link to="/resources" className="text-gray-700 hover:text-blue-500">
//               Resources
//             </Link>
//             <Link to="/about-us" className="text-gray-700 hover:text-blue-500">
//               About Us
//             </Link>
//             <Link to="/contact-us" className="text-gray-700 hover:text-blue-500">
//               Contact Us
//             </Link>

//             {/* Conditional Links */}
//             {user?.accountType === 'admin' && (
//               <Link to="/admin-dashboard" className="text-gray-700 hover:text-blue-500">
//                 Admin Dashboard
//               </Link>
//             )}
//             {user?.accountType === 'company' && (
//               <Link to="/company-dashboard" className="text-gray-700 hover:text-blue-500">
//                 Company Dashboard
//               </Link>
//             )}


//     {/* New Links for Authenticated Users */}
//     {isAuthenticated && user && (
//               <>
//                 <Link to="/applied-jobs" className="text-gray-700 hover:text-blue-500">
//                   Applied Jobs
//                 </Link>
//                 <Link to="/all-jobs" className="text-gray-700 hover:text-blue-500">
//                   All Jobs
//                 </Link>
//               </>
//             )}

//             {/* User Info and Logout Button */}
//             {isAuthenticated && user && (
//               <div className="flex items-center space-x-4">
//                 <p className="text-gray-700">{user.companyName || user.firstName}</p>
//                 <img
//                   src={user.profileUrl}
//                   alt="User profile"
//                   className="w-10 h-10 rounded-full object-cover cursor-pointer"
//                   onClick={onClick}
//                 />
//                 <button
//                   onClick={handleLogOut}
//                   className="text-gray-700 hover:text-blue-500 flex items-center"
//                 >
//                   Log Out
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             className="block lg:hidden text-slate-900 z-50 relative"
//             onClick={handleCloseNavbar}
//           >
//             {isOpen ? <AiOutlineClose size={26} /> : <HiMenuAlt3 size={26} />}
//           </button>
//         </nav>

//         {/* Mobile Menu */}
//         <div
//           className={`${
//             isOpen ? "block" : "hidden"
//           } lg:hidden bg-white px-4 py-6 absolute top-16 left-0 w-full z-50`}
//         >
//           <Link to="/" onClick={handleCloseNavbar} className="block mb-4">
//             Home
//           </Link>
//           <Link to="/resources" onClick={handleCloseNavbar} className="block mb-4">
//             Resources
//           </Link>
//           <Link to="/about-us" onClick={handleCloseNavbar} className="block mb-4">
//             About Us
//           </Link>
//           <Link to="/contact-us" onClick={handleCloseNavbar} className="block mb-4">
//             Contact Us
//           </Link>

//           {/* Conditional Links for Mobile */}
//           {user?.accountType === 'admin' && (
//             <Link to="/admin-dashboard" onClick={handleCloseNavbar} className="block mb-4 text-gray-700 hover:text-blue-500">
//               Admin Dashboard
//             </Link>
//           )}
//           {user?.accountType === 'company' && (
//             <Link to="/company-dashboard" onClick={handleCloseNavbar} className="block mb-4 text-gray-700 hover:text-blue-500">
//               Company Dashboard
//             </Link>
//           )}

//                 {/* New Links for Authenticated Users (Mobile) */}
//                 {isAuthenticated && user && (
//             <>
//               <Link
//                 to="/applied-jobs"
//                 onClick={handleCloseNavbar}
//                 className="block mb-4 text-gray-700 hover:text-blue-500"
//               >
//                 Applied Jobs
//               </Link>
//               <Link
//                 to="/all-jobs"
//                 onClick={handleCloseNavbar}
//                 className="block mb-4 text-gray-700 hover:text-blue-500"
//               >
//                 All Jobs
//               </Link>
//             </>
//           )}


//           {/* Mobile User Info */}
//           {isAuthenticated && user && (
//             <>
//               <div className="flex items-center space-x-4 mb-4">
//                 <p>{user.companyName || user.firstName}</p>
//                 <img
//                   src={user.profileUrl}
//                   alt="User profile"
//                   className="w-10 h-10 rounded-full object-cover"
//                 />
//               </div>
//               <button
//                 onClick={handleLogOut}
//                 className="text-gray-700 hover:text-blue-500 flex items-center"
//               >
//                 Log Out
//               </button>
//             </>
//           )}
//         </div>
//       </header>
//     </>
//   );
// };

// Navbar.propTypes = {
//   user: PropTypes.shape({
//     _id: PropTypes.string,
//     email: PropTypes.string,
//     companyName: PropTypes.string,
//     firstName: PropTypes.string,
//     profileUrl: PropTypes.string,
//     accountType: PropTypes.string,
//   }),
//   onClick: PropTypes.func,
//   onLogout: PropTypes.func.isRequired,
// };

// export default Navbar;]

import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";
import { HiMenuAlt3 } from "react-icons/hi";

const Navbar = ({ user, onClick, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!user);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    setIsAuthenticated(!!storedUser);
  }, []);

  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

  const handleCloseNavbar = () => {
    setIsOpen((prev) => !prev);
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
    console.log('User in renderAuthLinks:', user);
    if (!user || user.accountType !== 'seeker') {
      console.log('No user or accountType is not seeker');
      return null;
    }
    return (
      <>
        <Link to="/applied-jobs" className="text-gray-700 hover:text-blue-500">Applied Jobs</Link>
        <Link to="/all-jobs" className="text-gray-700 hover:text-blue-500">All Jobs</Link>
      </>
    );
  };

  const renderAdminLinks = () => {
    console.log('User in renderAdminLinks:', user);
    if (!user || user.accountType !== 'admin') {
      console.log('No user or accountType is not admin');
      return null;
    }
    return (
      <>
        <Link to="/admin-dashboard" className="text-gray-700 hover:text-blue-500">Admin Dashboard</Link>
        <Link to="/admin-reports" className="text-gray-700 hover:text-blue-500">Admin Reports</Link>
        <Link to="/admin-settings" className="text-gray-700 hover:text-blue-500">Admin Settings</Link>
      </>
    );
  };

  const renderCompanyLinks = () => {
    console.log('User in renderCompanyLinks:', user);
    if (!user || user.accountType !== 'company') {
      console.log('No user or accountType is not company');
      return null;
    }
    return (
      <>
        <Link to="/company-dashboard" className="text-gray-700 hover:text-blue-500">Company Dashboard</Link>
        <Link to="/company-jobs" className="text-gray-700 hover:text-blue-500">Company Jobs</Link>
        <Link to="/company-settings" className="text-gray-700 hover:text-blue-500">Company Settings</Link>
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
    <header className="sticky top-0 left-0 w-full bg-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">Jobseeking App</Link>

        {/* Navbar Links - Large Screens */}
        <div className="hidden lg:flex items-center space-x-4">
          {renderLinks()}
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
            <p>{user.companyName || user.firstName}</p>
            <img
              src={user.profileUrl}
              alt="User profile"
              className="w-10 h-10 rounded-full object-cover"
              onClick={onClick}
            />
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
    profileUrl: PropTypes.string,
    accountType: PropTypes.string,
  }),
  onClick: PropTypes.func,
  onLogout: PropTypes.func.isRequired,
};

export default Navbar;
