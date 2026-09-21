import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import PropertiesPanel from "./PropertiesPanel";
import SectionRenderer from "./SectionRenderer";
import ElementGallery from "./ElementGallery";
import { getComponentCatalog } from "./componentCatalog";

function fixture() {
  const child = { id: "inner", type: "nested_section", props: {}, children: [] };
  const section = { id: "outer", name: "Outer", components: [child] };
  const page = { bodySections: [section] };
  return { data: { screens: { home: page }, navigation: {}, meta: {} }, screen: page, addComponentToSection: vi.fn(), insertComponentAt: vi.fn(() => "new-section") };
}
it("hides Add Element until a section is selected and inserts into that section", () => {
  const store = fixture();
  const view = render(<PropertiesPanel store={store} />);
  expect(screen.queryByText("Add Element")).toBeNull();
  view.rerender(<PropertiesPanel store={store} selectedSectionId="outer" selectedComponentId="inner" componentCategory="buttons" />);
  expect(screen.getByText("Add Element")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Button" }));
  expect(store.addComponentToSection).toHaveBeenCalledWith("outer", "button", expect.any(Object), "inner");
});
it("restores inline section insertion and selects the newly created section", () => {
  const store = fixture();
  store.screen.bodySections[0].components = [{ id: "layout", type: "row", props: { template: "1/1" }, children: [] }];
  const select = vi.fn();
  const choose = vi.fn();
  render(<SectionRenderer store={store} selectedSectionId="outer" selectedComponentId="layout" onSelectSection={vi.fn()} onSelectComponent={select} onChooseLayout={choose} />);
  fireEvent.click(screen.getAllByRole("button", { name: "Add a section" })[0]);
  expect(choose).toHaveBeenCalledWith({ sectionId: "outer", parentId: "layout", index: 0 });
  expect(store.insertComponentAt).not.toHaveBeenCalled();
});
it("inserts the chosen layout into the original target instead of the root", () => {
  const store = fixture();
  const added = vi.fn();
  render(<ElementGallery browseType="Layout" store={store} selectedSectionId="outer" insertionTarget={{ sectionId: "outer", parentId: "inner", index: 0 }} onAdded={added} onClose={vi.fn()} />);
  fireEvent.click(screen.getByRole("button", { name: "Section" }));
  expect(store.insertComponentAt).toHaveBeenCalledWith("outer", "inner", 0, "nested_section", expect.any(Object));
  expect(store.addComponentToSection).not.toHaveBeenCalled();
  expect(added).toHaveBeenCalledWith("outer", "new-section");
});
it("shows only the selected category and keeps text variants distinct without duplicate entries", () => {
  const store = fixture();
  render(<PropertiesPanel store={store} selectedSectionId="outer" selectedComponentId="inner" componentCategory="text" />);
  expect(screen.getByRole("button", { name: "Heading" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Paragraph" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Accordion" }).disabled).toBe(true);
  expect(screen.queryByRole("button", { name: "Button" })).toBeNull();
  const choices = getComponentCatalog().flatMap(category => category.components);
  const keys = choices.map(item => item.catalogId || item.type);
  expect(new Set(keys).size).toBe(keys.length);
  expect(choices.some(item => item.type === "primary_button")).toBe(false);
});
