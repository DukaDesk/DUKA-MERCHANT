import { useState } from "react";
import { getComponentType } from "./componentTypes";

const inputStyle = {
  width: "100%", padding: "6px 8px", border: "1px solid #D1D5DB", borderRadius: 6,
  fontSize: 13, outline: "none", fontFamily: "'Inter',sans-serif", boxSizing: "border-box",
  background: "#fff", color: "#1C1B1D",
};

const labelStyle = { fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 4, display: "block" };
const sectionTitle = { fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8, paddingBottom: 4, borderBottom: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", alignItems: "center" };
const addBtn = { background: "none", border: "1px dashed #D1D5DB", borderRadius: 6, padding: "4px 12px", cursor: "pointer", fontSize: 12, color: "#6B7280", fontFamily: "'Inter',sans-serif", width: "100%", textAlign: "center", marginTop: 6 };

export default function PropertiesPanel({
  selectedComponent, selectedComps = [], onUpdateProp, onUpdateStyle, onUpdateComponent,
  onUpdateFills, onUpdateStrokes, onUpdateEffects, onUpdateRotation, onUpdateOpacity,
  onSetLayout, onAddToken,
}) {
  const [collapsed, setCollapsed] = useState({});
  const toggle = (key) => setCollapsed(p => ({ ...p, [key]: !p[key] }));

  if (!selectedComponent && selectedComps.length === 0) {
    return (
      <div style={{ width: 280, background: "#fff", borderLeft: "1px solid #E5E7EB", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "14px 16px", borderBottom: "1px solid #E5E7EB", fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 14, color: "#0F0F1A" }}>Design</div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#9CA3AF", fontSize: 13, padding: 20, textAlign: "center" }}>
          Select a layer to edit
        </div>
      </div>
    );
  }

  if (selectedComps.length > 1) {
    const first = selectedComps[0];
    const sameOpacity = selectedComps.every(c => c.opacity === first.opacity);
    return (
      <div style={{ width: 280, background: "#fff", borderLeft: "1px solid #E5E7EB", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "14px 16px", borderBottom: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 14, color: "#0F0F1A" }}>
            Bulk Edit ({selectedComps.length} layers)
          </span>
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
          <Collapsible title="Opacity" collapsed={false} onToggle={() => {}}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="number" min={0} max={1} step={0.05}
                value={sameOpacity ? first.opacity : ""}
                onChange={e => { const v = Number(e.target.value); selectedComps.forEach(c => onUpdateOpacity?.(c.id, v)); }}
                style={{ ...inputStyle, width: 70 }}
                placeholder={sameOpacity ? "" : "Mixed"} />
              <input type="range" min={0} max={1} step={0.01}
                value={sameOpacity ? first.opacity : 1}
                onChange={e => { const v = Number(e.target.value); selectedComps.forEach(c => onUpdateOpacity?.(c.id, v)); }}
                style={{ flex: 1 }} />
            </div>
          </Collapsible>
          <Collapsible title="Rotation" collapsed={false} onToggle={() => {}}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="number" value={first.rotation ?? 0}
                onChange={e => { const v = Number(e.target.value) % 360; selectedComps.forEach(c => onUpdateRotation?.(c.id, v)); }}
                style={{ ...inputStyle, width: 80 }} />
            </div>
          </Collapsible>
        </div>
      </div>
    );
  }

  const def = getComponentType(selectedComponent.type);
  const fills = selectedComponent.fills || [];
  const strokes = selectedComponent.strokes || [];
  const effects = selectedComponent.effects || [];
  const cornerRadius = selectedComponent.cornerRadius ?? 0;
  const rotation = selectedComponent.rotation ?? 0;
  const opacity = selectedComponent.opacity ?? 1;
  const isUniformRadius = typeof cornerRadius === "number";

  const setFills = (v) => onUpdateFills?.(selectedComponent.id, v);
  const setStrokes = (v) => onUpdateStrokes?.(selectedComponent.id, v);
  const setEffects = (v) => onUpdateEffects?.(selectedComponent.id, v);

  const comp = selectedComponent;

  return (
    <div style={{ width: 280, background: "#fff", borderLeft: "1px solid #E5E7EB", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ padding: "14px 16px", borderBottom: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
        <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 14, color: "#0F0F1A" }}>
          {def?.icon} {def?.label || comp.type}
        </span>
        <span style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "'Fira Code',monospace" }}>{comp.type}</span>
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: 16 }}>

        {/* Position & Size */}
        <Collapsible title="Position & Size" collapsed={collapsed.pos} onToggle={() => toggle("pos")}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            <Field label="X"><input type="number" value={comp.x} onChange={e => onUpdateComponent(comp.id, { x: Number(e.target.value) })} style={inputStyle} /></Field>
            <Field label="Y"><input type="number" value={comp.y} onChange={e => onUpdateComponent(comp.id, { y: Number(e.target.value) })} style={inputStyle} /></Field>
            <Field label="W"><input type="number" value={comp.width} onChange={e => onUpdateComponent(comp.id, { width: Math.max(1, Number(e.target.value)) })} style={inputStyle} /></Field>
            <Field label="H"><input type="number" value={comp.height} onChange={e => onUpdateComponent(comp.id, { height: Math.max(1, Number(e.target.value)) })} style={inputStyle} /></Field>
          </div>
        </Collapsible>

        {/* Rotation */}
        <Collapsible title="Rotation" collapsed={collapsed.rot} onToggle={() => toggle("rot")}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input type="number" value={rotation} onChange={e => onUpdateRotation?.(comp.id, Number(e.target.value) % 360)} style={{ ...inputStyle, width: 80 }} min={-360} max={360} />
            <input type="range" min={-180} max={180} value={rotation} onChange={e => onUpdateRotation?.(comp.id, Number(e.target.value))} style={{ flex: 1 }} />
          </div>
        </Collapsible>

        {/* Opacity */}
        <Collapsible title="Opacity" collapsed={collapsed.op} onToggle={() => toggle("op")}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input type="number" min={0} max={1} step={0.05} value={opacity} onChange={e => onUpdateOpacity?.(comp.id, Number(e.target.value))} style={{ ...inputStyle, width: 70 }} />
            <input type="range" min={0} max={1} step={0.01} value={opacity} onChange={e => onUpdateOpacity?.(comp.id, Number(e.target.value))} style={{ flex: 1 }} />
          </div>
        </Collapsible>

        {/* Fills */}
        <Collapsible title={`Fills (${fills.length})`} collapsed={collapsed.fills} onToggle={() => toggle("fills")}>
          {fills.map((fill, i) => (
            <FillRow key={i} fill={fill} index={i} fills={fills} onChange={setFills} />
          ))}
          <button onClick={() => setFills([...fills, { type: "solid", color: "#E5E1E3", opacity: 1 }])} style={addBtn}>+ Add Fill</button>
          {fills.length > 0 && fills[0].color && (
            <button onClick={() => onAddToken?.("colors", { color: fills[0].color, opacity: fills[0].opacity ?? 100, name: `Color ${fills[0].color}` })} style={addBtn}>
              ★ Save as Style
            </button>
          )}
        </Collapsible>

        {/* Stroke */}
        <Collapsible title={`Stroke (${strokes.length})`} collapsed={collapsed.strokes} onToggle={() => toggle("strokes")}>
          {strokes.map((stroke, i) => (
            <StrokeRow key={i} stroke={stroke} index={i} strokes={strokes} onChange={setStrokes} />
          ))}
          <button onClick={() => setStrokes([...strokes, { color: "#C8C5CD", width: 1, position: "center", dashPattern: "" }])} style={addBtn}>+ Add Stroke</button>
        </Collapsible>

        {/* Auto Layout */}
        <Collapsible title={`Layout (${comp.layoutMode || "none"})`} collapsed={collapsed.layout} onToggle={() => toggle("layout")}>
          <div style={{ marginBottom: 6 }}>
            <label style={labelStyle}>Mode</label>
            <select value={comp.layoutMode || "none"} onChange={e => onSetLayout?.(comp.id, { layoutMode: e.target.value })} style={inputStyle}>
              <option value="none">None</option>
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
            </select>
          </div>
          {comp.layoutMode && comp.layoutMode !== "none" && (
            <>
              <div style={{ marginBottom: 6 }}>
                <label style={labelStyle}>Direction</label>
                <select value={comp.layoutDirection || "horizontal"} onChange={e => onSetLayout?.(comp.id, { layoutDirection: e.target.value })} style={inputStyle}>
                  <option value="horizontal">Left → Right</option>
                  <option value="vertical">Top → Bottom</option>
                </select>
              </div>
              <div style={{ marginBottom: 6 }}>
                <label style={labelStyle}>Gap</label>
                <input type="number" min={0} value={comp.layoutGap ?? 8} onChange={e => onSetLayout?.(comp.id, { layoutGap: Number(e.target.value) })} style={inputStyle} />
              </div>
              <div style={{ marginBottom: 6 }}>
                <label style={labelStyle}>Padding</label>
                <input type="number" min={0} value={comp.layoutPadding ?? 0} onChange={e => onSetLayout?.(comp.id, { layoutPadding: Number(e.target.value) })} style={inputStyle} />
              </div>
            </>
          )}
        </Collapsible>

        {/* Corner Radius */}
        <Collapsible title="Corner Radius" collapsed={collapsed.radius} onToggle={() => toggle("radius")}>
          {isUniformRadius ? (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="number" min={0} value={cornerRadius} onChange={e => onUpdateComponent(comp.id, { cornerRadius: Math.max(0, Number(e.target.value)) })} style={{ ...inputStyle, width: 80 }} />
              <input type="range" min={0} max={100} value={cornerRadius} onChange={e => onUpdateComponent(comp.id, { cornerRadius: Number(e.target.value) })} style={{ flex: 1 }} />
              <button onClick={() => onUpdateComponent(comp.id, { cornerRadius: { tl: cornerRadius, tr: cornerRadius, br: cornerRadius, bl: cornerRadius } })} style={linkBtn} title="Edit individually">🔗</button>
            </div>
          ) : (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                <Field label="TL"><input type="number" min={0} value={cornerRadius.tl ?? 0} onChange={e => onUpdateComponent(comp.id, { cornerRadius: { ...cornerRadius, tl: Math.max(0, Number(e.target.value)) } })} style={inputStyle} /></Field>
                <Field label="TR"><input type="number" min={0} value={cornerRadius.tr ?? 0} onChange={e => onUpdateComponent(comp.id, { cornerRadius: { ...cornerRadius, tr: Math.max(0, Number(e.target.value)) } })} style={inputStyle} /></Field>
                <Field label="BR"><input type="number" min={0} value={cornerRadius.br ?? 0} onChange={e => onUpdateComponent(comp.id, { cornerRadius: { ...cornerRadius, br: Math.max(0, Number(e.target.value)) } })} style={inputStyle} /></Field>
                <Field label="BL"><input type="number" min={0} value={cornerRadius.bl ?? 0} onChange={e => onUpdateComponent(comp.id, { cornerRadius: { ...cornerRadius, bl: Math.max(0, Number(e.target.value)) } })} style={inputStyle} /></Field>
              </div>
              <button onClick={() => onUpdateComponent(comp.id, { cornerRadius: cornerRadius.tl })} style={linkBtn}>🔗 Unlink</button>
            </div>
          )}
        </Collapsible>

        {/* Effects */}
        <Collapsible title={`Effects (${effects.length})`} collapsed={collapsed.effects} onToggle={() => toggle("effects")}>
          {effects.map((eff, i) => (
            <EffectRow key={i} effect={eff} index={i} effects={effects} onChange={setEffects} />
          ))}
          <button onClick={() => setEffects([...effects, { type: "drop-shadow", color: "rgba(0,0,0,0.15)", offsetX: 0, offsetY: 4, blur: 8, spread: 0 }])} style={addBtn}>+ Add Effect</button>
        </Collapsible>

        {/* Component Props */}
        {def?.propFields && def.propFields.length > 0 && (
          <Collapsible title={def.label} collapsed={collapsed.props} onToggle={() => toggle("props")}>
            {def.propFields.map(field => (
              <Field key={field.key} label={field.label}>
                {field.type === "text" && <input value={comp.props[field.key] || ""} onChange={e => onUpdateProp(comp.id, field.key, e.target.value)} style={inputStyle} />}
                {field.type === "number" && <input type="number" value={comp.props[field.key] ?? ""} onChange={e => onUpdateProp(comp.id, field.key, Number(e.target.value))} style={inputStyle} />}
                {field.type === "color" && (
                  <div style={{ display: "flex", gap: 6 }}>
                    <input type="color" value={comp.props[field.key] || "#000000"} onChange={e => onUpdateProp(comp.id, field.key, e.target.value)} style={{ width: 36, height: 32, padding: 0, border: "1px solid #D1D5DB", borderRadius: 6, cursor: "pointer" }} />
                    <input value={comp.props[field.key] || ""} onChange={e => onUpdateProp(comp.id, field.key, e.target.value)} style={{ flex: 1, ...inputStyle }} />
                  </div>
                )}
                {field.type === "select" && (
                  <select value={comp.props[field.key] || ""} onChange={e => onUpdateProp(comp.id, field.key, e.target.value)} style={inputStyle}>
                    {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                )}
                {field.type === "json" && (
                  <textarea value={JSON.stringify(comp.props[field.key] || {}, null, 2)} onChange={e => { try { onUpdateProp(comp.id, field.key, JSON.parse(e.target.value)); } catch {} }} style={{ ...inputStyle, minHeight: 60, fontFamily: "'Fira Code',monospace", fontSize: 11 }} />
                )}
              </Field>
            ))}
          </Collapsible>
        )}

      </div>
    </div>
  );
}

function Collapsible({ title, collapsed, onToggle, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
        <div onClick={onToggle} role="button" tabIndex={0} onKeyDown={e => e.key === "Enter" && onToggle?.()} style={{ ...sectionTitle, cursor: "pointer" }}>
        {title}
        <span style={{ fontSize: 10, color: "#9CA3AF" }}>{collapsed ? "▶" : "▼"}</span>
      </div>
      {!collapsed && <div>{children}</div>}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 6 }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function FillRow({ fill, index, fills, onChange }) {
  const update = (patch) => {
    const next = [...fills];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6, padding: "6px 8px", background: "#FAFAFA", borderRadius: 6, border: "1px solid #F3F4F6" }}>
      <select value={fill.type} onChange={e => update({ type: e.target.value })} style={{ ...inputStyle, width: 80, fontSize: 11 }}>
        <option value="solid">Solid</option>
        <option value="gradient">Gradient</option>
      </select>
      <input type="color" value={fill.color || "#000000"} onChange={e => update({ color: e.target.value })} style={{ width: 28, height: 28, padding: 0, border: "1px solid #D1D5DB", borderRadius: 4, cursor: "pointer", flexShrink: 0 }} />
      <input type="number" min={0} max={1} step={0.1} value={fill.opacity ?? 1} onChange={e => update({ opacity: Number(e.target.value) })} style={{ ...inputStyle, width: 50, fontSize: 11 }} />
      <button onClick={() => onChange(fills.filter((_, i) => i !== index))} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#E74C3C", padding: 0, lineHeight: 1 }}>×</button>
    </div>
  );
}

function StrokeRow({ stroke, index, strokes, onChange }) {
  const update = (patch) => {
    const next = [...strokes];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };
  return (
    <div style={{ marginBottom: 6, padding: "6px 8px", background: "#FAFAFA", borderRadius: 6, border: "1px solid #F3F4F6" }}>
      <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}>
        <input type="color" value={stroke.color || "#000000"} onChange={e => update({ color: e.target.value })} style={{ width: 28, height: 28, padding: 0, border: "1px solid #D1D5DB", borderRadius: 4, cursor: "pointer" }} />
        <input type="number" min={0} value={stroke.width ?? 1} onChange={e => update({ width: Math.max(0, Number(e.target.value)) })} style={{ ...inputStyle, width: 50, fontSize: 11 }} />
        <select value={stroke.position || "center"} onChange={e => update({ position: e.target.value })} style={{ ...inputStyle, width: 70, fontSize: 11 }}>
          <option value="center">Center</option>
          <option value="inside">Inside</option>
          <option value="outside">Outside</option>
        </select>
        <button onClick={() => onChange(strokes.filter((_, i) => i !== index))} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#E74C3C", padding: 0, lineHeight: 1 }}>×</button>
      </div>
      <input placeholder="Dash pattern (comma-separated)" value={stroke.dashPattern || ""} onChange={e => update({ dashPattern: e.target.value })} style={{ ...inputStyle, fontSize: 11 }} />
    </div>
  );
}

function EffectRow({ effect, index, effects, onChange }) {
  const update = (patch) => {
    const next = [...effects];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };
  return (
    <div style={{ marginBottom: 6, padding: "6px 8px", background: "#FAFAFA", borderRadius: 6, border: "1px solid #F3F4F6" }}>
      <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}>
        <select value={effect.type} onChange={e => update({ type: e.target.value })} style={{ ...inputStyle, width: 110, fontSize: 11 }}>
          <option value="drop-shadow">Drop Shadow</option>
          <option value="inner-shadow">Inner Shadow</option>
          <option value="blur">Blur</option>
        </select>
        <button onClick={() => onChange(effects.filter((_, i) => i !== index))} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#E74C3C", padding: 0, lineHeight: 1 }}>×</button>
      </div>
      {effect.type !== "blur" && (
        <>
          <div style={{ display: "flex", gap: 6 }}>
            <input type="color" value={effect.color || "#000"} onChange={e => update({ color: e.target.value })} style={{ width: 28, height: 28, padding: 0, border: "1px solid #D1D5DB", borderRadius: 4, cursor: "pointer" }} />
            <Field label="X"><input type="number" value={effect.offsetX ?? 0} onChange={e => update({ offsetX: Number(e.target.value) })} style={inputStyle} /></Field>
            <Field label="Y"><input type="number" value={effect.offsetY ?? 0} onChange={e => update({ offsetY: Number(e.target.value) })} style={inputStyle} /></Field>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <Field label="Blur"><input type="number" min={0} value={effect.blur ?? 0} onChange={e => update({ blur: Math.max(0, Number(e.target.value)) })} style={inputStyle} /></Field>
            <Field label="Spread"><input type="number" value={effect.spread ?? 0} onChange={e => update({ spread: Number(e.target.value) })} style={inputStyle} /></Field>
          </div>
        </>
      )}
      {effect.type === "blur" && (
        <Field label="Blur"><input type="number" min={0} value={effect.blur ?? 0} onChange={e => update({ blur: Math.max(0, Number(e.target.value)) })} style={inputStyle} /></Field>
      )}
    </div>
  );
}

const linkBtn = {
  background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "#60A5FA",
  fontFamily: "'Inter',sans-serif", padding: "4px 0", textDecoration: "underline",
};
