import React from "react";
import {
  Home, Star, Heart, ShoppingBag, ShoppingCart, MapPin, Bell, User,
  Clock, Calendar, Wallet, Settings, Phone, Camera, Gift, Info, Check, X, Plus, Minus,
  Trash2, ChevronRight, ChevronLeft, ChevronDown, ChevronUp, ArrowRight,
  ArrowLeft, ArrowUp, ArrowDown, Search, Menu, LayoutGrid, FileText, BarChart3, ClipboardList, Scissors, Tag, Compass, CreditCard, Utensils, Drumstick, CupSoda, GlassWater, Bike, Sun, Coffee, Pizza, Cake, Apple, Store, Package, Truck, Receipt, Ticket, Bookmark, Award, Crown, Shield, Lock, Key, Mail, MessageCircle, Headphones, Music, Play, Globe, Building2, Briefcase, GraduationCap, BookOpen, Dumbbell, Stethoscope, Flower2, Leaf, PawPrint, Car, Plane, Train, Hotel, Bed, Map, Navigation, Users, UserPlus, LogOut, HelpCircle, Wrench, Laptop, Smartphone,
  Sparkles, Type, Image as ImageIcon, Video, List, Circle, Pill, Sandwich, Scale,
  Flame, Church, School, PartyPopper, Handshake, Salad, Soup, Shirt, Footprints, Cross,
  Megaphone, Trophy,
} from "lucide-react";

/* Canonical icon set for templates. Anything renderable as an icon goes
   through here — raw emoji or icon-name text must never reach the UI. */

const ICON_COMPONENTS = {
  Home, Star, Heart, ShoppingBag, ShoppingCart, MapPin, Bell, User,
  Clock, Calendar, Wallet, Settings, Phone, Camera, Gift, Info, Check, X, Plus, Minus,
  Trash2, ChevronRight, ChevronLeft, ChevronDown, ChevronUp, ArrowRight,
  ArrowLeft, ArrowUp, ArrowDown, Search, Menu, LayoutGrid, FileText, BarChart3, ClipboardList, Scissors, Tag, Compass, CreditCard, Utensils, Drumstick, CupSoda, GlassWater, Bike, Sun, Coffee, Pizza, Cake, Apple, Store, Package, Truck, Receipt, Ticket, Bookmark, Award, Crown, Shield, Lock, Key, Mail, MessageCircle, Headphones, Music, Play, Globe, Building2, Briefcase, GraduationCap, BookOpen, Dumbbell, Stethoscope, Flower2, Leaf, PawPrint, Car, Plane, Train, Hotel, Bed, Map, Navigation, Users, UserPlus, LogOut, HelpCircle, Wrench, Laptop, Smartphone,
  Sparkles, Type, Image: ImageIcon, Video, List, Circle, Pill, Sandwich, Scale,
  Flame, Church, School, PartyPopper, Handshake, Salad, Soup, Shirt, Footprints, Cross,
  Megaphone, Trophy,
};

/* Ionicons-style names emitted by the template generator's navigation. */
const IONICON_ALIASES = {
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
  "grid-outline": "LayoutGrid",
  "order-outline": "ClipboardList",
  "phone-outline": "Phone",
  "megaphone-outline": "Megaphone",
  "trophy-outline": "Trophy",
};

/* Pictographs merchants/users paste into icon fields, mapped to Lucide. */
const EMOJI_ICON_MAP = {
  "🏠": "Home", "🏢": "Store", "🏙️": "Building2",
  "🛍️": "ShoppingBag", "🛒": "ShoppingCart", "👗": "Shirt", "👟": "Footprints",
  "🍽️": "Utensils", "☕": "Coffee", "🍔": "Sandwich", "🥗": "Salad", "🍲": "Soup",
  "💊": "Pill", "🩺": "Stethoscope", "⚖️": "Scale", "⛪": "Church", "🏫": "School",
  "🎓": "GraduationCap", "📅": "Calendar", "🎪": "PartyPopper", "🤝": "Handshake",
  "🌟": "Star", "⭐": "Star", "🔥": "Flame", "💇": "Scissors", "📦": "Package",
  "🚚": "Truck", "💳": "CreditCard", "📍": "MapPin", "🕐": "Clock", "📞": "Phone",
  "📧": "Mail", "🔒": "Lock", "🔔": "Bell", "❤️": "Heart", "💰": "Wallet",
  "🏷️": "Tag", "🎫": "Ticket", "🏥": "Cross",
  "←": "ArrowLeft", "→": "ArrowRight", "↑": "ArrowUp", "↓": "ArrowDown",
  "✕": "X", "✖️": "X", "✓": "Check", "✔️": "Check", "➕": "Plus", "➖": "Minus",
  "•": "Minus", "·": "Minus",
};

const PICTOGRAPH_RE = /\p{Extended_Pictographic}/u;

function lookup(name) {
  if (!name) return null;
  const raw = String(name).trim();
  if (!raw) return null;
  if (ICON_COMPONENTS[raw]) return raw;
  const lower = raw.toLowerCase();
  const ciKey = Object.keys(ICON_COMPONENTS).find(k => k.toLowerCase() === lower);
  if (ciKey) return ciKey;
  if (IONICON_ALIASES[raw]) return IONICON_ALIASES[raw];
  if (EMOJI_ICON_MAP[raw]) return EMOJI_ICON_MAP[raw];
  if (raw.length <= 4 && PICTOGRAPH_RE.test(raw)) {
    const mapped = EMOJI_ICON_MAP[raw];
    if (mapped && ICON_COMPONENTS[mapped]) return mapped;
  }
  return null;
}

export function resolveTemplateIconName(name) {
  return lookup(name) || "Image";
}

export function TemplateIcon({ name, size = 24, color, style }) {
  const key = resolveTemplateIconName(name);
  const Icon = ICON_COMPONENTS[key] || ImageIcon;
  return <Icon size={size} color={color} style={style} />;
}

export { ICON_COMPONENTS, IONICON_ALIASES, EMOJI_ICON_MAP };
