import React from "react";
import SearchBar from "./SearchBar";
import AccountLinks from "./AccountLinks";
import "./Navbar.css";

export default function Navbar() {
  return (
    <header className="nav-wrap">
      <div className="nav-inner">
        <div className="nav-left">
          <div className="logo">Farmlet</div>

          <nav className="main-links" aria-label="Main navigation">
            <a href="#">Shop</a>
            <a href="#">About Riverford</a>
          </nav>
        </div>

        <div className="nav-right">
          <SearchBar />
          <AccountLinks />
        </div>
      </div>

      <div className="nav-submenu">
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
