import "./Hero.css";

const Hero = ({ openModal }) => {
  return (
    <section className="hero">
      <div className="hero-video-container">
        <video
          src="/Indian_food_spread_with_steam_202607060753.mp4"
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
          <span className="tag">
            Corporate Meal Solutions
          </span>

          <h1>
            Fresh.
            <br />
            Healthy.
            <br />
            Hygienic.
          </h1>

          <h2>
            Premium Homemade Meals
            <br />
            For Modern Workplaces.
          </h2>

          <p>
            Delicious home-style meals crafted by experienced chefs,
            delivered fresh every day to offices, startups, and
            corporate teams.
          </p>

          <div className="hero-buttons">
            <button 
              className="primary-btn"
              onClick={() => window.location.href = "tel:+916033550539"}
            >
              Get Started
            </button>
            <button 
              className="secondary-btn"
              onClick={() => openModal && openModal("subscription")}
            >
              Explore Services
            </button>
          </div>
        </div>
      </div>

      <div className="hero-right">
        <img
          src="/Lady.png"
          alt="Chef Lady"
          className="hero-lady-img"
        />
      </div>

      <div className="hero-waves">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 200" preserveAspectRatio="none">
          <path fill="rgba(255, 255, 255, 0.15)" d="M0,80 C320,130 640,30 960,80 C1280,130 1360,100 1440,90 L1440,200 L0,200 Z"></path>
          <path fill="rgba(255, 255, 255, 0.3)" d="M0,120 C360,170 720,70 1080,120 C1260,140 1380,120 1440,110 L1440,200 L0,200 Z"></path>
          <path fill="#0D0D0D" d="M0,150 C400,210 800,100 1200,160 C1320,180 1380,170 1440,160 L1440,200 L0,200 Z"></path>
        </svg>
      </div>

    </section>
  );
};

export default Hero;