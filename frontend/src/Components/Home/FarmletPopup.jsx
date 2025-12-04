"use client";
import { useState, useEffect } from "react";
import "./FarmletPopup.css";

export default function FarmletPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem("farmletPopupSeen");

    if (!hasSeen) {
      setOpen(true);
      document.body.style.overflow = "hidden";
    }
  }, []);

  const closePopup = () => {
    setOpen(false);
    localStorage.setItem("farmletPopupSeen", "true");
    document.body.style.overflow = "auto";
  };

  if (!open) return null;

  return (
    <div className="popup-overlay">
      <div className="farmlet-card animate-fadeIn">

        <h2 className="farmlet-title">
          Welcome to Farmlet 🌿
        </h2>

        <p className="farmlet-desc">
          We connect customers directly with farmers to deliver fresh, organic,
          chemical-free fruits and vegetables. Our mission is to protect soil,
          support local farmers, and ensure healthy food reaches every home.
        </p>

        <ul className="farmlet-list">
          <li>🌱 Save the soil from pesticides</li>
          <li>🚜 Support local farmers with fair income</li>
          <li>🏡 Prevent farmers from leaving villages</li>
          <li>👨‍🌾 Encourage next-generation farmers</li>
          <li>🍃 Deliver genuinely organic produce</li>
        </ul>

        <button className="farmlet-btn" onClick={closePopup}>
          Got it
        </button>
      </div>
    </div>
  );
}

