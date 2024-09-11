// import React from 'react';
import { useState, useEffect } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import LandingPage from "./components/pages/LandingPage";
import Navbar from "./components/pages/Navbar";
import Footer from "./components/pages/Footer";
import LoginPage from './components/pages/LoginPage';
import UserHomePage from './components/pages/UserHomePage';
import CompanyHomePage from './components/pages/CompanyHomePage';
import AdminDash from './components/pages/AdminDash';
// function LandingPage(){
//   const user = true;
//   const location = useLocation()

//   return user ? ( 
//   <Outlet/>
//    ) :( 
//    <Navigate to='user-auth' state={{ from: location}} replace/>
//   );
  
// }

const App = () => {

  const [loginType, setLoginType] = useState(null);
  const [user, setUser] = useState(null); // State to manage the authenticated user
  // const location = useLocation();
  const navigate = useNavigate();

  const openLogin = (type) => {

    console.log(`Opening login with type: ${type}`);
    setLoginType(type);
  };

  const closeLogin = () => {

    console.log('Closing login modal');
    setLoginType(null);
  };

  const handleLoginSuccess = (userData) => {
    console.log('Handling login success with user data:', userData);

    setUser(userData);
    setLoginType(null);

    if (!userData.accountType) {
      console.log('Unknown account type or missing accountType field.');
      return;
    }

    // Navigate based on user type
    if (userData.accountType === 'company') {
      console.log('Navigating to /company-homepage');
      navigate('/company-homepage');
    } else if (userData.accountType === 'seeker') {
      console.log('Navigating to /user-homepage');
      navigate('/user-homepage');
    } else if (userData.accountType === 'admin') {
      console.log('Navigating to /admin-dashboard');
      navigate('/admin-dashboard');
    } else {
      console.log('Unknown account type or missing accountType field.');
    }
  };
  
  

  // useEffect(() => {
  //   if (user) {
  //     switch (user.accountType) {
  //       case 'company':
  //         window.location.href = '/company-homepage';
  //         break;
  //       case 'seeker':
  //         window.location.href = '/user-homepage';
  //         break;
  //       case 'admin':
  //         window.location.href = '/admin-dashboard';
  //         break;
  //       default:
  //         console.log("Unknown account type or missing accountType field.");
  //     }
  //   }
  // }, [user]);
  // const user = {
  //   firstName: "John",
  //   profileUrl: "path/to/profile.jpg",
  //   accountType: "seeker", // or "company"
  // };

  // const user = false;
  return (
    <>
      <Navbar openLogin={openLogin} /> {/* Pass openLogin to Navbar if needed */}
     
    <Routes>
    <Route path="/" element={<LandingPage/>}/>
    <Route
          path="/login"
          element={
            loginType ? (
              <LoginPage
                onClose={closeLogin}
                type={loginType}
                onLoginSuccess={handleLoginSuccess}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        
        {/* Route for admin */}
        <Route
          path="/admin-dashboard"
          element={user?.accountType === "admin" ? <AdminDash/> : <Navigate to="/login" replace />}
        />
        
        {/* Route for job seekers */}
        <Route
          path="/user-homepage"
          element={user?.accountType === "seeker" ? <UserHomePage /> : <Navigate to="/login" replace />}
        />
        
        {/* Route for companies */}
        <Route
          path="/company-homepage"
          element={user?.accountType === "company" ? <CompanyHomePage /> : <Navigate to="/login" replace />}
        />
    
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
{loginType && !user && <LoginPage onClose={closeLogin} type={loginType} onLoginSuccess={handleLoginSuccess} />}
    </>
  )
}

export default App