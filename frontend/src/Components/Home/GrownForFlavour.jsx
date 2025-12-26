import React from "react";
import "./GrownForFlavour.css";

import maize from "../../Images/maize.jpeg";
import tractorRed from "../../Images/tractorRed.jpg";
import onions from "../../Images/onions.jpeg";

export default function GrownForFlavour() {
  const cards = [
    {
      img: onions,
      text:
        "Farming sustainably is at the heart of all we do, looking after our soil, wildlife, and water sources. We think that small-scale farming tastes best.",
    },
    {
      img: tractorRed,
      text:
        "Anything we can't grow or make ourselves comes from our group of organic growers and producers who share our values.",
    },
    {
      img: maize,
      text:
        "Working with them over the long-term means that our food is completely traceable and we are supporting farmers who do the right thing.",
    },
  ];



  // Tablet-only developer override: show alternate text under a chosen image
  // Set cardIndex to the image you want to pair with the alternate text.
  const tabletTextOverride = {
    enabled: true,
    cardIndex: 0, // use onions card
    text: cards[1].text, // use tractor text as the alternate
  };

  return (
    <section className="grown-section">
      <div className="grown-angled-top" aria-hidden="true" />

      <div className="grown-inner">
        <h2 className="grown-title">Grown for flavour</h2>

        {/* Intro paragraph */}
        <p className="grown-intro">
          <strong>Farming sustainably is at the heart of all we do,</strong>{" "}
          looking after our soil, wildlife, and water sources. We think that
          small-scale organic family farms are the most sustainable way of
          producing food.
        </p>

        <div className="grown-grid">
          {cards.map((c, idx) => {
            const isOverrideCard = tabletTextOverride.enabled && idx === tabletTextOverride.cardIndex;
            return (
            <div className={`grown-card ${isOverrideCard ? 'tablet-override' : ''}`} key={idx}>
              <div className="grown-image-wrap">
                <img
                  src={c.img}
                  alt={`grown-${idx + 1}`}
                  className="grown-img"
                />
              </div>

              <p className="grown-card-text">{c.text}</p>
              {isOverrideCard && (
                <p className="grown-card-text tablet-override-text">{tabletTextOverride.text}</p>
              )}
            </div>
          );})}
        </div>
      </div>
    </section>
  );
}
