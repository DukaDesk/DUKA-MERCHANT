import { resolveInsertionTarget } from "./insertionTarget";
import { useEditorTheme } from "./editorTheme.jsx";
import { getComponentType, ROW_TEMPLATES, ICON_LIBRARY } from "../canvas-editor/componentTypes";
import { toast } from "react-toastify";
import { Layout, ClipboardList, PanelTop, ChevronDown, Type, AlignLeft, Square, List, Star, Minus, Image as ImageIcon, Video, X, Monitor, LayoutDashboard, LogIn, UserCog, Bell, LifeBuoy, CreditCard, BarChart3, Package, Receipt, CalendarDays, CheckCircle2 } from "lucide-react";

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
function ScreenPreview({ label, description, icon: IconCmp, accent, theme }) {
  return (
    <div style={{ width: "100%", display: "flex", gap: 8, alignItems: "flex-start", minHeight: 56 }}>
      <div style={{
        width: 44, height: 56, borderRadius: 8, flexShrink: 0,
        background: theme.surface, border: `1px solid ${theme.border}`,
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        <div style={{ height: 12, background: accent || theme.active, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {IconCmp ? <IconCmp size={8} color="#fff" /> : null}
        </div>
        <div style={{ flex: 1, padding: 4, display: "flex", flexDirection: "column", gap: 3 }}>
          <div style={{ height: 4, borderRadius: 2, background: theme.hover, width: "85%" }} />
          <div style={{ height: 4, borderRadius: 2, background: theme.hover, width: "60%" }} />
          <div style={{ display: "flex", gap: 2 }}>
            <div style={{ flex: 1, height: 10, borderRadius: 3, background: theme.hoverAmber, border: `1px solid ${theme.border}` }} />
            <div style={{ flex: 1, height: 10, borderRadius: 3, background: theme.hover, border: `1px solid ${theme.border}` }} />
          </div>
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: theme.text, lineHeight: 1.2 }}>{label}</div>
        {description && (
          <div style={{ fontSize: 9, color: theme.textMuted, lineHeight: 1.35, marginTop: 2, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {description}
          </div>
        )}
      </div>
    </div>
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

/* ── Publish-ready screen templates ─────────────────────────────
 * Each entry is props-aware (every prop maps to a registered
 * component propField, editable in PropertiesPanel) and style-aware
 * (explicit colors / radius / typography, elegant light theme).
 * Selecting a variant creates real sections + a nav tab and focuses
 * the new screen so it is loaded and ready for Publish. */

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
  dashboard: () => ([
    { type: "hero_banner", props: { title: "Good morning, Ada", subtitle: "Here's what's happening today", badge: "LIVE", color: "#1A1A2E", variant: "left", radius: 16, height: 140 } },
    { type: "text_block", props: { text: "Today's summary", fontSize: 16, fontWeight: "700", color: "#1A1A2E" } },
    { type: "info_list", props: { items: [{ label: "Today's sales", value: "₦125,400 · 32 orders" }, { label: "Low stock alerts", value: "4 items need restock" }, { label: "Pending bookings", value: "6 awaiting confirmation" }] } },
    { type: "progress_bar", props: { value: 68, color: "#F4A026", background: "#E5E1E3", showLabel: "true" } },
    { type: "text_block", props: { text: "Recent activity", fontSize: 16, fontWeight: "700", color: "#1A1A2E" } },
    { type: "info_list", props: { items: [{ label: "Order #1042 — Jollof x2", value: "2 min ago · ₦5,000" }, { label: "New review — 5 stars", value: "18 min ago · Grilled Chicken" }] } },
    { type: "button", props: { label: "View reports", variant: "filled", background: "#1A1A2E", color: "#FFFFFF" } },
  ]),
  login: () => ([
    { type: "text_block", props: { text: "Welcome back", fontSize: 24, fontWeight: "800", alignment: "center", color: "#1A1A2E" } },
    { type: "text_block", props: { text: "Sign in securely with email or social login", fontSize: 13, fontWeight: "400", alignment: "center", color: "#6B7280" } },
    { type: "text_input", props: { label: "Email address", placeholder: "you@example.com", value: "", hint: "We’ll send an OTP to verify you" } },
    { type: "text_input", props: { label: "Password", placeholder: "••••••••", value: "", hint: "" } },
    { type: "checkbox_row", props: { label: "Remember me", checked: "true" } },
    { type: "button", props: { label: "Sign In", variant: "filled", background: "#1A1A2E", color: "#FFFFFF" } },
    { type: "button", props: { label: "Create Account", variant: "outline", background: "#1A1A2E", color: "#1A1A2E" } },
    { type: "divider", props: { color: "#E5E1E3", thickness: 1 } },
    { type: "text_block", props: { text: "Secured with OTP • Google • Apple", fontSize: 11, fontWeight: "500", alignment: "center", color: "#9CA3AF" } },
  ]),
  profile: () => ([
    { type: "avatar", props: { name: "Alex Morgan" } },
    { type: "text_block", props: { text: "Alex Morgan", fontSize: 20, fontWeight: "700", alignment: "center", color: "#1A1A2E" } },
    { type: "text_block", props: { text: "alex@example.com · Lagos", fontSize: 12, fontWeight: "400", alignment: "center", color: "#6B7280" } },
    { type: "divider", props: { color: "#E5E1E3", thickness: 1 } },
    { type: "text_input", props: { label: "Full name", placeholder: "Alex Morgan", value: "Alex Morgan" } },
    { type: "text_input", props: { label: "Phone", placeholder: "+234 …", value: "" } },
    { type: "switch_toggle", props: { label: "Push notifications", checked: "true", color: "#2ECC71" } },
    { type: "switch_toggle", props: { label: "Email receipts", checked: "false", color: "#2ECC71" } },
    { type: "button", props: { label: "Save changes", variant: "filled", background: "#1A1A2E", color: "#FFFFFF" } },
    { type: "button", props: { label: "Change password", variant: "outline", background: "#1A1A2E", color: "#1A1A2E" } },
  ]),
  notifications: () => ([
    { type: "text_block", props: { text: "Notifications", fontSize: 22, fontWeight: "800", color: "#1A1A2E" } },
    { type: "text_block", props: { text: "Alerts, updates and messages — newest first", fontSize: 12, fontWeight: "400", color: "#6B7280" } },
    { type: "notification_list", props: { notifications: [{ title: "Order #1042 confirmed", message: "Jollof Rice x2 · ready in 20 min", time: "2 min ago", icon: "Receipt", unread: true }, { title: "Low stock: Chapman", message: "Only 3 left — restock to avoid stockout", time: "1 hr ago", icon: "Package", unread: true }, { title: "Payout sent", message: "₦84,200 settled to ••4521", time: "Yesterday", icon: "Wallet", unread: false }] } },
    { type: "button", props: { label: "Mark all as read", variant: "outline", background: "#1A1A2E", color: "#1A1A2E" } },
  ]),
  support: () => ([
    { type: "text_block", props: { text: "Help & Support", fontSize: 22, fontWeight: "800", color: "#1A1A2E" } },
    { type: "text_block", props: { text: "FAQs, contact form and live chat", fontSize: 12, fontWeight: "400", color: "#6B7280" } },
    { type: "search_bar", props: { placeholder: "Search FAQs…" } },
    { type: "info_list", props: { items: [{ label: "What are delivery hours?", value: "Mon–Sat · 9am–9pm" }, { label: "How do refunds work?", value: "Within 48 hrs to wallet or bank" }, { label: "Talk to a human", value: "Avg reply under 5 min" }] } },
    { type: "card", props: { title: "Still stuck?", subtitle: "Our team replies in minutes on live chat.", badge: "SUPPORT", emoji: "Headphones", variant: "vertical", buttonLabel: "Start live chat", buttonBackground: "#1A1A2E", buttonTextColor: "#FFFFFF" } },
    { type: "report_action", props: { title: "Send us a message" } },
  ]),
  billing: () => ([
    { type: "text_block", props: { text: "Billing & Subscription", fontSize: 22, fontWeight: "800", color: "#1A1A2E" } },
    { type: "card", props: { title: "Pro plan · ₦9,800/mo", subtitle: "Renews 1 Oct · 3 seats · unlimited orders", badge: "ACTIVE", emoji: "Crown", variant: "vertical", buttonLabel: "Manage plan", buttonBackground: "#F4A026", buttonTextColor: "#1A1A2E" } },
    { type: "text_block", props: { text: "Usage this month", fontSize: 14, fontWeight: "600", color: "#1A1A2E" } },
    { type: "progress_bar", props: { value: 42, color: "#7C3AED", background: "#E5E1E3", showLabel: "true" } },
    { type: "text_block", props: { text: "Payment method", fontSize: 14, fontWeight: "600", color: "#1A1A2E" } },
    { type: "info_list", props: { items: [{ label: "Visa •• 4521", value: "Expires 08/27 · default" }, { label: "Next charge", value: "₦9,800 on 1 Oct" }] } },
    { type: "text_block", props: { text: "Invoices", fontSize: 14, fontWeight: "600", color: "#1A1A2E" } },
    { type: "info_list", props: { items: [{ label: "INV-0901 · September", value: "Paid · ₦9,800" }, { label: "INV-0801 · August", value: "Paid · ₦9,800" }] } },
    { type: "button", props: { label: "Update payment method", variant: "filled", background: "#1A1A2E", color: "#FFFFFF" } },
  ]),
  analytics: () => ([
    { type: "hero_banner", props: { title: "₦1.2M revenue", subtitle: "September · +18% vs August", badge: "+18%", color: "#1A1A2E", variant: "left", radius: 16, height: 140 } },
    { type: "text_block", props: { text: "Key metrics", fontSize: 16, fontWeight: "700", color: "#1A1A2E" } },
    { type: "info_list", props: { items: [{ label: "Orders", value: "1,284 · +12%" }, { label: "Avg basket", value: "₦3,150 · +4%" }, { label: "Repeat customers", value: "38% · +6 pts" }] } },
    { type: "text_block", props: { text: "Monthly goal", fontSize: 14, fontWeight: "600", color: "#1A1A2E" } },
    { type: "progress_bar", props: { value: 76, color: "#0D9488", background: "#E5E1E3", showLabel: "true" } },
    { type: "card", props: { title: "Top seller: Grilled Chicken", subtitle: "312 sold · ₦936,000 · 4.9 rating", badge: "TOP", emoji: "Drumstick", variant: "horizontal" } },
    { type: "rating", props: { value: 5, color: "#F4A644", size: 18 } },
    { type: "button", props: { label: "Export report", variant: "outline", background: "#1A1A2E", color: "#1A1A2E" } },
  ]),
  inventory: () => ([
    { type: "search_bar", props: { placeholder: "Search products, SKU…" } },
    { type: "category_pills", props: { cats: [{ label: "All", active: true }, { label: "Mains", active: false }, { label: "Drinks", active: false }, { label: "Sides", active: false }] } },
    { type: "menu_grid", props: { columns: 2, items: [{ name: "Jollof Rice", price: "₦2,500", desc: "In stock · 42", emoji: "Utensils", badge: "" }, { name: "Grilled Chicken", price: "₦3,000", desc: "In stock · 18", emoji: "Drumstick", badge: "Popular" }, { name: "Chapman", price: "₦1,500", desc: "Low · 3 left", emoji: "CupSoda", badge: "Low" }, { name: "Fruit Juice", price: "₦1,200", desc: "In stock · 25", emoji: "GlassWater", badge: "" }] } },
    { type: "text_block", props: { text: "Stock alerts", fontSize: 14, fontWeight: "700", color: "#1A1A2E" } },
    { type: "info_list", props: { items: [{ label: "Chapman — 3 left", value: "Reorder point: 10" }, { label: "Plates pack — 5 left", value: "Reorder point: 20" }] } },
    { type: "button", props: { label: "Add product", variant: "filled", background: "#1A1A2E", color: "#FFFFFF" } },
  ]),
  orders: () => ([
    { type: "text_block", props: { text: "Orders", fontSize: 22, fontWeight: "800", color: "#1A1A2E" } },
    { type: "text_block", props: { text: "Receipts and fulfillment status", fontSize: 12, fontWeight: "400", color: "#6B7280" } },
    { type: "search_bar", props: { placeholder: "Search order #, item…" } },
    { type: "order_history", props: { showStatus: true, orders: [{ id: "#1042", status: "Delivered", items: "Jollof Rice x2 · Chapman", date: "Today · 12:40", total: 6500 }, { id: "#1041", status: "Preparing", items: "Grilled Chicken · Juice", date: "Today · 11:15", total: 4200 }, { id: "#1039", status: "Pending", items: "Family platter", date: "Yesterday", total: 12800 }] } },
    { type: "button", props: { label: "Download receipts", variant: "outline", background: "#1A1A2E", color: "#1A1A2E" } },
  ]),
  calendar: () => ([
    { type: "text_block", props: { text: "Book a slot", fontSize: 22, fontWeight: "800", color: "#1A1A2E" } },
    { type: "text_block", props: { text: "Meetings, bookings and deadlines", fontSize: 12, fontWeight: "400", color: "#6B7280" } },
    { type: "calendar_strip", props: { minDate: "today", maxDate: "+30", variant: "default" } },
    { type: "text_block", props: { text: "Available times", fontSize: 14, fontWeight: "600", color: "#1A1A2E" } },
    { type: "slot_grid", props: { duration: 60, variant: "default" } },
    { type: "booking_summary", props: { service: "Consultation", subtitle: "60 min · with Ada", duration: 60, total: 8000 } },
    { type: "button", props: { label: "Confirm booking", variant: "filled", background: "#1A1A2E", color: "#FFFFFF" } },
  ]),
};

const ICON_NAMES = ["Star", "Heart", "Bell", "Home", "User", "Settings", "Search", "Mail", "Phone", "Camera", "Check", "Info"];

const GALLERY = {
  Layout: {
    icon: Layout,
    variants: [
      { id: "section", label: "Section", type: "nested_section", props: {}, Preview: (t) => <RowPreview weights={[1]} theme={t} /> },
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
    hint: "Tap a screen to create it, link it to nav and load it — ready for Publish.",
    screenVariants: [
      { id: "dashboard", label: "Dashboard", description: "Quick summary of key data, recent activity and shortcuts.", icon: LayoutDashboard, tabIcon: "LayoutGrid", accent: "#1A1A2E", background: "#FCF8FA", build: SCREEN_BUILDERS.dashboard },
      { id: "login", label: "Login & Sign-Up", description: "Secure email + social login, OTP ready.", icon: LogIn, tabIcon: "Key", accent: "#0D9488", background: "#FFFFFF", build: SCREEN_BUILDERS.login },
      { id: "profile", label: "Profile & Settings", description: "Personal details, password and app preferences.", icon: UserCog, tabIcon: "User", accent: "#7C3AED", background: "#FCF8FA", build: SCREEN_BUILDERS.profile },
      { id: "notifications", label: "Notifications", description: "Alerts, updates and messages.", icon: Bell, tabIcon: "Bell", accent: "#F4A026", background: "#FCF8FA", build: SCREEN_BUILDERS.notifications },
      { id: "support", label: "Help & Support", description: "FAQs, contact form and live chat.", icon: LifeBuoy, tabIcon: "HelpCircle", accent: "#0EA5E9", background: "#FFFFFF", build: SCREEN_BUILDERS.support },
      { id: "billing", label: "Billing & Plan", description: "Payment methods, invoices and pricing plans.", icon: CreditCard, tabIcon: "CreditCard", accent: "#7C3AED", background: "#FCF8FA", build: SCREEN_BUILDERS.billing },
      { id: "analytics", label: "Analytics & Reports", description: "Charts, metrics, sales data and graphs.", icon: BarChart3, tabIcon: "BarChart3", accent: "#0D9488", background: "#FCF8FA", build: SCREEN_BUILDERS.analytics },
      { id: "inventory", label: "Inventory / Catalog", description: "Goods, stock levels and categories.", icon: Package, tabIcon: "Package", accent: "#EA580C", background: "#FCF8FA", build: SCREEN_BUILDERS.inventory },
      { id: "orders", label: "Orders & History", description: "Past purchases, receipts and fulfillment.", icon: Receipt, tabIcon: "Receipt", accent: "#1A1A2E", background: "#FCF8FA", build: SCREEN_BUILDERS.orders },
      { id: "calendar", label: "Calendar & Booking", description: "Bookings, meetings and deadlines.", icon: CalendarDays, tabIcon: "Calendar", accent: "#2ECC71", background: "#FFFFFF", build: SCREEN_BUILDERS.calendar },
      { id: "checkout", label: "Checkout", description: "Cart summary with totals and Pay action.", icon: Monitor, tabIcon: "ShoppingCart", accent: "#1A1A2E", background: "#FCF8FA", build: SCREEN_BUILDERS.checkout },
      { id: "sales", label: "Sales", description: "Simple product + price list starter.", icon: Monitor, tabIcon: "Tag", accent: "#6B7280", background: "#FCF8FA", build: SCREEN_BUILDERS.sales },
      { id: "home", label: "Home", description: "Hero + image + CTA starter.", icon: Monitor, tabIcon: "Home", accent: "#1A1A2E", background: "#FCF8FA", build: SCREEN_BUILDERS.home },
      { id: "splash", label: "Splash", description: "App-entry logo screen (no nav tab).", icon: Monitor, tabIcon: "", accent: "#1A1A2E", background: "#1A1A2E", build: SCREEN_BUILDERS.splash },
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

export default function ElementGallery({ browseType, store, selectedSectionId, selectedComponentId, onClose, insertionTarget, onAdded }) {
  const { theme } = useEditorTheme();
  const config = GALLERY[browseType];
  const IconCmp = config?.icon || Square;
  const canAdd = Boolean(selectedSectionId || store.screen);

  const add = (variant) => {
    if (!canAdd) return;
    const props = { ...(getComponentType(variant.type)?.defaultProps || {}), ...variant.props };
    const sectionId = insertionTarget?.sectionId || selectedSectionId;
    if (!sectionId) {
      const added = store.addComponentToScreen(variant.type, props);
      if (added) { onAdded?.(added.sectionId, added.id); onClose?.(); }
      return;
    }
    const selectedSection = (store.screen?.bodySections || []).find(section => section.id === sectionId);
    const section = selectedSection && (store.resolveSection?.(selectedSection) || selectedSection);
    const target = resolveInsertionTarget(section, selectedComponentId, insertionTarget);
    const id = target
      ? store.insertComponentAt(sectionId, target.parentId, target.index, variant.type, props)
      : store.addComponentToSection(sectionId, variant.type, props);
    if (id) onAdded?.(sectionId, id);
    onClose?.();
    toast.success(`${browseType} added`);
  };

  const addScreenLayout = (variant) => {
    if (variant.id === "splash") {
      // Splash is never on tabs — it shows on app entry with centered logo and editable bg
      const splashBg = store.data.splash?.backgroundColor || store.data.meta?.primaryColor || "#1A1A2E";
      store.setSplash({ backgroundColor: splashBg });
      // Ensure no tab is created for splash; switch to splash editing if needed
      toast.success(`Splash screen configured — edit its background and logo in Page Content`);
      return;
    }
    // Build with style-aware defaults: merge each component's registered
    // defaultProps so every prop stays editable in PropertiesPanel.
    const raw = variant.build();
    const components = (raw || []).map((c) => ({
      type: c.type,
      props: { ...(getComponentType(c.type)?.defaultProps || {}), ...(c.props || {}) },
      ...(c.children ? { children: c.children } : {}),
    }));
    const sid = store.addScreen(null, variant.label);
    // Apply the template's elegant background (style-aware) when supported.
    if (variant.background && store.setScreenBackgroundColor) {
      store.setScreenBackgroundColor(sid, variant.background);
    }
    store.addBodySection(sid, { name: `${variant.label} — Main`, backgroundColor: variant.background || "#FCF8FA", components });
    // Link to bottom nav (publish-ready: tab label + icon + valid screenId)
    if (variant.tabIcon !== "") {
      const existingTabs = store.data?.navigation?.tabs || [];
      const alreadyLinked = existingTabs.some((t) => t.screenId === sid);
      if (!alreadyLinked) {
        store.addTab({ label: variant.label, icon: variant.tabIcon || "Home", screenId: sid });
      }
    }
    // Load it immediately so selection = loaded + ready for Publish.
    if (store.setCurrentScreenId) store.setCurrentScreenId(sid);
    onAdded?.(null, null);
    onClose?.();
    toast.success(`${variant.label} loaded — ready for Publish`);
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
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {config.hint && (
              <div style={{ background: theme.hoverAmber, borderRadius: theme.radius.md, padding: "8px 10px", marginBottom: 2, display: "flex", gap: 6, alignItems: "flex-start" }}>
                <CheckCircle2 size={13} color="#92400E" style={{ flexShrink: 0, marginTop: 1 }} />
                <div style={{ fontSize: 10, color: "#92400E", lineHeight: 1.4 }}>{config.hint}</div>
              </div>
            )}
            {config.screenVariants.map((v) => (
              <button
                key={v.id}
                title={`Add ${v.label} screen`}
                onClick={() => addScreenLayout(v)}
                style={{
                  display: "flex", flexDirection: "column", gap: 6, alignItems: "stretch",
                  padding: 10, borderRadius: theme.radius.md, cursor: "pointer",
                  border: `1px solid ${theme.border}`, background: theme.surface, textAlign: "left",
                  transition: `box-shadow ${theme.transition}, border-color ${theme.transition}`,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = v.accent || theme.active; e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.boxShadow = "none"; }}
              >
                <ScreenPreview label={v.label} description={v.description} icon={v.icon} accent={v.accent} theme={theme} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 2 }}>
                  <div style={{ fontSize: 9, color: theme.textMuted, display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: v.accent || theme.active, display: "inline-block" }} />
                    {`${(v.build?.() || []).length} blocks · styled`}
                  </div>
                  <div style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.06em", color: "#15803D", background: "#DCFCE7", borderRadius: 999, padding: "2px 7px" }}>
                    PUBLISH-READY
                  </div>
                </div>
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
                title={canAdd ? `Add ${v.label}` : "Select a screen or section first"}
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
