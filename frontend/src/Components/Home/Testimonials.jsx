// src/Components/Testimonials/Testimonials.jsx
import React from "react";
import "./Testimonials.css";

export default function Testimonials() {
  // if you still have BG_IMAGE variable you can keep it, but we won't use it
  // const BG_IMAGE = "/mnt/data/9e468c0c-ebff-4d37-8749-cd5cd4dbc2e1.png";

  return (
    <section
      className="testimonials"
      style={{
        /* backgroundImage removed so CSS green color shows */
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      aria-label="Customer testimonials"
    >
      <div className="testimonials-inner">
        <h2 className="testimonials-title">Hear from our customers</h2>

        <div className="testimonials-grid">
          <article className="testimonial">
            <div className="quote-mark" width="120" height="98">
              <img src="https://media.riverford.co.uk/images/anon-home-customer-quote-icon.png" width="120" height="98" loading="lazy" decoding="async" alt=""></img>
            </div>
            <p className="testimonial-text">
              The boxes have a much greater range than many supermarkets.
              The boxes also encourage us to <span className="highligth">try varieties</span> we have not previously encountered.
            </p>
            <div className="testimonial-author"></div>
          </article>

          <article className="testimonial">
            
            <img src="https://media.riverford.co.uk/images/anon-home-customer-quote-icon.png" width="120" height="98" loading="lazy" decoding="async" alt=""></img>

            <p className="testimonial-text">
              The convenience of having fresh organic fruit &amp; veg delivered to my door each week is essential to
               my<span className="highligh">family eating well.</span>
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}