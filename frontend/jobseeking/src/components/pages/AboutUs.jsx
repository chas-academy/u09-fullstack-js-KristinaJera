// import React from 'react';

const AboutUs = () => {
  const scrollToAbout = () => {
    document.getElementById('about-us').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="text-center lg:pt-20 pt-4 bg-gray-50">
      <div className="container mx-auto px-4 pb-4">
        <h1 className="text-5xl font-bold text-blue-700 mb-6">
          Discover Who We Are
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          At Jobseeking App, we are passionate about delivering the best solutions
          to our customers. Our team is dedicated to innovation, quality, and
          excellence. Learn more about our journey and values.
        </p>
        <button
          onClick={scrollToAbout}
          className="mt-4 p-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
        >
          ↓ Learn More
        </button>
      </div>

      <div id="about-us" className="lg:py-14 pt-10 py-4 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-blue-700 mb-6">Our Story</h2>
          <p className="text-lg text-gray-700 mb-8">
            Jobseeking App was founded with a vision to create innovative solutions
            that make a difference. Our team brings together a wealth of experience and
            expertise to tackle the challenges of today and tomorrow.
          </p>
          
          <div className="flex flex-col md:flex-row md:justify-between mb-12">
            <div className="md:w-1/3 mb-6 md:mb-0">
              <h3 className="text-2xl font-semibold text-blue-600 mb-4">Our Mission</h3>
              <p className="text-gray-600">
                Our mission is to empower businesses with cutting-edge technology and
                unparalleled service. We strive to build lasting relationships with our
                clients and deliver solutions that drive success.
              </p>
            </div>
            <div className="md:w-1/3 mb-6 md:mb-0">
              <h3 className="text-2xl font-semibold text-blue-600 mb-4">Our Values</h3>
              <p className="text-gray-600">
                Integrity, innovation, and customer-centricity are the core values that
                guide our work. We believe in doing what is right, pushing the boundaries
                of technology, and always putting our clients first.
              </p>
            </div>
            <div className="md:w-1/3 lg:mb-6">
              <h3 className="text-2xl font-semibold text-blue-600 mb-4">Our Team</h3>
              <p className="text-gray-600">
                Our team is a diverse group of talented professionals who bring their
                unique skills and perspectives to the table. Together, we work towards
                a common goal: delivering exceptional results for our clients.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
