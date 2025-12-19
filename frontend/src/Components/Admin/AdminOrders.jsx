import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminOrders() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch(`${window.ENV.BACKEND_API}/api/admin/orders`, {
                headers: { Authorization: `Bearer ${currentUser.token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            }
        } catch (error) {
            console.error("Orders Error:", error);
        }
    };

    const handleViewOrder = (order) => {
        navigate(`/admin/orders/${order.id}`);
    };

    const handleStatusChange = async (id, newStatus) => {
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
                fetchOrders(); // Refresh
            }
        } catch (error) {
            console.error("Status Update Error:", error);
        }
    };

    return (
        <div className="table-container">
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>User</th>
                        <th>Email / Phone</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Action</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id}>
                            <td>#{order.id}</td>
                            <td>{order.user_name}</td>
                            <td>
                                {order.user_email}<br />
                                <span style={{ fontSize: '12px', color: '#888' }}>{order.user_phone}</span>
                            </td>
                            <td>{new Date(order.created_at).toLocaleDateString()}</td>
                            <td>₹{order.total_amount}</td>
                            <td>
                                <span className={`status-badge status-${order.status ? order.status.toLowerCase() : 'pending'}`}>
                                    {order.status || 'Pending'}
                                </span>
                            </td>
                            <td>
                                <select
                                    className="status-select"
                                    value={order.status || "pending"}
                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="paid">Paid</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </td>
                            <td>
                                <button className="view-btn" onClick={() => handleViewOrder(order)} style={{
                                    padding: "5px 10px",
                                    background: "#01BF64",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "3px",
                                    cursor: "pointer"
                                }}>View</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
}
