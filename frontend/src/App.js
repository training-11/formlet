import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";  // Import BrowserRouter
import MainHome from "./Components/Home/MainHome";
import ProductPage from "./Pages/ProductPage";

export default function App() {
  return (
     <BrowserRouter>
      <Routes>
        {/* HOME PAGE */}
        <Route path="/" element={<MainHome />} />

        {/* PRODUCT PAGE */}
        <Route path="/products/:category" element={<ProductPage />} />
      </Routes>
    </BrowserRouter>
    
  );
}
