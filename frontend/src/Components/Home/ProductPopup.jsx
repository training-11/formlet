import React, { useEffect } from "react";
import "./ProductPopup.css";
import { FaTimes } from "react-icons/fa";
import { useAuth } from "../../Context/AuthContext";
import AddToCartModal from "../Cart/AddToCartModal";

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

  return (
    <div className="popup-overlay1" onClick={onClose}>
      <div className="popup-box" onClick={(e) => e.stopPropagation()}>

        <div className="popup-content">

          {/* LEFT MENU */}
          <div className="popup-sidebar">
            {categories.map((cat, i) => (
              <div
                key={i}
                className={`popup-sidebar-item ${selectedCategory === cat ? "active" : ""
                  }`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </div>
            ))}
          </div>

          {/* RIGHT PRODUCT AREA */}
          <div className="popup-right">
            <h2 className="popup-title">{title || selectedCategory}</h2>

            <div className="popup-grid">
              {products.map((prod, index) => {
                const imgSource = prod.image_url || prod.image;
                const finalImg = imgSource && imgSource.startsWith("/uploads")
                  ? `${window.ENV.BACKEND_API}${imgSource}`
                  : imgSource;

                return (
                  <div className="popup-card" key={index}>
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
