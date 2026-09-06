import { useState, useEffect, useCallback, useMemo } from "react";
import { LayoutRenderer, ScreenRenderer } from "../../runtime/layouts";
import { RuntimeContext } from "../../runtime/RuntimeContext";
import { Home, Calendar, ClipboardList, ShoppingCart, User, Store, Tag, Utensils, Info, Megaphone, Trophy, Heart, BookOpen, Users, Briefcase, CreditCard, ShoppingBag, Video, Phone } from "lucide-react";
import { TemplateComponents } from "./TemplateComponents";
import { loadAllTemplateScreens } from "../../services/TemplateLoader";
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

const linkToScreen = (target, screenRefs) => {
  if (!target) return null;
  const expected = String(target).replace(/^\//, "").replace(/-/g, "").replace(/_/g, "");
  const found = screenRefs.find(s => {
    const rawId = String(s?.id ?? s?.screenId);
    const id = rawId.replace(/-/g, "").replace(/_/g, "");
    return id === expected || rawId === String(target) || id === expected.toLowerCase() || rawId.toLowerCase() === String(target).toLowerCase();
  });
  return found ? (found.id ?? found.screenId) : null;
};

/* App-like shell that mirrors manifest tabs at the bottom and pushes detail screens
   via an in-preview navigation stack with a back button. */
function AppSplash({ manifest }) {
  const [leaving, setLeaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setLeaving(true), 3000);
    const t2 = setTimeout(() => setDone(true), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (done) return null;

  const splash = manifest?.splash || {};
  const brandColor = manifest?.theme?.primaryColor || "#1B4332";
  const bgColor = splash.backgroundColor || manifest?.theme?.bgColor || manifest?.theme?.backgroundColor || "#1A1A2E";
  const bgImage = splash.backgroundImage || "";
  const logo = splash.logo || manifest?.meta?.logo || manifest?.assets?.logo || manifest?.assets?.icon;
  const name = manifest?.meta?.appName || manifest?.branding?.appName || manifest?.name || "My App";
  const tagline = manifest?.branding?.tagline || "Tap to explore";
  const isImage = typeof logo === "string" && /^(https?:|data:)/.test(logo);
  const background = bgImage ? `url(${bgImage}) center/cover no-repeat` : bgColor;

  return (
    <div style={{
      position: "absolute",
      inset: 0,
      zIndex: 50,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 16,
      background: background,
      transition: "opacity 0.3s ease",
      opacity: leaving ? 0 : 1,
      fontFamily: "'Sora', sans-serif",
      textAlign: "center",
      padding: 24,
    }}>
      <div style={{
        width: 84,
        height: 84,
        borderRadius: 22,
        background: `linear-gradient(135deg, ${brandColor}, ${brandColor}CC)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 40,
        boxShadow: `0 12px 32px ${brandColor}40`,
        overflow: "hidden",
      }}>
        {isImage ? (
          <img src={logo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span>{logo || name.charAt(0).toUpperCase()}</span>
        )}
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: brandColor, lineHeight: 1.2 }}>
        {name}
      </div>
      {tagline && <div style={{ fontSize: 13, color: "#6B7280", marginTop: -8 }}>{tagline}</div>}
    </div>
  );
}

function TemplateAppShell({ manifest, screens, initialScreenId, onScreenChange }) {
  const [stack, setStack] = useState(() => [initialScreenId || manifest?.navigation?.initialScreen || Object.keys(screens)[0]]);
  const currentScreenId = stack[stack.length - 1];

  const screenRefs = manifest?.screens || Object.keys(screens || {}).map(id => ({ id }));

  const navigateTo = (target) => {
    const id = linkToScreen(target, screenRefs);
    if (!id) return;
    setStack(prev => {
      const next = [...prev, id];
      onScreenChange?.(id, next);
      return next;
    });
  };

  const switchTab = (screenId) => {
    if (!screenId || screenId === currentScreenId) return;
    setStack([screenId]);
  };

  const goBack = () => {
    setStack(prev => {
      if (prev.length <= 1) return prev;
      const next = prev.slice(0, -1);
      onScreenChange?.(next[next.length - 1], next);
      return next;
    });
  };

  const dispatchAction = (actionDef) => {
    if (!actionDef) return;
    const { type, payload = {} } = actionDef;
    if (type === "navigate" || type === "push" || type === "replace") {
      navigateTo(payload.push || payload.screen || payload.screenId);
    } else if (type === "pop") {
      goBack();
    } else if (type === "switch_screen") {
      switchTab(payload.screenId);
    } else if (type === "logout") {
      window.__logout?.();
    } else {
      onScreenChange?.(type, payload);
    }
  };

  const tabs = manifest?.navigation?.tabs || [];
  const isRoot = stack.length === 1;

  return (
    <RuntimeContext.Provider value={{ dispatchAction }}>
      <div style={{ position: "relative", display: "flex", flexDirection: "column", height: "100%" }}>
        <AppSplash manifest={manifest} />
        {/* App header */}
        <div style={{
          background: manifest?.theme?.primaryColor || "#1B4332",
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexShrink: 0,
          color: "#fff",
        }}>
          {!isRoot && (
            <button
              onClick={goBack}
              style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, padding: 0, fontFamily: "inherit", fontSize: 13, fontWeight: 600 }}
            >
              <span style={{ fontSize: 18 }}>←</span> Back
            </button>
          )}
          <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 15, flex: 1, textAlign: isRoot ? "center" : "left", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {screens[currentScreenId]?.title || pathScreenTitle(currentScreenId)}
          </span>
          <span style={{ width: 24 }} />
        </div>

        {/* Screen body */}
        <div style={{ flex: 1, overflow: "auto", background: manifest?.theme?.bgColor || manifest?.theme?.backgroundColor || "#F9FAFB" }}>
          <TemplateRenderer
            templateId={manifest?.templateId}
            screenId={currentScreenId}
            screens={screens}
            onAction={(actionKey, payload) => {
              dispatchAction({ type: actionKey, payload });
            }}
          />
        </div>

        {/* Bottom tab bar */}
        {tabs.length > 0 && (
          <div style={{
            display: "flex",
            background: manifest?.navigation?.style?.background || "#fff",
            borderTop: "1px solid #E5E7EB",
            flexShrink: 0,
            padding: "4px 0 8px",
          }}>
            {tabs.map(tab => {
              const active = tab.screenId === currentScreenId;
              const color = active
                ? (tab.color || manifest?.navigation?.style?.active || "#1B4332")
                : (manifest?.navigation?.style?.inactive || "#9CA3AF");
              return (
                <button
                  key={tab.screenId || tab.id || tab.label}
                  onClick={() => switchTab(tab.screenId)}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 3,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "6px 4px",
                    fontFamily: "inherit",
                    color,
                    fontSize: 10,
                    fontWeight: active ? 700 : 500,
                  }}
                >
                  <TabIcon icon={tab.icon} active={active} color={color} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </RuntimeContext.Provider>
  );
}

function pathScreenTitle(id) {
  return id.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function TabIcon({ icon, active, color }) {
  if (typeof icon === "string") {
    const Icon = TAB_ICONS[icon];
    if (Icon) {
      return <Icon size={20} strokeWidth={active ? 2.4 : 1.8} color={color} />;
    }
    return <span style={{ fontSize: 18, height: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon || "•"}</span>;
  }
  // If icon is a component object, render it as a span to avoid child crashes
  return <span style={{ fontSize: 18, height: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon || "•"}</span>;
}

const TAB_ICONS = {
  "home-outline": Home,
  "storefront-outline": Store,
  "cart-outline": ShoppingCart,
  "receipt-outline": ClipboardList,
  "person-outline": User,
  "calendar-outline": Calendar,
  "tag-outline": Tag,
  "restaurant-outline": Utensils,
  "information-outline": Info,
  "megaphone-outline": Megaphone,
  "trophy-outline": Trophy,
  "heart-outline": Heart,
  "book-outline": BookOpen,
  "people-outline": Users,
  "clipboard-outline": ClipboardList,
  "videocam-outline": Video,
  "shop-outline": Store,
  "bag-outline": ShoppingBag,
  "card-outline": CreditCard,
  "grid-outline": Briefcase,
  "order-outline": ClipboardList,
  "phone-outline": Phone,
};

export function TemplatePreview({ templateId, initialScreenId, manifest, screens, onScreenChange }) {
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
    <TemplateAppShell
      manifest={state.manifest}
      screens={state.screens}
      initialScreenId={initialScreenId}
      onScreenChange={(id) => onScreenChange?.(id)}
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