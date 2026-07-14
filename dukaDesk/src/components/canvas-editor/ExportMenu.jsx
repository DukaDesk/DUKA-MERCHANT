import { useState, useRef, useEffect, useCallback } from "react";
import { generateReactCode, generateHTMLCode, generateJSON } from "./codegen";

export default function ExportMenu({ designJSON }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const download = useCallback((filename, content, mime = "text/plain") => {
    const blob = new Blob([content], { type: mime });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
    setOpen(false);
  }, []);

  const formats = [
    { label: "React JSX (.jsx)", ext: "jsx", gen: generateReactCode, mime: "text/javascript" },
    { label: "HTML (.html)", ext: "html", gen: generateHTMLCode, mime: "text/html" },
    { label: "JSON (.json)", ext: "json", gen: generateJSON, mime: "application/json" },
  ];

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen(!open)} style={{
        padding: "6px 12px", borderRadius: 6, border: "1px solid #E5E7EB",
        background: "#F3F4F6", cursor: "pointer", fontSize: 12, fontWeight: 600,
        color: "#374151", fontFamily: "'Inter',sans-serif",
      }}>
        ⬇ Export ▾
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "100%", right: 0, marginTop: 4,
          background: "#fff", border: "1px solid #E5E7EB", borderRadius: 8,
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 9999,
          minWidth: 180, overflow: "hidden",
        }}>
          {formats.map(f => (
            <div
              key={f.ext}
              onClick={() => {
                const appName = designJSON?.meta?.appName || "design";
                const code = f.gen(designJSON);
                download(`${appName.replace(/[^a-zA-Z0-9]/g, "_")}.${f.ext}`, code, f.mime);
              }}
              style={{
                padding: "10px 14px", cursor: "pointer", fontSize: 13, color: "#1C1B1D",
                fontFamily: "'Inter',sans-serif", transition: "background 0.1s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#F3F4F6"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              {f.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
