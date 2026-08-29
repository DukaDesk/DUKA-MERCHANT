import { useState, useRef, useCallback, useEffect } from "react";
import { Search, Type, Palette, Image as ImageIcon, Square, LayoutGrid, Sparkles, Compass, FileText, Tag, ShoppingBag, ClipboardList, PanelTop, Star, Minus, Plus, Pencil, Boxes, GalleryHorizontal, CreditCard, ShoppingCart, Calendar, Clock, Bell, MapPin, BarChart3, Scissors, Phone, ToggleLeft, CheckSquare, User, ArrowLeftRight, ArrowDownUp, Zap, Hash, Circle, Construction, Link, Unlink } from "lucide-react";
import { getComponentType, getAllComponentTypes, getComponentsByCategory, FONT_FAMILIES, FONT_WEIGHTS, resolveTextStyle, applyTextStyle } from "../canvas-editor/componentTypes";
import { useEditorTheme, ColorInput } from "./editorTheme.jsx";

function IconRender({ icon, size = 16, style }) {
  if (!icon) return null;
  if (icon && (typeof icon === "function" || typeof icon === "object")) {
    const Icon = icon;
    return <Icon size={size} style={style} />;
  }
  return <span style={{ fontSize: size, ...style }}>{icon}</span>;
}

const COMPONENT_ICONS = {
  hero_banner: ImageIcon,
  menu_item: ShoppingBag,
  category_pills: Tag,
  text_block: Type,
  image_block: ImageIcon,
  button: Square,
  menu_grid: ClipboardList,
  header_bar: PanelTop,
  divider: Minus,
  gap: ArrowDownUp,
  carousel: GalleryHorizontal,
  nested_section: Boxes,
  row: LayoutGrid,
  promotion_list: Tag,
  card: CreditCard,
  icon: Star,
  chevron: ArrowLeftRight,
  icon_button: Square,
  fab: Plus,
  text_input: Pencil,
  search_bar: Search,
  switch_toggle: ToggleLeft,
  checkbox_row: CheckSquare,
  avatar: User,
  badge: Tag,
  progress_bar: BarChart3,
  rating: Star,
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
  const { theme, iconBtn, iconBtnDanger, textInput, labelStyle } = useEditorTheme();
  const data = store.data;
  const [addQuery, setAddQuery] = useState("");
  const [catCollapsed, setCatCollapsed] = useState({});
  const [accOpen, setAccOpen] = useState(null);
  const [activeTab, setActiveTab] = useState("general");
  const [searchOpen, setSearchOpen] = useState(false);
  const [propQuery, setPropQuery] = useState("");
  const toggleAcc = (id) => setAccOpen(o => (o === id ? null : id));

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

  /* ── Contextual Properties content (nav tabs / component / section / branding) ── */
  const navTabs = data.navigation?.tabs || [];
  const navStyle = data.navigation?.style || {};
  const def = component ? getComponentType(component.type) : null;
  const fields = def?.propFields || [];
  const focusedField = component ? (def?.subElements?.find(s => focusSubKey?.compId === component.id && focusSubKey?.key === s.key)) : null;
  const canAdd = !!section;
  const addDisabled = !canAdd;

  let propertiesContent = (
    <div style={{ textAlign: "center", padding: "24px 12px", color: theme.textMuted }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 8, color: theme.textMuted }}><FileText size={24} /></div>
      <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, fontFamily: "'Inter',sans-serif" }}>No Selection</div>
      <div style={{ fontSize: 11, lineHeight: 1.5, fontFamily: "'Inter',sans-serif" }}>
        Select a section or component to edit its properties.
      </div>
    </div>
  );

  if (navSelected) {
    propertiesContent = (
      <>
        <div style={{ fontSize: 10, color: theme.textMuted, marginBottom: 10, fontFamily: "'Inter',sans-serif", lineHeight: 1.4 }}>
          Tabs appear in the bottom bar. Add icons, colors and link each tab to a page.
        </div>

        {navTabs.length === 0 && (
          <div style={{ fontSize: 11, color: theme.textMuted, marginBottom: 10, fontFamily: "'Inter',sans-serif" }}>
            No tabs yet. Add one below.
          </div>
        )}

        {navTabs.map((tab, i) => (
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
            isLast={i === navTabs.length - 1}
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
      </>
    );
  }

  /* ── Component editing ── */
  if (component) {
    propertiesContent = (
      <>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ display: "flex", color: theme.textMuted }}><IconRender icon={COMPONENT_ICONS[component.type] || FileText} size={18} /></span>
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
                <span style={{ display: "flex", alignItems: "center" }}>{(() => { const Icon = focusedField.icon; return Icon ? <Icon size={14} /> : null; })()}</span>
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
                    <span style={{ display: "flex", alignItems: "center", color: theme.textMuted }}>{(() => { const Icon = COMPONENT_ICONS[childDef?.type] || childDef?.icon || FileText; return <Icon size={13} />; })()}</span>
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
                      <div style={{ display: "flex", justifyContent: "center", marginBottom: 1, color: theme.textMuted }}>{(() => { const Icon = COMPONENT_ICONS[def2.type] || FileText; return Icon ? <Icon size={15} /> : null; })()}</div>
                      <div style={{ fontSize: 9, lineHeight: 1.2 }}>{def2.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
      </>
    );
  }

  /* ── Section editing ── */
  if (!component && section) {
    propertiesContent = (
      <>
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
      </>
    );
  }

  // Helpers for General / Styling split
  const q = propQuery.trim().toLowerCase();
  const matchesQuery = (label, key) => !q || String(label || "").toLowerCase().includes(q) || String(key || "").toLowerCase().includes(q);
  const STYLING_GROUP_ORDER = ["typography","colors","background","border","layout","effects"];
  function isStylingField(f){ if(f.group && STYLING_GROUP_ORDER.includes(f.group)) return true; return groupForField(f)==="styling"; }
  const generalFields = fields.filter(f => !isStylingField(f) && (q ? matchesQuery(f.label, f.key) : true));
  const rawStylingFields = fields.filter(f => isStylingField(f) && (q ? matchesQuery(f.label, f.key) : true));
  const STYLING_GROUP_META = {
    typography: { label: "Typography", icon: Type },
    colors: { label: "Colors", icon: Palette },
    background: { label: "Background", icon: ImageIcon },
    border: { label: "Border & Radius", icon: Square },
    layout: { label: "Layout", icon: LayoutGrid },
    effects: { label: "Effects", icon: Sparkles },
  };
  function getStylingGroup(field){
    if (field.group && STYLING_GROUP_ORDER.includes(field.group)) return field.group;
    const k = String(field.key||"");
    if (field.type === "radius" || /radius|border/i.test(k)) return "border";
    if (field.type === "bg" || /^(background|fill)$/i.test(k) || /background|fill/i.test(k) && !/color/i.test(k)) return "background";
    if (field.type === "color" || /color/i.test(k)) return "colors";
    if (/font|weight|fontStyle|lineHeight|letterSpacing|alignment|textTransform/i.test(k)) return "typography";
    if (/shadow|elevation|opacity/i.test(k)) return "effects";
    if (/size|width|height|fit|gap|columns|padding|variant|thickness/i.test(k)) return "layout";
    return "layout";
  }
  function isRadiusField(field){ const k=String(field.key||""); return field.type==="radius" || /radius/i.test(k); }
  const stylingGroups = (() => {
    const m = {};
    for (const f of rawStylingFields) { const g=getStylingGroup(f); (m[g] ||= []).push(f); }
    return m;
  })();
  const stylingGroupKeys = STYLING_GROUP_ORDER.filter(k => (stylingGroups[k]||[]).length>0);
  const [stylingOpen, setStylingOpen] = useState({});
  useEffect(()=>{
    const init={};
    if(focusedField?.styleable && focusedField?.kind==="text") init["sub-text-style"]=true;
    else if(stylingGroupKeys.length) stylingGroupKeys.forEach((k,i)=> init[k]= i===0);
    // keep sub-text-style open even when other groups exist
    if(focusedField?.styleable && focusedField?.kind==="text" && stylingGroupKeys.length) stylingGroupKeys.forEach((k,i)=> { if(init[k]===undefined) init[k]=false; });
    setStylingOpen(init);
  }, [selectedComponentId, selectedSectionId, navSelected, propQuery, focusedField?.key]);
  const toggleStyling = (k)=> setStylingOpen(o=> ({...o, [k]: !o[k]}));

  // Add Component content reused in General tab
  const AddComponentContent = () => (
    <div>
      {!section && (
        <div style={{ background: theme.hoverAmber, borderRadius: theme.radius.md, padding: 10, marginBottom: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#6B4200", marginBottom: 2 }}>Select a section first</div>
          <div style={{ fontSize: 10, color: "#92400E", lineHeight: 1.4 }}>Click a section on the canvas or in the left panel to add components to it.</div>
        </div>
      )}
      <input value={addQuery} onChange={e => setAddQuery(e.target.value)} placeholder="Search components…" style={{ ...textInput, marginBottom: 8 }} />
      {getComponentsByCategory().map(cat => {
        const cq = addQuery.trim().toLowerCase();
        const items = cat.components.filter(d => !cq || (d.label || "").toLowerCase().includes(cq) || (d.type || "").toLowerCase().includes(cq));
        if (items.length === 0) return null;
        const open = cq ? true : catCollapsed[cat.key] !== true;
        return (
          <div key={cat.key} style={{ marginBottom: 10 }}>
            <button onClick={() => setCatCollapsed(p => ({ ...p, [cat.key]: p[cat.key] === undefined ? true : !p[cat.key] }))} style={{ display: "flex", alignItems: "center", gap: 6, width: "100%", background: "none", border: "none", cursor: "pointer", padding: "4px 2px", fontFamily: "'Inter',sans-serif", textAlign: "left" }}>
              <span style={{ fontSize: 10, color: theme.textMuted, transform: open ? "rotate(0deg)" : "rotate(-90deg)", display: "inline-flex" }}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg></span>
              <span style={{ flex: 1, fontSize: 10, fontWeight: 700, color: theme.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>{cat.label}</span>
              <span style={{ fontSize: 9, color: theme.textMuted, background: theme.hover, borderRadius: 8, padding: "0 6px" }}>{items.length}</span>
            </button>
            {open && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginTop: 6 }}>
                {items.map(compDef => (
                  <button key={compDef.type} onClick={() => section && store.addComponentToSection(selectedSectionId, compDef.type, { ...compDef.defaultProps })} disabled={addDisabled} style={{ padding: "6px 4px", borderRadius: theme.radius.md, border: `1px solid ${theme.border}`, background: theme.surface, cursor: addDisabled ? "not-allowed" : "pointer", textAlign: "center", fontSize: 10, fontWeight: 500, color: theme.textSecondary, opacity: addDisabled ? 0.45 : 1 }}>
                    <div style={{ fontSize: 16, marginBottom: 1, color: theme.textMuted }}><IconRender icon={COMPONENT_ICONS[compDef.type] || compDef.icon || FileText} size={16} /></div>
                    <div style={{ fontSize: 9, lineHeight: 1.2 }}>{compDef.label}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0, background: theme.surface }}>
      {/* Top toggle - General / Styling */}
      <div style={{ display: "flex", gap: 6, padding: "8px 8px 6px", borderBottom: `1px solid ${theme.border}`, flexShrink: 0, alignItems: "center", background: theme.surface, position: "sticky", top: 0, zIndex: 1 }}>
        <div style={{ display: "flex", flex: 1, background: theme.hover, borderRadius: theme.radius.md, padding: 3 }}>
          {[
            { key: "general", label: "General" },
            { key: "styling", label: "Styling" },
          ].map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} style={{ flex: 1, padding: "6px 0", border: "none", borderRadius: theme.radius.sm, cursor: "pointer", fontFamily: "'Sora',sans-serif", fontSize: 12, fontWeight: 700, background: activeTab === t.key ? theme.active : "transparent", color: activeTab === t.key ? "#5B3A00" : theme.textSecondary, transition: `all ${theme.transition}` }}>{t.label}</button>
          ))}
        </div>
        <button onClick={() => setSearchOpen(o => !o)} title={searchOpen ? "Close search" : "Search"} style={{ ...iconBtn, padding: "7px 9px", flexShrink: 0, background: searchOpen ? theme.hoverAmber : theme.surface, borderColor: searchOpen ? theme.active : theme.border, color: searchOpen ? theme.active : theme.textSecondary }}>
          <Search size={15} strokeWidth={2.2} />
        </button>
      </div>
      {searchOpen && (
        <div style={{ padding: "8px", borderBottom: `1px solid ${theme.border}`, background: theme.surface, flexShrink: 0 }}>
          <div style={{ position: "relative" }}>
            <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: theme.textMuted }} />
            <input value={propQuery} onChange={e => setPropQuery(e.target.value)} placeholder="Search properties..." autoFocus style={{ ...textInput, paddingLeft: 30 }} />
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 10px", minHeight: 0 }}>
        {activeTab === "general" ? (
          <>
            {/* General tab: name/title/content fields + section/component identity */}
            {navSelected ? (
              <>{propertiesContent}</>
            ) : component ? (
              <>
                {/* Header stays in General */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ display: "flex", color: theme.textMuted }}><IconRender icon={COMPONENT_ICONS[component.type] || FileText} size={18} /></span>
                    <div>
                      <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 14, color: theme.text }}>{def?.label || component.type}</div>
                      <div style={{ fontSize: 10, color: theme.textMuted }}>{component.id.slice(0, 12)}</div>
                    </div>
                  </div>
                  <button onClick={() => { onClose?.(); store.removeComponentFromSection(selectedSectionId, component.id); }} style={iconBtnDanger}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg></button>
                </div>
                {focusedField && (
                  <div style={{ marginBottom: 12, padding: "8px 10px", borderRadius: theme.radius.md, background: theme.hoverAmber, border: `1px solid ${theme.active}` }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: focusedField.styleable && focusedField.kind === "text" ? 8 : 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#6B4200", fontWeight: 600 }}><span style={{ display: "flex", alignItems: "center" }}>{(() => { const Icon = focusedField.icon; return Icon ? <Icon size={14} /> : null; })()}</span> Editing: {focusedField.label}{focusedField.styleable ? " · Text" : ""}</div>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button onClick={() => onSelectComponent?.(selectedSectionId, component.id)} style={{ fontSize: 11, padding: "4px 8px", border: `1px solid ${theme.border}`, borderRadius: theme.radius.sm, background: "#fff", color: theme.textSecondary, cursor: "pointer", fontWeight: 600 }}>Back</button>
                        <button onClick={() => onClearProp?.(focusedField.key)} style={{ fontSize: 11, padding: "4px 8px", border: `1px solid ${theme.dangerBorder}`, borderRadius: theme.radius.sm, background: theme.dangerLight, color: theme.danger, cursor: "pointer", fontWeight: 600 }}>Remove</button>
                      </div>
                    </div>
                    {focusedField.styleable && focusedField.kind === "text" && (
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 600, color: "#6B4200", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>Content — double-click on canvas also edits</div>
                        <input value={component.props?.[focusedField.key] || ""} onChange={e => store.updateProp(selectedSectionId, component.id, focusedField.key, e.target.value)} placeholder={focusedField.label} style={{ ...textInput, marginBottom: 6 }} />
                        <div style={{ fontSize: 10, color: "#92400E", lineHeight: 1.4 }}>Select <b>Styling</b> tab to edit font for this text.</div>
                      </div>
                    )}
                  </div>
                )}
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                  <button onClick={() => store.reorderComponent(selectedSectionId, component.id, "up")} style={{ ...iconBtn, flex: 1, gap: 4, padding: "6px 0" }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15" /></svg><span style={{ fontSize: 11, fontWeight: 600 }}>Up</span></button>
                  <button onClick={() => store.reorderComponent(selectedSectionId, component.id, "down")} style={{ ...iconBtn, flex: 1, gap: 4, padding: "6px 0" }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg><span style={{ fontSize: 11, fontWeight: 600 }}>Down</span></button>
                  <button onClick={() => store.duplicateComponentInSection(selectedSectionId, component.id)} style={{ ...iconBtn, flex: 1, gap: 4, padding: "6px 0" }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg><span style={{ fontSize: 11, fontWeight: 600 }}>Dup</span></button>
                </div>
                {component.type === "image_block" && <ImageUploader currentSrc={component.props?.src} onUpload={(v) => store.updateProp(selectedSectionId, component.id, "src", v)} />}
                {generalFields.length === 0 ? <div style={{ fontSize: 11, color: theme.textMuted, padding: 8, textAlign: "center" }}>No general properties{q ? ` for "${q}"` : ""}.</div> : generalFields.map(field => <FieldEditor key={field.key} field={field} value={component.props?.[field.key]} onChange={(v) => store.updateProp(selectedSectionId, component.id, field.key, v)} focused={focusedField?.key === field.key} onClearProp={onClearProp} screens={Object.values(data.screens).map(s => ({ id: s.id || s.name, name: s.name }))} />)}
                {/* Container children - content structure */}
                {def?.container && (
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${theme.borderLight}` }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: theme.text, marginBottom: 8 }}>Children ({component.children?.length || 0})</div>
                    {(component.children || []).map((child, i) => {
                      const childDef = getComponentType(child.type);
                      return (
                        <div key={child.id} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, padding: "6px 8px", borderRadius: theme.radius.md, background: theme.hover, border: `1px solid ${theme.border}`, cursor: "pointer" }} onClick={() => onSelectComponent?.(selectedSectionId, child.id)}>
                          <span style={{ display: "flex", alignItems: "center", color: theme.textMuted }}>{(() => { const Icon = COMPONENT_ICONS[childDef?.type] || FileText; return <Icon size={13} />; })()}</span>
                          <span style={{ flex: 1, fontSize: 12, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{childDef?.label || child.type}</span>
                          <button onClick={e => { e.stopPropagation(); store.removeComponentFromSection(selectedSectionId, child.id); }} style={iconBtnDanger}>x</button>
                        </div>
                      );
                    })}
                    <div style={{ fontSize: 11, fontWeight: 600, color: theme.textSecondary, margin: "10px 0 6px" }}>Add child</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                      {getAllComponentTypes().slice(0, 6).map(def2 => (
                        <button key={def2.type} onClick={() => store.addComponentToSection(selectedSectionId, def2.type, { ...def2.defaultProps }, component.id)} style={{ padding: "6px 4px", borderRadius: theme.radius.md, border: `1px solid ${theme.border}`, background: theme.surface, cursor: "pointer", fontSize: 9 }}>{def2.label}</button>
                      ))}
                    </div>
                  </div>
                )}
                {/* Visibility in General */}
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${theme.borderLight}` }}>
                  <label style={labelStyle}>Visibility</label>
                  <label style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}><input type="checkbox" checked={component.visible !== false} onChange={e => store.updateComponentInSection(selectedSectionId, component.id, { visible: e.target.checked })} style={{ accentColor: theme.active }} /> Visible</label>
                </div>
              </>
            ) : section ? (
              <>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ fontSize: 10, color: theme.textMuted }}>{section.id.slice(0, 16)}</div>
                  <div style={{ display: "flex", gap: 4 }}>
                    {!section._link && <button onClick={() => store.saveSectionToLibrary(null, section.id)} style={{ ...iconBtn, marginRight: 4 }} title="Save to library"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /></svg></button>}
                    <button onClick={() => { store.removeBodySection(null, section.id); onClose?.(); }} style={iconBtnDanger}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg></button>
                  </div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={labelStyle}>Section Name</label>
                  <input value={section.name || ""} onChange={e => store.renameSection(null, selectedSectionId, e.target.value)} style={textInput} />
                </div>
                <div style={{ borderTop: `1px solid ${theme.borderLight}`, paddingTop: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: theme.text, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Add Element</div>
                  <AddComponentContent />
                </div>
              </>
            ) : (
              <>
                <div style={{ textAlign: "center", padding: "20px 12px", color: theme.textMuted }}>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 6, color: theme.textMuted }}><FileText size={22} /></div>
                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>No Selection</div>
                  <div style={{ fontSize: 11, lineHeight: 1.5 }}>Select a section or component to edit its properties.</div>
                </div>
                <div style={{ borderTop: `1px solid ${theme.borderLight}`, paddingTop: 12, marginTop: 8 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Add Element</div>
                  <AddComponentContent />
                </div>
                <div style={{ background: theme.hoverAmber, borderRadius: theme.radius.md, padding: 12, marginTop: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#6B4200", marginBottom: 4 }}>Tip</div>
                  <div style={{ fontSize: 11, color: "#92400E", lineHeight: 1.5 }}>Pick an element on the canvas to see its editable fields here in General, and its appearance controls in Styling.</div>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            {/* Styling tab: colors, typography, spacing, backgrounds */}
            {navSelected ? (
              <>
                <div style={{ marginBottom: 12 }}><label style={labelStyle}>Bar Background</label><ColorInput value={navStyle.background || "#FFFFFF"} onChange={v => store.setNavigation({ style: { ...navStyle, background: v } })} /></div>
                <div style={{ marginBottom: 12 }}><label style={labelStyle}>Active Color</label><ColorInput value={navStyle.active || "#1A1A2E"} onChange={v => store.setNavigation({ style: { ...navStyle, active: v } })} /></div>
                <div style={{ marginBottom: 12 }}><label style={labelStyle}>Inactive Color</label><ColorInput value={navStyle.inactive || "#9CA3AF"} onChange={v => store.setNavigation({ style: { ...navStyle, inactive: v } })} /></div>
              </>
            ) : component ? (
              <div style={{ margin: "-12px -10px 0", borderTop: `1px solid ${theme.borderLight}` }}>
                {focusedField?.styleable && focusedField?.kind === "text" && (
                  <AccPanel id="sub-text-style" open={stylingOpen["sub-text-style"] !== false} onToggle={toggleStyling} title={`Text: ${focusedField.label}`} icon={focusedField.icon || Type}>
                    <div style={{ fontSize: 10, color: theme.textMuted, marginBottom: 8, lineHeight: 1.4 }}>Click the text on the canvas to select it. Double-click edits content.</div>
                    {(() => {
                      const subKey = focusedField.key;
                      const bag = component.props?.textStyles?.[subKey] || {};
                      const defaults = def?.defaultProps?.textStyles?.[subKey] || {};
                      const getVal = (k, fb) => bag[k] ?? defaults[k] ?? fb;
                      return (
                        <>
                          <div style={{ marginBottom: 10 }}>
                            <label style={labelStyle}>Content</label>
                            <input value={component.props?.[subKey] || ""} onChange={e => store.updateProp(selectedSectionId, component.id, subKey, e.target.value)} placeholder={focusedField.label} style={textInput} />
                          </div>
                          <div style={{ marginBottom: 10 }}><label style={labelStyle}>Font Family</label><select value={getVal("fontFamily","Inter")} onChange={e => store.updateTextStyle(selectedSectionId, component.id, subKey, "fontFamily", e.target.value)} style={{ ...textInput, cursor: "pointer" }}>{FONT_FAMILIES.map(f => <option key={f} value={f}>{f}</option>)}</select></div>
                          <div style={{ marginBottom: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                            <div><label style={labelStyle}>Font Size</label><input type="number" value={getVal("fontSize",14)} onChange={e => { const v=Number(e.target.value); store.updateTextStyle(selectedSectionId, component.id, subKey, "fontSize", Number.isFinite(v)?v:14); }} style={textInput} /></div>
                            <div><label style={labelStyle}>Line Height</label><input type="number" step="0.1" value={getVal("lineHeight",1.4)} onChange={e => { const v=Number(e.target.value); store.updateTextStyle(selectedSectionId, component.id, subKey, "lineHeight", Number.isFinite(v)?v:1.4); }} style={textInput} /></div>
                          </div>
                          <div style={{ marginBottom: 10 }}><label style={labelStyle}>Font Weight</label><select value={String(getVal("fontWeight","400"))} onChange={e => store.updateTextStyle(selectedSectionId, component.id, subKey, "fontWeight", e.target.value)} style={{ ...textInput, cursor: "pointer" }}>{FONT_WEIGHTS.map(w => <option key={w} value={w}>{w}</option>)}</select></div>
                          <div style={{ marginBottom: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                            <div><label style={labelStyle}>Font Style</label><select value={getVal("fontStyle","normal")} onChange={e => store.updateTextStyle(selectedSectionId, component.id, subKey, "fontStyle", e.target.value)} style={{ ...textInput, cursor: "pointer" }}><option value="normal">Normal</option><option value="italic">Italic</option></select></div>
                            <div><label style={labelStyle}>Transform</label><select value={getVal("textTransform","none")} onChange={e => store.updateTextStyle(selectedSectionId, component.id, subKey, "textTransform", e.target.value)} style={{ ...textInput, cursor: "pointer" }}><option value="none">None</option><option value="uppercase">UPPERCASE</option><option value="lowercase">lowercase</option><option value="capitalize">Capitalize</option></select></div>
                          </div>
                          <div style={{ marginBottom: 10 }}><label style={labelStyle}>Letter Spacing (px)</label><input type="number" step="0.5" value={getVal("letterSpacing",0)} onChange={e => { const v=Number(e.target.value); store.updateTextStyle(selectedSectionId, component.id, subKey, "letterSpacing", Number.isFinite(v)?v:0); }} style={textInput} /></div>
                          <div style={{ marginBottom: 4 }}><label style={labelStyle}>Color</label><ColorInput value={getVal("color", "#1C1B1D")} onChange={v => store.updateTextStyle(selectedSectionId, component.id, subKey, "color", v)} /></div>
                          <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
                            <button onClick={() => onSelectComponent?.(selectedSectionId, component.id)} style={{ flex: 1, padding: "6px 0", borderRadius: theme.radius.md, border: `1px solid ${theme.border}`, background: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Back to component</button>
                          </div>
                        </>
                      );
                    })()}
                  </AccPanel>
                )}
                {stylingGroupKeys.length === 0 && !q ? (
                  <div style={{ fontSize: 11, color: theme.textMuted, padding: 16, textAlign: "center" }}>No styling properties for this element.</div>
                ) : stylingGroupKeys.length === 0 && q ? (
                  <div style={{ fontSize: 11, color: theme.textMuted, padding: 16, textAlign: "center" }}>No styling matches &ldquo;{q}&rdquo;.</div>
                ) : stylingGroupKeys.map(gk => (
                  <AccPanel key={gk} id={gk} open={!!stylingOpen[gk]} onToggle={toggleStyling} title={STYLING_GROUP_META[gk].label} icon={STYLING_GROUP_META[gk].icon}>
                    {stylingGroups[gk].map(field => (
                      <FieldEditor key={field.key} field={field} value={component.props?.[field.key]} onChange={(v) => store.updateProp(selectedSectionId, component.id, field.key, v)} focused={focusedField?.key === field.key} onClearProp={onClearProp} screens={Object.values(data.screens).map(s => ({ id: s.id || s.name, name: s.name }))} />
                    ))}
                  </AccPanel>
                ))}
                {/* Spacing — component-level, shown for every component */}
                <AccPanel id="spacing" open={!!stylingOpen.spacing} onToggle={toggleStyling} title="Spacing" icon={ArrowLeftRight}>
                  <div style={{ marginBottom: 10 }}><label style={labelStyle}>Margin (px)</label><SpacingEditor value={component.props?.margin || {}} onChange={v => store.updateProp(selectedSectionId, component.id, "margin", v)} /></div>
                  <div style={{ marginBottom: 4 }}><label style={labelStyle}>Padding (px)</label><SpacingEditor value={component.props?.padding} onChange={v => store.updateProp(selectedSectionId, component.id, "padding", v)} /></div>
                </AccPanel>
                <AccPanel id="effects" open={!!stylingOpen.effects} onToggle={toggleStyling} title="Effects" icon={Sparkles}>
                  <div style={{ marginBottom: 10 }}><label style={labelStyle}>Elevation</label><select value={component.props?.elevation || "none"} onChange={e => store.updateProp(selectedSectionId, component.id, "elevation", e.target.value)} style={{ ...textInput, cursor: "pointer" }}><option value="none">None</option><option value="soft">Soft</option><option value="medium">Medium</option><option value="raised">Raised</option></select></div>
                  <div style={{ marginBottom: 4 }}><label style={labelStyle}>Opacity</label><input type="number" min="0" max="100" value={component.props?.opacity ?? 100} onChange={e => { const n = Number(e.target.value); store.updateProp(selectedSectionId, component.id, "opacity", Number.isFinite(n) ? n : 100); }} style={textInput} /></div>
                </AccPanel>
              </div>
            ) : section ? (
              <div style={{ margin: "-12px -10px 0", borderTop: `1px solid ${theme.borderLight}` }}>
                <AccPanel id="sec-bg" open={stylingOpen["sec-bg"] !== false} onToggle={toggleStyling} title="Background" icon={ImageIcon}>
                  <div style={{ marginBottom: 12 }}><label style={labelStyle}>Background Color</label><ColorInput value={section.backgroundColor || "#FCF8FA"} onChange={v => store.setSectionColor(null, selectedSectionId, v)} /></div>
                  <div style={{ marginBottom: 4 }}>
                    <label style={labelStyle}>Quick Colors</label>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {QUICK_COLORS.map(c => (
                        <div key={c} onClick={() => store.setSectionColor(null, selectedSectionId, c)} style={{ width: 26, height: 26, background: c, borderRadius: "50%", cursor: "pointer", border: section.backgroundColor === c ? `2px solid ${theme.active}` : "2px solid transparent", outline: section.backgroundColor === c ? `2px solid ${theme.active}` : "none", outlineOffset: 2 }} />
                      ))}
                    </div>
                  </div>
                </AccPanel>
                <AccPanel id="sec-screen" open={!!stylingOpen["sec-screen"]} onToggle={toggleStyling} title="Screen Background" icon={Palette}>
                  <ColorInput value={store.screen?.backgroundColor || "#FCF8FA"} onChange={v => store.setScreenBackgroundColor(store.currentScreenId, v)} />
                </AccPanel>
                <AccPanel id="sec-nav" open={!!stylingOpen["sec-nav"]} onToggle={toggleStyling} title="Navigation" icon={Compass}>
                  <div style={{ marginBottom: 10 }}><label style={labelStyle}>Bar Background</label><ColorInput value={navStyle.background || "#FFFFFF"} onChange={v => store.setNavigation({ style: { ...navStyle, background: v } })} /></div>
                  <div style={{ marginBottom: 10 }}><label style={labelStyle}>Active Color</label><ColorInput value={navStyle.active || "#1A1A2E"} onChange={v => store.setNavigation({ style: { ...navStyle, active: v } })} /></div>
                  <div style={{ marginBottom: 4 }}><label style={labelStyle}>Inactive Color</label><ColorInput value={navStyle.inactive || "#9CA3AF"} onChange={v => store.setNavigation({ style: { ...navStyle, inactive: v } })} /></div>
                </AccPanel>
              </div>
            ) : (
              <div style={{ margin: "-12px -10px 0", borderTop: `1px solid ${theme.borderLight}` }}>
                <AccPanel id="none-screen" open={stylingOpen["none-screen"] !== false} onToggle={toggleStyling} title="Screen Background" icon={Palette}>
                  <ColorInput value={store.screen?.backgroundColor || "#FCF8FA"} onChange={v => store.setScreenBackgroundColor(store.currentScreenId, v)} />
                </AccPanel>
                <AccPanel id="none-nav" open={!!stylingOpen["none-nav"]} onToggle={toggleStyling} title="Navigation" icon={Compass}>
                  <div style={{ marginBottom: 10 }}><label style={labelStyle}>Bar Background</label><ColorInput value={navStyle.background || "#FFFFFF"} onChange={v => store.setNavigation({ style: { ...navStyle, background: v } })} /></div>
                  <div style={{ marginBottom: 10 }}><label style={labelStyle}>Active Icon / Label</label><ColorInput value={navStyle.active || "#1A1A2E"} onChange={v => store.setNavigation({ style: { ...navStyle, active: v } })} /></div>
                  <div style={{ marginBottom: 4 }}><label style={labelStyle}>Inactive Icon / Label</label><ColorInput value={navStyle.inactive || "#9CA3AF"} onChange={v => store.setNavigation({ style: { ...navStyle, inactive: v } })} /></div>
                </AccPanel>
                <div style={{ background: theme.hoverAmber, borderRadius: theme.radius.md, padding: 12, margin: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#6B4200", marginBottom: 2 }}>Styling Tip</div>
                  <div style={{ fontSize: 11, color: "#92400E", lineHeight: 1.5 }}>Colors, spacing, and shadows live here. Switch to General to edit content like text and actions.</div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function AccPanel({ id, open, onToggle, title, icon, badge, children }) {
  const { theme } = useEditorTheme();
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
      {icon && <span style={{ display: "flex", alignItems: "center", color: open ? "#6B4200" : theme.textMuted }}><IconRender icon={icon} size={13} /></span>}
        <span style={{ flex: 1, fontSize: 11.5, fontWeight: 700, color: open ? "#6B4200" : theme.text, textTransform: "uppercase", letterSpacing: "0.05em" }}>{title}</span>
        {badge && <span style={{ fontSize: 9, color: theme.textMuted, background: theme.hover, borderRadius: 8, padding: "0 6px" }}>{badge}</span>}
      </button>
      {open && <div style={{ padding: "4px 12px 14px" }}>{children}</div>}
    </div>
  );
}

function TabEditorRow({ tab, screenIds, screens, onUpdate, onRemove, onReorder, isFirst, isLast }) {
  const { theme, textInput } = useEditorTheme();
  const { iconBtn, iconBtnDanger } = useEditorTheme();
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
        <button onClick={() => onReorder("left")} disabled={isFirst} style={iconBtnSmallReStyle(theme, iconBtn)} title="Move up"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg></button>
        <button onClick={() => onReorder("right")} disabled={isLast} style={iconBtnSmallReStyle(theme, iconBtn)} title="Move down"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg></button>
      </div>

      {/* Remove */}
      <button onClick={onRemove} style={iconBtnDanger} title="Delete tab"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>
  );
}

function ColorInputDot({ value, onChange }) {
  const { theme } = useEditorTheme();
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

function iconBtnSmallReStyle(theme, iconBtn){ return { ...iconBtn, padding: "1px", width: 18, height: 18, opacity: 0.9, cursor: "pointer" }; }

/* ── General / Styling tab bar (optional search via lens icon) ── */
function FieldTabBar({ activeTab, onTab, searchOpen, onToggleSearch, query, onQueryChange }) {
  const { theme } = useEditorTheme();
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
  const { theme, textInput, labelStyle } = useEditorTheme();
  const isRadius = field.type === "radius" || /radius/i.test(String(field.key||""));
  return (
    <div key={field.key} style={{ marginBottom: 12, padding: focused ? "8px" : 0, border: focused ? `1.5px solid ${theme.active}` : "none", borderRadius: theme.radius.md, transition: `all ${theme.transition}` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <label style={labelStyle}>{field.label}</label>
        {focused && (
          <button onClick={() => onClearProp?.(field.key)} style={{ fontSize: 10, border: "none", background: "none", color: theme.danger, cursor: "pointer", padding: "0 2px", fontFamily: "'Inter',sans-serif", fontWeight: 600 }}>Remove</button>
        )}
      </div>
      {isRadius ? (
        <RadiusEditor value={value} onChange={onChange} />
      ) : field.type === "list" ? (
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
  const { theme, textInput } = useEditorTheme();
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
  const { theme, textInput } = useEditorTheme();
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

function RadiusEditor({ value, onChange }) {
  const { theme, textInput } = useEditorTheme();
  const isObj = value && typeof value === "object" && !Array.isArray(value);
  const nums = isObj ? {
    tl: Number(value.tl ?? value.topLeft ?? 0),
    tr: Number(value.tr ?? value.topRight ?? 0),
    br: Number(value.br ?? value.bottomRight ?? 0),
    bl: Number(value.bl ?? value.bottomLeft ?? 0),
  } : { tl: Number(value) || 0, tr: Number(value) || 0, br: Number(value) || 0, bl: Number(value) || 0 };
  const linkedInit = !isObj || (nums.tl===nums.tr && nums.tr===nums.br && nums.br===nums.bl);
  const [unlinked, setUnlinked] = useState(!linkedInit);
  useEffect(()=>{ const obj = value && typeof value==="object" && !Array.isArray(value); const n= obj? {tl:Number(value.tl??0),tr:Number(value.tr??0),br:Number(value.br??0),bl:Number(value.bl??0)}: null; const allEqual = obj && n.tl===n.tr && n.tr===n.br && n.br===n.bl; setUnlinked(!!obj && !allEqual); }, [value]);
  const setAll = (n)=> onChange(n);
  const setCorner = (k, n)=> {
    const base = isObj ? { tl: nums.tl, tr: nums.tr, br: nums.br, bl: nums.bl } : { tl: Number(value)||0, tr: Number(value)||0, br: Number(value)||0, bl: Number(value)||0 };
    onChange({ ...base, [k]: n });
  };
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 10, color: theme.textMuted }}>{unlinked ? "Independent corners" : "All corners"}</span>
        <button onClick={()=>{
          if(unlinked){
            const avg = Math.round((nums.tl+nums.tr+nums.br+nums.bl)/4);
            setUnlinked(false); onChange(avg);
          } else {
            const n = Number(value)||0;
            setUnlinked(true); onChange({ tl:n, tr:n, br:n, bl:n });
          }
        }} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 6, border: `1px solid ${theme.border}`, background: unlinked? theme.hoverAmber: theme.surface, color: unlinked? "#6B4200": theme.textSecondary, cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
          {unlinked ? <><Link size={11} /> Linked</> : <><Unlink size={11} /> Split</>}
        </button>
      </div>
      {unlinked ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          {[
            { k:"tl", label:"Top Left" }, { k:"tr", label:"Top Right" },
            { k:"bl", label:"Bottom Left" }, { k:"br", label:"Bottom Right" },
          ].map(({k,label})=>(
            <div key={k}>
              <div style={{ fontSize: 9, color: theme.textMuted, marginBottom: 2 }}>{label}</div>
              <input type="number" min="0" value={nums[k]} onChange={e=>{ const n=Number(e.target.value); setCorner(k, Number.isFinite(n)&&n>=0? n:0); }} style={{ ...textInput, textAlign:"center", padding:"5px 2px" }} />
            </div>
          ))}
        </div>
      ) : (
        <input type="number" min="0" value={Number(value)||0} onChange={e=>{ const n=Number(e.target.value); setAll(Number.isFinite(n)&&n>=0? n:0); }} style={textInput} />
      )}
    </div>
  );
}

function ImageUploader({ currentSrc, onUpload }) {
  const { theme, textInput, labelStyle } = useEditorTheme();
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
  const { theme } = useEditorTheme();
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
  const { theme, textInput } = useEditorTheme();
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
  const { theme, textInput, labelStyle, iconBtn, iconBtnDanger } = useEditorTheme();
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
