import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SectionRenderer from "./SectionRenderer";

function makeStore() {
  return {
    data: {
      meta: {},
      navigation: { tabs: [] },
      screens: {
        home: { name: "Home", backgroundColor: "#fff", bodySections: [] },
      },
    },
    screen: {
      backgroundColor: "#fff",
      bodySections: [{
        id: "s1", name: "Section", components: [
          { id: "c1", type: "text_block", props: { text: "Hello" } },
        ],
      }],
    },
    currentScreenId: "home",
    duplicateComponentInSection: vi.fn(),
    removeComponentFromSection: vi.fn(),
  };
}

function renderCanvas(store) {
  return render(
    <SectionRenderer
      store={store}
      selectedSectionId="s1"
      selectedComponentId={null}
      onSelectSection={() => {}}
      onSelectComponent={() => {}}
    />
  );
}

describe("SectionRenderer context menu", () => {
  it("opens Edit/Duplicate/Delete options on right-click", () => {
    const store = makeStore();
    const onSelectComponent = vi.fn();
    render(
      <SectionRenderer
        store={store}
        selectedSectionId="s1"
        selectedComponentId={null}
        onSelectSection={() => {}}
        onSelectComponent={onSelectComponent}
      />
    );

    expect(screen.queryByRole("menu", { name: "Component options" })).toBeNull();
    fireEvent.contextMenu(screen.getByText("Hello"));
    expect(screen.getByRole("menu", { name: "Component options" })).toBeTruthy();
    expect(onSelectComponent).toHaveBeenCalledWith("s1", "c1");
  });

  it("duplicates and deletes through the menu", () => {
    const store = makeStore();
    renderCanvas(store);

    fireEvent.contextMenu(screen.getByText("Hello"));
    fireEvent.click(screen.getByRole("menuitem", { name: "Duplicate" }));
    expect(store.duplicateComponentInSection).toHaveBeenCalledWith("s1", "c1");

    fireEvent.contextMenu(screen.getByText("Hello"));
    fireEvent.click(screen.getByRole("menuitem", { name: "Delete" }));
    expect(store.removeComponentFromSection).toHaveBeenCalledWith("s1", "c1");
  });
});
