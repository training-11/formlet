import React, { useState } from 'react'
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
  // Track whether the mobile search overlay is open
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  // Track whether the sign-in modal/page is open
  const [signInOpen, setSignInOpen] = useState(false);
  return (
    <div>
        <IntroPopup />
        {/* <FarmletPopup /> */}
        <Navbar
          mobileSearchOpen={mobileSearchOpen}
          setMobileSearchOpen={setMobileSearchOpen}
          signInOpen={signInOpen}
          setSignInOpen={setSignInOpen}
        />
    
      <Hero />
      <HeroFeatures />
      <StepsSection />
      <Testimonials />
      <GrownForFlavour />
      <SliderWithHero mobileSearchOpen={mobileSearchOpen} signInOpen={signInOpen} />
      <FaqSection/>
       
      <Footer />
    </div>
  )
}

export default MainHome
