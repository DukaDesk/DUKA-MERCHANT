const templateDefaults = {
  "Classic Dine": {
    meta: { appName: "Classic Dine", category: "Restaurant", primaryColor: "#8B4513", secondaryColor: "#F5DEB3" },
    navigation: { initialScreen: "screen_home", tabs: [{ label: "Menu", screenId: "screen_menu" }, { label: "Info", screenId: "screen_about" }] },
    shared: {
      header: { id: "section_header", type: "header", name: "Header", backgroundColor: "#FCF8FA", components: [{ id: "h_logo", type: "header_bar", props: { logo: null, appName: "Classic Dine" } }] },
      footer: { id: "section_footer", type: "footer", name: "Footer", backgroundColor: "#8B4513", components: [{ id: "f_text", type: "text_block", props: { text: "\u00A9 2024 Classic Dine. All rights reserved.", fontSize: 12, fontWeight: 400, color: "#fff", alignment: "center" } }] },
    },
    screens: {
      screen_home: { name: "Home", backgroundColor: "#FCF8FA", bodySections: [
        { id: "sec_hero", type: "hero", name: "Hero Banner", backgroundColor: "#8B4513", components: [{ id: "c_hero", type: "hero_banner", props: { title: "Classic Dining Experience", subtitle: "Timeless flavors crafted with care", badge: "Reserve Now", color: "#8B4513" } }] },
        { id: "sec_menu", type: "menu_list", name: "Menu Preview", backgroundColor: "#FCF8FA", components: [
          { id: "c_heading", type: "text_block", props: { text: "Chef's Selection", fontSize: 18, fontWeight: 700, color: "#1C1B1D", alignment: "left" } },
          { id: "c_cats", type: "category_pills", props: { categories: ["All", "Mains", "Desserts", "Wine"] } },
          { id: "c_item1", type: "menu_item", props: { name: "Grilled Steak", price: "$28", desc: "Prime cut with herb butter", emoji: "\uD83E\uDD69" } },
          { id: "c_item2", type: "menu_item", props: { name: "Truffle Pasta", price: "$22", desc: "Handmade fettuccine", emoji: "\uD83C\uDF5D" } },
        ] },
      ] },
      screen_menu: { name: "Menu", backgroundColor: "#FCF8FA", bodySections: [
        { id: "sec_fullmenu", type: "menu_list", name: "Full Menu", backgroundColor: "#FCF8FA", components: [
          { id: "c_title", type: "text_block", props: { text: "Full Menu", fontSize: 24, fontWeight: 700, color: "#1C1B1D", alignment: "left" } },
          { id: "c_grid", type: "menu_grid", props: { columns: 2 } },
        ] },
      ] },
      screen_about: { name: "Info", backgroundColor: "#FCF8FA", bodySections: [
        { id: "sec_about", type: "info", name: "About Us", backgroundColor: "#FCF8FA", components: [
          { id: "c_atitle", type: "text_block", props: { text: "About Us", fontSize: 24, fontWeight: 700, color: "#1C1B1D", alignment: "left" } },
          { id: "c_adesc", type: "text_block", props: { text: "Serving timeless classics since 2010. Every dish tells a story.", fontSize: 14, fontWeight: 400, color: "#6B7280", alignment: "left" } },
          { id: "c_abtn", type: "button", props: { label: "Make a Reservation", background: "#F4A026", color: "#1C1B1D", borderRadius: 12, action: "{}" } },
        ] },
      ] },
    },
  },
  "Modern Bites": {
    meta: { appName: "Modern Bites", category: "Restaurant", primaryColor: "#1A1A2E", secondaryColor: "#F4A026" },
    navigation: { initialScreen: "screen_home", tabs: [{ label: "Menu", screenId: "screen_menu" }, { label: "Book", screenId: "screen_booking" }] },
    shared: {
      header: { id: "section_header", type: "header", name: "Header", backgroundColor: "#1A1A2E", components: [{ id: "h_logo", type: "header_bar", props: { logo: null, appName: "Modern Bites" } }] },
      footer: { id: "section_footer", type: "footer", name: "Footer", backgroundColor: "#1A1A2E", components: [{ id: "f_text", type: "text_block", props: { text: "\u00A9 2024 Modern Bites. All rights reserved.", fontSize: 12, fontWeight: 400, color: "#F4A026", alignment: "center" } }] },
    },
    screens: {
      screen_home: { name: "Home", backgroundColor: "#1A1A2E", bodySections: [
        { id: "sec_hero", type: "hero", name: "Hero Banner", backgroundColor: "#1A1A2E", components: [{ id: "c_hero", type: "hero_banner", props: { title: "Bold Flavors", subtitle: "Modern cuisine with an edge", badge: "Book a Table", color: "#1A1A2E" } }] },
        { id: "sec_menu", type: "menu_list", name: "Signature Dishes", backgroundColor: "#FCF8FA", components: [
          { id: "c_heading", type: "text_block", props: { text: "Signature Dishes", fontSize: 18, fontWeight: 700, color: "#1C1B1D", alignment: "left" } },
          { id: "c_cats", type: "category_pills", props: { categories: ["All", "Small Plates", "Mains", "Cocktails"] } },
          { id: "c_item1", type: "menu_item", props: { name: "Lamb Chops", price: "$32", desc: "Herb-crusted with mint sauce", emoji: "\uD83C\uDF56" } },
        ] },
      ] },
      screen_menu: { name: "Menu", backgroundColor: "#FCF8FA", bodySections: [
        { id: "sec_fullmenu", type: "menu_list", name: "Full Menu", backgroundColor: "#FCF8FA", components: [
          { id: "c_title", type: "text_block", props: { text: "Full Menu", fontSize: 24, fontWeight: 700, color: "#1C1B1D", alignment: "left" } },
          { id: "c_grid", type: "menu_grid", props: { columns: 2 } },
        ] },
      ] },
      screen_booking: { name: "Book", backgroundColor: "#FCF8FA", bodySections: [
        { id: "sec_booking", type: "info", name: "Reservations", backgroundColor: "#FCF8FA", components: [
          { id: "c_btitle", type: "text_block", props: { text: "Reserve a Table", fontSize: 24, fontWeight: 700, color: "#1C1B1D", alignment: "left" } },
          { id: "c_bdesc", type: "text_block", props: { text: "Call us or book online for the best dining experience.", fontSize: 14, fontWeight: 400, color: "#6B7280", alignment: "left" } },
          { id: "c_bbtn", type: "button", props: { label: "Book Now", background: "#F4A026", color: "#1C1B1D", borderRadius: 12 } },
        ] },
      ] },
    },
  },
  "Fresh & Bright": {
    meta: { appName: "Fresh & Bright", category: "Restaurant", primaryColor: "#2ECC71", secondaryColor: "#F0FFF0" },
    navigation: { initialScreen: "screen_home", tabs: [{ label: "Menu", screenId: "screen_menu" }, { label: "Order", screenId: "screen_order" }] },
    shared: {
      header: { id: "section_header", type: "header", name: "Header", backgroundColor: "#fff", components: [{ id: "h_logo", type: "header_bar", props: { logo: null, appName: "Fresh & Bright" } }] },
      footer: { id: "section_footer", type: "footer", name: "Footer", backgroundColor: "#2ECC71", components: [{ id: "f_text", type: "text_block", props: { text: "\u00A9 2024 Fresh & Bright. Eat fresh every day.", fontSize: 12, fontWeight: 400, color: "#1C1B1D", alignment: "center" } }] },
    },
    screens: {
      screen_home: { name: "Home", backgroundColor: "#fff", bodySections: [
        { id: "sec_hero", type: "hero", name: "Hero Banner", backgroundColor: "#2ECC71", components: [{ id: "c_hero", type: "hero_banner", props: { title: "Fresh & Bright", subtitle: "Farm-to-table goodness", badge: "Order Now", color: "#2ECC71" } }] },
        { id: "sec_menu", type: "menu_list", name: "Today's Specials", backgroundColor: "#fff", components: [
          { id: "c_heading", type: "text_block", props: { text: "Today's Specials", fontSize: 18, fontWeight: 700, color: "#1C1B1D", alignment: "left" } },
          { id: "c_cats", type: "category_pills", props: { categories: ["All", "Bowls", "Salads", "Juices"] } },
          { id: "c_item1", type: "menu_item", props: { name: "Harvest Bowl", price: "$14", desc: "Quinoa, roasted veggies, tahini", emoji: "\uD83E\uDD57" } },
        ] },
      ] },
      screen_menu: { name: "Menu", backgroundColor: "#fff", bodySections: [
        { id: "sec_fullmenu", type: "menu_list", name: "Full Menu", backgroundColor: "#fff", components: [
          { id: "c_title", type: "text_block", props: { text: "Full Menu", fontSize: 24, fontWeight: 700, color: "#1C1B1D", alignment: "left" } },
          { id: "c_grid", type: "menu_grid", props: { columns: 2 } },
        ] },
      ] },
      screen_order: { name: "Order", backgroundColor: "#fff", bodySections: [
        { id: "sec_order", type: "cart", name: "Order", backgroundColor: "#fff", components: [
          { id: "c_otitle", type: "text_block", props: { text: "Your Order", fontSize: 24, fontWeight: 700, color: "#1C1B1D", alignment: "left" } },
          { id: "c_odesc", type: "text_block", props: { text: "Delivery or pickup available.", fontSize: 14, fontWeight: 400, color: "#6B7280", alignment: "left" } },
        ] },
      ] },
    },
  },
  Storefront: {
    meta: { appName: "Storefront", category: "Ecommerce", primaryColor: "#1A1A2E", secondaryColor: "#F4A026" },
    navigation: { initialScreen: "screen_home", tabs: [{ label: "Shop", screenId: "screen_shop" }, { label: "Cart", screenId: "screen_cart" }] },
    shared: {
      header: { id: "section_header", type: "header", name: "Header", backgroundColor: "#FCF8FA", components: [{ id: "h_logo", type: "header_bar", props: { logo: null, appName: "Storefront" } }] },
      footer: { id: "section_footer", type: "footer", name: "Footer", backgroundColor: "#1A1A2E", components: [{ id: "f_text", type: "text_block", props: { text: "\u00A9 2024 Storefront. All rights reserved.", fontSize: 12, fontWeight: 400, color: "#fff", alignment: "center" } }] },
    },
    screens: {
      screen_home: { name: "Home", backgroundColor: "#FCF8FA", bodySections: [
        { id: "sec_hero", type: "hero", name: "Hero Banner", backgroundColor: "#1A1A2E", components: [{ id: "c_hero", type: "hero_banner", props: { title: "New Collection", subtitle: "Discover your style", badge: "Shop Now", color: "#1A1A2E" } }] },
        { id: "sec_cats", type: "categories", name: "Categories", backgroundColor: "#FCF8FA", components: [
          { id: "c_cats", type: "category_pills", props: { categories: ["All", "New Arrivals", "Clothing", "Accessories"] } },
        ] },
      ] },
      screen_shop: { name: "Shop", backgroundColor: "#FCF8FA", bodySections: [
        { id: "sec_grid", type: "product_grid", name: "Products", backgroundColor: "#FCF8FA", components: [
          { id: "c_grid", type: "menu_grid", props: { columns: 2 } },
        ] },
      ] },
      screen_cart: { name: "Cart", backgroundColor: "#FCF8FA", bodySections: [
        { id: "sec_cart", type: "cart", name: "Cart", backgroundColor: "#FCF8FA", components: [
          { id: "c_ctitle", type: "text_block", props: { text: "Your Cart", fontSize: 24, fontWeight: 700, color: "#1C1B1D", alignment: "left" } },
        ] },
      ] },
    },
  },
  "Flash Sale": {
    meta: { appName: "Flash Sale", category: "Ecommerce", primaryColor: "#E74C3C", secondaryColor: "#FFD700" },
    navigation: { initialScreen: "screen_home", tabs: [{ label: "Shop", screenId: "screen_shop" }, { label: "Deals", screenId: "screen_deals" }] },
    shared: {
      header: { id: "section_header", type: "header", name: "Header", backgroundColor: "#E74C3C", components: [{ id: "h_logo", type: "header_bar", props: { logo: null, appName: "Flash Sale" } }] },
      footer: { id: "section_footer", type: "footer", name: "Footer", backgroundColor: "#E74C3C", components: [{ id: "f_text", type: "text_block", props: { text: "\u00A9 2024 Flash Sale. Limited time offers.", fontSize: 12, fontWeight: 400, color: "#fff", alignment: "center" } }] },
    },
    screens: {
      screen_home: { name: "Home", backgroundColor: "#E74C3C", bodySections: [
        { id: "sec_hero", type: "hero", name: "Hero Banner", backgroundColor: "#E74C3C", components: [{ id: "c_hero", type: "hero_banner", props: { title: "Flash Sale", subtitle: "Up to 70% off - Today Only", badge: "Sale Ends Soon", color: "#E74C3C" } }] },
        { id: "sec_deals", type: "programs", name: "Hot Deals", backgroundColor: "#fff", components: [
          { id: "c_dhead", type: "text_block", props: { text: "Hot Deals", fontSize: 18, fontWeight: 700, color: "#1C1B1D", alignment: "left" } },
        ] },
      ] },
      screen_shop: { name: "Shop", backgroundColor: "#fff", bodySections: [
        { id: "sec_grid", type: "product_grid", name: "Products", backgroundColor: "#fff", components: [
          { id: "c_grid", type: "menu_grid", props: { columns: 2 } },
        ] },
      ] },
      screen_deals: { name: "Deals", backgroundColor: "#fff", bodySections: [
        { id: "sec_dealslist", type: "plans", name: "Today's Deals", backgroundColor: "#fff", components: [
          { id: "c_dtitle", type: "text_block", props: { text: "Today's Deals", fontSize: 24, fontWeight: 700, color: "#1C1B1D", alignment: "left" } },
          { id: "c_btn1", type: "button", props: { label: "40% Off Select Items", background: "#E74C3C", color: "#fff", borderRadius: 12 } },
          { id: "c_btn2", type: "button", props: { label: "Buy 1 Get 1 Free", background: "#FFD700", color: "#1C1B1D", borderRadius: 12 } },
        ] },
      ] },
    },
  },
  "Minimal Shop": {
    meta: { appName: "Minimal Shop", category: "Ecommerce", primaryColor: "#7C3AED", secondaryColor: "#F3E8FF" },
    navigation: { initialScreen: "screen_home", tabs: [{ label: "Shop", screenId: "screen_shop" }, { label: "Wishlist", screenId: "screen_wishlist" }] },
    shared: {
      header: { id: "section_header", type: "header", name: "Header", backgroundColor: "#fff", components: [{ id: "h_logo", type: "header_bar", props: { logo: null, appName: "Minimal Shop" } }] },
      footer: { id: "section_footer", type: "footer", name: "Footer", backgroundColor: "#7C3AED", components: [{ id: "f_text", type: "text_block", props: { text: "\u00A9 2024 Minimal Shop. Less is more.", fontSize: 12, fontWeight: 400, color: "#fff", alignment: "center" } }] },
    },
    screens: {
      screen_home: { name: "Home", backgroundColor: "#fff", bodySections: [
        { id: "sec_hero", type: "hero", name: "Hero Banner", backgroundColor: "#7C3AED", components: [{ id: "c_hero", type: "hero_banner", props: { title: "Minimal Shop", subtitle: "Curated essentials for modern living", badge: "Explore", color: "#7C3AED" } }] },
        { id: "sec_cats", type: "categories", name: "Shop by Category", backgroundColor: "#fff", components: [
          { id: "c_cats", type: "category_pills", props: { categories: ["All", "Home", "Tech", "Fashion"] } },
        ] },
      ] },
      screen_shop: { name: "Shop", backgroundColor: "#fff", bodySections: [
        { id: "sec_grid", type: "product_grid", name: "Products", backgroundColor: "#fff", components: [
          { id: "c_grid", type: "menu_grid", props: { columns: 2 } },
        ] },
      ] },
      screen_wishlist: { name: "Wishlist", backgroundColor: "#fff", bodySections: [
        { id: "sec_wishlist", type: "info", name: "Wishlist", backgroundColor: "#fff", components: [
          { id: "c_wtitle", type: "text_block", props: { text: "Your Wishlist", fontSize: 24, fontWeight: 700, color: "#1C1B1D", alignment: "left" } },
          { id: "c_wdesc", type: "text_block", props: { text: "Items you love, saved for later.", fontSize: 14, fontWeight: 400, color: "#6B7280", alignment: "left" } },
        ] },
      ] },
    },
  },
  "Street Kitchen": {
    meta: { appName: "Street Kitchen", category: "Food Vendor", primaryColor: "#FF6B35", secondaryColor: "#FFE4CA" },
    navigation: { initialScreen: "screen_home", tabs: [{ label: "Menu", screenId: "screen_menu" }, { label: "Pickup", screenId: "screen_pickup" }] },
    shared: {
      header: { id: "section_header", type: "header", name: "Header", backgroundColor: "#FFE4CA", components: [{ id: "h_logo", type: "header_bar", props: { logo: null, appName: "Street Kitchen" } }] },
      footer: { id: "section_footer", type: "footer", name: "Footer", backgroundColor: "#FF6B35", components: [{ id: "f_text", type: "text_block", props: { text: "\u00A9 2024 Street Kitchen. Real food, real fast.", fontSize: 12, fontWeight: 400, color: "#fff", alignment: "center" } }] },
    },
    screens: {
      screen_home: { name: "Home", backgroundColor: "#FFE4CA", bodySections: [
        { id: "sec_hero", type: "hero", name: "Hero Banner", backgroundColor: "#FF6B35", components: [{ id: "c_hero", type: "hero_banner", props: { title: "Street Kitchen", subtitle: "Bold flavors from the streets", badge: "Order Now", color: "#FF6B35" } }] },
        { id: "sec_menu", type: "menu_list", name: "Popular Items", backgroundColor: "#fff", components: [
          { id: "c_heading", type: "text_block", props: { text: "Street Favorites", fontSize: 18, fontWeight: 700, color: "#1C1B1D", alignment: "left" } },
          { id: "c_cats", type: "category_pills", props: { categories: ["All", "Tacos", "Burgers", "Sides"] } },
          { id: "c_item1", type: "menu_item", props: { name: "Spicy Tacos", price: "$9", desc: "Three tacos with salsa verde", emoji: "\uD83C\uDF2E" } },
        ] },
      ] },
      screen_menu: { name: "Menu", backgroundColor: "#fff", bodySections: [
        { id: "sec_fullmenu", type: "menu_list", name: "Full Menu", backgroundColor: "#fff", components: [
          { id: "c_title", type: "text_block", props: { text: "Full Menu", fontSize: 24, fontWeight: 700, color: "#1C1B1D", alignment: "left" } },
          { id: "c_grid", type: "menu_grid", props: { columns: 2 } },
        ] },
      ] },
      screen_pickup: { name: "Pickup", backgroundColor: "#fff", bodySections: [
        { id: "sec_pickup", type: "info", name: "Quick Pickup", backgroundColor: "#fff", components: [
          { id: "c_ptitle", type: "text_block", props: { text: "Quick Pickup", fontSize: 24, fontWeight: 700, color: "#1C1B1D", alignment: "left" } },
          { id: "c_pdesc", type: "text_block", props: { text: "Order ahead and skip the line.", fontSize: 14, fontWeight: 400, color: "#6B7280", alignment: "left" } },
        ] },
      ] },
    },
  },
  "Home Chef": {
    meta: { appName: "Home Chef", category: "Food Vendor", primaryColor: "#8B4513", secondaryColor: "#FFF3E0" },
    navigation: { initialScreen: "screen_home", tabs: [{ label: "Menu", screenId: "screen_menu" }, { label: "Catering", screenId: "screen_catering" }] },
    shared: {
      header: { id: "section_header", type: "header", name: "Header", backgroundColor: "#FFF3E0", components: [{ id: "h_logo", type: "header_bar", props: { logo: null, appName: "Home Chef" } }] },
      footer: { id: "section_footer", type: "footer", name: "Footer", backgroundColor: "#8B4513", components: [{ id: "f_text", type: "text_block", props: { text: "\u00A9 2024 Home Chef. Made with love.", fontSize: 12, fontWeight: 400, color: "#fff", alignment: "center" } }] },
    },
    screens: {
      screen_home: { name: "Home", backgroundColor: "#FFF3E0", bodySections: [
        { id: "sec_hero", type: "hero", name: "Hero Banner", backgroundColor: "#8B4513", components: [{ id: "c_hero", type: "hero_banner", props: { title: "Home Chef", subtitle: "Homemade meals delivered to you", badge: "Order Delivery", color: "#8B4513" } }] },
        { id: "sec_menu", type: "menu_list", name: "Weekly Menu", backgroundColor: "#fff", components: [
          { id: "c_heading", type: "text_block", props: { text: "This Week's Menu", fontSize: 18, fontWeight: 700, color: "#1C1B1D", alignment: "left" } },
          { id: "c_cats", type: "category_pills", props: { categories: ["All", "Soups", "Stews", "Desserts"] } },
          { id: "c_item1", type: "menu_item", props: { name: "Chicken Soup", price: "$12", desc: "Hearty chicken with vegetables", emoji: "\uD83C\uDF72" } },
        ] },
      ] },
      screen_menu: { name: "Menu", backgroundColor: "#fff", bodySections: [
        { id: "sec_fullmenu", type: "menu_list", name: "Full Menu", backgroundColor: "#fff", components: [
          { id: "c_title", type: "text_block", props: { text: "Full Menu", fontSize: 24, fontWeight: 700, color: "#1C1B1D", alignment: "left" } },
          { id: "c_grid", type: "menu_grid", props: { columns: 2 } },
        ] },
      ] },
      screen_catering: { name: "Catering", backgroundColor: "#fff", bodySections: [
        { id: "sec_catering", type: "info", name: "Catering Services", backgroundColor: "#fff", components: [
          { id: "c_ctitle", type: "text_block", props: { text: "Catering Services", fontSize: 24, fontWeight: 700, color: "#1C1B1D", alignment: "left" } },
          { id: "c_cdesc", type: "text_block", props: { text: "Let us cater your next event. From intimate dinners to large gatherings.", fontSize: 14, fontWeight: 400, color: "#6B7280", alignment: "left" } },
          { id: "c_cbtn", type: "button", props: { label: "Request Quote", background: "#8B4513", color: "#fff", borderRadius: 12 } },
        ] },
      ] },
    },
  },
  CaterPro: {
    meta: { appName: "CaterPro", category: "Food Vendor", primaryColor: "#0D9488", secondaryColor: "#E8F5F4" },
    navigation: { initialScreen: "screen_home", tabs: [{ label: "Services", screenId: "screen_services" }, { label: "Events", screenId: "screen_events" }] },
    shared: {
      header: { id: "section_header", type: "header", name: "Header", backgroundColor: "#E8F5F4", components: [{ id: "h_logo", type: "header_bar", props: { logo: null, appName: "CaterPro" } }] },
      footer: { id: "section_footer", type: "footer", name: "Footer", backgroundColor: "#0D9488", components: [{ id: "f_text", type: "text_block", props: { text: "\u00A9 2024 CaterPro. Professional catering.", fontSize: 12, fontWeight: 400, color: "#fff", alignment: "center" } }] },
    },
    screens: {
      screen_home: { name: "Home", backgroundColor: "#E8F5F4", bodySections: [
        { id: "sec_hero", type: "hero", name: "Hero Banner", backgroundColor: "#0D9488", components: [{ id: "c_hero", type: "hero_banner", props: { title: "CaterPro", subtitle: "Professional catering for every occasion", badge: "Book Now", color: "#0D9488" } }] },
        { id: "sec_services", type: "service_list", name: "Our Services", backgroundColor: "#fff", components: [
          { id: "c_shead", type: "text_block", props: { text: "Our Services", fontSize: 18, fontWeight: 700, color: "#1C1B1D", alignment: "left" } },
          { id: "c_s1", type: "menu_item", props: { name: "Corporate Events", price: "From $500", desc: "Full-service corporate catering", emoji: "\uD83C\uDFAF" } },
          { id: "c_s2", type: "menu_item", props: { name: "Weddings", price: "From $2,000", desc: "Complete wedding catering", emoji: "\uD83D\uDC8D" } },
        ] },
      ] },
      screen_services: { name: "Services", backgroundColor: "#fff", bodySections: [
        { id: "sec_servicelist", type: "service_list", name: "All Services", backgroundColor: "#fff", components: [
          { id: "c_stitle", type: "text_block", props: { text: "All Services", fontSize: 24, fontWeight: 700, color: "#1C1B1D", alignment: "left" } },
        ] },
      ] },
      screen_events: { name: "Events", backgroundColor: "#fff", bodySections: [
        { id: "sec_events", type: "info", name: "Event Booking", backgroundColor: "#fff", components: [
          { id: "c_etitle", type: "text_block", props: { text: "Event Booking", fontSize: 24, fontWeight: 700, color: "#1C1B1D", alignment: "left" } },
          { id: "c_edesc", type: "text_block", props: { text: "Plan your event with us. We handle everything.", fontSize: 14, fontWeight: 400, color: "#6B7280", alignment: "left" } },
        ] },
      ] },
    },
  },
  "Fresh Market": {
    meta: { appName: "Fresh Market", category: "Grocery", primaryColor: "#2ECC71", secondaryColor: "#E8F5E9" },
    navigation: { initialScreen: "screen_home", tabs: [{ label: "Shop", screenId: "screen_shop" }, { label: "Cart", screenId: "screen_cart" }] },
    shared: {
      header: { id: "section_header", type: "header", name: "Header", backgroundColor: "#E8F5E9", components: [{ id: "h_logo", type: "header_bar", props: { logo: null, appName: "Fresh Market" } }] },
      footer: { id: "section_footer", type: "footer", name: "Footer", backgroundColor: "#2ECC71", components: [{ id: "f_text", type: "text_block", props: { text: "\u00A9 2024 Fresh Market. Always fresh.", fontSize: 12, fontWeight: 400, color: "#1C1B1D", alignment: "center" } }] },
    },
    screens: {
      screen_home: { name: "Home", backgroundColor: "#E8F5E9", bodySections: [
        { id: "sec_hero", type: "hero", name: "Hero Banner", backgroundColor: "#2ECC71", components: [{ id: "c_hero", type: "hero_banner", props: { title: "Fresh Market", subtitle: "Farm-fresh groceries delivered", badge: "Shop Now", color: "#2ECC71" } }] },
        { id: "sec_cats", type: "categories", name: "Departments", backgroundColor: "#fff", components: [
          { id: "c_cats", type: "category_pills", props: { categories: ["All", "Fruits", "Vegetables", "Dairy"] } },
        ] },
      ] },
      screen_shop: { name: "Shop", backgroundColor: "#fff", bodySections: [
        { id: "sec_grid", type: "product_grid", name: "Products", backgroundColor: "#fff", components: [
          { id: "c_grid", type: "menu_grid", props: { columns: 2 } },
        ] },
      ] },
      screen_cart: { name: "Cart", backgroundColor: "#fff", bodySections: [
        { id: "sec_cart", type: "cart", name: "Cart", backgroundColor: "#fff", components: [
          { id: "c_ctitle", type: "text_block", props: { text: "Your Cart", fontSize: 24, fontWeight: 700, color: "#1C1B1D", alignment: "left" } },
        ] },
      ] },
    },
  },
  "Quick Shop": {
    meta: { appName: "Quick Shop", category: "Grocery", primaryColor: "#FF6B35", secondaryColor: "#FFF3E0" },
    navigation: { initialScreen: "screen_home", tabs: [{ label: "Shop", screenId: "screen_shop" }, { label: "Express", screenId: "screen_express" }] },
    shared: {
      header: { id: "section_header", type: "header", name: "Header", backgroundColor: "#FFF3E0", components: [{ id: "h_logo", type: "header_bar", props: { logo: null, appName: "Quick Shop" } }] },
      footer: { id: "section_footer", type: "footer", name: "Footer", backgroundColor: "#FF6B35", components: [{ id: "f_text", type: "text_block", props: { text: "\u00A9 2024 Quick Shop. Fast and fresh.", fontSize: 12, fontWeight: 400, color: "#fff", alignment: "center" } }] },
    },
    screens: {
      screen_home: { name: "Home", backgroundColor: "#FFF3E0", bodySections: [
        { id: "sec_hero", type: "hero", name: "Hero Banner", backgroundColor: "#FF6B35", components: [{ id: "c_hero", type: "hero_banner", props: { title: "Quick Shop", subtitle: "Groceries in 30 minutes or less", badge: "Order Now", color: "#FF6B35" } }] },
        { id: "sec_cats", type: "categories", name: "Categories", backgroundColor: "#fff", components: [
          { id: "c_cats", type: "category_pills", props: { categories: ["All", "Snacks", "Drinks", "Household"] } },
        ] },
      ] },
      screen_shop: { name: "Shop", backgroundColor: "#fff", bodySections: [
        { id: "sec_grid", type: "product_grid", name: "Products", backgroundColor: "#fff", components: [
          { id: "c_grid", type: "menu_grid", props: { columns: 2 } },
        ] },
      ] },
      screen_express: { name: "Express", backgroundColor: "#fff", bodySections: [
        { id: "sec_express", type: "info", name: "Express Delivery", backgroundColor: "#fff", components: [
          { id: "c_etitle", type: "text_block", props: { text: "Express Delivery", fontSize: 24, fontWeight: 700, color: "#1C1B1D", alignment: "left" } },
          { id: "c_edesc", type: "text_block", props: { text: "Fast delivery right to your doorstep.", fontSize: 14, fontWeight: 400, color: "#6B7280", alignment: "left" } },
        ] },
      ] },
    },
  },
  "Family Mart": {
    meta: { appName: "Family Mart", category: "Grocery", primaryColor: "#1565C0", secondaryColor: "#E3F2FD" },
    navigation: { initialScreen: "screen_home", tabs: [{ label: "Shop", screenId: "screen_shop" }, { label: "Loyalty", screenId: "screen_loyalty" }] },
    shared: {
      header: { id: "section_header", type: "header", name: "Header", backgroundColor: "#E3F2FD", components: [{ id: "h_logo", type: "header_bar", props: { logo: null, appName: "Family Mart" } }] },
      footer: { id: "section_footer", type: "footer", name: "Footer", backgroundColor: "#1565C0", components: [{ id: "f_text", type: "text_block", props: { text: "\u00A9 2024 Family Mart. Your neighborhood store.", fontSize: 12, fontWeight: 400, color: "#fff", alignment: "center" } }] },
    },
    screens: {
      screen_home: { name: "Home", backgroundColor: "#E3F2FD", bodySections: [
        { id: "sec_hero", type: "hero", name: "Hero Banner", backgroundColor: "#1565C0", components: [{ id: "c_hero", type: "hero_banner", props: { title: "Family Mart", subtitle: "Your neighborhood grocery store", badge: "Shop Weekly Specials", color: "#1565C0" } }] },
        { id: "sec_cats", type: "categories", name: "Shop by Aisle", backgroundColor: "#fff", components: [
          { id: "c_cats", type: "category_pills", props: { categories: ["All", "Bakery", "Dairy", "Frozen"] } },
        ] },
      ] },
      screen_shop: { name: "Shop", backgroundColor: "#fff", bodySections: [
        { id: "sec_grid", type: "product_grid", name: "Products", backgroundColor: "#fff", components: [
          { id: "c_grid", type: "menu_grid", props: { columns: 2 } },
        ] },
      ] },
      screen_loyalty: { name: "Loyalty", backgroundColor: "#fff", bodySections: [
        { id: "sec_loyalty", type: "plans", name: "Loyalty Program", backgroundColor: "#fff", components: [
          { id: "c_ltitle", type: "text_block", props: { text: "Family Mart Rewards", fontSize: 24, fontWeight: 700, color: "#1C1B1D", alignment: "left" } },
          { id: "c_ldesc", type: "text_block", props: { text: "Earn points with every purchase.", fontSize: 14, fontWeight: 400, color: "#6B7280", alignment: "left" } },
        ] },
      ] },
    },
  },
  Grace: {
    meta: { appName: "Grace", category: "Church", primaryColor: "#1A237E", secondaryColor: "#E8EAF6" },
    navigation: { initialScreen: "screen_home", tabs: [{ label: "Events", screenId: "screen_events" }, { label: "Give", screenId: "screen_giving" }] },
    shared: {
      header: { id: "section_header", type: "header", name: "Header", backgroundColor: "#E8EAF6", components: [{ id: "h_logo", type: "header_bar", props: { logo: null, appName: "Grace Church" } }] },
      footer: { id: "section_footer", type: "footer", name: "Footer", backgroundColor: "#1A237E", components: [{ id: "f_text", type: "text_block", props: { text: "\u00A9 2024 Grace Church. Walk in faith.", fontSize: 12, fontWeight: 400, color: "#fff", alignment: "center" } }] },
    },
    screens: {
      screen_home: { name: "Home", backgroundColor: "#E8EAF6", bodySections: [
        { id: "sec_hero", type: "hero", name: "Hero Banner", backgroundColor: "#1A237E", components: [{ id: "c_hero", type: "hero_banner", props: { title: "Grace Church", subtitle: "Walking in faith, together", badge: "Join Us This Sunday", color: "#1A237E" } }] },
        { id: "sec_events", type: "programs", name: "Upcoming Events", backgroundColor: "#fff", components: [
          { id: "c_ehead", type: "text_block", props: { text: "Upcoming Events", fontSize: 18, fontWeight: 700, color: "#1C1B1D", alignment: "left" } },
        ] },
      ] },
      screen_events: { name: "Events", backgroundColor: "#fff", bodySections: [
        { id: "sec_eventslist", type: "service_list", name: "All Events", backgroundColor: "#fff", components: [
          { id: "c_etitle", type: "text_block", props: { text: "Church Events", fontSize: 24, fontWeight: 700, color: "#1C1B1D", alignment: "left" } },
        ] },
      ] },
      screen_giving: { name: "Give", backgroundColor: "#fff", bodySections: [
        { id: "sec_giving", type: "info", name: "Giving", backgroundColor: "#fff", components: [
          { id: "c_gtitle", type: "text_block", props: { text: "Give Generously", fontSize: 24, fontWeight: 700, color: "#1C1B1D", alignment: "left" } },
          { id: "c_gdesc", type: "text_block", props: { text: "Your support helps us serve the community.", fontSize: 14, fontWeight: 400, color: "#6B7280", alignment: "left" } },
          { id: "c_gbtn", type: "button", props: { label: "Give Now", background: "#1A237E", color: "#fff", borderRadius: 12 } },
        ] },
      ] },
    },
  },
  Vibrant: {
    meta: { appName: "Vibrant Church", category: "Church", primaryColor: "#E65100", secondaryColor: "#FFF3E0" },
    navigation: { initialScreen: "screen_home", tabs: [{ label: "Media", screenId: "screen_media" }, { label: "Give", screenId: "screen_giving" }] },
    shared: {
      header: { id: "section_header", type: "header", name: "Header", backgroundColor: "#FFF3E0", components: [{ id: "h_logo", type: "header_bar", props: { logo: null, appName: "Vibrant Church" } }] },
      footer: { id: "section_footer", type: "footer", name: "Footer", backgroundColor: "#E65100", components: [{ id: "f_text", type: "text_block", props: { text: "\u00A9 2024 Vibrant Church. Alive in faith.", fontSize: 12, fontWeight: 400, color: "#fff", alignment: "center" } }] },
    },
    screens: {
      screen_home: { name: "Home", backgroundColor: "#FFF3E0", bodySections: [
        { id: "sec_hero", type: "hero", name: "Hero Banner", backgroundColor: "#E65100", components: [{ id: "c_hero", type: "hero_banner", props: { title: "Vibrant Church", subtitle: "Modern worship, timeless truth", badge: "Watch Live", color: "#E65100" } }] },
        { id: "sec_media", type: "programs", name: "Latest Sermons", backgroundColor: "#fff", components: [
          { id: "c_mhead", type: "text_block", props: { text: "Latest Sermons", fontSize: 18, fontWeight: 700, color: "#1C1B1D", alignment: "left" } },
        ] },
      ] },
      screen_media: { name: "Media", backgroundColor: "#fff", bodySections: [
        { id: "sec_medialist", type: "service_list", name: "Sermons & Media", backgroundColor: "#fff", components: [
          { id: "c_mtitle", type: "text_block", props: { text: "Sermons & Media", fontSize: 24, fontWeight: 700, color: "#1C1B1D", alignment: "left" } },
        ] },
      ] },
      screen_giving: { name: "Give", backgroundColor: "#fff", bodySections: [
        { id: "sec_giving", type: "info", name: "Giving", backgroundColor: "#fff", components: [
          { id: "c_gtitle", type: "text_block", props: { text: "Support Our Ministry", fontSize: 24, fontWeight: 700, color: "#1C1B1D", alignment: "left" } },
          { id: "c_gdesc", type: "text_block", props: { text: "Every gift helps us reach more people.", fontSize: 14, fontWeight: 400, color: "#6B7280", alignment: "left" } },
          { id: "c_gbtn", type: "button", props: { label: "Give Online", background: "#E65100", color: "#fff", borderRadius: 12 } },
        ] },
      ] },
    },
  },
  Community: {
    meta: { appName: "Community Church", category: "Church", primaryColor: "#2E7D32", secondaryColor: "#E8F5E9" },
    navigation: { initialScreen: "screen_home", tabs: [{ label: "Prayer", screenId: "screen_prayer" }, { label: "Groups", screenId: "screen_groups" }] },
    shared: {
      header: { id: "section_header", type: "header", name: "Header", backgroundColor: "#E8F5E9", components: [{ id: "h_logo", type: "header_bar", props: { logo: null, appName: "Community Church" } }] },
      footer: { id: "section_footer", type: "footer", name: "Footer", backgroundColor: "#2E7D32", components: [{ id: "f_text", type: "text_block", props: { text: "\u00A9 2024 Community Church. Love God, love people.", fontSize: 12, fontWeight: 400, color: "#fff", alignment: "center" } }] },
    },
    screens: {
      screen_home: { name: "Home", backgroundColor: "#E8F5E9", bodySections: [
        { id: "sec_hero", type: "hero", name: "Hero Banner", backgroundColor: "#2E7D32", components: [{ id: "c_hero", type: "hero_banner", props: { title: "Community Church", subtitle: "Love God, love people", badge: "Find Your Group", color: "#2E7D32" } }] },
        { id: "sec_groups", type: "programs", name: "Small Groups", backgroundColor: "#fff", components: [
          { id: "c_ghead", type: "text_block", props: { text: "Join a Small Group", fontSize: 18, fontWeight: 700, color: "#1C1B1D", alignment: "left" } },
        ] },
      ] },
      screen_prayer: { name: "Prayer", backgroundColor: "#fff", bodySections: [
        { id: "sec_prayer", type: "info", name: "Prayer Requests", backgroundColor: "#fff", components: [
          { id: "c_ptitle", type: "text_block", props: { text: "Prayer Requests", fontSize: 24, fontWeight: 700, color: "#1C1B1D", alignment: "left" } },
          { id: "c_pdesc", type: "text_block", props: { text: "Share your prayer requests with our community.", fontSize: 14, fontWeight: 400, color: "#6B7280", alignment: "left" } },
        ] },
      ] },
      screen_groups: { name: "Groups", backgroundColor: "#fff", bodySections: [
        { id: "sec_groupslist", type: "service_list", name: "Small Groups", backgroundColor: "#fff", components: [
          { id: "c_gtitle", type: "text_block", props: { text: "Small Groups", fontSize: 24, fontWeight: 700, color: "#1C1B1D", alignment: "left" } },
        ] },
      ] },
    },
  },
  Academy: {
    meta: { appName: "Academy", category: "School", primaryColor: "#283593", secondaryColor: "#E8EAF6" },
    navigation: { initialScreen: "screen_home", tabs: [{ label: "Timetable", screenId: "screen_timetable" }, { label: "Fees", screenId: "screen_fees" }] },
    shared: {
      header: { id: "section_header", type: "header", name: "Header", backgroundColor: "#E8EAF6", components: [{ id: "h_logo", type: "header_bar", props: { logo: null, appName: "Academy" } }] },
      footer: { id: "section_footer", type: "footer", name: "Footer", backgroundColor: "#283593", components: [{ id: "f_text", type: "text_block", props: { text: "\u00A9 2024 Academy. Excellence in education.", fontSize: 12, fontWeight: 400, color: "#fff", alignment: "center" } }] },
    },
    screens: {
      screen_home: { name: "Home", backgroundColor: "#E8EAF6", bodySections: [
        { id: "sec_hero", type: "hero", name: "Hero Banner", backgroundColor: "#283593", components: [{ id: "c_hero", type: "hero_banner", props: { title: "Academy", subtitle: "Excellence in education", badge: "Enroll Now", color: "#283593" } }] },
        { id: "sec_announcements", type: "info", name: "Announcements", backgroundColor: "#fff", components: [
          { id: "c_ahead", type: "text_block", props: { text: "Announcements", fontSize: 18, fontWeight: 700, color: "#1C1B1D", alignment: "left" } },
          { id: "c_adesc", type: "text_block", props: { text: "Term 2 begins January 15. Enrollment is open.", fontSize: 14, fontWeight: 400, color: "#6B7280", alignment: "left" } },
        ] },
      ] },
      screen_timetable: { name: "Timetable", backgroundColor: "#fff", bodySections: [
        { id: "sec_timetable", type: "plans", name: "Class Schedule", backgroundColor: "#fff", components: [
          { id: "c_ttitle", type: "text_block", props: { text: "Class Schedule", fontSize: 24, fontWeight: 700, color: "#1C1B1D", alignment: "left" } },
        ] },
      ] },
      screen_fees: { name: "Fees", backgroundColor: "#fff", bodySections: [
        { id: "sec_fees", type: "info", name: "Fee Structure", backgroundColor: "#fff", components: [
          { id: "c_ftitle", type: "text_block", props: { text: "Fee Structure", fontSize: 24, fontWeight: 700, color: "#1C1B1D", alignment: "left" } },
          { id: "c_fdesc", type: "text_block", props: { text: "View and pay fees online.", fontSize: 14, fontWeight: 400, color: "#6B7280", alignment: "left" } },
          { id: "c_fbtn", type: "button", props: { label: "Pay Fees", background: "#283593", color: "#fff", borderRadius: 12 } },
        ] },
      ] },
    },
  },
  "Bright Minds": {
    meta: { appName: "Bright Minds", category: "School", primaryColor: "#FF6F00", secondaryColor: "#FFF8E1" },
    navigation: { initialScreen: "screen_home", tabs: [{ label: "Events", screenId: "screen_events" }, { label: "Parents", screenId: "screen_parents" }] },
    shared: {
      header: { id: "section_header", type: "header", name: "Header", backgroundColor: "#FFF8E1", components: [{ id: "h_logo", type: "header_bar", props: { logo: null, appName: "Bright Minds" } }] },
      footer: { id: "section_footer", type: "footer", name: "Footer", backgroundColor: "#FF6F00", components: [{ id: "f_text", type: "text_block", props: { text: "\u00A9 2024 Bright Minds. Nurturing potential.", fontSize: 12, fontWeight: 400, color: "#fff", alignment: "center" } }] },
    },
    screens: {
      screen_home: { name: "Home", backgroundColor: "#FFF8E1", bodySections: [
        { id: "sec_hero", type: "hero", name: "Hero Banner", backgroundColor: "#FF6F00", components: [{ id: "c_hero", type: "hero_banner", props: { title: "Bright Minds", subtitle: "Where curiosity meets discovery", badge: "Upcoming Events", color: "#FF6F00" } }] },
        { id: "sec_events", type: "programs", name: "School Events", backgroundColor: "#fff", components: [
          { id: "c_ehead", type: "text_block", props: { text: "Upcoming Events", fontSize: 18, fontWeight: 700, color: "#1C1B1D", alignment: "left" } },
        ] },
      ] },
      screen_events: { name: "Events", backgroundColor: "#fff", bodySections: [
        { id: "sec_eventslist", type: "service_list", name: "All Events", backgroundColor: "#fff", components: [
          { id: "c_etitle", type: "text_block", props: { text: "School Events", fontSize: 24, fontWeight: 700, color: "#1C1B1D", alignment: "left" } },
        ] },
      ] },
      screen_parents: { name: "Parents", backgroundColor: "#fff", bodySections: [
        { id: "sec_parents", type: "info", name: "Parent Communication", backgroundColor: "#fff", components: [
          { id: "c_ptitle", type: "text_block", props: { text: "Parent Portal", fontSize: 24, fontWeight: 700, color: "#1C1B1D", alignment: "left" } },
          { id: "c_pdesc", type: "text_block", props: { text: "Stay connected with your child's education.", fontSize: 14, fontWeight: 400, color: "#6B7280", alignment: "left" } },
        ] },
      ] },
    },
  },
  Heritage: {
    meta: { appName: "Heritage School", category: "School", primaryColor: "#4E342E", secondaryColor: "#EFEBE9" },
    navigation: { initialScreen: "screen_home", tabs: [{ label: "Library", screenId: "screen_library" }, { label: "Assignments", screenId: "screen_assignments" }] },
    shared: {
      header: { id: "section_header", type: "header", name: "Header", backgroundColor: "#EFEBE9", components: [{ id: "h_logo", type: "header_bar", props: { logo: null, appName: "Heritage School" } }] },
      footer: { id: "section_footer", type: "footer", name: "Footer", backgroundColor: "#4E342E", components: [{ id: "f_text", type: "text_block", props: { text: "\u00A9 2024 Heritage School. Building tomorrow's leaders.", fontSize: 12, fontWeight: 400, color: "#fff", alignment: "center" } }] },
    },
    screens: {
      screen_home: { name: "Home", backgroundColor: "#EFEBE9", bodySections: [
        { id: "sec_hero", type: "hero", name: "Hero Banner", backgroundColor: "#4E342E", components: [{ id: "c_hero", type: "hero_banner", props: { title: "Heritage School", subtitle: "Building tomorrow's leaders", badge: "Apply Now", color: "#4E342E" } }] },
        { id: "sec_announcements", type: "info", name: "School News", backgroundColor: "#fff", components: [
          { id: "c_ahead", type: "text_block", props: { text: "School News", fontSize: 18, fontWeight: 700, color: "#1C1B1D", alignment: "left" } },
          { id: "c_adesc", type: "text_block", props: { text: "Science fair winners announced. Congratulations!", fontSize: 14, fontWeight: 400, color: "#6B7280", alignment: "left" } },
        ] },
      ] },
      screen_library: { name: "Library", backgroundColor: "#fff", bodySections: [
        { id: "sec_library", type: "service_list", name: "Library Resources", backgroundColor: "#fff", components: [
          { id: "c_ltitle", type: "text_block", props: { text: "Library Resources", fontSize: 24, fontWeight: 700, color: "#1C1B1D", alignment: "left" } },
        ] },
      ] },
      screen_assignments: { name: "Assignments", backgroundColor: "#fff", bodySections: [
        { id: "sec_assignments", type: "plans", name: "Assignments", backgroundColor: "#fff", components: [
          { id: "c_atitle", type: "text_block", props: { text: "Assignments & Homework", fontSize: 24, fontWeight: 700, color: "#1C1B1D", alignment: "left" } },
          { id: "c_adesc", type: "text_block", props: { text: "Track and submit assignments online.", fontSize: 14, fontWeight: 400, color: "#6B7280", alignment: "left" } },
        ] },
      ] },
    },
  },
  Appointments: {
    meta: { appName: "Appointments", category: "Booking", primaryColor: "#0D9488", secondaryColor: "#E8F5F4" },
    navigation: { initialScreen: "screen_home", tabs: [{ label: "Services", screenId: "screen_services" }, { label: "Book", screenId: "screen_booking" }] },
    shared: {
      header: { id: "section_header", type: "header", name: "Header", backgroundColor: "#E8F5F4", components: [{ id: "h_logo", type: "header_bar", props: { logo: null, appName: "Appointments" } }] },
      footer: { id: "section_footer", type: "footer", name: "Footer", backgroundColor: "#0D9488", components: [{ id: "f_text", type: "text_block", props: { text: "\u00A9 2024 Appointments. Book with ease.", fontSize: 12, fontWeight: 400, color: "#fff", alignment: "center" } }] },
    },
    screens: {
      screen_home: { name: "Home", backgroundColor: "#E8F5F4", bodySections: [
        { id: "sec_hero", type: "hero", name: "Hero Banner", backgroundColor: "#0D9488", components: [{ id: "c_hero", type: "hero_banner", props: { title: "Appointments", subtitle: "Book services in seconds", badge: "Book Now", color: "#0D9488" } }] },
        { id: "sec_services", type: "service_list", name: "Popular Services", backgroundColor: "#fff", components: [
          { id: "c_shead", type: "text_block", props: { text: "Popular Services", fontSize: 18, fontWeight: 700, color: "#1C1B1D", alignment: "left" } },
          { id: "c_s1", type: "menu_item", props: { name: "Standard Appointment", price: "$49", desc: "30 min session", emoji: "\uD83D\uDCC5" } },
          { id: "c_s2", type: "menu_item", props: { name: "Extended Session", price: "$89", desc: "60 min session", emoji: "\u23F0" } },
        ] },
      ] },
      screen_services: { name: "Services", backgroundColor: "#fff", bodySections: [
        { id: "sec_servicelist", type: "service_list", name: "All Services", backgroundColor: "#fff", components: [
          { id: "c_stitle", type: "text_block", props: { text: "All Services", fontSize: 24, fontWeight: 700, color: "#1C1B1D", alignment: "left" } },
        ] },
      ] },
      screen_booking: { name: "Book", backgroundColor: "#fff", bodySections: [
        { id: "sec_booking", type: "info", name: "Book Appointment", backgroundColor: "#fff", components: [
          { id: "c_btitle", type: "text_block", props: { text: "Book an Appointment", fontSize: 24, fontWeight: 700, color: "#1C1B1D", alignment: "left" } },
          { id: "c_bdesc", type: "text_block", props: { text: "Select your preferred date and time.", fontSize: 14, fontWeight: 400, color: "#6B7280", alignment: "left" } },
          { id: "c_bbtn", type: "button", props: { label: "Schedule Now", background: "#0D9488", color: "#fff", borderRadius: 12 } },
        ] },
      ] },
    },
  },
  Premium: {
    meta: { appName: "Premium", category: "Booking", primaryColor: "#7C3AED", secondaryColor: "#F3E8FF" },
    navigation: { initialScreen: "screen_home", tabs: [{ label: "Services", screenId: "screen_services" }, { label: "Reviews", screenId: "screen_reviews" }] },
    shared: {
      header: { id: "section_header", type: "header", name: "Header", backgroundColor: "#F3E8FF", components: [{ id: "h_logo", type: "header_bar", props: { logo: null, appName: "Premium" } }] },
      footer: { id: "section_footer", type: "footer", name: "Footer", backgroundColor: "#7C3AED", components: [{ id: "f_text", type: "text_block", props: { text: "\u00A9 2024 Premium. Luxury service.", fontSize: 12, fontWeight: 400, color: "#fff", alignment: "center" } }] },
    },
    screens: {
      screen_home: { name: "Home", backgroundColor: "#F3E8FF", bodySections: [
        { id: "sec_hero", type: "hero", name: "Hero Banner", backgroundColor: "#7C3AED", components: [{ id: "c_hero", type: "hero_banner", props: { title: "Premium", subtitle: "Luxury services at your fingertips", badge: "Book Now", color: "#7C3AED" } }] },
        { id: "sec_services", type: "service_list", name: "Premium Services", backgroundColor: "#fff", components: [
          { id: "c_shead", type: "text_block", props: { text: "Premium Services", fontSize: 18, fontWeight: 700, color: "#1C1B1D", alignment: "left" } },
          { id: "c_s1", type: "menu_item", props: { name: "VIP Consultation", price: "$149", desc: "Personalized premium session", emoji: "\uD83D\uDC51" } },
        ] },
      ] },
      screen_services: { name: "Services", backgroundColor: "#fff", bodySections: [
        { id: "sec_servicelist", type: "service_list", name: "All Services", backgroundColor: "#fff", components: [
          { id: "c_stitle", type: "text_block", props: { text: "Our Services", fontSize: 24, fontWeight: 700, color: "#1C1B1D", alignment: "left" } },
        ] },
      ] },
      screen_reviews: { name: "Reviews", backgroundColor: "#fff", bodySections: [
        { id: "sec_reviews", type: "info", name: "Client Reviews", backgroundColor: "#fff", components: [
          { id: "c_rtitle", type: "text_block", props: { text: "Client Reviews", fontSize: 24, fontWeight: 700, color: "#1C1B1D", alignment: "left" } },
          { id: "c_rdesc", type: "text_block", props: { text: "See what our clients say about us.", fontSize: 14, fontWeight: 400, color: "#6B7280", alignment: "left" } },
        ] },
      ] },
    },
  },
  Express: {
    meta: { appName: "Express", category: "Booking", primaryColor: "#EA580C", secondaryColor: "#FFF3E0" },
    navigation: { initialScreen: "screen_home", tabs: [{ label: "Services", screenId: "screen_services" }, { label: "Book", screenId: "screen_booking" }] },
    shared: {
      header: { id: "section_header", type: "header", name: "Header", backgroundColor: "#FFF3E0", components: [{ id: "h_logo", type: "header_bar", props: { logo: null, appName: "Express" } }] },
      footer: { id: "section_footer", type: "footer", name: "Footer", backgroundColor: "#EA580C", components: [{ id: "f_text", type: "text_block", props: { text: "\u00A9 2024 Express. Fast booking, every time.", fontSize: 12, fontWeight: 400, color: "#fff", alignment: "center" } }] },
    },
    screens: {
      screen_home: { name: "Home", backgroundColor: "#FFF3E0", bodySections: [
        { id: "sec_hero", type: "hero", name: "Hero Banner", backgroundColor: "#EA580C", components: [{ id: "c_hero", type: "hero_banner", props: { title: "Express", subtitle: "Quick and easy booking", badge: "Book in Seconds", color: "#EA580C" } }] },
        { id: "sec_services", type: "service_list", name: "Quick Services", backgroundColor: "#fff", components: [
          { id: "c_shead", type: "text_block", props: { text: "Quick Services", fontSize: 18, fontWeight: 700, color: "#1C1B1D", alignment: "left" } },
          { id: "c_s1", type: "menu_item", props: { name: "Express Session", price: "$29", desc: "15 min quick session", emoji: "\u26A1" } },
          { id: "c_s2", type: "menu_item", props: { name: "Standard", price: "$59", desc: "30 min standard", emoji: "\uD83D\uDCC5" } },
        ] },
      ] },
      screen_services: { name: "Services", backgroundColor: "#fff", bodySections: [
        { id: "sec_servicelist", type: "service_list", name: "All Services", backgroundColor: "#fff", components: [
          { id: "c_stitle", type: "text_block", props: { text: "All Services", fontSize: 24, fontWeight: 700, color: "#1C1B1D", alignment: "left" } },
        ] },
      ] },
      screen_booking: { name: "Book", backgroundColor: "#fff", bodySections: [
        { id: "sec_booking", type: "info", name: "Quick Book", backgroundColor: "#fff", components: [
          { id: "c_btitle", type: "text_block", props: { text: "Quick Booking", fontSize: 24, fontWeight: 700, color: "#1C1B1D", alignment: "left" } },
          { id: "c_bdesc", type: "text_block", props: { text: "Book in under 30 seconds.", fontSize: 14, fontWeight: 400, color: "#6B7280", alignment: "left" } },
          { id: "c_bbtn", type: "button", props: { label: "Book Now", background: "#EA580C", color: "#fff", borderRadius: 12 } },
        ] },
      ] },
    },
  },
  Custom: {
    meta: { appName: "My App", category: "Custom", primaryColor: "#1A1A2E", secondaryColor: "#E8E8F0" },
    navigation: { initialScreen: "screen_home", tabs: [] },
    shared: {
      header: { id: "section_header", type: "header", name: "Header", backgroundColor: "#FCF8FA", components: [{ id: "h_logo", type: "header_bar", props: { logo: null, appName: "My App" } }] },
      footer: { id: "section_footer", type: "footer", name: "Footer", backgroundColor: "#FCF8FA", components: [] },
    },
    screens: {
      screen_home: { name: "Home", backgroundColor: "#FCF8FA", bodySections: [] },
    },
  },
};

export default templateDefaults;
