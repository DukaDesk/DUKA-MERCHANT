const types = {};

import {
  OrderHistory, InfoList, ReportAction, NotificationList, PrimaryButton,
  CalendarStrip, SlotGrid, BookingSummary, CartSummary, AddressForm,
  PromotionList, SectionHeader as TemplateSectionHeader,
} from "../../template/TemplateComponents";
import { EmptyState as RegistryEmptyState, DynamicCard as RegistryDynamicCard } from "../../../runtime/ComponentRegistry";
import {
  Home, Star, Heart, ShoppingBag, ShoppingCart, Menu, MapPin, Bell, User,
  Clock, Wallet, Settings, Phone, Camera, Gift, Info, Check, X, Plus, Minus,
  Trash2, ChevronRight, ChevronLeft, ChevronDown, ChevronUp, ArrowRight,
  ArrowLeft, ArrowUp, ArrowDown, Search, Circle,
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
  { key: "buttons", label: "Buttons & Actions", icon: "\uD83D\uDD18" },
  { key: "icons", label: "Icons & Arrows", icon: "\u2728" },
  { key: "inputs", label: "Inputs & Forms", icon: "\u270D\uFE0F" },
  { key: "text", label: "Text & Content", icon: "Aa" },
  { key: "media", label: "Media", icon: "\uD83D\uDDBC\uFE0F" },
  { key: "shapes", label: "Shapes & Primitives", icon: "\u25AC" },
  { key: "layout", label: "Layout & Containers", icon: "\uD83E\uDDF0" },
  { key: "nav", label: "Navigation & Chrome", icon: "\uD83E\uDDED" },
  { key: "commerce", label: "Commerce", icon: "\uD83D\uDED2" },
  { key: "booking", label: "Booking & Services", icon: "\uD83D\uDCC5" },
  { key: "feedback", label: "Status & Feedback", icon: "\uD83C\uDFF7\uFE0F" },
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

registerComponentType("hero_banner", {
  type: "hero_banner",
  label: "Hero Banner",
  icon: "🖼️",
  category: "media",
  defaultWidth: 390,
  defaultHeight: 200,
  defaultProps: { title: "Welcome", subtitle: "Your tagline here", badge: "Open Now", color: "#1A1A2E", backgroundImage: "" },
  subElements: [
    { key: "badge", label: "Badge", icon: "🏷️", kind: "text" },
    { key: "title", label: "Heading", icon: "T", kind: "text" },
    { key: "subtitle", label: "Tagline", icon: "Aa", kind: "text" },
    { key: "backgroundImage", label: "Background Image", icon: "🖼️", kind: "image" },
    { key: "color", label: "Background Color", icon: "🎨", kind: "color" },
  ],
  propFields: [
    { key: "title", label: "Heading", type: "text" },
    { key: "subtitle", label: "Tagline", type: "text" },
    { key: "badge", label: "Badge", type: "text" },
    { key: "backgroundImage", label: "Background Image", type: "image" },
    { key: "color", label: "Background Color", type: "color" },
  ],
  render: (props) => (
    <div style={{
      background: props.backgroundImage
        ? `url(${props.backgroundImage}) center/cover no-repeat`
        : `linear-gradient(135deg, ${props.color || "#1A1A2E"}, #15152A)`,
      color: "#fff", borderRadius: 16, padding: 32, textAlign: "center",
      width: "100%", height: "100%", display: "flex", flexDirection: "column",
      justifyContent: "center", alignItems: "center",
    }}>
      {props.badge && <span style={{ fontSize: 11, fontWeight: 600, background: "#F4A026", color: "#6B4200", padding: "4px 12px", borderRadius: 20, marginBottom: 12, display: "inline-block" }}>{props.badge}</span>}
      {props.title && <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 22, marginBottom: 4 }}>{props.title}</div>}
      {props.subtitle && <div style={{ fontSize: 13, opacity: 0.8 }}>{props.subtitle}</div>}
    </div>
  ),
});

registerComponentType("menu_item", {
  type: "menu_item",
  label: "Menu Item",
  icon: "🍽️",
  category: "commerce",
  defaultWidth: 358,
  defaultHeight: 80,
  defaultProps: { name: "Jollof Rice", price: "₦2,500", desc: "Rich, smoky jollof rice", emoji: "🍛" },
  subElements: [
    { key: "emoji", label: "Image / Emoji", icon: "🖼️", kind: "image" },
    { key: "name", label: "Name", icon: "T", kind: "text" },
    { key: "price", label: "Price", icon: "₦", kind: "text" },
    { key: "desc", label: "Description", icon: "Aa", kind: "text" },
  ],
  propFields: [
    { key: "name", label: "Name", type: "text" },
    { key: "price", label: "Price", type: "text" },
    { key: "desc", label: "Description", type: "text" },
    { key: "emoji", label: "Image / Emoji", type: "text" },
  ],
  render: (props) => (
    <div style={{ display: "flex", gap: 12, padding: "12px 16px", background: "#FCF8FA", borderRadius: 12, boxShadow: "0px 2px 12px rgba(0,0,0,0.08)", border: "1px solid rgba(200,197,205,0.3)", width: "100%", height: "100%", alignItems: "center" }}>
      <div style={{ width: 48, height: 48, background: "#F1EDEF", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{props.emoji || "🍽️"}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: "#1C1B1D", marginBottom: 2 }}>{props.name}</div>
        {props.desc && <div style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.3 }}>{props.desc}</div>}
      </div>
      <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 14, color: "#1A1A2E", whiteSpace: "nowrap" }}>{props.price}</span>
    </div>
  ),
});

registerComponentType("category_pills", {
  type: "category_pills",
  label: "Category Pills",
  icon: "🏷️",
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
    { key: "cats", label: "Categories", icon: "🏷️", kind: "text" },
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
  icon: "Aa",
  category: "text",
  defaultWidth: 200,
  defaultHeight: 30,
  defaultProps: { text: "Text", fontSize: 14, fontWeight: 400, color: "#1C1B1D", alignment: "left" },
  subElements: [
    { key: "text", label: "Text", icon: "Aa", kind: "text" },
    { key: "color", label: "Text Color", icon: "🎨", kind: "color" },
  ],
  propFields: [
    { key: "text", label: "Content", type: "text" },
    { key: "fontSize", label: "Font Size", type: "number" },
    { key: "fontWeight", label: "Font Weight", type: "number" },
    { key: "color", label: "Color", type: "color" },
    { key: "alignment", label: "Alignment", type: "select", options: ["left", "center", "right"] },
  ],
  render: (props) => (
    <div style={{
      fontSize: props.fontSize || 14, fontWeight: props.fontWeight || 400,
      color: props.color || "#1C1B1D", textAlign: props.alignment || "left",
      fontFamily: "'Inter',sans-serif", padding: "2px 0", lineHeight: 1.4,
      width: "100%", height: "100%", overflow: "hidden",
    }}>{props.text}</div>
  ),
});

registerComponentType("image_block", {
  type: "image_block",
  label: "Image",
  icon: "🖼️",
  category: "media",
  defaultWidth: 200,
  defaultHeight: 200,
  defaultProps: { src: "", alt: "Image", fit: "cover" },
  subElements: [
    { key: "src", label: "Image", icon: "🖼️", kind: "image" },
    { key: "alt", label: "Alt Text", icon: "Aa", kind: "text" },
  ],
  propFields: [
    { key: "src", label: "Image URL", type: "text" },
    { key: "alt", label: "Alt Text", type: "text" },
    { key: "fit", label: "Object Fit", type: "select", options: ["cover", "contain", "fill"] },
  ],
  render: (props) => (
    <div style={{ width: "100%", height: "100%", overflow: "hidden", borderRadius: 8, background: "#F1EDEF", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {props.src ? (
        <img src={props.src} alt={props.alt || ""} style={{ width: "100%", height: "100%", objectFit: props.fit || "cover" }} />
      ) : (
        <span style={{ color: "#9CA3AF", fontSize: 12 }}>No image</span>
      )}
    </div>
  ),
});

registerComponentType("rectangle", {
  type: "rectangle",
  label: "Rectangle",
  icon: "▬",
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
  icon: "🔘",
  category: "buttons",
  defaultWidth: 120,
  defaultHeight: 40,
  defaultProps: { label: "Button", color: "#FFFFFF", background: "#1A1A2E", variant: "filled", radius: 10, action: "" },
  subElements: [
    { key: "label", label: "Label", icon: "T", kind: "text" },
    { key: "background", label: "Fill Color", icon: "🎨", kind: "color" },
    { key: "action", label: "Action (JSON)", icon: "⚡", kind: "json" },
  ],
  propFields: [
    { key: "label", label: "Label", type: "text" },
    { key: "variant", label: "Variant", type: "select", options: ["filled", "outline", "ghost"] },
    { key: "background", label: "Background / Border", type: "color" },
    { key: "color", label: "Text Color", type: "color" },
    { key: "radius", label: "Corner Radius", type: "number" },
    { key: "action", label: "Action (JSON)", type: "json" },
  ],
  render: (props) => {
    const variant = props.variant || "filled";
    const accent = props.background || "#1A1A2E";
    const radius = props.radius != null ? Number(props.radius) : 10;
    const filled = variant === "filled";
    const outlined = variant === "outline";
    return (
      <div style={{
        width: "100%", height: "100%",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "0 8px", boxSizing: "border-box",
      }}>
        <span style={{
          display: "inline-block", padding: "10px 24px", borderRadius: radius,
          background: filled ? accent : "transparent",
          border: outlined ? `1.5px solid ${accent}` : "none",
          color: props.color || (filled ? "#FFFFFF" : "#1C1B1D"),
          fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: 14,
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
  icon: "✏️",
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
  icon: "⬭",
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
  icon: "╱",
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
  icon: "→",
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
  icon: "➖",
  category: "text",
  defaultWidth: 358,
  defaultHeight: 2,
  defaultProps: { color: "#E5E1E3", thickness: 1 },
  subElements: [
    { key: "color", label: "Line Color", icon: "🎨", kind: "color" },
    { key: "thickness", label: "Thickness", icon: "#", kind: "text" },
  ],
  propFields: [
    { key: "color", label: "Color", type: "color" },
    { key: "thickness", label: "Thickness", type: "number" },
  ],
  render: (props) => (
    <div style={{ width: "100%", height: props.thickness || 1, background: props.color || "#E5E1E3" }} />
  ),
});

registerComponentType("header_bar", {
  type: "header_bar",
  label: "Header Bar",
  icon: "🗂️",
  category: "nav",
  defaultWidth: 390,
  defaultHeight: 56,
  defaultProps: { logo: null, appName: "My App" },
  subElements: [
    { key: "appName", label: "App Name", icon: "T", kind: "text" },
    { key: "logo", label: "Logo", icon: "🖼️", kind: "image" },
  ],
  propFields: [
    { key: "appName", label: "App Name", type: "text" },
    { key: "logo", label: "Logo URL", type: "text" },
  ],
  render: (props) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 16px", width: "100%", height: "100%" }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
        background: props.logo ? `url(${props.logo}) center/cover no-repeat` : "#F1EDEF",
        border: props.logo ? "none" : "2px dashed #D1D5DB",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 14, color: "#9CA3AF",
      }}>
        {!props.logo && "📷"}
      </div>
      <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 15, color: "#1C1B1D" }}>
        {props.appName || "App Name"}
      </div>
    </div>
  ),
});

registerComponentType("menu_grid", {
  type: "menu_grid",
  label: "Menu Grid",
  icon: "📋",
  category: "commerce",
  defaultWidth: 358,
  defaultHeight: 320,
  defaultProps: {
    columns: 2,
    gap: 12,
    padding: 12,
    background: { type: "color", value: "" },
    imageBackground: "#F1EDEF",
    imageHeight: 96,
    iconSize: 26,
    imageFit: "cover",
    imageRadius: 8,
    cardRadius: 12,
    cardShadow: "soft",
    textColor: "#1C1B1D",
    priceColor: "#F4A026",
    items: [
      { name: "Jollof Rice", price: "₦2,500", oldPrice: "", badge: "", desc: "Rich, smoky jollof rice", image: "", emoji: "🍛", background: { type: "color", value: "#FCF8FA" } },
      { name: "Grilled Chicken", price: "₦3,000", oldPrice: "", badge: "Popular", desc: "Char-grilled, spicy", image: "", emoji: "🍗", background: { type: "color", value: "#FCF8FA" } },
      { name: "Chapman", price: "₦1,500", oldPrice: "", badge: "", desc: "Classic mocktail", image: "", emoji: "🥤", background: { type: "color", value: "#FCF8FA" } },
      { name: "Fruit Juice", price: "₦1,200", oldPrice: "", badge: "", desc: "Fresh & chilled", image: "", emoji: "🍹", background: { type: "color", value: "#FCF8FA" } },
    ],
  },
  subElements: [
    { key: "columns", label: "Columns Per Row", icon: "#", kind: "text" },
  ],
  propFields: [
    { key: "columns", label: "Columns", type: "number" },
    { key: "gap", label: "Gap (px)", type: "number" },
    { key: "padding", label: "Padding (px)", type: "number" },
    { key: "cardRadius", label: "Card Corner Radius", type: "number" },
    { key: "cardShadow", label: "Card Shadow", type: "select", options: ["none", "soft", "raised"] },
    { key: "background", label: "Background", type: "bg" },
    { key: "imageHeight", label: "Image Size", type: "number" },
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
        { key: "emoji", label: "Emoji", type: "text", placeholder: "🍛" },
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
    const imageRadius = props.imageRadius != null ? Number(props.imageRadius) : 8;
    const cardRadius = props.cardRadius != null ? Number(props.cardRadius) : 12;
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
          { name: "Jollof Rice", price: "₦2,500", desc: "Smoky, rich", emoji: "🍛" },
          { name: "Grilled Chicken", price: "₦3,000", desc: "Char-grilled", emoji: "🍗" },
          { name: "Chapman", price: "₦1,500", desc: "Classic mocktail", emoji: "🥤" },
          { name: "Fruit Juice", price: "₦1,200", desc: "Fresh & chilled", emoji: "🍹" },
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
                  width: "100%", height: imageHeight, objectFit: imageFit,
                  borderRadius: imageRadius, marginBottom: 6,
                  background: props.imageBackground || "#F1EDEF", display: "block",
                }} />
              ) : (
                <div style={{
                  fontSize: props.iconSize || 26, marginBottom: 4, lineHeight: 1,
                  background: props.imageBackground || "#FFF",
                  width: "100%", height: Math.max(40, imageHeight - 10), borderRadius: imageRadius,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{it.emoji || "🍽️"}</div>
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
  icon: "🧩",
  category: "layout",
  container: true,
  defaultWidth: 358,
  defaultHeight: 160,
  defaultProps: { backgroundColor: "#FCF8FA", name: "" },
  subElements: [
    { key: "name", label: "Section Name", icon: "T", kind: "text" },
    { key: "backgroundColor", label: "Background", icon: "🎨", kind: "color" },
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
  icon: "🎠",
  category: "layout",
  container: true,
  defaultWidth: 358,
  defaultHeight: 180,
  defaultProps: { autoplay: true, autoplayInterval: 4000, showDots: true, showArrows: true },
  subElements: [
    { key: "showDots", label: "Show Dots", icon: "•", kind: "text" },
    { key: "showArrows", label: "Show Arrows", icon: "↔", kind: "text" },
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

templateType("order_history", "Order History", "🧾", 240, OrderHistory, "commerce");
templateType("info_list", "Info List", "ℹ️", 200, InfoList, "text");
templateType("report_action", "Report Action", "🚨", 140, ReportAction, "feedback");
templateType("notification_list", "Notification List", "🔔", 200, NotificationList, "feedback");
templateType("primary_button", "Primary Button", "🔘", 80, PrimaryButton, "buttons");
templateType("calendar_strip", "Calendar Strip", "📅", 120, CalendarStrip, "booking");
templateType("slot_grid", "Slot Grid", "🕐", 160, SlotGrid, "booking");
templateType("booking_summary", "Booking Summary", "📋", 160, BookingSummary, "booking");
templateType("cart_summary", "Cart Summary", "🛒", 160, CartSummary, "commerce");
templateType("address_form", "Address Form", "📍", 200, AddressForm, "inputs");
templateType("promotion_list", "Promotion List", "🏷️", 180, PromotionList, "commerce");
templateType("section_header", "Section Header", "🏷️", 56, TemplateSectionHeader, "text");
templateType("empty_state", "Empty State", "📄", 160, RegistryEmptyState, "feedback");
templateType("dynamic_card", "Dynamic Card", "🃏", 120, RegistryDynamicCard, "layout");

/* ═══════════════ Phase 1 — new mobile building blocks ═══════════════ */

registerComponentType("icon", {
  type: "icon",
  label: "Icon",
  icon: "✨",
  category: "icons",
  defaultWidth: 32,
  defaultHeight: 32,
  defaultProps: { name: "Home", size: 24, color: "#1C1B1D" },
  propFields: [
    { key: "name", label: "Icon", type: "select", options: Object.keys(ICON_LIBRARY) },
    { key: "size", label: "Size", type: "number" },
    { key: "color", label: "Color", type: "color" },
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
  icon: "↔️",
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
  icon: "🔳",
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
  icon: "➕",
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
  icon: "✎",
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
  icon: "🔍",
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
  icon: "🎚️",
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
  icon: "☑️",
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
  icon: "👤",
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
  icon: "🏷️",
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
  icon: "📊",
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
  icon: "⭐",
  category: "feedback",
  defaultWidth: 120,
  defaultHeight: 28,
  defaultProps: { value: 4, color: "#F4A644", size: 18 },
  propFields: [
    { key: "value", label: "Stars (1-5)", type: "number" },
    { key: "color", label: "Star Color", type: "color" },
    { key: "size", label: "Size", type: "number" },
  ],
  render: (props) => {
    const v = Math.max(0, Math.min(5, Math.round(Number(props.value) || 0)));
    const size = Number(props.size) || 18;
    const color = props.color || "#F4A644";
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, width: "100%", height: "100%" }}>
        {[1, 2, 3, 4, 5].map(i => (
          <Star key={i} size={size} fill={i <= v ? color : "transparent"} color={color} strokeWidth={i <= v ? 1 : 1.6} />
        ))}
      </div>
    );
  },
});
