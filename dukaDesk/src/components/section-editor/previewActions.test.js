import { describe, expect, it, vi } from "vitest";
import {
  parseActionValue,
  parsePreviewAction,
  resolvePreviewChrome,
  runPreviewAction,
  runPreviewEvent,
  runPreviewItemPress,
} from "./previewActions";

const data = {
  shared: {
    header: { id: "shared_header", name: "Header", components: [] },
    footer: { id: "shared_footer", name: "Footer", components: [] },
  },
  screens: {
    home: { name: "Home", bodySections: [] },
    product_detail: { name: "Product detail", bodySections: [] },
    cart: { name: "Cart", bodySections: [] },
    menu: { name: "Menu", bodySections: [] },
  },
};

function context(overrides = {}) {
  return {
    data,
    currentScreenId: "home",
    navigate: vi.fn(),
    back: vi.fn(),
    notify: vi.fn(),
    openUrl: vi.fn(),
    setLocation: vi.fn(),
    ...overrides,
  };
}

describe("parseActionValue", () => {
  it("accepts JSON strings and objects, rejects empty/invalid payloads", () => {
    expect(parseActionValue('{"type":"navigate","payload":{"screenId":"cart"}}'))
      .toEqual({ type: "navigate", payload: { screenId: "cart" } });
    expect(parseActionValue({ type: "pop" })).toEqual({ type: "pop" });
    expect(parseActionValue("")).toBeNull();
    expect(parseActionValue("{not-json")).toBeNull();
  });
});

describe("parsePreviewAction", () => {
  it("prefers tapAction and falls back to legacy action / event defaults", () => {
    expect(parsePreviewAction({ props: { tapAction: '{"type":"pop"}', action: '{"type":"back"}' } })).toEqual({ type: "pop" });
    expect(parsePreviewAction({ props: { action: '{"type":"back"}' } })).toEqual({ type: "back" });
    expect(parsePreviewAction({ props: { actions: { default: '{"type":"add_to_cart"}' } } })).toEqual({ type: "add_to_cart" });
    expect(parsePreviewAction({ props: {} })).toBeNull();
  });
});

describe("runPreviewAction", () => {
  it("pushes and replaces screens", () => {
    const ctx = context();
    expect(runPreviewAction({ type: "navigate", payload: { screenId: "cart" } }, ctx)).toBe(true);
    expect(ctx.navigate).toHaveBeenCalledWith("cart", "push");
    expect(runPreviewAction({ type: "switch_screen", payload: { screen: "menu" } }, ctx)).toBe(true);
    expect(ctx.navigate).toHaveBeenCalledWith("menu", "replace");
  });

  it("pops the preview stack", () => {
    const ctx = context();
    expect(runPreviewAction({ type: "pop" }, ctx)).toBe(true);
    expect(ctx.back).toHaveBeenCalledTimes(1);
  });

  it("maps cart, phone, email, url and form actions to preview feedback", () => {
    const ctx = context();
    runPreviewAction({ type: "add_to_cart" }, ctx);
    expect(ctx.notify).toHaveBeenCalledWith("Item added to cart", "success");
    runPreviewAction({ type: "checkout" }, ctx);
    expect(ctx.navigate).toHaveBeenCalledWith("cart", "push");
    runPreviewAction({ type: "call_phone", payload: { phone: "0801" } }, ctx);
    expect(ctx.setLocation).toHaveBeenCalledWith("tel:0801");
    runPreviewAction({ type: "email", payload: { to: "a@b.co" } }, ctx);
    expect(ctx.setLocation).toHaveBeenCalledWith("mailto:a@b.co");
    runPreviewAction({ type: "open_url", payload: { url: "https://example.com" } }, ctx);
    expect(ctx.openUrl).toHaveBeenCalledWith("https://example.com");
    runPreviewAction({ type: "submit_form" }, ctx);
    expect(ctx.notify).toHaveBeenCalledWith("Submitted successfully", "success");
  });

  it("returns false for unknown or incomplete actions", () => {
    const ctx = context();
    expect(runPreviewAction(null, ctx)).toBe(false);
    expect(runPreviewAction({ type: "navigate" }, ctx)).toBe(false);
    expect(runPreviewAction({ type: "call_phone" }, ctx)).toBe(false);
  });
});

describe("runPreviewEvent", () => {
  it("runs the merchant-configured event action first", () => {
    const ctx = context();
    const comp = { props: { actions: { viewDetails: '{"type":"navigate","payload":{"screenId":"menu"}}' } } };
    runPreviewEvent(comp, "viewDetails", {}, ctx);
    expect(ctx.navigate).toHaveBeenCalledWith("menu", "push");
    expect(ctx.notify).not.toHaveBeenCalled();
  });

  it("mirrors mobile defaults when no action is configured", () => {
    const ctx = context();
    runPreviewEvent({ props: {} }, "addItem", {}, ctx);
    expect(ctx.notify).toHaveBeenCalledWith("Item added to cart", "success");
    runPreviewEvent({ props: {} }, "viewDetails", {}, ctx);
    expect(ctx.navigate).toHaveBeenCalledWith("product_detail", "push");
    runPreviewEvent({ props: {} }, "confirm", {}, ctx);
    expect(ctx.notify).toHaveBeenCalledWith("Submitted successfully", "success");
    runPreviewEvent({ props: {} }, "back", {}, ctx);
    expect(ctx.back).toHaveBeenCalled();
  });

  it("still gives feedback for unmapped events", () => {
    const ctx = context();
    runPreviewEvent({ props: {} }, "selectDate", {}, ctx);
    expect(ctx.notify).toHaveBeenCalledWith("selectDate — preview action", "info");
  });

  it("lets the component press action handle unmapped events without duplicate feedback", () => {
    const ctx = context();
    runPreviewEvent({ props: { tapAction: '{"type":"navigate","payload":{"screenId":"menu"}}' } }, "default", {}, ctx);
    expect(ctx.notify).not.toHaveBeenCalled();
    expect(ctx.navigate).not.toHaveBeenCalled();
  });
});

describe("runPreviewItemPress", () => {
  it("prefers an item action, then an item screen, then the component action", () => {
    const ctx = context();
    runPreviewItemPress({ props: {} }, { tapAction: '{"type":"navigate","payload":{"screenId":"cart"}}' }, ctx);
    expect(ctx.navigate).toHaveBeenCalledWith("cart", "push");

    runPreviewItemPress({ props: {} }, { screenId: "menu" }, ctx);
    expect(ctx.navigate).toHaveBeenCalledWith("menu", "push");

    runPreviewItemPress({ props: { tapAction: '{"type":"pop"}' } }, {}, ctx);
    expect(ctx.back).toHaveBeenCalled();
  });
});

describe("resolvePreviewChrome", () => {
  it("inherits shared chrome, hides it, and resolves custom sections", () => {
    expect(resolvePreviewChrome({}, data, "header")).toBe(data.shared.header);
    expect(resolvePreviewChrome({ chrome: { header: { mode: "hide" } } }, data, "header")).toBeNull();
    const custom = resolvePreviewChrome({ chrome: { footer: { mode: "custom", sectionId: "shared_footer" } } }, data, "footer");
    expect(custom).toBe(data.shared.footer);
  });
});
