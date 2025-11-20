import React, { useState } from "react";
import "./SliderWithHero.css";
import VegBox from "../../Images/HeroImage.jpeg";

const slides = [
  {
    percent: "92%",
    lines: [
      "of customers say",
      "myFarmlet's fruit & veg boxes",
      "make eating fruit & veg",
    ],
    highlight: "easier and tastier",
    bottom: "for their family",
  },
  {
    percent: "97%",
    lines: [
      "of customers say",
      "myFarmlet's fruit & veg boxes help",
      "their family",
    ],
    highlight: "eat more healthily",
  },
  {
    percent: "90%",
    lines: [
      "of customers say",
      "myFarmlet's fruit & veg boxes help their family",
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
        <h2 className="big-text">Live Life on the Veg</h2>
        <button className="start-btn">Get started</button>
      </div>
    </div>
  );
}
