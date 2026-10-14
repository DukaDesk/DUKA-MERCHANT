import { describe, it, expect } from "vitest";
import {
  COMMERCE_CATEGORIES,
  COMMERCE_CATEGORY_KEYS,
  ONBOARDING_COMMERCE_CATEGORIES,
  DESK_CATEGORIES,
} from "./taxonomy";
import { WIZARD_CATEGORIES } from "./wizard";
import { isCommerceTemplateCategory } from "./verticalCatalog";

describe("commerce-only category pickers", () => {
  it("restricts selectable desk types to buying/selling categories", () => {
    expect(COMMERCE_CATEGORY_KEYS).toEqual(["Business", "Food & Hospitality", "Services", "Healthcare"]);
    expect([...COMMERCE_CATEGORIES.map(c => c.key)].sort()).toEqual([...COMMERCE_CATEGORY_KEYS].sort());
    // Full taxonomy stays intact for existing users, aliases and presets.
    expect(DESK_CATEGORIES.length).toBeGreaterThan(COMMERCE_CATEGORIES.length);
  });

  it("keeps commerce presets in onboarding while dropping the rest", () => {
    const keys = ONBOARDING_COMMERCE_CATEGORIES.map(c => c.key);
    for (const key of ["Business", "Food & Hospitality", "Services", "Healthcare", "Cafe", "Pharmacy", "Beauty & Salon", "Clinic & Healthcare", "Logistics & Delivery", "Real Estate"]) {
      expect(keys).toContain(key);
    }
    for (const key of ["Corporate", "Legal", "Religion", "Education", "Events", "Nonprofit", "Personal", "Law Firm", "Training & Bootcamps"]) {
      expect(keys).not.toContain(key);
    }
  });

  it("offers only commerce categories in the setup wizard", () => {
    expect([...WIZARD_CATEGORIES.map(c => c.name)].sort()).toEqual(["Business", "Food & Hospitality", "Healthcare", "Services"]);
  });

  it("classifies template catalog categories as commerce or not", () => {
    for (const name of ["Restaurant", "Ecommerce", "Food Vendor", "Grocery", "Booking", "Pharmacy", "Salon & Beauty", "Logistics"]) {
      expect(isCommerceTemplateCategory(name)).toBe(true);
    }
    for (const name of ["Church", "School", "Law Firm", "Unknown Category"]) {
      expect(isCommerceTemplateCategory(name)).toBe(false);
    }
  });
});
