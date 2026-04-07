import { useState, useEffect } from 'react';
import './About.css';

const About = () => {
  const [aboutData, setAboutData] = useState({
    bio1: "Hi, I'm Audrey, a dedicated Industrial Engineering student at Universitas Gadjah Mada (UGM). I have a strong passion for solving complex operational problems and creating highly efficient systems processes.",
    bio2: "My approach blends analytical thinking with practical problem-solving. I specialize in supply chain management, operational research, data analysis, and lean manufacturing principles. I am eager to apply my knowledge to drive continuous improvement in real-world scenarios.",
    skills: [
      { id: 1, name: "Data Analysis (Python & Excel)", percentage: 90 },
      { id: 2, name: "Operations Research", percentage: 85 },
      { id: 3, name: "Supply Chain Management", percentage: 80 },
      { id: 4, name: "Lean Six Sigma", percentage: 85 }
    ]
  });

  useEffect(() => {
    const saved = localStorage.getItem('portfolio_about');
    if (saved) {
      setAboutData(JSON.parse(saved));
    }
  }, []);

  return (
    <section id="about" className="section about">
      <div className="container">
        <h2 className="section-title">About Me</h2>
        <div className="about-content">
          <div className="about-text">
            <p>{aboutData.bio1}</p>
            <p>{aboutData.bio2}</p>
          </div>
          <div className="about-skills">
            <h3>Core Skills</h3>
            <div className="skill-bars">
              {aboutData.skills.map(skill => (
                <div key={skill.id} className="skill-bar">
                  <div className="skill-info">
                    <span>{skill.name}</span>
                    <span>{skill.percentage}%</span>
                  </div>
                  <div className="progress-bg">
                    <div className="progress-fill" style={{ width: `${skill.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
