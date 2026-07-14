import { useState, useRef, useCallback } from "react";

const HANDLE_SIZE = 8;

const handles = [
  { id: "nw", cursor: "nw-resize", style: { top: -HANDLE_SIZE/2, left: -HANDLE_SIZE/2 } },
  { id: "ne", cursor: "ne-resize", style: { top: -HANDLE_SIZE/2, right: -HANDLE_SIZE/2 } },
  { id: "sw", cursor: "sw-resize", style: { bottom: -HANDLE_SIZE/2, left: -HANDLE_SIZE/2 } },
  { id: "se", cursor: "se-resize", style: { bottom: -HANDLE_SIZE/2, right: -HANDLE_SIZE/2 } },
];

export default function MultiSelectBox({ componentIds, components, onResize, onMove, gridSize = 10 }) {
  const snap = v => Math.round(v / gridSize) * gridSize;
  const dragRef = useRef(null);

  const selected = componentIds.map(id => components.find(c => c.id === id)).filter(Boolean);
  if (selected.length < 2) return null;

  const minX = Math.min(...selected.map(c => c.x));
  const minY = Math.min(...selected.map(c => c.y));
  const maxX = Math.max(...selected.map(c => c.x + c.width));
  const maxY = Math.max(...selected.map(c => c.y + c.height));

  const startRefs = useRef({});

  const handleResizeStart = useCallback((e, handleId) => {
    e.stopPropagation();
    e.preventDefault();
    startRefs.current = {
      handleId,
      startX: e.clientX,
      startY: e.clientY,
      bounds: { minX, minY, maxX, maxY },
      comps: selected.map(c => ({ id: c.id, x: c.x, y: c.y, w: c.width, h: c.height })),
    };

    const onMove = (ev) => {
      const s = startRefs.current;
      if (!s) return;
      const dx = ev.clientX - s.startX;
      const dy = ev.clientY - s.startY;
      const bw = s.bounds.maxX - s.bounds.minX;
      const bh = s.bounds.maxY - s.bounds.minY;
      let newMinX = s.bounds.minX, newMinY = s.bounds.minY;
      let newMaxX = s.bounds.maxX, newMaxY = s.bounds.maxY;

      if (handleId.includes("e")) newMaxX = snap(s.bounds.maxX + dx);
      if (handleId.includes("w")) newMinX = snap(s.bounds.minX + dx);
      if (handleId.includes("s")) newMaxY = snap(s.bounds.maxY + dy);
      if (handleId.includes("n")) newMinY = snap(s.bounds.minY + dy);

      const newW = Math.max(20, newMaxX - newMinX);
      const newH = Math.max(20, newMaxY - newMinY);
      const scaleX = newW / bw;
      const scaleY = newH / bh;

      s.comps.forEach(comp => {
        const relX = comp.x - s.bounds.minX;
        const relY = comp.y - s.bounds.minY;
        const newX = snap(newMinX + relX * scaleX);
        const newY = snap(newMinY + relY * scaleY);
        const newW2 = Math.max(5, snap(comp.w * scaleX));
        const newH2 = Math.max(5, snap(comp.h * scaleY));
        onResize(comp.id, newX, newY, newW2, newH2);
      });
    };

    const onUp = () => { startRefs.current = null; document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, [selected, minX, minY, maxX, maxY, snap, onResize]);

  return (
    <>
      <div style={{
        position: "absolute",
        left: minX,
        top: minY,
        width: maxX - minX,
        height: maxY - minY,
        border: "1.5px solid #60A5FA",
        borderRadius: 2,
        pointerEvents: "none",
        zIndex: 9995,
      }} />
      {handles.map(h => (
        <div
          key={h.id}
          style={{
            position: "absolute",
            width: HANDLE_SIZE,
            height: HANDLE_SIZE,
            background: "#fff",
            border: "2px solid #60A5FA",
            borderRadius: 1,
            cursor: h.cursor,
            zIndex: 9996,
            left: h.id.includes("w") ? minX : h.id.includes("e") ? maxX : minX + (maxX - minX) / 2,
            top: h.id.includes("n") ? minY : h.id.includes("s") ? maxY : minY + (maxY - minY) / 2,
            marginLeft: h.id.includes("w") ? -HANDLE_SIZE/2 : h.id.includes("e") ? -HANDLE_SIZE/2 : -HANDLE_SIZE/2,
            marginTop: h.id.includes("n") ? -HANDLE_SIZE/2 : h.id.includes("s") ? -HANDLE_SIZE/2 : -HANDLE_SIZE/2,
          }}
          onMouseDown={(e) => handleResizeStart(e, h.id)}
        />
      ))}
    </>
  );
}
