import { useState, useEffect } from 'react';
import './Hero.css';

const Hero = ({ onLoaded }) => {
  const [heroData, setHeroData] = useState({
    greeting: "Hello, I'm",
    title: "Meliora Audrey",
    subtitle: "Industrial Engineering Student.",
    description: "Passionate about process optimization, systems engineering, and data-driven continuous improvement. Welcome to my portfolio.",
    cvLink: "/CV.pdf",
    photoUrl: ""
  });

  useEffect(() => {
    fetch('/api/get-content?section=hero')
      .then(res => { if(res.ok) return res.json(); throw new Error(); })
      .then(data => setHeroData(data))
      .catch(() => console.log('Using default hero data'));
  }, []);

  return (
    <section id="home" className="hero section">
      <div className="container hero-container">
        <div className="hero-content">
          <p className="hero-greeting">{heroData.greeting}</p>
          <h1 className="hero-title">{heroData.title}</h1>
          <h2 className="hero-subtitle">{heroData.subtitle}</h2>
          <p className="hero-description">{heroData.description}</p>
          <div className="hero-cta">
            <a href="#contact" className="btn btn-primary">Let's Talk</a>
            <a href={heroData.cvLink} target="_blank" rel="noreferrer" className="btn btn-secondary">Download CV</a>
          </div>
        </div>
        <div className="hero-image-wrapper">
          <div className="hero-profile-picture">
            {heroData.photoUrl ? (
               <img src={heroData.photoUrl} alt="Audrey Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            ) : (
               <div className="profile-placeholder-bg"></div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
