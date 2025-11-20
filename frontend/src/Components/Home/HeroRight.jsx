import React from "react";
import "./HeroRight.css";

import HeroImage from "../../Images/HeroImage.jpeg";

export default function HeroRight() {
  return (
    <div className="hero-right">
      <img src={HeroImage} alt="Veg box" />
    </div>
  );
}
