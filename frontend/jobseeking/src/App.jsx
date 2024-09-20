import { useState, useEffect } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import LandingPage from './components/pages/LandingPage';
import Navbar from './components/pages/Navbar';
import Footer from './components/pages/Footer';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage'; // Default export assumed
import UserHomePage from './components/pages/UserHomePage';
import CompanyHomePage from './components/pages/CompanyHomePage';
import AdminDash from './components/pages/AdminDash';
import UserAllJobs from './components/pages/UserAllJobs';
import SingleJob from './components/pages/SingleJob';
import UserAppliedJobs from './components/pages/UserAppliedJobs';
import ContactUs from './components/pages/ContactUs';
import AboutUs from './components/pages/AboutUs';
import CompanyListedJobs from './components/pages/CompanyListedJobs';
import CompanyUpdateJob from './components/pages/CompanyUpdateJob';
import CreateJob from './components/pages/CreateJob';
import CompanyDashboard from './components/pages/CommpanyDashboard';
import CompanyProfile from './components/pages/CompanyProfile';
import CompanyJobApplications from './components/pages/CompanyJobApplications';

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
  requiredRole: PropTypes.string,
};

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        setUser(JSON.parse(storedUser));
    }
    setLoading(false);
}, []);


if (loading) {
  return <div>Loading...</div>; // Or a spinner component
}
  const handleLoginSuccess = (userData) => {
    console.log('Handling login success with user data:', userData);
    setUser(userData); // Store user data after successful login
    localStorage.setItem('user', JSON.stringify(userData));

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
        <Route path="/login-company" element={
          <LoginPage type="company" onLoginSuccess={handleLoginSuccess} onClose={() => navigate('/')} />
        } />
        <Route path="/login" element={
          <LoginPage type="user" onLoginSuccess={handleLoginSuccess} onClose={() => navigate('/')} />
        } />
        <Route path="/login-admin" element={
          <LoginPage type="admin" onLoginSuccess={handleLoginSuccess} onClose={() => navigate('/')} />
        } />
        <Route path="/register" element={<RegisterPage onClose={() => navigate('/')} />} />
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
        <Route path="/company-dashboard" element={
          <ProtectedRoute requiredRole="company">
            <CompanyDashboard/>
          </ProtectedRoute>
        } />
        <Route path="/company-profile" element={
          <ProtectedRoute requiredRole="company">
            <CompanyProfile/>
          </ProtectedRoute>
        } />
           <Route path="/company/:companyId/applications" element={<ProtectedRoute requiredRole="company"><CompanyJobApplications currentUser={user} /></ProtectedRoute>} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/all-jobs" element={<UserAllJobs />} />
        <Route path="/job/:id" element={<SingleJob />} />
        <Route path="/applied-jobs" element={<UserAppliedJobs />} />
        <Route path="/company-listed-jobs" element={
                    user && user.role === 'company' && user._id ? (
                        <CompanyListedJobs companyId={user._id} />
                    ) : (
                        <Navigate to="/" />
                    )
                } />
        <Route path="/create-job" element={
          user?.role === 'company' ? (
            <CreateJob companyId={user._id} />
          ) : (
            <Navigate to="/" />
          )
        }/>
       <Route path="/update-job" element={<CompanyUpdateJob/>} />
      </Routes>
      {user && <Footer />}
    </>
  );
};

App.propTypes = {
  user: PropTypes.shape({
    role: PropTypes.string,
    _id: PropTypes.string
  }),
  handleLoginSuccess: PropTypes.func
};

export default App;
