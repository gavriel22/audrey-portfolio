import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Experience from '../components/Experience';
import Organization from '../components/Organization';
import Achievement from '../components/Achievement';
import Volunteer from '../components/Volunteer';
import Portfolio from '../components/Portfolio';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const Home = () => {
  const [componentsLoaded, setComponentsLoaded] = useState(0);
  const totalComponents = 8;
  const isLoaded = componentsLoaded >= totalComponents;

  const handleLoaded = () => {
    setComponentsLoaded(prev => prev + 1);
  };

  useEffect(() => {
    // Menghindari stuck loader jika database timeout
    const timeout = setTimeout(() => setComponentsLoaded(totalComponents), 7000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <div className={`global-loading-overlay ${isLoaded ? 'loaded' : ''}`}>
        <div className="spinner"></div>
        <div className="loading-text">Menyiapkan halaman Audrey...</div>
      </div>

      <Navbar />
      <div className={`page-content-wrapper ${isLoaded ? 'visible' : ''}`}>
        <main>
          <Hero onLoaded={handleLoaded} />
          <About onLoaded={handleLoaded} />
          <Experience onLoaded={handleLoaded} />
          <Achievement onLoaded={handleLoaded} />
          <Organization onLoaded={handleLoaded} />
          <Volunteer onLoaded={handleLoaded} />
          <Portfolio onLoaded={handleLoaded} />
          <Contact onLoaded={handleLoaded} />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Home;
