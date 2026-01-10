import React, { useState } from "react";
import "./Aboutfarmlet.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import aboutImage from "../../Images/About.png";

export default function Aboutfarmlet() {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);

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
          <img 
            src={aboutImage} 
            alt="About Farmlet" 
            className="aboutfarmlet-image"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}