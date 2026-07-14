const tools = [
  { id: "select", label: "Select", shortcut: "V", icon: "⬚" },
  { id: "rectangle", label: "Rectangle", shortcut: "R", icon: "▬" },
  { id: "ellipse", label: "Ellipse", shortcut: "O", icon: "⬭" },
  { id: "text", label: "Text", shortcut: "T", icon: "Aa" },
  { id: "line", label: "Line", shortcut: "L", icon: "╱" },
  { id: "arrow", label: "Arrow", shortcut: "A", icon: "→" },
  { id: "hand", label: "Hand", shortcut: "H", icon: "✋" },
];

export default function Toolbar({ activeTool, onSetTool }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: 2,
      padding: "8px 4px", background: "#fff",
      borderRight: "1px solid #E5E7EB", width: 44,
      alignItems: "center", flexShrink: 0,
    }}>
      <div style={{ fontSize: 9, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6, textAlign: "center", lineHeight: 1.2 }}>Tools</div>
      {tools.map(t => (
        <button
          key={t.id}
          onClick={() => onSetTool(t.id)}
          title={`${t.label} (${t.shortcut})`}
          style={{
            width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: 8, border: "none", cursor: "pointer", fontSize: 16,
            background: activeTool === t.id ? "#F4A026" : "transparent",
            color: activeTool === t.id ? "#1C1B1D" : "#6B7280",
            transition: "all 0.1s",
            position: "relative",
          }}
          onMouseEnter={e => { if (activeTool !== t.id) { e.currentTarget.style.background = "#F3F4F6"; }}}
          onMouseLeave={e => { if (activeTool !== t.id) { e.currentTarget.style.background = "transparent"; }}}
        >
          {t.icon}
        </button>
      ))}
    </div>
  );
}

export { tools };
