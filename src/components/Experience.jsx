import { useState, useEffect } from 'react';
import './Experience.css';

const Experience = () => {
  const [experiences, setExperiences] = useState([
    {
      id: 1,
      role: "Supply Chain Analyst Intern",
      company: "PT Astra Honda Motor",
      period: "Jul 2025 - Sep 2025",
      description: "Analyzed material flow layout to reduce transportation waste. Implemented Lean Manufacturing methodologies resulting in a 15% improvement in logistics efficiency."
    },
    {
      id: 2,
      role: "Operations Management Project",
      company: "UGM Laboratory",
      period: "Feb 2025 - Jun 2025",
      description: "Designed a simulation model in Arena to optimize queuing systems at a major manufacturing plant, reducing average wait times by 20 minutes."
    },
    {
      id: 3,
      role: "Production Planning Intern",
      company: "FMCG Company",
      period: "Jul 2024 - Aug 2024",
      description: "Assisted in demand forecasting using historical sales data and Excel VBA, reducing stockout events across 3 main distribution centers."
    }
  ]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('portfolio_experiences');
    if (saved) {
      setExperiences(JSON.parse(saved));
    }
  }, []);

  if (experiences.length === 0) return null;

  const displayedItems = showAll ? experiences : experiences.slice(0, 3);

  return (
    <section id="experience" className="section experience">
      <div className="container">
        <h2 className="section-title">Experience</h2>
        <div className="timeline">
          {displayedItems.map((exp) => (
            <div key={exp.id} className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <h3>{exp.role}</h3>
                  <span className="timeline-period">{exp.period}</span>
                </div>
                <h4 className="timeline-company">{exp.company}</h4>
                <p>{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
        {experiences.length > 3 && (
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button className="btn-show-more" onClick={() => setShowAll(!showAll)}>
              {showAll ? 'Show Less ⬆' : 'Show More ⬇'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Experience;
