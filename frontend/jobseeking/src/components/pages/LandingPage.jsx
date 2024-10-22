import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import { RegisterPage } from './RegisterPage';

const LandingPage = () => {
  const [activeForm, setActiveForm] = useState(null);
  const [loginType, setLoginType] = useState(null);

  // Ensure you only call useNavigate once
  const navigate = useNavigate(); 

  // Memoize showForm to prevent it from being re-created on each render
  const showForm = useCallback((formType, loginType = 'user') => {
    setActiveForm(formType);
    setLoginType(loginType);

    // Update URL based on formType and loginType
    if (formType === 'login') {
      if (loginType === 'company') {
        navigate('/login-company'); // Navigate to /login-company
      } else if (loginType === 'admin') {
        navigate('/login-admin'); // Navigate to /login-admin
      } else {
        navigate('/login'); // Navigate to /login
      }
    } else if (formType === 'register') {
      navigate('/register'); // Navigate to /register
    }
  }, [navigate]);

  const closeForms = () => {
    setActiveForm(null);
    setLoginType(null);
    navigate('/'); // Return to landing page
  };

  const handleLoginSuccess = (userData) => {
    console.log('Login successful:', userData);
    // Add logic for redirection after login success if necessary
  };

  useEffect(() => {
    const currentPath = window.location.pathname;
    if (currentPath === '/login-company') {
      showForm('login', 'company');
    } else if (currentPath === '/login-admin') {
      showForm('login', 'admin');
    } else if (currentPath === '/login') {
      showForm('login', 'user');
    } else if (currentPath === '/register') {
      showForm('register');
    }
  }, [showForm]); // Add showForm as a dependency

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="flex w-3/4 relative items-center justify-center">
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
            <button
              onClick={() => showForm('login', 'company')}
              className="bg-blue-600 text-white py-2 px-4 rounded mb-4 mx-1 hover:bg-blue-700 transition"
            >
              Hire Talent
            </button>
            <button
              onClick={() => showForm('login', 'user')}
              className="bg-green-600 text-white py-2 px-4 rounded mb-4 mx-1 hover:bg-green-700 transition"
            >
              Find a Job
            </button>
            <button
              onClick={() => showForm('login', 'admin')}
              className="bg-purple-600 text-white py-2 px-4 rounded mb-4 mx-1 hover:bg-purple-700 transition"
            >
              Admin Login
            </button>
            <button
              onClick={() => showForm('register')}
              className="text-blue-600 hover:underline mb-4"
            >
              Not registered? Click here to register.
            </button>
          </section>
        </div>

        <div
          className={`transition-all duration-500 ease-in-out transform ${
            activeForm ? 'w-1/2 translate-x-0' : 'translate-x-full w-0'
          }`}
        >
          {activeForm === 'login' && (
            <LoginPage
              onClose={closeForms}
              type={loginType}
              onLoginSuccess={handleLoginSuccess}
            />
          )}
          {activeForm === 'register' && <RegisterPage onClose={closeForms} />}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

// import { useState, useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import LoginPage from './LoginPage';
// import { RegisterPage } from './RegisterPage';

// const LandingPage = () => {
//   const [activeForm, setActiveForm] = useState(null);
//   const [loginType, setLoginType] = useState(null);
//   const navigate = useNavigate();

//   // Memoize showForm to prevent it from being re-created on each render
//   const showForm = useCallback((formType, loginType = 'user') => {
//     setActiveForm(formType);
//     setLoginType(loginType);

//     // Update URL based on formType and loginType
//     if (formType === 'login') {
//       if (loginType === 'company') {
//         navigate('/login-company'); // Navigate to /login-company
//       } else if (loginType === 'admin') {
//         navigate('/login-admin'); // Navigate to /login-admin
//       } else {
//         navigate('/login'); // Navigate to /login
//       }
//     } else if (formType === 'register') {
//       navigate('/register'); // Navigate to /register
//     }
//   }, [navigate]);

//   const closeForms = () => {
//     setActiveForm(null);
//     setLoginType(null);
//     navigate('/'); // Return to landing page
//   };

//   useEffect(() => {
//     const currentPath = window.location.pathname;
//     if (currentPath === '/login-company') {
//       showForm('login', 'company');
//     } else if (currentPath === '/login-admin') {
//       showForm('login', 'admin');
//     } else if (currentPath === '/login') {
//       showForm('login', 'user');
//     } else if (currentPath === '/register') {
//       showForm('register');
//     }
//   }, [showForm]);

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//       <div className="flex w-3/4 relative items-center justify-center">
//         <div
//           className={`transition-all duration-500 ease-in-out transform flex flex-col items-center text-center ${activeForm ? 'w-1/2 -translate-x-[10%]' : 'w-full translate-x-0'}`}
//         >
//           <section className="bg-white shadow-lg rounded-lg p-6 max-w-lg mx-auto">
//             <h1 className="text-3xl font-bold mb-4">Welcome to Jobseeking App</h1>
//             <p className="text-gray-600 mb-6">
//               Discover your next career opportunity with our app.
//             </p>
//             <button
//               onClick={() => showForm('login', 'company')}
//               className="bg-blue-600 text-white py-2 px-4 rounded mb-4 mx-1 hover:bg-blue-700 transition"
//             >
//               Hire Talent
//             </button>
//             <button
//               onClick={() => showForm('login', 'user')}
//               className="bg-green-600 text-white py-2 px-4 rounded mb-4 mx-1 hover:bg-green-700 transition"
//             >
//               Find a Job
//             </button>
//             <button
//               onClick={() => showForm('login', 'admin')}
//               className="bg-purple-600 text-white py-2 px-4 rounded mb-4 mx-1 hover:bg-purple-700 transition"
//             >
//               Admin Login
//             </button>
//             <button
//               onClick={() => showForm('register')}
//               className="text-blue-600 hover:underline mb-4"
//             >
//               Not registered? Click here to register.
//             </button>
//           </section>
//         </div>

//         <div className={`transition-all duration-500 ease-in-out transform ${activeForm ? 'w-1/2 translate-x-0' : 'translate-x-full w-0'}`}>
//           {activeForm === 'login' && (
//             <LoginPage
//               onClose={closeForms}
//               type={loginType}
//               onLoginSuccess={() => console.log('Logged in')}
//             />
//           )}
//           {activeForm === 'register' && <RegisterPage onClose={closeForms} />}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LandingPage;
