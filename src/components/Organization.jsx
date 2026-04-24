import { useState, useEffect } from 'react';

const Organization = ({ onLoaded }) => {
  const [organizations, setOrganizations] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetch('/api/get-content?section=organization')
      .then(res => { if (res.ok) return res.json(); throw new Error(); })
      .then(data => { if (Array.isArray(data)) setOrganizations(data); })
      .catch(() => console.log('Using default organization data'));
  }, []);

  if (organizations.length === 0) return null;

  const displayedItems = showAll ? organizations : organizations.slice(0, 3);

  return (
    <section id="organization" className="section timeline-section bg-secondary">
      <div className="container">
        <h2 className="section-title">Organization</h2>
        <div className="timeline">
          {displayedItems.map((org) => (
            <div key={org.id} className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <h3>{org.role}</h3>
                  <span className="timeline-period">{org.period}</span>
                </div>
                <h4 className="timeline-company">{org.org}</h4>
                <p>{org.description}</p>
              </div>
            </div>
          ))}
        </div>
        {organizations.length > 3 && (
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

export default Organization;
