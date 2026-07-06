import { useState } from "react";
import { FaBars, FaTimes, FaFacebookF, FaInstagram } from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="navbar">
      <div className="container navbar-container">

        <a href="/" className="logo">
          <img 
            src="/WhatsApp_Image_2026-07-05_at_21.14.02-removebg-preview.png" 
            alt="YAMKITCH Logo"
          />
        </a>

        {/* Hamburger Menu Toggle Button */}
        <button className="nav-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Nav Link Menu */}
        <nav className={`nav-menu ${isOpen ? "active" : ""}`}>
          <ul className="nav-links">
            <li><a href="#" onClick={() => setIsOpen(false)}>Home</a></li>
            <li><a href="#" onClick={() => setIsOpen(false)}>Services</a></li>
            <li><a href="#" onClick={() => setIsOpen(false)}>Corporate</a></li>
            <li><a href="#" onClick={() => setIsOpen(false)}>Gallery</a></li>
            <li><a href="#" onClick={() => setIsOpen(false)}>About</a></li>
            <li><a href="#" onClick={() => setIsOpen(false)}>Contact</a></li>
          </ul>
          
          <div className="nav-socials mobile-socials">
            <a 
              href="https://www.facebook.com/profile.php?id=61572043829117" 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={() => setIsOpen(false)}
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>
            <a 
              href="https://www.instagram.com/yamkitch?igsh=MTVpNDR1NXh0dWs1aQ==" 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={() => setIsOpen(false)}
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
          </div>
        </nav>

        {/* Desktop Social Icons */}
        <div className="nav-socials desktop-socials">
          <a 
            href="https://www.facebook.com/profile.php?id=61572043829117" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="Facebook"
          >
            <FaFacebookF />
          </a>
          <a 
            href="https://www.instagram.com/yamkitch?igsh=MTVpNDR1NXh0dWs1aQ==" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>
        </div>

      </div>
    </header>
  );
};

export default Navbar;