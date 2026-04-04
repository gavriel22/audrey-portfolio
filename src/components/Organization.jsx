import './Organization.css';

const Organization = () => {
  const organizations = [
    {
      id: 1,
      role: "Head of External Affairs",
      org: "HMTI UGM (Himpunan Mahasiswa Teknik Industri)",
      period: "2024 - 2025",
      description: "Led a team of 15 staff members in connecting the student union with 30+ external partners for sponsorships, company visits, and industrial seminars."
    },
    {
      id: 2,
      role: "Logistics Coordinator",
      org: "Industrial Engineering Fair 2024",
      period: "2023 - 2024",
      description: "Coordinated the venue, equipment, and supply chain for a national-scale student event attended by 1,000+ participants."
    }
  ];

  return (
    <section id="organization" className="section organization">
      <div className="container">
        <h2 className="section-title">Organization</h2>
        <div className="timeline">
          {organizations.map((org) => (
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
      </div>
    </section>
  );
};

export default Organization;
