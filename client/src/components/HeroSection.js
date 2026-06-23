// src/components/HeroSection.js
import React from 'react';
import '../styles/main.css';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h2>Welcome to UrbanRoot</h2>
        <p>Empowering sustainability with modern solutions.</p>
        <a href="#products" className="hero-btn">Explore Products</a>
      </div>
      <div className="scroll-indicator">↓ Scroll</div>
    </section>
  );
};

export default HeroSection;
