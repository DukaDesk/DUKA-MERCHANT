import { describe, it, expect } from "vitest";
import { PRIMITIVES, PRIMITIVE_BY_ID, PRIMITIVE_GROUPS, getPrimitive, verticalPresetModules } from "./primitives";
import { getVertical } from "./verticals";

describe("primitives registry", () => {
  it("exposes every module id referenced by verticals", () => {
    const primitiveIds = new Set(PRIMITIVES.map(p => p.id));
    ["analytics", "messages", "marketing", "integrations", "billing", "team", "settings",
      "products", "orders", "customers", "inventory", "giving", "attendance", "fees", "appointments",
      "reservations", "memberships", "tickets", "classes"]
      .forEach(id => expect(primitiveIds.has(id), `${id} missing`).toBe(true));
  });

  it("PRIMITIVE_BY_ID maps ids", () => {
    expect(PRIMITIVE_BY_ID.analytics.label).toBe("Analytics");
    expect(getPrimitive("nope")).toBeNull();
  });

  it("PRIMITIVE_GROUPS covers all grouped ids", () => {
    const grouped = new Set(PRIMITIVE_GROUPS);
    PRIMITIVES.forEach(p => expect(grouped.has(p.group), `${p.group} not in PRIMITIVE_GROUPS`).toBe(true));
  });

  it("verticalPresetModules returns modules + admin pages for a vertical", () => {
    const vertical = getVertical("Church");
    const preset = verticalPresetModules(vertical);
    expect(preset).toContain("products");
    expect(preset).toContain("giving");
    expect(preset).toContain("attendance");
    expect(preset).toContain("settings");
  });

  it("verticalPresetModules handles null vertical", () => {
    expect(verticalPresetModules(null)).toEqual([]);
  });
});