import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ElementGallery from "./ElementGallery";

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn(), info: vi.fn() },
}));

function makeStore() {
  return {
    screen: {},
    data: { navigation: { tabs: [] }, splash: {}, meta: {} },
    addScreen: vi.fn(() => "new-screen"),
    addBodySection: vi.fn(),
    setScreenArchetype: vi.fn(),
    setScreenBackgroundColor: vi.fn(),
    setCurrentScreenId: vi.fn(),
    setSplash: vi.fn(),
    addTab: vi.fn(),
  };
}

describe("ElementGallery screens", () => {
  it("creates and loads a screen without adding a navigation tab", () => {
    const store = makeStore();
    const onAdded = vi.fn();
    render(<ElementGallery browseType="Screens" store={store} onAdded={onAdded} />);

    fireEvent.click(screen.getByTitle("Add Home screen"));

    expect(store.addScreen).toHaveBeenCalledWith(null, "Home");
    expect(store.addBodySection).toHaveBeenCalledWith(
      "new-screen",
      expect.objectContaining({ name: "Home — Main" })
    );
    expect(store.setCurrentScreenId).toHaveBeenCalledWith("new-screen");
    expect(store.addTab).not.toHaveBeenCalled();
    expect(onAdded).toHaveBeenCalledWith(null, null);
  });
});
