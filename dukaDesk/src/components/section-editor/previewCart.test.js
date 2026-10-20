import { describe, expect, it } from "vitest";
import {
  addCartItem,
  cartItemCount,
  cartItems,
  findScreenWithComponent,
  isProductItem,
  normalizeProduct,
  removeCartItem,
} from "./previewCart";

const shirt = { id: "p1", name: "Slim Fit Shirt", price: 12500, image: "shirt.png" };

describe("preview cart", () => {
  it("starts empty and adds normalized lines", () => {
    const cart = addCartItem({}, shirt);
    expect(cartItems(cart)).toEqual([{ id: "p1", name: "Slim Fit Shirt", price: 12500, qty: 1, img: "shirt.png" }]);
    expect(cartItemCount(cart)).toBe(1);
  });

  it("increments existing lines and accepts product mappers using title/img", () => {
    let cart = addCartItem({}, { id: 7, title: "Offer", price: "100", img: "offer.png" }, 2);
    cart = addCartItem(cart, { id: 7 });
    expect(cartItems(cart)).toEqual([{ id: "7", name: "Offer", price: 100, qty: 3, img: "offer.png" }]);
  });

  it("removes one quantity at a time and deletes empty lines", () => {
    let cart = addCartItem({}, shirt, 2);
    cart = removeCartItem(cart, "p1");
    expect(cartItemCount(cart)).toBe(1);
    cart = removeCartItem(cart, "p1");
    expect(cartItems(cart)).toEqual([]);
  });

  it("ignores items without an id and phantom quantity updates", () => {
    expect(addCartItem({}, { name: "No id", price: 10 })).toEqual({});
    expect(addCartItem({}, { id: "x" })).toEqual({});
    expect(removeCartItem({}, "missing")).toEqual({});
  });

  it("finds the screen that renders a component type", () => {
    const data = { screens: { home: { bodySections: [] }, cart: { bodySections: [{ components: [{ type: "cart_summary" }] }] } } };
    expect(findScreenWithComponent(data, "cart_summary")).toBe("cart");
    expect(findScreenWithComponent(data, "order_history")).toBeNull();
  });
});

describe("product detection", () => {
  it("treats priced menu items and offers as products", () => {
    expect(isProductItem(shirt)).toBe(true);
    expect(isProductItem({ id: "o1", title: "Promo", price: 0 })).toBe(true);
    expect(isProductItem({ label: "All" })).toBe(false);
  });

  it("normalizes product detail fields", () => {
    expect(normalizeProduct({ productId: 9, title: "Watch", description: "Steel", price: "45000", img: "watch.png" }))
      .toMatchObject({ id: "9", name: "Watch", description: "Steel", price: 45000, image: "watch.png" });
  });
});
