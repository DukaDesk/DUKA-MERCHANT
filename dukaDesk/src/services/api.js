import httpClient from "./httpClient";
import { DASHBOARD_STATS_BY_CATEGORY, DASHBOARD_REVENUE_BY_CATEGORY, DASHBOARD_ACTIVITY_BY_CATEGORY, MOCK_ORDERS, MOCK_CONVERSATIONS, MOCK_INTEGRATIONS, MOCK_CURRENT_PLAN, MOCK_PLANS, MOCK_BILLING_HISTORY, ANALYTICS_REVENUE, ANALYTICS_ORDER_STATS, ANALYTICS_SCAN_DATA, ANALYTICS_TOP_PRODUCTS, ANALYTICS_CUSTOMER_SPLIT } from "./mockData";

function delay(ms = 200) {
  return new Promise(r => setTimeout(r, ms));
}

/* ───── Token ───── */
export function setToken(t) {
  if (t) localStorage.setItem("dukadesk_token", t);
  else localStorage.removeItem("dukadesk_token");
}

function setRefreshToken(t) {
  if (t) localStorage.setItem("dukadesk_refresh_token", t);
  else localStorage.removeItem("dukadesk_refresh_token");
}

/* ───── Setup / App Config ───── */
export function setSetupData(data) { try { localStorage.setItem("dukadesk_setup", JSON.stringify(data)); } catch { /* ignore */ } }
export function getSetupData() { try { return JSON.parse(localStorage.getItem("dukadesk_setup")); } catch { return null; } }

/* ───── Merchant ───── */
export function getMerchant() {
  try { return JSON.parse(localStorage.getItem("dd_merchant")); } catch { return null; }
}
export function setMerchant(m) {
  try { localStorage.setItem("dd_merchant", JSON.stringify(m)); } catch { /* empty */ }
}

function buildMerchant(user, tenant = null) {
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ");
  return {
    id: user.id,
    name,
    firstName: user.firstName,
    lastName: user.lastName,
    business: tenant?.name || "",
    email: user.email,
    phone: user.phoneNumber || "",
    avatar: name.split(" ").map(n => n[0]).join("").toUpperCase(),
    createdAt: user.createdAt,
    tenantId: tenant?.id || null,
    tenantSlug: tenant?.slug || null,
    status: user.status,
    role: user.role || "tenant_owner",
  };
}

function slugify(text) {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "");
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
  console.log("[login] sending request", { email: body.email });
  const res = await httpClient.post("/api/v1/auth/login", {
    email: body.email,
    password: body.password,
  });
  console.log("[login] raw response", res);

  const payload = res.data || res;
  console.log("[login] payload", payload);
  const { user, accessToken, refreshToken } = payload || {};
  console.log("[login] extracted", { user, accessToken, refreshToken });

  if (!accessToken) {
    console.warn("[login] no accessToken in response, payload keys:", Object.keys(payload || {}));
    throw new Error(payload?.message || payload?.msg || "Invalid server response — missing token");
  }

  let tenant = null;
  try {
    const tenantsRes = await httpClient.get("/api/v1/tenants");
    const tenants = tenantsRes.data || [];
    if (tenants.length > 0) tenant = tenants[0];
  } catch (e) { console.warn("[login] tenant fetch failed", e?.message); }

  const merchant = buildMerchant(user, tenant);
  setToken(accessToken);
  setRefreshToken(refreshToken);
  setMerchant(merchant);
  return { token: accessToken, merchant };
}

export async function signup(body) {
  const nameParts = (body.fullName || "").trim().split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  const res = await httpClient.post("/api/v1/auth/register", {
    email: body.email,
    phoneNumber: body.phone || "",
    firstName,
    lastName,
    password: body.password,
  });

  const payload = res.data || res;
  const { user, accessToken, refreshToken } = payload;

  let tenant = null;
  try {
    const tenantRes = await httpClient.post("/api/v1/tenants", {
      name: body.businessName || body.fullName,
      slug: slugify(body.businessName || body.fullName),
    });
    tenant = tenantRes.data;
  } catch { /* tenant creation failed, proceed without */ }

  const merchant = buildMerchant(user, tenant);
  setToken(accessToken);
  setRefreshToken(refreshToken);
  setMerchant(merchant);
  return { token: accessToken, merchant };
}

export async function forgotPassword(body) {
  const res = await httpClient.post("/api/v1/auth/password-reset-request", {
    email: body.email,
  });
  const payload = res.data || res;
  return { message: payload.message || payload.data?.message || "Password reset link sent to " + body.email };
}

export async function confirmPasswordReset(body) {
  const res = await httpClient.post("/api/v1/auth/password-reset-confirm", {
    token: body.token,
    password: body.password,
    otp: body.otp,
  });
  const payload = res.data || res;
  return payload;
}

export async function logout() {
  try {
    await httpClient.post("/api/v1/auth/logout");
  } catch { /* server logout best-effort */ }
  setToken(null);
  setRefreshToken(null);
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

function tenantPath(tenantId) {
  return tenantId ? `/api/v1/tenants/${tenantId}` : "";
}

export async function getProducts() {
  const merchant = getMerchant();
  const tenantId = merchant?.tenantId;
  if (!tenantId) {
    const local = getMerchantProducts();
    return local;
  }
  const res = await httpClient.get(`${tenantPath(tenantId)}/products`);
  return res.data || res;
}

export async function createProduct(body) {
  const merchant = getMerchant();
  const tenantId = merchant?.tenantId;
  if (!tenantId) {
    const products = getMerchantProducts();
    const product = {
      id: "p_" + Date.now(),
      merchantId: merchant?.id,
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
  const res = await httpClient.post(`${tenantPath(tenantId)}/products`, body);
  return res.data || res;
}

export async function updateProduct(id, body) {
  const merchant = getMerchant();
  if (!merchant?.tenantId) {
    const products = getMerchantProducts();
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) throw new Error("Product not found");
    products[idx] = { ...products[idx], ...body };
    setMerchantProducts(products);
    return products[idx];
  }
  const res = await httpClient.put(`/api/v1/products/${id}`, body);
  return res.data || res;
}

export async function deleteProduct(id) {
  const merchant = getMerchant();
  if (!merchant?.tenantId) {
    setMerchantProducts(getMerchantProducts().filter(p => p.id !== id));
    return { message: "Product deleted" };
  }
  const res = await httpClient.delete(`/api/v1/products/${id}`);
  return res.data || res;
}

/* ═══════════════════════════════════════════════════════════════════
   ORDERS
   ═══════════════════════════════════════════════════════════════════ */

export async function getOrders() {
  const merchant = getMerchant();
  const tenantId = merchant?.tenantId;
  if (!tenantId) {
    await delay();
    return MOCK_ORDERS;
  }
  const res = await httpClient.get(`${tenantPath(tenantId)}/orders`);
  return res.data || res;
}

export async function updateOrderStatus(id, status) {
  const merchant = getMerchant();
  if (!merchant?.tenantId) {
    await delay();
    return { id, status, message: "Status updated" };
  }
  const res = await httpClient.post(`/api/v1/orders/${id}/status`, { status });
  return res.data || res;
}

/* ═══════════════════════════════════════════════════════════════════
   MESSAGES / NOTIFICATIONS
   ═══════════════════════════════════════════════════════════════════ */

export async function getConversations() {
  try {
    const res = await httpClient.get("/api/v1/notifications");
    const list = res.data || res;
    if (Array.isArray(list) && list.length > 0) {
      return list.map(n => ({
        id: n.id,
        name: n.from || "System",
        last: n.message || n.title,
        time: n.createdAt ? new Date(n.createdAt).toLocaleTimeString() : "",
        unread: n.read ? 0 : 1,
      }));
    }
  } catch { /* fall through */ }
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

export async function getUnreadCount() {
  try {
    const res = await httpClient.get("/api/v1/notifications/unread-count");
    return res.data || res;
  } catch {
    return { count: 0 };
  }
}

export async function getNotifications() {
  try {
    const res = await httpClient.get("/api/v1/notifications");
    const list = res.data || res;
    if (Array.isArray(list)) return list;
    return [];
  } catch {
    await delay();
    return [];
  }
}

export async function markNotificationRead(id) {
  try {
    const res = await httpClient.post(`/api/v1/notifications/${id}/read`);
    return res.data || res;
  } catch {
    return { message: "Marked as read" };
  }
}

export async function dismissNotification(id) {
  try {
    const res = await httpClient.delete(`/api/v1/notifications/${id}`);
    return res.data || res;
  } catch {
    return { message: "Dismissed" };
  }
}

/* ═══════════════════════════════════════════════════════════════════
   INTEGRATIONS
   ═══════════════════════════════════════════════════════════════════ */

export async function getIntegrations() {
  const merchant = getMerchant();
  const tenantId = merchant?.tenantId;
  if (!tenantId) {
    await delay();
    return MOCK_INTEGRATIONS;
  }
  const res = await httpClient.get(`${tenantPath(tenantId)}/integrations`);
  return res.data || res;
}

export async function toggleIntegration(name, active) {
  const merchant = getMerchant();
  const tenantId = merchant?.tenantId;
  if (!tenantId) {
    await delay();
    return { name, active: true };
  }
  if (active === false) {
    await httpClient.post(`${tenantPath(tenantId)}/integrations/${name}/disconnect`);
  } else {
    await httpClient.post(`${tenantPath(tenantId)}/integrations/connect`, { provider: name });
  }
  return { name, active: active !== false };
}

/* ═══════════════════════════════════════════════════════════════════
   BILLING
   ═══════════════════════════════════════════════════════════════════ */

export async function getCurrentPlan() {
  const merchant = getMerchant();
  const tenantId = merchant?.tenantId;
  if (!tenantId) {
    await delay();
    return MOCK_CURRENT_PLAN;
  }
  const res = await httpClient.get(`${tenantPath(tenantId)}/subscription`);
  return res.data || res;
}

export async function getPlans() {
  try {
    const res = await httpClient.get("/api/v1/bff/website/pricing");
    return res.data || res;
  } catch {
    await delay();
    return MOCK_PLANS;
  }
}

export async function getBillingHistory() {
  await delay();
  return MOCK_BILLING_HISTORY;
}

export async function upgradePlan(body) {
  const merchant = getMerchant();
  const tenantId = merchant?.tenantId;
  if (!tenantId) {
    await delay();
    return { message: `Upgraded to ${body.planName} plan! 🎉`, plan: body.planName };
  }
  const res = await httpClient.post(`${tenantPath(tenantId)}/subscribe`, body);
  return res.data || res;
}

/* ═══════════════════════════════════════════════════════════════════
   ANALYTICS
   ═══════════════════════════════════════════════════════════════════ */

export async function getRevenueData() {
  const merchant = getMerchant();
  const tenantId = merchant?.tenantId;
  if (!tenantId) {
    await delay();
    return ANALYTICS_REVENUE;
  }
  const res = await httpClient.get(`/api/v1/analytics/reports/revenue`, { params: { tenantId } });
  return res.data || res;
}

export async function getOrderStats() {
  const merchant = getMerchant();
  const tenantId = merchant?.tenantId;
  if (!tenantId) {
    await delay();
    return ANALYTICS_ORDER_STATS;
  }
  const res = await httpClient.get(`${tenantPath(tenantId)}/orders`);
  return res.data || res;
}

export async function getScanData() {
  await delay();
  return ANALYTICS_SCAN_DATA;
}

export async function getTopProducts() {
  const merchant = getMerchant();
  const tenantId = merchant?.tenantId;
  if (!tenantId) {
    await delay();
    return ANALYTICS_TOP_PRODUCTS;
  }
  const res = await httpClient.get(`${tenantPath(tenantId)}/products`);
  return res.data || res;
}

export async function getCustomerSplit() {
  await delay();
  return ANALYTICS_CUSTOMER_SPLIT;
}

export async function getUsageMetrics() {
  await delay();
  return {
    apiCalls: { total: 12843, thisMonth: 3402, avgDaily: 113 },
    storageUsed: { total: "2.4 GB", files: 847, images: 312 },
    activeUsers: [
      { day: "Mon", users: 187 }, { day: "Tue", users: 203 },
      { day: "Wed", users: 219 }, { day: "Thu", users: 195 },
      { day: "Fri", users: 241 }, { day: "Sat", users: 156 },
      { day: "Sun", users: 98 },
    ],
  };
}

export async function getAnalyticsSummary() {
  const merchant = getMerchant();
  const tenantId = merchant?.tenantId;
  if (!tenantId) {
    await delay();
    return { revenue: ANALYTICS_REVENUE, orders: ANALYTICS_ORDER_STATS };
  }
  const res = await httpClient.get(`/api/v1/analytics/summary`, { params: { tenantId } });
  return res.data || res;
}

/* ═══════════════════════════════════════════════════════════════════
   TENANT
   ═══════════════════════════════════════════════════════════════════ */

export async function createTenant(body) {
  const res = await httpClient.post("/api/v1/tenants", body);
  return res.data || res;
}

export async function getTenant(id) {
  const res = await httpClient.get(`/api/v1/tenants/${id}`);
  return res.data || res;
}

export async function suspendTenant(id) {
  const res = await httpClient.post(`/api/v1/tenants/${id}/suspend`);
  return res.data || res;
}

export async function updateTenant(id, body) {
  const res = await httpClient.put(`/api/v1/tenants/${id}`, body);
  const data = res.data || res;
  const m = getMerchant();
  if (m && data) {
    const updated = { ...m, business: data.name || m.business };
    setMerchant(updated);
  }
  return data;
}

export async function getTenantConfig(id) {
  const res = await httpClient.get(`/api/v1/tenants/${id}/config`);
  return res.data || res;
}

export async function updateTenantConfig(id, body) {
  const res = await httpClient.put(`/api/v1/tenants/${id}/config`, body);
  return res.data || res;
}

export async function publishTenant(id) {
  const res = await httpClient.post(`/api/v1/tenants/${id}/publish`);
  return res.data || res;
}

/* ═══════════════════════════════════════════════════════════════════
   MERCHANT PROFILE
   ═══════════════════════════════════════════════════════════════════ */

export async function getAuthMe() {
  try {
    const res = await httpClient.get("/api/v1/auth/me");
    const profile = res.data || res;
    const m = getMerchant();
    if (m) {
      const merged = { ...m, ...profile, name: [profile.firstName, profile.lastName].filter(Boolean).join(" ") || m.name };
      setMerchant(merged);
    }
    return profile;
  } catch {
    return getMerchantProfile();
  }
}

export async function getMerchantProfile() {
  try {
    const res = await httpClient.get("/api/v1/profile");
    const profile = res.data || res;
    const m = getMerchant();
    if (m) {
      const merged = { ...m, ...profile, name: [profile.firstName, profile.lastName].filter(Boolean).join(" ") || m.name };
      setMerchant(merged);
    }
    return profile;
  } catch {
    const m = getMerchant();
    if (!m) throw new Error("Not authenticated");
    const safe = { ...m };
    delete safe.password;
    return safe;
  }
}

export async function updateMerchantProfile(body) {
  try {
    const res = await httpClient.put("/api/v1/profile", body);
    const profile = res.data || res;
    const m = getMerchant();
    if (m) {
      const updated = { ...m, ...profile, name: [profile.firstName, profile.lastName].filter(Boolean).join(" ") || body.name || m.name };
      setMerchant(updated);
      if (body.business && m.tenantId) {
        updateTenant(m.tenantId, { name: body.business }).catch(() => {});
      }
    }
    return profile;
  } catch {
    const m = getMerchant();
    if (!m) throw new Error("Not authenticated");
    const updated = { ...m, ...body };
    setMerchant(updated);
    if (body.business && m.tenantId) {
      updateTenant(m.tenantId, { name: body.business }).catch(() => {});
    }
    const safe = { ...updated };
    delete safe.password;
    return safe;
  }
}
