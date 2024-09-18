// import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          
          {/* About Us Section */}
          <div className="w-full md:w-1/3 mb-6">
            <h3 className="text-white text-2xl font-bold mb-4">About Us</h3>
            <p className="text-gray-400">
              Jobseeking App is dedicated to providing top-notch solutions to clients worldwide. Our mission is to empower businesses and job seekers with innovative tools and strategies.
            </p>
          </div>
          
          {/* Services Section */}
          <div className="w-full md:w-1/3 mb-6 pl-10">
            <h3 className="text-white text-2xl font-bold mb-4">Services</h3>
            <ul className="text-gray-400">
              <li className="mb-2"><a href="/all-jobs" className="hover:underline">Job Search</a></li>
              <li className="mb-2"><a href="/about-us" className="hover:underline">About Us</a></li>
              <li><a href="/contact-us" className="hover:underline">Contact Us</a></li>
            </ul>
          </div>
          
          {/* Contact Info Section */}
          <div className="w-full md:w-1/3 mb-6">
            <h3 className="text-white text-2xl font-bold mb-4">Contact Us</h3>
            <p className="text-gray-400 mb-4">
              Stockholm, Sweden <br />
              Email: info@jobseekingapp.com <br />
              Phone: +46 123 456 789
            </p>
            {/* Social Media Icons */}
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-4">
          <p className="text-center text-gray-500">
            &copy; {new Date().getFullYear()} Jobseeking App. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
