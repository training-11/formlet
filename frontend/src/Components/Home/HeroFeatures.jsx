import React from "react";
import "./HeroFeatures.css";

export default function HeroFeatures() {
  return (
    <div className="hero-features">
      <div className="feature-box">
        <img src="../../images/farmers.png" alt="tractor" />
        <p>
          Direct from
          <br />
          farmers
        </p>
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
       <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin></link>
       <link href="https://fonts.googleapis.com/css2?family=Amatic+SC:wght@400;700&display=swap" rel="stylesheet"></link>
      </div>

      <div className="feature-box">
        <img src="../../images/Organic.png" alt="organic icon" className="feature-icon" />
        <p>
          100%
          <br />
          organic
        </p>
      </div>

      <div className="feature-box">
        <img src="../../images/chemicals.png" alt="no chemicals icon" />
        <p>
          No artificial
          <br />
          chemicals
        </p>
      </div>
    </div>
  );
}
