import { useState, useRef, useEffect, useCallback } from "react";

export default function InlineTextEditor({ component, onUpdateProp, onEndEdit }) {
  const ref = useRef(null);
  const toolbarRef = useRef(null);
  const [fontSize, setFontSize] = useState(component.props?.fontSize || 14);
  const [fontWeight, setFontWeight] = useState(component.props?.fontWeight || 400);
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
          color,
          textAlign: alignment,
          fontFamily: "'Inter',sans-serif",
          lineHeight: 1.4,
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
        <input type="number" value={fontSize} onChange={e => handleFontSize(e.target.value)} style={{ width: 40, padding: "2px 4px", borderRadius: 4, border: "none", fontSize: 11, textAlign: "center", background: "#374151", color: "#fff" }} min={8} max={96} />
        <button onClick={handleFontWeight} style={tbBtn} title="Bold">{fontWeight === 700 ? "B" : "B"}</button>
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
