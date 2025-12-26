import React, { useEffect, useState } from "react";
import "./AdminPincodes.css";
import { useAuth } from "../../Context/AuthContext";

export default function AdminPincodes() {
    const { currentUser } = useAuth();
    const [pincodes, setPincodes] = useState([]);
    const [newPincode, setNewPincode] = useState("");
    const [newDay, setNewDay] = useState("Monday");
    const [minOrderValue, setMinOrderValue] = useState(""); // State for Min Order Value
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPincodes();
    }, []);

    const fetchPincodes = async () => {
        try {
            const response = await fetch(`${window.ENV.BACKEND_API}/api/admin/pincodes`, {
                headers: { Authorization: `Bearer ${currentUser.token}` }
            });
            const data = await response.json();
            setPincodes(data);
        } catch (error) {
            console.error("Fetch Pincodes Error:", error);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${window.ENV.BACKEND_API}/api/admin/pincodes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${currentUser.token}`
                },
                body: JSON.stringify({
                    pincode: newPincode,
                    deliveryDay: newDay,
                    minOrderValue: minOrderValue || 0 // Send Min Value
                })
            });

            if (response.ok) {
                setNewPincode("");
                setMinOrderValue(""); // Reset
                fetchPincodes();
            } else {
                const err = await response.json();
                console.error("Add Pincode Failed:", err);
                alert(err.details || err.message || "Failed to add");
            }
        } catch (error) {
            console.error("Add Pincode Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this pincode?")) return;
        try {
            await fetch(`${window.ENV.BACKEND_API}/api/admin/pincodes/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${currentUser.token}` }
            });
            fetchPincodes();
        } catch (error) {
            console.error("Delete Error:", error);
        }
    };

    return (
        <div className="admin-pincodes-container">
            <h2>Manage Delivery Pincodes</h2>

            <form className="add-pincode-form" onSubmit={handleAdd}>
                <input
                    type="text"
                    placeholder="Enter Pincode (e.g. 500032)"
                    value={newPincode}
                    onChange={(e) => setNewPincode(e.target.value)}
                    required
                />
                <select value={newDay} onChange={(e) => setNewDay(e.target.value)}>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                </select>
                <input
                    type="number"
                    placeholder="Min Order Value (Optional)"
                    value={minOrderValue}
                    onChange={(e) => setMinOrderValue(e.target.value)}
                    style={{ width: '150px' }}
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Adding..." : "Add Pincode"}
                </button>
            </form>

            <table className="pincode-table">
                <thead>
                    <tr>
                        <th>Pincode</th>
                        <th>Delivery Day</th>
                        <th>Min Order Value</th> {/* New Column */}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {pincodes.map((pin) => (
                        <tr key={pin.id}>
                            <td>{pin.pincode}</td>
                            <td>{pin.delivery_day}</td>
                            <td>{pin.min_order_value ? "₹" + pin.min_order_value : "None"}</td>
                            <td>
                                <button className="delete-btn" onClick={() => handleDelete(pin.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
