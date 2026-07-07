import { useState, useEffect } from "react";
import { FaTimes, FaCheck, FaCreditCard, FaCheckCircle, FaChevronDown } from "react-icons/fa";
import "./SubscriptionModal.css";

// Menu items defined as per user specification
const breakfastMenu = [
  { name: "Plain Roti (with Ata)", price: 7, desc: "Moderate size" },
  { name: "Plain Puri (with Ata)", price: 7, desc: "Moderate size" },
  { name: "Vegetable Curry/Sabji", price: 19, desc: "Aloo Dum / Mixed Vegetables" },
  { name: "Bread with Jam & Butter", price: 19, desc: "4 bread with butter (Grilled/non-grilled)" },
  { name: "Boiled Egg", price: 12, desc: "Chicken" },
  { name: "Egg Maggi (with Butter)", price: 59, desc: "Maggi with extra butter" },
  { name: "Green Salad", price: 59, desc: "Fresh lettuce, carrot, cucumber with dressing" },
];

const lunchDinnerMenu = [
  { name: "Plain Meal", price: 59, desc: "Plain Rice + Dal + Vegetable Fry" },
  { name: "Mixed / Seasonal Vegetables", price: 19, desc: "Aloo Dum / Mixed Vegetables & others" },
  { name: "Omelette", price: 15, desc: "Chicken" },
  { name: "Egg Tadka", price: 30, desc: "Chicken" },
  { name: "Chicken Curry", price: 59, desc: "with Butter (4 Pieces + 1 Potato)" },
  { name: "Paneer Curry", price: 59, desc: "Paneer with butter gravy" },
  { name: "Chicken Dum Biryani", price: 119, desc: "(1 Chicken Piece + 1 Potato + 1 Boiled Egg)" },
];

const SubscriptionModal = ({ isOpen, onClose, initialType }) => {
  const [activeForm, setActiveForm] = useState(initialType || "subscription");
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State - Daily Meal Subscription
  const [subscriptionForm, setSubscriptionForm] = useState({
    menuItems: [], // Selected items from menu
    mealPreferences: {
      breakfast: false,
      lunch: false,
      dinner: false,
    },
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

  // Helper to fetch unlocked menu options
  const getAvailableMenuItems = () => {
    let items = [];
    if (subscriptionForm.mealPreferences.breakfast) {
      items = [...items, ...breakfastMenu];
    }
    if (subscriptionForm.mealPreferences.lunch || subscriptionForm.mealPreferences.dinner) {
      items = [...items, ...lunchDinnerMenu];
    }
    return items;
  };

  // Pricing calculations
  const calculatePricing = () => {
    const { menuItems } = subscriptionForm;

    // Daily base is the sum of prices of selected items
    const availableItems = getAvailableMenuItems();
    let dailyBase = 0;
    menuItems.forEach((itemName) => {
      const item = availableItems.find((i) => i.name === itemName);
      if (item) dailyBase += item.price;
    });

    const subtotal = dailyBase;

    // Platform Fee & GST (5%)
    const platformFee = subtotal > 0 ? 15 : 0;
    const gst = subtotal * 0.05;
    const totalPayable = subtotal + platformFee + gst;

    return {
      dailyBase,
      days: 1,
      subtotal,
      platformFee,
      gst,
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

      // Determine new available items
      let items = [];
      if (updatedPrefs.breakfast) {
        items = [...items, ...breakfastMenu];
      }
      if (updatedPrefs.lunch || updatedPrefs.dinner) {
        items = [...items, ...lunchDinnerMenu];
      }

      // Filter out items that are no longer available
      let newMenuItems = prev.menuItems.filter((itemName) =>
        items.some((item) => item.name === itemName)
      );

      // Rule 1: If Breakfast is checked, ensure exactly one of Roti or Puri is selected
      if (updatedPrefs.breakfast) {
        const hasRoti = newMenuItems.includes("Plain Roti (with Ata)");
        const hasPuri = newMenuItems.includes("Plain Puri (with Ata)");
        if (!hasRoti && !hasPuri) {
          newMenuItems.push("Plain Roti (with Ata)"); // Default to Roti
        }
      } else {
        // If Breakfast is unchecked, clear Roti & Puri from selections
        newMenuItems = newMenuItems.filter(
          (name) => name !== "Plain Roti (with Ata)" && name !== "Plain Puri (with Ata)"
        );
      }

      // Rule 2: If Lunch or Dinner is checked, ensure Plain Meal is selected
      const hasLunchOrDinner = updatedPrefs.lunch || updatedPrefs.dinner;
      if (hasLunchOrDinner) {
        if (!newMenuItems.includes("Plain Meal")) {
          newMenuItems.push("Plain Meal");
        }
      } else {
        // If both are unchecked, remove Plain Meal from selections
        newMenuItems = newMenuItems.filter((name) => name !== "Plain Meal");
      }

      return {
        ...prev,
        mealPreferences: updatedPrefs,
        menuItems: newMenuItems,
      };
    });
  };

  const handleMenuItemToggle = (itemName) => {
    // Rule: Plain Meal is mandatory and cannot be deselected
    if (itemName === "Plain Meal") {
      return; // Do nothing
    }

    // Rule: Roti & Puri are mutually exclusive and at least one must be selected
    if (itemName === "Plain Roti (with Ata)") {
      setSubscriptionForm((prev) => {
        if (prev.menuItems.includes("Plain Roti (with Ata)")) return prev; // Cannot deselect both
        return {
          ...prev,
          menuItems: [
            ...prev.menuItems.filter((name) => name !== "Plain Puri (with Ata)"),
            "Plain Roti (with Ata)",
          ],
        };
      });
      return;
    }

    if (itemName === "Plain Puri (with Ata)") {
      setSubscriptionForm((prev) => {
        if (prev.menuItems.includes("Plain Puri (with Ata)")) return prev; // Cannot deselect both
        return {
          ...prev,
          menuItems: [
            ...prev.menuItems.filter((name) => name !== "Plain Roti (with Ata)"),
            "Plain Puri (with Ata)",
          ],
        };
      });
      return;
    }

    // Standard toggle for optional items (add-ons)
    setSubscriptionForm((prev) => {
      const isSelected = prev.menuItems.includes(itemName);
      const updatedItems = isSelected
        ? prev.menuItems.filter((name) => name !== itemName)
        : [...prev.menuItems, itemName];
      return {
        ...prev,
        menuItems: updatedItems,
      };
    });
  };

  const handleSubAddonChange = (addon) => {
    setSubscriptionForm((prev) => ({
      ...prev,
      addOns: {
        ...prev.addOns,
        [addon]: !prev.addOns[addon],
      },
    }));
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
    if (subscriptionForm.menuItems.length === 0) {
      alert("Please select at least one dish from the Menu.");
      return;
    }

    setSummaryData({
      type: "subscription",
      title: subscriptionForm.menuItems.join(", "),
      amount: pricing.totalPayable.toFixed(2),
    });
    setIsSuccess(true);

    const activeMeals = [
      subscriptionForm.mealPreferences.breakfast && "Breakfast",
      subscriptionForm.mealPreferences.lunch && "Lunch",
      subscriptionForm.mealPreferences.dinner && "Dinner"
    ].filter(Boolean).join(", ");

    const emailSubject = `[YAMKITCH] New Daily Meal Subscription - ${subscriptionForm.menuItems.length} Dishes`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
        <h2 style="color: #2ecc71; border-bottom: 2px solid #2ecc71; padding-bottom: 8px; margin-top: 0;">New Subscription Order Confirmed</h2>
        <p><strong>Selected Menu Items:</strong> ${subscriptionForm.menuItems.join(", ")}</p>
        <p><strong>Meals Scheduled:</strong> ${activeMeals || "None"}</p>
        <h3 style="color: #D4A017; font-size: 1.3em; margin-top: 20px;">Total Amount Paid: ₹${pricing.totalPayable.toFixed(2)}</h3>
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

    const emailSubject = `[YAMKITCH] New Catering & Quote Enquiry - ${corporateForm.name}`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
        <h2 style="color: #D4A017; border-bottom: 2px solid #D4A017; padding-bottom: 8px; margin-top: 0;">New Event Catering Request</h2>
        <p><strong>Contact Person:</strong> ${corporateForm.name}</p>
        <p><strong>Email:</strong> ${corporateForm.email}</p>
        <p><strong>Phone:</strong> ${corporateForm.phone}</p>
        <p><strong>Company/Organisation:</strong> ${corporateForm.orgName}</p>
        <p><strong>Program/Event Type:</strong> ${corporateForm.programType}</p>
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

  const isMenuUnlocked = subscriptionForm.mealPreferences.breakfast || 
                         subscriptionForm.mealPreferences.lunch || 
                         subscriptionForm.mealPreferences.dinner;
  const availableMenuItems = getAvailableMenuItems();

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Close Icon */}
        <button className="modal-close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        {/* Tab Selector Header (Only shown when not in success view) */}
        {!isSuccess && (
          <div className="capsule-toggle" style={{ margin: "20px 45px 0 45px", width: "calc(100% - 90px)" }}>
            <div
              className={`toggle-option ${activeForm === "subscription" ? "active" : ""}`}
              onClick={() => setActiveForm("subscription")}
            >
              Daily Meal Subscription
            </div>
            <div
              className={`toggle-option ${activeForm === "corporate" ? "active" : ""}`}
              onClick={() => setActiveForm("corporate")}
            >
              Corporate & Family Programs
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
                  <div className="success-summary-item">
                    <span>Selected Menu Items</span>
                    <span>{summaryData.title}</span>
                  </div>
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

                  {/* Menu Multi-Select Grid */}
                  <div className="form-group-wrapper">
                    <label className="form-section-title">
                      Menu<span>*</span>
                    </label>
                    <div className="menu-grid">
                      {isMenuUnlocked ? (
                        availableMenuItems.map((item) => {
                          const isSelected = subscriptionForm.menuItems.includes(item.name);
                          return (
                            <div
                              key={item.name}
                              className={`menu-card ${isSelected ? "active" : ""}`}
                              onClick={() => handleMenuItemToggle(item.name)}
                            >
                              <div className="checkbox-indicator">
                                <FaCheck />
                              </div>
                              <div className="menu-card-details">
                                <span className="menu-card-title">{item.name}</span>
                                <span className="menu-card-desc">{item.desc}</span>
                                <span className="menu-card-price">₹{item.price}</span>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="menu-placeholder">
                          Choose a meal preference (Breakfast, Lunch, or Dinner) above first to unlock the menu options.
                        </div>
                      )}
                    </div>
                    <span className="form-description">
                      {isMenuUnlocked ? "Select one or more dishes from the menu" : "Menu will unlock once a preference is selected"}
                    </span>
                  </div>

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

                    {/* Base Plan Line */}
                    <div className="receipt-item">
                      <span>Menu Items ({subscriptionForm.menuItems.length})</span>
                      <span 
                        style={{ 
                          fontWeight: "600", 
                          color: "white", 
                          textAlign: "right",
                          maxWidth: "60%",
                          wordBreak: "break-word"
                        }}
                      >
                        {subscriptionForm.menuItems.length > 0
                          ? subscriptionForm.menuItems.join(", ")
                          : "None Selected"}
                      </span>
                    </div>

                    {/* Active Meals list */}
                    <div className="receipt-item sub-item">
                      <span>
                        Preferences:{" "}
                        {[
                          subscriptionForm.mealPreferences.breakfast && "Breakfast",
                          subscriptionForm.mealPreferences.lunch && "Lunch",
                          subscriptionForm.mealPreferences.dinner && "Dinner",
                        ]
                          .filter(Boolean)
                          .join(" + ") || "None Selected"}
                      </span>
                      <span>₹{pricing.dailyBase}/day</span>
                    </div>
                    <div className="receipt-divider"></div>

                    {/* Platform Fee */}
                    <div className="receipt-item">
                      <span>Platform Fee & GST</span>
                      <span>Platform Checked</span>
                    </div>
                    <div className="receipt-item sub-item">
                      <span>- Fixed Platform Fee</span>
                      <span>₹{pricing.platformFee}</span>
                    </div>
                    <div className="receipt-item sub-item">
                      <span>- GST (5%)</span>
                      <span>₹{pricing.gst.toFixed(2)}</span>
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
      </div>
    </div>
  );
};

export default SubscriptionModal;
