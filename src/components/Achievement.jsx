import { useState, useEffect } from 'react';
import './Achievement.css';

const Achievement = () => {
  const [achievements, setAchievements] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('portfolio_achievements');
    if (saved) {
      setAchievements(JSON.parse(saved));
    } else {
      setAchievements([
        {
          id: 1,
          title: "1st Winner National Business Case",
          context: "National Level Competition",
          year: "2024",
          description: "Developed a comprehensive supply chain optimization strategy to handle a simulated crisis for a top FMCG company."
        },
        {
          id: 2,
          title: "Outstanding Academic Award",
          context: "University",
          year: "2023",
          description: "Awarded to the top 5% of students in the Industrial Engineering cohort with exceptional GPA and extracurricular activities."
        }
      ]);
    }
  }, []);

  if (achievements.length === 0) return null;

  const displayedItems = showAll ? achievements : achievements.slice(0, 3);

  return (
    <section id="achievement" className="section achievement">
      <div className="container">
        <h2 className="section-title">Achievements</h2>
        <div className="achievement-grid">
          {displayedItems.map((item) => (
            <div key={item.id} className="achievement-card">
              <div className="achievement-header">
                <h3>{item.title}</h3>
                <span className="achievement-year">{item.year}</span>
              </div>
              <h4 className="achievement-context">{item.context}</h4>
              <p>{item.description}</p>
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
