import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";

export default function AdminDashboard() {
    const { currentUser } = useAuth();
    const [stats, setStats] = useState({ totalOrders: 0, totalUsers: 0, totalSales: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch(`${window.ENV.BACKEND_API}/api/admin/stats`, {
                    headers: {
                        Authorization: `Bearer ${currentUser.token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (error) {
                console.error("Stats Fetch Error:", error);
            }
        };
        fetchStats();
    }, [currentUser]);

    return (
        <div className="stats-grid">
            <div className="stat-card">
                <span className="stat-label">Total Sales</span>
                <span className="stat-value">₹{stats.totalSales}</span>
            </div>
            <div className="stat-card">
                <span className="stat-label">Total Orders</span>
                <span className="stat-value">{stats.totalOrders}</span>
            </div>
            <div className="stat-card">
                <span className="stat-label">Total Users</span>
                <span className="stat-value">{stats.totalUsers}</span>
            </div>
        </div>
    );
}
