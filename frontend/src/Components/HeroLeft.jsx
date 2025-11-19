import React from "react";
import "./HeroLeft.css";

export default function HeroLeft() {
  return (
    <div className="hero-left">
      <h1 className="hero-title">
        Fresh fruit & veg at
        <br />
        its seasonal best
      </h1>

      <div className="hero-sub">
        <p>Always free delivery.</p>
        <p>Easy to skip or pause an order.</p>
      </div>

      {/* <div className="trust">
        <div className="trust-left">★ Trustpilot</div>
        <div className="trust-text">
          Trustscore <strong>4.8</strong> out of <strong>19538</strong> reviews
        </div>
      </div> */}
    </div>
  );
}
