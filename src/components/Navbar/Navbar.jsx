import "./Navbar.css";

const Navbar = () => {
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

        <nav>
          <ul className="nav-links">
            <li><a href="#">Home</a></li>
            <li><a href="#">Services</a></li>
            <li><a href="#">Corporate</a></li>
            <li><a href="#">Gallery</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </nav>

        <button className="quote-btn">
          Get Quote
        </button>

      </div>
    </header>
  );
};

export default Navbar;