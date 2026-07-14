import { useState, useRef, useCallback } from "react";
import { getComponentType } from "./componentTypes";

const HANDLE_SIZE = 8;
const ROTATION_HANDLE_DIST = 24;

const cornerHandles = [
  { id: "nw", cursor: "nw-resize", style: { top: -HANDLE_SIZE/2, left: -HANDLE_SIZE/2 } },
  { id: "ne", cursor: "ne-resize", style: { top: -HANDLE_SIZE/2, right: -HANDLE_SIZE/2 } },
  { id: "sw", cursor: "sw-resize", style: { bottom: -HANDLE_SIZE/2, left: -HANDLE_SIZE/2 } },
  { id: "se", cursor: "se-resize", style: { bottom: -HANDLE_SIZE/2, right: -HANDLE_SIZE/2 } },
  { id: "n", cursor: "n-resize", style: { top: -HANDLE_SIZE/2, left: "50%", marginLeft: -HANDLE_SIZE/2 } },
  { id: "s", cursor: "s-resize", style: { bottom: -HANDLE_SIZE/2, left: "50%", marginLeft: -HANDLE_SIZE/2 } },
  { id: "e", cursor: "e-resize", style: { top: "50%", right: -HANDLE_SIZE/2, marginTop: -HANDLE_SIZE/2 } },
  { id: "w", cursor: "w-resize", style: { top: "50%", left: -HANDLE_SIZE/2, marginTop: -HANDLE_SIZE/2 } },
];

function buildFillCSS(fills) {
  if (!fills || fills.length === 0) return "transparent";
  const solid = fills.find(f => f.type === "solid");
  if (solid) return solid.color || "transparent";
  const grad = fills.find(f => f.type === "gradient");
  if (grad) return `linear-gradient(135deg, ${grad.stops?.map(s => `${s.color} ${s.offset * 100}%`).join(", ") || "#E5E1E3, #C8C5CD"})`;
  return "transparent";
}

function buildStrokeCSS(strokes) {
  if (!strokes || strokes.length === 0) return undefined;
  const s = strokes[0];
  return `${s.width || 0}px solid ${s.color || "transparent"}`;
}

function buildShadowCSS(effects) {
  if (!effects || effects.length === 0) return undefined;
  const shadows = effects
    .filter(e => e.type === "drop-shadow")
    .map(e => `${e.offsetX || 0}px ${e.offsetY || 0}px ${e.blur || 0}px ${e.spread || 0}px ${e.color || "rgba(0,0,0,0.15)"}`)
    .join(", ");
  return shadows || undefined;
}

function buildBlurFilter(effects) {
  if (!effects) return undefined;
  const blur = effects.find(e => e.type === "blur");
  return blur ? `blur(${blur.blur || 0}px)` : undefined;
}

function buildRadius(cornerRadius) {
  if (cornerRadius == null) return 0;
  if (typeof cornerRadius === "number") return cornerRadius;
  return `${cornerRadius.tl || 0}px ${cornerRadius.tr || 0}px ${cornerRadius.br || 0}px ${cornerRadius.bl || 0}px`;
}

export default function CanvasComponent({ component, isSelected, onSelect, onMove, onMoveEnd, onResize, gridSize, activeTool = "select", onDoubleClick }) {
  const def = getComponentType(component.type);
  const [isHovered, setIsHovered] = useState(false);
  const dragRef = useRef(null);
  const resizeRef = useRef(null);

  const handleMouseDown = useCallback((e) => {
    if (component.locked || activeTool !== "select") return;
    e.stopPropagation();
    const multi = e.shiftKey;
    onSelect(component.id, multi);
    const startX = e.clientX;
    const startY = e.clientY;
    const startCx = component.x;
    const startCy = component.y;
    dragRef.current = true;
    const onMove = (ev) => {
      if (!dragRef.current) return;
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      const snap = gridSize || 1;
      const newX = Math.round((startCx + dx) / snap) * snap;
      const newY = Math.round((startCy + dy) / snap) * snap;
      onMove(component.id, Math.max(0, newX), Math.max(0, newY));
    };
    const onUp = () => { dragRef.current = false; onMoveEnd?.(); document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, [component, onSelect, onMove, onMoveEnd, gridSize, activeTool]);

  const handleResizeStart = useCallback((e, handleId) => {
    if (component.locked || activeTool !== "select") return;
    e.stopPropagation();
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startCx = component.x;
    const startCy = component.y;
    const startW = component.width;
    const startH = component.height;
    resizeRef.current = true;
    const onMove = (ev) => {
      if (!resizeRef.current) return;
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      const snap = gridSize || 1;
      let newX = startCx, newY = startCy, newW = startW, newH = startH;
      if (handleId.includes("e")) newW = Math.max(20, Math.round((startW + dx) / snap) * snap);
      if (handleId.includes("w")) { newW = Math.max(20, Math.round((startW - dx) / snap) * snap); newX = Math.round((startCx + dx) / snap) * snap; }
      if (handleId.includes("s")) newH = Math.max(20, Math.round((startH + dy) / snap) * snap);
      if (handleId.includes("n")) { newH = Math.max(20, Math.round((startH - dy) / snap) * snap); newY = Math.round((startCy + dy) / snap) * snap; }
      onResize(component.id, newX, newY, newW, newH);
    };
    const onUp = () => { resizeRef.current = false; document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, [component, onResize, gridSize, activeTool]);

  if (!def) {
    return (
      <div style={{ position: "absolute", left: component.x, top: component.y, width: component.width, height: component.height, border: "1px dashed #E74C3C", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", color: "#E74C3C", fontSize: 11, background: "#FEF2F2" }}>
        ? {component.type}
      </div>
    );
  }

  const cursor = activeTool === "select" ? (component.locked ? "default" : "move") : "crosshair";
  const fillBg = buildFillCSS(component.fills);
  const strokeVal = buildStrokeCSS(component.strokes);
  const shadowVal = buildShadowCSS(component.effects);
  const blurVal = buildBlurFilter(component.effects);
  const radiusVal = buildRadius(component.cornerRadius);

  const outerStyle = {
    position: "absolute",
    left: component.x,
    top: component.y,
    width: component.width,
    height: component.height,
    cursor,
    outline: isSelected ? "2px solid #F4A026" : isHovered ? "1px solid #60A5FA" : "none",
    outlineOffset: 1,
    zIndex: component.zIndex || 0,
    opacity: component.visible ? (component.opacity ?? 1) : 0.3,
    transform: component.rotation ? `rotate(${component.rotation}deg)` : undefined,
    transformOrigin: "center center",
  };

  const innerStyle = {
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    overflow: "hidden",
    background: fillBg,
    borderRadius: radiusVal,
    border: strokeVal,
    boxShadow: shadowVal,
    filter: blurVal,
  };

  return (
      <div style={outerStyle} onMouseDown={handleMouseDown} onDoubleClick={(e) => { e.stopPropagation(); onDoubleClick?.(component.id); }} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div style={innerStyle}>
        {def.render({ ...component.props, _fills: component.fills, _strokes: component.strokes })}
      </div>

      {isSelected && activeTool === "select" && !component.locked && (
        <>
          {cornerHandles.map(h => (
            <div key={h.id} style={{ position: "absolute", width: HANDLE_SIZE, height: HANDLE_SIZE, background: "#fff", border: "2px solid #F4A026", borderRadius: 1, cursor: h.cursor, zIndex: 10, ...h.style }} onMouseDown={(e) => handleResizeStart(e, h.id)} />
          ))}
          <div style={{ position: "absolute", top: -ROTATION_HANDLE_DIST - HANDLE_SIZE, left: "50%", marginLeft: -HANDLE_SIZE / 2, width: HANDLE_SIZE, height: HANDLE_SIZE, background: "#fff", border: "2px solid #60A5FA", borderRadius: "50%", cursor: "grab", zIndex: 10 }} />
          <div style={{ position: "absolute", top: -ROTATION_HANDLE_DIST, left: "50%", width: 1, height: ROTATION_HANDLE_DIST, background: "#60A5FA", zIndex: 9, pointerEvents: "none" }} />
        </>
      )}
    </div>
  );
}
