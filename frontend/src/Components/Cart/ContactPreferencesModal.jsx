import React, { useState } from "react";
import "./ContactPreferencesModal.css";
import { useAuth } from "../../Context/AuthContext";

export default function ContactPreferencesModal({ onClose, onSave }) {
    const { currentUser } = useAuth();
    const [preferences, setPreferences] = useState({
        news: false,
        events: false,
    });

    const handleChange = (e) => {
        setPreferences({ ...preferences, [e.target.name]: e.target.checked });
    };

    return (
        <div className="contact-modal-overlay">
            <div className="contact-modal-container">
                <button className="contact-close-btn" onClick={onClose}>×</button>

                <h2 className="contact-title">Contact preferences</h2>
                <div className="contact-underline"></div>

                <div className="contact-success-msg">
                    {!currentUser && <h3 className="success-heading">Success!</h3>}
                    <p className="success-text">
                        {currentUser
                            ? "It's time to go organic..."
                            : "Your account has been created - it's time to go organic..."}
                    </p>
                </div>

                <div className="contact-divider"></div>

                <p className="contact-intro">
                    We don't like spam - here are some useful emails to make sure you get the right amount of veg in your life.
                    Select below which emails you'd like to receive...
                </p>

                <div className="contact-options">
                    <div className="contact-option">
                        <label htmlFor="news-checkbox">
                            What's in next week's boxes, when new veg is in season and farm news
                        </label>
                        <input
                            type="checkbox"
                            id="news-checkbox"
                            name="news"
                            checked={preferences.news}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="contact-option">
                        <label htmlFor="events-checkbox">
                            Invites to customer events
                        </label>
                        <input
                            type="checkbox"
                            id="events-checkbox"
                            name="events"
                            checked={preferences.events}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <button className="save-preferences-btn" onClick={() => onSave(preferences)}>
                    Save & Continue
                </button>

            </div>
        </div>
    );
}
