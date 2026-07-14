const templateDefaults = {
  "Restaurant / Cafe": {
    meta: { appName: "My Restaurant", category: "Restaurant / Cafe", primaryColor: "#1A1A2E", emoji: "🍽️" },
    navigation: { initialScreen: "screen_home", tabs: [{ label: "Menu", icon: "🍽️", screenId: "screen_menu" }, { label: "Info", icon: "ℹ️", screenId: "screen_about" }] },
    screens: {
      screen_home: {
        name: "Home", width: 390, height: 844, backgroundColor: "#FCF8FA",
        components: [
          { type: "hero_banner", x: 0, y: 0, width: 390, height: 220, props: { title: "Flavors of Africa", subtitle: "Authentic cuisine delivered to your door", badge: "Open Now", color: "#1A1A2E" }, locked: false, visible: true },
          { type: "text_block", x: 16, y: 240, width: 358, height: 30, props: { text: "Popular Dishes", fontSize: 18, fontWeight: 700, color: "#1C1B1D", alignment: "left" }, locked: false, visible: true },
          { type: "category_pills", x: 16, y: 278, width: 358, height: 48, props: { categories: ["All", "Mains", "Sides", "Drinks"] }, locked: false, visible: true },
          { type: "menu_item", x: 16, y: 340, width: 358, height: 80, props: { name: "Jollof Rice", price: "₦2,500", desc: "Rich, smoky jollof rice with plantain", emoji: "🍛" }, locked: false, visible: true },
          { type: "menu_item", x: 16, y: 432, width: 358, height: 80, props: { name: "Egusi Soup", price: "₦3,200", desc: "Ground melon seeds with leafy greens", emoji: "🥘" }, locked: false, visible: true },
          { type: "menu_item", x: 16, y: 524, width: 358, height: 80, props: { name: "Zobo Drink", price: "₦800", desc: "Hibiscus refreshment with ginger", emoji: "🍹" }, locked: false, visible: true },
        ],
      },
      screen_menu: {
        name: "Menu", width: 390, height: 844, backgroundColor: "#FCF8FA",
        components: [
          { type: "text_block", x: 16, y: 16, width: 358, height: 36, props: { text: "Full Menu", fontSize: 24, fontWeight: 700, color: "#1C1B1D", alignment: "left" }, locked: false, visible: true },
          { type: "menu_grid", x: 16, y: 64, width: 358, height: 340, props: { columns: 2 }, locked: false, visible: true },
        ],
      },
      screen_about: {
        name: "Info", width: 390, height: 844, backgroundColor: "#FCF8FA",
        components: [
          { type: "text_block", x: 16, y: 16, width: 358, height: 36, props: { text: "About Us", fontSize: 24, fontWeight: 700, color: "#1C1B1D", alignment: "left" }, locked: false, visible: true },
          { type: "text_block", x: 16, y: 60, width: 358, height: 120, props: { text: "We serve authentic West African cuisine made with fresh ingredients. Established in 2020, our mission is to bring the vibrant flavors of Africa to your table.", fontSize: 14, fontWeight: 400, color: "#6B7280", alignment: "left" }, locked: false, visible: true },
          { type: "button", x: 16, y: 200, width: 358, height: 48, props: { label: "Contact Us", background: "#F4A026", color: "#1C1B1D", borderRadius: 12, action: "{}" }, locked: false, visible: true },
        ],
      },
    },
  },

  "Retail / Shop": {
    meta: { appName: "My Shop", category: "Retail / Shop", primaryColor: "#1A1A2E", emoji: "🛍️" },
    navigation: { initialScreen: "screen_home", tabs: [{ label: "Shop", icon: "🛍️", screenId: "screen_shop" }, { label: "Cart", icon: "🛒", screenId: "screen_cart" }] },
    screens: {
      screen_home: {
        name: "Home", width: 390, height: 844, backgroundColor: "#FCF8FA",
        components: [
          { type: "hero_banner", x: 0, y: 0, width: 390, height: 220, props: { title: "New Collection", subtitle: "Summer styles are here", badge: "Sale", color: "#1A1A2E" }, locked: false, visible: true },
          { type: "category_pills", x: 16, y: 240, width: 358, height: 48, props: { categories: ["All", "Clothing", "Accessories", "Shoes"] }, locked: false, visible: true },
        ],
      },
      screen_shop: {
        name: "Shop", width: 390, height: 844, backgroundColor: "#FCF8FA",
        components: [
          { type: "menu_grid", x: 16, y: 16, width: 358, height: 340, props: { columns: 2 }, locked: false, visible: true },
        ],
      },
      screen_cart: {
        name: "Cart", width: 390, height: 844, backgroundColor: "#FCF8FA",
        components: [
          { type: "text_block", x: 16, y: 16, width: 358, height: 36, props: { text: "Your Cart", fontSize: 24, fontWeight: 700, color: "#1C1B1D", alignment: "left" }, locked: false, visible: true },
        ],
      },
    },
  },

  "Fitness / Wellness": {
    meta: { appName: "Fit Life", category: "Fitness / Wellness", primaryColor: "#2ECC71", emoji: "💪" },
    navigation: { initialScreen: "screen_home", tabs: [{ label: "Home", icon: "🏠", screenId: "screen_home" }, { label: "Plans", icon: "📋", screenId: "screen_plans" }] },
    screens: {
      screen_home: {
        name: "Home", width: 390, height: 844, backgroundColor: "#FCF8FA",
        components: [
          { type: "hero_banner", x: 0, y: 0, width: 390, height: 220, props: { title: "Transform Today", subtitle: "Personal training at your fingertips", badge: "Join Now", color: "#2ECC71" }, locked: false, visible: true },
          { type: "text_block", x: 16, y: 240, width: 358, height: 30, props: { text: "Our Programs", fontSize: 18, fontWeight: 700, color: "#1C1B1D", alignment: "left" }, locked: false, visible: true },
        ],
      },
      screen_plans: {
        name: "Plans", width: 390, height: 844, backgroundColor: "#FCF8FA",
        components: [
          { type: "text_block", x: 16, y: 16, width: 358, height: 36, props: { text: "Membership Plans", fontSize: 24, fontWeight: 700, color: "#1C1B1D", alignment: "left" }, locked: false, visible: true },
          { type: "button", x: 16, y: 64, width: 358, height: 56, props: { label: "Basic - $29/mo", background: "#F4A026", color: "#1C1B1D", borderRadius: 12 }, locked: false, visible: true },
          { type: "button", x: 16, y: 132, width: 358, height: 56, props: { label: "Premium - $59/mo", background: "#1A1A2E", color: "#fff", borderRadius: 12 }, locked: false, visible: true },
        ],
      },
    },
  },

  "Beauty / Salon": {
    meta: { appName: "Glam Salon", category: "Beauty / Salon", primaryColor: "#E74C3C", emoji: "💇" },
    navigation: { initialScreen: "screen_home", tabs: [{ label: "Home", icon: "🏠", screenId: "screen_home" }, { label: "Services", icon: "💅", screenId: "screen_services" }] },
    screens: {
      screen_home: {
        name: "Home", width: 390, height: 844, backgroundColor: "#FCF8FA",
        components: [
          { type: "hero_banner", x: 0, y: 0, width: 390, height: 220, props: { title: "Glam Salon", subtitle: "Look your best every day", badge: "Book Now", color: "#E74C3C" }, locked: false, visible: true },
        ],
      },
      screen_services: {
        name: "Services", width: 390, height: 844, backgroundColor: "#FCF8FA",
        components: [
          { type: "text_block", x: 16, y: 16, width: 358, height: 36, props: { text: "Our Services", fontSize: 24, fontWeight: 700, color: "#1C1B1D", alignment: "left" }, locked: false, visible: true },
          { type: "menu_item", x: 16, y: 64, width: 358, height: 80, props: { name: "Haircut", price: "$35", desc: "Wash, cut & style", emoji: "✂️" }, locked: false, visible: true },
          { type: "menu_item", x: 16, y: 156, width: 358, height: 80, props: { name: "Manicure", price: "$25", desc: "Nail shaping & polish", emoji: "💅" }, locked: false, visible: true },
          { type: "menu_item", x: 16, y: 248, width: 358, height: 80, props: { name: "Facial", price: "$50", desc: "Deep cleansing facial", emoji: "🧖" }, locked: false, visible: true },
        ],
      },
    },
  },

  "Custom": {
    meta: { appName: "My App", category: "Custom", primaryColor: "#1A1A2E", emoji: "📱" },
    navigation: { initialScreen: "screen_home", tabs: [] },
    screens: {
      screen_home: {
        name: "Home", width: 390, height: 844, backgroundColor: "#FCF8FA",
        components: [],
      },
    },
  },
};

export default templateDefaults;
