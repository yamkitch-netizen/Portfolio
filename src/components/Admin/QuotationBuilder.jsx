import { useState } from "react";
import { FaPlus, FaTrash, FaFilePdf } from "react-icons/fa";

const generateQuoteNumber = () => {
  const now = new Date();
  return `YK-QTN-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
    now.getDate()
  ).padStart(2, "0")}-${String(now.getTime()).slice(-4)}`;
};

const todayISO = () => new Date().toISOString().split("T")[0];

const plusDaysISO = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
};

const QuotationBuilder = ({ enquiries = [] }) => {
  const [quoteNo, setQuoteNo] = useState(generateQuoteNumber);
  const [quoteDate, setQuoteDate] = useState(todayISO);
  const [validUntil, setValidUntil] = useState(() => plusDaysISO(15));

  const [client, setClient] = useState({
    name: "",
    organisation: "",
    phone: "",
    email: "",
    address: "",
    eventTitle: "",
  });

  const [items, setItems] = useState([
    { description: "Corporate Lunch Meal Box", qty: 50, rate: 99 },
  ]);

  const [discount, setDiscount] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [taxPercent, setTaxPercent] = useState(0);
  const [notes, setNotes] = useState(
    "1. 50% advance payment upon confirmation.\n2. Final guest count must be confirmed 24 hours prior to the event.\n3. Freshly prepared hygienic meals delivered on schedule."
  );

  const handleLoadFromEnquiry = (orderId) => {
    const found = enquiries.find((e) => e._id === orderId);
    if (!found) return;
    setClient({
      name: found.customer?.name || "",
      organisation: found.customer?.organisation || "",
      phone: found.customer?.phone || "",
      email: found.customer?.email || "",
      address: found.customer?.address || "",
      eventTitle:
        found.orderType === "corporate"
          ? found.corporateDetails?.programType || "Corporate / Event Catering"
          : "Custom Meal Order",
    });

    if (found.orderType === "corporate") {
      const guests = found.corporateDetails?.guestsCount || 1;
      const meals = (found.mealsScheduled || []).join(", ") || "Meal Service";
      setItems([
        {
          description: `${found.corporateDetails?.programType || "Catering"} (${found.corporateDetails?.serviceStyle || "Packed"}) - ${meals}`,
          qty: guests,
          rate: 0,
        },
      ]);
    } else if (found.orderType === "custom") {
      const plates = found.customMealDetails?.plates || 1;
      const list = (found.customMealDetails?.items || []).join(", ");
      setItems([
        {
          description: list ? `Custom Meal: ${list}` : "Custom Meal",
          qty: plates,
          rate: 0,
        },
      ]);
    }
  };

  const handleItemChange = (index, field, value) => {
    setItems((prev) =>
      prev.map((item, idx) =>
        idx === index
          ? {
              ...item,
              [field]: field === "description" ? value : Math.max(0, Number(value) || 0),
            }
          : item
      )
    );
  };

  const addItem = () => {
    setItems((prev) => [...prev, { description: "", qty: 1, rate: 0 }]);
  };

  const removeItem = (index) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const subtotal = items.reduce((sum, it) => sum + it.qty * it.rate, 0);
  const taxableAmount = Math.max(0, subtotal - (Number(discount) || 0));
  const taxAmount = (taxableAmount * (Number(taxPercent) || 0)) / 100;
  const grandTotal = taxableAmount + taxAmount + (Number(deliveryCharge) || 0);

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="quote-layout">
      {/* Left: Editor Form */}
      <div className="quote-editor no-print">
        <div className="quote-editor-header">
          <h3>Create Quotation</h3>
          <button type="button" className="quote-pdf-btn" onClick={handleExportPDF}>
            <FaFilePdf /> Export / Save PDF
          </button>
        </div>

        {enquiries.length > 0 && (
          <div className="quote-field-group">
            <label>Quick-Fill from Existing Enquiry (Optional)</label>
            <select
              className="quote-input"
              defaultValue=""
              onChange={(e) => handleLoadFromEnquiry(e.target.value)}
            >
              <option value="" disabled>
                -- Select an Event / Custom Meal Enquiry --
              </option>
              {enquiries.map((eq) => (
                <option key={eq._id} value={eq._id}>
                  {eq.invoiceNumber} — {eq.customer?.name}
                  {eq.customer?.organisation ? ` (${eq.customer.organisation})` : ""}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="quote-grid-3">
          <div className="quote-field-group">
            <label>Quotation No.</label>
            <input
              type="text"
              className="quote-input"
              value={quoteNo}
              onChange={(e) => setQuoteNo(e.target.value)}
            />
          </div>
          <div className="quote-field-group">
            <label>Date</label>
            <input
              type="date"
              className="quote-input"
              value={quoteDate}
              onChange={(e) => setQuoteDate(e.target.value)}
            />
          </div>
          <div className="quote-field-group">
            <label>Valid Until</label>
            <input
              type="date"
              className="quote-input"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
            />
          </div>
        </div>

        <h4 className="quote-subhead">Client / Organisation Details</h4>
        <div className="quote-grid-2">
          <div className="quote-field-group">
            <label>Client Name</label>
            <input
              type="text"
              className="quote-input"
              placeholder="e.g. Pritam Chakraborty"
              value={client.name}
              onChange={(e) => setClient({ ...client, name: e.target.value })}
            />
          </div>
          <div className="quote-field-group">
            <label>Organisation / Company</label>
            <input
              type="text"
              className="quote-input"
              placeholder="e.g. ABC Corp"
              value={client.organisation}
              onChange={(e) => setClient({ ...client, organisation: e.target.value })}
            />
          </div>
          <div className="quote-field-group">
            <label>Phone</label>
            <input
              type="tel"
              className="quote-input"
              placeholder="+91 ..."
              value={client.phone}
              onChange={(e) => setClient({ ...client, phone: e.target.value })}
            />
          </div>
          <div className="quote-field-group">
            <label>Email</label>
            <input
              type="email"
              className="quote-input"
              placeholder="client@company.com"
              value={client.email}
              onChange={(e) => setClient({ ...client, email: e.target.value })}
            />
          </div>
        </div>

        <div className="quote-grid-2">
          <div className="quote-field-group">
            <label>Event / Program Title</label>
            <input
              type="text"
              className="quote-input"
              placeholder="e.g. Annual Office Lunch"
              value={client.eventTitle}
              onChange={(e) => setClient({ ...client, eventTitle: e.target.value })}
            />
          </div>
          <div className="quote-field-group">
            <label>Address</label>
            <input
              type="text"
              className="quote-input"
              placeholder="Agartala, Tripura"
              value={client.address}
              onChange={(e) => setClient({ ...client, address: e.target.value })}
            />
          </div>
        </div>

        <div className="quote-items-head">
          <h4 className="quote-subhead" style={{ margin: 0 }}>
            Quotation Items
          </h4>
          <button type="button" className="quote-add-row-btn" onClick={addItem}>
            <FaPlus /> Add Item
          </button>
        </div>

        <div className="quote-items-editor">
          {items.map((item, idx) => (
            <div key={idx} className="quote-item-row">
              <input
                type="text"
                className="quote-input"
                placeholder="Item / Service description"
                value={item.description}
                onChange={(e) => handleItemChange(idx, "description", e.target.value)}
              />
              <input
                type="number"
                min="1"
                className="quote-input"
                placeholder="Qty"
                value={item.qty}
                onChange={(e) => handleItemChange(idx, "qty", e.target.value)}
              />
              <input
                type="number"
                min="0"
                className="quote-input"
                placeholder="Rate (₹)"
                value={item.rate}
                onChange={(e) => handleItemChange(idx, "rate", e.target.value)}
              />
              <button
                type="button"
                className="icon-danger-btn"
                onClick={() => removeItem(idx)}
                title="Remove item"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>

        <div className="quote-grid-3" style={{ marginTop: "14px" }}>
          <div className="quote-field-group">
            <label>Discount (₹)</label>
            <input
              type="number"
              min="0"
              className="quote-input"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
          </div>
          <div className="quote-field-group">
            <label>Delivery / Service (₹)</label>
            <input
              type="number"
              min="0"
              className="quote-input"
              value={deliveryCharge}
              onChange={(e) => setDeliveryCharge(e.target.value)}
            />
          </div>
          <div className="quote-field-group">
            <label>GST / Tax (%)</label>
            <input
              type="number"
              min="0"
              className="quote-input"
              value={taxPercent}
              onChange={(e) => setTaxPercent(e.target.value)}
            />
          </div>
        </div>

        <div className="quote-field-group" style={{ marginTop: "14px" }}>
          <label>Terms &amp; Notes</label>
          <textarea
            rows={3}
            className="quote-input"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>

      {/* Right: Live Printable A4 Sheet */}
      <div className="quote-preview-wrap">
        <div id="quotation-print-sheet" className="quote-sheet">
          <div className="quote-sheet-header">
            <div>
              <div className="quote-brand-title">YAMKITCH</div>
              <div className="quote-brand-sub">Fresh &bull; Healthy &bull; Hygienic</div>
              <div className="quote-brand-meta">Agartala, Tripura, 799001</div>
              <div className="quote-brand-meta">Phone: +91 93669 85516 | yamkitch@gmail.com</div>
            </div>
            <div className="quote-sheet-meta">
              <div className="quote-doc-title">QUOTATION</div>
              <div>
                <strong>No:</strong> {quoteNo}
              </div>
              <div>
                <strong>Date:</strong> {quoteDate}
              </div>
              <div>
                <strong>Valid Until:</strong> {validUntil}
              </div>
            </div>
          </div>

          <div className="quote-client-box">
            <div className="quote-box-label">PREPARED FOR</div>
            <div className="quote-client-name">
              {client.name || "Client Name"}
              {client.organisation ? ` — ${client.organisation}` : ""}
            </div>
            {client.eventTitle && (
              <div className="quote-client-line">
                <strong>Event / Program:</strong> {client.eventTitle}
              </div>
            )}
            <div className="quote-client-line">
              {client.phone && <span>Phone: {client.phone}</span>}
              {client.phone && client.email && <span> &bull; </span>}
              {client.email && <span>Email: {client.email}</span>}
            </div>
            {client.address && <div className="quote-client-line">Address: {client.address}</div>}
          </div>

          <table className="quote-sheet-table">
            <thead>
              <tr>
                <th style={{ width: "44px" }}>#</th>
                <th>Description</th>
                <th style={{ width: "80px", textAlign: "center" }}>Qty</th>
                <th style={{ width: "110px", textAlign: "right" }}>Rate (₹)</th>
                <th style={{ width: "120px", textAlign: "right" }}>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{it.description || "—"}</td>
                  <td style={{ textAlign: "center" }}>{it.qty}</td>
                  <td style={{ textAlign: "right" }}>₹{Number(it.rate).toFixed(2)}</td>
                  <td style={{ textAlign: "right", fontWeight: 600 }}>
                    ₹{(it.qty * it.rate).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="quote-totals-box">
            <div>
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            {Number(discount) > 0 && (
              <div>
                <span>Discount</span>
                <span>- ₹{Number(discount).toFixed(2)}</span>
              </div>
            )}
            {Number(deliveryCharge) > 0 && (
              <div>
                <span>Delivery / Service Charge</span>
                <span>₹{Number(deliveryCharge).toFixed(2)}</span>
              </div>
            )}
            {Number(taxPercent) > 0 && (
              <div>
                <span>GST / Tax ({taxPercent}%)</span>
                <span>₹{taxAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="quote-grand-total">
              <span>Grand Total</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {notes.trim() && (
            <div className="quote-notes-box">
              <div className="quote-box-label">TERMS &amp; CONDITIONS</div>
              <pre>{notes}</pre>
            </div>
          )}

          <div className="quote-sheet-footer">
            <div>Thank you for choosing YAMKITCH!</div>
            <div className="quote-sign">
              <div>Authorized Signatory</div>
              <strong>YAMKITCH</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationBuilder;
