import './Portfolio.css';

const Portfolio = () => {
  const projects = [
    {
      id: 1,
      title: "Assembly Line Simulation",
      description: "A digital twin simulation built using FlexSim to identify bottlenecks in an automotive assembly line.",
      tags: ["System Simulation", "Process Optimization"]
    },
    {
      id: 2,
      title: "Inventory Dashboard",
      description: "A business intelligence dashboard mapping real-time warehouse stock levels to forecast demand.",
      tags: ["PowerBI", "Data visualization", "SCM"]
    },
    {
      id: 3,
      title: "Ergonomics Study",
      description: "A comprehensive workplace analysis reducing operator fatigue by adjusting workstation heights.",
      tags: ["Human Factors", "Lean Manufacturing"]
    }
  ];

  return (
    <section id="projects" className="section portfolio">
      <div className="container">
        <h2 className="section-title">Projects</h2>
        <div className="portfolio-grid">
          {projects.map(project => (
            <div key={project.id} className="portfolio-card">
              <div className="card-image-placeholder"></div>
              <div className="card-content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="card-tags">
                  {project.tags.map(tag => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
