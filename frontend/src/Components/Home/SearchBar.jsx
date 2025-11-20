import React from "react";
import "./SearchBar.css";

export default function SearchBar() {
  return (
    <div className="searchbar">
      <input
        className="search-input"
        placeholder="Search Riverford"
        aria-label="Search"
      />
      <button className="search-btn" aria-label="Search button">
        🔍
      </button>
    </div>
  );
}
