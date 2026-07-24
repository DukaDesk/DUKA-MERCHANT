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
