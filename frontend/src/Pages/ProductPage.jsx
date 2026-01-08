import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./ProductPage.css";
// import { HiMenu } from "react-icons/hi";
// import { FaChevronDown } from "react-icons/fa";
// import Navbar from "../components/Navbar/Navbar";
import Navbar from "../Components/Home/Navbar";
import Footer from "../Components/Home/Footer";

// IMAGES
import { useAuth } from "../Context/AuthContext";
import CartSidebar from "../Components/Cart/CartSidebar";
import AddToCartModal from "../Components/Cart/AddToCartModal";

export default function ProductPage() {
  // const { category } = useParams(); // Unused for now
  const { isAuthenticated, addToCart } = useAuth();

  // Dynamic Data State
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Fresh Fruits");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [showMobileCart, setShowMobileCart] = useState(false);
  const [signInModalOpen, setSignInModalOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Use Effect to Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch(`${window.ENV.BACKEND_API}/api/public/categories`),
          fetch(`${window.ENV.BACKEND_API}/api/public/products`)
        ]);

        if (catRes.ok && prodRes.ok) {
          const catData = await catRes.json();
          setCategories(catData);
          setProducts(await prodRes.json());

          // Set initial category from URL or First available
          if (catData.length > 0) {
            // If URL param 'category' matches one, use it, else first
            // For simplicity, sticking to logic
            setSelectedCategory(catData[0].name);
          }
        }
      } catch (err) {
        console.error("Failed to fetch product data", err);
      }
    };
    fetchData();
  }, []);

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleConfirmAddToCart = (product, quantity, frequency, startDate) => {
    addToCart(product, quantity, frequency, startDate);
    setModalOpen(false);
    setSelectedProduct(null);
  };

  // Filter products by selected category
  const currentCategoryObj = categories.find(c => c.name === selectedCategory);

  const filteredProducts = currentCategoryObj
    ? products.filter(p => p.category_id === currentCategoryObj.id)
    : [];

  // Sidebar list
  const sidebarCategories = categories.map(c => ({
    label: c.name,
    img: c.image_url,
    id: c.id
  }));

  // Helper to resolve image path
  const getImageUrl = (url) => {
    if (url && url.startsWith("/uploads")) {
      return `${window.ENV.BACKEND_API}${url}`;
    }
    return url;
  };

  return (
    <div className="product-page">
      <Navbar 
        signInOpen={signInModalOpen} 
        setSignInOpen={setSignInModalOpen}
        mobileSearchOpen={mobileSearchOpen}
        setMobileSearchOpen={setMobileSearchOpen}
      />

      {/* HEADER BAR */}
      {/* <div className="top-bar">
        <HiMenu size={26} className="menu-icon" />
        <div className="location">
          Bengaluru <FaChevronDown size={14} />
      {/* BODY LAYOUT: Flex container for Sidebar - Content - Cart */}
      {/* <div className="main-layout" style={{ display: "flex", minHeight: "100vh" }}> */}
 <div className="main-layout" style={{ display: "flex" }}>
        {/* LEFT SIDEBAR & PRODUCTS GRID */}
        <div className="content-area" style={{ flexGrow: 1, display: "flex" }}>
          {/* LEFT SIDEBAR (Categories) */}
          <div className="sidebar-container">
            {sidebarCategories.map((item) => (
              <div
                key={item.label}
                className={
                  "sidebar-item" +
                  (item.label === selectedCategory ? " active" : "")
                }
                onClick={() => setSelectedCategory(item.label)}
              >
                <div className="icon-box">
                  <img src={getImageUrl(item.img)} alt={item.label} className="sidebar-icon" />
                </div>
                <span className="sidebar-text">{item.label}</span>
              </div>
            ))}
          </div>

          {/* PRODUCT GRID */}
          <div className="products-container" style={{ flexGrow: 1 }}>
            <h2 className="page-title">{selectedCategory}</h2>

            <div className="products">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((prod) => (
                  <div className="product-card" key={prod.id}>
                    {/* Render Ribbon if tags exist */}
                    {prod.tags && prod.tags.length > 0 && (
                      <div className="product-ribbon">
                        {Array.isArray(prod.tags) ? prod.tags[0] : (typeof prod.tags === 'string' && prod.tags.startsWith('[') ? JSON.parse(prod.tags)[0] : prod.tags)}
                      </div>
                    )}
                    <img
                      src={getImageUrl(prod.image_url)}
                      className="product-image"
                      alt={prod.name}
                    />

                    {prod.location && <div className="product-location">{prod.location}</div>}
                    <div className="product-name">{prod.name}</div>
                    <input className="weight-input" value={prod.weight} readOnly />
                    <div className="product-price">₹{prod.price}</div>

                    {isAuthenticated ? (
                      <button className="order-btn" onClick={() => handleOpenModal(prod)}>
                        Add to Cart
                      </button>
                    ) : (
                      <button className="order-btn" onClick={() => alert("Please sign in or check your pincode first!")}>
                        Login to Order
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p>No products found in this category.</p>
              )}
            </div>
          </div>
        </div>

        {/* ADD TO CART MODAL */}
        {modalOpen && (
          <AddToCartModal
            product={selectedProduct}
            onClose={() => setModalOpen(false)}
            onConfirm={handleConfirmAddToCart}
          />
        )}

        {/* RIGHT CART SIDEBAR (Only if authenticated) */}
        {/* {isAuthenticated && (
          <div style={{ width: "320px", flexShrink: 0 }}>
            <CartSidebar />
          </div>
        )} */}
        {/* DESKTOP CART */}
{isAuthenticated && (
  <div className="desktop-cart">
    <CartSidebar />
  </div>
)}

{/* MOBILE CART OVERLAY */}
{isAuthenticated && showMobileCart && (
  <div className="mobile-cart-overlay">
    <CartSidebar />
    <button
      className="close-cart-btn"
      onClick={() => setShowMobileCart(false)}
    >
      ✕
    </button>
  </div>
)}


      </div>

      {/* BOTTOM BAR (Only show if NOT authenticated or cart is empty/hidden on mobile) */}
      {!isAuthenticated && <div className="bottom-login-bar">Login To Order</div>}
      {isAuthenticated && !signInModalOpen && !mobileSearchOpen && (
  <div className="mobile-view-cart-bar">
    <span>View Cart</span>
    <button onClick={() => setShowMobileCart(true)}>
      Open
    </button>
  </div>
)}

      <Footer />
    </div>
  );
}
