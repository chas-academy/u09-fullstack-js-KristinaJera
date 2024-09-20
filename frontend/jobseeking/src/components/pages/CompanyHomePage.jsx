// import React from 'react';
import StatisticsSection from './StatisticsSection';
import AboutUs from './AboutUs';
import ContactUs from './ContactUs';

const CompanyHomePage = () => {
  return (
    <div >
      {/* Welcome Section */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to the Jobseeking App</h1>
          <p className="text-lg mb-8">
            Empower your company with innovative tools to find and recruit the best talent. 
            Our platform is designed to connect you with top professionals and streamline your hiring process.
          </p>
          <p className="text-xl">
            Together, we’re building the future of employment, one connection at a time.
          </p>
        </div>
      </section>

      {/* Company Benefits Section */}
      <section className="py-16 bg-gray-50 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-blue-700 mb-6">Why Companies Trust Us</h2>
          <p className="text-lg text-gray-700 mb-8">
            With the Jobseeking App, your business can discover the perfect candidates with ease, 
            using our advanced matching algorithms and streamlined recruiting features.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white shadow-lg rounded-lg">
              <h3 className="text-2xl font-bold text-blue-600 mb-4">Quality Candidates</h3>
              <p className="text-gray-600">
                Access a diverse pool of skilled professionals ready to make an impact in your organization.
              </p>
            </div>
            <div className="p-6 bg-white shadow-lg rounded-lg">
              <h3 className="text-2xl font-bold text-blue-600 mb-4">Efficient Hiring</h3>
              <p className="text-gray-600">
                Our platform simplifies your hiring process, saving you time and resources in finding the perfect fit.
              </p>
            </div>
            <div className="p-6 bg-white shadow-lg rounded-lg">
              <h3 className="text-2xl font-bold text-blue-600 mb-4">Custom Solutions</h3>
              <p className="text-gray-600">
                Tailored tools and insights designed to meet the specific needs of your business and industry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-white pt-6 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-blue-700 mb-6">Our Impact</h2>
          <p className="text-lg text-gray-700 mb-8">
            We’ve helped companies connect with thousands of job seekers. Here’s a look at the numbers behind our success.
          </p>
          <StatisticsSection />
        </div>
      </section>

      {/* About Us Section */}
      <section className="pt-10 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-blue-700">About Us</h2>
          <AboutUs />
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="lg:pt-8 pt-6">
        <div className="container mx-auto text-center px-2">
          <h2 className="text-4xl font-bold text-blue-700 mb-6">Contact Us</h2>
          <p className="text-lg text-gray-700 mb-8">
            Have questions? We are here to help! Reach out to our support team, and we’ll assist you with anything you need.
          </p>
          <ContactUs />
        </div>
      </section>
    </div>
  );
}

export default CompanyHomePage;
