import { useState, useCallback } from "react";
import { getComponentType } from "./componentTypes";

function LayerRow({ comp, def, isSelected, onSelect, onToggleVis, onToggleLock, onRename, onMoveLayer, onUngroup }) {
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");

  const handleDoubleClick = () => {
    setEditing(true);
    setEditName(def?.label || comp.type);
  };

  const handleRename = () => {
    if (editName.trim()) onRename(comp.id, editName.trim());
    setEditing(false);
  };

  const handleDragStart = useCallback((e) => {
    e.dataTransfer.setData("layer-id", comp.id);
    e.currentTarget.style.opacity = "0.5";
  }, [comp.id]);

  const handleDragEnd = useCallback((e) => {
    e.currentTarget.style.opacity = "1";
  }, []);

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={(e) => onSelect(comp.id, e.shiftKey)}
      onDoubleClick={handleDoubleClick}
      style={{
        display: "flex", alignItems: "center", gap: 4, padding: "4px 6px",
        borderRadius: 6, cursor: "pointer",
        background: isSelected ? "#FFF8ED" : "transparent",
        border: isSelected ? "1px solid #F4A026" : "1px solid transparent",
        opacity: comp.visible ? 1 : 0.4,
        marginBottom: 2, fontSize: 13,
        userSelect: "none",
      }}
      title={comp.groupId ? `Group: ${comp.groupId}` : def?.label || comp.type}
    >
      <span
        onClick={(e) => { e.stopPropagation(); onToggleVis(comp.id); }}
        style={{ fontSize: 11, cursor: "pointer", width: 16, textAlign: "center", flexShrink: 0, color: comp.visible ? "#6B7280" : "#D1D5DB" }}
        title={comp.visible ? "Hide" : "Show"}
      >
        {comp.visible ? "👁" : "○"}
      </span>
      <span
        onClick={(e) => { e.stopPropagation(); onToggleLock(comp.id); }}
        style={{ fontSize: 10, cursor: "pointer", width: 14, textAlign: "center", flexShrink: 0, color: comp.locked ? "#E74C3C" : "#D1D5DB" }}
        title={comp.locked ? "Unlock" : "Lock"}
      >
        {comp.locked ? "🔒" : "○"}
      </span>
      <span style={{ fontSize: 13, width: 18, textAlign: "center", flexShrink: 0 }}>
        {comp.isGroup ? "📁" : (def?.icon || "?")}
      </span>
      {editing ? (
        <input
          autoFocus
          value={editName}
          onChange={e => setEditName(e.target.value)}
          onBlur={handleRename}
          onKeyDown={e => { if (e.key === "Enter") handleRename(); if (e.key === "Escape") setEditing(false); }}
          style={{ flex: 1, border: "1px solid #D1D5DB", borderRadius: 4, padding: "1px 4px", fontSize: 12, outline: "none", minWidth: 0 }}
          onClick={e => e.stopPropagation()}
        />
      ) : (
        <span style={{ flex: 1, fontWeight: isSelected ? 600 : 400, color: "#1C1B1D", fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {def?.label || comp.type}
        </span>
      )}
      <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
        {comp.isGroup && (
          <button onClick={(e) => { e.stopPropagation(); onUngroup(comp.id); }} style={miniBtn} title="Ungroup">⊘</button>
        )}
        <button onClick={(e) => { e.stopPropagation(); onMoveLayer(comp.id, "up"); }} style={miniBtn} title="Bring forward">↑</button>
        <button onClick={(e) => { e.stopPropagation(); onMoveLayer(comp.id, "down"); }} style={miniBtn} title="Send backward">↓</button>
      </div>
    </div>
  );
}

export default function LayersPanel({
  screen, selectedIds, onSelect, onMoveLayer, onRemoveComponents, onDuplicateComponents,
  onToggleVisible, onToggleLocked, onGroup, onUngroup, onRename,
}) {
  const comps = screen?.components || [];

  const rootLayers = comps.filter(c => !c.groupId);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("layer-id");
    const targetId = e.currentTarget.dataset?.layerId;
    if (draggedId && targetId && draggedId !== targetId) {
      onMoveLayer(draggedId, "up");
    }
  }, [onMoveLayer]);

  return (
    <div style={{ background: "#fff", borderTop: "1px solid #E5E7EB", display: "flex", flexDirection: "column", height: 200 }}>
      <div style={{ padding: "6px 12px", borderBottom: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 13, color: "#0F0F1A" }}>
          Layers
          <span style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 400, marginLeft: 6 }}>{comps.length}</span>
        </span>
        <div style={{ display: "flex", gap: 4 }}>
          {selectedIds.length > 1 && (
            <button onClick={() => onGroup(selectedIds)} style={actionBtn} title="Group selection">📁 Group</button>
          )}
          {selectedIds.length > 0 && (
            <>
              <button onClick={() => onDuplicateComponents(selectedIds)} style={actionBtn} title="Duplicate">⧉</button>
              <button onClick={() => onRemoveComponents(selectedIds)} style={{ ...actionBtn, color: "#E74C3C" }} title="Delete">🗑</button>
            </>
          )}
        </div>
      </div>
      <div
        style={{ flex: 1, overflow: "auto", padding: 4 }}
        onDragOver={handleDragOver}
      >
        {rootLayers.length === 0 ? (
          <div style={{ padding: 16, textAlign: "center", color: "#9CA3AF", fontSize: 12 }}>No layers yet</div>
        ) : (
          [...rootLayers].reverse().map(comp => {
            const def = getComponentType(comp.type);
            return (
              <LayerRow
                key={comp.id}
                comp={comp}
                def={def}
                isSelected={selectedIds.includes(comp.id)}
                onSelect={onSelect}
                onToggleVis={onToggleVisible}
                onToggleLock={onToggleLocked}
                onRename={onRename}
                onMoveLayer={onMoveLayer}
                onUngroup={onUngroup}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

const actionBtn = {
  background: "none", border: "1px solid #E5E7EB", borderRadius: 6, cursor: "pointer",
  fontSize: 11, padding: "2px 6px", lineHeight: 1.6, color: "#6B7280",
  fontFamily: "'Inter',sans-serif",
};

const miniBtn = {
  background: "none", border: "none", cursor: "pointer",
  fontSize: 11, padding: "0 2px", color: "#9CA3AF", lineHeight: 1,
};
