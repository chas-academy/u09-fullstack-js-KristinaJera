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
import UserAppliedJobs from './components/pages/UserAppliedJobs';

export const ProtectedRoute = ({ children, requiredRole }) => {
  const token = Boolean(localStorage.getItem('authToken'));
  const user = JSON.parse(localStorage.getItem('user'));

  console.log(`ProtectedRoute: Checking access for role: ${requiredRole}`);
  console.log(`Token present: ${token}`);
  console.log(`User present: ${user ? 'Yes' : 'No'}`);
  console.log(`User role: ${user ? user.role : 'None'}`);

  if (!token || !user || (requiredRole && user.role !== requiredRole)) {
    console.log('Access denied, redirecting to /login');
    return <Navigate to="/login" />;
  }

  console.log('Access granted, rendering children');
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.string, // Expecting role as a string
};

const App = () => {
  const [user, setUser] = useState(null);
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
    switch (userData.role) {
      case 'company':
        console.log('Navigating to /company-homepage');
        navigate('/company-homepage');
        break;
      case 'user':
        console.log('Navigating to /user-homepage');
        navigate('/user-homepage');
        break;
      case 'admin':
        console.log('Navigating to /admin-dashboard');
        navigate('/admin-dashboard');
        break;
      default:
        console.log('Unknown account type or missing role.');
    }
  };

  const handleLogout = () => {
    console.log('Logging out and redirecting to home page');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  console.log('Current user:', user);

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* Login routes */}
        <Route path="/login-company" element={
          <LoginPage type="company" onLoginSuccess={handleLoginSuccess} onClose={() => navigate('/')} />
        } />
        <Route path="/login" element={
          <LoginPage type="user" onLoginSuccess={handleLoginSuccess} onClose={() => navigate('/')} />
        } />
        <Route path="/login-admin" element={
          <LoginPage type="admin" onLoginSuccess={handleLoginSuccess} onClose={() => navigate('/')} />
        } />

        {/* Register routes */}
        <Route path="/register" element={<RegisterPage onClose={() => navigate('/')} />} />

        {/* Protected routes */}
        <Route path="/admin-dashboard" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDash />
          </ProtectedRoute>
        } />
        <Route path="/user-homepage" element={
          <ProtectedRoute requiredRole="user">
            <UserHomePage 
              jobTypes={['Full-Time', 'Part-Time', 'Contract']} 
              experience={[
                { value: 'entry', title: 'Entry-Level' },
                { value: 'mid', title: 'Mid-Level' },
                { value: 'senior', title: 'Senior-Level' }
              ]}
            />
          </ProtectedRoute>
        } />
        <Route path="/company-homepage" element={
          <ProtectedRoute requiredRole="company">
            <CompanyHomePage />
          </ProtectedRoute>
        } />

        {/* Public routes */}
        <Route path="/all-jobs" element={<UserAllJobs />} />
        <Route path="/job/:id" element={<SingleJob />} />
        <Route path="/applied-jobs" element={<UserAppliedJobs />} />
      </Routes>

      {user && <Footer />}
    </>
  );
};

App.propTypes = {
  user: PropTypes.shape({
    role: PropTypes.string,
  }),
  handleLoginSuccess: PropTypes.func,
};

export default App;
