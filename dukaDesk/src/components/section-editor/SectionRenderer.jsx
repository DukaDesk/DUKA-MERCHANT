import { useState, useRef, useCallback } from "react";
import { getComponentType, getAllComponentTypes, resolveBackground, ROW_TEMPLATES, applyTextStyle, resolveTextStyle, getLucideIcon } from "../canvas-editor/componentTypes";
import { useEditorTheme } from "./editorTheme.jsx";
import { toast } from "react-toastify";

const TIME = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

function sanitizeNum(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function sanitizeRadius(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

export default function SectionRenderer({ store, selectedSectionId, selectedComponentId, onSelectSection, onSelectComponent, onFocusSubElement, focusSubKey }) {
  const { theme, iconBtn, iconBtnDanger } = useEditorTheme();
  const data = store.data;
  const screen = store.screen;
  const [dragOverSectionId, setDragOverSectionId] = useState(null);
  const [hoveredSectionId, setHoveredSectionId] = useState(null);
  const [hoveredCompId, setHoveredCompId] = useState(null);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editingCompId, setEditingCompId] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [showBgPicker, setShowBgPicker] = useState(null);
  const [addPicker, setAddPicker] = useState(null);
  const editRef = useRef(null);

  if (!screen) return null;

  const bodySections = screen.bodySections || [];
  const logo = data.meta?.logo;
  const appName = data.meta?.appName || "Your App";
  const screenBg = screen.backgroundColor || "#FCF8FA";

  const allSections = bodySections.map(sec => {
    const resolved = store.resolveSection?.(sec) || sec;
    return {
      ...sec,
      name: sec.name || resolved.name || sec.type,
      type: resolved.type || sec.type,
      backgroundColor: resolved.backgroundColor || sec.backgroundColor,
      components: resolved.components || [],
      _label: sec.name || resolved.name || sec.type,
      _link: sec.kind === "saved" && !!sec.libraryId,
    };
  });

  const handleDragStart = (e, sectionId) => {
    e.dataTransfer.setData("sectionId", sectionId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, sectionId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverSectionId(sectionId);
  };

  const handleDragLeave = (sectionId) => {
    setDragOverSectionId(prev => prev === sectionId ? null : prev);
  };

  const handleDrop = (e, targetSectionId) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("sectionId");
    setDragOverSectionId(null);
    if (!draggedId || draggedId === targetSectionId) return;
    const fromIdx = bodySections.findIndex(s => s.id === draggedId);
    const toIdx = bodySections.findIndex(s => s.id === targetSectionId);
    if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return;
    for (let i = 0; i < Math.abs(fromIdx - toIdx); i++) {
      store.reorderBodySection(null, draggedId, fromIdx < toIdx ? "down" : "up");
    }
  };

  const handleDragEnd = () => {
    setDragOverSectionId(null);
  };

  /* ── Inline editing ── */
  const startEditing = (sectionId, compId, field, currentValue) => {
    setEditingSectionId(sectionId);
    setEditingCompId(compId);
    setEditingField(field);
    setEditValue(currentValue || "");
    setTimeout(() => editRef.current?.focus(), 10);
  };

  const finishEditing = () => {
    if (editingSectionId && editingCompId && editingField) {
      store.updateProp(editingSectionId, editingCompId, editingField, editValue);
    }
    setEditingSectionId(null);
    setEditingCompId(null);
    setEditingField(null);
    setEditValue("");
  };

  /* ── Image upload on canvas ── */
  const imageFileRef = useRef(null);
  const [imageTarget, setImageTarget] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file || !imageTarget) return;
    if (file.size > 5 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      store.updateProp(imageTarget.sectionId, imageTarget.compId, "src", ev.target.result);
      setImageTarget(null);
    };
    reader.readAsDataURL(file);
  };

  const triggerImageUpload = (sectionId, compId) => {
    setImageTarget({ sectionId, compId });
    setTimeout(() => imageFileRef.current?.click(), 10);
  };

  /* ── Background color quick pick ── */
  const QUICK_COLORS = ["#FCF8FA", "#1A1A2E", "#F4A026", "#2ECC71", "#E74C3C", "#7C3AED", "#0D9488", "#EA580C", "#EC4899", "#000000"];

  const handleBgColorChange = (sectionId, color) => {
    const sec = bodySections.find(s => s.id === sectionId);
    if (sec) {
      store.setSectionColor(null, sectionId, color);
    }
  };

  const isSubFocused = (compId, subKey) => focusSubKey?.compId === compId && focusSubKey?.key === subKey;
  const handleSubClick = (e, sectionId, compId, subKey) => {
    e.stopPropagation();
    onSelectComponent(sectionId, compId);
    onFocusSubElement?.(sectionId, compId, subKey);
  };
  const subTextStyle = (comp, subKey, fallback) => applyTextStyle(resolveTextStyle(comp.props || {}, subKey, fallback));
  const subFocusStyle = (compId, subKey) => isSubFocused(compId, subKey) ? { outline: `1.5px dashed ${theme.selection}`, outlineOffset: 1, borderRadius: 3 } : {};

  const renderInlineText = (comp, field, value, sectionId, extraStyle) => {
    const focused = isSubFocused(comp.id, field);
    if (editingCompId === comp.id && editingField === field) {
      return (
        <input
          ref={editRef}
          value={editValue}
          onChange={e => setEditValue(e.target.value)}
          onBlur={finishEditing}
          onKeyDown={e => { if (e.key === "Enter") finishEditing(); if (e.key === "Escape") { setEditingCompId(null); setEditingField(null); } }}
          onClick={e => e.stopPropagation()}
          style={{
            background: "transparent", border: `1.5px dashed ${theme.selection}`, borderRadius: 3,
            padding: "2px 4px", fontSize: "inherit", fontWeight: "inherit",
            color: "inherit", fontFamily: "inherit", textAlign: "inherit",
            outline: "none", width: "100%", boxSizing: "border-box",
            ...extraStyle,
          }}
        />
      );
    }
    return (
      <span
        onClick={(e) => handleSubClick(e, sectionId, comp.id, field)}
        onDoubleClick={(e) => { e.stopPropagation(); startEditing(sectionId, comp.id, field, value); }}
        title="Click to select & style this text — double-click to edit content"
        style={{ cursor: "text", minHeight: 16, display: "inline-block", borderRadius: 2, padding: "0 2px", ...extraStyle, ...subFocusStyle(comp.id, field), ...(focused ? { background: "rgba(244,160,38,0.12)" } : {}) }}
      >{value}</span>
    );
  };

  /* Recursively render a component. Containers (carousel, nested_section) embed their children inline. */
  const renderComponent = (comp, sectionId, depth) => {
    const def = getComponentType(comp.type);
    if (!def) return null;
    const isSelected = selectedComponentId === comp.id;
    const children = comp.children || [];
    const isContainer = def.container === true;
    void isContainer;

    let rendered;
    if (comp.type === "text_block") {
      const val = comp.props?.text || "";
      const tbStyle = {
        fontSize: comp.props?.fontSize || 14,
        fontWeight: comp.props?.fontWeight || 400,
        fontStyle: comp.props?.fontStyle || "normal",
        fontFamily: comp.props?.fontFamily ? `'${comp.props.fontFamily}',sans-serif` : "'Inter',sans-serif",
        color: comp.props?.color || "#1C1B1D",
        textAlign: comp.props?.alignment || "left",
        lineHeight: comp.props?.lineHeight != null ? Number(comp.props.lineHeight) : 1.4,
        letterSpacing: comp.props?.letterSpacing != null ? `${Number(comp.props.letterSpacing)}px` : "normal",
        textTransform: comp.props?.textTransform && comp.props.textTransform !== "none" ? comp.props.textTransform : "none",
      };
      const tbFocused = isSubFocused(comp.id, "text");
      rendered = (
        <div style={{ ...tbStyle, padding: "2px 16px", cursor: "text", ...(tbFocused ? { outline: `1.5px dashed ${theme.selection}`, outlineOffset: 1, borderRadius: 4, background: "rgba(244,160,38,0.08)" } : {}) }} onClick={(e) => handleSubClick(e, sectionId, comp.id, "text")}>
          {renderInlineText(comp, "text", val, sectionId)}
        </div>
      );
    } else if (comp.type === "hero_banner") {
      const p = comp.props || {};
      const fit = p.fit === "contain" ? "contain" : "cover";
      const radius = sanitizeRadius(p.radius, 16);
      const height = sanitizeNum(p.height, 200);
      const variant = p.variant || "center";
      const fillVal = p.fill;
      const bgImage = fillVal && typeof fillVal === "object" && fillVal.type === "image"
        ? fillVal.value
        : (typeof fillVal === "string" ? fillVal : (p.backgroundImage || ""));
      const isImageBg = !!bgImage;
      const splitImage = variant === "split" && isImageBg;
      const overlay = variant === "overlay" && isImageBg;
      const flex = (variant === "left" || variant === "overlay")
        ? { textAlign: "left", alignItems: "flex-start" }
        : { textAlign: "center", alignItems: "center" };
      const background = splitImage
        ? `linear-gradient(135deg, ${p.color || "#1A1A2E"}, #15152A)`
        : (isImageBg
          ? `url(${bgImage}) center/${fit} no-repeat`
          : `linear-gradient(135deg, ${p.color || "#1A1A2E"}, #15152A)`);
      rendered = (
        <div style={{
          background, color: "#fff", borderRadius: radius, minHeight: height,
          padding: splitImage ? 0 : 32, display: "flex", flexDirection: "column",
          justifyContent: "center", alignItems: flex.alignItems || "center",
          textAlign: flex.textAlign, position: "relative", overflow: "hidden",
          backgroundSize: "cover",
        }}>
          {splitImage && (
            <img src={bgImage} alt="" style={{
              position: "absolute", right: 0, top: 0, bottom: 0,
              width: "42%", height: "100%", objectFit: fit,
            }} />
          )}
          {overlay && (
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(10,10,20,0.1) 0%,rgba(10,10,20,0.7) 100%)" }} />
          )}
          <div style={{ position: "relative", zIndex: 1, maxWidth: splitImage ? "58%" : "100%" }}>
            {!!p.badge && (
              <span style={{ ...subTextStyle(comp, "badge", { fontFamily: "Inter", fontSize: 11, fontWeight: "600", fontStyle: "normal", lineHeight: 1.2, letterSpacing: 0, textTransform: "none", color: "#6B4200" }), background: theme.active, padding: "4px 12px", borderRadius: 20, marginBottom: 12, display: "inline-block", ...subFocusStyle(comp.id, "badge"), ...(isSubFocused(comp.id, "badge") ? { background: "#F4A026", boxShadow: `0 0 0 1.5px ${theme.selection}` } : { background: "#F4A026" }) }}>
                {renderInlineText(comp, "badge", p.badge, sectionId, subTextStyle(comp, "badge", { fontFamily: "Inter", fontSize: 11, fontWeight: "600", fontStyle: "normal", lineHeight: 1.2, letterSpacing: 0, textTransform: "none", color: "#6B4200" }))}
              </span>
            )}
            <div style={{ ...subTextStyle(comp, "title", { fontFamily: "Sora", fontSize: 22, fontWeight: "700", fontStyle: "normal", lineHeight: 1.2, letterSpacing: 0, textTransform: "none", color: "#FFFFFF" }), marginBottom: 4, ...subFocusStyle(comp.id, "title") }}>
              {renderInlineText(comp, "title", p.title || "Welcome", sectionId, subTextStyle(comp, "title", { fontFamily: "Sora", fontSize: 22, fontWeight: "700", fontStyle: "normal", lineHeight: 1.2, letterSpacing: 0, textTransform: "none", color: "#FFFFFF" }))}
            </div>
            {p.subtitle && (
              <div style={{ ...subTextStyle(comp, "subtitle", { fontFamily: "Inter", fontSize: 13, fontWeight: "400", fontStyle: "normal", lineHeight: 1.4, letterSpacing: 0, textTransform: "none", color: "#FFFFFF" }), opacity: 0.8, ...subFocusStyle(comp.id, "subtitle") }}>
                {renderInlineText(comp, "subtitle", p.subtitle, sectionId, subTextStyle(comp, "subtitle", { fontFamily: "Inter", fontSize: 13, fontWeight: "400", fontStyle: "normal", lineHeight: 1.4, letterSpacing: 0, textTransform: "none", color: "#FFFFFF" }))}
              </div>
            )}
          </div>
        </div>
      );
    } else if (comp.type === "menu_item") {
      rendered = (
        <div style={{ display: "flex", gap: 12, padding: "12px 16px", background: "#FCF8FA", borderRadius: 12, boxShadow: "0px 2px 12px rgba(0,0,0,0.08)", border: "1px solid rgba(200,197,205,0.3)", alignItems: "center", margin: "0 4px" }}>
          <div style={{ width: 48, height: 48, background: "#F1EDEF", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{comp.props?.emoji || "\uD83C\uDF7D\uFE0F"}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ ...subTextStyle(comp, "name", { fontFamily: "Inter", fontSize: 14, fontWeight: "600", fontStyle: "normal", lineHeight: 1.3, letterSpacing: 0, textTransform: "none", color: theme.text }), marginBottom: 2, ...subFocusStyle(comp.id, "name") }}>
              {renderInlineText(comp, "name", comp.props?.name || "", sectionId, subTextStyle(comp, "name", { fontFamily: "Inter", fontSize: 14, fontWeight: "600", fontStyle: "normal", lineHeight: 1.3, letterSpacing: 0, textTransform: "none", color: theme.text }))}
            </div>
            {comp.props?.desc && <div style={{ ...subTextStyle(comp, "desc", { fontFamily: "Inter", fontSize: 11, fontWeight: "400", fontStyle: "normal", lineHeight: 1.3, letterSpacing: 0, textTransform: "none", color: theme.textSecondary }), ...subFocusStyle(comp.id, "desc") }}>
              {renderInlineText(comp, "desc", comp.props?.desc, sectionId, subTextStyle(comp, "desc", { fontFamily: "Inter", fontSize: 11, fontWeight: "400", fontStyle: "normal", lineHeight: 1.3, letterSpacing: 0, textTransform: "none", color: theme.textSecondary }))}
            </div>}
          </div>
          <span style={{ ...subTextStyle(comp, "price", { fontFamily: "Sora", fontSize: 14, fontWeight: "700", fontStyle: "normal", lineHeight: 1.2, letterSpacing: 0, textTransform: "none", color: "#1A1A2E" }), whiteSpace: "nowrap", ...subFocusStyle(comp.id, "price") }}>
            {renderInlineText(comp, "price", comp.props?.price || "", sectionId, subTextStyle(comp, "price", { fontFamily: "Sora", fontSize: 14, fontWeight: "700", fontStyle: "normal", lineHeight: 1.2, letterSpacing: 0, textTransform: "none", color: "#1A1A2E" }))}
          </span>
        </div>
      );
    } else if (comp.type === "image_block") {
      rendered = (
        <div style={{ position: "relative", margin: "4px 8px", borderRadius: 8, overflow: "hidden", minHeight: 80, background: "#F1EDEF", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {comp.props?.src ? (
            <img src={comp.props.src} alt={comp.props?.alt || ""} style={{ width: "100%", height: "auto", display: "block", objectFit: comp.props?.fit || "cover" }} />
          ) : (
            <span style={{ color: theme.textMuted, fontSize: 12 }}>No image</span>
          )}
          {(hoveredCompId === comp.id || selectedComponentId === comp.id) && (
            <div style={{ position: "absolute", top: 4, right: 4, zIndex: 5 }}>
              <button onClick={(e) => { e.stopPropagation(); triggerImageUpload(sectionId, comp.id); }}
                style={{ ...iconBtn, padding: "3px 8px", fontSize: 11, gap: 3 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                {comp.props?.src ? "Change" : "Upload"}
              </button>
            </div>
          )}
        </div>
      );
    } else if (comp.type === "button") {
      const p = comp.props || {};
      const variant = p.variant || "filled";
      const accent = p.background || "#1A1A2E";
      const filled = variant === "filled";
      const outlined = variant === "outline";
      const lblStyle = subTextStyle(comp, "label", { fontFamily: "Inter", fontSize: 14, fontWeight: "600", fontStyle: "normal", lineHeight: 1.25, letterSpacing: 0, textTransform: "none", color: p.color || (filled ? "#FFFFFF" : "#1C1B1D") });
      rendered = (
        <div style={{ padding: "8px 16px", textAlign: "center" }}>
          <div style={{
            display: "inline-block", padding: "10px 24px",
            borderRadius: p.radius != null ? Number(p.radius) : 10,
            background: filled ? accent : "transparent",
            border: outlined ? `1.5px solid ${accent}` : "none",
            ...lblStyle,
            ...subFocusStyle(comp.id, "label"),
          }}>
            {renderInlineText(comp, "label", p.label || "Button", sectionId, lblStyle)}
          </div>
        </div>
      );
    } else if (comp.type === "nested_section") {
      const bg = comp.props?.backgroundColor || "#ffffff";
      rendered = (
        <div style={{ background: bg, margin: "6px 8px", borderRadius: 14, padding: 8, border: "1.5px dashed rgba(120,110,180,0.4)", position: "relative" }}>
          {comp.props?.name && (
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.5px", color: "#8B7FC8", textTransform: "uppercase", padding: "2px 6px 6px", fontFamily: "'Inter',sans-serif" }}>
              {comp.props.name}
            </div>
          )}
          {children.length === 0 && (
            <div style={{ padding: "14px 8px", textAlign: "center", color: theme.textMuted, fontSize: 11 }}>
              Nested section — add components to it from Properties
            </div>
          )}
          {renderComponentList(children, sectionId, depth + 1)}
        </div>
      );
    } else if (comp.type === "carousel") {
      rendered = (
        <div style={{ margin: "4px 8px", borderRadius: 14, overflow: "hidden", border: "1.5px dashed rgba(120,110,180,0.4)", background: "rgba(243,240,246,0.6)", position: "relative" }}>
          <div style={{ position: "absolute", top: 6, left: 8, zIndex: 2, fontSize: 9, fontWeight: 700, letterSpacing: "0.5px", color: "#6B7280", background: "rgba(255,255,255,0.9)", padding: "2px 7px", borderRadius: 10, fontFamily: "'Inter',sans-serif" }}>
            Carousel
          </div>
          {children.length === 0 && (
            <div style={{ padding: "26px 8px", textAlign: "center", color: theme.textMuted, fontSize: 11 }}>
              Add slides — each component below renders as one slide
            </div>
          )}
          <div style={{ display: "flex", gap: 8, padding: "10px", overflowX: "auto" }}>
            {children.map((child) => (
              <div key={child.id} style={{ minWidth: "20%", flexShrink: 0, background: "rgba(255,255,255,0.9)", borderRadius: 10, padding: 4, border: "1px solid rgba(200,197,205,0.4)" }}>
                {renderComponent(child, sectionId, depth + 1)}
              </div>
            ))}
          </div>
          {children.length > 0 && (
            <div style={{ display: "flex", justifyContent: "center", gap: 5, padding: "8px 0 10px" }}>
              {children.map((cd, i) => (
                <span key={cd.id} style={{ width: 7, height: 7, borderRadius: "50%", background: i === 0 ? "#1A1A2E" : "#C9C6CF", display: "inline-block" }} />
              ))}
            </div>
          )}
        </div>
      );
    } else if (comp.type === "row") {
      const rp = comp.props || {};
      const cols = ROW_TEMPLATES[rp.template] || [1];
      const N = cols.length;
      const gap = rp.gap != null ? Number(rp.gap) : 10;
      const rowPad = rp.padding != null ? Number(rp.padding) : 10;
      const rowRadius = rp.radius != null ? Number(rp.radius) : 12;
      const rowBg = resolveBackground(rp.background, "transparent");
      const colCss = cols.map(c => `${c}fr`).join(" ");
      const slotRows = Math.max(1, Math.ceil((children.length + 1) / N));
      const pickerOpen = addPicker?.compId === comp.id;

      const addCell = (index) => (
        <div
          key={`add_${index}`}
          onClick={(e) => {
            e.stopPropagation();
            setAddPicker(pickerOpen && addPicker.index === index ? null : { compId: comp.id, index });
          }}
          style={{
            minHeight: 46, border: "1.5px dashed rgba(140,130,190,0.55)", borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#8B7FC8", cursor: "pointer", background: "rgba(140,130,190,0.06)",
            fontFamily: "'Inter',sans-serif", fontSize: 10, fontWeight: 600, gap: 5,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(140,130,190,0.15)"; e.currentTarget.style.color = "#5D4FC0"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(140,130,190,0.06)"; e.currentTarget.style.color = "#8B7FC8"; }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          <span>Add</span>
        </div>
      );

      rendered = (
        <div style={{
          background: rowBg, borderRadius: rowRadius, padding: rowPad,
          margin: "4px 8px", display: "flex", flexDirection: "column", gap,
          position: "relative", border: "1.5px dashed rgba(140,130,190,0.4)",
        }}>
          {Array.from({ length: slotRows }).map((_, r) => {
            const start = r * N;
            return (
              <div key={r} style={{ display: "grid", gridTemplateColumns: N === 1 ? "1fr" : colCss, gap }}>
                {Array.from({ length: N }).map((_, c) => {
                  const index = start + c;
                  if (index < children.length) return renderComponent(children[index], sectionId, depth + 1);
                  return addCell(index);
                })}
              </div>
            );
          })}

          {pickerOpen && (
            <>
              <div style={{ position: "fixed", inset: 0, zIndex: 38 }} onClick={() => setAddPicker(null)} />
              <div style={{
                position: "absolute", top: 12, left: 8, right: 8, zIndex: 42,
                background: "#FFFFFF", borderRadius: 12, boxShadow: "0 16px 44px rgba(26,26,46,0.22)",
                border: "1px solid #E5E1E3", padding: 9, maxHeight: 320, overflowY: "auto",
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.5px", padding: "0 6px 8px", fontFamily: "'Inter',sans-serif" }}>
                  Add to row
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                  {getAllComponentTypes().map(def2 => (
                    <button
                      key={def2.type}
                      onClick={(e) => {
                        e.stopPropagation();
                        store.insertComponentAt(sectionId, comp.id, addPicker.index, def2.type, { ...def2.defaultProps });
                        setAddPicker(null);
                      }}
                      style={{
                        padding: "7px 3px", borderRadius: 8, border: "1px solid #E5E1E3", background: "#fff",
                        cursor: "pointer", textAlign: "center", fontSize: 9, fontWeight: 600, color: "#6B7280",
                        fontFamily: "'Inter',sans-serif", transition: "all 0.12s", lineHeight: 1.15,
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = theme.active; e.currentTarget.style.background = theme.hoverAmber; e.currentTarget.style.color = "#5B3A00"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E1E3"; e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#6B7280"; }}
                    >
                      <div style={{ fontSize: 14, marginBottom: 2 }}>{def2.icon || "▣"}</div>
                      <div>{def2.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      );
    } else if (comp.type === "tabs") {
      const p = comp.props || {};
      const tabItems = Array.isArray(p.items) ? p.items : [];
      const bar = (border) => (
        <div style={{ display: "flex", background: "#fff", ...border }}>
          {tabItems.length === 0 && <div style={{ flex: 1, textAlign: "center", padding: "10px 4px", color: "#9CA3AF", fontSize: 11 }}>No tabs</div>}
          {tabItems.map((it, i) => {
            const Glyph = getLucideIcon(it.icon);
            const isActive = i === 0;
            return (
              <div
                key={i}
                onClick={(e) => { e.stopPropagation(); if (it.screenId) store.setCurrentScreenId(it.screenId); }}
                style={{
                  flex: 1, padding: "8px 4px", textAlign: "center", cursor: it.screenId ? "pointer" : "default",
                  fontSize: 11, color: isActive ? "#B45309" : "#6B7280",
                  borderTop: isActive ? "2px solid #F4A026" : "2px solid transparent",
                }}
              >
                {Glyph ? <div style={{ display: "flex", justifyContent: "center", marginBottom: 2 }}><Glyph size={18} /></div> : null}
                <div>{it.label || `Tab ${i + 1}`}</div>
              </div>
            );
          })}
        </div>
      );
      rendered = p.position === "bottom" ? bar({ borderTop: "1px solid #E5E1E3" }) : bar({ borderBottom: "1px solid #E5E1E3" });
    } else {
      rendered = def.render({
        ...comp.props,
        ...(comp.type === "header_bar" ? { logo: logo || comp.props?.logo, appName: appName || comp.props?.appName } : {}),
      });
    }

    const margin = comp.props?.margin || {};
    const padding = comp.props?.padding || {};
    const ELEVATIONS = {
      none: "none",
      soft: "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
      medium: "0 4px 10px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)",
      raised: "0 10px 24px rgba(0,0,0,0.18), 0 4px 8px rgba(0,0,0,0.1)",
    };
    const elevation = ELEVATIONS[comp.props?.elevation] || "none";
    const compOpacity = comp.props?.opacity != null ? Number(comp.props.opacity) / 100 : 1;

    const outerW = comp.props?.width != null && Number(comp.props.width) > 0 ? Number(comp.props.width) : "100%";
    const outerH = comp.props?.height != null && Number(comp.props.height) > 0 ? Number(comp.props.height) : undefined;
    return (
      <div
        key={comp.id}
        onClick={(e) => { e.stopPropagation(); onSelectComponent(sectionId, comp.id); }}
        onMouseEnter={() => setHoveredCompId(comp.id)}
        onMouseLeave={() => setHoveredCompId(null)}
        style={{
          width: outerW,
          height: outerH,
          opacity: comp.visible === false ? 0.4 : compOpacity,
          position: "relative",
          outline: isSelected ? `2px solid ${theme.selection}` : "none",
          outlineOffset: -1,
          marginTop: margin.top || 0,
          marginRight: margin.right || 0,
          marginBottom: margin.bottom || 0,
          marginLeft: margin.left || 0,
          paddingTop: padding.top || 0,
          paddingRight: padding.right || 0,
          paddingBottom: padding.bottom || 0,
          paddingLeft: padding.left || 0,
          boxShadow: elevation,
          boxSizing: "border-box",
          overflow: outerH ? "hidden" : undefined,
        }}
      >
        {rendered}

        {/* Component floating toolbar */}
        {(hoveredCompId === comp.id || isSelected) && (
          <div style={{ position: "absolute", top: 2, right: 2, zIndex: 15, display: "flex", gap: 2 }}>
            <button
              onClick={(e) => { e.stopPropagation(); store.duplicateComponentInSection(sectionId, comp.id); }}
              style={iconBtn} title="Duplicate"
            ><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>
            <button
              onClick={(e) => { e.stopPropagation(); store.removeComponentFromSection(sectionId, comp.id); }}
              style={iconBtnDanger} title="Delete"
            ><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
          </div>
        )}
      </div>
    );
  };

  const renderComponentList = (list, sectionId, depth) => (
    list.map(comp => renderComponent(comp, sectionId, depth))
  );

  return (
    <div style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "24px 16px", overflow: "auto", background: theme.canvas }}>
      <div style={{
        width: 390, minHeight: 700,
        background: screenBg,
        borderRadius: theme.radius["2xl"], overflow: "hidden",
        boxShadow: theme.shadowCanvas,
        display: "flex", flexDirection: "column", position: "relative",
      }}>
        {/* Status bar */}
        <div style={{
          height: 28, background: "#1a1a2e", display: "flex",
          alignItems: "center", justifyContent: "space-between",
          padding: "0 20px", flexShrink: 0, color: "#fff", fontSize: 11,
          fontFamily: "'Inter',sans-serif", fontWeight: 600,
        }}>
          <span>{TIME}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <svg width="14" height="10" viewBox="0 0 14 10"><rect x="0.5" y="0.5" width="11" height="9" rx="1.5" fill="none" stroke="#fff" strokeOpacity="0.6"/><rect x="12" y="3" width="1.5" height="4" rx="0.5" fill="#fff" fillOpacity="0.6"/><rect x="2" y="2" width="3" height="6" rx="0.5" fill="#2ECC71"/><rect x="5.5" y="2" width="3" height="6" rx="0.5" fill="#2ECC71"/><rect x="9" y="2" width="2" height="6" rx="0.5" fill="#2ECC71"/></svg>
          </div>
        </div>

        {/* Sections */}
        {allSections.map((section, si) => (
          <div
            key={section.id}
            draggable
            onDragStart={(e) => handleDragStart(e, section.id)}
            onDragOver={(e) => handleDragOver(e, section.id)}
            onDragLeave={() => handleDragLeave(section.id)}
            onDrop={(e) => handleDrop(e, section.id)}
            onDragEnd={handleDragEnd}
            onMouseEnter={() => setHoveredSectionId(section.id)}
            onMouseLeave={() => { setHoveredSectionId(null); setHoveredCompId(null); setShowBgPicker(null); }}
            onClick={() => onSelectSection(section.id)}
            style={{
              background: section.backgroundColor || screenBg,
              borderBottom: "1px solid rgba(200,197,205,0.15)",
              cursor: "pointer",
              position: "relative",
              opacity: section.visible === false ? 0.4 : 1,
              outline: selectedSectionId === section.id ? `2px solid ${theme.active}` : dragOverSectionId === section.id ? `2px dashed ${theme.active}` : "none",
              outlineOffset: -2,
              transition: "outline 0.12s",
              minHeight: section.components?.length ? undefined : 48,
            }}
          >
            {/* Floating toolbar (actions only when the section is selected) */}
            {selectedSectionId === section.id && (
              <div style={{
                position: "absolute", top: 4, right: 4, zIndex: 20,
                display: "flex", gap: 2,
                animation: "fadeIn 0.12s ease",
              }}>
                <span style={{
                  background: theme.active,
                  color: "#6B4200",
                  fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4,
                  fontFamily: "'Inter',sans-serif", marginRight: 4, display: "flex", alignItems: "center", gap: 3,
                }}>
                  {section._label}
                  {section._link && (
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                  )}
                </span>
                {section._link && (
                  <button
                    onClick={(e) => { e.stopPropagation(); store.detachSection(null, section.id); toast.success("Section detached from library"); }}
                    style={{ ...iconBtn, background: "#EEF4FF", color: "#3B6FE0" }} title="Detach from library"
                  ><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></button>
                )}
                {!section._link && (
                  <button
                    onClick={(e) => { e.stopPropagation(); store.saveSectionToLibrary(null, section.id); toast.success("Section saved to library"); }}
                    style={iconBtn} title="Save to library"
                  ><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg></button>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); store.duplicateSection(null, section.id); }}
                  style={iconBtn} title="Duplicate"
                ><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>
                <button
                  onClick={(e) => { e.stopPropagation(); store.removeBodySection(null, section.id); onSelectSection(null); }}
                  style={iconBtnDanger} title="Delete"
                    ><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
              </div>
            )}

            {/* Background color quick pick (on hover) */}
            {hoveredSectionId === section.id && (
              <div style={{
                position: "absolute", bottom: 4, right: 4, zIndex: 15,
                display: "flex", gap: 2, padding: 3, background: "rgba(255,255,255,0.9)",
                borderRadius: theme.radius.sm, border: `1px solid ${theme.border}`,
                boxShadow: theme.shadowMd,
              }}
                onClick={e => e.stopPropagation()}
              >
                {QUICK_COLORS.slice(0, 5).map(c => (
                  <div key={c} onClick={() => handleBgColorChange(section.id, c)}
                    style={{
                      width: 14, height: 14, background: c, borderRadius: "50%", cursor: "pointer",
                      border: section.backgroundColor === c ? `2px solid ${theme.active}` : "1px solid rgba(0,0,0,0.1)",
                      transition: `transform ${theme.transition}`,
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.2)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                  />
                ))}
              </div>
            )}

            {/* Components (recursive: containers nest child components/sections) */}
            {renderComponentList(section.components || [], section.id, 0)}

            {/* Empty section hint */}
            {(!section.components || section.components.length === 0) && (
              <div style={{ padding: "28px 16px", textAlign: "center", color: theme.textMuted }}>
                <div style={{ fontSize: 22, marginBottom: 6, opacity: 0.6 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                </div>
                <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 2 }}>Add components from the right panel</div>
                <div style={{ fontSize: 11, color: theme.border }}>Open \u201CAdd Component\u201D in Properties</div>
              </div>
            )}
          </div>
        ))}

        {/* Bottom nav bar */}
        {(data.navigation?.tabs || []).length > 0 && (
          <div style={{
            position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 12,
            background: data.navigation?.style?.background || "#FFFFFF",
            borderTop: `1px solid ${theme.border}`,
            display: "flex", alignItems: "stretch", justifyContent: "space-around",
            flexShrink: 0, padding: "4px 0 6px",
            boxShadow: "0 -2px 10px rgba(0,0,0,0.05)",
          }}>
            {data.navigation.tabs.map(tab => {
              const isActive = tab.screenId === store.currentScreenId;
              const color = isActive
                ? (tab.color || data.navigation?.style?.active || "#1A1A2E")
                : (data.navigation?.style?.inactive || "#9CA3AF");
              return (
                <div key={tab.id} style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                  padding: "2px 14px", color,
                }}>
                  <span style={{ fontSize: 19, lineHeight: 1, opacity: isActive ? 1 : 0.65 }}>{tab.icon || "\u25CB"}</span>
                  <span style={{ fontSize: 9, fontWeight: isActive ? 700 : 500, color, fontFamily: "'Inter',sans-serif" }}>{tab.label || "Tab"}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom spacer for nav */}
        {data.navigation?.tabs?.length > 0 && <div style={{ height: 56, flexShrink: 0 }} />}
      </div>

      {/* Hidden file inputs */}
      <input ref={imageFileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
    </div>
  );
}
