const CATEGORY_SCREENS = {
  Restaurant: ["menu", "orders", "reservations", "info"],
  Ecommerce: ["shop", "cart", "orders", "profile"],
  "Food Vendor": ["menu", "orders", "pickup", "info"],
  Grocery: ["shop", "cart", "orders", "profile"],
  Church: ["events", "giving", "sermons", "community"],
  School: ["timetable", "fees", "announcements", "grades"],
  Booking: ["services", "calendar", "bookings", "info"],
};

const BASE_TEMPLATES = {
  Restaurant: {
    "Classic Dine": { theme: { primary: "#1B4332", secondary: "#F4A026", bg: "#FAFAFA", card: "#FFFFFF" }, style: "light" },
    "Modern Bites": { theme: { primary: "#0F0F1A", secondary: "#F4A026", bg: "#1A1A2E", card: "#252540" }, style: "dark" },
    "Fresh & Bright": { theme: { primary: "#2ECC71", secondary: "#F4A026", bg: "#F0FDF4", card: "#FFFFFF" }, style: "light" },
  },
  Ecommerce: {
    Storefront: { theme: { primary: "#0D9488", secondary: "#0F0F1A", bg: "#FAFAFA", card: "#FFFFFF" }, style: "light" },
    "Flash Sale": { theme: { primary: "#E74C3C", secondary: "#F4A026", bg: "#1A1A2E", card: "#252540" }, style: "dark" },
    "Minimal Shop": { theme: { primary: "#7C3AED", secondary: "#F4A026", bg: "#FAFAFA", card: "#FFFFFF" }, style: "light" },
  },
  "Food Vendor": {
    "Street Eats": { theme: { primary: "#EA580C", secondary: "#F4A026", bg: "#1A1A2E", card: "#252540" }, style: "dark" },
    "Home Kitchen": { theme: { primary: "#1B4332", secondary: "#F4A026", bg: "#FEF8ED", card: "#FFFFFF" }, style: "light" },
    "Fast Bites": { theme: { primary: "#0D9488", secondary: "#F4A026", bg: "#FAFAFA", card: "#FFFFFF" }, style: "light" },
  },
  Grocery: {
    "Market Fresh": { theme: { primary: "#2ECC71", secondary: "#F4A026", bg: "#F0FDF4", card: "#FFFFFF" }, style: "light" },
    "Corner Shop": { theme: { primary: "#1B4332", secondary: "#F4A026", bg: "#FEF8ED", card: "#FFFFFF" }, style: "light" },
    "Bulk Buy": { theme: { primary: "#7C3AED", secondary: "#F4A026", bg: "#1A1A2E", card: "#252540" }, style: "dark" },
  },
  Church: {
    Cathedral: { theme: { primary: "#1B4332", secondary: "#F4A026", bg: "#FAFAFA", card: "#FFFFFF" }, style: "light" },
    "Community Light": { theme: { primary: "#F4A026", secondary: "#1B4332", bg: "#FEF8ED", card: "#FFFFFF" }, style: "light" },
    "Youth Vibes": { theme: { primary: "#EC4899", secondary: "#F4A026", bg: "#1A1A2E", card: "#252540" }, style: "dark" },
  },
  School: {
    "Academy Pro": { theme: { primary: "#0D9488", secondary: "#F4A026", bg: "#FAFAFA", card: "#FFFFFF" }, style: "light" },
    "Bright Minds": { theme: { primary: "#EC4899", secondary: "#F4A026", bg: "#FDF2F8", card: "#FFFFFF" }, style: "light" },
    "Smart Campus": { theme: { primary: "#7C3AED", secondary: "#F4A026", bg: "#1A1A2E", card: "#252540" }, style: "dark" },
  },
  Booking: {
    Scheduler: { theme: { primary: "#0D9488", secondary: "#F4A026", bg: "#FAFAFA", card: "#FFFFFF" }, style: "light" },
    "Spa Lounge": { theme: { primary: "#1B4332", secondary: "#F4A026", bg: "#F0FDF4", card: "#FFFFFF" }, style: "light" },
    "Quick Book": { theme: { primary: "#7C3AED", secondary: "#F4A026", bg: "#1A1A2E", card: "#252540" }, style: "dark" },
  },
};

function getBaseTemplate(category, template) {
  return BASE_TEMPLATES[category]?.[template] || BASE_TEMPLATES.Restaurant["Classic Dine"];
}

const WIZARD_PREVIEW_DATA_LOCAL = {
  Restaurant: { categories: ["Popular", "Mains", "Drinks", "Desserts"], items: [] },
  Ecommerce: { categories: ["New Arrivals", "Clothing", "Electronics"], items: [] },
  "Food Vendor": { categories: ["Popular", "Specials", "Combo"], items: [] },
  Grocery: { categories: ["Fruits", "Beverages", "Snacks"], items: [] },
  Church: { categories: ["Upcoming", "Sermons", "Ministries"], items: [] },
  School: { categories: ["Announcements", "Timetable", "Events"], items: [] },
  Booking: { categories: ["Services", "Popular", "Special Offers"], items: [] },
};

function generateMenuScreen(config) {
  const preview = WIZARD_PREVIEW_DATA_LOCAL[config.category] || WIZARD_PREVIEW_DATA_LOCAL.Ecommerce;
  
  return {
    screenId: "menu",
    title: "Menu",
    layout: {
      kind: "scroll",
      children: [
        {
          type: "hero_banner",
          key: "welcome-banner",
          props: {
            title: config.appName,
            subtitle: config.tagline || `Welcome to ${config.appName}`,
            image: null,
          },
          style: { background: `linear-gradient(135deg, ${config.color}, ${darken(config.color, 20)})` },
        },
        {
          type: "category_pills",
          key: "category-pills",
          props: { categories: preview.categories || ["Popular", "Mains", "Drinks"] },
          actions: { selectCategory: { type: "filter", payload: { source: "category" } } },
        },
        {
          type: "menu_grid",
          key: "menu-items",
          props: { columns: 2, variant: config.template.includes("Modern") ? "bold" : "default" },
          actions: { addItem: { type: "add_to_cart" }, viewDetails: { type: "navigate", payload: { push: "/item-detail" } } },
        },
      ],
    },
  };
}

function generateShopScreen() {
  return {
    screenId: "shop",
    title: "Shop",
    layout: {
      kind: "scroll",
      children: [
        {
          type: "promotion_list",
          key: "promo-banner",
          props: { offers: [{ title: "New Arrivals", subtitle: "Up to 30% off", image: null }] },
          actions: { tap: { type: "navigate", payload: { push: "/products?filter=new-arrivals" } } },
        },
        {
          type: "category_pills",
          key: "category-pills",
          props: { categories: ["All", "Clothing", "Electronics", "Accessories"] },
          actions: { selectCategory: { type: "filter", payload: { source: "category" } } },
        },
        {
          type: "menu_grid",
          key: "products-grid",
          props: { columns: 2 },
          actions: { addItem: { type: "add_to_cart" }, viewDetails: { type: "navigate", payload: { push: "/product-detail" } } },
        },
      ],
    },
  };
}

function generateBookingScreen(config) {
  return {
    screenId: "services",
    title: "Services",
    layout: {
      kind: "scroll",
      children: [
        {
          type: "hero_banner",
          key: "booking-banner",
          props: { title: "Book a Service", subtitle: "Choose your preferred time", image: null },
          style: { background: `linear-gradient(135deg, ${config.color}, ${darken(config.color, 20)})` },
        },
        {
          type: "calendar_strip",
          key: "date-picker",
          props: { minDate: "today", maxDate: "+30", variant: "default" },
          actions: { selectDate: { type: "filter", payload: { source: "date" } } },
        },
        {
          type: "slot_grid",
          key: "time-slots",
          props: { duration: 60, variant: "default" },
          actions: { selectSlot: { type: "filter", payload: { source: "slot" } } },
        },
        {
          type: "booking_summary",
          key: "booking-summary",
          props: {},
          actions: { confirm: { type: "api_request", payload: { method: "POST", path: "/bookings" } } },
        },
      ],
    },
  };
}

function generateInfoScreen(config) {
  return {
    screenId: "info",
    title: "Info",
    children: [
      {
        type: "info_list",
        key: "contact-info",
        props: {
          variant: "default",
          items: [
            { icon: "📞", label: "Call Us", value: config.phone || "+234 800 000 0000", action: "call" },
            { icon: "📍", label: "Address", value: config.address || "12 Business Street, Lagos" },
            { icon: "🕐", label: "Hours", value: config.hours?.length ? config.hours[0] : "Mon-Sun: 8AM - 10PM" },
            { icon: "📧", label: "Email", value: "hello@" + (config.appName || "").toLowerCase().replace(/\s+/g, "") + ".com", action: "email" },
          ],
        },
        actions: { call: { type: "call_phone", payload: { phone: config.phone } }, email: { type: "email", payload: { to: "hello@example.com" } } },
      },
      {
        type: "report_action",
        key: "report-issue",
        props: { title: "Report an Issue" },
        actions: { submit: { type: "submit_form", payload: {} } },
      },
    ],
  };
}

function generateOrdersScreen() {
  return {
    screenId: "orders",
    title: "My Orders",
    children: [
      {
        type: "order_history",
        key: "order-list",
        props: { showStatus: true, variant: "default" },
        actions: { selectOrder: { type: "navigate", payload: { push: "/order-detail" } } },
      },
    ],
  };
}

function generateCartScreen() {
  return {
    screenId: "cart",
    title: "Cart",
    children: [
      {
        type: "cart_summary",
        key: "cart-summary",
        props: {},
        actions: { checkout: { type: "checkout" }, removeItem: { type: "remove_from_cart" } },
      },
    ],
  };
}

function generateProfileScreen() {
  return {
    screenId: "profile",
    title: "Profile",
    children: [
      {
        type: "info_list",
        key: "account-info",
        props: {
          items: [
            { icon: "👤", label: "My Account", value: "Manage settings", action: "tap" },
            { icon: "📍", label: "Shipping Addresses", value: "2 addresses" },
            { icon: "💳", label: "Payment Methods", value: "Card, Bank Transfer" },
            { icon: "⭐", label: "Wishlist", value: "5 items" },
          ],
        },
        actions: { tap: { type: "navigate", payload: { push: "/settings" } } },
      },
      {
        type: "primary_button",
        key: "logout-btn",
        props: { label: "Logout" },
        actions: { default: { type: "logout" } },
      },
    ],
  };
}

function generateEventsScreen(config) {
  return {
    screenId: "events",
    title: "Events",
    layout: {
      kind: "scroll",
      children: [
        {
          type: "hero_banner",
          key: "events-banner",
          props: { title: "Upcoming Events", subtitle: "Join our community", image: null },
          style: { background: `linear-gradient(135deg, ${config.color}, ${darken(config.color, 20)})` },
        },
        {
          type: "notification_list",
          key: "events-list",
          props: { notifications: [] },
          actions: { tap: { type: "navigate", payload: { push: "/event-detail" } } },
        },
      ],
    },
  };
}

function darken(hex, percent) {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, (num >> 16) - amt);
  const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
  const B = Math.max(0, (num & 0x0000FF) - amt);
  return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

function generateScreens(config) {
  const screens = [];
  const screenTypes = CATEGORY_SCREENS[config.category] || CATEGORY_SCREENS.Restaurant;

  if (screenTypes.includes("menu")) screens.push(generateMenuScreen(config));
  if (screenTypes.includes("shop")) screens.push(generateShopScreen(config));
  if (screenTypes.includes("services")) screens.push(generateBookingScreen(config));
  if (screenTypes.includes("events")) screens.push(generateEventsScreen(config));
  if (screenTypes.includes("info")) screens.push(generateInfoScreen(config));
  if (screenTypes.includes("orders")) screens.push(generateOrdersScreen(config));
  if (screenTypes.includes("cart")) screens.push(generateCartScreen(config));
  if (screenTypes.includes("profile")) screens.push(generateProfileScreen(config));
  if (screenTypes.includes("reservations")) screens.push(generateBookingScreen(config));
  if (screenTypes.includes("pickup")) screens.push(generateOrdersScreen(config));
  if (screenTypes.includes("calendar")) screens.push(generateBookingScreen(config));
  if (screenTypes.includes("bookings")) screens.push(generateOrdersScreen(config));
  if (screenTypes.includes("timetable")) screens.push(generateEventsScreen(config));
  if (screenTypes.includes("fees")) screens.push(generateOrdersScreen(config));
  if (screenTypes.includes("announcements")) screens.push(generateEventsScreen(config));
  if (screenTypes.includes("grades")) screens.push(generateInfoScreen(config));
  if (screenTypes.includes("giving")) screens.push(generateOrdersScreen(config));
  if (screenTypes.includes("sermons")) screens.push(generateEventsScreen(config));
  if (screenTypes.includes("community")) screens.push(generateInfoScreen(config));
  if (screenTypes.includes("parent")) screens.push(generateInfoScreen(config));
  if (screenTypes.includes("assignments")) screens.push(generateOrdersScreen(config));
  if (screenTypes.includes("live")) screens.push(generateEventsScreen(config));

  return screens;
}

function generateNavigation(config) {
  const screenTypes = CATEGORY_SCREENS[config.category] || CATEGORY_SCREENS.Restaurant;
  const icons = {
    menu: "restaurant-outline", shop: "storefront-outline", services: "calendar-outline",
    events: "calendar-outline", info: "information-outline", orders: "receipt-outline",
    cart: "cart-outline", profile: "person-outline", reservations: "calendar-outline",
    pickup: "bag-outline", calendar: "calendar-outline", bookings: "receipt-outline",
    timetable: "calendar-outline", fees: "card-outline", announcements: "megaphone-outline",
    grades: "trophy-outline", giving: "heart-outline", sermons: "book-outline",
    community: "people-outline", parent: "person-outline", assignments: "clipboard-outline",
    live: "videocam-outline",
  };
  const labels = {
    menu: "Menu", shop: "Shop", services: "Services", events: "Events",
    info: "Info", orders: "Orders", cart: "Cart", profile: "Profile",
    reservations: "Reserve", pickup: "Pickup", calendar: "Calendar",
    bookings: "Bookings", timetable: "Timetable", fees: "Fees",
    announcements: "News", grades: "Grades", giving: "Giving",
    sermons: "Sermons", community: "Community", parent: "Parent",
    assignments: "Assignments", live: "Live",
  };

  return {
    initialScreen: screenTypes[0] || "menu",
    tabs: screenTypes.map(id => ({
      label: labels[id] || id,
      icon: icons[id] || "grid-outline",
      screenId: id,
    })),
  };
}

export function generateShopTemplate(config) {
  const baseTemplate = getBaseTemplate(config.category, config.template);
  
  return {
    version: "1.0",
    templateId: (config.template || "").toLowerCase().replace(/\s+/g, "-"),
    category: config.category,
    theme: {
      primaryColor: config.color || baseTemplate.theme.primary,
      secondaryColor: baseTemplate.theme.secondary,
      backgroundColor: baseTemplate.theme.bg,
      cardColor: baseTemplate.theme.card,
      textColor: baseTemplate.style === "dark" ? "#FFFFFF" : "#0F0F1A",
      fontFamily: "'Inter', sans-serif",
      roundness: 12,
    },
    navigation: generateNavigation(config),
    screens: generateScreens(config),
    assets: {
      logo: config.logo,
      icon: config.logo,
    },
    branding: {
      appName: config.appName,
      tagline: config.tagline,
      businessName: config.businessName,
      description: config.bizDesc,
    },
    integrations: config.selectedIntegrations || [],
    settings: {
      orderType: config.category === "Restaurant" ? "delivery_pickup" : "shipping",
      currency: "₦",
      language: "en",
    },
  };
}

export function getDefaultTemplateConfig(category = "Restaurant") {
  return generateShopTemplate({
    category,
    template: "Classic Dine",
    appName: "My Shop",
    tagline: "",
    color: "#1B4332",
    logo: null,
    businessName: "My Business",
    bizDesc: "",
    phone: "",
    address: "",
    hours: [],
    selectedIntegrations: [],
  });
}