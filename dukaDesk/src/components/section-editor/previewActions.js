/* Builder preview action engine.
 *
 * The canvas stores press behavior in a few shapes:
 *   - component-level `props.tapAction` / legacy `props.action` (JSON string)
 *   - named events in `props.actions[key]` (JSON string)
 *   - per-list-item `item.tapAction` (JSON string)
 * The mobile runtime also gives template components implicit event behavior
 * (addItem, viewDetails, checkout…). The preview mirrors both so every control
 * gives real feedback instead of silently doing nothing.
 */

export function parseActionValue(raw) {
  if (!raw) return null;
  if (typeof raw === "object") return raw;
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : null;
    } catch {
      return null;
    }
  }
  return null;
}

export function parsePreviewAction(comp) {
  const props = comp?.props || {};
  const actions = { ...comp?.actions, ...props.actions };
  const raw = props.tapAction || props.action || actions.selectItem || actions.filter || actions.default || actions.tap;
  return parseActionValue(raw);
}

export function resolveActionTarget(action) {
  if (!action || typeof action !== "object") return null;
  return action.payload?.push || action.payload?.screen || action.payload?.screenId || action.payload?.target || null;
}

export function findPreviewScreenId(data, keyword) {
  const ids = Object.keys(data?.screens || {});
  if (ids.length === 0) return null;
  const lower = String(keyword).toLowerCase();
  return ids.find(id => id.toLowerCase().includes(lower))
    || ids.find(id => String(data.screens?.[id]?.name || "").toLowerCase().includes(lower))
    || null;
}

export function findSectionInDesign(data, sectionId) {
  if (!data || !sectionId) return null;
  const shared = data.shared && Object.values(data.shared).find(s => s.id === sectionId);
  if (shared) return shared;
  for (const s of Object.values(data.screens || {})) {
    const sec = (s.bodySections || []).find(x => x.id === sectionId);
    if (sec) return sec;
  }
  return null;
}

export function resolvePreviewChrome(screenDef, data, type) {
  const cfg = screenDef?.chrome?.[type] || { mode: "inherit" };
  if (cfg.mode === "hide") return null;
  if (cfg.mode === "custom" && cfg.sectionId) {
    return findSectionInDesign(data, cfg.sectionId) || data?.shared?.[type] || null;
  }
  return data?.shared?.[type] || null;
}

export function runPreviewAction(rawAction, context = {}) {
  const { data, currentScreenId, navigate, back, notify, openUrl, setLocation } = context;
  const action = parseActionValue(rawAction);
  if (!action) return false;
  const { type, payload = {} } = action;
  if (!type) return false;

  switch (type) {
    case "pop":
    case "back":
      back?.();
      return true;
    case "add_to_cart":
      notify?.("Item added to cart", "success");
      return true;
    case "remove_from_cart":
      notify?.("Item removed from cart", "info");
      return true;
    case "checkout": {
      const cartScreen = findPreviewScreenId(data, "cart");
      if (!cartScreen) {
        notify?.("Checkout opened", "info");
        return true;
      }
      if (cartScreen !== currentScreenId) navigate?.(cartScreen, "push");
      return true;
    }
    case "refresh":
    case "data_refresh":
      notify?.("Content refreshed", "info");
      return true;
    case "submit_form":
    case "api_request":
      notify?.("Submitted successfully", "success");
      return true;
    case "show_toast":
    case "toast":
      notify?.(payload.message || payload.text || "Action triggered", "info");
      return true;
    case "call_phone":
      if (!payload.phone) return false;
      setLocation?.(`tel:${payload.phone}`);
      return true;
    case "email":
      if (!payload.to) return false;
      setLocation?.(`mailto:${payload.to}`);
      return true;
    case "open_url":
    case "open_link": {
      const url = payload.url || payload.href;
      if (!url) return false;
      openUrl?.(url);
      return true;
    }
    default:
      break;
  }

  const target = resolveActionTarget(action);
  if (typeof target !== "string" || !target) return false;
  const replace = type === "replace" || type === "switch_screen" || type === "tab";
  navigate?.(target, replace ? "replace" : "push");
  return true;
}

export function runPreviewEvent(comp, eventKey, payload = {}, context = {}) {
  const { data, currentScreenId, navigate, back, notify } = context;
  const configured = { ...(comp?.actions || {}), ...(comp?.props?.actions || {}) };
  if (configured[eventKey] && runPreviewAction(configured[eventKey], context)) return true;

  /* Some components emit a raw action type (e.g. info_list item.action). */
  if (!configured[eventKey] && runPreviewAction({ ...payload, type: eventKey }, context)) return true;

  const componentAction = parsePreviewAction(comp);
  switch (eventKey) {
    case "addItem":
      notify?.("Item added to cart", "success");
      return true;
    case "removeItem":
      notify?.("Item removed from cart", "info");
      return true;
    case "viewDetails":
    case "selectItem":
    case "openItem": {
      const detail = findPreviewScreenId(data, "detail") || findPreviewScreenId(data, "product") || findPreviewScreenId(data, "menu");
      if (detail && detail !== currentScreenId) navigate?.(detail, "push");
      else notify?.("Item selected", "info");
      return true;
    }
    case "selectOrder":
    case "viewOrder": {
      const orderScreen = findPreviewScreenId(data, "order");
      if (orderScreen) navigate?.(orderScreen, "push");
      else notify?.("Order selected", "info");
      return true;
    }
    case "confirm":
    case "submit":
      notify?.("Submitted successfully", "success");
      return true;
    case "back":
      back?.();
      return true;
    default:
      /* The wrapping component press handler will run props.tapAction. */
      if (componentAction) return true;
      notify?.(`${eventKey} — preview action`, "info");
      return true;
  }
}

export function runPreviewItemPress(comp, item, context = {}) {
  const raw = item?.tapAction ?? item?.action;
  if (raw && runPreviewAction(raw, context)) return true;
  if (item?.screenId) {
    context.navigate?.(item.screenId, "push");
    return true;
  }
  if (item?.screen) {
    context.navigate?.(item.screen, "push");
    return true;
  }
  return runPreviewAction(parsePreviewAction(comp), context);
}
