import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ScreenSwitcher from "./ScreenSwitcher";

function makeStore() {
  return {
    data: {
      screens: {
        home: { name: "Home", backgroundColor: "#fff", bodySections: [{ id: "hero" }, { id: "menu" }] },
        services: { name: "Services", backgroundColor: "#f5f5f5", bodySections: [{ id: "list" }] },
      },
      navigation: { tabs: [] },
    },
    currentScreenId: "home",
    setCurrentScreenId: vi.fn(),
    addScreen: vi.fn(() => "new-screen"),
    renameScreen: vi.fn(),
    removeScreen: vi.fn(),
    updateTab: vi.fn(),
    addTab: vi.fn(),
    removeTab: vi.fn(),
    reorderTab: vi.fn(),
  };
}

describe("ScreenSwitcher", () => {
  it("shows accessible screen tabs with section counts and keyboard hints", () => {
    const store = makeStore();
    render(<ScreenSwitcher store={store} />);

    expect(screen.getByRole("tablist", { name: "App screens" })).toBeTruthy();
    expect(screen.getByRole("tab", { name: "Home screen, shortcut 1" }).getAttribute("aria-selected")).toBe("true");
    expect(screen.getByRole("tab", { name: "Services screen, shortcut 2" }).getAttribute("aria-selected")).toBe("false");
    expect(screen.getByTitle("2 sections")).toBeTruthy();
    expect(screen.getByTitle("Switch to Services (Ctrl/Command+2)")).toBeTruthy();
  });

  it("switches screens directly with Ctrl/Command+number shortcuts", () => {
    const store = makeStore();
    render(<ScreenSwitcher store={store} />);

    fireEvent.keyDown(window, { key: "2", ctrlKey: true });

    expect(store.setCurrentScreenId).toHaveBeenCalledWith("services");
  });

  it("exposes quick rename, duplicate, delete, and add-screen actions", () => {
    const store = makeStore();
    render(<ScreenSwitcher store={store} />);

    expect(screen.getByRole("button", { name: "Rename Home" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Duplicate Home" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Delete Home" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Rename Home" }));
    fireEvent.change(screen.getByDisplayValue("Home"), { target: { value: "Landing" } });
    fireEvent.keyDown(screen.getByDisplayValue("Landing"), { key: "Enter" });
    expect(store.renameScreen).toHaveBeenCalledWith("home", "Landing");

    fireEvent.click(screen.getByRole("button", { name: "Duplicate Home" }));
    expect(store.addScreen).toHaveBeenCalledWith(null, "Home (copy)");
    expect(store.setCurrentScreenId).toHaveBeenCalledWith("new-screen");

    fireEvent.click(screen.getByRole("button", { name: "Add screen" }));
    expect(store.addScreen).toHaveBeenCalledWith(null, "New Page");
  });

  it("opens a right-click menu with edit, duplicate and delete for tabs", () => {
    const store = makeStore();
    render(<ScreenSwitcher store={store} />);

    const tab = screen.getByRole("tab", { name: "Services screen, shortcut 2" });
    fireEvent.contextMenu(tab);
    expect(screen.getByRole("menu", { name: "Screen options" })).toBeTruthy();
    fireEvent.click(screen.getByRole("menuitem", { name: /Duplicate screen/ }));
    expect(store.addScreen).toHaveBeenCalledWith(null, "Services (copy)");
    expect(store.setCurrentScreenId).toHaveBeenCalledWith("new-screen");
  });

  it("renames through the tab context menu", () => {
    const store = makeStore();
    render(<ScreenSwitcher store={store} />);

    fireEvent.contextMenu(screen.getByRole("tab", { name: "Home screen, shortcut 1" }));
    fireEvent.click(screen.getByRole("menuitem", { name: /Rename "Home"/ }));
    fireEvent.change(screen.getByDisplayValue("Home"), { target: { value: "Landing" } });
    fireEvent.keyDown(screen.getByDisplayValue("Landing"), { key: "Enter" });
    expect(store.renameScreen).toHaveBeenCalledWith("home", "Landing");
  });
});