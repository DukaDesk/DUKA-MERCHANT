import { useEditorTheme } from "./editorTheme.jsx";
import { getComponentType, ROW_TEMPLATES, ICON_LIBRARY } from "../canvas-editor/componentTypes";
import { toast } from "react-toastify";
import { Layout, ClipboardList, PanelTop, ChevronDown, Type, AlignLeft, Square, List, Star, Minus, Image as ImageIcon, Video, X, Monitor } from "lucide-react";

/* ── mini visual previews ── */
function RowPreview({ weights, theme }) {
  return (
    <div style={{ display: "flex", gap: 3, width: "100%", height: 42, borderRadius: 6, overflow: "hidden" }}>
      {weights.map((w, i) => (
        <div key={i} style={{ flex: w, background: theme.hover, border: `1px dashed ${theme.border}`, borderRadius: 4 }} />
      ))}
    </div>
  );
}
function TextPreview({ size, weight, theme }) {
  return (
    <div style={{ fontSize: Math.max(9, size * 0.42), fontWeight: weight, lineHeight: 1.15, color: theme.text, whiteSpace: "nowrap", overflow: "hidden" }}>
      {Number(weight) >= 700 ? "Heading" : "Paragraph text sample."}
    </div>
  );
}
function ButtonPreview({ variant, theme }) {
  const accent = theme.active;
  const filled = variant === "filled";
  const outlined = variant === "outline";
  return (
    <div style={{
      padding: "5px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600, fontFamily: "'Inter',sans-serif",
      background: filled ? accent : "transparent",
      color: filled ? "#1A1A2E" : accent,
      border: outlined ? `1px solid ${accent}` : variant === "ghost" ? "none" : `1px solid ${accent}`,
    }}>Button</div>
  );
}
function DividerPreview({ thickness, color, theme }) {
  return <div style={{ width: "100%", height: thickness, background: color || theme.border, borderRadius: 2 }} />;
}
function ImagePreview({ shape, theme }) {
  const ar = { square: "1 / 1", portrait: "3 / 4", landscape: "3 / 2", circle: "1 / 1" }[shape];
  const radius = shape === "circle" ? 999 : 8;
  return (
    <div style={{ width: "100%", aspectRatio: ar, background: theme.hover, border: `1px solid ${theme.border}`, borderRadius: radius, display: "flex", alignItems: "center", justifyContent: "center", color: theme.textMuted, fontSize: 10 }}>IMG</div>
  );
}
function IconPreview({ name, theme }) {
  const Cmp = ICON_LIBRARY[name];
  return (
    <div style={{ width: 38, height: 38, borderRadius: 8, background: theme.hover, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {Cmp ? <Cmp size={18} color={theme.textSecondary} /> : null}
    </div>
  );
}
function ListPreview({ theme }) {
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 5 }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 7px", background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: 3, background: theme.hover }} />
          <div style={{ height: 5, width: i === 2 ? 26 : 46, background: theme.border, borderRadius: 3 }} />
        </div>
      ))}
    </div>
  );
}
function CarouselPreview({ theme }) {
  return (
    <div style={{ display: "flex", gap: 4, width: "100%", height: 42, overflow: "hidden" }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ flex: 1, background: theme.hover, border: `1px dashed ${theme.border}`, borderRadius: 6 }} />
      ))}
    </div>
  );
}
function ScreenPreview({ label, theme }) {
  return (
    <div style={{ width: "100%", aspectRatio: "9 / 16", maxHeight: 56, background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: theme.textMuted, padding: 4, textAlign: "center" }}>{label}</div>
  );
}
function TabsPreview({ position, theme }) {
  return (
    <div style={{ width: "100%" }}>
      <div style={{ fontSize: 9, color: theme.textMuted, marginBottom: 4, textAlign: position === "top" ? "left" : "right" }}>{position === "top" ? "Top" : "Bottom"}</div>
      <div style={{ display: "flex", gap: 6 }}>
        {["Tab 1", "Tab 2"].map((t, i) => (
          <div key={i} style={{ flex: 1, padding: "4px 6px", borderRadius: 6, background: i === 0 ? theme.hoverAmber : "transparent", border: `1px solid ${theme.border}`, fontSize: 9, textAlign: "center", color: i === 0 ? "#B45309" : theme.textMuted }}>{t}</div>
        ))}
      </div>
    </div>
  );
}

const SCREEN_BUILDERS = {
  checkout: () => ([
    { type: "text_block", props: { text: "Checkout", fontSize: 24, fontWeight: "700" } },
    { type: "info_list", props: { items: [{ label: "Item 1", value: "$10" }, { label: "Item 2", value: "$20" }] } },
    { type: "divider", props: {} },
    { type: "text_block", props: { text: "Total: $30", fontSize: 16, fontWeight: "700" } },
    { type: "button", props: { label: "Pay Now", variant: "filled", action: "" } },
  ]),
  sales: () => ([
    { type: "text_block", props: { text: "Sales", fontSize: 24, fontWeight: "700" } },
    { type: "info_list", props: { items: [{ label: "Product A", value: "$15" }, { label: "Product B", value: "$25" }] } },
  ]),
  home: () => ([
    { type: "text_block", props: { text: "Home", fontSize: 24, fontWeight: "700" } },
    { type: "image_block", props: { alt: "Banner" } },
    { type: "button", props: { label: "Shop Now", variant: "filled", action: "" } },
  ]),
  splash: () => ([
    { type: "image_block", props: { alt: "Logo" } },
    { type: "text_block", props: { text: "DukaDesk", fontSize: 28, fontWeight: "800", alignment: "center" } },
    { type: "text_block", props: { text: "Your business, in your pocket", fontSize: 14, alignment: "center", color: "#6B7280" } },
  ]),
};

const ICON_NAMES = ["Star", "Heart", "Bell", "Home", "User", "Settings", "Search", "Mail", "Phone", "Camera", "Check", "Info"];

const GALLERY = {
  Layout: {
    icon: Layout,
    variants: [
      ...Object.keys(ROW_TEMPLATES).map((key) => ({
        id: key, label: key.replace(/\|/g, " | "), type: "row", props: { template: key },
        Preview: (t) => <RowPreview weights={ROW_TEMPLATES[key]} theme={t} />,
      })),
      { id: "carousel", label: "Carousel", type: "carousel", props: {}, Preview: (t) => <CarouselPreview theme={t} /> },
    ],
  },
  "Content List": {
    icon: ClipboardList,
    variants: [{ id: "basic", label: "Basic List", type: "info_list", props: {}, Preview: (t) => <ListPreview theme={t} /> }],
  },
  Tabs: {
    icon: PanelTop,
    variants: [
      { id: "top", label: "Top Tabs", type: "tabs", props: { position: "top" }, Preview: (t) => <TabsPreview position="top" theme={t} /> },
      { id: "bottom", label: "Bottom Tabs", type: "tabs", props: { position: "bottom" }, Preview: (t) => <TabsPreview position="bottom" theme={t} /> },
    ],
  },
  Screens: {
    icon: Monitor,
    screenVariants: [
      { id: "checkout", label: "Checkout", build: SCREEN_BUILDERS.checkout },
      { id: "sales", label: "Sales", build: SCREEN_BUILDERS.sales },
      { id: "home", label: "Home", build: SCREEN_BUILDERS.home },
      { id: "splash", label: "Splash", build: SCREEN_BUILDERS.splash },
    ],
  },
  Accordion: { icon: ChevronDown, comingSoon: true },
  Heading: {
    icon: Type,
    variants: [
      { id: "h1", label: "H1", type: "text_block", props: { text: "Heading 1", fontSize: 32, fontWeight: "800" }, Preview: (t) => <TextPreview size={32} weight={800} theme={t} /> },
      { id: "h2", label: "H2", type: "text_block", props: { text: "Heading 2", fontSize: 26, fontWeight: "700" }, Preview: (t) => <TextPreview size={26} weight={700} theme={t} /> },
      { id: "h3", label: "H3", type: "text_block", props: { text: "Heading 3", fontSize: 20, fontWeight: "600" }, Preview: (t) => <TextPreview size={20} weight={600} theme={t} /> },
    ],
  },
  Paragraph: {
    icon: AlignLeft,
    variants: [
      { id: "sm", label: "Small", type: "text_block", props: { text: "Small paragraph text sample.", fontSize: 12, fontWeight: "400" }, Preview: (t) => <TextPreview size={12} weight={400} theme={t} /> },
      { id: "md", label: "Medium", type: "text_block", props: { text: "Medium paragraph text sample.", fontSize: 14, fontWeight: "400" }, Preview: (t) => <TextPreview size={14} weight={400} theme={t} /> },
      { id: "lg", label: "Large", type: "text_block", props: { text: "Large paragraph text sample.", fontSize: 16, fontWeight: "400" }, Preview: (t) => <TextPreview size={16} weight={400} theme={t} /> },
    ],
  },
  Button: {
    icon: Square,
    variants: [
      { id: "filled", label: "Filled", type: "button", props: { label: "Button", variant: "filled" }, Preview: (t) => <ButtonPreview variant="filled" theme={t} /> },
      { id: "outline", label: "Outline", type: "button", props: { label: "Button", variant: "outline" }, Preview: (t) => <ButtonPreview variant="outline" theme={t} /> },
      { id: "ghost", label: "Ghost", type: "button", props: { label: "Button", variant: "ghost" }, Preview: (t) => <ButtonPreview variant="ghost" theme={t} /> },
    ],
  },
  List: {
    icon: List,
    variants: [{ id: "basic", label: "Basic List", type: "info_list", props: {}, Preview: (t) => <ListPreview theme={t} /> }],
  },
  Icon: {
    icon: Star,
    variants: ICON_NAMES.map((name) => ({
      id: name, label: name, type: "icon", props: { name, size: 24 },
      Preview: (t) => <IconPreview name={name} theme={t} />,
    })),
  },
  Divider: {
    icon: Minus,
    variants: [
      { id: "thin", label: "Thin", type: "divider", props: { thickness: 1 }, Preview: (t) => <DividerPreview thickness={1} theme={t} /> },
      { id: "thick", label: "Thick", type: "divider", props: { thickness: 3 }, Preview: (t) => <DividerPreview thickness={3} theme={t} /> },
      { id: "accent", label: "Accent", type: "divider", props: { thickness: 2, color: "#F4A026" }, Preview: (t) => <DividerPreview thickness={2} color="#F4A026" theme={t} /> },
    ],
  },
  Images: {
    icon: ImageIcon,
    variants: [
      { id: "square", label: "Square", type: "image_block", props: {}, Preview: (t) => <ImagePreview shape="square" theme={t} /> },
      { id: "portrait", label: "Portrait", type: "image_block", props: {}, Preview: (t) => <ImagePreview shape="portrait" theme={t} /> },
      { id: "landscape", label: "Landscape", type: "image_block", props: {}, Preview: (t) => <ImagePreview shape="landscape" theme={t} /> },
      { id: "circle", label: "Circle", type: "image_block", props: {}, Preview: (t) => <ImagePreview shape="circle" theme={t} /> },
    ],
  },
  Video: { icon: Video, comingSoon: true },
};

export default function ElementGallery({ browseType, store, selectedSectionId, onClose }) {
  const { theme } = useEditorTheme();
  const config = GALLERY[browseType];
  const IconCmp = config?.icon || Square;
  const canAdd = Boolean(selectedSectionId);

  const add = (variant) => {
    if (!canAdd) return;
    store.addComponentToSection(selectedSectionId, variant.type, {
      ...(getComponentType(variant.type)?.defaultProps || {}),
      ...variant.props,
    });
    toast.success(`${browseType} added`);
  };

  const addScreenLayout = (variant) => {
    const sid = store.addScreen(null, variant.label);
    store.addBodySection(sid, { name: variant.label, components: variant.build() });
    store.addTab({ label: variant.label, icon: "📱", screenId: sid });
    if (store.setCurrentScreenId) store.setCurrentScreenId(sid);
    toast.success(`${variant.label} screen added`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: 12, borderBottom: `1px solid ${theme.border}`, flexShrink: 0 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: theme.hoverAmber, display: "flex", alignItems: "center", justifyContent: "center", color: "#B45309" }}>
          <IconCmp size={16} />
        </div>
        <div style={{ flex: 1, fontWeight: 700, fontSize: 13, color: theme.text, fontFamily: "'Sora',sans-serif" }}>{browseType}</div>
        <button
          onClick={onClose}
          title="Close"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, borderRadius: 6, border: `1px solid ${theme.border}`, background: theme.surface, color: theme.textSecondary, cursor: "pointer" }}
        >
          <X size={14} />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
        {!canAdd && (
          <div style={{ background: theme.hoverAmber, borderRadius: theme.radius.md, padding: 10, marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#6B4200", marginBottom: 2 }}>Select a section first</div>
            <div style={{ fontSize: 10, color: "#92400E", lineHeight: 1.4 }}>Pick a section on the canvas to add this element.</div>
          </div>
        )}

        {config?.screenVariants ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {config.screenVariants.map((v) => (
              <button
                key={v.id}
                onClick={() => addScreenLayout(v)}
                style={{
                  display: "flex", flexDirection: "column", gap: 8, alignItems: "stretch",
                  padding: 10, borderRadius: theme.radius.md, cursor: "pointer",
                  border: `1px solid ${theme.border}`, background: theme.surface, textAlign: "left",
                  transition: `box-shadow ${theme.transition}, border-color ${theme.transition}`,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = theme.active; e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ height: 56, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>
                  <ScreenPreview label={v.label} theme={theme} />
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: theme.text, textAlign: "center" }}>{v.label}</div>
              </button>
            ))}
          </div>
        ) : config?.comingSoon ? (
          <div style={{ textAlign: "center", padding: "40px 12px", color: theme.textMuted, fontSize: 12 }}>
            <div style={{ marginBottom: 8, display: "flex", justifyContent: "center" }}><IconCmp size={28} /></div>
            {browseType} is coming soon.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {config?.variants?.map((v) => (
              <button
                key={v.id}
                onClick={() => add(v)}
                disabled={!canAdd}
                style={{
                  display: "flex", flexDirection: "column", gap: 8, alignItems: "stretch",
                  padding: 10, borderRadius: theme.radius.md, cursor: canAdd ? "pointer" : "not-allowed",
                  border: `1px solid ${theme.border}`, background: theme.surface, textAlign: "left",
                  opacity: canAdd ? 1 : 0.55, transition: `box-shadow ${theme.transition}, border-color ${theme.transition}`,
                }}
                onMouseEnter={(e) => { if (canAdd) { e.currentTarget.style.borderColor = theme.active; e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.08)"; } }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ height: 56, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>
                  {v.Preview(theme)}
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: theme.text, textAlign: "center" }}>{v.label}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
