import { useState, useEffect } from 'react';
import './Experience.css'; // Assuming this uses the same CSS file name or index.css for list containers

const Experience = ({ onLoaded }) => {
  const [experiences, setExperiences] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetch('/api/get-content?section=experience')
      .then(res => { if(res.ok) return res.json(); throw new Error(); })
      .then(data => { if(Array.isArray(data)) setExperiences(data); })
      .catch(() => console.log('Using default experience data'));
  }, []);

  if (experiences.length === 0) return null;

  const displayedItems = showAll ? experiences : experiences.slice(0, 3);

  return (
    <section id="experience" className="section timeline-section">
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
