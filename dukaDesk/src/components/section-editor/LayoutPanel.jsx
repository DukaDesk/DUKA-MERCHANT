import { theme } from "./editorTheme";
import { SECTION_PRESETS } from "./sectionPresets";

export default function LayoutPanel({ onAddPreset, onAddTabs, open, onToggle }) {
  return (
    <div>
      <button
        onClick={onToggle}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: 6,
          padding: "9px 12px", background: open ? theme.hoverAmber : "transparent",
          border: "none", borderBottom: `1px solid ${theme.border}`,
          cursor: "pointer", fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 12,
          color: open ? "#6B4200" : theme.text,
          transition: `all ${theme.transition}`,
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? "rotate(0deg)" : "rotate(-90deg)", transition: `transform ${theme.transition}` }}><polyline points="6 9 12 15 18 9"/></svg>
        <span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: -2, marginRight: 5 }}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          Layout
        </span>
        {!open && (
          <span style={{ fontSize: 9, color: theme.textMuted, background: theme.hover, borderRadius: 8, padding: "0 6px" }}>Add Section</span>
        )}
      </button>

      {open && (
        <div style={{ padding: "8px 12px 12px", borderBottom: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 10, color: theme.textMuted, fontFamily: "'Inter',sans-serif" }}>
            Add a section layout to this screen — then fill it with components from the right.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {Object.entries(SECTION_PRESETS).map(([key, sec]) => (
              <button
                key={key}
                onClick={() => onAddPreset(key)}
                style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "9px 10px",
                  borderRadius: theme.radius.md, border: `1px solid ${theme.border}`,
                  background: theme.surface, cursor: "pointer", textAlign: "left",
                  fontFamily: "'Inter',sans-serif", transition: `all ${theme.transition}`,
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = theme.active; e.currentTarget.style.background = theme.hoverAmber; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.background = theme.surface; }}
              >
                <span style={{ fontSize: 18 }}>{sec.icon}</span>
                <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 10, color: theme.textSecondary, fontWeight: 600 }}>{sec.name}</span>
              </button>
            ))}
          </div>

          {/* Bottom navigation tabs */}
          <div style={{
            marginTop: 2, border: `1px solid ${theme.border}`, borderRadius: theme.radius.md,
            padding: 10, background: theme.hover,
          }}>
            <div style={{ fontSize: 10, color: theme.textSecondary, fontFamily: "'Inter',sans-serif", marginBottom: 6, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>Bottom Navigation</span>
            </div>
            <div style={{ fontSize: 10, color: theme.textMuted, fontFamily: "'Inter',sans-serif", marginBottom: 8, lineHeight: 1.4 }}>
              Tabs let customers jump between pages from the bottom bar (Home, Menu, Profile…).
            </div>
            <button
              onClick={onAddTabs}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                padding: "8px 10px", borderRadius: theme.radius.md, border: `1.5px dashed ${theme.border}`,
                background: theme.surface, color: theme.textSecondary, fontSize: 11, fontWeight: 600,
                cursor: "pointer", fontFamily: "'Inter',sans-serif", transition: `all ${theme.transition}`,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = theme.active; e.currentTarget.style.color = theme.active; e.currentTarget.style.background = theme.hoverAmber; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.textSecondary; e.currentTarget.style.background = theme.surface; }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Tabs
            </button>
          </div>
        </div>
      )}
    </div>
  );
}