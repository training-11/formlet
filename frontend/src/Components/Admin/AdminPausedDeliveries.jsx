import React, { useState, useEffect } from "react";
import "./Admin.css";

export default function AdminPausedDeliveries() {
    const [pausedDeliveries, setPausedDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPausedDeliveries();
    }, []);

    const fetchPausedDeliveries = async () => {
        setLoading(true);
        setError(null);
        try {
            const userStr = localStorage.getItem("user");
            const user = userStr ? JSON.parse(userStr) : null;
            const token = user ? user.token : null;

            const response = await fetch(`${window.ENV.BACKEND_API}/api/admin/paused-deliveries`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setPausedDeliveries(data);
            } else {
                const errData = await response.json();
                console.error("Failed to fetch paused deliveries", errData);
                setError(errData.details || errData.message || "Failed to fetch paused deliveries");
            }
        } catch (error) {
            console.error("Error:", error);
            setError("Network error or server unreachable");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-section">
            <header style={{ marginBottom: '20px' }}>
                <h3>Paused Delivery Requests</h3>
            </header>

            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p style={{ color: "red", fontWeight: "bold" }}>Error: {error}</p>
            ) : pausedDeliveries.length === 0 ? (
                <p>No paused deliveries found.</p>
            ) : (
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>User Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Paused Date</th>
                            <th>Paused On (Request Time)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pausedDeliveries.map((item) => (
                            <tr key={item.id}>
                                <td>{item.user_name}</td>
                                <td>{item.user_email}</td>
                                <td>{item.user_phone}</td>
                                <td style={{ fontWeight: 'bold', color: '#d32f2f' }}>
                                    {new Date(item.skip_date).toDateString()}
                                </td>
                                <td>{new Date(item.created_at).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
