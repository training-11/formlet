import React from 'react'
import Navbar from "./Navbar";
import Hero from "./Hero";
import Footer from "./Footer";
import StepsSection from "./StepsSection";
import Testimonials from "./Testimonials";
import GrownForFlavour from "./GrownForFlavour";
import SliderWithHero from "./SliderWithHero";
import FaqSection from "./FaqSection";
function MainHome() {
  return (
    <div>
        <Navbar />
      <Hero />
      <StepsSection />
      <Testimonials />
      <GrownForFlavour />
      <SliderWithHero/>
      <FaqSection/>

      <Footer />
    </div>
  )
}

export default MainHome
