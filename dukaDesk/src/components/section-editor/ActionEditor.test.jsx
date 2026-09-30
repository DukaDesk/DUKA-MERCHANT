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

it("configures a backend form submission", () => {
  function Harness() { const [value, setValue] = useState(""); return <><ActionEditor value={value} onChange={setValue} screens={[]} /><output>{value}</output></>; }
  render(<Harness />);
  fireEvent.click(screen.getByRole('button', { name: 'Submit form' }));
  fireEvent.change(screen.getByLabelText('Backend form ID'), { target: { value: 'contact' } });
  expect(JSON.parse(screen.getByRole('status').textContent)).toMatchObject({ type: 'submit_form', payload: { method: 'POST', formId: 'contact' } });
  expect(screen.queryByLabelText('Backend endpoint')).toBeNull();
});
