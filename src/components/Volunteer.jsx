import { useState, useEffect } from 'react';
import './Volunteer.css';

const Volunteer = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('portfolio_volunteers');
    if (saved) {
      setVolunteers(JSON.parse(saved));
    } else {
      setVolunteers([
        {
          id: 1,
          role: "Event Coordinator",
          organization: "Local Orphanage Care",
          period: "Mar 2024 - Present",
          description: "Organized monthly educational programs and donation drives, impacting over 50 children. Managed communications between 20+ volunteers."
        },
        {
          id: 2,
          role: "Campaign Volunteer",
          organization: "Earth Hour Indonesia",
          period: "Jan 2023 - Apr 2023",
          description: "Assisted in social media awareness campaigns and on-the-ground preparation for the main Earth Hour event."
        }
      ]);
    }
  }, []);

  if (volunteers.length === 0) return null;

  const displayedItems = showAll ? volunteers : volunteers.slice(0, 3);

  return (
    <section id="volunteer" className="section volunteer">
      <div className="container">
        <h2 className="section-title">Volunteer Experience</h2>
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
