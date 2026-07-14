import { getComponentType } from "./componentTypes";

function parseAction(comp) {
  if (!comp.props?.action) return null;
  try {
    const parsed = typeof comp.props.action === "string" ? JSON.parse(comp.props.action) : comp.props.action;
    return parsed?.screenId || null;
  } catch { return null; }
}

export default function PhonePreview({ data, currentScreenId, setCurrentScreenId, prototyping }) {
  const screen = data.screens[currentScreenId] || data.screens[data.navigation.initialScreen];
  const tabs = data.navigation.tabs || [];

  if (!screen) return null;

  return (
    <div style={{ width: 260, background: "#fff", borderLeft: "1px solid #E5E7EB", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ padding: "14px 16px", borderBottom: "1px solid #E5E7EB", fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 14, color: "#0F0F1A", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span>Preview</span>
        {prototyping && <span style={{ fontSize: 10, background: "#F4A026", color: "#6B4200", padding: "2px 8px", borderRadius: 10, fontWeight: 600 }}>Prototype</span>}
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, overflow: "hidden" }}>
        <div style={{
          width: 240, height: 480, background: screen.backgroundColor || "#FCF8FA",
          borderRadius: 24, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          display: "flex", flexDirection: "column",
        }}>
          {/* TopAppBar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px", height: 44, background: screen.backgroundColor || "#FCF8FA", borderBottom: "1px solid rgba(200,197,205,0.3)", flexShrink: 0 }}>
            <span style={{ fontSize: 16, cursor: "pointer", opacity: 0.6 }}>&larr;</span>
            <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 12, color: "#1C1B1D" }}>{data.meta.appName || "Your App"}</span>
            <span style={{ fontSize: 14, cursor: "pointer", opacity: 0.4, fontWeight: 700 }}>⋯</span>
          </div>

          {/* Screen content */}
          <div style={{ flex: 1, overflow: "auto", position: "relative", padding: 8 }}>
            {screen.components.length === 0 ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#9CA3AF", fontSize: 11, textAlign: "center", padding: 20 }}>
                Add components to this screen
              </div>
            ) : (
              screen.components.slice().sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0)).map(comp => {
                const def = getComponentType(comp.type);
                if (!def) return null;
                const scaleX = 224 / screen.width;
                const scaleY = (screen.components.length > 3 ? 400 : 224) / screen.height;
                const scale = Math.min(scaleX, scaleY, 1);
                const targetScreen = prototyping ? parseAction(comp) : null;
                return (
                  <div
                    key={comp.id}
                    onClick={targetScreen ? () => setCurrentScreenId(targetScreen) : undefined}
                    style={{
                      position: "absolute",
                      left: comp.x * scale,
                      top: comp.y * scale,
                      width: comp.width * scale,
                      height: comp.height * scale,
                      transformOrigin: "0 0",
                      overflow: "hidden",
                      opacity: comp.visible ? 1 : 0,
                      cursor: targetScreen ? "pointer" : undefined,
                      ...(targetScreen ? { boxShadow: "inset 0 0 0 2px rgba(244,160,38,0.4)" } : {}),
                    }}
                  >
                    <div style={{ transform: `scale(${scale})`, transformOrigin: "0 0", width: comp.width, height: comp.height }}>
                      {def.render({ ...comp.props, _fills: comp.fills, _strokes: comp.strokes })}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom Nav */}
          {tabs.length > 0 && (
            <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", padding: "4px 12px 8px", background: screen.backgroundColor || "#FCF8FA", borderTop: "1px solid rgba(200,197,205,0.3)", flexShrink: 0 }}>
              {tabs.map(t => {
                const isActive = currentScreenId === t.screenId;
                return (
                  <div key={t.screenId} onClick={() => setCurrentScreenId(t.screenId)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, cursor: "pointer", padding: "4px 12px", borderRadius: 16, background: isActive ? "#F4A026" : "transparent" }}>
                    <span style={{ fontSize: 12, lineHeight: 1 }}>{t.icon || "○"}</span>
                    <span style={{ fontSize: 8, fontWeight: isActive ? 700 : 400, color: isActive ? "#6B4200" : "#6B7280" }}>{t.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
