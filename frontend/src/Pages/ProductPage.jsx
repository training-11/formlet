import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./ProductPage.css";
import { HiMenu } from "react-icons/hi";
import { FaChevronDown } from "react-icons/fa";
// import Navbar from "../components/Navbar/Navbar";
import Navbar from "../Components/Home/Navbar";

// IMAGES
import fruit1 from "../Images/fruit1.png";
import fruit2 from "../Images/fruit2.jpg";
import veg1 from "../Images/veg1.png";
import veg2 from "../Images/veg2.png";
import leafy1 from "../Images/leafy1.png";
import leafy2 from "../Images/leafy2.jpg";
import apple from "../Images/apple.png";
import carrot from "../Images/carrot.png";
import leaf from "../Images/leaf.png";
// import tomato from "../Images/tomato.png";
import dal from "../Images/dal.png";
// import orange from "../Images/orange.jpg";
import dairy from "../Images/dairy.png";
import snacksncoffee from "../Images/snacksncoffee.png";
import grains from "../Images/grains.png";
import dehydrated from "../Images/dehydrated.png";
export default function ProductPage() {
  const { category } = useParams();
  const [selectedCategory, setSelectedCategory] = useState("Fresh Fruits");

  const title = category.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  // PRODUCT DATA FOR EACH CATEGORY
  const allProducts = {
    "Fresh Fruits": [
      {
        name: "Sweet Lime",
        weight: "1000 Gms",
        price: "₹89.00",
        location: "From Vandavasi, Tamilnadu",
        image: fruit1,
      },
      {
        name: "Nagpur Orange (500–600g)",
        weight: "500 Gms",
        price: "₹109.00",
        location: "From Nagpur, Maharashtra",
        image: fruit2,
      },
      {
        name: "Sapota / Chiku",
        weight: "500 Gms",
        price: "₹79.00",
        location: "From Mysuru, Karnataka",
        image: fruit2,
      }
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
        image: veg1,
      }
    ],

    "Leafy and Seasonal": [
      {
        name: "Mint Leaves",
        weight: "100 Gms",
        price: "₹15.00",
        location: "From Ooty",
        image: leafy1,
      },
      {
        name: "Coriander Leaves",
        weight: "100 Gms",
        price: "₹12.00",
        location: "From Nilgiris",
        image: leafy2,
      }
    ],

    "Other Vegetables": [
      {
        name: "Tomato",
        weight: "500 Gms",
        price: "₹25.00",
        location: "From Hosur",
        image: veg2,
      }
    ],

    "dairy": [
      {
        name: "Cherry Tomato",
        weight: "200 Gms",
        price: "₹80.00",
        location: "From Bengaluru",
        image: veg1,
      }
    ],

    "snacksncoffee": [
      {
        name: "Misfit coffee",
        weight: "500 Gms",
        price: "₹40.00",
        location: "From Ooty",
        image: veg2,
      }
    ]
  };

  const categories = Object.keys(allProducts);
  const sidebarCategories = [
  { img: apple, label: "Fresh Fruits" },
  { img: carrot, label: "Fresh Vegetables" },
  { img: leaf, label: "Leafy and Seasonings" },
  // { img: tomato, label: "Exotics" },
  // { img: orange, label: "MisFits" },
  { img: dal, label: "Dals & Rice" },
  { img: dehydrated, label: "Dehydrated" },
  { img: grains, label: "Essentials" },
  { img: dairy, label: "Daily & eggs" },
  { img: snacksncoffee, label: "Snacks & Coffee" },
];

  return (
    <div className="product-page">
    <Navbar />

      {/* HEADER BAR */}
      {/* <div className="top-bar">
        <HiMenu size={26} className="menu-icon" />
        <div className="location">
          Bengaluru <FaChevronDown size={14} />
        </div>
      </div> */}



      {/* MAIN CONTENT */}
      <div className="content-area">
        {/* LEFT SIDEBAR */}
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
    <img src={item.img} alt={item.label} className="sidebar-icon" />
  </div>
  <span className="sidebar-text">{item.label}</span>
</div>
          ))}
        </div>          
        {/* RIGHT PRODUCTS GRID */}
        <div className="products-container">
          <h2 className="page-title">{selectedCategory}</h2>

          <div className="products">
            {allProducts[selectedCategory]?.map((prod, index) => (
              <div className="product-card" key={index}>
                <img
                  src={prod.image}
                  className="product-image"
                  alt={prod.name}
                />

                <div className="product-location">{prod.location}</div>

                <div className="product-name">{prod.name}</div>

                <input
                  className="weight-input"
                  value={prod.weight}
                  readOnly
                />

                <div className="product-price">{prod.price}</div>

                <button className="order-btn">Login To Order</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="bottom-login-bar">Login To Order</div>
    </div>
  );
} 