import { useState, useRef, useEffect, useCallback } from "react";
import { FONT_FAMILIES } from "./componentTypes";
export default function InlineTextEditor({ component, onUpdateProp, onEndEdit }) {
  const ref = useRef(null);
  const toolbarRef = useRef(null);
  const [fontSize, setFontSize] = useState(component.props?.fontSize || 14);
  const [fontWeight, setFontWeight] = useState(component.props?.fontWeight || 400);
  const [fontFamily, setFontFamily] = useState(component.props?.fontFamily || "Inter");
  const [fontStyle, setFontStyle] = useState(component.props?.fontStyle || "normal");
  const [lineHeight, setLineHeight] = useState(component.props?.lineHeight ?? 1.4);
  const [letterSpacing, setLetterSpacing] = useState(component.props?.letterSpacing ?? 0);
  const [textTransform, setTextTransform] = useState(component.props?.textTransform || "none");
  const [alignment, setAlignment] = useState(component.props?.alignment || "left");
  const [color, setColor] = useState(component.props?.color || "#1C1B1D");

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
      const sel = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(ref.current);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, []);

  const handleBlur = useCallback(() => {
    if (ref.current) {
      onUpdateProp(component.id, "text", ref.current.innerText);
    }
    onEndEdit();
  }, [component.id, onUpdateProp, onEndEdit]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") {
      if (ref.current) {
        onUpdateProp(component.id, "text", ref.current.innerText);
      }
      onEndEdit();
    }
  }, [component.id, onUpdateProp, onEndEdit]);

  const applyStyle = useCallback((styleFn) => {
    styleFn();
    if (ref.current) {
      onUpdateProp(component.id, "text", ref.current.innerText);
    }
  }, [component.id, onUpdateProp]);

  const handleFontSize = useCallback((val) => {
    const v = Number(val);
    setFontSize(v);
    onUpdateProp(component.id, "fontSize", v);
  }, [component.id, onUpdateProp]);

  const handleFontWeight = useCallback(() => {
    const next = fontWeight === 700 ? 400 : 700;
    setFontWeight(next);
    onUpdateProp(component.id, "fontWeight", next);
  }, [fontWeight, component.id, onUpdateProp]);

  const handleAlignment = useCallback((val) => {
    setAlignment(val);
    onUpdateProp(component.id, "alignment", val);
  }, [component.id, onUpdateProp]);

  const handleColor = useCallback((val) => {
    setColor(val);
    onUpdateProp(component.id, "color", val);
  }, [component.id, onUpdateProp]);
  const handleFamily = useCallback((v) => { setFontFamily(v); onUpdateProp(component.id, "fontFamily", v); }, [component.id, onUpdateProp]);
  const handleStyle = useCallback(() => { const n = fontStyle === "italic" ? "normal" : "italic"; setFontStyle(n); onUpdateProp(component.id, "fontStyle", n); }, [fontStyle, component.id, onUpdateProp]);
  const handleLineHeight = useCallback((v) => { const n = Number(v); setLineHeight(n); onUpdateProp(component.id, "lineHeight", n); }, [component.id, onUpdateProp]);
  const handleLetterSpacing = useCallback((v) => { const n = Number(v); setLetterSpacing(n); onUpdateProp(component.id, "letterSpacing", n); }, [component.id, onUpdateProp]);
  const handleTransform = useCallback((v) => { setTextTransform(v); onUpdateProp(component.id, "textTransform", v); }, [component.id, onUpdateProp]);

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: component.x,
          top: component.y,
          width: component.width,
          height: component.height,
          zIndex: 10000,
          fontSize,
          fontWeight,
          fontFamily: `'${fontFamily}',sans-serif`,
          fontStyle,
          lineHeight,
          letterSpacing: `${letterSpacing}px`,
          textTransform: textTransform !== "none" ? textTransform : "none",
          color,
          textAlign: alignment,
          padding: "2px 0",
          outline: "2px solid #60A5FA",
          outlineOffset: -1,
          borderRadius: 2,
          background: "#fff",
          cursor: "text",
        }}
        contentEditable
        suppressContentEditableWarning
        ref={ref}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        dangerouslySetInnerHTML={{ __html: component.props?.text || "" }}
      />
      <div
        ref={toolbarRef}
        style={{
          position: "absolute",
          top: component.y - 40,
          left: component.x,
          display: "flex", gap: 4, padding: "4px 8px",
          background: "#1C1B1D", borderRadius: 8,
          zIndex: 10001,
          alignItems: "center",
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
        }}
      >
        <select value={fontFamily} onChange={e => handleFamily(e.target.value)} style={{ width: 90, padding: "2px 4px", borderRadius: 4, border: "none", fontSize: 11, background: "#374151", color: "#fff" }} title="Font Family">{FONT_FAMILIES.map(f => <option key={f} value={f}>{f}</option>)}</select>
        <input type="number" value={fontSize} onChange={e => handleFontSize(e.target.value)} style={{ width: 44, padding: "2px 4px", borderRadius: 4, border: "none", fontSize: 11, textAlign: "center", background: "#374151", color: "#fff" }} min={8} max={96} />
        <button onClick={handleFontWeight} style={{ ...tbBtn, background: String(fontWeight) === "700" ? "#F4A026" : "transparent", color: String(fontWeight) === "700" ? "#1C1B1D" : "#fff" }} title="Bold">B</button>
        <button onClick={handleStyle} style={{ ...tbBtn, background: fontStyle === "italic" ? "#F4A026" : "transparent", fontStyle: "italic" }} title="Italic">I</button>
        <select value={textTransform} onChange={e => handleTransform(e.target.value)} style={{ width: 46, padding: "2px 2px", borderRadius: 4, border: "none", fontSize: 10, background: "#374151", color: "#fff" }} title="Transform"><option value="none">Aa</option><option value="uppercase">AA</option><option value="lowercase">aa</option><option value="capitalize">Aa</option></select>
        <input type="number" step="0.1" value={lineHeight} onChange={e => handleLineHeight(e.target.value)} style={{ width: 42, padding: "2px 4px", borderRadius: 4, border: "none", fontSize: 11, textAlign: "center", background: "#374151", color: "#fff" }} title="Line Height" />
        <input type="number" step="0.5" value={letterSpacing} onChange={e => handleLetterSpacing(e.target.value)} style={{ width: 42, padding: "2px 4px", borderRadius: 4, border: "none", fontSize: 11, textAlign: "center", background: "#374151", color: "#fff" }} title="Letter Spacing" />
        <button onClick={() => handleAlignment("left")} style={{ ...tbBtn, background: alignment === "left" ? "#F4A026" : "transparent" }} title="Align Left">≡</button>
        <button onClick={() => handleAlignment("center")} style={{ ...tbBtn, background: alignment === "center" ? "#F4A026" : "transparent" }} title="Align Center">≡</button>
        <button onClick={() => handleAlignment("right")} style={{ ...tbBtn, background: alignment === "right" ? "#F4A026" : "transparent" }} title="Align Right">≡</button>
        <input type="color" value={color} onChange={e => handleColor(e.target.value)} style={{ width: 24, height: 24, padding: 0, border: "none", borderRadius: 4, cursor: "pointer" }} title="Text Color" />
      </div>
    </>
  );
}

const tbBtn = {
  padding: "2px 8px", borderRadius: 4, border: "none", cursor: "pointer",
  fontSize: 12, fontWeight: 700, color: "#fff", fontFamily: "'Inter',sans-serif",
  lineHeight: 1.6,
};
