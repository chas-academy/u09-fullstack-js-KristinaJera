// import { useState } from 'react';
// import {RegisterPage }from "./RegisterPage";
// import { LoginPage } from './LoginPage';


// const LandingPage = () => {
//   const [isRegistering, setIsRegistering] = useState(false);
//   const [isLoggingIn, setIsLoggingIn] = useState(false);

//   const showRegisterForm = () => {
//     setIsRegistering(true);
//     setIsLoggingIn(false);
//   };

//   const showLoginForm = () => {
//     setIsLoggingIn(true);
//     setIsRegistering(false);
//   };

//   const closeForm = () => {
//     setIsRegistering(false);
//     setIsLoggingIn(false);
//   };

//   return (
//     <div className="relative bg-gray-100 flex justify-center items-center min-h-screen">
//       {/* Navbar section */}
//       <header className="absolute top-0 left-0 w-full bg-white shadow-md">
//         <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
//           {/* Logo */}
//           <div className="text-2xl font-bold text-blue-600">Jobseeking App</div>
//           {/* Navbar Links */}
//           <div className="space-x-4">
//             <a href="#" className="text-gray-700 hover:text-blue-500">Home</a>
//             <a href="#" className="text-gray-700 hover:text-blue-500">Features</a>
//             <a href="#" className="text-gray-700 hover:text-blue-500">About</a>
//             <a href="#" className="text-gray-700 hover:text-blue-500">Contact</a>
//           </div>
//         </nav>
//       </header>

//       {/* Main Content Section */}
//       <main className={`flex flex-col items-center text-center transition-transform ${isRegistering || isLoggingIn ? '-translate-x-[-20%]' : 'translate-x-0'} duration-300`}>
//       <section className="bg-white shadow-lg rounded-lg p-8 max-w-lg">
//           {/* Brief Description of the App */}
//           <h1 className="text-3xl font-bold mb-4">Welcome to Jobseeking App</h1>
//           <p className="text-gray-600 mb-6">
//             Discover your next career opportunity with our app. Whether you are just starting or looking to make a change, we have got the tools to help you succeed.
//           </p>

//           {/* Registration Link */}
//           <button onClick={showRegisterForm} className="text-blue-600 hover:underline">Not registered? Click here to register</button>

//           {/* Login Link */}
//           <button onClick={showLoginForm} className="text-blue-600 hover:underline">Already have an account? Login here</button>
//         </section>
//       </main>

//       {/* Conditional Rendering of Forms */}
//       {isRegistering && <RegisterPage onClose={closeForm} />}
//       {isLoggingIn && <LoginPage onClose={closeForm} />}
//     </div>
//   );
// };

// export default LandingPage;


import { useState } from 'react';
import { LoginPage } from './LoginPage';
import { RegisterPage } from './RegisterPage';

const LandingPage = () => {
  const [activeForm, setActiveForm] = useState(null);
  const [loginType, setLoginType] = useState(null); // Added to differentiate between company and seeker login

  const showForm = (formType, loginType = null) => {
    setActiveForm(formType);
    setLoginType(loginType); // Set the login type when a form is shown
  };
  
  const closeForms = () => {
    setActiveForm(null);
    setLoginType(null); // Reset the login type
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {/* Container for both sections */}
      <div className="flex w-3/4 relative items-center justify-center">
        {/* Welcome Section */}
        <div
          className={`transition-all duration-500 ease-in-out transform flex flex-col items-center text-center ${
            activeForm ? 'w-1/2 -translate-x-[10%]' : 'w-full translate-x-0'
          }`}
        >
          <section className="bg-white shadow-lg rounded-lg p-6 max-w-lg mx-auto">
            <h1 className="text-3xl font-bold mb-4">Welcome to Jobseeking App</h1>
            <p className="text-gray-600 mb-6">
              Discover your next career opportunity with our app. Whether you are just starting or looking to make a change, we have got the tools to help you succeed.
            </p>
            {/* Added two buttons for Company and Job Seeker login */}
            <button
              onClick={() => showForm('login', 'company')}
              className="bg-blue-600 text-white py-2 px-4 rounded mb-4 mx-1 hover:bg-blue-700 transition"
            >
              Hire Talent
            </button>
            <button
              onClick={() => showForm('login', 'seeker')}
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
            >
              Find a Job
            </button>
            <button onClick={() => showForm('register')} className="text-blue-600 hover:underline mb-4">
              Not registered? Click here to register
            </button>
          </section>
        </div>

        {/* Form Section */}
        <div
          className={`transition-all duration-500 ease-in-out transform ${
            activeForm ? 'w-1/2 translate-x-0' : 'translate-x-full w-0'
          }`}
        >
          {activeForm === 'login' && <LoginPage onClose={closeForms} type={loginType} />}
          {activeForm === 'register' && <RegisterPage onClose={closeForms} />}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
