import { useState, useRef, useCallback, useEffect } from "react";
import { Search } from "lucide-react";
import { getComponentType, getAllComponentTypes, getComponentsByCategory } from "../canvas-editor/componentTypes";
import { theme, iconBtn, iconBtnDanger, textInput, labelStyle } from "./editorTheme";

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
  gap: "\u2195",
  carousel: "\uD83C\uDFA0",
  nested_section: "\uD83E\uDDF0",
  row: "\u25A4",
  promotion_list: "\uD83C\uDFF7\uFE0F",
  card: "\uD83C\uDCCF",
  icon: "\u2728",
  chevron: "\u2194\uFE0F",
  icon_button: "\uD83D\uDD33",
  fab: "\u2795",
  text_input: "\u270E\uFE0F",
  search_bar: "\uD83D\uDD0D",
  switch_toggle: "\uD83C\uDF9A\uFE0F",
  checkbox_row: "\u2611\uFE0F",
  avatar: "\uD83D\uDC64",
  badge: "\uD83C\uDFF7\uFE0F",
  progress_bar: "\uD83D\uDCCA",
  rating: "\u2B50",
};

const QUICK_COLORS = ["#FCF8FA", "#1A1A2E", "#F4A026", "#2ECC71", "#E74C3C", "#7C3AED", "#0D9488", "#EA580C", "#EC4899", "#000000"];

const TAB_ICONS = [
  "\uD83C\uDFE0", "\uD83C\uDF5F", "\uD83C\uDF7D\uFE0F", "\uD83D\uDCCB", "\uD83D\uDED2",
  "\uD83C\uDF54", "\uD83C\uDF5B", "\uD83C\uDF73", "\uD83C\uDF55", "\uD83C\uDF89",
  "\u2600\uFE0F", "\uD83C\uDF0D", "\uD83D\uDCCD", "\uD83D\uDCDE", "\uD83D\uDCA1",
  "\uD83D\uDD0D", "\u2B50", "\uD83D\uDC96", "\uD83D\uDC64", "\uD83D\uDC65",
  "\uD83D\uDD25", "\uD83C\uDF45", "\uD83C\uDF71", "\uD83D\uDDAA",
];

export default function PropertiesPanel({ store, selectedSectionId, selectedComponentId, navSelected, onClose, focusSubKey, onClearProp, onSelectComponent }) {
  const data = store.data;
  const [addQuery, setAddQuery] = useState("");
  const [catCollapsed, setCatCollapsed] = useState({});
  const [accOpen, setAccOpen] = useState(null);
  const [activeTab, setActiveTab] = useState("general");
  const [searchOpen, setSearchOpen] = useState(false);
  const [propQuery, setPropQuery] = useState("");
  const toggleAcc = (id) => setAccOpen(o => (o === id ? null : id));
  const logoRef = useRef(null);

  useEffect(() => {
    setAccOpen(null);
    setActiveTab("general");
    setSearchOpen(false);
    setPropQuery("");
  }, [selectedSectionId, selectedComponentId, navSelected]);

  function findSection() {
    const sid = selectedSectionId;
    if (!sid) return null;
    const screen = store.screen;
    if (!screen?.bodySections) return null;
    const body = screen.bodySections.find(s => s.id === sid);
    if (!body) return null;
    if (body.kind === "saved" && body.libraryId) {
      const lib = (store.savedSections || []).find(x => x.id === body.libraryId);
      if (lib) return { ...lib, _link: true, id: body.id };
    }
    return body || null;
  }

  function findComponent() {
    const sid = selectedComponentId ? selectedSectionId : null;
    if (!sid) return null;
    const sec = findSection();
    if (!sec?.components) return null;

    /* Recurse through container children to find a nested component. */
    const deep = (list) => {
      for (const c of list || []) {
        if (c.id === selectedComponentId) return c;
        const hit = deep(c.children);
        if (hit) return hit;
      }
      return null;
    };
    return deep(sec.components) || null;
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

  /* ── Bottom Navigation tabs ── */
  if (navSelected) {
    const tabs = data.navigation?.tabs || [];
    const navStyle = data.navigation?.style || {};
    return (
      <div style={{ overflowY: "auto", background: theme.surface }}>
        <AccPanel
          id="nav"
          open={accOpen === "nav" || accOpen === null}
          onToggle={toggleAcc}
          title="Bottom Navigation Tabs"
          icon="\uD83D\uDDC2\uFE0F"
        >
          <div style={{ fontSize: 10, color: theme.textMuted, marginBottom: 10, fontFamily: "'Inter',sans-serif", lineHeight: 1.4 }}>
            Tabs appear in the bottom bar. Add icons, colors and link each tab to a page.
          </div>

          {tabs.length === 0 && (
            <div style={{ fontSize: 11, color: theme.textMuted, marginBottom: 10, fontFamily: "'Inter',sans-serif" }}>
              No tabs yet. Add one below.
            </div>
          )}

          {tabs.map((tab, i) => (
            <TabEditorRow
              key={tab.id || i}
              index={i}
              tab={tab}
              screenIds={Object.keys(data.screens)}
              screens={data.screens}
              icons={TAB_ICONS}
              onUpdate={(patch) => store.updateTab(i, patch)}
              onRemove={() => store.removeTab(i)}
              onReorder={(dir) => store.reorderTab(i, dir)}
              isLast={i === tabs.length - 1}
              isFirst={i === 0}
            />
          ))}

          <button
            onClick={() => store.addTab({ label: "New Tab", icon: "\uD83D\uDCCB", screenId: "" })}
            style={{
              width: "100%", padding: "8px", borderRadius: theme.radius.md,
              border: `1.5px dashed ${theme.border}`, background: "transparent",
              color: theme.textSecondary, fontSize: 12, fontWeight: 600, cursor: "pointer",
              fontFamily: "'Inter',sans-serif", marginTop: 8, display: "flex", alignItems: "center",
              justifyContent: "center", gap: 4, transition: `all ${theme.transition}`,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = theme.active; e.currentTarget.style.color = theme.active; e.currentTarget.style.background = theme.hoverAmber; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.textSecondary; e.currentTarget.style.background = "transparent"; }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Tab
          </button>
        </AccPanel>

        <AccPanel
          id="navstyle"
          open={accOpen === "navstyle"}
          onToggle={toggleAcc}
          title="Navigation Styles"
          icon="\uD83C\uDFA8"
        >
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Bar Background</label>
            <ColorInput value={navStyle.background || "#FFFFFF"} onChange={(v) => store.setNavigation({ style: { ...navStyle, background: v } })} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Active Icon / Label Color</label>
            <ColorInput value={navStyle.active || "#1A1A2E"} onChange={(v) => store.setNavigation({ style: { ...navStyle, active: v } })} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Inactive Icon / Label Color</label>
            <ColorInput value={navStyle.inactive || "#9CA3AF"} onChange={(v) => store.setNavigation({ style: { ...navStyle, inactive: v } })} />
          </div>
        </AccPanel>
      </div>
    );
  }

  /* ── Nothing selected — Branding hub ── */
  if (!selectedSectionId && !selectedComponentId) {
    return (
      <div style={{ overflowY: "auto", background: theme.surface }}>
        <AccPanel
          id="branding"
          open={accOpen === "branding" || accOpen === null}
          onToggle={toggleAcc}
          title="Branding"
        >
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
        </AccPanel>

        <AccPanel
          id="screen"
          open={accOpen === "screen"}
          onToggle={toggleAcc}
          title="Screen Background"
        >
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Screen Background Color</label>
            <ColorInput value={store.screen?.backgroundColor || "#FCF8FA"} onChange={(v) => store.setScreenBackgroundColor(store.currentScreenId, v)} />
          </div>
        </AccPanel>

        <AccPanel
          id="tips"
          open={accOpen === "tips"}
          onToggle={toggleAcc}
          title="Tips"
        >
          <div style={{ background: theme.hoverAmber, borderRadius: theme.radius.md, padding: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#6B4200", marginBottom: 4 }}>Select a section or component from the left panel to edit its properties.</div>
            <div style={{ fontSize: 11, color: "#92400E", lineHeight: 1.5 }}>
              Add sections from the Layout panel above, then drop components into them from here.
            </div>
          </div>
        </AccPanel>
      </div>
    );
  }

  /* ── Component editing ── */
  if (selectedComponentId && component) {
    const def = getComponentType(component.type);
    const fields = def?.propFields || [];
    const focusedField = def?.subElements?.find(s => focusSubKey?.compId === component.id && focusSubKey?.key === s.key);
    return (
      <div style={{ background: theme.surface }}>
        <AccPanel
          id="component"
          open={accOpen === "component" || accOpen === null}
          onToggle={toggleAcc}
          title={def?.label || component.type}
          icon={COMPONENT_ICONS[component.type] || "\uD83D\uDDC4\uFE0F"}
        >
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

          {/* Sub-element breadcrumb + quick actions */}
          {focusedField && (
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: 16, padding: "8px 10px", borderRadius: theme.radius.md,
              background: theme.hoverAmber, border: `1px solid ${theme.active}`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#6B4200", fontWeight: 600, fontFamily: "'Inter',sans-serif" }}>
                <span>{focusedField.icon || "\uD83C\uDF1F"}</span>
                Editing: {focusedField.label}
              </div>
              <button
                onClick={() => onClearProp?.(focusedField.key)}
                style={{ fontSize: 11, padding: "4px 10px", border: `1px solid ${theme.dangerBorder}`, borderRadius: theme.radius.sm, background: theme.dangerLight, color: theme.danger, cursor: "pointer", fontFamily: "'Inter',sans-serif", fontWeight: 600 }}
              >Remove</button>
            </div>
          )}

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
            const isFocusedField = focusedField?.key === field.key;
            return (
              <div key={field.key} style={{ marginBottom: 12, padding: isFocusedField ? "8px" : 0, border: isFocusedField ? `1.5px solid ${theme.active}` : "none", borderRadius: theme.radius.md, transition: `all ${theme.transition}` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <label style={labelStyle}>{field.label}</label>
                  {isFocusedField && (
                    <button onClick={() => onClearProp?.(field.key)} style={{ fontSize: 10, border: "none", background: "none", color: theme.danger, cursor: "pointer", padding: "0 2px", fontFamily: "'Inter',sans-serif", fontWeight: 600 }}>Remove</button>
                  )}
                </div>
                {field.type === "list" ? (
                  <ListFieldEditor
                    fields={field.fields}
                    value={Array.isArray(val) ? val : []}
                    onChange={(list) => store.updateProp(selectedSectionId, component.id, field.key, list)}
                  />
                ) : field.type === "bg" ? (
                  <FillEditor value={val} onChange={(v) => store.updateProp(selectedSectionId, component.id, field.key, v)} />
                ) : field.type === "color" ? (
                  <ColorInput value={val || "#000000"} onChange={(v) => store.updateProp(selectedSectionId, component.id, field.key, v)} />
                ) : field.type === "select" ? (
                  <select value={val || (field.options?.[0] || "")}
                    onChange={e => store.updateProp(selectedSectionId, component.id, field.key, e.target.value)}
                    style={{ ...textInput, cursor: "pointer" }}>
                    {field.options?.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : field.type === "image" ? (
                  <ImageUploader
                    currentSrc={val || ""}
                    onUpload={(dataUrl) => store.updateProp(selectedSectionId, component.id, field.key, dataUrl)}
                  />
                ) : field.type === "json" ? (
                  <div>
                    <textarea value={val || ""}
                      onChange={e => store.updateProp(selectedSectionId, component.id, field.key, e.target.value)}
                      style={{ ...textInput, minHeight: 60, resize: "vertical", fontFamily: "'Monaco','Consolas',monospace", fontSize: 11 }}
                      placeholder='{"key": "value"}' />
                    <div style={{ fontSize: 10, color: theme.textMuted, marginTop: 2 }}>JSON action configuration</div>
                  </div>
                ) : (
                  <input
                    type={field.type === "number" ? "number" : "text"}
                    value={val ?? (field.type === "number" ? 0 : "")}
                    onChange={e => {
                      const raw = e.target.value;
                      if (field.type === "number") {
                        const n = Number(raw);
                        store.updateProp(selectedSectionId, component.id, field.key, Number.isFinite(n) && raw !== "" ? n : 0);
                      } else {
                        store.updateProp(selectedSectionId, component.id, field.key, raw);
                      }
                    }}
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

          {/* Container children (carousel, nested_section, etc.) */}
          {def?.container && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>Children ({component.children?.length || 0})</label>
              </div>

              {(component.children || []).length === 0 && (
                <div style={{ fontSize: 11, color: theme.textMuted, marginBottom: 8 }}>
                  {component.type === "carousel"
                    ? "Add slides below — each one becomes a carousel slide."
                    : "Add a component or nested section into this container."}
                </div>
              )}

              {(component.children || []).map((child, i) => {
                const childDef = getComponentType(child.type);
                return (
                  <div key={child.id} style={{
                    display: "flex", alignItems: "center", gap: 6, marginBottom: 6,
                    padding: "6px 8px", borderRadius: theme.radius.md,
                    background: theme.hover, border: selectedComponentId === child.id ? `1px solid ${theme.selection}` : `1px solid ${theme.border}`,
                    cursor: "pointer",
                  }}
                    onClick={() => onSelectComponent?.(selectedSectionId, child.id)}
                  >
                    <span style={{ fontSize: 13 }}>{COMPONENT_ICONS[childDef?.type] || childDef?.icon || "\uD83D\uDDC4\uFE0F"}</span>
                    <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 12, color: theme.text, fontWeight: 500, fontFamily: "'Inter',sans-serif" }}>
                      {childDef?.label || child.type}
                    </span>
                    <button onClick={(e) => { e.stopPropagation(); store.reorderComponent(selectedSectionId, child.id, i === 0 ? "down" : "up"); }}
                      style={iconBtn} title="Move">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); store.removeComponentFromSection(selectedSectionId, child.id); }}
                      style={iconBtnDanger} title="Delete">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                  </div>
                );
              })}

              <label style={{ ...labelStyle, margin: "10px 0 6px" }}>Add child</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                {getAllComponentTypes().map(def2 => {
                  if (!def2) return null;
                  return (
                    <button key={def2.type} onClick={() => store.addComponentToSection(selectedSectionId, def2.type, { ...def2.defaultProps }, component.id)}
                      style={{
                        padding: "6px 4px", borderRadius: theme.radius.md, border: `1px solid ${theme.border}`, background: theme.surface,
                        cursor: "pointer", textAlign: "center", fontSize: 10, fontWeight: 500, color: theme.textSecondary,
                        fontFamily: "'Inter',sans-serif", transition: `all ${theme.transition}`,
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = theme.active; e.currentTarget.style.background = theme.hoverAmber; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.background = theme.surface; }}
                    >
                      <div style={{ fontSize: 15, marginBottom: 1 }}>{COMPONENT_ICONS[def2.type] || "\uD83D\uDDC4\uFE0F"}</div>
                      <div style={{ fontSize: 9, lineHeight: 1.2 }}>{def2.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </AccPanel>

        {/* Visibility */}
        <AccPanel
          id="visibility"
          title="Visibility"
          open={accOpen === "visibility"}
          onToggle={toggleAcc}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: theme.textSecondary, fontFamily: "'Inter',sans-serif", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              <input type="checkbox" checked={component.visible !== false}
                onChange={e => store.updateComponentInSection(selectedSectionId, component.id, { visible: e.target.checked })}
                style={{ accentColor: theme.active }} />
              Visible
            </label>
          </div>
        </AccPanel>

        {/* Spacing & Effects */}
        <AccPanel
          id="spacing"
          title="Spacing & Effects"
          open={accOpen === "spacing"}
          onToggle={toggleAcc}
        >
          <div style={{ marginBottom: 10 }}>
            <label style={labelStyle}>Margin (px)</label>
            <SpacingEditor
              value={component.props?.margin || {}}
              onChange={(v) => store.updateProp(selectedSectionId, component.id, "margin", v)}
            />
          </div>

          <div style={{ marginBottom: 10 }}>
            <label style={labelStyle}>Padding (px)</label>
            <SpacingEditor
              value={component.props?.padding}
              onChange={(v) => store.updateProp(selectedSectionId, component.id, "padding", v)}
            />
          </div>

          <div style={{ marginBottom: 10 }}>
            <label style={labelStyle}>Elevation (shadow)</label>
            <select
              value={component.props?.elevation || "none"}
              onChange={e => store.updateProp(selectedSectionId, component.id, "elevation", e.target.value)}
              style={{ ...textInput, cursor: "pointer" }}>
              <option value="none">None</option>
              <option value="soft">Soft</option>
              <option value="medium">Medium</option>
              <option value="raised">Raised</option>
            </select>
          </div>

          <div style={{ marginBottom: 4 }}>
            <label style={labelStyle}>Opacity</label>
            <input type="number" min="0" max="100" value={component.props?.opacity ?? 100}
              onChange={e => { const n = Number(e.target.value); store.updateProp(selectedSectionId, component.id, "opacity", Number.isFinite(n) ? n : 100); }}
              style={textInput} />
          </div>
        </AccPanel>
      </div>
    );
  }

  /* ── Section editing ── */
  if (selectedSectionId && section) {
    return (
      <div style={{ background: theme.surface }}>
        <AccPanel
          id="section"
          open={accOpen === "section" || accOpen === null}
          onToggle={toggleAcc}
          title={section.name || section.type}
          icon={section._link ? undefined : "\uD83D\uDCC4"}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: theme.textMuted }}>{section.id.slice(0, 16)}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {section._link && (
                <button onClick={() => { store.detachSection(null, selectedSectionId); }}
                  style={{ ...iconBtn, color: "#3B6FE0", background: "#EEF4FF", border: "1px solid #D3E1FF" }} title="Detach from library"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                </button>
              )}
              {!section._link && (
                <button onClick={() => { store.saveSectionToLibrary(null, section.id); }}
                  style={{ ...iconBtn, marginRight: 4 }} title="Save to library"
                ><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg></button>
              )}
              <button onClick={() => { store.removeBodySection(null, section.id); onClose?.(); }}
                style={iconBtnDanger}
              ><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
            </div>
          </div>

          {/* Section name */}
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Section Name</label>
            <input value={section.name || ""}
              onChange={e => store.renameSection(null, selectedSectionId, e.target.value)}
              style={textInput} />
          </div>

          {/* Background Color */}
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Background Color</label>
            <ColorInput value={section.backgroundColor || "#FCF8FA"} onChange={(v) => {
              store.setSectionColor(null, selectedSectionId, v);
            }} />
          </div>

          {/* Quick Colors */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Quick Colors</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {QUICK_COLORS.map(c => (
                <div key={c} onClick={() => {
                  store.setSectionColor(null, selectedSectionId, c);
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
        </AccPanel>

        {/* Add component */}
        <AccPanel
          id="components"
          title="Add Component"
          open={accOpen === "components"}
          onToggle={toggleAcc}
          badge={(section.components || []).length}
        >
          <input
            value={addQuery}
            onChange={e => setAddQuery(e.target.value)}
            placeholder="Search components\u2026"
            style={{ ...textInput, marginTop: 4 }}
          />
          <div style={{ marginTop: 8 }}>
            {getComponentsByCategory().map(cat => {
              const q = addQuery.trim().toLowerCase();
              const items = cat.components.filter(d => {
                if (!q) return true;
                return (d.label || "").toLowerCase().includes(q) || (d.type || "").toLowerCase().includes(q);
              });
              if (items.length === 0) return null;
              const searching = !!q;
              const open = searching || catCollapsed[cat.key] !== true;
              return (
                <div key={cat.key} style={{ marginBottom: 10 }}>
                  <button
                    onClick={() => setCatCollapsed(p => ({ ...p, [cat.key]: p[cat.key] === undefined ? true : !p[cat.key] }))}
                    style={{
                      display: "flex", alignItems: "center", gap: 6, width: "100%",
                      background: "none", border: "none", cursor: "pointer", padding: "4px 2px",
                      fontFamily: "'Inter',sans-serif", textAlign: "left",
                    }}
                  >
                    <span style={{ fontSize: 10, color: theme.textMuted, transition: `transform ${theme.transition}`, transform: open ? "rotate(0deg)" : "rotate(-90deg)", display: "inline-flex" }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                    </span>
                    <span style={{ flex: 1, fontSize: 10, fontWeight: 700, color: theme.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {cat.icon} {cat.label}
                    </span>
                    <span style={{ fontSize: 9, color: theme.textMuted, background: theme.hover, borderRadius: 8, padding: "0 6px" }}>{items.length}</span>
                  </button>
                  {open && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginTop: 6, paddingLeft: 1 }}>
                      {items.map(def => (
                        <button key={def.type} onClick={() => store.addComponentToSection(selectedSectionId, def.type, { ...def.defaultProps })}
                          style={{
                            padding: "6px 4px", borderRadius: theme.radius.md, border: `1px solid ${theme.border}`, background: theme.surface,
                            cursor: "pointer", textAlign: "center", fontSize: 10, fontWeight: 500, color: theme.textSecondary,
                            fontFamily: "'Inter',sans-serif", transition: `all ${theme.transition}`,
                          }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = theme.active; e.currentTarget.style.background = theme.hoverAmber; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.background = theme.surface; }}
                        >
                          <div style={{ fontSize: 16, marginBottom: 1 }}>{COMPONENT_ICONS[def.type] || def.icon || "\uD83D\uDDC4\uFE0F"}</div>
                          <div style={{ fontSize: 9, lineHeight: 1.2 }}>{def.label}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </AccPanel>
      </div>
    );
  }

  return null;
}

function AccPanel({ id, open, onToggle, title, icon, badge, children }) {
  return (
    <div style={{ borderBottom: `1px solid ${theme.border}` }}>
      <button
        onClick={() => onToggle(id)}
        style={{
          display: "flex", alignItems: "center", gap: 8, width: "100%",
          padding: "9px 12px", background: open ? theme.hoverAmber : "transparent",
          border: "none", cursor: "pointer", textAlign: "left", fontFamily: "'Sora',sans-serif",
          transition: `background ${theme.transition}`,
        }}
      >
        <span style={{ fontSize: 11, color: open ? "#6B4200" : theme.textMuted, display: "inline-flex", transition: `transform ${theme.transition}`, transform: open ? "rotate(0deg)" : "rotate(-90deg)" }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </span>
      {icon && <span style={{ fontSize: 13 }}>{icon}</span>}
        <span style={{ flex: 1, fontSize: 11.5, fontWeight: 700, color: open ? "#6B4200" : theme.text, textTransform: "uppercase", letterSpacing: "0.05em" }}>{title}</span>
        {badge && <span style={{ fontSize: 9, color: theme.textMuted, background: theme.hover, borderRadius: 8, padding: "0 6px" }}>{badge}</span>}
      </button>
      {open && <div style={{ padding: "4px 12px 14px" }}>{children}</div>}
    </div>
  );
}

function TabEditorRow({ tab, screenIds, screens, onUpdate, onRemove, onReorder, isFirst, isLast }) {
  const [iconOpen, setIconOpen] = useState(false);
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6, padding: "7px 8px",
      background: theme.hover, borderRadius: theme.radius.md, marginBottom: 6,
      border: `1px solid ${theme.border}`,
    }}>
      {/* Icon picker */}
      <div style={{ position: "relative" }}>
        <button
          onClick={() => setIconOpen(o => !o)}
          style={{ width: 30, height: 30, fontSize: 16, borderRadius: theme.radius.sm, border: `1px solid ${theme.border}`, background: theme.surface, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          title="Pick icon"
        >{tab.icon || "\uD83D\uDCCB"}</button>
        {iconOpen && (
          <>
            <div style={{ position: "fixed", inset: 0, zIndex: 39 }} onClick={() => setIconOpen(false)} />
            <div style={{
              position: "absolute", zIndex: 40, bottom: "100%", left: 0, marginBottom: 6,
              background: theme.surface, borderRadius: theme.radius.md, boxShadow: theme.shadowLg,
              border: `1px solid ${theme.border}`, padding: 8, display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)", gap: 4, width: 200,
            }}>
              {TAB_ICONS.map(ic => (
                <button key={ic} onClick={() => { onUpdate({ icon: ic }); setIconOpen(false); }}
                  style={{
                    fontSize: 15, background: tab.icon === ic ? theme.hoverAmber : "transparent",
                    border: tab.icon === ic ? `1px solid ${theme.active}` : "1px solid transparent",
                    borderRadius: theme.radius.sm, cursor: "pointer", padding: 3,
                    transition: `all ${theme.transition}`,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = theme.hover; }}
                  onMouseLeave={e => { e.currentTarget.style.background = tab.icon === ic ? theme.hoverAmber : "transparent"; }}
                >{ic}</button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Label */}
      <input
        value={tab.label || ""}
        onChange={e => onUpdate({ label: e.target.value })}
        placeholder="Label"
        style={{ ...textInput, flex: 1, minWidth: 0, padding: "5px 7px", fontSize: 12 }}
      />

      {/* Color dot for icon */}
      <ColorInputDot value={tab.color} onChange={(v) => onUpdate({ color: v })} />

      {/* Screen select */}
      <select
        value={tab.screenId || ""}
        onChange={e => onUpdate({ screenId: e.target.value })}
        style={{ fontSize: 10, padding: "2px 4px", borderRadius: 4, border: `1px solid ${theme.border}`, background: theme.surface, fontFamily: "'Inter',sans-serif", maxWidth: 68 }}
      >
        <option value="">Page</option>
        {screenIds.map(sid => (
          <option key={sid} value={sid}>{screens[sid]?.name || sid}</option>
        ))}
      </select>

      {/* Reorder */}
      <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <button onClick={() => onReorder("left")} disabled={isFirst} style={iconBtnSmallRe} title="Move up"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg></button>
        <button onClick={() => onReorder("right")} disabled={isLast} style={iconBtnSmallRe} title="Move down"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg></button>
      </div>

      {/* Remove */}
      <button onClick={onRemove} style={iconBtnDanger} title="Delete tab"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>
  );
}

function ColorInputDot({ value, onChange }) {
  return (
    <input
      type="color"
      value={value || "#1A1A2E"}
      onChange={e => onChange(e.target.value)}
      title="Tab icon color"
      style={{ width: 22, height: 22, borderRadius: theme.radius.sm, border: "none", padding: 0, cursor: "pointer", background: "none" }}
    />
  );
}

const iconBtnSmallRe = { ...iconBtn, padding: "1px", width: 18, height: 18, opacity: 0.9, cursor: "pointer" };

/* ── General / Styling tab bar (optional search via lens icon) ── */
function FieldTabBar({ activeTab, onTab, searchOpen, onToggleSearch, query, onQueryChange }) {
  return (
    <div style={{ borderBottom: `1px solid ${theme.border}`, padding: "8px 12px 10px", background: theme.surface }}>
      <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: searchOpen ? 10 : 0 }}>
        <div style={{ display: "flex", flex: 1, background: theme.hover, borderRadius: theme.radius.md, padding: 3 }}>
          {["general", "styling"].map(t => (
            <button
              key={t}
              onClick={() => onTab(t)}
              style={{
                flex: 1, padding: "6px 0", border: "none", borderRadius: theme.radius.sm,
                cursor: "pointer", fontFamily: "'Sora',sans-serif", fontSize: 12, fontWeight: 700,
                background: activeTab === t ? theme.active : "transparent",
                color: activeTab === t ? "#5B3A00" : theme.textSecondary,
                transition: `all ${theme.transition}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
              }}
            >
              {t === "general" ? "General" : "Styling"}
            </button>
          ))}
        </div>
        <button
          onClick={onToggleSearch}
          title={searchOpen ? "Close search" : "Search fields"}
          style={{
            ...iconBtn, padding: "7px 9px", flexShrink: 0,
            background: searchOpen ? theme.hoverAmber : theme.surface,
            borderColor: searchOpen ? theme.active : theme.border,
            color: searchOpen ? theme.active : theme.textSecondary,
          }}
        >
          <Search size={15} strokeWidth={2.2} />
        </button>
      </div>
      {searchOpen && (
        <div style={{ position: "relative" }}>
          <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: theme.textMuted }} />
          <input
            value={query}
            onChange={e => onQueryChange(e.target.value)}
            placeholder="Search this tab…"
            autoFocus
            style={{ ...textInput, paddingLeft: 30 }}
          />
        </div>
      )}
    </div>
  );
}

/* Determine whether a prop field belongs to Styling (appearance) or General (content/behavior). */
const STYLE_KEY_RE = /color|background|bg|\bfill\b|font|radius|size|width|height|alignment|fit|gap|shadow|elevation|padding|margin|opacity|stroke|roundness|columns|variant|spacing|border/i;
function groupForField(field) {
  if (!field) return "general";
  if (field.group) return field.group;
  if (field.type === "color" || field.type === "bg") return "styling";
  if (STYLE_KEY_RE.test(String(field.key || ""))) return "styling";
  return "general";
}

/* Shared field editor used by General tab, Styling tab, and search results. */
function FieldEditor({ field, value, onChange, focused, onClearProp, screens }) {
  return (
    <div key={field.key} style={{ marginBottom: 12, padding: focused ? "8px" : 0, border: focused ? `1.5px solid ${theme.active}` : "none", borderRadius: theme.radius.md, transition: `all ${theme.transition}` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <label style={labelStyle}>{field.label}</label>
        {focused && (
          <button onClick={() => onClearProp?.(field.key)} style={{ fontSize: 10, border: "none", background: "none", color: theme.danger, cursor: "pointer", padding: "0 2px", fontFamily: "'Inter',sans-serif", fontWeight: 600 }}>Remove</button>
        )}
      </div>
      {field.type === "list" ? (
        <ListFieldEditor
          fields={field.fields}
          value={Array.isArray(value) ? value : []}
          onChange={onChange}
        />
      ) : field.type === "bg" ? (
        <FillEditor value={value} onChange={onChange} />
      ) : field.type === "color" ? (
        <ColorInput value={value || "#000000"} onChange={onChange} />
      ) : field.type === "select" ? (
        <select value={value || (field.options?.[0] || "")}
          onChange={e => onChange(e.target.value)}
          style={{ ...textInput, cursor: "pointer" }}>
          {field.options?.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : field.type === "image" ? (
        <ImageUploader
          currentSrc={value || ""}
          onUpload={onChange}
        />
      ) : field.type === "json" ? (
        <ActionEditor
          value={value || ""}
          onChange={onChange}
          screens={screens || []}
        />
      ) : (
        <input
          type={field.type === "number" ? "number" : "text"}
          value={value ?? (field.type === "number" ? 0 : "")}
          onChange={e => {
            const raw = e.target.value;
            if (field.type === "number") {
              const n = Number(raw);
              onChange(Number.isFinite(n) && raw !== "" ? n : 0);
            } else {
              onChange(raw);
            }
          }}
          style={textInput} />
      )}
    </div>
  );
}

function parsePreviewActionJson(value) {
  if (!value || typeof value !== "string") return null;
  const t = value.trim();
  if (!t) return null;
  try {
    const parsed = JSON.parse(t);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

/* Friendly JSON action editor: preset chips + target screen dropdown, raw-JSON fallback. */
function ActionEditor({ value = "", onChange, screens }) {
  const [rawMode, setRawMode] = useState(false);
  const parsed = parsePreviewActionJson(value);
  const selectedType = parsed?.type || "";
  const rawJsonActive = rawMode || (value.trim() !== "" && parsed && !["navigate", "pop", "refresh"].includes(parsed.type));

  const applyAction = (action) => onChange(action ? JSON.stringify(action, null, 2) : "");

  return (
    <div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
        {[
          { type: "navigate", label: "Open Screen" },
          { type: "pop", label: "Go Back" },
          { type: "refresh", label: "Refresh" },
        ].map(opt => (
          <button key={opt.type}
            onClick={() => {
              setRawMode(false);
              applyAction(opt.type === "navigate" ? { type: "navigate", payload: { screenId: "" } } : { type: opt.type });
            }}
            style={{
              padding: "5px 11px", borderRadius: 999, cursor: "pointer", fontFamily: "'Inter',sans-serif",
              fontSize: 11, fontWeight: 600,
              background: selectedType === opt.type && !rawJsonActive ? theme.active : theme.hover,
              border: `1px solid ${selectedType === opt.type && !rawJsonActive ? theme.active : theme.border}`,
              color: selectedType === opt.type && !rawJsonActive ? "#5B3A00" : theme.textSecondary,
              transition: `all ${theme.transition}`,
            }}
          >
            {opt.label}
          </button>
        ))}
        <button onClick={() => setRawMode(o => !o)}
          style={{
            padding: "5px 11px", borderRadius: 999, cursor: "pointer", fontFamily: "'Inter',sans-serif",
            fontSize: 11, fontWeight: 600, border: `1px dashed ${theme.border}`,
            background: rawJsonActive ? theme.hoverAmber : "none",
            color: rawJsonActive ? theme.active : theme.textSecondary,
          }}
        >
          Raw JSON
        </button>
      </div>

      {rawJsonActive ? (
        <textarea value={value || ""}
          onChange={e => onChange(e.target.value)}
          style={{ ...textInput, minHeight: 70, resize: "vertical", fontFamily: "'Monaco','Consolas',monospace", fontSize: 11 }}
          placeholder='{"type": "navigate", "payload": {"screenId": ""}}' />
      ) : selectedType === "navigate" ? (
        <select value={parsed?.payload?.screenId || ""}
          onChange={e => applyAction({ type: "navigate", payload: { screenId: e.target.value } })}
          style={{ ...textInput, cursor: "pointer" }}>
          <option value="">Select a screen…</option>
          {screens.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      ) : parsed ? (
        <div style={{ fontSize: 11, color: theme.textMuted, background: theme.hover, borderRadius: theme.radius.sm, padding: "8px 10px", lineHeight: 1.5 }}>
          Action: <b style={{ color: theme.text }}>{parsed.type}</b>
          {parsed.payload ? <div style={{ fontSize: 10, marginTop: 2 }}>{JSON.stringify(parsed.payload)}</div> : null}
        </div>
      ) : (
        <div style={{ fontSize: 11, color: theme.textMuted }}>No action set — pick a behavior above.</div>
      )}
    </div>
  );
}

function SpacingEditor({ value, onChange }) {
  const v = value && typeof value === "object" ? value : {};
  const set = (side, num) => onChange({ ...v, [side]: num });
  const SIDES = [
    { key: "top", label: "T" },
    { key: "right", label: "R" },
    { key: "bottom", label: "B" },
    { key: "left", label: "L" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
      {SIDES.map(({ key, label }) => (
        <div key={key}>
          <div style={{ fontSize: 9, color: theme.textMuted, textAlign: "center", marginBottom: 2 }}>{label}</div>
          <input type="number" value={v[key] ?? 0}
            onChange={e => { const n = Number(e.target.value); set(key, Number.isFinite(n) ? n : 0); }}
            style={{ ...textInput, textAlign: "center", padding: "5px 2px" }} />
        </div>
      ))}
    </div>
  );
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

function CompactImageUploader({ value, onUpload, size }) {
  const fileRef = useRef(null);
  const s = size || 38;
  return (
    <div
      onClick={() => fileRef.current?.click()}
      style={{
        width: s, height: s, borderRadius: theme.radius.sm, flexShrink: 0, cursor: "pointer",
        background: value ? `url(${value}) center/cover no-repeat` : theme.hover,
        border: `1px dashed ${theme.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 14, color: theme.textMuted, transition: `border-color ${theme.transition}`,
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = theme.active}
      onMouseLeave={e => e.currentTarget.style.borderColor = theme.border}
    >
      {!value && "\uD83D\uDDBC\uFE0F"}
      <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (ev) => onUpload(ev.target.result);
          reader.readAsDataURL(file);
        }} />
    </div>
  );
}

/* Figma-style fill editor: one picker that toggles between a solid color and an image. */
function FillEditor({ value, onChange }) {
  const isImage = !!(value && typeof value === "object" && value.type === "image" && value.value);
  const colorVal = isImage ? "" : (value && typeof value === "object" ? value.value : value) || "";
  const [mode, setMode] = useState(isImage ? "image" : "color");
  const currentMode = mode;
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          width: 30, height: 30, borderRadius: theme.radius.sm, flexShrink: 0,
          border: "2px solid #fff", boxShadow: "0 0 0 1px rgba(0,0,0,0.15)",
          background: isImage ? `url(${value.value}) center/cover no-repeat` : (colorVal || "transparent"),
        }} />
        <div style={{ display: "flex", border: `1px solid ${theme.border}`, borderRadius: theme.radius.sm, overflow: "hidden", flex: 1 }}>
          {["color", "image"].map(m => (
            <button key={m}
              onClick={() => setMode(m)}
              style={{
                flex: 1, padding: "5px 0", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600,
                fontFamily: "'Inter',sans-serif", transition: `all ${theme.transition}`,
                background: currentMode === m ? theme.active : "transparent",
                color: currentMode === m ? "#5B3A00" : theme.textSecondary,
              }}
            >{m === "color" ? "Color" : "Image"}</button>
          ))}
        </div>
      </div>

      {currentMode === "image" ? (
        <div style={{ marginTop: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <CompactImageUploader value={isImage ? value.value : ""} size={72}
              onUpload={(dataUrl) => onChange({ type: "image", value: dataUrl })} />
            <div style={{ fontSize: 10, color: theme.textMuted, lineHeight: 1.4 }}>
              Tap to upload.<br />Image covers the full background.
            </div>
          </div>
          {isImage && (
            <button
              onClick={() => onChange({ type: "color", value: colorVal })}
              style={{ marginTop: 6, fontSize: 11, padding: "4px 10px", border: `1px solid ${theme.dangerBorder}`, borderRadius: theme.radius.sm, background: theme.dangerLight, color: theme.danger, cursor: "pointer", fontFamily: "'Inter',sans-serif", fontWeight: 600 }}
            >Remove image</button>
          )}
        </div>
      ) : (
        <div style={{ marginTop: 8 }}>
          <ColorInput value={colorVal} onChange={(v) => onChange({ type: "color", value: v })} />
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 6 }}>
            {QUICK_COLORS.map(c => (
<div key={c}
                onClick={() => onChange({ type: "color", value: c })}
                style={{
                  width: 18, height: 18, borderRadius: "50%", background: c, cursor: "pointer",
                  border: colorVal === c ? `2px solid ${theme.active}` : "2px solid rgba(0,0,0,0.12)",
                  outline: colorVal === c ? `2px solid ${theme.active}` : "none", outlineOffset: 1,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ListFieldEditor({ fields, value, onChange }) {
  const items = value || [];
  const [openIdx, setOpenIdx] = useState(0);

  const updateItem = (idx, key, v) => {
    const next = items.map((it, i) => i === idx ? { ...it, [key]: v } : it);
    onChange(next);
  };

  const addItem = () => {
    const blank = {};
    fields.forEach(f => {
      if (f.type === "color") blank[f.key] = "#FCF8FA";
      else if (f.type === "bg") blank[f.key] = { type: "color", value: "" };
      else if (f.type === "number") blank[f.key] = 0;
      else if (f.type === "select") blank[f.key] = f.options?.[0] || "";
      else blank[f.key] = "";
    });
    onChange([...items, blank]);
    setOpenIdx(items.length);
  };

  const removeItem = (idx) => onChange(items.filter((_, i) => i !== idx));

  const moveItem = (idx, dir) => {
    const t = idx + dir;
    if (t < 0 || t >= items.length) return;
    const next = items.slice();
    [next[idx], next[t]] = [next[t], next[idx]];
    onChange(next);
    setOpenIdx(t);
  };

  const textField = fields.find(f => f.type === "text");
  const nameKey = fields.find(f => f.key === "name")?.key || textField?.key;

  return (
    <div>
      {items.length === 0 && (
        <div style={{ fontSize: 11, color: theme.textMuted, marginBottom: 8 }}>No items yet.</div>
      )}
      {items.map((it, idx) => {
        const open = openIdx === idx;
        const title = nameKey && it[nameKey] ? it[nameKey] : `Item ${idx + 1}`;
        const imgField = fields.find(f => f.type === "image");
        return (
          <div key={idx} style={{
            border: open ? `1.5px solid ${theme.active}` : `1px solid ${theme.border}`,
            borderRadius: theme.radius.md, marginBottom: 8, overflow: "hidden",
            transition: `border-color ${theme.transition}`,
          }}>
            {/* Row header */}
            <div
              onClick={() => setOpenIdx(open ? -1 : idx)}
              style={{
                display: "flex", alignItems: "center", gap: 8, padding: "6px 8px",
                cursor: "pointer", background: open ? theme.hoverAmber : "transparent",
              }}
            >
              {imgField && <CompactImageUploader value={it[imgField.key]} size={30}
                onUpload={(v) => updateItem(idx, imgField.key, v)} />}
              <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 12, fontWeight: 600, color: theme.text, fontFamily: "'Inter',sans-serif" }}>
                {title}
              </span>
              <div style={{ display: "flex", gap: 2 }} onClick={(e) => e.stopPropagation()}>
                <button onClick={() => moveItem(idx, -1)} style={iconBtn} title="Up"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg></button>
                <button onClick={() => moveItem(idx, 1)} style={iconBtn} title="Down"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg></button>
                <button onClick={() => removeItem(idx)} style={iconBtnDanger} title="Remove"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg></button>
              </div>
            </div>

            {/* Expanded fields */}
            {open && (
              <div style={{ padding: "8px 10px", background: theme.surface }}>
                {fields.map(f => {
                  const v = it[f.key];
                  return (
                    <div key={f.key} style={{ marginBottom: 8 }}>
                      <label style={{ ...labelStyle, fontSize: 11 }}>{f.label}</label>
                      {f.type === "bg" ? (
                        <FillEditor value={v} onChange={(cv) => updateItem(idx, f.key, cv)} />
                      ) : f.type === "color" ? (
                        <div>
                          <ColorInput value={v || "#000000"} onChange={(cv) => updateItem(idx, f.key, cv)} />
                          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 6 }}>
                            {QUICK_COLORS.map(c => (
                              <div key={c}
                                onClick={() => updateItem(idx, f.key, c)}
                                style={{
                                  width: 18, height: 18, borderRadius: "50%", background: c, cursor: "pointer",
                                  border: v === c ? `2px solid ${theme.active}` : "2px solid rgba(0,0,0,0.12)",
                                  outline: v === c ? `2px solid ${theme.active}` : "none", outlineOffset: 1,
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      ) : f.type === "image" ? (
                        <CompactImageUploader value={v} size={52}
                          onUpload={(cv) => updateItem(idx, f.key, cv)} />
                      ) : f.type === "select" ? (
                        <select value={v || f.options?.[0] || ""} style={{ ...textInput, cursor: "pointer" }}
                          onChange={e => updateItem(idx, f.key, e.target.value)}>
                          {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      ) : f.type === "number" ? (
                        <input type="number" value={v || 0} style={textInput}
                          onChange={e => updateItem(idx, f.key, Number(e.target.value))} />
                      ) : (
                        <input type="text" value={v || ""} style={textInput}
                          onChange={e => updateItem(idx, f.key, e.target.value)}
                          placeholder={f.placeholder || f.label} />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      <button onClick={addItem} style={{ ...iconBtn, width: "100%", padding: "8px 0", borderStyle: "dashed", fontSize: 12, fontWeight: 600, color: theme.active, marginTop: 4 }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Add item
      </button>
    </div>
  );
}
