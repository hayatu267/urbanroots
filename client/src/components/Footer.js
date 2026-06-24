import React from 'react';
import { FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa6';
import Logo from './Logo';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Logo size={30} />
        </div>
        <div className="socials">
          <a href="#" aria-label="Instagram"><FaInstagram /></a>
          <a href="#" aria-label="TikTok"><FaTiktok /></a>
          <a href="#" aria-label="YouTube"><FaYoutube /></a>
        </div>
        <p className="footer-copy">&copy; 2025 UrbanRoots. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
