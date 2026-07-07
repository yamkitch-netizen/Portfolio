import { FaFacebookF, FaInstagram, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-glow"></div>
      
      <div className="container">
        <div className="footer-grid">
          {/* Column 1: Brand & Socials */}
          <div className="footer-brand">
            <a href="/" className="footer-logo">
              <img 
                src="/WhatsApp_Image_2026-07-05_at_21.14.02-removebg-preview.png" 
                alt="YAMKITCH Logo"
              />
            </a>
            <div className="footer-logo-info" style={{ margin: "12px 0 18px", fontSize: "0.88rem", lineHeight: "1.4" }}>
              <div style={{ color: "#D4A017", fontWeight: "600" }}>Agartala, Tripura, 799001</div>
              <div style={{ color: "#aaa", fontSize: "0.8rem", marginTop: "4px", letterSpacing: "0.5px" }}>
                9:00-10:00 AM &bull; 1:00-2:00 PM &bull; 8:00-8:30 PM
              </div>
            </div>
            <p>
              Fresh, healthy, and hygienic daily subscription meals and professional event catering services prepared by local experts and delivered to your doorstep.
            </p>
            <div className="footer-socials">
              <a 
                href="https://www.facebook.com/profile.php?id=61572043829117" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-link"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
              <a 
                href="https://www.instagram.com/yamkitch?igsh=MTVpNDR1NXh0dWs1aQ==" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-link"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col">
            <h3>Quick Links</h3>
            <div className="footer-links">
              <a href="#">Home</a>
              <a href="#">Services</a>
              <a href="#">Corporate Programs</a>
              <a href="#">Our Gallery</a>
              <a href="#">About YAMKITCH</a>
              <a href="#">Contact Us</a>
            </div>
          </div>

          {/* Column 3: Contact Info */}
          <div className="footer-col">
            <h3>Get In Touch</h3>
            <div className="footer-contact-info">
              {/* Address */}
              <div className="contact-item">
                <div className="contact-icon">
                  <FaMapMarkerAlt />
                </div>
                <div className="contact-text">
                  <h4>Address</h4>
                  <p>Agartala, Tripura, India</p>
                </div>
              </div>

              {/* Email */}
              <div className="contact-item">
                <div className="contact-icon">
                  <FaEnvelope />
                </div>
                <div className="contact-text">
                  <h4>Email Us</h4>
                  <a href="mailto:yamkitch@gmail.com">yamkitch@gmail.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom copyright */}
        <div className="footer-bottom">
          <p>© 2026 YAMKITCH. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
