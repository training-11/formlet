import React, { useState } from "react";
import "./AddToCartModal.css";
import { useAuth } from "../../Context/AuthContext";

import { getProductImage } from "../../utils/urlHelper";

export default function AddToCartModal({ product, onClose, onConfirm }) {
    const { pincodeDetails } = useAuth();

    // Helper to parse "22nd Dec" format
    const parseDateString = (dateStr) => {
        if (!dateStr) return null;

        // Match "22nd Dec" or "22 Dec"
        const match = dateStr.match(/^(\d+)(?:st|nd|rd|th)?\s+([A-Za-z]+)/);
        if (!match) return null;

        const day = parseInt(match[1], 10);
        const monthStr = match[2];

        const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
        const monthIndex = months.findIndex(m => m.toLowerCase().startsWith(monthStr.toLowerCase()));

        if (monthIndex === -1) return null;

        const now = new Date();
        const currentYear = now.getFullYear();

        // Assume date is for current year first
        let date = new Date(currentYear, monthIndex, day);

        // Handle definite year rollover cases (e.g. Today Dec, Date Jan)
        if (now.getMonth() === 11 && monthIndex === 0) {
            date.setFullYear(currentYear + 1);
        }

        return date;
    };

    // Helper to get next occurrences
    const getNextDeliveryDates = (dayName, nextDeliveryStr, count = 4) => {
        const dates = [];
        let currentDate = null;

        // Try to start from nextDelivery
        const parsedStart = parseDateString(nextDeliveryStr);
        const now = new Date();
        // Reset time for comparison
        now.setHours(0, 0, 0, 0);

        if (parsedStart && parsedStart >= now) {
            // Only use parsed date if it is Today or Future
            currentDate = parsedStart;
        } else {
            // Fallback to calculation from dayName if parsed date is missing or in the past
            if (!dayName || dayName === "Unknown" || dayName === "Checking...") return [];

            const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const targetDayIndex = days.findIndex(d => d.toLowerCase() === dayName.toLowerCase());

            if (targetDayIndex === -1) return []; // Invalid day name

            currentDate = new Date(); // Start from today
            let daysUntil = (targetDayIndex - currentDate.getDay() + 7) % 7;

            currentDate.setDate(currentDate.getDate() + daysUntil);
        }

        // Generate dates
        for (let i = 0; i < count; i++) {
            const day = currentDate.getDate();
            const month = currentDate.toLocaleString('default', { month: 'short' });

            let suffix = "th";
            if (day % 10 === 1 && day !== 11) suffix = "st";
            else if (day % 10 === 2 && day !== 12) suffix = "nd";
            else if (day % 10 === 3 && day !== 13) suffix = "rd";

            dates.push(`${day}${suffix} ${month}`);

            // Add 7 days
            currentDate.setDate(currentDate.getDate() + 7);
        }
        return dates;
    };

    const deliveryDay = pincodeDetails?.deliveryDay || "Unknown";
    const nextDelivery = pincodeDetails?.nextDelivery || "";
    const deliveryDates = getNextDeliveryDates(deliveryDay, nextDelivery);

    const [quantity, setQuantity] = useState(product?.quantity || 1);
    const [frequency, setFrequency] = useState(product?.frequency || "Once only");
    const [selectedDateIndex, setSelectedDateIndex] = useState(() => {
        if (product?.startDate && deliveryDates.length > 0) {
            const idx = deliveryDates.indexOf(product.startDate);
            return idx !== -1 ? idx : 0;
        }
        return 0;
    });

    if (!product) return null;

    const frequencies = [
        "Once only",
        "Every week",
        "Every 2 weeks",
        "Every 3 weeks",
        "Every 4 weeks"
    ];

    // Parse price to calculate total (assuming price is like "₹89.00" or just "89")
    const priceString = String(product.price);
    const unitPrice = parseFloat(priceString.replace(/[^\d.]/g, '')) || 0;
    const totalPrice = (unitPrice * quantity).toFixed(2);
    // Detect currency symbol or default to ₹
    const currencyMatch = priceString.match(/^[^\d]+/);
    const currencySymbol = currencyMatch ? currencyMatch[0].trim() : '₹';

    return (
        <div className="add-modal-overlay" onClick={onClose}>
            <div className="add-modal-container" onClick={(e) => e.stopPropagation()}>

                {/* HEADER WITH IMAGE BACKGROUND */}
                <div className="add-modal-header" style={{ backgroundImage: `url(${getProductImage(product)})` }}>
                    <div className="header-overlay">
                        <h2 className="modal-product-name">{product.name}</h2>
                        <button className="modal-close-icon" onClick={onClose}>×</button>
                    </div>
                </div>

                <div className="add-modal-body">
                    <div className="selection-section">
                        <h3 className="qty-title">How many and how often?</h3>

                        <div className="qty-control">
                            <button
                                className="qty-btn"
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                disabled={quantity <= 1}
                            >
                                −
                            </button>
                            <div className="qty-display">{quantity}</div>
                            <button
                                className="qty-btn"
                                onClick={() => setQuantity(q => q + 1)}
                            >
                                +
                            </button>
                        </div>

                        <div className="modal-price">
                            {currencySymbol}{totalPrice}
                        </div>

                        <div className="frequency-grid">
                            {frequencies.map((freq) => (
                                <button
                                    key={freq}
                                    className={`freq-btn ${frequency === freq ? "active" : ""}`}
                                    onClick={() => setFrequency(freq)}
                                >
                                    {freq}
                                </button>
                            ))}
                        </div>

                        {frequency !== "Once only" && (
                            deliveryDates.length > 0 ? (
                                <div className="date-selector-container">
                                    <button
                                        className="date-arrow"
                                        onClick={() => setSelectedDateIndex(i => Math.max(0, i - 1))}
                                        disabled={selectedDateIndex === 0}
                                    >
                                        &lt;
                                    </button>
                                    <span className="date-display">
                                        from the {deliveryDates[selectedDateIndex]}
                                    </span>
                                    <button
                                        className="date-arrow"
                                        onClick={() => setSelectedDateIndex(i => Math.min(deliveryDates.length - 1, i + 1))}
                                        disabled={selectedDateIndex === deliveryDates.length - 1}
                                    >
                                        &gt;
                                    </button>
                                </div>
                            ) : (
                                <div style={{ fontSize: '13px', color: 'red', marginTop: '10px' }}>
                                    Please check your pincode to see delivery dates.
                                </div>
                            )
                        )}

                        {frequency === "Once only" && (
                            <div className="delivery-info">
                                Arriving on {deliveryDay} {deliveryDates.length > 0 ? deliveryDates[0] : nextDelivery}
                            </div>
                        )}
                    </div>

                    <div className="confirmation-section">
                        <p className="subscription-hint">
                            Want this delivered regularly?<br />
                            Above, select how often you'd like to receive it.
                        </p>

                        <button className="confirm-btn" onClick={() => onConfirm(product, quantity, frequency, frequency !== "Once only" ? deliveryDates[selectedDateIndex] : null)}>
                            Confirm
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
