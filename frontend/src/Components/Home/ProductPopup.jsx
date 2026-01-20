
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
  const [selectedVariants, setSelectedVariants] = React.useState({});
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
              {(() => {
                // Group products by name
                const groupedProducts = {};
                products.forEach((prod) => {
                  if (!groupedProducts[prod.name]) {
                    groupedProducts[prod.name] = [];
                  }
                  groupedProducts[prod.name].push(prod);
                });
                // Render grouped products
                return Object.entries(groupedProducts).map(([prodName, variants]) => {
                  // Use selected variant or first variant
                  const selectedVariant = selectedVariants[prodName] 
                    ? variants.find(v => v.id === selectedVariants[prodName]) || variants[0]
                    : variants[0];
                  
                  const finalImg = getProductImage(selectedVariant);
                  return (
                    <div className="popup-card" key={prodName}>
                      {/* Render Ribbon if tags exist */}
                      {selectedVariant.tags && selectedVariant.tags.length > 0 && (
                        <div className="product-ribbon">
                          {/* If tags is string (from older DB/code), try parse, else use 0 index if array */}
                          {Array.isArray(selectedVariant.tags) ? selectedVariant.tags[0] : (typeof selectedVariant.tags === 'string' && selectedVariant.tags.startsWith('[') ? JSON.parse(selectedVariant.tags)[0] : selectedVariant.tags)}
                        </div>
                      )}
                      <img src={finalImg} alt={selectedVariant.name} className="popup-prod-img" />
                      {selectedVariant.location && (
                        <div className="popup-location">{selectedVariant.location}</div>
                      )}
                      <div className="popup-name">{selectedVariant.name}</div>
                      {/* Show dropdown only if there are multiple variants */}
                      {variants.length > 1 ? (
                        <select
                          className="popup-variant-select"
                          value={selectedVariant.id}
                          onChange={(e) => setSelectedVariants({
                            ...selectedVariants,
                            [prodName]: parseInt(e.target.value)
                          })}
                        >
                          {variants.map((variant) => (
                            <option key={variant.id} value={variant.id}>
                              {variant.weight} 
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          className="popup-weight"
                          value={selectedVariant.weight}
                          readOnly
                        />
                      )}
                      <div className="popup-price">{selectedVariant.price}</div>
                      {isAuthenticated ? (
                        <button className="popup-order-btn" onClick={() => handleAddToCartClick(selectedVariant)}>
                          Add to Cart
                        </button>
                      ) : (
                        <button className="popup-order-btn" onClick={() => alert("Please sign in or check your pincode first!")}>
                          Login to Order
                        </button>
                      )}
                    </div>
                  );
                });
              })()}
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
