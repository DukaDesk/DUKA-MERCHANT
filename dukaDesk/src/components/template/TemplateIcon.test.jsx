import React from "react";
import { render, screen } from "@testing-library/react";
import { it, expect } from "vitest";
import { TemplateIcon, resolveTemplateIconName } from "./TemplateIcon";
import { PreviewTabIcon } from "../section-editor/PreviewTabBar";
import { MenuGrid, Tabs } from "./TemplateComponents";

it("renders a Lucide svg for icon names, never raw text", () => {
  const { container } = render(<TemplateIcon name="Utensils" size={32} />);
  expect(container.querySelector("svg")).toBeTruthy();
  expect(container.textContent).toBe("");
});

it("maps pasted emoji to real icons", () => {
  for (const emoji of ["🏠", "🛍️", "🍽️", "☕", "💊", "⛪", "🔥", "🔒", "→", "✓"]) {
    expect(resolveTemplateIconName(emoji)).not.toBe("Image");
  }
  const { container } = render(<TemplateIcon name="🏠" />);
  expect(container.querySelector("svg")).toBeTruthy();
  expect(container.textContent).not.toContain("🏠");
});

it("maps builder ionicon names and previously missing icons", () => {
  expect(resolveTemplateIconName("restaurant-outline")).toBe("Utensils");
  expect(resolveTemplateIconName("grid-outline")).toBe("LayoutGrid");
  for (const name of ["Sandwich", "Pill", "Scale", "soup", "home-outline"]) {
    expect(resolveTemplateIconName(name)).not.toBe("Image");
  }
});

it("falls back to a generic icon for unknown names", () => {
  const { container } = render(<TemplateIcon name="definitely-not-an-icon" />);
  expect(container.querySelector("svg")).toBeTruthy();
  expect(container.textContent).toBe("");
});

it("preview tabs render icons, not names or emoji", () => {
  const { container } = render(<PreviewTabIcon name="restaurant-outline" size={20} />);
  expect(container.querySelector("svg")).toBeTruthy();
  const { container: emojiTab } = render(<PreviewTabIcon name="🏠" size={20} />);
  expect(emojiTab.querySelector("svg")).toBeTruthy();
  expect(emojiTab.textContent).not.toContain("🏠");
});

it("menu grid renders an icon for non-URL images instead of the raw name", () => {
  const { container } = render(
    <MenuGrid items={[{ id: "1", name: "Suya", price: 1500, img: "Utensils" }]} />,
  );
  expect(container.querySelector("svg")).toBeTruthy();
  expect(container.textContent).not.toContain("Utensils");
});

it("template tabs show an icon above the label when one is set", () => {
  const { container } = render(
    <Tabs items={[{ label: "Menu", screenId: "menu", icon: "restaurant-outline" }]} />,
  );
  expect(container.querySelector("svg")).toBeTruthy();
  expect(screen.getByText("Menu")).toBeTruthy();
});
