import React from "react";
import SearchBar from "./SearchBar";
import AccountLinks from "./AccountLinks";
import "./Navbar.css";
import logo from "../../Images/Logo 1.png";
import farmlet from "../../Images/Farmletlogo.png";

import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="nav-wrap">
      <div className="nav-inner">
        <div className="nav-left">
         <div className="logo-img"><img src={logo} alt="logo" /></div>
         {/* <img src={logo} alt="logo" /> */}

          {/* <div className="logo">Farmlet</div> */}
          <div className="logo">Farmlet</div>

          {/* <nav className="main-links" aria-label="Main navigation">
            <a href="#">Shop</a>
            <a href="#">About Farmlet</a>
          </nav>
          </nav> */}
          <nav className="main-links" aria-label="Main navigation">
  <Link to="/shop">Shop</Link>
  <Link to="/about">About Farmlet</Link>

</nav>

        </div>

        <div className="nav-right">
          <SearchBar />
          <AccountLinks />
        </div>
      </div>

      <div className="nav-submenu">
        <img src={farmlet} alt="Farmlet Logo" />

        <div className="submenu-inner">
          {/* <a href="#">Seasonal boxes</a>
          <a href="#">Christmas</a>
          <a href="#">What's new</a>
          <a href="#">Recipe boxes & kits</a>
          <a href="#">Fruit, veg & salad</a>
          <a href="#">Essentials</a>
          <a href="#">Meat</a> */}
        </div>
      </div>
    </header>
  );
}