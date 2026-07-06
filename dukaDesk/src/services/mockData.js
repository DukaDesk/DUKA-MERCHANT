/* ===================================================================
   MOCK DATA — Single source of truth for all dummy data.
   Replace each section with real API responses when backend is ready.
   =================================================================== */

/* ───── Auth ───── */
export const MOCK_LOGIN = (email) => ({
  token: "mock_token_" + Date.now(),
  merchant: {
    id: 1,
    name: email?.split("@")[0] || "Merchant",
    business: "My Store",
    email,
    avatar: (email?.[0] || "M").toUpperCase(),
  },
});

export const MOCK_SIGNUP = (body) => ({
  token: "mock_token_" + Date.now(),
  merchant: {
    id: 1,
    name: body.fullName,
    business: body.businessName,
    email: body.email,
    avatar: body.fullName.split(" ").map(n => n[0]).join(""),
  },
});

export const MOCK_FORGOT_PASSWORD = (email) => ({
  message: "Password reset link sent to " + email,
});

/* ───── Wizard Setup Data ───── */
export const WIZARD_STEPS = ["Category", "Template", "Branding", "Business Info", "Integrations"];

export const WIZARD_CATEGORIES = [
  { icon: "🍽️", name: "Restaurant", desc: "Full menus, ordering & delivery" },
  { icon: "🛍️", name: "Ecommerce", desc: "Products, cart & checkout" },
  { icon: "🥗", name: "Food Vendor", desc: "Bukas, home kitchens, caterers" },
  { icon: "🛒", name: "Grocery", desc: "Supermarkets & local stores" },
  { icon: "⛪", name: "Church", desc: "Events, giving & community" },
  { icon: "🏫", name: "School", desc: "Timetables, fees & announcements" },
  { icon: "📅", name: "Booking", desc: "Appointments & scheduling" },
];

export const WIZARD_TEMPLATES_BY_CATEGORY = {
  Restaurant: [
    { name: "Classic Dine", tags: ["Elegant", "Warm tones"], features: ["Menu", "Cart", "Orders", "Reservations"], preview: "🍜" },
    { name: "Modern Bites", tags: ["Dark theme", "Bold type"], features: ["Menu", "Cart", "Orders", "Table Booking"], preview: "🍔" },
    { name: "Fresh & Bright", tags: ["Minimal", "Photo-forward"], features: ["Menu", "Cart", "Delivery", "Pickup"], preview: "🥗" },
  ],
  Ecommerce: [
    { name: "Storefront", tags: ["Clean", "Product-first"], features: ["Products", "Cart", "Checkout", "Reviews"], preview: "🛍️" },
    { name: "Flash Sale", tags: ["Bold", "Urgency-driven"], features: ["Products", "Cart", "Deals", "Countdown"], preview: "⚡" },
    { name: "Minimal Shop", tags: ["Minimal", "Modern"], features: ["Products", "Cart", "Wishlist", "Checkout"], preview: "🛒" },
  ],
  "Food Vendor": [
    { name: "Street Eats", tags: ["Bold", "Colorful"], features: ["Menu", "Cart", "Orders", "Quick Pickup"], preview: "🌮" },
    { name: "Home Kitchen", tags: ["Warm", "Homely"], features: ["Menu", "Cart", "Delivery", "Catering"], preview: "🍲" },
    { name: "Fast Bites", tags: ["Clean", "Speedy"], features: ["Menu", "Cart", "Express Orders", "Pickup"], preview: "🥪" },
  ],
  Grocery: [
    { name: "Market Fresh", tags: ["Clean", "Fresh"], features: ["Products", "Cart", "Delivery", "Pickup"], preview: "🥬" },
    { name: "Corner Shop", tags: ["Warm", "Neighborhood"], features: ["Products", "Cart", "Home Delivery", "Loyalty"], preview: "🏪" },
    { name: "Bulk Buy", tags: ["Bold", "Value"], features: ["Products", "Cart", "Bulk Pricing", "Delivery"], preview: "📦" },
  ],
  Church: [
    { name: "Cathedral", tags: ["Elegant", "Serene"], features: ["Events", "Giving", "Sermons", "Community"], preview: "⛪" },
    { name: "Community Light", tags: ["Warm", "Modern"], features: ["Events", "Giving", "Announcements", "Prayer Requests"], preview: "🕯️" },
    { name: "Youth Vibes", tags: ["Bold", "Modern"], features: ["Events", "Giving", "Media", "Small Groups"], preview: "🔥" },
  ],
  School: [
    { name: "Academy Pro", tags: ["Clean", "Professional"], features: ["Timetables", "Fees", "Announcements", "Grades"], preview: "🏫" },
    { name: "Bright Minds", tags: ["Playful", "Colorful"], features: ["Timetables", "Fees", "Events", "Parent Comms"], preview: "🎓" },
    { name: "Smart Campus", tags: ["Modern", "Digital-first"], features: ["Timetables", "Fees", "Assignments", "Live Classes"], preview: "💻" },
  ],
  Booking: [
    { name: "Scheduler", tags: ["Clean", "Efficient"], features: ["Appointments", "Calendar", "Reminders", "Payments"], preview: "📅" },
    { name: "Spa Lounge", tags: ["Elegant", "Relaxed"], features: ["Services", "Booking", "Reminders", "Reviews"], preview: "💆" },
    { name: "Quick Book", tags: ["Minimal", "Fast"], features: ["Services", "Booking", "Calendar Sync", "Payments"], preview: "⚡" },
  ],
};

export const WIZARD_FEATURE_INTEGRATION_MAP = {
  Menu: [], Cart: ["Product Cart", "Order Tracking"], Orders: ["Order Tracking", "Waitlist"],
  Reservations: ["Appointment Calendar", "Booking Reminders", "Waitlist"], "Table Booking": ["Appointment Calendar", "Booking Reminders", "Waitlist"],
  Delivery: ["Order Tracking"], Pickup: [], Products: ["Product Cart", "Wishlist"],
  Checkout: ["Product Cart"], Reviews: ["In-App Messaging", "FAQ Widget", "Live Chat Support"], Deals: ["Discount Codes"],
  Countdown: ["Push Notifications"], Wishlist: ["Product Cart", "Wishlist"],
  "Quick Pickup": [], Catering: ["Appointment Calendar"],
  "Express Orders": ["Order Tracking"], "Home Delivery": ["Order Tracking"],
  Loyalty: ["Loyalty Points", "Referral Program"], "Bulk Pricing": ["Discount Codes"],
  Events: ["Appointment Calendar", "Push Notifications"], Giving: [],
  Sermons: [], Community: ["In-App Messaging", "Email Capture", "FAQ Widget"],
  Announcements: ["Push Notifications"], "Prayer Requests": ["In-App Messaging"],
  Media: [], "Small Groups": [], Timetables: [], Fees: [], Grades: [],
  "Parent Comms": ["In-App Messaging", "Push Notifications", "FAQ Widget"],
  Assignments: [], "Live Classes": [], Appointments: ["Appointment Calendar", "Booking Reminders", "Waitlist"],
  Calendar: ["Appointment Calendar", "Booking Reminders"], Services: ["Appointment Calendar", "Waitlist"],
  "Calendar Sync": ["Appointment Calendar"], Payments: [],
  Reminders: ["Booking Reminders", "Push Notifications"],
};

export const WIZARD_PREVIEW_DATA = {
  Restaurant: { categories: ["Popular", "Mains", "Drinks"], items: [{ emoji: "🍛", name: "Jollof Rice", price: "₦2,500" }, { emoji: "🍗", name: "Grilled Chicken", price: "₦4,500" }], cta: "Add to Cart", badge: "Open Now" },
  Ecommerce: { categories: ["New Arrivals", "Clothing", "Electronics"], items: [{ emoji: "👗", name: "African Print Dress", price: "₦15,000" }, { emoji: "📱", name: "Wireless Earbuds", price: "₦8,500" }], cta: "Buy Now", badge: "Online" },
  "Food Vendor": { categories: ["Popular", "Specials", "Combo"], items: [{ emoji: "🌮", name: "Spicy Shawarma", price: "₦3,000" }, { emoji: "🥤", name: "Zobo Drink", price: "₦500" }], cta: "Order Now", badge: "Open Now" },
  Grocery: { categories: ["Fruits", "Beverages", "Snacks"], items: [{ emoji: "🍎", name: "Fresh Apples (1kg)", price: "₦2,000" }, { emoji: "🥛", name: "Milo (500g)", price: "₦3,500" }], cta: "Add to Cart", badge: "Open Now" },
  Church: { categories: ["Upcoming", "Sermons", "Ministries"], items: [{ emoji: "📖", name: "Sunday Service", price: "10:00 AM" }, { emoji: "🙏", name: "Prayer Meeting", price: "Wed 6:00 PM" }], cta: "Join Us", badge: "Welcome" },
  School: { categories: ["Announcements", "Timetable", "Events"], items: [{ emoji: "📚", name: "Term 2 Exams", price: "Mar 15" }, { emoji: "🏆", name: "Sports Day", price: "Apr 10" }], cta: "View Details", badge: "Open" },
  Booking: { categories: ["Services", "Popular", "Special Offers"], items: [{ emoji: "💇", name: "Hair Styling", price: "₦8,000" }, { emoji: "💆", name: "Full Body Massage", price: "₦15,000" }], cta: "Book Now", badge: "Open Now" },
};

export const WIZARD_COLORS = ["#1A1A2E", "#F4A026", "#2ECC71", "#E74C3C", "#7C3AED", "#0D9488", "#EA580C", "#EC4899", "#000000"];

export const WIZARD_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const WIZARD_INTEGRATIONS = [
  { cat: "Payments", items: [{ icon: "💳", name: "Paystack", desc: "Cards, bank transfer & USSD", badge: "Popular" }, { icon: "💳", name: "Flutterwave", desc: "Pan-African gateway", badge: "Popular" }, { icon: "🏦", name: "Bank Transfer", desc: "Manual bank details", badge: "Free" }] },
  { cat: "Commerce", items: [{ icon: "🛒", name: "Product Cart", desc: "Full cart & checkout flow", badge: "Popular" }, { icon: "🏷️", name: "Discount Codes", desc: "Create promo codes", badge: "Free" }, { icon: "📦", name: "Order Tracking", desc: "Real-time order status", badge: "Popular" }] },
  { cat: "Booking", items: [{ icon: "📅", name: "Appointment Calendar", desc: "Self-booking for customers", badge: "Popular" }, { icon: "⏰", name: "Booking Reminders", desc: "SMS/push reminders", badge: "Popular" }] },
  { cat: "Loyalty", items: [{ icon: "⭐", name: "Loyalty Points", desc: "Earn & redeem rewards", badge: "Popular" }, { icon: "🔔", name: "Push Notifications", desc: "Broadcast offers to users", badge: "Popular" }] },
  { cat: "Communication", items: [{ icon: "💬", name: "In-App Messaging", desc: "Live chat with customers", badge: "Popular" }, { icon: "📱", name: "WhatsApp Link", desc: "Quick WhatsApp contact", badge: "Free" }] },
];

export const WIZARD_ALWAYS_INCLUDED = ["Paystack", "Flutterwave", "Bank Transfer", "In-App Messaging", "WhatsApp Link"];

export const UNIVERSAL_INTEGRATIONS = ["Email Capture", "FAQ Widget", "Loyalty Points", "Push Notifications"];

export function getTemplateIntegrationNames(templateName) {
  const allTemplates = Object.values(WIZARD_TEMPLATES_BY_CATEGORY).flat();
  const tmpl = allTemplates.find(t => t.name === templateName);
  if (!tmpl) return [...WIZARD_ALWAYS_INCLUDED, ...UNIVERSAL_INTEGRATIONS];
  const names = new Set(tmpl.features.flatMap(f => WIZARD_FEATURE_INTEGRATION_MAP[f] || []));
  return [...WIZARD_ALWAYS_INCLUDED, ...UNIVERSAL_INTEGRATIONS, ...names];
}

export const WIZARD_PUBLISH_STEPS = [
  "Our team reviews your app (usually within 2 hours)",
  "You'll receive an email when you go live",
  "Start adding your products from your dashboard",
  "Share your QR code — customers scan to access your app!",
];

/* ───── Dashboard ───── */
export const DASHBOARD_STATS_BY_CATEGORY = {
  Restaurant: { customers: 1204, revenue: 48200, unreadMessages: 7, avgRating: 4.8, reviewsCount: 234 },
  Ecommerce: { customers: 3402, revenue: 284000, unreadMessages: 12, avgRating: 4.5, reviewsCount: 187 },
  "Food Vendor": { customers: 880, revenue: 18200, unreadMessages: 5, avgRating: 4.7, reviewsCount: 98 },
  Grocery: { customers: 2140, revenue: 126000, unreadMessages: 9, avgRating: 4.4, reviewsCount: 156 },
  Church: { customers: 560, revenue: 32000, unreadMessages: 3, avgRating: 4.9, reviewsCount: 42 },
  School: { customers: 1200, revenue: 185000, unreadMessages: 8, avgRating: 4.3, reviewsCount: 73 },
  Booking: { customers: 780, revenue: 64000, unreadMessages: 6, avgRating: 4.6, reviewsCount: 112 },
};

export const DASHBOARD_REVENUE_BY_CATEGORY = {
  Restaurant: [{ week: "W1", revenue: 12000 }, { week: "W2", revenue: 28000 }, { week: "W3", revenue: 22000 }, { week: "W4", revenue: 48200 }],
  Ecommerce: [{ week: "W1", revenue: 45000 }, { week: "W2", revenue: 82000 }, { week: "W3", revenue: 68000 }, { week: "W4", revenue: 284000 }],
  "Food Vendor": [{ week: "W1", revenue: 4200 }, { week: "W2", revenue: 8800 }, { week: "W3", revenue: 6500 }, { week: "W4", revenue: 18200 }],
  Grocery: [{ week: "W1", revenue: 28000 }, { week: "W2", revenue: 35000 }, { week: "W3", revenue: 31000 }, { week: "W4", revenue: 126000 }],
  Church: [{ week: "W1", revenue: 8000 }, { week: "W2", revenue: 6000 }, { week: "W3", revenue: 10000 }, { week: "W4", revenue: 32000 }],
  School: [{ week: "W1", revenue: 52000 }, { week: "W2", revenue: 44000 }, { week: "W3", revenue: 48000 }, { week: "W4", revenue: 185000 }],
  Booking: [{ week: "W1", revenue: 14000 }, { week: "W2", revenue: 18000 }, { week: "W3", revenue: 16000 }, { week: "W4", revenue: 64000 }],
};

export const DASHBOARD_ACTIVITY_BY_CATEGORY = {
  Restaurant: [{ icon: "🛒", title: "New order from Tunde", sub: "₦3,500 · 2 items", time: "10 min ago", color: "#F4A026" }, { icon: "💬", title: "New message from Chika", sub: "Is delivery available?", time: "25 min ago", color: "#7C3AED" }, { icon: "⭐", title: "New 5-star review", sub: "Amazing food, will order again!", time: "1 hr ago", color: "#2ECC71" }, { icon: "📱", title: "Menu viewed 43 times today", sub: "Via QR scan", time: "Today", color: "#1A1A2E" }],
  Ecommerce: [{ icon: "🛒", title: "New order from Blessing", sub: "₦12,500 · 3 items", time: "8 min ago", color: "#F4A026" }, { icon: "💬", title: "Inquiry from Emmanuel", sub: "Is this available in size L?", time: "20 min ago", color: "#7C3AED" }, { icon: "⭐", title: "New 5-star product review", sub: "Great quality, fast shipping!", time: "2 hrs ago", color: "#2ECC71" }, { icon: "📱", title: "Store viewed 128 times today", sub: "Via QR scan", time: "Today", color: "#1A1A2E" }],
  "Food Vendor": [{ icon: "🛒", title: "New order from Amina", sub: "₦2,800 · 4 items", time: "15 min ago", color: "#F4A026" }, { icon: "💬", title: "Message from Ola", sub: "Can I get extra pepper?", time: "30 min ago", color: "#7C3AED" }, { icon: "⭐", title: "New 5-star review", sub: "Best shawarma in town!", time: "45 min ago", color: "#2ECC71" }, { icon: "📱", title: "Menu viewed 28 times today", sub: "Via QR scan", time: "Today", color: "#1A1A2E" }],
  Grocery: [{ icon: "🛒", title: "New order from Mrs. Obi", sub: "₦8,200 · 12 items", time: "12 min ago", color: "#F4A026" }, { icon: "📦", title: "Delivery completed", sub: "Order #2040 delivered", time: "1 hr ago", color: "#2ECC71" }, { icon: "💬", title: "Message from Mr. Ade", sub: "Do you have fresh tomatoes?", time: "2 hrs ago", color: "#7C3AED" }, { icon: "📱", title: "Store viewed 65 times today", sub: "Via QR scan", time: "Today", color: "#1A1A2E" }],
  Church: [{ icon: "🙏", title: "New prayer request", sub: "From Sister Grace", time: "5 min ago", color: "#7C3AED" }, { icon: "💰", title: "Tithe received", sub: "₦15,000 from Brother John", time: "1 hr ago", color: "#2ECC71" }, { icon: "📅", title: "Event registration", sub: "Sunday service · 45 confirmed", time: "3 hrs ago", color: "#F4A026" }, { icon: "📱", title: "Church app viewed 18 times", sub: "Via QR scan", time: "Today", color: "#1A1A2E" }],
  School: [{ icon: "📚", title: "New fee payment", sub: "₦85,000 term fees paid", time: "30 min ago", color: "#2ECC71" }, { icon: "📢", title: "Announcement posted", sub: "Mid-term break notice", time: "2 hrs ago", color: "#F4A026" }, { icon: "💬", title: "Parent inquiry", sub: "Mrs. Eze asked about timetable", time: "4 hrs ago", color: "#7C3AED" }, { icon: "📱", title: "School app viewed 52 times", sub: "Via QR scan", time: "Today", color: "#1A1A2E" }],
  Booking: [{ icon: "📅", title: "New booking from Chioma", sub: "Hair styling · Tomorrow 2pm", time: "5 min ago", color: "#F4A026" }, { icon: "⏰", title: "Reminder sent", sub: "Jane's appointment in 2 hrs", time: "1 hr ago", color: "#7C3AED" }, { icon: "⭐", title: "New 5-star review", sub: "Excellent service, very professional!", time: "3 hrs ago", color: "#2ECC71" }, { icon: "📱", title: "Service menu viewed 34 times", sub: "Via QR scan", time: "Today", color: "#1A1A2E" }],
};

/* ───── Products ───── */
export const MOCK_PRODUCTS = [
  { id: 1, name: "Jollof Rice & Chicken", cat: "Mains", price: 2500, oldPrice: null, stock: 34, status: "In Stock", img: "🍛" },
  { id: 2, name: "Peppered Gizzard", cat: "Sides", price: 1800, oldPrice: 2200, stock: 12, status: "In Stock", img: "🍗" },
  { id: 3, name: "Grilled Tilapia", cat: "Mains", price: 4500, oldPrice: null, stock: 4, status: "Low Stock", img: "🐟" },
  { id: 4, name: "Egusi Soup", cat: "Mains", price: 3200, oldPrice: null, stock: 0, status: "Out of Stock", img: "🥣" },
  { id: 5, name: "Zobo Drink", cat: "Drinks", price: 500, oldPrice: null, stock: 50, status: "In Stock", img: "🥤" },
  { id: 6, name: "Puff Puff (10 pcs)", cat: "Snacks", price: 800, oldPrice: 1000, stock: 20, status: "In Stock", img: "🍩" },
];

export const PRODUCT_STATUS_OPTIONS = ["In Stock", "Low Stock", "Out of Stock"];
export const PRODUCT_EMOJI_GRID = ["🍛", "🍗", "🐟", "🥣", "🥤", "🍩", "🍕", "🥗", "🍔", "🍜"];

export const PRODUCT_DEFAULT_FORM = { name: "", cat: "", price: "", stock: "", status: "In Stock", img: "🍛" };

/* ───── Orders ───── */
export const MOCK_ORDERS = [
  { id: "DD-2041", customer: "Tunde Adeyemi", items: "Jollof Rice ×2", total: 7000, payment: "Paystack", status: "Pending", date: "Jun 22, 2:14 PM", address: "12 Admiralty Way, Lekki" },
  { id: "DD-2040", customer: "Chika Obi", items: "Grilled Tilapia ×1", total: 4500, payment: "Paystack", status: "Processing", date: "Jun 22, 1:05 PM", address: "5 Allen Ave, Ikeja" },
  { id: "DD-2039", customer: "Fatima Bello", items: "Peppered Gizzard ×3, Zobo ×2", total: 6400, payment: "Bank Transfer", status: "Completed", date: "Jun 22, 11:30 AM", address: "7 Aba Road, PH" },
  { id: "DD-2038", customer: "Ibrahim Musa", items: "Egusi Soup ×1", total: 3200, payment: "Paystack", status: "Cancelled", date: "Jun 22, 9:00 AM", address: "Garki, Abuja" },
  { id: "DD-2037", customer: "Grace Eze", items: "Puff Puff ×5, Zobo ×1", total: 4500, payment: "Paystack", status: "Completed", date: "Jun 21, 7:45 PM", address: "Trans Amadi, PH" },
];

export const ORDER_NEXT_STATUS = { Pending: "Processing", Processing: "Completed" };
export const ORDER_TABS = ["All", "Pending", "Processing", "Completed", "Cancelled"];
export const ORDER_TIMELINE = ["Order placed", "Accepted", "Preparing", "Ready", "Delivered"];
export const ORDER_DONE_STEPS = { Pending: 0, Processing: 1, Completed: 4, Cancelled: 0 };
export const ORDER_DELIVERY_FEE = 500;

/* ───── Messages ───── */
export const MOCK_CONVERSATIONS = [
  { id: 1, name: "Chika Obi", last: "Is peppered gizzard still available?", time: "10:24 AM", unread: 2, orders: 5, spent: 12500 },
  { id: 2, name: "Tunde Adeyemi", last: "Thanks! Order received.", time: "9:05 AM", unread: 0, orders: 3, spent: 8200 },
  { id: 3, name: "Fatima Bello", last: "Can I get extra sauce?", time: "Yesterday", unread: 1, orders: 7, spent: 21000 },
  { id: 4, name: "Ibrahim Musa", last: "What time do you close?", time: "Yesterday", unread: 0, orders: 1, spent: 3200 },
];

export const MOCK_MESSAGES_BY_CONVERSATION = {
  1: [
    { from: "customer", text: "Hi! Is peppered gizzard still available today?", time: "10:22 AM" },
    { from: "merchant", text: "Yes we do! 😊 Would you like to add it to an order?", time: "10:23 AM" },
    { from: "customer", text: "Yes please, with extra sauce", time: "10:24 AM" },
  ],
  2: [
    { from: "merchant", text: "Hi Tunde! Your order #DD-2041 has been confirmed.", time: "9:00 AM" },
    { from: "customer", text: "Thanks! Order received.", time: "9:05 AM" },
  ],
  3: [
    { from: "customer", text: "Can I get extra sauce with my jollof?", time: "Yesterday" },
    { from: "merchant", text: "Of course! Extra sauce noted 🍛", time: "Yesterday" },
    { from: "customer", text: "Can I get extra sauce?", time: "Yesterday" },
  ],
  4: [
    { from: "customer", text: "What time do you close today?", time: "Yesterday" },
  ],
};

export const MESSAGE_REPORT_REASONS = ["Scam or Fraud", "Harassment or Abuse", "Spam", "Fake Business", "Other"];

/* ───── Integrations ───── */
export const MOCK_INTEGRATIONS = [
  { cat: "Payments", items: [{ icon: "💳", name: "Paystack", desc: "Cards, bank transfer & USSD", badge: "Popular", active: true, stat: "₦48,200 processed this month" }, { icon: "💳", name: "Flutterwave", desc: "Pan-African payment gateway", badge: "Popular", active: false }, { icon: "🏦", name: "Bank Transfer", desc: "Manual bank details", badge: "Free", active: false }] },
  { cat: "Commerce", items: [{ icon: "🛒", name: "Product Cart", desc: "Full cart & checkout flow", badge: "Popular", active: true, stat: "24 products · 124 orders" }, { icon: "🏷️", name: "Discount Codes", desc: "Create promo codes", badge: "Free", active: false }, { icon: "📦", name: "Order Tracking", desc: "Real-time order status", badge: "Popular", active: false }, { icon: "❤️", name: "Wishlist", desc: "Let customers save products", badge: "Free", active: false }] },
  { cat: "Booking", items: [{ icon: "📅", name: "Appointment Calendar", desc: "Self-booking for customers", badge: "Popular", active: false }, { icon: "⏰", name: "Booking Reminders", desc: "SMS/push reminders", badge: "Popular", active: false }, { icon: "📋", name: "Waitlist", desc: "Queue for full time slots", badge: "Free", active: false }] },
  { cat: "Loyalty & Engagement", items: [{ icon: "⭐", name: "Loyalty Points", desc: "Earn & redeem rewards", badge: "Popular", active: false }, { icon: "🔔", name: "Push Notifications", desc: "Broadcast offers to users", badge: "Popular", active: false }, { icon: "👥", name: "Referral Program", desc: "Refer friends, earn rewards", badge: "Premium", active: false, locked: true }] },
  { cat: "Communication", items: [{ icon: "💬", name: "In-App Messaging", desc: "Live chat with customers", badge: "Popular", active: true, stat: "7 unread conversations" }, { icon: "📱", name: "WhatsApp Link", desc: "Quick WhatsApp contact", badge: "Free", active: false }, { icon: "📧", name: "Email Capture", desc: "Build your email list", badge: "Free", active: false }] },
  { cat: "Customer Support", items: [{ icon: "❓", name: "FAQ Widget", desc: "Answer common questions", badge: "Free", active: false }, { icon: "💁", name: "Live Chat Support", desc: "Real-time support chat", badge: "Premium", active: false, locked: true }] },
];

export const INTEGRATION_BADGE_COLORS = {
  Popular: { bg: "#FFF8ED", color: "#92400E" },
  Free: { bg: "#F0FDF4", color: "#065F46" },
  Premium: { bg: "#1A1A2E11", color: "#1A1A2E" },
};

export const INTEGRATION_DETAILS = {
  Paystack: {
    preview: "💳",
    summary: "Nigeria's leading payment gateway. Accept cards, bank transfers, and USSD with instant settlement.",
    types: [
      { name: "Cards", icon: "💳", desc: "Visa, Mastercard, Verve, and Amex", popular: true },
      { name: "Bank Transfer", icon: "🏦", desc: "Instant bank transfer with auto-confirmation", popular: true },
      { name: "USSD", icon: "📱", desc: "USSD codes for customers without smartphones", popular: true },
      { name: "QR Payments", icon: "📷", desc: "Scan-to-pay QR codes at checkout" },
    ],
  },
  Flutterwave: {
    preview: "🌍",
    summary: "Pan-African payments covering 30+ countries. Cards, mobile money, and bank transfers.",
    types: [
      { name: "Card Payments", icon: "💳", desc: "Local & international cards accepted across Africa", popular: true },
      { name: "Bank Transfer", icon: "🏦", desc: "Direct bank transfers with auto-confirmation", popular: true },
      { name: "Mobile Money", icon: "📱", desc: "M-Pesa, Airtel Money, MTN Mobile Money", popular: true },
      { name: "USSD", icon: "📞", desc: "USSD payment codes for feature phones" },
    ],
  },
  "Bank Transfer": {
    preview: "🏦",
    summary: "Display your business bank details so customers can pay directly by transfer.",
    types: [
      { name: "Single Account", icon: "🏦", desc: "One bank account for all payments", popular: true },
      { name: "Multiple Accounts", icon: "🏛️", desc: "Different accounts for different branches" },
    ],
  },
  "Product Cart": {
    preview: "🛒",
    summary: "Full shopping cart with checkout flow, quantity controls, and order notes.",
    types: [
      { name: "Standard Cart", icon: "🛒", desc: "Default cart with add/edit/remove items", popular: true },
      { name: "Express Checkout", icon: "⚡", desc: "One-tap checkout for returning customers" },
      { name: "Bulk Order", icon: "📦", desc: "Allow customers to order in bulk quantities" },
    ],
  },
  "Discount Codes": {
    preview: "🏷️",
    summary: "Create promo codes to attract customers with percentage or fixed discounts.",
    types: [
      { name: "Percentage Off", icon: "💯", desc: "Discount by percentage (e.g. 10% off)", popular: true },
      { name: "Fixed Amount", icon: "💰", desc: "Discount by fixed amount (e.g. ₦1,000 off)", popular: true },
      { name: "Free Delivery", icon: "🚚", desc: "Waive delivery fee on qualifying orders" },
    ],
  },
  "Order Tracking": {
    preview: "📦",
    summary: "Keep customers informed with real-time order status updates via SMS and push.",
    types: [
      { name: "Basic Tracking", icon: "📦", desc: "Pending → Confirmed → Delivered", popular: true },
      { name: "Detailed Flow", icon: "📋", desc: "Pending → Confirmed → Preparing → Ready → Delivered", popular: true },
      { name: "Custom Statuses", icon: "⚙️", desc: "Define your own order status flow" },
    ],
  },
  Wishlist: {
    preview: "❤️",
    summary: "Let customers save products to come back and purchase later.",
    types: [
      { name: "Simple Wishlist", icon: "❤️", desc: "Save items for later purchase", popular: true },
      { name: "Shared Wishlist", icon: "👥", desc: "Customers can share wishlists with friends" },
    ],
  },
  "Appointment Calendar": {
    preview: "📅",
    summary: "Let customers book appointments directly. Choose slot durations and availability.",
    types: [
      { name: "Standard Booking", icon: "📅", desc: "Fixed time slots with configurable duration", popular: true },
      { name: "Open Hours", icon: "🕐", desc: "Customers pick any time within business hours" },
      { name: "Multi-Service", icon: "🏪", desc: "Different services with different durations & prices" },
    ],
  },
  "Booking Reminders": {
    preview: "⏰",
    summary: "Reduce no-shows with automatic SMS and push notification reminders.",
    types: [
      { name: "Single Reminder", icon: "⏰", desc: "One reminder before appointment", popular: true },
      { name: "Double Reminder", icon: "🔔", desc: "Reminder 24h before + 1h before", popular: true },
      { name: "Follow-up", icon: "📋", desc: "Ask for review after appointment" },
    ],
  },
  Waitlist: {
    preview: "📋",
    summary: "When fully booked, customers join a queue and get notified when a slot opens.",
    types: [
      { name: "Auto-Notify", icon: "🔔", desc: "Automatically notify when slot opens", popular: true },
      { name: "Priority Waitlist", icon: "⭐", desc: "VIP customers get priority queue position" },
    ],
  },
  "Loyalty Points": {
    preview: "⭐",
    summary: "Reward repeat customers with points they can redeem on future orders.",
    types: [
      { name: "Points Per Spend", icon: "💳", desc: "Earn points for every naira spent", popular: true },
      { name: "Visit-Based", icon: "📅", desc: "Earn points for each visit/order" },
      { name: "Tiered Rewards", icon: "🏆", desc: "Bronze/Silver/Gold tiers with increasing benefits" },
    ],
  },
  "Push Notifications": {
    preview: "🔔",
    summary: "Send instant broadcast messages and order updates to your customers.",
    types: [
      { name: "Broadcast", icon: "📢", desc: "Send offers to all customers at once", popular: true },
      { name: "Targeted", icon: "🎯", desc: "Send to specific customer segments" },
      { name: "Automated", icon: "🤖", desc: "Trigger notifications on events (order, booking, etc.)" },
    ],
  },
  "Referral Program": {
    preview: "👥",
    summary: "Turn customers into advocates with rewards for referring friends.",
    types: [
      { name: "Discount Reward", icon: "🏷️", desc: "Give discount coupons for referrals", popular: true },
      { name: "Points Reward", icon: "⭐", desc: "Give loyalty points for referrals" },
      { name: "Cash Reward", icon: "💵", desc: "Give cash reward for successful referrals" },
    ],
  },
  "In-App Messaging": {
    preview: "💬",
    summary: "Chat with customers in real-time from your dashboard. Supports images and typing indicators.",
    types: [
      { name: "Live Chat", icon: "💬", desc: "Real-time conversation with customers", popular: true },
      { name: "Auto-Reply", icon: "🤖", desc: "Automatic replies during business hours" },
      { name: "Quick Replies", icon: "⚡", desc: "Pre-saved responses for common questions" },
    ],
  },
  "WhatsApp Link": {
    preview: "📱",
    summary: "Add a WhatsApp button so customers can reach you with one tap.",
    types: [
      { name: "Floating Button", icon: "📱", desc: "WhatsApp icon floating on all pages", popular: true },
      { name: "Header Button", icon: "📋", desc: "WhatsApp button in the app header" },
      { name: "Checkout Link", icon: "🛒", desc: "WhatsApp option at checkout" },
    ],
  },
  "Email Capture": {
    preview: "📧",
    summary: "Build your email list with smart popups triggered by customer behavior.",
    types: [
      { name: "Welcome Popup", icon: "👋", desc: "Popup on page load with welcome offer", popular: true },
      { name: "Exit Intent", icon: "🚪", desc: "Popup when customer tries to leave" },
      { name: "Scroll Trigger", icon: "📜", desc: "Popup after scrolling down the page" },
    ],
  },
  "FAQ Widget": {
    preview: "❓",
    summary: "Answer common questions before customers ask with a searchable FAQ widget.",
    types: [
      { name: "Accordion FAQ", icon: "📋", desc: "Expandable questions and answers", popular: true },
      { name: "Searchable FAQ", icon: "🔍", desc: "Customers can search for answers" },
      { name: "Categorized FAQ", icon: "📂", desc: "FAQ grouped by category/topic" },
    ],
  },
  "Live Chat Support": {
    preview: "💁",
    summary: "Offer premium real-time support with file sharing, wait times, and agent profiles.",
    types: [
      { name: "Single Agent", icon: "👤", desc: "One support agent handling all chats", popular: true },
      { name: "Multi-Agent", icon: "👥", desc: "Multiple agents with assignment routing" },
      { name: "Bot + Human", icon: "🤖", desc: "AI chatbot escalates to human when needed" },
    ],
  },
};

/* ───── Billing ───── */
export const MOCK_CURRENT_PLAN = { plan: "Starter Plan", label: "₦0 / month during beta", renews: "N/A (Beta)", features: ["1 App", "Unlimited QR scans", "Basic integrations", "Up to 500 customers"] };

export const MOCK_PLANS = [
  { name: "Starter", price: 0, label: "Free (Beta)", color: "#6B7280", features: { "Apps": "1", "Products": "20", "QR Scans": "Unlimited", "Customers": "500", "Integrations": "Basic", "Analytics": "Basic", "Team Members": "1", "Priority Support": false, "Custom Domain": false }, current: true },
  { name: "Growth", price: 9999, label: "₦9,999/mo", color: "#F4A026", features: { "Apps": "3", "Products": "Unlimited", "QR Scans": "Unlimited", "Customers": "Unlimited", "Integrations": "All", "Analytics": "Advanced", "Team Members": "3", "Priority Support": false, "Custom Domain": false }, current: false },
  { name: "Business", price: 24999, label: "₦24,999/mo", color: "#1A1A2E", features: { "Apps": "10", "Products": "Unlimited", "QR Scans": "Unlimited", "Customers": "Unlimited", "Integrations": "All + Premium", "Analytics": "Advanced + Export", "Team Members": "10", "Priority Support": true, "Custom Domain": true }, current: false },
];

export const MOCK_BILLING_HISTORY = [
  { date: "Jun 1, 2025", desc: "Starter Plan (Beta)", amount: "₦0", status: "Paid" },
  { date: "May 1, 2025", desc: "Starter Plan (Beta)", amount: "₦0", status: "Paid" },
];

/* ───── Analytics ───── */
export const ANALYTICS_REVENUE = [{ w: "W1", v: 12000 }, { w: "W2", v: 28000 }, { w: "W3", v: 22000 }, { w: "W4", v: 48200 }];
export const ANALYTICS_ORDER_STATS = [{ name: "Completed", value: 89 }, { name: "Pending", value: 25 }, { name: "Cancelled", value: 10 }];
export const ANALYTICS_SCAN_DATA = [{ day: "Mon", scans: 42 }, { day: "Tue", scans: 67 }, { day: "Wed", scans: 55 }, { day: "Thu", scans: 80 }, { day: "Fri", scans: 93 }, { day: "Sat", scans: 110 }, { day: "Sun", scans: 78 }];
export const ANALYTICS_TOP_PRODUCTS = [
  { name: "Jollof Rice", views: 340, orders: 89, revenue: 222500, trend: "↑" },
  { name: "Grilled Tilapia", views: 210, orders: 45, revenue: 202500, trend: "↑" },
  { name: "Peppered Gizzard", views: 180, orders: 60, revenue: 108000, trend: "↓" },
  { name: "Egusi Soup", views: 120, orders: 30, revenue: 96000, trend: "→" },
  { name: "Zobo Drink", views: 95, orders: 70, revenue: 35000, trend: "↑" },
];
export const ANALYTICS_CUSTOMER_SPLIT = [{ name: "New", value: 34 }, { name: "Returning", value: 66 }];

/* ───── MiniApp Preview ───── */
export const PREVIEW_MENU_ITEMS = [
  { id: 1, name: "Jollof Rice & Chicken", desc: "Rich, smoky jollof with tender grilled chicken", price: 2500, img: "🍛", cat: "Popular" },
  { id: 2, name: "Peppered Gizzard", desc: "Spicy peppered gizzard with fried plantain", price: 1800, img: "🍗", cat: "Popular" },
  { id: 3, name: "Grilled Tilapia", desc: "Fresh tilapia grilled with peppers & spices", price: 4500, img: "🐟", cat: "Mains" },
  { id: 4, name: "Egusi Soup + Eba", desc: "Thick egusi soup with eba or pounded yam", price: 3200, img: "🥣", cat: "Mains" },
  { id: 5, name: "Zobo Drink", desc: "Chilled hibiscus drink", price: 500, img: "🥤", cat: "Drinks" },
  { id: 6, name: "Chilled Chapman", desc: "Classic Nigerian Chapman cocktail", price: 800, img: "🍹", cat: "Drinks" },
];

export const PREVIEW_CATEGORIES = ["Popular", "Mains", "Grills", "Drinks", "Desserts"];
export const PREVIEW_BOTTOM_NAV = [{ icon: "🏠", label: "Menu" }, { icon: "📦", label: "Orders" }, { icon: "📅", label: "Reserve" }, { icon: "ℹ️", label: "Info" }];

/* ───── Sidebar ───── */
export const SIDEBAR_NAV_ITEMS = [
  { id: "dashboard", icon: "LayoutDashboard", label: "Dashboard" },
  { id: "products", icon: "Package", label: "Products" },
  { id: "orders", icon: "ShoppingCart", label: "Orders", badge: 5 },
  { id: "analytics", icon: "BarChart3", label: "Analytics" },
  { id: "messages", icon: "MessageSquare", label: "Messages", badge: 7 },
  { id: "integrations", icon: "Link2", label: "Integrations" },
  { id: "billing", icon: "CreditCard", label: "Billing" },
];
