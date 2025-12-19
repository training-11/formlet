import React, { useState, useEffect } from "react";
import "./PaymentModal.css";

export default function PaymentModal({ totalAmount, items, onPay, onClose, deliveryDate, deliveryAddress, currentOrder, onOrderUpdate }) {
    const [isSummaryOpen, setIsSummaryOpen] = useState(true);
    const [availableCoupons, setAvailableCoupons] = useState([]);
    const [couponCode, setCouponCode] = useState("");
    const [discountAmount, setDiscountAmount] = useState(0);
    const [displayedTotal, setDisplayedTotal] = useState(totalAmount);

    // If order already has discount (e.g. re-opened modal), we might need to sync. 
    // But for simpler flow, assume new session starts with subtotal.

    useEffect(() => {
        fetchCoupons();
    }, []);

    // Sync displayed total with currentOrder updates
    useEffect(() => {
        if (currentOrder && currentOrder.amount) {
            setDisplayedTotal(currentOrder.amount); // amount is from backend (potentially discounted)
        }
    }, [currentOrder]);

    const fetchCoupons = async () => {
        try {
            const res = await fetch(`${window.ENV.BACKEND_API}/api/order/coupons`);
            if (res.ok) {
                const data = await res.json();
                setAvailableCoupons(data);
            }
        } catch (error) {
            console.error("Failed to load coupons", error);
        }
    };

    // Example Razorpay handler
    const handlePayment = () => {
        onPay();
    };

    const applyCoupon = async (code) => {
        if (!code) return;
        setCouponCode(code);

        try {
            const response = await fetch(`${window.ENV.BACKEND_API}/api/order/apply-coupon`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    orderId: currentOrder?.id,
                    couponCode: code
                })
            });

            const data = await response.json();

            if (response.ok) {
                setDiscountAmount(data.discountAmount);
                // setDisplayedTotal(data.newTotal); // Handled by useEffect on currentOrder

                // Update Parent State (Critical so Razorpay uses new Order ID and Amount)
                onOrderUpdate({
                    amount: data.newTotal,
                    razorpayOrderId: data.razorpayOrderId
                });
                alert(`Coupon ${code} applied successfully! You saved ₹${data.discountAmount}`);
            } else {
                alert(data.message || "Failed to apply coupon");
                setCouponCode("");
            }
        } catch (error) {
            console.error(error);
            alert("Error applying coupon");
        }
    };

    return (
        <div className="payment-modal-overlay">
            <div className="payment-modal-container">
                <button className="payment-close-btn" onClick={onClose}>×</button>

                <h2 className="payment-title">Checkout</h2>

                <div className="order-summary-accordion" onClick={() => setIsSummaryOpen(!isSummaryOpen)}>
                    <div className="accordion-header">
                        <span>Order Summary</span>
                        <span className="accordion-icon">{isSummaryOpen ? "▲" : "▼"}</span>
                    </div>
                    <span className="accordion-total">₹{displayedTotal}</span>
                </div>

                {isSummaryOpen && (
                    <div className="order-items-list">
                        <div className="delivery-info-summary" style={{ marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px dashed #ccc' }}>
                            <p style={{ fontSize: '14px', margin: '5px 0' }}><strong>Deliver to:</strong> {deliveryAddress}</p>
                            <p style={{ fontSize: '14px', margin: '5px 0' }}><strong>Date:</strong> {deliveryDate}</p>
                        </div>

                        {items.map((item, idx) => (
                            <div className="summary-item" key={idx}>
                                <div className="summary-item-name">
                                    {item.name} <span className="summary-qty">x{item.quantity}</span>
                                    <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                                        {item.frequency || "One off"}
                                        {item.frequency !== "Once only" && item.startDate && (
                                            <span style={{ display: 'block', fontSize: '11px', color: '#558b2f' }}>
                                                Starting: {item.startDate}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="summary-item-price">{item.price}</div>
                            </div>
                        ))}

                        {/* Promo Section */}
                        <div className="promo-section">
                            <h4 className="promo-header">Promo and gift codes</h4>
                            <div className="promo-input-group">
                                <input
                                    type="text"
                                    className="promo-input"
                                    placeholder="Enter code"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                />
                                <button className="promo-apply-btn" onClick={() => applyCoupon(couponCode)}>Apply</button>
                            </div>

                            {/* Available Coupons List */}
                            {availableCoupons.length > 0 && (
                                <div className="available-coupons" style={{ marginTop: '15px' }}>
                                    <p style={{ fontSize: '13px', fontWeight: '600', color: '#555', marginBottom: '8px' }}>Available Coupons:</p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {availableCoupons.map((c, i) => (
                                            <div key={i} onClick={() => setCouponCode(c.code)} style={{
                                                border: '1px dashed #01BF64', padding: '5px 10px', borderRadius: '4px',
                                                fontSize: '12px', color: '#01BF64', cursor: 'pointer', background: '#e6f9ee'
                                            }}>
                                                <strong>{c.code}</strong>
                                                <span style={{ marginLeft: '5px', color: '#333' }}>
                                                    - {c.discount_type === 'flat' ? `₹${c.discount_amount}` : `${c.discount_amount}%`} Off
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {discountAmount > 0 && (
                            <div className="summary-delivery" style={{ color: '#01BF64' }}>
                                <span>Discount</span>
                                <span>- ₹{discountAmount}</span>
                            </div>
                        )}

                        <div className="summary-delivery">
                            <span>Delivery</span>
                            <span>Free</span>
                        </div>
                        <div className="summary-final-total">
                            <span>Total</span>
                            <span>₹{displayedTotal}</span>
                        </div>
                    </div>
                )}

                <div className="payment-body">
                    <h3 className="pay-section-title">Pay securely</h3>

                    <div className="payment-box">
                        <p className="payment-desc">Complete your purchase using Razorpay.</p>

                        <div className="payment-methods-icons">
                            {/* Simple placeholders for card icons */}
                            <span className="card-icon visa">VISA</span>
                            <span className="card-icon mc">MasterCard</span>
                            <span className="card-icon upi">UPI</span>
                        </div>

                        <button className="pay-now-btn" onClick={handlePayment}>
                            Pay ₹{displayedTotal}
                        </button>

                        <div className="secure-badge">
                            <span className="lock-icon">🔒</span> Secure and encrypted payment
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
