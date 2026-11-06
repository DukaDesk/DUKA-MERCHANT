import { useState, useEffect, useCallback, useMemo } from "react";
import { ScreenRenderer } from "../../runtime/layouts";
import "./TemplateComponents";
import { loadAllTemplateScreens } from "../../services/TemplateLoader";
import SharedAppPreview from "../../runtime/SharedAppPreview";
function getScreenPreviewData() {
  return {};
}

export function TemplateRenderer({ templateId, screenId, onAction, previewData: externalPreviewData = {}, screens: screensOverride }) {
  const [screenDef, setScreenDef] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadScreen = useCallback(async () => {
    if (!screenId) return;
    if (screensOverride && screensOverride[screenId]) {
      setScreenDef(screensOverride[screenId]);
      setLoading(false);
      setError(null);
      return;
    }
    if (!templateId) return;
    setLoading(true);
    setError(null);
    try {
      const { screens } = await loadAllTemplateScreens(templateId);
      setScreenDef(screens[screenId] || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [templateId, screenId, screensOverride]);

  useEffect(() => {
    loadScreen();
  }, [loadScreen]);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 200, color: "#9CA3AF" }}>
        Loading template...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 20, background: "#FEF2F2", border: "1px solid #E74C3C", borderRadius: 8, color: "#991B1B" }}>
        Error loading screen: {error}
      </div>
    );
  }

  if (!screenDef) {
    return (
      <div style={{ padding: 20, textAlign: "center", color: "#9CA3AF" }}>
        Screen "{screenId}" not found in template "{templateId}"
      </div>
    );
  }

  // Get preview data for this screen (use prop or fetch based on category)
  const screenPreviewData = useMemo(() => getScreenPreviewData(screenId, "Restaurant"), [screenId]);

  // Merge preview data into screen definition
  const enhancedScreenDef = useMemo(() => {
    if (!screenDef) return screenDef;
    
    // Deep clone and enhance the screen definition with preview data
    const enhanced = JSON.parse(JSON.stringify(screenDef));
    
    // Enhance layout children with preview data
    const enhanceNode = (node) => {
      if (!node) return node;
      
      // If this node has a type that we have preview data for, inject the data
      const nodeType = node.type;
      
      if (nodeType === "menu_grid" && screenPreviewData.items) {
        return { ...node, props: { ...node.props, items: screenPreviewData.items } };
      }
      if (nodeType === "category_pills" && screenPreviewData.categories) {
        return { ...node, props: { ...node.props, categories: screenPreviewData.categories } };
      }
      if (nodeType === "menu_grid" && screenPreviewData.items) {
        return { ...node, props: { ...node.props, items: screenPreviewData.items } };
      }
      if (nodeType === "order_history" && screenPreviewData.orders) {
        return { ...node, props: { ...node.props, orders: screenPreviewData.orders } };
      }
      if (nodeType === "info_list" && screenPreviewData.items) {
        return { ...node, props: { ...node.props, items: screenPreviewData.items } };
      }
      if (nodeType === "notification_list" && screenPreviewData.notifications) {
        return { ...node, props: { ...node.props, notifications: screenPreviewData.notifications } };
      }
      if (nodeType === "cart_summary" && screenPreviewData.items) {
        return { ...node, props: { ...node.props, items: screenPreviewData.items } };
      }
      if (nodeType === "order_history" && screenPreviewData.orders) {
        return { ...node, props: { ...node.props, orders: screenPreviewData.orders } };
      }
      if (nodeType === "promotion_list" && screenPreviewData.offers) {
        return { ...node, props: { ...node.props, offers: screenPreviewData.offers } };
      }
      if (nodeType === "hero_banner" && screenPreviewData.title) {
        return { ...node, props: { ...node.props, title: screenPreviewData.title, subtitle: screenPreviewData.subtitle } };
      }
      if (nodeType === "address_form" && screenPreviewData.items) {
        return { ...node, props: { ...node.props, items: screenPreviewData.items } };
      }
      if (nodeType === "report_action" && screenPreviewData.items) {
        return { ...node, props: { ...node.props, items: screenPreviewData.items } };
      }
      if (nodeType === "notification_list" && screenPreviewData.notifications) {
        return { ...node, props: { ...node.props, notifications: screenPreviewData.notifications } };
      }
      if (nodeType === "primary_button" && screenPreviewData.label) {
        return { ...node, props: { ...node.props, label: screenPreviewData.label } };
      }
      if (nodeType === "calendar_strip" && screenPreviewData.dates) {
        return { ...node, props: { ...node.props, dates: screenPreviewData.dates } };
      }
      if (nodeType === "slot_grid" && screenPreviewData.slots) {
        return { ...node, props: { ...node.props, slots: screenPreviewData.slots } };
      }
      if (nodeType === "booking_summary" && screenPreviewData.booking) {
        return { ...node, props: { ...node.props, booking: screenPreviewData.booking } };
      }
      if (nodeType === "cart_summary" && screenPreviewData.cart) {
        return { ...node, props: { ...node.props, cart: screenPreviewData.cart } };
      }
      if (nodeType === "address_form" && screenPreviewData.items) {
        return { ...node, props: { ...node.props, items: screenPreviewData.items } };
      }
      if (nodeType === "promotion_list" && screenPreviewData.offers) {
        return { ...node, props: { ...node.props, offers: screenPreviewData.offers } };
      }
      if (nodeType === "section_header" && screenPreviewData.title) {
        return { ...node, props: { ...node.props, children: screenPreviewData.title } };
      }
      if (nodeType === "dynamic_card" && screenPreviewData.items) {
        return { ...node, props: { ...node.props, items: screenPreviewData.items } };
      }
      
      // Recursively enhance children
      if (node.children && Array.isArray(node.children)) {
        return { ...node, children: node.children.map(enhanceNode) };
      }
      if (node.layout && node.layout.children && Array.isArray(node.layout.children)) {
        return { ...node, layout: { ...node.layout, children: node.layout.children.map(enhanceNode) } };
      }
      
return node;
    }
    
    return enhanceNode(enhanced);
  }, [screenDef]);

  const mergedProps = {
    extraProps: { 
      onAction,
      // Pass preview data as context for components that need it
      previewData: screenPreviewData 
    },
  };

  return <ScreenRenderer screenDef={enhancedScreenDef} extraProps={mergedProps} />;
}

/* ── Preview runtime helpers (exported for tests) ─────────────────────
   The builder preview behaves like the mobile app with API calls stubbed:
   - cart_summary nodes render the preview cart instead of JSON placeholders
   - order_history nodes render preview (simulated) orders
   - navigation resolves screen ids with dash/underscore/case tolerance */

export function normalizeScreenId(value) {
  return String(value || "").toLowerCase().replace(/[-_]/g, "");
}

export function resolvePreviewScreen(screens, candidates) {
  const ids = Object.keys(screens || {});
  for (const candidate of candidates || []) {
    const want = normalizeScreenId(candidate);
    const found = ids.find(id => normalizeScreenId(id) === want);
    if (found) return found;
  }
  return null;
}

function screenNodeTypes(screen) {
  const types = new Set();
  const walk = (nodes) => {
    for (const node of nodes || []) {
      if (!node || typeof node !== "object" || Array.isArray(node)) continue;
      if (node.type) types.add(node.type);
      walk(node.children);
      walk(node.components);
      walk(node.layout?.children);
    }
  };
  walk(screen?.layout?.children);
  walk(screen?.children);
  return types;
}

export function findScreenWithComponent(screens, type) {
  for (const [id, screen] of Object.entries(screens || {})) {
    if (screenNodeTypes(screen).has(type)) return id;
  }
  return null;
}

export function injectPreviewState(node, cartItems, previewOrders) {
  if (!node || typeof node !== "object") return node;
  if (!cartItems && !previewOrders) return node;
  const copy = Array.isArray(node) ? [...node] : { ...node };
  if (!Array.isArray(node) && node.type === "cart_summary" && cartItems) {
    copy.props = { ...(node.props || {}), items: cartItems };
  }
  if (!Array.isArray(node) && node.type === "order_history" && previewOrders) {
    copy.props = { ...(node.props || {}), orders: previewOrders };
  }
  for (const key of ["children", "components"]) {
    if (Array.isArray(copy[key])) copy[key] = copy[key].map(child => injectPreviewState(child, cartItems, previewOrders));
  }
  if (copy.layout && typeof copy.layout === "object") {
    copy.layout = { ...copy.layout };
    if (Array.isArray(copy.layout.children)) copy.layout.children = copy.layout.children.map(child => injectPreviewState(child, cartItems, previewOrders));
  }
  return copy;
}

/* Build a simulated order from the preview cart (no API call). Returns
   { order } on success or { error } when the cart is empty. */
export function buildPreviewOrder(cart, existingCount = 0) {
  const entries = Object.entries(cart || {}).filter(([, line]) => (line?.qty || 0) > 0);
  if (!entries.length) return { error: "Your preview cart is empty — add items first" };
  const lines = entries.map(([, line]) => `${line.qty}x ${line.name || "Item"}`);
  const total = entries.reduce((sum, [, line]) => sum + (Number(line.price) || 0) * line.qty, 0);
  return {
    order: {
      id: `Preview #${existingCount + 1}`,
      status: "Processing",
      sub: lines.join(", "),
      total,
      date: "Just now",
    },
  };
}

export function TemplatePreview({ templateId, initialScreenId, manifest, screens, onScreenChange, cartItems, previewOrders, controlledScreenId }) {
  const [state, setState] = useState({ manifest: null, screens: {} });

  useEffect(() => {
    if (manifest && screens && Object.keys(screens).length > 0) {
      setState({ manifest, screens });
    } else if (templateId) {
      loadAllTemplateScreens(templateId).then(({ manifest: m, screens: s }) => setState({ manifest: m, screens: s }));
    }
  }, [templateId, manifest, screens]);

  if (!state.manifest || Object.keys(state.screens).length === 0) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300, color: "#9CA3AF" }}>
        Loading template...
      </div>
    );
  }

  return (
    <SharedAppPreview
      manifest={state.manifest}
      screens={state.screens}
      initialScreenId={initialScreenId}
      onScreenChange={(id, stack) => onScreenChange?.(id, stack)}
      cartItems={cartItems}
      previewOrders={previewOrders}
      controlledScreenId={controlledScreenId}
      readOnly={false}
    />
  );
}

export function TemplateScreenList({ templateId, onSelect }) {
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllTemplateScreens(templateId).then(({ screens }) => {
      setScreens(Object.entries(screens).map(([id, def]) => ({ id, title: def.title || id })));
      setLoading(false);
    });
  }, [templateId]);

  if (loading) return <div style={{ padding: 20, color: "#9CA3AF" }}>Loading screens...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {screens.map(({ id, title }) => (
        <button
          key={id}
          onClick={() => onSelect(id)}
          style={{
            textAlign: "left",
            padding: "12px 16px",
            background: "#fff",
            border: "1px solid #E5E7EB",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 14,
            color: "#0F0F1A",
            transition: "all 0.2s"
          }}
        >
          {title} ({id})
        </button>
      ))}
    </div>
  );
}