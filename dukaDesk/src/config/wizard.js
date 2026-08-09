import { BUSINESS_CATEGORIES } from "./taxonomy";

export const WIZARD_STEPS = ["Category", "Template", "Branding", "Business Info", "Integrations"];

export const WIZARD_CATEGORIES = BUSINESS_CATEGORIES.map(({ label, icon, desc }) => ({ name: label, icon, desc }));

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

export function getTemplateIntegrationNames() {
  return [...WIZARD_ALWAYS_INCLUDED, ...UNIVERSAL_INTEGRATIONS];
}

export const WIZARD_PUBLISH_STEPS = [
  "Our team reviews your app (usually within 2 hours)",
  "You'll receive an email when you go live",
  "Start adding your products from your dashboard",
  "Share your QR code — customers scan to access your app!",
];
