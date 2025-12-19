import React, { useState } from "react";
import "./ChangePostcodeModal.css";
import { useAuth } from "../../Context/AuthContext";

export default function ChangePostcodeModal({ onClose, onSignIn }) {
    const { verifyPincode, isAuthenticated } = useAuth();
    const [pincode, setPincode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const calculateDates = (dayName) => {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const targetDayIndex = days.indexOf(dayName);

        if (targetDayIndex === -1) return null;

        const today = new Date();
        const currentDayIndex = today.getDay(); // 0-6

        let daysUntil = targetDayIndex - currentDayIndex;
        if (daysUntil <= 0) {
            daysUntil += 7; // Delivery is next week
        }

        const nextDeliveryDate = new Date(today);
        nextDeliveryDate.setDate(today.getDate() + daysUntil);

        // Cutoff: 2 days before at 11:45 PM
        const cutoffDate = new Date(nextDeliveryDate);
        cutoffDate.setDate(nextDeliveryDate.getDate() - 2);

        // Format dates
        const options = { day: 'numeric', month: 'short' };
        const nextDeliveryStr = nextDeliveryDate.toLocaleDateString('en-GB', options);

        const cutoffDayName = days[cutoffDate.getDay()].substring(0, 3); // Mon
        const cutoffDateStr = cutoffDate.toLocaleDateString('en-GB', options); // 9th Dec

        return {
            nextDelivery: nextDeliveryStr,
            cutoffDay: cutoffDayName,
            cutoffDate: cutoffDateStr
        };
    };

    const handleSubmit = async () => {
        if (!pincode || pincode.length !== 6) {
            setError("Please enter a valid 6-digit postcode");
            return;
        }
        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${window.ENV.BACKEND_API}/api/pincode/check`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pincode }),
            });

            const data = await response.json();

            if (response.ok) {
                const dates = calculateDates(data.deliveryDay);
                const fullDetails = { ...data, ...dates };
                verifyPincode(fullDetails);
                onClose(); // Close on success
            } else {
                setError("Sorry, we don't deliver to this area yet.");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="postcode-modal-overlay" onClick={onClose}>
            <div className="postcode-modal-container" onClick={(e) => e.stopPropagation()}>
                <button className="postcode-close-btn" onClick={onClose}>×</button>

                <div className="postcode-header">
                    {/* Placeholder for the calendar/house graphic from screenshot */}
                    <div className="header-graphic-placeholder">
                        <span className="graphic-icon">📅</span>
                        <h2 className="postcode-title">Change postcode</h2>
                    </div>
                </div>

                <div className="postcode-body">
                    <div className="warning-box">
                        Changing your delivery postcode may also change your delivery day and/or the contents of some boxes.
                    </div>

                    <label className="postcode-label">Postcode</label>
                    <input
                        type="text"
                        className="postcode-input"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                    />

                    {error && <p className="postcode-error">{error}</p>}

                    <button className="postcode-enter-btn" onClick={handleSubmit} disabled={loading}>
                        {loading ? "Checking..." : "Enter"}
                    </button>

                    {!isAuthenticated && (
                        <div className="postcode-footer">
                            Already have an account? <span className="signin-link" onClick={onSignIn}>Sign in</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
