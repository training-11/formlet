import React, { useState, useEffect } from "react";
import "./IntroPopup.css";
import bgImage from "../../Images/primary-page.png";

export default function IntroPopup() {
  const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
    // const hasSeenPopup = localStorage.getItem("farmletIntroSeen");
 const hasSeenPopup = sessionStorage.getItem("farmletIntroSeen");
    if (!hasSeenPopup) {
      setShowPopup(true);  // Show only first time
    }
  }, []);

    const handleClose = () => {
    // localStorage.setItem("farmletIntroSeen", "true"); 
     sessionStorage.setItem("farmletIntroSeen", "true");
    setShowPopup(false);
  };
//   const handleClose = () => {
//     setShowPopup(false);
//   };

  if (!showPopup) return null;

  
  return (
    <div className="intro-overlay" style={{ backgroundImage: `url(${bgImage})` }}    onClick={handleClose}>
      <div className="intro-content" onClick={(e) => e.stopPropagation()} >

 {/* <button className="close-btn" onClick={handleClose}>
          ✕
        </button> */}

        <h1>Welcome to Farmlet 🌿</h1>

        <p className="intro-subtext">
          We connect customers directly with farmers to deliver fresh, organic,
          chemical-free fruits and vegetables. Our mission is to protect soil,
          support local farmers, and ensure healthy food reaches every home.
        </p>

        <ul className="intro-points">
          <li>🌱 Save the soil from pesticides</li>
          <li>🚜 Support local farmers with fair income</li>
          <li>🏡 Prevent farmers from leaving villages</li>
          <li>👨‍🌾 Encourage next-generation farmers</li>
          <li>🍃 Deliver genuinely organic produce</li>
        </ul>

        <button className="gotit-btn" onClick={handleClose}>
          Got It
        </button>
      </div>
    </div>
  );
}
