import React from 'react';
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
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Experience />
        <Achievement />
        <Organization />
        <Volunteer />
        <Portfolio />
        <Contact />
      </main>
      <Footer />
    </>
  );
};

export default Home;
