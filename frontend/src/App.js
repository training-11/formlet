import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";  // Import BrowserRouter
import MainHome from "./Components/Home/MainHome";
import ProductPage from "./Pages/ProductPage";
import { AuthProvider } from "./Context/AuthContext";
import AdminLayout from "./Components/Admin/AdminLayout";
import AdminOrderDetails from "./Components/Admin/AdminOrderDetails";
import ResetPassword from "./Pages/ResetPassword";
import DeliverySchedulePage from "./Pages/DeliverySchedulePage";
import AccountPage from "./Pages/AccountPage";



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
          <Route path="/admin/orders/:id" element={<AdminLayout><AdminOrderDetails /></AdminLayout>} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/delivery-schedule" element={<DeliverySchedulePage />} />
          <Route path="/account" element={<AccountPage />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
