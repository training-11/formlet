import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Home/Navbar';
import Footer from '../Components/Home/Footer';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AccountPage.css';

const AccountPage = () => {
    const { currentUser, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);

    // Edit States
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [newAddress, setNewAddress] = useState("");

    const [isEditingNotes, setIsEditingNotes] = useState(false);
    const [newNotes, setNewNotes] = useState("");

    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (currentUser) {
            setNewAddress(currentUser.address || "");
            setNewNotes(currentUser.delivery_notes || "In the porch");
            fetchOrders();
        }
    }, [currentUser]);

    const fetchOrders = async () => {
        try {
            const userId = currentUser.id || currentUser._id;
            const response = await fetch(`${window.ENV.BACKEND_API}/api/order/user/${userId}`);
            if (response.ok) {
                setOrders(await response.json());
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleAddressChange = async () => {
        // Confirmation Logic
        if (orders.some(o => o.status === 'pending' || o.status === 'paid')) {
            if (!window.confirm("You have active orders. Changing your address will affect these deliveries. Are you sure?")) {
                return;
            }
        } else {
            if (!window.confirm("Are you sure you want to update your delivery address?")) return;
        }

        try {
            const userId = currentUser.id || currentUser._id;
            const res = await fetch(`${window.ENV.BACKEND_API}/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentUser.token}`
                },
                body: JSON.stringify({ address: newAddress })
            });

            if (res.ok) {
                alert("Address updated successfully!");
                setIsEditingAddress(false);
                window.location.reload();
            } else {
                alert("Failed to update address.");
            }
        } catch (err) {
            console.error(err);
            alert("Error updating address.");
        }
    };

    const handleNotesChange = async () => {
        try {
            const userId = currentUser.id || currentUser._id;
            const res = await fetch(`${window.ENV.BACKEND_API}/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentUser.token}`
                },
                body: JSON.stringify({ delivery_notes: newNotes })
            });

            if (res.ok) {
                alert("Delivery notes updated successfully!");
                setIsEditingNotes(false);
                window.location.reload();
            } else {
                alert("Failed to update notes.");
            }
        } catch (err) {
            console.error(err);
            alert("Error updating notes.");
        }
    };

    const handlePasswordChange = async () => {
        if (passwords.new !== passwords.confirm) return alert("New passwords do not match");
        if (!passwords.new) return alert("Password cannot be empty");

        const userId = currentUser.id || currentUser._id;

        try {
            const res = await fetch(`${window.ENV.BACKEND_API}/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentUser.token}`
                },
                body: JSON.stringify({ password: passwords.new })
            });
            if (res.ok) {
                alert("Password updated successfully!");
                setIsChangingPassword(false);
                setPasswords({ current: "", new: "", confirm: "" });
            } else {
                alert("Failed to update password");
            }
        } catch (err) { console.error(err); }
    };

    if (!currentUser) return null;

    // Styles for Green/Red buttons
    const btnStyle = { padding: '5px 10px', border: 'none', borderRadius: 4, cursor: 'pointer', color: '#fff', fontSize: '14px', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
    const greenBtn = { ...btnStyle, background: '#4caf50' }; // Green
    const redBtn = { ...btnStyle, background: '#f44336' };   // Red

    return (
        <div style={{ backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
            <Navbar />

            <div className="account-page-container">

                {/* Header */}
                <div className="account-header">
                    <div className="account-header-info">
                        <h1>{currentUser.name || "User"}</h1>
                        <div className="account-header-details">
                            <span>Customer number: <strong>{currentUser.id || "N/A"}</strong></span>
                        </div>
                    </div>
                    <button className="logout-btn-header" onClick={handleLogout}>Sign out</button>
                </div>

                {/* Grid Content */}
                <div className="account-grid">

                    {/* Card 2: Delivery Details with EDIT functionality */}
                    <div className="account-card" style={{ gridColumn: 'span 2' }}>
                        <div className="card-title">
                            Delivery details
                            <span className="lock-icon">🔒</span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                            <div>
                                <span className="details-label">Delivery address:</span>
                                {isEditingAddress ? (
                                    <div style={{ display: 'flex', gap: 5, marginTop: 5, alignItems: 'center' }}>
                                        <textarea
                                            value={newAddress}
                                            onChange={(e) => setNewAddress(e.target.value)}
                                            style={{ padding: 8, flex: 1, border: '1px solid #ccc', borderRadius: 4, minHeight: '60px' }}
                                        />
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                                            <button onClick={handleAddressChange} style={greenBtn}>✓</button>
                                            <button onClick={() => setIsEditingAddress(false)} style={redBtn}>✕</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="details-value">
                                        {currentUser.address || "No Address Set"}
                                    </div>
                                )}

                                {!isEditingAddress && (
                                    <button className="change-btn" onClick={() => setIsEditingAddress(true)}>Change address</button>
                                )}
                            </div>

                            <div>
                                <span className="details-label">Delivery notes:</span>
                                {isEditingNotes ? (
                                    <div style={{ display: 'flex', gap: 5, marginTop: 5, alignItems: 'center' }}>
                                        <textarea
                                            value={newNotes}
                                            onChange={(e) => setNewNotes(e.target.value)}
                                            style={{ padding: 8, flex: 1, border: '1px solid #ccc', borderRadius: 4, minHeight: '60px', background: '#f9f9f7' }}
                                        />
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                                            <button onClick={handleNotesChange} style={greenBtn}>✓</button>
                                            <button onClick={() => setIsEditingNotes(false)} style={redBtn}>✕</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="note-box">
                                        {currentUser.delivery_notes || "In the porch"}
                                    </div>
                                )}

                                {!isEditingNotes && (
                                    <button className="change-btn" style={{ marginTop: 10 }} onClick={() => setIsEditingNotes(true)}>Edit delivery notes</button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Orders List */}
                    <div className="account-card" style={{ gridColumn: 'span 2' }}>
                        <div className="card-title">
                            Your Orders
                        </div>
                        {orders.length === 0 ? (
                            <p className="no-orders-text">You haven't placed any orders yet.</p>
                        ) : (
                            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(order => (
                                            <tr key={order.id}>
                                                <td>#{order.id}</td>
                                                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                                <td>
                                                    <span className={`status-badge ${order.status}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td>₹{order.total_amount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Card 4: Password */}
                    <div className="account-card">
                        <div className="card-title">
                            Your password
                            <span className="lock-icon">🔒</span>
                        </div>

                        {isChangingPassword ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <input type="password" placeholder="New Password"
                                    value={passwords.new} onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                                    style={{ padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
                                />
                                <input type="password" placeholder="Confirm Password"
                                    value={passwords.confirm} onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                                    style={{ padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
                                />
                                <div style={{ display: 'flex', gap: 10 }}>
                                    <button onClick={handlePasswordChange} style={{ flex: 1, padding: 8, background: '#4caf50', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: 4 }}>Update</button>
                                    <button onClick={() => setIsChangingPassword(false)} style={{ flex: 1, padding: 8, background: '#f44336', border: 'none', cursor: 'pointer', borderRadius: 4, color: '#fff' }}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div style={{ fontSize: '24px', letterSpacing: '5px', marginBottom: 20 }}>••••••••</div>
                                <button className="change-btn" onClick={() => setIsChangingPassword(true)}>Change password</button>
                            </>
                        )}
                    </div>

                    {/* Card 5: Account Details */}
                    <div className="account-card">
                        <div className="card-title">
                            Account details
                            <span className="lock-icon">🔒</span>
                        </div>

                        <div className="account-detail-row">
                            <span className="account-detail-label">Name:</span>
                            <span className="account-detail-val">{currentUser.name}</span>
                        </div>
                        <div className="account-detail-row">
                            <span className="account-detail-label">Email:</span>
                            <span className="account-detail-val">{currentUser.email}</span>
                        </div>
                        <div className="account-detail-row">
                            <span className="account-detail-label">Tel:</span>
                            <span className="account-detail-val">{currentUser.phone}</span>
                        </div>
                    </div>

                </div>
            </div>

            <Footer />
        </div>
    );
};

export default AccountPage;
