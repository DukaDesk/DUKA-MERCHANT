import { useEditorTheme } from "./editorTheme";

const GROUPS = [
  { label: "Rectangle", ids: ["button", "icon-rectangle"] },
  { label: "Round / FAB", ids: ["round"] },
  { label: "Pills", ids: ["pill", "icon-pill", "pill-set", "icon-pill-set"] },
  { label: "Pressables", ids: ["text-pressable", "icon-pressable"] },
];

export default function ButtonGallery({ items, onAdd, disabled, searching }) {
  const { theme } = useEditorTheme();
  return <div>{GROUPS.map(group => {
    const examples = items.filter(item => group.ids.includes(item.catalogId));
    if (!examples.length) return null;
    return <details key={group.label} open={searching || group.label === "Rectangle" || group.label === "Round / FAB"} style={{ marginBottom: 6, border: "1px solid " + theme.border, borderRadius: 8, overflow: "hidden" }}>
      <summary style={{ padding: "7px 9px", fontSize: 11, fontWeight: 600, color: theme.text, cursor: "pointer" }}>{group.label}</summary>
      <div style={{ padding: "0 6px 6px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>{examples.map(item => <button type="button" key={item.catalogId} aria-label={item.label} title={disabled ? "Select a screen or section first" : `Add ${item.label}`} disabled={disabled} onClick={() => onAdd(item)} style={{ minWidth: 0, gridColumn: item.type === "category_pills" ? "1 / -1" : undefined, padding: 5, border: "1px solid " + theme.border, borderRadius: 10, background: theme.hover, cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.45 : 1 }}>
        <div aria-hidden="true" style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", overflow: "hidden" }}>
          <div style={{ width: item.defaultProps.width || (item.type === "category_pills" ? 300 : 150), flexShrink: 0, transform: "scale(0.65)", transformOrigin: "center" }}>{item.render(item.defaultProps)}</div>
        </div>
        <div style={{ marginTop: 3, color: theme.textSecondary, fontSize: 9 }}>{item.label}</div>
      </button>)}</div>
    </details>;
  })}</div>;
}
