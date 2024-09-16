const AboutUs = () => {
  const scrollToAbout = () => {
    document.getElementById('about-us').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold">Learn More About Us</h1>
      <button
        onClick={scrollToAbout}
        className="mt-4 p-2 bg-blue-500 text-white rounded"
      >
        ↓ Scroll Down
      </button>
      <div id="about-us" className="py-20">
        <p>This is where the About Us content will go.</p>
      </div>
    </div>
  );
};

export default AboutUs;
