// import React from 'react';

import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
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
  return (
    <>
    <Navbar/>
    <Routes>
    <Route element={<LandingPage/>}>
    <Route path="/" element={ <Navigate to="/find-jobs" replace={true}/>}/>
    {/* <Route path="/find-jobs" element={<FindJobs/>}/>
    <Route path="/companies" element={<Companies/>}/> 
    <Route path={user?.user?.accountType ==="seeker"
    ? "/user-profile" : "/user-profile/:id"} element={<UserProfile/>}/>
     <Route path={"/company-profile"} element={<CompanyProfile/>}/>
     <Route path={"/company-profile/:id"} element={<CompanyProfile/>}/>
     <Route path={"/upload-job"} element={<UploadJob/>}/>
     <Route path={"/job-detail/:id"} element={<JobDetail/>}/>
    */}
    </Route>
    </Routes>
    <Footer/>
    </>
  )
}

export default App