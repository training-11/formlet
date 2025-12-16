import React, { useEffect, useState } from 'react';
import { useAuth } from "../../Context/AuthContext";

export default function AdminDeliveries() {
    const { currentUser } = useAuth();
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDeliveries();
    }, []);

    const fetchDeliveries = async () => {
        try {
            const res = await fetch(`${window.ENV.BACKEND_API}/api/admin/deliveries`, {
                headers: { Authorization: `Bearer ${currentUser.token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setDeliveries(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    // Group by Date
    const grouped = deliveries.reduce((acc, item) => {
        const d = item.date;
        if (!acc[d]) acc[d] = [];
        acc[d].push(item);
        return acc;
    }, {});

    if (loading) return <div>Loading Schedule...</div>;

    return (
        <div style={{ paddingBottom: '50px' }}>
            {Object.keys(grouped).length === 0 && (
                <div className="table-container" style={{ padding: '40px', textAlign: 'center' }}>
                    <h3>No upcoming deliveries found.</h3>
                </div>
            )}

            {Object.keys(grouped).map(date => {
                const dateObj = new Date(date);
                const isToday = new Date().toDateString() === dateObj.toDateString();

                return (
                    <div key={date} className="table-container" style={{ marginBottom: '30px', padding: '0' }}>
                        <div style={{
                            padding: '15px 20px',
                            background: isToday ? '#dcfce7' : '#f8fafc',
                            borderBottom: '1px solid #e2e8f0',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                            <h3 style={{ margin: 0, color: '#1e293b' }}>
                                {dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                                {isToday && <span style={{ marginLeft: '10px', fontSize: '12px', background: '#166534', color: 'white', padding: '2px 8px', borderRadius: '10px' }}>TODAY</span>}
                            </h3>
                            <span style={{ fontWeight: '600', color: '#64748b' }}>{grouped[date].length} Deliveries</span>
                        </div>

                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '20%' }}>User</th>
                                    <th style={{ width: '25%' }}>Address</th>
                                    <th style={{ width: '25%' }}>Product</th>
                                    <th>Qty</th>
                                    <th>Freq</th>
                                    <th>Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {grouped[date].map((item, idx) => (
                                    <tr key={idx}>
                                        <td>
                                            <div style={{ fontWeight: '600' }}>{item.user_name}</div>
                                            <div style={{ fontSize: '12px', color: '#64748b' }}>{item.user_phone}</div>
                                        </td>
                                        <td>
                                            <div style={{ fontSize: '13px', lineHeight: '1.4' }}>{item.address}</div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                {item.image && (
                                                    <img src={item.image && item.image.startsWith("/uploads") ? `${window.ENV.BACKEND_API}${item.image}` : item.image} alt="" style={{ width: '36px', height: '36px', borderRadius: '4px', objectFit: 'cover', background: '#eee' }} />
                                                )}
                                                <span>{item.product}</span>
                                            </div>
                                        </td>
                                        <td style={{ fontWeight: 'bold' }}>x{item.quantity}</td>
                                        <td>
                                            <span style={{
                                                fontSize: '11px', padding: '3px 8px', borderRadius: '12px',
                                                background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0'
                                            }}>
                                                {item.frequency}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: '13px', color: '#ef4444' }}>{item.notes}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            })}
        </div>
    );
}
