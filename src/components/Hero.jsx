import { useState, useEffect } from 'react';
import './Hero.css';

const Hero = () => {
  const [heroData, setHeroData] = useState({
    greeting: "Hello, I'm",
    title: "Meliora Audrey",
    subtitle: "Industrial Engineering Student.",
    description: "Passionate about process optimization, systems engineering, and data-driven continuous improvement. Welcome to my portfolio.",
    cvLink: "/CV.pdf"
  });

  useEffect(() => {
    const saved = localStorage.getItem('portfolio_hero');
    if (saved) {
      setHeroData(JSON.parse(saved));
    }
  }, []);

  return (
    <section id="home" className="hero">
      <div className="container hero-container">
        <div className="hero-content">
          <p className="hero-greeting">{heroData.greeting}</p>
          <h1 className="hero-title">{heroData.title}</h1>
          <h2 className="hero-subtitle">{heroData.subtitle}</h2>
          <p className="hero-description">{heroData.description}</p>
          <div className="hero-actions">
            <a href={heroData.cvLink} className="btn btn-primary" download>Download CV</a>
            <a href="#contact" className="btn btn-secondary">Contact Me</a>
          </div>
        </div>
        <div className="hero-image-wrapper">
          <div className="hero-profile-picture">
            <div className="profile-placeholder-bg"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
