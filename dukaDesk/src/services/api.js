// eslint-disable-next-line no-unused-vars -- used by the commented-out tenant API calls (restore path)
import axios from "axios";
import httpClient from "./httpClient";
import { WIZARD_INTEGRATIONS } from "../config/wizard";

function unwrapList(value) {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") {
    for (const key of ["data", "items", "list", "results", "rows", "records", "orders", "products", "tenants", "conversations", "campaigns", "customers", "history", "releases", "bills", "transactions", "invitations", "vouchers", "reviews", "comments"]) {
      if (Array.isArray(value[key])) return value[key];
    }
    if (value.data && typeof value.data === "object") return unwrapList(value.data);
  }
  return [];
}

function buildIntegrationCatalog(connected) {
  const connectedNames = new Set((connected || []).map(i => i?.provider || i?.name).filter(Boolean));
  return (WIZARD_INTEGRATIONS || []).map(cat => ({
    ...cat,
    items: cat.items.map(item => ({
      ...item,
      active: item.active || connectedNames.has(item.name),
    })),
  }));
}

/* ═══════════════════════════════════════════════════════════════════
   DEMO MODE — FRONTEND-ONLY DUMMY DATA  [DEMO]
   ═══════════════════════════════════════════════════════════════════
   The backend is unavailable (tenant API calls were failing with
   "only tenant owner can perform this action"), so every tenant-scoped
   call below has been commented out and replaced with realistic sample
   data kept in localStorage. Auth, profile and notification endpoints
   are untouched. To restore real API calls, un-comment the httpClient
   lines in each function and delete the demo helpers above them.
   ═══════════════════════════════════════════════════════════════════ */

const DEMO_STORE_KEY = "dukadesk_demo_store";

const DEMO_PLANS = [
  {
    name: "Starter",
    label: "₦9,000/month",
    color: "#6B7280",
    current: false,
    features: { "Up to 50 products": true, "Custom domain": false, "Advanced analytics": false, "Priority support": false, "Team members": 1 },
  },
  {
    name: "Business",
    label: "₦25,000/month",
    color: "#1B4332",
    current: false,
    features: { "Up to 50 products": true, "Custom domain": true, "Advanced analytics": true, "Priority support": true, "Team members": 5 },
  },
  {
    name: "Enterprise",
    label: "₦75,000/month",
    color: "#F4A026",
    current: false,
    features: { "Unlimited products": true, "Custom domain": true, "Advanced analytics": true, "Priority support": true, "Team members": 25 },
  },
];

function demoSeed() {
  return {
    merchant: {
      id: "merchant_demo_001",
      name: "Ada's Kitchen",
      slug: "adas-kitchen",
      category: "Restaurant",
      status: "active",
      createdAt: new Date().toISOString(),
    },
    tenant: {
      id: "tenant_demo_001",
      name: "Ada's Kitchen",
      slug: "adas-kitchen",
      category: "Restaurant",
      status: "active",
      createdAt: new Date().toISOString(),
    },
    config: {
      app: {
        appName: "Ada's Kitchen",
        businessName: "Ada's Kitchen",
        slug: "adas-kitchen",
        storeUrl: "dukadesk.app/adas-kitchen",
        category: "Restaurant",
        template: "Classic Dine",
        tagline: "Home-cooked Nigerian favourites, delivered fresh.",
        color: "#1B4332",
        logo: null,
        selectedIntegrations: ["Paystack"],
        bizDesc: "Your favourite local kitchen serving rich, smoky jollof and more.",
        phone: "+234 801 234 5678",
        address: "12 Admiralty Way, Lekki Phase 1",
        hours: [],
        status: "live",
        updatedAt: new Date().toISOString(),
      },
      compliance: {
        businessName: "Ada's Kitchen",
        businessType: "Restaurant",
        status: "approved",
        complianceDone: true,
        submittedAt: new Date().toISOString(),
      },
      profile: null,
      design: null,
      releases: [],
      deployed: null,
      integrationConfigs: {},
    },
    products: [
      { id: "p_1001", name: "Jollof Rice & Chicken", cat: "Mains", price: 2500, stock: 24, status: "In Stock", img: "soup" },
      { id: "p_1002", name: "Peppered Gizzard", cat: "Small Chops", price: 1800, stock: 40, status: "In Stock", img: "drumstick" },
      { id: "p_1003", name: "Grilled Tilapia", cat: "Mains", price: 4500, stock: 0, status: "Out of Stock", img: "fish" },
      { id: "p_1004", name: "Egusi Soup + Eba", cat: "Mains", price: 3200, stock: 12, status: "Low Stock", img: "cookingpot" },
      { id: "p_1005", name: "Chicken Shawarma", cat: "Small Chops", price: 2000, stock: 18, status: "In Stock", img: "sandwich" },
      { id: "p_1006", name: "Chapman Cocktail", cat: "Drinks", price: 1500, stock: 35, status: "In Stock", img: "cupsoda" },
    ],
    orders: [
      { id: "#ORD-1001", customer: "Chidinma Okafor", items: "2x Jollof Rice & Chicken, 1x Chapman", total: 6500, payment: "Card", status: "Pending", date: "Today, 2:30 PM", address: "14 Admiralty Way, Lekki Phase 1" },
      { id: "#ORD-1002", customer: "Emeka Nwosu", items: "1x Grilled Tilapia, 2x Peppered Gizzard", total: 8100, payment: "Transfer", status: "Processing", date: "Today, 1:05 PM", address: "5 Bourdillon Road, Ikoyi" },
      { id: "#ORD-1003", customer: "Fatima Bello", items: "3x Egusi Soup + Eba", total: 10100, payment: "Card", status: "Completed", date: "Yesterday", address: "8 Akin Adesola St, Victoria Island" },
      { id: "#ORD-1004", customer: "Tunde Adeyemi", items: "1x Chicken Shawarma, 1x Chapman", total: 3700, payment: "Cash", status: "Cancelled", date: "Yesterday", address: "22 Ozumba Mbadiwe, VI" },
      { id: "#ORD-1005", customer: "Ngozi Uche", items: "4x Jollof Rice & Chicken", total: 10600, payment: "Card", status: "Completed", date: "Mon", address: "3 Yacht Road, Lekki Phase 2" },
    ],
    coupons: [
      { id: "c_1", code: "WELCOME15", type: "percentage", value: 15, usage: 42, maxUsage: 200, minOrder: 3000, expires: "2026-12-31", status: "Active" },
      { id: "c_2", code: "JOLOFF5", type: "fixed", value: 500, usage: 18, maxUsage: 100, minOrder: 2000, expires: "2026-10-31", status: "Active" },
    ],
    subscription: {
      plan: "Business",
      label: "₦25,000/month",
      renews: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      features: ["Unlimited products", "Custom domain", "Advanced analytics", "Priority support"],
    },
    billingHistory: [
      { date: "Jul 25, 2026", desc: "Business plan — monthly", amount: "₦25,000", status: "Paid" },
      { date: "Jun 25, 2026", desc: "Business plan — monthly", amount: "₦25,000", status: "Paid" },
      { date: "May 25, 2026", desc: "Business plan — monthly", amount: "₦25,000", status: "Paid" },
    ],
    integrations: [{ provider: "Paystack", name: "Paystack" }],
  };
}

function demoStore() {
  try {
    const raw = localStorage.getItem(DEMO_STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Migration: ensure both merchant and tenant exist (merchants rename)
      if (parsed.tenant && !parsed.merchant) parsed.merchant = { ...parsed.tenant, id: parsed.tenant.id.replace('tenant_', 'merchant_') };
      if (parsed.merchant && !parsed.tenant) parsed.tenant = { ...parsed.merchant, id: parsed.merchant.id.replace('merchant_', 'tenant_') };
      return parsed;
    }
  } catch { /* ignore */ }
  const seed = demoSeed();
  try { localStorage.setItem(DEMO_STORE_KEY, JSON.stringify(seed)); } catch { /* ignore */ }
  return seed;
}

function demoSave(store) {
  try { localStorage.setItem(DEMO_STORE_KEY, JSON.stringify(store)); } catch { /* ignore */ }
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

async function fetchTenantSilently(tenantId = null) {
  // [DEMO] Real call commented out (backend unavailable):
  // const token = localStorage.getItem("dukadesk_token");
  // const headers = token ? { Authorization: `Bearer ${token}` } : {};
  // const base = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
  // try {
  //   if (tenantId) {
  //     const res = await axios.get(`${base}/api/v1/merchants/${tenantId}`, { headers });
  //     const body = res.data?.data ?? res.data;
  //     return body?.name ? body : null;
  //   }
  //   const res = await axios.get(`${base}/api/v1/merchants/my`, { headers });
  //   const body = res.data?.tenants ?? res.data?.data ?? res.data;
  //   const tenants = Array.isArray(body) ? body : [];
  //   return tenants.length > 0 ? tenants[0] : null;
  // } catch {
  //   return null;
  // }
  const store = demoStore();
  const tenant = { ...store.tenant };
  if (tenantId && tenant.id !== tenantId) return null;
  return tenant;
}

/* ───── Setup / App Config ───── */
export function setSetupData(data) { try { localStorage.setItem("dukadesk_setup", JSON.stringify(data)); } catch { /* ignore */ } }
export function getSetupData() { try { return JSON.parse(localStorage.getItem("dukadesk_setup")); } catch { return null; } }

/* ───── Compliance ───── */
// eslint-disable-next-line no-unused-vars -- used by the commented-out compliance upload (restore path)
function dataUrlToBlob(dataUrl) {
  const [meta, b64] = String(dataUrl || "").split(",");
  const mime = (meta.match(/data:(.*?)[;,]/) || [])[1] || "application/octet-stream";
  const binary = atob(b64 || "");
  const arr = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) arr[i] = binary.charCodeAt(i);
  return new Blob([arr], { type: mime });
}

export async function uploadComplianceDocument(tenantId, file) {
  // [DEMO] Real upload commented out (backend unavailable) — documents are recorded as "pending":
  // const form = new FormData();
  // form.append("file", dataUrlToBlob(file.data), file.name);
  // const res = await httpClient.post(`/api/v1/merchants/${tenantId}/media/upload`, form, {
  //   headers: { "Content-Type": undefined },
  // });
  // return res.data || res;
  return { tenantId, fileName: file?.name || null, status: "pending", mediaId: null, url: null };
}

function toDocumentRecord(file, uploaded) {
  if (!file) return null;
  return {
    name: file.name || "",
    size: file.size || 0,
    status: uploaded ? "uploaded" : "pending",
    mediaId: uploaded?.id || uploaded?.media?.id || uploaded?.file?.id || null,
    url: uploaded?.url || uploaded?.media?.url || uploaded?.file?.url || null,
  };
}

export async function submitCompliance(tenantId, formData) {
  const { idDoc, bizDoc, utrDoc, ...info } = formData;

  const uploadDoc = async (file) => {
    if (!file) return null;
    if (!file.data) return { name: file.name || "", status: "pending", mediaId: null, url: null };
    try {
      return toDocumentRecord(file, await uploadComplianceDocument(tenantId, file));
    } catch {
      return toDocumentRecord(file, null);
    }
  };

  const [idDocRef, bizDocRef, utrDocRef] = await Promise.all([
    uploadDoc(idDoc),
    uploadDoc(bizDoc),
    uploadDoc(utrDoc),
  ]);

  await updateTenant(tenantId, {
    name: info.businessName,
    phone: info.phone,
  });
  await writeConfig(tenantId, {
    compliance: {
      businessName: info.businessName,
      businessType: info.businessType || "",
      regNumber: info.regNumber || "",
      taxId: info.taxId || "",
      phone: info.phone,
      website: info.website || "",
      address: info.address,
      city: info.city || "",
      state: info.state || "",
      country: info.country || "Nigeria",
      idDoc: idDocRef,
      bizDoc: bizDocRef,
      utrDoc: utrDocRef,
      status: "pending",
      complianceDone: true,
      submittedAt: new Date().toISOString(),
    },
  });
  return { success: true, documents: { idDoc: idDocRef, bizDoc: bizDocRef, utrDoc: utrDocRef } };
}

export async function getComplianceStatus(tenantId) {
  try {
    const { data } = await readConfig(tenantId);
    return !!(data.compliance?.complianceDone);
  } catch {
    return false;
  }
}

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

async function hydrateMerchantCategory(merchant) {
  if (!merchant?.tenantId) return merchant;
  let category = merchant.category;
  if (!category) {
    const prev = getMerchant();
    if (prev?.id === merchant.id) category = prev?.category || "";
  }
  if (!category) {
    try {
      const { data } = await readConfig(merchant.tenantId);
      category = data?.app?.category || "";
    } catch { /* best-effort */ }
  }
  const next = category ? { ...merchant, category } : merchant;
  setMerchant(next);
  return next;
}

/* ═══════════════════════════════════════════════════════════════════
   AUTH
   ═══════════════════════════════════════════════════════════════════ */

export async function login(body) {
  const res = await httpClient.post("/api/v1/auth/login", {
    email: body.email,
    password: body.password,
  });

  const payload = res.data || res;
  const { user, accessToken, refreshToken } = payload || {};

  if (!accessToken) {
    console.warn("[login] no accessToken in response, payload keys:", Object.keys(payload || {}));
    throw new Error(payload?.message || payload?.msg || "Invalid server response — missing token");
  }

  setToken(accessToken);
  setRefreshToken(refreshToken);

  const tenant = await fetchTenantSilently(user?.tenantId);

  const merchant = await hydrateMerchantCategory(buildMerchant(user, tenant));
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

  setToken(accessToken);
  setRefreshToken(refreshToken);

  const tenant = await fetchTenantSilently(user?.tenantId);

  const merchant = await hydrateMerchantCategory(buildMerchant(user, tenant));
  return { token: accessToken, merchant };
}

export async function forgotPassword(body) {
  const res = await httpClient.post("/api/v1/auth/forgot-password", {
    email: body.email,
  });
  const payload = res.data || res;
  return { message: payload.message || payload.data?.message || "Password reset link sent to " + body.email };
}

export async function confirmPasswordReset(body) {
  const res = await httpClient.post("/api/v1/auth/reset-password", {
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

export async function googleSignIn(idToken) {
  const res = await httpClient.post("/api/v1/auth/google", { idToken });

  const payload = res.data || res;
  const { user, accessToken, refreshToken } = payload || {};

  if (!accessToken) {
    console.warn("[googleSignIn] no accessToken in response, payload keys:", Object.keys(payload || {}));
    throw new Error(payload?.message || payload?.msg || "Invalid server response — missing token");
  }

  setToken(accessToken);
  setRefreshToken(refreshToken);

  const tenant = await fetchTenantSilently(user?.tenantId);

  const merchant = await hydrateMerchantCategory(buildMerchant(user, tenant));
  return { token: accessToken, merchant };
}

/* ═══════════════════════════════════════════════════════════════════
   APP DEPLOYMENT
   ═══════════════════════════════════════════════════════════════════ */

export async function deployApp(appData) {
  const tenantId = await ensureTenant();

  const slug = (appData.appName || "").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const storeUrl = `dukadesk.app/${slug}`;

  await writeConfig(tenantId, {
    app: {
      appName: appData.appName,
      slug,
      storeUrl,
      category: appData.category || "Restaurant",
      template: appData.template || "Classic Dine",
      tagline: appData.tagline || "",
      color: appData.color || "#1B4332",
      logo: appData.logo || null,
      selectedIntegrations: appData.selectedIntegrations || [],
      bizDesc: appData.bizDesc || "",
      phone: appData.phone || "",
      address: appData.address || "",
      hours: appData.hours || [],
      status: "live",
      updatedAt: new Date().toISOString(),
    },
  });

  await publishTenant(tenantId);
  return { app: { appName: appData.appName, slug, storeUrl }, message: "App deployed successfully!" };
}

export async function updateApp(appData) {
  const tenantId = await ensureTenant();

  const { data } = await readConfig(tenantId);
  const app = data.app || {};

  await writeConfig(tenantId, {
    app: { ...app, ...appData, updatedAt: new Date().toISOString() },
  });

  return { app: { ...app, ...appData }, message: "App updated successfully!" };
}

export async function getMyApp() {
  const merchant = getMerchant();
  const tenantId = merchant?.tenantId;
  if (!tenantId) return null;
  const { data } = await readConfig(tenantId);
  return data.app || null;
}

export async function saveCategory(category) {
  const merchant = getMerchant();
  const tenantId = merchant?.tenantId;
  if (!tenantId) return { success: false };
  const { data } = await readConfig(tenantId);
  await writeConfig(tenantId, {
    app: { ...(data.app || {}), category, updatedAt: new Date().toISOString() },
  });
  return { success: true };
}

/* ───── Dashboard Modules (primitives) ───── */
export function getDashboardModules() {
  const setup = getSetupData();
  const modules = setup?.modules;
  if (Array.isArray(modules) && modules.length) return modules;
  const merchant = getMerchant();
  const mModules = merchant?.modules;
  return Array.isArray(mModules) && mModules.length ? mModules : null;
}

export async function saveDashboardModules(modules) {
  const list = Array.isArray(modules) ? modules : [];
  const saved = getSetupData();
  setSetupData({ ...(saved || {}), modules: list });

  const merchant = getMerchant();
  if (merchant) {
    const next = { ...merchant, modules: list };
    setMerchant(next);
  }

  const tenantId = merchant?.tenantId;
  if (!tenantId) return { success: false };
  const { data } = await readConfig(tenantId);
  await writeConfig(tenantId, {
    app: { ...(data.app || {}), modules: list, updatedAt: new Date().toISOString() },
  });
  return { success: true };
}

/* ═══════════════════════════════════════════════════════════════════
   DASHBOARD
   ═══════════════════════════════════════════════════════════════════ */

export async function getDashboardStats() {
  try {
    const summary = await getAnalyticsSummary();
    return {
      customers: summary?.customers || 0,
      revenue: summary?.revenue || 0,
      unreadMessages: summary?.unreadMessages || 0,
      avgRating: summary?.avgRating || 0,
      reviewsCount: summary?.reviewsCount || 0,
      appStatus: "live",
    };
  } catch {
    return { customers: 0, revenue: 0, unreadMessages: 0, avgRating: 0, reviewsCount: 0, appStatus: "unknown" };
  }
}

export async function getRevenue() {
  try {
    return await getRevenueData();
  } catch {
    return [];
  }
}

export async function getActivity() {
  // [DEMO] Real call commented out (backend unavailable):
  // const merchant = getMerchant();
  // const tenantId = merchant?.tenantId;
  // if (!tenantId) return [];
  // const res = await httpClient.get(`${tenantPath(tenantId)}/orders`, { params: { limit: 5 } });
  // const orders = res.data || res;
  // if (Array.isArray(orders)) {
  //   return orders.map(o => ({
  //     icon: "🛒",
  //     title: `New order from ${o.customer || "customer"}`,
  //     sub: `₦${(o.total || 0).toLocaleString()}`,
  //     time: o.date || "recent",
  //     color: "#F4A026",
  //   }));
  // }
  // return [];
  return (demoStore().orders || []).slice(0, 5).map(o => ({
    icon: "🛒",
    title: `New order from ${o.customer || "customer"}`,
    sub: `₦${(o.total || 0).toLocaleString()}`,
    time: o.date || "recent",
    color: "#F4A026",
  }));
}

/* ═══════════════════════════════════════════════════════════════════
   PRODUCTS
   ═══════════════════════════════════════════════════════════════════ */

// eslint-disable-next-line no-unused-vars -- used by the commented-out tenant API calls (restore path)
function merchantPath(merchantId) {
  return merchantId ? `/api/v1/merchants/${merchantId}` : "";
}

function tenantPath(tenantId) {
  return merchantPath(tenantId);
}

export async function getProducts() {
  // [DEMO] const merchant = getMerchant();
  // [DEMO] const tenantId = merchant?.tenantId;
  // [DEMO] const res = await httpClient.get(`${tenantPath(tenantId)}/products`);
  // [DEMO] return unwrapList(res);
  return demoStore().products || [];
}

export async function createProduct(body) {
  // [DEMO] const merchant = getMerchant();
  // [DEMO] const tenantId = merchant?.tenantId;
  // [DEMO] const res = await httpClient.post(`${tenantPath(tenantId)}/products`, body);
  // [DEMO] return res.data || res;
  const store = demoStore();
  const created = { ...body, id: `p_${Date.now()}` };
  store.products = [created, ...(store.products || [])];
  demoSave(store);
  return created;
}

export async function updateProduct(id, body) {
  // [DEMO] const res = await httpClient.put(`/api/v1/products/${id}`, body);
  // [DEMO] return res.data || res;
  const store = demoStore();
  store.products = (store.products || []).map(p => (p.id === id ? { ...p, ...body, id } : p));
  demoSave(store);
  return { ...body, id };
}

export async function deleteProduct(id) {
  // [DEMO] const res = await httpClient.delete(`/api/v1/products/${id}`);
  // [DEMO] return res.data || res;
  const store = demoStore();
  store.products = (store.products || []).filter(p => p.id !== id);
  demoSave(store);
  return { id };
}

/* ═══════════════════════════════════════════════════════════════════
   ORDERS
   ═══════════════════════════════════════════════════════════════════ */

export async function getOrders() {
  // [DEMO] const merchant = getMerchant();
  // [DEMO] const tenantId = merchant?.tenantId;
  // [DEMO] const res = await httpClient.get(`${tenantPath(tenantId)}/orders`);
  // [DEMO] return unwrapList(res);
  return demoStore().orders || [];
}

export async function updateOrderStatus(id, status) {
  // [DEMO] const res = await httpClient.post(`/api/v1/orders/${id}/status`, { status });
  // [DEMO] return res.data || res;
  const store = demoStore();
  store.orders = (store.orders || []).map(o => (o.id === id ? { ...o, status } : o));
  demoSave(store);
  return { id, status };
}

/* ═══════════════════════════════════════════════════════════════════
   MESSAGES / NOTIFICATIONS
   ═══════════════════════════════════════════════════════════════════ */

export async function getConversations() {
  const res = await httpClient.get("/api/v1/notifications");
  const list = res.data || res;
  if (Array.isArray(list)) {
    return list.map(n => ({
      id: n.id,
      name: n.from || "System",
      last: n.message || n.title,
      time: n.createdAt ? new Date(n.createdAt).toLocaleTimeString() : "",
      unread: n.read ? 0 : 1,
    }));
  }
  return [];
}

export async function getMessages(conversationId) {
  const res = await httpClient.get(`/api/v1/notifications/${conversationId}/messages`);
  return res.data || res;
}

export async function sendMessage(conversationId, text) {
  const res = await httpClient.post(`/api/v1/notifications/${conversationId}/messages`, { text });
  return res.data || res;
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
  // [DEMO] const merchant = getMerchant();
  // [DEMO] const tenantId = merchant?.tenantId;
  // [DEMO] try {
  // [DEMO]   const res = await httpClient.get(`${tenantPath(tenantId)}/integrations`);
  // [DEMO]   const body = unwrapList(res);
  // [DEMO]   return buildIntegrationCatalog(body);
  // [DEMO] } catch {
  // [DEMO]   return buildIntegrationCatalog([]);
  // [DEMO] }
  return buildIntegrationCatalog(unwrapList(demoStore().integrations || []));
}

export async function toggleIntegration(name, active) {
  // [DEMO] const merchant = getMerchant();
  // [DEMO] const tenantId = merchant?.tenantId;
  // [DEMO] if (active === false) {
  // [DEMO]   await httpClient.post(`${tenantPath(tenantId)}/integrations/${name}/disconnect`);
  // [DEMO] } else {
  // [DEMO]   await httpClient.post(`${tenantPath(tenantId)}/integrations/connect`, { provider: name });
  // [DEMO] }
  const store = demoStore();
  const connected = (store.integrations || []).filter(i => i.name !== name);
  if (active !== false) connected.push({ provider: name, name });
  store.integrations = connected;
  demoSave(store);
  return { name, active: active !== false };
}

/* ═══════════════════════════════════════════════════════════════════
   BILLING
   ═══════════════════════════════════════════════════════════════════ */

export async function getCurrentPlan() {
  // [DEMO] const merchant = getMerchant();
  // [DEMO] const tenantId = merchant?.tenantId;
  // [DEMO] const res = await httpClient.get(`${tenantPath(tenantId)}/subscription`);
  // [DEMO] return res.data || res;
  return demoStore().subscription || null;
}

export async function getPlans() {
  // [DEMO] const res = await httpClient.get("/api/v1/bff/website/pricing");
  // [DEMO] return unwrapList(res);
  const current = (demoStore().subscription || {}).plan;
  return DEMO_PLANS.map(p => ({ ...p, current: p.name === current }));
}

export async function getBillingHistory() {
  // [DEMO] const merchant = getMerchant();
  // [DEMO] const tenantId = merchant?.tenantId;
  // [DEMO] try {
  // [DEMO]   const res = await httpClient.get(`${tenantPath(tenantId)}/billing-history`);
  // [DEMO]   return unwrapList(res);
  // [DEMO] } catch {
  // [DEMO]   try {
  // [DEMO]     const res = await httpClient.get(`${tenantPath(tenantId)}/payments/transactions`, { params: { limit: 50 } });
  // [DEMO]     const rows = unwrapList(res);
  // [DEMO]     return rows.map(t => ({
  // [DEMO]       date: t?.createdAt ? new Date(t.createdAt).toLocaleDateString() : "",
  // [DEMO]       desc: t?.description || t?.reference || t?.id || "Transaction",
  // [DEMO]       amount: t?.currency === "USD" ? `$${((t?.amount || t?.value) || 0).toFixed(2)}` : `₦${(t?.amount || t?.value || 0).toLocaleString()}`,
  // [DEMO]       status: t?.status || t?.transactionStatus || "completed",
  // [DEMO]     }));
  // [DEMO]   } catch {
  // [DEMO]     return [];
  // [DEMO]   }
  // [DEMO] }
  return demoStore().billingHistory || [];
}

export async function upgradePlan(body) {
  // [DEMO] const merchant = getMerchant();
  // [DEMO] const tenantId = merchant?.tenantId;
  // [DEMO] const res = await httpClient.post(`${tenantPath(tenantId)}/subscribe`, body);
  // [DEMO] return res.data || res;
  const store = demoStore();
  const plan = DEMO_PLANS.find(p => p.name === body?.planName) || DEMO_PLANS[1];
  store.subscription = {
    plan: plan.name,
    label: plan.label,
    renews: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    features: Object.keys(plan.features).filter(k => plan.features[k] === true),
  };
  demoSave(store);
  return { success: true, plan: store.subscription };
}

/* ───── Marketing: Coupons ───── */

export async function getCoupons() {
  // [DEMO] const merchant = getMerchant();
  // [DEMO] const tenantId = merchant?.tenantId;
  // [DEMO] try {
  // [DEMO]   const res = await httpClient.get(`${tenantPath(tenantId)}/coupons`);
  // [DEMO]   return unwrapList(res);
  // [DEMO] } catch {
  // [DEMO]   return [];
  // [DEMO] }
  return demoStore().coupons || [];
}

export async function createCoupon(body) {
  // [DEMO] const merchant = getMerchant();
  // [DEMO] const tenantId = merchant?.tenantId;
  // [DEMO] const res = await httpClient.post(`${tenantPath(tenantId)}/coupons`, body);
  // [DEMO] return res.data || res;
  const store = demoStore();
  const created = { ...body, id: `c_${Date.now()}` };
  store.coupons = [created, ...(store.coupons || [])];
  demoSave(store);
  return created;
}

export async function deleteCoupon(id) {
  // [DEMO] const res = await httpClient.delete(`/api/v1/coupons/${id}`);
  // [DEMO] return res.data || res;
  const store = demoStore();
  store.coupons = (store.coupons || []).filter(c => c.id !== id);
  demoSave(store);
  return { id };
}

/* ═══════════════════════════════════════════════════════════════════
   ANALYTICS
   ═══════════════════════════════════════════════════════════════════ */

export async function getRevenueData() {
  // [DEMO] const merchant = getMerchant();
  // [DEMO] const tenantId = merchant?.tenantId;
  // [DEMO] const res = await httpClient.get(`/api/v1/analytics/reports/revenue`, { params: { tenantId } });
  // [DEMO] return unwrapList(res);
  return [
    { w: "Week 1", v: 182000, week: "Week 1", revenue: 182000 },
    { w: "Week 2", v: 224500, week: "Week 2", revenue: 224500 },
    { w: "Week 3", v: 210000, week: "Week 3", revenue: 210000 },
    { w: "Week 4", v: 285000, week: "Week 4", revenue: 285000 },
  ];
}

export async function getOrderStats() {
  // [DEMO] const merchant = getMerchant();
  // [DEMO] const tenantId = merchant?.tenantId;
  // [DEMO] const res = await httpClient.get(`${tenantPath(tenantId)}/orders`);
  // [DEMO] return unwrapList(res);
  return [
    { name: "Completed", value: 24 },
    { name: "Pending", value: 6 },
    { name: "Cancelled", value: 3 },
  ];
}

export async function getTopProducts() {
  // [DEMO] const merchant = getMerchant();
  // [DEMO] const tenantId = merchant?.tenantId;
  // [DEMO] const res = await httpClient.get(`${tenantPath(tenantId)}/products`);
  // [DEMO] return unwrapList(res);
  return [
    { name: "Jollof Rice & Chicken", views: 1240, orders: 86, revenue: 215000, trend: "up" },
    { name: "Egusi Soup + Eba", views: 980, orders: 54, revenue: 172800, trend: "up" },
    { name: "Peppered Gizzard", views: 720, orders: 41, revenue: 73800, trend: "down" },
  ];
}

export async function getAnalyticsSummary() {
  // [DEMO] const merchant = getMerchant();
  // [DEMO] const tenantId = merchant?.tenantId;
  // [DEMO] const res = await httpClient.get(`/api/v1/analytics/summary`, { params: { tenantId } });
  // [DEMO] return res.data || res;
  return {
    customers: 328,
    revenue: 285000,
    unreadMessages: 4,
    avgRating: 4.8,
    reviewsCount: 234,
    orders: 33,
  };
}

/* ═══════════════════════════════════════════════════════════════════
   TENANT
   ═══════════════════════════════════════════════════════════════════ */

export async function createTenant(body) {
  try {
    const res = await httpClient.post("/api/v1/merchants", body);
    return res.data || res;
  } catch (e) {
    console.warn("[createTenant] backend unavailable, demo fallback", e?.message);
  }
  const store = demoStore();
  const slug = body?.slug || (body?.name || "my-business").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/^-+|-+$/g, "") || "my-business";
  store.tenant = { id: `tenant_${Date.now()}`, name: body?.name || "My Business", slug, category: body?.category || "Restaurant", status: "active", createdAt: new Date().toISOString() };
  store.merchant = store.tenant;
  demoSave(store);
  return { ...store.tenant };
}

export async function getTenant(id) {
  try {
    const res = await httpClient.get(`/api/v1/merchants/${id}`);
    return res.data || res;
  } catch (e) {
    console.warn("[getTenant] backend unavailable, demo fallback", e?.message);
  }
  const store = demoStore();
  return store.tenant.id === id ? { ...store.tenant } : null;
}

export async function suspendTenant(id) {
  try {
    const res = await httpClient.post(`/api/v1/merchants/${id}/suspend`);
    return res.data || res;
  } catch (e) {
    console.warn("[suspendTenant] backend unavailable, demo fallback", e?.message);
  }
  const store = demoStore();
  store.tenant = { ...store.tenant, status: "suspended" };
  store.merchant = store.tenant;
  demoSave(store);
  return { id, status: "suspended" };
}

export async function updateTenant(id, body) {
  try {
    const res = await httpClient.put(`/api/v1/merchants/${id}`, body);
    const data = res.data || res;
    const m = getMerchant();
    if (m && data) {
      const updated = { ...m, business: data.name || m.business };
      setMerchant(updated);
    }
    return data;
  } catch (e) {
    console.warn("[updateTenant] backend unavailable, demo fallback", e?.message);
  }
  const store = demoStore();
  store.tenant = { ...store.tenant, ...body };
  store.merchant = store.tenant;
  demoSave(store);
  const m = getMerchant();
  if (m) setMerchant({ ...m, business: body?.name || m.business });
  return { ...store.tenant };
}

export async function getTenantConfig(id) {
  try {
    const res = await httpClient.get(`/api/v1/merchants/${id}/config`);
    return res.data || res;
  } catch (e) {
    console.warn("[getTenantConfig] backend unavailable, demo fallback", e?.message);
  }
  const store = demoStore();
  return { id, config: store.config || {} };
}

export async function updateTenantConfig(id, body) {
  try {
    const res = await httpClient.put(`/api/v1/merchants/${id}/config`, body);
    return res.data || res;
  } catch (e) {
    console.warn("[updateTenantConfig] backend unavailable, demo fallback", e?.message);
  }
  const store = demoStore();
  store.config = { ...(store.config || {}), ...(body?.config || {}) };
  demoSave(store);
  return { id, config: store.config };
}

export async function publishTenant(id) {
  try {
    const res = await httpClient.post(`/api/v1/merchants/${id}/publish`);
    return res.data || res;
  } catch (e) {
    console.warn("[publishTenant] backend unavailable, demo fallback", e?.message);
  }
  const store = demoStore();
  if (store.config?.app) store.config.app.status = "live";
  demoSave(store);
  return { id, published: true };
}

/* ───── Tenant config (backend contract) ─────
   The backend stores runtime config in a Prisma `tenantConfig` table. The generic
   JSON payload lives in the `config` column (app, design, compliance, releases,
   integrationConfigs, …). Top-level columns are scalars only (languages, currency,
   timezone, region, offlinePolicy, searchSettings, notificationPrefs). */

const CONFIG_COLUMNS = ["languages", "currency", "timezone", "region", "offlinePolicy", "searchSettings", "notificationPrefs"];

function configRow(cfg) {
  if (!cfg) return {};
  if (cfg.data && typeof cfg.data === "object") return cfg.data;
  return cfg;
}

async function readConfig(tenantId) {
  const cfg = await getTenantConfig(tenantId).catch(() => ({}));
  const row = configRow(cfg);
  return { row, data: row.config && typeof row.config === "object" ? row.config : {} };
}

async function writeConfig(tenantId, patch) {
  const { row, data } = await readConfig(tenantId);
  const body = { config: { ...data, ...patch } };
  CONFIG_COLUMNS.forEach(k => {
    if (row[k] !== undefined) body[k] = row[k];
  });
  return updateTenantConfig(tenantId, body);
}

/* Create a tenant on first use (fresh signups have no tenant) and persist its id
   back onto the merchant so every tenant-scoped API call has a valid tenantId. */
export async function ensureTenant(name) {
  const merchant = getMerchant() || {};
  if (merchant.merchantId || merchant.tenantId) return merchant.merchantId || merchant.tenantId;

  const baseName = (name || merchant.business || merchant.name || "My Business").trim() || "My Business";
  const slugBase = baseName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/^-+|-+$/g, "").slice(0, 40);
  const candidate = slugBase || "my-business";

  let tenant = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    const slug = attempt === 0 ? candidate : `${candidate.slice(0, 32)}-${Math.floor(100 + Math.random() * 900)}`;
    try {
      const res = await createTenant({ name: baseName, slug });
      tenant = res.data || res;
      break;
    } catch {
      if (attempt === 2) throw new Error("Failed to create tenant");
    }
  }

  const tenantId = tenant?.id || tenant?.tenantId || tenant?.merchantId;
  if (!tenantId) throw new Error("Failed to create tenant");
  setMerchant({ ...merchant, tenantId, merchantId: tenantId, tenantSlug: tenant.slug || candidate, merchantSlug: tenant.slug || candidate });
  return tenantId;
}

/* ═══════════════════════════════════════════════════════════════════
   INTEGRATION CONFIG
   ═══════════════════════════════════════════════════════════════════ */

export async function getIntegrationConfig(name) {
  const merchant = getMerchant();
  const tenantId = merchant?.tenantId;
  if (!tenantId) return null;
  const { data } = await readConfig(tenantId);
  return data.integrationConfigs?.[name] || null;
}

export async function setIntegrationConfig(name, config) {
  const merchant = getMerchant();
  const tenantId = merchant?.tenantId;
  if (!tenantId) return;
  const { data } = await readConfig(tenantId);
  await writeConfig(tenantId, {
    integrationConfigs: {
      ...(data.integrationConfigs || {}),
      [name]: config,
    },
  });
}

/* ═══════════════════════════════════════════════════════════════════
   DESIGN / CANVAS
   ═══════════════════════════════════════════════════════════════════ */

export async function getDesignData() {
  const merchant = getMerchant();
  const tenantId = merchant?.tenantId;
  if (!tenantId) return null;
  const { data } = await readConfig(tenantId);
  return data.design || null;
}

export async function saveDesignData(design) {
  const merchant = getMerchant();
  const tenantId = merchant?.tenantId;
  if (!tenantId) return;
  await writeConfig(tenantId, { design });
}

/* ═══════════════════════════════════════════════════════════════════
   PUBLISHING / RELEASES
   ═══════════════════════════════════════════════════════════════════ */

export async function getReleases() {
  const merchant = getMerchant();
  const tenantId = merchant?.tenantId;
  if (!tenantId) return [];
  const { data } = await readConfig(tenantId);
  return data.releases || [];
}

export async function getCurrentDeployment() {
  const merchant = getMerchant();
  const tenantId = merchant?.tenantId;
  if (!tenantId) return null;
  const { data } = await readConfig(tenantId);
  return data.deployed || null;
}

export async function saveReleases(releases) {
  const merchant = getMerchant();
  const tenantId = merchant?.tenantId;
  if (!tenantId) return;
  await writeConfig(tenantId, { releases });
}

export async function saveDeployment(deployed) {
  const merchant = getMerchant();
  const tenantId = merchant?.tenantId;
  if (!tenantId) return;
  await writeConfig(tenantId, { deployed });
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

/* ───── Account Deactivation / Deletion (ADR-013) ───── */
export async function deactivateAccount(body = {}) {
  const res = await httpClient.post("/api/v1/profile/deactivate", body);
  return res.data || res;
}

export async function reactivateAccount(body = {}) {
  const res = await httpClient.post("/api/v1/profile/reactivate", body);
  return res.data || res;
}

export async function permanentlyDeleteAccount() {
  const res = await httpClient.delete("/api/v1/profile");
  return res.data || res;
}

export async function getDeactivationStatus() {
  try {
    const res = await httpClient.get("/api/v1/profile/deactivation-status");
    return res.data || res;
  } catch {
    return null;
  }
}

export async function requestFeature(featureName) {
  console.log("Feature requested:", featureName);
  return { success: true, message: "Feature request submitted" };
}

// Alias for merchants migration
const createMerchant = createTenant;

// Alias for merchants migration
const getMerchantById = getTenant;

// Alias for merchants migration
const suspendMerchant = suspendTenant;

// Alias for merchants migration
const getMerchantConfig = getTenantConfig;

// Alias for merchants migration
const updateMerchantConfig = updateTenantConfig;

// Alias for merchants migration
const updateMerchant = updateTenant;

// Alias for merchants migration
const publishMerchant = publishTenant;

// Alias for merchants migration
const ensureMerchant = ensureTenant;

// Alias for merchants migration
const fetchMerchantSilently = fetchTenantSilently;
