import React, { useState, useRef } from "react";
import "./Navbar.css";
import SignInModal from "./SignInModal"; 
import { Link } from "react-router-dom";

import logo from "../../Images/Updated Logo with typo.png";
import searchIcon from '../../Images/Search icon.png';
import CalendarIcon from "../../Images/Calendar icon.png";
import accountIcon from "../../Images/Account icon.png";
import { useNavigate } from "react-router-dom";
import ProductPopup from "./ProductPopup";


// IMAGES
import fruit1 from "../../Images/fruit1.png";
import fruit2 from "../../Images/fruit2.jpg";
import fruit3 from "../../Images/fruit3.jpg";
import fruit4 from "../../Images/fruit4.jpg";
import fruit5 from "../../Images/fruit5.png";
import fruit6 from "../../Images/fruit6.jpg";
import veg1 from "../../Images/veg1.png";
import veg2 from "../../Images/veg2.png";
import leafy1 from "../../Images/leafy1.png";
import leafy2 from "../../Images/leafy2.jpg";
import veg3 from "../../Images/veg3.png";
import veg4 from "../../Images/veg4.png";
import veg5 from "../../Images/veg5.jpg";
import veg6 from "../../Images/veg6.png";
import veg7 from "../../Images/veg7.png";
import veg8 from "../../Images/veg8.jpg";

export default function Navbar() {
  const [activeTab, setActiveTab] = useState("Shop");
 const [openModal, setOpenModal] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ left: 0 });
  // const [searchOpen, setSearchOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

const [openPopup, setOpenPopup] = useState(false);
const [selectedCategory, setSelectedCategory] = useState("Fresh Fruits");

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
      // "leafy and seasonings",
      // "Other vegetables",
      // "Exotics",
      // "MisFits"
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
      "Masalas and Dry Fruits",
      "Snacks and coffee",
      "Natural sweeteners",
      "Ready to cook",
    
    ],
    "Daily & eggs":[
      "Mlik",
      "Eggs",
      "Yogurts",
      "Cheese",
      "Butter & cream",
    ]

  };

  const mobileDropdownContent = {
  Shop: [
    {
      title: "Fresh Fruit & Vegetables boxes",
      desc: "Our range of organic fruit, veg & meat boxes"
    },
    {
      title: "What's new",
      desc: "Fresh in this week from our fields & friends"
    },
    {
      title: "Leafy & others",
      desc: "All you need for inspiring seasonal meals"
    },
    {
      title: "Essentials",
      desc: "Dairy, eggs, bakery, store cupboard & more"
    },
    {
      title: "Daily & eggs",
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


const allProducts = {
  "Fresh Fruits": [
    { name: "Sweet Lime", weight: "1000 Gms", price: "₹89.00", location: "From Vandavasi, Tamilnadu", image: fruit1 },
    { name: "Nagpur Orange (500–600g)", weight: "500 Gms", price: "₹109.00", location: "From Nagpur, Maharashtra", image: fruit2 },
    { name: "Red Lady Papaya - Medium (600g - 800g) (Seedless)", weight: "700 Gms", price: "₹89.00", location: "From Kadapa, Andhra Pradesh", image: fruit4 },
    //  { name: "Watermelon Kiran", weight: "2000 Gms", price: "₹189.00", location: "From Denkanikottai, Tamilnadu", image: fruit5 },
    { name: "Sapota / Chiku", weight: "500 Gms", price: "₹79.00", location: "From Mysuru, Karnataka", image: fruit3 },
    { name : "Banana Elakki", weight: "1000 Gms", price: "₹129.00", location: "From Denkanikottai, Tamilnadu", image: fruit6}
  ],

   "Fresh Vegetables": [
        {
          name: "Chilli Green",
          weight: "100 Gms",
          price: "₹9.00",
          location: "From DenkaniKottai",
          image: veg1,
        },
        {
          name: "Knol Khol Green",
          weight: "250 Gms",
          price: "₹49.00",
          location: "From DenkaniKottai",
          image: veg2,
        },
        {
          name: "Bottle Gourd",
          weight: "600 Gms",
          price: "₹65.00",
          location: "From Vandavasi",
          image: veg3,
        },
       {
          name: "Chow Chow",
          weight: "250 Gms",
          price: "₹27.00",
          location: "From Nilgiris",
          image: veg4,
        },
       
         {
          name: "Yellow Pumpkin",
          weight: "500 Gms",
          price: "₹89.00",
          location: "From Vandavasi, Tamilnadu",
          image: veg5,
        },
        {
          name: "Cabbage",
          weight: "600 Gms",
          price: "₹65.00",
          location: "From Denkanikottai, Tamilnadu",
          image: veg6,
        },
         {
          name: "Long Beans / Yard Beans",
          weight: "250 Gms",
          price: "₹59.00",
          location: "From Vandavasi, Tamilnadu",
          image: veg7,
        },
  {
          name: "LYam",
          weight: "500 Gms",
          price: "₹65.00",
          location: "From Harur",
          image: veg8,
        },
  
      ],
   
  "Leafy & others": [
    { name: "Mint Leaves", weight: "100 Gms", price: "₹15.00", location: "From Ooty", image: leafy1 },
    { name: "Coriander Leaves", weight: "100 Gms", price: "₹12.00", location: "From Nilgiris", image: leafy2 }
  ],

  // "Other vegetables" : [
  //     { name: "Mint Leaves", weight: "100 Gms", price: "₹15.00", location: "From Ooty", image: leafy1 },
  //   { name: "Coriander Leaves", weight: "100 Gms", price: "₹12.00", location: "From Nilgiris", image: leafy2 }
  // ],
"What's new" :[

],
  "Essentials" : [
       { name: "Mint Leaves", weight: "100 Gms", price: "₹15.00", location: "From Ooty", image: leafy1 },
    { name: "Coriander Leaves", weight: "100 Gms", price: "₹12.00", location: "From Nilgiris", image: leafy2 }
  ],
  "Daily & eggs" : [
       { name: "Mint Leaves", weight: "100 Gms", price: "₹15.00", location: "From Ooty", image: leafy1 },
    { name: "Coriander Leaves", weight: "100 Gms", price: "₹12.00", location: "From Nilgiris", image: leafy2 }
  ],
  // "Dehydrated" : [
  //      { name: "Mint Leaves", weight: "100 Gms", price: "₹15.00", location: "From Ooty", image: leafy1 },
  //   { name: "Coriander Leaves", weight: "100 Gms", price: "₹12.00", location: "From Nilgiris", image: leafy2 }
  
 // ]
  
};

const categoryParentMap = {
  // Fresh Fruits & Vegetables
  "Fresh Fruits": "Fresh Fruits",
  "Fresh Vegetables": "Fresh Vegetables",

  // Leafy group
  "Leafy & Seasonings": "Leafy & others",
  "Other vegetables": "Leafy & others",

  // Essentials group
  "Dals & Rice": "Essentials",
  "Ghees & Oils": "Essentials",
  "Dehydrated": "Essentials",
  "Masalas and Dry Fruits": "Essentials",
  "Snacks and coffee": "Essentials",
  "Natural sweeteners": "Essentials",
  "Ready to cook": "Essentials",

  // Daily & eggs group
  "Mlik": "Daily & eggs",
  "Eggs": "Daily & eggs",
  "Yogurts": "Daily & eggs",
  "Cheese": "Daily & eggs",
  "Butter & cream": "Daily & eggs",
};


const navigate = useNavigate();

// const handleDropdownClick = (category) => {
//   navigate(`/products/${category.replace(/\s+/g, "-").toLowerCase()}`);
// };

const handleDropdownClick = (category) => {
  setSelectedCategory(category);
  setOpenPopup(true);
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


const openProductPopup = (category) => {
  setSelectedCategory(category);
  setOpenPopup(true);
};



const categories = Object.keys(allProducts);

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
  className="submenu-container"
 
  onMouseLeave={() => setActiveSubmenu(null)}
>
      <div
        className="submenu"
      
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
          >
    {dropdownData[activeSubmenu].map((d, i) => (
      <div key={i} className="dropdown-item"
  //  onClick={() => openProductPopup(d)}
onClick={() => openProductPopup(categoryParentMap[d] || d)}



      >
        {d}</div>
    ))}
  </div>
)}</div>

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


 {/* PRODUCT POPUP */}
      {/* <ProductPopup
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        title={selectedCategory}
        products={allProducts[selectedCategory] || []}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      /> */}

{/* <ProductPopup
  open={openPopup}
  onClose={() => setOpenPopup(false)}
  title={selectedCategory}
  products={allProducts[selectedCategory] || []}
  categories={categories}
  selectedCategory={selectedCategory}
  setSelectedCategory={setSelectedCategory}
/> */}
<ProductPopup
  open={openPopup}
  onClose={() => setOpenPopup(false)}
  title={selectedCategory}
  products={allProducts[selectedCategory] || []}
  categories={categories}
  selectedCategory={selectedCategory}
  setSelectedCategory={setSelectedCategory}
/>



            <SignInModal open={openModal} onClose={() => setOpenModal(false)} />
    </>
  );
}
