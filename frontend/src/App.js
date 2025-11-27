import React from "react";
import "./App.css";
import { BrowserRouter } from "react-router-dom";  // Import BrowserRouter
import AllRoutes from "./Routes/AllRoutes";       // Import Routes

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-root">
        <AllRoutes />
      </div>
    </BrowserRouter>
  );
}
