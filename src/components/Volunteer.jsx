import { useState, useEffect } from 'react';
import './Volunteer.css';

const Volunteer = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetch('/api/get-content?section=volunteer')
      .then(res => { if(res.ok) return res.json(); throw new Error(); })
      .then(data => { if(Array.isArray(data)) setVolunteers(data); })
      .catch(() => console.log('Using default volunteer data'));
  }, []);

  if (volunteers.length === 0) return null;

  const displayedItems = showAll ? volunteers : volunteers.slice(0, 3);

  return (
    <section id="volunteer" className="section timeline-section bg-secondary">
      <div className="container">
        <h2 className="section-title">Volunteering</h2>
        <div className="timeline">
          {displayedItems.map((vol) => (
            <div key={vol.id} className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <h3>{vol.role}</h3>
                  <span className="timeline-period">{vol.period}</span>
                </div>
                <h4 className="timeline-company">{vol.organization}</h4>
                <p>{vol.description}</p>
              </div>
            </div>
          ))}
        </div>
        {volunteers.length > 3 && (
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

export default Volunteer;
