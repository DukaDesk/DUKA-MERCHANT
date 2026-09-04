export const INTEGRATION_BADGE_COLORS = {
  Popular: { bg: "#FFF8ED", color: "#92400E" },
  Free: { bg: "#F0FDF4", color: "#065F46" },
  Premium: { bg: "#1A1A2E11", color: "#1A1A2E" },
};

export const INTEGRATION_DETAILS = {
  Paystack: {
    preview: "CreditCard",
    summary: "Nigeria's leading payment gateway. Accept cards, bank transfers, and USSD with instant settlement.",
    types: [
      { name: "Cards", icon: "CreditCard", desc: "Visa, Mastercard, Verve, and Amex", popular: true },
      { name: "Bank Transfer", icon: "Landmark", desc: "Instant bank transfer with auto-confirmation", popular: true },
      { name: "USSD", icon: "Smartphone", desc: "USSD codes for customers without smartphones", popular: true },
      { name: "QR Payments", icon: "Camera", desc: "Scan-to-pay QR codes at checkout" },
    ],
  },
  Flutterwave: {
    preview: "Globe",
    summary: "Pan-African payments covering 30+ countries. Cards, mobile money, and bank transfers.",
    types: [
      { name: "Card Payments", icon: "CreditCard", desc: "Local & international cards accepted across Africa", popular: true },
      { name: "Bank Transfer", icon: "Landmark", desc: "Direct bank transfers with auto-confirmation", popular: true },
      { name: "Mobile Money", icon: "Smartphone", desc: "M-Pesa, Airtel Money, MTN Mobile Money", popular: true },
      { name: "USSD", icon: "Phone", desc: "USSD payment codes for feature phones" },
    ],
  },
  "Bank Transfer": {
    preview: "Landmark",
    summary: "Display your business bank details so customers can pay directly by transfer.",
    types: [
      { name: "Single Account", icon: "Landmark", desc: "One bank account for all payments", popular: true },
      { name: "Multiple Accounts", icon: "Building2", desc: "Different accounts for different branches" },
    ],
  },
  "Product Cart": {
    preview: "ShoppingCart",
    summary: "Full shopping cart with checkout flow, quantity controls, and order notes.",
    types: [
      { name: "Standard Cart", icon: "ShoppingCart", desc: "Default cart with add/edit/remove items", popular: true },
      { name: "Express Checkout", icon: "Zap", desc: "One-tap checkout for returning customers" },
      { name: "Bulk Order", icon: "Package", desc: "Allow customers to order in bulk quantities" },
    ],
  },
  "Discount Codes": {
    preview: "Tag",
    summary: "Create promo codes to attract customers with percentage or fixed discounts.",
    types: [
      { name: "Percentage Off", icon: "Percent", desc: "Discount by percentage (e.g. 10% off)", popular: true },
      { name: "Fixed Amount", icon: "Banknote", desc: "Discount by fixed amount (e.g. ₦1,000 off)", popular: true },
      { name: "Free Delivery", icon: "Truck", desc: "Waive delivery fee on qualifying orders" },
    ],
  },
  "Order Tracking": {
    preview: "Package",
    summary: "Keep customers informed with real-time order status updates via SMS and push.",
    types: [
      { name: "Basic Tracking", icon: "Package", desc: "Pending > Confirmed > Delivered", popular: true },
      { name: "Detailed Flow", icon: "ClipboardList", desc: "Pending > Confirmed > Preparing > Ready > Delivered", popular: true },
      { name: "Custom Statuses", icon: "Settings", desc: "Define your own order status flow" },
    ],
  },
  Wishlist: {
    preview: "Heart",
    summary: "Let customers save products to come back and purchase later.",
    types: [
      { name: "Simple Wishlist", icon: "Heart", desc: "Save items for later purchase", popular: true },
      { name: "Shared Wishlist", icon: "Users", desc: "Customers can share wishlists with friends" },
    ],
  },
  "Appointment Calendar": {
    preview: "Calendar",
    summary: "Let customers book appointments directly. Choose slot durations and availability.",
    types: [
      { name: "Standard Booking", icon: "Calendar", desc: "Fixed time slots with configurable duration", popular: true },
      { name: "Open Hours", icon: "Clock", desc: "Customers pick any time within business hours" },
      { name: "Multi-Service", icon: "Store", desc: "Different services with different durations & prices" },
    ],
  },
  "Booking Reminders": {
    preview: "Clock",
    summary: "Reduce no-shows with automatic SMS and push notification reminders.",
    types: [
      { name: "Single Reminder", icon: "Clock", desc: "One reminder before appointment", popular: true },
      { name: "Double Reminder", icon: "Bell", desc: "Reminder 24h before + 1h before", popular: true },
      { name: "Follow-up", icon: "ClipboardList", desc: "Ask for review after appointment" },
    ],
  },
  Waitlist: {
    preview: "ClipboardList",
    summary: "When fully booked, customers join a queue and get notified when a slot opens.",
    types: [
      { name: "Auto-Notify", icon: "Bell", desc: "Automatically notify when slot opens", popular: true },
      { name: "Priority Waitlist", icon: "Star", desc: "VIP customers get priority queue position" },
    ],
  },
  "Loyalty Points": {
    preview: "Star",
    summary: "Reward repeat customers with points they can redeem on future orders.",
    types: [
      { name: "Points Per Spend", icon: "CreditCard", desc: "Earn points for every naira spent", popular: true },
      { name: "Visit-Based", icon: "Calendar", desc: "Earn points for each visit/order" },
      { name: "Tiered Rewards", icon: "Trophy", desc: "Bronze/Silver/Gold tiers with increasing benefits" },
    ],
  },
  "Push Notifications": {
    preview: "Bell",
    summary: "Send instant broadcast messages and order updates to your customers.",
    types: [
      { name: "Broadcast", icon: "Megaphone", desc: "Send offers to all customers at once", popular: true },
      { name: "Targeted", icon: "Target", desc: "Send to specific customer segments" },
      { name: "Automated", icon: "Bot", desc: "Trigger notifications on events (order, booking, etc.)" },
    ],
  },
  "Referral Program": {
    preview: "Users",
    summary: "Turn customers into advocates with rewards for referring friends.",
    types: [
      { name: "Discount Reward", icon: "Tag", desc: "Give discount coupons for referrals", popular: true },
      { name: "Points Reward", icon: "Star", desc: "Give loyalty points for referrals" },
      { name: "Cash Reward", icon: "Banknote", desc: "Give cash reward for successful referrals" },
    ],
  },
  "In-App Messaging": {
    preview: "MessageCircle",
    summary: "Chat with customers in real-time from your dashboard. Supports images and typing indicators.",
    types: [
      { name: "Live Chat", icon: "MessageCircle", desc: "Real-time conversation with customers", popular: true },
      { name: "Auto-Reply", icon: "Bot", desc: "Automatic replies during business hours" },
      { name: "Quick Replies", icon: "Zap", desc: "Pre-saved responses for common questions" },
    ],
  },
  "WhatsApp Link": {
    preview: "Smartphone",
    summary: "Add a WhatsApp button so customers can reach you with one tap.",
    types: [
      { name: "Floating Button", icon: "Smartphone", desc: "WhatsApp icon floating on all pages", popular: true },
      { name: "Header Button", icon: "ClipboardList", desc: "WhatsApp button in the app header" },
      { name: "Checkout Link", icon: "ShoppingCart", desc: "WhatsApp option at checkout" },
    ],
  },
  "Email Capture": {
    preview: "Mail",
    summary: "Build your email list with smart popups triggered by customer behavior.",
    types: [
      { name: "Welcome Popup", icon: "Hand", desc: "Popup on page load with welcome offer", popular: true },
      { name: "Exit Intent", icon: "DoorClosed", desc: "Popup when customer tries to leave" },
      { name: "Scroll Trigger", icon: "ScrollText", desc: "Popup after scrolling down the page" },
    ],
  },
  "FAQ Widget": {
    preview: "HelpCircle",
    summary: "Answer common questions before customers ask with a searchable FAQ widget.",
    types: [
      { name: "Accordion FAQ", icon: "ClipboardList", desc: "Expandable questions and answers", popular: true },
      { name: "Searchable FAQ", icon: "Search", desc: "Customers can search for answers" },
      { name: "Categorized FAQ", icon: "Folder", desc: "FAQ grouped by category/topic" },
    ],
  },
  "Live Chat Support": {
    preview: "User",
    summary: "Offer premium real-time support with file sharing, wait times, and agent profiles.",
    types: [
      { name: "Single Agent", icon: "User", desc: "One support agent handling all chats", popular: true },
      { name: "Multi-Agent", icon: "Users", desc: "Multiple agents with assignment routing" },
      { name: "Bot + Human", icon: "Bot", desc: "AI chatbot escalates to human when needed" },
    ],
  },
};
