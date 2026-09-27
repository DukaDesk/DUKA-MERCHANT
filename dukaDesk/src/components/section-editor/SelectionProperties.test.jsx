import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import PropertiesPanel, { PressProperties } from "./PropertiesPanel";
import IconPicker from "./IconPicker";
import { ICON_LIBRARY, getComponentType } from "../canvas-editor/componentTypes";

it("selected text shows content in General and its saved styles in Styling", () => {
  const component = { id: "text", type: "text_block", props: { text: "Selected title", fontSize: 27, fontFamily: "Inter", fontWeight: "700" } };
  const section = { id: "section", components: [component] };
  const page = { bodySections: [section] };
  const store = { data: { screens: { home: page }, navigation: {} }, screen: page, updateProp: vi.fn() };
  render(<PropertiesPanel store={store} selectedSectionId="section" selectedComponentId="text" focusSubKey={{ compId: "text", key: "text" }} />);
  expect(screen.getByDisplayValue("Selected title")).toBeTruthy();
  expect(screen.queryByText(/double-click/i)).toBeNull();
  expect(screen.queryByText("On press / Attach page")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Styling" }));
  expect(screen.queryByDisplayValue("Selected title")).toBeNull();
  expect(screen.getByDisplayValue("27")).toBeTruthy();
  fireEvent.change(screen.getByDisplayValue("27"), { target: { value: "30" } });
  expect(store.updateProp).toHaveBeenCalledWith("section", "text", "fontSize", 30);
});
it("item styles stay in Styling and target the selected item", () => {
  const update = vi.fn();
  const component = { type: "menu_grid", props: { items: [{ name: "Meal", background: "#112233" }] } };
  const fields = [{ key: "items", fields: [{ key: "name", label: "Name", type: "text" }, { key: "background", label: "Background", type: "color" }] }];
  render(<PressProperties mode="styling" component={component} fields={fields} focusKey="item:items:0" screens={[]} onChange={update} />);
  expect(screen.queryByDisplayValue("Meal")).toBeNull();
  expect(screen.queryByText("On press / Attach page")).toBeNull();
  expect(screen.getByText("Background")).toBeTruthy();
});
it("offers a larger searchable icon library with emoji inside the picker", () => {
  expect(Object.keys(ICON_LIBRARY).length).toBeGreaterThan(80);
  const change = vi.fn();
  render(<IconPicker value="Home" onChange={change} />);
  fireEvent.click(screen.getByRole("button", { name: "Choose icon" }));
  fireEvent.change(screen.getByLabelText("Search icons"), { target: { value: "coffee" } });
  fireEvent.click(screen.getByRole("button", { name: "Coffee" }));
  expect(change).toHaveBeenCalledWith("Coffee");
  fireEvent.click(screen.getByRole("button", { name: "Choose icon" }));
  fireEvent.click(screen.getByRole("button", { name: "Emoji" }));
  expect(screen.getByLabelText("Emoji")).toBeTruthy();
});
it("renders the selected menu icon as a symbol rather than its name", () => {
  const definition = getComponentType("menu_grid");
  const { container } = render(definition.render({ ...definition.defaultProps, items: [{ name: "Lunch", emoji: "Utensils" }] }));
  expect(container.querySelector("svg.lucide-utensils")).toBeTruthy();
  expect(screen.queryByText("Utensils")).toBeNull();
});

it("keeps button content in General and shape in Styling", () => {
  const component = { id: "button", type: "button", props: { label: "Continue", icon: "ArrowRight", iconSize: 22, shape: "round", radius: 24 } };
  const section = { id: "section", components: [component] };
  const page = { bodySections: [section] };
  const store = { data: { screens: { home: page }, navigation: {} }, screen: page, updateProp: vi.fn() };
  render(<PropertiesPanel store={store} selectedSectionId="section" selectedComponentId="button" />);
  expect(screen.getByDisplayValue("Continue")).toBeTruthy();
  expect(screen.getByRole("button", { name: "Choose icon" })).toBeTruthy();
  expect(screen.queryByText("Shape")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Styling" }));
  expect(screen.queryByDisplayValue("Continue")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Layout" }));
  expect(screen.getByDisplayValue("round")).toBeTruthy();
});
it("renders an icon-only round button and icons in pill sets", () => {
  const button = getComponentType("button");
  const view = render(button.render({ label: "Add", icon: "Plus", showLabel: "false", shape: "round", width: 56, height: 56 }));
  expect(view.container.querySelector("svg.lucide-plus")).toBeTruthy();
  expect(screen.queryByText("Add")).toBeNull();
  view.rerender(getComponentType("category_pills").render({ cats: [{ label: "Favorites", icon: "Heart" }] }));
  expect(view.container.querySelector("svg.lucide-heart")).toBeTruthy();
  expect(screen.getByText("Favorites")).toBeTruthy();
});
