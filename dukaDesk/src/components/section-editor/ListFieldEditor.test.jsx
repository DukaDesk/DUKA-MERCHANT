import React from "react";
import { render, screen } from "@testing-library/react";
import { it, expect } from "vitest";
import { ListFieldEditor } from "./PropertiesPanel";

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
