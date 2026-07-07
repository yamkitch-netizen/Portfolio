import { useEffect } from "react";
import "./WhyChoose.css";

import {
  FaRupeeSign,
  FaRegThumbsUp,
  FaShieldAlt,
  FaTruck,
  FaUsers,
} from "react-icons/fa";

const features = [
  {
    icon: <FaRupeeSign />,
    title: "Lowest Price",
    desc: "Best Quality, Budget Friendly",
    video: "/Complete-Meal.mp4",
  },
  {
    icon: <FaRegThumbsUp />,
    title: "Highest Reviews",
    desc: "Rated & Trusted by Hundreds of Happy Clients",
    video: "/Dedicated-Manager.mp4",
  },
  {
    icon: <FaShieldAlt />,
    title: "Hygienic & Healthy",
    desc: "Clean Kitchen, Healthy Meals",
    video: "/Healthy_hygienic_card.mp4",
  },
  {
    icon: <FaUsers />,
    title: "Perfect For",
    desc: "Offices, Meetings, Events & More",
    video: "/Corporate_Events.mp4",
  },
];

const WhyChoose = () => {
  useEffect(() => {
    const cards = document.querySelectorAll(".why-card");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    cards.forEach((card) => observer.observe(card));

    return () => {
      cards.forEach((card) => observer.unobserve(card));
    };
  }, []);

  return (
    <section className="whychoose">
      <div className="container">
        <div className="section-title">
          <span>WHY CHOOSE US</span>
          <h2>Why Companies Choose YAM KITCH</h2>
          <p>
            Everything your organization needs for healthy,
            hassle-free corporate dining.
          </p>
        </div>

        <div className="why-grid">
          {features.map((item, index) => {
            const hasVideo = !!item.video;
            return (
              <div className={`why-card ${hasVideo ? "has-video" : ""}`} key={index}>
                {hasVideo && (
                  <div className="card-video-bg">
                    <video
                      src={item.video}
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                    <div className="card-video-overlay" />
                  </div>
                )}

                <div className="card-content">
                  <div className="icon">
                    {item.icon}
                  </div>

                  <h3>{item.title}</h3>

                  <p>{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;