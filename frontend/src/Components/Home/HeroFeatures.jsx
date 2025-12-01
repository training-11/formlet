import React from "react";
import "./HeroFeatures.css";

import farmers from "../../Images/farmers.png";
import organic from "../../Images/organic.jpeg";
import chemicals from "../../Images/chemicals.png";

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
      </div>

      <div className="feature-box organic-box">
        <img src={organic} alt="organic icon" />
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
