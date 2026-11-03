import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { it, expect, vi } from "vitest";
import { PressProperties } from "./PropertiesPanel";
import { getComponentType } from "../canvas-editor/componentTypes";

it("uses one editor for the selected pill and only changes that pill", () => {
  const onChange = vi.fn();
  const component = { id: "pills", type: "category_pills", props: { cats: [{ label: "Meals" }, { label: "Drinks", tapAction: { type: "navigate", payload: { screenId: "drinks" } } }] } };
  const screens = [{ id: "meals", name: "Meals page" }, { id: "drinks", name: "Drinks page" }];
  const view = render(<PressProperties component={component} focusKey="item:cats:1" screens={screens} onChange={onChange} />);
  expect(screen.getAllByRole("button", { name: "Open Screen" })).toHaveLength(1);
  expect(screen.getByLabelText("Selected pressable").value).toBe("item:cats:1");
  expect(screen.getByLabelText("Destination page").value).toBe("drinks");
  fireEvent.change(screen.getByLabelText("Destination page"), { target: { value: "meals" } });
  const [key, items] = onChange.mock.calls[0];
  expect(key).toBe("cats");
  expect(items[0]).toEqual(component.props.cats[0]);
  expect(JSON.parse(items[1].tapAction).payload.screenId).toBe("meals");
  view.rerender(<PressProperties component={component} focusKey="item:cats:0" screens={screens} onChange={onChange} />);
  expect(screen.getByLabelText("Selected pressable").value).toBe("item:cats:0");
  expect(screen.queryByLabelText("Destination page")).toBeNull();
});
it("clicking a rendered pill selects its list position without selecting its parent", () => {
  const select = vi.fn(), parent = vi.fn();
  render(<div onClick={parent}>{getComponentType("category_pills").render({ cats: [{ label: "Meals" }, { label: "Drinks" }], onItemPress: select })}</div>);
  fireEvent.click(screen.getByText("Drinks"));
  expect(select).toHaveBeenCalledWith({ label: "Drinks" }, 1, "cats");
  expect(parent).not.toHaveBeenCalled();
});

it("renders an add to cart button on the product grid and dispatches addItem", () => {
  const addItem = vi.fn(), parent = vi.fn();
  const item = { name: "Jollof Rice", price: "₦2,500" };
  render(<div onClick={parent}>{getComponentType("menu_grid").render({ items: [item], onAction: addItem })}</div>);
  fireEvent.click(screen.getByRole("button", { name: "Add Jollof Rice to cart" }));
  expect(addItem).toHaveBeenCalledWith("addItem", { item, index: 0 });
  expect(parent).not.toHaveBeenCalled();
});

it("applies the global grid button style and position to every card", () => {
  const item = { name: "Jollof Rice", price: "₦2,500" };
  render(getComponentType("menu_grid").render({
    items: [item],
    addButtonStyle: "Outline",
    addButtonPosition: "Beside price",
    onAction: vi.fn(),
  }));
  const button = screen.getByRole("button", { name: "Add Jollof Rice to cart" });
  expect(button.textContent).toBe("Add");
  expect(button.style.border).toContain("1.5px solid");
});

it("shows a favorite heart that toggles independently of the add button", () => {
  const onAction = vi.fn();
  const item = { name: "Jollof Rice", price: "₦2,500" };
  render(getComponentType("menu_grid").render({
    items: [{ ...item, favorite: true }],
    showFavorite: "true",
    onAction,
  }));
  fireEvent.click(screen.getByRole("button", { name: "Remove Jollof Rice from favorites" }));
  expect(onAction).toHaveBeenCalledWith("toggleFavorite", { item: { ...item, favorite: true }, index: 0 });
});

it("hides the favorite heart when showFavorite is false", () => {
  render(getComponentType("menu_grid").render({
    items: [{ name: "Jollof Rice", price: "₦2,500" }],
    showFavorite: "false",
    onAction: vi.fn(),
  }));
  expect(screen.queryByRole("button", { name: /favorites/ })).toBeNull();
});

const FIELDS = [{ key: "items", label: "Menu Items", type: "list", fields: [
  { key: "name", label: "Name", type: "text" },
  { key: "background", label: "Card Background", type: "bg" },
]}];

function gridComponent() {
  return {
    type: "menu_grid",
    props: {
      items: [{ productId: "p1", name: "Beans", price: 1500 }],
    },
  };
}

it("parses canvas text-part targets and offers the part color editor", () => {
  const onChange = vi.fn();
  render(
    <PressProperties
      component={gridComponent()}
      fields={FIELDS}
      focusKey="item:items:name:0"
      screens={[]}
      onChange={onChange}
    />
  );
  expect(screen.getByText("Text: name color")).toBeTruthy();
  expect(screen.queryByText("Name")).toBeNull();
});

it("writes the picked color into the item textStyles", () => {
  const onChange = vi.fn();
  const { container } = render(
    <PressProperties
      component={gridComponent()}
      fields={FIELDS}
      focusKey="item:items:price:0"
      screens={[]}
      onChange={onChange}
    />
  );
  const input = container.querySelector('input[type="color"]');
  expect(input).toBeTruthy();
  fireEvent.change(input, { target: { value: "#ff0000" } });
  expect(onChange).toHaveBeenCalledWith(
    "items",
    [{ productId: "p1", name: "Beans", price: 1500, textStyles: { price: { color: "#ff0000" } } }]
  );
});

it("still accepts legacy whole-item targets", () => {
  const onChange = vi.fn();
  render(
    <PressProperties
      component={gridComponent()}
      fields={FIELDS}
      focusKey="item:items:0"
      screens={[]}
      onChange={onChange}
    />
  );
  expect(screen.queryByText(/Text: .* color/)).toBeNull();
});
