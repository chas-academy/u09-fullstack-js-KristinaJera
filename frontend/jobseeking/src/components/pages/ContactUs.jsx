// import React from 'react';

const ContactUs = () => {
  // Scroll function to scroll to the contact form
  const scrollToContact = () => {
    document.getElementById('contact-us-form').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="pt-10 bg-gray-50">
      <div className="container mx-auto px-4 pb-10">
        <div className="text-center">
          <h3 className="text-3xl font-bold text-blue-700 mb-6">Join Us on Our Journey</h3>
          <p className="text-lg text-gray-700 mb-8">
            Whether you are a client, partner, or future team member, we invite you to
            be part of our story. Explore our services, connect with us, and lets
            build something great together.
          </p>
          <button
            onClick={scrollToContact}  // Scroll to the contact form on click
            className="p-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
          >
            Contact Us
          </button>
        </div>
      </div>

      {/* Contact Us Form */}
      <section className="text-gray-600 body-font relative">
        <div className="absolute inset-0">
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
            title="map"
            scrolling="no"
            src="https://maps.google.com/maps?width=100%&height=600&hl=en&q=Stockholm, Sweden&ie=UTF8&t=&z=12&iwloc=B&output=embed"
            style={{ filter: 'grayscale(1) contrast(1.2) opacity(0.4)' }}
          ></iframe>
        </div>

        {/* The Contact Form */}
        <div className="container px-5 py-24 mx-auto flex" id="contact-us-form">
          <div className="lg:w-1/3 md:w-1/2 bg-white rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 relative z-10 shadow-md">
            <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">Contact Us</h2>
            <p className="leading-relaxed mb-5 text-gray-600">
              We would love to hear your thoughts or answer any questions you have. Feel free to reach out!
            </p>
            <div className="relative mb-4">
              <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <div className="relative mb-4">
              <label htmlFor="message" className="leading-7 text-sm text-gray-600">Message</label>
              <textarea
                id="message"
                name="message"
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
              ></textarea>
            </div>
            <button className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">
              Send Message
            </button>
            <p className="text-xs text-gray-500 mt-3">
              We will get back to you within 1-2 business days.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
