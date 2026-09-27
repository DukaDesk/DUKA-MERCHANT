import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { it, expect, vi } from "vitest";
import ButtonGallery from "./ButtonGallery";
import { getComponentCatalog } from "./componentCatalog";
it("groups real button previews and inserts the displayed circular FAB", () => {
  const items = getComponentCatalog().find(category => category.key === "buttons").components;
  const add = vi.fn();
  render(<ButtonGallery items={items} onAdd={add} />);
  expect(screen.getByText("Rectangle", { selector: "summary" })).toBeTruthy();
  expect(screen.getByText("Pills", { selector: "summary" })).toBeTruthy();
  const fab = screen.getByRole("button", { name: "Round / FAB" });
  const icon = fab.querySelector("svg.lucide-plus");
  expect(icon).toBeTruthy();
  expect(icon.parentElement.style.borderRadius).toBe("999px");
  expect(icon.parentElement.style.minHeight).toBe("56px");
  fireEvent.click(fab);
  expect(add).toHaveBeenCalledWith(expect.objectContaining({ defaultProps: expect.objectContaining({ shape: "round", width: 56, height: 56 }) }));
});
