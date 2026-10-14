import { describe, it, expect } from "vitest";
import { deriveStatus, discountPercent, generateSku, parseCsvText, SAMPLE_CSV, DESCRIPTION_MAX, SHORT_DESCRIPTION_MAX } from "./Products";

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

describe("sku auto-generation", () => {
  it("derives a serial from the product name", () => {
    expect(generateSku("Jollof Rice")).toMatch(/^JOL-[A-Z0-9]{6}$/);
    expect(generateSku("")).toMatch(/^PRD-[A-Z0-9]{6}$/);
  });

  it("generates a fresh serial on every call", () => {
    expect(generateSku("Beans")).not.toBe(generateSku("Beans"));
  });
});

describe("csv import parsing", () => {
  it("rejects files without name and price columns", () => {
    expect(parseCsvText("title,cost\nBeans,100").error).toMatch(/name.*price/i);
    expect(parseCsvText("name,price").rows).toEqual([]);
  });

  it("flags rows missing a name or a positive price", () => {
    const { rows, error } = parseCsvText("name,price\nBeans,2500\n,100\nRice,0");
    expect(error).toBe("");
    expect(rows.map(r => r.valid)).toEqual([true, false, false]);
    expect(rows[1].error).toMatch(/name/i);
    expect(rows[2].error).toMatch(/price/i);
  });

  it("parses the downloadable sample without errors", () => {
    const { rows, error } = parseCsvText(SAMPLE_CSV);
    expect(error).toBe("");
    expect(rows.length).toBe(2);
    expect(rows.every(r => r.valid)).toBe(true);
    expect(rows[0].tags).toEqual(["spicy", "bestseller"]);
  });
});
