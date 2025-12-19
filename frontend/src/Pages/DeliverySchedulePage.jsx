import React, { useState, useEffect } from "react";
import "./DeliverySchedulePage.css";
import { useAuth } from "../Context/AuthContext";
import Navbar from "../Components/Home/Navbar";
import Footer from "../Components/Home/Footer";
import { useNavigate } from "react-router-dom";
import PauseDeliveryModal from "../Components/Home/PauseDeliveryModal";
import DeliveryFAQs from "./DeliveryFAQs";

export default function DeliverySchedulePage() {
    const { currentUser, isAuthenticated } = useAuth();
    const [scheduleData, setScheduleData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedDates, setExpandedDates] = useState({});
    const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            // Redirect logic if needed
        }
    }, [isAuthenticated, loading]);

    useEffect(() => {
        if (currentUser) {
            fetchMySchedule();
        } else {
            setLoading(false);
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

            // If any item is paused, the whole day is paused (simplification, or check all)
            // But since we pause per DATE, all items on that date should assume the paused state.
            if (ev.isPaused) {
                grouped[dateKey].isPaused = true;
            }
        });

        // Convert to Array and Sort
        const scheduleArray = Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date));
        setScheduleData(scheduleArray);
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
        <div className="delivery-schedule-page">
            <Navbar />

            {/* Main Layout */}
            <div className="main-layout" style={{ display: "flex", minHeight: "80vh", flexDirection: 'column' }}>

                {/* Content Area - Full Width now */}
                <div className="content-area" style={{ flexGrow: 1, padding: "20px" }}>
                    <div className="schedule-page-container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                        <div className="schedule-top-bar" style={{ position: 'relative', marginBottom: '30px', textAlign: 'center' }}>
                            <div className="schedule-title-section">
                                <h2 className="schedule-title">Your delivery schedule</h2>
                                <p className="schedule-subtitle">View and manage your upcoming deliveries</p>
                            </div>
                            {scheduleData.length > 0 && (
                                <button
                                    className="pause-deliveries-btn"
                                    onClick={() => setIsPauseModalOpen(true)}
                                    style={{
                                        position: 'absolute',
                                        right: 0,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        border: '1px solid #333',
                                        background: 'transparent',
                                        padding: '8px 16px',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <span style={{ fontWeight: 'bold' }}>||</span> Pause deliveries
                                </button>
                            )}
                        </div>

                        <div className="schedule-list">
                            {loading ? (
                                <p style={{ textAlign: "center", padding: "40px" }}>Loading schedule...</p>
                            ) : !currentUser ? (
                                <div className="empty-schedule">
                                    <h3>Please sign in</h3>
                                    <p>You need to be logged in to view your delivery schedule.</p>
                                </div>
                            ) : scheduleData.length === 0 ? (
                                <div className="empty-schedule">
                                    <h3>No upcoming deliveries</h3>
                                    <p>Start shopping to fill up your calendar!</p>
                                    <button
                                        onClick={() => navigate('/products/fresh-fruits')}
                                        style={{
                                            marginTop: '20px',
                                            padding: '10px 20px',
                                            background: '#0f4d2a',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Browse Shop
                                    </button>
                                </div>
                            ) : (
                                scheduleData.map((dayGroup) => {
                                    const isExpanded = expandedDates[dayGroup.date];

                                    return (
                                        <div className="date-card" key={dayGroup.date} style={dayGroup.isPaused ? { opacity: 0.6, backgroundColor: '#f9f9f9' } : {}}>
                                            <div className="date-card-flex">
                                                {/* Left Green Date Box */}
                                                <div className="date-box" style={dayGroup.isPaused ? { backgroundColor: '#ccc' } : {}}>
                                                    <span className="date-day">{getDayName(dayGroup.date)}</span>
                                                    <span className="date-number">{getDayNumber(dayGroup.date)}</span>
                                                    <span className="date-month">{getMonthName(dayGroup.date)}</span>
                                                </div>

                                                {/* Right Content */}
                                                <div className="date-content">
                                                    {/* Summary Row */}
                                                    <div className="summary-row">
                                                        {dayGroup.isPaused ? (
                                                            <div className="item-count" style={{ color: '#d9534f', fontWeight: 'bold' }}>
                                                                PAUSED
                                                            </div>
                                                        ) : (
                                                            <div className="item-count">
                                                                {dayGroup.totalItems} {dayGroup.totalItems === 1 ? "item" : "items"}
                                                            </div>
                                                        )}

                                                        <div className="total-price" style={{ textDecoration: dayGroup.isPaused ? 'line-through' : 'none' }}>
                                                            ₹{dayGroup.totalPrice.toFixed(2)}
                                                        </div>

                                                        {/* Toggle Details */}
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
                                                                    <img src={getImageUrl(item.image)} alt={item.product} className="detail-img" style={{ filter: dayGroup.isPaused ? 'grayscale(100%)' : 'none' }} />
                                                                    <div className="detail-name">
                                                                        {item.product}
                                                                        {item.isSubscription && <span style={{ display: 'block', fontSize: '11px', color: '#0f4d2a' }}>Subscription</span>}
                                                                    </div>
                                                                    <div className="detail-qty-group">
                                                                        <div className="detail-qty">Qty {item.quantity}</div>
                                                                    </div>
                                                                    <div className="detail-price">
                                                                        {item.price}
                                                                    </div>
                                                                </div>
                                                            ))}
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
            </div>

            {/* FAQs Section */}
            <div style={{ marginTop: '60px' }}>
                <DeliveryFAQs />
            </div>

            <Footer />

            {isPauseModalOpen && (
                <PauseDeliveryModal
                    onClose={() => setIsPauseModalOpen(false)}
                    scheduleData={scheduleData}
                    onPauseSuccess={fetchMySchedule}
                />
            )}

        </div>
    );
}
