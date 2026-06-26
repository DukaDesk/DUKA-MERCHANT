const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
const USE_MOCK = true;

function delay(ms = 600) {
  return new Promise(r => setTimeout(r, ms));
}

function mockError(rate = 0.05) {
  if (Math.random() < rate) throw new Error("Network error");
}

/* ───── Helpers ───── */
let _token = localStorage.getItem("dukadesk_token") || null;
export function setToken(t) { _token = t; if (t) localStorage.setItem("dukadesk_token", t); else localStorage.removeItem("dukadesk_token"); }

/* ===================================================================
   AUTH
   =================================================================== */

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Response: { token, merchant: { id, name, business, email, avatar } }
 */
export async function login(body) {
  if (USE_MOCK) { await delay(800); mockError(); return { token: "mock_token_" + Date.now(), merchant: { id: 1, name: "Ada Eze", business: "Mama's Kitchen", email: body.email, avatar: "AE" } }; }
  const res = await fetch(`${BASE_URL}/api/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

/**
 * POST /api/auth/signup
 * Body: { fullName, businessName, email, phone, password }
 * Response: { token, merchant: { id, name, business, email, avatar } }
 */
export async function signup(body) {
  if (USE_MOCK) { await delay(1000); mockError(); return { token: "mock_token_" + Date.now(), merchant: { id: 1, name: body.fullName, business: body.businessName, email: body.email, avatar: body.fullName.split(" ").map(n => n[0]).join("") } }; }
  const res = await fetch(`${BASE_URL}/api/auth/signup`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error("Signup failed");
  return res.json();
}

/**
 * POST /api/auth/forgot-password
 * Body: { email }
 * Response: { message }
 */
export async function forgotPassword(body) {
  if (USE_MOCK) { await delay(800); mockError(); return { message: "Password reset link sent to " + body.email }; }
  const res = await fetch(`${BASE_URL}/api/auth/forgot-password`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error("Request failed");
  return res.json();
}

/* ===================================================================
   DASHBOARD
   =================================================================== */

/**
 * GET /api/dashboard/stats
 * Response: { customers, revenue, unreadMessages, avgRating, reviewsCount }
 */
export async function getDashboardStats() {
  if (USE_MOCK) { await delay(300); return { customers: 1204, revenue: 48200, unreadMessages: 7, avgRating: 4.8, reviewsCount: 234 }; }
  const res = await fetch(`${BASE_URL}/api/dashboard/stats`, { headers: { Authorization: `Bearer ${_token}` } });
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

/**
 * GET /api/dashboard/revenue
 * Response: [{ week: string, revenue: number }]
 */
export async function getRevenue() {
  if (USE_MOCK) { await delay(300); return [{ week: "W1", revenue: 12000 }, { week: "W2", revenue: 28000 }, { week: "W3", revenue: 22000 }, { week: "W4", revenue: 48200 }]; }
  return (await fetch(`${BASE_URL}/api/dashboard/revenue`, { headers: { Authorization: `Bearer ${_token}` } })).json();
}

/**
 * GET /api/dashboard/activity
 * Response: [{ icon, title, sub, time, color }]
 */
export async function getActivity() {
  if (USE_MOCK) { await delay(300); return [{ icon: "🛒", title: "New order from Tunde Adeyemi", sub: "₦3,500 · 2 items", time: "10 min ago", color: "#F4A026" }, { icon: "💬", title: "New message from Chika Obi", sub: "Hi, is delivery available?", time: "25 min ago", color: "#7C3AED" }, { icon: "⭐", title: "New 5-star review", sub: "Amazing food, will order again!", time: "1 hr ago", color: "#2ECC71" }, { icon: "🛒", title: "New order from Fatima Bello", sub: "₦5,200 · 3 items", time: "3 hrs ago", color: "#F4A026" }, { icon: "📱", title: "App viewed 43 times today", sub: "Via QR scan", time: "Today", color: "#1A1A2E" }]; }
  return (await fetch(`${BASE_URL}/api/dashboard/activity`, { headers: { Authorization: `Bearer ${_token}` } })).json();
}

/* ===================================================================
   PRODUCTS
   =================================================================== */

let _productId = 7;

/**
 * GET /api/products
 * Response: [{ id, name, cat, price, oldPrice, stock, status, img }]
 */
export async function getProducts() {
  if (USE_MOCK) { await delay(300); return [{ id: 1, name: "Jollof Rice & Chicken", cat: "Mains", price: 2500, oldPrice: null, stock: 34, status: "In Stock", img: "🍛" }, { id: 2, name: "Peppered Gizzard", cat: "Sides", price: 1800, oldPrice: 2200, stock: 12, status: "In Stock", img: "🍗" }, { id: 3, name: "Grilled Tilapia", cat: "Mains", price: 4500, oldPrice: null, stock: 4, status: "Low Stock", img: "🐟" }, { id: 4, name: "Egusi Soup", cat: "Mains", price: 3200, oldPrice: null, stock: 0, status: "Out of Stock", img: "🥣" }, { id: 5, name: "Zobo Drink", cat: "Drinks", price: 500, oldPrice: null, stock: 50, status: "In Stock", img: "🥤" }, { id: 6, name: "Puff Puff (10 pcs)", cat: "Snacks", price: 800, oldPrice: 1000, stock: 20, status: "In Stock", img: "🍩" }]; }
  return (await fetch(`${BASE_URL}/api/products`, { headers: { Authorization: `Bearer ${_token}` } })).json();
}

/**
 * POST /api/products
 * Body: { name, cat, price, stock, status, img }
 * Response: { id, ...product }
 */
export async function createProduct(body) {
  if (USE_MOCK) { await delay(400); mockError(); return { id: _productId++, ...body, price: Number(body.price), stock: Number(body.stock), oldPrice: null }; }
  const res = await fetch(`${BASE_URL}/api/products`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${_token}` }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error("Failed to create product");
  return res.json();
}

/**
 * PUT /api/products/:id
 * Body: { name?, cat?, price?, stock?, status?, img? }
 * Response: { id, ...updated }
 */
export async function updateProduct(id, body) {
  if (USE_MOCK) { await delay(400); return { id, ...body }; }
  const res = await fetch(`${BASE_URL}/api/products/${id}`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${_token}` }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
}

/**
 * DELETE /api/products/:id
 * Response: { message }
 */
export async function deleteProduct(id) {
  if (USE_MOCK) { await delay(300); return { message: "Product deleted" }; }
  const res = await fetch(`${BASE_URL}/api/products/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${_token}` } });
  if (!res.ok) throw new Error("Failed to delete product");
  return res.json();
}

/* ===================================================================
   ORDERS
   =================================================================== */

/**
 * GET /api/orders
 * Query: ?status=...&page=1&limit=20
 * Response: [{ id, customer, items, total, payment, status, date, address }]
 */
export async function getOrders() {
  if (USE_MOCK) { await delay(300); return [{ id: "DD-2041", customer: "Tunde Adeyemi", items: "Jollof Rice ×2", total: 7000, payment: "Paystack", status: "Pending", date: "Jun 22, 2:14 PM", address: "12 Admiralty Way, Lekki" }, { id: "DD-2040", customer: "Chika Obi", items: "Grilled Tilapia ×1", total: 4500, payment: "Paystack", status: "Processing", date: "Jun 22, 1:05 PM", address: "5 Allen Ave, Ikeja" }, { id: "DD-2039", customer: "Fatima Bello", items: "Peppered Gizzard ×3, Zobo ×2", total: 6400, payment: "Bank Transfer", status: "Completed", date: "Jun 22, 11:30 AM", address: "7 Aba Road, PH" }, { id: "DD-2038", customer: "Ibrahim Musa", items: "Egusi Soup ×1", total: 3200, payment: "Paystack", status: "Cancelled", date: "Jun 22, 9:00 AM", address: "Garki, Abuja" }, { id: "DD-2037", customer: "Grace Eze", items: "Puff Puff ×5, Zobo ×1", total: 4500, payment: "Paystack", status: "Completed", date: "Jun 21, 7:45 PM", address: "Trans Amadi, PH" }]; }
  return (await fetch(`${BASE_URL}/api/orders`, { headers: { Authorization: `Bearer ${_token}` } })).json();
}

/**
 * PUT /api/orders/:id/status
 * Body: { status }
 * Response: { id, status }
 */
export async function updateOrderStatus(id, status) {
  if (USE_MOCK) { await delay(400); return { id, status }; }
  const res = await fetch(`${BASE_URL}/api/orders/${id}/status`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${_token}` }, body: JSON.stringify({ status }) });
  if (!res.ok) throw new Error("Failed to update order");
  return res.json();
}

/* ===================================================================
   MESSAGES
   =================================================================== */

/**
 * GET /api/messages/conversations
 * Response: [{ id, name, last, time, unread, orders, spent }]
 */
export async function getConversations() {
  if (USE_MOCK) { await delay(300); return [{ id: 1, name: "Chika Obi", last: "Is peppered gizzard still available?", time: "10:24 AM", unread: 2, orders: 5, spent: 12500 }, { id: 2, name: "Tunde Adeyemi", last: "Thanks! Order received.", time: "9:05 AM", unread: 0, orders: 3, spent: 8200 }, { id: 3, name: "Fatima Bello", last: "Can I get extra sauce?", time: "Yesterday", unread: 1, orders: 7, spent: 21000 }, { id: 4, name: "Ibrahim Musa", last: "What time do you close?", time: "Yesterday", unread: 0, orders: 1, spent: 3200 }]; }
  return (await fetch(`${BASE_URL}/api/messages/conversations`, { headers: { Authorization: `Bearer ${_token}` } })).json();
}

/**
 * GET /api/messages/:conversationId
 * Response: [{ from, text, time }]
 */
export async function getMessages(conversationId) {
  const db = { 1: [{ from: "customer", text: "Hi! Is peppered gizzard still available today?", time: "10:22 AM" }, { from: "merchant", text: "Yes we do! 😊 Would you like to add it to an order?", time: "10:23 AM" }, { from: "customer", text: "Yes please, with extra sauce", time: "10:24 AM" }], 2: [{ from: "merchant", text: "Hi Tunde! Your order #DD-2041 has been confirmed.", time: "9:00 AM" }, { from: "customer", text: "Thanks! Order received.", time: "9:05 AM" }], 3: [{ from: "customer", text: "Can I get extra sauce with my jollof?", time: "Yesterday" }, { from: "merchant", text: "Of course! Extra sauce noted 🍛", time: "Yesterday" }, { from: "customer", text: "Can I get extra sauce?", time: "Yesterday" }], 4: [{ from: "customer", text: "What time do you close today?", time: "Yesterday" }] };
  if (USE_MOCK) { await delay(200); return db[conversationId] || []; }
  return (await fetch(`${BASE_URL}/api/messages/${conversationId}`, { headers: { Authorization: `Bearer ${_token}` } })).json();
}

/**
 * POST /api/messages/:conversationId
 * Body: { text }
 * Response: { from, text, time }
 */
export async function sendMessage(conversationId, text) {
  if (USE_MOCK) { await delay(200); return { from: "merchant", text, time: "Just now" }; }
  const res = await fetch(`${BASE_URL}/api/messages/${conversationId}`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${_token}` }, body: JSON.stringify({ text }) });
  if (!res.ok) throw new Error("Failed to send message");
  return res.json();
}

/* ===================================================================
   INTEGRATIONS
   =================================================================== */

/**
 * GET /api/integrations
 * Response: [{ cat, items: [{ icon, name, desc, badge, active, stat?, locked? }] }]
 */
export async function getIntegrations() {
  if (USE_MOCK) { await delay(300); return [{ cat: "Payments", items: [{ icon: "💳", name: "Paystack", desc: "Cards, bank transfer & USSD", badge: "Popular", active: true, stat: "₦48,200 processed this month" }, { icon: "💳", name: "Flutterwave", desc: "Pan-African payment gateway", badge: "Popular", active: false }, { icon: "🏦", name: "Bank Transfer", desc: "Manual bank details", badge: "Free", active: false }] }, { cat: "Commerce", items: [{ icon: "🛒", name: "Product Cart", desc: "Full cart & checkout flow", badge: "Popular", active: true, stat: "24 products · 124 orders" }, { icon: "🏷️", name: "Discount Codes", desc: "Create promo codes", badge: "Free", active: false }, { icon: "📦", name: "Order Tracking", desc: "Real-time order status", badge: "Popular", active: false }, { icon: "❤️", name: "Wishlist", desc: "Let customers save products", badge: "Free", active: false }] }, { cat: "Booking", items: [{ icon: "📅", name: "Appointment Calendar", desc: "Self-booking for customers", badge: "Popular", active: false }, { icon: "⏰", name: "Booking Reminders", desc: "SMS/push reminders", badge: "Popular", active: false }, { icon: "📋", name: "Waitlist", desc: "Queue for full time slots", badge: "Free", active: false }] }, { cat: "Loyalty & Engagement", items: [{ icon: "⭐", name: "Loyalty Points", desc: "Earn & redeem rewards", badge: "Popular", active: false }, { icon: "🔔", name: "Push Notifications", desc: "Broadcast offers to users", badge: "Popular", active: false }, { icon: "👥", name: "Referral Program", desc: "Refer friends, earn rewards", badge: "Premium", active: false, locked: true }] }, { cat: "Communication", items: [{ icon: "💬", name: "In-App Messaging", desc: "Live chat with customers", badge: "Popular", active: true, stat: "7 unread conversations" }, { icon: "📱", name: "WhatsApp Link", desc: "Quick WhatsApp contact", badge: "Free", active: false }, { icon: "📧", name: "Email Capture", desc: "Build your email list", badge: "Free", active: false }] }, { cat: "Content & Media", items: [{ icon: "🖼️", name: "Photo Gallery", desc: "Image showcase", badge: "Free", active: false }, { icon: "📄", name: "PDF Menu", desc: "Upload and display a PDF menu", badge: "Free", active: false }, { icon: "🔗", name: "Social Media Links", desc: "Link Instagram, Facebook, TikTok", badge: "Free", active: false }] }]; }
  return (await fetch(`${BASE_URL}/api/integrations`, { headers: { Authorization: `Bearer ${_token}` } })).json();
}

/**
 * PUT /api/integrations/:name/toggle
 * Response: { name, active }
 */
export async function toggleIntegration(name) {
  if (USE_MOCK) { await delay(300); return { name, active: true }; }
  const res = await fetch(`${BASE_URL}/api/integrations/${encodeURIComponent(name)}/toggle`, { method: "PUT", headers: { Authorization: `Bearer ${_token}` } });
  if (!res.ok) throw new Error("Failed to toggle integration");
  return res.json();
}

/* ===================================================================
   BILLING
   =================================================================== */

/**
 * GET /api/billing/current
 * Response: { plan: string, label: string, renews: string, features: string[] }
 */
export async function getCurrentPlan() {
  if (USE_MOCK) { await delay(200); return { plan: "Starter Plan", label: "₦0 / month during beta", renews: "N/A (Beta)", features: ["1 App", "Unlimited QR scans", "Basic integrations", "Up to 500 customers"] }; }
  return (await fetch(`${BASE_URL}/api/billing/current`, { headers: { Authorization: `Bearer ${_token}` } })).json();
}

/**
 * GET /api/billing/plans
 * Response: [{ name, price, label, color, features: object, current }]
 */
export async function getPlans() {
  if (USE_MOCK) { await delay(200); return [{ name: "Starter", price: 0, label: "Free (Beta)", color: "#6B7280", features: { "Apps": "1", "Products": "20", "QR Scans": "Unlimited", "Customers": "500", "Integrations": "Basic", "Analytics": "Basic", "Team Members": "1", "Priority Support": false, "Custom Domain": false }, current: true }, { name: "Growth", price: 9999, label: "₦9,999/mo", color: "#F4A026", features: { "Apps": "3", "Products": "Unlimited", "QR Scans": "Unlimited", "Customers": "Unlimited", "Integrations": "All", "Analytics": "Advanced", "Team Members": "3", "Priority Support": false, "Custom Domain": false }, current: false }, { name: "Business", price: 24999, label: "₦24,999/mo", color: "#1A1A2E", features: { "Apps": "10", "Products": "Unlimited", "QR Scans": "Unlimited", "Customers": "Unlimited", "Integrations": "All + Premium", "Analytics": "Advanced + Export", "Team Members": "10", "Priority Support": true, "Custom Domain": true }, current: false }]; }
  return (await fetch(`${BASE_URL}/api/billing/plans`, { headers: { Authorization: `Bearer ${_token}` } })).json();
}

/**
 * GET /api/billing/history
 * Response: [{ date, desc, amount, status }]
 */
export async function getBillingHistory() {
  if (USE_MOCK) { await delay(200); return [{ date: "Jun 1, 2025", desc: "Starter Plan (Beta)", amount: "₦0", status: "Paid" }, { date: "May 1, 2025", desc: "Starter Plan (Beta)", amount: "₦0", status: "Paid" }]; }
  return (await fetch(`${BASE_URL}/api/billing/history`, { headers: { Authorization: `Bearer ${_token}` } })).json();
}

/**
 * POST /api/billing/upgrade
 * Body: { planName, cardNumber, expiry, cvv }
 * Response: { message, plan }
 */
export async function upgradePlan(body) {
  if (USE_MOCK) { await delay(1500); mockError(0.1); return { message: `Upgraded to ${body.planName} plan!`, plan: body.planName }; }
  const res = await fetch(`${BASE_URL}/api/billing/upgrade`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${_token}` }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error("Upgrade failed");
  return res.json();
}

/* ===================================================================
   ANALYTICS
   =================================================================== */

/**
 * GET /api/analytics/revenue
 * Response: [{ w, v }]
 */
export async function getRevenueData() {
  if (USE_MOCK) { await delay(300); return [{ w: "W1", v: 12000 }, { w: "W2", v: 28000 }, { w: "W3", v: 22000 }, { w: "W4", v: 48200 }]; }
  return (await fetch(`${BASE_URL}/api/analytics/revenue`, { headers: { Authorization: `Bearer ${_token}` } })).json();
}

/**
 * GET /api/analytics/orders
 * Response: [{ name, value }]
 */
export async function getOrderStats() {
  if (USE_MOCK) { await delay(300); return [{ name: "Completed", value: 89 }, { name: "Pending", value: 25 }, { name: "Cancelled", value: 10 }]; }
  return (await fetch(`${BASE_URL}/api/analytics/orders`, { headers: { Authorization: `Bearer ${_token}` } })).json();
}

/**
 * GET /api/analytics/scans
 * Response: [{ day, scans }]
 */
export async function getScanData() {
  if (USE_MOCK) { await delay(300); return [{ day: "Mon", scans: 42 }, { day: "Tue", scans: 67 }, { day: "Wed", scans: 55 }, { day: "Thu", scans: 80 }, { day: "Fri", scans: 93 }, { day: "Sat", scans: 110 }, { day: "Sun", scans: 78 }]; }
  return (await fetch(`${BASE_URL}/api/analytics/scans`, { headers: { Authorization: `Bearer ${_token}` } })).json();
}

/**
 * GET /api/analytics/top-products
 * Response: [{ name, views, orders, revenue, trend }]
 */
export async function getTopProducts() {
  if (USE_MOCK) { await delay(300); return [{ name: "Jollof Rice", views: 340, orders: 89, revenue: 222500, trend: "↑" }, { name: "Grilled Tilapia", views: 210, orders: 45, revenue: 202500, trend: "↑" }, { name: "Peppered Gizzard", views: 180, orders: 60, revenue: 108000, trend: "↓" }, { name: "Egusi Soup", views: 120, orders: 30, revenue: 96000, trend: "→" }, { name: "Zobo Drink", views: 95, orders: 70, revenue: 35000, trend: "↑" }]; }
  return (await fetch(`${BASE_URL}/api/analytics/top-products`, { headers: { Authorization: `Bearer ${_token}` } })).json();
}

/**
 * GET /api/analytics/customers
 * Response: [{ name, value }]
 */
export async function getCustomerSplit() {
  if (USE_MOCK) { await delay(200); return [{ name: "New", value: 34 }, { name: "Returning", value: 66 }]; }
  return (await fetch(`${BASE_URL}/api/analytics/customers`, { headers: { Authorization: `Bearer ${_token}` } })).json();
}


