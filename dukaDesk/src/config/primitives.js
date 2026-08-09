/* Dashboard Primitives — the catalog of back-office building blocks.
   The sidebar and dashboard render from the tenant's *enabled* set:
   preset (from category preset) ∪ user-added − user-removed.

   Each primitive:
   - id: unique stable identifier (also the route segment under /dashboard)
   - label/icon/desc: nav + marketing copy
   - group: catalog group shown on the Integrations page
   - flags: moduleGate flags that can lock it off (empty = always available)
   - widgets: dashboard cards this primitive powers (kpi_<id>, revenue_trend, activity…)
   - page: optional sector page route (giving, attendance, fees, appointments)
   - preset: ids of other primitives that are auto-enabled when this one is enabled
   - locked: true when a higher plan is required to install it
*/

export const PRIMITIVES = [
  { id: "analytics", label: "Analytics", icon: "BarChart3", group: "Insights", desc: "Revenue, traffic & conversion overview", flags: ["analytics"], widgets: ["kpi_revenue", "revenue_trend"] },
  { id: "messages", label: "Messages", icon: "MessageSquare", group: "Communication", desc: "Chat with customers in real-time", flags: ["notifications"], widgets: ["messages_unread"] },
  { id: "marketing", label: "Marketing", icon: "Megaphone", group: "Communication", desc: "Campaigns, broadcasts & offers", flags: ["analytics", "notifications"], widgets: ["marketing_campaigns"] },
  { id: "integrations", label: "Integrations", icon: "Link2", group: "Integrations", desc: "Install & manage connected features", flags: ["integrations"], widgets: ["integrations_active"] },
  { id: "billing", label: "Billing", icon: "CreditCard", group: "Account", desc: "Plans, payments & invoices", flags: [], widgets: ["billing_plan"] },
  { id: "team", label: "Team", icon: "Users", group: "Account", desc: "Invite members & set permissions", flags: [], widgets: ["team_members"] },
  { id: "settings", label: "Settings", icon: "Settings", group: "Account", desc: "Profile, desk & notification settings", flags: [], widgets: [] },

  { id: "products", label: "Products", icon: "Package", group: "Commerce", desc: "Catalog, menu items & services", flags: ["commerce", "booking"], widgets: ["kpi_products"] },
  { id: "orders", label: "Orders", icon: "ShoppingCart", group: "Commerce", desc: "Take & manage orders", flags: ["commerce", "booking"], widgets: ["kpi_orders", "activity"] },
  { id: "customers", label: "Customers", icon: "Contact", group: "Commerce", desc: "Profiles, history & outreach", flags: ["commerce", "booking"], widgets: ["kpi_customers", "activity"] },
  { id: "inventory", label: "Inventory", icon: "ClipboardList", group: "Commerce", desc: "Stock levels & reordering", flags: ["commerce"], widgets: ["inventory_low"] },

  { id: "giving", label: "Donations", icon: "HandCoins", group: "Sector", desc: "Record & track donations", flags: ["commerce"], widgets: ["kpi_giving"], page: "giving" },
  { id: "attendance", label: "Attendance", icon: "CalendarCheck", group: "Sector", desc: "Track attendance & participation", flags: [], widgets: ["kpi_attendance"], page: "attendance" },
  { id: "fees", label: "Fees", icon: "Wallet", group: "Sector", desc: "Collect & manage payments", flags: ["commerce"], widgets: ["kpi_fees"], page: "fees" },
  { id: "appointments", label: "Appointments", icon: "CalendarClock", group: "Sector", desc: "View & manage bookings", flags: ["booking"], widgets: ["kpi_appointments"], page: "appointments" },
  { id: "reservations", label: "Reservations", icon: "CalendarDays", group: "Sector", desc: "Tables, slots & time-slot bookings", flags: ["booking", "commerce"], widgets: ["kpi_reservations"], page: "reservations" },
  { id: "memberships", label: "Memberships", icon: "BadgeCheck", group: "Sector", desc: "Recurring plans, subscribers & expiry", flags: [], widgets: ["kpi_memberships"], page: "memberships" },
  { id: "tickets", label: "Tickets", icon: "Ticket", group: "Sector", desc: "Event tickets, sales & check-in", flags: ["commerce"], widgets: ["kpi_tickets"], page: "tickets" },
  { id: "classes", label: "Classes", icon: "Dumbbell", group: "Sector", desc: "Class schedules, rosters & sign-ups", flags: [], widgets: ["kpi_classes"], page: "classes" },
];

export const PRIMITIVE_BY_ID = Object.fromEntries(PRIMITIVES.map(p => [p.id, p]));

export const PRIMITIVE_GROUPS = ["Insights", "Communication", "Commerce", "Sector", "Account", "Integrations"];

export function getPrimitive(id) {
  return PRIMITIVE_BY_ID[id] || null;
}

/* The fully enabled set for a given vertical preset (category modules + sector pages). */
export function verticalPresetModules(vertical) {
  if (!vertical) return [];
  const base = (vertical.modules || []).map(m => m.id);
  const sector = (vertical.adminPages || []).map(p => p.id);
  const set = new Set([...base, ...sector]);
  set.delete("settings");
  return [...set, "settings"];
}