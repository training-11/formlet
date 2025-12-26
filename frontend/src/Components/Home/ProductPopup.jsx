import React, { useEffect } from "react";
import "./ProductPopup.css";
import { FaTimes } from "react-icons/fa";
import { useAuth } from "../../Context/AuthContext";
import AddToCartModal from "../Cart/AddToCartModal";
import { getProductImage } from "../../utils/urlHelper";

export default function ProductPopup({
  open,
  onClose,
  title,
  products,
  categories,
  selectedCategory,
  setSelectedCategory
}) {
  const { isAuthenticated, addToCart } = useAuth();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState(null);

  // ❗ Fix: useEffect must be inside the component
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";   // Disable background scroll
    } else {
      document.body.style.overflow = "auto";     // Enable background scroll
    }

    return () => {
      document.body.style.overflow = "auto";     // Cleanup
    };
  }, [open]);

  const handleAddToCartClick = (prod) => {
    if (isAuthenticated) {
      setSelectedProduct(prod);
      setModalOpen(true);
    } else {
      alert("Please sign in or check your pincode first!");
    }
  };

  const handleConfirmAddToCart = (product, quantity, frequency, startDate) => {
    addToCart(product, quantity, frequency, startDate);
    setModalOpen(false);
    setSelectedProduct(null);
  };

  if (!open) return null;

  // Helper to resolve image path
  const getImageUrl = (url) => {
    if (url && url.startsWith("/uploads")) {
      return `${window.ENV.BACKEND_API}${url}`;
    }
    return url;
  };

  return (
    <div className="popup-overlay1" onClick={onClose}>
      <div className="popup-box" onClick={(e) => e.stopPropagation()}>

        <div className="popup-content">

          {/* LEFT MENU */}
          <div className="popup-sidebar">
            {categories.map((cat, i) => (
              <div
                key={i}
                className={`popup-sidebar-item ${selectedCategory === cat.name ? "active" : ""
                  }`}
                onClick={() => setSelectedCategory(cat.name)}
              >
                <span className="popup-sidebar-text" style={{ fontSize: '16px', fontWeight: 'bold' }}>{cat.name}</span>
              </div>
            ))}
          </div>

          {/* RIGHT PRODUCT AREA */}
          <div className="popup-right">
            <h2 className="popup-title">{title || selectedCategory}</h2>

            <div className="popup-grid">
              {products.map((prod, index) => {
                const finalImg = getProductImage(prod);
                console.log(`Popup Product ${prod.id} tags:`, prod.tags, typeof prod.tags); // DEBUG LOG

                return (
                  <div className="popup-card" key={index}>
                    {/* Render Ribbon if tags exist */}
                    {prod.tags && prod.tags.length > 0 && (
                      <div className="product-ribbon">
                        {/* If tags is string (from older DB/code), try parse, else use 0 index if array */}
                        {Array.isArray(prod.tags) ? prod.tags[0] : (typeof prod.tags === 'string' && prod.tags.startsWith('[') ? JSON.parse(prod.tags)[0] : prod.tags)}
                      </div>
                    )}

                    <img src={finalImg} alt={prod.name} className="popup-prod-img" />

                    <div className="popup-location">{prod.location}</div>

                    <div className="popup-name">{prod.name}</div>

                    <input
                      className="popup-weight"
                      value={prod.weight}
                      readOnly
                    />

                    <div className="popup-price">{prod.price}</div>

                    {isAuthenticated ? (
                      <button className="popup-order-btn" onClick={() => handleAddToCartClick(prod)}>
                        Add to Cart
                      </button>
                    ) : (
                      <button className="popup-order-btn" onClick={() => alert("Please sign in or check your pincode first!")}>
                        Login to Order
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {!isAuthenticated && <div className="popup-bottom-login">Login To Order</div>}

        <FaTimes className="popup-close" onClick={onClose} />
      </div>

      {/* NESTED ADD TO CART MODAL */}
      {modalOpen && (
        <AddToCartModal
          product={selectedProduct}
          onClose={() => setModalOpen(false)}
          onConfirm={handleConfirmAddToCart}
        />
      )}
    </div>
  );
}
