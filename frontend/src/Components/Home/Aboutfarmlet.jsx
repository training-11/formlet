import React, { useState, useEffect } from "react";
import "./Aboutfarmlet.css";

/* ✅ FIXED PATHS */
import Navbar from "./Navbar";
import Footer from "./Footer";

/* ✅ IMAGE IMPORT (SRC METHOD) */
import aboutImage from "../../Images/Farmletabout.webp";

export default function Aboutfarmlet() {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = aboutImage;
    img.onload = () => setImageLoaded(true);
  }, [aboutImage]);

  return (
    <div className="aboutfarmlet-page">
      <Navbar
        mobileSearchOpen={mobileSearchOpen}
        setMobileSearchOpen={setMobileSearchOpen}
        signInOpen={signInOpen}
        setSignInOpen={setSignInOpen}
      />

      <div className="aboutfarmlet-container">
        <div className="aboutfarmlet-content">
          {!imageLoaded && <div className="aboutfarmlet-skeleton" />}

          <img
            src={aboutImage}
            alt="About Farmlet"
            className={`aboutfarmlet-image ${
              imageLoaded ? "loaded" : "loading"
            }`}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}
