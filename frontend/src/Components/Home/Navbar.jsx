import React, { useState } from "react";
import "./Navbar.css";
import { FaUser } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { BsCalendarEvent } from "react-icons/bs";
import logo from "../../Images/Logo 1.png";
export default function Navbar() {
  const [activeTab, setActiveTab] = useState("Shop");

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
            className={activeTab === "Shop" ? "active" : ""}
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
                     {/* Move search box here */}
<div className="search-box">
  <input type="text" placeholder="Search Formlet" />
  <FiSearch size={20} />
</div>
  <div
    className={`right-item ${activeTab === "Delivery" ? "active" : ""}`}
    onMouseEnter={() => handleHover("Delivery")}
  >
    <span>
      Your delivery<br />schedule
    </span>
    <BsCalendarEvent size={25}/>
  </div>

  <div
    className={`right-item ${activeTab === "Account" ? "active" : ""}`}
    onMouseEnter={() => handleHover("Account")}
  >
    <span>
      Sign in or<br />create account
    </span>
    <FaUser size={25} />
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
    </>
  );
}
