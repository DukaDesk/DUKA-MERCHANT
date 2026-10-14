/**
 * Vertical catalog — single source of truth for starter templates.
 *
 * Phase 0 (white-label): template data lives here as DATA so adding a
 * business category no longer requires editing TemplateGenerator.js logic.
 * Legacy category keys (Restaurant, Ecommerce, ...) are preserved verbatim;
 * taxonomy preset keys (Food & Hospitality, Healthcare, ...) resolve through
 * TAXONOMY_PRESET_MAP with the legacy Restaurant default as final fallback.
 *
 * Screen ids must stay within the generateScreens() vocabulary
 * (menu/shop/services/events/info/orders/cart/profile + aliases
 * reservations/pickup/calendar/bookings/timetable/fees/announcements/grades/
 * giving/sermons/community/parent/assignments/live) — unknown ids are
 * silently skipped by the generator.
 */

import { COMMERCE_CATEGORY_KEYS } from "./taxonomy.js";

export const VERTICAL_CATALOG = [
  {
    key: "Restaurant",
    screens: ["menu", "orders", "reservations", "info"],
    templates: {
      "Classic Dine": { theme: { primary: "#1B4332", secondary: "#F4A026", bg: "#FAFAFA", card: "#FFFFFF" }, style: "light" },
      "Modern Bites": { theme: { primary: "#0F0F1A", secondary: "#F4A026", bg: "#1A1A2E", card: "#252540" }, style: "dark" },
      "Fresh & Bright": { theme: { primary: "#2ECC71", secondary: "#F4A026", bg: "#F0FDF4", card: "#FFFFFF" }, style: "light" },
    },
    variants: {
      "Classic Dine": ["menu", "orders", "reservations", "info"],
      "Modern Bites": ["menu", "shop", "orders", "profile"],
      "Fresh & Bright": ["menu", "info", "orders"],
    },
    preview: {
      categories: ["Popular", "Mains", "Drinks", "Desserts"],
      items: [
        { name: "Jollof Rice", price: "₦2,500", desc: "Rich, smoky jollof rice", emoji: "Utensils" },
        { name: "Grilled Chicken", price: "₦3,000", desc: "Char-grilled and spicy", emoji: "Drumstick" },
      ],
    },
  },
  {
    key: "Ecommerce",
    screens: ["shop", "cart", "orders", "profile"],
    templates: {
      Storefront: { theme: { primary: "#0D9488", secondary: "#0F0F1A", bg: "#FAFAFA", card: "#FFFFFF" }, style: "light" },
      "Flash Sale": { theme: { primary: "#E74C3C", secondary: "#F4A026", bg: "#1A1A2E", card: "#252540" }, style: "dark" },
      "Minimal Shop": { theme: { primary: "#7C3AED", secondary: "#F4A026", bg: "#FAFAFA", card: "#FFFFFF" }, style: "light" },
    },
    variants: {
      Storefront: ["shop", "cart", "orders", "profile"],
      "Flash Sale": ["shop", "cart", "orders"],
      "Minimal Shop": ["shop", "profile", "orders"],
    },
    preview: {
      categories: ["New Arrivals", "Clothing", "Electronics"],
      items: [
        { name: "Everyday Tote", price: "₦18,000", desc: "Durable canvas carryall", emoji: "ShoppingBag" },
        { name: "Wireless Headphones", price: "₦42,000", desc: "Comfortable all-day audio", emoji: "Headphones" },
      ],
    },
  },
  {
    key: "Food Vendor",
    screens: ["menu", "orders", "pickup", "info"],
    templates: {
      "Street Eats": { theme: { primary: "#EA580C", secondary: "#F4A026", bg: "#1A1A2E", card: "#252540" }, style: "dark" },
      "Home Kitchen": { theme: { primary: "#1B4332", secondary: "#F4A026", bg: "#FEF8ED", card: "#FFFFFF" }, style: "light" },
      "Fast Bites": { theme: { primary: "#0D9488", secondary: "#F4A026", bg: "#FAFAFA", card: "#FFFFFF" }, style: "light" },
    },
    variants: {
      "Street Eats": ["menu", "pickup", "orders", "info"],
      "Home Kitchen": ["menu", "orders", "info"],
      "Fast Bites": ["menu", "pickup", "orders"],
    },
    preview: {
      categories: ["Popular", "Specials", "Combo"],
      items: [
        { name: "Suya Combo", price: "₦4,500", desc: "Beef suya with sides", emoji: "Utensils" },
        { name: "Chicken Wrap", price: "₦3,200", desc: "Freshly grilled to order", emoji: "Sandwich" },
      ],
    },
  },
  {
    key: "Grocery",
    screens: ["shop", "cart", "orders", "profile"],
    templates: {
      "Market Fresh": { theme: { primary: "#2ECC71", secondary: "#F4A026", bg: "#F0FDF4", card: "#FFFFFF" }, style: "light" },
      "Corner Shop": { theme: { primary: "#1B4332", secondary: "#F4A026", bg: "#FEF8ED", card: "#FFFFFF" }, style: "light" },
      "Bulk Buy": { theme: { primary: "#7C3AED", secondary: "#F4A026", bg: "#1A1A2E", card: "#252540" }, style: "dark" },
    },
    variants: {
      "Market Fresh": ["shop", "cart", "orders", "info"],
      "Corner Shop": ["shop", "orders", "profile"],
      "Bulk Buy": ["shop", "cart", "orders", "profile"],
    },
    preview: {
      categories: ["Fruits", "Beverages", "Snacks"],
      items: [
        { name: "Fresh Fruit Box", price: "₦8,500", desc: "Seasonal fruit selection", emoji: "Apple" },
        { name: "Sparkling Water", price: "₦1,200", desc: "Pack of six bottles", emoji: "GlassWater" },
      ],
    },
  },
  {
    key: "Church",
    screens: ["events", "giving", "sermons", "community"],
    templates: {
      Cathedral: { theme: { primary: "#1B4332", secondary: "#F4A026", bg: "#FAFAFA", card: "#FFFFFF" }, style: "light" },
      "Community Light": { theme: { primary: "#F4A026", secondary: "#1B4332", bg: "#FEF8ED", card: "#FFFFFF" }, style: "light" },
      "Youth Vibes": { theme: { primary: "#EC4899", secondary: "#F4A026", bg: "#1A1A2E", card: "#252540" }, style: "dark" },
    },
    variants: {
      Cathedral: ["events", "giving", "sermons", "community"],
      "Community Light": ["events", "community", "giving"],
      "Youth Vibes": ["events", "community", "live", "giving"],
    },
    preview: {
      categories: ["Upcoming", "Sermons", "Ministries"],
      items: [
        { name: "Sunday Service", price: "Free", desc: "Join us this Sunday", emoji: "Heart" },
        { name: "Youth Fellowship", price: "Free", desc: "Weekly community gathering", emoji: "Users" },
      ],
    },
  },
  {
    key: "School",
    screens: ["timetable", "fees", "announcements", "grades"],
    templates: {
      "Academy Pro": { theme: { primary: "#0D9488", secondary: "#F4A026", bg: "#FAFAFA", card: "#FFFFFF" }, style: "light" },
      "Bright Minds": { theme: { primary: "#EC4899", secondary: "#F4A026", bg: "#FDF2F8", card: "#FFFFFF" }, style: "light" },
      "Smart Campus": { theme: { primary: "#7C3AED", secondary: "#F4A026", bg: "#1A1A2E", card: "#252540" }, style: "dark" },
    },
    variants: {
      "Academy Pro": ["timetable", "assignments", "announcements", "parent"],
      "Bright Minds": ["announcements", "grades", "parent"],
      "Smart Campus": ["timetable", "fees", "assignments", "announcements"],
    },
    preview: {
      categories: ["Announcements", "Timetable", "Events"],
      items: [
        { name: "Term Opening", price: "Today", desc: "Welcome back to school", emoji: "Calendar" },
        { name: "Parent Meeting", price: "Friday", desc: "Main hall, 4:00 PM", emoji: "Users" },
      ],
    },
  },
  {
    key: "Booking",
    screens: ["services", "calendar", "bookings", "info"],
    templates: {
      Scheduler: { theme: { primary: "#0D9488", secondary: "#F4A026", bg: "#FAFAFA", card: "#FFFFFF" }, style: "light" },
      "Spa Lounge": { theme: { primary: "#1B4332", secondary: "#F4A026", bg: "#F0FDF4", card: "#FFFFFF" }, style: "light" },
      "Quick Book": { theme: { primary: "#7C3AED", secondary: "#F4A026", bg: "#1A1A2E", card: "#252540" }, style: "dark" },
    },
    variants: {
      Scheduler: ["services", "calendar", "bookings", "info"],
      "Spa Lounge": ["services", "calendar", "bookings", "profile"],
      "Quick Book": ["services", "bookings", "info"],
    },
    preview: {
      categories: ["Services", "Popular", "Special Offers"],
      items: [
        { name: "Consultation", price: "₦10,000", desc: "One-hour appointment", emoji: "Calendar" },
        { name: "Premium Session", price: "₦25,000", desc: "Extended focused session", emoji: "Star" },
      ],
    },
  },
  {
    key: "Pharmacy",
    preset: "Healthcare",
    screens: ["shop", "cart", "orders", "info"],
    templates: {
      "Care Plus": { theme: { primary: "#0D9488", secondary: "#F4A026", bg: "#FAFAFA", card: "#FFFFFF" }, style: "light" },
      "Night Shift": { theme: { primary: "#1B4332", secondary: "#F4A026", bg: "#1A1A2E", card: "#252540" }, style: "dark" },
    },
    variants: {
      "Care Plus": ["shop", "cart", "orders", "info"],
      "Night Shift": ["shop", "orders", "profile"],
    },
    preview: {
      categories: ["Medicines", "Wellness", "Personal Care"],
      items: [
        { name: "Vitamin C", price: "₦3,500", desc: "Immune support, 60 tablets", emoji: "Pill" },
        { name: "First Aid Kit", price: "₦12,000", desc: "Home emergency essentials", emoji: "Briefcase" },
      ],
    },
  },
  {
    key: "Salon & Beauty",
    preset: "Services",
    screens: ["services", "bookings", "info", "profile"],
    templates: {
      "Glow Studio": { theme: { primary: "#EC4899", secondary: "#F4A026", bg: "#FDF2F8", card: "#FFFFFF" }, style: "light" },
      "After Dark": { theme: { primary: "#7C3AED", secondary: "#F4A026", bg: "#1A1A2E", card: "#252540" }, style: "dark" },
    },
    variants: {
      "Glow Studio": ["services", "bookings", "info", "profile"],
      "After Dark": ["services", "bookings", "profile"],
    },
    preview: {
      categories: ["Hair", "Nails", "Skin"],
      items: [
        { name: "Signature Cut", price: "₦8,000", desc: "Cut, wash and finish", emoji: "Scissors" },
        { name: "Gel Manicure", price: "₦6,500", desc: "Long-lasting shine", emoji: "Sparkles" },
      ],
    },
  },
  {
    key: "Law Firm",
    preset: "Legal",
    screens: ["services", "bookings", "info", "profile"],
    templates: {
      Chambers: { theme: { primary: "#1B4332", secondary: "#F4A026", bg: "#FAFAFA", card: "#FFFFFF" }, style: "light" },
      "Midnight Counsel": { theme: { primary: "#0F0F1A", secondary: "#F4A026", bg: "#1A1A2E", card: "#252540" }, style: "dark" },
    },
    variants: {
      Chambers: ["services", "bookings", "info", "profile"],
      "Midnight Counsel": ["services", "info", "bookings"],
    },
    preview: {
      categories: ["Consultations", "Retainers", "Notary"],
      items: [
        { name: "Legal Consultation", price: "₦25,000", desc: "One-hour case review", emoji: "Scale" },
        { name: "Document Review", price: "₦15,000", desc: "Contracts and agreements", emoji: "FileText" },
      ],
    },
  },
  {
    key: "Logistics",
    preset: "Services",
    screens: ["orders", "info", "profile", "shop"],
    templates: {
      Dispatch: { theme: { primary: "#EA580C", secondary: "#F4A026", bg: "#FAFAFA", card: "#FFFFFF" }, style: "light" },
      "Night Haul": { theme: { primary: "#0F0F1A", secondary: "#F4A026", bg: "#1A1A2E", card: "#252540" }, style: "dark" },
    },
    variants: {
      Dispatch: ["orders", "info", "profile", "shop"],
      "Night Haul": ["orders", "info", "profile"],
    },
    preview: {
      categories: ["Same Day", "Interstate", "Moving"],
      items: [
        { name: "City Courier", price: "₦2,000", desc: "Same-day doorstep delivery", emoji: "Bike" },
        { name: "Interstate Freight", price: "₦18,000", desc: "Tracked long-haul shipping", emoji: "Truck" },
      ],
    },
  },
];

/** Legacy/new catalog names → canonical taxonomy keys. */
const CATALOG_TO_CANONICAL = {
  Restaurant: "Food & Hospitality",
  Ecommerce: "Business",
  "Food Vendor": "Food & Hospitality",
  Grocery: "Food & Hospitality",
  Church: "Religion",
  School: "Education",
  Booking: "Services",
  Pharmacy: "Healthcare",
  "Salon & Beauty": "Services",
  "Law Firm": "Legal",
  Logistics: "Services",
};

/** Whether a template-catalog category belongs to buying/selling. */
export function isCommerceTemplateCategory(name) {
  const canonical = CATALOG_TO_CANONICAL[name] || resolveCategoryKey(name);
  return COMMERCE_CATEGORY_KEYS.includes(canonical);
}

/** Taxonomy preset keys (config/taxonomy.js) → catalog keys. */
const TAXONOMY_PRESET_MAP = {
  "Food & Hospitality": "Restaurant",
  Business: "Ecommerce",
  Corporate: "Ecommerce",
  Legal: "Law Firm",
  Religion: "Church",
  Education: "School",
  Healthcare: "Pharmacy",
  Services: "Booking",
  Events: "Church",
  Nonprofit: "Ecommerce",
  Personal: "Ecommerce",
};

const LEGACY_DEFAULT = "Restaurant";

function normalizeTemplateName(template) {
  const raw = String(template || "").split("/").pop();
  return raw.replace(/[-_]+([a-z])/g, (_, letter) => ` ${letter.toUpperCase()}`).replace(/^./, letter => letter.toUpperCase());
}

/** Resolve any category label (legacy key or taxonomy preset) to a catalog key. */
export function resolveCategoryKey(category) {
  if (VERTICAL_CATALOG.some(entry => entry.key === category)) return category;
  if (TAXONOMY_PRESET_MAP[category]) return TAXONOMY_PRESET_MAP[category];
  return LEGACY_DEFAULT;
}

function entryFor(category) {
  return VERTICAL_CATALOG.find(entry => entry.key === resolveCategoryKey(category))
    || VERTICAL_CATALOG.find(entry => entry.key === LEGACY_DEFAULT);
}

export function getCategoryScreens(category) {
  return entryFor(category).screens;
}

export function getBaseTemplate(category, template) {
  const entry = entryFor(category);
  const normalized = normalizeTemplateName(template);
  return entry.templates[normalized] || VERTICAL_CATALOG[0].templates["Classic Dine"];
}

export function getScreenVariants(template) {
  const normalized = normalizeTemplateName(template);
  for (const entry of VERTICAL_CATALOG) {
    if (entry.variants[normalized]) return entry.variants[normalized];
  }
  return undefined;
}

export function getPreviewData(category) {
  return entryFor(category).preview;
}

export function getCatalog() {
  return VERTICAL_CATALOG.map(entry => ({
    category: entry.key,
    preset: entry.preset,
    templates: Object.keys(entry.templates),
    features: entry.screens,
  }));
}

export { normalizeTemplateName };
