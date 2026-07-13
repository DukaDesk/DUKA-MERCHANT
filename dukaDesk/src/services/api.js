import { DASHBOARD_STATS_BY_CATEGORY, DASHBOARD_REVENUE_BY_CATEGORY, DASHBOARD_ACTIVITY_BY_CATEGORY, MOCK_PRODUCTS, MOCK_ORDERS, MOCK_CONVERSATIONS, MOCK_INTEGRATIONS, MOCK_CURRENT_PLAN, MOCK_PLANS, MOCK_BILLING_HISTORY, ANALYTICS_REVENUE, ANALYTICS_ORDER_STATS, ANALYTICS_SCAN_DATA, ANALYTICS_TOP_PRODUCTS, ANALYTICS_CUSTOMER_SPLIT } from "./mockData";

function delay(ms = 200) {
  return new Promise(r => setTimeout(r, ms));
}

/* ───── Token ───── */
export function setToken(t) {
  if (t) localStorage.setItem("dukadesk_token", t);
  else localStorage.removeItem("dukadesk_token");
}

/* ───── Setup / App Config ───── */
export function setSetupData(data) { try { localStorage.setItem("dukadesk_setup", JSON.stringify(data)); } catch { /* ignore */ } }
export function getSetupData() { try { return JSON.parse(localStorage.getItem("dukadesk_setup")); } catch { return null; } }

/* ───── Merchant ───── */
function getMerchant() {
  try { return JSON.parse(localStorage.getItem("dd_merchant")); } catch { return null; }
}
function setMerchant(m) {
  try { localStorage.setItem("dd_merchant", JSON.stringify(m)); } catch {}
}

/* ───── Deployed App ───── */
function getDeployedApp() {
  try { return JSON.parse(localStorage.getItem("dd_deployed_app")); } catch { /* ignore */ return null; }
}
function setDeployedApp(app) {
  try { localStorage.setItem("dd_deployed_app", JSON.stringify(app)); } catch { /* ignore */ }
}

/* ───── Merchant Products ───── */
function getMerchantProducts() {
  try { return JSON.parse(localStorage.getItem("dd_products")) || []; } catch { /* ignore */ return []; }
}
function setMerchantProducts(products) {
  try { localStorage.setItem("dd_products", JSON.stringify(products)); } catch { /* ignore */ }
}

/* ═══════════════════════════════════════════════════════════════════
   AUTH
   ═══════════════════════════════════════════════════════════════════ */

export async function login(body) {
  await delay();
  const merchants = (() => { try { return JSON.parse(localStorage.getItem("dd_merchants")) || []; } catch { return []; } })();
  const m = merchants.find(x => x.email === body.email);
  if (!m || m.password !== body.password) throw new Error("Invalid email or password");
  const token = "tok_" + Date.now() + "_" + Math.random().toString(36).slice(2);
  const { password: _, ...safe } = m;
  localStorage.removeItem("dukadesk_setup");
  setToken(token);
  setMerchant(safe);
  return { token, merchant: safe };
}

export async function signup(body) {
  await delay();
  const merchants = (() => { try { return JSON.parse(localStorage.getItem("dd_merchants")) || []; } catch { return []; } })();
  if (merchants.find(x => x.email === body.email)) throw new Error("An account with this email already exists");
  const merchant = {
    id: "m_" + Date.now(),
    name: body.fullName,
    business: body.businessName,
    email: body.email,
    phone: body.phone || "",
    password: body.password,
    avatar: body.fullName.split(" ").map(n => n[0]).join("").toUpperCase(),
    createdAt: new Date().toISOString(),
  };
  merchants.push(merchant);
  localStorage.setItem("dd_merchants", JSON.stringify(merchants));
  const token = "tok_" + Date.now() + "_" + Math.random().toString(36).slice(2);
  const { password: _, ...safe } = merchant;
  setToken(token);
  setMerchant(safe);
  return { token, merchant: safe };
}

export async function forgotPassword(body) {
  await delay();
  return { message: "Password reset link sent to " + body.email };
}

/* ═══════════════════════════════════════════════════════════════════
   APP DEPLOYMENT
   ═══════════════════════════════════════════════════════════════════ */

import { generateShopTemplate } from "./TemplateGenerator";

export async function deployApp(appData) {
  await delay();
  const merchant = getMerchant();
  const slug = (appData.appName || "").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  
  // Generate unique template configuration for this shop
  const templateConfig = generateShopTemplate({
    category: appData.category || "Restaurant",
    template: appData.template || "Classic Dine",
    appName: appData.appName,
    tagline: appData.tagline || "",
    color: appData.color || "#1B4332",
    logo: appData.logo || null,
    businessName: merchant?.business || appData.appName,
    bizDesc: appData.bizDesc || "",
    phone: appData.phone || "",
    address: appData.address || "",
    hours: appData.hours || [],
    selectedIntegrations: appData.selectedIntegrations || [],
  });

  const deployed = {
    id: "app_" + Date.now(),
    merchantId: merchant?.id || "unknown",
    businessName: merchant?.business || appData.appName,
    category: appData.category || "Restaurant",
    template: appData.template || "Classic Dine",
    appName: appData.appName,
    tagline: appData.tagline || "",
    color: appData.color || "#1B4332",
    logo: appData.logo || null,
    selectedIntegrations: appData.selectedIntegrations || [],
    bizDesc: appData.bizDesc || "",
    phone: appData.phone || "",
    address: appData.address || "",
    hours: appData.hours || [],
    slug,
    storeUrl: `dukadesk.app/${slug}`,
    status: "live",
    templateConfig, // Full customizable template per shop
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  setDeployedApp(deployed);
  return { app: deployed, message: "App deployed successfully! 🚀" };
}

export async function updateApp(appData) {
  await delay();
  const deployed = getDeployedApp();
  if (!deployed) throw new Error("No app deployed");
  
  // Regenerate template config if category/template/color changed
  let templateConfig = deployed.templateConfig;
  if (appData.category || appData.template || appData.color || appData.appName) {
    templateConfig = generateShopTemplate({
      category: appData.category || deployed.category,
      template: appData.template || deployed.template,
      appName: appData.appName || deployed.appName,
      tagline: appData.tagline !== undefined ? appData.tagline : deployed.tagline,
      color: appData.color || deployed.color,
      logo: appData.logo !== undefined ? appData.logo : deployed.logo,
      businessName: deployed.businessName,
      bizDesc: appData.bizDesc !== undefined ? appData.bizDesc : deployed.bizDesc,
      phone: appData.phone !== undefined ? appData.phone : deployed.phone,
      address: appData.address !== undefined ? appData.address : deployed.address,
      hours: appData.hours !== undefined ? appData.hours : deployed.hours,
      selectedIntegrations: appData.selectedIntegrations || deployed.selectedIntegrations,
    });
  }

  const updated = {
    ...deployed,
    ...appData,
    templateConfig,
    updatedAt: new Date().toISOString(),
  };
  setDeployedApp(updated);
  return { app: updated, message: "App updated successfully! 🚀" };
}

export async function getMyApp() {
  await delay(100);
  return getDeployedApp();
}

export async function getPublicApp(slug) {
  await delay(100);
  const app = getDeployedApp();
  if (!app || app.slug !== slug) throw new Error("App not found");
  const products = getMerchantProducts();
  return { app, products };
}

/* ═══════════════════════════════════════════════════════════════════
   DASHBOARD
   ═══════════════════════════════════════════════════════════════════ */

const defaultStats = DASHBOARD_STATS_BY_CATEGORY?.Restaurant || { customers: 1246, revenue: 48200, unreadMessages: 3, avgRating: 4.8, reviewsCount: 234 };

export async function getDashboardStats() {
  await delay();
  const products = getMerchantProducts();
  const app = getDeployedApp();
  return {
    customers: defaultStats.customers,
    revenue: defaultStats.revenue,
    unreadMessages: defaultStats.unreadMessages,
    avgRating: defaultStats.avgRating,
    reviewsCount: defaultStats.reviewsCount,
    appStatus: app ? "live" : "not_deployed",
  };
}

const defaultRevenue = DASHBOARD_REVENUE_BY_CATEGORY?.Restaurant || [{ week: "W1", revenue: 12000 }, { week: "W2", revenue: 28000 }, { week: "W3", revenue: 22000 }, { week: "W4", revenue: 48200 }];

export async function getRevenue() {
  await delay();
  return defaultRevenue;
}

const defaultActivity = DASHBOARD_ACTIVITY_BY_CATEGORY?.Restaurant || [{ icon: "🛒", title: "New order received", sub: "₦3,500 · 2 items", time: "10 min ago", color: "#F4A026" }];

export async function getActivity() {
  await delay();
  return defaultActivity;
}

/* ═══════════════════════════════════════════════════════════════════
   PRODUCTS
   ═══════════════════════════════════════════════════════════════════ */

export async function getProducts() {
  await delay();
  return getMerchantProducts();
}

export async function createProduct(body) {
  await delay();
  const products = getMerchantProducts();
  const product = {
    id: "p_" + Date.now(),
    merchantId: getMerchant()?.id,
    name: body.name,
    cat: body.cat || "",
    price: Number(body.price),
    oldPrice: body.oldPrice || null,
    stock: Number(body.stock) || 0,
    status: body.status || "In Stock",
    img: body.img || "🍛",
    createdAt: new Date().toISOString(),
  };
  products.push(product);
  setMerchantProducts(products);
  return product;
}

export async function updateProduct(id, body) {
  await delay();
  const products = getMerchantProducts();
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) throw new Error("Product not found");
  products[idx] = { ...products[idx], ...body };
  setMerchantProducts(products);
  return products[idx];
}

export async function deleteProduct(id) {
  await delay();
  setMerchantProducts(getMerchantProducts().filter(p => p.id !== id));
  return { message: "Product deleted" };
}

/* ═══════════════════════════════════════════════════════════════════
   ORDERS
   ═══════════════════════════════════════════════════════════════════ */

export async function getOrders() {
  await delay();
  return MOCK_ORDERS;
}

export async function updateOrderStatus(id, status) {
  await delay();
  return { id, status, message: "Status updated" };
}

/* ═══════════════════════════════════════════════════════════════════
   MESSAGES
   ═══════════════════════════════════════════════════════════════════ */

export async function getConversations() {
  await delay();
  return MOCK_CONVERSATIONS;
}

export async function getMessages(conversationId) {
  await delay();
  return [
    { id: "msg_1", conversationId, from: "customer", text: "Hi! Is this item available?", time: "10:00 AM" },
    { id: "msg_2", conversationId, from: "merchant", text: "Yes, it's in stock!", time: "10:05 AM" },
  ];
}

export async function sendMessage(conversationId, text) {
  await delay();
  return { id: "msg_" + Date.now(), conversationId, from: "merchant", text, time: "Just now" };
}

/* ═══════════════════════════════════════════════════════════════════
   INTEGRATIONS
   ═══════════════════════════════════════════════════════════════════ */

function getIntegrationStates() {
  try { return JSON.parse(localStorage.getItem("dd_integration_states")) || {}; } catch { return {}; }
}
function setIntegrationState(name, active) {
  const states = getIntegrationStates();
  states[name] = active;
  try { localStorage.setItem("dd_integration_states", JSON.stringify(states)); } catch {}
}

export async function getIntegrations() {
  await delay();
  const states = getIntegrationStates();
  return MOCK_INTEGRATIONS.map(cat => ({
    ...cat,
    items: cat.items.map(item => ({
      ...item,
      active: item.name in states ? states[item.name] : item.active,
    })),
  }));
}

export async function toggleIntegration(name) {
  await delay();
  const states = getIntegrationStates();
  const current = name in states ? states[name] : MOCK_INTEGRATIONS.flatMap(c => c.items).find(i => i.name === name)?.active || false;
  const next = !current;
  setIntegrationState(name, next);
  return { name, active: next };
}

/* ═══════════════════════════════════════════════════════════════════
   BILLING
   ═══════════════════════════════════════════════════════════════════ */

export async function getCurrentPlan() {
  await delay();
  return MOCK_CURRENT_PLAN;
}

export async function getPlans() {
  await delay();
  return MOCK_PLANS;
}

export async function getBillingHistory() {
  await delay();
  return MOCK_BILLING_HISTORY;
}

export async function upgradePlan(body) {
  await delay();
  return { message: `Upgraded to ${body.planName} plan! 🎉`, plan: body.planName };
}

/* ═══════════════════════════════════════════════════════════════════
   ANALYTICS
   ═══════════════════════════════════════════════════════════════════ */

export async function getRevenueData() {
  await delay();
  return ANALYTICS_REVENUE;
}

export async function getOrderStats() {
  await delay();
  return ANALYTICS_ORDER_STATS;
}

export async function getScanData() {
  await delay();
  return ANALYTICS_SCAN_DATA;
}

export async function getTopProducts() {
  await delay();
  return ANALYTICS_TOP_PRODUCTS;
}

export async function getCustomerSplit() {
  await delay();
  return ANALYTICS_CUSTOMER_SPLIT;
}

/* ═══════════════════════════════════════════════════════════════════
   MERCHANT PROFILE
   ═══════════════════════════════════════════════════════════════════ */

export async function getMerchantProfile() {
  await delay();
  const m = getMerchant();
  if (!m) throw new Error("Not authenticated");
  const { password: _, ...safe } = m;
  return safe;
}

export async function updateMerchantProfile(body) {
  await delay();
  const m = getMerchant();
  if (!m) throw new Error("Not authenticated");
  const updated = { ...m, ...body };
  setMerchant(updated);
  const { password: _, ...safe } = updated;
  return safe;
}
