import { describe, it, expect } from "vitest";
import { deriveStatus, discountPercent, DESCRIPTION_MAX, SHORT_DESCRIPTION_MAX } from "./Products";

describe("product status automation", () => {
  it("marks zero stock out of stock", () => {
    expect(deriveStatus(0)).toBe("Out of Stock");
    expect(deriveStatus("")).toBe("Out of Stock");
    expect(deriveStatus(undefined)).toBe("Out of Stock");
  });

  it("marks low stock at or below the threshold", () => {
    expect(deriveStatus(1)).toBe("Low Stock");
    expect(deriveStatus(5)).toBe("Low Stock");
    expect(deriveStatus(6)).toBe("In Stock");
    expect(deriveStatus(100)).toBe("In Stock");
  });
});

describe("copy limits", () => {
  it("caps descriptions at 800 and short descriptions at 100", () => {
    expect(DESCRIPTION_MAX).toBe(800);
    expect(SHORT_DESCRIPTION_MAX).toBe(100);
  });
});

describe("discount math", () => {
  it("computes whole-percent savings only when there is a real markdown", () => {
    expect(discountPercent(2500, 5000)).toBe(50);
    expect(discountPercent(2500, 2500)).toBe(0);
    expect(discountPercent(2500, 1000)).toBe(0);
    expect(discountPercent(2500, null)).toBe(0);
    expect(discountPercent(0, 5000)).toBe(0);
  });
});
