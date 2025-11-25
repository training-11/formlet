import React from "react";
import HeroLeft from "./HeroLeft";
import HeroRight from "./HeroRight";
import HeroCTA from "./HeroCTA";
import HeroCurve from "./HeroCurve";
import HeroFeatures from "./HeroFeatures";
import "./Hero.css";
import bgImage from "../../Images/background1.png";


export default function Hero() {
  return (
    <section className="hero">
       <img src={bgImage} alt="background" />
      <div className="hero-inner">
        <HeroLeft />
        <HeroRight />
      </div>

      <HeroCTA />
      {/* <HeroCurve /> */}
      <HeroFeatures />
    </section>
  );
}
