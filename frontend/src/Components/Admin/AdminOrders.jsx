import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";

export default function AdminOrders() {
    const { currentUser } = useAuth();
    const [orders, setOrders] = useState([]);

    // View Details Modal State
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const [loadingItems, setLoadingItems] = useState(false);

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

    const handleViewOrder = async (order) => {
        setSelectedOrder(order);
        setLoadingItems(true);
        try {
            const response = await fetch(`${window.ENV.BACKEND_API}/api/admin/orders/${order.id}/items`, {
                headers: { Authorization: `Bearer ${currentUser.token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setOrderItems(data);
            } else {
                setOrderItems([]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingItems(false);
        }
    };

    const handleCloseModal = () => {
        setSelectedOrder(null);
        setOrderItems([]);
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

            {/* View Modal */}
            {selectedOrder && (
                <div className="modal-overlay" onClick={handleCloseModal} style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{
                        background: 'white', padding: '20px', borderRadius: '5px', width: '600px', maxHeight: '80vh', overflowY: 'auto'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h2>Order #{selectedOrder.id} Details</h2>
                            <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>×</button>
                        </div>

                        <div style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                            <p><strong>Customer:</strong> {selectedOrder.user_name}</p>
                            <p><strong>Phone:</strong> {selectedOrder.user_phone}</p>
                            <p><strong>Delivery Address:</strong> {selectedOrder.delivery_address}</p>
                            <p><strong>Notes:</strong> {selectedOrder.delivery_notes || "None"}</p>
                            <p><strong>Delivery Date:</strong> {selectedOrder.delivery_date}</p>
                        </div>

                        <h3>Items</h3>
                        {loadingItems ? <p>Loading items...</p> : (
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #ddd', textAlign: 'left' }}>
                                        <th style={{ padding: '8px' }}>Product</th>
                                        <th style={{ padding: '8px' }}>Qty</th>
                                        <th style={{ padding: '8px' }}>Price</th>
                                        <th style={{ padding: '8px' }}>Frequency</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderItems.map((item, idx) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid #f9f9f9' }}>
                                            <td style={{ padding: '8px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <img src={item.image_url} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                                    {item.product_name}
                                                </div>
                                            </td>
                                            <td style={{ padding: '8px' }}>{item.quantity}</td>
                                            <td style={{ padding: '8px', fontWeight: 'bold' }}>₹{item.price}</td>
                                            <td style={{ padding: '8px', color: '#01BF64' }}>{item.frequency}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        <div style={{ marginTop: '20px', textAlign: 'right', fontWeight: 'bold', fontSize: '18px' }}>
                            Total: ₹{selectedOrder.total_amount}
                        </div>

                        <div style={{ marginTop: '20px', textAlign: 'right' }}>
                            <button onClick={handleCloseModal} style={{
                                padding: '10px 20px', background: '#333', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer'
                            }}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
