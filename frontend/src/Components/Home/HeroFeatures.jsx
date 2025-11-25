import React from "react";
import "./HeroFeatures.css";

import farmers from "../../Images/farmers.png";
import organic from "../../Images/organic.jpeg";
import chemicals from "../../Images/chemicals.png";
// HeroFeatures6.jpg

export default function HeroFeatures() {
  return (
    <div className="hero-features">
      <div className="feature-box">
        <img src={farmers} alt="tractor" />
        <p>
          Direct from
          <br />
          farmers
        </p>

        {/* fonts start */}
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossorigin
        ></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Amatic+SC:wght@400;700&display=swap"
          rel="stylesheet"
        ></link>
        {/* fonts end */}
      </div>

      <div className="feature-box">
        <img src={organic} alt="organic icon" className="feature-icon" />
        <p>
          100%
          <br />
          organic
        </p>
      </div>

      <div className="feature-box">
        <img src={chemicals} alt="no chemicals icon" />
        <p>
          No artificial
          <br />
          chemicals
        </p>
      </div>
    </div>
  );
}
