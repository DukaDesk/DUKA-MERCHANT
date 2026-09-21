import { useState } from "react";
import { ICON_LIBRARY, IconGlyph } from "../canvas-editor/componentTypes";
import { useEditorTheme } from "./editorTheme";

export default function IconPicker({ value, onChange }) {
  const { theme, textInput } = useEditorTheme();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("icons");
  const [query, setQuery] = useState("");
  return <div>
    <button type="button" aria-label="Choose icon" aria-expanded={open} onClick={() => setOpen(!open)} style={{ ...textInput, display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}><IconGlyph name={value} size={20} /><span>{value || "Choose icon"}</span></button>
    {open && <div style={{ border: "1px solid " + theme.border, padding: 8, borderRadius: 8 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <button type="button" onClick={() => setMode("icons")} aria-pressed={mode === "icons"}>Icons</button>
        <button type="button" onClick={() => setMode("emoji")} aria-pressed={mode === "emoji"}>Emoji</button>
      </div>
      {mode === "icons" ? <>
        <input aria-label="Search icons" placeholder="Search icons" value={query} onChange={e => setQuery(e.target.value)} style={textInput} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 4, maxHeight: 180, overflowY: "auto", marginTop: 6 }}>
          {Object.keys(ICON_LIBRARY).filter(name => name.toLowerCase().includes(query.toLowerCase())).map(name => <button type="button" key={name} title={name} aria-label={name} aria-pressed={value === name} onClick={() => { onChange(name); setOpen(false); }} style={{ padding: 6, border: "1px solid " + (value === name ? theme.active : theme.border), background: theme.surface, color: theme.text, borderRadius: 6, cursor: "pointer" }}><IconGlyph name={name} size={18} /></button>)}
        </div>
      </> : <input aria-label="Emoji" value={ICON_LIBRARY[value] ? "" : value || ""} onChange={e => onChange(e.target.value)} style={textInput} />}
    </div>}
  </div>;
}