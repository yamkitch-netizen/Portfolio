import { useRef } from "react";
import { FaGoogle, FaStar, FaQrcode, FaExternalLinkAlt } from "react-icons/fa";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./GoogleReview.css";

gsap.registerPlugin(ScrollTrigger);

const GoogleReview = () => {
  const sectionRef = useRef();
  const cardRef = useRef();

  useGSAP(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );
  }, { scope: sectionRef });

  return (
    <section className="google-review-section" ref={sectionRef}>
      <div className="review-glow"></div>
      <div className="container">
        <div className="review-card" ref={cardRef}>
          {/* Left Side: Call to Action */}
          <div className="review-content">
            <div className="google-badge">
              <FaGoogle className="google-icon" />
              <span>Google Reviews</span>
            </div>
            
            <h2>Loved Our Food & Service?</h2>
            <p>
              Your feedback helps us grow! Scan the QR code or click the button below to share your experience with us on Google. We appreciate your support!
            </p>

            <div className="rating-wrap">
              <div className="stars">
                <FaStar className="star" />
                <FaStar className="star" />
                <FaStar className="star" />
                <FaStar className="star" />
                <FaStar className="star" />
              </div>
              <span className="rating-text">5.0 Star Rated on Google</span>
            </div>

            <a
              href="https://g.page/r/CYIMCYAW3nohECE/review"
              target="_blank"
              rel="noopener noreferrer"
              className="write-review-btn"
            >
              <span>Write a Review</span>
              <FaExternalLinkAlt />
            </a>
          </div>

          {/* Right Side: QR Code Scanner */}
          <div className="qr-container">
            <div className="scanner-frame">
              <div className="scanner-line"></div>
              <img
                src="/google-review-qr.png"
                alt="Scan to review YAMKITCH"
                className="qr-image"
              />
              <div className="corner-border top-left"></div>
              <div className="corner-border top-right"></div>
              <div className="corner-border bottom-left"></div>
              <div className="corner-border bottom-right"></div>
            </div>
            <div className="qr-instructions">
              <FaQrcode className="qr-icon" />
              <span>Scan to review instantly</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoogleReview;
