import httpClient from "./httpClient";

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

/* ───── Compliance ───── */
export async function submitCompliance(tenantId, formData) {
  const { idDoc, bizDoc, utrDoc, ...info } = formData;
  await updateTenant(tenantId, {
    name: info.businessName,
    phone: info.phone,
    address: `${info.address}, ${info.city || ""}, ${info.state || ""}, ${info.country || ""}`,
  });
  const config = await getTenantConfig(tenantId).catch(() => ({}));
  const existing = config.data || config;
  await updateTenantConfig(tenantId, {
    ...existing,
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
      idDoc: idDoc ? { name: idDoc.name } : null,
      bizDoc: bizDoc ? { name: bizDoc.name } : null,
      utrDoc: utrDoc ? { name: utrDoc.name } : null,
      complianceDone: true,
      submittedAt: new Date().toISOString(),
    },
  });
  return { success: true };
}

export async function getComplianceStatus(tenantId) {
  try {
    const config = await getTenantConfig(tenantId);
    const data = config.data || config;
    return !!(data?.compliance?.complianceDone);
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

function slugify(text) {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "");
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

export async function deployApp(appData) {
  const merchant = getMerchant();
  const tenantId = merchant?.tenantId;
  if (!tenantId) throw new Error("No tenant — signup required");

  const slug = (appData.appName || "").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const storeUrl = `dukadesk.app/${slug}`;

  const config = await getTenantConfig(tenantId).catch(() => ({}));
  const existing = config.data || config;

  await updateTenantConfig(tenantId, {
    ...existing,
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
  const merchant = getMerchant();
  const tenantId = merchant?.tenantId;
  if (!tenantId) throw new Error("No tenant");

  const config = await getTenantConfig(tenantId);
  const existing = config.data || config;
  const app = existing.app || {};

  await updateTenantConfig(tenantId, {
    ...existing,
    app: { ...app, ...appData, updatedAt: new Date().toISOString() },
  });

  return { app: { ...app, ...appData }, message: "App updated successfully!" };
}

export async function getMyApp() {
  const merchant = getMerchant();
  const tenantId = merchant?.tenantId;
  if (!tenantId) return null;
  const config = await getTenantConfig(tenantId);
  const data = config.data || config;
  return data?.app || null;
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
  try {
    const merchant = getMerchant();
    const tenantId = merchant?.tenantId;
    if (!tenantId) return [];
    const res = await httpClient.get(`${tenantPath(tenantId)}/orders`, { params: { limit: 5 } });
    const orders = res.data || res;
    if (Array.isArray(orders)) {
      return orders.map(o => ({
        icon: "🛒",
        title: `New order from ${o.customer || "customer"}`,
        sub: `₦${(o.total || 0).toLocaleString()}`,
        time: o.date || "recent",
        color: "#F4A026",
      }));
    }
    return [];
  } catch {
    return [];
  }
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
  const res = await httpClient.get(`${tenantPath(tenantId)}/products`);
  return res.data || res;
}

export async function createProduct(body) {
  const merchant = getMerchant();
  const tenantId = merchant?.tenantId;
  const res = await httpClient.post(`${tenantPath(tenantId)}/products`, body);
  return res.data || res;
}

export async function updateProduct(id, body) {
  const res = await httpClient.put(`/api/v1/products/${id}`, body);
  return res.data || res;
}

export async function deleteProduct(id) {
  const res = await httpClient.delete(`/api/v1/products/${id}`);
  return res.data || res;
}

/* ═══════════════════════════════════════════════════════════════════
   ORDERS
   ═══════════════════════════════════════════════════════════════════ */

export async function getOrders() {
  const merchant = getMerchant();
  const tenantId = merchant?.tenantId;
  const res = await httpClient.get(`${tenantPath(tenantId)}/orders`);
  return res.data || res;
}

export async function updateOrderStatus(id, status) {
  const res = await httpClient.post(`/api/v1/orders/${id}/status`, { status });
  return res.data || res;
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
  const merchant = getMerchant();
  const tenantId = merchant?.tenantId;
  const res = await httpClient.get(`${tenantPath(tenantId)}/integrations`);
  return res.data || res;
}

export async function toggleIntegration(name, active) {
  const merchant = getMerchant();
  const tenantId = merchant?.tenantId;
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
  const res = await httpClient.get(`${tenantPath(tenantId)}/subscription`);
  return res.data || res;
}

export async function getPlans() {
  const res = await httpClient.get("/api/v1/bff/website/pricing");
  return res.data || res;
}

export async function getBillingHistory() {
  const merchant = getMerchant();
  const tenantId = merchant?.tenantId;
  const res = await httpClient.get(`${tenantPath(tenantId)}/billing-history`);
  return res.data || res;
}

export async function upgradePlan(body) {
  const merchant = getMerchant();
  const tenantId = merchant?.tenantId;
  const res = await httpClient.post(`${tenantPath(tenantId)}/subscribe`, body);
  return res.data || res;
}

/* ═══════════════════════════════════════════════════════════════════
   ANALYTICS
   ═══════════════════════════════════════════════════════════════════ */

export async function getRevenueData() {
  const merchant = getMerchant();
  const tenantId = merchant?.tenantId;
  const res = await httpClient.get(`/api/v1/analytics/reports/revenue`, { params: { tenantId } });
  return res.data || res;
}

export async function getOrderStats() {
  const merchant = getMerchant();
  const tenantId = merchant?.tenantId;
  const res = await httpClient.get(`${tenantPath(tenantId)}/orders`);
  return res.data || res;
}

export async function getTopProducts() {
  const merchant = getMerchant();
  const tenantId = merchant?.tenantId;
  const res = await httpClient.get(`${tenantPath(tenantId)}/products`);
  return res.data || res;
}

export async function getAnalyticsSummary() {
  const merchant = getMerchant();
  const tenantId = merchant?.tenantId;
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
