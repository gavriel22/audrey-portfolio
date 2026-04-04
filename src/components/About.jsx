import './About.css';

const About = () => {
  return (
    <section id="about" className="section about">
      <div className="container">
        <h2 className="section-title">About Me</h2>
        <div className="about-content">
          <div className="about-text">
            <p>
              Hi, I'm Audrey, a dedicated Industrial Engineering student at Universitas Gadjah Mada (UGM). I have a strong passion for solving complex operational problems and creating highly efficient systems processes. 
            </p>
            <p>
              My approach blends analytical thinking with practical problem-solving. I specialize in supply chain management, operational research, data analysis, and lean manufacturing principles. I am eager to apply my knowledge to drive continuous improvement in real-world scenarios.
            </p>
          </div>
          <div className="about-skills">
            <h3>Core Skills</h3>
            <div className="skill-bars">
              <div className="skill-bar">
                <div className="skill-info">
                  <span>Data Analysis (Python & Excel)</span>
                  <span>90%</span>
                </div>
                <div className="progress-bg">
                  <div className="progress-fill" style={{ width: '90%' }}></div>
                </div>
              </div>
              <div className="skill-bar">
                <div className="skill-info">
                  <span>Operations Research</span>
                  <span>85%</span>
                </div>
                <div className="progress-bg">
                  <div className="progress-fill" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div className="skill-bar">
                <div className="skill-info">
                  <span>Supply Chain Management</span>
                  <span>80%</span>
                </div>
                <div className="progress-bg">
                  <div className="progress-fill" style={{ width: '80%' }}></div>
                </div>
              </div>
              <div className="skill-bar">
                <div className="skill-info">
                  <span>Lean Six Sigma</span>
                  <span>85%</span>
                </div>
                <div className="progress-bg">
                  <div className="progress-fill" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
