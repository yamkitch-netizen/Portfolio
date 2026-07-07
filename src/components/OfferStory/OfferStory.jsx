import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./OfferStory.css";

gsap.registerPlugin(ScrollTrigger);

const slides = [
  {
    id: 1,
    tag: "MEAL SUBSCRIPTION",
    title: "Daily Corporate,\nLunch & Dinner",
    desc: "You can gift your employee with an amazing option to order homemade food from the nearby kitchen. We have daily, weekly & monthly subscription plans tailored to your team's taste and schedule.",
    image: "/Meal_plans_for_employees_2K_202607061357.jpeg",
    imageAlt: "Meal plans for employees",
    align: "right",
  },
  {
    id: 2,
    tag: "INSTANT ORDERS",
    title: "Office Staff\nMeal Supply",
    desc: "Be spontaneous and surprise your employees with food items such as cakes, sweets, snacks, and more during celebrations, special occasions, and everyday moments.",
    image: "/Gemini_Generated_Image_b610w6b610w6b610.png",
    imageAlt: "Instant food orders",
    align: "left",
  },
  {
    id: 3,
    tag: "CORPORATE EVENTS",
    title: "Meeting\n& Conference Food",
    desc: "A perfect corporate get-together would be incomplete without sumptuous Indian regional cuisine or even homemade snacks. YAM KITCH can make any of your gatherings a truly memorable event.",
    image: "/Our_brand_name_is_Yam_202607061402.jpeg",
    imageAlt: "Corporate get-togethers",
    align: "right",
  },
  {
    id: 4,
    tag: "DAILY MEALS",
    title: "Breakfast,\nLunch & Dinner",
    desc: "Fresh and nutritious meals prepared for every time of the day. Enjoy delicious corporate breakfast, lunch, and dinner spreads tailored to keep your team energized throughout their shifts.",
    image: "/Gemini_Generated_Image_vwm1kxvwm1kxvwm1.png",
    imageAlt: "Breakfast, Lunch & Dinner",
    align: "left",
  },
  {
    id: 5,
    tag: "EVENTS & CATERING",
    title: "Birthday, Family\nFunction & Events",
    desc: "Host memorable celebrations with premium catering services. From birthdays and office anniversaries to family functions and large events, we deliver mouth-watering cuisines that fit every celebration.",
    image: "/Gemini_Generated_Image_981x3y981x3y981x.png",
    imageAlt: "Birthday, Family Function & Events",
    align: "right",
  },
];

const N = slides.length;

const OfferStory = () => {
  const sectionRef = useRef();

  useGSAP(() => {
    const section = sectionRef.current;
    const panels = gsap.utils.toArray(".offer-panel");

    let mm = gsap.matchMedia();

    mm.add("(min-width: 901px)", () => {
      // Set initial visibility states
      gsap.set(panels[0], { autoAlpha: 1 });
      panels.slice(1).forEach((p) => gsap.set(p, { autoAlpha: 0 }));

      // Build a crossfade timeline: panel[i] fades out while panel[i+1] fades in
      const tl = gsap.timeline();
      panels.forEach((panel, i) => {
        if (i < N - 1) {
          tl.to(panel, { autoAlpha: 0, duration: 1 })
            .to(panels[i + 1], { autoAlpha: 1, duration: 1 }, "<");
        }
      });

      // Pin the section and drive the timeline with scroll + snap
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${(N - 1) * 600}`,
        pin: true,
        pinSpacing: true,
        animation: tl,
        scrub: 0.3,
        snap: {
          snapTo: 1 / (N - 1),
          duration: 0.3,
          delay: 0.05,
          ease: "power2.out",
        },
        onUpdate: (self) => {
          const index = Math.round(self.progress * (N - 1));
          document.querySelectorAll(".offer-dot").forEach((d, i) => {
            d.classList.toggle("active", i === index);
          });
        },
      });
    });

    return () => mm.revert();
  }, { scope: sectionRef });

  return (
    <section className="offer-story" ref={sectionRef} id="services">
      {/* Background */}
      <div className="offer-bg">
        <img
          src="/Employees_enjoying_corporate_event_2K_202607061355.jpeg"
          alt="Corporate event background"
          className="offer-bg-img"
        />
        <div className="offer-bg-overlay" />
      </div>

      {/* Section Heading */}
      <div className="offer-heading">
        <span className="offer-tag">WHAT WE OFFER</span>
        <h2>What We Can <span className="offer-gold">Offer You?</span></h2>
      </div>

      {/* Scroll Dots */}
      <div className="offer-dots">
        {slides.map((_, i) => (
          <div className={`offer-dot ${i === 0 ? "active" : ""}`} key={i} />
        ))}
      </div>

      {/* Panels — all stacked absolutely on top of each other */}
      {slides.map((slide, i) => (
        <div key={slide.id} className="offer-panel">
          <div className={`offer-inner ${slide.align === "left" ? "offer-inner--reverse" : ""}`}>
            {/* Text */}
            <div className="offer-content">
              <span className="offer-pill">{slide.tag}</span>
              <h3>
                {slide.title.split("\n").map((line, j) => (
                  <span key={j}>{line}<br /></span>
                ))}
              </h3>
              <p>{slide.desc}</p>
            </div>

            {/* Image */}
            <div className="offer-img-wrap">
              <img src={slide.image} alt={slide.imageAlt} />
            </div>
          </div>

          {/* Scroll hint only on first panel */}
          {i === 0 && (
            <div className="offer-scroll-hint">Scroll to explore ↓</div>
          )}
        </div>
      ))}
    </section>
  );
};

export default OfferStory;
