import React from "react";
import "./Footer.css";
import appstore from "../../Images/AppStore.png";
import playstore from "../../Images/PlayStore.png";
//starting of function
import facebook from "../../Images/FB.svg";
import twitter from "../../Images/X.svg";
import pinterest from "../../Images/Pinterest.svg";
import instagram from "../../Images/Instagram.svg";
import youtube from "../../Images/Youtube.svg";


export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <h3>About us</h3>
          <p>Careers</p>
          <p>Sustainability</p>
          <p>Our packaging</p>
          <p>Growers & makers</p>
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
      <div className="social-icons">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <img src={facebook} alt="Facebook" className="social-icon" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <img src={twitter} alt="Twitter" className="social-icon" />
          </a>
          <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer">
            <img src={pinterest} alt="Pinterest" className="social-icon" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <img src={instagram} alt="Instagram" className="social-icon" />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
            <img src={youtube} alt="YouTube" className="social-icon" />
          </a>

          </div>
      <div className="footer-bottom">
        <p>Terms and conditions | Privacy information | Cookie policy</p>
      </div>
    </footer>
  );
}