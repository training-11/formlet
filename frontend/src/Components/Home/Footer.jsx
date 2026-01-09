import React from "react";
import "./Footer.css";
import appstore from "../../Images/AppStore.png";
import playstore from "../../Images/PlayStore.png";
import facebook from "../../Images/FB.svg";
import twitter from "../../Images/X.svg";
import pinterest from "../../Images/Pinterest.svg";
import instagram from "../../Images/Instagram.svg";
import youtube from "../../Images/Youtube.svg";


import { FaPhoneAlt, FaCcVisa, FaCcMastercard, FaCcAmex, FaCreditCard } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top-section">
        <div className="footer-container">
          <div className="footer-column">
            <h3>About us</h3>
            <p>Careers</p>
            <p>Sustainability</p>
            <p>Our packaging</p>
            <p>Growers & makers</p>
            <p className="footer-terms">Terms and conditions | Privacy information | Cookie policy</p>
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

          <div className="footer-column app-payment-column">
            <h3>App & Payment</h3>
            <p className="app-subtitle">From App Store or Google Play</p>
            <div className="store-buttons-vertical">
              <img src={playstore} alt="google play" className="store-img" />
              <img src={appstore} alt="app store" className="store-img" />
            </div>

            <div className="payment-gateways">
              <p className="payment-title">Secured Payment Gateways</p>
              <div className="payment-icons">
                <img src="https://organicmandya.com/cdn/shop/files/9df20d065d424eb84b76f8b62e604c51.png?v=1722334866&width=500" alt="Payment Gateways" className="payment-gateway-img" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom-section">
        {/* CONTACT & SOCIAL ROW */}
        <div className="footer-contact-row">
          <div className="footer-phone">
            <div className="phone-icon-circle">
              <FaPhoneAlt size={18} />
            </div>
            <span className="phone-number">+91 7386120893</span>
          </div>

          <div className="footer-social-wrapper">
            <span className="follow-us-text">Follow Us</span>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <img src={facebook} alt="Facebook" className="social-icon" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <img src={twitter} alt="Twitter" className="social-icon" />
              </a>

              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <img src={instagram} alt="Instagram" className="social-icon" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                <img src={youtube} alt="YouTube" className="social-icon" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}