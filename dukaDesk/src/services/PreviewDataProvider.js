import { 
  MOCK_PRODUCTS, 
  MOCK_ORDERS, 
  MOCK_CONVERSATIONS, 
  MOCK_MESSAGES_BY_CONVERSATION,
  MOCK_INTEGRATIONS,
  DASHBOARD_STATS_BY_CATEGORY,
  DASHBOARD_REVENUE_BY_CATEGORY,
  DASHBOARD_ACTIVITY_BY_CATEGORY,
  WIZARD_PREVIEW_DATA,
  WIZARD_CATEGORIES,
  WIZARD_TEMPLATES_BY_CATEGORY,
  MOCK_CURRENT_PLAN,
  MOCK_PLANS,
  MOCK_BILLING_HISTORY,
  ANALYTICS_REVENUE,
  ANALYTICS_ORDER_STATS,
  ANALYTICS_SCAN_DATA,
  ANALYTICS_TOP_PRODUCTS,
  ANALYTICS_CUSTOMER_SPLIT,
  PREVIEW_MENU_ITEMS,
  PREVIEW_CATEGORIES,
  PREVIEW_BOTTOM_NAV
} from "./mockData";

import { generateShopTemplate } from "./TemplateGenerator";

/**
 * Preview Data Provider - Merges template layouts with actual shop data
 * This provides real, functional data to the template preview components
 * Each category gets its own relevant data (church = events/sermons, school = timetables/fees, etc.)
 */

// Get products for a specific category
export function getProductsForCategory(category, template) {
  const products = [...MOCK_PRODUCTS];
  return products;
}

// Get orders for the shop
export function getOrders() {
  return MOCK_ORDERS;
}

// Get conversations
export function getConversations() {
  return MOCK_CONVERSATIONS;
}

// Get messages for a conversation
export function getMessages(conversationId) {
  return MOCK_MESSAGES_BY_CONVERSATION[conversationId] || [];
}

// Get integrations
export function getIntegrations() {
  return MOCK_INTEGRATIONS;
}

// Get dashboard stats for a category
export function getDashboardStats(category) {
  return DASHBOARD_STATS_BY_CATEGORY[category] || DASHBOARD_STATS_BY_CATEGORY.Restaurant;
}

// Get revenue data
export function getRevenueData(category) {
  return DASHBOARD_REVENUE_BY_CATEGORY[category] || DASHBOARD_REVENUE_BY_CATEGORY.Restaurant;
}

// Get activity data
export function getActivityData(category) {
  return DASHBOARD_ACTIVITY_BY_CATEGORY[category] || DASHBOARD_ACTIVITY_BY_CATEGORY.Restaurant;
}

// Get analytics data
export function getAnalyticsData() {
  return {
    revenue: ANALYTICS_REVENUE,
    orderStats: ANALYTICS_ORDER_STATS,
    scanData: ANALYTICS_SCAN_DATA,
    topProducts: ANALYTICS_TOP_PRODUCTS,
    customerSplit: ANALYTICS_CUSTOMER_SPLIT,
  };
}

// Get billing data
export function getBillingData() {
  return {
    currentPlan: MOCK_CURRENT_PLAN,
    plans: MOCK_PLANS,
    history: MOCK_BILLING_HISTORY,
  };
}

// Get products for a specific category from wizard preview data
export function getPreviewProducts(_category) {
  const preview = WIZARD_PREVIEW_DATA.Restaurant;
  return preview.items || PREVIEW_MENU_ITEMS;
}

// Get categories for a category type
export function getPreviewCategories(_category) {
  const preview = WIZARD_PREVIEW_DATA.Restaurant;
  return preview.categories || PREVIEW_CATEGORIES;
}

// Get bottom navigation for a category
export function getPreviewBottomNav(_category) {
  return PREVIEW_BOTTOM_NAV;
}

// Get theme for a template
export function getThemeForTemplate(_category, template) {
  
  const themes = {
    "Classic Dine": { primary: "#1B4332", secondary: "#F4A026", bg: "#FAFAFA", card: "#FFFFFF", text: "#0F0F1A" },
    "Modern Bites": { primary: "#0F0F1A", secondary: "#F4A026", bg: "#1A1A2E", card: "#252540", text: "#FFFFFF" },
    "Fresh & Bright": { primary: "#2ECC71", secondary: "#F4A026", bg: "#F8FFF8", card: "#FFFFFF", text: "#0F0F1A" },
    "Storefront": { primary: "#0D9488", secondary: "#0F0F1A", bg: "#FAFAFA", card: "#FFFFFF", text: "#0F0F1A" },
    "Flash Sale": { primary: "#E74C3C", secondary: "#F4A026", bg: "#1A1A2E", card: "#252540", text: "#FFFFFF" },
    "Minimal Shop": { primary: "#7C3AED", secondary: "#F4A026", bg: "#FAFAFA", card: "#FFFFFF", text: "#0F0F1A" },
    "Street Eats": { primary: "#EA580C", secondary: "#F4A026", bg: "#1A1A2E", card: "#252540", text: "#FFFFFF" },
    "Home Kitchen": { primary: "#1B4332", secondary: "#F4A026", bg: "#FEF8ED", card: "#FFFFFF", text: "#0F0F1A" },
    "Fast Bites": { primary: "#0D9488", secondary: "#F4A026", bg: "#FAFAFA", card: "#FFFFFF", text: "#0F0F1A" },
    "Market Fresh": { primary: "#2ECC71", secondary: "#F4A026", bg: "#F0FDF4", card: "#FFFFFF", text: "#0F0F1A" },
    "Corner Shop": { primary: "#1B4332", secondary: "#F4A026", bg: "#FEF8ED", card: "#FFFFFF", text: "#0F0F1A" },
    "Bulk Buy": { primary: "#7C3AED", secondary: "#F4A026", bg: "#1A1A2E", card: "#252540", text: "#FFFFFF" },
    "Cathedral": { primary: "#1B4332", secondary: "#F4A026", bg: "#FAFAFA", card: "#FFFFFF", text: "#0F0F1A" },
    "Community Light": { primary: "#F4A026", secondary: "#1B4332", bg: "#FEF8ED", card: "#FFFFFF", text: "#0F0F1A" },
    "Youth Vibes": { primary: "#EC4899", secondary: "#F4A026", bg: "#1A1A2E", card: "#252540", text: "#FFFFFF" },
    "Academy Pro": { primary: "#0D9488", secondary: "#F4A026", bg: "#FAFAFA", card: "#FFFFFF", text: "#0F0F1A" },
    "Bright Minds": { primary: "#EC4899", secondary: "#F4A026", bg: "#FDF2F8", card: "#FFFFFF", text: "#0F0F1A" },
    "Smart Campus": { primary: "#7C3AED", secondary: "#F4A026", bg: "#1A1A2E", card: "#252540", text: "#FFFFFF" },
    "Scheduler": { primary: "#0D9488", secondary: "#F4A026", bg: "#FAFAFA", card: "#FFFFFF", text: "#0F0F1A" },
    "Spa Lounge": { primary: "#1B4332", secondary: "#F4A026", bg: "#F0FDF4", card: "#FFFFFF", text: "#0F0F1A" },
    "Quick Book": { primary: "#7C3AED", secondary: "#F4A026", bg: "#1A1A2E", card: "#252540", text: "#FFFFFF" },
  };
  
  return themes[template] || themes["Classic Dine"];
}

/**
 * COMPREHENSIVE SCREEN DATA FOR ALL CATEGORIES
 * Each category gets its own relevant data
 */
const CATEGORY_SCREEN_DATA = {
  Restaurant: {
    menu: {
      items: [
        { id: 1, name: "Jollof Rice & Chicken", desc: "Rich, smoky jollof with tender grilled chicken", price: 2500, img: "🍛", cat: "Popular" },
        { id: 2, name: "Peppered Gizzard", desc: "Spicy peppered gizzard with fried plantain", price: 1800, img: "🍗", cat: "Popular" },
        { id: 3, name: "Grilled Tilapia", desc: "Fresh tilapia grilled with peppers & spices", price: 4500, img: "🐟", cat: "Mains" },
        { id: 4, name: "Egusi Soup + Eba", desc: "Thick egusi soup with eba or pounded yam", price: 3200, img: "🥣", cat: "Mains" },
        { id: 5, name: "Zobo Drink", desc: "Chilled hibiscus drink", price: 500, img: "🥤", cat: "Drinks" },
        { id: 6, name: "Chilled Chapman", desc: "Classic Nigerian Chapman cocktail", price: 800, img: "🍹", cat: "Drinks" },
      ],
      categories: ["Popular", "Mains", "Drinks", "Desserts"],
    },
    orders: {
      orders: [
        { id: "DD-2041", customer: "Tunde Adeyemi", items: "Jollof Rice ×2", total: 7000, payment: "Paystack", status: "Pending", date: "Jun 22, 2:14 PM", address: "12 Admiralty Way, Lekki" },
        { id: "DD-2040", customer: "Chika Obi", items: "Grilled Tilapia ×1", total: 4500, payment: "Paystack", status: "Processing", date: "Jun 22, 1:05 PM", address: "5 Allen Ave, Ikeja" },
        { id: "DD-2039", customer: "Fatima Bello", items: "Peppered Gizzard ×3, Zobo ×2", total: 6400, payment: "Bank Transfer", status: "Completed", date: "Jun 22, 11:30 AM", address: "7 Aba Road, PH" },
      ],
    },
    reservations: {
      dates: Array.from({ length: 14 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return d.toISOString().split('T')[0];
      }),
      slots: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"],
    },
    info: {
      items: [
        { icon: "📞", label: "Call Us", value: "+234 800 000 0000", action: "call" },
        { icon: "📍", label: "Address", value: "12 Restaurant Street, Lagos" },
        { icon: "🕐", label: "Hours", value: "Mon-Sun: 8AM - 10PM" },
        { icon: "📧", label: "Email", value: "hello@restaurant.com", action: "email" },
      ],
    },
    categories: ["Popular", "Mains", "Drinks", "Desserts"],
    cart: {
      items: [
        { id: 1, name: "Jollof Rice & Chicken", price: 2500, qty: 2, img: "🍛", cat: "Mains" },
        { id: 2, name: "Peppered Gizzard", price: 1800, qty: 1, img: "🍗", cat: "Popular" },
      ],
    },
  },
  
  Ecommerce: {
    shop: {
      items: [
        { id: 1, name: "African Print Dress", desc: "Beautiful traditional dress", price: 15000, img: "👗", cat: "Clothing" },
        { id: 2, name: "Wireless Earbuds", desc: "Noise cancelling", price: 8500, img: "📱", cat: "Electronics" },
        { id: 3, name: "Leather Sandals", desc: "Handcrafted leather", price: 12000, img: "👡", cat: "Footwear" },
        { id: 4, name: "Beaded Necklace", desc: "Handcrafted beads", price: 3500, img: "📿", cat: "Accessories" },
      ],
      categories: ["All", "Clothing", "Electronics", "Accessories", "Footwear"],
    },
    orders: {
      orders: [
        { id: "DD-2041", customer: "Blessing Okafor", items: "African Print Dress ×1", total: 15000, payment: "Paystack", status: "Pending", date: "Jun 22, 2:14 PM", address: "12 Victoria Island, Lagos" },
        { id: "DD-2040", customer: "Emmanuel Ade", items: "Wireless Earbuds ×2", total: 17000, payment: "Paystack", status: "Processing", date: "Jun 22, 1:05 PM", address: "5 Allen Ave, Ikeja" },
      ],
    },
    cart: {
      items: [
        { id: 1, name: "African Print Dress", price: 15000, img: "👗", qty: 1, cat: "Clothing" },
        { id: 2, name: "Wireless Earbuds", price: 8500, img: "📱", qty: 2, cat: "Electronics" },
      ],
    },
    profile: {
      items: [
        { icon: "👤", label: "My Account", value: "Manage settings" },
        { icon: "📍", label: "Shipping Addresses", value: "2 addresses" },
        { icon: "💳", label: "Payment Methods", value: "Card, Bank Transfer" },
        { icon: "⭐", label: "Wishlist", value: "5 items" },
      ],
    },
    categories: ["All", "Clothing", "Electronics", "Accessories", "Footwear"],
  },

  "Food Vendor": {
    menu: {
      items: [
        { id: 1, name: "Spicy Shawarma", desc: "Chicken shawarma with spicy sauce", price: 3000, img: "🌮", cat: "Popular" },
        { id: 2, name: "Suya Platter", desc: "Grilled beef with yaji spice", price: 2500, img: "🥩", cat: "Popular" },
        { id: 3, name: "Jollof Rice", desc: "Party jollof with chicken", price: 2500, img: "🍛", cat: "Mains" },
        { id: 4, name: "Zobo Drink", desc: "Chilled hibiscus drink", price: 500, img: "🥤", cat: "Drinks" },
        { id: 5, name: "Kunu Drink", desc: "Traditional millet drink", price: 300, img: "🥛", cat: "Drinks" },
        { id: 6, name: "Fried Plantain", desc: "Sweet fried plantain", price: 800, img: "🍌", cat: "Sides" },
      ],
      categories: ["Popular", "Mains", "Drinks", "Sides"],
    },
    orders: {
      orders: [
        { id: "FV-1001", customer: "Amina Yusuf", items: "Shawarma ×2, Zobo ×1", total: 6500, payment: "Cash", status: "Ready", date: "Jun 22, 2:30 PM", address: "Pickup at Stall 12" },
        { id: "FV-1000", customer: "Olu Ade", items: "Suya ×3", total: 7500, payment: "Transfer", status: "Ready", date: "Jun 22, 1:15 PM", address: "Pickup at Stall 12" },
      ],
    },
    pickup: {
      items: [
        { icon: "📦", label: "Pickup Location", value: "Stall 12, Oyingbo Market" },
        { icon: "🕐", label: "Ready In", value: "15 minutes" },
        { icon: "📞", label: "Call On Arrival", value: "+234 800 123 4567" },
      ],
    },
    info: {
      items: [
        { icon: "📞", label: "Call Us", value: "+234 800 123 4567", action: "call" },
        { icon: "📍", label: "Location", value: "Stall 12, Oyingbo Market, Lagos" },
        { icon: "🕐", label: "Hours", value: "Mon-Sat: 7AM - 9PM" },
      ],
    },
    categories: ["Popular", "Mains", "Drinks", "Sides"],
    cart: {
      items: [
        { id: 1, name: "Spicy Shawarma", price: 3000, qty: 2, img: "🌮", cat: "Popular" },
        { id: 2, name: "Suya Platter", price: 2500, qty: 1, img: "🥩", cat: "Popular" },
      ],
    },
  },

  Grocery: {
    shop: {
      items: [
        { id: 1, name: "Fresh Apples (1kg)", desc: "Crisp green apples", price: 2000, img: "🍎", cat: "Fruits" },
        { id: 2, name: "Milo (500g)", desc: "Chocolate malt drink", price: 3500, img: "🥛", cat: "Beverages" },
        { id: 3, name: "Fresh Tomatoes (1kg)", desc: "Vine-ripened tomatoes", price: 1500, img: "🍅", cat: "Vegetables" },
        { id: 4, name: "Indomie Noodles (12pcs)", desc: "Chicken flavor", price: 4200, img: "🍜", cat: "Pantry" },
        { id: 5, name: "Fresh Bread", desc: "Freshly baked daily", price: 1200, img: "🍞", cat: "Bakery" },
        { id: 6, name: "Eggs (Crate of 30)", desc: "Farm fresh eggs", price: 3800, img: "🥚", cat: "Dairy" },
      ],
      categories: ["All", "Fruits", "Vegetables", "Beverages", "Pantry", "Bakery", "Dairy"],
    },
    orders: {
      orders: [
        { id: "GR-3001", customer: "Mrs. Obi", items: "Apples ×2, Milo ×1, Bread ×2", total: 8200, payment: "Transfer", status: "Delivered", date: "Jun 22, 12:30 PM", address: "15 Ikoyi, Lagos" },
        { id: "GR-3000", customer: "Mr. Ade", items: "Tomatoes ×3, Eggs ×1", total: 8300, payment: "Cash", status: "Processing", date: "Jun 22, 11:00 AM", address: "7 Victoria Island, Lagos" },
      ],
    },
    cart: {
      items: [
        { id: 1, name: "Fresh Apples (1kg)", price: 2000, img: "🍎", qty: 2, cat: "Fruits" },
        { id: 2, name: "Milo (500g)", price: 3500, img: "🥛", qty: 1, cat: "Beverages" },
      ],
    },
    profile: {
      items: [
        { icon: "👤", label: "My Account", value: "Manage settings" },
        { icon: "📍", label: "Delivery Addresses", value: "3 addresses" },
        { icon: "💳", label: "Payment Methods", value: "Card, Transfer, Cash" },
        { icon: "🚚", label: "Delivery Preferences", value: "Home delivery" },
      ],
    },
    categories: ["All", "Fruits", "Vegetables", "Beverages", "Pantry", "Bakery", "Dairy"],
  },

  Church: {
    events: {
      events: [
        { icon: "📖", name: "Sunday Service", price: "Sun 8:00 AM & 10:30 AM" },
        { icon: "🙏", name: "Midweek Prayer", price: "Wed 6:00 PM" },
        { icon: "🎵", name: "Youth Fellowship", price: "Fri 7:00 PM" },
        { icon: "👨‍👩‍👧‍👦", name: "Family Retreat", price: "Sat 9:00 AM" },
      ],
    },
    giving: {
      items: [
        { icon: "💰", label: "Tithe", value: "Give 10%", action: "give" },
        { icon: "💝", label: "Offering", value: "Free will", action: "give" },
        { icon: "🏗️", label: "Building Fund", value: "Project: New Sanctuary", action: "give" },
        { icon: "🎁", label: "Missions Support", value: "Partner with us", action: "give" },
      ],
    },
    sermons: {
      items: [
        { icon: "📖", name: "Faith That Moves Mountains", date: "Jun 16, 2024", speaker: "Pastor John" },
        { icon: "📖", name: "Walking in Purpose", date: "Jun 9, 2024", speaker: "Pastor Mary" },
        { icon: "📖", name: "The Power of Prayer", date: "Jun 2, 2024", speaker: "Pastor John" },
      ],
    },
    community: {
      items: [
        { icon: "👥", label: "Join a Group", value: "Small groups available" },
        { icon: "🤝", label: "Volunteer", value: "Serve in ministry" },
        { icon: "📝", label: "New Here?", value: "Welcome class Sunday" },
        { icon: "📝", label: "Prayer Request", value: "Submit online" },
      ],
    },
    announcements: {
      items: [
        { icon: "📢", label: "Church Picnic", date: "Jul 14", desc: "Family fun day at the park" },
        { icon: "📢", label: "Baptism Class", date: "Jul 7", desc: "Register at info desk" },
      ],
    },
    media: {
      items: [
        { icon: "🎥", name: "Sunday Live Stream", time: "Sun 8:00 AM" },
        { icon: "🎵", name: "Worship Playlist", link: "Spotify/Apple Music" },
      ],
    },
    groups: {
      items: [
        { icon: "👥", name: "Young Adults", time: "Fri 7 PM" },
        { icon: "👥", name: "Men's Fellowship", time: "Sat 7 AM" },
        { icon: "👥", name: "Women's Ministry", time: "Tue 10 AM" },
      ],
    },
    categories: ["Events", "Giving", "Sermons", "Community"],
  },

  School: {
    timetable: {
      items: [
        { icon: "📅", label: "Monday", value: "Math, English, Science, History" },
        { icon: "📅", label: "Tuesday", value: "Art, PE, Music, Geography" },
        { icon: "📅", label: "Wednesday", value: "Chemistry, Biology, French, Civics" },
        { icon: "📅", label: "Thursday", value: "Physics, Literature, Computer, Civics" },
        { icon: "📅", label: "Friday", value: "Computer, French, Review, Assembly" },
      ],
    },
    fees: {
      items: [
        { icon: "💳", label: "Term 3 Fees", value: "₦85,000", status: "Paid" },
        { icon: "💳", label: "Exam Fees", value: "₦15,000", status: "Paid" },
        { icon: "💳", label: "PTA Levy", value: "₦10,000", status: "Pending" },
        { icon: "💳", label: "Uniform", value: "₦12,000", status: "Paid" },
      ],
    },
    announcements: {
      items: [
        { icon: "📢", label: "Mid-term Break", date: "Mar 10-14", desc: "School closes for mid-term" },
        { icon: "📢", label: "Sports Day", date: "Apr 10", desc: "Annual inter-house sports" },
        { icon: "📢", label: "PTA Meeting", date: "Mar 20", desc: "Parents meeting 10 AM" },
      ],
    },
    grades: {
      items: [
        { icon: "📊", label: "Mathematics", value: "A" },
        { icon: "📊", label: "English Language", value: "A-" },
        { icon: "📊", label: "Chemistry", value: "B+" },
        { icon: "📊", label: "Physics", value: "B" },
        { icon: "📊", label: "Biology", value: "A" },
      ],
    },
    events: {
      items: [
        { icon: "🏆", name: "Sports Day", date: "Apr 10", time: "8:00 AM" },
        { icon: "🎭", name: "Cultural Day", date: "May 15", time: "10:00 AM" },
        { icon: "🏆", name: "Prize Giving", date: "Jul 5", time: "10:00 AM" },
      ],
    },
    parents: {
      items: [
        { icon: "💬", label: "Message Teacher", action: "message" },
        { icon: "📄", label: "View Report Card", action: "view" },
        { icon: "📅", label: "Schedule Meeting", action: "schedule" },
      ],
    },
    assignments: {
      items: [
        { icon: "📝", name: "Math Homework", due: "Tomorrow", subject: "Math" },
        { icon: "📝", name: "Essay Writing", due: "Friday", subject: "English" },
      ],
    },
    live: {
      items: [
        { icon: "📺", name: "Live Class - Math", time: "Mon 9:00 AM" },
        { icon: "📺", name: "Live Class - English", time: "Wed 10:00 AM" },
      ],
    },
    categories: ["Timetable", "Fees", "Announcements", "Grades"],
  },

  Booking: {
    services: {
      items: [
        { emoji: "💇", name: "Hair Styling", price: "₦8,000", duration: "60 min" },
        { emoji: "💆", name: "Full Body Massage", price: "₦15,000", duration: "90 min" },
        { emoji: "💅", name: "Manicure & Pedicure", price: "₦5,000", duration: "45 min" },
        { emoji: "🧖", name: "Facial Treatment", price: "₦12,000", duration: "60 min" },
      ],
    },
    booking: {
      dates: Array.from({ length: 14 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return d.toISOString().split('T')[0];
      }),
      slots: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"],
    },
    calendar: {
      dates: Array.from({ length: 14 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return d.toISOString().split('T')[0];
      }),
      slots: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"],
    },
    bookings: {
      bookings: [
        { id: "BK-001", customer: "Chioma", service: "Hair Styling", time: "Tomorrow 2pm", status: "Confirmed" },
        { id: "BK-002", customer: "Jane", service: "Full Body Massage", time: "Tomorrow 4pm", status: "Pending" },
        { id: "BK-003", customer: "Mike", service: "Facial Treatment", time: "Tomorrow 10am", status: "Confirmed" },
      ],
    },
    reminders: {
      reminders: [
        { icon: "⏰", label: "24h Before", value: "SMS + Email" },
        { icon: "⏰", label: "1h Before", value: "Push Notification" },
        { icon: "⏰", label: "Follow Up", value: "Post-appointment review" },
      ],
    },
    reviews: {
      reviews: [
        { icon: "⭐", name: "Excellent service", customer: "Chioma", rating: 5, date: "Jun 20" },
        { icon: "⭐", name: "Very professional", customer: "Mike", rating: 5, date: "Jun 18" },
      ],
    },
    payments: {
      items: [
        { icon: "💳", label: "Paystack", value: "Cards, Transfer, USSD" },
        { icon: "🏦", label: "Bank Transfer", value: "Direct deposit" },
      ],
    },
    categories: ["Services", "Calendar", "Bookings", "Profile"],
  },
};

/**
 * Get screen preview data for a specific screen, category, and template
 */
export function getScreenPreviewData(screenId, category, template) {
  const categoryData = CATEGORY_SCREEN_DATA[category] || CATEGORY_SCREEN_DATA.Restaurant;
  return categoryData[screenId] || { items: [], categories: [] };
}

/**
 * Main function to get complete preview data for a shop
 * This merges template layout with actual shop data
 */
export function getShopPreviewData(shopData) {
  const { category, template, appName, tagline, color, logo, businessName, bizDesc, phone, address, hours, selectedIntegrations } = shopData;
  
  // Generate template config
  const templateConfig = generateShopTemplate({
    category,
    template,
    appName,
    tagline,
    color,
    logo,
    businessName,
    bizDesc,
    phone,
    address,
    hours,
    selectedIntegrations,
  });
  
  // Enhance with real data
  const enhancedScreens = {};
  if (templateConfig.screens) {
    templateConfig.screens.forEach(screen => {
      const screenId = screen.id;
      const previewData = getScreenPreviewData(screenId, category, template);
      enhancedScreens[screenId] = {
        ...screen,
        data: CATEGORY_SCREEN_DATA[category]?.[screenId] || {},
      };
    });
  }
  
  return {
    ...templateConfig,
    screens: enhancedScreens,
    // Add real data that components can access
    products: getPreviewProducts(category),
    categories: getPreviewCategories(category),
    orders: CATEGORY_SCREEN_DATA[category]?.orders || {},
    conversations: getConversations(),
    messages: getMessages,
    dashboardStats: getDashboardStats(category),
    revenueData: getRevenueData(category),
    activityData: getActivityData(category),
    analytics: getAnalyticsData(),
    billing: getBillingData(),
    theme: getThemeForTemplate(category, template),
    // Add category-specific data
    categoryData: CATEGORY_SCREEN_DATA[category] || CATEGORY_SCREEN_DATA.Restaurant,
  };
}

export default {
  getProductsForCategory,
  getOrders,
  getConversations,
  getMessages,
  getIntegrations,
  getDashboardStats,
  getRevenueData,
  getActivityData,
  getAnalyticsData,
  getBillingData,
  getPreviewProducts,
  getPreviewCategories,
  getPreviewBottomNav,
  getThemeForTemplate,
  getScreenPreviewData,
  getShopPreviewData,
  CATEGORY_SCREEN_DATA,
};