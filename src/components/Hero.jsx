import './Hero.css';

const Hero = () => {
  return (
    <section id="home" className="hero">
      <div className="container hero-container">
        <div className="hero-content">
          <p className="hero-greeting">Hello, I'm</p>
          <h1 className="hero-title">Meliora Audrey</h1>
          <h2 className="hero-subtitle">Industrial Engineering Student.</h2>
          <p className="hero-description">
            Passionate about process optimization, systems engineering, and data-driven continuous improvement. Welcome to my portfolio.
          </p>
          <div className="hero-actions">
            <a href="/CV.pdf" className="btn btn-primary" download>Download CV</a>
            <a href="#contact" className="btn btn-secondary">Contact Me</a>
          </div>
        </div>
        <div className="hero-image-wrapper">
          <div className="hero-profile-picture">
            {/* Replace the path with the actual profile photo path later */}
            {/* <img src="/profile-placeholder.jpg" alt="Audrey Profile" /> */}
            <div className="profile-placeholder-bg"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
