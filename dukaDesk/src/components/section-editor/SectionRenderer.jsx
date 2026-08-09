import { useState, useRef, useCallback } from "react";
import { getComponentType } from "../canvas-editor/componentTypes";
import { theme, iconBtn, iconBtnDanger } from "./editorTheme";
import { toast } from "react-toastify";

const TIME = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function SectionRenderer({ store, selectedSectionId, selectedComponentId, onSelectSection, onSelectComponent }) {
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
  const editRef = useRef(null);
  const logoRef = useRef(null);

  if (!screen) return null;

  const bodySections = screen.bodySections || [];
  const logo = data.meta?.logo;
  const appName = data.meta?.appName || "Your App";
  const tagline = data.meta?.tagline || "";
  const screenBg = screen.backgroundColor || "#FCF8FA";

  const handleLogoUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      store.setMeta({ logo: ev.target.result });
    };
    reader.readAsDataURL(file);
  }, [store]);

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

  const renderInlineText = (comp, field, value, sectionId) => {
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
          }}
        />
      );
    }
    return (
      <span
        onDoubleClick={(e) => { e.stopPropagation(); startEditing(sectionId, comp.id, field, value); }}
        style={{ cursor: "text", minHeight: 16, display: "inline-block" }}
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
      rendered = (
        <div style={{
          fontSize: comp.props?.fontSize || 14, fontWeight: comp.props?.fontWeight || 400,
          color: comp.props?.color || "#1C1B1D", textAlign: comp.props?.alignment || "left",
          fontFamily: "'Inter',sans-serif", padding: "2px 16px", lineHeight: 1.4,
        }}>
          {renderInlineText(comp, "text", val, sectionId)}
        </div>
      );
    } else if (comp.type === "hero_banner") {
      const bg = comp.props?.backgroundImage
        ? `url(${comp.props.backgroundImage}) center/cover no-repeat`
        : `linear-gradient(135deg, ${comp.props?.color || "#1A1A2E"}, #15152A)`;
      rendered = (
        <div style={{
          background: bg, color: "#fff", borderRadius: 16, padding: 32, textAlign: "center",
          display: "flex", flexDirection: "column",
          justifyContent: "center", alignItems: "center",
        }}>
          {!!comp.props?.badge && (
            <span style={{ fontSize: 11, fontWeight: 600, background: theme.active, color: "#6B4200", padding: "4px 12px", borderRadius: 20, marginBottom: 12, display: "inline-block" }}>
              {renderInlineText(comp, "badge", comp.props?.badge, sectionId)}
            </span>
          )}
          <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 22, marginBottom: 4 }}>
            {renderInlineText(comp, "title", comp.props?.title || "Welcome", sectionId)}
          </div>
          {comp.props?.subtitle && (
            <div style={{ fontSize: 13, opacity: 0.8 }}>
              {renderInlineText(comp, "subtitle", comp.props?.subtitle, sectionId)}
            </div>
          )}
        </div>
      );
    } else if (comp.type === "menu_item") {
      rendered = (
        <div style={{ display: "flex", gap: 12, padding: "12px 16px", background: "#FCF8FA", borderRadius: 12, boxShadow: "0px 2px 12px rgba(0,0,0,0.08)", border: "1px solid rgba(200,197,205,0.3)", alignItems: "center", margin: "0 4px" }}>
          <div style={{ width: 48, height: 48, background: "#F1EDEF", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{comp.props?.emoji || "\uD83C\uDF7D\uFE0F"}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: theme.text, marginBottom: 2 }}>
              {renderInlineText(comp, "name", comp.props?.name || "", sectionId)}
            </div>
            {comp.props?.desc && <div style={{ fontSize: 11, color: theme.textSecondary, lineHeight: 1.3 }}>
              {renderInlineText(comp, "desc", comp.props?.desc, sectionId)}
            </div>}
          </div>
          <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 14, color: "#1A1A2E", whiteSpace: "nowrap" }}>
            {renderInlineText(comp, "price", comp.props?.price || "", sectionId)}
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
      rendered = (
        <div style={{ padding: "8px 16px", textAlign: "center" }}>
          <div style={{
            display: "inline-block", padding: "10px 24px",
            borderRadius: p.radius != null ? Number(p.radius) : 10,
            background: filled ? accent : "transparent",
            border: outlined ? `1.5px solid ${accent}` : "none",
            color: p.color || (filled ? "#FFFFFF" : "#1C1B1D"),
            fontWeight: 600, fontSize: 14, fontFamily: "'Inter',sans-serif",
          }}>
            {renderInlineText(comp, "label", p.label || "Button", sectionId)}
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
    } else {
      rendered = def.render({
        ...comp.props,
        ...(comp.type === "header_bar" ? { logo: logo || comp.props?.logo, appName: appName || comp.props?.appName } : {}),
      });
    }

    return (
      <div
        key={comp.id}
        onClick={(e) => { e.stopPropagation(); onSelectComponent(sectionId, comp.id); }}
        onMouseEnter={() => setHoveredCompId(comp.id)}
        onMouseLeave={() => setHoveredCompId(null)}
        style={{
          width: "100%",
          opacity: comp.visible === false ? 0.4 : 1,
          position: "relative",
          outline: isSelected ? `2px solid ${theme.selection}` : "none",
          outlineOffset: -1,
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
            {/* Floating toolbar */}
            {(selectedSectionId === section.id || hoveredSectionId === section.id) && (
              <div style={{
                position: "absolute", top: 4, right: 4, zIndex: 20,
                display: "flex", gap: 2,
                animation: "fadeIn 0.12s ease",
              }}>
                <span style={{
                  background: selectedSectionId === section.id ? theme.active : "rgba(0,0,0,0.5)",
                  color: selectedSectionId === section.id ? "#6B4200" : "#fff",
                  fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4,
                  fontFamily: "'Inter',sans-serif", marginRight: 4, display: "flex", alignItems: "center", gap: 3,
                }}>
                  {section._label}
                  {section._link && (
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                  )}
                  {hoveredSectionId === section.id && (
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="5" r="2"/><circle cx="15" cy="5" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="9" cy="19" r="2"/><circle cx="15" cy="19" r="2"/></svg>
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
                {(
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); store.duplicateSection(null, section.id); }}
                      style={iconBtn} title="Duplicate"
                    ><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>
                    <button
                      onClick={(e) => { e.stopPropagation(); store.removeBodySection(null, section.id); onSelectSection(null); }}
                      style={iconBtnDanger} title="Delete"
                    ><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
                  </>
                )}
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

            {/* Header with logo upload (empty state) */}
            {section.components?.length === 0 && (selectedSectionId === section.id || hoveredSectionId === section.id) && (
              <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  onClick={(e) => { e.stopPropagation(); logoRef.current?.click(); }}
                  style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: logo ? `url(${logo}) center/cover no-repeat` : "#F1EDEF",
                    cursor: "pointer", flexShrink: 0, display: "flex",
                    alignItems: "center", justifyContent: "center",
                    border: "2px dashed #D1D5DB", fontSize: 18,
                  }}
                >
                  {!logo && "\uD83D\uDCF7"}
                </div>
                <div>
                  <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 16, color: theme.text }}>{appName}</div>
                  {tagline && <div style={{ fontSize: 11, color: theme.textSecondary }}>{tagline}</div>}
                </div>
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
                <div style={{ fontSize: 11, color: theme.border }}>Select this section and use Properties</div>
              </div>
            )}
          </div>
        ))}

        {/* Bottom spacer for nav */}
        {data.navigation?.tabs?.length > 0 && <div style={{ height: 56, flexShrink: 0 }} />}
      </div>

      {/* Hidden file inputs */}
      <input ref={logoRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleLogoUpload} />
      <input ref={imageFileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
    </div>
  );
}
