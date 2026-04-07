import { useState, useEffect } from 'react';
import './Achievement.css';

const Achievement = () => {
  const [achievements, setAchievements] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetch('/api/get-content?section=achievement')
      .then(res => { if(res.ok) return res.json(); throw new Error(); })
      .then(data => { if(Array.isArray(data)) setAchievements(data); })
      .catch(() => console.log('Using default achievement data'));
  }, []);

  if (achievements.length === 0) return null;

  const displayedItems = showAll ? achievements : achievements.slice(0, 3);

  return (
    <section id="achievement" className="section timeline-section">
      <div className="container">
        <h2 className="section-title">Achievements</h2>
        <div className="timeline">
          {displayedItems.map((ach) => (
            <div key={ach.id} className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <h3>{ach.title}</h3>
                  <span className="timeline-period">{ach.year}</span>
                </div>
                <h4 className="timeline-company">{ach.context}</h4>
                <p>{ach.description}</p>
              </div>
            </div>
          ))}
        </div>
        {achievements.length > 3 && (
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

export default Achievement;
