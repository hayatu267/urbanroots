// client/src/components/Header.js
import React, { useState, useEffect, useContext } from 'react';
import { FaBars, FaTimes, FaMoon, FaSun, FaShoppingCart } from 'react-icons/fa';
import './Header.css';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

import { Link } from 'react-router-dom';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cartItems } = useContext(CartContext);
  const { user, isAdmin, logout } = useContext(AuthContext);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      document.body.classList.add('dark');
      setDarkMode(true);
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setDarkMode(!darkMode);
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-top">
        <Link to="/" className="logo">UrbanRoots</Link>

        <button className="menu-toggle" onClick={toggleMenu}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <nav className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <Link to="/" onClick={toggleMenu}>Home</Link>
          <Link to="/shop" onClick={toggleMenu}>Shop</Link>
          <Link to="/contact" onClick={toggleMenu}>Contact</Link>
          {isAdmin ? (
            <Link to="/admin" onClick={toggleMenu}>Admin</Link>
          ) : (
            <Link to="/login" onClick={toggleMenu}>Admin Login</Link>
          )}
          {user && (
            <button className="cta-button" onClick={() => { logout(); toggleMenu(); }}>
              Log Out
            </button>
          )}
        </nav>

        <div className="header-actions">
          <Link to="/cart" className="cart-icon"> <FaShoppingCart />
          {cartItems?.length > 0 && <span className="cart-count">{cartItems.length}</span>}</Link>

          <button className="theme-toggle" onClick={toggleTheme}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
