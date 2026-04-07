import { useState, useEffect } from 'react';
import './Portfolio.css';

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    // Memanggil jembatan API Vercel Serverless Function
    fetch('/api/get-projects')
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error("Gagal ambil data:", err));
  }, []);

  if (projects.length === 0) return null;

  const displayedItems = showAll ? projects : projects.slice(0, 3);

  return (
    <section id="projects" className="section portfolio">
      <div className="container">
        <h2 className="section-title">My Projects</h2>
        <div className="portfolio-grid">
          {displayedItems.map(project => (
            <div key={project.id} className="portfolio-card">
              <div className="card-image-placeholder"></div>
              <div className="card-content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                
                {/* Menampilkan link dari API jika ada */}
                {project.link && (
                  <a href={project.link} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{display: 'inline-block', marginTop: '1rem', padding: '8px 16px', fontSize: '0.9rem'}}>
                    View Project
                  </a>
                )}
                
                {project.tags && project.tags.length > 0 && (
                  <div className="card-tags" style={{marginTop: '1rem'}}>
                    {project.tags.map(tag => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Menyimpan logika 'Show More' kita yang sebelumnya */}
        {projects.length > 3 && (
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

export default Portfolio;
