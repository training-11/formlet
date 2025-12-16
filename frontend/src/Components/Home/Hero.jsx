import React ,{ useEffect } from "react";
import './Hero.css';
import bgImage from '../../Images/background1.png';
import heroImage from '../../Images/Hero image 1.png';
import HeroFeatures from './HeroFeatures';

export default function Home() {
  useEffect(() => {
  function ensureHeroOrder() {
    const w = window.innerWidth;
    if (w <= 1024) {
      const hero = document.querySelector('section.hero, .hero');
      if (!hero) return;
      const content = hero.querySelector('.hero-content');
      const right = content?.querySelector('.hero-right');
      const btn = content?.querySelector('.hero-button');
      if (content && right && btn) content.insertBefore(btn, right.nextSibling);
    }
  }
  ensureHeroOrder();
  window.addEventListener('resize', ensureHeroOrder);
  return () => window.removeEventListener('resize', ensureHeroOrder);
}, []);

  return (
    <>

<div className="home-container">
      {/* Hero Section */}
      <section className="hero" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="hero-content">
          {/* Left side - Text content */}
          <div className="hero-left">
            <h1 className="hero-title">
              Fresh fruit & veg at<br />
              its seasonal best
            </h1>
            
            <div className="hero-Text">
              <p>Always free delivery.</p>
              <p>Easy to skip or pause an order.</p>
            </div>

            <button className="hero-button">Get started</button>
          </div>

          {/* Right side - Hero Image */}
          <div className="hero-right">
            <img 
              src={heroImage} 
              alt="Fresh vegetable box from Farmlet" 
              className="hero-image"
            />
          </div>
        </div>
      </section>

      {/* Additional sections can be added here */}
    </div>
   
    </>
    
  );
}
