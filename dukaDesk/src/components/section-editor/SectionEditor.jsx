import { useState, useCallback, useEffect } from "react";
import { getComponentType } from "../canvas-editor/componentTypes";
import SectionRenderer from "./SectionRenderer";
import SectionPanel from "./SectionPanel";
import PropertiesPanel from "./PropertiesPanel";
import ScreenSwitcher from "./ScreenSwitcher";
import { NAVY } from "../../theme";
import { theme, iconBtn, primaryBtn, panelHeader } from "./editorTheme";

const SECTION_PRESETS = {
  hero: { icon: "\uD83C\uDF1F", type: "hero", name: "Hero Banner", backgroundColor: "#1A1A2E", desc: "Eye-catching banner with title, subtitle and badge", components: [{ type: "hero_banner", props: { title: "Welcome", subtitle: "Your tagline here", badge: "Open Now", color: "#1A1A2E" } }] },
  menu_list: { icon: "\uD83C\uDF7D\uFE0F", type: "menu_list", name: "Menu List", backgroundColor: "#FCF8FA", desc: "Heading with category pills and menu items", components: [{ type: "text_block", props: { text: "Our Menu", fontSize: 18, fontWeight: 700, color: "#1C1B1D", alignment: "left" } }, { type: "category_pills", props: { categories: "All, Mains, Sides, Drinks" } }, { type: "menu_item", props: { name: "Jollof Rice", price: "\u20A62,500", desc: "Rich, smoky jollof rice", emoji: "\uD83C\uDF5B" } }, { type: "menu_item", props: { name: "Grilled Chicken", price: "\u20A64,500", desc: "Tender grilled chicken", emoji: "\uD83C\uDF57" } }] },
  about: { icon: "\u2139\uFE0F", type: "info", name: "About / Info", backgroundColor: "#FCF8FA", desc: "Business description with heading and contact button", components: [{ type: "text_block", props: { text: "About Us", fontSize: 22, fontWeight: 700, color: "#1C1B1D", alignment: "left" } }, { type: "text_block", props: { text: "Tell your story here. Describe what makes your business special and why customers should choose you.", fontSize: 14, fontWeight: 400, color: "#6B7280", alignment: "left" } }, { type: "button", props: { label: "Contact Us", color: "#1C1B1D", action: "" } }] },
  gallery: { icon: "\uD83D\uDDBC\uFE0F", type: "custom", name: "Image Gallery", backgroundColor: "#FCF8FA", desc: "Heading with a row of images", components: [{ type: "text_block", props: { text: "Gallery", fontSize: 18, fontWeight: 700, color: "#1C1B1D", alignment: "left" } }, { type: "image_block", props: { src: "", alt: "Image 1", fit: "cover" } }, { type: "image_block", props: { src: "", alt: "Image 2", fit: "cover" } }] },
  contact: { icon: "\uD83D\uDCDE", type: "custom", name: "Contact Info", backgroundColor: "#FCF8FA", desc: "Phone, address and operating hours display", components: [{ type: "text_block", props: { text: "Get in Touch", fontSize: 18, fontWeight: 700, color: "#1C1B1D", alignment: "left" } }, { type: "text_block", props: { text: "\uD83D\uDCCD 12 Admiralty Way, Lekki, Lagos", fontSize: 14, fontWeight: 400, color: "#6B7280", alignment: "left" } }, { type: "text_block", props: { text: "\uD83D\uDCDE +234 801 234 5678", fontSize: 14, fontWeight: 400, color: "#6B7280", alignment: "left" } }, { type: "divider", props: { color: "#E5E1E3", thickness: 1 } }] },
  empty: { icon: "\uD83D\uDCC4", type: "custom", name: "Empty Section", backgroundColor: "#FCF8FA", desc: "Blank section to build your own layout", components: [] },
};

export default function SectionEditor({ store, onBack }) {
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [selectedComponentId, setSelectedComponentId] = useState(null);
  const [showExport, setShowExport] = useState(false);
  const [showSectionPicker, setShowSectionPicker] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [previewScreenId, setPreviewScreenId] = useState(null);
  const [hoveredIcon, setHoveredIcon] = useState(null);

  const data = store.data;
  const logo = data.meta?.logo;

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
      if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); }
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
  }, []);

  const handleSelectComponent = useCallback((sectionId, compId) => {
    setSelectedSectionId(sectionId);
    setSelectedComponentId(compId);
  }, []);

  const handleAddSection = useCallback((preset) => {
    if (!preset) { setShowSectionPicker(true); return; }
    setShowSectionPicker(false);
    const section = SECTION_PRESETS[preset];
    if (!section) return;
    const id = store.addBodySection(null, {
      type: section.type,
      name: section.name,
      backgroundColor: section.backgroundColor || "#FCF8FA",
      components: section.components || [],
    });
    if (id) setSelectedSectionId(id);
  }, [store]);

  const handleClose = useCallback(() => {
    setSelectedSectionId(null);
    setSelectedComponentId(null);
  }, []);

  const handleTogglePreview = useCallback(() => {
    if (previewMode) { setPreviewMode(false); setPreviewScreenId(null); }
    else { setPreviewMode(true); setPreviewScreenId(store.currentScreenId); }
  }, [previewMode, store]);

  const handlePreviewNavigate = useCallback((screenId) => {
    setPreviewScreenId(screenId);
  }, []);

  const handlePublish = useCallback(() => {
    const design = store.getDesignJSON();
    try {
      localStorage.setItem("dukadesk_deployed", JSON.stringify({
        ...design,
        publishedAt: new Date().toISOString(),
        status: "published",
      }));
      onBack?.();
    } catch {}
  }, [store, onBack]);

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

  const lastSaved = store.lastSaved;
  const saveStatus = lastSaved
    ? `Saved ${formatTimeAgo(lastSaved)}`
    : "Saving...";

  if (previewMode) {
    const screen = data.screens[previewCurrentScreen];
    return (
      <div style={{ height: "100vh", background: "#0F0F1A", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Inter',sans-serif" }}>
        <div style={{ position: "absolute", top: 16, left: 16, display: "flex", gap: 8 }}>
          <button onClick={() => { setPreviewMode(false); setPreviewScreenId(null); }}
            style={{ ...iconBtn, background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", padding: "8px 16px", borderRadius: theme.radius.md, gap: 6 }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.2)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Exit Preview
          </button>
        </div>
        <div style={{ position: "absolute", top: 16, right: 16, display: "flex", gap: 6 }}>
          {Object.keys(data.screens).map(sid => (
            <button key={sid} onClick={() => setPreviewScreenId(sid)}
              style={{
                background: previewCurrentScreen === sid ? theme.active : "rgba(255,255,255,0.1)", border: "none",
                color: previewCurrentScreen === sid ? NAVY : "#fff", borderRadius: theme.radius.md, padding: "6px 14px",
                cursor: "pointer", fontSize: 12, fontWeight: 600, transition: `all ${theme.transition}`,
              }}
              onMouseEnter={e => { if (previewCurrentScreen !== sid) e.currentTarget.style.background = "rgba(255,255,255,0.18)"; }}
              onMouseLeave={e => { if (previewCurrentScreen !== sid) e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
            >{data.screens[sid]?.name || sid}</button>
          ))}
        </div>
        <div style={{
          width: 390, height: 740, background: screen?.backgroundColor || "#FCF8FA",
          borderRadius: 36, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          display: "flex", flexDirection: "column", position: "relative",
        }}>
          <div style={{ height: 28, background: "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", flexShrink: 0, color: "#fff", fontSize: 11, fontWeight: 600 }}>
            <span>{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          </div>
          <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 120, height: 22, background: "#1a1a2e", borderRadius: "0 0 14px 14px", zIndex: 10 }} />
          <div style={{ flex: 1, overflowY: "auto" }}>
            {data.shared?.header && <HeaderPreview section={data.shared.header} meta={data.meta} componentTypes={null} />}
            {(screen?.bodySections || []).map(sec => (
              <div key={sec.id} style={{ background: sec.backgroundColor || screen?.backgroundColor, padding: "4px 0" }}>
                {(sec.components || []).map(comp => {
                  const CompType = getComponentType(comp.type);
                  if (!CompType) return null;
                  return <div key={comp.id} style={{ padding: "4px 16px" }}>{CompType.render({ ...comp.props })}</div>;
                })}
              </div>
            ))}
            {data.shared?.footer && <FooterPreview section={data.shared.footer} />}
          </div>
          {(data.navigation?.tabs || []).length > 0 && (
            <div style={{ height: 56, background: "#fff", borderTop: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "space-around", flexShrink: 0 }}>
              {data.navigation.tabs.map((tab, i) => (
                <button key={tab.id || i} onClick={() => tab.screenId && setPreviewScreenId(tab.screenId)}
                  style={{
                    background: "none", border: "none", cursor: tab.screenId ? "pointer" : "default",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                    padding: "4px 16px", opacity: previewCurrentScreen === tab.screenId ? 1 : 0.5,
                    transition: `opacity ${theme.transition}`,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = "1"; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = previewCurrentScreen === tab.screenId ? "1" : "0.5"; }}
                >
                  <span style={{ fontSize: 20 }}>{tab.icon}</span>
                  <span style={{ fontSize: 10, color: "#6B7280", fontWeight: 500 }}>{tab.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: theme.canvas }}>
      {/* Top bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "8px 16px", background: theme.surface, borderBottom: `1px solid ${theme.border}`,
        flexShrink: 0, fontFamily: "'Inter',sans-serif", zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onBack}
            style={{ ...iconBtn, border: "none", boxShadow: "none", background: "none", padding: "4px" }}
            title="Back to Dashboard"
            onMouseEnter={() => setHoveredIcon("back")}
            onMouseLeave={() => setHoveredIcon(null)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          </button>
          {logo && (
            <img src={logo} alt="" style={{ width: 28, height: 28, borderRadius: theme.radius.sm, objectFit: "cover" }} />
          )}
          <input
            value={data.meta.appName}
            onChange={e => store.setMeta({ appName: e.target.value })}
            placeholder="App Name"
            style={{
              border: "none", outline: "none", fontSize: 15, fontWeight: 700,
              fontFamily: "'Sora',sans-serif", color: theme.text, background: "transparent", width: 180,
              borderBottom: "1.5px solid transparent",
              transition: `border-color ${theme.transition}`,
            }}
            onFocus={e => e.currentTarget.style.borderBottomColor = theme.active}
            onBlur={e => e.currentTarget.style.borderBottomColor = "transparent"}
          />
          <span style={{
            fontSize: 11, color: theme.textMuted, background: theme.borderLight,
            padding: "2px 8px", borderRadius: 4, fontWeight: 500,
          }}>
            {data.meta.category || "App"}
          </span>
          <span style={{ fontSize: 11, display: "flex", alignItems: "center", gap: 4, color: saveStatus === "Saving..." ? theme.textSecondary : theme.success }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: saveStatus === "Saving..." ? theme.textSecondary : theme.success, display: "inline-block" }} />
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

          <div style={{ width: 1, height: 20, background: theme.border, margin: "0 4px" }} />

          <button onClick={handleTogglePreview} style={iconBtn} title="Preview (Ctrl+P)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
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
        {/* Left panel */}
        <div style={{ width: 260, background: theme.surface, borderRight: `1px solid ${theme.border}`, overflowY: "auto", flexShrink: 0 }}>
          <div style={panelHeader}>
            Elements
            <span style={{ fontSize: 10, color: theme.textMuted, fontWeight: 400, fontFamily: "'Inter',sans-serif" }}>
              {(store.screen?.bodySections || []).length + (data.shared?.header ? 1 : 0) + (data.shared?.footer ? 1 : 0)}
            </span>
          </div>
          <SectionPanel
            store={store}
            selectedSectionId={selectedSectionId}
            selectedComponentId={selectedComponentId}
            onSelectSection={handleSelectSection}
            onSelectComponent={handleSelectComponent}
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
        />

        {/* Right panel */}
        <div style={{ width: 280, background: theme.surface, borderLeft: `1px solid ${theme.border}`, overflowY: "auto", flexShrink: 0 }}>
          <div style={panelHeader}>
            Properties
          </div>
          <PropertiesPanel
            store={store}
            selectedSectionId={selectedSectionId}
            selectedComponentId={selectedComponentId}
            onClose={handleClose}
          />
        </div>
      </div>

      {/* Section picker */}
      {showSectionPicker && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={() => setShowSectionPicker(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: theme.surface, borderRadius: theme.radius["2xl"], boxShadow: "0 20px 60px rgba(0,0,0,0.2)", padding: 24, maxWidth: 500, width: "90%" }}>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 16, color: theme.text, marginBottom: 16 }}>
              Add Section
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
              {Object.entries(SECTION_PRESETS).map(([key, sec]) => (
                <button key={key} onClick={() => handleAddSection(key)}
                  style={{
                    padding: "14px 12px", borderRadius: theme.radius.lg, border: `1px solid ${theme.border}`,
                    background: theme.surface, cursor: "pointer", textAlign: "left",
                    fontFamily: "'Inter',sans-serif", transition: `all ${theme.transition}`,
                    boxShadow: theme.shadow,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = theme.active; e.currentTarget.style.background = theme.hoverAmber; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = theme.shadowMd; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.background = theme.surface; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = theme.shadow; }}
                >
                  <div style={{ fontSize: 20, marginBottom: 6 }}>{sec.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: theme.text, marginBottom: 4 }}>{sec.name}</div>
                  <div style={{ fontSize: 11, color: theme.textMuted, lineHeight: 1.4 }}>{sec.desc}</div>
                </button>
              ))}
            </div>
            <button onClick={() => setShowSectionPicker(false)}
              style={{ width: "100%", padding: "8px", borderRadius: theme.radius.md, border: `1px solid ${theme.border}`, background: theme.surface, cursor: "pointer", fontSize: 13, color: theme.textSecondary, fontFamily: "'Inter',sans-serif", transition: `all ${theme.transition}` }}
              onMouseEnter={e => { e.currentTarget.style.background = theme.hover; e.currentTarget.style.borderColor = theme.border; }}
              onMouseLeave={e => { e.currentTarget.style.background = theme.surface; e.currentTarget.style.borderColor = theme.border; }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Bottom bar */}
      <ScreenSwitcher store={store} />
    </div>
  );
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

function HeaderPreview({ section, meta }) {
  const logo = meta?.logo;
  const appName = meta?.appName || "My App";
  if (!section.components?.length) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: section.backgroundColor || "#FCF8FA" }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: logo ? `url(${logo}) center/cover no-repeat` : "#F1EDEF", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: theme.textMuted, border: logo ? "none" : "2px dashed #D1D5DB" }}>
          {!logo && "\uD83D\uDCF7"}
        </div>
        <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 15, color: theme.text }}>{appName}</div>
      </div>
    );
  }
  return (
    <div style={{ background: section.backgroundColor || "#FCF8FA" }}>
      {section.components.map(comp => {
        const CompType = getComponentType(comp.type);
        if (!CompType) return null;
        return <div key={comp.id} style={{ padding: "4px 16px" }}>{CompType.render({ ...comp.props, logo: logo || comp.props?.logo, appName: appName })}</div>;
      })}
    </div>
  );
}

function FooterPreview({ section }) {
  return (
    <div style={{ background: section.backgroundColor || "#FCF8FA", padding: "8px 16px", textAlign: "center", fontSize: 11, color: theme.textMuted }}>
      {section.components?.length > 0 ? section.components.map((comp, i) => {
        const CompType = getComponentType(comp.type);
        if (!CompType) return null;
        return <div key={comp.id} style={{ padding: "2px 0" }}>{CompType.render({ ...comp.props })}</div>;
      }) : (
        <span>\u00A9 {new Date().getFullYear()} All rights reserved.</span>
      )}
    </div>
  );
}
