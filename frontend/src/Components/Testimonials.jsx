import React from "react";
import "./Testimonials.css";

/**
 * Testimonials component
 * Make sure the image file exists at BG_IMAGE path (or update the path if moved).
 */
export default function Testimonials() {
  const BG_IMAGE = "/mnt/data/9e468c0c-ebff-4d37-8749-cd5cd4dbc2e1.png";

  return (
    <section
      className="testimonials"
      style={{
        backgroundImage: `url(${BG_IMAGE})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      aria-label="Customer testimonials"
    >
      <div className="testimonials-inner">
        <h2 className="testimonials-title">Hear from our customers</h2>

        <div className="testimonials-grid">
          {/* Testimonial 1 */}
          <article className="testimonial">
            <div className="quote-mark">“”</div>

            <p className="testimonial-text">
              The boxes have a much greater range than many supermarkets. The
              boxes also encourage us to{" "}
              <span className="highlight">try varieties</span> we have not
              previously encountered.
            </p>

            <div className="testimonial-author">WILL, ALDRIDGE</div>
          </article>

          {/* Testimonial 2 */}
          <article className="testimonial">
            <div className="quote-mark">“”</div>

            <p className="testimonial-text">
              The convenience of having fresh organic fruit &amp; veg delivered
              to my door each week is essential to my{" "}
              <span className="highlight">family eating well</span>.
            </p>

            <div className="testimonial-author">ANGELLIQUE, LONDON</div>
          </article>
        </div>
      </div>
    </section>
  );
}
