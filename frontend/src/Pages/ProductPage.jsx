import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
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
import ProductCard from "../Components/ProductCard";

export default function ProductPage() {
  const { category } = useParams();
  const { search } = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(search);
  const searchQuery = queryParams.get("q") || "";

  const { isAuthenticated, addToCart } = useAuth();

  // Dynamic Data State
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Fresh Fruits");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [showMobileCart, setShowMobileCart] = useState(false);

  // Sync selectedCategory with URL param
  useEffect(() => {
    if (category) {
      if (category === "search") {
        setSelectedCategory("Search Results");
      } else {
        setSelectedCategory(category);
      }
    }
  }, [category, searchQuery]);

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
          if (catData.length > 0 && !category) {
            setSelectedCategory(catData[0].name);
          }
        }
      } catch (err) {
        console.error("Failed to fetch product data", err);
      }
    };
    fetchData();
  }, [category]);

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleConfirmAddToCart = (product, quantity, frequency, startDate) => {
    addToCart(product, quantity, frequency, startDate);
    setModalOpen(false);
    setSelectedProduct(null);
  };

  // Filter products Logic
  let filteredProducts = [];
  let displayTitle = selectedCategory;

  if (category === "search") {
    filteredProducts = products.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    displayTitle = `Search Results for "${searchQuery}"`;
  } else {
    // Normal Category Logic
    const currentCategoryObj = categories.find(c =>
      c.name === selectedCategory ||
      c.name.toLowerCase().replace(/ /g, '-') === String(selectedCategory).toLowerCase() ||
      c.name.toLowerCase() === String(selectedCategory).toLowerCase().replace(/-/g, ' ')
    );

    if (currentCategoryObj) {
      filteredProducts = products.filter(p => p.category_id === currentCategoryObj.id);
      displayTitle = currentCategoryObj.name;
    }
  }

  // Sidebar list
  const sidebarCategories = categories.map(c => ({
    label: c.name,
    img: c.image_url,
    id: c.id
  }));

  // Helper to resolve image path
  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http") || url.startsWith("https") || url.startsWith("data:")) {
      return url;
    }
    if (url.startsWith("/uploads")) {
      return `${window.ENV.BACKEND_API}${url}`;
    }
    return url.startsWith("/") ? url : `/${url}`;
  };

  return (
    <div className="product-page">
      <Navbar />

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
            <h2
              className="page-title"
              style={category === "search" ? { display: 'block', fontSize: '1.2rem' } : {}}
            >
              {displayTitle}
              {category === "search" && (
                <span
                  title="Clear Search"
                  style={{ marginLeft: '10px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
                  onClick={() => navigate('/products/fresh-fruits')}
                >
                  <FaTimes color="#d32f2f" size={20} />
                </span>
              )}
            </h2>

            <div className="products">
              {filteredProducts.length > 0 ? (
                Object.values(filteredProducts.reduce((acc, prod) => {
                  if (!acc[prod.name]) acc[prod.name] = [];
                  acc[prod.name].push(prod);
                  return acc;
                }, {})).map((group, index) => (
                  <ProductCard
                    key={index}
                    variants={group}
                    onAddToCart={handleOpenModal}
                  />
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

      {/* BOTTOM BAR */}
      {!isAuthenticated && <div className="bottom-login-bar">Login To Order</div>}
      {isAuthenticated && (
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
