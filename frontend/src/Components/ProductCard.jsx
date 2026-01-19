import React, { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";

export default function ProductCard({ variants, onAddToCart }) {
    const { isAuthenticated } = useAuth();

    // Sort variants by weight if possible, or just use default order
    // Using the first variant as the default selected one
    const [selectedVariant, setSelectedVariant] = useState(variants[0]);

    useEffect(() => {
        // Reset selection if variants prop changes significantly
        // (Though usually key prop on parent handles full re-renders)
        setSelectedVariant(variants[0]);
    }, [variants]);

    const handleWeightChange = (e) => {
        const variantId = parseInt(e.target.value);
        const variant = variants.find(v => v.id === variantId);
        setSelectedVariant(variant);
    };

    const getImageUrl = (url) => {
        if (!url) return "";
        if (url.startsWith("http") || url.startsWith("https") || url.startsWith("data:")) {
            return url;
        }
        if (url.startsWith("/uploads") || url.startsWith("/api/uploads")) {
            return `${window.ENV.BACKEND_API}${url}`;
        }
        // For local assets in public folder, ensure they start with /
        return url.startsWith("/") ? url : `/${url}`;
    };

    // Render logic
    const hasMultipleVariants = variants.length > 1;

    return (
        <div className="product-card">
            {/* Render Ribbon if tags exist on the selected variant */}
            {selectedVariant.tags && selectedVariant.tags.length > 0 && (
                <div className="product-ribbon">
                    {Array.isArray(selectedVariant.tags)
                        ? selectedVariant.tags[0]
                        : (typeof selectedVariant.tags === 'string' && selectedVariant.tags.startsWith('[')
                            ? JSON.parse(selectedVariant.tags)[0]
                            : selectedVariant.tags)
                    }
                </div>
            )}

            <img
                src={getImageUrl(selectedVariant.image_url)}
                className="product-image"
                alt={selectedVariant.name}
            />

            {selectedVariant.location && <div className="product-location">{selectedVariant.location}</div>}
            <div className="product-name">{selectedVariant.name}</div>

            {/* Weight Selection */}
            {hasMultipleVariants ? (
                <select
                    className="weight-input"
                    value={selectedVariant.id}
                    onChange={handleWeightChange}
                    style={{ cursor: 'pointer' }}
                >
                    {variants.map(v => (
                        <option key={v.id} value={v.id}>
                            {v.weight}
                        </option>
                    ))}
                </select>
            ) : (
                <input className="weight-input" value={selectedVariant.weight} readOnly />
            )}

            <div className="product-price">₹{selectedVariant.price}</div>

            {isAuthenticated ? (
                <button className="order-btn" onClick={() => onAddToCart(selectedVariant)}>
                    Add to Cart
                </button>
            ) : (
                <button className="order-btn" onClick={() => alert("Please sign in or check your pincode first!")}>
                    Login to Order
                </button>
            )}
        </div>
    );
}
