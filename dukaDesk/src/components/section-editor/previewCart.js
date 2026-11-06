/* Preview shopping cart helpers.
 *
 * The builder preview runs without the mobile cart store, so it keeps a small
 * in-memory cart keyed by product id. Lines carry a snapshot (name/price/image)
 * so the preview totals survive catalog or design edits while reviewing.
 */

export function parseCartPrice(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value !== "string") return 0;
  const cleaned = value.replace(/[^\d.-]/g, "");
  const price = Number(cleaned);
  return Number.isFinite(price) ? price : 0;
}

export function cartLineId(item) {
  if (!item || typeof item !== "object") return "";
  const id = item.id ?? item.productId ?? item.name ?? item.title;
  if (id == null) return "";
  return String(id).trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function normalizeCartLine(item) {
  const id = cartLineId(item);
  if (!id) return null;
  const hasDetails = item.name || item.title || item.price != null;
  if (!hasDetails) return null;
  return {
    id,
    name: item.name || item.title || "Item",
    price: parseCartPrice(item.price),
    img: item.image || item.img || item.emoji || "",
  };
}

export function addCartItem(cart, item, qty = 1) {
  const id = cartLineId(item);
  const amount = Number(qty) > 0 ? Number(qty) : 1;
  if (!id) return cart;
  const existing = cart?.[id];
  if (existing) {
    return { ...cart, [id]: { ...existing, qty: (existing.qty || 0) + amount } };
  }
  const line = normalizeCartLine(item);
  if (!line) return cart;
  return { ...cart, [id]: { ...line, qty: amount } };
}

export function removeCartItem(cart, id) {
  const key = id == null ? "" : String(id);
  const line = cart?.[key];
  if (!line) return cart;
  if ((line.qty || 0) <= 1) {
    const next = { ...cart };
    delete next[key];
    return next;
  }
  return { ...cart, [key]: { ...line, qty: line.qty - 1 } };
}

export function cartItems(cart) {
  return Object.values(cart || {})
    .filter(line => (line?.qty || 0) > 0)
    .map(line => ({
      id: line.id,
      name: line.name,
      price: Number(line.price) || 0,
      qty: line.qty,
      img: line.img || "",
    }));
}

export function cartItemCount(cart) {
  return Object.values(cart || {}).reduce((sum, line) => sum + (line?.qty || 0), 0);
}

export function findScreenWithComponent(data, type) {
  for (const [id, screen] of Object.entries(data?.screens || {})) {
    const sections = screen?.bodySections || [];
    if (sections.some(section => (section.components || []).some(comp => comp.type === type))) {
      return id;
    }
  }
  return null;
}

export function isProductItem(item) {
  if (!item || typeof item !== "object") return false;
  const hasIdentity = Boolean(cartLineId(item));
  const hasDetails = item.name || item.title;
  const hasPrice = item.price != null;
  return Boolean(hasIdentity && hasDetails && hasPrice);
}

export function normalizeProduct(item) {
  if (!item || typeof item !== "object") return null;
  const id = cartLineId(item);
  if (!id) return null;
  return {
    ...item,
    id,
    name: item.name || item.title || "Product",
    description: item.description || item.desc || item.subtitle || "",
    price: parseCartPrice(item.price),
    image: item.image || item.img || "",
    emoji: item.emoji || "",
  };
}
