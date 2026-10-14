import React from "react";
import { render, screen } from "@testing-library/react";
import { it, expect } from "vitest";
import { ListFieldEditor } from "./PropertiesPanel";
import { getComponentType } from "../canvas-editor/componentTypes";

const FIELDS = [
  { key: "name", label: "Name", type: "text" },
  { key: "price", label: "Price", type: "text" },
  { key: "background", label: "Card Background", type: "bg" },
];

const ITEMS = [{ productId: "p1", name: "Beans", price: 1500, background: { type: "color", value: "#FFFFFF" } }];

it("locks product slots to picker plus styling (no manual details)", () => {
  render(<ListFieldEditor fields={FIELDS} value={ITEMS} onChange={() => {}} productPicker lockProductFields manualAdd={false} />);
  // Product detail inputs are gone; styling stays.
  expect(screen.queryByDisplayValue("Beans")).toBeNull();
  expect(screen.queryByDisplayValue("1500")).toBeNull();
});

it("keeps manual editing for non-product lists", () => {
  render(<ListFieldEditor fields={FIELDS} value={ITEMS} onChange={() => {}} />);
  expect(screen.getByDisplayValue("Beans")).toBeTruthy();
});

it("offers text styling through selectable text, not repetitive color rows", () => {
  const def = getComponentType("menu_grid");
  const itemFields = def.propFields.find(f => f.key === "items").fields;
  const keys = itemFields.map(f => f.key);
  // No per-item color rows — name/price/desc are styled by selecting the
  // text on the canvas (item.textStyles), edited in the styling flow.
  expect(keys).not.toContain("textColor");
  expect(keys).not.toContain("priceColor");
  expect(keys).toContain("background");
});
