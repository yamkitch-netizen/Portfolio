import { useState, useEffect } from "react";
import { FaTimes, FaPhoneAlt, FaUtensils, FaCheckCircle, FaPaperPlane, FaUser, FaLock, FaUnlock } from "react-icons/fa";
import "./CustomMealModal.css";

const PHONE_NUMBER = "+916033550539";

const CustomMealModal = ({ isOpen, onClose }) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Step 1: user details  |  Step 2: food items
  const [step, setStep] = useState(1);
  const [userDetails, setUserDetails] = useState({ name: "", age: "", email: "", phone: "", address: "" });
  const [userErrors, setUserErrors] = useState({});

  const [items, setItems] = useState(["", "", "", "", ""]);
  const [plates, setPlates] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  // ── User Details Handlers ──────────────────────────────
  const handleUserChange = (field, value) => {
    setUserDetails((prev) => ({ ...prev, [field]: value }));
    if (userErrors[field]) setUserErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateUser = () => {
    const errs = {};
    if (!userDetails.name.trim()) errs.name = "Name is required";
    if (!userDetails.age.trim() || isNaN(userDetails.age) || +userDetails.age < 1)
      errs.age = "Enter a valid age";
    if (!userDetails.email.trim() || !/\S+@\S+\.\S+/.test(userDetails.email))
      errs.email = "Enter a valid email";
    if (!userDetails.phone.trim() || userDetails.phone.replace(/\D/g, "").length < 10)
      errs.phone = "Enter a valid phone number";
    if (!userDetails.address.trim())
      errs.address = "Address is required";
    return errs;
  };

  const handleUnlock = () => {
    const errs = validateUser();
    if (Object.keys(errs).length) { setUserErrors(errs); return; }
    setStep(2);
  };

  // ── Item Handlers ──────────────────────────────────────
  const handleItemChange = (index, value) => {
    const updated = [...items];
    updated[index] = value;
    setItems(updated);
  };

  const handleSubmit = async () => {
    const filledItems = items.filter((i) => i.trim() !== "");
    if (filledItems.length === 0) return;

    setIsSubmitting(true);
    try {
      const itemRows = items
        .map((item, i) =>
          item.trim()
            ? `<tr>
                <td style="padding:10px 16px;color:#D4A017;font-weight:700;width:80px;border-bottom:1px solid #222;">Item ${i + 1}</td>
                <td style="padding:10px 16px;color:#fff;border-bottom:1px solid #222;">${item.trim()}</td>
               </tr>`
            : ""
        )
        .filter(Boolean)
        .join("");

      const html = `
        <div style="font-family:sans-serif;background:#0d0d0d;padding:36px;border-radius:16px;max-width:560px;margin:auto;border:1px solid #222;">
          <div style="border-bottom:2px solid #D4A017;padding-bottom:18px;margin-bottom:26px;">
            <h2 style="color:#D4A017;margin:0 0 6px;font-size:22px;">🍽️ New Custom Meal Request</h2>
            <p style="color:#888;margin:0;font-size:13px;">Submitted via YAMKITCH website</p>
          </div>
          <h3 style="color:#D4A017;font-size:14px;margin:0 0 14px;letter-spacing:1px;">CUSTOMER INFO</h3>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr><td style="padding:6px 0;color:#aaa;width:80px;">Name</td><td style="padding:6px 0;color:#fff;font-weight:600;">${userDetails.name}</td></tr>
            <tr><td style="padding:6px 0;color:#aaa;">Age</td><td style="padding:6px 0;color:#fff;font-weight:600;">${userDetails.age}</td></tr>
            <tr><td style="padding:6px 0;color:#aaa;">Email</td><td style="padding:6px 0;color:#fff;font-weight:600;">${userDetails.email}</td></tr>
            <tr><td style="padding:6px 0;color:#aaa;">Phone</td><td style="padding:6px 0;color:#fff;font-weight:600;">${userDetails.phone}</td></tr>
            <tr><td style="padding:6px 0;color:#aaa;">Address</td><td style="padding:6px 0;color:#fff;font-weight:600;">${userDetails.address}</td></tr>
            <tr><td style="padding:6px 0;color:#aaa;">Plates</td><td style="padding:6px 0;color:#fff;font-weight:600;">${plates}</td></tr>
          </table>
          <h3 style="color:#D4A017;font-size:14px;margin:0 0 14px;letter-spacing:1px;">REQUESTED ITEMS</h3>
          <table style="width:100%;border-collapse:collapse;background:#1a1a1a;border-radius:10px;overflow:hidden;">
            ${itemRows}
          </table>
          <div style="margin-top:28px;padding:16px;background:#1a1a1a;border-radius:10px;border-left:3px solid #D4A017;">
            <p style="color:#aaa;font-size:13px;margin:0;">Please contact the customer as soon as possible.</p>
          </div>
        </div>`;

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: "🍽️ New Custom Meal Request — YAMKITCH", html }),
      });
      if (!response.ok) console.error("Email error:", await response.json());
      setIsSubmitted(true);
    } catch (err) {
      console.error("Email send failed:", err);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setUserDetails({ name: "", age: "", email: "", phone: "", address: "" });
    setUserErrors({});
    setItems(["", "", "", "", ""]);
    setPlates(1);
    setIsSubmitted(false);
    onClose();
  };

  const handleEnquiry = () => {
    const filledItems = items.filter((i) => i.trim() !== "");
    const itemList = filledItems.length
      ? filledItems.map((item, i) => `Item ${i + 1}: ${item}`).join("%0A")
      : "No items specified";
    const message = `Hello YAMKITCH! I want to customize my meal.%0A%0APlates Needed: ${plates}%0A%0A${itemList}%0A%0APlease help me with a custom meal plan.`;
    window.open(`https://wa.me/${PHONE_NUMBER.replace("+", "")}?text=${message}`, "_blank");
  };

  const handleCall = () => { window.location.href = `tel:${PHONE_NUMBER}`; };

  return (
    <div className="custom-meal-backdrop" onClick={handleClose}>
      <div className="custom-meal-modal" onClick={(e) => e.stopPropagation()}>

        {/* ── Success Overlay ── */}
        {isSubmitted && (
          <div className="cm-success-overlay">
            <FaCheckCircle className="cm-success-icon" />
            <h3>Submission Confirmed!</h3>
            <p>Our staff will contact you shortly with your customized meal plan.</p>
            <button className="cm-success-close" onClick={handleClose}>Close</button>
          </div>
        )}

        {/* Header */}
        <div className="cm-header">
          <div className="cm-header-left">
            <div className="cm-icon-wrap">
              <FaUtensils />
            </div>
            <div>
              <h2>Customize Your Meal</h2>
              <p>Tell us what you'd like — we'll make it happen!</p>
            </div>
          </div>
          <button className="cm-close" onClick={handleClose} aria-label="Close">
            <FaTimes />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="cm-steps">
          <div className={`cm-step ${step >= 1 ? "active" : ""}`}>
            <span className="cm-step-dot">1</span>
            <span className="cm-step-label">Your Details</span>
          </div>
          <div className="cm-step-line" />
          <div className={`cm-step ${step >= 2 ? "active" : ""}`}>
            <span className="cm-step-dot">{step >= 2 ? <FaUnlock /> : <FaLock />}</span>
            <span className="cm-step-label">Meal Items</span>
          </div>
        </div>

        <div className="cm-divider" />

        {/* ── STEP 1: User Details ── */}
        {step === 1 && (
          <div className="cm-body">
            <p className="cm-subtitle">Please fill in your details to unlock the meal customization form:</p>
            <div className="cm-user-fields">
              <div className="cm-field-group">
                <label htmlFor="cm-name">Full Name <span>*</span></label>
                <input
                  id="cm-name"
                  type="text"
                  className={`cm-item-input${userErrors.name ? " error" : ""}`}
                  placeholder="e.g. Rahul Sharma"
                  value={userDetails.name}
                  onChange={(e) => handleUserChange("name", e.target.value)}
                />
                {userErrors.name && <span className="cm-field-error">{userErrors.name}</span>}
              </div>
              <div className="cm-field-group">
                <label htmlFor="cm-age">Age <span>*</span></label>
                <input
                  id="cm-age"
                  type="number"
                  min="1"
                  max="120"
                  className={`cm-item-input${userErrors.age ? " error" : ""}`}
                  placeholder="e.g. 28"
                  value={userDetails.age}
                  onChange={(e) => handleUserChange("age", e.target.value)}
                />
                {userErrors.age && <span className="cm-field-error">{userErrors.age}</span>}
              </div>
              <div className="cm-field-group">
                <label htmlFor="cm-email">Email Address <span>*</span></label>
                <input
                  id="cm-email"
                  type="email"
                  className={`cm-item-input${userErrors.email ? " error" : ""}`}
                  placeholder="e.g. rahul@gmail.com"
                  value={userDetails.email}
                  onChange={(e) => handleUserChange("email", e.target.value)}
                />
                {userErrors.email && <span className="cm-field-error">{userErrors.email}</span>}
              </div>
              <div className="cm-field-group">
                <label htmlFor="cm-phone">Phone Number <span>*</span></label>
                <input
                  id="cm-phone"
                  type="tel"
                  className={`cm-item-input${userErrors.phone ? " error" : ""}`}
                  placeholder="e.g. +91 98765 43210"
                  value={userDetails.phone}
                  onChange={(e) => handleUserChange("phone", e.target.value)}
                />
                {userErrors.phone && <span className="cm-field-error">{userErrors.phone}</span>}
              </div>
              <div className="cm-field-group">
                <label htmlFor="cm-address">Delivery Address <span>*</span></label>
                <input
                  id="cm-address"
                  type="text"
                  className={`cm-item-input${userErrors.address ? " error" : ""}`}
                  placeholder="e.g. House No. 25, Sector 4, Agartala"
                  value={userDetails.address}
                  onChange={(e) => handleUserChange("address", e.target.value)}
                />
                {userErrors.address && <span className="cm-field-error">{userErrors.address}</span>}
              </div>
            </div>
            <button className="cm-submit-btn" onClick={handleUnlock}>
              <FaUnlock />
              Continue to Meal Items
            </button>
          </div>
        )}

        {/* ── STEP 2: Meal Items ── */}
        {step === 2 && (
          <div className="cm-body">
            <p className="cm-subtitle">
              Hi <strong style={{ color: "#D4A017" }}>{userDetails.name}</strong>! Enter up to 5 food items you'd like in your custom meal:
            </p>
            <div className="cm-items-list">
              {items.map((item, index) => (
                <div className="cm-item-row" key={index}>
                  <span className="cm-item-label">Item {index + 1}</span>
                  <input
                    type="text"
                    className="cm-item-input"
                    placeholder={`e.g. ${["Dal Makhani", "Chicken Curry", "Jeera Rice", "Paneer Butter Masala", "Roti (4 pcs)"][index]}`}
                    value={item}
                    onChange={(e) => handleItemChange(index, e.target.value)}
                    id={`custom-meal-item-${index + 1}`}
                  />
                </div>
              ))}
            </div>
            <div className="cm-field-group" style={{ marginTop: "18px" }}>
              <label htmlFor="cm-plates" style={{ color: "#D4A017", fontWeight: "600", fontSize: "0.85rem" }}>
                Number of Plates / Servings <span>*</span>
              </label>
              <input
                id="cm-plates"
                type="number"
                min="1"
                className="cm-item-input"
                value={plates}
                onChange={(e) => setPlates(Math.max(1, parseInt(e.target.value) || 1))}
              />
            </div>
            <button
              className={`cm-submit-btn${isSubmitting ? " loading" : ""}`}
              onClick={handleSubmit}
              disabled={isSubmitting || items.every((i) => !i.trim())}
            >
              {isSubmitting ? <span className="cm-spinner" /> : <FaPaperPlane />}
              {isSubmitting ? "Submitting…" : "Submit Request"}
            </button>
          </div>
        )}

        <div className="cm-divider" />

        {/* Footer */}
        <div className="cm-footer">
          <p className="cm-footer-label">Enquire now with our consultant</p>
          <div className="cm-cta-buttons">
            <button className="cm-btn-whatsapp" onClick={handleEnquiry}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              WhatsApp Us
            </button>
            <button className="cm-btn-call" onClick={handleCall}>
              <FaPhoneAlt />
              Call Now
            </button>
          </div>
          <p className="cm-phone-display">{PHONE_NUMBER}</p>
        </div>
      </div>
    </div>
  );
};

export default CustomMealModal;
