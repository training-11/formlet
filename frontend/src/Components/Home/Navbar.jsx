import React, { useState, useRef, useEffect } from "react";
import "./Navbar.css";
import SignInModal from "./SignInModal";
import { Link } from "react-router-dom";

import logo from "../../Images/New logo updated.png";
import searchIcon from '../../Images/Search icon.png';
import supportIcon from "../../Images/support-icon.png";
import CalendarIcon from "../../Images/Calendar icon.png";
import accountIcon from "../../Images/Account icon.png";
import { FaHeadset } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ProductPopup from "./ProductPopup";
import { useAuth } from "../../Context/AuthContext";
// import CalendarModal from "./CalendarModal";
// import DeliveryScheduleModal from "./DeliveryScheduleModal";

import OrderHistoryModal from "./OrderHistoryModal";

export default function Navbar({ signInOpen,
  setSignInOpen, }) {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("Shop");
  const [openModal, setOpenModal] = useState(false);
  const [openOrderModal, setOpenOrderModal] = useState(false);
  // const [openScheduleModal, setOpenScheduleModal] = useState(false);
  // const [openCalendarModal, setOpenCalendarModal] = useState(false);

  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ left: 0 });
  // const [searchOpen, setSearchOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const [openPopup, setOpenPopup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Fresh Fruits");

  // --- NEW: Dynamic Data State ---
  const [productsData, setProductsData] = useState({});
  const [categories, setCategories] = useState([]);

  const submenuRef = useRef({});
  const navigate = useNavigate();

  // --- NEW: Fetch Products from API ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const baseUrl = window.ENV?.BACKEND_API;
        const res = await fetch(`${baseUrl}/api/public/products`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();

        // Group by category name
        const grouped = {};
        data.forEach((p) => {
          const cat = p.category_name;
          if (!grouped[cat]) {
            grouped[cat] = [];
          }
          grouped[cat].push(p);
        });

        setProductsData(grouped);

        // Use the Keys from the fetched data as the valid categories for the popup
        setCategories(Object.keys(grouped));
      } catch (err) {
        console.error("Error fetching public products:", err);
      }
    };

    fetchProducts();
  }, []);

  const handleAccountClick = () => {
    if (currentUser) {
      navigate('/account');
    } else {
      setOpenModal(true);
      if (typeof setSignInOpen === "function") setSignInOpen(true);
    }
  };

  const handleScheduleClick = () => {
    if (isAuthenticated && currentUser) {
      // setOpenScheduleModal(true);
      navigate("/delivery-schedule");
    } else {
      setOpenModal(true); // Open Sign In
    }
  };

  const submenus = {
    Shop: [
      "Fresh Fruit & Vegetables boxes",
      "What's new",
      "Leafy & others",
      "Essentials",
      "Dairy & eggs",
    ],
    About: [
      "Ethics & ethos",
      "Growers & makers",
      "Our restaurant",
      "Careers",
      "Wicked Leeks magazine"
    ],
    Recipes: [
      "Browse all recipes",
      "Quick & easy",
      "Vegetarian & vegan",
      "Healthy recipes",
      "Seasonal recipes",
    ],
    Delivery: ["Your delivery schedule "],
    Account: isAuthenticated ? ["FAQs", "Help and contact", "Sign out"] : ["FAQs", "Help and contact", "Sign in or create account"],
  };

  const dropdownData = {
    "Fresh Fruit & Vegetables boxes": [
      "Fresh Fruits",
      "Fresh Vegetables",
    ],
    "Ethics & ethos": [
      "Why Farmlet?",
      "Why Organic?",
      "Thoughtful packaging",
      "Sustainability & climate action",
      "Outstanding business",
      "Certified B Corp",
      "Employee Ownership",
      "Founder's wishes",
      "Who is Guy Singh-Watson?",
      "Charity partnerships"
    ],
    "Leafy & others": [
      "Leafy & Seasonings",
      "Other Vegetables", // Updated to match likely DB case
    ],

    "Essentials": [
      "Dals & Rice",
      "Ghees & Oils",
      "Dehydrated",
      "Masalas and Dry Fruits",
      "Snacks & Coffee",
      "Natural Sweeteners",
      "Ready to Cook",
    ],
    "Dairy & eggs": [
      "Milk",
      "Eggs",
      "Yogurts",
      "Cheese",
      "Butter & cream"
    ]
  };

  const mobileDropdownContent = {
    Shop: [
      { title: "Fresh Fruit & Vegetables boxes", desc: "Our range of organic fruit, veg & meat boxes" },
      { title: "What's new", desc: "Fresh in this week from our fields & friends" },
      { title: "Leafy & others", desc: "All you need for inspiring seasonal meals" },
      { title: "Essentials", desc: "Dairy, eggs, bakery, store cupboard & more" },
      { title: "Dairy & eggs", desc: "The highest welfare organic British meat" }
    ],
    About: [
      { title: "Ethics & ethos", desc: "Organic farming, packaging & values" },
      { title: "Growers & makers", desc: "Meet the farmers who grow your food" },
      { title: "Our restaurant", desc: "Our award-winning organic restaurant" },
      { title: "Careers", desc: "Learn more about careers at Farmlet" },
      { title: "Wicked Leeks magazine", desc: "Opinion pieces, ethical lifestyle & more" }
    ]
  };

  const mobileRouteMap = {
    "Fresh Fruit & Vegetables boxes": "/products/fresh-fruits",
    "What's new": "/products/whats-new",
    "Leafy & others": "/products/leafy-others",
    "Essentials": "/products/essentials",
    "Dairy & eggs": "/products/dairy-eggs",
  };


  // Group Mapping: Display Name -> Array of DB Category Names
  const categoryGroups = {
    "Fresh Fruits": ["Fresh Fruits"],
    "Fresh Vegetables": ["Fresh Vegetables"],
    "Leafy & others": ["Leafy & Seasonings", "Leafy and Seasonings", "Other vegetables", "Other Vegetables"],
    "What's new": ["What's new"],
    "Essentials": [
      "Dals & Rice", "Ghees & Oils", "Dehydrated",
      "Masalas and Dry Fruits", "Snacks and coffee", "Snacks & Coffee",
      "Natural sweeteners", "Ready to cook"
    ],
    "Dairy & eggs": ["Milk", "Eggs", "Yogurts", "Cheese", "Butter & cream", "Dairy & eggs"]
  };

  // Sidebar items for Popup (Strictly these high-level groups)
  const popupSidebarNames = [
    "Fresh Fruits",
    "Fresh Vegetables",
    "Leafy & others",
    "What's new",
    "Essentials",
    "Dairy & eggs"
  ];

  const showDropdown = (item) => {
    setActiveSubmenu(item);
    if (submenuRef.current[item]) {
      const rect = submenuRef.current[item].getBoundingClientRect();
      setDropdownPos({ left: rect.left + rect.width / 2 });
    }
  };

  const handleHover = (tab) => {
    setActiveTab(tab);
  };

  const handleMobileClick = (tab) => {
    if (window.innerWidth > 768) {
      setActiveTab(tab);
      return;
    }

    if (activeTab === tab) {
      setActiveTab(null);
      setActiveSubmenu(null);
      return;
    }

    setActiveTab(tab);

    if (tab === "Shop") {
      setActiveSubmenu("Shop");
    } else if (tab === "About") {
      setActiveSubmenu("About");
    } else {
      setActiveSubmenu(null);
    }
  };

  const handleSubmenuClick = (item) => {
    if (item === "Sign out") {
      logout();
      navigate("/");
      setActiveSubmenu(null);
    } else if (item === "Sign in or create account") {
      setOpenModal(true);
      setActiveSubmenu(null);
    } else if (item === "Help and contact" || item === "FAQs") {
      navigate("/account");
    }
  };

  const openProductPopup = (categoryName) => {
    // Determine which Group this category belongs to
    let targetGroup = categoryName;

    // Reverse lookup: Find Key in categoryGroups containing categoryName
    for (const [group, subs] of Object.entries(categoryGroups)) {
      // Case insensitive check
      if (subs.some(s => s.toLowerCase() === categoryName.toLowerCase())) {
        targetGroup = group;
        break;
      }
    }

    setSelectedCategory(targetGroup);
    setOpenPopup(true);
  };

  // Helper to get products for the selected Top Level Category
  const getProductsForCurrentCategory = () => {


    const groupList = categoryGroups[selectedCategory] || [selectedCategory];
    let allProds = [];

    groupList.forEach(sub => {
      // matching DB keys
      const dbKey = Object.keys(productsData).find(k => k.toLowerCase() === sub.toLowerCase());
      if (dbKey && productsData[dbKey]) {
        allProds = [...allProds, ...productsData[dbKey]];
      }
    });
    return allProds;
  };

  // Construct Sidebar Objects for Popup (Name + Image)
  const getPopupSidebarItems = () => {
    return popupSidebarNames.map(name => {
      let img = null;
      const children = categoryGroups[name] || [];
      // Attempt to find image from children categories
      for (const child of children) {
        const catObj = categories.find(c => c && c.name && c.name.toLowerCase() === child.toLowerCase());
        if (catObj && catObj.image_url) {
          img = catObj.image_url;
          break;
        }
      }
      return { name: name, image_url: img };
    });
  };

  return (
    <>
      {/* Top Navbar */}
      <nav className="main-navbar" >
        <div className="nav-left">
          <Link to="/">
            <img src={logo} alt="logo" className="nav-logo" />
          </Link>
        </div>

        <ul className="nav-center">
          <li
            className={`menu-item ${activeTab === "Shop" ? "active" : ""}`}
            onMouseEnter={() => handleHover("Shop")}
            onClick={() => navigate("/products/fresh-fruits")}
          >
            Shop
          </li>
          <li
            className={activeTab === "About" ? "active" : ""}
            onMouseEnter={() => handleHover("About")}
          >
            About Farmlet
          </li>
        </ul>

        <div className="nav-right">
          {/* Contact Info (Desktop) */}
          <a href="tel:+917386120893" className="nav-contact">
            <div
              className="nav-headset-icon"
              style={{
                maskImage: `url(${supportIcon})`,
                WebkitMaskImage: `url(${supportIcon})`
              }}
            />
            <span>+91 7386120893</span>
          </a>

          {/* MOBILE SEARCH ICON (always visible on mobile) */}
          <img
            src={searchIcon}
            alt="Search"
            className="mobile-search-icon"
            // onClick={() => {
            // if (window.innerWidth <= 768) setSearchOpen(true);
            onClick={() => setMobileSearchOpen(true)}

          />

          <div className="search-box">
            <input type="text" placeholder="Search Farmlet" />
            <img src={searchIcon} alt="Search" style={{ width: 23, height: 23 }} />
          </div>
          <div
            className={`right-item ${activeTab === "Delivery" ? "active" : ""}`}
            onMouseEnter={() => handleHover("Delivery")}
            onClick={handleScheduleClick}
          >
            <span>
              Your delivery<br />schedule
            </span>
            <img src={CalendarIcon} alt="Calendar" style={{ width: 30, height: 30 }} />
          </div>

          <div
            className={`right-item ${activeTab === "Account" ? "active" : ""}`}
            onMouseEnter={() => handleHover("Account")}
            onClick={handleAccountClick}
          >
            <span className="underline-link">
              {isAuthenticated && currentUser ? (
                <>
                  Hi, {currentUser.name ? currentUser.name.split(' ')[0] : 'User'}<br /><span>My Account</span>
                </>
              ) : (
                <>
                  Sign in or<br /><span >create account</span>
                </>
              )}
            </span>
            <img src={accountIcon} alt="Account" style={{ width: 30, height: 30 }} />
          </div>

        </div>

      </nav>
      {/* MOBILE SUBMENU */}
      <div className="mobile-submenu">
        <div
          className={`mobile-submenu-item ${activeTab === "Shop" ? "active" : ""}`}
          onClick={() => handleMobileClick("Shop")}
        >
          Shop
        </div>

        <div
          className={`mobile-submenu-item ${activeTab === "About" ? "active" : ""}`}
          onClick={() => handleMobileClick("About")}
        >
          About Farmlet
        </div>

      </div>


      {/* SUB MENU */}
      <div
        className="submenu-container"
        onMouseLeave={() => setActiveSubmenu(null)}
      >
        <div className="submenu">
          {submenus[activeTab]?.map((item, i) => (
            <span
              key={i}
              className="submenu-item"
              ref={(el) => (submenuRef.current[item] = el)}
              onMouseEnter={() => showDropdown(item)}
              onClick={() => handleSubmenuClick(item)}
              style={{ cursor: "pointer" }}
            >
              {item}
            </span>
          ))}
        </div>

        {/* DROPDOWN */}
        {dropdownData[activeSubmenu] && (
          <div className="dropdown-menu mobile-dropdown" style={{ left: dropdownPos.left }}>
            {dropdownData[activeSubmenu].map((d, i) => (
              <div key={i} className="dropdown-item"
                onClick={() => openProductPopup(d)}
              >
                {d}</div>
            ))}
          </div>
        )}</div>

      {activeSubmenu && window.innerWidth <= 768 && (
        <div className="mobile-dropdown-overlay">
          <div className="mobile-full-dropdown">
            {/* {mobileDropdownContent[activeSubmenu]?.map((item, i) => (
              <div key={i} className="mobile-dropdown-item">
                <div className="mob-title">{item.title}</div>
                <div className="mob-desc">{item.desc}</div>
              </div>
            ))} */}
            {mobileDropdownContent[activeSubmenu]?.map((item, i) => (
              <div
                key={i}
                className="mobile-dropdown-item"
                onClick={() => {
                  const path = mobileRouteMap[item.title];
                  if (path) {
                    navigate(path);       // go to page (Screenshot-2)
                    setActiveSubmenu(null); // close dropdown
                    setActiveTab(null);     // reset tab
                  }
                }}
              >
                <div className="mob-title">{item.title}</div>
                <div className="mob-desc">{item.desc}</div>
              </div>
            ))}

          </div>
        </div>
      )}

      {/* 📱 Mobile Search Popup */}
      {mobileSearchOpen && window.innerWidth <= 768 && (
        <div className="mobile-search-overlay">

          <div className="search-header">
            <div className="search-title">Search Farmlet</div>

            <button
              className="mobile-close-btn"
              onClick={() => setMobileSearchOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="search-input-row">
            <input
              type="text"
              placeholder="Search Farmlet"
              className="search-input"
            />
            <img src={searchIcon} alt="" className="search-popup-icon" />
          </div>

        </div>
      )}

      <ProductPopup
        open={openPopup}
        onClose={() => setOpenPopup(false)}
        title={selectedCategory}
        products={getProductsForCurrentCategory()}
        categories={getPopupSidebarItems()}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <SignInModal
        open={openModal}
        onClose={() => { setOpenModal(false); if (typeof setSignInOpen === "function") setSignInOpen(false); }}
        onShopCategorySelect={(cat) => {
          setOpenModal(false);
          if (typeof setSignInOpen === "function") setSignInOpen(false);
          openProductPopup(cat);
        }}
      />
      <OrderHistoryModal open={openOrderModal} onClose={() => setOpenOrderModal(false)} />
    </>
  );
}
