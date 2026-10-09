import { confirmDialog } from "../common/dialogs";
import { useEffect, useState } from "react";
import { useEditorTheme } from "./editorTheme.jsx";
import { getLucideIcon } from "../canvas-editor/componentTypes";
import { Copy, Pencil, Plus, Trash2 } from "lucide-react";

export default function ScreenSwitcher({ store }) {
  const { theme, iconBtn, iconBtnDanger } = useEditorTheme();
  const data = store.data;
  const screenIds = Object.keys(data.screens);
  const [editingTabIdx, setEditingTabIdx] = useState(null);
  const [tabLabelInput, setTabLabelInput] = useState("");
  const [showNavEditor, setShowNavEditor] = useState(false);
  const [editingScreenId, setEditingScreenId] = useState(null);
  const [screenNameInput, setScreenNameInput] = useState("");

  useEffect(() => {
    const handleShortcut = event => {
      if (!(event.metaKey || event.ctrlKey) || !/^[1-9]$/.test(event.key)) return;
      if (event.target?.closest?.("input,textarea,select,[contenteditable='true']")) return;
      const screenId = screenIds[Number(event.key) - 1];
      if (!screenId) return;
      event.preventDefault();
      store.setCurrentScreenId(screenId);
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [screenIds, store]);

  const handleScreenRename = (sid) => {
    if (screenNameInput.trim()) store.renameScreen(sid, screenNameInput.trim());
    setEditingScreenId(null);
  };

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "8px 16px", borderTop: `1px solid ${theme.border}`, background: theme.surface,
      fontFamily: "'Inter',sans-serif", flexShrink: 0, minHeight: 48,
      overflowX: "auto", position: "relative",
    }}>
      <span style={{ fontSize: 10, fontWeight: 700, color: theme.textMuted, whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: "0.5px" }}>
        Screens
      </span>
      <div role="tablist" aria-label="App screens" style={{ display: "flex", alignItems: "center", gap: 5, minWidth: 0 }}>
      {screenIds.map((sid, index) => {
        const s = data.screens[sid];
        const active = sid === store.currentScreenId;
        return (
          <div key={sid} style={{ display: "flex", alignItems: "center", gap: 3, position: "relative" }}>
            <button
              type="button"
              role="tab"
              aria-selected={active}
              aria-label={`${s.name || sid} screen${index < 9 ? `, shortcut ${index + 1}` : ""}`}
              title={`Switch to ${s.name || sid}${index < 9 ? ` (Ctrl/Command+${index + 1})` : ""}`}
              onClick={() => { store.setCurrentScreenId(sid); }}
              style={{
                padding: "5px 8px", borderRadius: theme.radius.md,
                border: active ? `1px solid ${theme.active}` : `1px solid transparent`,
                background: active ? theme.hoverAmber : "transparent",
                color: active ? "#5B3A00" : theme.textSecondary,
                fontSize: 12, fontWeight: active ? 700 : 500, cursor: "pointer",
                whiteSpace: "nowrap", fontFamily: "'Inter',sans-serif", minHeight: 32,
                display: "flex", alignItems: "center", gap: 6,
                transition: `all ${theme.transition}`,
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = theme.hover; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{
                width: 9, height: 9, borderRadius: 3,
                background: s.backgroundColor || "#FCF8FA",
                border: "1px solid rgba(0,0,0,0.1)", flexShrink: 0,
              }} />
              {editingScreenId === sid ? (
                <input
                  autoFocus
                  value={screenNameInput}
                  onChange={e => setScreenNameInput(e.target.value)}
                  onBlur={() => handleScreenRename(sid)}
                  onKeyDown={e => { if (e.key === "Enter") handleScreenRename(sid); if (e.key === "Escape") setEditingScreenId(null); }}
                  onClick={e => e.stopPropagation()}
                  style={{ width: 60, padding: "2px 4px", borderRadius: 4, border: `1px solid ${theme.active}`, fontSize: 12, outline: "none", background: active ? "#2a2a4e" : "#fff", color: active ? "#fff" : theme.text }}
                />
              ) : (
                <span onDoubleClick={() => { if (active) { setEditingScreenId(sid); setScreenNameInput(s.name || sid); } }}>
                  {s.name || sid}
                </span>
              )}
              {index < 9 && <kbd style={{ fontFamily: "inherit", fontSize: 9, lineHeight: 1, color: active ? "#8A5A13" : theme.textMuted, background: active ? "rgba(244,160,38,0.16)" : theme.hover, borderRadius: 3, padding: "3px 4px" }}>{index + 1}</kbd>}
              <span style={{ fontSize: 9, lineHeight: 1, color: active ? "#8A5A13" : theme.textMuted, background: active ? "rgba(244,160,38,0.12)" : theme.hover, borderRadius: 8, padding: "3px 5px" }} title={`${s.bodySections?.length || 0} sections`}>
                {s.bodySections?.length || 0}
              </span>
            </button>
            {active && (
              <div style={{ display: "flex", gap: 2, paddingLeft: 2, borderLeft: `1px solid ${theme.borderLight}` }}>
                <button
                  type="button"
                  aria-label={`Rename ${s.name || sid}`}
                  onClick={() => { setEditingScreenId(sid); setScreenNameInput(s.name || sid); }}
                  style={{ ...iconBtn, padding: "4px", border: "none", background: "transparent", boxShadow: "none" }} title="Rename screen"
                ><Pencil size={13} /></button>
                <button
                  type="button"
                  aria-label={`Duplicate ${s.name || sid}`}
                  onClick={() => { const newId = store.addScreen(null, (s.name || "New Page") + " (copy)"); store.setCurrentScreenId(newId); }}
                  style={{ ...iconBtn, padding: "4px", border: "none", background: "transparent", boxShadow: "none" }} title="Duplicate screen"
                ><Copy size={13} /></button>
                {screenIds.length > 1 && (
                  <button
                    type="button"
                    aria-label={`Delete ${s.name || sid}`}
                    onClick={async (e) => { e.stopPropagation(); if (await confirmDialog(`Delete "${s.name || sid}"?`)) { store.removeScreen(sid); } }}
                    style={{ ...iconBtn, padding: "4px", border: "none", background: "transparent", boxShadow: "none", color: theme.danger }} title="Delete screen"
                  ><Trash2 size={13} /></button>
                )}
              </div>
            )}
          </div>
        );
      })}
      </div>
      <button
        type="button"
        aria-label="Add screen"
        title="Add a blank screen"
        onClick={() => {
          const sid = store.addScreen(null, "New Page");
          store.setCurrentScreenId(sid);
        }}
        style={{
          width: 30, height: 30, borderRadius: theme.radius.md, border: `1px dashed ${theme.border}`,
          background: "transparent", color: theme.textSecondary,
          cursor: "pointer", flexShrink: 0,
          transition: `all ${theme.transition}`, display: "flex", alignItems: "center", gap: 4,
          justifyContent: "center",
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = theme.active; e.currentTarget.style.color = theme.active; e.currentTarget.style.background = theme.hoverAmber; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.textSecondary; e.currentTarget.style.background = "transparent"; }}
      ><Plus size={16} /></button>

      <div style={{ flex: 1 }} />

      <button
        type="button"
        aria-label={showNavEditor ? "Close navigation editor" : "Edit bottom navigation"}
        onClick={() => setShowNavEditor(!showNavEditor)}
        style={{
          padding: "5px 12px", borderRadius: theme.radius.md, border: showNavEditor ? `1.5px solid ${theme.active}` : `1.5px solid ${theme.border}`,
          background: showNavEditor ? theme.hoverAmber : theme.surface,
          color: showNavEditor ? "#6B4200" : theme.textSecondary,
          fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
          fontFamily: "'Inter',sans-serif", transition: `all ${theme.transition}`,
          display: "flex", alignItems: "center", gap: 5,
        }}
        onMouseEnter={e => { if (!showNavEditor) { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.background = theme.hover; } }}
        onMouseLeave={e => { if (!showNavEditor) { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.background = theme.surface; } }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
        {showNavEditor ? "Done" : "Nav"}
      </button>

      {showNavEditor && (
        <div style={{
          position: "absolute", bottom: "100%", right: 16,
          background: theme.surface, borderRadius: theme.radius.xl, boxShadow: theme.shadowLg,
          padding: 16, width: 320, zIndex: 20, marginBottom: 8,
        }}>
          <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 14, color: theme.text, marginBottom: 12 }}>
            Bottom Navigation Tabs
          </div>
          {(data.navigation.tabs || []).length === 0 && (
            <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 12 }}>No tabs yet. Add one below.</div>
          )}
          {(data.navigation.tabs || []).map((tab, i) => (
            <div key={tab.id || i} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "8px 10px",
              background: theme.hover, borderRadius: theme.radius.md, marginBottom: 6,
            }}>
              {editingTabIdx === i ? (
                <input
                  autoFocus
                  value={tabLabelInput}
                  onChange={e => setTabLabelInput(e.target.value)}
                  onBlur={() => { store.updateTab(i, { label: tabLabelInput }); setEditingTabIdx(null); }}
                  onKeyDown={e => { if (e.key === "Enter") { store.updateTab(i, { label: tabLabelInput }); setEditingTabIdx(null); } }}
                  style={{ flex: 1, padding: "4px 8px", borderRadius: 4, border: `1px solid ${theme.active}`, fontSize: 13, outline: "none" }}
                />
              ) : (
                <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: theme.text, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                  onClick={() => { setEditingTabIdx(i); setTabLabelInput(tab.label); }}
                >{(() => { const I = getLucideIcon(tab.icon); return I ? <I size={14} /> : null; })()} {tab.label}</span>
              )}
              <select
                value={tab.screenId}
                onChange={e => store.updateTab(i, { screenId: e.target.value })}
                style={{ fontSize: 12, padding: "2px 4px", borderRadius: 4, border: `1px solid ${theme.border}`, background: theme.surface, fontFamily: "'Inter',sans-serif" }}
              >
                <option value="">-- screen --</option>
                {screenIds.map(sid => (
                  <option key={sid} value={sid}>{data.screens[sid]?.name || sid}</option>
                ))}
              </select>
              <button onClick={() => store.reorderTab(i, "left")} disabled={i === 0}
                style={{ ...iconBtn, padding: "2px 4px", opacity: i === 0 ? 0.35 : 1, cursor: i === 0 ? "not-allowed" : "pointer" }}
              ><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg></button>
              <button onClick={() => store.reorderTab(i, "right")} disabled={i === (data.navigation.tabs || []).length - 1}
                style={{ ...iconBtn, padding: "2px 4px", opacity: i === (data.navigation.tabs || []).length - 1 ? 0.35 : 1, cursor: i === (data.navigation.tabs || []).length - 1 ? "not-allowed" : "pointer" }}
              ><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button>
              <button onClick={() => store.removeTab(i)}
                style={iconBtnDanger}
              ><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
            </div>
          ))}
          <button
            onClick={() => store.addTab({ label: "New Tab", icon: "Home", screenId: screenIds[0] || "" })}
            style={{ width: "100%", padding: "8px", borderRadius: theme.radius.md, border: `1.5px dashed ${theme.border}`, background: "transparent", color: theme.textSecondary, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Inter',sans-serif", marginTop: 8, transition: `all ${theme.transition}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = theme.active; e.currentTarget.style.color = theme.active; e.currentTarget.style.background = theme.hoverAmber; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.textSecondary; e.currentTarget.style.background = "transparent"; }}
          ><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Add Tab</button>
        </div>
      )}
    </div>
  );
}
