import { useState, useRef, useCallback } from "react";
import { getComponentType } from "../canvas-editor/componentTypes";
import { theme, iconBtn, iconBtnDanger } from "./editorTheme";

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

  const header = data.shared?.header;
  const footer = data.shared?.footer;
  const bodySections = screen.bodySections || [];
  const logo = data.meta?.logo;
  const appName = data.meta?.appName || "Your App";
  const tagline = data.meta?.tagline || "";
  const primaryColor = data.meta?.primaryColor || "#1A1A2E";
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

  const allSections = [
    ...(header ? [{ ...header, _shared: true, _label: "Header" }] : []),
    ...bodySections.map(sec => ({ ...sec, _label: sec.name || sec.type })),
    ...(footer ? [{ ...footer, _shared: true, _label: "Footer" }] : []),
  ];

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
    const draggedIsShared = header?.id === draggedId || footer?.id === draggedId;
    const targetIsShared = header?.id === targetSectionId || footer?.id === targetSectionId;
    if (draggedIsShared || targetIsShared) return;
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
    } else if (header?.id === sectionId) {
      store.setSharedSectionColor("header", color);
    } else if (footer?.id === sectionId) {
      store.setSharedSectionColor("footer", color);
    }
  };

  const renderInlineText = (comp, field, value, sectionId, compIdx) => {
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
            draggable={!section._shared}
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
                  {!section._shared && hoveredSectionId === section.id && (
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="5" r="2"/><circle cx="15" cy="5" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="9" cy="19" r="2"/><circle cx="15" cy="19" r="2"/></svg>
                  )}
                </span>
                {!section._shared && (
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
            {hoveredSectionId === section.id && !section._shared && (
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
            {section._shared && section.type === "header" && section.components?.length === 0 && (selectedSectionId === section.id || hoveredSectionId === section.id) && (
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

            {/* Components */}
            {(section.components || []).map((comp, compIdx) => {
              const def = getComponentType(comp.type);
              if (!def) return null;
              const isSelected = selectedComponentId === comp.id;

              /* ── Inline-editable override render ── */
              let rendered;
              if (comp.type === "text_block") {
                const val = comp.props?.text || "";
                rendered = (
                  <div style={{
                    fontSize: comp.props?.fontSize || 14, fontWeight: comp.props?.fontWeight || 400,
                    color: comp.props?.color || "#1C1B1D", textAlign: comp.props?.alignment || "left",
                    fontFamily: "'Inter',sans-serif", padding: "2px 16px", lineHeight: 1.4,
                  }}>
                    {renderInlineText(comp, "text", val, section.id, compIdx)}
                  </div>
                );
              } else if (comp.type === "hero_banner") {
                rendered = (
                  <div style={{
                    background: `linear-gradient(135deg, ${comp.props?.color || "#1A1A2E"}, #15152A)`,
                    color: "#fff", borderRadius: 16, padding: 32, textAlign: "center",
                    display: "flex", flexDirection: "column",
                    justifyContent: "center", alignItems: "center",
                  }}>
                    <span style={{ fontSize: 11, fontWeight: 600, background: theme.active, color: "#6B4200", padding: "4px 12px", borderRadius: 20, marginBottom: 12, display: "inline-block" }}>
                      {renderInlineText(comp, "badge", comp.props?.badge || "Open Now", section.id, compIdx)}
                    </span>
                    <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 22, marginBottom: 4 }}>
                      {renderInlineText(comp, "title", comp.props?.title || "Welcome", section.id, compIdx)}
                    </div>
                    {comp.props?.subtitle && (
                      <div style={{ fontSize: 13, opacity: 0.8 }}>
                        {renderInlineText(comp, "subtitle", comp.props?.subtitle, section.id, compIdx)}
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
                        {renderInlineText(comp, "name", comp.props?.name || "", section.id, compIdx)}
                      </div>
                      {comp.props?.desc && <div style={{ fontSize: 11, color: theme.textSecondary, lineHeight: 1.3 }}>
                        {renderInlineText(comp, "desc", comp.props?.desc, section.id, compIdx)}
                      </div>}
                    </div>
                    <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 14, color: "#1A1A2E", whiteSpace: "nowrap" }}>
                      {renderInlineText(comp, "price", comp.props?.price || "", section.id, compIdx)}
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
                        <button onClick={(e) => { e.stopPropagation(); triggerImageUpload(section.id, comp.id); }}
                          style={{ ...iconBtn, padding: "3px 8px", fontSize: 11, gap: 3 }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                          {comp.props?.src ? "Change" : "Upload"}
                        </button>
                      </div>
                    )}
                  </div>
                );
              } else if (comp.type === "button") {
                rendered = (
                  <div style={{ padding: "8px 16px", textAlign: "center" }}>
                    <div style={{
                      display: "inline-block", padding: "10px 24px", borderRadius: 10,
                      background: comp.props?.background || theme.active,
                      color: comp.props?.color || "#1C1B1D",
                      fontWeight: 600, fontSize: 14, fontFamily: "'Inter',sans-serif",
                    }}>
                      {renderInlineText(comp, "label", comp.props?.label || "Button", section.id, compIdx)}
                    </div>
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
                  onClick={(e) => { e.stopPropagation(); onSelectComponent(section.id, comp.id); }}
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
                  {hoveredCompId === comp.id && (
                    <div style={{
                      position: "absolute", top: 2, right: 2, zIndex: 15,
                      display: "flex", gap: 2,
                    }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); store.duplicateComponentInSection(section.id, comp.id); }}
                        style={iconBtn} title="Duplicate"
                      ><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>
                      <button
                        onClick={(e) => { e.stopPropagation(); store.removeComponentFromSection(section.id, comp.id); }}
                        style={iconBtnDanger} title="Delete"
                      ><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Empty section hint */}
            {(!section.components || section.components.length === 0) && !(section._shared && section.type === "header") && (
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
