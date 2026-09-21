import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { it, expect } from "vitest";
import { ActionEditor } from "./PropertiesPanel";
it("attaches a screen, edits an existing object action, and clears the attachment", () => {
  function Harness() { const [value, setValue] = useState({ type: "navigate", payload: { screenId: "home" } }); return <><ActionEditor value={value} onChange={setValue} screens={[{ id: "home", name: "Shop" }, { id: "details", name: "Details" }]} /><output>{JSON.stringify(value)}</output></>; }
  render(<Harness />);
  expect(screen.getByLabelText("Destination page").value).toBe("home");
  fireEvent.change(screen.getByLabelText("Destination page"), { target: { value: "details" } });
  expect(JSON.parse(JSON.parse(screen.getByRole("status").textContent)).payload.screenId).toBe("details");
  fireEvent.click(screen.getByRole("button", { name: "Do nothing" }));
  expect(screen.queryByLabelText("Destination page")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Open Screen" }));
  expect(screen.getByLabelText("Destination page").value).toBe("");
});
