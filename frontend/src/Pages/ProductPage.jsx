import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./ProductPage.css";
// import { HiMenu } from "react-icons/hi";
// import { FaChevronDown } from "react-icons/fa";
// import Navbar from "../components/Navbar/Navbar";
import Navbar from "../Components/Home/Navbar";

// IMAGES
import fruit1 from "../Images/fruit1.png";
import fruit2 from "../Images/fruit2.jpg";
import fruit3 from "../Images/fruit3.jpg";
import fruit4 from "../Images/fruit4.jpg";
import fruit5 from "../Images/fruit5.png";
import fruit6 from "../Images/fruit6.jpg";
import veg1 from "../Images/veg1.png";
import veg2 from "../Images/veg2.png";
import veg3 from "../Images/veg3.png";
import veg4 from "../Images/veg4.png";
import veg5 from "../Images/veg5.jpg";
import veg6 from "../Images/veg6.png";
import veg7 from "../Images/veg7.png";
import veg8 from "../Images/veg8.jpg";
import leafy1 from "../Images/leafy1.png";
import leafy2 from "../Images/leafy2.jpg";
import leafy3 from "../Images/leafy3.jpg";
import leafy4 from "../Images/leafy4.png";
import leafy5 from "../Images/leafy5.jpg"
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
import otherveg1 from "../Images/otherveg1.jpg";
import otherveg2 from "../Images/otherveg2.jpg";
import otherveg3 from "../Images/otherveg3.jpg";
import otherveg4 from "../Images/otherveg4.jpeg";
import otherveg5 from "../Images/otherveg5.jpeg";
import otherveg6 from "../Images/otherveg6.png";
import otherveg7 from "../Images/otherveg7.png";
import otherveg8 from "../Images/otherveg8.png";
import dals1 from "../Images/dals1.png";




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
        name: "Sapota / Chiku",
        weight: "500 Gms",
        price: "₹79.00",
        location: "From Mysuru, Karnataka",
        image: fruit3,
      },
          { 
            name: "Nagpur Orange (500–600g)", 
            weight: "500 Gms", 
            price: "₹89.00", 
            location: "From Nagpur, Maharashtra", 
            image: fruit2 ,
          },
           { 
            name: "Nagpur Orange (1000–1200g)", 
            weight: "500 Gms", 
            price: "₹109.00", 
            location: "From Nagpur, Maharashtra", 
            image: fruit2 ,
          },
         { 
            name: "Red Lady Papaya - Medium (1000g - 1200g) (Seedless)", weight: "1000 Gms", price: "₹109.00", location: "From Kadapa, Andhra Pradesh", image: fruit4 ,},
          { 
            name: "Red Lady Papaya - Medium (600g - 800g) (Seedless)", weight: "700 Gms", price: "₹89.00", location: "From Kadapa, Andhra Pradesh", image: fruit4 ,},
           { name: "Watermelon Kiran", weight: "2000 Gms", price: "₹189.00", location: "From Denkanikottai, Tamilnadu", image: fruit5, },
          { name : "Banana Elakki", weight: "1000 Gms", price: "₹129.00", location: "From Denkanikottai, Tamilnadu", image: fruit6,},
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

    "Leafy and Seasonings": [
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
      },
      {
        name: "Coriander Leaves",
        weight: "100 Gms",
        price: "₹18.00",
        location: "From DenkaniKottai",
        image: leafy5,
      },
      {
        name: "Dhantu Green",
        weight: "250 Gms",
        price: "₹40.00",
        location: "From DenkaniKottai",
        image: leafy4,
      },
       {
        name: "Agathi Leaves",
        weight: "250 Gms",
        price: "₹35.00",
        location: "From Denkanikottai, Tamilnadu",
        image: leafy3,
      }
    ],

    "Other Vegetables": [
      {
        name: "Tomato",
        weight: "500 Gms",
        price: "₹25.00",
        location: "From Hosur",
        image: veg2,
      },
      {
        name: "Lemon (8pcs - 11pcs)",
        weight: "250 Gms",
        price: "₹57.00",
        location: "From Kadapa",
        image: otherveg1,
      },
       {
        name: "Red Capsicum",
        weight: "300 Gms",
        price: "₹79.00",
        location: "From Denkanikottai, Tamilnadu",
        image: otherveg2,
      },
      {
        name: "Sambar Onion",
        weight: "500 Gms",
        price: "₹65.00",
        location: "From Harur",
        image: otherveg3,
      },
       {
        name: "Brown Channa Sprouts",
        weight: "200 Gms",
        price: "₹65.00",
        location: "From Bengaluru, Karnataka",
        image: otherveg4,
      },
       {
        name: "Diced Yam",
        weight: "250 Gms",
        price: "₹95.00",
        location: "From Bengaluru, Karnataka",
        image: otherveg5,
      },
        {
        name: "Ginger",
        weight: "100 Gms",
        price: "₹23.00",
        location: "From DenkaniKottai",
        image: otherveg6,
      },
        {
        name: "Green Beans Cut",
        weight: "200 Gms",
        price: "₹95.00",
        location: "From Bengaluru, Karnataka",
        image: otherveg7,
      },
      {
        name: "Ooty Potato",
        weight: "500 Gms",
        price: "₹80.00",
        location: "From Nilgiris, Tamilnadu",
        image: otherveg8,
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
      
    ],
       "Dals & Rice": [
      {
        name: "Unpolished Toor Dal",
        weight: "500 Gms",
        price: "₹189.00",
        location: "From Bijapur, Karnataka",
        image: dals1,
      }
      
    ]
  };

  const categories = Object.keys(allProducts);
  const sidebarCategories = [
  { img: apple, label: "Fresh Fruits" },
  { img: carrot, label: "Fresh Vegetables" },
  { img: leaf, label: "Leafy and Seasonings" },
  { img :leafy1, label : "Other Vegetables"},
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