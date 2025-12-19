import React, { useState } from "react";
import "./Admin.css";
import { useNavigate, useLocation } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import AdminOrders from "./AdminOrders";
import AdminCoupons from "./AdminCoupons";
import AdminDeliveries from "./AdminDeliveries";
import AdminInventory from "./AdminInventory";
import AdminUsers from "./AdminUsers";
import AdminPincodes from "./AdminPincodes";
import AdminPausedDeliveries from "./AdminPausedDeliveries";
// import AdminCategories from "./AdminCategories"; // Consolidating into Inventory
// import AdminProducts from "./AdminProducts";
import { useAuth } from "../../Context/AuthContext";

export default function AdminLayout({ children }) {
    const { currentUser, logout } = useAuth();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(location.state?.activeTab || "dashboard");
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
        if (children) return children; // Prioritize children (nested routes)

        switch (activeTab) {
            case "dashboard": return <AdminDashboard />;
            case "orders": return <AdminOrders />;
            case "deliveries": return <AdminDeliveries />;
            case "inventory": return <AdminInventory />;
            case "users": return <AdminUsers />;
            // case "categories": return <AdminCategories />;
            // case "products": return <AdminProducts />;
            case "pincodes": return <AdminPincodes />;
            case "coupons": return <AdminCoupons />;
            case "paused": return <AdminPausedDeliveries />;
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
                        onClick={() => { setActiveTab("dashboard"); navigate('/admin'); }}
                    >
                        Dashboard
                    </div>
                    <div
                        className={`admin-nav-item ${activeTab === "orders" ? "active" : ""}`}
                        onClick={() => { setActiveTab("orders"); navigate('/admin'); }}
                    >
                        Orders
                    </div>
                    <div
                        className={`admin-nav-item ${activeTab === "deliveries" ? "active" : ""}`}
                        onClick={() => { setActiveTab("deliveries"); navigate('/admin'); }}
                    >
                        Deliveries
                    </div>
                    <div
                        className={`admin-nav-item ${activeTab === "inventory" ? "active" : ""}`}
                        onClick={() => { setActiveTab("inventory"); navigate('/admin'); }}
                    >
                        Inventory
                    </div>
                    <div
                        className={`admin-nav-item ${activeTab === "users" ? "active" : ""}`}
                        onClick={() => { setActiveTab("users"); navigate('/admin'); }}
                    >
                        Users
                    </div>
                    <div
                        className={`admin-nav-item ${activeTab === "pincodes" ? "active" : ""}`}
                        onClick={() => { setActiveTab("pincodes"); navigate('/admin'); }}
                    >
                        Pincodes
                    </div>
                    <div
                        className={`admin-nav-item ${activeTab === "coupons" ? "active" : ""}`}
                        onClick={() => { setActiveTab("coupons"); navigate('/admin'); }}
                    >
                        Coupons
                    </div>
                    <div
                        className={`admin-nav-item ${activeTab === "paused" ? "active" : ""}`}
                        onClick={() => { setActiveTab("paused"); navigate('/admin'); }}
                    >
                        Paused Deliveries
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
                        {children ? "Order Details" : (activeTab.charAt(0).toUpperCase() + activeTab.slice(1))}
                    </div>
                    <div>Hello, {currentUser.name}</div>
                </header>
                {renderContent()}
            </main>
        </div>
    );
}
