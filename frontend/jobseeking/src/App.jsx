// import React from 'react';

import {Route, Routes} from "react-router-dom";
import LandingPage from "./components/LandingPage";



const App = () => {
  return (
    <>
    {/* <Navbar/> */}
    <Routes>
    <Route element={<LandingPage/>}>
    </Route>
    </Routes>
    {/* <Footer/> */}
    </>
  )
}

export default App