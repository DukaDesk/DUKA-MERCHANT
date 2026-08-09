import { useState } from "react";
import { theme, iconBtn } from "./editorTheme";
import { getComponentType } from "../canvas-editor/componentTypes";

const SECTION_ICONS = {
  header: "\uD83D\uDDC2\uFE0F",
  hero: "\uD83C\uDF1F",
  menu_list: "\uD83C\uDF7D\uFE0F",
  categories: "\uD83C\uDFF7\uFE0F",
  info: "\u2139\uFE0F",
  product_grid: "\uD83D\uDCE6",
  cart: "\uD83D\uDED2",
  programs: "\uD83D\uDCCA",
  plans: "\uD83D\uDCCB",
  service_list: "\uD83D\uDC85",
  footer: "\uD83D\uDCDE",
  custom: "\uD83D\uDCC4",
};

const getSectionIcon = (type) => SECTION_ICONS[type] || SECTION_ICONS.custom;

const COMPONENT_FALLBACK = "\uD83D\uDDC4\uFE0F";

export default function SectionPanel({ store, selectedSectionId, selectedComponentId, onSelectSection, onSelectComponent, onAddSection, focusSubKey, onFocusSubElement, onRemoveSubElement }) {
  const screen = store.screen;
  const [expanded, setExpanded] = useState({});
  const [expandedComps, setExpandedComps] = useState({});
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);
  const [dragFromId, setDragFromId] = useState(null);
  if (!screen) return null;

  const bodySections = screen.bodySections || [];
  const savedSections = store.savedSections || [];

  const q = query.trim().toLowerCase();

  const toggleExpand = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const compLabel = (comp) => {
    const def = getComponentType(comp.type);
    if (def) return comp.props?.name || comp.props?.label || comp.props?.text || def.label;
    return comp.props?.name || comp.props?.label || comp.props?.text || comp.type;
  };

  /* Recursive element rows: container components (carousel, nested_section) expand into their children. */
  const renderCompRows = (list, sectionId, depth) => {
    return list.map(comp => {
      const isCompSelected = selectedComponentId === comp.id;
      const def = getComponentType(comp.type);
      const subs = def?.subElements || [];
      const children = comp.children || [];
      const hasExpandable = subs.length > 0 || children.length > 0;
      const compOpen = expandedComps[comp.id] !== false || !!q;
      const subsOpen = compOpen && hasExpandable;
      return (
        <div key={comp.id} style={{ marginBottom: 1 }}>
          {/* component row */}
          <div
            onClick={() => onSelectComponent(sectionId, comp.id)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: `4px 6px 4px ${26 + depth * 16}px`, borderRadius: theme.radius.sm, cursor: "pointer",
              background: isCompSelected ? "#EFF6FF" : "transparent",
              border: `1px solid ${isCompSelected ? theme.selection : "transparent"}`,
              fontFamily: "'Inter',sans-serif", fontSize: 11.5,
              color: isCompSelected ? "#1E40AF" : theme.textSecondary,
              fontWeight: isCompSelected ? 600 : 400,
              opacity: comp.visible === false ? 0.45 : 1,
              transition: `all ${theme.transition}`,
            }}
            onMouseEnter={e => { if (!isCompSelected) e.currentTarget.style.background = theme.hover; }}
            onMouseLeave={e => { if (!isCompSelected) e.currentTarget.style.background = "transparent"; }}
          >
            {hasExpandable && (
              <button
                onClick={(e) => { e.stopPropagation(); setExpandedComps(prev => ({ ...prev, [comp.id]: !(prev[comp.id] !== false) })); }}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 1, color: theme.textMuted, display: "flex", flexShrink: 0, transition: `transform ${theme.transition}` }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: subsOpen ? "rotate(0deg)" : "rotate(-90deg)", transition: `transform ${theme.transition}` }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
            )}
            <span style={{
              width: 17, height: 17, borderRadius: 5, flexShrink: 0, display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: 10,
              background: def?.category === "layout" || def?.category === "shapes" ? "#EDF2FF" : def?.category === "text" || def?.category === "inputs" ? "#EDF7EE" : "#FFF3E0",
              color: comp.visible === false ? theme.textMuted : (def?.category === "layout" || def?.category === "shapes" ? "#1D4ED8" : def?.category === "text" || def?.category === "inputs" ? "#15803D" : "#6B4200"),
            }}>
              {def?.icon || (comp.type === "text_block" ? "Aa" : COMPONENT_FALLBACK)}
            </span>
            <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {compLabel(comp)}
            </span>
            {children.length > 0 && (
              <span style={{ fontSize: 9, color: theme.textMuted, flexShrink: 0, background: theme.hover, borderRadius: 8, padding: "0 5px" }}>
                {children.length}
              </span>
            )}
            <span style={{ fontSize: 9, color: theme.textMuted, flexShrink: 0 }}>
              {comp.type === "text_block" ? "Text" : def?.label || comp.type}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); store.updateComponentInSection(sectionId, comp.id, { visible: comp.visible === false }); }}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: comp.visible === false ? theme.textMuted : theme.textSecondary, display: "flex", flexShrink: 0 }}
              title="Show / hide">
              {comp.visible === false ? <EyeOffSVG /> : <EyeSVG />}
            </button>
          </div>

          {/* expandable children: sub-element leaves then nested components */}
          {subsOpen && (
            <div style={{ paddingLeft: 22, marginTop: 1, display: "flex", flexDirection: "column", gap: 1 }}>
              {subs.map(sub => {
                const isFocused = focusSubKey?.compId === comp.id && focusSubKey?.key === sub.key;
                return (
                  <div
                    key={sub.key}
                    onClick={() => { onSelectComponent(sectionId, comp.id); onFocusSubElement?.(sectionId, comp.id, sub.key); }}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "3px 6px 3px 28px", borderRadius: theme.radius.sm, cursor: "pointer",
                      background: isFocused ? theme.hoverAmber : "transparent",
                      border: `1px solid ${isFocused ? theme.active : "transparent"}`,
                      fontFamily: "'Inter',sans-serif", fontSize: 11,
                      color: isFocused ? "#6B4200" : theme.textSecondary,
                      fontWeight: isFocused ? 600 : 400,
                      opacity: isEmptySub(sub, comp) ? 0.55 : 1,
                      transition: `all ${theme.transition}`,
                    }}
                    onMouseEnter={e => { if (!isFocused) e.currentTarget.style.background = theme.hover; }}
                    onMouseLeave={e => { if (!isFocused) e.currentTarget.style.background = "transparent"; }}
                  >
                    <span style={{ width: 15, height: 15, borderRadius: 4, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, background: theme.hover, border: `1px solid ${theme.borderLight}` }}>
                      {sub.kind === "color" ? <ColorDot color={comp.props?.[sub.key] || "#DDD"} /> : (sub.icon || "·")}
                    </span>
                    <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {sub.label}
                    </span>
                    <span style={{ fontSize: 9, color: theme.textMuted, maxWidth: 70, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flexShrink: 0 }}>
                      {subPreview(sub, comp)}
                    </span>
                    {!isEmptySub(sub, comp) && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onRemoveSubElement?.(sectionId, comp.id, sub.key); }}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: theme.textMuted, display: "flex", flexShrink: 0 }}
                        title={`Remove ${sub.label.toLowerCase()}`}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      </button>
                    )}
                  </div>
                );
              })}
              {children.length > 0 && renderCompRows(children, sectionId, depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  const rowMatches = (sec, secQuery) => {
    if (!secQuery) return true;
    const sectionMatch = (sec.name || sec.type || "").toLowerCase().includes(secQuery);
    const compMatch = (sec.components || []).some(c => {
      const label = (compLabel(c) || "").toLowerCase();
      return label.includes(secQuery) || c.type.toLowerCase().includes(secQuery);
    });
    return sectionMatch || compMatch;
  };

  const filteredBody = bodySections.filter(sec => rowMatches(sec, q));

  const handleDrop = (e, targetSec) => {
    e.preventDefault();
    setDragOverId(null);
    const draggedId = e.dataTransfer.getData("sectionId");
    if (!draggedId || draggedId === targetSec.id) return;
    const fromIdx = bodySections.findIndex(s => s.id === draggedId);
    const toIdx = bodySections.findIndex(s => s.id === targetSec.id);
    if (fromIdx === -1 || toIdx === -1) return;
    store.moveBodySectionToIndex(null, draggedId, toIdx);
    setExpanded(prev => ({ ...prev, [draggedId]: true, [targetSec.id]: true }));
  };

  const iconBtnSmall = { ...iconBtn, padding: "3px", width: 20, height: 20 };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* Search */}
      <div style={{ padding: "8px 12px 4px" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          background: theme.hover, border: `1px solid ${theme.border}`,
          borderRadius: theme.radius.md, padding: "0 8px",
          transition: `border-color ${theme.transition}`,
        }}
          onFocus={e => { e.currentTarget.style.borderColor = theme.active; e.currentTarget.style.background = theme.surface; }}
          onBlur={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.background = theme.hover; }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={theme.textMuted} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search sections & elements"
            style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 12, padding: "7px 0", fontFamily: "'Inter',sans-serif", color: theme.text, width: "100%" }}
          />
          {query && (
            <button onClick={() => setQuery("")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: theme.textMuted, display: "flex" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          )}
        </div>
      </div>

      {/* Page content */}
      <div style={{ padding: "6px 12px 12px", display: "flex", flexDirection: "column", gap: 2 }}>

        {/* Group label */}
        <div style={{
          fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 10, color: theme.textMuted,
          padding: "10px 8px 4px", textTransform: "uppercase", letterSpacing: "1px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span>{screen.name || "Screen"} sections</span>
          <span style={{ fontSize: 10, color: theme.border, fontWeight: 400, letterSpacing: 0 }}>{bodySections.length}</span>
        </div>

        {bodySections.length === 0 && !q && (
          <div style={{ padding: "28px 12px", textAlign: "center" }}>
            <div style={{ fontSize: 26, opacity: 0.5, marginBottom: 8 }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={theme.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
            </div>
            <div style={{ color: theme.textSecondary, fontSize: 12, fontWeight: 600, marginBottom: 4, fontFamily: "'Inter',sans-serif" }}>This page is empty</div>
            <div style={{ color: theme.textMuted, fontSize: 11, lineHeight: 1.5, fontFamily: "'Inter',sans-serif" }}>
              Drag in a section or click {" "}{"Add Section"} below.
            </div>
          </div>
        )}

        {bodySections.length > 0 && q && filteredBody.length === 0 && (
          <div style={{ padding: "24px 12px", textAlign: "center", color: theme.textMuted, fontSize: 11 }}>
            {`No matches for "${query}"`}
          </div>
        )}

        {filteredBody.map((sec, i) => {
          const resolved = store.resolveSection?.(sec) || sec;
          const id = sec.id;
          const isOpen = expanded[id] !== false || !!q;
          const isLinked = sec.kind === "saved" && !!sec.libraryId;
          const hidden = sec.visible === false;
          const comps = resolved.components || [];
          const matchesQuery = !q || (sec.name || "").toLowerCase().includes(q) || comps.some(c => (compLabel(c) || "").toLowerCase().includes(q) || c.type.toLowerCase().includes(q));
          const filteredComps = q ? comps.filter(c => (compLabel(c) || "").toLowerCase().includes(q) || c.type.toLowerCase().includes(q)) : comps;
          if (!matchesQuery) return null;

          return (
            <div key={id} style={{ marginBottom: 1 }}>
              {/* Menu dropdown */}
              {menuOpen === id && (
                <>
                  <div style={{ position: "fixed", inset: 0, zIndex: 39 }} onClick={() => setMenuOpen(null)} />
                  <div style={{
                    position: "absolute", zIndex: 40, right: 40, top: "0px",
                    background: theme.surface, borderRadius: theme.radius.md,
                    boxShadow: theme.shadowLg, border: `1px solid ${theme.border}`,
                    minWidth: 170, overflow: "hidden", padding: 4,
                  }}>
                    {!isLinked && (
                      <MenuItem label="Save to library" onClick={() => { store.saveSectionToLibrary(null, id); setMenuOpen(null); }} icon="bookmark" />
                    )}
                    {isLinked && (
                      <MenuItem label="Detach from library" onClick={() => { store.detachSection(undefined, id); setMenuOpen(null); }} icon="chain" />
                    )}
                    <MenuItem label="Rename" onClick={() => { const n = window.prompt("Rename section:", resolved.name || "Section"); if (n) store.renameSection(null, id, n); setMenuOpen(null); }} icon="edit" />
                    <MenuItem label="Duplicate" onClick={() => { store.duplicateSection(null, id); setMenuOpen(null); }} icon="copy" />
                    <div style={{ height: 1, background: theme.border, margin: "4px 0" }} />
                    <MenuItem label="Move up" disabled={i === 0} onClick={() => { store.reorderBodySection(null, id, "up"); setMenuOpen(null); }} icon="up" />
                    <MenuItem label="Move down" disabled={i === bodySections.length - 1} onClick={() => { store.reorderBodySection(null, id, "down"); setMenuOpen(null); }} icon="down" />
                    <div style={{ height: 1, background: theme.border, margin: "4px 0" }} />
                    <MenuItem danger label="Delete" onClick={() => { store.removeBodySection(null, id); onSelectSection(null); setMenuOpen(null); }} icon="trash" />
                  </div>
                </>
              )}

              {/* Section group row */}
              <div
                draggable
                onDragStart={(e) => { e.dataTransfer.setData("sectionId", id); setDragFromId(id); }}
                onDragEnd={() => { setDragOverId(null); setDragFromId(null); }}
                onDragOver={(e) => { e.preventDefault(); setDragOverId(id); }}
                onDragLeave={() => setDragOverId(prev => prev === id ? null : prev)}
                onDrop={(e) => handleDrop(e, sec)}
                onClick={() => onSelectSection(id)}
                style={{
                  display: "flex", alignItems: "center", gap: 4,
                  padding: "7px 6px", borderRadius: theme.radius.md, cursor: "pointer",
                  background: selectedSectionId === id ? theme.hoverAmber : "transparent",
                  border: `1px solid ${selectedSectionId === id ? theme.active : dragOverId === id && dragFromId !== id ? "2px dashed " + theme.selection : theme.border}`,
                  borderWidth: dragOverId === id && dragFromId !== id ? 2 : 1,
                  fontFamily: "'Inter',sans-serif", fontSize: 12.5,
                  color: theme.text, transition: `all ${theme.transition}`,
                  position: "relative", opacity: hidden ? 0.55 : 1,
                }}
                onMouseEnter={e => { if (!selectedSectionId || selectedSectionId !== id) e.currentTarget.style.background = theme.hover; }}
                onMouseLeave={e => { if (!selectedSectionId || selectedSectionId !== id) e.currentTarget.style.background = "transparent"; }}
              >
                {/* grip */}
                <span style={{ color: theme.border, cursor: "grab", display: "flex", flexShrink: 0 }}>
                  <svg width="10" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="5" r="1.6"/><circle cx="15" cy="5" r="1.6"/><circle cx="9" cy="12" r="1.6"/><circle cx="15" cy="12" r="1.6"/><circle cx="9" cy="19" r="1.6"/><circle cx="15" cy="19" r="1.6"/></svg>
                </span>

                {/* chevron */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleExpand(id); }}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 1, color: theme.textMuted, display: "flex", flexShrink: 0, transition: `transform ${theme.transition}` }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)", transition: `transform ${theme.transition}` }}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>

                {/* section icon chip */}
                <span style={{
                  width: 22, height: 22, borderRadius: 7, flexShrink: 0, display: "flex",
                  alignItems: "center", justifyContent: "center", fontSize: 11,
                  background: theme.hover, border: `1px solid ${theme.borderLight}`,
                  position: "relative", overflow: "hidden",
                }}>
                  <span style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${shade(sec.backgroundColor || "#FCF8FA", 0.9)}, ${shade(sec.backgroundColor || "#FCF8FA", 0.6)})`, opacity: 0.35 }} />
                  {getSectionIcon(resolved.type)}
                </span>

                <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: selectedSectionId === id ? 600 : 500 }}>
                  {sec.name || resolved.name || sec.type}
                </span>

                {isLinked && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#3B6FE0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }} title="Linked to library"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                )}

                {/* row actions */}
                <div style={{ display: "flex", gap: 2, alignItems: "center", flexShrink: 0 }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); store.setSectionVisible(null, id, hidden); }}
                    style={{ ...iconBtnSmall, color: hidden ? theme.textMuted : "#374151", background: "none", border: "none", cursor: "pointer", padding: 3, display: "flex" }}
                    title={hidden ? "Hidden — click to show" : "Visible — click to hide"}>
                    {hidden ? <EyeOffSVG /> : <EyeSVG />}
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === id ? null : id); }}
                    style={{ ...iconBtnSmall, background: "none", border: "none", cursor: "pointer", padding: "3px 6px", color: theme.textMuted, display: "flex" }}>
                    <DotsSVG />
                  </button>
                </div>
              </div>

              {/* children */}
              {isOpen && (
                <div style={{ paddingLeft: 26, marginTop: 1, display: "flex", flexDirection: "column", gap: 1 }}>
                  {filteredComps.length === 0 && (
                    <div style={{ padding: "6px 8px 6px 24px", color: theme.textMuted, fontSize: 11 }}>
                      No elements yet
                    </div>
                  )}
                  {renderCompRows(filteredComps, id, 0)}
                </div>
              )}
            </div>
          );
        })}

        <button
          onClick={onAddSection}
          style={{
            marginTop: 8, padding: "9px 12px", borderRadius: theme.radius.md, border: `1.5px dashed ${theme.border}`,
            background: "transparent", color: theme.textSecondary, fontSize: 12, fontWeight: 600, cursor: "pointer",
            fontFamily: "'Inter',sans-serif", transition: `all ${theme.transition}`, width: "100%",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 8,
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = theme.active; e.currentTarget.style.color = theme.active; e.currentTarget.style.background = theme.hoverAmber; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.textSecondary; e.currentTarget.style.background = "transparent"; }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Section
        </button>

        {/* Saved Section Library */}
        <div style={{
          marginTop: 10,
          borderRadius: theme.radius.lg,
          border: `1px solid ${theme.border}`,
          background: theme.surface,
          overflow: "hidden",
        }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "9px 12px",
            background: theme.hover,
            borderBottom: `1px solid ${theme.border}`,
          }}>
            <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 11, color: theme.text, cursor: "pointer" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: -1, marginRight: 5 }}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              Section Library
            </span>
            <span style={{ fontSize: 10, color: theme.textMuted, fontWeight: 600 }}>{savedSections.length}</span>
          </div>
          {savedSections.length === 0 ? (
            <div style={{ padding: "11px 12px", color: theme.textMuted, fontSize: 11, lineHeight: 1.5, fontFamily: "'Inter',sans-serif" }}>
              Save a section from the canvas to reuse it on any screen.
            </div>
          ) : savedSections.map(lib => (
            <div key={lib.id} style={{ padding: "8px 12px", borderBottom: `1px solid ${theme.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 13 }}>{getSectionIcon(lib.type)}</span>
                <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 12, fontWeight: 600, color: theme.text }}>{lib.name}</span>
                <button
                  onClick={() => { store.setSavedSectionPublished(lib.id, lib.published !== false); }}
                  style={{
                    fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 10, cursor: "pointer", border: "none",
                    background: lib.published === false ? "#FEF3C7" : "#D1FAE5",
                    color: lib.published === false ? "#92400E" : "#065F46",
                    fontFamily: "'Inter',sans-serif",
                  }}
                  title={lib.published === false ? "Draft — publish to make it insertable" : "Published — click to unpublish"}
                >
                  {lib.published === false ? "Draft" : "Published"}
                </button>
              </div>
              <div style={{ fontSize: 10, color: theme.textMuted, marginBottom: 6, fontFamily: "'Inter',sans-serif" }}>
                {(lib.components || []).length} components
              </div>
              <button onClick={() => { const n = window.prompt("Rename section:", lib.name); if (n) store.renameSavedSection(lib.id, n); }}
                style={{ ...iconBtn, fontSize: 11, padding: "3px 8px", color: theme.textSecondary }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg> Rename</button>
              <button onClick={() => { store.insertSavedSection(null, lib.id); }}
                style={{ ...iconBtn, fontSize: 11, padding: "3px 8px", color: theme.textSecondary, marginLeft: 4 }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Insert</button>
              <button onClick={() => { store.deleteSavedSection(lib.id); }}
                style={{ ...iconBtn, fontSize: 11, padding: "3px 8px", color: "#E74C3C", marginLeft: 4 }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg> Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── small building blocks ── */

function MenuItem({ label, onClick, icon, danger, disabled }) {
  return (
    <button
      onClick={() => { if (!disabled) onClick(); }}
      disabled={disabled}
      style={{
        display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "7px 10px",
        border: "none", background: "none", cursor: disabled ? "not-allowed" : "pointer",
        fontSize: 12, fontFamily: "'Inter',sans-serif", color: danger ? theme.danger : theme.textSecondary,
        opacity: disabled ? 0.35 : 1, textAlign: "left", borderRadius: theme.radius.sm,
        transition: `background ${theme.transition}`,
      }}
      onMouseEnter={e => e.currentTarget.style.background = theme.hover}
      onMouseLeave={e => e.currentTarget.style.background = "none"}
    >
      <MenuIcon name={icon} color={danger ? theme.danger : "#6B7280"} />
      {label}
    </button>
  );
}

function MenuIcon({ name, color }) {
  const common = { width: 12, height: 12, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "bookmark": return <svg {...common}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;
    case "chain": return <svg {...common}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>;
    case "edit": return <svg {...common}><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>;
    case "copy": return <svg {...common}><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>;
    case "up": return <svg {...common}><polyline points="18 15 12 9 6 15"/></svg>;
    case "down": return <svg {...common}><polyline points="6 9 12 15 18 9"/></svg>;
    case "trash": return <svg {...common}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
    default: return null;
  }
}

const EyeSVG = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
);
const DotsSVG = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>
);
const EyeOffSVG = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
);

function shade(hex, factor) {
  const h = hex.replace("#", "");
  const nums = h.length === 3 ? h.split("").map(c => c + c) : h.match(/.{2}/g);
  if (!nums || nums.length < 3) return "#FFFFFF";
  const r = Math.round(parseInt(nums[0], 16) * factor);
  const g = Math.round(parseInt(nums[1], 16) * factor);
  const b = Math.round(parseInt(nums[2], 16) * factor);
  return `rgb(${r}, ${g}, ${b})`;
}

function isEmptySub(sub, comp) {
  const val = comp?.props?.[sub.key];
  if (sub.kind === "color") return !val;
  if (sub.kind === "json") return !val;
  return val === "" || val === undefined || val === null;
}

function subPreview(sub, comp) {
  const val = comp.props?.[sub.key];
  if (sub.kind === "color") return val || "default";
  if (sub.kind === "json") return val ? "configured" : "";
  const sv = (val || "").toString();
  return sv.length > 16 ? sv.slice(0, 16) + "…" : sv;
}

function ColorDot({ color }) {
  return (
    <span style={{ width: 10, height: 10, borderRadius: "50%", background: color.indexOf("#") === 0 ? color : `linear-gradient(135deg, ${color}, #888)`, border: "1px solid rgba(0,0,0,0.12)", display: "inline-block" }} />
  );
}