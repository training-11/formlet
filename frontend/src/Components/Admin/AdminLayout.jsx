import React, { useState } from "react";
import "./Admin.css";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import AdminOrders from "./AdminOrders";
import AdminUsers from "./AdminUsers";
import AdminPincodes from "./AdminPincodes";
import AdminCoupons from "./AdminCoupons";
import { useAuth } from "../../Context/AuthContext";

export default function AdminLayout() {
    const { currentUser, logout } = useAuth();
    const [activeTab, setActiveTab] = useState("dashboard");
    const navigate = useNavigate();

    // Check Admin Role
    if (!currentUser || currentUser.role !== 'admin') {
        return (
            <div style={{ padding: 50, textAlign: "center" }}>
                <h2>Access Denied</h2>
                <p>You must be an admin to view this page.</p>
                <button onClick={() => navigate('/')}>Go Home</button>
            </div>
        );
    }

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard": return <AdminDashboard />;
            case "orders": return <AdminOrders />;
            case "users": return <AdminUsers />;
            case "pincodes": return <AdminPincodes />;
            case "coupons": return <AdminCoupons />;
            default: return <AdminDashboard />;
        }
    };

    return (
        <div className="admin-container">
            <aside className="admin-sidebar">
                <div className="admin-logo">Farmlet Admin</div>
                <nav className="admin-nav">
                    <div
                        className={`admin-nav-item ${activeTab === "dashboard" ? "active" : ""}`}
                        onClick={() => setActiveTab("dashboard")}
                    >
                        Dashboard
                    </div>
                    <div
                        className={`admin-nav-item ${activeTab === "orders" ? "active" : ""}`}
                        onClick={() => setActiveTab("orders")}
                    >
                        Orders
                    </div>
                    <div
                        className={`admin-nav-item ${activeTab === "users" ? "active" : ""}`}
                        onClick={() => setActiveTab("users")}
                    >
                        Users
                    </div>
                    <div
                        className={`admin-nav-item ${activeTab === "pincodes" ? "active" : ""}`}
                        onClick={() => setActiveTab("pincodes")}
                    >
                        Pincodes
                    </div>
                    <div
                        className={`admin-nav-item ${activeTab === "coupons" ? "active" : ""}`}
                        onClick={() => setActiveTab("coupons")}
                    >
                        Coupons
                    </div>
                    <div
                        className="admin-nav-item"
                        onClick={() => { logout(); navigate('/'); }}
                        style={{ marginTop: 'auto', color: '#f87171' }}
                    >
                        Logout
                    </div>
                </nav>
            </aside>

            <main className="admin-content">
                <header className="admin-header">
                    <div className="admin-title">
                        {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                    </div>
                    <div>Hello, {currentUser.name}</div>
                </header>
                {renderContent()}
            </main>
        </div>
    );
}
