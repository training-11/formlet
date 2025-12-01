import React, { useState, useRef } from "react";
import "./Navbar.css";
import SignInModal from "./SignInModal"; 
// import { FaUser } from "react-icons/fa";
// import { FiSearch } from "react-icons/fi";
// import { BsCalendarEvent } from "react-icons/bs";
import logo from "../../Images/Logo 1.png";
import searchIcon from '../../Images/Search icon.png';
import CalendarIcon from "../../Images/Calendar icon.png";
import accountIcon from "../../Images/Account icon.png";

export default function Navbar() {
  const [activeTab, setActiveTab] = useState("Shop");
 const [openModal, setOpenModal] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ left: 0 });
  // const [searchOpen, setSearchOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const submenuRef = useRef({});

  const submenus = {
    Shop: [
      "Fresh Fruit & Vegetables boxes",
      "What's new",
      "Leafy & others",
      "Essentials",
      "Daily & eggs",
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
Account: ["FAQs", "Help and contact", "Sign in or create account"],

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
    "Leafy & others" :[
      "Leafy & Seasonings",
      "Other vegetables",
    ],
 
    "Essentials":[
      "Dals & Rice",
      "Ghees & Oils",
      "Dehydrated ",
    
    ],
    "Daily & eggs":[
      "Mlik",
      "Eggs",
      "Yogurts",
      "Cheese",
      "Butter & cream",
      "Ghee",
      "Ready to Cook",
    ]

  };

  const mobileDropdownContent = {
  Shop: [
    {
      title: "Seasonal boxes",
      desc: "Our range of organic fruit, veg & meat boxes"
    },
    {
      title: "What's new",
      desc: "Fresh in this week from our fields & friends"
    },
    {
      title: "Recipe boxes & kits",
      desc: "All you need for inspiring seasonal meals"
    },
    {
      title: "Fruit, veg & salad",
      desc: "Choose from the best organic produce"
    },
    {
      title: "Essentials",
      desc: "Dairy, eggs, bakery, store cupboard & more"
    },
    {
      title: "Meat",
      desc: "The highest welfare organic British meat"
    }
  ],
    About: [
    { title: "Ethics & ethos", desc: "Organic farming, packaging & values" },
    { title: "Growers & makers", desc: "Meet the farmers who grow your food" },
    { title: "Our restaurant", desc: "Our award-winning organic restaurant" },
    { title: "Careers", desc: "Learn more about careers at Farmlet" },
    { title: "Wicked Leeks magazine", desc: "Opinion pieces, ethical lifestyle & more" }
  ]
};


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

  // Mobile toggle open/close
  if (activeTab === tab) {
    setActiveTab(null);
    setActiveSubmenu(null);
    return;
  }

  // Open new tab
  setActiveTab(tab);

  if (tab === "Shop") {
    setActiveSubmenu("Shop");
  } else if (tab === "About") {
    setActiveSubmenu("About");
  } else {
    setActiveSubmenu(null);
  }
};




  return (
    <>
      {/* Top Navbar */}
      {/* <nav className="main-navbar" onMouseLeave={() => setActiveTab("Shop")}> */}
      <nav className="main-navbar" >
        

        <div className="nav-left">
          <img
            src={logo}
            alt="logo"
            className="nav-logo"
          />
        </div>

        <ul className="nav-center">
         <li
  className={`menu-item ${activeTab === "Shop" ? "active" : ""}`}
  onMouseEnter={() => handleHover("Shop")}
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
  {/* <FiSearch size={20} /> */}
  <img src={searchIcon} alt="Search" style={{ width: 23, height: 23 }} />

</div>
  <div
    className={`right-item ${activeTab === "Delivery" ? "active" : ""}`}
    onMouseEnter={() => handleHover("Delivery")}
  >
    <span>
      Your delivery<br />schedule
    </span>
    {/* <BsCalendarEvent size={25}/> */}
    <img src={CalendarIcon} alt="Calendar" style={{ width: 30, height: 30 }} />
  </div>

<div
  className={`right-item ${activeTab === "Account" ? "active" : ""}`}
  onMouseEnter={() => handleHover("Account")}
  onClick={() => setOpenModal(true)}   // <<--- add this
>
  <span className="underline-link">
    Sign in or<br /><span >create account</span>
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
        className="submenu"
        onMouseLeave={() => setActiveSubmenu(null)}
      >
        {submenus[activeTab]?.map((item, i) => (
          <span
            key={i}
            className="submenu-item"
            ref={(el) => (submenuRef.current[item] = el)}
            onMouseEnter={() => showDropdown(item)}
          >
            {item}
          </span>
        ))}
      </div>

      {/* DROPDOWN */}
   
      {dropdownData[activeSubmenu] && (
  <div className="dropdown-menu mobile-dropdown"style={{ left: dropdownPos.left }}
          onMouseLeave={() => setActiveSubmenu(null)}>
    {dropdownData[activeSubmenu].map((d, i) => (
      <div key={i} className="dropdown-item">{d}</div>
    ))}
  </div>
)}
{activeSubmenu && window.innerWidth <= 768 && (
  <div className="mobile-dropdown-overlay">
    <div className="mobile-full-dropdown">
      {mobileDropdownContent[activeSubmenu]?.map((item, i) => (
        <div key={i} className="mobile-dropdown-item">
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
        className="close-btn"
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




            <SignInModal open={openModal} onClose={() => setOpenModal(false)} />
    </>
  );
}
