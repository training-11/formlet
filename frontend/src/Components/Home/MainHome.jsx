import React from 'react'
import Navbar from "./Navbar";
import Hero from "./Hero";
import HeroFeatures from './HeroFeatures';
import Footer from "./Footer";
import StepsSection from "./StepsSection";
import Testimonials from "./Testimonials";
import GrownForFlavour from "./GrownForFlavour";
import SliderWithHero from "./SliderWithHero";
import FaqSection from "./FaqSection";
// import FarmletPopup from "./FarmletPopup";
import IntroPopup from "./IntroPopup";
function MainHome() {
  return (
    <div>
      <IntroPopup />
      {/* <FarmletPopup /> */}
      <Navbar />

      <Hero />
      <HeroFeatures />
      <StepsSection />
      <Testimonials />
      <GrownForFlavour />
      <SliderWithHero />


      <FaqSection />

      <Footer />
    </div>
  )
}

export default MainHome
