const alignments = [
  { id: "alignLeft", icon: "⬅", label: "Align Left", shortcut: "Alt+1" },
  { id: "alignCenter", icon: "⬇", label: "Align Center H", shortcut: "Alt+2" },
  { id: "alignRight", icon: "➡", label: "Align Right", shortcut: "Alt+3" },
  { id: "alignTop", icon: "⬆", label: "Align Top", shortcut: "Alt+4" },
  { id: "alignMiddle", icon: "⬌", label: "Align Middle V", shortcut: "Alt+5" },
  { id: "alignBottom", icon: "⬇", label: "Align Bottom", shortcut: "Alt+6" },
  { id: "distributeH", icon: "⇔", label: "Distribute H", shortcut: "Alt+7" },
  { id: "distributeV", icon: "⇅", label: "Distribute V", shortcut: "Alt+8" },
];

export default function AlignmentToolbar({ onAlign, hasMultiSelection }) {
  if (!hasMultiSelection) return null;
  return (
    <div style={{ display: "flex", gap: 2, padding: "4px 8px", background: "#F9FAFB", borderRadius: 8, border: "1px solid #E5E7EB", alignItems: "center" }}>
      {alignments.map(a => (
        <button
          key={a.id}
          onClick={() => onAlign(a.id)}
          title={`${a.label} (${a.shortcut})`}
          style={{
            width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: 6, border: "none", cursor: "pointer", fontSize: 14,
            background: "transparent", color: "#6B7280",
            transition: "all 0.1s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "#F3F4F6"; e.currentTarget.style.color = "#1C1B1D"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#6B7280"; }}
        >
          {a.icon}
        </button>
      ))}
    </div>
  );
}
