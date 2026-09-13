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
  const normalized = normalizeTemplateName(template);
  return BASE_TEMPLATES[category]?.[normalized] || BASE_TEMPLATES.Restaurant["Classic Dine"];
}

function normalizeTemplateName(template) {
  const raw = String(template || "").split("/").pop();
  return raw.replace(/[-_]+([a-z])/g, (_, letter) => ` ${letter.toUpperCase()}`).replace(/^./, letter => letter.toUpperCase());
}

const WIZARD_PREVIEW_DATA_LOCAL = {
  Restaurant: { categories: ["Popular", "Mains", "Drinks", "Desserts"], items: [
    { name: "Jollof Rice", price: "₦2,500", desc: "Rich, smoky jollof rice", emoji: "Utensils" },
    { name: "Grilled Chicken", price: "₦3,000", desc: "Char-grilled and spicy", emoji: "Drumstick" },
  ] },
  Ecommerce: { categories: ["New Arrivals", "Clothing", "Electronics"], items: [
    { name: "Everyday Tote", price: "₦18,000", desc: "Durable canvas carryall", emoji: "ShoppingBag" },
    { name: "Wireless Headphones", price: "₦42,000", desc: "Comfortable all-day audio", emoji: "Headphones" },
  ] },
  "Food Vendor": { categories: ["Popular", "Specials", "Combo"], items: [
    { name: "Suya Combo", price: "₦4,500", desc: "Beef suya with sides", emoji: "Utensils" },
    { name: "Chicken Wrap", price: "₦3,200", desc: "Freshly grilled to order", emoji: "Sandwich" },
  ] },
  Grocery: { categories: ["Fruits", "Beverages", "Snacks"], items: [
    { name: "Fresh Fruit Box", price: "₦8,500", desc: "Seasonal fruit selection", emoji: "Apple" },
    { name: "Sparkling Water", price: "₦1,200", desc: "Pack of six bottles", emoji: "GlassWater" },
  ] },
  Church: { categories: ["Upcoming", "Sermons", "Ministries"], items: [
    { name: "Sunday Service", price: "Free", desc: "Join us this Sunday", emoji: "Heart" },
    { name: "Youth Fellowship", price: "Free", desc: "Weekly community gathering", emoji: "Users" },
  ] },
  School: { categories: ["Announcements", "Timetable", "Events"], items: [
    { name: "Term Opening", price: "Today", desc: "Welcome back to school", emoji: "Calendar" },
    { name: "Parent Meeting", price: "Friday", desc: "Main hall, 4:00 PM", emoji: "Users" },
  ] },
  Booking: { categories: ["Services", "Popular", "Special Offers"], items: [
    { name: "Consultation", price: "₦10,000", desc: "One-hour appointment", emoji: "Calendar" },
    { name: "Premium Session", price: "₦25,000", desc: "Extended focused session", emoji: "Star" },
  ] },
};

const TEMPLATE_SCREEN_VARIANTS = {
  "Classic Dine": ["menu", "orders", "reservations", "info"],
  "Modern Bites": ["menu", "shop", "orders", "profile"],
  "Fresh & Bright": ["menu", "info", "orders"],
  Storefront: ["shop", "cart", "orders", "profile"],
  "Flash Sale": ["shop", "cart", "orders"],
  "Minimal Shop": ["shop", "profile", "orders"],
  "Street Eats": ["menu", "pickup", "orders", "info"],
  "Home Kitchen": ["menu", "orders", "info"],
  "Fast Bites": ["menu", "pickup", "orders"],
  "Market Fresh": ["shop", "cart", "orders", "info"],
  "Corner Shop": ["shop", "orders", "profile"],
  "Bulk Buy": ["shop", "cart", "orders", "profile"],
  Cathedral: ["events", "giving", "sermons", "community"],
  "Community Light": ["events", "community", "giving"],
  "Youth Vibes": ["events", "community", "live", "giving"],
  "Academy Pro": ["timetable", "assignments", "announcements", "parent"],
  "Bright Minds": ["announcements", "grades", "parent"],
  "Smart Campus": ["timetable", "fees", "assignments", "announcements"],
  Scheduler: ["services", "calendar", "bookings", "info"],
  "Spa Lounge": ["services", "calendar", "bookings", "profile"],
  "Quick Book": ["services", "bookings", "info"],
};

function generateMenuScreen(config) {
  const preview = WIZARD_PREVIEW_DATA_LOCAL[config.category] || WIZARD_PREVIEW_DATA_LOCAL.Ecommerce;
  const dataBinding = getDataBinding(config.category);
  
  return {
    screenId: "menu",
    title: "Menu",
    layout: {
      kind: "scroll",
      gap: 16,
      padding: 16,
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
          props: {
            columns: 2,
             variant: normalizeTemplateName(config.template).includes("Modern") ? "bold" : "default",
            items: preview.items,
            dataBinding,
          },
          actions: { addItem: { type: "add_to_cart" }, viewDetails: { type: "navigate", payload: { push: "/item-detail" } } },
        },
      ],
    },
  };
}

function generateShopScreen(config) {
  const preview = WIZARD_PREVIEW_DATA_LOCAL[config.category] || WIZARD_PREVIEW_DATA_LOCAL.Ecommerce;
  const dataBinding = getDataBinding(config.category);
  return {
    screenId: "shop",
    title: "Shop",
    layout: {
      kind: "scroll",
      gap: 16,
      padding: 16,
      children: [
        {
          type: "promotion_list",
          key: "promo-banner",
           props: {
             offers: preview.items.map(item => ({ title: item.name, subtitle: item.desc, image: item.image || "", emoji: item.emoji })),
             dataBinding,
           },
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
           props: { columns: 2, items: preview.items, dataBinding },
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
      gap: 16,
      padding: 16,
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
      gap: 16,
      padding: 16,
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
  const template = normalizeTemplateName(config.template);
  const screenTypes = TEMPLATE_SCREEN_VARIANTS[template]
    || CATEGORY_SCREENS[config.category]
    || CATEGORY_SCREENS.Restaurant;

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
  const template = normalizeTemplateName(config.template);
  const screenTypes = TEMPLATE_SCREEN_VARIANTS[template]
    || CATEGORY_SCREENS[config.category]
    || CATEGORY_SCREENS.Restaurant;
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
  const templateName = normalizeTemplateName(config.template);
  
  return {
    version: "1.0",
     templateId: templateName.toLowerCase().replace(/\s+/g, "-"),
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

export function getGeneratedTemplateCatalog() {
  return Object.entries(BASE_TEMPLATES).map(([category, templates]) => ({
    name: category,
    desc: `${category} starter app structures`,
    icon: "",
    templates: Object.entries(templates).map(([name, definition]) => ({
      id: `${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}/${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      name,
      category,
      tags: [definition.style === "dark" ? "Dark" : "Light", "Starter"],
      features: TEMPLATE_SCREEN_VARIANTS[name] || CATEGORY_SCREENS[category] || [],
      preview: "",
      primaryColor: definition.theme.primary,
      secondaryColor: definition.theme.secondary,
    })),
  }));
}

function getDataBinding(category) {
  const source = category === "Booking"
    ? "booking.services"
    : category === "Church" || category === "School"
      ? "content.events"
      : "commerce.products";
  return { source, filters: { isActive: true }, limit: 20 };
}
