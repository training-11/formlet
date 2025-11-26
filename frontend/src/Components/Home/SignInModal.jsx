import React from "react";
import "./SignInModal.css";
import farmletLogo from "../../Images/Logo 1.png"; // change path if needed

export default function SignInModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button className="modal-close" onClick={onClose}>×</button>

        {/* LEFT SIDE */}
        <div className="modal-left">
          <h2 style={{ fontFamily: "Amatic SC", fontSize: "50px", marginBottom: "5px" }}>Sign in</h2>
          {/* <h2>Sign in</h2> */}
          <div className="underline"></div>
          <p className="modal-subtext">
            Enter your details below to sign in to your Farmlet account
          </p>

          <label>Email</label>
          <input className="inputs" type="email" placeholder="Enter Email" />

          <label>Password</label>
          <div className="password-box">
            <input className="inputs"  type="password" placeholder="Enter Password" />
            <span className="show-btn">Show</span>
          </div>

          <button className="green-btn">Sign in</button>

          <p className="forgot">Forgotten password?</p>
        </div>

        {/* RIGHT SIDE */}
        <div className="modal-right">
          <img src={farmletLogo} alt="Farmlet logo" className="modal-logo" />
          <h3 style={{ fontFamily: "Amatic SC", fontSize: "50px" , marginBottom: "5px"}}>New to Farmlet?</h3>
          <div className="underline2"></div>

          <p className="modal-subtext">
            Find out your delivery day to start shopping...
          </p>

          <label>Enter postcode</label>
          <input className="inputs" type="text" placeholder="ex: 560001" />

          <button className="green-btn">Show my delivery day</button>
        </div>
      </div>
    </div>
  );
}