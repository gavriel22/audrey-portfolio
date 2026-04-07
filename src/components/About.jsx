import { useState, useEffect } from 'react';
import './About.css';

const About = () => {
  const [aboutData, setAboutData] = useState({
    bio1: "Hi, I'm Audrey, a dedicated Industrial Engineering student at Universitas Gadjah Mada (UGM). I have a strong passion for solving complex operational problems and creating highly efficient systems processes.",
    bio2: "My approach blends analytical thinking with practical problem-solving. I specialize in supply chain management, operational research, data analysis, and lean manufacturing principles. I am eager to apply my knowledge to drive continuous improvement in real-world scenarios.",
    skills: []
  });

  useEffect(() => {
    fetch('/api/get-content?section=about')
      .then(res => { if(res.ok) return res.json(); throw new Error(); })
      .then(data => setAboutData(data))
      .catch(() => console.log('Using default about data'));
  }, []);

  return (
    <section id="about" className="section bg-secondary">
      <div className="container">
        <h2 className="section-title">About Me</h2>
        <div className="about-content">
          <div className="about-text">
            <p>{aboutData.bio1}</p>
            <p>{aboutData.bio2}</p>
          </div>
          <div className="about-skills">
            <h3>Key Skills</h3>
            <div className="skill-bars">
              {aboutData.skills?.map((skill, index) => (
                <div key={index} className="skill-bar">
                  <div className="skill-info">
                    <span className="skill-name">{skill.name}</span>
                    <span className="skill-percentage">{skill.percentage}%</span>
                  </div>
                  <div className="progress-bg">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${skill.percentage}%` }}
                    ></div>
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
