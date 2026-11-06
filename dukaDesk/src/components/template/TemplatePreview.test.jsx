import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SharedAppPreview from "../../runtime/SharedAppPreview";
import {
  normalizeScreenId,
  resolvePreviewScreen,
  findScreenWithComponent,
  injectPreviewState,
  buildPreviewOrder,
} from "./TemplateRenderer";

const screens = {
  menu: { screenId: "menu", layout: { children: [{ type: "menu_grid", key: "g", props: { items: [{ id: "demo" }] } }] } },
  cart: { screenId: "cart", children: [{ type: "cart_summary", key: "c", props: {} }] },
  orders: { screenId: "orders", children: [{ type: "order_history", key: "o", props: {} }] },
};

describe("preview screen resolution", () => {
  it("matches ids ignoring dashes, underscores and case", () => {
    expect(normalizeScreenId("Product-Detail")).toBe("productdetail");
    expect(resolvePreviewScreen(screens, ["product-detail", "Menu"])).toBe("menu");
    expect(resolvePreviewScreen(screens, ["missing"])).toBe(null);
  });

  it("finds the screen hosting a component type", () => {
    expect(findScreenWithComponent(screens, "cart_summary")).toBe("cart");
    expect(findScreenWithComponent(screens, "order_history")).toBe("orders");
    expect(findScreenWithComponent(screens, "nope")).toBe(null);
  });
});

describe("preview data injection", () => {
  it("fills cart and order nodes without touching other screens", () => {
    const cart = [{ id: "p1", name: "Suya", price: 1500, qty: 2, img: "" }];
    const orders = [{ id: "Preview #1", status: "Processing", total: 3000 }];
    const menu = injectPreviewState(screens.menu, cart, orders);
    expect(menu.layout.children[0].props.items).toEqual([{ id: "demo" }]);
    const cartScreen = injectPreviewState(screens.cart, cart, orders);
    expect(cartScreen.children[0].props.items).toBe(cart);
    const ordersScreen = injectPreviewState(screens.orders, cart, orders);
    expect(ordersScreen.children[0].props.orders).toBe(orders);
  });

  it("leaves designs alone when preview state is absent", () => {
    expect(injectPreviewState(screens.cart, null, null)).toBe(screens.cart);
  });
});

describe("preview order simulation", () => {
  it("builds an order from the preview cart", () => {
    const { order, error } = buildPreviewOrder(
      { p1: { qty: 2, name: "Suya", price: 1500 }, p2: { qty: 1, name: "Rice", price: 2500 } },
      0,
    );
    expect(error).toBeUndefined();
    expect(order).toMatchObject({ id: "Preview #1", status: "Processing", total: 5500 });
    expect(order.sub).toContain("2x Suya");
  });

  it("refuses an empty cart", () => {
    expect(buildPreviewOrder({}, 0).error).toMatch(/empty/i);
  });
});

describe("shared manifest preview runtime", () => {
  it("renders submitted screens, allows internal navigation, and blocks review actions", () => {
    const onScreenChange = vi.fn();
    const manifest = {
      navigation: {
        initialScreen: "home",
        tabs: [{ id: "home", label: "Home", screenId: "home" }],
      },
    };
    const screens = {
      home: {
        title: "Submitted home",
        layout: {
          kind: "column",
          children: [{
            type: "layout",
            key: "home-section",
            layout: {
              kind: "section",
              children: [{
                type: "primary_button",
                key: "open-details",
                props: { label: "Open details" },
                actions: { default: { type: "navigate", payload: { screenId: "details" } } },
              }],
            },
          }],
        },
      },
      details: {
        title: "Submitted details",
        layout: {
          kind: "column",
          children: [{
            type: "layout",
            key: "details-section",
            layout: {
              kind: "section",
              children: [{
                type: "primary_button",
                key: "approve",
                props: { label: "Approve app" },
                actions: { default: { type: "approve" } },
              }],
            },
          }],
        },
      },
    };

    render(
      <SharedAppPreview
        manifest={manifest}
        screens={screens}
        onScreenChange={onScreenChange}
        readOnly
      />,
    );

    expect(screen.getByText("Submitted home")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Open details" }));
    expect(screen.getByText("Submitted details")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Approve app" }));
    expect(onScreenChange).not.toHaveBeenCalled();
  });
});
