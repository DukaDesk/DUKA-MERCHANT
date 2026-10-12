import { useEffect, useRef } from "react";
import { useEditorTheme } from "./editorTheme.jsx";

/* Shared right-click menu: Edit / Duplicate / Delete style actions.
   items: [{ id, label, danger?, disabled?, onSelect }] */
export default function ContextMenu({ x, y, items, onClose, label }) {
  const { theme } = useEditorTheme();
  const ref = useRef(null);

  useEffect(() => {
    const onPointerDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose?.();
    };
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    const onScroll = () => onClose?.();
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    document.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("scroll", onScroll, true);
    };
  }, [onClose]);

  const left = Math.min(x, window.innerWidth - 200);
  const top = Math.min(y, window.innerHeight - items.length * 36 - 40);

  return (
    <div
      ref={ref}
      role="menu"
      aria-label={label || "Context menu"}
      style={{
        position: "fixed", left, top, zIndex: 200, minWidth: 180,
        background: theme.surface, borderRadius: theme.radius.md,
        boxShadow: theme.shadowLg, border: `1px solid ${theme.border}`,
        padding: 4, fontFamily: "'Inter',sans-serif",
      }}
    >
      {items.map(item => (
        <button
          key={item.id}
          role="menuitem"
          disabled={item.disabled}
          onClick={() => { onClose?.(); if (!item.disabled) item.onSelect?.(); }}
          style={{
            display: "flex", alignItems: "center", gap: 8, width: "100%",
            padding: "8px 10px", borderRadius: theme.radius.sm, border: "none",
            background: "transparent", color: item.danger ? theme.danger : theme.text,
            fontSize: 12, fontWeight: 500, cursor: item.disabled ? "not-allowed" : "pointer",
            opacity: item.disabled ? 0.45 : 1, textAlign: "left",
          }}
          onMouseEnter={e => { if (!item.disabled) e.currentTarget.style.background = theme.hover; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>
  );
}
