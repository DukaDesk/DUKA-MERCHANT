import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { it, expect, vi } from "vitest";
import ContextMenu from "./ContextMenu";

const ITEMS = [
  { id: "edit", label: "Edit" },
  { id: "duplicate", label: "Duplicate" },
  { id: "delete", label: "Delete", danger: true },
];

it("renders options and fires the chosen action", () => {
  const onSelect = vi.fn();
  const onClose = vi.fn();
  render(<ContextMenu x={10} y={10} items={ITEMS.map(i => ({ ...i, onSelect }))} onClose={onClose} />);
  expect(screen.getByRole("menu")).toBeTruthy();
  fireEvent.click(screen.getByRole("menuitem", { name: "Duplicate" }));
  expect(onSelect).toHaveBeenCalledTimes(1);
  expect(onClose).toHaveBeenCalled();
});

it("closes on Escape and outside pointer down", () => {
  const onClose = vi.fn();
  render(<ContextMenu x={10} y={10} items={ITEMS} onClose={onClose} />);
  fireEvent.keyDown(document, { key: "Escape" });
  expect(onClose).toHaveBeenCalledTimes(1);
  fireEvent.pointerDown(document.body);
  expect(onClose).toHaveBeenCalledTimes(2);
});

it("disables destructive actions when flagged", () => {
  const onSelect = vi.fn();
  render(<ContextMenu x={10} y={10} items={[{ id: "delete", label: "Delete", danger: true, disabled: true, onSelect }]} onClose={() => {}} />);
  const item = screen.getByRole("menuitem", { name: "Delete" });
  expect(item.disabled).toBe(true);
  fireEvent.click(item);
  expect(onSelect).not.toHaveBeenCalled();
});
