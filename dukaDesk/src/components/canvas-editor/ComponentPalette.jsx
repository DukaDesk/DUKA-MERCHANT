import { useState, useCallback } from "react";
import { getAllComponentTypes } from "./componentTypes";
import AssetPanel from "./AssetPanel";

const categories = ["Primitives", "SDUI Components"];

export default function ComponentPalette({ assets, onAddAsset, onRemoveAsset, componentLibrary, onRemoveFromLibrary, tokens }) {
  const [tab, setTab] = useState("components");
  const all = getAllComponentTypes();

  const handleLibDragStart = useCallback((e, libItem) => {
    e.dataTransfer.setData("library-component", JSON.stringify(libItem.component));
    e.dataTransfer.effectAllowed = "copy";
  }, []);

  return (
    <div style={{ width: 220, background: "#fff", borderRight: "1px solid #E5E7EB", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ display: "flex", borderBottom: "1px solid #E5E7EB", flexShrink: 0 }}>
        {["components", "assets", "library", "tokens"].map(t => (
          <div key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1, padding: "10px 4px", textAlign: "center", cursor: "pointer",
              fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 11,
              color: tab === t ? "#0F0F1A" : "#9CA3AF",
              borderBottom: tab === t ? "2px solid #F4A026" : "2px solid transparent",
              transition: "all 0.1s",
            }}
              >{t === "components" ? "Components" : t === "assets" ? "Assets" : t === "library" ? "Library" : "Tokens"}</div>
        ))}
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: tab === "assets" ? 0 : 8 }}>
        {tab === "components" ? (
          categories.map(cat => {
            const items = all.filter(t => t.category === cat);
            if (items.length === 0) return null;
            return (
              <div key={cat} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.04em", padding: "4px 8px", marginBottom: 4 }}>{cat}</div>
                {items.map(def => (
                  <div
                    key={def.type}
                    draggable
                    onDragStart={e => e.dataTransfer.setData("component-type", def.type)}
                    style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
                      borderRadius: 8, cursor: "grab", transition: "all 0.1s",
                      border: "1px solid transparent",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#F3F4F6"; e.currentTarget.style.borderColor = "#E5E7EB"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; }}
                  >
                    <span style={{ fontSize: 18, width: 24, textAlign: "center", flexShrink: 0 }}>{def.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: "#1C1B1D", fontFamily: "'Inter',sans-serif" }}>{def.label}</div>
                      <div style={{ fontSize: 10, color: "#9CA3AF" }}>{def.type}</div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })
        ) : tab === "assets" ? (
          <AssetPanel assets={assets} onAddAsset={onAddAsset} onRemoveAsset={onRemoveAsset} />
        ) : tab === "tokens" ? (
          <div style={{ padding: 8 }}>
            {(!tokens?.colors || tokens.colors.length === 0) ? (
              <div style={{ textAlign: "center", color: "#9CA3AF", fontSize: 12, padding: 20 }}>
                No saved styles yet.<br />
                Use "Save as Style" in the Design panel
              </div>
            ) : (
              <>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.04em", padding: "4px 8px", marginBottom: 4 }}>Colors ({tokens.colors?.length || 0})</div>
                {(tokens.colors || []).map(token => (
                  <div key={token.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", borderRadius: 6, marginBottom: 2, fontSize: 12, border: "1px solid #F3F4F6" }}>
                    <div style={{ width: 20, height: 20, borderRadius: 4, background: token.value?.color || "#E5E1E3", flexShrink: 0, border: "1px solid #D1D5DB" }} />
                    <span style={{ flex: 1, color: "#1C1B1D", fontWeight: 500 }}>{token.name}</span>
                    <span style={{ fontSize: 10, color: "#9CA3AF" }}>{token.value?.color}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        ) : (
          <div style={{ padding: 8 }}>
            {(componentLibrary || []).length === 0 ? (
              <div style={{ textAlign: "center", color: "#9CA3AF", fontSize: 12, padding: 20 }}>
                No saved components yet.<br />
                Right-click a component and select "Save to Library"
              </div>
            ) : (
              componentLibrary.map(item => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={e => handleLibDragStart(e, item)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "6px 8px",
                    borderRadius: 6, cursor: "grab", fontSize: 12, marginBottom: 4,
                    border: "1px solid #E5E7EB", background: "#FAFAFA",
                  }}
                >
                  <span style={{ fontSize: 14 }}>{item.component?.type === "button" ? "🔘" : "📦"}</span>
                  <span style={{ flex: 1, fontWeight: 500, color: "#1C1B1D", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</span>
                  <span style={{ fontSize: 10, color: "#9CA3AF" }}>{item.type}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); onRemoveFromLibrary?.(item.id); }}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#E74C3C", fontSize: 12, padding: 0 }}
                  >×</button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
