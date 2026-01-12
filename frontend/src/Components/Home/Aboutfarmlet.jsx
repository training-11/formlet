import React, { useState, useEffect } from "react";
import "./Aboutfarmlet.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import aboutImage from "../../Images/about.png";

export default function Aboutfarmlet() {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);

  // 🔑 PRELOAD IMAGE AS SOON AS COMPONENT IS CALLED
  useEffect(() => {
    const img = new Image();
    img.src = aboutImage;
  }, []);

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
       
        </div>
      </div>
      <img
  src="/Images/About.png"
  alt="About Farmlet"
  className="aboutfarmlet-image"
  loading="eager"
  decoding="sync"
/>

  


      <Footer />
    </div>
  );
}
