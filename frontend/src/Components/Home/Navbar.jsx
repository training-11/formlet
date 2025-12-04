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
import leafy3 from "../../Images/leafy3.jpg";
import leafy4 from "../../Images/leafy4.png";
import leafy5 from "../../Images/leafy5.jpg";
import otherveg1 from "../../Images/otherveg1.jpg";
import otherveg2 from "../../Images/otherveg2.jpg";
import otherveg3 from "../../Images/otherveg3.jpg";
import otherveg4 from "../../Images/otherveg4.jpeg";
import otherveg5 from "../../Images/otherveg5.jpeg";
import otherveg6 from "../../Images/otherveg6.png";
import otherveg7 from "../../Images/otherveg7.png";
import otherveg8 from "../../Images/otherveg8.png";
import dai1 from "../../Images/dai1.jpg";
import dai2 from "../../Images/dai2.jpg";
import dai3 from "../../Images/dai3.jpg";
import dai4 from "../../Images/dai4.png";
import dai5 from "../../Images/dai5.jpg";
import dairy from "../../Images/dairy.png";
import dai6 from "../../Images/dai6.jpg";
import dai7 from "../../Images/dai7.jpg";
import dai8 from "../../Images/dai8.jpg";
import dai9 from "../../Images/dai9.jpg";
import ns1 from "../../Images/ns1.png";
import ns2 from "../../Images/ns2.png";
import ns3 from "../../Images/ns3.png";
import ns4 from "../../Images/ns4.png";
import ns5 from "../../Images/ns5.png";
import ns6 from "../../Images/ns6.jpeg";
import ns7 from "../../Images/ns7.png";
import md1 from "../../Images/md1.jpg";
import md2 from "../../Images/md2.jpg";
import md3 from "../../Images/md3.jpg";
import md4 from "../../Images/md4.jpg";
import md5 from "../../Images/md5.jpg";
import md6 from "../../Images/md6.png";
import md7 from "../../Images/md7.png";
import md8 from "../../Images/md8.png";
import md9 from "../../Images/md9.png";
import rc1 from "../../Images/rc1.jpg";
import rc2 from "../../Images/rc2.jpg";
import rc3 from "../../Images/rc3.jpeg";
import rc4 from "../../Images/rc4.jpeg";
import deh1 from "../../Images/deh1.jpg";

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
      "Dairy & eggs",
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
      "Dehydrated",
      "Masalas and Dry Fruits",
      "Snacks and coffee",
      "Natural sweeteners",
      "Ready to cook",
    
    ],
    "Dairy & eggs":[
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
      title: "Dairy & eggs",
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
          },
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

  // "Other vegetables" : [
  //     { name: "Mint Leaves", weight: "100 Gms", price: "₹15.00", location: "From Ooty", image: leafy1 },
  //   { name: "Coriander Leaves", weight: "100 Gms", price: "₹12.00", location: "From Nilgiris", image: leafy2 }
  // ],
"What's new" :[

],
  "Essentials" : [
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
       },
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
             },
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
                   }, 

                   {
                           name: "Ginger Powder",
                           weight: "50 Gms",
                           price: "₹189.00",
                           location: "From Harohalli, Karnataka",
                           image: deh1,
                         }
                



  ],
  "Dairy & eggs" : [
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
  "Mlik": "Dairy & eggs",
  "Eggs": "Dairy & eggs",
  "Yogurts": "Dairy & eggs",
  "Cheese": "Dairy & eggs",
  "Butter & cream": "Dairy & eggs",
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
