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
import naturalsweet from "../Images/naturalsweet.png";
import masalaanddry from "../Images/masalaanddry.png";
import readycook from "../Images/readycook.png";
// import tomato from "../Images/tomato.png";
import dal from "../Images/dal.png";
// import orange from "../Images/orange.jpg";
import dairy from "../Images/dairy.png";
import snacksncoffee from "../Images/snacksncoffee.png";
import grains from "../Images/grains.png";
import Dehydrated from "../Images/dehydrated.png";
import otherveg1 from "../Images/otherveg1.jpg";
import otherveg2 from "../Images/otherveg2.jpg";
import otherveg3 from "../Images/otherveg3.jpg";
import otherveg4 from "../Images/otherveg4.jpeg";
import otherveg5 from "../Images/otherveg5.jpeg";
import otherveg6 from "../Images/otherveg6.png";
import otherveg7 from "../Images/otherveg7.png";
import otherveg8 from "../Images/otherveg8.png";
import dals1 from "../Images/dals1.png";
import dals2 from "../Images/dals2.png";
import dals3 from "../Images/dals3.png";
import dals4 from "../Images/dals4.png";
import dals5 from "../Images/dals5.png";
import dals6 from "../Images/dals6.png";
import dals7 from "../Images/dals7.png";
import dals8 from "../Images/dals8.png";
import dals9 from "../Images/dals9.png";
import deh1 from "../Images/deh1.jpg";
import gra1 from "../Images/gra1.jpg";
import gra2 from "../Images/gra2.jpg";
import dai1 from "../Images/dai1.jpg";
import dai2 from "../Images/dai2.jpg";
import dai3 from "../Images/dai3.jpg";
import dai4 from "../Images/dai4.png";
import dai5 from "../Images/dai5.jpg";
import dai6 from "../Images/dai6.jpg";
import dai7 from "../Images/dai7.jpg";
import dai8 from "../Images/dai8.jpg";
import dai9 from "../Images/dai9.jpg";
import sna1 from "../Images/sna1.jpg";
import ns1 from "../Images/ns1.png";
import ns2 from "../Images/ns2.png";
import ns3 from "../Images/ns3.png";
import ns4 from "../Images/ns4.png";
import ns5 from "../Images/ns5.png";
import ns6 from "../Images/ns6.jpeg";
import ns7 from "../Images/ns7.png";
import rc1 from "../Images/rc1.jpg";
import rc2 from "../Images/rc2.jpg";
import rc3 from "../Images/rc3.jpeg";
import rc4 from "../Images/rc4.jpeg";
import md1 from "../Images/md1.jpg";
import md2 from "../Images/md2.jpg";
import md3 from "../Images/md3.jpg";
import md4 from "../Images/md4.jpg";
import md5 from "../Images/md5.jpg";
import md6 from "../Images/md6.png";
import md7 from "../Images/md7.png";
import md8 from "../Images/md8.png";
import md9 from "../Images/md9.png";




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


    "Snacks & Coffee": [
      {
        name: "Pure Blended Filter Coffee Powder",
        weight: "100 Gms",
        price: "₹135.00",
        image: sna1,
      }
      
    ],
       "Dals & Rice": [
      {
        name: "Unpolished Toor Dal",
        weight: "500 Gms",
        price: "₹189.00",
        location: "From Bijapur, Karnataka",
        image: dals1,
      },
      { 

        name: "UWhite Urad Dal Whole",
        weight: "500 Gms",
        price: "₹149.00",
        location: "From Thoothukudi, Tamilnadua",
        image: dals2,
      },
      {

        name: "Green Moong Dal Whole",
        weight: "500 Gms",
        price: "₹180.00",
        location: "From Bijapur, Karnataka",
        image: dals3,
      },
      {

        name: "Masoor Dal",
        weight: "500 Gms",
        price: "₹145.00",
        location: "From Nasik, Maharastra",
        image: dals4,
      },
      {

        name: "Sona Masoori Raw White Rice",
        weight: "1000 Gms",
        price: "₹179.00",
        location: "From Bellary, Karnataka",
        image: dals5,
      },
      {

        name: "Ponni Raw Rice",
        weight: "1000 Gms",
        price: "₹189.00",
        location: "From Harur, Tamilnadu",
        image: dals6,
      },
      {

        name: "Rajamudi Rice",
        weight: "1000 Gms",
        price: "₹159.00",
        location: "From Hassan, Karnataka",
        image: dals7,
      },
      {

        name: "Red Rice - Rakthashali",
        weight: "1000 Gms",
        price: "₹229.00",
        location: "From Bellary, Karnataka",
        image: dals8,
      },
      {

        name: "Thooyamalli Boiled Rice (Jasmine Rice)",
        weight: "1000 Gms",
        price: "₹199.00",
        location: "From Harur, Tamilnadu",
        image: dals9,
      },
    ],
    "Dehydrated": [
      {
        name: "Ginger Powder",
        weight: "50 Gms",
        price: "₹189.00",
        location: "From Harohalli, Karnataka",
        image: deh1,
      }
    ],
    "Grains and millets": [
      {
        name: "Kodo Millet Semi polished (Harka, Varagu) ",
        weight: "500 Gms",
        price: "₹149.00",
        location: "From Kanakapura, Karnataka",
        image: gra1,
      },
      {
        name: "Little Millet Semi Polished",
        weight: "500 Gms",
        price: "₹169.00",
        location: "From Kanakapura, Karnataka",
        image: gra2,
      }
    ],
    "Dairy & eggs": [
      {
        name: "Akshayakalpa Organic Country Eggs (Pack of 6)",
        weight: "6 pcs",
        price: "₹150.00",
        image: dai1,
      },
      {
        name: "Akshayakalpa Organic Slim Milk",
        weight: "1000 ML",
        price: "₹135.00",
        image: dai2,
      },
      {
        name: "Akshayakalpa Organic Cow Milk",
        weight: "1000 ML",
        price: "₹126.00",
        image: dai3,
      },
      {
        name: "Akshayakalpa Organic Artisan Cheese Slices",
        weight: "100 Gms",
        price: "₹114.00",
        image: dai4,
      },
      {
        name: "Akshayakalpa Organic Probiotic Curd",
        weight: "500 Gms",
        price: "₹55.00",
        image: dai5,
      },
      {
        name: "Akshayakalpa Organic Country Eggs (Pack of 6)",
        weight: "6 pcs",
        price: "₹150.00",
        image: dairy,
      },
      {
        name: "Akshayakalpa-Artisanal Organic Set Curd",
        weight: "200 Gms",
        price: "₹40.00",
        image: dai6,
      },
      {
        name: "Akshayakalpa-Organic Cooking Butter Un-salted",
        weight: "200 Gms",
        price: "₹217.00",
        image: dai7,
      },
      {
        name: "Akshayakalpa - Organic Cheddar Plain Young/Mild",
        weight: "200 Gms",
        price: "₹329.00",
        image: dai8,
      },
      {
        name: "Eggs (Free Range)",
        weight: "12 pcs",
        price: "₹289.00",
        image: dai9,
      }
    ],
    "Natural Sweeteners": [
      {
        name: "Khandsari Sugar",
        weight: "500 Gms",
        price: "₹110.00",
        location: "From Bengaluru, Karnataka",
        image: ns1,
      },
      {
        name: "Multi Floral Raw Honey",
        weight: "250 Gms",
        price: "₹249.00",
        location: "From Puttur, Karnataka",
        image: ns2,
      },
      {
        name: "Wild Forest Honey",
        weight: "250 Gms",
        price: "₹239.00",
        location: "From Palamu & Lathehar",
        image: ns3,
      },
      {
        name: "Bucket Jaggery",
        weight: "1000 Gms",
        price: "₹149.00",
        location: "From Managulli, Karnataka",
        image: ns4,
      },
      {
        name: "Palm Jaggery",
        weight: "500 Gms",
        price: "₹269.00",
        location: "From Harur, Tamilnadu",
        image: ns5,
      },
      {
        name: "Akshayakalpa Organic Multifloral Raw Honey",
        weight: "250 Gms",
        price: "₹200.00",
        location: "From Bengaluru, Karnataka",
        image: ns6,
      },
      {
        name: "Jaggery Powder",
        weight: "500 Gms",
        price: "₹119.00",
        location: "From Sitling, Tamilnadu",
        image: ns7,
      }
    ],
    "Ready to Cook": [
      {
        name: "Jumbo Rolled oats",
        weight: "500 Gms",
        price: "₹149.00",
        location: "From Mumbai, MH",
        image: rc1,
      },
      {
        name: "Akshayakalpa - Organic Idli & Dosa Batter",
        weight: "750 Gms",
        price: "₹75.00",
        location: "From Bengaluru, Karnataka",
        image: rc3,
      },
      {
        name: "Classic Tofu",
        weight: "200 Gms",
        price: "₹141.00",
        location: "From Bengaluru, Karnataka",
        image: rc2,
      },
      {
        name: "Akshayakalpa - Organic Ragi Dosa",
        weight: "750 Gms",
        price: "₹85.00",
        location: "From Bengaluru, Karnataka",
        image: rc4,
      }
    ],
    "Masalas and Dry Fruits": [
      {
        name: "Chia Seeds",
        weight: "100 Gms",
        price: "₹169.00",
        location: "From Chennai, TN",
        image: md1,
      },
      {
        name: "Himalayan Pink Salt",
        weight: "500 Gms",
        price: "₹69.00",
        location: "From Himachal, HP",
        image: md2,
      },
      {
        name: "Cinnamon",
        weight: "100 Gms",
        price: "₹229.00",
        location: "From Chennai, TN",
        image: md3,
      },
      {
        name: "Clove",
        weight: "50 Gms",
        price: "₹159.00",
        location: "From Chennai, TN",
        image: md4    ,
      },
      {
        name: "White Sesame Seeds",
        weight: "100 Gms",
        price: "₹110.00",
        location: "From Chennai, TN",
        image: md5,
      },
      {
        name: "Cashew",
        weight: "200 Gms",
        price: "₹399.00",
        location: "From Rampachodavaram, Andhra Pradesh",
        image: md6,
      },
      {
        name: "Almond",
        weight: "250 Gms",
        price: "₹383.00",
        location: "From Kashmir",
        image: md7,
      },
      {
        name: "Dry Grapes Black",
        weight: "250 Gms",
        price: "₹259.00",
        location: "From Kalihalli, Karnataka",
        image: md8,
      },
      {
        name: "Kashmiri Walnut Kernels",
        weight: "250 Gms",
        price: "₹519.00",
        location: "From Kashmir",
        image: md9,
      }
    ],  
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
  { img: Dehydrated, label: "Dehydrated" },
  { img: grains, label: "Grains and millets" },
  { img: dairy, label: "Dairy & eggs" },
  { img: snacksncoffee, label: "Snacks & Coffee" },
  { img: naturalsweet, label: "Natural Sweeteners" },
  { img: masalaanddry, label: "Masalas and Dry Fruits" },
  { img: readycook, label: "Ready to Cook" },
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