const items = [
  { id: "cut", label: "Cut", shortcut: "Ctrl+X" },
  { id: "copy", label: "Copy", shortcut: "Ctrl+C" },
  { id: "paste", label: "Paste", shortcut: "Ctrl+V" },
  { id: "duplicate", label: "Duplicate", shortcut: "Ctrl+D" },
  { type: "separator" },
  { id: "delete", label: "Delete", shortcut: "Del" },
  { id: "group", label: "Group", shortcut: "Ctrl+G" },
  { id: "ungroup", label: "Ungroup", shortcut: "Ctrl+Shift+G" },
  { type: "separator" },
  { id: "lock", label: "Lock / Unlock" },
  { id: "hide", label: "Hide / Show" },
  { type: "separator" },
  { id: "copyStyles", label: "Copy Styles", shortcut: "Ctrl+Shift+C" },
  { id: "pasteStyles", label: "Paste Styles", shortcut: "Ctrl+Shift+V" },
  { id: "saveToLibrary", label: "Save to Library" },
  { type: "separator" },
  { id: "bringForward", label: "Bring Forward" },
  { id: "sendBackward", label: "Send Backward" },
];

export default function ContextMenu({ x, y, onAction, hasSelection, isGroup, onClose }) {
  if (x == null) return null;

  const handleAction = (id) => {
    onAction(id);
    onClose();
  };

  return (
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: 99998 }} onClick={onClose} />
      <div style={{
        position: "fixed", left: x, top: y, zIndex: 99999,
        background: "#fff", borderRadius: 10, boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        border: "1px solid #E5E7EB", padding: "4px 0", minWidth: 200,
        overflow: "hidden",
      }}>
        {items.map((item, i) => {
          if (item.type === "separator") {
            return <div key={i} style={{ height: 1, background: "#F3F4F6", margin: "4px 8px" }} />;
          }
          const disabled = !hasSelection && ["cut", "copy", "duplicate", "delete", "lock", "hide", "bringForward", "sendBackward"].includes(item.id);
          if (item.id === "ungroup" && !isGroup) return null;
          if (item.id === "group" && !hasSelection) return null;
          return (
            <div
              key={item.id}
              onClick={() => !disabled && handleAction(item.id)}
              style={{
                padding: "6px 16px", fontSize: 13, color: disabled ? "#D1D5DB" : "#1C1B1D",
                cursor: disabled ? "default" : "pointer", display: "flex", justifyContent: "space-between",
                alignItems: "center", fontFamily: "'Inter',sans-serif",
                transition: "background 0.05s",
              }}
              onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = "#F3F4F6"; }}
              onMouseLeave={e => { if (!disabled) e.currentTarget.style.background = "transparent"; }}
            >
              <span>{item.label}</span>
              <span style={{ fontSize: 10, color: "#9CA3AF" }}>{item.shortcut}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}
