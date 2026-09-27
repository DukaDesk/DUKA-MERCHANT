import { Megaphone, Trophy, Video } from "lucide-react";
import { IconGlyph } from "../canvas-editor/componentTypes";

const ICON_NAMES = {
  "home-outline": "Home",
  "storefront-outline": "Store",
  "cart-outline": "ShoppingCart",
  "receipt-outline": "ClipboardList",
  "person-outline": "User",
  "calendar-outline": "Calendar",
  "tag-outline": "Tag",
  "restaurant-outline": "Utensils",
  "information-outline": "Info",
  "megaphone-outline": "Megaphone",
  "trophy-outline": "Trophy",
  "heart-outline": "Heart",
  "book-outline": "BookOpen",
  "people-outline": "Users",
  "clipboard-outline": "ClipboardList",
  "videocam-outline": "Video",
  "shop-outline": "Store",
  "bag-outline": "ShoppingBag",
  "card-outline": "CreditCard",
  "grid-outline": "Briefcase",
  "order-outline": "ClipboardList",
  "phone-outline": "Phone",
};
export function PreviewTabIcon({ name, size = 20 }) {
  const resolved = ICON_NAMES[name] || name || "Home";
  const LegacyIcon = { Megaphone, Trophy, Video }[resolved];
  return LegacyIcon ? <LegacyIcon size={size} /> : <IconGlyph name={resolved} size={size} />;
}

export default function PreviewTabBar({ navigation, activeScreen, onNavigate }) {
  const tabs = navigation?.tabs || [];
  const style = navigation?.style || {};
  if (!tabs.length) return null;
  return <nav aria-label="App tabs" style={{ display: "flex", flexShrink: 0, width: "100%", boxSizing: "border-box", minHeight: style.height ?? 56, background: style.background || "#FFFFFF", borderTop: (style.borderWidth ?? 1) + "px solid " + (style.borderColor || "#E5E7EB") }}>
    {tabs.map((tab, index) => {
      const active = tab.screenId === activeScreen;
      const color = active ? tab.color || style.active || "#1A1A2E" : style.inactive || "#9CA3AF";
      return <button type="button" key={tab.id || String(tab.screenId) + index} aria-label={tab.label || "Tab"} aria-current={active ? "page" : undefined} disabled={!tab.screenId}
        onClick={event => { event.stopPropagation(); onNavigate?.(tab.screenId); }}
        style={{ flex: "1 1 0", minWidth: 0, margin: 0, padding: "6px 4px", border: 0, borderRadius: 0, background: "transparent", color, cursor: tab.screenId ? "pointer" : "default", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, fontFamily: "inherit", overflow: "hidden" }}>
        <span aria-hidden="true" style={{ display: "flex", flexShrink: 0 }}><PreviewTabIcon name={tab.icon || "Home"} size={style.iconSize ?? 20} /></span>
        <span style={{ display: "block", maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: style.fontSize ?? 10, fontWeight: active ? 700 : 500 }}>{tab.label || "Tab"}</span>
      </button>;
    })}
  </nav>;
}