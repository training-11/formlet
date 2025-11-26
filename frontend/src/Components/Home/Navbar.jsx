import React, { useState } from "react";
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

  const submenus = {
    Shop: [
      "Seasonal boxes",
      "Christmas",
      "What's new",
      "Recipe boxes & kits",
      "Fruit, veg & salad",
      "Essentials",
      "Meat",
    ],
    About: [
      "Our story",
      "Ethics & ethos",
      "Sustainability",
      "Farmers & growers",
      "Packaging & recycling",
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

  const handleHover = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      {/* Top Navbar */}
      <nav className="main-navbar" onMouseLeave={() => setActiveTab("Shop")}>

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
            About Formlet 
          </li>
      </ul>

        <div className="nav-right">
  
<div className="search-box">
  <input type="text" placeholder="Search Formlet" />
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

      {/* Submenu */}
      <div className="submenu" onMouseLeave={() => setActiveTab("Shop")}>
        {submenus[activeTab].map((item, index) => (
          <span key={index} className="submenu-item">
            {item}
          </span>
        ))}
      </div>
            <SignInModal open={openModal} onClose={() => setOpenModal(false)} />
    </>
  );
}
