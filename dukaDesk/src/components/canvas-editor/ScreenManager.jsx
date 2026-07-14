import { useState } from "react";

export default function ScreenManager({ data, currentScreenId, setCurrentScreenId, addScreen, removeScreen, renameScreen }) {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  const screens = Object.entries(data.screens).map(([id, s]) => ({ id, ...s }));
  const tabs = data.navigation.tabs || [];

  const handleDoubleClick = (id, name) => {
    setEditingId(id);
    setEditName(name);
  };

  const handleRename = (id) => {
    if (editName.trim()) renameScreen(id, editName.trim());
    setEditingId(null);
  };

  const toggleTab = (screenId) => {
    const exists = tabs.find(t => t.screenId === screenId);
    if (exists) {
      const newTabs = tabs.filter(t => t.screenId !== screenId);
      window.__canvasSetTabs?.(newTabs);
    } else {
      const screen = data.screens[screenId];
      const newTabs = [...tabs, { label: screen?.name || "Screen", icon: "📄", screenId }];
      window.__canvasSetTabs?.(newTabs);
    }
  };

  return (
    <div style={{ width: 200, background: "#FAFAFA", borderRight: "1px solid #E5E7EB", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ padding: "14px 16px", borderBottom: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 14, color: "#0F0F1A" }}>Screens</span>
        <button
          onClick={() => addScreen()}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#6B7280", padding: "0 4px", lineHeight: 1 }}
          title="Add screen"
        >+</button>
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: 8 }}>
        {screens.map(({ id, name }) => (
          <div key={id} style={{ marginBottom: 4 }}>
            <div
              onClick={() => setCurrentScreenId(id)}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "6px 8px",
                borderRadius: 6, cursor: "pointer", transition: "all 0.1s",
                background: currentScreenId === id ? "#FFF8ED" : "transparent",
                border: currentScreenId === id ? "1px solid #F4A026" : "1px solid transparent",
              }}
            >
              <span style={{ fontSize: 14 }}>📄</span>
              {editingId === id ? (
                <input
                  autoFocus
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  onBlur={() => handleRename(id)}
                  onKeyDown={e => { if (e.key === "Enter") handleRename(id); if (e.key === "Escape") setEditingId(null); }}
                  style={{ flex: 1, border: "1px solid #D1D5DB", borderRadius: 4, padding: "2px 6px", fontSize: 13, outline: "none" }}
                />
              ) : (
                <span
                  style={{ flex: 1, fontSize: 13, fontWeight: currentScreenId === id ? 600 : 400, color: "#1C1B1D", fontFamily: "'Inter',sans-serif" }}
                  onDoubleClick={() => handleDoubleClick(id, name)}
                >
                  {name}
                </span>
              )}
              <span
                onClick={() => toggleTab(id)}
                style={{ fontSize: 12, cursor: "pointer", opacity: tabs.find(t => t.screenId === id) ? 1 : 0.3 }}
                title={tabs.find(t => t.screenId === id) ? "Remove from nav" : "Add to nav"}
              >{tabs.find(t => t.screenId === id) ? "🔗" : "○"}</span>
              {screens.length > 1 && (
                <span
                  onClick={() => removeScreen(id)}
                  style={{ fontSize: 12, cursor: "pointer", opacity: 0.3, color: "#E74C3C" }}
                  title="Delete screen"
                >✕</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
