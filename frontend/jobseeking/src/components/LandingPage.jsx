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
