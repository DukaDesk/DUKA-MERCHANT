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

export function setupActionRouter({ navigate, logout }) {
  if (navigate) window.__router_push = navigate;
  if (logout) window.__logout = logout;
}

export function clearActionRouter() {
  delete window.__router_push;
  delete window.__logout;
}
