import { useState, useRef, useCallback } from "react";
import { getComponentType, getAllComponentTypes } from "../canvas-editor/componentTypes";
import { theme, iconBtn, iconBtnDanger, textInput, labelStyle, HEADER_VARIANTS } from "./editorTheme";

const COMPONENT_ICONS = {
  hero_banner: "\uD83C\uDF1F",
  menu_item: "\uD83C\uDF7D\uFE0F",
  category_pills: "\uD83C\uDFF7\uFE0F",
  text_block: "Aa",
  image_block: "\uD83D\uDDBC\uFE0F",
  button: "\uD83D\uDD18",
  menu_grid: "\uD83D\uDCCB",
  header_bar: "\uD83D\uDDC2\uFE0F",
  divider: "\u2796",
};

const QUICK_COLORS = ["#FCF8FA", "#1A1A2E", "#F4A026", "#2ECC71", "#E74C3C", "#7C3AED", "#0D9488", "#EA580C", "#EC4899", "#000000"];

export default function PropertiesPanel({ store, selectedSectionId, selectedComponentId, onClose }) {
  const data = store.data;
  const [colorInput, setColorInput] = useState("");
  const logoRef = useRef(null);

  function findSection() {
    const sid = selectedSectionId;
    if (!sid) return null;
    const shared = data.shared && (data.shared.header?.id === sid ? data.shared.header : data.shared.footer?.id === sid ? data.shared.footer : null);
    if (shared) return { ...shared, _shared: true };
    const screen = store.screen;
    if (!screen?.bodySections) return null;
    return screen.bodySections.find(s => s.id === sid) || null;
  }

  function findComponent() {
    const sid = selectedComponentId ? selectedSectionId : null;
    if (!sid) return null;
    const sec = findSection();
    if (!sec?.components) return null;
    return sec.components.find(c => c.id === selectedComponentId) || null;
  }

  const section = findSection();
  const component = findComponent();

  const handleLogoUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = (ev) => store.setMeta({ logo: ev.target.result });
    reader.readAsDataURL(file);
  }, [store]);

  /* ── Header variant switching ── */
  const applyHeaderVariant = useCallback((variantId) => {
    const variant = HEADER_VARIANTS.find(v => v.id === variantId);
    if (!variant) return;
    const headerSection = data.shared?.header;
    if (!headerSection) return;
    const newComponents = variant.components.map(c => ({
      ...c,
      id: crypto.randomUUID?.() || Math.random().toString(36).slice(2, 10),
      visible: true,
    }));
    store.updateSharedSection("header", { components: newComponents });
  }, [store, data.shared?.header]);

  const currentVariantId = (() => {
    const headerSection = data.shared?.header;
    if (!headerSection || !headerSection.components?.length) return "logo_name";
    const compTypes = headerSection.components.map(c => c.type).sort().join(",");
    const match = HEADER_VARIANTS.find(v => v.components.map(c => c.type).sort().join(",") === compTypes);
    return match?.id || "logo_name";
  })();

  /* ── Nothing selected — Branding hub ── */
  if (!selectedSectionId && !selectedComponentId) {
    return (
      <div style={{ padding: 12, overflowY: "auto" }}>
        <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 15, color: theme.text, marginBottom: 16 }}>
          Branding
        </div>

        {/* Logo */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>App Logo</label>
          <div
            onClick={() => logoRef.current?.click()}
            style={{
              width: 80, height: 80, borderRadius: theme.radius.xl,
              border: `2px dashed ${theme.border}`, cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", gap: 4,
              background: data.meta?.logo ? `url(${data.meta.logo}) center/cover no-repeat` : theme.hover,
              transition: `border-color ${theme.transition}`,
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = theme.active}
            onMouseLeave={e => e.currentTarget.style.borderColor = theme.border}
          >
            {!data.meta?.logo && <><span style={{ fontSize: 24 }}>\uD83D\uDCF7</span><span style={{ fontSize: 10, color: theme.textMuted }}>Upload</span></>}
          </div>
          <input ref={logoRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleLogoUpload} />
          {data.meta?.logo && (
            <button onClick={() => store.setMeta({ logo: null })}
              style={{ marginTop: 6, fontSize: 12, padding: "4px 10px", border: `1px solid ${theme.dangerBorder}`, borderRadius: theme.radius.sm, background: theme.dangerLight, color: theme.danger, cursor: "pointer", transition: `all ${theme.transition}` }}
              onMouseEnter={e => { e.currentTarget.style.background = "#FEE2E2"; e.currentTarget.style.borderColor = "#FCA5A5"; }}
              onMouseLeave={e => { e.currentTarget.style.background = theme.dangerLight; e.currentTarget.style.borderColor = theme.dangerBorder; }}>
              Remove logo
            </button>
          )}
        </div>

        {/* App Name */}
        <div style={{ marginBottom: 12 }}>
          <label style={labelStyle}>App Name</label>
          <input value={data.meta?.appName || ""} onChange={e => store.setMeta({ appName: e.target.value })} style={textInput} placeholder="Your App" />
        </div>

        {/* Tagline */}
        <div style={{ marginBottom: 12 }}>
          <label style={labelStyle}>Tagline</label>
          <input value={data.meta?.tagline || ""} onChange={e => store.setMeta({ tagline: e.target.value })} style={textInput} placeholder="Short description" />
        </div>

        {/* Primary Color */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Primary Color</label>
          <ColorInput value={data.meta?.primaryColor || "#1A1A2E"} onChange={(v) => store.setMeta({ primaryColor: v })} />
        </div>

        {/* Screen Background Color */}
        <div style={{ marginBottom: 16, paddingTop: 12, borderTop: `1px solid ${theme.border}` }}>
          <label style={labelStyle}>Screen Background</label>
          <ColorInput value={store.screen?.backgroundColor || "#FCF8FA"} onChange={(v) => store.setScreenBackgroundColor(store.currentScreenId, v)} />
        </div>

        {/* Quick tips */}
        <div style={{ background: theme.hoverAmber, borderRadius: theme.radius.md, padding: 12, marginTop: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#6B4200", marginBottom: 4 }}>\uD83D\uDCA1 Tips</div>
          <div style={{ fontSize: 11, color: "#92400E", lineHeight: 1.5 }}>
            Select a section or component from the left panel to edit its properties.
          </div>
        </div>
      </div>
    );
  }

  /* ── Component editing ── */
  if (selectedComponentId && component) {
    const def = getComponentType(component.type);
    const fields = def?.propFields || [];
    return (
      <div style={{ padding: 12 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>{COMPONENT_ICONS[component.type] || "\uD83D\uDDC4\uFE0F"}</span>
            <div>
              <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 14, color: theme.text }}>{def?.label || component.type}</div>
              <div style={{ fontSize: 10, color: theme.textMuted }}>{component.id.slice(0, 12)}</div>
            </div>
          </div>
          <button onClick={() => { onClose?.(); store.removeComponentFromSection(selectedSectionId, component.id); }}
            style={iconBtnDanger}
            onMouseEnter={e => { e.currentTarget.style.background = "#FEE2E2"; e.currentTarget.style.borderColor = "#FCA5A5"; }}
            onMouseLeave={e => { e.currentTarget.style.background = theme.dangerLight; e.currentTarget.style.borderColor = theme.dangerBorder; }}
          ><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <button onClick={() => store.reorderComponent(selectedSectionId, component.id, "up")} style={{ ...iconBtn, flex: 1, gap: 4, padding: "6px 0" }} title="Move up">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
            <span style={{ fontSize: 11, fontWeight: 600 }}>Up</span>
          </button>
          <button onClick={() => store.reorderComponent(selectedSectionId, component.id, "down")} style={{ ...iconBtn, flex: 1, gap: 4, padding: "6px 0" }} title="Move down">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            <span style={{ fontSize: 11, fontWeight: 600 }}>Down</span>
          </button>
          <button onClick={() => { store.duplicateComponentInSection(selectedSectionId, component.id); }} style={{ ...iconBtn, flex: 1, gap: 4, padding: "6px 0" }} title="Duplicate">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            <span style={{ fontSize: 11, fontWeight: 600 }}>Dup</span>
          </button>
        </div>

        {/* Image upload for image_block */}
        {component.type === "image_block" && (
          <ImageUploader
            currentSrc={component.props?.src}
            onUpload={(dataUrl) => store.updateProp(selectedSectionId, component.id, "src", dataUrl)}
          />
        )}

        {fields.map(field => {
          const val = component.props?.[field.key];
          return (
            <div key={field.key} style={{ marginBottom: 12 }}>
              <label style={labelStyle}>{field.label}</label>
              {field.type === "color" ? (
                <ColorInput value={val || "#000000"} onChange={(v) => store.updateProp(selectedSectionId, component.id, field.key, v)} />
              ) : field.type === "select" ? (
                <select value={val || (field.options?.[0] || "")}
                  onChange={e => store.updateProp(selectedSectionId, component.id, field.key, e.target.value)}
                  style={{ ...textInput, cursor: "pointer" }}>
                  {field.options?.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : field.type === "json" ? (
                <div>
                  <textarea value={val || ""}
                    onChange={e => store.updateProp(selectedSectionId, component.id, field.key, e.target.value)}
                    style={{ ...textInput, minHeight: 60, resize: "vertical", fontFamily: "'Monaco','Consolas',monospace", fontSize: 11 }}
                    placeholder='{"key": "value"}' />
                  <div style={{ fontSize: 10, color: theme.textMuted, marginTop: 2 }}>JSON action configuration</div>
                </div>
              ) : (
                <input type={field.type === "number" ? "number" : "text"} value={val || ""}
                  onChange={e => store.updateProp(selectedSectionId, component.id, field.key, e.target.value)}
                  style={textInput} />
              )}
            </div>
          );
        })}

        {/* Button extras */}
        {component.type === "button" && (
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Background Color</label>
            <ColorInput value={component.props?.background || "#F4A026"} onChange={(v) => store.updateProp(selectedSectionId, component.id, "background", v)} />
          </div>
        )}

        {/* Visibility */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, paddingTop: 12, borderTop: `1px solid ${theme.border}` }}>
          <label style={{ fontSize: 12, fontWeight: 500, color: theme.textSecondary, fontFamily: "'Inter',sans-serif", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            <input type="checkbox" checked={component.visible !== false}
              onChange={e => store.updateComponentInSection(selectedSectionId, component.id, { visible: e.target.checked })}
              style={{ accentColor: theme.active }} />
            Visible
          </label>
        </div>
      </div>
    );
  }

  /* ── Section editing ── */
  if (selectedSectionId && section) {
    const isHeader = section._shared && section.type === "header";
    return (
      <div style={{ padding: 12 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 14, color: theme.text }}>
              {section.name || section.type}
              <span style={{ fontSize: 11, color: theme.textMuted, fontWeight: 400, marginLeft: 6 }}>
                {section._shared ? "(shared)" : ""}
              </span>
            </div>
            <div style={{ fontSize: 10, color: theme.textMuted }}>{section.id.slice(0, 16)}</div>
          </div>
          {!section._shared && (
            <button onClick={() => { store.removeBodySection(null, section.id); onClose?.(); }}
              style={iconBtnDanger}
            ><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
          )}
        </div>

        {/* Section name */}
        <div style={{ marginBottom: 12 }}>
          <label style={labelStyle}>Section Name</label>
          <input value={section.name || ""}
            onChange={e => {
              if (section._shared) {
                store.updateSharedSection(selectedSectionId === data.shared?.header?.id ? "header" : "footer", { name: e.target.value });
              } else {
                store.renameSection(null, selectedSectionId, e.target.value);
              }
            }}
            style={textInput} />
        </div>

        {/* Background Color */}
        <div style={{ marginBottom: 12 }}>
          <label style={labelStyle}>Background Color</label>
          <ColorInput value={section.backgroundColor || "#FCF8FA"} onChange={(v) => {
            if (section._shared) {
              store.setSharedSectionColor(section.type === "header" ? "header" : "footer", v);
            } else {
              store.setSectionColor(null, selectedSectionId, v);
            }
          }} />
        </div>

        {/* Quick Colors */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Quick Colors</label>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {QUICK_COLORS.map(c => (
              <div key={c} onClick={() => {
                if (section._shared) {
                  store.setSharedSectionColor(selectedSectionId === data.shared?.header?.id ? "header" : "footer", c);
                } else {
                  store.setSectionColor(null, selectedSectionId, c);
                }
              }} style={{
                width: 26, height: 26, background: c, borderRadius: "50%", cursor: "pointer",
                border: section.backgroundColor === c ? `2px solid ${theme.active}` : "2px solid transparent",
                outline: section.backgroundColor === c ? `2px solid ${theme.active}` : "none", outlineOffset: 2,
                transition: `transform ${theme.transition}`,
              }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.15)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              />
            ))}
          </div>
        </div>

        {/* Header variant selector */}
        {isHeader && (
          <div style={{ marginBottom: 16, paddingTop: 12, borderTop: `1px solid ${theme.border}` }}>
            <label style={labelStyle}>Header Variant</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 6 }}>
              {HEADER_VARIANTS.map(v => (
                <button key={v.id} onClick={() => applyHeaderVariant(v.id)}
                  style={{
                    padding: "8px 10px", borderRadius: theme.radius.sm, border: `1px solid ${currentVariantId === v.id ? theme.active : theme.border}`,
                    background: currentVariantId === v.id ? theme.hoverAmber : theme.surface,
                    cursor: "pointer", textAlign: "left", fontFamily: "'Inter',sans-serif",
                    transition: `all ${theme.transition}`,
                    display: "flex", alignItems: "center", gap: 8,
                  }}
                  onMouseEnter={e => { if (currentVariantId !== v.id) { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.background = theme.hover; } }}
                  onMouseLeave={e => { if (currentVariantId !== v.id) { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.background = theme.surface; } }}
                >
                  <div style={{ fontSize: 11, fontWeight: 600, color: currentVariantId === v.id ? theme.text : theme.textSecondary }}>
                    {currentVariantId === v.id ? "\u25CF" : "\u25CB"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: theme.text }}>{v.name}</div>
                    <div style={{ fontSize: 10, color: theme.textMuted }}>{v.desc}</div>
                  </div>
                  <div style={{ fontSize: 10, color: theme.textMuted }}>{v.components.length} comp{v.components.length !== 1 ? "s" : ""}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Add component */}
        <div style={{ marginTop: 8, paddingTop: 12, borderTop: `1px solid ${theme.border}` }}>
          <label style={labelStyle}>Add Component</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginTop: 8 }}>
            {getAllComponentTypes().map(def => {
              if (!def) return null;
              return (
                <button key={def.type} onClick={() => store.addComponentToSection(selectedSectionId, def.type, { ...def.defaultProps })}
                  style={{
                    padding: "6px 4px", borderRadius: theme.radius.md, border: `1px solid ${theme.border}`, background: theme.surface,
                    cursor: "pointer", textAlign: "center", fontSize: 10, fontWeight: 500, color: theme.textSecondary,
                    fontFamily: "'Inter',sans-serif", transition: `all ${theme.transition}`,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = theme.active; e.currentTarget.style.background = theme.hoverAmber; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.background = theme.surface; }}
                >
                  <div style={{ fontSize: 16, marginBottom: 1 }}>{COMPONENT_ICONS[def.type] || "\uD83D\uDDC4\uFE0F"}</div>
                  <div style={{ fontSize: 9, lineHeight: 1.2 }}>{def.label}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function ColorInput({ value, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <input type="color" value={value || "#000000"}
        onChange={e => onChange(e.target.value)}
        style={{ width: 36, height: 36, borderRadius: theme.radius.sm, border: `1px solid ${theme.border}`, padding: 0, cursor: "pointer" }} />
      <input value={value || ""}
        onChange={e => onChange(e.target.value)}
        style={{
          ...textInput,
          borderColor: focused ? theme.active : theme.border,
          boxShadow: focused ? `0 0 0 2px ${theme.active}22` : "none",
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="#000000" />
    </div>
  );
}

function ImageUploader({ currentSrc, onUpload }) {
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(currentSrc);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setPreview(ev.target.result); onUpload(ev.target.result); };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ marginBottom: 12 }}>
      <label style={labelStyle}>Image</label>
      {preview ? (
        <div style={{ position: "relative", marginBottom: 8 }}>
          <img src={preview} alt="" style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: theme.radius.md, border: `1px solid ${theme.border}` }} />
          <button onClick={() => { setPreview(null); onUpload(""); }}
            style={{ position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,0.5)", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, padding: "2px 6px" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileRef.current?.click()}
          style={{
            height: 80, borderRadius: theme.radius.md, border: `2px dashed ${theme.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: theme.textMuted, fontSize: 12, gap: 6,
            transition: `border-color ${theme.transition}`,
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = theme.active}
          onMouseLeave={e => e.currentTarget.style.borderColor = theme.border}
        >
          <span style={{ fontSize: 18 }}>\uD83D\uDDBC\uFE0F</span> Upload Image
        </div>
      )}
      <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
    </div>
  );
}
