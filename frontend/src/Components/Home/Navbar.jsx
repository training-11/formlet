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
  const submenuRef = useRef({});

  const submenus = {
    Shop: [
      "Seasonal boxes",
      "What's new",
      "Recipe boxes & kits",
      "Fruit, veg & salad",
      "Essentials",
      "Meat",
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
    "Seasonal boxes": [
      "Christmas boxes",
      "Veg boxes",
      "Fruit & veg boxes",
      "Fruit & snacking boxes",
      "Fruit, veg & salad bags",
      "Meat boxes",
      "See all"
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
    "Recipe boxes & kits" :[
      "Recipe boxes",
      "Recipe kits",
      "See all"
    ],
    "Fruit, veg & salad":[
      "Fruit",
      "Vegetables",
"Salad",
"Herbs & spices",
"British fruit & veg",
"See all"
    ],
    "Essentials":[
      "Dairy & eggs",
"Bakery",
"Store cupboard",
"Cheese & deli",
"Yogurt & kefir",
"Vegan range",
"Drinks",
"Breakfast",
"Books & gifts",
"See all"
    ],
    "Meat":[
      "Meat boxes",
"Christmas meat",
"Beef",
"Chicken",
"Turkey",
"Lamb",
"Pork",
"Duck",
"Venison",
"Sausages, bacon & burgers",
"Quick & easy"
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

  return (
    <>
      {/* Top Navbar */}
      {/* <nav className="main-navbar" onMouseLeave={() => setActiveTab("Shop")}> */}
      <nav className="main-navbar">

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
        <div
          className="dropdown-menu"
          style={{ left: dropdownPos.left }}
          onMouseLeave={() => setActiveSubmenu(null)}
        >
          {dropdownData[activeSubmenu].map((d, i) => (
            <div key={i} className="dropdown-item">{d}</div>
          ))}
        </div>
      )}
            <SignInModal open={openModal} onClose={() => setOpenModal(false)} />
    </>
  );
}
