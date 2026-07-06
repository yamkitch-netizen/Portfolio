import { FaWhatsapp } from "react-icons/fa";
import "./WhatsAppButton.css";

const WhatsAppButton = () => {
  const phoneNumber = "916033550539";
  const message = encodeURIComponent("Hi Yamkitch, I want to know more about your tiffin services and catering programs!");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <div className="whatsapp-container">
      {/* Dynamic Pulse Rings */}
      <div className="whatsapp-pulse"></div>
      <div className="whatsapp-pulse-2"></div>
      
      {/* Floating Link */}
      <a 
        href={whatsappUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="whatsapp-float"
        title="Chat with YAMKITCH on WhatsApp"
      >
        <FaWhatsapp />
      </a>
    </div>
  );
};

export default WhatsAppButton;
