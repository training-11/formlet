import React, { useState } from "react";
import "./SignInModal.css";
import farmletLogo from "../../Images/Logo 1.png";

export default function SignInModal({ open, onClose }) {
  const [showPassword, setShowPassword] = useState(false);

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button className="modal-close" onClick={onClose}>×</button>

        {/* LEFT SIDE */}
        <div className="modal-left">
          <h2 className="modal-title">Sign in</h2>
          <div className="underline"></div>
          <p className="modal-subtext-center">
            Enter your details below to sign in to your Farmlet account
          </p>

          <label className="label-text">Email</label>
          <input className="input-box" type="email" placeholder="Enter Email" />

          <label className="label-text">Password</label>
         
          <div className="password-box">
  <input
    className="inputs"
    type={showPassword ? "text" : "password"}
    placeholder="Enter Password"
  />
  <span className="show-btn" onClick={() => setShowPassword(!showPassword)}>
    {showPassword ? "Hide" : "Show"}
  </span>
</div>


          <button className="small-btn">Sign in</button>

          <p className="forgot-link">Forgotten password?</p>
        </div>

        {/* RIGHT SIDE */}
        <div className="modal-right">
          <img src={farmletLogo} alt="Farmlet" className="side-logo" />

          <h3 className="modal-title">New to Farmlet?</h3>
          <div className="underline"></div>

          <p className="modal-subtext-center">
            Find out your delivery day to start shopping...
          </p>

          <label className="label-text">Enter postcode</label>
          <input className="input-box" type="text" placeholder="ex: 560001" />

          <button className="small-btn">Show my delivery day</button>
        </div>

      </div>
    </div>
  );
}
