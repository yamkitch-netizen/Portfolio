import { useState, useEffect } from "react";
import { FaTimes, FaCheck, FaCreditCard, FaCheckCircle, FaChevronDown } from "react-icons/fa";
import "./SubscriptionModal.css";

// Menu items defined as per user specification
const breakfastMenu = [
  { name: "Roti + Sabji", price: 26, desc: "3 Roti + Aloo Dum / Mixed Vegetables", isBase: true },
  { name: "Puri + Sabji", price: 26, desc: "4 Puri + Aloo Dum / Mixed Vegetables", isBase: true },
  { name: "Roti + Tadka", price: 37, desc: "3 Roti + Egg Tadka", isBase: true },
  { name: "Puri + Tadka", price: 37, desc: "4 Puri + Egg Tadka", isBase: true },
  { name: "Plain Maggi", price: 40, desc: "Plain Maggi with butter", isBase: false },
  { name: "Egg Maggi", price: 59, desc: "Egg Maggi with butter", isBase: false },
  { name: "Half Boiled Omelette", price: 15, desc: "Soft-runny omelette", isBase: false },
  { name: "Half Boiled Egg", price: 12, desc: "1 soft-boiled egg", isBase: false },
  { name: "Proper Boiled Omelette", price: 15, desc: "Fully cooked omelette", isBase: false },
  { name: "Salad", price: 59, desc: "Fresh green salad", isBase: false },
];

const lunchMenu = [
  { name: "Plain Meal (Lunch)", price: 59, desc: "Plain Rice + Dal + Vegetable Fry", isBase: true },
  { name: "Mixed / Seasonal Vegetables (Lunch)", price: 19, desc: "Aloo Dum / Mixed Vegetables & others", isBase: false },
  { name: "Omelette (Lunch)", price: 15, desc: "Chicken", isBase: false },
  { name: "Egg Tadka (Lunch)", price: 30, desc: "Chicken", isBase: false },
  { name: "Chicken Curry (Lunch)", price: 59, desc: "with Butter (4 Pieces + 1 Potato)", isBase: false },
  { name: "Paneer Curry (Lunch)", price: 59, desc: "Paneer with butter gravy", isBase: false },
  { name: "Chicken Dum Biryani (Lunch)", price: 119, desc: "(1 Chicken Piece + 1 Potato + 1 Boiled Egg)", isBase: false },
];

const dinnerMenu = [
  { name: "Plain Meal (Dinner)", price: 59, desc: "Plain Rice + Dal + Vegetable Fry", isBase: true },
  { name: "Mixed / Seasonal Vegetables (Dinner)", price: 19, desc: "Aloo Dum / Mixed Vegetables & others", isBase: false },
  { name: "Omelette (Dinner)", price: 15, desc: "Chicken", isBase: false },
  { name: "Egg Tadka (Dinner)", price: 30, desc: "Chicken", isBase: false },
  { name: "Chicken Curry (Dinner)", price: 59, desc: "with Butter (4 Pieces + 1 Potato)", isBase: false },
  { name: "Paneer Curry (Dinner)", price: 59, desc: "Paneer with butter gravy", isBase: false },
  { name: "Chicken Dum Biryani (Dinner)", price: 119, desc: "(1 Chicken Piece + 1 Potato + 1 Boiled Egg)", isBase: false },
];

const SubscriptionModal = ({ isOpen, onClose, initialType }) => {
  const [activeForm, setActiveForm] = useState(initialType || "subscription");
  const [isSuccess, setIsSuccess] = useState(false);

  // Gate: user must fill details before accessing the form
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [userDetails, setUserDetails] = useState({ name: "", age: "", email: "", phone: "", address: "" });
  const [userErrors, setUserErrors] = useState({});

  // Form State - Daily Meal Subscription
  const [subscriptionForm, setSubscriptionForm] = useState({
    mealPreferences: {
      breakfast: false,
      lunch: false,
      dinner: false,
    },
    cart: {}, // e.g., { "breakfast_Roti + Sabji": 1, "lunch_Plain Meal (Lunch)": 1 }
    paymentMethod: "razorpay",
  });

  // Form State - Corporate & Family
  const [corporateForm, setCorporateForm] = useState({
    name: "",
    email: "",
    phone: "",
    orgName: "",
    programType: "Corporate Employee Meal Program",
    guestsCount: "",
    serviceStyle: "Packed Meal Boxes",
    mealsNeeded: {
      breakfast: false,
      lunch: true,
      snacks: false,
      dinner: false,
    },
  });

  // Success summary details
  const [summaryData, setSummaryData] = useState(null);

  // Pricing calculations
  const calculatePricing = () => {
    const { cart } = subscriptionForm;
    let subtotal = 0;

    const findItemPrice = (key) => {
      const name = key.split("_")[1];
      if (key.startsWith("breakfast_")) {
        const found = breakfastMenu.find((i) => i.name === name);
        return found ? found.price : 0;
      }
      if (key.startsWith("lunch_")) {
        const found = lunchMenu.find((i) => i.name === name);
        return found ? found.price : 0;
      }
      if (key.startsWith("dinner_")) {
        const found = dinnerMenu.find((i) => i.name === name);
        return found ? found.price : 0;
      }
      return 0;
    };

    Object.keys(cart).forEach((key) => {
      const qty = cart[key] || 0;
      const price = findItemPrice(key);
      subtotal += price * qty;
    });

    // Platform Fee always free & Tiered Delivery Charge
    const platformFee = 0;
    let deliveryCharge = 0;
    if (subtotal > 0) {
      if (subtotal < 200) {
        deliveryCharge = 50;
      } else if (subtotal <= 800) {
        deliveryCharge = 30;
      } else {
        deliveryCharge = 0;
      }
    }
    const totalPayable = subtotal + platformFee + deliveryCharge;

    return {
      subtotal,
      platformFee,
      deliveryCharge,
      totalPayable,
    };
  };

  const pricing = calculatePricing();

  // Input Handlers
  const handleSubFormChange = (key, value) => {
    setSubscriptionForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubPrefChange = (pref) => {
    setSubscriptionForm((prev) => {
      const updatedPrefs = {
        ...prev.mealPreferences,
        [pref]: !prev.mealPreferences[pref],
      };

      const newCart = { ...prev.cart };

      if (updatedPrefs.breakfast) {
        if (!(newCart["breakfast_Roti + Sabji"] > 0)) {
          newCart["breakfast_Roti + Sabji"] = 1;
        }
      } else {
        Object.keys(newCart).forEach((key) => {
          if (key.startsWith("breakfast_")) delete newCart[key];
        });
      }

      if (updatedPrefs.lunch) {
        if (!(newCart["lunch_Plain Meal (Lunch)"] > 0)) {
          newCart["lunch_Plain Meal (Lunch)"] = 1;
        }
      } else {
        Object.keys(newCart).forEach((key) => {
          if (key.startsWith("lunch_")) delete newCart[key];
        });
      }

      if (updatedPrefs.dinner) {
        if (!(newCart["dinner_Plain Meal (Dinner)"] > 0)) {
          newCart["dinner_Plain Meal (Dinner)"] = 1;
        }
      } else {
        Object.keys(newCart).forEach((key) => {
          if (key.startsWith("dinner_")) delete newCart[key];
        });
      }

      return {
        ...prev,
        mealPreferences: updatedPrefs,
        cart: newCart,
      };
    });
  };

  const updateCartQty = (key, delta) => {
    setSubscriptionForm((prev) => {
      const currentQty = prev.cart[key] || 0;
      const newQty = Math.max(0, currentQty + delta);

      const name = key.split("_")[1];
      const combos = ["Roti + Sabji", "Puri + Sabji", "Roti + Tadka", "Puri + Tadka"];
      let newCart = {
        ...prev.cart,
        [key]: newQty,
      };

      if (key.startsWith("breakfast_") && combos.includes(name) && delta > 0) {
        // Enforce mutual exclusivity among breakfast combos
        combos.forEach((comboName) => {
          const comboKey = `breakfast_${comboName}`;
          if (comboKey !== key) {
            newCart[comboKey] = 0;
          }
        });
        newCart[key] = newQty;
      }

      if (key.startsWith("breakfast_") && combos.includes(name) && newQty < 1 && delta < 0) {
        const otherCombosQty = combos
          .filter((c) => c !== name)
          .reduce((acc, c) => acc + (newCart[`breakfast_${c}`] || 0), 0);
        if (otherCombosQty === 0) {
          newCart[key] = 1;
        }
      }

      if (key === "lunch_Plain Meal (Lunch)" && newQty < 1 && delta < 0) {
        newCart[key] = 1;
      }
      if (key === "dinner_Plain Meal (Dinner)" && newQty < 1 && delta < 0) {
        newCart[key] = 1;
      }

      return {
        ...prev,
        cart: newCart,
      };
    });
  };

  const handleCorpFormChange = (key, value) => {
    setCorporateForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCorpMealChange = (meal) => {
    setCorporateForm((prev) => ({
      ...prev,
      mealsNeeded: {
        ...prev.mealsNeeded,
        [meal]: !prev.mealsNeeded[meal],
      },
    }));
  };

  const handleSubSubmit = async (e) => {
    e.preventDefault();
    const cartKeys = Object.keys(subscriptionForm.cart).filter((k) => subscriptionForm.cart[k] > 0);
    if (cartKeys.length === 0) {
      alert("Please select at least one item from the Menu.");
      return;
    }

    const itemsSummary = cartKeys
      .map((key) => {
        const qty = subscriptionForm.cart[key];
        const name = key.split("_")[1].replace(" (Lunch)", "").replace(" (Dinner)", "");
        return `${name} (x${qty})`;
      })
      .join(", ");

    setSummaryData({
      type: "subscription",
      title: itemsSummary,
      amount: pricing.totalPayable.toFixed(2),
    });
    setIsSuccess(true);

    const activeMeals = [
      subscriptionForm.mealPreferences.breakfast && "Breakfast",
      subscriptionForm.mealPreferences.lunch && "Lunch",
      subscriptionForm.mealPreferences.dinner && "Dinner"
    ].filter(Boolean).join(", ");

    const cartItemsHtml = cartKeys
      .map((key) => {
        const qty = subscriptionForm.cart[key];
        const name = key.split("_")[1].replace(" (Lunch)", "").replace(" (Dinner)", "");
        const itemPrice = key.startsWith("breakfast_")
          ? breakfastMenu.find((i) => i.name === key.split("_")[1])?.price || 0
          : key.startsWith("lunch_")
          ? lunchMenu.find((i) => i.name === key.split("_")[1])?.price || 0
          : dinnerMenu.find((i) => i.name === key.split("_")[1])?.price || 0;
        return `<p style="margin: 4px 0;"><strong>${name}</strong> &times; ${qty} = ₹${(itemPrice * qty).toFixed(2)}</p>`;
      })
      .join("");

    const emailSubject = `[YAMKITCH] New Daily Meal Subscription - ${userDetails.name}`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 24px; border-radius: 8px;">
        <h2 style="color: #D4A017; border-bottom: 2px solid #D4A017; padding-bottom: 8px; margin-top: 0;">🍽️ New Meal Subscription Order</h2>

        <h3 style="color:#555;font-size:13px;letter-spacing:1px;margin:0 0 10px;">CUSTOMER INFO</h3>
        <table style="width:100%;border-collapse:collapse;background:#f9f9f9;border-radius:6px;margin-bottom:20px;">
          <tr><td style="padding:8px 12px;color:#888;width:100px;">Name</td><td style="padding:8px 12px;font-weight:600;">${userDetails.name}</td></tr>
          <tr><td style="padding:8px 12px;color:#888;">Age</td><td style="padding:8px 12px;font-weight:600;">${userDetails.age}</td></tr>
          <tr><td style="padding:8px 12px;color:#888;">Email</td><td style="padding:8px 12px;font-weight:600;">${userDetails.email}</td></tr>
          <tr><td style="padding:8px 12px;color:#888;">Phone</td><td style="padding:8px 12px;font-weight:600;">${userDetails.phone}</td></tr>
          <tr><td style="padding:8px 12px;color:#888;">Address</td><td style="padding:8px 12px;font-weight:600;">${userDetails.address}</td></tr>
        </table>

        <h3 style="color:#555;font-size:13px;letter-spacing:1px;margin:0 0 10px;">ORDER DETAILS</h3>
        <div style="margin-bottom:12px;">${cartItemsHtml}</div>
        <p><strong>Meals Scheduled:</strong> ${activeMeals || "None"}</p>

        <div style="margin-top: 15px; border-top: 1px dashed #ddd; padding-top: 10px; font-size: 0.95em; color: #555;">
          <p style="margin: 4px 0;"><strong>Subtotal:</strong> ₹${pricing.subtotal.toFixed(2)}</p>
          <p style="margin: 4px 0;"><strong>Delivery Charge:</strong> ${pricing.deliveryCharge === 0 ? "FREE" : `₹${pricing.deliveryCharge.toFixed(2)}`}</p>
        </div>
        <h3 style="color: #D4A017; font-size: 1.3em; margin-top: 20px;">Total Amount: ₹${pricing.totalPayable.toFixed(2)}</h3>
        <hr style="border: 0; border-top: 1px solid #ccc; margin-top: 20px;" />
        <p style="font-size: 0.85em; color: #777; margin-bottom: 0;">Sent from YAMKITCH Web Portal</p>
      </div>
    `;

    try {
      await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: emailSubject,
          html: emailHtml,
        }),
      });
    } catch (error) {
      console.error("Failed to dispatch email:", error);
    }
  };

  const handleCorpSubmit = async (e) => {
    e.preventDefault();
    setSummaryData({
      type: "corporate",
      title: corporateForm.programType,
      guests: corporateForm.guestsCount,
      style: corporateForm.serviceStyle,
      name: corporateForm.name,
      phone: corporateForm.phone,
    });
    setIsSuccess(true);

    const requiredMeals = [
      corporateForm.mealsNeeded.breakfast && "Breakfast",
      corporateForm.mealsNeeded.lunch && "Lunch",
      corporateForm.mealsNeeded.dinner && "Dinner"
    ].filter(Boolean).join(", ");

    const emailSubject = `[YAMKITCH] New Catering & Quote Enquiry - ${corporateForm.name || userDetails.name}`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 24px; border-radius: 8px;">
        <h2 style="color: #D4A017; border-bottom: 2px solid #D4A017; padding-bottom: 8px; margin-top: 0;">🍽️ New Event Catering Request</h2>

        <h3 style="color:#555;font-size:13px;letter-spacing:1px;margin:0 0 10px;">CUSTOMER INFO</h3>
        <table style="width:100%;border-collapse:collapse;background:#f9f9f9;border-radius:6px;margin-bottom:20px;">
          <tr><td style="padding:8px 12px;color:#888;width:120px;">Name</td><td style="padding:8px 12px;font-weight:600;">${userDetails.name}</td></tr>
          <tr><td style="padding:8px 12px;color:#888;">Age</td><td style="padding:8px 12px;font-weight:600;">${userDetails.age}</td></tr>
          <tr><td style="padding:8px 12px;color:#888;">Email</td><td style="padding:8px 12px;font-weight:600;">${userDetails.email}</td></tr>
          <tr><td style="padding:8px 12px;color:#888;">Phone</td><td style="padding:8px 12px;font-weight:600;">${userDetails.phone}</td></tr>
          <tr><td style="padding:8px 12px;color:#888;">Address</td><td style="padding:8px 12px;font-weight:600;">${userDetails.address}</td></tr>
        </table>

        <h3 style="color:#555;font-size:13px;letter-spacing:1px;margin:0 0 10px;">EVENT DETAILS</h3>
        <p><strong>Organisation:</strong> ${corporateForm.orgName || "—"}</p>
        <p><strong>Program / Event Type:</strong> ${corporateForm.programType}</p>
        <p><strong>Expected Guest Count:</strong> ${corporateForm.guestsCount}</p>
        <p><strong>Catering Style:</strong> ${corporateForm.serviceStyle}</p>
        <p><strong>Meals Required:</strong> ${requiredMeals || "None"}</p>
        <hr style="border: 0; border-top: 1px solid #ccc; margin-top: 20px;" />
        <p style="font-size: 0.85em; color: #777; margin-bottom: 0;">Sent from YAMKITCH Web Portal</p>
      </div>
    `;

    try {
      await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: emailSubject,
          html: emailHtml,
        }),
      });
    } catch (error) {
      console.error("Failed to dispatch email:", error);
    }
  };

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
    setIsUnlocked(true);
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
      document.body.style.overflow = "hidden";
    } else {
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
    }
    return () => {
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsUnlocked(false);
    setUserDetails({ name: "", age: "", email: "", phone: "", address: "" });
    setUserErrors({});
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Close Icon */}
        <button className="modal-close-btn" onClick={handleClose}>
          <FaTimes />
        </button>

        {/* ── Gate: User Details ── */}
        {!isUnlocked && (
          <div className="sm-gate-overlay">
            <div className="sm-gate-icon">🔒</div>
            <h2 className="sm-gate-title">Enter Your Details to Continue</h2>
            <p className="sm-gate-subtitle">Fill in your info to unlock the subscription builder</p>
            <div className="sm-gate-fields">
              <div className="sm-gate-row">
                <div className="sm-gate-field">
                  <label htmlFor="sm-name">Full Name <span>*</span></label>
                  <input id="sm-name" type="text" className={`sm-gate-input${userErrors.name ? " error" : ""}`}
                    placeholder="e.g. Rahul Sharma" value={userDetails.name}
                    onChange={(e) => handleUserChange("name", e.target.value)} />
                  {userErrors.name && <span className="sm-gate-error">{userErrors.name}</span>}
                </div>
                <div className="sm-gate-field">
                  <label htmlFor="sm-age">Age <span>*</span></label>
                  <input id="sm-age" type="number" min="1" max="120" className={`sm-gate-input${userErrors.age ? " error" : ""}`}
                    placeholder="e.g. 28" value={userDetails.age}
                    onChange={(e) => handleUserChange("age", e.target.value)} />
                  {userErrors.age && <span className="sm-gate-error">{userErrors.age}</span>}
                </div>
              </div>
              <div className="sm-gate-field">
                <label htmlFor="sm-email">Email Address <span>*</span></label>
                <input id="sm-email" type="email" className={`sm-gate-input${userErrors.email ? " error" : ""}`}
                  placeholder="e.g. rahul@gmail.com" value={userDetails.email}
                  onChange={(e) => handleUserChange("email", e.target.value)} />
                {userErrors.email && <span className="sm-gate-error">{userErrors.email}</span>}
              </div>
              <div className="sm-gate-field">
                <label htmlFor="sm-phone">Phone Number <span>*</span></label>
                <input id="sm-phone" type="tel" className={`sm-gate-input${userErrors.phone ? " error" : ""}`}
                  placeholder="e.g. +91 98765 43210" value={userDetails.phone}
                  onChange={(e) => handleUserChange("phone", e.target.value)} />
                {userErrors.phone && <span className="sm-gate-error">{userErrors.phone}</span>}
              </div>
              <div className="sm-gate-field">
                <label htmlFor="sm-address">Delivery Address <span>*</span></label>
                <input id="sm-address" type="text" className={`sm-gate-input${userErrors.address ? " error" : ""}`}
                  placeholder="e.g. House No. 25, Sector 4, Agartala" value={userDetails.address}
                  onChange={(e) => handleUserChange("address", e.target.value)} />
                {userErrors.address && <span className="sm-gate-error">{userErrors.address}</span>}
              </div>
            </div>
            <button className="sm-gate-unlock-btn" onClick={handleUnlock}>
              🔓 Unlock Subscription Builder
            </button>
          </div>
        )}

        {/* Content only shown after unlocking */}
        {isUnlocked && (
          <>
        {/* Tab Selector Header (Only shown when not in success view) */}
        {!isSuccess && (
          <div className="capsule-toggle" style={{ margin: "20px 45px 0 45px", width: "calc(100% - 90px)" }}>
            <div
              className={`toggle-option ${activeForm === "subscription" ? "active" : ""}`}
              onClick={() => setActiveForm("subscription")}
            >
              Daily regular corporate meal
            </div>
            <div
              className={`toggle-option ${activeForm === "corporate" ? "active" : ""}`}
              onClick={() => setActiveForm("corporate")}
            >
              Party & function Family & Corporate
            </div>
          </div>
        )}

        {isSuccess ? (
          /* Success Screen */
          <div className="modal-success-state">
            <div className="success-icon-wrap">
              <FaCheck />
            </div>
            {summaryData?.type === "subscription" ? (
              <>
                <h2>Subscription Successful!</h2>
                <p>
                  Thank you for subscribing to YAMKITCH! Your order is confirmed and our kitchen has begun planning your healthy meals.
                </p>
                <div className="success-summary">
                  {Object.keys(subscriptionForm.cart).filter(k => subscriptionForm.cart[k] > 0).map((key) => {
                    const qty = subscriptionForm.cart[key];
                    const name = key.split("_")[1].replace(" (Lunch)", "").replace(" (Dinner)", "");
                    return (
                      <div key={key} className="success-summary-item">
                        <span>{name} &times; {qty}</span>
                        <span>{qty} {qty === 1 ? "Plate" : "Plates"}</span>
                      </div>
                    );
                  })}
                  <div className="success-summary-item" style={{ borderTop: "1px dashed rgba(255,255,255,0.1)", paddingTop: "12px", marginTop: "12px" }}>
                    <span>Amount Paid</span>
                    <span style={{ color: "#D4A017", fontWeight: "700" }}>₹{summaryData.amount}</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2>Enquiry Submitted!</h2>
                <p>
                  Your catering enquiry has been received! Our relationship manager will contact you within the next 2 hours to share custom pricing and menu details.
                </p>
                <div className="success-summary">
                  <div className="success-summary-item">
                    <span>Program Type</span>
                    <span>{summaryData?.title}</span>
                  </div>
                  <div className="success-summary-item">
                    <span>Guests Count</span>
                    <span>{summaryData?.guests} Guests</span>
                  </div>
                  <div className="success-summary-item">
                    <span>Catering Style</span>
                    <span>{summaryData?.style}</span>
                  </div>
                  <div className="success-summary-item">
                    <span>Contact Person</span>
                    <span>{summaryData?.name}</span>
                  </div>
                </div>
              </>
            )}
            <button className="success-close-btn" onClick={onClose}>
              Go Back to Website
            </button>
          </div>
        ) : (
          /* Forms Grid */
          <div className="modal-grid">
            {/* Left Column: Form Fields */}
            <div className="modal-form-area">
              {activeForm === "subscription" ? (
                /* MEAL SUBSCRIPTION BUILDER FORM */
                <form onSubmit={handleSubSubmit}>
                  <h2>Start your meal subscription</h2>
                  <span className="sub-title">YAMKITCH Pricing Builder</span>

                  {/* Meal Preference Checkboxes */}
                  <div className="form-group-wrapper">
                    <label className="form-section-title">
                      Meal Preference<span>*</span>
                    </label>
                    <div className="preference-grid">
                      <div
                        className={`preference-card ${subscriptionForm.mealPreferences.breakfast ? "active" : ""}`}
                        onClick={() => handleSubPrefChange("breakfast")}
                      >
                        <div className="checkbox-indicator">
                          <FaCheck />
                        </div>
                        <span className="preference-label">Breakfast</span>
                      </div>
                      <div
                        className={`preference-card ${subscriptionForm.mealPreferences.lunch ? "active" : ""}`}
                        onClick={() => handleSubPrefChange("lunch")}
                      >
                        <div className="checkbox-indicator">
                          <FaCheck />
                        </div>
                        <span className="preference-label">Lunch</span>
                      </div>
                      <div
                        className={`preference-card ${subscriptionForm.mealPreferences.dinner ? "active" : ""}`}
                        onClick={() => handleSubPrefChange("dinner")}
                      >
                        <div className="checkbox-indicator">
                          <FaCheck />
                        </div>
                        <span className="preference-label">Dinner</span>
                      </div>
                    </div>
                    <span className="form-description">Choose the meals you want in a day</span>
                  </div>

                  {/* BREAKFAST SECTION */}
                  {subscriptionForm.mealPreferences.breakfast && (
                    <div className="meal-section-block">
                      <div className="meal-section-header">
                        <h3>Breakfast Section</h3>
                        <span className="meal-time">9:00 - 10:00 AM</span>
                      </div>

                      <div className="meal-group-title">Base Combos (Select one or more)</div>
                      <div className="menu-grid">
                        {breakfastMenu.filter((item) => item.isBase).map((item) => {
                          const key = `breakfast_${item.name}`;
                          const qty = subscriptionForm.cart[key] || 0;
                          return (
                            <div key={item.name} className={`menu-card ${qty > 0 ? "active" : ""}`}>
                              <div className="menu-card-details">
                                <span className="menu-card-title">{item.name}</span>
                                <span className="menu-card-desc">{item.desc}</span>
                                <span className="menu-card-price">₹{item.price}</span>
                              </div>
                              <div className="qty-selector" onClick={(e) => e.stopPropagation()}>
                                <button type="button" onClick={() => updateCartQty(key, -1)}>-</button>
                                <span className="qty-val">{qty}</span>
                                <button type="button" onClick={() => updateCartQty(key, 1)}>+</button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="meal-group-title" style={{ marginTop: "15px" }}>Maggi & Add-Ons</div>
                      <div className="menu-grid">
                        {breakfastMenu.filter((item) => !item.isBase).map((item) => {
                          const key = `breakfast_${item.name}`;
                          const qty = subscriptionForm.cart[key] || 0;
                          return (
                            <div key={item.name} className={`menu-card ${qty > 0 ? "active" : ""}`}>
                              <div className="menu-card-details">
                                <span className="menu-card-title">{item.name}</span>
                                <span className="menu-card-desc">{item.desc}</span>
                                <span className="menu-card-price">₹{item.price}</span>
                              </div>
                              <div className="qty-selector" onClick={(e) => e.stopPropagation()}>
                                <button type="button" onClick={() => updateCartQty(key, -1)}>-</button>
                                <span className="qty-val">{qty}</span>
                                <button type="button" onClick={() => updateCartQty(key, 1)}>+</button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* LUNCH SECTION */}
                  {subscriptionForm.mealPreferences.lunch && (
                    <div className="meal-section-block">
                      <div className="meal-section-header">
                        <h3>Lunch Section</h3>
                        <span className="meal-time">1:00 - 2:00 PM</span>
                      </div>

                      <div className="meal-group-title">Complementary Base</div>
                      <div className="menu-grid">
                        {lunchMenu.filter((item) => item.isBase).map((item) => {
                          const key = `lunch_${item.name}`;
                          const qty = subscriptionForm.cart[key] || 0;
                          return (
                            <div key={item.name} className={`menu-card ${qty > 0 ? "active" : ""}`}>
                              <div className="menu-card-details">
                                <span className="menu-card-title">{item.name.replace(" (Lunch)", "")}</span>
                                <span className="menu-card-desc">{item.desc}</span>
                                <span className="menu-card-price">₹{item.price}</span>
                              </div>
                              <div className="qty-selector" onClick={(e) => e.stopPropagation()}>
                                <button type="button" onClick={() => updateCartQty(key, -1)}>-</button>
                                <span className="qty-val">{qty}</span>
                                <button type="button" onClick={() => updateCartQty(key, 1)}>+</button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="meal-group-title" style={{ marginTop: "15px" }}>Add-Ons</div>
                      <div className="menu-grid">
                        {lunchMenu.filter((item) => !item.isBase).map((item) => {
                          const key = `lunch_${item.name}`;
                          const qty = subscriptionForm.cart[key] || 0;
                          return (
                            <div key={item.name} className={`menu-card ${qty > 0 ? "active" : ""}`}>
                              <div className="menu-card-details">
                                <span className="menu-card-title">{item.name.replace(" (Lunch)", "")}</span>
                                <span className="menu-card-desc">{item.desc}</span>
                                <span className="menu-card-price">₹{item.price}</span>
                              </div>
                              <div className="qty-selector" onClick={(e) => e.stopPropagation()}>
                                <button type="button" onClick={() => updateCartQty(key, -1)}>-</button>
                                <span className="qty-val">{qty}</span>
                                <button type="button" onClick={() => updateCartQty(key, 1)}>+</button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* DINNER SECTION */}
                  {subscriptionForm.mealPreferences.dinner && (
                    <div className="meal-section-block">
                      <div className="meal-section-header">
                        <h3>Dinner Section</h3>
                        <span className="meal-time">8:00 - 8:30 PM</span>
                      </div>

                      <div className="meal-group-title">Complementary Base</div>
                      <div className="menu-grid">
                        {dinnerMenu.filter((item) => item.isBase).map((item) => {
                          const key = `dinner_${item.name}`;
                          const qty = subscriptionForm.cart[key] || 0;
                          return (
                            <div key={item.name} className={`menu-card ${qty > 0 ? "active" : ""}`}>
                              <div className="menu-card-details">
                                <span className="menu-card-title">{item.name.replace(" (Dinner)", "")}</span>
                                <span className="menu-card-desc">{item.desc}</span>
                                <span className="menu-card-price">₹{item.price}</span>
                              </div>
                              <div className="qty-selector" onClick={(e) => e.stopPropagation()}>
                                <button type="button" onClick={() => updateCartQty(key, -1)}>-</button>
                                <span className="qty-val">{qty}</span>
                                <button type="button" onClick={() => updateCartQty(key, 1)}>+</button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="meal-group-title" style={{ marginTop: "15px" }}>Add-Ons</div>
                      <div className="menu-grid">
                        {dinnerMenu.filter((item) => !item.isBase).map((item) => {
                          const key = `dinner_${item.name}`;
                          const qty = subscriptionForm.cart[key] || 0;
                          return (
                            <div key={item.name} className={`menu-card ${qty > 0 ? "active" : ""}`}>
                              <div className="menu-card-details">
                                <span className="menu-card-title">{item.name.replace(" (Dinner)", "")}</span>
                                <span className="menu-card-desc">{item.desc}</span>
                                <span className="menu-card-price">₹{item.price}</span>
                              </div>
                              <div className="qty-selector" onClick={(e) => e.stopPropagation()}>
                                <button type="button" onClick={() => updateCartQty(key, -1)}>-</button>
                                <span className="qty-val">{qty}</span>
                                <button type="button" onClick={() => updateCartQty(key, 1)}>+</button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </form>
              ) : (
                /* CORPORATE / EVENT CATERING INQUIRY FORM */
                <form onSubmit={handleCorpSubmit}>
                  <h2>Catering & Event Inquiry</h2>
                  <span className="sub-title">Request a Corporate Quote</span>

                  {/* Name */}
                  <div className="form-group-wrapper">
                    <label className="form-section-title">
                      Contact Name<span>*</span>
                    </label>
                    <input
                      type="text"
                      className="custom-input"
                      placeholder="Your Full Name"
                      value={corporateForm.name}
                      onChange={(e) => handleCorpFormChange("name", e.target.value)}
                      required
                    />
                  </div>

                  {/* Contact Row */}
                  <div className="form-group-wrapper form-row-2">
                    <div>
                      <label className="form-section-title">
                        Official Email<span>*</span>
                      </label>
                      <input
                        type="email"
                        className="custom-input"
                        placeholder="name@company.com"
                        value={corporateForm.email}
                        onChange={(e) => handleCorpFormChange("email", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="form-section-title">
                        Phone Number<span>*</span>
                      </label>
                      <input
                        type="tel"
                        className="custom-input"
                        placeholder="Mobile Number"
                        value={corporateForm.phone}
                        onChange={(e) => handleCorpFormChange("phone", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Company / Family Name */}
                  <div className="form-group-wrapper">
                    <label className="form-section-title">
                      Company or Organisation Name<span>*</span>
                    </label>
                    <input
                      type="text"
                      className="custom-input"
                      placeholder="Company, School, or Family Event Organizer Name"
                      value={corporateForm.orgName}
                      onChange={(e) => handleCorpFormChange("orgName", e.target.value)}
                      required
                    />
                  </div>

                  {/* Program Selector */}
                  <div className="form-group-wrapper">
                    <label className="form-section-title">
                      Program or Event Type<span>*</span>
                    </label>
                    <div className="custom-select-wrap">
                      <select
                        value={corporateForm.programType}
                        onChange={(e) => handleCorpFormChange("programType", e.target.value)}
                        required
                      >
                        <option value="Corporate Employee Meal Program">Corporate Employee Meal Program</option>
                        <option value="Family Function or Gathering">Family Function / Gathering</option>
                        <option value="Birthday, Anniversary, or Party">Birthday / Anniversary / Party</option>
                        <option value="Housewarming or Custom Event">Housewarming / Custom Ceremony</option>
                        <option value="Premium Buffet Event Catering">Premium Buffet Event Catering</option>
                      </select>
                      <FaChevronDown className="custom-select-arrow" />
                    </div>
                  </div>

                  {/* Guests & Catering Style Row */}
                  <div className="form-group-wrapper form-row-2">
                    <div>
                      <label className="form-section-title">
                        Expected Guests<span>*</span>
                      </label>
                      <input
                        type="number"
                        min="10"
                        className="custom-input"
                        placeholder="Min 10 guests"
                        value={corporateForm.guestsCount}
                        onChange={(e) => handleCorpFormChange("guestsCount", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="form-section-title">
                        Catering Style<span>*</span>
                      </label>
                      <div className="custom-select-wrap">
                        <select
                          value={corporateForm.serviceStyle}
                          onChange={(e) => handleCorpFormChange("serviceStyle", e.target.value)}
                          required
                        >
                          <option value="Packed Meal Boxes">Packed Meal Boxes</option>
                          <option value="Buffet Setup (Self-Service)">Buffet Setup (Self-Service)</option>
                          <option value="Live Counters / Premium Catering">Live Counters / Full Catering</option>
                        </select>
                        <FaChevronDown className="custom-select-arrow" />
                      </div>
                    </div>
                  </div>

                  {/* Meals Needed Checkboxes */}
                  <div className="form-group-wrapper">
                    <label className="form-section-title">Meals Required</label>
                    <div className="preference-grid">
                      <div
                        className={`preference-card ${corporateForm.mealsNeeded.breakfast ? "active" : ""}`}
                        onClick={() => handleCorpMealChange("breakfast")}
                      >
                        <div className="checkbox-indicator">
                          <FaCheck />
                        </div>
                        <span className="preference-label">Breakfast</span>
                      </div>
                      <div
                        className={`preference-card ${corporateForm.mealsNeeded.lunch ? "active" : ""}`}
                        onClick={() => handleCorpMealChange("lunch")}
                      >
                        <div className="checkbox-indicator">
                          <FaCheck />
                        </div>
                        <span className="preference-label">Lunch</span>
                      </div>
                      <div
                        className={`preference-card ${corporateForm.mealsNeeded.dinner ? "active" : ""}`}
                        onClick={() => handleCorpMealChange("dinner")}
                      >
                        <div className="checkbox-indicator">
                          <FaCheck />
                        </div>
                        <span className="preference-label">Dinner</span>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="payment-section" style={{ marginTop: "40px" }}>
                    <button type="submit" className="checkout-btn">
                      Request Event Quote
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Right Column: Receipt Summary */}
            <div className="modal-summary-area">
              {activeForm === "subscription" ? (
                /* SUBSCRIPTION PRICING RECEIPT */
                <>
                  <div className="summary-card">
                    <h3>
                      <span>Order Summary</span>
                      <FaChevronDown style={{ fontSize: "0.9rem", color: "#888" }} />
                    </h3>

                    {/* Itemized Cart List */}
                    <div className="receipt-item">
                      <span>Cart Items</span>
                      <span style={{ fontWeight: "600", color: "#D4A017" }}>
                        {Object.keys(subscriptionForm.cart).filter(k => subscriptionForm.cart[k] > 0).length} Items
                      </span>
                    </div>

                    {Object.keys(subscriptionForm.cart).filter(k => subscriptionForm.cart[k] > 0).map((key) => {
                      const qty = subscriptionForm.cart[key];
                      const name = key.split("_")[1].replace(" (Lunch)", "").replace(" (Dinner)", "");
                      
                      // Find item price
                      const itemPrice = key.startsWith("breakfast_")
                        ? breakfastMenu.find((i) => i.name === key.split("_")[1])?.price || 0
                        : key.startsWith("lunch_")
                        ? lunchMenu.find((i) => i.name === key.split("_")[1])?.price || 0
                        : dinnerMenu.find((i) => i.name === key.split("_")[1])?.price || 0;

                      return (
                        <div key={key} className="receipt-item sub-item">
                          <span>- {name} &times; {qty}</span>
                          <span>₹{(itemPrice * qty).toFixed(2)}</span>
                        </div>
                      );
                    })}

                    <div className="receipt-divider"></div>

                    {/* Active Meals list */}
                    <div className="receipt-item">
                      <span>Meals Scheduled</span>
                      <span style={{ fontWeight: "600", color: "white" }}>
                        {[
                          subscriptionForm.mealPreferences.breakfast && "Breakfast",
                          subscriptionForm.mealPreferences.lunch && "Lunch",
                          subscriptionForm.mealPreferences.dinner && "Dinner",
                        ]
                          .filter(Boolean)
                          .join(" + ") || "None Selected"}
                      </span>
                    </div>
                    <div className="receipt-divider"></div>

                    {/* Delivery Charges */}
                    <div className="receipt-item">
                      <span>Delivery Charge</span>
                      <span>{pricing.deliveryCharge === 0 ? "FREE" : `₹${pricing.deliveryCharge}`}</span>
                    </div>

                    <div className="receipt-divider"></div>

                    {/* Total price section */}
                    <div className="receipt-total">
                      <span className="title">Total Amount</span>
                      <div className="amount-wrap">
                        <span className="final-amount">₹{pricing.totalPayable.toFixed(2)}</span>
                      </div>
                    </div>
                    <div style={{ color: "#888", fontSize: "0.75rem", textAlign: "right", marginTop: "5px" }}>
                      No other hidden charges
                    </div>
                  </div>

                  {/* Subscription Confirmation Button */}
                  <div className="payment-section">
                    <button className="checkout-btn" onClick={handleSubSubmit}>
                      Confirm Subscription
                    </button>
                  </div>
                </>
              ) : (
                /* CORPORATE INFO CARD */
                <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "center" }}>
                  <div className="summary-card" style={{ background: "rgba(212, 160, 23, 0.03)", borderColor: "rgba(212,160,23,0.15)" }}>
                    <h3 style={{ borderBottomColor: "rgba(212, 160, 23, 0.2)", color: "#D4A017" }}>
                      Why Choose YAMKITCH?
                    </h3>
                    <p style={{ fontSize: "0.9rem", color: "#bdbdbd", lineHeight: "1.7", marginBottom: "15px" }}>
                      We cater customized menus for sizes ranging from 10 to 500+ employees and family functions.
                    </p>
                    <ul style={{ padding: 0, margin: 0, listStyle: "none", fontSize: "0.88rem", color: "#bdbdbd" }}>
                      <li style={{ marginBottom: "10px", display: "flex", gap: "10px" }}>
                        <span style={{ color: "#D4A017" }}>✔</span> Flexible Weekly/Monthly Billing Cycles.
                      </li>
                      <li style={{ marginBottom: "10px", display: "flex", gap: "10px" }}>
                        <span style={{ color: "#D4A017" }}>✔</span> Standardized Food Safety & Hygiene audits.
                      </li>
                      <li style={{ marginBottom: "10px", display: "flex", gap: "10px" }}>
                        <span style={{ color: "#D4A017" }}>✔</span> Dynamic menus (Indian, Chinese, Continental).
                      </li>
                      <li style={{ display: "flex", gap: "10px" }}>
                        <span style={{ color: "#D4A017" }}>✔</span> Dedicated Relationship Manager support.
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
};

export default SubscriptionModal;
