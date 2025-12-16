import React, { useState } from "react";
import "./AddToCartModal.css";
import { useAuth } from "../../Context/AuthContext";

export default function AddToCartModal({ product, onClose, onConfirm }) {
    const { pincodeDetails } = useAuth();
    const [quantity, setQuantity] = useState(1);
    const [frequency, setFrequency] = useState("Once only");

    if (!product) return null;

    const frequencies = [
        "Once only",
        "Every week",
        "Every 2 weeks",
        "Every 3 weeks",
        "Every 4 weeks"
    ];

    const deliveryDay = pincodeDetails?.deliveryDay || "Unknown";
    const nextDelivery = pincodeDetails?.nextDelivery || "";

    // Parse price to calculate total (assuming price is like "₹89.00")
    const unitPrice = parseFloat(product.price.replace(/[^\d.]/g, ''));
    const totalPrice = (unitPrice * quantity).toFixed(2);
    const currencySymbol = product.price.charAt(0); // ₹ or £

    return (
        <div className="add-modal-overlay" onClick={onClose}>
            <div className="add-modal-container" onClick={(e) => e.stopPropagation()}>

                {/* HEADER WITH IMAGE BACKGROUND */}
                <div className="add-modal-header" style={{ backgroundImage: `url(${product.image})` }}>
                    <div className="header-overlay">
                        <h2 className="modal-product-name">{product.name}</h2>
                        <button className="modal-close-icon" onClick={onClose}>×</button>
                    </div>
                </div>

                <div className="add-modal-body">
                    <div className="selection-section">
                        <h3 className="qty-title">How many and how often?</h3>

                        <div className="qty-control">
                            <button
                                className="qty-btn"
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                disabled={quantity <= 1}
                            >
                                −
                            </button>
                            <div className="qty-display">{quantity}</div>
                            <button
                                className="qty-btn"
                                onClick={() => setQuantity(q => q + 1)}
                            >
                                +
                            </button>
                        </div>

                        <div className="modal-price">
                            {currencySymbol}{totalPrice}
                        </div>

                        <div className="frequency-grid">
                            {frequencies.map((freq) => (
                                <button
                                    key={freq}
                                    className={`freq-btn ${frequency === freq ? "active" : ""}`}
                                    onClick={() => setFrequency(freq)}
                                >
                                    {freq}
                                </button>
                            ))}
                        </div>

                        <div className="delivery-info">
                            Arriving on {deliveryDay} {nextDelivery}
                        </div>
                    </div>

                    <div className="confirmation-section">
                        <p className="subscription-hint">
                            Want this delivered regularly?<br />
                            Above, select how often you'd like to receive it.
                        </p>

                        <button className="confirm-btn" onClick={() => onConfirm(product, quantity, frequency)}>
                            Confirm
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
