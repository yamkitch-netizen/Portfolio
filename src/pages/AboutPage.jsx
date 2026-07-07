import { useEffect } from "react";
import "./AboutPage.css";
import { FaStar, FaLightbulb, FaUtensils, FaShieldAlt, FaRupeeSign, FaTruck, FaUsers, FaRegThumbsUp } from "react-icons/fa";

const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-video-container">
          <video
            src="/Video__fresh_spices_cooking_Indian_202607071055.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="hero-video-bg"
          />
          <div className="hero-video-overlay" />
        </div>

        <div className="container hero-container">
          <div className="hero-left">
            <span className="tag" style={{ color: "#E91E63" }}>
              ABOUT US
            </span>
            <h1>
              Jo Khao, Wahi
              <br />
              Khilao...
            </h1>
            <p>
              Redefining online food ordering & delivery where you can get the best homemade food at your door steps in no time.
            </p>
          </div>
        </div>

        <div className="hero-waves">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 200" preserveAspectRatio="none">
            <path fill="rgba(255, 255, 255, 0.15)" d="M0,80 C320,130 640,30 960,80 C1280,130 1360,100 1440,90 L1440,200 L0,200 Z"></path>
            <path fill="rgba(255, 255, 255, 0.3)" d="M0,120 C360,170 720,70 1080,120 C1260,140 1380,120 1440,110 L1440,200 L0,200 Z"></path>
            <path fill="#0D0D0D" d="M0,150 C400,210 800,100 1200,160 C1320,180 1380,170 1440,160 L1440,200 L0,200 Z"></path>
          </svg>
        </div>
      </section>

      {/* Main Intro Block */}
      <section className="about-intro-section">
        <div className="container">
          <div className="about-intro-content" style={{ maxWidth: "850px", margin: "0 auto" }}>
            <h2>About YAMKITCH</h2>
            <div className="gold-bar" style={{ margin: "0 auto 25px auto" }}></div>
            <p>
              At <strong>YAMKITCH</strong>, we believe that great food fuels great work. We are a trusted corporate meal service dedicated to providing freshly prepared, hygienic, and affordable meals for businesses, organizations, and families across Agartala, Tripura.
            </p>
            <p>
              Every meal is prepared using carefully selected ingredients in a clean kitchen, ensuring the perfect balance of taste, nutrition, and quality. Whether it's a daily office lunch, employee meal program, family gathering, or large corporate event, our team is committed to delivering consistent quality and exceptional service.
            </p>
            <p>
              Our flexible meal plans are designed to suit different needs—from individual daily subscriptions to bulk catering for meetings, conferences, and special occasions. With punctual delivery, customizable menus, and a customer-first approach, we make mealtime simple, reliable, and enjoyable.
            </p>
          </div>

          <div className="about-why-section">
            <h3>Why Choose YAMKITCH?</h3>
            <div className="about-why-grid">
              
              {/* Card 1 */}
              <div className="about-why-card">
                <div className="card-image-bg">
                  <img src="/Gemini_Generated_Image_48mxu348mxu348mx.png" alt="Fresh Meals" />
                  <div className="card-image-overlay" />
                </div>
                <div className="card-content">
                  <div className="icon"><FaUtensils /></div>
                  <h3>Fresh Meals</h3>
                  <p>Freshly cooked meals prepared every day</p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="about-why-card">
                <div className="card-image-bg">
                  <img src="/Gemini_Generated_Image_gasvy9gasvy9gasv.png" alt="Hygiene Standards" />
                  <div className="card-image-overlay" />
                </div>
                <div className="card-content">
                  <div className="icon"><FaShieldAlt /></div>
                  <h3>Hygiene Standards</h3>
                  <p>High standards of hygiene and food safety</p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="about-why-card">
                <div className="card-image-bg">
                  <img src="/Gemini_Generated_Image_e1lvgpe1lvgpe1lv.png" alt="Affordable Pricing" />
                  <div className="card-image-overlay" />
                </div>
                <div className="card-content">
                  <div className="icon"><FaRupeeSign /></div>
                  <h3>Affordable Pricing</h3>
                  <p>Affordable pricing without compromising quality</p>
                </div>
              </div>

              {/* Card 4 */}
              <div className="about-why-card">
                <div className="card-image-bg">
                  <img src="/Gemini_Generated_Image_wi9exiwi9exiwi9e.png" alt="Reliable Delivery" />
                  <div className="card-image-overlay" />
                </div>
                <div className="card-content">
                  <div className="icon"><FaTruck /></div>
                  <h3>Reliable Delivery</h3>
                  <p>Reliable delivery for offices and organizations</p>
                </div>
              </div>

              {/* Card 5 */}
              <div className="about-why-card">
                <div className="card-image-bg">
                  <img src="/Gemini_Generated_Image_m6sskjm6sskjm6ss.png" alt="Custom Menus" />
                  <div className="card-image-overlay" />
                </div>
                <div className="card-content">
                  <div className="icon"><FaUsers /></div>
                  <h3>Custom Menus</h3>
                  <p>Custom meal plans for corporate and bulk orders</p>
                </div>
              </div>

              {/* Card 6 */}
              <div className="about-why-card">
                <div className="card-image-bg">
                  <img src="/Gemini_Generated_Image_v3nx27v3nx27v3nx.png" alt="Dependable Service" />
                  <div className="card-image-overlay" />
                </div>
                <div className="card-content">
                  <div className="icon"><FaRegThumbsUp /></div>
                  <h3>Dependable Service</h3>
                  <p>Friendly customer support and dependable service</p>
                </div>
              </div>

            </div>
          </div>

          <div className="about-footer-quote">
            <p>
              At YAMKITCH, our mission is simple—to serve delicious, wholesome meals that bring convenience, satisfaction, and value to every customer. We don't just deliver food; we deliver trust, consistency, and care in every meal.
            </p>
            <div className="tagline">YAMKITCH — Fresh. Healthy. Hygienic.</div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Sections */}
      <section className="mission-vision-section">
        <div className="container">
          
          {/* Mission Segment */}
          <div className="segment mission-segment">
            <div className="segment-image">
              <img src="/Gemini_Generated_Image_i7ob6ui7ob6ui7ob.png" alt="Our Mission" />
            </div>
            <div className="segment-info">
              <h2>Our Mission</h2>
              <div className="segment-subtitle">"Jo Khao, Wahi Khilao"</div>
              <div className="segment-points">
                <div className="point-item">
                  <div className="point-icon" style={{ color: "#FFC107" }}><FaStar /></div>
                  <p>We bring in technology & solutions for building a healthy society by delivering the best homemade food from nearby home chefs.</p>
                </div>
                <div className="point-item">
                  <div className="point-icon" style={{ color: "#FFC107" }}><FaStar /></div>
                  <p>Your neighbourhood kitchens are going to serve what they are going to serve their family. Our basic motto is "Jo Khao Wahi Khilao". So, you can rest assured that you are going to get healthy & tasty home food that has soul in it. In short, "Home food delivery that you count on us from the comfort of your home".</p>
                </div>
              </div>
            </div>
          </div>

          {/* Vision Segment */}
          <div className="segment vision-segment reversed">
            <div className="segment-info">
              <h2>Our Vision</h2>
              <div className="segment-subtitle">"Healthy India"</div>
              <div className="segment-points">
                <div className="point-item">
                  <div className="point-icon" style={{ color: "#00E676" }}><FaLightbulb /></div>
                  <p>Unifying India by removing unseen regional cuisine boundaries.</p>
                </div>
                <div className="point-item">
                  <div className="point-icon" style={{ color: "#00E676" }}><FaLightbulb /></div>
                  <p>Creating a healthy India by converting outside food equivalent to home cooked food.</p>
                </div>
              </div>
            </div>
            <div className="segment-image">
              <img src="/Gemini_Generated_Image_md9qv1md9qv1md9q.png" alt="Our Vision" />
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default AboutPage;
