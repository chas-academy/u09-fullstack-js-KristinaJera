// import React from 'react'

import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {

    const user = {};
    const [isOpen, setIsOpen] = useState(false);

    const handleCloseNavbar = () => {
        setIsOpen((prev) => !prev);
    };

  return (

    <>
      <header className="absolute top-0 left-0 w-full bg-white shadow-md">
         <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-around items-center">
           {/* Logo */}
           <Link to="/" className="text-2xl font-bold text-blue-600">Jobseeking App</Link>
           {/* Navbar Links */}
           <div className=" hidden space-x-4">
             <Link to="/" className="text-gray-700 hover:text-blue-500">Home</Link>
             <Link to="/" className="text-gray-700 hover:text-blue-500">Resources</Link>
             <Link to="/about-us" className="text-gray-700 hover:text-blue-500">About Us</Link>
             <Link to="/" className="text-gray-700 hover:text-blue-500">Contact Us</Link>
           </div>
         </nav>
       </header>
    </>
  )
}

export default Navbar