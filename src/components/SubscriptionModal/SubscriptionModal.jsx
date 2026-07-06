import { useState, useEffect } from "react";
import { FaTimes, FaCheck, FaCreditCard, FaCheckCircle, FaChevronDown } from "react-icons/fa";
import "./SubscriptionModal.css";

const SubscriptionModal = ({ isOpen, onClose, initialType }) => {
  const [activeForm, setActiveForm] = useState(initialType || "subscription");
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State - Daily Meal Subscription
  const [subscriptionForm, setSubscriptionForm] = useState({
    mealPlan: "Balanced Meal (Healthy Eating)",
    mealPreferences: {
      breakfast: true,
      lunch: false,
      dinner: false,
    },
    dietType: "Vegetarian",
    addOns: {
      fruitBowl: false,
      paneerTofu: false,
      drink: false,
    },
    subType: "trial", // 'regular' or 'trial'
    duration: "1day", // 'weekly', 'monthly' for regular; '1day', '3days' for trial
    startDate: "",
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

  // Set initial start date to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];
    setSubscriptionForm((prev) => ({ ...prev, startDate: tomorrowStr }));
  }, []);

  // Update default duration based on subscription type selection
  const handleSubTypeChange = (type) => {
    setSubscriptionForm((prev) => ({
      ...prev,
      subType: type,
      duration: type === "trial" ? "1day" : "weekly",
    }));
  };

  // Pricing calculations
  const calculatePricing = () => {
    const { mealPreferences, dietType, addOns, duration } = subscriptionForm;

    // Daily base rates from menu
    let rates = { breakfast: 39, lunch: 79, dinner: 79 };
    if (dietType === "Non-Vegetarian") {
      rates = { breakfast: 49, lunch: 119, dinner: 119 };
    } else if (dietType === "Eggitarian") {
      rates = { breakfast: 45, lunch: 99, dinner: 99 };
    }

    let dailyBase = 0;
    if (mealPreferences.breakfast) dailyBase += rates.breakfast;
    if (mealPreferences.lunch) dailyBase += rates.lunch;
    if (mealPreferences.dinner) dailyBase += rates.dinner;

    // Addons daily rates
    let addonsDaily = 0;
    if (addOns.fruitBowl) addonsDaily += 59;
    if (addOns.paneerTofu) addonsDaily += 59;
    if (addOns.drink) addonsDaily += 29;

    // Determine number of days and discounts
    let days = 1;
    let discount = 0; // percentage
    if (duration === "1day") {
      days = 1;
    } else if (duration === "3days") {
      days = 3;
      discount = 0.05; // 5% off
    } else if (duration === "weekly") {
      days = 7;
    } else if (duration === "monthly") {
      days = 30;
      discount = 0.1; // 10% off
    }

    const subtotal = (dailyBase + addonsDaily) * days;
    const discountAmount = subtotal * discount;
    const discountedTotal = subtotal - discountAmount;

    // Platform Fee & GST (5%)
    const platformFee = subtotal > 0 ? 15 : 0;
    const gst = discountedTotal * 0.05;
    const totalPayable = discountedTotal + platformFee + gst;

    return {
      dailyBase,
      addonsDaily,
      days,
      discountPercent: discount * 100,
      subtotal,
      discountAmount,
      discountedTotal,
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
    setSubscriptionForm((prev) => ({
      ...prev,
      mealPreferences: {
        ...prev.mealPreferences,
        [pref]: !prev.mealPreferences[pref],
      },
    }));
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

  // Submit Handlers
  const handleSubSubmit = (e) => {
    e.preventDefault();
    if (pricing.totalPayable <= 0) {
      alert("Please select at least one meal to subscribe.");
      return;
    }

    setSummaryData({
      type: "subscription",
      title: subscriptionForm.mealPlan,
      duration: subscriptionForm.duration === "1day" ? "1 Day Trial" : 
                subscriptionForm.duration === "3days" ? "3 Days Trial" :
                subscriptionForm.duration === "weekly" ? "Weekly Subscription" : "Monthly Subscription",
      diet: subscriptionForm.dietType,
      amount: pricing.totalPayable.toFixed(2),
      date: subscriptionForm.startDate,
    });
    setIsSuccess(true);
  };

  const handleCorpSubmit = (e) => {
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
  };

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
                    <span>Meal Plan</span>
                    <span>{summaryData.title}</span>
                  </div>
                  <div className="success-summary-item">
                    <span>Duration</span>
                    <span>{summaryData.duration}</span>
                  </div>
                  <div className="success-summary-item">
                    <span>Diet Type</span>
                    <span>{summaryData.diet}</span>
                  </div>
                  <div className="success-summary-item">
                    <span>Start Date</span>
                    <span>{summaryData.date}</span>
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

                  {/* Meal Plan Select */}
                  <div className="form-group-wrapper">
                    <label className="form-section-title">
                      Meal Plan<span>*</span>
                    </label>
                    <div className="custom-select-wrap">
                      <select
                        value={subscriptionForm.mealPlan}
                        onChange={(e) => handleSubFormChange("mealPlan", e.target.value)}
                        required
                      >
                        <option value="Balanced Meal (Healthy Eating)">Balanced Meal (Healthy Eating)</option>
                        <option value="Weight Loss / Keto Plan">Weight Loss / Keto Plan</option>
                        <option value="High Protein Athlete Plan">High Protein Athlete Plan</option>
                        <option value="Simple Home Style (Ghar Ka Khana)">Simple Home Style (Ghar Ka Khana)</option>
                      </select>
                      <FaChevronDown className="custom-select-arrow" />
                    </div>
                    <span className="form-description">Select the meal plan catering to your needs</span>
                  </div>

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

                  {/* Diet Type Dropdown */}
                  <div className="form-group-wrapper">
                    <label className="form-section-title">
                      Diet Type<span>*</span>
                    </label>
                    <div className="custom-select-wrap">
                      <select
                        value={subscriptionForm.dietType}
                        onChange={(e) => handleSubFormChange("dietType", e.target.value)}
                        required
                      >
                        <option value="Vegetarian">Vegetarian</option>
                        <option value="Non-Vegetarian">Non-Vegetarian</option>
                        <option value="Eggitarian">Eggitarian</option>
                      </select>
                      <FaChevronDown className="custom-select-arrow" />
                    </div>
                    <span className="form-description">Choose your preferred diet style</span>
                  </div>

                  {/* One Time Add-Ons */}
                  <div className="form-group-wrapper">
                    <label className="form-section-title">One Time Add-Ons</label>
                    <div className="addons-grid">
                      <div
                        className={`addon-card ${subscriptionForm.addOns.fruitBowl ? "active" : ""}`}
                        onClick={() => handleSubAddonChange("fruitBowl")}
                      >
                        <h4>Fruit Bowl</h4>
                        <p>350 ml bowl</p>
                        <span className="price">+₹59/day</span>
                      </div>
                      <div
                        className={`addon-card ${subscriptionForm.addOns.paneerTofu ? "active" : ""}`}
                        onClick={() => handleSubAddonChange("paneerTofu")}
                      >
                        <h4>Paneer/Tofu</h4>
                        <p>100g Grilled</p>
                        <span className="price">+₹59/day</span>
                      </div>
                      <div
                        className={`addon-card ${subscriptionForm.addOns.drink ? "active" : ""}`}
                        onClick={() => handleSubAddonChange("drink")}
                      >
                        <h4>Drink</h4>
                        <p>300 ml beverage</p>
                        <span className="price">+₹29/day</span>
                      </div>
                    </div>
                    <span className="form-description">Select additional features as per your requirements</span>
                  </div>

                  {/* Subscription Type & Duration */}
                  <div className="form-group-wrapper">
                    <label className="form-section-title">
                      Subscription Type<span>*</span>
                    </label>
                    <div className="capsule-toggle">
                      <div
                        className={`toggle-option ${subscriptionForm.subType === "regular" ? "active" : ""}`}
                        onClick={() => handleSubTypeChange("regular")}
                      >
                        Regular Subscription
                      </div>
                      <div
                        className={`toggle-option ${subscriptionForm.subType === "trial" ? "active" : ""}`}
                        onClick={() => handleSubTypeChange("trial")}
                      >
                        Trial Period
                      </div>
                    </div>
                    
                    {/* Duration Options */}
                    <div className="duration-grid">
                      {subscriptionForm.subType === "trial" ? (
                        <>
                          <div
                            className={`duration-card ${subscriptionForm.duration === "1day" ? "active" : ""}`}
                            onClick={() => handleSubFormChange("duration", "1day")}
                          >
                            <div className="radio-indicator"></div>
                            <div className="duration-details">
                              <span className="label">1 Day Trial</span>
                              <span className="sub">Experience the taste</span>
                            </div>
                          </div>
                          <div
                            className={`duration-card ${subscriptionForm.duration === "3days" ? "active" : ""}`}
                            onClick={() => handleSubFormChange("duration", "3days")}
                          >
                            <div className="radio-indicator"></div>
                            <div className="duration-details">
                              <span className="label">3 Days Trial</span>
                              <span className="sub">Save 5% on base</span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div
                            className={`duration-card ${subscriptionForm.duration === "weekly" ? "active" : ""}`}
                            onClick={() => handleSubFormChange("duration", "weekly")}
                          >
                            <div className="radio-indicator"></div>
                            <div className="duration-details">
                              <span className="label">Weekly</span>
                              <span className="sub">7 Days Subscription</span>
                            </div>
                          </div>
                          <div
                            className={`duration-card ${subscriptionForm.duration === "monthly" ? "active" : ""}`}
                            onClick={() => handleSubFormChange("duration", "monthly")}
                          >
                            <div className="radio-indicator"></div>
                            <div className="duration-details">
                              <span className="label">Monthly</span>
                              <span className="sub">30 Days (Save 10%)</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Start Date */}
                  <div className="form-group-wrapper">
                    <label className="form-section-title">
                      Start Date<span>*</span>
                    </label>
                    <input
                      type="date"
                      className="custom-input"
                      value={subscriptionForm.startDate}
                      onChange={(e) => handleSubFormChange("startDate", e.target.value)}
                      min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
                      required
                    />
                    <span className="form-description">Select when you want to start receiving meals</span>
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
                      <span>Meal Plan</span>
                      <span style={{ fontWeight: "600", color: "white" }}>{subscriptionForm.mealPlan}</span>
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

                    {/* Diet type */}
                    <div className="receipt-item">
                      <span>Diet Type</span>
                      <span>{subscriptionForm.dietType}</span>
                    </div>

                    {/* Add-ons line items */}
                    {(subscriptionForm.addOns.fruitBowl ||
                      subscriptionForm.addOns.paneerTofu ||
                      subscriptionForm.addOns.drink) && (
                      <>
                        <div className="receipt-divider" style={{ margin: "10px 0" }}></div>
                        <div className="receipt-item">
                          <span>Add-Ons Total</span>
                          <span>₹{pricing.addonsDaily}/day</span>
                        </div>
                        {subscriptionForm.addOns.fruitBowl && (
                          <div className="receipt-item sub-item">
                            <span>- Fruit Bowl (350ml)</span>
                            <span>₹59/day</span>
                          </div>
                        )}
                        {subscriptionForm.addOns.paneerTofu && (
                          <div className="receipt-item sub-item">
                            <span>- Paneer/Tofu (100g)</span>
                            <span>₹59/day</span>
                          </div>
                        )}
                        {subscriptionForm.addOns.drink && (
                          <div className="receipt-item sub-item">
                            <span>- Drink (300ml)</span>
                            <span>₹29/day</span>
                          </div>
                        )}
                      </>
                    )}

                    <div className="receipt-divider"></div>

                    {/* Duration Details */}
                    <div className="receipt-item">
                      <span>Subscription Period</span>
                      <span style={{ color: "#D4A017", fontWeight: "600" }}>
                        {pricing.days} {pricing.days === 1 ? "Day" : "Days"}
                      </span>
                    </div>

                    {/* Discount details */}
                    {pricing.discountAmount > 0 && (
                      <div className="receipt-item discount-item">
                        <span>{pricing.discountPercent}% Off Applied</span>
                        <span>-₹{pricing.discountAmount.toFixed(2)}</span>
                      </div>
                    )}

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
                        {pricing.discountAmount > 0 && (
                          <span className="original-price">
                            ₹{(pricing.subtotal + pricing.platformFee + pricing.gst).toFixed(2)}
                          </span>
                        )}
                        <span className="final-amount">₹{pricing.totalPayable.toFixed(2)}</span>
                      </div>
                    </div>
                    <div style={{ color: "#888", fontSize: "0.75rem", textAlign: "right", marginTop: "5px" }}>
                      No other hidden charges
                    </div>
                  </div>

                  {/* Payment checkout */}
                  <div className="payment-section">
                    <label className="form-section-title">Payment methods</label>
                    <div className="payment-option-card active">
                      <div className="payment-label-wrap">
                        <div className="payment-radio"></div>
                        <span style={{ fontWeight: "600", fontSize: "0.95rem" }}>Razorpay</span>
                      </div>
                      <div className="payment-logos">
                        <FaCreditCard />
                      </div>
                    </div>

                    <button className="checkout-btn" onClick={handleSubSubmit}>
                      Make Payment
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
