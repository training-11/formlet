import React, { useState } from "react";
import "./SliderWithHero.css";
import VegBox from "../../Images/hero3.png";
import livelife from "../../Images/livelife.png";

// Mobile Sticky CTA Component - Riverford Style (JSX + CSS in one file)
const MobileStickyBar = () => {
  const handleGetStarted = () => {
    console.log('Get started clicked');
    // Add your navigation/action here
  };

  // Inline styles for the sticky bar
  const barStyle = {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    width: '100vw',
    backgroundColor: '#00b359',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '12px',
    paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
    paddingLeft: '0',
    paddingRight: '0',
    boxSizing: 'border-box',
    zIndex: 9999,
    boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
  };

  // Inline styles for the button
  const buttonStyle = {
    width: '90%',
    maxWidth: '360px',
    height: '48px',
    backgroundColor: 'white',
    color: '#000',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    borderRadius: '4px',
    fontSize: '17px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.2s ease',
    outline: 'none',
  };

  // Only show on mobile screens
 if (typeof window !== "undefined" && window.innerWidth > 1024) {
  return null;
}



  return (
    <div style={barStyle}>
      <button
        style={buttonStyle}
        onClick={handleGetStarted}
        aria-label="Get started with Farmlet"
        onMouseDown={(e) => {
          e.currentTarget.style.transform = 'scale(0.98)';
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 3px 6px rgba(0, 0, 0, 0.12)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.08)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        Get started
      </button>
    </div>
  );
};

const slides = [
  {
    percent: "92%",
    lines: [
      "of customers say",
      "Farmlet's fruit & veg boxes",
      "make eating fruit & veg",
    ],
    highlight: "easier and tastier",
    bottom: "for their family",
  },
  {
    percent: "97%",
    lines: [
      "of customers say",
      "Farmlet's fruit & veg boxes help",
      "their family",
    ],
    highlight: "eat more healthily",
  },
  {
    percent: "90%",
    lines: [
      "of customers say",
      "Farmlet's fruit & veg boxes help their family",
    ],
    highlight: "reduce ultra-processed foods",
    bottom: "in their diet",
  },
];

export default function SliderWithHero() {
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((index - 1 + slides.length) % slides.length);
  const next = () => setIndex((index + 1) % slides.length);

  const s = slides[index];

  return (
    <>
      <div className="hero-container">
        <div className="hero-slide">
          <button className="arrow left" onClick={prev}>
            ❮
          </button>
          <button className="arrow right" onClick={next}>
            ❯
          </button>

          <h1 className="percent">{s.percent}</h1>

          {s.lines.map((t, i) => (
            <p key={i} className="line">
              {t}
            </p>
          ))}

          <div className="highlight">{s.highlight}</div>

          {s.bottom && <p className="line">{s.bottom}</p>}
        </div>
        <div className="hero-bottom">
          <img src={VegBox} alt="veg" className="veg-img" />
          <p className="join">Join the thousands of families who</p>
          <img src={livelife} alt="Live Life on the Veg" className="livelife-img" />
          <button className="start-btn desktop-cta">Get started</button>
        </div>
      </div>
      
      {/* Mobile Sticky CTA Bar */}
      <MobileStickyBar />
    </>
  );
}