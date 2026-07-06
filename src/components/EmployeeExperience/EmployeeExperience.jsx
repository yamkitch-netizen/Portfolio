import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./EmployeeExperience.css";
import { FaArrowRight } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    image: "/Map_of_India_with_foods_202607061147.jpeg",
    title: "Authentic Homemade Food",
    stat: "9 Regional Kitchens",
    description:
      "Freshly prepared meals using authentic regional recipes that make every employee feel at home.",
  },
  {
    image: "/Employee_eating_Indian_food_2K_202607061138.jpeg",
    title: "Corporate Benefits",
    stat: "25% Employee Savings",
    description:
      "Exclusive corporate discounts and customized meal plans designed for your entire workforce.",
  },
  {
    image: "/Easy_Ordering_YAM_kitch_2K_202607061151.jpeg",
    title: "Easy Ordering",
    stat: "24/7 Ordering",
    description:
      "Employees can browse menus, place orders and manage subscriptions with ease.",
  },
];

const EmployeeExperience = () => {
  const sectionRef = useRef();

  useGSAP(() => {
    // Scroll Reveal using ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });

    tl.from(".experience-title span", {
      opacity: 0,
      y: 40,
      duration: 0.8
    })
    .from(".experience-title h2", {
      opacity: 0,
      y: 60,
      duration: 1,
    }, "-=0.6")
    .from(".experience-title p", {
      opacity: 0,
      y: 60,
      duration: 1,
    }, "-=0.85")
    .from(".experience-card", {
      opacity: 0,
      y: 120,
      scale: 0.8,
      duration: 1.2,
      stagger: 0.25,
      ease: "power4.out",
      clearProps: "transform"
    }, "-=0.85");
  }, { scope: sectionRef });

  return (
    <section className="experience" ref={sectionRef}>
      <div className="glow glow1"></div>
      <div className="glow glow2"></div>

      <div className="container">
        <div className="experience-title">
          <span>EMPLOYEE EXPERIENCE</span>
          <h2>
            Every Meal Creates
            <br />
            A Better Workplace
          </h2>
          <p>
            Healthy employees are happier, more productive and more
            engaged. YAM KITCH delivers an experience—not just lunch.
          </p>
        </div>

        <div className="experience-grid">
          {cards.map((card, index) => (
            <div
              className={`experience-card card-${index + 1}`}
              key={index}
            >
              <div className="image-box">
                <img src={card.image} alt="" />
              </div>

              <div className="card-content">
                <span className="badge">
                  {card.stat}
                </span>

                <h3>{card.title}</h3>

                <p>{card.description}</p>

                <button>
                  Learn More
                  <FaArrowRight className="arrow" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EmployeeExperience;