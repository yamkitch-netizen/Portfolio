import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
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
          <video 
            src="/Animate_this_logo_1080p_202607061927.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline
            preload="auto"
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
          
          <button className="quote-btn nav-quote-btn" onClick={() => setIsOpen(false)}>
            Get Quote
          </button>
        </nav>

        {/* Desktop Quote Button */}
        <button className="quote-btn desktop-quote-btn">
          Get Quote
        </button>

      </div>
    </header>
  );
};

export default Navbar;