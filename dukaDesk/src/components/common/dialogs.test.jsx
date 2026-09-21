import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, it, expect, vi } from "vitest";
import { MerchantDialog, showAlert } from "./dialogs";

beforeEach(() => {
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
});
it("requires confirmation and allows Escape cancellation", () => {
  const close = vi.fn();
  render(<MerchantDialog kind="confirm" title="Delete screen" message="Delete Shop?" onClose={close} />);
  expect(screen.getByRole("dialog").getAttribute("open")).toBe("");
  fireEvent(screen.getByRole("dialog"), new Event("cancel", { bubbles: false, cancelable: true }));
  expect(close).toHaveBeenCalledWith(false);
  fireEvent.click(screen.getByRole("button", { name: "OK" }));
  expect(close).toHaveBeenLastCalledWith(true);
});
it("prefills rename input, rejects whitespace and returns the edited name", () => {
  const close = vi.fn();
  render(<MerchantDialog kind="prompt" title="Rename section" message="Enter a name" initialValue="Shop" confirmLabel="Save" onClose={close} />);
  const input = screen.getByLabelText("Section name");
  expect(input.value).toBe("Shop");
  fireEvent.change(input, { target: { value: "   " } });
  expect(screen.getByRole("button", { name: "Save" }).disabled).toBe(true);
  fireEvent.change(input, { target: { value: " Specials " } });
  fireEvent.click(screen.getByRole("button", { name: "Save" }));
  expect(close).toHaveBeenCalledWith("Specials");
  fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
  expect(close).toHaveBeenLastCalledWith(null);
});
it("queues alerts and removes the modal after acknowledgment", async () => {
  let first, second;
  await act(async () => { first = showAlert("First failure"); second = showAlert("Second failure"); });
  expect(screen.getByText("First failure")).toBeTruthy();
  expect(screen.queryByText("Second failure")).toBeNull();
  await act(async () => { fireEvent.click(screen.getByRole("button", { name: "OK" })); await first; });
  expect(screen.getByText("Second failure")).toBeTruthy();
  await act(async () => { fireEvent.click(screen.getByRole("button", { name: "OK" })); await second; });
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
});