import { useState, useCallback, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { getComponentType } from "../canvas-editor/componentTypes";
import SectionRenderer from "./SectionRenderer";
import SectionPanel from "./SectionPanel";
import PropertiesPanel from "./PropertiesPanel";
import ElementGallery from "./ElementGallery";
import ScreenSwitcher from "./ScreenSwitcher";
import { toast } from "react-toastify";
import { NAVY } from "../../theme";
import { useEditorTheme } from "./editorTheme.jsx";
import { publishProject, getReleaseHistory, rollbackToRelease, getCurrentDeployment } from "../../services/PublishingPipeline";
import TemplateGallery from "../app-builder/TemplateGallery";
import { loadTemplateForCanvas } from "../../services/staticTemplates";

const PREVIEW_SIZES = {
  mobile: { width: 390, height: 740, label: "Mobile", icon: "M12 2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2s2-.9 2-2V4c0-1.1-.9-2-2-2z" },
  tablet: { width: 768, height: 1024, label: "Tablet", icon: "M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" },
};

function resolveActionTarget(action) {
  if (!action || typeof action !== "object") return null;
  return action.payload?.push || action.payload?.screen || action.payload?.screenId || action.payload?.target || null;
}

function parsePreviewAction(comp) {
  const p = comp?.props || {};
  const raw = p.action || p.actions?.default || (p.actions && typeof p.actions === "object" ? p.actions.tap : null);
  if (!raw) return null;
  if (typeof raw === "string") {
    try { return JSON.parse(raw); } catch { return null; }
  }
  return typeof raw === "object" ? raw : null;
}

function resolvePreviewTarget(target, data) {
  const str = String(target || "").replace(/^\/+/, "").replace(/\.[a-z]+$/i, "");
  if (!str) return target;
  const ids = Object.keys(data?.screens || {});
  if (ids.includes(str)) return str;
  const direct = ids.find(id => id.toLowerCase() === str.toLowerCase());
  if (direct) return direct;
  const fuzzy = ids.find(id =>
    str.toLowerCase() === String(id).replace(/[-_]/g, "").toLowerCase() ||
    String(data.screens?.[id]?.name || "").toLowerCase() === str.toLowerCase()
  );
  return fuzzy || target;
}

export default function SectionEditor({ store, onBack }) {
  const { theme, iconBtn, primaryBtn, isDark, toggleDark } = useEditorTheme();
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [selectedComponentId, setSelectedComponentId] = useState(null);
  const [showExport, setShowExport] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [previewSize, setPreviewSize] = useState("mobile");
  const [previewScreenId, setPreviewScreenId] = useState(null);
  const [previewStack, setPreviewStack] = useState([]);
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [validationErrors, setValidationErrors] = useState(null);
  const [showReleases, setShowReleases] = useState(false);
  const [releases, setReleases] = useState([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [loadingTemplate, setLoadingTemplate] = useState(false);
  const [focusSubKey, setFocusSubKey] = useState(null);
  const [navSelected, setNavSelected] = useState(false);
  const [browseType, setBrowseType] = useState(null);

  const data = store.data;

  const previewCurrentScreen = previewScreenId || store.currentScreenId;

  useEffect(() => {
    if (previewMode) {
      const handler = (e) => {
        if (e.key === "Escape") { setPreviewMode(false); setPreviewScreenId(null); }
      };
      window.addEventListener("keydown", handler);
      return () => window.removeEventListener("keydown", handler);
    }
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) { e.preventDefault(); store.undo(); }
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && e.shiftKey) { e.preventDefault(); store.redo(); }
      if ((e.ctrlKey || e.metaKey) && e.key === "y") { e.preventDefault(); store.redo(); }
      if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); store.saveToServer(); }
      if ((e.ctrlKey || e.metaKey) && e.key === "p") { e.preventDefault(); handleTogglePreview(); }
      if ((e.key === "Delete" || e.key === "Backspace") && !e.target.closest("input,textarea,select")) {
        if (selectedComponentId && selectedSectionId) {
          store.removeComponentFromSection(selectedSectionId, selectedComponentId);
          setSelectedComponentId(null);
        } else if (selectedSectionId) {
          const sec = findBodySection(selectedSectionId);
          if (sec) { store.removeBodySection(null, selectedSectionId); setSelectedSectionId(null); }
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [previewMode, selectedSectionId, selectedComponentId, store]);

  function findBodySection(sid) {
    const screen = store.screen;
    return screen?.bodySections?.find(s => s.id === sid);
  }

  const handleSelectSection = useCallback((sectionId) => {
    setSelectedSectionId(sectionId);
    setSelectedComponentId(null);
    setFocusSubKey(null);
    setNavSelected(false);
    setBrowseType(null);
  }, []);

  const handleSelectComponent = useCallback((sectionId, compId) => {
    setSelectedSectionId(sectionId);
    setSelectedComponentId(compId);
    setFocusSubKey(null);
    setNavSelected(false);
    setBrowseType(null);
  }, []);

  const handleAddSection = useCallback(() => {
    store.addBodySection(store.currentScreenId, { type: "custom", name: "New Section" });
  }, [store]);

  const handleFocusSubElement = useCallback((sectionId, compId, key) => {
    setSelectedSectionId(sectionId);
    setSelectedComponentId(compId);
    setFocusSubKey({ compId, key });
    setNavSelected(false);
  }, []);

  const handleRemoveSubElement = useCallback((sectionId, compId, key) => {
    store.clearProp(sectionId, compId, key);
    if (focusSubKey?.compId === compId && focusSubKey?.key === key) setFocusSubKey(null);
  }, [store, focusSubKey]);

  const handleClose = useCallback(() => {
    setSelectedSectionId(null);
    setSelectedComponentId(null);
    setNavSelected(false);
  }, []);

  const handleTogglePreview = useCallback(() => {
    if (previewMode) { setPreviewMode(false); setPreviewScreenId(null); setPreviewStack([]); }
    else { setPreviewMode(true); setPreviewStack([store.currentScreenId]); setPreviewScreenId(store.currentScreenId); }
  }, [previewMode, store]);

  const handlePreviewNavigate = useCallback((screenId, mode = "replace") => {
    if (!screenId) return;
    const target = resolvePreviewTarget(screenId, data);
    const last = previewStack[previewStack.length - 1];
    if (mode === "push" && target !== last) {
      setPreviewStack(prev => [...prev, target]);
    } else if (mode === "replace") {
      setPreviewStack([target]);
    }
    setPreviewScreenId(target);
  }, [data, previewStack]);

  const handlePreviewBack = useCallback(() => {
    setPreviewStack(prev => {
      if (prev.length <= 1) return prev;
      const next = prev.slice(0, -1);
      setPreviewScreenId(next[next.length - 1]);
      return next;
    });
  }, []);

  const handlePreviewAction = useCallback((comp) => {
    const action = parsePreviewAction(comp);
    if (!action) return;
    const { type, payload = {} } = action;
    if (type === "pop") { handlePreviewBack(); return; }
    const target = resolveActionTarget(action);
    if (typeof target !== "string" || !target) return;
    if (type === "navigate" || type === "push") {
      handlePreviewNavigate(target, "push");
    } else if (type === "replace" || type === "switch_screen") {
      handlePreviewNavigate(target, "replace");
    }
  }, [handlePreviewNavigate, handlePreviewBack]);

  const handlePublish = useCallback(async () => {
    const design = store.getDesignJSON();
    // Kickstart generation: ensure design is saved before publish so preview/mobile sees latest
    try {
      await store.saveToServer();
    } catch { /* best-effort */ }
    toast.info("Generating app manifest…");
    const result = await publishProject(design);
    if (result.success) {
      toast.success(`Published v${result.version} — mobile manifest updated!`);
      // Also persist to backend via direct config write so MiniAppPreview / BFF mobile can fetch immediately
      // (publishProject already does this, but we double-ensure for demo mode)
      try {
        const { updateApp } = await import("../../services/api");
        await updateApp({ templateConfig: result.manifest || design, lastPublishedAt: new Date().toISOString(), lastPublishedVersion: result.version });
      } catch { /* ignore */ }
      setTimeout(() => onBack?.(), 1200);
    } else {
      setValidationErrors(result.validation);
      if (result.error) toast.error(result.error);
    }
  }, [store, onBack]);

  const handleShowReleases = useCallback(async () => {
    const history = await getReleaseHistory();
    setReleases(history);
    setShowReleases(true);
  }, []);

  const handleRollback = useCallback(async (releaseId) => {
    const result = await rollbackToRelease(releaseId);
    if (result.success) {
      const history = await getReleaseHistory();
      setReleases(history);
    }
  }, []);

  const handleLoadTemplate = useCallback(async (templateId) => {
    if (!templateId) return;
    setLoadingTemplate(true);
    try {
      const design = await loadTemplateForCanvas(templateId);
      store.loadTemplate(design);
      store.setMeta({
        appName: design.meta.appName,
        category: design.meta.category,
        primaryColor: design.meta.primaryColor,
      });
      const firstScreenId = design.navigation?.initialScreen || Object.keys(design.screens)[0];
      const firstSection = design.screens?.[firstScreenId]?.bodySections?.[0];
      if (firstSection) {
        setSelectedSectionId(firstSection.id);
        setSelectedComponentId(firstSection.components?.[0]?.id || null);
        setFocusSubKey(null);
        setNavSelected(false);
      }
      toast.success(`Template "${design.meta.appName}" loaded`);
      setShowTemplates(false);
    } catch {
      toast.error("Failed to load template");
    } finally {
      setLoadingTemplate(false);
    }
  }, [store]);

  const handleExport = useCallback((format) => {
    const json = JSON.stringify(store.getDesignJSON(), null, 2);
    if (format === "copy") {
      navigator.clipboard.writeText(json);
    } else {
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "design.json"; a.click();
      URL.revokeObjectURL(url);
    }
    setShowExport(false);
  }, [store]);

  const serverLastSaved = store.serverLastSaved;
  const savingToServer = store.savingToServer;
  const saveStatus = savingToServer
    ? "Saving to server..."
    : serverLastSaved
      ? `Saved ${formatTimeAgo(serverLastSaved)}`
      : "";

  if (previewMode) {
    const screen = data.screens[previewCurrentScreen];
    const ps = PREVIEW_SIZES[previewSize] || PREVIEW_SIZES.mobile;
    const isMobileDevice = previewSize === "mobile";
    return (
      <div style={{ height: "100vh", background: "#0F0F1A", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Inter',sans-serif" }}>
        <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 6, alignItems: "center" }}>
          <button onClick={() => { setPreviewMode(false); setPreviewScreenId(null); }}
            style={{ ...iconBtn, background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", padding: "8px 14px", borderRadius: theme.radius.md, gap: 6, fontSize: 12 }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.2)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Exit
          </button>
          <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.15)", margin: "0 4px" }} />
          {Object.entries(PREVIEW_SIZES).map(([key, size]) => (
            <button key={key} onClick={() => setPreviewSize(key)}
              style={{
                background: previewSize === key ? theme.active : "rgba(255,255,255,0.08)", border: "none",
                color: previewSize === key ? NAVY : "rgba(255,255,255,0.6)", borderRadius: theme.radius.md,
                padding: "6px 10px", cursor: "pointer", fontSize: 11, fontWeight: 600,
                fontFamily: "'Inter',sans-serif", transition: `all ${theme.transition}`,
                display: "flex", alignItems: "center", gap: 5,
              }}
              onMouseEnter={e => { if (previewSize !== key) e.currentTarget.style.background = "rgba(255,255,255,0.15)"; }}
              onMouseLeave={e => { if (previewSize !== key) e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={size.icon}/></svg>
              {size.label}
            </button>
          ))}
        </div>
        <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 5 }}>
          {previewStack.length > 1 && (
            <button onClick={handlePreviewBack}
              style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", borderRadius: theme.radius.md, padding: "5px 12px", cursor: "pointer", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 4, fontFamily: "'Inter',sans-serif" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Back
            </button>
          )}
          {Object.keys(data.screens).map(sid => (
            <button key={sid} onClick={() => handlePreviewNavigate(sid, "replace")}
              style={{
                background: previewCurrentScreen === sid ? theme.active : "rgba(255,255,255,0.1)", border: "none",
                color: previewCurrentScreen === sid ? NAVY : "#fff", borderRadius: theme.radius.md, padding: "5px 12px",
                cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: "'Inter',sans-serif",
                transition: `all ${theme.transition}`,
              }}
              onMouseEnter={e => { if (previewCurrentScreen !== sid) e.currentTarget.style.background = "rgba(255,255,255,0.18)"; }}
              onMouseLeave={e => { if (previewCurrentScreen !== sid) e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
            >{data.screens[sid]?.name || sid}</button>
          ))}
        </div>
        <div style={{
          width: ps.width, height: ps.height, background: screen?.backgroundColor || "#FCF8FA",
          borderRadius: isMobileDevice ? 36 : 12, overflow: "hidden",
          boxShadow: isMobileDevice ? "0 20px 60px rgba(0,0,0,0.4)" : "0 8px 30px rgba(0,0,0,0.3)",
          display: "flex", flexDirection: "column", position: "relative",
          transition: "all 0.3s ease",
        }}>
          <div style={{ height: 28, background: "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", flexShrink: 0, color: "#fff", fontSize: 11, fontWeight: 600 }}>
            <span>{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          </div>
          <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 120, height: 22, background: "#1a1a2e", borderRadius: "0 0 14px 14px", zIndex: 10 }} />
          <div style={{ flex: 1, overflowY: "auto" }}>
            {(screen?.bodySections || []).map(sec => {
              const resolved = store.resolveSection(sec);
              return (
                <div key={resolved.id} style={{ background: resolved.backgroundColor || screen?.backgroundColor, padding: "4px 0" }}>
                  {(resolved.components || []).map(comp => {
                    const CompType = getComponentType(comp.type);
                    if (!CompType) return null;
                    const m = comp.props?.margin || {};
                    const p = comp.props?.padding || {};
                    const action = parsePreviewAction(comp);
                    const ELEVATIONS = {
                      none: "none",
                      soft: "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
                      medium: "0 4px 10px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)",
                      raised: "0 10px 24px rgba(0,0,0,0.18), 0 4px 8px rgba(0,0,0,0.1)",
                    };
                    const elev = ELEVATIONS[comp.props?.elevation] || "none";
                    const op = comp.props?.opacity != null ? Number(comp.props.opacity) / 100 : 1;
                    return <div key={comp.id} style={{
                      padding: "4px 16px",
                      marginTop: m.top || 0, marginRight: m.right || 0,
                      marginBottom: m.bottom || 0, marginLeft: m.left || 0,
                      paddingTop: p.top || 0, paddingRight: p.right || 0,
                      paddingBottom: p.bottom || 0, paddingLeft: p.left || 0,
                      boxShadow: elev, opacity: op, boxSizing: "border-box",
                      cursor: action ? "pointer" : "default",
                      transition: "all 0.15s ease",
                    }} onClick={action ? () => handlePreviewAction(comp) : undefined}
                      onMouseEnter={action ? e => { e.currentTarget.style.background = "rgba(0,0,0,0.04)"; } : undefined}
                      onMouseLeave={action ? e => { e.currentTarget.style.background = "transparent"; } : undefined}
                    >{CompType.render({ ...comp.props })}</div>;
                  })}
                </div>
              );
            })}
          </div>
          {(data.navigation?.tabs || []).length > 0 && (
            <div style={{
              height: 56, background: data.navigation?.style?.background || "#fff",
              borderTop: "1px solid #E5E7EB", display: "flex", alignItems: "center",
              justifyContent: "space-around", flexShrink: 0,
            }}>
              {data.navigation.tabs.map((tab, i) => {
                const isActive = previewCurrentScreen === tab.screenId;
                const color = isActive
                  ? (tab.color || data.navigation?.style?.active || "#1A1A2E")
                  : (data.navigation?.style?.inactive || "#9CA3AF");
                return (
                  <button key={tab.id || i} onClick={() => tab.screenId && handlePreviewNavigate(tab.screenId)}
                    style={{
                      background: "none", border: "none", cursor: tab.screenId ? "pointer" : "default",
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                      padding: "4px 16px",
                    }}
                  >
                    <span style={{ fontSize: 20, color, opacity: isActive ? 1 : 0.6 }}>{tab.icon}</span>
                    <span style={{ fontSize: 10, color, fontWeight: isActive ? 700 : 500 }}>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: theme.canvas }}>
      <style>{`
        @keyframes templatePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(245,158,11,0.5), 0 2px 10px rgba(245,158,11,0.35); }
          50% { box-shadow: 0 0 0 6px rgba(245,158,11,0), 0 2px 10px rgba(245,158,11,0.35); }
        }
        @keyframes templateShine {
          0% { transform: translateX(-150%) skewX(-20deg); }
          60%, 100% { transform: translateX(250%) skewX(-20deg); }
        }
        .template-cta { position: relative; overflow: hidden; animation: templatePulse 2.2s ease-out infinite; }
        .template-cta::after {
          content: ""; position: absolute; top: 0; left: 0; height: 100%; width: 40%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent);
          transform: translateX(-150%) skewX(-20deg);
        }
        .template-cta:hover::after { animation: templateShine 0.9s ease forwards; }
      `}</style>
      {/* Top bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "8px 16px", background: theme.surface, borderBottom: `1px solid ${theme.border}`,
        flexShrink: 0, fontFamily: "'Inter',sans-serif", zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onBack}
            style={{ ...iconBtn, border: "none", boxShadow: "none", background: "none", padding: "4px" }}
            title="Close — Back to Dashboard"
            onMouseEnter={() => setHoveredIcon("back")}
            onMouseLeave={() => setHoveredIcon(null)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <span style={{ fontSize: 11, display: "flex", alignItems: "center", gap: 4, color: savingToServer ? "#D97706" : (serverLastSaved ? theme.success : theme.textSecondary) }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: savingToServer ? "#D97706" : (serverLastSaved ? theme.success : theme.textSecondary), display: "inline-block" }} />
            {saveStatus}
          </span>
        </div>

        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <button onClick={() => store.undo()}
            style={{ ...iconBtn, opacity: store.canUndo ? 1 : 0.35, cursor: store.canUndo ? "pointer" : "not-allowed" }}
            title="Undo (Ctrl+Z)"
            onMouseEnter={() => setHoveredIcon("undo")}
            onMouseLeave={() => setHoveredIcon(null)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
          </button>
          <button onClick={() => store.redo()}
            style={{ ...iconBtn, opacity: store.canRedo ? 1 : 0.35, cursor: store.canRedo ? "pointer" : "not-allowed" }}
            title="Redo (Ctrl+Shift+Z)"
            onMouseEnter={() => setHoveredIcon("redo")}
            onMouseLeave={() => setHoveredIcon(null)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
          </button>

          <button onClick={() => store.saveToServer()} style={iconBtn} title="Save to Server">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          </button>

          <button onClick={() => setShowTemplates(true)} className="template-cta"
            style={{
              background: "linear-gradient(135deg, #FBBF24, #F59E0B)",
              color: "#1F2937", border: "none", borderRadius: theme.radius.md,
              padding: "7px 14px", fontWeight: 700, fontSize: 13, cursor: "pointer",
              fontFamily: "'Inter',sans-serif", display: "inline-flex", alignItems: "center", gap: 6,
              transition: `transform ${theme.transition}, box-shadow ${theme.transition}`,
              boxShadow: "0 2px 10px rgba(245,158,11,0.35)",
            }}
            title="Templates — our curated starter designs (premium)"
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 5px 18px rgba(245,158,11,0.45)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 10px rgba(245,158,11,0.35)"; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            Templates
          </button>

          <div style={{ width: 1, height: 20, background: theme.border, margin: "0 4px" }} />

          <button onClick={handleTogglePreview} style={iconBtn} title="Preview (Ctrl+P)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>

          <button onClick={toggleDark} style={iconBtn} title={isDark ? "Switch to light mode" : "Switch to dark mode"}>
            {isDark
              ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>}
          </button>

          <button onClick={handleShowReleases} style={iconBtn} title="Release History">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </button>

          <div style={{ position: "relative" }}>
            <button onClick={() => setShowExport(!showExport)} style={iconBtn} title="Export">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </button>
            {showExport && (
              <div style={{
                position: "absolute", top: "100%", right: 0, marginTop: 4,
                background: theme.surface, borderRadius: theme.radius.md, boxShadow: theme.shadowLg,
                border: `1px solid ${theme.border}`, zIndex: 50, minWidth: 140, overflow: "hidden",
              }}>
                {[
                  { label: "Copy JSON", action: () => handleExport("copy") },
                  { label: "Download JSON", action: () => handleExport("download") },
                ].map(item => (
                  <button key={item.label} onClick={item.action}
                    style={{ display: "block", width: "100%", padding: "8px 14px",
                      border: "none", background: "none", cursor: "pointer",
                      fontSize: 13, fontFamily: "'Inter',sans-serif", color: theme.textSecondary,
                      textAlign: "left", transition: `background ${theme.transition}`,
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = theme.hover}
                    onMouseLeave={e => e.currentTarget.style.background = "none"}>
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handlePublish}
            style={primaryBtn}
            onMouseEnter={e => { e.currentTarget.style.background = "#E89113"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(244,160,38,0.35)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = theme.active; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.12)"; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
            Publish
          </button>
        </div>
      </div>

      {/* Main area */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left panel — 2-column tabbed (100px + content) */}
        <div style={{ flex: "0 0 248", minWidth: 220, maxWidth: 320, background: theme.surface, borderRight: `1px solid ${theme.border}`, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <SectionPanel
            store={store}
            selectedSectionId={selectedSectionId}
            selectedComponentId={selectedComponentId}
            onSelectSection={handleSelectSection}
            onSelectComponent={handleSelectComponent}
            focusSubKey={focusSubKey}
            onFocusSubElement={handleFocusSubElement}
            onRemoveSubElement={handleRemoveSubElement}
            onBrowse={setBrowseType}
            browseType={browseType}
            onAddSection={handleAddSection}
          />
        </div>

        {/* Center */}
        <SectionRenderer
          store={store}
          selectedSectionId={selectedSectionId}
          selectedComponentId={selectedComponentId}
          onSelectSection={handleSelectSection}
          onSelectComponent={handleSelectComponent}
          onFocusSubElement={handleFocusSubElement}
          focusSubKey={focusSubKey}
        />

        {/* Right panel — Element gallery when browsing, else Properties */}
        <div style={{ width: 300, background: theme.surface, borderLeft: `1px solid ${theme.border}`, overflow: "hidden", flexShrink: 0, display: "flex", flexDirection: "column" }}>
          {browseType ? (
            <ElementGallery
              browseType={browseType}
              store={store}
              selectedSectionId={selectedSectionId}
              onClose={() => setBrowseType(null)}
            />
          ) : (
            <PropertiesPanel
              store={store}
              selectedSectionId={selectedSectionId}
              selectedComponentId={selectedComponentId}
              navSelected={navSelected}
              onClose={handleClose}
              onSelectComponent={handleSelectComponent}
              focusSubKey={focusSubKey}
              onClearProp={(key) => { if (selectedComponentId) store.clearProp(selectedSectionId, selectedComponentId, key); }}
            />
          )}
        </div>
      </div>

      {/* Validation errors */}
      {validationErrors && (
        <ValidationModal
          errors={validationErrors.errors}
          warnings={validationErrors.warnings}
          onClose={() => setValidationErrors(null)}
        />
      )}

      {/* Releases panel */}
      {showReleases && (
        <ReleasesPanel
          releases={releases}
          onRollback={handleRollback}
          onClose={() => setShowReleases(false)}
        />
      )}

      {/* Templates modal */}
      {showTemplates && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 150 }} onClick={() => setShowTemplates(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: theme.surface, borderRadius: theme.radius["2xl"], boxShadow: "0 20px 60px rgba(0,0,0,0.2)", padding: 24, maxWidth: 820, width: "90%", maxHeight: "82vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ display: "flex", color: theme.textMuted }}><Sparkles size={20} /></span>
                <div>
                  <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 16, color: theme.text }}>Templates</div>
                  <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>Premium starter designs — add them to your app in one click.</div>
                </div>
              </div>
              <button onClick={() => setShowTemplates(false)} style={{ ...iconBtn, border: "none" }} title="Close">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <p style={{ fontSize: 12, color: theme.textMuted, marginBottom: 16, lineHeight: 1.4 }}>
              Loading a template replaces your current design. Click a template to load it into this canvas.
            </p>
            <TemplateGallery
              value={null}
              onChange={handleLoadTemplate}
              onSkip={() => setShowTemplates(false)}
              isMobile={false}
              loading={loadingTemplate}
            />
          </div>
        </div>
      )}

      {/* Bottom bar */}
      <ScreenSwitcher store={store} />
    </div>
  );

  function ValidationModal({ errors, warnings, onClose }) {
    return (
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }} onClick={onClose}>
        <div onClick={e => e.stopPropagation()} style={{ background: theme.surface, borderRadius: theme.radius["2xl"], boxShadow: "0 20px 60px rgba(0,0,0,0.2)", padding: 24, maxWidth: 520, width: "90%", maxHeight: "80vh", overflowY: "auto" }}>
          <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 16, color: theme.text, marginBottom: 8 }}>
            Validation {errors.length > 0 ? "Errors" : "Warnings"}
          </div>
          <p style={{ fontSize: 13, color: theme.textSecondary, marginBottom: 16, lineHeight: 1.4 }}>
            {errors.length > 0
              ? `Fix the ${errors.length} error${errors.length > 1 ? "s" : ""} below before publishing.`
              : `${warnings.length} warning${warnings.length !== 1 ? "s" : ""} found — review recommended.`}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
            {[...errors, ...warnings].map((err, i) => (
              <div key={i} style={{
                padding: "10px 12px", borderRadius: theme.radius.md,
                background: err.severity === "error" ? "#FEF2F2" : "#FFFBEB",
                border: `1px solid ${err.severity === "error" ? "#FECACA" : "#FDE68A"}`,
                fontSize: 12, lineHeight: 1.4,
              }}>
                <div style={{ fontWeight: 600, color: err.severity === "error" ? "#991B1B" : "#92400E", marginBottom: 2 }}>
                  {err.severity === "error" ? "Error" : "Warning"}: {err.path}
                </div>
                <div style={{ color: err.severity === "error" ? "#7F1D1D" : "#78350F" }}>{err.message}</div>
                {err.fix && <div style={{ color: "#059669", marginTop: 4, fontSize: 11 }}>Fix: {err.fix}</div>}
              </div>
            ))}
          </div>
          <button onClick={onClose}
            style={{
              width: "100%", padding: "10px", borderRadius: theme.radius.md,
              background: theme.active, color: NAVY, border: "none",
              fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "'Sora',sans-serif",
            }}
          >Close</button>
        </div>
      </div>
    );
  }

  function ReleasesPanel({ releases, onRollback, onClose }) {
    const [current, setCurrent] = useState(null);
    useEffect(() => { getCurrentDeployment().then(setCurrent).catch(() => setCurrent(null)); }, []);
    return (
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }} onClick={onClose}>
        <div onClick={e => e.stopPropagation()} style={{ background: theme.surface, borderRadius: theme.radius["2xl"], boxShadow: "0 20px 60px rgba(0,0,0,0.2)", padding: 24, maxWidth: 480, width: "90%", maxHeight: "70vh", overflowY: "auto" }}>
          <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 16, color: theme.text, marginBottom: 4 }}>
            Release History
          </div>
          <p style={{ fontSize: 12, color: theme.textSecondary, marginBottom: 16 }}>
            {current ? `Currently deployed: v${current.version || "?"}` : "No deployment found"}
          </p>
          {releases.length === 0 ? (
            <div style={{ textAlign: "center", padding: 24, color: "#9CA3AF", fontSize: 13 }}>
              No releases yet. Publish your app to create the first release.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {[...releases].reverse().map((rel, i) => (
                <div key={rel.id} style={{
                  padding: "12px 14px", borderRadius: theme.radius.md,
                  background: rel.status === "published" ? "#F0FDF4" : "#F9FAFB",
                  border: `1px solid ${rel.status === "published" ? "#BBF7D0" : "#E8E8F0"}`,
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#1C1B1D" }}>v{rel.version}</div>
                    <div style={{ fontSize: 11, color: "#6B7280" }}>
                      {new Date(rel.timestamp).toLocaleDateString()} {new Date(rel.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                    <div style={{ fontSize: 11, color: rel.status === "published" ? "#059669" : "#9CA3AF" }}>
                      {rel.status === "published" ? "Live" : "Rolled back"}
                    </div>
                  </div>
                  {rel.status === "published" && (
                    <button onClick={() => onRollback(rel.id)}
                      style={{
                        padding: "6px 14px", borderRadius: theme.radius.md,
                        background: "#FEF3C7", color: "#92400E", border: "1px solid #FDE68A",
                        fontSize: 11, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
                        fontFamily: "'Inter',sans-serif", transition: `all ${theme.transition}`,
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#FDE68A"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "#FEF3C7"; }}
                    >Rollback</button>
                  )}
                </div>
              ))}
            </div>
          )}
          <button onClick={onClose}
            style={{
              width: "100%", padding: "10px", borderRadius: theme.radius.md,
              background: "#F3F4F6", color: "#6B7280", border: "none",
              fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "'Inter',sans-serif",
            }}
          >Close</button>
        </div>
      </div>
    );
  }
}

function formatTimeAgo(date) {
  if (!date) return "";
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 5) return "now";
  if (seconds < 60) return `${seconds}s ago`;
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}
