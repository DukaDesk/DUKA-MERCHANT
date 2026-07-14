const groups = [
  {
    name: "Tools",
    items: [
      { key: "V", desc: "Select / Move" },
      { key: "R", desc: "Rectangle" },
      { key: "O", desc: "Ellipse" },
      { key: "T", desc: "Text" },
      { key: "L", desc: "Line" },
      { key: "A", desc: "Arrow" },
      { key: "H", desc: "Hand (Pan)" },
      { key: "P", desc: "Pen (Vector)" },
    ],
  },
  {
    name: "Edit",
    items: [
      { key: "Ctrl+Z", desc: "Undo" },
      { key: "Ctrl+Shift+Z", desc: "Redo" },
      { key: "Ctrl+D", desc: "Duplicate" },
      { key: "Ctrl+C", desc: "Copy" },
      { key: "Ctrl+V", desc: "Paste" },
      { key: "Delete / Backspace", desc: "Delete selected" },
      { key: "Ctrl+A", desc: "Select all" },
      { key: "Ctrl+Shift+C", desc: "Copy styles" },
      { key: "Ctrl+Shift+V", desc: "Paste styles" },
    ],
  },
  {
    name: "Align & Move",
    items: [
      { key: "Arrow keys", desc: "Nudge 1px" },
      { key: "Shift+Arrow", desc: "Nudge 10px" },
      { key: "Shift+Click", desc: "Multi-select" },
      { key: "Click drag", desc: "Marquee select" },
    ],
  },
  {
    name: "View",
    items: [
      { key: "Ctrl+Scroll", desc: "Zoom in / out" },
      { key: "Scroll", desc: "Pan canvas" },
      { key: "Shift+Drag", desc: "Pan (in select tool)" },
      { key: "?", desc: "Toggle this cheat sheet" },
      { key: "Escape", desc: "Deselect / Switch to select" },
    ],
  },
];

export default function ShortcutsHelp({ onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 99999,
        background: "rgba(0,0,0,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 16, padding: 28, maxWidth: 520,
          width: "90%", maxHeight: "80vh", overflow: "auto",
          boxShadow: "0 16px 48px rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontFamily: "'Sora',sans-serif", fontSize: 20, fontWeight: 700, color: "#0F0F1A" }}>
            Keyboard Shortcuts
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#9CA3AF", padding: 4 }}>×</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {groups.map(group => (
            <div key={group.name}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8 }}>
                {group.name}
              </div>
              {group.items.map(item => (
                <div key={item.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: "1px solid #F3F4F6" }}>
                  <span style={{ fontSize: 12, color: "#6B7280" }}>{item.desc}</span>
                  <kbd style={{
                    fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 600,
                    padding: "2px 8px", borderRadius: 4, background: "#F3F4F6",
                    border: "1px solid #E5E7EB", color: "#374151", whiteSpace: "nowrap",
                  }}>
                    {item.key}
                  </kbd>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, fontSize: 11, color: "#9CA3AF", textAlign: "center" }}>
          Press <kbd style={{ fontFamily: "'Inter',sans-serif", fontWeight: 600, padding: "1px 6px", borderRadius: 4, background: "#F3F4F6", border: "1px solid #E5E7EB" }}>?</kbd> to toggle this overlay
        </div>
      </div>
    </div>
  );
}
