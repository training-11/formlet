import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";  // Import BrowserRouter
import MainHome from "./Components/Home/MainHome";
import ProductPage from "./Pages/ProductPage";
import { AuthProvider } from "./Context/AuthContext";
import AdminLayout from "./Components/Admin/AdminLayout";
import ResetPassword from "./Pages/ResetPassword";


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* HOME PAGE */}
          <Route path="/" element={<MainHome />} />

          {/* PRODUCT PAGE */}
          <Route path="/products/:category" element={<ProductPage />} />

          <Route path="/admin" element={<AdminLayout />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
