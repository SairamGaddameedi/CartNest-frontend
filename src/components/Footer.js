import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-section footer-brand-section">
            <div className="footer-brand">🛒 CartNest</div>
            <p className="footer-tagline">
              Your premium destination for home & lifestyle products. Curated quality, delivered fast.
            </p>
            <div className="footer-socials">
              <a href="#!" className="footer-social-link" aria-label="Twitter">🐦</a>
              <a href="#!" className="footer-social-link" aria-label="Instagram">📸</a>
              <a href="#!" className="footer-social-link" aria-label="Facebook">👍</a>
              <a href="#!" className="footer-social-link" aria-label="YouTube">▶️</a>
            </div>
          </div>

          {/* Shop */}
          <div className="footer-section">
            <h4 className="footer-heading">Shop</h4>
            <Link to="/products" className="footer-link">All Products</Link>
            <Link to="/products?categoryId=1" className="footer-link">Electronics</Link>
            <Link to="/products?categoryId=2" className="footer-link">Fashion</Link>
            <Link to="/products?categoryId=3" className="footer-link">Home & Kitchen</Link>
            <Link to="/products?categoryId=5" className="footer-link">Sports</Link>
          </div>

          {/* Account */}
          <div className="footer-section">
            <h4 className="footer-heading">Account</h4>
            <Link to="/login" className="footer-link">Login</Link>
            <Link to="/register" className="footer-link">Register</Link>
            <Link to="/orders" className="footer-link">My Orders</Link>
            <Link to="/cart" className="footer-link">My Cart</Link>
            <Link to="/profile" className="footer-link">Profile</Link>
          </div>

          {/* Support */}
          <div className="footer-section">
            <h4 className="footer-heading">Support</h4>
            <a href="#!" className="footer-link">Help Center</a>
            <a href="#!" className="footer-link">Returns & Refunds</a>
            <a href="#!" className="footer-link">Shipping Info</a>
            <a href="#!" className="footer-link">Contact Us</a>
            <a href="#!" className="footer-link">Privacy Policy</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} CartNest. All rights reserved. Built with ❤️
          </p>
          <div className="footer-payment-badges">
            <span className="payment-badge">💳 Visa</span>
            <span className="payment-badge">💳 Mastercard</span>
            <span className="payment-badge">📱 UPI</span>
            <span className="payment-badge">🏦 NetBanking</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
