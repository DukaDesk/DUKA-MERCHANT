import { describe, expect, it } from "vitest";
import { generateShopTemplate, getGeneratedTemplateCatalog } from "./TemplateGenerator";

const config = (category, template) => ({
  category,
  template,
  appName: "Demo App",
  tagline: "A useful demo",
  color: "#1B4332",
  logo: null,
  businessName: "Demo Business",
  bizDesc: "Demo description",
  phone: "08000000000",
  address: "Lagos",
  hours: [],
  selectedIntegrations: [],
});

describe("TemplateGenerator", () => {
  it("creates different navigation structures for different templates", () => {
    const classic = generateShopTemplate(config("Restaurant", "Classic Dine"));
    const modern = generateShopTemplate(config("Restaurant", "Modern Bites"));

    expect(classic.navigation.tabs.map(tab => tab.screenId)).toEqual(["menu", "orders", "reservations", "info"]);
    expect(modern.navigation.tabs.map(tab => tab.screenId)).toEqual(["menu", "shop", "orders", "profile"]);
  });

  it("publishes generated template options for the gallery", () => {
    const catalog = getGeneratedTemplateCatalog();
    const restaurant = catalog.find(category => category.name === "Restaurant");

    expect(restaurant.templates.map(template => template.name)).toEqual([
      "Classic Dine",
      "Modern Bites",
      "Fresh & Bright",
    ]);
  });

  it("uses category-specific preview bindings", () => {
    const booking = generateShopTemplate(config("Booking", "Scheduler"));
    const serviceScreen = booking.screens.find(screen => screen.screenId === "services");

    expect(serviceScreen).toBeTruthy();
    expect(serviceScreen.layout.children.map(child => child.type)).toEqual([
      "hero_banner",
      "calendar_strip",
      "slot_grid",
      "booking_summary",
    ]);
  });

  it("generates starters for new catalog verticals", () => {
    const pharmacy = generateShopTemplate(config("Pharmacy", "Care Plus"));

    expect(pharmacy.screens.map(screen => screen.screenId).sort()).toEqual(["cart", "info", "orders", "shop"]);

    const salon = generateShopTemplate(config("Salon & Beauty", "Glow Studio"));

    expect(salon.screens.map(screen => screen.screenId).sort()).toEqual(["info", "orders", "profile", "services"]);
  });

  it("resolves taxonomy preset keys to catalog entries with legacy fallback", () => {
    const healthcare = generateShopTemplate(config("Healthcare", "Care Plus"));

    expect(healthcare.screens.map(screen => screen.screenId).sort()).toEqual(["cart", "info", "orders", "shop"]);

    const unknown = generateShopTemplate(config("Does Not Exist", "Nope"));

    expect(unknown.screens.map(screen => screen.screenId)).toEqual(["menu", "info", "orders", "services"]);
  });

  it("lists new verticals in the template catalog", () => {
    const catalog = getGeneratedTemplateCatalog();
    const names = catalog.map(category => category.name);

    expect(names).toContain("Pharmacy");
    expect(names).toContain("Salon & Beauty");
    expect(names).toContain("Law Firm");
    expect(names).toContain("Logistics");

    const pharmacy = catalog.find(category => category.name === "Pharmacy");
    const carePlus = pharmacy.templates.find(template => template.name === "Care Plus");

    expect(carePlus.primaryColor).toBe("#0D9488");
    expect(carePlus.features).toEqual(["shop", "cart", "orders", "info"]);
  });
});
