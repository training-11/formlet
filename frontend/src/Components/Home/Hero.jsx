import React from "react";
import HeroLeft from "./HeroLeft";
import HeroRight from "./HeroRight";
import HeroCTA from "./HeroCTA";
import HeroCurve from "./HeroCurve";
import HeroFeatures from "./HeroFeatures";
import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero">
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
