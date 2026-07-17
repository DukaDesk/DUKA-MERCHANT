import { EventBus } from "./EventBus";

const handlers = {};

export function registerHandler(type, handler) {
  handlers[type] = handler;
}

export function dispatchEngine(action, node) {
  if (!action || !action.type) return;
  const handler = handlers[action.type];
  if (!handler) {
    console.warn(`[ActionEngine] No handler for action type: "${action.type}"`);
    return;
  }
  handler(action, node);
}

registerHandler("navigate", (action) => {
  const { push } = action.payload || {};
  if (push && window.__router_push) window.__router_push(push);
});

registerHandler("replace", (action) => {
  const { push } = action.payload || {};
  if (push) window.location.replace(push);
});

registerHandler("push", (action) => {
  const { push } = action.payload || {};
  if (push && window.__router_push) window.__router_push(push);
});

registerHandler("pop", () => {
  window.history.back();
});

registerHandler("switch_screen", (action) => {
  EventBus.emit("navigation:switch_screen", action.payload);
});

registerHandler("filter", (action) => {
  EventBus.emit("filter:changed", action.payload);
});

registerHandler("submit_form", (action) => {
  EventBus.emit("form:submit", action.payload);
  if (action.payload?.api_request) {
    dispatchEngine({ type: "api_request", payload: action.payload.api_request });
  }
});

registerHandler("logout", () => {
  if (window.__logout) window.__logout();
});

registerHandler("open_url", (action) => {
  const url = action.payload?.url;
  if (url) window.open(url, "_blank");
});

registerHandler("call_phone", (action) => {
  const phone = action.payload?.phone;
  if (phone) window.location.href = `tel:${phone}`;
});

registerHandler("email", (action) => {
  const to = action.payload?.to;
  if (to) window.location.href = `mailto:${to}`;
});

registerHandler("add_to_cart", (action) => {
  EventBus.emit("cart:add", action.payload);
});

registerHandler("remove_from_cart", (action) => {
  EventBus.emit("cart:remove", action.payload);
});

registerHandler("update_cart_item", (action) => {
  EventBus.emit("cart:update", action.payload);
});

registerHandler("checkout", (action) => {
  EventBus.emit("cart:checkout", action.payload);
});

registerHandler("apply_coupon", (action) => {
  EventBus.emit("cart:coupon_apply", action.payload);
});

registerHandler("remove_coupon", (action) => {
  EventBus.emit("cart:coupon_remove", action.payload);
});

registerHandler("cancel_order", (action) => {
  EventBus.emit("order:cancel", action.payload);
});

registerHandler("track_delivery", (action) => {
  EventBus.emit("order:track", action.payload);
});

registerHandler("open_maps", (action) => {
  const query = action.payload?.query;
  if (query) window.open(`https://maps.google.com?q=${encodeURIComponent(query)}`, "_blank");
});

registerHandler("share", async (action) => {
  const { title, text, url } = action.payload || {};
  if (navigator.share) {
    try { await navigator.share({ title, text, url }); } catch { /* user cancelled or share not supported */ }
  } else if (url) {
    navigator.clipboard?.writeText(url);
  }
});

registerHandler("download", (action) => {
  const { url, filename } = action.payload || {};
  if (url) {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || "download";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
});

/* ── Booking ── */

registerHandler("book_appointment", (action) => {
  EventBus.emit("booking:create", action.payload);
});

registerHandler("cancel_booking", (action) => {
  EventBus.emit("booking:cancel", action.payload);
});

registerHandler("reschedule", (action) => {
  EventBus.emit("booking:reschedule", action.payload);
});

registerHandler("check_availability", (action) => {
  EventBus.emit("booking:check_availability", action.payload);
});

registerHandler("assign_resource", (action) => {
  EventBus.emit("booking:assign_resource", action.payload);
});

/* ── Notifications ── */

registerHandler("send_notification", (action) => {
  EventBus.emit("notification:send", action.payload);
});

registerHandler("mark_read", (action) => {
  EventBus.emit("notification:mark_read", action.payload);
});

registerHandler("subscribe", (action) => {
  EventBus.emit("notification:subscribe", action.payload);
});

registerHandler("unsubscribe", (action) => {
  EventBus.emit("notification:unsubscribe", action.payload);
});

/* ── Device ── */

registerHandler("capture_photo", (action) => {
  EventBus.emit("device:capture_photo", action.payload);
});

registerHandler("scan_qr", (action) => {
  EventBus.emit("device:scan_qr", action.payload);
});

registerHandler("get_location", (action) => {
  EventBus.emit("device:get_location", action.payload);
});

registerHandler("record_audio", (action) => {
  EventBus.emit("device:record_audio", action.payload);
});

registerHandler("connect_bluetooth", (action) => {
  EventBus.emit("device:connect_bluetooth", action.payload);
});

registerHandler("read_nfc", (action) => {
  EventBus.emit("device:read_nfc", action.payload);
});

registerHandler("authenticate_biometric", (action) => {
  EventBus.emit("device:authenticate_biometric", action.payload);
});

/* ── Runtime ── */

registerHandler("runtime_initialize", (action) => {
  EventBus.emit("runtime:initialize", action.payload);
});

registerHandler("runtime_sync", (action) => {
  EventBus.emit("runtime:sync", action.payload);
});

registerHandler("runtime_clear_cache", (action) => {
  EventBus.emit("runtime:clear_cache", action.payload);
});

registerHandler("runtime_restart", (action) => {
  EventBus.emit("runtime:restart", action.payload);
});

registerHandler("runtime_get_status", (action) => {
  EventBus.emit("runtime:get_status", action.payload);
});

/* ── Data (extended) ── */

registerHandler("data_load", (action) => {
  EventBus.emit("data:load", action.payload);
});

registerHandler("data_refresh", (action) => {
  EventBus.emit("data:refresh", action.payload);
});

registerHandler("data_create", (action) => {
  EventBus.emit("data:create", action.payload);
});

registerHandler("data_update", (action) => {
  EventBus.emit("data:update", action.payload);
});

registerHandler("data_delete", (action) => {
  EventBus.emit("data:delete", action.payload);
});

registerHandler("data_search", (action) => {
  EventBus.emit("data:search", action.payload);
});

registerHandler("data_sort", (action) => {
  EventBus.emit("data:sort", action.payload);
});

registerHandler("data_export", (action) => {
  EventBus.emit("data:export", action.payload);
});

registerHandler("data_import", (action) => {
  EventBus.emit("data:import", action.payload);
});

/* ── Forms (extended) ── */

registerHandler("form_validate", (action) => {
  EventBus.emit("form:validate", action.payload);
});

registerHandler("form_save_draft", (action) => {
  EventBus.emit("form:save_draft", action.payload);
});

registerHandler("form_reset", (action) => {
  EventBus.emit("form:reset", action.payload);
});

registerHandler("form_upload_file", (action) => {
  EventBus.emit("form:upload_file", action.payload);
});

/* ── Auth (extended) ── */

registerHandler("auth_login", (action) => {
  EventBus.emit("auth:login", action.payload);
});

registerHandler("auth_refresh_session", (action) => {
  EventBus.emit("auth:refresh_session", action.payload);
});

registerHandler("auth_verify_otp", (action) => {
  EventBus.emit("auth:verify_otp", action.payload);
});

registerHandler("auth_change_password", (action) => {
  EventBus.emit("auth:change_password", action.payload);
});

registerHandler("auth_request_reset", (action) => {
  EventBus.emit("auth:request_reset", action.payload);
});

/* ── Integration (extended) ── */

registerHandler("webhook", (action) => {
  EventBus.emit("integration:webhook", action.payload);
});

registerHandler("api_call", (action) => {
  EventBus.emit("integration:api_call", action.payload);
});

registerHandler("process_payment", (action) => {
  EventBus.emit("integration:process_payment", action.payload);
});

registerHandler("send_message", (action) => {
  EventBus.emit("integration:send_message", action.payload);
});

registerHandler("send_email", (action) => {
  const { to, subject } = action.payload || {};
  if (to) window.location.href = `mailto:${to}${subject ? "?subject=" + encodeURIComponent(subject) : ""}`;
});

registerHandler("send_sms", (action) => {
  const { phone, message } = action.payload || {};
  if (phone) window.location.href = `sms:${phone}${message ? "?body=" + encodeURIComponent(message) : ""}`;
});

registerHandler("send_push", (action) => {
  EventBus.emit("integration:send_push", action.payload);
});

export function setupActionRouter({ navigate, logout }) {
  if (navigate) window.__router_push = navigate;
  if (logout) window.__logout = logout;
}

export function clearActionRouter() {
  delete window.__router_push;
  delete window.__logout;
}
