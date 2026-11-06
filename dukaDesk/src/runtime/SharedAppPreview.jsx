import { useEffect, useMemo, useState } from "react";
import PreviewTabBar from "../components/section-editor/PreviewTabBar";
import "../components/template/TemplateComponents";
import * as baseTheme from "../theme";
import { BrandThemeProvider } from "./BrandThemeProvider";
import { RuntimeContext } from "./RuntimeContext";
import { LayoutRenderer, ScreenRenderer } from "./layouts";

function AppSplash({ manifest }) {
  const [leaving, setLeaving] = useState(false);
  const [done, setDone] = useState(false);
  const theme = manifest?.theme || {};
  const colors = theme.colors || {};

  useEffect(() => {
    const leaveTimer = setTimeout(() => setLeaving(true), 3000);
    const doneTimer = setTimeout(() => setDone(true), 3300);
    return () => {
      clearTimeout(leaveTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  if (done) return null;

  const splash = manifest?.splash || {};
  const primary = colors.primary || theme.primaryColor || "#1B4332";
  const background = splash.backgroundColor || colors.background || theme.backgroundColor || "#1A1A2E";
  const logo = splash.logo || manifest?.meta?.logo || manifest?.assets?.logo || manifest?.assets?.icon;
  const logoUrl = typeof logo === "object" ? logo.url : logo;
  const name = manifest?.identity?.displayName || manifest?.meta?.appName || manifest?.name || "My App";
  const tagline = manifest?.branding?.tagline || "Tap to explore";

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
      background: splash.backgroundImage ? `url(${splash.backgroundImage}) center/cover no-repeat` : background,
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
        background: `linear-gradient(135deg, ${primary}, ${primary}CC)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 40,
        boxShadow: `0 12px 32px ${primary}40`,
        overflow: "hidden",
      }}>
        {logoUrl ? (
          <img src={logoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span>{name.charAt(0).toUpperCase()}</span>
        )}
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: primary, lineHeight: 1.2 }}>{name}</div>
      {tagline && <div style={{ fontSize: 13, color: "#6B7280", marginTop: -8 }}>{tagline}</div>}
    </div>
  );
}

function resolveScreen(target, screenIds, screenRefs) {
  if (!target) return null;
  const normalized = String(target).replace(/^\//, "").replace(/[-_]/g, "").toLowerCase();
  return screenIds.find((id) => {
    const ref = screenRefs.find((screen) => String(screen?.id ?? screen?.screenId) === id);
    const idValue = String(ref?.id ?? ref?.screenId ?? id);
    return idValue === target || idValue.replace(/[-_]/g, "").toLowerCase() === normalized;
  }) || null;
}

function injectPreviewState(screen, cartItems, previewOrders) {
  if (!screen || typeof screen !== "object" || Array.isArray(screen)) return screen;
  const copy = { ...screen };
  if (cartItems && copy.type === "cart_summary") {
    copy.props = { ...(copy.props || {}), items: cartItems };
  }
  if (previewOrders && copy.type === "order_history") {
    copy.props = { ...(copy.props || {}), orders: previewOrders };
  }
  for (const key of ["children", "components", "fixedTop", "fixedBottom"]) {
    if (Array.isArray(copy[key])) copy[key] = copy[key].map((node) => injectPreviewState(node, cartItems, previewOrders));
  }
  if (copy.layout && typeof copy.layout === "object" && Array.isArray(copy.layout.children)) {
    copy.layout = {
      ...copy.layout,
      children: copy.layout.children.map((node) => injectPreviewState(node, cartItems, previewOrders)),
    };
  }
  return copy;
}

function normalizeManifestNode(node) {
  if (!node || typeof node !== "object" || Array.isArray(node)) return node;
  if (node.type === "layout" && node.layout && typeof node.layout === "object") {
    return {
      ...node.layout,
      key: node.key || node.id,
      children: Array.isArray(node.layout.children)
        ? node.layout.children.map(normalizeManifestNode)
        : [],
    };
  }
  return {
    ...node,
    ...(Array.isArray(node.children) ? { children: node.children.map(normalizeManifestNode) } : {}),
    ...(Array.isArray(node.components) ? { components: node.components.map(normalizeManifestNode) } : {}),
    ...(node.layout && typeof node.layout === "object"
      ? {
          layout: {
            ...node.layout,
            ...(Array.isArray(node.layout.children)
              ? { children: node.layout.children.map(normalizeManifestNode) }
              : {}),
          },
        }
      : {}),
  };
}

export default function SharedAppPreview({
  manifest,
  screens,
  initialScreenId,
  onScreenChange,
  cartItems,
  previewOrders,
  controlledScreenId,
  readOnly = false,
}) {
  const screenIds = useMemo(() => Object.keys(screens || {}), [screens]);
  const [stack, setStack] = useState(() => [
    initialScreenId || manifest?.navigation?.initialScreen || screenIds[0],
  ]);
  const currentScreenId = stack[stack.length - 1];
  const liveScreens = useMemo(() => {
    if (!screens || (!cartItems && !previewOrders)) return screens || {};
    return Object.fromEntries(
      Object.entries(screens).map(([id, screen]) => [
        id,
        injectPreviewState(screen, cartItems, previewOrders),
      ]),
    );
  }, [screens, cartItems, previewOrders]);
  const theme = manifest?.theme || {};
  const colors = theme.colors || {};
  const primary = colors.primary || theme.primaryColor || "#1B4332";
  const background = colors.background || theme.backgroundColor || theme.bgColor || "#F9FAFB";
  const brandTheme = {
    AMBER: primary,
    NAVY: colors.textPrimary || baseTheme.NAVY,
    cardColor: colors.card || colors.surface || "#FFFFFF",
    GRAY: {
      ...baseTheme.GRAY,
      200: colors.border || baseTheme.GRAY[200],
      500: colors.textSecondary || baseTheme.GRAY[500],
      600: colors.textPrimary || baseTheme.GRAY[600],
    },
  };
  const fontFamily = theme.typography?.bodyMd?.fontFamily || baseTheme.font.sans;
  const screenRefs = manifest?.screens && Array.isArray(manifest.screens)
    ? manifest.screens
    : screenIds.map((id) => ({ id }));

  useEffect(() => {
    if (!controlledScreenId || !liveScreens[controlledScreenId]) return;
    setStack((current) => current[current.length - 1] === controlledScreenId ? current : [controlledScreenId]);
  }, [controlledScreenId, liveScreens]);

  if (!manifest || !screenIds.length) return null;

  const switchTab = (screenId) => {
    if (screenId && liveScreens[screenId]) setStack([screenId]);
  };
  const goBack = () => {
    setStack((current) => {
      if (current.length <= 1) return current;
      const next = current.slice(0, -1);
      if (!readOnly) onScreenChange?.(next[next.length - 1], next);
      return next;
    });
  };
  const dispatchAction = (action) => {
    if (!action) return;
    const { type, payload = {} } = action;
    if (type === "navigate" || type === "push" || type === "replace") {
      const target = payload.push || payload.screen || payload.screenId;
      const id = resolveScreen(target, screenIds, screenRefs);
      if (id) {
        setStack((current) => {
          const next = [...current, id];
          if (!readOnly) onScreenChange?.(id, next);
          return next;
        });
      }
    } else if (type === "pop") {
      goBack();
    } else if (type === "switch_screen") {
      switchTab(payload.screenId);
    } else if (type === "logout") {
      if (!readOnly) window.__logout?.();
    } else if (!readOnly) {
      onScreenChange?.(type, payload);
    }
  };
  const isRoot = stack.length === 1;
  const screen = liveScreens[currentScreenId];
  if (!screen) return null;
  const fixedTop = Array.isArray(screen.fixedTop)
    ? screen.fixedTop.map(normalizeManifestNode)
    : [];
  const fixedBottom = Array.isArray(screen.fixedBottom)
    ? screen.fixedBottom
      .filter((node) => node?.type !== "tab_bar")
      .map(normalizeManifestNode)
    : [];
  const normalizedScreen = normalizeManifestNode(screen);

  return (
    <BrandThemeProvider theme={brandTheme}>
      <RuntimeContext.Provider value={{ dispatchAction }}>
        <div style={{ position: "relative", display: "flex", flexDirection: "column", height: "100%", fontFamily }}>
        {!readOnly && <AppSplash manifest={manifest} />}
        {fixedTop.length > 0 && (
          <div style={{ flexShrink: 0 }}>
            <LayoutRenderer layout={{ kind: "column", children: fixedTop }} />
          </div>
        )}
        <div style={{
          background: primary,
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexShrink: 0,
          color: "#fff",
        }}>
          {!isRoot && (
            <button type="button" onClick={goBack} style={{
              background: "none", border: "none", color: "#fff", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 4, padding: 0,
              fontFamily: "inherit", fontSize: 13, fontWeight: 600,
            }}>
              <span style={{ fontSize: 18 }}>←</span> Back
            </button>
          )}
          <span style={{
            fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 15, flex: 1,
            textAlign: isRoot ? "center" : "left", overflow: "hidden",
            textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {screen.title || screen.name || String(currentScreenId).split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ")}
          </span>
          <span style={{ width: 24 }} />
        </div>
        <div style={{ flex: 1, minHeight: 0, overflow: "auto", background }}>
          <ScreenRenderer
            screenDef={normalizedScreen}
            extraProps={{ onAction: (type, payload) => dispatchAction({ type, payload }) }}
          />
        </div>
        {fixedBottom.length > 0 && (
          <div style={{ flexShrink: 0 }}>
            <LayoutRenderer layout={{ kind: "column", children: fixedBottom }} />
          </div>
        )}
        <PreviewTabBar
          navigation={manifest.navigation}
          activeScreen={currentScreenId}
          onNavigate={switchTab}
        />
        </div>
      </RuntimeContext.Provider>
    </BrandThemeProvider>
  );
}
