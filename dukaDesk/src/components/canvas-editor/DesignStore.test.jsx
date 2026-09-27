import { act, renderHook, waitFor } from "@testing-library/react";
import { it, expect, vi } from "vitest";
import { useDesignStore, getDefaultData } from "./DesignStore";
vi.mock("../../services/api", () => ({ getDesignData: vi.fn(async () => null), saveDesignData: vi.fn(async () => ({})) }));
it("keeps cleared and custom slugs through edits and local reload", async () => {
  localStorage.clear();
  const initial = getDefaultData(); initial.meta = { ...initial.meta, appName: "Old Name", slug: "custom-url" };
  const { result, unmount } = renderHook(() => useDesignStore(initial));
  act(() => result.current.setMeta({ appName: "New Name" }));
  expect(result.current.data.meta.slug).toBe("custom-url");
  act(() => result.current.setMeta({ slug: "" }));
  expect(result.current.data.meta.slug).toBe("");
  act(() => result.current.setMeta({ slug: "my-new-" }));
  expect(result.current.data.meta.slug).toBe("my-new-");
  act(() => result.current.setMeta({ slug: "my-new-shop" }));
  localStorage.setItem("dukadesk_design", JSON.stringify(result.current.data));
  unmount();
  const reloaded = renderHook(() => useDesignStore());
  expect(reloaded.result.current.data.meta.slug).toBe("my-new-shop");
  reloaded.unmount();
});

it("adds the first component to an empty screen in one undoable edit", () => {
  const initial = getDefaultData();
  const { result } = renderHook(() => useDesignStore(initial, { deferSave: true }));
  let added;
  act(() => { added = result.current.addComponentToScreen("button", { label: "Start" }); });
  const sections = result.current.screen.bodySections;
  expect(sections).toHaveLength(1);
  expect(sections[0].id).toBe(added.sectionId);
  expect(sections[0].components[0]).toMatchObject({ id: added.id, type: "button", props: { label: "Start" } });
  act(() => result.current.undo());
  expect(result.current.screen.bodySections).toHaveLength(0);
});
