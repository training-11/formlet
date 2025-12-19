import React, { useState } from "react";
import "./PauseDeliveryModal.css";
import { useAuth } from "../../Context/AuthContext";

export default function PauseDeliveryModal({ onClose, scheduleData, onPauseSuccess }) {
    const { currentUser } = useAuth();
    const [selectedDate, setSelectedDate] = useState("");
    const [loading, setLoading] = useState(false);

    // Get next available delivery dates from scheduleData
    // Filter unique dates
    const availableDates = Array.from(new Set(scheduleData.map(item => item.date)));

    const handleConfirm = async () => {
        if (!selectedDate) {
            alert("Please select a date to pause.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${window.ENV.BACKEND_API}/api/order/pause`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: currentUser.id || currentUser._id,
                    date: selectedDate
                })
            });

            if (response.ok) {
                alert("Delivery paused successfully.");
                if (onPauseSuccess) onPauseSuccess();
                onClose();
            } else {
                const data = await response.json();
                alert(data.message || "Failed to pause delivery.");
            }
        } catch (error) {
            console.error("Pause Error:", error);
            alert("An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pause-modal-overlay">
            <div className="pause-modal-container">
                <button className="pause-close-btn" onClick={onClose}>×</button>

                <h2 className="pause-title">Pause deliveries</h2>
                <div className="pause-underline"></div>

                <p className="pause-description">
                    You can pause your deliveries for upsoming dates.
                    <br />
                    Please note that setting a pause won't change your delivery schedule, it will only stop any orders from being delivered on the date you choose.
                </p>

                <h3 className="pause-subtitle">Choose your paused deliveries</h3>

                <div className="pause-selection">
                    <label className="pause-label">Select delivery date to pause</label>
                    <select
                        className="pause-select"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    >
                        <option value="">-- Select Date --</option>
                        {availableDates.map(date => (
                            <option key={date} value={date}>
                                {new Date(date).toDateString()}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    className="pause-confirm-btn"
                    onClick={handleConfirm}
                    disabled={loading || !selectedDate}
                >
                    {loading ? "Processing..." : "Confirm pause"}
                </button>

                <button className="pause-cancel-link" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
}
