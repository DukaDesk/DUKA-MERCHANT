import { useState } from "react";
import { theme, iconBtn } from "./editorTheme";

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

const getIcon = (type) => SECTION_ICONS[type] || "\uD83D\uDCC4";

const COMPONENT_EMOJI = {
  hero_banner: "\uD83C\uDF1F",
  menu_item: "\uD83C\uDF7D\uFE0F",
  category_pills: "\uD83C\uDFF7\uFE0F",
  text_block: "Aa",
  image_block: "\uD83D\uDDBC\uFE0F",
  button: "\uD83D\uDD18",
  menu_grid: "\uD83D\uDCCB",
  header_bar: "\uD83D\uDDC2\uFE0F",
  divider: "\u2796",
  rectangle: "\u25AC",
  ellipse: "\u2B23",
  line: "\u2571",
  arrow: "\u2192",
  path: "\u270F\uFE0F",
};

export default function SectionPanel({ store, selectedSectionId, selectedComponentId, onSelectSection, onSelectComponent, onAddSection }) {
  const data = store.data;
  const screen = store.screen;
  const [expandedSections, setExpandedSections] = useState({});
  if (!screen) return null;

  const header = data.shared?.header;
  const footer = data.shared?.footer;
  const bodySections = screen.bodySections || [];

  const toggleExpand = (id) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Shared Section: Header */}
      {header && (
        <SectionRow
          section={header}
          label="Header"
          isSelected={selectedSectionId === header.id}
          selectedComponentId={selectedComponentId}
          onSelect={() => onSelectSection(header.id)}
          onSelectComponent={onSelectComponent}
          expanded={expandedSections[header.id] !== false}
          onToggleExpand={() => toggleExpand(header.id)}
          isShared
        />
      )}

      {/* Body Sections */}
      <div style={{
        fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 11, color: theme.textMuted,
        padding: "12px 12px 4px", textTransform: "uppercase", letterSpacing: "1px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span>{screen.name || "Screen"} Sections</span>
        <span style={{ fontSize: 10, color: theme.border, fontWeight: 400, letterSpacing: 0 }}>
          {bodySections.length}
        </span>
      </div>

      {bodySections.length === 0 && (
        <div style={{ padding: "24px 12px", textAlign: "center" }}>
          <div style={{ fontSize: 24, marginBottom: 8, opacity: 0.5 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={theme.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
          </div>
          <div style={{ color: theme.textSecondary, fontSize: 13, fontWeight: 600, marginBottom: 4, fontFamily: "'Inter',sans-serif" }}>This page is empty</div>
          <div style={{ color: theme.textMuted, fontSize: 11, lineHeight: 1.5, fontFamily: "'Inter',sans-serif" }}>
            Add a section below to start building your page.
          </div>
        </div>
      )}

      {bodySections.map((sec, i) => (
        <div key={sec.id} style={{ display: "flex", alignItems: "flex-start", gap: 2, marginBottom: 1 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <SectionRow
              section={sec}
              isSelected={selectedSectionId === sec.id}
              selectedComponentId={selectedComponentId}
              onSelect={() => onSelectSection(sec.id)}
              onSelectComponent={onSelectComponent}
              expanded={expandedSections[sec.id] !== false}
              onToggleExpand={() => toggleExpand(sec.id)}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2, paddingTop: 5 }}>
            <button
              onClick={() => store.reorderBodySection(null, sec.id, "up")}
              disabled={i === 0}
              style={{ ...iconBtn, padding: "3px 4px", opacity: i === 0 ? 0.35 : 1, cursor: i === 0 ? "not-allowed" : "pointer" }}
              title="Move up"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
            </button>
            <button
              onClick={() => store.reorderBodySection(null, sec.id, "down")}
              disabled={i === bodySections.length - 1}
              style={{ ...iconBtn, padding: "3px 4px", opacity: i === bodySections.length - 1 ? 0.35 : 1, cursor: i === bodySections.length - 1 ? "not-allowed" : "pointer" }}
              title="Move down"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
          </div>
        </div>
      ))}

      {/* Shared Section: Footer */}
      {footer && (
        <SectionRow
          section={footer}
          label="Footer"
          isSelected={selectedSectionId === footer.id}
          selectedComponentId={selectedComponentId}
          onSelect={() => onSelectSection(footer.id)}
          onSelectComponent={onSelectComponent}
          expanded={expandedSections[footer.id] !== false}
          onToggleExpand={() => toggleExpand(footer.id)}
          isShared
        />
      )}

      <button
        onClick={onAddSection}
        style={{
          marginTop: 8, padding: "10px 12px", borderRadius: theme.radius.md, border: `1.5px dashed ${theme.border}`,
          background: "transparent", color: theme.textSecondary, fontSize: 12, fontWeight: 600, cursor: "pointer",
          fontFamily: "'Inter',sans-serif", transition: `all ${theme.transition}`, width: "100%",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = theme.active; e.currentTarget.style.color = theme.active; e.currentTarget.style.background = theme.hoverAmber; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.textSecondary; e.currentTarget.style.background = "transparent"; }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Add Section
      </button>
    </div>
  );
}

function SectionRow({ section, label, isSelected, selectedComponentId, onSelect, onSelectComponent, expanded, onToggleExpand, isShared }) {
  const hasComponents = (section.components || []).length > 0;
  return (
    <div>
      <div
        onClick={onSelect}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "8px 10px", borderRadius: theme.radius.md, cursor: "pointer",
          background: isSelected ? theme.hoverAmber : "transparent",
          border: `1px solid ${isSelected ? theme.active : "transparent"}`,
          fontFamily: "'Inter',sans-serif", fontSize: 13,
          fontWeight: isSelected ? 600 : 400,
          color: theme.text, marginBottom: 1,
          transition: `all ${theme.transition}`,
          position: "relative",
        }}
        onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = theme.hover; }}
        onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
      >
        <span style={{ fontSize: 14, flexShrink: 0, opacity: 0.7, cursor: "grab" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="5" r="2"/><circle cx="15" cy="5" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="9" cy="19" r="2"/><circle cx="15" cy="19" r="2"/></svg>
        </span>
        <span style={{ fontSize: 14, flexShrink: 0 }}>{getIcon(section.type)}</span>
        <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {label || section.name || section.type}
          {isShared && <span style={{ fontSize: 10, color: theme.textMuted, marginLeft: 4 }}>(shared)</span>}
        </span>
        <span style={{
          width: 10, height: 10, borderRadius: "50%", flexShrink: 0,
          background: section.backgroundColor || theme.border,
          border: "1px solid rgba(0,0,0,0.1)",
        }} title={section.backgroundColor || "No color"} />
        {hasComponents && (
          <button onClick={(e) => { e.stopPropagation(); onToggleExpand(); }}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: theme.textMuted, transition: `transform ${theme.transition}` }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: expanded ? "rotate(0deg)" : "rotate(-90deg)", transition: `transform ${theme.transition}` }}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
        )}
      </div>

      {expanded && (section.components || []).map(comp => {
        const compName = comp.props?.name || comp.props?.label || comp.props?.text || comp.type;
        return (
          <div
            key={comp.id}
            onClick={() => onSelectComponent(section.id, comp.id)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "4px 12px 4px 40px", borderRadius: theme.radius.sm, cursor: "pointer",
              background: selectedComponentId === comp.id ? "#EFF6FF" : "transparent",
              border: `1px solid ${selectedComponentId === comp.id ? theme.selection : "transparent"}`,
              fontFamily: "'Inter',sans-serif", fontSize: 12,
              color: selectedComponentId === comp.id ? "#1E40AF" : theme.textSecondary,
              fontWeight: selectedComponentId === comp.id ? 600 : 400,
              marginBottom: 1, transition: `all ${theme.transition}`,
              opacity: comp.visible === false ? 0.5 : 1,
            }}
            onMouseEnter={e => { if (selectedComponentId !== comp.id) e.currentTarget.style.background = theme.hover; }}
            onMouseLeave={e => { if (selectedComponentId !== comp.id) e.currentTarget.style.background = "transparent"; }}
          >
            <span style={{ fontSize: 11, width: 16, textAlign: "center", flexShrink: 0 }}>
              {COMPONENT_EMOJI[comp.type] || "\uD83D\uDDC4\uFE0F"}
            </span>
            <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {compName}
            </span>
            {!comp.visible && <span style={{ fontSize: 9, color: theme.textMuted }}>hidden</span>}
          </div>
        );
      })}
    </div>
  );
}
