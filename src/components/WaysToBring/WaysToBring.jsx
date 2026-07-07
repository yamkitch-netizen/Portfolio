import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaUtensils, FaBuilding, FaArrowRight } from "react-icons/fa";
import SubscriptionModal from "../SubscriptionModal/SubscriptionModal";
import "./WaysToBring.css";

gsap.registerPlugin(ScrollTrigger);

const WaysToBring = () => {
  const containerRef = useRef();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("subscription");

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  useGSAP(() => {
    const container = containerRef.current;

    // Scroll reveal animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });

    tl.from(".ways-header > span", {
      opacity: 0,
      y: 30,
      duration: 0.6
    })
    .from(".gold-highlight", {
      opacity: 0,
      y: 40,
      duration: 0.8
    }, "-=0.4")
    .from(".ways-card", {
      opacity: 0,
      y: 60,
      scale: 0.95,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out"
    }, "-=0.6");
  }, { scope: containerRef });

  return (
    <section className="ways-to-bring" ref={containerRef}>
      <div className="ways-glow"></div>
      
      <div className="container">
        {/* Section Header */}
        <div className="ways-header">
          <span>WHAT WE SERVE</span>
          <h2>
            Two ways to bring <span className="gold-highlight">YAMKITCH</span> to your table.
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="ways-grid">
          {/* Card 1: Daily Meal Subscription */}
          <div className="ways-card" onClick={() => openModal("subscription")}>
            <div className="ways-icon-wrap">
              <FaUtensils />
            </div>
            <h3>Daily Meal Subscription</h3>
            <p>
              Fresh, healthy & hygienic breakfast, lunch and dinner delivered 
              every day for individuals, families and working professionals 
              with flexible weekly & monthly plans.
            </p>
            <a 
              href="#" 
              className="ways-link subscribe-highlight"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openModal("subscription");
              }}
            >
              Subscribe Now <FaArrowRight className="link-arrow" />
            </a>
          </div>

          {/* Card 2: Corporate & Family Programs */}
          <div className="ways-card" onClick={() => window.location.hash = "/corporate"}>
            <div className="ways-icon-wrap">
              <FaBuilding />
            </div>
            <h3>Corporate & Family Programs</h3>
            <p>
              Customized meal solutions for offices, employee meal 
              programs, family functions, birthdays, anniversaries, 
              housewarming ceremonies and premium event catering.
            </p>
            <a 
              href="#/corporate" 
              className="ways-link"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              Get Started <FaArrowRight className="link-arrow" />
            </a>
          </div>
        </div>
      </div>

      {/* Subscription/Catering Interactive Modal */}
      <SubscriptionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialType={modalType} 
      />
    </section>
  );
};

export default WaysToBring;
