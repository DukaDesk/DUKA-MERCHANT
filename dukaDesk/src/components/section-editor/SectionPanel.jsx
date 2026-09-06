import { useState } from "react";
import { Layout, ClipboardList, PanelTop, ChevronDown, Type, AlignLeft, Square, List, Star, Minus, Image as ImageIcon, Video, SquareStack, Monitor, FileText, ShoppingBag, Tag, Info, Package, ShoppingCart, BarChart3, Scissors, Phone, Sparkles, Construction, Upload, Trash2, Home, Search, User, Settings } from "lucide-react";
import { useEditorTheme, ColorInput } from "./editorTheme.jsx";
import { getComponentType, getLucideIcon, ICON_LIBRARY } from "../canvas-editor/componentTypes";
import TemplateGallery from "../app-builder/TemplateGallery";
import { loadTemplateForCanvas } from "../../services/staticTemplates";
import { toast } from "react-toastify";

const SECTION_ICONS = {
  header: PanelTop,
  hero: Sparkles,
  menu_list: ShoppingBag,
  categories: Tag,
  info: Info,
  product_grid: Package,
  cart: ShoppingCart,
  programs: BarChart3,
  plans: ClipboardList,
  service_list: Scissors,
  footer: Phone,
  custom: FileText,
};

const getSectionIcon = (type) => SECTION_ICONS[type] || SECTION_ICONS.custom;
const COMPONENT_FALLBACK = FileText;

// Tab definitions — 100px column, top to bottom, last two at bottom
const TABS_TOP = [
  { id: "page-content", label: "Page Content", icon: PageContentIcon },
  { id: "element", label: "Elements", icon: ElementIcon },
  { id: "third-party", label: "Third Party", icon: ThirdPartyIcon },
  { id: "templates", label: "Templates", icon: TemplatesIcon },
  { id: "settings", label: "Settings", icon: SettingsIcon },
];
const TABS_BOTTOM = [
  { id: "version-history", label: "Version History", icon: HistoryIcon },
  { id: "live-chat", label: "Live Chat", icon: ChatIcon },
];

function PageContentIcon({ active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#1A1A2E" : "#6B7280"} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 21V9" />
    </svg>
  );
}
function ElementIcon({ active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#1A1A2E" : "#6B7280"} strokeWidth="1.7">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
function ThirdPartyIcon({ active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#1A1A2E" : "#6B7280"} strokeWidth="1.7">
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path d="M19 12a7 7 0 0 1-7 7M12 5a7 7 0 0 1 7 7" />
      <path d="M5 12a7 7 0 0 0 7-7" />
    </svg>
  );
}
function TemplatesIcon({ active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#1A1A2E" : "#6B7280"} strokeWidth="1.7">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 9v12" />
    </svg>
  );
}
function SettingsIcon({ active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#1A1A2E" : "#6B7280"} strokeWidth="1.7">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.2a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 9 15a1.6 1.6 0 0 0-1-1.5V13a2 2 0 0 1 0-2v-.5c.3-.6.8-1 1.5-1 1 0 1.8-.3 1.8-.3" />
    </svg>
  );
}
function HistoryIcon({ active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#1A1A2E" : "#6B7280"} strokeWidth="1.7">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}
function ChatIcon({ active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#1A1A2E" : "#6B7280"} strokeWidth="1.7">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10Z" />
    </svg>
  );
}

/* New Elements palette — grouped, collapsible, closed by default.
   `type: null` rows are placeholders shown disabled as "Coming soon". */
const ELEMENT_GROUPS = [
  {
    label: "Structure",
    items: [
      { label: "Section", special: "section" },
      { label: "Layout", type: "row" },
      { label: "Screens", special: "screens" },
      { label: "Content List", type: "info_list" },
      { label: "Tabs", type: "tabs" },
      { label: "Accordion", type: null },
    ],
  },
  {
    label: "Basic",
    items: [
      { label: "Heading", type: "text_block" },
      { label: "Paragraph", type: "text_block" },
      { label: "Button", type: "button" },
      { label: "List", type: "info_list" },
      { label: "Icon", type: "icon" },
      { label: "Divider", type: "divider" },
    ],
  },
  {
    label: "Media",
    items: [
      { label: "Images", type: "image_block" },
      { label: "Video", type: null },
    ],
  },
];

/* Lucide icon per palette item (replaces emoji/special-character glyphs). */
const ELEMENT_ICON_MAP = {
  Section: SquareStack,
  Layout: Layout,
  Screens: Monitor,
  "Content List": ClipboardList,
  Tabs: PanelTop,
  Accordion: ChevronDown,
  Heading: Type,
  Paragraph: AlignLeft,
  Button: Square,
  List: List,
  Icon: Star,
  Divider: Minus,
  Images: ImageIcon,
  Video: Video,
};

export default function SectionPanel({ store, selectedSectionId, selectedComponentId, onSelectSection, onSelectComponent, focusSubKey, onFocusSubElement, onRemoveSubElement, onBrowse, browseType, onAddSection }) {
  const { theme, iconBtn } = useEditorTheme();
  const screen = store.screen;
  const [expanded, setExpanded] = useState({});
  const [expandedComps, setExpandedComps] = useState({});
  const [menuOpen, setMenuOpen] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);
  const [dragFromId, setDragFromId] = useState(null);
  const [activeTab, setActiveTab] = useState("page-content");
  const [addQuery, setAddQuery] = useState("");
  const [groupOpen, setGroupOpen] = useState({});
  const [loadingTemplate, setLoadingTemplate] = useState(false);
  const [tabIconPickerIdx, setTabIconPickerIdx] = useState(null);
  const [localReleases, setLocalReleases] = useState([
    { id: "rel_001", version: "1.0.2", timestamp: Date.now() - 1000 * 60 * 60 * 2, status: "published", changes: "Added hero banner and menu grid" },
    { id: "rel_002", version: "1.0.1", timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2, status: "published", changes: "Initial publish" },
    { id: "rel_003", version: "0.9.0", timestamp: Date.now() - 1000 * 60 * 60 * 24 * 5, status: "draft", changes: "Beta draft" },
  ]);
  if (!screen) return null;

  const bodySections = screen.bodySections || [];
  const meta = store.data.meta || {};
  const toggleExpand = (id) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  const filteredBody = bodySections;

  const compLabel = (comp) => {
    const def = getComponentType(comp.type);
    if (def) return comp.props?.name || comp.props?.label || comp.props?.text || def.label;
    return comp.props?.name || comp.props?.label || comp.props?.text || comp.type;
  };

  const handleDrop = (e, targetSec) => {
    e.preventDefault();
    setDragOverId(null);
    const draggedId = e.dataTransfer.getData("sectionId");
    if (!draggedId || draggedId === targetSec.id) return;
    const fromIdx = bodySections.findIndex((s) => s.id === draggedId);
    const toIdx = bodySections.findIndex((s) => s.id === targetSec.id);
    if (fromIdx === -1 || toIdx === -1) return;
    store.moveBodySectionToIndex(null, draggedId, toIdx);
    setExpanded((prev) => ({ ...prev, [draggedId]: true, [targetSec.id]: true }));
  };

  const iconBtnSmall = { ...iconBtn, padding: "3px", width: 20, height: 20 };

  const handleLoadTemplate = async (templateId) => {
    if (!templateId) return;
    setLoadingTemplate(true);
    try {
      const design = await loadTemplateForCanvas(templateId);
      store.loadTemplate(design);
      store.setMeta({
        appName: design.meta.appName,
        category: design.meta.category,
        primaryColor: design.meta.primaryColor,
      });
      toast.success(`Template "${design.meta.appName}" loaded`);
    } catch {
      toast.error("Failed to load template");
    } finally {
      setLoadingTemplate(false);
    }
  };

  const renderCompRows = (list, sectionId, depth) => {
    return list.map((comp) => {
      const isCompSelected = selectedComponentId === comp.id;
      const def = getComponentType(comp.type);
      const subs = def?.subElements || [];
      const children = comp.children || [];
      const hasExpandable = subs.length > 0 || children.length > 0;
      const compOpen = expandedComps[comp.id] !== false;
      const subsOpen = compOpen && hasExpandable;
      return (
        <div key={comp.id} style={{ marginBottom: 1 }}>
          <div
            onClick={() => onSelectComponent(sectionId, comp.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: `4px 6px 4px ${26 + depth * 16}px`,
              borderRadius: theme.radius.sm,
              cursor: "pointer",
              background: isCompSelected ? "#EFF6FF" : "transparent",
              border: `1px solid ${isCompSelected ? theme.selection : "transparent"}`,
              fontFamily: "'Inter',sans-serif",
              fontSize: 11.5,
              color: isCompSelected ? "#1E40AF" : theme.textSecondary,
              fontWeight: isCompSelected ? 600 : 400,
              opacity: comp.visible === false ? 0.45 : 1,
              transition: `all ${theme.transition}`,
            }}
            onMouseEnter={(e) => {
              if (!isCompSelected) e.currentTarget.style.background = theme.hover;
            }}
            onMouseLeave={(e) => {
              if (!isCompSelected) e.currentTarget.style.background = "transparent";
            }}
          >
            {hasExpandable && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedComps((prev) => ({ ...prev, [comp.id]: !(prev[comp.id] !== false) }));
                }}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 1, color: theme.textMuted, display: "flex", flexShrink: 0, transition: `transform ${theme.transition}` }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: subsOpen ? "rotate(0deg)" : "rotate(-90deg)" }}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            )}
            <span
              style={{
                width: 17,
                height: 17,
                borderRadius: 5,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: def?.category === "layout" || def?.category === "shapes" ? "#EDF2FF" : def?.category === "text" || def?.category === "inputs" ? "#EDF7EE" : "#FFF3E0",
                color: comp.visible === false ? theme.textMuted : def?.category === "layout" || def?.category === "shapes" ? "#1D4ED8" : def?.category === "text" || def?.category === "inputs" ? "#15803D" : "#6B4200",
              }}
            >
              {(() => { const Icon = def?.icon || (comp.type === "text_block" ? Type : COMPONENT_FALLBACK); return <Icon size={11} />; })()}
            </span>
            <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{compLabel(comp)}</span>
            {children.length > 0 && (
              <span style={{ fontSize: 9, color: theme.textMuted, flexShrink: 0, background: theme.hover, borderRadius: 8, padding: "0 5px" }}>{children.length}</span>
            )}
            <span style={{ fontSize: 9, color: theme.textMuted, flexShrink: 0 }}>{comp.type === "text_block" ? "Text" : def?.label || comp.type}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                store.updateComponentInSection(sectionId, comp.id, { visible: comp.visible === false });
              }}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: comp.visible === false ? theme.textMuted : theme.textSecondary, display: "flex", flexShrink: 0 }}
              title="Show / hide"
            >
              {comp.visible === false ? <EyeOffSVG /> : <EyeSVG />}
            </button>
          </div>

          {subsOpen && (
            <div style={{ paddingLeft: 22, marginTop: 1, display: "flex", flexDirection: "column", gap: 1 }}>
              {subs.map((sub) => {
                const isFocused = focusSubKey?.compId === comp.id && focusSubKey?.key === sub.key;
                return (
                  <div
                    key={sub.key}
                    onClick={() => {
                      onSelectComponent(sectionId, comp.id);
                      onFocusSubElement?.(sectionId, comp.id, sub.key);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "3px 6px 3px 28px",
                      borderRadius: theme.radius.sm,
                      cursor: "pointer",
                      background: isFocused ? theme.hoverAmber : "transparent",
                      border: `1px solid ${isFocused ? theme.active : "transparent"}`,
                      fontFamily: "'Inter',sans-serif",
                      fontSize: 11,
                      color: isFocused ? "#6B4200" : theme.textSecondary,
                      fontWeight: isFocused ? 600 : 400,
                      opacity: isEmptySub(sub, comp) ? 0.55 : 1,
                      transition: `all ${theme.transition}`,
                    }}
                    onMouseEnter={(e) => {
                      if (!isFocused) e.currentTarget.style.background = theme.hover;
                    }}
                    onMouseLeave={(e) => {
                      if (!isFocused) e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <span style={{ width: 15, height: 15, borderRadius: 4, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: theme.hover, border: `1px solid ${theme.borderLight}`, color: "#6B7280" }}>
                      {sub.kind === "color" ? <ColorDot color={comp.props?.[sub.key] || "#DDD"} /> : (() => { const Icon = sub.icon; return <Icon size={10} />; })()}
                    </span>
                    <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sub.label}</span>
                    <span style={{ fontSize: 9, color: theme.textMuted, maxWidth: 70, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flexShrink: 0 }}>{subPreview(sub, comp)}</span>
                    {!isEmptySub(sub, comp) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveSubElement?.(sectionId, comp.id, sub.key);
                        }}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: theme.textMuted, display: "flex", flexShrink: 0 }}
                        title={`Remove ${sub.label.toLowerCase()}`}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
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

  // ── Splash: editable background (color or image) with centered logo (always shown on app entry, never on tabs)
  const splash = store.data.splash || { backgroundColor: "#1A1A2E", backgroundImage: "", logo: store.data.meta?.logo || null };
  const splashBg = splash.backgroundImage ? `url(${splash.backgroundImage}) center/cover no-repeat` : splash.backgroundColor || "#1A1A2E";
  const splashLogo = splash.logo || store.data.meta?.logo || null;

  const renderSplashCard = () => (
    <div style={{ marginBottom: 14, border: `1px solid ${theme.border}`, borderRadius: theme.radius.md, overflow: "hidden", background: theme.surface }}>
      <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 10, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", padding: "8px 10px 6px", borderBottom: `1px solid ${theme.borderLight}` }}>
        Splash Screen
      </div>
      <div style={{ height: 140, background: splashBg, display: "flex", alignItems: "center", justifyContent: "center", borderBottom: `1px solid ${theme.borderLight}` }}>
        {splashLogo ? (
          <img src={splashLogo} alt="logo" style={{ width: 64, height: 64, borderRadius: 16, objectFit: "cover", boxShadow: "0 8px 24px rgba(0,0,0,0.25)", background: "#fff" }} />
        ) : (
          <div style={{ width: 64, height: 64, borderRadius: 16, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, color: theme.text, boxShadow: "0 8px 24px rgba(0,0,0,0.25)" }}>
            {(store.data.meta?.appName || "D").charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 8 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: theme.textSecondary, marginBottom: 4 }}>Background</div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <ColorInput value={splash.backgroundColor || "#1A1A2E"} onChange={(v) => store.setSplash({ backgroundColor: v, backgroundImage: "" })} />
            <span style={{ fontSize: 11, color: theme.textMuted }}>or</span>
            <button onClick={() => document.getElementById("splash-bg-upload")?.click()} style={{ ...iconBtn, padding: "5px 8px", fontSize: 11, gap: 4 }}>
              <Upload size={12} /> {splash.backgroundImage ? "Change image" : "Upload image"}
            </button>
            {splash.backgroundImage && (
              <button onClick={() => store.setSplash({ backgroundImage: "" })} style={{ ...iconBtn, padding: "5px 8px", fontSize: 11, color: theme.danger, borderColor: theme.dangerBorder }}>
                <Trash2 size={12} /> Remove
              </button>
            )}
          </div>
          <input id="splash-bg-upload" type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => store.setSplash({ backgroundImage: ev.target.result, backgroundColor: splash.backgroundColor });
            reader.readAsDataURL(file);
            e.target.value = "";
          }} />
        </div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: theme.textSecondary, marginBottom: 4 }}>Center Logo</div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button onClick={() => document.getElementById("splash-logo-upload")?.click()} style={{ ...iconBtn, padding: "5px 8px", fontSize: 11, gap: 4 }}>
              <Upload size={12} /> {splashLogo ? "Change logo" : "Upload logo"}
            </button>
            {splash.logo && (
              <button onClick={() => store.setSplash({ logo: null })} style={{ ...iconBtn, padding: "5px 8px", fontSize: 11, color: theme.danger, borderColor: theme.dangerBorder }}>
                <Trash2 size={12} /> Remove
              </button>
            )}
          </div>
          <input id="splash-logo-upload" type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => store.setSplash({ logo: ev.target.result });
            reader.readAsDataURL(file);
            e.target.value = "";
          }} />
        </div>
      </div>
    </div>
  );

  // ── Tabs: shown under page content in this panel (lucide icons from components icon bank)
  const navTabs = store.data.navigation?.tabs || [];
  const renderTabsUnderContent = () => (
    <div style={{ marginTop: 16, borderTop: `1px solid ${theme.borderLight}`, paddingTop: 12 }}>
      <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 11, color: theme.text, marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span>Bottom Tabs</span>
        <span style={{ fontSize: 10, color: theme.textMuted, fontWeight: 400 }}>{navTabs.length} tabs</span>
      </div>
      {navTabs.length === 0 && (
        <div style={{ fontSize: 11, color: theme.textMuted, padding: "8px 0" }}>No tabs yet. Add one below.</div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {navTabs.map((tab, i) => {
          const Icon = getLucideIcon(tab.icon) || Home;
          const isPickerOpen = tabIconPickerIdx === i;
          return (
            <div key={tab.id || i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 8px", borderRadius: theme.radius.md, border: `1px solid ${theme.border}`, background: theme.surface }}>
              <div style={{ position: "relative" }}>
                <button onClick={() => setTabIconPickerIdx(isPickerOpen ? null : i)} style={{ width: 28, height: 28, borderRadius: 6, border: `1px solid ${theme.border}`, background: theme.hover, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: theme.textSecondary }} title="Pick icon from bank">
                  <Icon size={14} />
                </button>
                {isPickerOpen && (
                  <>
                    <div style={{ position: "fixed", inset: 0, zIndex: 39 }} onClick={() => setTabIconPickerIdx(null)} />
                    <div style={{ position: "absolute", zIndex: 40, bottom: "100%", left: 0, marginBottom: 6, background: theme.surface, borderRadius: theme.radius.md, boxShadow: theme.shadowLg, border: `1px solid ${theme.border}`, padding: 8, display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 4, width: 220 }}>
                      {Object.keys(ICON_LIBRARY).map(name => {
                        const I = ICON_LIBRARY[name];
                        return (
                          <button key={name} onClick={() => { store.updateTab(i, { icon: name }); setTabIconPickerIdx(null); }} style={{ background: tab.icon === name ? theme.hoverAmber : "transparent", border: tab.icon === name ? `1px solid ${theme.active}` : "1px solid transparent", borderRadius: 6, cursor: "pointer", padding: 6, display: "flex", alignItems: "center", justifyContent: "center", color: theme.textSecondary }} title={name}>
                            <I size={16} />
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
              <input value={tab.label || ""} onChange={e => store.updateTab(i, { label: e.target.value })} placeholder="Label" style={{ flex: 1, border: `1px solid ${theme.border}`, borderRadius: 6, padding: "5px 7px", fontSize: 12, outline: "none" }} />
              <select value={tab.screenId || ""} onChange={e => store.updateTab(i, { screenId: e.target.value })} style={{ fontSize: 11, padding: "4px 6px", borderRadius: 6, border: `1px solid ${theme.border}`, maxWidth: 110 }}>
                <option value="">— page —</option>
                {Object.entries(store.data.screens).map(([id, sc]) => (
                  <option key={id} value={id}>{sc.name || id}</option>
                ))}
              </select>
              <button onClick={() => store.removeTab(i)} style={{ ...iconBtn, padding: "4px", color: theme.danger, borderColor: theme.dangerBorder }} title="Remove tab"><Trash2 size={12} /></button>
            </div>
          );
        })}
      </div>
      <button onClick={() => store.addTab({ label: "New Tab", icon: "Home", screenId: "" })} style={{ width: "100%", marginTop: 8, padding: "8px", borderRadius: theme.radius.md, border: `1.5px dashed ${theme.border}`, background: "transparent", color: theme.textSecondary, fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
        <Layout size={12} /> Add Tab
      </button>
    </div>
  );

  const renderPageContent = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {renderSplashCard()}
      <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 11, color: theme.text, marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span>{screen.name || "Screen"} sections</span>
        <span style={{ fontSize: 10, color: theme.textMuted, fontWeight: 400 }}>{bodySections.length}</span>
      </div>
      {bodySections.length === 0 && (
        <div style={{ padding: "28px 12px", textAlign: "center" }}>
          <div style={{ fontSize: 26, opacity: 0.5, marginBottom: 8 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={theme.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
          </div>
          <div style={{ color: theme.textSecondary, fontSize: 12, fontWeight: 600, marginBottom: 4, fontFamily: "'Inter',sans-serif" }}>This page is empty</div>
          <div style={{ color: theme.textMuted, fontSize: 11, lineHeight: 1.5, fontFamily: "'Inter',sans-serif" }}>Add sections from templates or build your own.</div>
        </div>
      )}
      {filteredBody.map((sec, i) => {
        const resolved = store.resolveSection?.(sec) || sec;
        const id = sec.id;
        const isOpen = expanded[id] !== false;
        const isLinked = sec.kind === "saved" && !!sec.libraryId;
        const hidden = sec.visible === false;
        const comps = resolved.components || [];
        return (
          <div key={id} style={{ marginBottom: 1 }}>
            {menuOpen === id && (
              <>
                <div style={{ position: "fixed", inset: 0, zIndex: 39 }} onClick={() => setMenuOpen(null)} />
                <div style={{ position: "absolute", zIndex: 40, right: 40, top: "0px", background: theme.surface, borderRadius: theme.radius.md, boxShadow: theme.shadowLg, border: `1px solid ${theme.border}`, minWidth: 170, overflow: "hidden", padding: 4 }}>
                  {!isLinked && <MenuItem label="Save to library" onClick={() => { store.saveSectionToLibrary(null, id); setMenuOpen(null); }} icon="bookmark" />}
                  {isLinked && <MenuItem label="Detach from library" onClick={() => { store.detachSection(undefined, id); setMenuOpen(null); }} icon="chain" />}
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
            <div
              draggable
              onDragStart={(e) => { e.dataTransfer.setData("sectionId", id); setDragFromId(id); }}
              onDragEnd={() => { setDragOverId(null); setDragFromId(null); }}
              onDragOver={(e) => { e.preventDefault(); setDragOverId(id); }}
              onDragLeave={() => setDragOverId((prev) => (prev === id ? null : prev))}
              onDrop={(e) => handleDrop(e, sec)}
              onClick={() => onSelectSection(id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "7px 6px",
                borderRadius: theme.radius.md,
                cursor: "pointer",
                background: selectedSectionId === id ? theme.hoverAmber : "transparent",
                border: dragOverId === id && dragFromId !== id ? `2px dashed ${theme.selection}` : `1px solid ${selectedSectionId === id ? theme.active : theme.border}`,
                fontFamily: "'Inter',sans-serif",
                fontSize: 12.5,
                color: theme.text,
                transition: `all ${theme.transition}`,
                position: "relative",
                opacity: hidden ? 0.55 : 1,
              }}
              onMouseEnter={(e) => { if (!selectedSectionId || selectedSectionId !== id) e.currentTarget.style.background = theme.hover; }}
              onMouseLeave={(e) => { if (!selectedSectionId || selectedSectionId !== id) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ color: theme.border, cursor: "grab", display: "flex", flexShrink: 0 }}>
                <svg width="10" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="5" r="1.6" /><circle cx="15" cy="5" r="1.6" /><circle cx="9" cy="12" r="1.6" /><circle cx="15" cy="12" r="1.6" /><circle cx="9" cy="19" r="1.6" /><circle cx="15" cy="19" r="1.6" /></svg>
              </span>
              <button onClick={(e) => { e.stopPropagation(); toggleExpand(id); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 1, color: theme.textMuted, display: "flex", flexShrink: 0 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)" }}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <span style={{ width: 22, height: 22, borderRadius: 7, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: theme.hover, border: `1px solid ${theme.borderLight}`, position: "relative", overflow: "hidden", color: theme.textSecondary }}>
                <span style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${shade(sec.backgroundColor || "#FCF8FA", 0.9)}, ${shade(sec.backgroundColor || "#FCF8FA", 0.6)})`, opacity: 0.35 }} />
                {(() => { const Icon = getSectionIcon(resolved.type); return <Icon size={11} style={{ position: "relative", zIndex: 1 }} />; })()}
              </span>
              <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: selectedSectionId === id ? 600 : 500 }}>{sec.name || resolved.name || sec.type}</span>
              {isLinked && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#3B6FE0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>}
              <div style={{ display: "flex", gap: 2, alignItems: "center", flexShrink: 0 }}>
                <button onClick={(e) => { e.stopPropagation(); store.setSectionVisible(null, id, hidden); }} style={{ ...iconBtnSmall, color: hidden ? theme.textMuted : "#374151", background: "none", border: "none", cursor: "pointer", padding: 3, display: "flex" }} title={hidden ? "Hidden — click to show" : "Visible — click to hide"}>{hidden ? <EyeOffSVG /> : <EyeSVG />}</button>
                <button onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === id ? null : id); }} style={{ ...iconBtnSmall, background: "none", border: "none", cursor: "pointer", padding: "3px 6px", color: theme.textMuted, display: "flex" }}><DotsSVG /></button>
              </div>
            </div>
            {isOpen && (
              <div style={{ paddingLeft: 26, marginTop: 1, display: "flex", flexDirection: "column", gap: 1 }}>
                {comps.length === 0 && <div style={{ padding: "6px 8px 6px 24px", color: theme.textMuted, fontSize: 11 }}>No elements yet</div>}
                {renderCompRows(comps, id, 0)}
              </div>
            )}
          </div>
          );
      })}
      {renderTabsUnderContent()}
    </div>
  );

  const renderElements = () => {
    const selectedSection = bodySections.find((s) => s.id === selectedSectionId);
    const hasSection = !!selectedSection;
    const q = addQuery.trim().toLowerCase();

    const filterItems = (items) =>
      items.filter((it) => !q || it.label.toLowerCase().includes(q) || (it.type && it.type.toLowerCase().includes(q)));

    return (
      <div>
        <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 11, color: theme.text, marginBottom: 8 }}>Elements</div>
        {!hasSection && (
          <div style={{ background: theme.hoverAmber, borderRadius: theme.radius.md, padding: 10, marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#6B4200", marginBottom: 2 }}>Select a section first</div>
            <div style={{ fontSize: 10, color: "#92400E", lineHeight: 1.4 }}>Click a section on the canvas or in Page Content to add elements to it.</div>
          </div>
        )}
        <div style={{ position: "relative", marginBottom: 8 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={theme.textMuted} strokeWidth="2.5" style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)" }}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input value={addQuery} onChange={(e) => setAddQuery(e.target.value)} placeholder="Search elements…" style={{ width: "100%", padding: "7px 8px 7px 28px", border: `1px solid ${theme.border}`, borderRadius: theme.radius.md, fontSize: 12, outline: "none", background: theme.surface, color: theme.text }} />
        </div>
        {ELEMENT_GROUPS.map((group) => {
          const items = filterItems(group.items);
          if (items.length === 0) return null;
          const isOpen = q ? true : groupOpen[group.label] === true;
          return (
            <div key={group.label} style={{ marginBottom: 6 }}>
              <button
                onClick={() => setGroupOpen((p) => ({ ...p, [group.label]: !(q ? true : p[group.label] === true) }))}
                style={{ display: "flex", alignItems: "center", gap: 6, width: "100%", background: "none", border: "none", cursor: "pointer", padding: "6px 2px", fontFamily: "'Inter',sans-serif", textAlign: "left" }}
              >
                <span style={{ fontSize: 10, color: theme.textMuted, transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)", display: "inline-flex", transition: `transform ${theme.transition}` }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                </span>
                <span style={{ flex: 1, fontSize: 11, fontWeight: 700, color: theme.text, textTransform: "uppercase", letterSpacing: "0.05em" }}>{group.label}</span>
                <span style={{ fontSize: 9, color: theme.textMuted, background: theme.hover, borderRadius: 8, padding: "0 6px" }}>{items.length}</span>
              </button>
              {isOpen && (
                <div style={{ display: "flex", flexDirection: "column", gap: 1, marginTop: 2 }}>
                  {items.map((it) => {
                    const comingSoon = !it.type && !it.special;
                    const isActive = browseType === it.label;
                    const IconCmp = ELEMENT_ICON_MAP[it.label] || Square;
                    return (
                      <button
                        key={it.label}
                        onClick={() => {
                          if (it.special === "section") onAddSection?.();
                          else onBrowse?.(it.label);
                        }}
                        title={comingSoon ? "Coming soon" : it.label}
                        style={{
                          display: "flex", alignItems: "center", gap: 8, width: "100%",
                          padding: "4px 6px", borderRadius: theme.radius.sm,
                          border: isActive ? `1px solid ${theme.active}` : "1px solid transparent",
                          background: isActive ? theme.hoverAmber : "transparent",
                          cursor: "pointer", textAlign: "left",
                          fontSize: 12.5, fontWeight: isActive ? 700 : 500, color: comingSoon ? theme.textMuted : theme.text,
                          fontFamily: "'Inter',sans-serif", opacity: comingSoon ? 0.6 : 1,
                          transition: `background ${theme.transition}`,
                        }}
                        onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = theme.hover; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = isActive ? theme.hoverAmber : "transparent"; }}
                      >
                        <span style={{ width: 16, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: comingSoon ? theme.textMuted : theme.textSecondary }}>
                          <IconCmp size={14} strokeWidth={2} />
                        </span>
                        <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{it.label}</span>
                        {comingSoon && (
                          <span style={{ fontSize: 8, fontWeight: 700, color: "#92400E", background: theme.hoverAmber, borderRadius: 6, padding: "2px 6px", flexShrink: 0, textTransform: "uppercase", letterSpacing: "0.04em" }}>Soon</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderComingSoon = (title) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 16px", textAlign: "center", height: "300px" }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: theme.hover, display: "flex", alignItems: "center", justifyContent: "center", color: theme.textMuted, marginBottom: 12 }}><Construction size={24} /></div>
      <div style={{ fontWeight: 700, fontSize: 14, color: theme.text, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 12, color: theme.textMuted, lineHeight: 1.5 }}>Coming soon — this feature is under construction.</div>
    </div>
  );

  const renderTemplates = () => (
    <div>
      <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 11, color: theme.text, marginBottom: 8 }}>Page Templates</div>
      <TemplateGallery value={null} onChange={handleLoadTemplate} isMobile={false} loading={loadingTemplate} />
    </div>
  );

  const renderSettings = () => (
    <div>
      <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 11, color: theme.text, marginBottom: 12 }}>Settings</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ border: `1px solid ${theme.border}`, borderRadius: theme.radius.md, padding: 12, background: theme.surface }}>
          <div style={{ fontWeight: 700, fontSize: 10, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 10 }}>App Data</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: theme.textSecondary, minWidth: 60 }}>Logo</label>
              <div onClick={() => document.getElementById("left-logo-upload")?.click()} style={{ width: 44, height: 44, borderRadius: theme.radius.md, border: `2px dashed ${theme.border}`, background: meta.logo ? `url(${meta.logo}) center/cover no-repeat` : theme.hover, cursor: "pointer", flexShrink: 0 }} />
              <input id="left-logo-upload" type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const file = e.target.files?.[0]; if (!file || file.size > 5 * 1024 * 1024) return; const reader = new FileReader(); reader.onload = (ev) => store.setMeta({ logo: ev.target.result }); reader.readAsDataURL(file); }} />
              {meta.logo && <button onClick={() => store.setMeta({ logo: null })} style={{ fontSize: 10, padding: "4px 8px", border: `1px solid ${theme.dangerBorder}`, borderRadius: theme.radius.sm, background: theme.dangerLight, color: theme.danger, cursor: "pointer" }}>Remove</button>}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: theme.textSecondary, minWidth: 60 }}>Name</label>
              <input value={meta.appName || ""} onChange={(e) => store.setMeta({ appName: e.target.value })} placeholder="App Name" style={{ flex: 1, border: `1px solid ${theme.border}`, borderRadius: theme.radius.sm, padding: "6px 10px", fontSize: 12, outline: "none" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: theme.textSecondary, minWidth: 60 }}>Category</label>
              <input value={meta.category || ""} onChange={(e) => store.setMeta({ category: e.target.value })} placeholder="Category" style={{ flex: 1, border: `1px solid ${theme.border}`, borderRadius: theme.radius.sm, padding: "6px 10px", fontSize: 12, outline: "none" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: theme.textSecondary, minWidth: 60 }}>Primary</label>
              <ColorInput value={meta.primaryColor || "#1A1A2E"} onChange={(v) => store.setMeta({ primaryColor: v })} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderVersionHistory = () => (
    <div>
      <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 11, color: theme.text, marginBottom: 4 }}>Version History</div>
      <div style={{ fontSize: 11, color: theme.textMuted, marginBottom: 12, lineHeight: 1.4 }}>Local releases. TODO: backend endpoint <code style={{ background: theme.hover, padding: "1px 4px", borderRadius: 4 }}>/api/v1/releases</code></div>
      {localReleases.length === 0 ? (
        <div style={{ textAlign: "center", padding: 24, color: theme.textMuted, fontSize: 12 }}>No releases yet.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {localReleases.map((rel) => (
            <div key={rel.id} style={{ padding: "10px 12px", borderRadius: theme.radius.md, background: rel.status === "published" ? "#F0FDF4" : "#F9FAFB", border: `1px solid ${rel.status === "published" ? "#BBF7D0" : theme.border}`, display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: theme.text }}>v{rel.version}</span>
                <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 999, background: rel.status === "published" ? "#D1FAE5" : "#E5E7EB", color: rel.status === "published" ? "#065F46" : theme.textMuted, fontWeight: 600 }}>{rel.status}</span>
              </div>
              <div style={{ fontSize: 11, color: theme.textMuted }}>{new Date(rel.timestamp).toLocaleString()}</div>
              <div style={{ fontSize: 11, color: theme.textSecondary }}>{rel.changes}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "page-content": return renderPageContent();
      case "element": return renderElements();
      case "third-party": return renderComingSoon("Third Party Elements");
      case "templates": return renderTemplates();
      case "settings": return renderSettings();
      case "version-history": return renderVersionHistory();
      case "live-chat": return renderComingSoon("Live Chat");
      default: return renderPageContent();
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "68px 1fr", height: "100%", minHeight: 0, overflow: "hidden" }}>
      {/* Column 1 — 68px tabs */}
      <div style={{ background: "#FAFAFB", borderRight: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", padding: "6px 2px", gap: 2, overflowY: "auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {TABS_TOP.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); if (tab.id !== "element") onBrowse?.(null); }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  padding: "8px 2px",
                  borderRadius: theme.radius.md,
                  border: isActive ? `1px solid ${theme.active}` : "1px solid transparent",
                  background: isActive ? theme.hoverAmber : "transparent",
                  cursor: "pointer",
                  transition: `all ${theme.transition}`,
                }}
              >
                <Icon active={isActive} />
                <span style={{ fontSize: 9, fontWeight: isActive ? 700 : 500, color: isActive ? "#1A1A2E" : theme.textSecondary, textAlign: "center", lineHeight: 1.2 }}>{tab.label}</span>
              </button>
            );
          })}
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 4, borderTop: `1px solid ${theme.borderLight}`, paddingTop: 8, marginTop: 8 }}>
          {TABS_BOTTOM.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); if (tab.id !== "element") onBrowse?.(null); }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  padding: "8px 2px",
                  borderRadius: theme.radius.md,
                  border: isActive ? `1px solid ${theme.active}` : "1px solid transparent",
                  background: isActive ? theme.hoverAmber : "transparent",
                  cursor: "pointer",
                  transition: `all ${theme.transition}`,
                }}
              >
                <Icon active={isActive} />
                <span style={{ fontSize: 9, fontWeight: isActive ? 700 : 500, color: isActive ? "#1A1A2E" : theme.textSecondary, textAlign: "center", lineHeight: 1.2 }}>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Column 2 — content */}
      <div style={{ overflowY: "auto", padding: "10px 8px", background: theme.surface, minWidth: 0 }}>{renderTabContent()}</div>
    </div>
  );
}

/* ── small building blocks ── */
function MenuItem({ label, onClick, icon, danger, disabled }) {
  const { theme } = useEditorTheme();
  return (
    <button onClick={() => { if (!disabled) onClick(); }} disabled={disabled} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "7px 10px", border: "none", background: "none", cursor: disabled ? "not-allowed" : "pointer", fontSize: 12, fontFamily: "'Inter',sans-serif", color: danger ? theme.danger : theme.textSecondary, opacity: disabled ? 0.35 : 1, textAlign: "left", borderRadius: theme.radius.sm, transition: `background ${theme.transition}` }} onMouseEnter={(e) => (e.currentTarget.style.background = theme.hover)} onMouseLeave={(e) => (e.currentTarget.style.background = "none")}>
      <MenuIcon name={icon} color={danger ? theme.danger : "#6B7280"} />
      {label}
    </button>
  );
}
function MenuIcon({ name, color }) {
  const common = { width: 12, height: 12, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "bookmark": return <svg {...common}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>;
    case "chain": return <svg {...common}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>;
    case "edit": return <svg {...common}><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>;
    case "copy": return <svg {...common}><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>;
    case "up": return <svg {...common}><polyline points="18 15 12 9 6 15" /></svg>;
    case "down": return <svg {...common}><polyline points="6 9 12 15 18 9" /></svg>;
    case "trash": return <svg {...common}><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>;
    default: return null;
  }
}
const EyeSVG = () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>);
const DotsSVG = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="19" cy="12" r="1.8" /></svg>);
const EyeOffSVG = () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>);
function shade(hex, factor) { const h = hex.replace("#", ""); const nums = h.length === 3 ? h.split("").map((c) => c + c) : h.match(/.{2}/g); if (!nums || nums.length < 3) return "#FFFFFF"; const r = Math.round(parseInt(nums[0], 16) * factor); const g = Math.round(parseInt(nums[1], 16) * factor); const b = Math.round(parseInt(nums[2], 16) * factor); return `rgb(${r}, ${g}, ${b})`; }
function isEmptySub(sub, comp) { const val = comp?.props?.[sub.key]; if (sub.kind === "color") return !val; if (sub.kind === "json") return !val; return val === "" || val === undefined || val === null; }
function subPreview(sub, comp) { const val = comp.props?.[sub.key]; if (sub.kind === "color") return val || "default"; if (sub.kind === "json") return val ? "configured" : ""; const sv = (val || "").toString(); return sv.length > 16 ? sv.slice(0, 16) + "…" : sv; }
function ColorDot({ color }) { return <span style={{ width: 10, height: 10, borderRadius: "50%", background: color.indexOf("#") === 0 ? color : `linear-gradient(135deg, ${color}, #888)`, border: "1px solid rgba(0,0,0,0.12)", display: "inline-block" }} />; }
