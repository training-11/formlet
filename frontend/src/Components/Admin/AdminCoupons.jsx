import React, { useEffect, useState } from "react";
import "./AdminPincodes.css"; // Reuse similar styles or create new ones
import { useAuth } from "../../Context/AuthContext";

export default function AdminCoupons() {
    const { currentUser } = useAuth();
    const [coupons, setCoupons] = useState([]);

    // Form States
    const [code, setCode] = useState("");
    const [discountType, setDiscountType] = useState("flat");
    const [discountAmount, setDiscountAmount] = useState("");
    const [description, setDescription] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [minAmount, setMinAmount] = useState("");

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const response = await fetch(`${window.ENV.BACKEND_API}/api/admin/coupons`, {
                headers: { Authorization: `Bearer ${currentUser.token}` }
            });
            const data = await response.json();
            setCoupons(data);
        } catch (error) {
            console.error("Fetch Coupons Error:", error);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                code,
                discount_type: discountType,
                discount_amount: discountAmount,
                description,
                expiry_date: expiryDate || null,
                minimum_amount: minAmount || 0
            };

            const response = await fetch(`${window.ENV.BACKEND_API}/api/admin/coupons`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${currentUser.token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                // Reset form
                setCode("");
                setDiscountAmount("");
                setDescription("");
                setExpiryDate("");
                setMinAmount("");
                fetchCoupons();
            } else {
                const err = await response.json();
                alert(err.message || "Failed to add coupon");
            }
        } catch (error) {
            console.error("Add Coupon Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this coupon?")) return;
        try {
            await fetch(`${window.ENV.BACKEND_API}/api/admin/coupons/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${currentUser.token}` }
            });
            fetchCoupons();
        } catch (error) {
            console.error("Delete Error:", error);
        }
    };

    return (
        <div className="admin-pincodes-container">
            <h2>Manage Coupons</h2>

            <form className="add-pincode-form" onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <input
                    type="text"
                    placeholder="Code (e.g. WELCOME10)"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                />

                <div style={{ display: 'flex', gap: '5px' }}>
                    <select value={discountType} onChange={(e) => setDiscountType(e.target.value)}>
                        <option value="flat">Flat ₹</option>
                        <option value="percent">% Percent</option>
                    </select>
                    <input
                        type="number"
                        placeholder="Amount"
                        value={discountAmount}
                        onChange={(e) => setDiscountAmount(e.target.value)}
                        required
                    />
                </div>

                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <input
                    type="date"
                    placeholder="Expiry Date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Min Order Amount"
                    value={minAmount}
                    onChange={(e) => setMinAmount(e.target.value)}
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Adding..." : "Add Coupon"}
                </button>
            </form>

            <table className="pincode-table" style={{ marginTop: '20px' }}>
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Discount</th>
                        <th>Details</th>
                        <th>Expiry</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {coupons.map((c) => (
                        <tr key={c.id}>
                            <td style={{ fontWeight: 'bold', color: '#01BF64' }}>{c.code}</td>
                            <td>
                                {c.discount_type === 'flat' ? '₹' : ''}
                                {c.discount_amount}
                                {c.discount_type === 'percent' ? '%' : ''}
                            </td>
                            <td>
                                {c.description && <div>{c.description}</div>}
                                {c.minimum_amount > 0 && <small>Min Order: ₹{c.minimum_amount}</small>}
                            </td>
                            <td>{c.expiry_date ? new Date(c.expiry_date).toLocaleDateString() : 'No Expiry'}</td>
                            <td>
                                <button className="delete-btn" onClick={() => handleDelete(c.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
