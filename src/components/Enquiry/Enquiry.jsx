import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import "./Enquiry.css";

gsap.registerPlugin(ScrollTrigger);

const Enquiry = () => {
  const containerRef = useRef();
  const formRef = useRef();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    orgName: "",
    strength: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const emailSubject = `[YAMKITCH] New General / Corporate Enquiry - ${formData.name}`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #D4A017; border-bottom: 2px solid #D4A017; padding-bottom: 8px;">New Enquiry Details</h2>
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Phone:</strong> ${formData.phone}</p>
        <p><strong>Organisation:</strong> ${formData.orgName}</p>
        <p><strong>Employee Strength:</strong> ${formData.strength || "N/A"}</p>
        <hr style="border: 0; border-top: 1px solid #ccc; margin-top: 20px;" />
        <p style="font-size: 0.85em; color: #777;">Sent from YAMKITCH Web Portal</p>
      </div>
    `;

    // Alert the user immediately for good UX
    alert(`Thank you ${formData.name}! Your enquiry has been received. Our team will contact you within 24 hours.`);

    try {
      await fetch("https://corsproxy.io/?https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": "Bearer re_hy8zjuS4_FW4JK4iDBvPaGP3BNjsmyhgj",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "YAMKITCH Portal <onboarding@resend.dev>",
          to: "yamkitch@gmail.com",
          subject: emailSubject,
          html: emailHtml,
        }),
      });
    } catch (error) {
      console.error("Failed to dispatch email:", error);
    }

    setFormData({
      name: "",
      email: "",
      phone: "",
      orgName: "",
      strength: "",
    });
  };

  useGSAP(() => {
    const container = containerRef.current;

    // Scroll reveal timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });

    tl.from(".enquiry-left span", {
      opacity: 0,
      y: 30,
      duration: 0.6,
    })
    .from(".enquiry-left h2", {
      opacity: 0,
      y: 40,
      duration: 0.8,
    }, "-=0.4")
    .from(".enquiry-left p", {
      opacity: 0,
      y: 30,
      duration: 0.6,
    }, "-=0.6")
    .from(".enquiry-info-item", {
      opacity: 0,
      x: -30,
      duration: 0.5,
      stagger: 0.15,
    }, "-=0.4")
    .from(formRef.current, {
      opacity: 0,
      y: 60,
      scale: 0.95,
      duration: 1,
      ease: "power3.out",
    }, "-=0.8");
  }, { scope: containerRef });

  return (
    <section className="enquiry" ref={containerRef}>
      <div className="enquiry-glow"></div>
      
      <div className="container enquiry-grid-layout">
        {/* Left Side Info */}
        <div className="enquiry-left">
          <span>GET IN TOUCH</span>
          <h2>
            What are You
            <br />
            Waiting For?
          </h2>
          <p>
            We are here to answer any questions you may have about YAM KITCH and its services. 
            Fill up basic details and we'll respond within 24 hours or less.
          </p>

          <div className="enquiry-info">
            <div className="enquiry-info-item">
              <div className="info-icon">
                <FaEnvelope />
              </div>
              <div className="info-text">
                <h4>Email Us</h4>
                <a href="mailto:corporate@yamkitch.com">yamkitch@gmail.com</a>
              </div>
            </div>

            <div className="enquiry-info-item">
              <div className="info-icon">
                <FaPhoneAlt />
              </div>
              <div className="info-text">
                <h4>Call Us</h4>
                <a href="tel:+919876543210">+91 60335 50539</a>
              </div>
            </div>

            <div className="enquiry-info-item">
              <div className="info-icon">
                <FaMapMarkerAlt />
              </div>
              <div className="info-text">
                <h4>Our Location</h4>
                <p>Agartala, Tripura, India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Form Card */}
        <div className="enquiry-form-card" ref={formRef}>
          <h3>Corporate Enquiry</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
              />
            </div>

            <div className="form-group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Official Email Address"
                required
              />
            </div>

            <div className="form-group">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Your Mobile Number"
                required
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                name="orgName"
                value={formData.orgName}
                onChange={handleChange}
                placeholder="Organisation Name"
                required
              />
            </div>

            <div className="form-group">
              <select
                name="strength"
                value={formData.strength}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Organisation Employee Strength</option>
                <option value="1-50">1 - 50 Employees</option>
                <option value="51-200">51 - 200 Employees</option>
                <option value="201-500">201 - 500 Employees</option>
                <option value="500+">500+ Employees</option>
              </select>
            </div>

            <div className="form-btn-wrap">
              <button type="submit" className="submit-btn">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Enquiry;
