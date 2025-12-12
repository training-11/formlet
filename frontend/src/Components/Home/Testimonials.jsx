// src/Components/Testimonials/Testimonials.jsx
import React, { useState } from "react";
import "./Testimonials.css";

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const testimonialsMobile = [
    {
      id: 1,
      text: (
        <>
          The boxes have a much greater range than many supermarkets.
          The boxes also encourage us to <span className="highligth">try varieties</span> we have not previously encountered.
        </>
      ),
    },
    {
      id: 2,
      text: (
        <>
          The convenience of having fresh organic fruit & veg delivered to my door each week is essential to my
          <span className="highligh"> family eating well.</span>
        </>
      ),
    },
  ];

  // Unified slide change function - used by both arrows and dots
  const changeSlide = (newIndex) => {
    if (newIndex !== currentIndex && !isTransitioning && newIndex >= 0 && newIndex < testimonialsMobile.length) {
      setIsTransitioning(true);
      setCurrentIndex(newIndex);
      
      // Reset transition lock after animation completes
      setTimeout(() => {
        setIsTransitioning(false);
      }, 400);
    }
  };

  // Arrow navigation handlers
  const handleNext = () => {
    changeSlide(currentIndex + 1);
  };

  const handlePrev = () => {
    changeSlide(currentIndex - 1);
  };

  // Check bounds for arrow states
  const isFirstSlide = currentIndex === 0;
  const isLastSlide = currentIndex === testimonialsMobile.length - 1;

  return (
    <section
      className="testimonials"
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      aria-label="Customer testimonials"
    >
      <div className="testimonials-inner">
        <h2 className="testimonials-title">Hear from our customers</h2>

        {/* Desktop - Two testimonials side-by-side */}
        <div className="testimonials-grid">
          <article className="testimonial">
            <div className="quote-mark">
              <img src="https://media.riverford.co.uk/images/anon-home-customer-quote-icon.png" width="120" height="98" loading="lazy" decoding="async" alt=""></img>
            </div>
            <p className="testimonial-text">
              The boxes have a much greater range than many supermarkets.
              The boxes also encourage us to <span className="highligth">try varieties</span> we have not previously encountered.
            </p>
          </article>

          <article className="testimonial">
            <img src="https://media.riverford.co.uk/images/anon-home-customer-quote-icon.png" width="120" height="98" loading="lazy" decoding="async" alt=""></img>
            <p className="testimonial-text">
              The convenience of having fresh organic fruit &amp; veg delivered to my door each week is essential to
              my <span className="highligh">family eating well.</span>
            </p>
          </article>
        </div>

        {/* Mobile - Carousel with simple arrows */}
        <div className="testimonials-mobile-wrapper">
          <button 
            className={`simple-arrow arrow-left ${isFirstSlide ? 'disabled' : ''}`}
            onClick={handlePrev} 
            disabled={isFirstSlide || isTransitioning}
            aria-label="Previous testimonial"
          >
            ‹
          </button>

          <div className="testimonials-mobile">
            <div className="testimonial-slider">
              {testimonialsMobile.map((testimonial, index) => (
                <article 
                  key={testimonial.id}
                  className={`testimonial-card mobile-card ${
                    index === currentIndex ? 'active' : ''
                  } ${
                    index < currentIndex ? 'prev' : ''
                  } ${
                    index > currentIndex ? 'next' : ''
                  }`}
                >
                  <img
                    src="https://media.riverford.co.uk/images/anon-home-customer-quote-icon.png"
                    className="quote-img"
                    alt="Quote"
                  />
                  <p className="testimonial-text">
                    {testimonial.text}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <button 
            className={`simple-arrow arrow-right ${isLastSlide ? 'disabled' : ''}`}
            onClick={handleNext} 
            disabled={isLastSlide || isTransitioning}
            aria-label="Next testimonial"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}