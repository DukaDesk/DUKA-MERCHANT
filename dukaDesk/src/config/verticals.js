import { getCategoryByKey } from "./taxonomy";

/* Common module ids (route segments under /dashboard):
   dashboard, products, orders, customers, inventory, analytics,
   messages, marketing, integrations, billing, team, settings,
   plus sector pages: giving, attendance, fees, appointments.
*/

const sharedModules = [
  { id: "analytics", label: "Analytics", icon: "BarChart3" },
  { id: "messages", label: "Messages", icon: "MessageSquare" },
  { id: "marketing", label: "Marketing", icon: "Megaphone" },
  { id: "integrations", label: "Integrations", icon: "Link2" },
  { id: "billing", label: "Billing", icon: "CreditCard" },
  { id: "team", label: "Team", icon: "Users" },
  { id: "settings", label: "Settings", icon: "Settings" },
];

const commerceModules = [
  { id: "products", label: "Products", icon: "Package" },
  { id: "orders", label: "Orders", icon: "ShoppingCart" },
  { id: "customers", label: "Customers", icon: "Contact" },
  { id: "inventory", label: "Inventory", icon: "ClipboardList" },
];

const DEFAULT_KPIS = [
  { id: "customers", label: "Customers", icon: "Users", color: "#7C3AED" },
  { id: "revenue", label: "Revenue (Month)", icon: "DollarSign", color: "#F4A026", currency: true },
  { id: "orders", label: "Open Orders", icon: "ShoppingCart", color: "#0D9488", page: "orders" },
  { id: "rating", label: "Avg Rating", icon: "Star", color: "#EC4899" },
];

const DEFAULT_QUICK_ACTIONS = [
  { label: "Add Product", icon: "Plus", page: "products" },
  { label: "View Orders", icon: "ShoppingCart", page: "orders", accent: true },
  { label: "Messages", icon: "MessageSquare", page: "messages", outline: true },
  { label: "Analytics", icon: "BarChart3", page: "analytics", outline: true },
];

const DEFAULT_EMPTY = {
  title: "No items yet",
  cta: "Add your first item →",
  target: "products",
};

export const VERTICALS = {
  /* ── Commerce default (also used for unknown categories) ── */
  Ecommerce: {
    key: "Ecommerce",
    label: "Ecommerce",
    icon: "🛍️",
    deskLabel: "Shop Desk",
    modules: [
      { id: "products", label: "Products", icon: "Package" },
      { id: "orders", label: "Orders", icon: "ShoppingCart" },
      { id: "customers", label: "Customers", icon: "Contact" },
      { id: "inventory", label: "Inventory", icon: "ClipboardList" },
      ...sharedModules,
    ],
    kpis: DEFAULT_KPIS,
    quickActions: DEFAULT_QUICK_ACTIONS,
    emptyState: { ...DEFAULT_EMPTY, title: "No products yet", cta: "Add your first product →" },
    topbarTitles: { products: "Products", orders: "Orders", customers: "Customers", inventory: "Inventory" },
    excludedModules: [],
    adminPages: [],
  },

  /* ── Restaurant / Food ── */
  Restaurant: {
    key: "Restaurant",
    label: "Restaurant",
    icon: "🍽️",
    deskLabel: "Restaurant Desk",
    modules: [
      { id: "products", label: "Products", icon: "UtensilsCrossed" },
      { id: "orders", label: "Orders", icon: "ShoppingCart" },
      { id: "customers", label: "Customers", icon: "Contact" },
      { id: "inventory", label: "Stock", icon: "ClipboardList" },
      ...sharedModules,
    ],
    kpis: [
      { id: "customers", label: "Customers", icon: "Users", color: "#7C3AED" },
      { id: "revenue", label: "Revenue (Month)", icon: "DollarSign", color: "#F4A026", currency: true },
      { id: "orders", label: "Open Orders", icon: "ShoppingCart", color: "#0D9488", page: "orders" },
      { id: "rating", label: "Avg Rating", icon: "Star", color: "#EC4899" },
    ],
    quickActions: [
      { label: "Add Product", icon: "Plus", page: "products" },
      { label: "View Orders", icon: "ShoppingCart", page: "orders", accent: true },
      { label: "Messages", icon: "MessageSquare", page: "messages", outline: true },
      { label: "Analytics", icon: "BarChart3", page: "analytics", outline: true },
    ],
    emptyState: { ...DEFAULT_EMPTY, title: "No products yet", cta: "Add your first product →" },
    topbarTitles: { products: "Products", orders: "Orders", customers: "Customers", inventory: "Stock" },
    excludedModules: [],
    adminPages: [
      { id: "reservations", label: "Reservations", icon: "CalendarDays", route: "reservations", component: "Reservations" },
    ],
  },

  /* ── Food Vendor ── */
  "Food Vendor": {
    key: "Food Vendor",
    label: "Food Vendor",
    icon: "🥗",
    deskLabel: "Kitchen Desk",
    modules: [
      { id: "products", label: "Products", icon: "UtensilsCrossed" },
      { id: "orders", label: "Orders", icon: "ShoppingCart" },
      { id: "customers", label: "Customers", icon: "Contact" },
      ...sharedModules,
    ],
    kpis: DEFAULT_KPIS,
    quickActions: [
      { label: "Add Product", icon: "Plus", page: "products" },
      { label: "View Orders", icon: "ShoppingCart", page: "orders", accent: true },
      { label: "Messages", icon: "MessageSquare", page: "messages", outline: true },
      { label: "Analytics", icon: "BarChart3", page: "analytics", outline: true },
    ],
    emptyState: { ...DEFAULT_EMPTY, title: "No products yet", cta: "Add your first product →" },
    topbarTitles: { products: "Products", orders: "Orders", customers: "Customers" },
    excludedModules: ["inventory"],
    adminPages: [
      { id: "reservations", label: "Reservations", icon: "CalendarDays", route: "reservations", component: "Reservations" },
    ],
  },

  /* ── Grocery ── */
  Grocery: {
    key: "Grocery",
    label: "Grocery",
    icon: "🛒",
    deskLabel: "Market Desk",
    modules: [
      { id: "products", label: "Products", icon: "Package" },
      { id: "orders", label: "Orders", icon: "ShoppingCart" },
      { id: "customers", label: "Customers", icon: "Contact" },
      { id: "inventory", label: "Stock", icon: "ClipboardList" },
      ...sharedModules,
    ],
    kpis: DEFAULT_KPIS,
    quickActions: [
      { label: "Add Product", icon: "Plus", page: "products" },
      { label: "View Orders", icon: "ShoppingCart", page: "orders", accent: true },
      { label: "Messages", icon: "MessageSquare", page: "messages", outline: true },
      { label: "Analytics", icon: "BarChart3", page: "analytics", outline: true },
    ],
    emptyState: { ...DEFAULT_EMPTY, title: "No products yet", cta: "Add your first product →" },
    topbarTitles: { products: "Products", orders: "Orders", customers: "Customers", inventory: "Stock" },
    excludedModules: [],
    adminPages: [],
  },

  /* ── Church / Ministry ── */
  Church: {
    key: "Church",
    label: "Church",
    icon: "⛪",
    deskLabel: "Church Desk",
    modules: [
      { id: "products", label: "Resources", icon: "Package" },
      { id: "orders", label: "Donations", icon: "HandCoins" },
      { id: "customers", label: "Members", icon: "Contact" },
      { id: "messages", label: "Announcements", icon: "Megaphone" },
      ...sharedModules.filter(m => m.id !== "messages" && m.id !== "marketing"),
    ],
    kpis: [
      { id: "customers", label: "Members", icon: "Users", color: "#7C3AED" },
      { id: "revenue", label: "Donations (Month)", icon: "HandCoins", color: "#F4A026", currency: true },
      { id: "orders", label: "New Givers", icon: "HeartHandshake", color: "#0D9488", page: "orders" },
      { id: "attendance", label: "Attendance", icon: "CalendarCheck", color: "#EC4899" },
    ],
    quickActions: [
      { label: "Record Donation", icon: "Plus", page: "giving" },
      { label: "Donations", icon: "HandCoins", page: "orders", accent: true },
      { label: "Announcements", icon: "Megaphone", page: "messages", outline: true },
      { label: "Members", icon: "Users", page: "customers", outline: true },
    ],
    emptyState: { ...DEFAULT_EMPTY, title: "No donation records yet", cta: "Record your first donation →" },
    topbarTitles: { products: "Resources", orders: "Donations", customers: "Members", messages: "Announcements" },
    excludedModules: ["inventory", "marketing"],
    adminPages: [
      { id: "giving", label: "Donations", icon: "HandCoins", route: "giving", component: "Giving" },
      { id: "attendance", label: "Attendance", icon: "CalendarCheck", route: "attendance", component: "Attendance" },
    ],
  },

  /* ── School / Education ── */
  School: {
    key: "School",
    label: "School",
    icon: "🏫",
    deskLabel: "School Desk",
    modules: [
      { id: "products", label: "Timetable", icon: "CalendarDays" },
      { id: "orders", label: "Fees", icon: "Wallet" },
      { id: "customers", label: "Students", icon: "Contact" },
      { id: "messages", label: "Parent Comms", icon: "Megaphone" },
      ...sharedModules.filter(m => m.id !== "messages" && m.id !== "marketing"),
    ],
    kpis: [
      { id: "customers", label: "Students", icon: "Users", color: "#7C3AED" },
      { id: "revenue", label: "Fees (Month)", icon: "Wallet", color: "#F4A026", currency: true },
      { id: "orders", label: "Pending Fees", icon: "Receipt", color: "#0D9488", page: "orders" },
      { id: "attendance", label: "Attendance", icon: "CalendarCheck", color: "#EC4899" },
    ],
    quickActions: [
      { label: "Add Class", icon: "Plus", page: "products" },
      { label: "Fees", icon: "Wallet", page: "orders", accent: true },
      { label: "Parent Comms", icon: "Megaphone", page: "messages", outline: true },
      { label: "Students", icon: "Users", page: "customers", outline: true },
    ],
    emptyState: { ...DEFAULT_EMPTY, title: "No timetable yet", cta: "Add your first class →" },
    topbarTitles: { products: "Timetable", orders: "Fees", customers: "Students", messages: "Parent Comms" },
    excludedModules: ["inventory", "marketing"],
    adminPages: [
      { id: "attendance", label: "Attendance", icon: "CalendarCheck", route: "attendance", component: "Attendance" },
      { id: "fees", label: "Fees", icon: "Wallet", route: "fees", component: "Fees" },
      { id: "classes", label: "Classes", icon: "Dumbbell", route: "classes", component: "Classes" },
    ],
  },

  /* ── Booking / Services (laundry, salon, clinic, gym) ── */
  Booking: {
    key: "Booking",
    label: "Booking",
    icon: "📅",
    deskLabel: "Services Desk",
    modules: [
      { id: "products", label: "Services", icon: "Sparkles" },
      { id: "orders", label: "Appointments", icon: "CalendarClock" },
      { id: "customers", label: "Customers", icon: "Contact" },
      ...sharedModules,
    ],
    kpis: [
      { id: "customers", label: "Customers", icon: "Users", color: "#7C3AED" },
      { id: "revenue", label: "Revenue (Month)", icon: "DollarSign", color: "#F4A026", currency: true },
      { id: "orders", label: "Bookings Today", icon: "CalendarClock", color: "#0D9488", page: "appointments" },
      { id: "rating", label: "Avg Rating", icon: "Star", color: "#EC4899" },
    ],
    quickActions: [
      { label: "Add Service", icon: "Plus", page: "products" },
      { label: "Appointments", icon: "CalendarClock", page: "appointments", accent: true },
      { label: "Messages", icon: "MessageSquare", page: "messages", outline: true },
      { label: "Analytics", icon: "BarChart3", page: "analytics", outline: true },
    ],
    emptyState: { ...DEFAULT_EMPTY, title: "No services yet", cta: "Add your first service →" },
    topbarTitles: { products: "Services", orders: "Appointments", customers: "Customers" },
    excludedModules: ["inventory"],
    adminPages: [
      { id: "appointments", label: "Appointments", icon: "CalendarClock", route: "appointments", component: "AppointmentsToday" },
      { id: "memberships", label: "Memberships", icon: "BadgeCheck", route: "memberships", component: "Memberships" },
      { id: "classes", label: "Classes", icon: "Dumbbell", route: "classes", component: "Classes" },
    ],
  },
/* ── Events / Ticketing ── */
  Events: {
    key: "Events",
    label: "Events",
    icon: "🎪",
    deskLabel: "Events Desk",
    modules: [
      { id: "products", label: "Events", icon: "Ticket" },
      { id: "orders", label: "Tickets", icon: "HandCoins" },
      { id: "customers", label: "Attendees", icon: "Contact" },
      { id: "messages", label: "Updates", icon: "Megaphone" },
      ...sharedModules.filter(m => m.id !== "messages" && m.id !== "marketing"),
    ],
    kpis: [
      { id: "customers", label: "Attendees", icon: "Users", color: "#7C3AED" },
      { id: "revenue", label: "Sales (Month)", icon: "DollarSign", color: "#F4A026", currency: true },
      { id: "orders", label: "Tickets Sold", icon: "Ticket", color: "#0D9488", page: "orders" },
      { id: "rating", label: "Avg Rating", icon: "Star", color: "#EC4899" },
    ],
    quickActions: [
      { label: "Create Event", icon: "Plus", page: "products" },
      { label: "Tickets", icon: "Ticket", page: "orders", accent: true },
      { label: "Attendees", icon: "Users", page: "customers", outline: true },
      { label: "Updates", icon: "Megaphone", page: "messages", outline: true },
    ],
    emptyState: { ...DEFAULT_EMPTY, title: "No events yet", cta: "Create your first event →" },
    topbarTitles: { products: "Events", orders: "Tickets", customers: "Attendees", messages: "Updates" },
    excludedModules: ["inventory", "marketing"],
    adminPages: [
      { id: "tickets", label: "Tickets", icon: "Ticket", route: "tickets", component: "Tickets" },
    ],
  },

  /* ── Consulting / Professional ── */
  Consulting: {
    key: "Consulting",
    label: "Consulting",
    icon: "💼",
    deskLabel: "Practice Desk",
    modules: [
      { id: "products", label: "Services", icon: "Briefcase" },
      { id: "orders", label: "Invoices", icon: "Receipt" },
      { id: "customers", label: "Contacts", icon: "Contact" },
      { id: "messages", label: "Messages", icon: "MessageSquare" },
      ...sharedModules.filter(m => m.id !== "messages" && m.id !== "marketing"),
    ],
    kpis: [
      { id: "customers", label: "Clients", icon: "Users", color: "#7C3AED" },
      { id: "revenue", label: "Revenue (Month)", icon: "DollarSign", color: "#F4A026", currency: true },
      { id: "orders", label: "Open Invoices", icon: "Receipt", color: "#0D9488", page: "orders" },
      { id: "rating", label: "Avg Rating", icon: "Star", color: "#EC4899" },
    ],
    quickActions: [
      { label: "Add Service", icon: "Plus", page: "products" },
      { label: "Invoices", icon: "Receipt", page: "orders", accent: true },
      { label: "Messages", icon: "MessageSquare", page: "messages", outline: true },
      { label: "Clients", icon: "Users", page: "customers", outline: true },
    ],
    emptyState: { ...DEFAULT_EMPTY, title: "No services yet", cta: "Add your first service →" },
    topbarTitles: { products: "Services", orders: "Invoices", customers: "Clients", messages: "Messages" },
    excludedModules: ["inventory", "marketing"],
    adminPages: [],
  },

  /* ── Nonprofit / NGO ── */
  Nonprofit: {
    key: "Nonprofit",
    label: "Nonprofit",
    icon: "🤝",
    deskLabel: "Causes Desk",
    modules: [
      { id: "products", label: "Campaigns", icon: "HeartHandshake" },
      { id: "orders", label: "Donations", icon: "HandCoins" },
      { id: "customers", label: "Supporters", icon: "Contact" },
      { id: "messages", label: "Updates", icon: "Megaphone" },
      ...sharedModules.filter(m => m.id !== "messages" && m.id !== "marketing"),
    ],
    kpis: [
      { id: "customers", label: "Supporters", icon: "Users", color: "#7C3AED" },
      { id: "revenue", label: "Donations (Month)", icon: "HandCoins", color: "#F4A026", currency: true },
      { id: "orders", label: "New Donors", icon: "HeartHandshake", color: "#0D9488", page: "orders" },
      { id: "attendance", label: "Volunteers", icon: "CalendarCheck", color: "#EC4899" },
    ],
    quickActions: [
      { label: "Start Campaign", icon: "Plus", page: "products" },
      { label: "Donations", icon: "HandCoins", page: "orders", accent: true },
      { label: "Supporters", icon: "Users", page: "customers", outline: true },
      { label: "Updates", icon: "Megaphone", page: "messages", outline: true },
    ],
    emptyState: { ...DEFAULT_EMPTY, title: "No campaigns yet", cta: "Start your first campaign →" },
    topbarTitles: { products: "Campaigns", orders: "Donations", customers: "Supporters", messages: "Updates" },
    excludedModules: ["inventory", "marketing"],
    adminPages: [],
  },

  /* ── Personal / Portfolio ── */
  Personal: {
    key: "Personal",
    label: "Personal",
    icon: "🌟",
    deskLabel: "Portfolio Desk",
    modules: [
      { id: "products", label: "Showcase", icon: "Sparkles" },
      { id: "orders", label: "Inquiries", icon: "Inbox" },
      { id: "customers", label: "Contacts", icon: "Contact" },
      { id: "messages", label: "Messages", icon: "MessageSquare" },
      ...sharedModules.filter(m => m.id !== "messages" && m.id !== "marketing"),
    ],
    kpis: [
      { id: "customers", label: "Contacts", icon: "Users", color: "#7C3AED" },
      { id: "revenue", label: "Revenue (Month)", icon: "DollarSign", color: "#F4A026", currency: true },
      { id: "orders", label: "Inquiries", icon: "Inbox", color: "#0D9488", page: "orders" },
      { id: "rating", label: "Avg Rating", icon: "Star", color: "#EC4899" },
    ],
    quickActions: [
      { label: "Add Item", icon: "Plus", page: "products" },
      { label: "Inquiries", icon: "Inbox", page: "orders", accent: true },
      { label: "Messages", icon: "MessageSquare", page: "messages", outline: true },
      { label: "Contacts", icon: "Users", page: "customers", outline: true },
    ],
    emptyState: { ...DEFAULT_EMPTY, title: "No showcase items yet", cta: "Add your first item →" },
    topbarTitles: { products: "Showcase", orders: "Inquiries", customers: "Contacts", messages: "Messages" },
    excludedModules: ["inventory", "marketing"],
    adminPages: [],
  },
};

export const VERTICAL_KEYS = Object.keys(VERTICALS);

export const DEFAULT_VERTICAL = {
  key: "DEFAULT",
  label: "Business",
  icon: "🏢",
  deskLabel: "Business Desk",
  modules: [
    ...commerceModules,
    ...sharedModules,
  ],
  kpis: DEFAULT_KPIS,
  quickActions: DEFAULT_QUICK_ACTIONS,
  emptyState: { ...DEFAULT_EMPTY, title: "No items yet", cta: "Add your first item →" },
  topbarTitles: {},
  excludedModules: [],
  adminPages: [],
};

export function getVertical(category) {
  if (!category) return DEFAULT_VERTICAL;
  if (VERTICALS[category]) return VERTICALS[category];
  const matched = getCategoryByKey(category);
  if (matched && VERTICALS[matched.key]) return VERTICALS[matched.key];
  return DEFAULT_VERTICAL;
}

export function getVerticalByKycType(kycType) {
  switch (kycType) {
    case "Restaurant": return VERTICALS.Restaurant;
    case "Retail": return VERTICALS.Ecommerce;
    case "Service": return VERTICALS.Booking;
    case "Church": return VERTICALS.Church;
    case "School": return VERTICALS.School;
    case "Nonprofit": return VERTICALS.Nonprofit;
    case "Personal": return VERTICALS.Personal;
    default: return DEFAULT_VERTICAL;
  }
}