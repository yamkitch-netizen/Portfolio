import { useState } from "react";
import { FaBars, FaTimes, FaFacebookF, FaInstagram } from "react-icons/fa";
import "./Navbar.css";

const Navbar = ({ currentPath }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const isCorporateActive = currentPath === "#/corporate" || currentPath === "#corporate";
  const isAboutActive = currentPath === "#/about" || currentPath === "#about";
  const isHomeActive = !isCorporateActive && !isAboutActive;

  return (
    <header className="navbar">
      <div className="container navbar-container">

        <a 
          href="#/" 
          className="logo" 
          onClick={(e) => {
            setIsOpen(false);
            e.preventDefault();
            window.location.hash = "#/";
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
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
            <li>
              <a 
                href="#/" 
                className={isHomeActive ? "active-link" : ""} 
                onClick={() => setIsOpen(false)}
              >
                Home
              </a>
            </li>
            <li>
              <a 
                href="#/corporate" 
                className={isCorporateActive ? "active-link" : ""} 
                onClick={(e) => {
                  setIsOpen(false);
                  e.preventDefault();
                  window.location.hash = "#/corporate";
                  setTimeout(() => {
                    const el = document.getElementById("services");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }, 150);
                }}
              >
                Services
              </a>
            </li>
            <li>
              <a 
                href="#/about" 
                className={currentPath === "#/about" || currentPath === "#about" ? "active-link" : ""}
                onClick={() => setIsOpen(false)}
              >
                About
              </a>
            </li>
            <li>
              <a 
                href="#/" 
                onClick={(e) => {
                  setIsOpen(false);
                  e.preventDefault();
                  window.location.hash = "#/";
                  setTimeout(() => {
                    const el = document.getElementById("contact");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }, 150);
                }}
              >
                Contact
              </a>
            </li>
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