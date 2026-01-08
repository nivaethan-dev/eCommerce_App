import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-us">
      <div className="about-us-container">
        <h1 className="about-us-title">About Us</h1>
        <p className="about-us-subtitle">
          Welcome to the About Us Page
        </p>
        
        <div className="about-us-content">
          {/* Placeholder content - can be expanded with about us features later */}
          <div className="about-us-card">
            <h2>About Us Overview</h2>
            <p>This is the about us page. Add your content here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

