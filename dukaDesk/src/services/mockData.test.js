import { describe, it, expect } from "vitest";
import {
  MOCK_LOGIN, MOCK_SIGNUP, MOCK_FORGOT_PASSWORD,
  WIZARD_STEPS, WIZARD_CATEGORIES, WIZARD_TEMPLATES_BY_CATEGORY,
  DASHBOARD_STATS_BY_CATEGORY, DASHBOARD_REVENUE_BY_CATEGORY,
  MOCK_PRODUCTS, MOCK_ORDERS,
  MOCK_INTEGRATIONS, MOCK_CURRENT_PLAN, MOCK_PLANS,
  ANALYTICS_REVENUE, ANALYTICS_TOP_PRODUCTS,
  MOCK_MESSAGES_BY_CONVERSATION,
} from "./mockData.js";

describe("mockData", () => {
  it("auth exports return expected structure", () => {
    const login = MOCK_LOGIN("test@example.com");
    expect(login).toHaveProperty("token");
    expect(login.merchant.email).toBe("test@example.com");

    const signup = MOCK_SIGNUP({ fullName: "Test User", businessName: "Test Store", email: "test@example.com" });
    expect(signup.merchant.name).toBe("Test User");
    expect(signup.merchant.business).toBe("Test Store");

    const forgot = MOCK_FORGOT_PASSWORD("test@example.com");
    expect(forgot.message).toContain("test@example.com");
  });

  it("wizard data is complete", () => {
    expect(WIZARD_STEPS).toHaveLength(5);
    expect(WIZARD_CATEGORIES).toHaveLength(7);
    expect(Object.keys(WIZARD_TEMPLATES_BY_CATEGORY)).toHaveLength(7);
  });

  it("dashboard stats cover all categories", () => {
    const categories = WIZARD_CATEGORIES.map(c => c.name);
    categories.forEach(cat => {
      expect(DASHBOARD_STATS_BY_CATEGORY[cat]).toBeDefined();
      expect(DASHBOARD_REVENUE_BY_CATEGORY[cat]).toBeDefined();
    });
  });

  it("products and orders are arrays", () => {
    expect(Array.isArray(MOCK_PRODUCTS)).toBe(true);
    expect(MOCK_PRODUCTS.length).toBeGreaterThan(0);
    expect(Array.isArray(MOCK_ORDERS)).toBe(true);
    expect(MOCK_ORDERS.length).toBeGreaterThan(0);
  });

  it("integrations data has categories", () => {
    expect(Array.isArray(MOCK_INTEGRATIONS)).toBe(true);
    MOCK_INTEGRATIONS.forEach(cat => {
      expect(cat).toHaveProperty("cat");
      expect(Array.isArray(cat.items)).toBe(true);
      expect(cat.items.length).toBeGreaterThan(0);
    });
  });

  it("plans include starter and current flag", () => {
    expect(MOCK_CURRENT_PLAN).toHaveProperty("plan");
    expect(MOCK_PLANS.some(p => p.current)).toBe(true);
    expect(MOCK_PLANS[0].name).toBe("Starter");
  });

  it("analytics data is non-empty arrays", () => {
    expect(Array.isArray(ANALYTICS_REVENUE)).toBe(true);
    expect(ANALYTICS_REVENUE.length).toBeGreaterThan(0);
    expect(Array.isArray(ANALYTICS_TOP_PRODUCTS)).toBe(true);
    expect(ANALYTICS_TOP_PRODUCTS.length).toBeGreaterThan(0);
  });
});

describe("conversations reference valid messages", () => {
  it("every conversation has messages", () => {
    expect(Object.keys(MOCK_MESSAGES_BY_CONVERSATION).length).toBeGreaterThan(0);
    Object.values(MOCK_MESSAGES_BY_CONVERSATION).forEach(msgs => {
      expect(Array.isArray(msgs)).toBe(true);
      expect(msgs.length).toBeGreaterThan(0);
    });
  });
});
