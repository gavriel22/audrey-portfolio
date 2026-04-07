import { useState, useEffect } from 'react';
import './Contact.css';

const Contact = () => {
  const [contactData, setContactData] = useState({
    title: "Let's talk about your next project.",
    subtitle: "Whether you have a question or just want to say hi, I'll try my best to get back to you!",
    email: "hello@audrey.com",
    phone: "+62 812 3456 7890",
    linkedin: "https://linkedin.com",
    github: "https://github.com"
  });

  useEffect(() => {
    const saved = localStorage.getItem('portfolio_contact');
    if (saved) {
      setContactData(JSON.parse(saved));
    }
  }, []);

  return (
    <section id="contact" className="section contact">
      <div className="container">
        <h2 className="section-title">Get In Touch</h2>
        <div className="contact-wrapper">
          <div className="contact-info">
            <h3>{contactData.title}</h3>
            <p>{contactData.subtitle}</p>
            <div className="contact-details">
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <a href={`mailto:${contactData.email}`}>{contactData.email}</a>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📱</span>
                <a href={`tel:${contactData.phone.replace(/\s+/g, '')}`}>{contactData.phone}</a>
              </div>
              <div className="contact-item">
                <span className="contact-icon">🔗</span>
                <a href={contactData.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
              </div>
              <div className="contact-item">
                <span className="contact-icon">🐙</span>
                <a href={contactData.github} target="_blank" rel="noopener noreferrer">GitHub</a>
              </div>
            </div>
          </div>
          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" placeholder="Your Name" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="Your Email" />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" rows="5" placeholder="Your Message"></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Send Message</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
