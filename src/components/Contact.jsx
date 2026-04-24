import { useState, useEffect } from 'react';
import './Contact.css';

const Contact = ({ onLoaded }) => {
  const [contactData, setContactData] = useState({
    title: "Let's talk about your next project.",
    subtitle: "Whether you have a question or just want to say hi, I'll try my best to get back to you!",
    email: "hello@audrey.com",
    phone: "+62 812 3456 7890",
    linkedin: "https://linkedin.com",
    github: "https://github.com"
  });

  useEffect(() => {
    fetch('/api/get-content?section=contact')
      .then(res => { if(res.ok) return res.json(); throw new Error(); })
      .then(data => setContactData(data))
      .catch(() => console.log('Using default contact data'));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for reaching out! This form UI is currently static.');
  };

  return (
    <section id="contact" className="section contact">
      <div className="container">
        <div className="contact-wrapper">
          <div className="contact-info">
            <h3>{contactData.title}</h3>
            <p>{contactData.subtitle}</p>
            
            <div className="contact-details">
              <div className="contact-item">
                <span className="contact-icon">✉</span>
                <a href={`mailto:${contactData.email}`}>{contactData.email}</a>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <a href={`tel:${contactData.phone}`}>{contactData.phone}</a>
              </div>
              <div className="contact-item">
                <span className="contact-icon">🔗</span>
                <a href={contactData.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
              </div>
              <div className="contact-item">
                <span className="contact-icon">💻</span>
                <a href={contactData.github} target="_blank" rel="noreferrer">GitHub</a>
              </div>
            </div>
          </div>

          <div className="contact-form-container">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" placeholder="John Doe" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="john@example.com" required />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" rows="4" placeholder="Hello, I would like to..." required></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-submit">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
