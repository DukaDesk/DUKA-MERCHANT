import { useState } from "react";
import { theme, iconBtn, iconBtnDanger } from "./editorTheme";

export default function ScreenSwitcher({ store }) {
  const data = store.data;
  const screenIds = Object.keys(data.screens);
  const [editingTabIdx, setEditingTabIdx] = useState(null);
  const [tabLabelInput, setTabLabelInput] = useState("");
  const [showNavEditor, setShowNavEditor] = useState(false);
  const [editingScreenId, setEditingScreenId] = useState(null);
  const [screenNameInput, setScreenNameInput] = useState("");

  const handleScreenRename = (sid) => {
    if (screenNameInput.trim()) store.renameScreen(sid, screenNameInput.trim());
    setEditingScreenId(null);
  };

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "8px 16px", borderTop: `1px solid ${theme.border}`, background: theme.surface,
      fontFamily: "'Inter',sans-serif", flexShrink: 0, minHeight: 48,
      overflowX: "auto",
    }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: theme.textSecondary, whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: "0.5px" }}>
        Pages
      </span>
      {screenIds.map(sid => {
        const s = data.screens[sid];
        const active = sid === store.currentScreenId;
        return (
          <div key={sid} style={{ display: "flex", alignItems: "center", gap: 3, position: "relative" }}>
            <button
              onClick={() => { store.setCurrentScreenId(sid); }}
              style={{
                padding: "5px 10px", borderRadius: theme.radius.md, border: "none",
                background: active ? "#1A1A2E" : "transparent",
                color: active ? "#fff" : theme.textSecondary,
                fontSize: 13, fontWeight: active ? 600 : 500, cursor: "pointer",
                whiteSpace: "nowrap", fontFamily: "'Inter',sans-serif",
                display: "flex", alignItems: "center", gap: 6,
                transition: `all ${theme.transition}`,
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = theme.hover; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{
                width: 8, height: 8, borderRadius: "50%",
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
            </button>
            {active && (
              <div style={{ display: "flex", gap: 2 }}>
                <button
                  onClick={() => { const newId = store.addScreen(null, (s.name || "New Page") + " (copy)"); store.setCurrentScreenId(newId); }}
                  style={{ ...iconBtn, padding: "3px", border: "none", background: "transparent", boxShadow: "none" }} title="Duplicate screen"
                ><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>
                {screenIds.length > 1 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); if (confirm(`Delete "${s.name || sid}"?`)) { store.removeScreen(sid); } }}
                    style={{ ...iconBtn, padding: "3px", border: "none", background: "transparent", boxShadow: "none", color: theme.danger }} title="Delete screen"
                  ><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
                )}
              </div>
            )}
          </div>
        );
      })}
      <button
        onClick={() => {
          const sid = store.addScreen(null, "New Page");
          store.setCurrentScreenId(sid);
        }}
        style={{
          padding: "5px 10px", borderRadius: theme.radius.md, border: `1.5px dashed ${theme.border}`,
          background: "transparent", color: theme.textSecondary, fontSize: 12, fontWeight: 600,
          cursor: "pointer", whiteSpace: "nowrap", fontFamily: "'Inter',sans-serif",
          transition: `all ${theme.transition}`, display: "flex", alignItems: "center", gap: 4,
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = theme.active; e.currentTarget.style.color = theme.active; e.currentTarget.style.background = theme.hoverAmber; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.textSecondary; e.currentTarget.style.background = "transparent"; }}
      ><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Add</button>

      <div style={{ flex: 1 }} />

      <button
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
                <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: theme.text, cursor: "pointer" }}
                  onClick={() => { setEditingTabIdx(i); setTabLabelInput(tab.label); }}
                >{tab.icon} {tab.label}</span>
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
            onClick={() => store.addTab({ label: "New Tab", icon: "\uD83D\uDCCB", screenId: screenIds[0] || "" })}
            style={{ width: "100%", padding: "8px", borderRadius: theme.radius.md, border: `1.5px dashed ${theme.border}`, background: "transparent", color: theme.textSecondary, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Inter',sans-serif", marginTop: 8, transition: `all ${theme.transition}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = theme.active; e.currentTarget.style.color = theme.active; e.currentTarget.style.background = theme.hoverAmber; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.textSecondary; e.currentTarget.style.background = "transparent"; }}
          ><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Add Tab</button>
        </div>
      )}
    </div>
  );
}
