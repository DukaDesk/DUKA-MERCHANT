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
    { name: "Classic Dine", tags: ["Elegant", "Warm tones"], features: ["Menu", "Cart", "Orders", "Reservations"], category: "Restaurant", primaryColor: "#8B4513", secondaryColor: "#F5DEB3" },
    { name: "Modern Bites", tags: ["Dark theme", "Bold type"], features: ["Menu", "Cart", "Orders", "Table Booking"], category: "Restaurant", primaryColor: "#1A1A2E", secondaryColor: "#F4A026" },
    { name: "Fresh & Bright", tags: ["Minimal", "Photo-forward"], features: ["Menu", "Cart", "Delivery", "Pickup"], category: "Restaurant", primaryColor: "#2ECC71", secondaryColor: "#F0FFF0" },
  ],
  Ecommerce: [
    { name: "Storefront", tags: ["Clean", "Product-first"], features: ["Products", "Cart", "Checkout", "Reviews"], category: "Ecommerce", primaryColor: "#1A1A2E", secondaryColor: "#F4A026" },
    { name: "Flash Sale", tags: ["Bold", "Urgency-driven"], features: ["Products", "Cart", "Deals", "Countdown"], category: "Ecommerce", primaryColor: "#E74C3C", secondaryColor: "#FFD700" },
    { name: "Minimal Shop", tags: ["Minimal", "Modern"], features: ["Products", "Cart", "Wishlist", "Checkout"], category: "Ecommerce", primaryColor: "#7C3AED", secondaryColor: "#F3E8FF" },
  ],
  "Food Vendor": [
    { name: "Street Kitchen", tags: ["Bold", "Colorful"], features: ["Menu", "Cart", "Orders", "Quick Pickup"], category: "Food Vendor", primaryColor: "#FF6B35", secondaryColor: "#FFE4CA" },
    { name: "Home Chef", tags: ["Warm", "Homely"], features: ["Menu", "Cart", "Delivery", "Catering"], category: "Food Vendor", primaryColor: "#8B4513", secondaryColor: "#FFF3E0" },
    { name: "CaterPro", tags: ["Clean", "Professional"], features: ["Menu", "Cart", "Bulk Orders", "Event Booking"], category: "Food Vendor", primaryColor: "#0D9488", secondaryColor: "#E8F5F4" },
  ],
  Grocery: [
    { name: "Fresh Market", tags: ["Clean", "Fresh"], features: ["Products", "Cart", "Delivery", "Pickup"], category: "Grocery", primaryColor: "#2ECC71", secondaryColor: "#E8F5E9" },
    { name: "Quick Shop", tags: ["Bold", "Convenient"], features: ["Products", "Cart", "Express Delivery", "Loyalty"], category: "Grocery", primaryColor: "#FF6B35", secondaryColor: "#FFF3E0" },
    { name: "Family Mart", tags: ["Warm", "Neighborhood"], features: ["Products", "Cart", "Home Delivery", "Loyalty"], category: "Grocery", primaryColor: "#1565C0", secondaryColor: "#E3F2FD" },
  ],
  Church: [
    { name: "Grace", tags: ["Elegant", "Serene"], features: ["Events", "Giving", "Sermons", "Community"], category: "Church", primaryColor: "#1A237E", secondaryColor: "#E8EAF6" },
    { name: "Vibrant", tags: ["Modern", "Energetic"], features: ["Events", "Giving", "Announcements", "Media"], category: "Church", primaryColor: "#E65100", secondaryColor: "#FFF3E0" },
    { name: "Community", tags: ["Warm", "Inclusive"], features: ["Events", "Giving", "Prayer Requests", "Small Groups"], category: "Church", primaryColor: "#2E7D32", secondaryColor: "#E8F5E9" },
  ],
  School: [
    { name: "Academy", tags: ["Clean", "Professional"], features: ["Timetables", "Fees", "Announcements", "Grades"], category: "School", primaryColor: "#283593", secondaryColor: "#E8EAF6" },
    { name: "Bright Minds", tags: ["Playful", "Colorful"], features: ["Timetables", "Fees", "Events", "Parent Comms"], category: "School", primaryColor: "#FF6F00", secondaryColor: "#FFF8E1" },
    { name: "Heritage", tags: ["Traditional", "Trusted"], features: ["Timetables", "Fees", "Assignments", "Library"], category: "School", primaryColor: "#4E342E", secondaryColor: "#EFEBE9" },
  ],
  Booking: [
    { name: "Appointments", tags: ["Clean", "Efficient"], features: ["Appointments", "Calendar", "Reminders", "Payments"], category: "Booking", primaryColor: "#0D9488", secondaryColor: "#E8F5F4" },
    { name: "Premium", tags: ["Elegant", "Luxury"], features: ["Services", "Booking", "Reminders", "Reviews"], category: "Booking", primaryColor: "#7C3AED", secondaryColor: "#F3E8FF" },
    { name: "Express", tags: ["Minimal", "Fast"], features: ["Services", "Booking", "Calendar Sync", "Payments"], category: "Booking", primaryColor: "#EA580C", secondaryColor: "#FFF3E0" },
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
