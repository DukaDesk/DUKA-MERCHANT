import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { AMBER, NAVY } from "../../theme";

export function MerchantDialog({ kind, title, message, initialValue = "", confirmLabel = "OK", onClose }) {
  const dialogRef = useRef(null);
  const [value, setValue] = useState(initialValue);
  const cancelled = kind === "prompt" ? null : false;
  useEffect(() => {
    const previous = document.activeElement;
    dialogRef.current.showModal();
    return () => { if (previous?.isConnected) previous.focus?.(); };
  }, []);
  const button = { padding: "10px 18px", borderRadius: 10, border: "1px solid #D1D5DB", cursor: "pointer", fontWeight: 600 };
  return <dialog ref={dialogRef} aria-labelledby="merchant-dialog-title" aria-describedby="merchant-dialog-message"
    onCancel={event => { event.preventDefault(); onClose(cancelled); }}
    style={{ width: "min(440px, calc(100vw - 32px))", boxSizing: "border-box", border: "none", borderRadius: 16, padding: 24, color: NAVY, background: "#fff", boxShadow: "0 24px 80px #0004", fontFamily: "Inter, sans-serif" }}>
    <style>{"dialog[aria-labelledby='merchant-dialog-title']::backdrop { background: rgba(15, 23, 42, 0.55); }"}</style>
    <form onSubmit={event => { event.preventDefault(); if (kind !== "prompt" || value.trim()) onClose(kind === "prompt" ? value.trim() : true); }}>
      <h2 id="merchant-dialog-title" style={{ margin: "0 0 12px", fontSize: 20 }}>{title}</h2>
      <p id="merchant-dialog-message" style={{ margin: "0 0 20px", lineHeight: 1.5, whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{message}</p>
      {kind === "prompt" && <input aria-label="Section name" autoFocus value={value} onChange={event => setValue(event.target.value)}
        style={{ width: "100%", boxSizing: "border-box", padding: 12, border: "1px solid #D1D5DB", borderRadius: 8, marginBottom: 20, fontSize: 14 }} />}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
        {kind !== "alert" && <button type="button" autoFocus={kind === "confirm"} onClick={() => onClose(cancelled)} style={{ ...button, background: "#fff", color: NAVY }}>Cancel</button>}
        <button type="submit" autoFocus={kind === "alert"} disabled={kind === "prompt" && !value.trim()} style={{ ...button, background: AMBER, color: NAVY }}>{confirmLabel}</button>
      </div>
    </form>
  </dialog>;
}

// Serialize requests so overlapping failures cannot stack focus-trapping dialogs.
let pending = Promise.resolve();
function openDialog(options) {
  const result = pending.then(() => new Promise(resolve => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    const root = createRoot(host);
    let closed = false;
    root.render(<MerchantDialog {...options} onClose={value => {
      if (closed) return;
      closed = true;
      queueMicrotask(() => { root.unmount(); host.remove(); resolve(value); });
    }} />);
  }));
  pending = result.catch(() => {});
  return result;
}
export const showAlert = (message, title = "Notice") => openDialog({ kind: "alert", title, message });
export const confirmDialog = (message, title = "Confirm action", confirmLabel = "Confirm") => openDialog({ kind: "confirm", title, message, confirmLabel });
export const promptDialog = (message, initialValue = "", title = "Rename section") => openDialog({ kind: "prompt", title, message, initialValue, confirmLabel: "Save" });