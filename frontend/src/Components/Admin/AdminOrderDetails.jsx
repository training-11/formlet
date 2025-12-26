import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import "./Admin.css"; // Reusing admin styles

export default function AdminOrderDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [order, setOrder] = useState(null);
    const [items, setItems] = useState([]);
    const [deliveryLogs, setDeliveryLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    const fetchOrderDetails = async () => {
        try {
            // Fetch Order Basic Info
            const orderRes = await fetch(`${window.ENV.BACKEND_API}/api/admin/orders/${id}`, {
                headers: { Authorization: `Bearer ${currentUser.token}` }
            });

            if (orderRes.ok) {
                const orderData = await orderRes.json();
                setOrder(orderData);
            }

            // Fetch Items
            const itemsRes = await fetch(`${window.ENV.BACKEND_API}/api/admin/orders/${id}/items`, {
                headers: { Authorization: `Bearer ${currentUser.token}` }
            });

            if (itemsRes.ok) {
                const itemsData = await itemsRes.json();
                setItems(itemsData);
            }

            // Fetch Delivery Logs
            const logsRes = await fetch(`${window.ENV.BACKEND_API}/api/admin/orders/${id}/delivery-logs`, {
                headers: { Authorization: `Bearer ${currentUser.token}` }
            });

            if (logsRes.ok) {
                const logsData = await logsRes.json();
                setDeliveryLogs(logsData);
            }

        } catch (error) {
            console.error("Error fetching details:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        if (!window.confirm(`Are you sure you want to mark this order as ${newStatus}?`)) return;

        try {
            const response = await fetch(`${window.ENV.BACKEND_API}/api/admin/orders/${id}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${currentUser.token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                alert(`Order marked as ${newStatus}`);
                fetchOrderDetails(); // Refresh
            } else {
                alert("Failed to update status");
            }
        } catch (error) {
            console.error("Update error:", error);
        }
    };

    // Helper to parse date string (e.g. "22nd Dec")
    const parseDateString = (dateStr) => {
        if (!dateStr) return null;
        const match = dateStr.match(/^(\d+)(?:st|nd|rd|th)?\s+([A-Za-z]+)/);
        if (!match) return null;
        const day = parseInt(match[1], 10);
        const monthStr = match[2];
        const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
        const monthIndex = months.findIndex(m => m.toLowerCase().startsWith(monthStr.toLowerCase()));
        if (monthIndex === -1) return null;
        const now = new Date();
        const currentYear = now.getFullYear();
        let date = new Date(currentYear, monthIndex, day);
        if (now.getMonth() === 11 && monthIndex === 0) date.setFullYear(currentYear + 1);
        return date;
    };

    // Helper to normalize date for comparison (local YYYY-MM-DD)
    // Actually, since we construct the display string (e.g. "2nd Jan"), we can compare that directly 
    // IF the log stores it that way? 
    // No, log stores YYYY-MM-DD (DATE type).
    // Let's format our generated date to YYYY-MM-DD for checking against logs.
    const toYMD = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const getDeliverySchedule = () => {
        if (!order || items.length === 0) return [];

        // Try to parse start date
        let startDate = null;
        // Case A: ISO Date from DB (YYYY-MM-DD or full timestamp)
        if (order.delivery_date && !isNaN(new Date(order.delivery_date).getTime())) {
            startDate = new Date(order.delivery_date);
        }
        // Case B: String format like "22nd Dec" (Legacy fallback)
        if (!startDate) {
            startDate = parseDateString(order.delivery_date);
        }
        // Case C: Fallback to Order Creation Date
        if (!startDate) {
            startDate = new Date(order.created_at || new Date());
        }

        const schedule = [];
        const numWeeks = 12; // Extended schedule (3 months)

        // Frequency Map (Matches Backend)
        const freqMap = {
            "Every week": 1,
            "Every 2 weeks": 2,
            "Every 3 weeks": 3,
            "Every 4 weeks": 4,
            "Weekly": 1,
            "Bi-Weekly": 2,
            "Monthly": 4,
            "Once only": 0,
            "One-Time": 0
        };

        for (let i = 0; i < numWeeks; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + (i * 7));

            const day = currentDate.getDate();
            const month = currentDate.toLocaleString('default', { month: 'short' });
            let suffix = "th";
            if (day % 10 === 1 && day !== 11) suffix = "st";
            else if (day % 10 === 2 && day !== 12) suffix = "nd";
            else if (day % 10 === 3 && day !== 13) suffix = "rd";
            const dateStrDisplay = `${day}${suffix} ${month}`;
            const dateYMD = toYMD(currentDate);

            // Check if delivered
            const isDelivered = deliveryLogs.some(log => {
                // Ensure robust comparison (YYYY-MM-DD)
                if (!log.delivery_date) return false;
                const logDate = new Date(log.delivery_date);
                if (isNaN(logDate.getTime())) return false; // Invalid date in log
                return toYMD(logDate) === dateYMD;
            });

            const dueItems = items.filter(item => {
                const freqKey = item.frequency ? item.frequency.trim() : "One-Time";
                const interval = freqMap[freqKey]; // Weeks interval

                // Single Delivery (Week 0 only)
                if (interval === 0 || interval === undefined) {
                    return i === 0;
                }

                // Recurring Delivery
                // Check if current week index (i) is a multiple of interval
                return (i % interval) === 0;
            });

            if (dueItems.length > 0) {
                schedule.push({
                    displayDate: dateStrDisplay,
                    isoDate: dateYMD,
                    items: dueItems,
                    isFuture: currentDate > new Date(),
                    isDelivered: isDelivered
                });
            }
        }
        return schedule;
    };

    const handleMarkDelivered = async (isoDate, displayDate) => {
        if (!window.confirm(`Mark items for ${displayDate} as Delivered? This will notify the user.`)) return;

        try {
            // Send ISO date (YYYY-MM-DD) for DB storage, but maybe backend uses displayDate for email??
            // Controller code: uses delivery_date for both email and DB insert.
            // Email says: "Your order ... on ${delivery_date}" -> "2024-01-02" is okay, but "2nd Jan" is nicer.
            // But DB needs YYYY-MM-DD.
            // Let's send YYYY-MM-DD. Email will show YYYY-MM-DD. That's acceptable.

            const response = await fetch(`${window.ENV.BACKEND_API}/api/admin/orders/${id}/notify-delivery`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${currentUser.token}`
                },
                body: JSON.stringify({ delivery_date: isoDate })
            });

            if (response.ok) {
                alert(`Marked as delivered for ${displayDate}`);
                fetchOrderDetails(); // Refresh to update "Done" status
            } else {
                alert("Failed to send notification");
            }
        } catch (error) {
            console.error("Notify error:", error);
        }
    };

    if (loading) return <div className="admin-content">Loading...</div>;
    if (!order) return <div className="admin-content">Order not found</div>;

    const schedule = getDeliverySchedule();

    return (
        <div className="admin-content">
            <button onClick={() => navigate('/admin', { state: { activeTab: 'orders' } })} style={{ marginBottom: '20px', cursor: 'pointer' }}>← Back to Orders</button>

            <div className="admin-header">
                <h2>Order #{order.id} Details</h2>
                <div className="status-actions">
                    <span className={`status-badge status-${order.status ? order.status.toLowerCase() : 'pending'}`} style={{ fontSize: '1.2rem', marginRight: '20px' }}>
                        {order.status || 'Pending'}
                    </span>

                    <select
                        value={order.status || 'pending'}
                        onChange={(e) => handleStatusUpdate(e.target.value)}
                        style={{ padding: '10px', fontSize: '1rem' }}
                    >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered (Notify User)</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className="admin-grid-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                <div className="card" style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h3>Customer Details</h3>
                    <p><strong>Name:</strong> {order.user_name}</p>
                    <p><strong>Email:</strong> {order.user_email}</p>
                    <p><strong>Phone:</strong> {order.user_phone}</p>
                    <p><strong>User ID:</strong> {order.user_id}</p>
                </div>
                <div className="card" style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h3>Delivery Details</h3>
                    <p><strong>Address:</strong> {order.delivery_address}</p>
                    <p><strong>Notes:</strong> {order.delivery_notes || 'None'}</p>
                    <p><strong>Initial Delivery Date:</strong> {order.delivery_date}</p>
                </div>
            </div>

            <div className="card" style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
                <h3>Products Ordered</h3>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Frequency</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, idx) => (
                            <tr key={idx}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <img src={item.image_url && item.image_url.startsWith("/uploads") ? `${window.ENV.BACKEND_API}${item.image_url}` : item.image_url} alt="" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                                        {item.product_name}
                                    </div>
                                </td>
                                <td>{item.quantity}</td>
                                <td>₹{item.price}</td>
                                <td style={{ color: '#01BF64', fontWeight: 'bold' }}>{item.frequency}</td>
                                <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div style={{ textAlign: 'right', marginTop: '20px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                    Grand Total: ₹{order.total_amount}
                </div>
            </div>

            {/* Delivery Schedule Section */}
            <div className="card" style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h3>Projected Delivery Schedule</h3>
                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '15px' }}>
                    Next 12 weeks based on frequency.
                </p>

                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Items Due</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedule.map((entry, index) => (
                            <tr key={index}>
                                <td style={{ fontWeight: 'bold' }}>
                                    {entry.displayDate}<br />
                                    <span style={{ fontSize: '10px', color: '#999' }}>{entry.isoDate}</span>
                                </td>
                                <td>
                                    {entry.items.map((it, i) => (
                                        <span key={i} style={{ display: 'inline-block', background: '#eee', padding: '2px 8px', borderRadius: '12px', fontSize: '0.85rem', marginRight: '5px', marginBottom: '5px' }}>
                                            {it.quantity}x {it.product_name}
                                        </span>
                                    ))}
                                </td>
                                <td>
                                    {entry.isDelivered ? (
                                        <span style={{
                                            background: '#e0e0e0',
                                            color: '#555',
                                            padding: '6px 12px',
                                            borderRadius: '4px',
                                            fontWeight: 'bold',
                                            border: '1px solid #ccc'
                                        }}>
                                            Done ✓
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => handleMarkDelivered(entry.isoDate, entry.displayDate)}
                                            className="view-btn"
                                            style={{ background: '#01BF64', padding: '6px 12px', fontSize: '0.9rem' }}
                                        >
                                            Mark Delivered & Notify
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {schedule.length === 0 && <tr><td colSpan="3">No schedule available</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
