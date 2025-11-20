import React from "react";
import "./Footer.css";
import appstore from "../../Images/AppStore.png";
import playstore from "../../Images/PlayStore.png";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <h3>About us</h3>
          <p>Careers</p>
          <p>Our restaurant</p>
          <p>Wholesale</p>
          <p>Sustainability</p>
          <p>Our packaging</p>
          <p>Growers & makers</p>
          <p>Modern slavery statement</p>
          <p>Gender pay gap report</p>
        </div>

        <div className="footer-column">
          <h3>Help</h3>
          <p>FAQs</p>
          <p>Contact us</p>
        </div>

        <div className="footer-column">
          <h3>Ordering & Delivery</h3>
          <p>Where's my order?</p>
          <p>Delivery information</p>
          <p>Cancellation</p>
          <p>Pause orders</p>
          <p>Refer a Friend</p>
        </div>

        <div className="footer-column">
          <h3>Download our app</h3>
          <img src={appstore} alt="app store" className="store-img" />
          <img src={playstore} alt="google play" className="store-img" />
        </div>
      </div>

      {/* SOCIAL ICONS */}
      <div className="social-row">
        <i className="fab fa-facebook"></i>
        <i className="fab fa-twitter"></i>
        <i className="fab fa-pinterest"></i>
        <i className="fab fa-instagram"></i>
        <i className="fab fa-youtube"></i>
      </div>

      <div className="footer-bottom">
        <p>Terms and conditions | Privacy information | Cookie policy</p>
        <small>
          © 2017-2025 myFarmlet Organic Farmers Ltd, Buckfastleigh, Devon, TQ11
          0JU.
        </small>
      </div>
    </footer>
  );
}
