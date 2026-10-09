import { getCategoryByKey, resolveCanonicalCategory } from "./taxonomy";

/* Dashboard presets per desk category (broad industries).
   Each vertical defines the *default toolset* for that category:
   - modules: core nav items (route segments under /dashboard)
   - adminPages: sector-specific tools (giving, attendance, fees, appointments…)
   - kpis / quickActions / topbarTitles / emptyState: dashboard copy

   Rule: commerce-style desks (Business, Food & Hospitality, Corporate,
   Legal, Personal) keep `orders` (as Orders / Invoices / Inquiries).
   Community/service desks (Religion, Education, Healthcare, Services,
   Events, Nonprofit) do NOT use `orders` — they use a sector tool
   instead (giving / fees / appointments / tickets).
   A religion desk shows Donations, not Orders; a shop desk shows Orders,
   not Donations.

   Legacy keys (Ecommerce, Church, Booking, ...) resolve to their
   canonical broad vertical so existing users keep a working preset.
*/

const sharedModules = [
  { id: "analytics", label: "Analytics", icon: "BarChart3" },
  { id: "messages", label: "Messages", icon: "MessageSquare" },
  { id: "marketing", label: "Marketing", icon: "Megaphone" },
  { id: "integrations", label: "More Tools", icon: "Link2" },
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
  cta: "Add your first item",
  target: "products",
};

export const VERTICALS = {
  /* ── Business — general trade, retail & shops ── */
  Business: {
    key: "Business",
    label: "Business",
    icon: "🏢",
    deskLabel: "Business Desk",
    modules: [
      { id: "products", label: "Products", icon: "Package" },
      { id: "orders", label: "Orders", icon: "ShoppingCart" },
      { id: "customers", label: "Customers", icon: "Contact" },
      { id: "inventory", label: "Inventory", icon: "ClipboardList" },
      ...sharedModules,
    ],
    kpis: DEFAULT_KPIS,
    quickActions: DEFAULT_QUICK_ACTIONS,
    emptyState: { ...DEFAULT_EMPTY, title: "No products yet", cta: "Add your first product" },
    topbarTitles: { products: "Products", orders: "Orders", customers: "Customers", inventory: "Inventory", integrations: "More Tools" },
    excludedModules: [],
    adminPages: [],
  },

  /* ── Corporate — companies & enterprises, keeps Orders as Invoices ── */
  Corporate: {
    key: "Corporate",
    label: "Corporate",
    icon: "🏙️",
    deskLabel: "Corporate Desk",
    modules: [
      { id: "products", label: "Services", icon: "Briefcase" },
      { id: "orders", label: "Invoices", icon: "Receipt" },
      { id: "customers", label: "Contacts", icon: "Contact" },
      { id: "messages", label: "Messages", icon: "MessageSquare" },
      ...sharedModules.filter(m => m.id !== "messages" && m.id !== "marketing"),
    ],
    kpis: [
      { id: "customers", label: "Contacts", icon: "Users", color: "#7C3AED" },
      { id: "revenue", label: "Revenue (Month)", icon: "DollarSign", color: "#F4A026", currency: true },
      { id: "orders", label: "Open Invoices", icon: "Receipt", color: "#0D9488", page: "orders" },
      { id: "rating", label: "Avg Rating", icon: "Star", color: "#EC4899" },
    ],
    quickActions: [
      { label: "Add Service", icon: "Plus", page: "products" },
      { label: "Invoices", icon: "Receipt", page: "orders", accent: true },
      { label: "Messages", icon: "MessageSquare", page: "messages", outline: true },
      { label: "Contacts", icon: "Users", page: "customers", outline: true },
    ],
    emptyState: { ...DEFAULT_EMPTY, title: "No services yet", cta: "Add your first service" },
    topbarTitles: { products: "Services", orders: "Invoices", customers: "Contacts", messages: "Messages", integrations: "More Tools" },
    excludedModules: ["inventory", "marketing"],
    adminPages: [],
  },

  /* ── Legal — law firms & legal services ── */
  Legal: {
    key: "Legal",
    label: "Legal",
    icon: "⚖️",
    deskLabel: "Legal Desk",
    modules: [
      { id: "products", label: "Matters", icon: "Briefcase" },
      { id: "orders", label: "Invoices", icon: "Receipt" },
      { id: "customers", label: "Clients", icon: "Contact" },
      { id: "messages", label: "Messages", icon: "MessageSquare" },
      ...sharedModules.filter(m => m.id !== "messages" && m.id !== "marketing"),
    ],
    kpis: [
      { id: "customers", label: "Clients", icon: "Users", color: "#7C3AED" },
      { id: "revenue", label: "Revenue (Month)", icon: "DollarSign", color: "#F4A026", currency: true },
      { id: "orders", label: "Open Invoices", icon: "Receipt", color: "#0D9488", page: "orders" },
      { id: "orders", label: "Consultations", icon: "CalendarClock", color: "#0D9488", page: "appointments" },
    ],
    quickActions: [
      { label: "Add Matter", icon: "Plus", page: "products" },
      { label: "Invoices", icon: "Receipt", page: "orders", accent: true },
      { label: "Appointments", icon: "CalendarClock", page: "appointments", outline: true },
      { label: "Clients", icon: "Users", page: "customers", outline: true },
    ],
    emptyState: { ...DEFAULT_EMPTY, title: "No matters yet", cta: "Add your first matter", target: "products" },
    topbarTitles: { products: "Matters", orders: "Invoices", customers: "Clients", messages: "Messages", appointments: "Appointments", integrations: "More Tools" },
    excludedModules: ["inventory", "marketing"],
    adminPages: [
      { id: "appointments", label: "Appointments", icon: "CalendarClock", route: "appointments", component: "AppointmentsToday" },
    ],
  },

  /* ── Religion — churches, mosques & ministries. No Orders; uses Donations ── */
  Religion: {
    key: "Religion",
    label: "Religion",
    icon: "⛪",
    deskLabel: "Religion Desk",
    modules: [
      { id: "products", label: "Resources", icon: "Package" },
      { id: "customers", label: "Members", icon: "Contact" },
      { id: "messages", label: "Announcements", icon: "Megaphone" },
      ...sharedModules.filter(m => m.id !== "messages" && m.id !== "marketing"),
    ],
    kpis: [
      { id: "customers", label: "Members", icon: "Users", color: "#7C3AED" },
      { id: "revenue", label: "Donations (Month)", icon: "HandCoins", color: "#F4A026", currency: true },
      // Reuses the orders count as donation volume, but visible via the giving tool.
      { id: "orders", label: "New Givers", icon: "HeartHandshake", color: "#0D9488", page: "giving" },
      { id: "attendance", label: "Attendance", icon: "CalendarCheck", color: "#EC4899", page: "attendance" },
    ],
    quickActions: [
      { label: "Record Donation", icon: "Plus", page: "giving" },
      { label: "Donations", icon: "HandCoins", page: "giving", accent: true },
      { label: "Announcements", icon: "Megaphone", page: "messages", outline: true },
      { label: "Members", icon: "Users", page: "customers", outline: true },
    ],
    emptyState: { ...DEFAULT_EMPTY, title: "No donation records yet", cta: "Record your first donation", target: "giving" },
    topbarTitles: { products: "Resources", giving: "Donations", customers: "Members", messages: "Announcements", attendance: "Attendance", integrations: "More Tools" },
    excludedModules: ["orders", "inventory", "marketing"],
    adminPages: [
      { id: "giving", label: "Donations", icon: "HandCoins", route: "giving", component: "Giving" },
      { id: "attendance", label: "Attendance", icon: "CalendarCheck", route: "attendance", component: "Attendance" },
    ],
  },

  /* ── Education — schools & training. No Orders; uses Fees ── */
  Education: {
    key: "Education",
    label: "Education",
    icon: "🏫",
    deskLabel: "Education Desk",
    modules: [
      { id: "products", label: "Timetable", icon: "CalendarDays" },
      { id: "customers", label: "Students", icon: "Contact" },
      { id: "messages", label: "Parent Comms", icon: "Megaphone" },
      ...sharedModules.filter(m => m.id !== "messages" && m.id !== "marketing"),
    ],
    kpis: [
      { id: "customers", label: "Students", icon: "Users", color: "#7C3AED" },
      { id: "revenue", label: "Fees (Month)", icon: "Wallet", color: "#F4A026", currency: true },
      { id: "orders", label: "Pending Fees", icon: "Receipt", color: "#0D9488", page: "fees" },
      { id: "attendance", label: "Attendance", icon: "CalendarCheck", color: "#EC4899", page: "attendance" },
    ],
    quickActions: [
      { label: "Add Class", icon: "Plus", page: "products" },
      { label: "Fees", icon: "Wallet", page: "fees", accent: true },
      { label: "Parent Comms", icon: "Megaphone", page: "messages", outline: true },
      { label: "Students", icon: "Users", page: "customers", outline: true },
    ],
    emptyState: { ...DEFAULT_EMPTY, title: "No timetable yet", cta: "Add your first class", target: "products" },
    topbarTitles: { products: "Timetable", fees: "Fees", customers: "Students", messages: "Parent Comms", attendance: "Attendance", classes: "Classes", integrations: "More Tools" },
    excludedModules: ["orders", "inventory", "marketing"],
    adminPages: [
      { id: "attendance", label: "Attendance", icon: "CalendarCheck", route: "attendance", component: "Attendance" },
      { id: "fees", label: "Fees", icon: "Wallet", route: "fees", component: "Fees" },
      { id: "classes", label: "Classes", icon: "Dumbbell", route: "classes", component: "Classes" },
    ],
  },

  /* ── Healthcare — clinics, pharmacies & care. No Orders; uses Appointments ── */
  Healthcare: {
    key: "Healthcare",
    label: "Healthcare",
    icon: "🩺",
    deskLabel: "Healthcare Desk",
    modules: [
      { id: "products", label: "Services", icon: "Sparkles" },
      { id: "customers", label: "Patients", icon: "Contact" },
      { id: "inventory", label: "Stock", icon: "ClipboardList" },
      ...sharedModules,
    ],
    kpis: [
      { id: "customers", label: "Patients", icon: "Users", color: "#7C3AED" },
      { id: "revenue", label: "Revenue (Month)", icon: "DollarSign", color: "#F4A026", currency: true },
      { id: "orders", label: "Bookings Today", icon: "CalendarClock", color: "#0D9488", page: "appointments" },
      { id: "rating", label: "Avg Rating", icon: "Star", color: "#EC4899" },
    ],
    quickActions: [
      { label: "Add Service", icon: "Plus", page: "products" },
      { label: "Appointments", icon: "CalendarClock", page: "appointments", accent: true },
      { label: "Patients", icon: "Users", page: "customers", outline: true },
      { label: "Messages", icon: "MessageSquare", page: "messages", outline: true },
    ],
    emptyState: { ...DEFAULT_EMPTY, title: "No services yet", cta: "Add your first service", target: "products" },
    topbarTitles: { products: "Services", customers: "Patients", inventory: "Stock", appointments: "Appointments", integrations: "More Tools" },
    excludedModules: ["orders"],
    adminPages: [
      { id: "appointments", label: "Appointments", icon: "CalendarClock", route: "appointments", component: "AppointmentsToday" },
    ],
  },

  /* ── Food & Hospitality — restaurants, food vendors & groceries ── */
  "Food & Hospitality": {
    key: "Food & Hospitality",
    label: "Food & Hospitality",
    icon: "🍽️",
    deskLabel: "Hospitality Desk",
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
    emptyState: { ...DEFAULT_EMPTY, title: "No products yet", cta: "Add your first product" },
    topbarTitles: { products: "Products", orders: "Orders", customers: "Customers", inventory: "Stock", integrations: "More Tools" },
    excludedModules: [],
    adminPages: [
      { id: "reservations", label: "Reservations", icon: "CalendarDays", route: "reservations", component: "Reservations" },
    ],
  },

  /* ── Services — salons, repairs & bookings. No Orders; uses Appointments ── */
  Services: {
    key: "Services",
    label: "Services",
    icon: "📅",
    deskLabel: "Services Desk",
    modules: [
      { id: "products", label: "Services", icon: "Sparkles" },
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
    emptyState: { ...DEFAULT_EMPTY, title: "No services yet", cta: "Add your first service", target: "products" },
    topbarTitles: { products: "Services", appointments: "Appointments", customers: "Customers", memberships: "Memberships", classes: "Classes", integrations: "More Tools" },
    excludedModules: ["orders", "inventory"],
    adminPages: [
      { id: "appointments", label: "Appointments", icon: "CalendarClock", route: "appointments", component: "AppointmentsToday" },
      { id: "memberships", label: "Memberships", icon: "BadgeCheck", route: "memberships", component: "Memberships" },
      { id: "classes", label: "Classes", icon: "Dumbbell", route: "classes", component: "Classes" },
    ],
  },

  /* ── Events — no Orders, uses Tickets ── */
  Events: {
    key: "Events",
    label: "Events",
    icon: "🎪",
    deskLabel: "Events Desk",
    modules: [
      { id: "products", label: "Events", icon: "Ticket" },
      { id: "customers", label: "Attendees", icon: "Contact" },
      { id: "messages", label: "Updates", icon: "Megaphone" },
      ...sharedModules.filter(m => m.id !== "messages" && m.id !== "marketing"),
    ],
    kpis: [
      { id: "customers", label: "Attendees", icon: "Users", color: "#7C3AED" },
      { id: "revenue", label: "Sales (Month)", icon: "DollarSign", color: "#F4A026", currency: true },
      { id: "orders", label: "Tickets Sold", icon: "Ticket", color: "#0D9488", page: "tickets" },
      { id: "rating", label: "Avg Rating", icon: "Star", color: "#EC4899" },
    ],
    quickActions: [
      { label: "Create Event", icon: "Plus", page: "products" },
      { label: "Tickets", icon: "Ticket", page: "tickets", accent: true },
      { label: "Attendees", icon: "Users", page: "customers", outline: true },
      { label: "Updates", icon: "Megaphone", page: "messages", outline: true },
    ],
    emptyState: { ...DEFAULT_EMPTY, title: "No events yet", cta: "Create your first event", target: "products" },
    topbarTitles: { products: "Events", tickets: "Tickets", customers: "Attendees", messages: "Updates", integrations: "More Tools" },
    excludedModules: ["orders", "inventory", "marketing"],
    adminPages: [
      { id: "tickets", label: "Tickets", icon: "Ticket", route: "tickets", component: "Tickets" },
    ],
  },

  /* ── Nonprofit — no Orders, uses Donations (giving) ── */
  Nonprofit: {
    key: "Nonprofit",
    label: "Nonprofit",
    icon: "🤝",
    deskLabel: "Causes Desk",
    modules: [
      { id: "products", label: "Campaigns", icon: "HeartHandshake" },
      { id: "customers", label: "Supporters", icon: "Contact" },
      { id: "messages", label: "Updates", icon: "Megaphone" },
      ...sharedModules.filter(m => m.id !== "messages" && m.id !== "marketing"),
    ],
    kpis: [
      { id: "customers", label: "Supporters", icon: "Users", color: "#7C3AED" },
      { id: "revenue", label: "Donations (Month)", icon: "HandCoins", color: "#F4A026", currency: true },
      { id: "orders", label: "New Donors", icon: "HeartHandshake", color: "#0D9488", page: "giving" },
      { id: "attendance", label: "Volunteers", icon: "CalendarCheck", color: "#EC4899", page: "attendance" },
    ],
    quickActions: [
      { label: "Start Campaign", icon: "Plus", page: "products" },
      { label: "Donations", icon: "HandCoins", page: "giving", accent: true },
      { label: "Supporters", icon: "Users", page: "customers", outline: true },
      { label: "Updates", icon: "Megaphone", page: "messages", outline: true },
    ],
    emptyState: { ...DEFAULT_EMPTY, title: "No campaigns yet", cta: "Start your first campaign", target: "products" },
    topbarTitles: { products: "Campaigns", giving: "Donations", customers: "Supporters", messages: "Updates", integrations: "More Tools" },
    excludedModules: ["orders", "inventory", "marketing"],
    adminPages: [
      { id: "giving", label: "Donations", icon: "HandCoins", route: "giving", component: "Giving" },
      { id: "attendance", label: "Attendance", icon: "CalendarCheck", route: "attendance", component: "Attendance" },
    ],
  },

  /* ── Personal — keeps Orders as Inquiries ── */
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
    emptyState: { ...DEFAULT_EMPTY, title: "No showcase items yet", cta: "Add your first item" },
    topbarTitles: { products: "Showcase", orders: "Inquiries", customers: "Contacts", messages: "Messages", integrations: "More Tools" },
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
  emptyState: { ...DEFAULT_EMPTY, title: "No items yet", cta: "Add your first item" },
  topbarTitles: { integrations: "More Tools" },
  excludedModules: [],
  adminPages: [],
};

export function getVertical(category) {
  if (!category) return DEFAULT_VERTICAL;
  if (VERTICALS[category]) return VERTICALS[category];
  const canonical = resolveCanonicalCategory(category);
  if (canonical && VERTICALS[canonical]) return VERTICALS[canonical];
  const matched = getCategoryByKey(category);
  if (matched && VERTICALS[matched.key]) return VERTICALS[matched.key];
  return DEFAULT_VERTICAL;
}

export function getVerticalByKycType(kycType) {
  switch (kycType) {
    case "Retail": return VERTICALS.Business;
    case "Corporate": return VERTICALS.Corporate;
    case "Legal": return VERTICALS.Legal;
    case "Religion":
    case "Church": return VERTICALS.Religion;
    case "Education":
    case "School": return VERTICALS.Education;
    case "Healthcare": return VERTICALS.Healthcare;
    case "Hospitality":
    case "Restaurant": return VERTICALS["Food & Hospitality"];
    case "Service": return VERTICALS.Services;
    case "Events": return VERTICALS.Events;
    case "Nonprofit": return VERTICALS.Nonprofit;
    case "Personal": return VERTICALS.Personal;
    default: return DEFAULT_VERTICAL;
  }
}
