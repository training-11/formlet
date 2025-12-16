import React from "react";
import "./ThankYouModal.css";

export default function ThankYouModal({ onClose }) {
    return (
        <div className="thankyou-modal-overlay">
            <div className="thankyou-modal-container">
                <div className="thankyou-icon">🎉</div>
                <h2 className="thankyou-title">Thank you for shopping!</h2>
                <div className="thankyou-underline"></div>

                <p className="thankyou-message">
                    Your order has been placed successfully.<br />
                    We have sent a confirmation email to you.
                </p>

                <button className="thankyou-ok-btn" onClick={onClose}>
                    OK
                </button>
            </div>
        </div>
    );
}
