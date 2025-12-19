import React, { useState, useEffect } from "react";
import "./DeliveryScheduleModal.css";
import { useAuth } from "../../Context/AuthContext";

export default function DeliveryScheduleModal({ onClose }) {
    const { currentUser } = useAuth();
    const [scheduleData, setScheduleData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedDates, setExpandedDates] = useState({});

    useEffect(() => {
        if (currentUser) {
            fetchMySchedule();
        }
    }, [currentUser]);

    const fetchMySchedule = async () => {
        const userId = currentUser.id || currentUser._id;
        try {
            const response = await fetch(`${window.ENV.BACKEND_API}/api/order/calendar/${userId}`);
            if (response.ok) {
                const events = await response.json();
                processSchedule(events);
            } else {
                console.error("Failed to fetch schedule");
            }
        } catch (error) {
            console.error("Error fetching schedule:", error);
        } finally {
            setLoading(false);
        }
    };

    const processSchedule = (events) => {
        // Group by Date
        const grouped = {};
        events.forEach((ev) => {
            const dateKey = ev.date;
            if (!grouped[dateKey]) {
                grouped[dateKey] = {
                    date: dateKey,
                    items: [],
                    totalPrice: 0,
                    totalItems: 0,
                };
            }
            grouped[dateKey].items.push(ev);

            // Calculate Price
            const priceVal = parseFloat((ev.price || "0").toString().replace(/[^\d.]/g, ""));
            const qty = parseInt(ev.quantity || 1, 10);
            grouped[dateKey].totalPrice += priceVal * qty;
            grouped[dateKey].totalItems += qty;
        });

        // Convert to Array and Sort
        const scheduleArray = Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date));
        setScheduleData(scheduleArray);

        // Expand first one by default? Or none.
        // setExpandedDates({ [scheduleArray[0]?.date]: true });
    };

    const toggleExpand = (date) => {
        setExpandedDates((prev) => ({
            ...prev,
            [date]: !prev[date],
        }));
    };

    // Helper date formatters
    const getDayName = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-GB", { weekday: "short" }); // Mon
    };

    const getDayNumber = (dateStr) => {
        const d = new Date(dateStr);
        return d.getDate(); // 27
    };

    const getMonthName = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-GB", { month: "short" }); // Jan
    };

    // Helper to ensure image URL path
    const getImageUrl = (url) => {
        if (url && url.startsWith("/uploads")) {
            return `${window.ENV.BACKEND_API}${url}`;
        }
        return url;
    };

    return (
        <div className="schedule-modal-overlay" onClick={onClose}>
            <div className="schedule-modal-container" onClick={(e) => e.stopPropagation()}>
                <button className="schedule-close-btn" onClick={onClose}>×</button>

                <div className="schedule-title-section">
                    <h2 className="schedule-title">Your delivery schedule</h2>
                </div>

                <div className="schedule-list">
                    {loading ? (
                        <p style={{ textAlign: "center" }}>Loading schedule...</p>
                    ) : scheduleData.length === 0 ? (
                        <div className="empty-schedule">
                            <h3>No upcoming deliveries</h3>
                            <p>Start shopping to fill up your calendar!</p>
                        </div>
                    ) : (
                        scheduleData.map((dayGroup) => {
                            const isExpanded = expandedDates[dayGroup.date];

                            return (
                                <div className="date-card" key={dayGroup.date}>
                                    <div className="date-card-flex">
                                        {/* Left Green Date Box */}
                                        <div className="date-box">
                                            <span className="date-day">{getDayName(dayGroup.date)}</span>
                                            <span className="date-number">{getDayNumber(dayGroup.date)}</span>
                                            <span className="date-month">{getMonthName(dayGroup.date)}</span>
                                        </div>

                                        {/* Right Content */}
                                        <div className="date-content">
                                            {/* Summary Row */}
                                            <div className="summary-row">
                                                <div className="item-count">
                                                    {dayGroup.totalItems} {dayGroup.totalItems === 1 ? "item" : "items"}
                                                </div>
                                                <div className="total-price">
                                                    ₹{dayGroup.totalPrice.toFixed(2)}
                                                </div>

                                                {/* Toggle Details (Only if items exist) */}
                                                <div style={{ marginLeft: "auto", paddingLeft: '20px' }}>
                                                    <button className="toggle-details-btn" onClick={() => toggleExpand(dayGroup.date)}>
                                                        {isExpanded ? "Hide details" : "Show details"}
                                                        {isExpanded ? "▲" : "▼"}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Expanded Details */}
                                            {isExpanded && (
                                                <div className="details-section">
                                                    {dayGroup.items.map((item, idx) => (
                                                        <div className="detail-item" key={idx}>
                                                            <img src={getImageUrl(item.image)} alt={item.product} className="detail-img" />
                                                            <div className="detail-name">
                                                                {item.product}
                                                            </div>
                                                            <div className="detail-qty-group">
                                                                <div className="detail-qty">Qty {item.quantity}</div>
                                                            </div>
                                                            <div className="detail-price">
                                                                {/* We assume price stored was unit price string? Need to check */}
                                                                {item.price}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <div className="card-actions">
                                                        {/* Placeholder for Edit/Checkout logic */}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
