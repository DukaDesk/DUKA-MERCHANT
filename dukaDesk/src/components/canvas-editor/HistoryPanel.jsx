import { useState, useRef, useEffect } from "react";

export default function HistoryPanel({ onUndo, onRedo, canUndo, canRedo }) {
  const [expanded, setExpanded] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!expanded) return;
    const handleClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setExpanded(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [expanded]);

  return (
    <div ref={panelRef} style={{ position: "relative" }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          padding: "4px 8px", borderRadius: 6, border: "1px solid #E5E7EB",
          background: "#fff", cursor: "pointer", fontSize: 11, color: "#6B7280",
          fontFamily: "'Inter',sans-serif", display: "flex", alignItems: "center", gap: 4,
        }}
        title="History"
      >
        <span style={{ fontSize: 14 }}>↩</span>
        <span style={{ fontSize: 10 }}>{canUndo ? "●" : "○"}</span>
      </button>
      {expanded && (
        <div style={{
          position: "absolute", top: "100%", right: 0, marginTop: 4,
          background: "#fff", borderRadius: 10, boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          border: "1px solid #E5E7EB", padding: 8, minWidth: 160, zIndex: 100,
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", marginBottom: 8, padding: "0 4px" }}>History</div>
          <button
            onClick={() => { onUndo(); setExpanded(false); }}
            disabled={!canUndo}
            style={historyBtn(canUndo)}
          >↩ Undo (Ctrl+Z)</button>
          <button
            onClick={() => { onRedo(); setExpanded(false); }}
            disabled={!canRedo}
            style={historyBtn(canRedo)}
          >↪ Redo (Ctrl+Shift+Z)</button>
        </div>
      )}
    </div>
  );
}

function historyBtn(enabled) {
  return {
    display: "block", width: "100%", padding: "6px 8px", borderRadius: 6,
    border: "none", cursor: enabled ? "pointer" : "default",
    fontSize: 12, color: enabled ? "#1C1B1D" : "#D1D5DB",
    textAlign: "left", fontFamily: "'Inter',sans-serif",
    background: "transparent",
  };
}
