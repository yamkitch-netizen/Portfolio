import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import {
  FaLock,
  FaSignOutAlt,
  FaClipboardList,
  FaUtensils,
  FaPlus,
  FaSave,
  FaTrash,
  FaSyncAlt,
  FaSearch,
  FaArrowLeft,
  FaChevronDown,
  FaFileInvoice,
} from "react-icons/fa";
import QuotationBuilder from "../components/Admin/QuotationBuilder";
import "./AdminPage.css";

const API_BASE = import.meta.env.VITE_API_URL || "";
const STATUS_OPTIONS = ["Pending", "Confirmed", "Delivered", "Cancelled"];
const CATEGORIES = ["breakfast", "lunch", "dinner"];

const CustomSelect = ({ value, options, onChange, className = "" }) => {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState({});
  const ref = useRef(null);
  const menuRef = useRef(null);

  const updatePosition = useCallback(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const estimatedHeight = options.length * 36 + 12;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpward = spaceBelow < estimatedHeight && rect.top > estimatedHeight;

    setMenuStyle({
      position: "fixed",
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      top: openUpward ? "auto" : `${rect.bottom + 6}px`,
      bottom: openUpward ? `${window.innerHeight - rect.top + 6}px` : "auto",
      zIndex: 9999,
    });
  }, [options.length]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        ref.current &&
        !ref.current.contains(e.target) &&
        (!menuRef.current || !menuRef.current.contains(e.target))
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!open) return;
    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, updatePosition]);

  const selected = options.find((opt) => opt.value === value) || options[0];

  return (
    <div className={`custom-select ${className} ${open ? "is-open" : ""}`} ref={ref}>
      <button
        type="button"
        className="custom-select-trigger"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{selected?.label}</span>
        <FaChevronDown className="custom-select-chevron" />
      </button>
      {open &&
        createPortal(
          <div className="custom-select-menu" ref={menuRef} style={menuStyle}>
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`custom-select-option ${opt.value === value ? "selected" : ""}`}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
};

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem("yamkitch_admin_auth") === "true"
  );
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [activeTab, setActiveTab] = useState("daily");

  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [monthFilter, setMonthFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Menu state
  const [menuItems, setMenuItems] = useState([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editingDrafts, setEditingDrafts] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [newItem, setNewItem] = useState({
    category: "breakfast",
    name: "",
    price: "",
    desc: "",
    isBase: false,
  });

  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const params = new URLSearchParams();
      if (monthFilter) params.set("month", monthFilter);
      if (statusFilter !== "All") params.set("status", statusFilter);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());

      const res = await fetch(`${API_BASE}/api/orders?${params.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders || []);
      } else {
        showToast(data.error || "Failed to load orders");
      }
    } catch {
      showToast("Backend unreachable. Make sure backend server is running.");
    } finally {
      setOrdersLoading(false);
    }
  }, [monthFilter, statusFilter, searchQuery]);

  const fetchMenu = useCallback(async () => {
    setMenuLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/menu?all=true`);
      const data = await res.json();
      if (res.ok) {
        const items = data.items || [];
        setMenuItems(items);
        const drafts = {};
        items.forEach((item) => {
          drafts[item._id] = {
            category: item.category,
            name: item.name,
            price: item.price,
            desc: item.desc || "",
            isBase: Boolean(item.isBase),
            isAvailable: item.isAvailable !== false,
          };
        });
        setEditingDrafts(drafts);
      } else {
        showToast(data.error || "Failed to load menu");
      }
    } catch {
      showToast("Backend unreachable. Make sure backend server is running.");
    } finally {
      setMenuLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (activeTab === "menu") {
      fetchMenu();
    } else {
      fetchOrders();
    }
  }, [isAuthenticated, activeTab, fetchOrders, fetchMenu]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError("");
    try {
      const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        sessionStorage.setItem("yamkitch_admin_auth", "true");
        setIsAuthenticated(true);
        setPassword("");
      } else {
        const data = await res.json();
        setAuthError(data.error || "Invalid password");
      }
    } catch {
      setAuthError("Cannot connect to backend server.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("yamkitch_admin_auth");
    setIsAuthenticated(false);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE}/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
        );
        showToast("Order status updated");
      }
    } catch {
      showToast("Failed to update status");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Delete this order record permanently?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/orders/${orderId}`, { method: "DELETE" });
      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o._id !== orderId));
        showToast("Order deleted");
      }
    } catch {
      showToast("Failed to delete order");
    }
  };

  const handleDraftChange = (id, field, value) => {
    setEditingDrafts((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleSaveMenuItem = async (id) => {
    const draft = editingDrafts[id];
    if (!draft || !draft.name.trim() || draft.price === "") {
      showToast("Name and price are required");
      return;
    }
    setSavingId(id);
    try {
      const res = await fetch(`${API_BASE}/api/menu/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...draft,
          price: Number(draft.price),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMenuItems((prev) => prev.map((m) => (m._id === id ? data.item : m)));
        showToast("Menu item updated");
      } else {
        showToast(data.error || "Failed to update item");
      }
    } catch {
      showToast("Failed to save item");
    } finally {
      setSavingId(null);
    }
  };

  const handleDeleteMenuItem = async (id) => {
    if (!window.confirm("Remove this item from the menu?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/menu/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMenuItems((prev) => prev.filter((m) => m._id !== id));
        showToast("Menu item deleted");
      }
    } catch {
      showToast("Failed to delete item");
    }
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    if (!newItem.name.trim() || newItem.price === "") return;
    try {
      const res = await fetch(`${API_BASE}/api/menu`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newItem,
          price: Number(newItem.price),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setNewItem({ category: newItem.category, name: "", price: "", desc: "", isBase: false });
        await fetchMenu();
        showToast("New menu item added");
      } else {
        showToast(data.error || "Failed to add item");
      }
    } catch {
      showToast("Failed to add item");
    }
  };

  // Split orders into Daily Regular Meals, Party & Event Enquiries, and Custom Meals
  const dailyOrders = orders.filter((o) => !o.orderType || o.orderType === "subscription");
  const corporateOrders = orders.filter((o) => o.orderType === "corporate");
  const customOrders = orders.filter((o) => o.orderType === "custom");

  // Summary metrics
  const totalRevenue = dailyOrders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + (o.totalPayable || 0), 0);
  const dailyPendingCount = dailyOrders.filter((o) => o.status === "Pending").length;
  const dailyDeliveredCount = dailyOrders.filter((o) => o.status === "Delivered").length;

  const totalGuests = corporateOrders.reduce(
    (sum, o) => sum + (o.corporateDetails?.guestsCount || 0),
    0
  );
  const corpPendingCount = corporateOrders.filter((o) => o.status === "Pending").length;
  const corpConfirmedCount = corporateOrders.filter((o) => o.status === "Confirmed").length;

  const totalCustomPlates = customOrders.reduce(
    (sum, o) => sum + (o.customMealDetails?.plates || 0),
    0
  );
  const customPendingCount = customOrders.filter((o) => o.status === "Pending").length;
  const customConfirmedCount = customOrders.filter((o) => o.status === "Confirmed").length;

  const filteredMenu =
    categoryFilter === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === categoryFilter);

  if (!isAuthenticated) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-card">
          <div className="admin-login-icon">
            <FaLock />
          </div>
          <h1>YAMKITCH Admin</h1>
          <p>Enter your admin password to manage orders and menu pricing.</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {authError && <div className="admin-error">{authError}</div>}
            <button type="submit">Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {toast && <div className="admin-toast">{toast}</div>}

      <div className="admin-container">
        {/* Top Bar */}
        <div className="admin-header">
          <div>
            <span className="admin-tag">MANAGEMENT PORTAL</span>
            <h1>YAMKITCH Admin Panel</h1>
          </div>
          <div className="admin-header-actions">
            <div className="admin-tabs">
              <button
                className={activeTab === "daily" ? "active" : ""}
                onClick={() => setActiveTab("daily")}
              >
                <FaClipboardList /> Daily Orders ({dailyOrders.length})
              </button>
              <button
                className={activeTab === "corporate" ? "active" : ""}
                onClick={() => setActiveTab("corporate")}
              >
                <FaClipboardList /> Events &amp; Catering ({corporateOrders.length})
              </button>
              <button
                className={activeTab === "custom" ? "active" : ""}
                onClick={() => setActiveTab("custom")}
              >
                <FaClipboardList /> Custom Meals ({customOrders.length})
              </button>
              <button
                className={activeTab === "menu" ? "active" : ""}
                onClick={() => setActiveTab("menu")}
              >
                <FaUtensils /> Menu &amp; Prices
              </button>
              <button
                className={activeTab === "quotation" ? "active" : ""}
                onClick={() => setActiveTab("quotation")}
              >
                <FaFileInvoice /> Quotation
              </button>
            </div>
            <a href="/" className="admin-back-btn">
              <FaArrowLeft /> Website
            </a>
            <button className="admin-logout-btn" onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>

        {/* DAILY ORDERS TAB */}
        {activeTab === "daily" && (
          <div className="admin-section">
            {/* Summary Cards */}
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <span>Daily Orders</span>
                <strong>{dailyOrders.length}</strong>
              </div>
              <div className="admin-stat-card">
                <span>Total Revenue</span>
                <strong>₹{totalRevenue.toFixed(2)}</strong>
              </div>
              <div className="admin-stat-card">
                <span>Pending Orders</span>
                <strong>{dailyPendingCount}</strong>
              </div>
              <div className="admin-stat-card">
                <span>Delivered Orders</span>
                <strong>{dailyDeliveredCount}</strong>
              </div>
            </div>

            {/* Filters */}
            <div className="admin-filters">
              <div className="admin-search-box">
                <FaSearch />
                <input
                  type="text"
                  placeholder="Search invoice, name, phone, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <input
                type="month"
                className="admin-filter-input"
                value={monthFilter}
                onChange={(e) => setMonthFilter(e.target.value)}
                title="Filter by month"
              />
              <CustomSelect
                value={statusFilter}
                options={[
                  { value: "All", label: "All Statuses" },
                  ...STATUS_OPTIONS.map((s) => ({ value: s, label: s })),
                ]}
                onChange={(val) => setStatusFilter(val)}
              />
              <button className="admin-refresh-btn" onClick={fetchOrders}>
                <FaSyncAlt /> Refresh
              </button>
            </div>

            {/* Daily Orders Table */}
            <div className="admin-table-wrap">
              {ordersLoading ? (
                <div className="admin-empty">Loading orders...</div>
              ) : dailyOrders.length === 0 ? (
                <div className="admin-empty">No daily meal orders found.</div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Invoice &amp; Date</th>
                      <th>Customer</th>
                      <th>Items Ordered</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyOrders.map((order) => (
                      <tr key={order._id}>
                        <td data-label="Invoice & Date">
                          <div className="invoice-badge">{order.invoiceNumber}</div>
                          <div className="muted-text">
                            {new Date(order.createdAt).toLocaleString("en-IN", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </div>
                        </td>
                        <td data-label="Customer">
                          <strong>{order.customer?.name}</strong>
                          <div className="muted-text">{order.customer?.phone}</div>
                          <div className="muted-text">{order.customer?.email}</div>
                          <div className="muted-text">{order.customer?.address}</div>
                        </td>
                        <td data-label="Items Ordered">
                          <ul className="order-items-list">
                            {(order.items || []).map((it, idx) => (
                              <li key={idx}>
                                <span className="slot-pill">{it.mealSlot}</span> {it.name} &times;{" "}
                                {it.qty} (₹{it.lineTotal})
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td data-label="Total">
                          <strong className="gold-text">
                            ₹{(order.totalPayable || 0).toFixed(2)}
                          </strong>
                          <div className="muted-text">
                            Delivery:{" "}
                            {order.deliveryCharge === 0 ? "FREE" : `₹${order.deliveryCharge}`}
                          </div>
                        </td>
                        <td data-label="Status">
                          <CustomSelect
                            className={`status-select-wrap status-${(order.status || "Pending").toLowerCase()}`}
                            value={order.status || "Pending"}
                            options={STATUS_OPTIONS.map((s) => ({ value: s, label: s }))}
                            onChange={(val) => handleStatusChange(order._id, val)}
                          />
                        </td>
                        <td data-label="Action" className="td-action">
                          <button
                            className="icon-danger-btn"
                            onClick={() => handleDeleteOrder(order._id)}
                            title="Delete order"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* EVENTS & CATERING TAB */}
        {activeTab === "corporate" && (
          <div className="admin-section">
            {/* Summary Cards */}
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <span>Total Enquiries</span>
                <strong>{corporateOrders.length}</strong>
              </div>
              <div className="admin-stat-card">
                <span>Total Expected Guests</span>
                <strong>{totalGuests}</strong>
              </div>
              <div className="admin-stat-card">
                <span>Pending Quotes</span>
                <strong>{corpPendingCount}</strong>
              </div>
              <div className="admin-stat-card">
                <span>Confirmed Events</span>
                <strong>{corpConfirmedCount}</strong>
              </div>
            </div>

            {/* Filters */}
            <div className="admin-filters">
              <div className="admin-search-box">
                <FaSearch />
                <input
                  type="text"
                  placeholder="Search ref #, contact name, organisation, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <input
                type="month"
                className="admin-filter-input"
                value={monthFilter}
                onChange={(e) => setMonthFilter(e.target.value)}
                title="Filter by month"
              />
              <CustomSelect
                value={statusFilter}
                options={[
                  { value: "All", label: "All Statuses" },
                  ...STATUS_OPTIONS.map((s) => ({ value: s, label: s })),
                ]}
                onChange={(val) => setStatusFilter(val)}
              />
              <button className="admin-refresh-btn" onClick={fetchOrders}>
                <FaSyncAlt /> Refresh
              </button>
            </div>

            {/* Events & Catering Table */}
            <div className="admin-table-wrap">
              {ordersLoading ? (
                <div className="admin-empty">Loading enquiries...</div>
              ) : corporateOrders.length === 0 ? (
                <div className="admin-empty">No party or corporate catering enquiries found.</div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Ref &amp; Date</th>
                      <th>Contact &amp; Organisation</th>
                      <th>Event / Program</th>
                      <th>Guests &amp; Style</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {corporateOrders.map((order) => (
                      <tr key={order._id}>
                        <td data-label="Ref & Date">
                          <div className="invoice-badge">{order.invoiceNumber}</div>
                          <div className="muted-text">
                            {new Date(order.createdAt).toLocaleString("en-IN", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </div>
                        </td>
                        <td data-label="Contact & Organisation">
                          <strong>{order.customer?.name}</strong>
                          {order.customer?.organisation && (
                            <div className="muted-text" style={{ color: "#d4a017", fontWeight: 600 }}>
                              {order.customer.organisation}
                            </div>
                          )}
                          <div className="muted-text">{order.customer?.phone}</div>
                          <div className="muted-text">{order.customer?.email}</div>
                        </td>
                        <td data-label="Event / Program">
                          <strong>{order.corporateDetails?.programType}</strong>
                          {(order.mealsScheduled || []).length > 0 && (
                            <div className="muted-text">
                              Meals: {order.mealsScheduled.join(", ")}
                            </div>
                          )}
                        </td>
                        <td data-label="Guests & Style">
                          <strong className="gold-text">
                            {order.corporateDetails?.guestsCount || 0} Guests
                          </strong>
                          <div className="muted-text">
                            {order.corporateDetails?.serviceStyle}
                          </div>
                        </td>
                        <td data-label="Status">
                          <CustomSelect
                            className={`status-select-wrap status-${(order.status || "Pending").toLowerCase()}`}
                            value={order.status || "Pending"}
                            options={STATUS_OPTIONS.map((s) => ({ value: s, label: s }))}
                            onChange={(val) => handleStatusChange(order._id, val)}
                          />
                        </td>
                        <td data-label="Action" className="td-action">
                          <button
                            className="icon-danger-btn"
                            onClick={() => handleDeleteOrder(order._id)}
                            title="Delete enquiry"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* CUSTOM MEALS TAB */}
        {activeTab === "custom" && (
          <div className="admin-section">
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <span>Custom Meal Requests</span>
                <strong>{customOrders.length}</strong>
              </div>
              <div className="admin-stat-card">
                <span>Total Plates</span>
                <strong>{totalCustomPlates}</strong>
              </div>
              <div className="admin-stat-card">
                <span>Pending Requests</span>
                <strong>{customPendingCount}</strong>
              </div>
              <div className="admin-stat-card">
                <span>Confirmed Requests</span>
                <strong>{customConfirmedCount}</strong>
              </div>
            </div>

            <div className="admin-filters">
              <div className="admin-search-box">
                <FaSearch />
                <input
                  type="text"
                  placeholder="Search ref #, name, phone, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <input
                type="month"
                className="admin-filter-input"
                value={monthFilter}
                onChange={(e) => setMonthFilter(e.target.value)}
                title="Filter by month"
              />
              <CustomSelect
                value={statusFilter}
                options={[
                  { value: "All", label: "All Statuses" },
                  ...STATUS_OPTIONS.map((s) => ({ value: s, label: s })),
                ]}
                onChange={(val) => setStatusFilter(val)}
              />
              <button className="admin-refresh-btn" onClick={fetchOrders}>
                <FaSyncAlt /> Refresh
              </button>
            </div>

            <div className="admin-table-wrap">
              {ordersLoading ? (
                <div className="admin-empty">Loading custom meal requests...</div>
              ) : customOrders.length === 0 ? (
                <div className="admin-empty">No custom meal requests found.</div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Ref &amp; Date</th>
                      <th>Customer</th>
                      <th>Custom Items</th>
                      <th>Plates</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customOrders.map((order) => (
                      <tr key={order._id}>
                        <td data-label="Ref & Date">
                          <div className="invoice-badge">{order.invoiceNumber}</div>
                          <div className="muted-text">
                            {new Date(order.createdAt).toLocaleString("en-IN", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </div>
                        </td>
                        <td data-label="Customer">
                          <strong>{order.customer?.name}</strong>
                          <div className="muted-text">{order.customer?.phone}</div>
                          <div className="muted-text">{order.customer?.email}</div>
                          <div className="muted-text">{order.customer?.address}</div>
                        </td>
                        <td data-label="Custom Items">
                          <ul className="order-items-list">
                            {(order.customMealDetails?.items || []).map((itemName, idx) => (
                              <li key={idx}>
                                <span className="slot-pill">Item {idx + 1}</span> {itemName}
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td data-label="Plates">
                          <strong className="gold-text">
                            {order.customMealDetails?.plates || 1}{" "}
                            {(order.customMealDetails?.plates || 1) === 1 ? "Plate" : "Plates"}
                          </strong>
                        </td>
                        <td data-label="Status">
                          <CustomSelect
                            className={`status-select-wrap status-${(order.status || "Pending").toLowerCase()}`}
                            value={order.status || "Pending"}
                            options={STATUS_OPTIONS.map((s) => ({ value: s, label: s }))}
                            onChange={(val) => handleStatusChange(order._id, val)}
                          />
                        </td>
                        <td data-label="Action" className="td-action">
                          <button
                            className="icon-danger-btn"
                            onClick={() => handleDeleteOrder(order._id)}
                            title="Delete request"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* QUOTATION TAB */}
        {activeTab === "quotation" && (
          <QuotationBuilder enquiries={[...corporateOrders, ...customOrders]} />
        )}

        {/* MENU TAB */}
        {activeTab === "menu" && (
          <div className="admin-section">
            {/* Add New Menu Item */}
            <form className="admin-add-form" onSubmit={handleAddMenuItem}>
              <h3>Add New Menu Item</h3>
              <div className="admin-add-grid">
                <CustomSelect
                  value={newItem.category}
                  options={CATEGORIES.map((c) => ({
                    value: c,
                    label: c.charAt(0).toUpperCase() + c.slice(1),
                  }))}
                  onChange={(val) => setNewItem({ ...newItem, category: val })}
                />
                <input
                  type="text"
                  placeholder="Item Name (e.g. Paneer Pulao)"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  required
                />
                <input
                  type="number"
                  min="0"
                  placeholder="Price (₹)"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Description (e.g. 250g with raita)"
                  value={newItem.desc}
                  onChange={(e) => setNewItem({ ...newItem, desc: e.target.value })}
                />
                <label className="checkbox-inline">
                  <input
                    type="checkbox"
                    checked={newItem.isBase}
                    onChange={(e) => setNewItem({ ...newItem, isBase: e.target.checked })}
                  />
                  Base Meal
                </label>
                <button type="submit" className="admin-add-btn">
                  <FaPlus /> Add Item
                </button>
              </div>
            </form>

            {/* Category Filter */}
            <div className="admin-category-pills">
              {["all", ...CATEGORIES].map((cat) => {
                const count =
                  cat === "all"
                    ? menuItems.length
                    : menuItems.filter((i) => i.category === cat).length;
                return (
                  <button
                    key={cat}
                    className={categoryFilter === cat ? "active" : ""}
                    onClick={() => setCategoryFilter(cat)}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)} ({count})
                  </button>
                );
              })}
            </div>

            {/* Menu Items Table */}
            <div className="admin-table-wrap">
              {menuLoading ? (
                <div className="admin-empty">Loading menu...</div>
              ) : filteredMenu.length === 0 ? (
                <div className="admin-empty">No menu items found.</div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Item Name</th>
                      <th>Price (₹)</th>
                      <th>Description</th>
                      <th>Base</th>
                      <th>Available</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMenu.map((item) => {
                      const draft = editingDrafts[item._id] || item;
                      return (
                        <tr key={item._id}>
                          <td data-label="Category">
                            <CustomSelect
                              value={draft.category}
                              options={CATEGORIES.map((c) => ({
                                value: c,
                                label: c.charAt(0).toUpperCase() + c.slice(1),
                              }))}
                              onChange={(val) =>
                                handleDraftChange(item._id, "category", val)
                              }
                            />
                          </td>
                          <td data-label="Item Name">
                            <input
                              type="text"
                              className="inline-input"
                              value={draft.name}
                              onChange={(e) =>
                                handleDraftChange(item._id, "name", e.target.value)
                              }
                            />
                          </td>
                          <td data-label="Price (₹)">
                            <div className="price-stepper">
                              <button
                                type="button"
                                className="price-step-btn"
                                onClick={() =>
                                  handleDraftChange(
                                    item._id,
                                    "price",
                                    Math.max(0, Number(draft.price || 0) - 1)
                                  )
                                }
                                title="Decrease price"
                              >
                                −
                              </button>
                              <input
                                type="number"
                                min="0"
                                className="inline-input price-input"
                                value={draft.price}
                                onChange={(e) =>
                                  handleDraftChange(item._id, "price", e.target.value)
                                }
                              />
                              <button
                                type="button"
                                className="price-step-btn"
                                onClick={() =>
                                  handleDraftChange(
                                    item._id,
                                    "price",
                                    Number(draft.price || 0) + 1
                                  )
                                }
                                title="Increase price"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td data-label="Description">
                            <input
                              type="text"
                              className="inline-input"
                              value={draft.desc}
                              onChange={(e) =>
                                handleDraftChange(item._id, "desc", e.target.value)
                              }
                            />
                          </td>
                          <td data-label="Base Meal" className="td-center td-toggle">
                            <input
                              type="checkbox"
                              checked={Boolean(draft.isBase)}
                              onChange={(e) =>
                                handleDraftChange(item._id, "isBase", e.target.checked)
                              }
                            />
                          </td>
                          <td data-label="Available" className="td-center td-toggle">
                            <input
                              type="checkbox"
                              checked={Boolean(draft.isAvailable)}
                              onChange={(e) =>
                                handleDraftChange(item._id, "isAvailable", e.target.checked)
                              }
                            />
                          </td>
                          <td data-label="Actions" className="td-action">
                            <div className="row-actions">
                              <button
                                className="icon-save-btn"
                                onClick={() => handleSaveMenuItem(item._id)}
                                disabled={savingId === item._id}
                                title="Save changes"
                              >
                                <FaSave />
                              </button>
                              <button
                                className="icon-danger-btn"
                                onClick={() => handleDeleteMenuItem(item._id)}
                                title="Delete item"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
