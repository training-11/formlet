import React from "react";
import Navbar from "./Components/Home/Navbar";
import Hero from "./Components/Home/Hero";
import Footer from "./Components/Home/Footer";
import StepsSection from "./Components/Home/StepsSection";
import Testimonials from "./Components/Home/Testimonials";
import GrownForFlavour from "./Components/Home/GrownForFlavour";
import SliderWithHero from "./Components/Home/SliderWithHero";
import "./App.css";

export default function App() {
  return (
    <div className="app-root">
      <Navbar />
      <Hero />
      <StepsSection />
      <Testimonials />
      <GrownForFlavour />
      <SliderWithHero/>

      <Footer />
    </div>
  );
}
