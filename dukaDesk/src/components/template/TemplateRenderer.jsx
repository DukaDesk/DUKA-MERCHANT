import { useState, useEffect, useCallback } from "react";
import { LayoutRenderer, ScreenRenderer } from "../../runtime/layouts";
import { TemplateComponents } from "./TemplateComponents";
import { loadAllTemplateScreens } from "../../services/TemplateLoader";

export function TemplateRenderer({ templateId, screenId, onAction }) {
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

  const mergedProps = {
    extraProps: { onAction },
  };

  return <ScreenRenderer screenDef={screenDef} extraProps={mergedProps} />;
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