import React from "react";
import { Routes, Route } from "react-router-dom";
import MainHome from "../Components/Home/MainHome";
import LoginPage from "../Components/Login Page/LoginPage.jsx";

export default function AllRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainHome />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

