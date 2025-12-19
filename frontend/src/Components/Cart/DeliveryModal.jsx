import React, { useState } from "react";
import "./DeliveryModal.css";

export default function DeliveryModal({ pincode, onClose, onContinue, initialAddress }) {
    // If we have an initial address, start in "view" mode (implied by NOT showing form immediately if we treat it as a selection)
    // However, to keep it simple: populate address, but if user wants "new", we clear it.

    // Better approach matching request:
    // If logged in (initialAddress exists), show "Use Saved Address" block and "Add New" button.

    const [mode, setMode] = useState(initialAddress ? "saved" : "new"); // 'saved' or 'new'
    const [address, setAddress] = useState(initialAddress || "");
    const [notes, setNotes] = useState("");
    const [tempAddress, setTempAddress] = useState(""); // For new address input

    const handleContinue = () => {
        const finalAddress = mode === 'saved' ? address : tempAddress;

        if (!finalAddress.trim()) {
            alert("Please enter a delivery address.");
            return;
        }

        onContinue({ address: finalAddress, notes });
    };

    return (
        <div className="delivery-modal-overlay" onClick={onClose}>
            <div className="delivery-modal-container" onClick={(e) => e.stopPropagation()}>
                <button className="delivery-close-btn" onClick={onClose}>×</button>

                <h2 className="delivery-title">Delivery</h2>
                <div className="delivery-underline"></div>

                <div className="postcode-section">
                    <span className="postcode-label">Postcode:</span>
                    <span className="postcode-value">{pincode || "N/A"}</span>
                </div>

                {mode === 'saved' && (
                    <div className="saved-address-container">
                        <h3>Saved Address</h3>
                        <div className="saved-address-card">
                            <p>{address}</p>
                        </div>
                        <div className="address-actions">
                            <button className="use-address-btn" onClick={handleContinue}>
                                Deliver Here
                            </button>
                            <button className="add-new-address-btn" onClick={() => { setMode('new'); setTempAddress(""); }}>
                                Add New Address
                            </button>
                        </div>
                    </div>
                )}

                {mode === 'new' && (
                    <div className="new-address-form">
                        <div className="form-group">
                            <label>Delivery address <span style={{ color: 'red' }}>*</span></label>
                            <textarea
                                className="delivery-input"
                                value={tempAddress}
                                onChange={(e) => setTempAddress(e.target.value)}
                                rows={2}
                                placeholder="Enter your full address"
                            />
                        </div>
                        {initialAddress && (
                            <button className="back-to-saved-btn" onClick={() => setMode('saved')}>
                                Back to Saved Address
                            </button>
                        )}
                    </div>
                )}

                {/* Common Notes Field - applicable to both? Usually notes are per order. Let's keep it visible always or just in form? 
                    User likely wants notes for any order. Let's put it below.
                */}
                <div className="form-group" style={{ marginTop: '20px' }}>
                    <label>Delivery notes (Optional)</label>
                    <textarea
                        className="delivery-input"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        placeholder="Gate code, leave with neighbor, etc."
                    />
                </div>

                <p className="delivery-helper-text">
                    Please tell us where to leave your delivery if you are not at home or your delivery is before 8am.
                </p>

                {mode === 'new' && (
                    <button className="continue-delivery-btn" onClick={handleContinue}>
                        Continue
                    </button>
                )}

                {/* 'Deliver Here' handles 'saved' mode continue. 'Continue' handles 'new' mode. */}

                {/* 
                <button className="cancel-delivery-btn" onClick={onClose}>
                    Cancel
                </button> 
                */}

            </div>
        </div>
    );
}
