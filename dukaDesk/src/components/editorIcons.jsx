import {
  Square, Circle, Type, Image as ImageIcon, Video, LayoutGrid, Rows3,
  ShoppingBag, ShoppingCart, Calendar, Clock, Package, Tag, Info, Bell,
  User, Palette, Zap, Hash, ArrowLeftRight, ArrowDownUp,
  Sparkles, Compass, FileText, BarChart3, ClipboardList, Scissors, Phone,
  Search, ToggleLeft, CheckSquare, Star, Minus, Plus, Pencil, Boxes,
  GalleryHorizontal, CreditCard, PanelTop, List, AlignLeft,
} from "lucide-react";
import { getComponentType } from "./canvas-editor/componentTypes";

export const SECTION_ICONS = {
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

export function getSectionIcon(type) {
  return SECTION_ICONS[type] || SECTION_ICONS.custom;
}

export const GROUP_ICONS = {
  typography: Type,
  colors: Palette,
  background: ImageIcon,
  border: Square,
  layout: LayoutGrid,
  effects: Sparkles,
  spacing: ArrowLeftRight,
  "sec-bg": ImageIcon,
  "sec-screen": Palette,
  "sec-nav": Compass,
  "none-screen": Palette,
  "none-nav": Compass,
  spacing_effects: Sparkles,
};

export const STYLING_GROUP_META = {
  typography: { label: "Typography", icon: Type },
  colors: { label: "Colors", icon: Palette },
  background: { label: "Background", icon: ImageIcon },
  border: { label: "Border", icon: Square },
  layout: { label: "Layout", icon: LayoutGrid },
  effects: { label: "Effects", icon: Sparkles },
};

export function TypeIcon({ type, size = 16, color, style }) {
  const def = getComponentType(type);
  const Icon = def?.icon || Square;
  return <Icon size={size} color={color} style={style} />;
}

export function CategoryIcon({ cat, size = 14, color, style }) {
  const fallback = LayoutGrid;
  // cat may be a string key or object with icon
  if (cat && typeof cat === "object" && typeof cat.icon === "function") {
    const Icon = cat.icon;
    return <Icon size={size} color={color} style={style} />;
  }
  // If cat is a string key, try to resolve via known maps
  const map = {
    buttons: Square, icons: Sparkles, inputs: Pencil, text: Type, media: ImageIcon,
    shapes: Square, layout: LayoutGrid, nav: Compass, commerce: ShoppingBag,
    booking: Calendar, feedback: Bell,
  };
  const Icon = (typeof cat === "string" && map[cat]) || fallback;
  return <Icon size={size} color={color} style={style} />;
}

export function SectionIcon({ type, size = 16, color, style }) {
  const Icon = getSectionIcon(type);
  return <Icon size={size} color={color} style={style} />;
}

export function SubIcon({ type, subKey, size = 13, color, style }) {
  const def = getComponentType(type);
  const sub = def?.subElements?.find(s => s.key === subKey);
  const Icon = sub?.icon || Type;
  return <Icon size={size} color={color} style={style} />;
}

export function GroupIcon({ group, size = 14, color, style }) {
  const Icon = GROUP_ICONS[group] || Sparkles;
  return <Icon size={size} color={color} style={style} />;
}
