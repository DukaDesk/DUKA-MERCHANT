import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { it, expect, vi } from "vitest";
import PreviewTabBar from "./PreviewTabBar";

it("renders equal-width icon tabs and navigates to their published screens", () => {
  const navigate = vi.fn();
  render(<PreviewTabBar navigation={{ tabs: [
    { screenId: "home", label: "Home", icon: "home-outline" },
    { screenId: "orders", label: "My orders and deliveries", icon: "ClipboardList" },
    { label: "Unavailable", icon: "trophy-outline" },
  ], style: { active: "#ff0000", height: 64 } }} activeScreen="home" onNavigate={navigate} />);
  const home = screen.getByRole("button", { name: "Home" });
  const orders = screen.getByRole("button", { name: "My orders and deliveries" });
  expect(home.getAttribute("aria-current")).toBe("page");
  expect(home.querySelector("svg.lucide-house, svg.lucide-home")).not.toBeNull();
  expect(orders.querySelector("svg.lucide-clipboard-list")).not.toBeNull();
  expect(home.style.flex).toBe(orders.style.flex);
  expect(orders.style.minWidth).toBe("0");
  expect(home.style.color).toBe("rgb(255, 0, 0)");
  expect(screen.getByRole("navigation").style.minHeight).toBe("64px");
  fireEvent.click(orders);
  expect(navigate).toHaveBeenCalledWith("orders");
  const unavailable = screen.getByRole("button", { name: "Unavailable" });
  expect(unavailable.querySelector("svg.lucide-trophy")).not.toBeNull();
  fireEvent.click(unavailable);
  expect(navigate).toHaveBeenCalledTimes(1);
});

it("does not reserve space when the manifest has no tabs", () => {
  const { container } = render(<PreviewTabBar navigation={{ tabs: [] }} />);
  expect(container.firstChild).toBeNull();
});
