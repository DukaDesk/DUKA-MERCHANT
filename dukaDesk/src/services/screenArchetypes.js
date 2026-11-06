/* Canonical screen archetypes and implicit commerce behaviour.
 *
 * A published screen may carry `archetype`; when it does the compiler attaches
 * the canonical roles/bindings/default actions below so template pages work
 * without the merchant wiring every button. Authored actions always win; this
 * table only fills the gaps.
 *
 * Keep in sync with:
 *   - DUKA-BACKEND/src/shared/compatibility/runtime-contract.ts
 *   - DukaDesk/src/runtime/archetypes.ts
 */

export const SCREEN_ARCHETYPES = [
  "catalog",
  "product_detail",
  "cart",
  "checkout",
  "orders",
  "order_detail",
  "profile",
  "content",
];

export const COMPONENT_ROLES = [
  "select_product",
  "add_to_cart",
  "remove_from_cart",
  "go_checkout",
  "place_order",
  "select_order",
  "view_cart",
  "contact",
];

export const DATA_BINDINGS = [
  "commerce.products",
  "commerce.product",
  "commerce.cart",
  "commerce.orders",
  "commerce.order",
  "commerce.categories",
];

/** Commerce screens every storefront needs to complete a sale. */
export const REQUIRED_COMMERCE_ARCHETYPES = [
  "catalog",
  "product_detail",
  "cart",
  "checkout",
  "orders",
  "order_detail",
];

const ARCHETYPE_MATCHERS = [
  {
    archetype: "product_detail",
    patterns: [/product[-_ ]?detail/, /item[-_ ]?detail/, /^product$/, /^item$/, /product[-_ ]?(page|screen)$/],
  },
  {
    archetype: "order_detail",
    patterns: [/order[-_ ]?detail/, /order[-_ ]?view/, /^order$/],
  },
  {
    archetype: "checkout",
    patterns: [/check[-_ ]?out/, /^payment$/, /place[-_ ]?order/],
  },
  {
    archetype: "cart",
    patterns: [/^cart$/, /cart[-_ ]?(screen|page|review|summary)$/, /basket/],
  },
  {
    archetype: "orders",
    patterns: [/^orders?$/, /order[-_ ]?(history|list)/, /my[-_ ]?orders/],
  },
  {
    archetype: "catalog",
    patterns: [/^shop$/, /catalog/, /^menu$/, /menu[-_ ]?(screen|page)/, /storefront/, /products?$/],
  },
  {
    archetype: "profile",
    patterns: [/^profile$/, /^account$/, /settings/, /^me$/],
  },
];

const BINDING_BY_COMPONENT = {
  menu_grid: "commerce.products",
  product_grid: "commerce.products",
  ProductGrid: "commerce.products",
  CategoryGrid: "commerce.products",
  product_carousel: "commerce.products",
  ProductCarousel: "commerce.products",
  category_pills: "commerce.categories",
  cart_content: "commerce.cart",
  cart_summary: "commerce.cart",
  order_history: "commerce.orders",
  order_detail: "commerce.order",
  orders_list: "commerce.orders",
  product_detail: "commerce.product",
  product_info: "commerce.product",
};

const DYNAMIC_PRODUCT_COMPONENTS = new Set([
  "menu_grid",
  "product_grid",
  "ProductGrid",
  "CategoryGrid",
  "product_card",
  "dynamic_card",
  "menu_item",
]);

const CART_COMPONENTS = new Set(["cart_content", "cart_summary"]);
const ORDER_LIST_COMPONENTS = new Set(["order_history", "orders_list"]);

function matchesAny(value, patterns) {
  const text = String(value || "").toLowerCase();
  return patterns.some(pattern => pattern.test(text));
}

/**
 * Resolve a screen archetype. Explicit metadata wins; otherwise infer from the
 * screen id/name. Returns null for non-semantic screens (legacy behaviour).
 */
export function inferScreenArchetype(screenId, screen = {}) {
  const explicit = screen?.archetype || screen?.pageType || screen?.screenType;
  if (explicit && SCREEN_ARCHETYPES.includes(explicit)) return explicit;
  if (explicit) return null;
  const candidates = [screenId, screen?.name, screen?.title, screen?.route, screen?.slug].filter(Boolean);
  for (const candidate of candidates) {
    for (const matcher of ARCHETYPE_MATCHERS) {
      if (matchesAny(candidate, matcher.patterns)) return matcher.archetype;
    }
  }
  return null;
}

export function isCommerceArchetype(archetype) {
  return REQUIRED_COMMERCE_ARCHETYPES.includes(archetype);
}

/** Legacy route strings that should resolve to a given archetype. */
export function archetypeRouteAliases(archetype) {
  switch (archetype) {
    case "catalog": return ["/shop", "/menu", "/products", "/catalog", "/product"];
    case "product_detail": return ["/product", "/product-detail", "/item-detail", "/products/:id", "/product/:id"];
    case "cart": return ["/cart", "/basket"];
    case "checkout": return ["/checkout", "/payment", "/place-order"];
    case "orders": return ["/orders", "/my-orders", "/order-history"];
    case "order_detail": return ["/order-detail", "/order", "/orders/:id"];
    case "profile": return ["/profile", "/account", "/settings"];
    default: return [];
  }
}

/** Canonical data binding for a node, derived from its type + screen archetype. */
export function defaultBindingForNode(node, archetype) {
  const type = node?.type;
  if (!type) return null;
  if (BINDING_BY_COMPONENT[type]) return { source: BINDING_BY_COMPONENT[type] };
  if (archetype === "product_detail" && ["image", "heading", "price_label", "quantity_selector", "text_block"].includes(type)) {
    return { source: "commerce.product" };
  }
  return null;
}

/** Canonical role for a node, derived from its type + screen archetype. */
export function defaultRoleForNode(node, archetype) {
  if (node?.role && COMPONENT_ROLES.includes(node.role)) return node.role;
  const type = node?.type;
  const label = String(node?.props?.label || node?.props?.text || node?.props?.title || "").toLowerCase();
  if (DYNAMIC_PRODUCT_COMPONENTS.has(type)) {
    if (label.includes("add") || label.includes("cart")) return "add_to_cart";
    if (archetype === "product_detail") return "add_to_cart";
    return "select_product";
  }
  if (CART_COMPONENTS.has(type)) return archetype === "checkout" ? "place_order" : "go_checkout";
  if (ORDER_LIST_COMPONENTS.has(type)) return "select_order";
  if (type === "order_detail") return "view_cart";
  if (["button", "primary_button", "secondary_button", "link", "icon_button"].includes(type)) {
    if (archetype === "checkout" || /place order|pay|confirm order/.test(label)) return "place_order";
    if (archetype === "cart" || /checkout|continue/.test(label)) return "go_checkout";
    if (archetype === "product_detail" || /add to cart|add item|buy/.test(label)) return "add_to_cart";
    if (/view cart|go to cart|basket/.test(label)) return "view_cart";
    if (/remove|delete/.test(label)) return "remove_from_cart";
    if (/contact|call|message|whatsapp/.test(label)) return "contact";
  }
  if (/remove|delete/.test(label)) return "remove_from_cart";
  if (/add to cart|add item|buy now/.test(label)) return "add_to_cart";
  return null;
}

/**
 * Default events for a node. Shape matches the runtime ActionDef.
 * Authored actions are merged on top by the compiler.
 */
export function defaultActionsForNode(node, archetype) {
  const type = node?.type;
  const actions = {};
  if (DYNAMIC_PRODUCT_COMPONENTS.has(type)) {
    actions.addItem = { type: "add_to_cart" };
    actions.viewDetails = { type: "view_item" };
    actions.default = { type: "view_item" };
  } else if (CART_COMPONENTS.has(type)) {
    actions.addItem = { type: "add_to_cart" };
    actions.removeItem = { type: "remove_from_cart" };
    actions.checkout = { type: archetype === "checkout" ? "place_order" : "go_checkout" };
  } else if (ORDER_LIST_COMPONENTS.has(type)) {
    actions.selectOrder = { type: "select_order" };
    actions.viewOrder = { type: "select_order" };
  } else if (type === "order_detail") {
    actions.default = { type: "view_cart" };
  } else if (["button", "primary_button", "secondary_button", "link", "icon_button"].includes(type)) {
    const role = defaultRoleForNode(node, archetype);
    if (role === "add_to_cart") actions.default = { type: "add_to_cart" };
    else if (role === "remove_from_cart") actions.default = { type: "remove_from_cart" };
    else if (role === "go_checkout") actions.default = { type: "go_checkout" };
    else if (role === "place_order") actions.default = { type: "place_order" };
    else if (role === "view_cart") actions.default = { type: "switch_screen", payload: { target: "cart" } };
    else if (role === "select_order") actions.default = { type: "select_order" };
  }
  return actions;
}

/**
 * Apply archetype metadata to a compiled screen's nodes. Mutates copies only;
 * authored actions/roles/bindings are always preserved.
 */
export function applyArchetypeDefaults(nodes, archetype) {
  return (nodes || []).map(node => {
    const copy = { ...node, props: { ...(node.props || {}) } };
    if (!copy.role) {
      const role = defaultRoleForNode(copy, archetype);
      if (role) copy.role = role;
    }
    if (!copy.binding) {
      const binding = defaultBindingForNode(copy, archetype);
      if (binding) copy.binding = binding;
    }
    const defaults = defaultActionsForNode(copy, archetype);
    if (Object.keys(defaults).length) {
      copy.actions = { ...defaults, ...(copy.actions || {}), ...(copy.props?.actions || {}) };
    }
    if (copy.children) copy.children = applyArchetypeDefaults(copy.children, archetype);
    if (copy.layout) copy.layout = { ...copy.layout, children: applyArchetypeDefaults(copy.layout.children, archetype) };
    return copy;
  });
}

export function missingCommerceArchetypes(archetypes) {
  const present = new Set((archetypes || []).filter(Boolean));
  return REQUIRED_COMMERCE_ARCHETYPES.filter(archetype => !present.has(archetype));
}
