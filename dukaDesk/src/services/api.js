import {
  MOCK_LOGIN, MOCK_SIGNUP, MOCK_FORGOT_PASSWORD,
  DASHBOARD_STATS_BY_CATEGORY, DASHBOARD_REVENUE_BY_CATEGORY, DASHBOARD_ACTIVITY_BY_CATEGORY,
  MOCK_PRODUCTS, MOCK_ORDERS, MOCK_CONVERSATIONS, MOCK_MESSAGES_BY_CONVERSATION,
  MOCK_INTEGRATIONS, MOCK_CURRENT_PLAN, MOCK_PLANS, MOCK_BILLING_HISTORY,
  ANALYTICS_REVENUE, ANALYTICS_ORDER_STATS, ANALYTICS_SCAN_DATA, ANALYTICS_TOP_PRODUCTS, ANALYTICS_CUSTOMER_SPLIT,
} from "./mockData.js";

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

let _setupData = (() => { try { return JSON.parse(localStorage.getItem("dukadesk_setup")); } catch { return null; } })();
export function setSetupData(data) { _setupData = data; try { localStorage.setItem("dukadesk_setup", JSON.stringify(data)); } catch { /* localStorage unavailable */ } }
export function getSetupData() { return _setupData; }

/* ===================================================================
   AUTH
   =================================================================== */

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Response: { token, merchant: { id, name, business, email, avatar } }
 */
export async function login(body) {
  if (USE_MOCK) { await delay(800); mockError(); return MOCK_LOGIN(body.email); }
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
  if (USE_MOCK) { await delay(1000); mockError(); return MOCK_SIGNUP(body); }
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
  if (USE_MOCK) { await delay(800); mockError(); return MOCK_FORGOT_PASSWORD(body.email); }
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
  if (USE_MOCK) { await delay(300); const cat = _setupData?.category || "Restaurant"; return DASHBOARD_STATS_BY_CATEGORY[cat] || DASHBOARD_STATS_BY_CATEGORY.Restaurant; }
  const res = await fetch(`${BASE_URL}/api/dashboard/stats`, { headers: { Authorization: `Bearer ${_token}` } });
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

/**
 * GET /api/dashboard/revenue
 * Response: [{ week: string, revenue: number }]
 */
export async function getRevenue() {
  if (USE_MOCK) { await delay(300); const cat = _setupData?.category || "Restaurant"; return DASHBOARD_REVENUE_BY_CATEGORY[cat] || DASHBOARD_REVENUE_BY_CATEGORY.Restaurant; }
  return (await fetch(`${BASE_URL}/api/dashboard/revenue`, { headers: { Authorization: `Bearer ${_token}` } })).json();
}

/**
 * GET /api/dashboard/activity
 * Response: [{ icon, title, sub, time, color }]
 */
export async function getActivity() {
  if (USE_MOCK) { await delay(300); const cat = _setupData?.category || "Restaurant"; return DASHBOARD_ACTIVITY_BY_CATEGORY[cat] || DASHBOARD_ACTIVITY_BY_CATEGORY.Restaurant; }
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
  if (USE_MOCK) { await delay(300); return [...MOCK_PRODUCTS]; }
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
  if (USE_MOCK) { await delay(300); return [...MOCK_ORDERS]; }
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
  if (USE_MOCK) { await delay(300); return [...MOCK_CONVERSATIONS]; }
  return (await fetch(`${BASE_URL}/api/messages/conversations`, { headers: { Authorization: `Bearer ${_token}` } })).json();
}

/**
 * GET /api/messages/:conversationId
 * Response: [{ from, text, time }]
 */
export async function getMessages(conversationId) {
  if (USE_MOCK) { await delay(200); return MOCK_MESSAGES_BY_CONVERSATION[conversationId] || []; }
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
  if (USE_MOCK) { await delay(300); return JSON.parse(JSON.stringify(MOCK_INTEGRATIONS)); }
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
  if (USE_MOCK) { await delay(200); return { ...MOCK_CURRENT_PLAN }; }
  return (await fetch(`${BASE_URL}/api/billing/current`, { headers: { Authorization: `Bearer ${_token}` } })).json();
}

/**
 * GET /api/billing/plans
 * Response: [{ name, price, label, color, features: object, current }]
 */
export async function getPlans() {
  if (USE_MOCK) { await delay(200); return MOCK_PLANS.map(p => ({ ...p })); }
  return (await fetch(`${BASE_URL}/api/billing/plans`, { headers: { Authorization: `Bearer ${_token}` } })).json();
}

/**
 * GET /api/billing/history
 * Response: [{ date, desc, amount, status }]
 */
export async function getBillingHistory() {
  if (USE_MOCK) { await delay(200); return MOCK_BILLING_HISTORY.map(h => ({ ...h })); }
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
  if (USE_MOCK) { await delay(300); return ANALYTICS_REVENUE.map(d => ({ ...d })); }
  return (await fetch(`${BASE_URL}/api/analytics/revenue`, { headers: { Authorization: `Bearer ${_token}` } })).json();
}

/**
 * GET /api/analytics/orders
 * Response: [{ name, value }]
 */
export async function getOrderStats() {
  if (USE_MOCK) { await delay(300); return ANALYTICS_ORDER_STATS.map(d => ({ ...d })); }
  return (await fetch(`${BASE_URL}/api/analytics/orders`, { headers: { Authorization: `Bearer ${_token}` } })).json();
}

/**
 * GET /api/analytics/scans
 * Response: [{ day, scans }]
 */
export async function getScanData() {
  if (USE_MOCK) { await delay(300); return ANALYTICS_SCAN_DATA.map(d => ({ ...d })); }
  return (await fetch(`${BASE_URL}/api/analytics/scans`, { headers: { Authorization: `Bearer ${_token}` } })).json();
}

/**
 * GET /api/analytics/top-products
 * Response: [{ name, views, orders, revenue, trend }]
 */
export async function getTopProducts() {
  if (USE_MOCK) { await delay(300); return ANALYTICS_TOP_PRODUCTS.map(d => ({ ...d })); }
  return (await fetch(`${BASE_URL}/api/analytics/top-products`, { headers: { Authorization: `Bearer ${_token}` } })).json();
}

/**
 * GET /api/analytics/customers
 * Response: [{ name, value }]
 */
export async function getCustomerSplit() {
  if (USE_MOCK) { await delay(200); return ANALYTICS_CUSTOMER_SPLIT.map(d => ({ ...d })); }
  return (await fetch(`${BASE_URL}/api/analytics/customers`, { headers: { Authorization: `Bearer ${_token}` } })).json();
}


