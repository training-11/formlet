import React, { useEffect, useState } from "react";
import "./OrderHistoryModal.css";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function OrderHistoryModal({ open, onClose }) {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && currentUser) {
            fetchOrders();
        }
    }, [open, currentUser]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            // Use Id from currentUser (could be id or _id depending on DB)
            const userId = currentUser.id || currentUser._id;
            const response = await fetch(`${window.ENV.BACKEND_API}/api/order/user/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            } else {
                console.error("Failed to fetch orders");
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        onClose();
        // Optional: Navigate to home?
        window.location.reload(); // Simple reload to clear all states cleanly
    };

    if (!open) return null;

    return (
        <div className="order-modal-overlay" onClick={onClose}>
            <div className="order-modal-container" onClick={(e) => e.stopPropagation()}>
                <button className="order-modal-close" onClick={onClose}>×</button>

                <div className="order-modal-header">
                    <h2>My Account</h2>
                    <div className="user-info">
                        <span className="user-name">Hi, {currentUser?.name}</span>
                        <button className="logout-btn" onClick={handleLogout}>Logout</button>
                    </div>
                </div>

                <div className="order-history-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h3>Your Orders</h3>

                    </div>
                    {loading ? (
                        <p>Loading orders...</p>
                    ) : orders.length === 0 ? (
                        <p className="no-orders">You haven't placed any orders yet.</p>
                    ) : (
                        <div className="orders-list">
                            {orders.map((order) => (
                                <div key={order.id} className="order-card">
                                    <div className="order-header">
                                        <span className="order-id">Order #{order.id}</span>
                                        <span className="order-date">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="order-details">
                                        <div className="order-info-row">
                                            <span>Status:</span>
                                            <span className={`status-badge ${order.status}`}>{order.status}</span>
                                        </div>
                                        <div className="order-info-row">
                                            <span>Total:</span>
                                            <span className="order-total">₹{order.total_amount}</span>
                                        </div>
                                        <div className="order-info-row">
                                            <span>Delivery:</span>
                                            <span>{order.delivery_date}</span>
                                        </div>
                                        <div className="order-info-row">
                                            <span>Address:</span>
                                            <span style={{ textAlign: 'right', maxWidth: '200px', fontSize: '13px' }}>{order.delivery_address}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
