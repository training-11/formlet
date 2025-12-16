import React, { useEffect } from "react";
import "./ProductPopup.css";
import { FaTimes } from "react-icons/fa";

export default function ProductPopup({
  open,
  onClose,
  title,
  products,
  categories,
  selectedCategory,
  setSelectedCategory
}) {

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

  if (!open) return null;

  return (
    <div className="popup-overlay1">
      <div className="popup-box">

        <FaTimes className="popup-close" onClick={onClose} />

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
            <h2 className="popup-title"></h2>

            <div className="popup-grid">
              {products.map((prod, index) => (
                <div className="popup-card" key={index}>
                  <img src={prod.image_url && prod.image_url.startsWith("/uploads") ? `${window.ENV.BACKEND_API}${prod.image_url}` : prod.image_url} alt="" className="popup-prod-img" />

                  <div className="popup-location">{prod.location}</div>

                  <div className="popup-name">{prod.name}</div>

                  <input
                    className="popup-weight"
                    value={prod.weight}
                    readOnly
                  />

                  <div className="popup-price">{prod.price}</div>

                  <button className="popup-order-btn">Login To Order</button>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="popup-bottom-login">Login To Order</div>
      </div>
    </div>
  );
}
