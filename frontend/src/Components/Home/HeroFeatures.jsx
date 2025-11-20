import React from "react";
import "./HeroFeatures.css";

export default function HeroFeatures() {
  return (
    <div className="hero-features">
      <div className="feature-box">
        <img src="/icons/tractor.png" alt="tractor" />
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
        <img src="/icons/bee.png" alt="organic" />
        <p>
          100%
          <br />
          organic
        </p>
      </div>

      <div className="feature-box">
        <img src="/icons/chemicals.png" alt="no chemicals" />
        <p>
          No artificial
          <br />
          chemicals
        </p>
      </div>
    </div>
  );
}
