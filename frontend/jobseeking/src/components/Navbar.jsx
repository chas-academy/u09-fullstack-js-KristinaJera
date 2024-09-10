// import React from 'react'

const Navbar = () => {
  return (
    <>
      <header className="absolute top-0 left-0 w-full bg-white shadow-md">
         <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-around items-center">
           {/* Logo */}
           <div className="text-2xl font-bold text-blue-600">Jobseeking App</div>
           {/* Navbar Links */}
           <div className="space-x-4">
             <a href="#" className="text-gray-700 hover:text-blue-500">Home</a>
             <a href="#" className="text-gray-700 hover:text-blue-500">Features</a>
             <a href="#" className="text-gray-700 hover:text-blue-500">About</a>
             <a href="#" className="text-gray-700 hover:text-blue-500">Contact</a>
           </div>
         </nav>
       </header>
    </>
  )
}

export default Navbar