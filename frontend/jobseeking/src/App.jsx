import { useState, useEffect } from 'react';
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import LandingPage from "./components/pages/LandingPage";
import Navbar from "./components/pages/Navbar";
import Footer from "./components/pages/Footer";
import LoginPage from './components/pages/LoginPage';
import { RegisterPage } from './components/pages/RegisterPage';
import UserHomePage from './components/pages/UserHomePage';
import CompanyHomePage from './components/pages/CompanyHomePage';
import AdminDash from './components/pages/AdminDash';
import UserAllJobs from './components/pages/UserAllJobs';
import SingleJob from './components/pages/SingleJob';

const ProtectedRoute = ({ user, accountType, children }) => {
  if (!user || user.accountType !== accountType) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Define PropTypes for ProtectedRoute
ProtectedRoute.propTypes = {
  user: PropTypes.shape({
    accountType: PropTypes.string.isRequired,  // user should have an accountType that is a string
  }),
  accountType: PropTypes.string.isRequired,    // accountType should be a string
  children: PropTypes.node.isRequired,         // children should be valid React elements (JSX)
};

const App = () => {

  // const [loginType, setLoginType] = useState(null);
  const [user, setUser] = useState(null); // State to manage the authenticated user
  // const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);


  const handleLoginSuccess = (userData) => {
    console.log('Handling login success with user data:', userData);
    setUser(userData);  // Store user data after successful login

      // Save user data in localStorage
  localStorage.setItem('user', JSON.stringify(userData));

    // Navigate based on user type
    if (userData.accountType === 'company') {
      console.log('Navigating to /company-homepage');
      navigate('/company-homepage');  // Redirect company users to /company-homepage
    } else if (userData.accountType === 'user') {
      console.log('Navigating to /user-homepage');
      navigate('/user-homepage');  // Redirect user to /user-homepage
    } else if (userData.accountType === 'admin') {
      console.log('Navigating to /admin-dashboard');
      navigate('/admin-dashboard');  // Redirect admin users to /admin-dashboard
    } else {
      console.log('Unknown account type or missing accountType field.');
    }
  };

  const handleLogout = () => {
    // Clear user session in local storage
    localStorage.removeItem('user');
    setUser(null);
    
    // Navigate to the landing page
    navigate('/');
  };

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} /> {/* Pass openLogin to Navbar if needed */}
     
    <Routes>
    <Route path="/" element={<LandingPage/>}/>
     {/* Company login route */}
     <Route
          path="/login-company"
          element={
            <LoginPage
              type="company"
              onLoginSuccess={handleLoginSuccess}
              onClose={() => navigate('/')} // Close form and navigate to landing page
            />
          }
        />

        {/* User login route */}
        <Route
          path="/login"
          element={
            <LoginPage
              type="user"
              onLoginSuccess={handleLoginSuccess}
              onClose={() => navigate('/')} // Close form and navigate to landing page
            />
          }
        />
         {/* Admin login route */}
        <Route
          path="/login-admin"
          element={
            <LoginPage
              type="admin"
              onLoginSuccess={handleLoginSuccess}
              onClose={() => navigate('/')} // Close form and navigate to landing page
            />
          }
        />

          {/* Add company register route */}
          {/* <Route
          path="/register-company"
          element={<div>Company Register Page (implement this)</div>}
        /> */}

        {/* Add user register route */}
        <Route path="/register" element={<RegisterPage onClose={() => navigate('/')} />} />

        
        {/* Route for admin */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute user={user} accountType="admin">
              <AdminDash />
            </ProtectedRoute>
          }
        />
        {/* Route for job seekers */}
      <Route
        path="/user-homepage"
        element={
          <ProtectedRoute user={user} accountType="seeker">
           <UserHomePage jobTypes={['Full-Time', 'Part-Time', 'Contract']} experience={[{ value: 'entry', title: 'Entry-Level' }, { value: 'mid', title: 'Mid-Level' }, { value: 'senior', title: 'Senior-Level' }]} />

          </ProtectedRoute>
        }
      />
        
        {/* Route for companies */}
        <Route
          path="/company-homepage"
          element={
            <ProtectedRoute user={user} accountType="company">
              <CompanyHomePage />
            </ProtectedRoute>
          }
        />
         <Route path="/all-jobs" element={<UserAllJobs />} />
         <Route path="/job/:id" element={<SingleJob />} />
    {/* <Route path="/" element={ <Navigate to="/find-jobs" replace={true}/>}/> */}
    {/* <Route path="/find-jobs" element={<FindJobs/>}/>
    <Route path="/companies" element={<Companies/>}/> 
    <Route path={user?.user?.accountType ==="seeker"
    ? "/user-profile" : "/user-profile/:id"} element={<UserProfile/>}/>
     <Route path={"/company-profile"} element={<CompanyProfile/>}/>
     <Route path={"/company-profile/:id"} element={<CompanyProfile/>}/>
     <Route path={"/upload-job"} element={<UploadJob/>}/>
     <Route path={"/job-detail/:id"} element={<JobDetail/>}/>
    */}
    {/* </Route> */}
    
    </Routes>
   {/*  {user && <Footer/>}
    </> */}

{user && <Footer />}
  </>
  )
}


App.propTypes = {
  loginType: PropTypes.string,
  user: PropTypes.shape({
    accountType: PropTypes.string,
  }),
  handleLoginSuccess: PropTypes.func,
};

export default App