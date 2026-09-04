const types = {};

import {
  OrderHistory, InfoList, ReportAction, NotificationList, PrimaryButton,
  CalendarStrip, SlotGrid, BookingSummary, CartSummary, AddressForm,
  LaundryBooking,
  SectionHeader as TemplateSectionHeader,
} from "../../template/TemplateComponents";
import { EmptyState as RegistryEmptyState, DynamicCard as RegistryDynamicCard } from "../../../runtime/ComponentRegistry";
import {
  Home, Star, Heart, ShoppingBag, ShoppingCart, Menu, MapPin, Bell, User,
  Clock, Calendar, Wallet, Settings, Phone, Camera, Gift, Info, Check, X, Plus, Minus,
  Trash2, ChevronRight, ChevronLeft, ChevronDown, ChevronUp, ArrowRight,
  ArrowLeft, ArrowUp, ArrowDown, Search, Circle, Type, Image as ImageIcon, Video,
  LayoutGrid, Rows3, Palette, Zap, Hash, ArrowLeftRight, ArrowDownUp,
  Sparkles, Compass, FileText, BarChart3, ClipboardList, Scissors,
  ToggleLeft, CheckSquare, Pencil, Boxes, GalleryHorizontal, CreditCard, PanelTop, List, AlignLeft,
  Tag,
  Square,
} from "lucide-react";

export function registerComponentType(typeName, def) {
  types[typeName] = def;
}

export function getComponentType(typeName) {
  return types[typeName];
}

export function getAllComponentTypes() {
  return Object.values(types);
}

export function getTypeNames() {
  return Object.keys(types);
}

/* ── Component taxonomy (Figma-style category folders) ── */
export const COMPONENT_CATEGORIES = [
  { key: "buttons", label: "Buttons & Actions", icon: Square },
  { key: "icons", label: "Icons & Arrows", icon: Sparkles },
  { key: "inputs", label: "Inputs & Forms", icon: Pencil },
  { key: "text", label: "Text & Content", icon: Type },
  { key: "media", label: "Media", icon: ImageIcon },
  { key: "shapes", label: "Shapes & Primitives", icon: Square },
  { key: "layout", label: "Layout & Containers", icon: LayoutGrid },
  { key: "nav", label: "Navigation & Chrome", icon: Compass },
  { key: "commerce", label: "Commerce", icon: ShoppingBag },
  { key: "booking", label: "Booking & Services", icon: Calendar },
  { key: "feedback", label: "Status & Feedback", icon: Bell },
];

export function getComponentsByCategory() {
  return COMPONENT_CATEGORIES.map(cat => ({
    ...cat,
    components: getAllComponentTypes().filter(def => def.category === cat.key),
  }));
}

export const ICON_LIBRARY = {
  Home, Star, Heart, ShoppingBag, ShoppingCart, MapPin, Bell, User,
  Clock, Wallet, Settings, Phone, Camera, Gift, Info, Check, X, Plus, Minus,
  Trash2, ChevronRight, ChevronLeft, ChevronDown, ChevronUp, ArrowRight,
  ArrowLeft, ArrowUp, ArrowDown, Search,
};

export function getLucideIcon(name) {
  return ICON_LIBRARY[name] || Circle;
}

export const FONT_FAMILIES = ["Inter","Sora","Poppins","Roboto","Montserrat","Open Sans","Playfair Display","Georgia","Courier New","System UI"];
export const FONT_WEIGHTS = ["300","400","500","600","700","800"];
export const TEXT_TRANSFORMS = ["none","uppercase","lowercase","capitalize"];
export const FONT_STYLES = ["normal","italic"];

export function textStyleFields(prefix) {
  const p = prefix ? `${prefix}.` : "";
  return [
    { key: `${p}fontFamily`, label: "Font Family", type: "select", options: FONT_FAMILIES, group: "typography" },
    { key: `${p}fontSize`, label: "Font Size", type: "number", group: "typography" },
    { key: `${p}fontWeight`, label: "Font Weight", type: "select", options: FONT_WEIGHTS, group: "typography" },
    { key: `${p}fontStyle`, label: "Font Style", type: "select", options: FONT_STYLES, group: "typography" },
    { key: `${p}lineHeight`, label: "Line Height", type: "number", group: "typography" },
    { key: `${p}letterSpacing`, label: "Letter Spacing", type: "number", group: "typography" },
    { key: `${p}textTransform`, label: "Text Transform", type: "select", options: TEXT_TRANSFORMS, group: "typography" },
    { key: `${p}color`, label: "Color", type: "color", group: "colors" },
  ];
}

export function applyTextStyle(style) {
  if (!style) return {};
  const out = {};
  if (style.fontFamily) out.fontFamily = `'${style.fontFamily}',sans-serif`;
  if (style.fontSize != null && style.fontSize !== "") out.fontSize = Number(style.fontSize);
  if (style.fontWeight) out.fontWeight = style.fontWeight;
  if (style.fontStyle) out.fontStyle = style.fontStyle;
  if (style.lineHeight != null && style.lineHeight !== "") out.lineHeight = Number(style.lineHeight);
  if (style.letterSpacing != null && style.letterSpacing !== "") out.letterSpacing = `${Number(style.letterSpacing)}px`;
  if (style.textTransform && style.textTransform !== "none") out.textTransform = style.textTransform;
  if (style.color) out.color = style.color;
  if (style.alignment) out.textAlign = style.alignment;
  return out;
}

export function resolveTextStyle(props, subKey, defaults) {
  const bag = props?.textStyles?.[subKey] || {};
  const d = defaults || {};
  return {
    fontFamily: bag.fontFamily ?? d.fontFamily,
    fontSize: bag.fontSize ?? d.fontSize,
    fontWeight: bag.fontWeight ?? d.fontWeight,
    fontStyle: bag.fontStyle ?? d.fontStyle,
    lineHeight: bag.lineHeight ?? d.lineHeight,
    letterSpacing: bag.letterSpacing ?? d.letterSpacing,
    textTransform: bag.textTransform ?? d.textTransform,
    color: bag.color ?? d.color,
    alignment: bag.alignment ?? d.alignment,
  };
}

/* Resolve a unified fill value ({type:"color"|"image", value}) — legacy plain hex strings still work. */
export function resolveBackground(bg, fallback = "transparent") {
  if (bg && typeof bg === "object") {
    if (bg.type === "image" && bg.value) return `url(${bg.value}) center/cover no-repeat`;
    return bg.value || fallback;
  }
  return bg || fallback;
}

export function isImageFill(bg) {
  return !!(bg && typeof bg === "object" && bg.type === "image" && bg.value);
}

function numberVal(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function radiusVal(value, fallback) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const tl = Number(value.tl ?? value.topLeft ?? fallback);
    const tr = Number(value.tr ?? value.topRight ?? fallback);
    const br = Number(value.br ?? value.bottomRight ?? fallback);
    const bl = Number(value.bl ?? value.bottomLeft ?? fallback);
    const nums = [tl, tr, br, bl].map(n => Number.isFinite(n) && n >= 0 ? n : fallback);
    if (nums[0] === nums[1] && nums[1] === nums[2] && nums[2] === nums[3]) return nums[0];
    return `${nums[0]}px ${nums[1]}px ${nums[2]}px ${nums[3]}px`;
  }
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

function heroImageValue(props) {
  const fill = props.fill;
  if (fill && typeof fill === "object" && fill.type === "image" && fill.value) return fill.value;
  if (typeof fill === "string") return fill;
  return props.backgroundImage || "";
}

/* Resolve a hero banner background into a CSS background string. Supports the
 * unified {type:"color"|"image", value} shape plus legacy plain color/image strings. */
function heroBackground(props, withImage) {
  const image = heroImageValue(props);
  if (image && withImage !== false) {
    const fit = props.fit === "contain" ? "contain" : "cover";
    return `url(${image}) center/${fit} no-repeat`;
  }
  return `linear-gradient(135deg, ${props.color || "#1A1A2E"}, #15152A)`;
}

registerComponentType("hero_banner", {
  type: "hero_banner",
  label: "Hero Banner",
  icon: ImageIcon,
  category: "media",
  defaultWidth: 390,
  defaultHeight: 200,
  defaultProps: { title: "Welcome", subtitle: "Your tagline here", badge: "Open Now", color: "#1A1A2E", fill: "", fit: "cover", radius: 16, height: 200, variant: "center",
    textStyles: {
      badge: { fontFamily: "Inter", fontSize: 11, fontWeight: "600", fontStyle: "normal", lineHeight: 1.2, letterSpacing: 0, textTransform: "none", color: "#6B4200" },
      title: { fontFamily: "Sora", fontSize: 22, fontWeight: "700", fontStyle: "normal", lineHeight: 1.2, letterSpacing: 0, textTransform: "none", color: "#FFFFFF" },
      subtitle: { fontFamily: "Inter", fontSize: 13, fontWeight: "400", fontStyle: "normal", lineHeight: 1.4, letterSpacing: 0, textTransform: "none", color: "#FFFFFF" },
    }
  },
  subElements: [
    { key: "badge", label: "Badge", icon: Tag, kind: "text", styleable: true },
    { key: "title", label: "Heading", icon: Type, kind: "text", styleable: true },
    { key: "subtitle", label: "Tagline", icon: Type, kind: "text", styleable: true },
    { key: "fill", label: "Background", icon: ImageIcon, kind: "fill" },
    { key: "color", label: "Background Color", icon: Palette, kind: "color" },
  ],
  propFields: [
    { key: "variant", label: "Style", type: "select", options: ["center", "left", "overlay", "split"], group: "layout" },
    { key: "title", label: "Heading", type: "text" },
    { key: "subtitle", label: "Tagline", type: "text" },
    { key: "badge", label: "Badge", type: "text" },
    { key: "fill", label: "Background", type: "bg", group: "background" },
    { key: "color", label: "Background Color", type: "color", group: "background" },
    { key: "fit", label: "Image Fit", type: "select", options: ["cover", "contain"], group: "layout" },
    { key: "radius", label: "Corner Radius", type: "radius", group: "border" },
    { key: "width", label: "Width (px, 0=auto)", type: "number", group: "layout" },
    { key: "height", label: "Banner Height", type: "number", group: "layout" },
  ],
  render: (props) => {
    const radius = radiusVal(props.radius, 16);
    const height = numberVal(props.height, 200);
    const widthVal = props.width != null && Number(props.width) > 0 ? Number(props.width) : "100%";
    const fit = props.fit === "contain" ? "contain" : "cover";
    const variant = props.variant || "center";
    const bgImage = heroImageValue(props);
    const isImageBg = !!bgImage;

    let flex = { textAlign: "center", alignItems: "center" };
    if (variant === "left" || variant === "overlay") flex = { textAlign: "left", alignItems: "flex-start" };

    const showOverlay = variant === "overlay" && isImageBg;
    const splitImage = variant === "split" && isImageBg;

    return (
      <div style={{
        background: splitImage
          ? `linear-gradient(135deg, ${props.color || "#1A1A2E"}, #15152A)`
          : heroBackground(props),
        color: "#fff", borderRadius: radius, height,
        padding: variant === "split" ? 0 : 32,
        width: widthVal, display: "flex", flexDirection: "column",
        justifyContent: "center", ...flex, flexShrink: 0,
        position: "relative", overflow: "hidden",
      }}>
        {splitImage && (
          <img src={bgImage} alt="" style={{
            position: "absolute", right: 0, top: 0, bottom: 0,
            width: "42%", height: "100%", objectFit: fit,
          }} />
        )}
        {showOverlay && (
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(10,10,20,0.1) 0%,rgba(10,10,20,0.7) 100%)" }} />
        )}
        <div style={{ position: "relative", zIndex: 1, maxWidth: splitImage ? "58%" : "100%", width: "100%" }}>
          {props.badge && <span style={Object.assign({}, applyTextStyle(resolveTextStyle(props, "badge", { fontFamily: "Inter", fontSize: 11, fontWeight: "600", fontStyle: "normal", lineHeight: 1.2, letterSpacing: 0, textTransform: "none", color: "#6B4200" })), { background: "#F4A026", padding: "4px 12px", borderRadius: 20, marginBottom: 12, display: "inline-block" })}>{props.badge}</span>}
          {props.title && <div style={Object.assign({}, applyTextStyle(resolveTextStyle(props, "title", { fontFamily: "Sora", fontSize: 22, fontWeight: "700", fontStyle: "normal", lineHeight: 1.2, letterSpacing: 0, textTransform: "none", color: "#FFFFFF" })), { marginBottom: 4 })}>{props.title}</div>}
          {props.subtitle && <div style={Object.assign({}, applyTextStyle(resolveTextStyle(props, "subtitle", { fontFamily: "Inter", fontSize: 13, fontWeight: "400", fontStyle: "normal", lineHeight: 1.4, letterSpacing: 0, textTransform: "none", color: "#FFFFFF" })), { opacity: 0.8 })}>{props.subtitle}</div>}
        </div>
      </div>
    );
  },
});

registerComponentType("menu_item", {
  type: "menu_item",
  label: "Menu Item",
  icon: ShoppingBag,
  category: "commerce",
  defaultWidth: 358,
  defaultHeight: 80,
  defaultProps: { name: "Jollof Rice", price: "₦2,500", desc: "Rich, smoky jollof rice", emoji: "Utensils",
    textStyles: {
      name: { fontFamily: "Inter", fontSize: 14, fontWeight: "600", fontStyle: "normal", lineHeight: 1.3, letterSpacing: 0, textTransform: "none", color: "#1C1B1D" },
      price: { fontFamily: "Sora", fontSize: 14, fontWeight: "700", fontStyle: "normal", lineHeight: 1.2, letterSpacing: 0, textTransform: "none", color: "#1A1A2E" },
      desc: { fontFamily: "Inter", fontSize: 11, fontWeight: "400", fontStyle: "normal", lineHeight: 1.3, letterSpacing: 0, textTransform: "none", color: "#6B7280" },
    }
  },
  subElements: [
    { key: "emoji", label: "Image / Emoji", icon: ImageIcon, kind: "image" },
    { key: "name", label: "Name", icon: Type, kind: "text", styleable: true },
    { key: "price", label: "Price", icon: Tag, kind: "text", styleable: true },
    { key: "desc", label: "Description", icon: Type, kind: "text", styleable: true },
  ],
  propFields: [
    { key: "name", label: "Name", type: "text" },
    { key: "price", label: "Price", type: "text" },
    { key: "desc", label: "Description", type: "text" },
    { key: "emoji", label: "Image / Emoji", type: "text" },
    { key: "width", label: "Width (px, 0=auto)", type: "number", group: "layout" },
    { key: "height", label: "Height (px, 0=auto)", type: "number", group: "layout" },
  ],
  render: (props) => {
    const w = props.width != null && Number(props.width) > 0 ? Number(props.width) : "100%";
    const h = props.height != null && Number(props.height) > 0 ? Number(props.height) : "100%";
    return (
    <div style={{ display: "flex", gap: 12, padding: "12px 16px", background: "#FCF8FA", borderRadius: 12, boxShadow: "0px 2px 12px rgba(0,0,0,0.08)", border: "1px solid rgba(200,197,205,0.3)", width: w, height: h, alignItems: "center" }}>
      <div style={{ width: 48, height: 48, background: "#F1EDEF", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{props.emoji || "Utensils"}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={Object.assign({}, applyTextStyle(resolveTextStyle(props, "name", { fontFamily: "Inter", fontSize: 14, fontWeight: "600", fontStyle: "normal", lineHeight: 1.3, letterSpacing: 0, textTransform: "none", color: "#1C1B1D" })), { marginBottom: 2 })}>{props.name}</div>
        {props.desc && <div style={applyTextStyle(resolveTextStyle(props, "desc", { fontFamily: "Inter", fontSize: 11, fontWeight: "400", fontStyle: "normal", lineHeight: 1.3, letterSpacing: 0, textTransform: "none", color: "#6B7280" }))}>{props.desc}</div>}
      </div>
      <span style={Object.assign({}, applyTextStyle(resolveTextStyle(props, "price", { fontFamily: "Sora", fontSize: 14, fontWeight: "700", fontStyle: "normal", lineHeight: 1.2, letterSpacing: 0, textTransform: "none", color: "#1A1A2E" })), { whiteSpace: "nowrap" })}>{props.price}</span>
    </div>
    );
  },
});

registerComponentType("category_pills", {
  type: "category_pills",
  label: "Category Pills",
  icon: Tag,
  category: "commerce",
  defaultWidth: 358,
  defaultHeight: 48,
  defaultProps: {
    cats: [
      { label: "Popular", active: true },
      { label: "Mains", active: false },
      { label: "Drinks", active: false },
    ],
  },
  subElements: [
    { key: "cats", label: "Categories", icon: Tag, kind: "text" },
  ],
  propFields: [
    {
      key: "cats",
      label: "Categories",
      type: "list",
      fields: [
        { key: "label", label: "Label", type: "text" },
        { key: "active", label: "Active", type: "select", options: ["true", "false"] },
      ],
    },
  ],
  render: (props) => {
    const cats = Array.isArray(props.cats) && props.cats.length
      ? props.cats
      : [{ label: "Popular", active: true }, { label: "Mains", active: false }, { label: "Drinks", active: false }];
    return (
      <div style={{ display: "flex", gap: 8, padding: "6px 0", overflow: "hidden", width: "100%" }}>
        {cats.map((c, i) => {
          const active = c.active === true || c.active === "true" || i === 0;
          return (
            <span key={i} style={{ padding: "6px 16px", borderRadius: 20, background: active ? "#1A1A2E" : "#E5E1E3", color: active ? "#fff" : "#47464C", fontSize: 13, fontWeight: active ? 600 : 500, whiteSpace: "nowrap", fontFamily: "'Inter',sans-serif" }}>{c.label || "Pill"}</span>
          );
        })}
      </div>
    );
  },
});

registerComponentType("text_block", {
  type: "text_block",
  label: "Text",
  icon: Type,
  category: "text",
  defaultWidth: 200,
  defaultHeight: 30,
  defaultProps: { text: "Text", fontSize: 14, fontWeight: "400", fontFamily: "Inter", fontStyle: "normal", lineHeight: 1.4, letterSpacing: 0, textTransform: "none", color: "#1C1B1D", alignment: "left" },
  subElements: [
    { key: "text", label: "Text", icon: Type, kind: "text" },
    { key: "color", label: "Text Color", icon: Palette, kind: "color" },
  ],
  propFields: [
    { key: "text", label: "Content", type: "text" },
    { key: "fontFamily", label: "Font Family", type: "select", options: FONT_FAMILIES, group: "typography" },
    { key: "fontSize", label: "Font Size", type: "number", group: "typography" },
    { key: "fontWeight", label: "Font Weight", type: "select", options: FONT_WEIGHTS, group: "typography" },
    { key: "fontStyle", label: "Font Style", type: "select", options: ["normal", "italic"], group: "typography" },
    { key: "lineHeight", label: "Line Height", type: "number", group: "typography" },
    { key: "letterSpacing", label: "Letter Spacing", type: "number", group: "typography" },
    { key: "textTransform", label: "Text Transform", type: "select", options: ["none", "uppercase", "lowercase", "capitalize"], group: "typography" },
    { key: "color", label: "Color", type: "color", group: "colors" },
    { key: "alignment", label: "Alignment", type: "select", options: ["left", "center", "right"], group: "typography" },
    { key: "width", label: "Width (px, 0=auto)", type: "number", group: "layout" },
    { key: "height", label: "Height (px, 0=auto)", type: "number", group: "layout" },
  ],
  render: (props) => {
    const w = props.width != null && Number(props.width) > 0 ? Number(props.width) : "100%";
    const h = props.height != null && Number(props.height) > 0 ? Number(props.height) : "100%";
    return (
    <div style={{
      fontSize: props.fontSize || 14, fontWeight: props.fontWeight || 400,
      fontStyle: props.fontStyle || "normal",
      fontFamily: props.fontFamily ? `'${props.fontFamily}',sans-serif` : "'Inter',sans-serif",
      color: props.color || "#1C1B1D", textAlign: props.alignment || "left",
      lineHeight: props.lineHeight != null ? Number(props.lineHeight) : 1.4,
      letterSpacing: props.letterSpacing != null ? `${Number(props.letterSpacing)}px` : "normal",
      textTransform: props.textTransform && props.textTransform !== "none" ? props.textTransform : "none",
      padding: "2px 0",
      width: w, height: h, overflow: "hidden",
    }}>{props.text}</div>
    );
  },
});

registerComponentType("image_block", {
  type: "image_block",
  label: "Image",
  icon: ImageIcon,
  category: "media",
  defaultWidth: 200,
  defaultHeight: 200,
  defaultProps: { src: "", alt: "Image", fit: "cover" },
  subElements: [
    { key: "src", label: "Image", icon: ImageIcon, kind: "image" },
    { key: "alt", label: "Alt Text", icon: Type, kind: "text" },
  ],
  propFields: [
    { key: "src", label: "Image URL", type: "text" },
    { key: "alt", label: "Alt Text", type: "text" },
    { key: "fit", label: "Object Fit", type: "select", options: ["cover", "contain", "fill"], group: "layout" },
    { key: "width", label: "Width (px, 0=auto)", type: "number", group: "layout" },
    { key: "height", label: "Height (px, 0=auto)", type: "number", group: "layout" },
  ],
  render: (props) => {
    const w = props.width != null && Number(props.width) > 0 ? Number(props.width) : "100%";
    const h = props.height != null && Number(props.height) > 0 ? Number(props.height) : "100%";
    return (
    <div style={{ width: w, height: h, overflow: "hidden", borderRadius: 8, background: "#F1EDEF", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {props.src ? (
        <img src={props.src} alt={props.alt || ""} style={{ width: "100%", height: "100%", objectFit: props.fit || "cover" }} />
      ) : (
        <span style={{ color: "#9CA3AF", fontSize: 12 }}>No image</span>
      )}
    </div>
    );
  },
});

registerComponentType("rectangle", {
  type: "rectangle",
  label: "Rectangle",
  icon: Square,
  category: "shapes",
  defaultWidth: 100,
  defaultHeight: 100,
  defaultProps: {},
  propFields: [],
  render: () => <div style={{ width: "100%", height: "100%" }} />,
});

registerComponentType("button", {
  type: "button",
  label: "Button",
  icon: Square,
  category: "buttons",
  defaultWidth: 120,
  defaultHeight: 40,
  defaultProps: { label: "Button", color: "#FFFFFF", background: "#1A1A2E", variant: "filled", radius: 10, fontFamily: "Inter", fontSize: 14, fontWeight: "600", textTransform: "none", action: "",
    textStyles: {
      label: { fontFamily: "Inter", fontSize: 14, fontWeight: "600", fontStyle: "normal", lineHeight: 1.25, letterSpacing: 0, textTransform: "none", color: "#FFFFFF" },
    }
  },
  subElements: [
    { key: "label", label: "Label", icon: Type, kind: "text", styleable: true },
    { key: "background", label: "Fill Color", icon: Palette, kind: "color" },
    { key: "action", label: "Action (JSON)", icon: Zap, kind: "json" },
  ],
  propFields: [
    { key: "label", label: "Label", type: "text" },
    { key: "variant", label: "Variant", type: "select", options: ["filled", "outline", "ghost"], group: "layout" },
    { key: "background", label: "Background / Border", type: "color", group: "background" },
    { key: "color", label: "Text Color", type: "color", group: "colors" },
    { key: "radius", label: "Corner Radius", type: "radius", group: "border" },
    { key: "fontFamily", label: "Font Family", type: "select", options: FONT_FAMILIES, group: "typography" },
    { key: "fontSize", label: "Font Size", type: "number", group: "typography" },
    { key: "fontWeight", label: "Font Weight", type: "select", options: FONT_WEIGHTS, group: "typography" },
    { key: "textTransform", label: "Text Transform", type: "select", options: ["none", "uppercase", "lowercase", "capitalize"], group: "typography" },
    { key: "width", label: "Width (px, 0=auto)", type: "number", group: "layout" },
    { key: "height", label: "Height (px, 0=auto)", type: "number", group: "layout" },
    { key: "action", label: "Action (JSON)", type: "json" },
  ],
  render: (props) => {
    const variant = props.variant || "filled";
    const accent = props.background || "#1A1A2E";
    const radius = radiusVal(props.radius, 10);
    const filled = variant === "filled";
    const outlined = variant === "outline";
    const w = props.width != null && Number(props.width) > 0 ? Number(props.width) : "100%";
    const h = props.height != null && Number(props.height) > 0 ? Number(props.height) : "100%";
    return (
      <div style={{
        width: w, height: h,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "0 8px", boxSizing: "border-box",
      }}>
        <span style={{
          display: "inline-block", padding: "10px 24px", borderRadius: radius,
          background: filled ? accent : "transparent",
          border: outlined ? `1.5px solid ${accent}` : "none",
          color: props.color || (filled ? "#FFFFFF" : "#1C1B1D"),
          fontFamily: props.fontFamily ? `'${props.fontFamily}',sans-serif` : "'Inter',sans-serif", fontWeight: props.fontWeight || 600, fontSize: props.fontSize || 14,
          textTransform: props.textTransform && props.textTransform !== "none" ? props.textTransform : "none",
          width: "100%", textAlign: "center", boxSizing: "border-box",
          cursor: "pointer",
        }}>{props.label || "Button"}</span>
      </div>
    );
  },
});

registerComponentType("path", {
  type: "path",
  label: "Vector Path",
  icon: Pencil,
  category: "shapes",
  defaultWidth: 100,
  defaultHeight: 100,
  defaultProps: { d: "M10,50 Q50,10 90,50" },
  propFields: [
    { key: "d", label: "Path Data (d)", type: "text" },
  ],
  render: (props) => {
    const fill = props._fills?.[0]?.color || "transparent";
    const stroke = props._strokes?.[0]?.color || "#1C1B1D";
    const sw = props._strokes?.[0]?.width || 2;
    return (
      <svg width="100%" height="100%" style={{ overflow: "visible" }}>
        <path d={props.d || "M0,0"} fill={fill} stroke={stroke} strokeWidth={sw} />
      </svg>
    );
  },
});

registerComponentType("ellipse", {
  type: "ellipse",
  label: "Ellipse",
  icon: Circle,
  category: "shapes",
  defaultWidth: 120,
  defaultHeight: 120,
  defaultProps: {},
  propFields: [],
  render: (props) => {
    const fillColor = props._fills?.[0]?.color || "#E5E1E3";
    const strokeColor = props._strokes?.[0]?.color || "transparent";
    const strokeW = props._strokes?.[0]?.width || 0;
    return (
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <ellipse cx="50" cy="50" rx="50" ry="50" fill={fillColor} stroke={strokeColor} strokeWidth={strokeW} />
      </svg>
    );
  },
});

registerComponentType("line", {
  type: "line",
  label: "Line",
  icon: Minus,
  category: "shapes",
  defaultWidth: 200,
  defaultHeight: 2,
  defaultProps: {},
  propFields: [],
  render: (props) => {
    const strokeColor = props._strokes?.[0]?.color || "#1C1B1D";
    const strokeW = props._strokes?.[0]?.width || 2;
    return (
      <svg width="100%" height="100%" style={{ overflow: "visible" }}>
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke={strokeColor} strokeWidth={strokeW} />
      </svg>
    );
  },
});

registerComponentType("arrow", {
  type: "arrow",
  label: "Arrow",
  icon: ArrowRight,
  category: "icons",
  defaultWidth: 200,
  defaultHeight: 40,
  defaultProps: {},
  propFields: [],
  render: (props) => {
    const sw = props._strokes?.[0]?.width || 2;
    const strokeColor = props._strokes?.[0]?.color || "#1C1B1D";
    const head = 10 + sw;
    return (
      <svg width="100%" height="100%" style={{ overflow: "visible" }}>
        <defs>
          <marker id={`arrowhead-${head}`} markerWidth={head} markerHeight={head} refX={head} refY={head / 2} orient="auto">
            <polygon points={`0 0, ${head} ${head / 2}, 0 ${head}`} fill={strokeColor} />
          </marker>
        </defs>
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke={strokeColor} strokeWidth={sw} markerEnd={`url(#arrowhead-${head})`} />
      </svg>
    );
  },
});

registerComponentType("divider", {
  type: "divider",
  label: "Divider",
  icon: Minus,
  category: "text",
  defaultWidth: 358,
  defaultHeight: 2,
  defaultProps: { color: "#E5E1E3", thickness: 1 },
  subElements: [
    { key: "color", label: "Line Color", icon: Palette, kind: "color" },
    { key: "thickness", label: "Thickness", icon: Hash, kind: "text" },
  ],
  propFields: [
    { key: "color", label: "Color", type: "color" },
    { key: "thickness", label: "Thickness", type: "number" },
    { key: "width", label: "Width (px, 0=full)", type: "number", group: "layout" },
    { key: "height", label: "Height (px, overrides thickness)", type: "number", group: "layout" },
  ],
  render: (props) => {
    const w = props.width != null && Number(props.width) > 0 ? Number(props.width) : "100%";
    const h = props.height != null && Number(props.height) > 0 ? Number(props.height) : (props.thickness || 1);
    return (
    <div style={{ width: w, height: h, background: props.color || "#E5E1E3" }} />
    );
  },
});

registerComponentType("gap", {
  type: "gap",
  label: "Gap",
  icon: ArrowDownUp,
  category: "layout",
  defaultWidth: 358,
  defaultHeight: 16,
  defaultProps: { height: 16, width: 0, background: "" },
  subElements: [
    { key: "height", label: "Height", icon: ArrowDownUp, kind: "text" },
    { key: "width", label: "Width", icon: ArrowLeftRight, kind: "text" },
  ],
  propFields: [
    { key: "height", label: "Height (px)", type: "number" },
    { key: "width", label: "Width (px)", type: "number" },
    { key: "background", label: "Background Color", type: "color" },
  ],
  render: (props) => {
    const h = props.height != null ? Number(props.height) : 16;
    const w = props.width != null ? Number(props.width) : 0;
    return (
      <div
        style={{
          width: w > 0 ? w : "100%",
          height: h,
          background: props.background || "transparent",
          flexShrink: 0,
          display: "block",
        }}
      />
    );
  },
});

registerComponentType("header_bar", {
  type: "header_bar",
  label: "Header Bar",
  icon: PanelTop,
  category: "nav",
  defaultWidth: 390,
  defaultHeight: 56,
  defaultProps: { logo: null, appName: "My App" },
  subElements: [
    { key: "appName", label: "App Name", icon: Type, kind: "text" },
    { key: "logo", label: "Logo", icon: ImageIcon, kind: "image" },
  ],
  propFields: [
    { key: "appName", label: "App Name", type: "text" },
    { key: "logo", label: "Logo URL", type: "text" },
    { key: "width", label: "Width (px, 0=auto)", type: "number", group: "layout" },
    { key: "height", label: "Height (px, 0=auto)", type: "number", group: "layout" },
  ],
  render: (props) => {
    const w = props.width != null && Number(props.width) > 0 ? Number(props.width) : "100%";
    const h = props.height != null && Number(props.height) > 0 ? Number(props.height) : "100%";
    return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 16px", width: w, height: h }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
        background: props.logo ? `url(${props.logo}) center/cover no-repeat` : "#F1EDEF",
        border: props.logo ? "none" : "2px dashed #D1D5DB",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#9CA3AF",
      }}>
        {!props.logo && <Camera size={14} />}
      </div>
      <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 15, color: "#1C1B1D" }}>
        {props.appName || "App Name"}
      </div>
    </div>
    );
  },
});

registerComponentType("menu_grid", {
  type: "menu_grid",
  label: "Menu Grid",
  icon: ClipboardList,
  category: "commerce",
  defaultWidth: 358,
  defaultHeight: 320,
  defaultProps: {
    columns: 2,
    gap: 12,
    padding: 12,
    background: { type: "color", value: "" },
    imageBackground: "#F1EDEF",
    imageWidth: 0,
    imageHeight: 96,
    iconSize: 26,
    imageFit: "cover",
    imageRadius: 8,
    cardRadius: 12,
    cardShadow: "soft",
    textColor: "#1C1B1D",
    priceColor: "#F4A026",
    items: [
      { name: "Jollof Rice", price: "₦2,500", oldPrice: "", badge: "", desc: "Rich, smoky jollof rice", image: "", emoji: "Utensils", background: { type: "color", value: "#FCF8FA" } },
      { name: "Grilled Chicken", price: "₦3,000", oldPrice: "", badge: "Popular", desc: "Char-grilled, spicy", image: "", emoji: "Drumstick", background: { type: "color", value: "#FCF8FA" } },
      { name: "Chapman", price: "₦1,500", oldPrice: "", badge: "", desc: "Classic mocktail", image: "", emoji: "CupSoda", background: { type: "color", value: "#FCF8FA" } },
      { name: "Fruit Juice", price: "₦1,200", oldPrice: "", badge: "", desc: "Fresh & chilled", image: "", emoji: "GlassWater", background: { type: "color", value: "#FCF8FA" } },
    ],
  },
  subElements: [
    { key: "columns", label: "Columns Per Row", icon: Hash, kind: "text" },
  ],
  propFields: [
    { key: "columns", label: "Columns", type: "number" },
    { key: "gap", label: "Gap (px)", type: "number" },
    { key: "padding", label: "Padding (px)", type: "number" },
    { key: "cardRadius", label: "Card Corner Radius", type: "number" },
    { key: "cardShadow", label: "Card Shadow", type: "select", options: ["none", "soft", "raised"], group: "effects" },
    { key: "background", label: "Background", type: "bg" },
    { key: "imageWidth", label: "Image Width (0 = full)", type: "number" },
    { key: "imageHeight", label: "Image Height", type: "number" },
    { key: "iconSize", label: "Icon Size", type: "number" },
    { key: "imageFit", label: "Image Fit", type: "select", options: ["cover", "contain", "fill"] },
    { key: "imageRadius", label: "Image Corner Radius", type: "number" },
    { key: "imageBackground", label: "Empty Image Color", type: "color" },
    { key: "textColor", label: "Text Color", type: "color" },
    { key: "priceColor", label: "Price Color", type: "color" },
    {
      key: "items",
      label: "Menu Items",
      type: "list",
      fields: [
        { key: "name", label: "Name", type: "text" },
        { key: "price", label: "Price", type: "text" },
        { key: "oldPrice", label: "Old Price", type: "text" },
        { key: "desc", label: "Description", type: "text" },
        { key: "badge", label: "Badge / Tag", type: "text", placeholder: "e.g. Special" },
        { key: "emoji", label: "Emoji", type: "text", placeholder: "Utensils" },
        { key: "image", label: "Image", type: "image" },
        { key: "background", label: "Card Background", type: "bg" },
      ],
    },
  ],
  render: (props) => {
    const cols = Math.max(1, Number(props.columns) || 2);
    const gap = Number(props.gap) || 12;
    const padding = props.padding != null ? Number(props.padding) : 12;
    const imageHeight = props.imageHeight != null ? Number(props.imageHeight) : 96;
    const imageWidth = props.imageWidth != null ? Number(props.imageWidth) : 0;
    const imageRadius = radiusVal(props.imageRadius, 8);
    const cardRadius = radiusVal(props.cardRadius, 12);
    const imageFit = props.imageFit || "cover";
    const SHADOWS = {
      none: "none",
      soft: "0px 2px 12px rgba(0,0,0,0.08)",
      raised: "0px 8px 24px rgba(0,0,0,0.18)",
    };
    const shadow = SHADOWS[props.cardShadow] || SHADOWS.soft;
    const items = Array.isArray(props.items) && props.items.length
      ? props.items
      : [
          { name: "Jollof Rice", price: "₦2,500", desc: "Smoky, rich", emoji: "Utensils" },
          { name: "Grilled Chicken", price: "₦3,000", desc: "Char-grilled", emoji: "Drumstick" },
          { name: "Chapman", price: "₦1,500", desc: "Classic mocktail", emoji: "CupSoda" },
          { name: "Fruit Juice", price: "₦1,200", desc: "Fresh & chilled", emoji: "GlassWater" },
        ];
    return (
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap,
        width: "100%",
        padding,
        boxSizing: "border-box",
        borderRadius: 12,
        background: resolveBackground(props.background, "transparent"),
      }}>
        {items.map((it, i) => {
          const cardBg = resolveBackground(it.background, "#FCF8FA");
          const cardImg = isImageFill(it.background);
          return (
            <div key={i} style={{
              background: cardBg,
              borderRadius: cardRadius,
              padding: 10,
              boxShadow: shadow,
              border: cardImg ? "none" : "1px solid rgba(200,197,205,0.3)",
              textAlign: "center",
              minHeight: 96,
              position: "relative",
              color: props.textColor || "#1C1B1D",
              overflow: "hidden",
            }}>
              {it.badge && (
                <div style={{
                  position: "absolute", top: 6, left: 6, zIndex: 2,
                  background: "#F4A623", color: "#5B3A00", fontSize: 8, fontWeight: 700,
                  padding: "2px 7px", borderRadius: 999, fontFamily: "'Inter',sans-serif",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                }}>{it.badge}</div>
              )}
              {it.image ? (
                <img src={it.image} alt="" style={{
                  width: imageWidth > 0 ? imageWidth : "100%", height: imageHeight, objectFit: imageFit,
                  borderRadius: imageRadius, marginBottom: 6, marginLeft: imageWidth > 0 ? "auto" : 0,
                  marginRight: imageWidth > 0 ? "auto" : 0,
                  background: props.imageBackground || "#F1EDEF", display: "block",
                }} />
              ) : (
                <div style={{
                  fontSize: props.iconSize || 26, marginBottom: 4, lineHeight: 1,
                  background: props.imageBackground || "#FFF",
                  width: imageWidth > 0 ? imageWidth : "100%",
                  height: Math.max(40, imageHeight - 10), borderRadius: imageRadius,
                  marginLeft: imageWidth > 0 ? "auto" : 0,
                  marginRight: imageWidth > 0 ? "auto" : 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{it.emoji || "Utensils"}</div>
              )}
              <div style={{ fontSize: 12, fontWeight: 600, color: props.textColor || "#1C1B1D", lineHeight: 1.25 }}>{it.name || "Item"}</div>
              {it.desc && <div style={{ fontSize: 10.5, color: "#6B7280", lineHeight: 1.3, marginTop: 2 }}>{it.desc}</div>}
              <div style={{ marginTop: 3 }}>
                {it.oldPrice && (
                  <span style={{ fontSize: 10.5, color: "#9CA3AF", fontWeight: 600, textDecoration: "line-through", marginRight: 5 }}>{it.oldPrice}</span>
                )}
                {it.price && <span style={{ fontSize: 11.5, color: props.priceColor || "#F4A026", fontWeight: 700 }}>{it.price}</span>}
              </div>
            </div>
          );
        })}
      </div>
    );
  },
});

registerComponentType("nested_section", {
  type: "nested_section",
  label: "Section (Nested)",
  icon: Boxes,
  category: "layout",
  container: true,
  defaultWidth: 358,
  defaultHeight: 160,
  defaultProps: { backgroundColor: "#FCF8FA", name: "" },
  subElements: [
    { key: "name", label: "Section Name", icon: Type, kind: "text" },
    { key: "backgroundColor", label: "Background", icon: Palette, kind: "color" },
  ],
  propFields: [
    { key: "name", label: "Section Name", type: "text" },
    { key: "backgroundColor", label: "Background Color", type: "color" },
  ],
  render: (props) => (
    <div style={{
      width: "100%", height: "100%",
      background: props.backgroundColor || "#ffffff",
      border: "1.5px dashed rgba(120,110,150,0.35)",
      borderRadius: 12, padding: 10, boxSizing: "border-box",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#9CA3AF", fontSize: 12, fontFamily: "'Inter',sans-serif",
    }}>
      {props.name ? `Section: ${props.name}` : "Nested Section"}
    </div>
  ),
});

registerComponentType("carousel", {
  type: "carousel",
  label: "Carousel",
  icon: GalleryHorizontal,
  category: "layout",
  container: true,
  defaultWidth: 358,
  defaultHeight: 180,
  defaultProps: { autoplay: true, autoplayInterval: 4000, showDots: true, showArrows: true },
  subElements: [
    { key: "showDots", label: "Show Dots", icon: Circle, kind: "text" },
    { key: "showArrows", label: "Show Arrows", icon: ArrowLeftRight, kind: "text" },
  ],
  propFields: [
    { key: "autoplay", label: "Auto-play", type: "select", options: ["true", "false"] },
    { key: "autoplayInterval", label: "Interval (ms)", type: "number" },
    { key: "showDots", label: "Show Dots", type: "select", options: ["true", "false"] },
    { key: "showArrows", label: "Show Arrows", type: "select", options: ["true", "false"] },
  ],
  render: (props, children) => (
    <div style={{
      width: "100%", height: "100%", position: "relative",
      borderRadius: 14, overflow: "hidden",
      border: "1.5px dashed rgba(120,110,180,0.4)",
      background: "rgba(243,244,246,0.6)",
    }}>
      <div style={{
        position: "absolute", top: 6, left: 8, zIndex: 2,
        fontSize: 9, fontWeight: 700, letterSpacing: "0.5px",
        color: "#6B7280", background: "rgba(255,255,255,0.9)",
        padding: "2px 7px", borderRadius: 10, fontFamily: "'Inter',sans-serif",
      }}>
        CAROUSEL
      </div>
      {children || (
        <div style={{
          width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
          color: "#9CA3AF", fontSize: 12, fontFamily: "'Inter',sans-serif",
        }}>
          Add slides (image, text, buttons…) below
        </div>
      )}
      {props.showDots && (
        <div style={{ position: "absolute", bottom: 6, width: "100%", zIndex: 2, display: "flex", gap: 5, justifyContent: "center" }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#1A1A2E", opacity: 0.85 }} />
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#C9C6CF" }} />
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#C9C6CF" }} />
        </div>
      )}
    </div>
  ),
});

function templateType(name, label, icon, height, Comp, category) {
  registerComponentType(name, {
    type: name,
    label,
    icon,
    category: category || "commerce",
    defaultWidth: 358,
    defaultHeight: height,
    defaultProps: {},
    propFields: [],
    render: (props) => <Comp {...props} />,
  });
}

templateType("order_history", "Order History", FileText, 240, OrderHistory, "commerce");
templateType("info_list", "Info List", Info, 200, InfoList, "text");
templateType("report_action", "Report Action", Bell, 140, ReportAction, "feedback");
templateType("notification_list", "Notification List", Bell, 200, NotificationList, "feedback");
templateType("primary_button", "Primary Button", Square, 80, PrimaryButton, "buttons");
templateType("calendar_strip", "Calendar Strip", Calendar, 120, CalendarStrip, "booking");
templateType("slot_grid", "Slot Grid", Clock, 160, SlotGrid, "booking");
templateType("booking_summary", "Booking Summary", ClipboardList, 160, BookingSummary, "booking");
templateType("laundry_booking", "Laundry Booking", ShoppingBag, 520, LaundryBooking, "booking");
templateType("cart_summary", "Cart Summary", ShoppingCart, 160, CartSummary, "commerce");
templateType("address_form", "Address Form", MapPin, 200, AddressForm, "inputs");
registerComponentType("promotion_list", {
  type: "promotion_list",
  label: "Promotion List",
  icon: Tag,
  category: "commerce",
  defaultWidth: 358,
  defaultHeight: 220,
  defaultProps: {
    heading: "Offers & Deals",
    showHeading: "true",
    layout: "scroll",
    columns: 2,
    gap: 12,
    imageHeight: 150,
    imageFit: "cover",
    cardRadius: 14,
    cardPadding: 14,
    cardBackground: { type: "color", value: "#FFFFFF" },
    cardBorder: "none",
    accentColor: "#F4A623",
    titleColor: "#1A1A2E",
    subtitleColor: "#6B7280",
    offers: [
      { title: "50% Off Lunch", subtitle: "Rich, smoky jollof rice every Friday", badge: "50% OFF", emoji: "Utensils", image: "", background: { type: "color", value: "#FFF3E0" } },
      { title: "Buy 1 Get 1", subtitle: "On all char-grilled chicken", badge: "BOGO", emoji: "Drumstick", image: "", background: { type: "color", value: "#FFE8E8" } },
      { title: "Free Delivery", subtitle: "On orders above ₦5,000", badge: "FREE", emoji: "Bike", image: "", background: { type: "color", value: "#E6F4EC" } },
    ],
  },
  subElements: [
    { key: "heading", label: "Heading", icon: Type, kind: "text" },
    { key: "layout", label: "Layout", icon: LayoutGrid, kind: "text" },
  ],
  propFields: [
    { key: "heading", label: "Heading", type: "text" },
    { key: "showHeading", label: "Show Heading", type: "select", options: ["true", "false"] },
    { key: "layout", label: "Layout", type: "select", options: ["scroll", "grid", "stack"] },
    { key: "columns", label: "Columns (grid)", type: "number" },
    { key: "gap", label: "Gap (px)", type: "number" },
    { key: "imageHeight", label: "Image Height", type: "number" },
    { key: "imageFit", label: "Image Fit", type: "select", options: ["cover", "contain", "fill"] },
    { key: "cardRadius", label: "Card Corner Radius", type: "number" },
    { key: "cardPadding", label: "Card Padding", type: "number" },
    { key: "cardBackground", label: "Card Background", type: "bg" },
    { key: "cardBorder", label: "Card Border", type: "select", options: ["none", "soft", "strong"] },
    { key: "accentColor", label: "Accent / Badge Color", type: "color" },
    { key: "titleColor", label: "Title Color", type: "color" },
    { key: "subtitleColor", label: "Subtitle Color", type: "color" },
    {
      key: "offers",
      label: "Promotions",
      type: "list",
      fields: [
        { key: "title", label: "Title", type: "text" },
        { key: "subtitle", label: "Subtitle", type: "text" },
        { key: "badge", label: "Badge", type: "text", placeholder: "e.g. 50% OFF" },
        { key: "emoji", label: "Emoji", type: "text", placeholder: "Utensils" },
        { key: "image", label: "Image", type: "image" },
        { key: "background", label: "Image Card Tone", type: "bg" },
      ],
    },
  ],
  render: (props) => {
    const layout = props.layout || "scroll";
    const cols = Math.max(1, Number(props.columns) || 2);
    const gap = Number(props.gap) || 12;
    const imageHeight = props.imageHeight != null ? Number(props.imageHeight) : 150;
    const fit = props.imageFit || "cover";
    const radius = radiusVal(props.cardRadius, 14);
    const pad = Number(props.cardPadding) || 14;
    const cardBg = resolveBackground(props.cardBackground, "#FFFFFF");
    const accent = props.accentColor || "#F4A623";
    const titleColor = props.titleColor || "#1A1A2E";
    const subtitleColor = props.subtitleColor || "#6B7280";
    const border = props.cardBorder === "strong"
      ? `1.5px solid ${accent}55`
      : props.cardBorder === "soft" ? "1px solid rgba(200,197,205,0.35)" : "none";
    const showHeading = props.showHeading !== "false";

    const list = Array.isArray(props.offers) && props.offers.length
      ? props.offers
      : (Array.isArray(props.items) && props.items.length ? props.items : []);

    if (list.length === 0) {
      return (
        <div style={{ padding: "24px 12px", textAlign: "center", color: "#9CA3AF", fontSize: 11, fontFamily: "'Inter',sans-serif", background: "#F7F5FA", borderRadius: 14, margin: "4px 8px", border: "1px dashed rgba(200,197,205,0.5)" }}>
          Promotion List — add offers in Properties
        </div>
      );
    }

    const renderOffer = (of, i) => {
      const hasImage = !!of.image;
      const ofTone = resolveBackground(of.background, hasImage ? "#F1EDEF" : "#FFF3E0");
      const isImageTone = isImageFill(of.background);
      const mediaBg = isImageTone ? ofTone : (hasImage ? "#F1EDEF" : (resolveBackground(of.background, "#FFF3E0")));
      return (
        <div key={i} style={{
          background: cardBg, borderRadius: radius, overflow: "hidden",
          border, boxShadow: layout === "scroll" ? "0 12px 28px rgba(26,26,46,0.10)" : "0 2px 10px rgba(26,26,46,0.06)",
          display: "flex", flexDirection: "column", height: "100%",
        }}>
          <div style={{
            height: imageHeight, position: "relative",
            background: mediaBg, display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden", flexShrink: 0,
          }}>
            {hasImage
              ? <img src={of.image} alt="" style={{ width: "100%", height: "100%", objectFit: fit, display: "block" }} />
              : <span style={{ fontSize: 36, opacity: 0.9 }}>{of.emoji || "Gift"}</span>}
            {of.badge && (
              <span style={{
                position: "absolute", top: 8, left: 8, background: accent, color: "#5B3A00",
                fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 999,
                fontFamily: "'Inter',sans-serif", boxShadow: "0 1px 3px rgba(0,0,0,0.18)",
              }}>{of.badge}</span>
            )}
          </div>
          <div style={{ padding: pad }}>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 14, color: titleColor, marginBottom: 3, lineHeight: 1.25 }}>
              {of.title || "Promotion"}
            </div>
            {of.subtitle && <div style={{ fontSize: 11, color: subtitleColor, lineHeight: 1.4 }}>{of.subtitle}</div>}
          </div>
        </div>
      );
    };

    const body = layout === "scroll"
      ? <div style={{ display: "flex", gap, overflowX: "auto", paddingBottom: 4 }}>
          {list.map((of, i) => <div key={i} style={{ flex: "0 0 240px", maxWidth: 240 }}>{renderOffer(of, i)}</div>)}
        </div>
      : layout === "stack"
        ? <div style={{ display: "flex", flexDirection: "column", gap }}>
            {list.map((of, i) => renderOffer(of, i))}
          </div>
        : <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap }}>
            {list.map((of, i) => renderOffer(of, i))}
          </div>;

    return (
      <div style={{ padding: "4px 8px", boxSizing: "border-box" }}>
        {showHeading && (
          <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 15, color: titleColor, margin: "6px 4px 10px" }}>
            {props.heading || "Offers & Deals"}
          </div>
        )}
        {body}
      </div>
    );
  },
});

templateType("section_header", "Section Header", Tag, 56, TemplateSectionHeader, "text");
templateType("empty_state", "Empty State", FileText, 160, RegistryEmptyState, "feedback");
templateType("dynamic_card", "Dynamic Card", CreditCard, 120, RegistryDynamicCard, "layout");

registerComponentType("card", {
  type: "card",
  label: "Card",
  icon: CreditCard,
  category: "layout",
  defaultWidth: 358,
  defaultHeight: 160,
  defaultProps: {
    variant: "vertical",
    background: { type: "color", value: "#FFFFFF" },
    radius: 16,
    padding: 16,
    shadow: "soft",
    border: "soft",
    image: "",
    emoji: "Sun",
    imageWidth: 0,
    imageHeight: 150,
    imageFit: "cover",
    imageRadius: 12,
    badge: "FEATURED",
    badgeBackground: "#FFF4DE",
    badgeTextColor: "#8A5A00",
    title: "Summer Collection",
    subtitle: "Brighten up your day with handpicked summer essentials.",
    titleColor: "#1A1A2E",
    subtitleColor: "#6B7280",
    buttonLabel: "",
    buttonBackground: "#1A1A2E",
    buttonTextColor: "#FFFFFF",
    textStyles: {
      title: { fontFamily: "Sora", fontSize: 15, fontWeight: "700", fontStyle: "normal", lineHeight: 1.25, letterSpacing: 0, textTransform: "none", color: "#1A1A2E" },
      subtitle: { fontFamily: "Inter", fontSize: 11.5, fontWeight: "400", fontStyle: "normal", lineHeight: 1.45, letterSpacing: 0, textTransform: "none", color: "#6B7280" },
      badge: { fontFamily: "Inter", fontSize: 9, fontWeight: "700", fontStyle: "normal", lineHeight: 1.2, letterSpacing: 0.5, textTransform: "uppercase", color: "#8A5A00" },
      buttonLabel: { fontFamily: "Inter", fontSize: 12, fontWeight: "600", fontStyle: "normal", lineHeight: 1.2, letterSpacing: 0, textTransform: "none", color: "#FFFFFF" },
    }
  },
  subElements: [
    { key: "title", label: "Title", icon: Type, kind: "text", styleable: true },
    { key: "subtitle", label: "Subtitle", icon: Type, kind: "text", styleable: true },
    { key: "badge", label: "Badge", icon: Tag, kind: "text", styleable: true },
    { key: "background", label: "Background", icon: Palette, kind: "fill" },
  ],
  propFields: [
    { key: "variant", label: "Layout", type: "select", options: ["vertical", "horizontal", "plain"] },
    { key: "background", label: "Background", type: "bg" },
    { key: "radius", label: "Corner Radius", type: "number" },
    { key: "padding", label: "Inner Padding", type: "number" },
    { key: "shadow", label: "Shadow", type: "select", options: ["none", "soft", "raised"] },
    { key: "border", label: "Border", type: "select", options: ["none", "soft", "strong"] },
    { key: "image", label: "Cover Image", type: "image" },
    { key: "emoji", label: "Emoji", type: "text", placeholder: "Sun" },
    { key: "imageWidth", label: "Image Width (0 = full)", type: "number" },
    { key: "imageHeight", label: "Image Height", type: "number" },
    { key: "imageFit", label: "Image Fit", type: "select", options: ["cover", "contain", "fill"] },
    { key: "imageRadius", label: "Image Corner Radius", type: "number" },
    { key: "badge", label: "Badge", type: "text" },
    { key: "badgeBackground", label: "Badge Background", type: "color" },
    { key: "badgeTextColor", label: "Badge Text Color", type: "color" },
    { key: "title", label: "Title", type: "text" },
    { key: "subtitle", label: "Subtitle", type: "text" },
    { key: "titleColor", label: "Title Color", type: "color" },
    { key: "subtitleColor", label: "Subtitle Color", type: "color" },
    { key: "buttonLabel", label: "Button Label", type: "text" },
    { key: "buttonBackground", label: "Button Background", type: "color" },
    { key: "buttonTextColor", label: "Button Text Color", type: "color" },
    { key: "width", label: "Width (px, 0=auto)", type: "number", group: "layout" },
    { key: "height", label: "Height (px, 0=auto)", type: "number", group: "layout" },
  ],
  render: (props) => {
    const variant = props.variant || "vertical";
    const outerW = props.width != null && Number(props.width) > 0 ? Number(props.width) : undefined;
    const outerH = props.height != null && Number(props.height) > 0 ? Number(props.height) : undefined;
    const bg = resolveBackground(props.background, "#FFFFFF");
    const radius = radiusVal(props.radius, 16);
    const pad = props.padding != null ? Number(props.padding) : 14;
    const imageHeight = props.imageHeight != null ? Number(props.imageHeight) : 150;
    const imageWidth = props.imageWidth != null ? Number(props.imageWidth) : 0;
    const fit = props.imageFit || "cover";
    const imageRadius = radiusVal(props.imageRadius, 12);
    const shadow = props.shadow === "none" ? "none"
      : props.shadow === "raised" ? "0 18px 44px rgba(26,26,46,0.18)" : "0 4px 16px rgba(26,26,46,0.08)";
    const border = props.border === "none" ? "none"
      : props.border === "strong" ? "1.5px solid rgba(26,26,46,0.3)" : "1px solid rgba(200,197,205,0.45)";
    const hasImage = !!props.image;
    const badgeBg = props.badgeBackground || "#FFF4DE";
    const badgeText = props.badgeTextColor || "#8A5A00";

    const badgeEl = props.badge ? (
      <span style={Object.assign({ display: "inline-block", alignSelf: "flex-start", background: badgeBg, padding: "3px 9px", borderRadius: 999, marginBottom: 8 }, applyTextStyle(resolveTextStyle(props, "badge", { fontFamily: "Inter", fontSize: 9, fontWeight: "700", fontStyle: "normal", lineHeight: 1.2, letterSpacing: 0.5, textTransform: "uppercase", color: badgeText })))}>
        {props.badge}
      </span>
    ) : null;

    const mediaEl = (
      <div style={{
        height: variant === "plain" ? 64 : imageHeight,
        borderRadius: imageRadius,
        background: hasImage ? "#F1EDEF" : (props.emoji ? badgeBg : "#F1EDEF"),
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden", fontSize: 32, color: badgeText, flexShrink: 0,
        marginBottom: variant === "horizontal" ? 0 : 10,
        marginRight: variant === "horizontal" ? 12 : 0,
        width: imageWidth > 0 ? imageWidth : (variant === "horizontal" ? 120 : "100%"),
      }}>
        {hasImage
          ? <img src={props.image} alt="" style={{ width: "100%", height: "100%", objectFit: fit, display: "block" }} />
          : <span>{props.emoji || "Image"}</span>}
      </div>
    );

    const textEl = (
      <div style={{ display: "flex", flexDirection: "column", alignItems: variant === "plain" ? "center" : "flex-start", textAlign: variant === "plain" ? "center" : "left" }}>
        {badgeEl}
        <div style={Object.assign({ marginBottom: 4 }, applyTextStyle(resolveTextStyle(props, "title", { fontFamily: "Sora", fontSize: 15, fontWeight: "700", fontStyle: "normal", lineHeight: 1.25, letterSpacing: 0, textTransform: "none", color: props.titleColor || "#1A1A2E" })))}>
          {props.title || "Card"}
        </div>
        {props.subtitle && (
          <div style={applyTextStyle(resolveTextStyle(props, "subtitle", { fontFamily: "Inter", fontSize: 11.5, fontWeight: "400", fontStyle: "normal", lineHeight: 1.45, letterSpacing: 0, textTransform: "none", color: props.subtitleColor || "#6B7280" }))}>
            {props.subtitle}
          </div>
        )}
        {props.buttonLabel && (
          <div style={Object.assign({ marginTop: 10, alignSelf: variant === "plain" ? "center" : "flex-start", background: props.buttonBackground || "#1A1A2E", padding: "8px 18px", borderRadius: 999 }, applyTextStyle(resolveTextStyle(props, "buttonLabel", { fontFamily: "Inter", fontSize: 12, fontWeight: "600", fontStyle: "normal", lineHeight: 1.2, letterSpacing: 0, textTransform: "none", color: props.buttonTextColor || "#FFFFFF" })))}>
            {props.buttonLabel}
          </div>
        )}
      </div>
    );

    const inner = variant === "horizontal"
      ? <div style={{ display: "flex", alignItems: "stretch", padding: pad }}>
          {mediaEl}
          <div style={{ flex: 1, minWidth: 0 }}>{textEl}</div>
        </div>
      : <div style={{ padding: variant === "plain" ? pad - 2 : pad }}>
          {variant === "plain"
            ? <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 120 }}>
                <div style={{ marginBottom: 10 }}>{mediaEl}</div>
                {badgeEl}
                {props.title && <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 16, color: props.titleColor || "#1A1A2E", marginBottom: 4, textAlign: "center" }}>{props.title}</div>}
                {props.subtitle && <div style={{ fontSize: 11.5, color: props.subtitleColor || "#6B7280", lineHeight: 1.45, textAlign: "center" }}>{props.subtitle}</div>}
                {props.buttonLabel && (
                  <div style={{ marginTop: 10, background: props.buttonBackground || "#1A1A2E", color: props.buttonTextColor || "#FFFFFF", fontSize: 12, fontWeight: 600, padding: "8px 18px", borderRadius: 999, fontFamily: "'Inter',sans-serif" }}>
                    {props.buttonLabel}
                  </div>
                )}
              </div>
            : <div>{mediaEl}{textEl}</div>}
        </div>;

    return (
      <div style={{ boxSizing: "border-box", width: outerW, height: outerH }}>
        <div style={{ background: bg, borderRadius: radius, boxShadow: shadow, border, overflow: "hidden", width: "100%", height: outerH ? "100%" : undefined }}>
          {inner}
        </div>
      </div>
    );
  },
});

/* ═══════════════ Row / Columns — nestable split-layout container ═══════════════ */

export const ROW_TEMPLATES = {
  "1/1": [1],
  "1/2|1/2": [1, 1],
  "1/3|2/3": [1, 2],
  "2/3|1/3": [2, 1],
  "1/3|1/3|1/3": [1, 1, 1],
};

registerComponentType("row", {
  type: "row",
  label: "Row / Columns",
  icon: LayoutGrid,
  category: "layout",
  container: true,
  defaultWidth: 358,
  defaultHeight: 140,
  defaultProps: {
    template: "1/2|1/2",
    gap: 10,
    padding: 10,
    radius: 12,
    background: { type: "color", value: "" },
  },
  subElements: [
    { key: "template", label: "Split", icon: LayoutGrid, kind: "text" },
    { key: "background", label: "Background", icon: Palette, kind: "fill" },
  ],
  propFields: [
    { key: "template", label: "Split", type: "select", options: Object.keys(ROW_TEMPLATES) },
    { key: "gap", label: "Gap (px)", type: "number" },
    { key: "padding", label: "Padding (px)", type: "number" },
    { key: "radius", label: "Corner Radius", type: "number" },
    { key: "background", label: "Background", type: "bg" },
  ],
  render: (props, children) => {
    const cols = ROW_TEMPLATES[props.template] || [1];
    const N = cols.length;
    const gap = Number(props.gap) || 10;
    const pad = Number(props.padding) || 10;
    const radius = radiusVal(props.radius, 12);
    const items = Array.isArray(children) && children.length ? children : [];
    const colsCss = cols.map(c => `${c}fr`).join(" ");
    return (
      <div style={{ boxSizing: "border-box" }}>
        <div style={{
          background: resolveBackground(props.background, "transparent"),
          borderRadius: radius, padding: pad, minHeight: 64,
          display: "flex", flexDirection: "column", gap,
        }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", color: "#9CA3AF", fontSize: 11, border: "1.5px dashed rgba(200,197,205,0.5)", borderRadius: 12, padding: "20px 8px", fontFamily: "'Inter',sans-serif" }}>
              Row — add components into each slot from Properties
            </div>
          ) : (
            Array.from({ length: Math.ceil(items.length / N) }).map((_, r) => {
              const chunk = items.slice(r * N, r * N + N);
              return (
                <div key={r} style={{ display: "grid", gridTemplateColumns: chunk.length === 1 ? "1fr" : colsCss, gap }}>
                  {chunk}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  },
});

registerComponentType("tabs", {
  type: "tabs",
  label: "Tabs",
  icon: PanelTop,
  category: "navigation",
  container: false,
  defaultWidth: 358,
  defaultHeight: 56,
  defaultProps: {
    position: "top",
    items: [
      { label: "Home", icon: "Home", screenId: "screen_1" },
      { label: "Shop", icon: "Star", screenId: "screen_1" },
    ],
  },
  propFields: [
    { key: "position", label: "Position", type: "select", options: ["top", "bottom"], group: "layout" },
    { key: "items", label: "Tabs (JSON array)", type: "json", group: "data" },
  ],
  render: (props) => {
    const items = Array.isArray(props.items) ? props.items : [];
    const bar = (border) => (
      <div style={{ display: "flex", background: "#fff", ...border }}>
        {items.length === 0 && <div style={{ flex: 1, textAlign: "center", padding: "10px 4px", color: "#9CA3AF", fontSize: 11 }}>No tabs</div>}
        {items.map((it, i) => {
          const Glyph = getLucideIcon(it.icon);
          return (
            <div key={i} style={{ flex: 1, padding: "8px 4px", textAlign: "center", fontSize: 11, color: i === 0 ? "#B45309" : "#6B7280", borderTop: i === 0 ? "2px solid #F4A026" : "2px solid transparent" }}>
              {Glyph ? <div style={{ display: "flex", justifyContent: "center", marginBottom: 2 }}><Glyph size={18} /></div> : null}
              <div>{it.label || `Tab ${i + 1}`}</div>
            </div>
          );
        })}
      </div>
    );
    if (props.position === "bottom") return bar({ borderTop: "1px solid #E5E1E3" });
    return bar({ borderBottom: "1px solid #E5E1E3" });
  },
});

/* ═══════════════ Phase 1 — new mobile building blocks ═══════════════ */

registerComponentType("icon", {
  type: "icon",
  label: "Icon",
  icon: Sparkles,
  category: "icons",
  defaultWidth: 32,
  defaultHeight: 32,
  defaultProps: { name: "Home", size: 24, color: "#1C1B1D" },
  propFields: [
    { key: "name", label: "Icon", type: "select", options: Object.keys(ICON_LIBRARY) },
    { key: "size", label: "Size", type: "number" },
    { key: "color", label: "Color", type: "color", group: "colors" },
  ],
  render: (props) => {
    const Glyph = getLucideIcon(props.name);
    return (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Glyph size={Number(props.size) || 24} color={props.color || "#1C1B1D"} strokeWidth={2} />
      </div>
    );
  },
});

registerComponentType("chevron", {
  type: "chevron",
  label: "Arrow (directional)",
  icon: ArrowLeftRight,
  category: "icons",
  defaultWidth: 40,
  defaultHeight: 40,
  defaultProps: { direction: "right", color: "#1C1B1D", size: 24 },
  propFields: [
    { key: "direction", label: "Direction", type: "select", options: ["right", "left", "up", "down"] },
    { key: "size", label: "Size", type: "number" },
    { key: "color", label: "Color", type: "color" },
  ],
  render: (props) => {
    const ArrowGlyph = { right: ArrowRight, left: ArrowLeft, up: ArrowUp, down: ArrowDown }[props.direction] || ArrowRight;
    return (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <ArrowGlyph size={Number(props.size) || 24} color={props.color || "#1C1B1D"} strokeWidth={2} />
      </div>
    );
  },
});

registerComponentType("icon_button", {
  type: "icon_button",
  label: "Icon Button",
  icon: Square,
  category: "buttons",
  defaultWidth: 44,
  defaultHeight: 44,
  defaultProps: { icon: "Heart", label: "Favorite", color: "#FFFFFF", background: "#1A1A2E", rounded: "true" },
  propFields: [
    { key: "icon", label: "Icon", type: "select", options: Object.keys(ICON_LIBRARY) },
    { key: "label", label: "Label", type: "text" },
    { key: "background", label: "Background", type: "color" },
    { key: "color", label: "Icon Color", type: "color" },
  ],
  render: (props) => {
    const Glyph = getLucideIcon(props.icon);
    const radius = props.rounded === "true" ? 22 : 10;
    return (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: 4, boxSizing: "border-box" }}>
        <div style={{
          width: "100%", height: "100%", borderRadius: radius, background: props.background || "#1A1A2E",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: props.color || "#FFFFFF",
        }}>
          <Glyph size={20} strokeWidth={2} />
        </div>
      </div>
    );
  },
});

registerComponentType("fab", {
  type: "fab",
  label: "Floating Action",
  icon: Plus,
  category: "buttons",
  defaultWidth: 56,
  defaultHeight: 56,
  defaultProps: { icon: "Plus", background: "#F4A026", color: "#1C1B1D" },
  propFields: [
    { key: "icon", label: "Icon", type: "select", options: Object.keys(ICON_LIBRARY) },
    { key: "background", label: "Background", type: "color" },
    { key: "color", label: "Icon Color", type: "color" },
  ],
  render: (props) => {
    const Glyph = getLucideIcon(props.icon);
    return (
      <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "flex-end", alignItems: "flex-end", padding: 8, boxSizing: "border-box" }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%", background: props.background || "#F4A026",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 6px 16px rgba(0,0,0,0.18)", color: props.color || "#1C1B1E",
        }}>
          <Glyph size={22} strokeWidth={2.2} />
        </div>
      </div>
    );
  },
});

registerComponentType("text_input", {
  type: "text_input",
  label: "Text Field",
  icon: Pencil,
  category: "inputs",
  defaultWidth: 358,
  defaultHeight: 64,
  defaultProps: { label: "Full name", placeholder: "Enter text…", value: "", hint: "" },
  propFields: [
    { key: "label", label: "Label", type: "text" },
    { key: "placeholder", label: "Placeholder", type: "text" },
    { key: "value", label: "Default Value", type: "text" },
    { key: "hint", label: "Hint", type: "text" },
  ],
  render: (props) => (
    <div style={{ padding: "8px 16px", boxSizing: "border-box", fontFamily: "'Inter',sans-serif", width: "100%" }}>
      {props.label && <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 }}>{props.label}</div>}
      <div style={{
        border: "1px solid #D1D5DB", borderRadius: 10, padding: "10px 12px",
        background: props.value ? "#FFFFFF" : "#FCFCFD", color: props.value ? "#1C1B1D" : "#9CA3AF",
        fontSize: 13, minHeight: 18,
      }}>{props.value || props.placeholder || "Input"}</div>
      {props.hint && <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 3 }}>{props.hint}</div>}
    </div>
  ),
});

registerComponentType("search_bar", {
  type: "search_bar",
  label: "Search Bar",
  icon: Search,
  category: "inputs",
  defaultWidth: 358,
  defaultHeight: 52,
  defaultProps: { placeholder: "Search menu…" },
  propFields: [
    { key: "placeholder", label: "Placeholder", type: "text" },
  ],
  render: (props) => (
    <div style={{ padding: "8px 16px", boxSizing: "border-box", width: "100%" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 8, border: "1px solid #D1D5DB", borderRadius: 24,
        padding: "9px 14px", background: "#FFFFFF", color: "#9CA3AF", fontSize: 13, fontFamily: "'Inter',sans-serif",
      }}>
        <Search size={15} color="#9CA3AF" />
        <span>{props.placeholder || "Search…"}</span>
      </div>
    </div>
  ),
});

registerComponentType("switch_toggle", {
  type: "switch_toggle",
  label: "Toggle Switch",
  icon: ToggleLeft,
  category: "inputs",
  defaultWidth: 200,
  defaultHeight: 40,
  defaultProps: { label: "Enable notifications", checked: "true", color: "#2ECC71" },
  propFields: [
    { key: "label", label: "Label", type: "text" },
    { key: "checked", label: "State", type: "select", options: ["true", "false"] },
    { key: "color", label: "On Color", type: "color" },
  ],
  render: (props) => {
    const on = props.checked === "true";
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "8px 16px", boxSizing: "border-box", width: "100%", fontFamily: "'Inter',sans-serif" }}>
        <span style={{ fontSize: 13, color: "#1C1B1D", fontWeight: 500 }}>{props.label || "Toggle"}</span>
        <div style={{
          width: 44, height: 26, borderRadius: 13, background: on ? (props.color || "#2ECC71") : "#D1D5DB",
          position: "relative", transition: "all 0.15s", flexShrink: 0,
        }}>
          <div style={{
            position: "absolute", top: 3, left: on ? 21 : 3, width: 20, height: 20, borderRadius: "50%",
            background: "#fff", boxShadow: "0 1px 2px rgba(0,0,0,0.2)", transition: "all 0.15s",
          }} />
        </div>
      </div>
    );
  },
});

registerComponentType("checkbox_row", {
  type: "checkbox_row",
  label: "Checkbox",
  icon: CheckSquare,
  category: "inputs",
  defaultWidth: 240,
  defaultHeight: 36,
  defaultProps: { label: "Remember me", checked: "false", color: "#1A1A2E" },
  propFields: [
    { key: "label", label: "Label", type: "text" },
    { key: "checked", label: "State", type: "select", options: ["true", "false"] },
    { key: "color", label: "Check Color", type: "color" },
  ],
  render: (props) => {
    const on = props.checked === "true";
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 16px", boxSizing: "border-box", width: "100%", fontFamily: "'Inter',sans-serif" }}>
        <div style={{
          width: 20, height: 20, borderRadius: 6, border: `1.5px solid ${on ? (props.color || "#1A1A2E") : "#C8C5CD"}`,
          background: on ? (props.color || "#1A1A2E") : "#fff", color: "#fff", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {on && <Check size={13} strokeWidth={3} />}
        </div>
        <span style={{ fontSize: 13, color: "#1A1B1D", fontWeight: 500 }}>{props.label || "Checkbox"}</span>
      </div>
    );
  },
});

registerComponentType("avatar", {
  type: "avatar",
  label: "Avatar",
  icon: User,
  category: "media",
  defaultWidth: 48,
  defaultHeight: 48,
  defaultProps: { name: "Alex Morgan", image: "", background: "#1A1A2E", color: "#FFFFFF" },
  propFields: [
    { key: "name", label: "Name (for initials)", type: "text" },
    { key: "image", label: "Image URL", type: "text" },
    { key: "backgroundColor", label: "Background", type: "color" },
    { key: "color", label: "Initials Color", type: "color" },
  ],
  render: (props) => {
    const initials = (props.name || "?")
      .split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join("") || "?";
    return (
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: 6, boxSizing: "border-box" }}>
        {props.image ? (
          <div style={{ width: 100, height: 100, minWidth: 40, borderRadius: "50%", background: `url(${props.image}) center/cover no-repeat`, border: "1px solid #E5E1E3" }} />
        ) : (
          <div style={{
            width: "100%", maxWidth: 44, aspectRatio: "1", minWidth: 28, borderRadius: "50%",
            background: props.backgroundColor || "#1A1A2E", color: props.color || "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 700, fontFamily: "'Inter',sans-serif",
          }}>{initials}</div>
        )}
      </div>
    );
  },
});

registerComponentType("badge", {
  type: "badge",
  label: "Badge / Pill",
  icon: Tag,
  category: "feedback",
  defaultWidth: 80,
  defaultHeight: 26,
  defaultProps: { label: "New", color: "#FFFFFF", background: "#2ECC71" },
  propFields: [
    { key: "label", label: "Label", type: "text" },
    { key: "background", label: "Background", type: "color" },
    { key: "color", label: "Text Color", type: "color" },
  ],
  render: (props) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", padding: 4, boxSizing: "border-box" }}>
      <span style={{
        display: "inline-block", padding: "4px 12px", borderRadius: 999,
        background: props.background || "#2E7D32", color: props.color,
        fontSize: 11, fontWeight: 700, fontFamily: "'Inter',sans-serif", whiteSpace: "nowrap",
      }}>{props.label || "Badge"}</span>
    </div>
  ),
});

registerComponentType("progress_bar", {
  type: "progress_bar",
  label: "Progress Bar",
  icon: BarChart3,
  category: "feedback",
  defaultWidth: 358,
  defaultHeight: 24,
  defaultProps: { value: 40, color: "#F4A026", background: "#E5E1E3", showLabel: "false" },
  propFields: [
    { key: "value", label: "Value (0-100)", type: "number" },
    { key: "color", label: "Fill Color", type: "color" },
    { key: "background", label: "Track Color", type: "color" },
    { key: "showLabel", label: "Show %", type: "select", options: ["true", "false"] },
  ],
  render: (props) => {
    const v = Math.max(0, Math.min(100, Number(props.value) || 0));
    return (
      <div style={{ padding: "6px 16px", boxSizing: "border-box", width: "100%" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ flex: 1, height: 8, borderRadius: 999, background: props.background || "#E5E1E3", overflow: "hidden" }}>
            <div style={{ width: `${v}%`, height: "100%", borderRadius: 999, background: props.color || "#F4A026", transition: "width 0.2s" }} />
          </div>
          {props.showLabel === "true" && (
            <span style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", fontFamily: "'Inter',sans-serif" }}>{v}%</span>
          )}
        </div>
      </div>
    );
  },
});

registerComponentType("rating", {
  type: "rating",
  label: "Star Rating",
  icon: Star,
  category: "feedback",
  defaultWidth: 120,
  defaultHeight: 28,
  defaultProps: { value: 4, color: "#F4A644", size: 18 },
  propFields: [
    { key: "value", label: "Stars (1-5)", type: "number" },
    { key: "color", label: "Star Color", type: "color" },
    { key: "size", label: "Size", type: "number" },
    { key: "width", label: "Width (px, 0=auto)", type: "number", group: "layout" },
    { key: "height", label: "Height (px, 0=auto)", type: "number", group: "layout" },
  ],
  render: (props) => {
    const v = Math.max(0, Math.min(5, Math.round(Number(props.value) || 0)));
    const size = Number(props.size) || 18;
    const color = props.color || "#F4A644";
    const w = props.width != null && Number(props.width) > 0 ? Number(props.width) : "100%";
    const h = props.height != null && Number(props.height) > 0 ? Number(props.height) : "100%";
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, width: w, height: h }}>
        {[1, 2, 3, 4, 5].map(i => (
          <Star key={i} size={size} fill={i <= v ? color : "transparent"} color={color} strokeWidth={i <= v ? 1 : 1.6} />
        ))}
      </div>
    );
  },
});

// Auto-inject width/height into layout group for any component that lacks them and is visual
(() => {
  const skip = new Set(["row","nested_section","carousel","gap"]);
  Object.values(types).forEach(def => {
    if (!def || skip.has(def.type)) return;
    if (!Array.isArray(def.propFields)) def.propFields = [];
    const hasW = def.propFields.some(f => f.key === "width");
    const hasH = def.propFields.some(f => f.key === "height");
    if (!hasW) def.propFields.push({ key: "width", label: "Width (px, 0=auto)", type: "number", group: "layout" });
    if (!hasH) def.propFields.push({ key: "height", label: "Height (px, 0=auto)", type: "number", group: "layout" });
  });
})();
