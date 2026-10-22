import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = ({ onSearch }) => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="cartnest-navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-brand-link">
          <span className="navbar-brand">🛒 CartNest</span>
        </Link>

        {/* Search bar */}
        <form className="navbar-search-form" onSubmit={handleSearch}>
          <div className="navbar-search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-bar navbar-search-input"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="navbar-search"
            />
          </div>
        </form>

        {/* Nav Links */}
        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/products" className="nav-link" onClick={() => setMenuOpen(false)}>
            Products
          </Link>

          {isAuthenticated() ? (
            <>
              <Link to="/cart" className="nav-link cart-nav-link" onClick={() => setMenuOpen(false)}>
                <span>🛍️</span>
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
              <Link to="/orders" className="nav-link" onClick={() => setMenuOpen(false)}>
                Orders
              </Link>
              {isAdmin() && (
                <Link to="/admin" className="nav-link admin-link" onClick={() => setMenuOpen(false)}>
                  Admin
                </Link>
              )}
              <div className="nav-user-menu">
                <button className="nav-user-btn">
                  <span className="user-avatar">
                    {user?.firstName?.charAt(0)?.toUpperCase() || '👤'}
                  </span>
                  <span className="user-name">{user?.firstName}</span>
                  <span>▾</span>
                </button>
                <div className="nav-dropdown">
                  <Link to="/profile" className="nav-dropdown-item" onClick={() => setMenuOpen(false)}>
                    👤 Profile
                  </Link>
                  <Link to="/orders" className="nav-dropdown-item" onClick={() => setMenuOpen(false)}>
                    📦 My Orders
                  </Link>
                  <div className="nav-dropdown-divider" />
                  <button className="nav-dropdown-item nav-dropdown-logout" onClick={handleLogout}>
                    🚪 Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/cart" className="nav-link cart-nav-link" onClick={() => setMenuOpen(false)}>
                <span>🛍️</span>
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
              <Link to="/login" className="btn-secondary-custom nav-btn" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="btn-primary-custom nav-btn" onClick={() => setMenuOpen(false)}>
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          id="hamburger-btn"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
