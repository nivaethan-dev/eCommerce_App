import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-us">
      {/* Hero Section */}
      <div className="about-hero">
        <div className="about-hero-content">
          <h1 className="about-title">Redefining Your Shopping Experience</h1>
          <p className="about-subtitle">
            Welcome to a world where quality meets innovation. We are more than just a store; we are your trusted partner in finding the best.
          </p>
        </div>
      </div>

      <div className="about-container">
        {/* Introduction Section */}
        <section className="about-section intro-section">
          <div className="section-header">
            <h2>Who We Are</h2>
            <div className="underline"></div>
          </div>
          <p className="section-text">
            We are a global e-commerce brand committed to delivering excellence. Our journey began with a simple idea: to make premium products accessible to everyone, everywhere. Today, we stand as a beacon of reliability, offering a curated selection of top-tier items designed to enhance your lifestyle.
          </p>
        </section>

        {/* Mission & Vision Section */}
        <section className="about-section mission-section">
          <div className="mission-grid">
            <div className="mission-card">
              <div className="icon-wrapper">
                <span className="icon">🎯</span>
              </div>
              <h3>Our Mission</h3>
              <p>To empower customers with high-quality choices and a seamless shopping experience that inspires confidence and joy.</p>
            </div>
            <div className="mission-card">
              <div className="icon-wrapper">
                <span className="icon">🚀</span>
              </div>
              <h3>Our Vision</h3>
              <p>To become the world's most customer-centric company, where innovation and integrity pave the way for a smarter future.</p>
            </div>
          </div>
        </section>

        {/* What Makes Us Different */}
        <section className="about-section different-section">
          <div className="section-header">
            <h2>Why Choose Us?</h2>
            <div className="underline"></div>
          </div>
          <div className="features-grid">
            <div className="feature-item">
              <h4>Premium Quality</h4>
              <p>We strictly vet every product to ensure it meets our high standards.</p>
            </div>
            <div className="feature-item">
              <h4>Secure Payments</h4>
              <p>Your transactions are protected by industry-leading encryption.</p>
            </div>
            <div className="feature-item">
              <h4>Fast Delivery</h4>
              <p>Global logistics partners ensure your order arrives on time, every time.</p>
            </div>
            <div className="feature-item">
              <h4>24/7 Support</h4>
              <p>Our dedicated team is always here to help you with any queries.</p>
            </div>
          </div>
        </section>

        {/* Trust & Innovation Combined */}
        <section className="about-section trust-tech-section">
          <div className="info-block">
            <h3>Customer Trust First</h3>
            <p>Transparency is at our core. From clear pricing to honest reviews, we build relationships based on trust. Our secure checkout process guarantees peace of mind.</p>
          </div>
          <div className="info-block">
            <h3>Innovation & Technology</h3>
            <p>We leverage AI-driven insights to personalize your journey, ensuring you find exactly what you need. We are constantly evolving to bring you the future of retail.</p>
          </div>
        </section>

        {/* Call to Action */}
        <section className="cta-section">
          <h2>Ready to Upgrade Your Lifestyle?</h2>
          <p>Explore our exclusive collection today.</p>
          <a href="/products" className="cta-button">Start Shopping</a>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;

