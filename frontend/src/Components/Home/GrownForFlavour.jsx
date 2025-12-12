import React from "react";
import "./GrownForFlavour.css";
import maize from "../../Images/maize.jpeg";
import tractorRed from "../../Images/tractorRed.jpg";
import onions from "../../Images/onions.jpeg";
import HeroImage from "../../Images/HeroImage.jpeg";

export default function GrownForFlavour() {
  const cards = [
    {
      img: onions,
      text: "Farming sustainably is at the heart of all we do,looking after our soil, wildlife, and water sources. We think that small-scale farming tastes best.",
    },
  {
    img: tractorRed,
    text: "Anything we can't grow or make ourselves comes from our group of organic growers and producers who share our values.",
  },

    {
      img: maize,
      text: "Working with them over the long-term means that our food is completely traceable and we are supporting farmers who do the right thing.",
    },
  ];
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&display=swap" rel="stylesheet"></link>

  return (
    <section className="grown-section">
      <div className="grown-angled-top" aria-hidden="true" />

      <div className="grown-inner">
        <h2 className="grown-title">Grown for flavour</h2>
        {/* <p className="grown-tractor-text">
  {cards[1].text}
</p> */}

        <div className="grown-grid">
          {cards.map((c, idx) => (
            <div className="grown-card" key={idx}>
              <div className="grown-image-wrap">
                <img
                  src={c.img}
                  alt={`grown-${idx + 1}`}
                  className="grown-img"
                />
              </div>
              <p className="grown-card-text">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
