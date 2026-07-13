import { useState, useEffect, useCallback, useMemo } from "react";
import { LayoutRenderer, ScreenRenderer } from "../../runtime/layouts";
import { TemplateComponents } from "./TemplateComponents";
import { loadAllTemplateScreens } from "../../services/TemplateLoader";
import { getScreenPreviewData } from "../../services/PreviewDataProvider";

export function TemplateRenderer({ templateId, screenId, onAction, previewData: externalPreviewData = {} }) {
  const [screenDef, setScreenDef] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadScreen = useCallback(async () => {
    if (!templateId || !screenId) return;
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
  }, [templateId, screenId]);

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

export function TemplatePreview({ templateId, initialScreenId, onScreenChange }) {
  const [currentScreenId, setCurrentScreenId] = useState(initialScreenId);
  const [manifest, setManifest] = useState(null);

  useEffect(() => {
    loadAllTemplateScreens(templateId).then(({ manifest }) => setManifest(manifest));
  }, [templateId]);

  if (!manifest) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300, color: "#9CA3AF" }}>
        Loading template manifest...
      </div>
    );
  }

  const handleAction = (actionKey, payload) => {
    if (actionKey === "navigate" && payload?.push) {
      const screenMatch = payload.push.match(/\/([^/]+)$/);
      if (screenMatch) {
        const newScreenId = screenMatch[1].replace(/-/g, '');
        const found = manifest.screens.find(s => s.id === newScreenId || s.id.replace(/-/g, '') === newScreenId);
        if (found) {
          setCurrentScreenId(found.id);
          onScreenChange?.(found.id);
        }
      }
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{
        display: "flex",
        gap: 4,
        padding: 8,
        background: "#F9FAFB",
        borderBottom: "1px solid #E5E7EB",
        overflowX: "auto"
      }}>
        {manifest.navigation?.tabs?.map(tab => (
          <button
            key={tab.screenId}
            onClick={() => {
              setCurrentScreenId(tab.screenId);
              onScreenChange?.(tab.screenId);
            }}
            style={{
              flex: "0 0 auto",
              padding: "8px 16px",
              borderRadius: 20,
              border: "none",
              background: currentScreenId === tab.screenId ? "#F4A026" : "#fff",
              color: currentScreenId === tab.screenId ? "#0F0F1A" : "#6B7280",
              fontWeight: 600,
              fontSize: 12,
              cursor: "pointer",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: 6
            }}
          >
            {tab.icon && <span>{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
        <TemplateRenderer
          templateId={templateId}
          screenId={currentScreenId}
          onAction={handleAction}
        />
      </div>
    </div>
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