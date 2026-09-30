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
  expect(store.insertComponentAt).toHaveBeenCalledWith("outer", "inner", 0, "button", expect.any(Object));
});
it("selects a layout from its plus without opening an insertion menu", () => {
  const store = fixture();
  store.screen.bodySections[0].components = [{ id: "layout", type: "row", props: { template: "1/1" }, children: [] }];
  const select = vi.fn();
  const choose = vi.fn();
  render(<SectionRenderer store={store} selectedSectionId="outer" selectedComponentId="layout" onSelectSection={vi.fn()} onSelectComponent={select} onChooseLayout={choose} />);
  fireEvent.click(screen.getAllByRole("button", { name: "Select section" })[0]);
  expect(select).toHaveBeenCalledWith("outer", "layout");
  expect(choose).not.toHaveBeenCalled();
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

it("adds components without a selection and opens their properties", () => {
  const store = fixture();
  store.screen.bodySections = [];
  store.addComponentToScreen = vi.fn(() => ({ sectionId: "new-section", id: "new-button" }));
  const select = vi.fn();
  render(<PropertiesPanel store={store} componentCategory="buttons" onSelectComponent={select} />);
  const button = screen.getByRole("button", { name: "Button" });
  expect(button.disabled).toBe(false);
  fireEvent.click(button);
  expect(store.addComponentToScreen).toHaveBeenCalledWith("button", expect.any(Object));
  expect(select).toHaveBeenCalledWith("new-section", "new-button");
});
it("allows a layout to be the first item on an empty screen", () => {
  const store = fixture();
  store.screen.bodySections = [];
  store.addComponentToScreen = vi.fn(() => ({ sectionId: "new-section", id: "layout" }));
  const added = vi.fn();
  render(<ElementGallery browseType="Layout" store={store} onAdded={added} />);
  fireEvent.click(screen.getByRole("button", { name: "Section" }));
  expect(store.addComponentToScreen).toHaveBeenCalledWith("nested_section", expect.any(Object));
  expect(added).toHaveBeenCalledWith("new-section", "layout");
});

it("selects nested and outer sections without extra buttons", () => {
  const store = fixture();
  const select = vi.fn();
  const selectSection = vi.fn();
  render(<SectionRenderer store={store} onSelectSection={selectSection} onSelectComponent={select} />);
  fireEvent.click(screen.getAllByRole("button", { name: "Select section" })[0]);
  expect(select).toHaveBeenCalledWith("outer", "inner");
  fireEvent.click(screen.getAllByRole("button", { name: "Select section" })[1]);
  expect(selectSection).toHaveBeenCalledWith("outer");
  expect(screen.queryByRole("button", { name: "Inner section" })).toBeNull();
  expect(screen.queryByRole("button", { name: "Components" })).toBeNull();
});

it("inserts a chosen component into the targeted layout slot", () => {
  const store = fixture();
  render(<PropertiesPanel store={store} selectedSectionId="outer" selectedComponentId="inner" componentCategory="buttons" insertionTarget={{ sectionId: "outer", parentId: "inner", index: 0 }} />);
  fireEvent.click(screen.getByRole("button", { name: "Button" }));
  expect(store.insertComponentAt).toHaveBeenCalledWith("outer", "inner", 0, "button", expect.any(Object));
  expect(store.addComponentToSection).not.toHaveBeenCalled();
});

it("selects an empty screen and outlines the full phone", () => {
  const store = fixture(); store.screen.bodySections = [];
  const select = vi.fn();
  const view = render(<SectionRenderer store={store} onSelectScreen={select} />);
  fireEvent.click(screen.getByRole("button", { name: "Select screen" }));
  expect(select).toHaveBeenCalledTimes(1);
  view.rerender(<SectionRenderer store={store} onSelectScreen={select} screenSelected />);
  const phone = screen.getByRole("button", { name: "Select screen" }).parentElement.parentElement.parentElement;
  expect(phone.style.outline).toContain("solid");
});
it("shows screen properties and component categories for a selected screen", () => {
  const store = fixture(); store.screen.bodySections = []; store.currentScreenId = "home"; store.renameScreen = vi.fn();
  render(<PropertiesPanel store={store} screenSelected componentCategory="choose" />);
  expect(screen.queryByText("No Selection")).toBeNull();
  fireEvent.change(screen.getByLabelText("Screen Name"), { target: { value: "Shop" } });
  expect(store.renameScreen).toHaveBeenCalledWith("home", "Shop");
  expect(screen.getByRole("button", { name: "Text" })).toBeTruthy();
});

it.each(['1/2|1/2', '1/3|2/3', '2/3|1/3', '1/3|1/3|1/3'])('selects the exact empty column when its plus is clicked: %s', template => {
  const store = fixture();
  store.screen.bodySections[0].components = [{ id: 'columns', type: 'row', props: { template }, children: [] }];
  const choose = vi.fn();
  render(<SectionRenderer store={store} selectedSectionId="outer" selectedComponentId="columns" onSelectSection={vi.fn()} onSelectComponent={vi.fn()} onChooseComponents={choose} />);
  const plus = screen.getAllByRole('button', { name: 'Select section' })[1];
  fireEvent.click(plus.querySelector('path'));
  expect(choose).toHaveBeenCalledWith({ sectionId: 'outer', parentId: 'columns', index: 1 }, 'choose');
  expect(plus.closest('[title="Select empty slot to add content"]').style.border).toContain('2px solid');
});

it.each(['1/2|1/2', '1/3|2/3', '2/3|1/3', '1/3|1/3|1/3'])('keeps both pickers inside the selected child parent: %s', template => {
 const store = fixture();
 store.screen.bodySections[0].components = [{ id: 'columns', type: 'row', props: { template }, children: [{ id: 'existing', type: 'button', props: {} }] }];
 const view = render(<PropertiesPanel store={store} selectedSectionId="outer" selectedComponentId="existing" componentCategory="buttons" />);
 fireEvent.click(screen.getByRole('button', { name: 'Button' }));
 expect(store.insertComponentAt).toHaveBeenCalledWith('outer', 'columns', 1, 'button', expect.any(Object));
 view.unmount();
 render(<ElementGallery browseType="Layout" store={store} selectedSectionId="outer" selectedComponentId="existing" />);
 fireEvent.click(screen.getByRole('button', { name: 'Section' }));
 expect(store.insertComponentAt).toHaveBeenCalledWith('outer', 'columns', 1, 'nested_section', expect.any(Object));
 expect(store.addComponentToSection).not.toHaveBeenCalled();
});

it.each(['1/2|1/2', '1/3|2/3', '2/3|1/3', '1/3|1/3|1/3'])('shows the picker for a selected row and honors its chosen column: %s', template => {
 const store = fixture();
 store.screen.bodySections[0].components = [{ id: 'columns', type: 'row', props: { template }, children: [] }];
 render(<PropertiesPanel store={store} selectedSectionId="outer" selectedComponentId="columns" componentCategory="buttons" insertionTarget={{ sectionId: 'outer', parentId: 'columns', index: 1 }} />);
 fireEvent.click(screen.getByRole('button', { name: 'Button' }));
 expect(store.insertComponentAt).toHaveBeenCalledWith('outer', 'columns', 1, 'button', expect.any(Object));
 expect(store.addComponentToSection).not.toHaveBeenCalled();
});
