import { PreviewTabIcon } from "../section-editor/PreviewTabBar";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Palette, SlidersHorizontal, MousePointer } from "lucide-react";
import { useIsMobile } from "../../hooks/useMediaQuery";
import { toast } from "react-toastify";
import { getMyApp, getSetupData, getProducts, updateApp, mapProductToMenuItem, mapProductToOffer } from "../../services/api";
import { TemplatePreview, resolvePreviewScreen, findScreenWithComponent, buildPreviewOrder } from "../template/TemplateRenderer";
import { resolveTemplateId } from "../../services/staticTemplates";
import { AMBER, NAVY } from "../../theme";
import { generateShopTemplate } from "../../services/TemplateGenerator";

export default function MiniAppPreview() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [app, setApp] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [currentScreenId, setCurrentScreenId] = useState("menu");
  const [templateManifest, setTemplateManifest] = useState(null);
  const [templateConfig, setTemplateConfig] = useState(null);
  // Preview commerce state — local stand-ins for the mobile app's cart and
  // order stores. Everything works like the app except real API calls.
  const [cart, setCart] = useState({});
  const [previewOrders, setPreviewOrders] = useState([]);

  useEffect(() => {
    Promise.all([
      getMyApp().catch(() => getSetupData()),
      getProducts(),
    ]).then(([appData, prodData]) => {
      if (appData) {
        setApp(appData);
        // Use existing templateConfig or generate new one
        if (appData.templateConfig) {
          setTemplateConfig(appData.templateConfig);
          setTemplateManifest(appData.templateConfig);
          setCurrentScreenId(appData.templateConfig.navigation?.initialScreen || "menu");
        } else {
          // Generate fresh template config for this shop
          const newConfig = generateShopTemplate({
            category: appData.category || "Restaurant",
            template: appData.template || "Classic Dine",
            appName: appData.appName,
            tagline: appData.tagline || "",
            color: appData.color || "#1B4332",
            logo: appData.logo || null,
            businessName: appData.businessName,
            bizDesc: appData.bizDesc || "",
            phone: appData.phone || "",
            address: appData.address || "",
            hours: appData.hours || [],
            selectedIntegrations: appData.selectedIntegrations || [],
          });
          setTemplateConfig(newConfig);
          setTemplateManifest(newConfig);
          setCurrentScreenId(newConfig.navigation?.initialScreen || "menu");
          // Save it back to the app
          updateApp({ templateConfig: newConfig }).catch(console.error);
        }
      }
      if (prodData?.length) setProducts(prodData);
    }).finally(() => setLoading(false));
  }, []);

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const openCustomize = () => {
    // Navigate to the template editor for this specific shop
    if (app?.category && app?.template) {
      const templateId = resolveTemplateId(app.category, app.template);
      navigate(`/template-editor/${templateId}`);
    }
  };

  /* Build the layout screen map from the template config so the mini app preview
     actually renders the merchant's current template (edited or generated). */
  const configScreens = useMemo(() => {
    if (templateConfig?._screens && Object.keys(templateConfig._screens).length > 0) {
      return templateConfig._screens;
    }
    if (Array.isArray(templateConfig?.screens)) {
      const map = {};
      templateConfig.screens.forEach(s => { if (s?.screenId) map[s.screenId] = s; });
      return map;
    }
    return null;
  }, [templateConfig]);

  const hasRenderableTemplate = Boolean(templateManifest && configScreens && Object.keys(configScreens).length > 0);

  /* Template grids show the merchant's live catalog (same mappers the
     canvas uses when a template is selected). Placeholder items baked into
     template JSON are stripped in preview — grids render live data or an
     honest empty state, never demo products. */
  const previewScreens = useMemo(() => {
    if (!configScreens) return configScreens;
    const liveItems = (products || []).map(mapProductToMenuItem).filter(Boolean);
    const liveOffers = (products || []).map(mapProductToOffer).filter(Boolean);
    const hydrate = (node) => {
      if (!node || typeof node !== "object" || Array.isArray(node)) return node;
      const copy = { ...node };
      if (node.type === "menu_grid") copy.props = { ...(node.props || {}), items: liveItems };
      if (node.type === "promotion_list") copy.props = { ...(node.props || {}), offers: liveOffers };
      for (const key of ["children", "components"]) {
        if (Array.isArray(copy[key])) copy[key] = copy[key].map(hydrate);
      }
      if (copy.layout && typeof copy.layout === "object" && Array.isArray(copy.layout.children)) {
        copy.layout = { ...copy.layout, children: copy.layout.children.map(hydrate) };
      }
      return copy;
    };
    const out = {};
    for (const [id, screen] of Object.entries(configScreens)) out[id] = hydrate(screen);
    return out;
  }, [configScreens, products]);

  /* Preview cart lines carry their own snapshot so totals survive catalog
     edits and demo items without backend ids. */
  const cartCount = Object.values(cart).reduce((sum, line) => sum + (line?.qty || 0), 0);
  const cartTotal = Object.values(cart).reduce((sum, line) => sum + (Number(line?.price) || 0) * (line?.qty || 0), 0);
  const previewCartItems = useMemo(
    () => Object.entries(cart)
      .filter(([, line]) => (line?.qty || 0) > 0)
      .map(([id, line]) => ({ id, name: line.name || "Item", price: Number(line.price) || 0, qty: line.qty, img: line.img || "" })),
    [cart],
  );

  const addToCart = useCallback((item) => {
    if (!item) return;
    const id = String(item.id ?? item.productId ?? "");
    if (!id) return;
    setCart(prev => {
      const line = prev[id] || { qty: 0, name: item.name || item.title || "Item", price: Number(item.price) || 0, img: item.image || item.img || "" };
      return { ...prev, [id]: { ...line, qty: line.qty + 1 } };
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    if (id == null) return;
    const key = String(id);
    setCart(prev => {
      const line = prev[key];
      if (!line) return prev;
      if (line.qty <= 1) {
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return { ...prev, [key]: { ...line, qty: line.qty - 1 } };
    });
  }, []);

  const goScreen = useCallback((screenId) => {
    if (screenId && configScreens?.[screenId]) setCurrentScreenId(screenId);
  }, [configScreens]);

  const goCart = useCallback(() => {
    const target = findScreenWithComponent(configScreens, "cart_summary")
      || resolvePreviewScreen(configScreens, ["cart"]);
    if (target) setCurrentScreenId(target);
  }, [configScreens]);

  const goOrders = useCallback(() => {
    const target = findScreenWithComponent(configScreens, "order_history")
      || resolvePreviewScreen(configScreens, ["orders"]);
    if (target) setCurrentScreenId(target);
  }, [configScreens]);

  const goDetail = useCallback((payload) => {
    const target = (payload && (payload.screen || payload.screenId || payload.push))
      || resolvePreviewScreen(configScreens, ["product-detail", "product_detail", "menu.detail", "item-detail", "item_detail", "detail"]);
    if (target && configScreens?.[target]) {
      setCurrentScreenId(target);
    } else {
      console.info("[Preview] No product viewer screen in this template — tap ignored (preview only).");
    }
  }, [configScreens]);

  const simulateOrder = useCallback(() => {
    const { order, error } = buildPreviewOrder(cart, previewOrders.length);
    if (error) {
      toast.info(error);
      return;
    }
    setPreviewOrders(prev => [order, ...prev]);
    setCart({});
    toast.success("Preview order placed (simulated — no API call)");
    goOrders();
  }, [cart, previewOrders.length, goOrders]);

  /* Preview runtime: mirrors the mobile ActionEngine with API calls stubbed.
     Internal tab/stack navigation arrives here too (as a screen id) and is
     applied; anything else is handled locally, never sent to the backend. */
  const handlePreviewEvent = useCallback((type, payload) => {
    if (type && configScreens?.[type]) {
      goScreen(type);
      return;
    }
    switch (type) {
      case "addItem":
      case "add_to_cart":
        addToCart(payload?.item);
        break;
      case "removeItem":
      case "remove_from_cart":
        removeFromCart(payload?.id ?? payload?.item?.id ?? payload?.itemId);
        break;
      case "checkout":
        goCart();
        break;
      case "place_order":
        simulateOrder();
        break;
      case "viewDetails":
      case "view_item":
      case "selectItem":
        goDetail(payload);
        break;
      case "selectOrder":
        goDetail(payload);
        break;
      case "api_request":
      case "submit_form":
      case "submit":
      case "confirm":
        console.info("[Preview] API action stubbed in preview (no backend call):", type, payload);
        break;
      default:
        if (type !== undefined) console.info("[Preview] Unhandled preview action:", type, payload);
        break;
    }
  }, [configScreens, goScreen, addToCart, removeFromCart, goCart, goOrders, goDetail, simulateOrder]);

  return (
    <div style={{ minHeight: "100vh", background: "#1a1a2e", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "#252547", padding: isMobile ? "10px 12px" : "12px 32px", display: "flex", gap: 8, alignItems: "center" }}>
        <button onClick={() => navigate("/dashboard")} style={{ background: "none", border: "1px solid #6B7280", color: "#D1D5DB", borderRadius: 8, padding: "8px 14px", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <span style={{ color: "#9CA3AF", fontSize: 12, marginLeft: 8 }}>
          {loading ? "Loading app..." : app ? `App: ${app.appName}` : "No app deployed yet"}
        </span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          <button
            onClick={openCustomize}
            style={{
              background: "#7C3AED", border: "none", color: "#fff",
              borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 6
            }}
            title="Open visual editor to customize this shop's app"
          >
            <Palette size={16} /> Customize App
          </button>
          <button
            onClick={toggleEditMode}
            style={{
              background: editMode ? AMBER : "transparent",
              border: editMode ? "none" : "1px solid #6B7280",
              color: editMode ? NAVY : "#D1D5DB",
              borderRadius: 8, padding: "8px 14px", fontSize: 13,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 4
            }}
          >
            {editMode ? <MousePointer size={16} /> : <SlidersHorizontal size={16} />}
            {editMode ? "Exit Edit" : "Preview Edit"}
          </button>
          {app && (
            <a href={`https://${app.storeUrl}`} target="_blank" rel="noopener noreferrer" style={{ color: AMBER, fontSize: 13, textDecoration: "none" }}>
              {app.storeUrl} ↗
            </a>
          )}
        </div>
      </div>

      {editMode && templateManifest && (
        <div style={{ background: "#1A1A2E", borderBottom: "1px solid #374151", padding: "8px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span style={{ color: "#9CA3AF", fontSize: 12 }}>Screen:</span>
            {templateManifest.navigation?.tabs?.map(tab => (
              <button
                key={tab.screenId}
                onClick={() => setCurrentScreenId(tab.screenId)}
                style={{
                  padding: "4px 12px", borderRadius: 16, border: "none",
                  background: currentScreenId === tab.screenId ? AMBER : "#374151",
                  color: currentScreenId === tab.screenId ? NAVY : "#D1D5DB",
                  fontSize: 11, fontWeight: 600, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 4
                }}
              >
                {tab.icon && <PreviewTabIcon name={tab.icon} size={16} />}
                {tab.label}
              </button>
            ))}
            <div style={{ marginLeft: "auto", color: "#6B7280", fontSize: 12 }}>
              {(templateConfig?._screens ? Object.keys(templateConfig._screens).length : 0) || (app?.template ? "Custom template ready" : "Standard app")}
            </div>
          </div>
        </div>
      )}

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: isMobile ? "16px 8px" : "40px 20px" }}>
        <div style={{ width: isMobile ? "calc(100vw - 32px)" : 390, maxWidth: 390, background: NAVY, borderRadius: 44, padding: "12px", boxShadow: "0 40px 120px rgba(0,0,0,0.6)", position: "relative", margin: "0 auto" }}>
          <div style={{ background: "#fff", borderRadius: 36, overflow: "hidden", position: "relative", height: isMobile ? 500 : 760, overflowY: "hidden" }}>
            <div onClick={() => navigate("/dashboard")} style={{ position: "absolute", top: 16, right: 16, zIndex: 10 }}>
              <div style={{ width: isMobile ? 36 : 40, height: isMobile ? 36 : 40, background: AMBER, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 16px rgba(0,0,0,0.3)", border: "2px solid rgba(255,255,255,0.6)" }}>
                <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: isMobile ? 16 : 18, color: NAVY }}>D</span>
              </div>
            </div>

            {hasRenderableTemplate ? (
              <TemplatePreview
                templateId={app?.category && app?.template ? resolveTemplateId(app.category, app.template) : undefined}
                manifest={templateConfig}
                screens={previewScreens}
                initialScreenId={currentScreenId}
                controlledScreenId={currentScreenId}
                cartItems={previewCartItems}
                previewOrders={previewOrders}
                onScreenChange={handlePreviewEvent}
              />
            ) : (
              <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center", background: "#fff" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📱</div>
                <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 16, color: NAVY, marginBottom: 6 }}>
                  {loading ? "Preparing your app preview…" : "No app to preview yet"}
                </div>
                <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.5 }}>
                  {loading ? "Loading your template and catalog." : "Save your design to see it running here like on mobile."}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}