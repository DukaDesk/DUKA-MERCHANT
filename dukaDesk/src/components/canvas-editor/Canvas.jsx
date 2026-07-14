import { useState, useRef, useCallback, useEffect } from "react";
import CanvasComponent from "./CanvasComponent";
import MultiSelectBox from "./MultiSelectBox";

const GRID_SIZE = 10;
const GUIDE_SNAP = 5;

function isShapeTool(tool) {
  return ["rectangle", "ellipse", "line", "arrow", "path"].includes(tool);
}

function computeAlignmentGuides(draggedId, components, newX, newY, w, h) {
  const guides = [];
  const others = components.filter(c => c.id !== draggedId && c.visible && !c.locked);
  const left = newX, right = newX + w, centerX = newX + w / 2;
  const top = newY, bottom = newY + h, centerY = newY + h / 2;

  for (const o of others) {
    const ol = o.x, or = o.x + o.width, ocx = o.x + o.width / 2;
    const ot = o.y, ob = o.y + o.height, ocy = o.y + o.height / 2;

    // Vertical alignment (left, center, right)
    if (Math.abs(left - ol) <= GUIDE_SNAP) guides.push({ axis: "v", pos: ol, label: "left" });
    if (Math.abs(left - ocx) <= GUIDE_SNAP) guides.push({ axis: "v", pos: ocx, label: "left" });
    if (Math.abs(left - or) <= GUIDE_SNAP) guides.push({ axis: "v", pos: or, label: "left" });
    if (Math.abs(centerX - ol) <= GUIDE_SNAP) guides.push({ axis: "v", pos: ol, label: "center" });
    if (Math.abs(centerX - ocx) <= GUIDE_SNAP) guides.push({ axis: "v", pos: ocx, label: "center" });
    if (Math.abs(centerX - or) <= GUIDE_SNAP) guides.push({ axis: "v", pos: or, label: "center" });
    if (Math.abs(right - ol) <= GUIDE_SNAP) guides.push({ axis: "v", pos: ol, label: "right" });
    if (Math.abs(right - ocx) <= GUIDE_SNAP) guides.push({ axis: "v", pos: ocx, label: "right" });
    if (Math.abs(right - or) <= GUIDE_SNAP) guides.push({ axis: "v", pos: or, label: "right" });

    // Horizontal alignment (top, center, bottom)
    if (Math.abs(top - ot) <= GUIDE_SNAP) guides.push({ axis: "h", pos: ot, label: "top" });
    if (Math.abs(top - ocy) <= GUIDE_SNAP) guides.push({ axis: "h", pos: ocy, label: "top" });
    if (Math.abs(top - ob) <= GUIDE_SNAP) guides.push({ axis: "h", pos: ob, label: "top" });
    if (Math.abs(centerY - ot) <= GUIDE_SNAP) guides.push({ axis: "h", pos: ot, label: "middle" });
    if (Math.abs(centerY - ocy) <= GUIDE_SNAP) guides.push({ axis: "h", pos: ocy, label: "middle" });
    if (Math.abs(centerY - ob) <= GUIDE_SNAP) guides.push({ axis: "h", pos: ob, label: "middle" });
    if (Math.abs(bottom - ot) <= GUIDE_SNAP) guides.push({ axis: "h", pos: ot, label: "bottom" });
    if (Math.abs(bottom - ocy) <= GUIDE_SNAP) guides.push({ axis: "h", pos: ocy, label: "bottom" });
    if (Math.abs(bottom - ob) <= GUIDE_SNAP) guides.push({ axis: "h", pos: ob, label: "bottom" });
  }
  return guides;
}

export default function Canvas({
  screen, selectedIds, onSelect, onMove, onResize, onDrop, onAssetDrop,
  clearSelection,
  activeTool, onAddPrimitive, onSetTool, onDoubleClick,
}) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [panning, setPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const canvasRef = useRef(null);

  const [drawing, setDrawing] = useState(null);
  const [marquee, setMarquee] = useState(null);
  const [alignmentGuides, setAlignmentGuides] = useState([]);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [canvasBg, setCanvasBg] = useState("#E8E5E0");
  const bgInputRef = useRef(null);
  const dragState = useRef(null);
  const draggedIdRef = useRef(null);

  const handleMoveWithGuides = useCallback((id, x, y) => {
    draggedIdRef.current = id;
    onMove(id, x, y);
    const comp = screen?.components.find(c => c.id === id);
    if (!comp) return;
    const guides = computeAlignmentGuides(id, screen?.components || [], x, y, comp.width, comp.height);
    setAlignmentGuides(guides);
  }, [onMove, screen]);

  const handleMoveEnd = useCallback(() => {
    setAlignmentGuides([]);
    draggedIdRef.current = null;
  }, []);

  const screenWidth = screen?.width || 390;
  const screenHeight = screen?.height || 844;

  const clientToCanvas = useCallback((clientX, clientY) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (clientX - rect.left - pan.x) / zoom,
      y: (clientY - rect.top - pan.y) / zoom,
    };
  }, [zoom, pan]);

  const snap = useCallback((v) => snapEnabled ? Math.round(v / GRID_SIZE) * GRID_SIZE : v, [snapEnabled]);

  const handleWheel = useCallback((e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      setZoom(prev => Math.max(0.25, Math.min(3, prev + delta)));
    } else {
      setPan(prev => ({ x: prev.x - e.deltaX, y: prev.y - e.deltaY }));
    }
  }, []);

  const handleCanvasMouseDown = useCallback((e) => {
    if (e.button !== 0) return;

    if (activeTool === "hand" || e.button === 1 || (e.button === 0 && e.shiftKey && activeTool === "select")) {
      e.preventDefault();
      setPanning(true);
      panStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
      return;
    }

    if (activeTool === "select") {
      const pt = clientToCanvas(e.clientX, e.clientY);
      const hit = screen?.components?.findLast(c =>
        pt.x >= c.x && pt.x <= c.x + c.width &&
        pt.y >= c.y && pt.y <= c.y + c.height &&
        c.visible
      );
      if (hit) return;
      e.preventDefault();
      dragState.current = { mode: "marquee", startX: e.clientX, startY: e.clientY, selecting: false };
      setMarquee(null);
      return;
    }

    if (isShapeTool(activeTool)) {
      e.preventDefault();
      const pt = clientToCanvas(e.clientX, e.clientY);
      const snapped = { x: snap(pt.x), y: snap(pt.y) };
      dragState.current = { mode: "draw", startX: snapped.x, startY: snapped.y, type: activeTool };
      setDrawing({ x: snapped.x, y: snapped.y, w: 0, h: 0, type: activeTool });
      return;
    }

    if (activeTool === "text") {
      e.preventDefault();
      const pt = clientToCanvas(e.clientX, e.clientY);
      const snapped = { x: snap(pt.x), y: snap(pt.y) };
      onAddPrimitive("text_block", snapped.x, snapped.y, 200, 30, {
        props: { text: "Text", fontSize: 14, fontWeight: 400, color: "#1C1B1D", alignment: "left" },
        fills: [],
      });
      onSetTool("select");
    }

    if (activeTool === "path") {
      e.preventDefault();
      const pt = clientToCanvas(e.clientX, e.clientY);
      const snapped = { x: snap(pt.x), y: snap(pt.y) };
      onAddPrimitive("path", snapped.x - 50, snapped.y - 50, 100, 100, {
        props: { d: `M${snapped.x},${snapped.y - 50} Q${snapped.x + 25},${snapped.y - 25} ${snapped.x + 50},${snapped.y - 50}` },
        strokes: [{ color: "#1C1B1D", width: 2 }],
        fills: [],
      });
      onSetTool("select");
    }
  }, [activeTool, clientToCanvas, snap, screen, onAddPrimitive, onSetTool, pan]);

  const handleCanvasMouseMove = useCallback((e) => {
    if (panning) {
      setPan({
        x: panStart.current.panX + (e.clientX - panStart.current.x),
        y: panStart.current.panY + (e.clientY - panStart.current.y),
      });
      return;
    }

    const ds = dragState.current;
    if (!ds) return;

    if (ds.mode === "draw") {
      const pt = clientToCanvas(e.clientX, e.clientY);
      const sx = ds.startX;
      const sy = ds.startY;
      const ex = snap(pt.x);
      const ey = snap(pt.y);
      let x = Math.min(sx, ex);
      let y = Math.min(sy, ey);
      let w = Math.abs(ex - sx) || 20;
      let h = Math.abs(ey - sy) || 20;
      if (ds.type === "line" || ds.type === "arrow") {
        h = Math.max(2, Math.abs(ey - sy) || 2);
      }
      setDrawing({ x, y, w, h, type: ds.type });
      return;
    }

    if (ds.mode === "marquee") {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const l = Math.min(ds.startX, e.clientX);
      const t = Math.min(ds.startY, e.clientY);
      const r = Math.max(ds.startX, e.clientX);
      const b = Math.max(ds.startY, e.clientY);
      if (Math.abs(e.clientX - ds.startX) > 3 || Math.abs(e.clientY - ds.startY) > 3) {
        dragState.current.selecting = true;
      }
      setMarquee({ left: l - rect.left, top: t - rect.top, width: r - l, height: b - t, clientLeft: l, clientTop: t, clientRight: r, clientBottom: b });
    }
  }, [panning, clientToCanvas, snap]);

  const handleCanvasMouseUp = useCallback((e) => {
    if (panning) { setPanning(false); return; }

    const ds = dragState.current;
    if (!ds) { dragState.current = null; return; }

    if (ds.mode === "draw" && drawing) {
      onAddPrimitive(
        drawing.type === "arrow" ? "arrow" : drawing.type,
        drawing.x, drawing.y, drawing.w, drawing.h,
        drawing.type === "rectangle" ? {
          props: { background: "#E5E1E3", borderRadius: 0, borderWidth: 0, borderColor: "#C8C5CD" },
          fills: [{ type: "solid", color: "#E5E1E3" }],
        } : drawing.type === "ellipse" ? {
          props: { fill: "#E5E1E3", strokeWidth: 0, strokeColor: "#C8C5CD" },
          fills: [{ type: "solid", color: "#E5E1E3" }],
        } : drawing.type === "line" ? {
          props: { strokeColor: "#1C1B1D", strokeWidth: 2, dashArray: "" },
          strokes: [{ color: "#1C1B1D", width: 2 }],
        } : {
          props: { strokeColor: "#1C1B1D", strokeWidth: 2 },
          strokes: [{ color: "#1C1B1D", width: 2 }],
        }
      );
      setDrawing(null);
      if (ds.type !== "text") onSetTool("select");
    }

    if (ds.mode === "marquee" && ds.selecting && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const ml = (ds.clientLeft - rect.left - pan.x) / zoom;
      const mt = (ds.clientTop - rect.top - pan.y) / zoom;
      const mr = (ds.clientRight - rect.left - pan.x) / zoom;
      const mb = (ds.clientBottom - rect.top - pan.y) / zoom;
      const l = Math.min(ml, mr), t = Math.min(mt, mb), r = Math.max(ml, mr), b = Math.max(mt, mb);
      const hits = (screen?.components || []).filter(c =>
        c.visible && !c.locked &&
        c.x < r && c.x + c.width > l &&
        c.y < b && c.y + c.height > t
      );
      if (hits.length > 0) {
        clearSelection();
        hits.forEach(c => onSelect(c.id, true));
      }
      setMarquee(null);
    }

    dragState.current = null;
  }, [panning, drawing, activeTool, snap, onAddPrimitive, onSetTool, onSelect, screen, zoom, pan]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = snap(((e.clientX - rect.left - pan.x) / zoom));
    const y = snap(((e.clientY - rect.top - pan.y) / zoom));
    const type = e.dataTransfer.getData("component-type");
    if (type) {
      onDrop(type, Math.max(0, x), Math.max(0, y));
      return;
    }
    const assetUrl = e.dataTransfer.getData("asset-url");
    if (assetUrl) {
      onAssetDrop?.(assetUrl, Math.max(0, x), Math.max(0, y));
      return;
    }
    const libData = e.dataTransfer.getData("library-component");
    if (libData) {
      try {
        const comp = JSON.parse(libData);
        onDrop?.(comp.type, Math.max(0, x), Math.max(0, y), comp);
      } catch {}
    }
  }, [zoom, pan, onDrop, snap, onAssetDrop]);

  const handleCanvasClick = useCallback((e) => {
    if (e.target === e.currentTarget && activeTool === "select" && !marquee) {
      clearSelection();
    }
  }, [clearSelection, activeTool, marquee]);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      const toolMap = { v: "select", r: "rectangle", o: "ellipse", t: "text", l: "line", a: "arrow", h: "hand", p: "path" };
      const tool = toolMap[e.key.toLowerCase()];
      if (tool && !(e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        onSetTool(tool);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onSetTool]);

  const dotCountX = Math.ceil(screenWidth / GRID_SIZE) + 1;
  const dotCountY = Math.ceil(screenHeight / GRID_SIZE) + 1;
  const dots = [];
  for (let i = 0; i < dotCountX * dotCountY; i++) {
    const col = i % dotCountX;
    const row = Math.floor(i / dotCountX);
    dots.push({ x: col * GRID_SIZE, y: row * GRID_SIZE, key: i });
  }

  const cursorMap = {
    select: "default",
    rectangle: "crosshair",
    ellipse: "crosshair",
    text: "text",
    line: "crosshair",
    arrow: "crosshair",
    path: "crosshair",
    hand: panning ? "grabbing" : "grab",
  };

  return (
    <div style={{ flex: 1, position: "relative", overflow: "hidden", background: canvasBg }}>
      <div style={{ position: "absolute", bottom: 12, left: 12, display: "flex", gap: 6, zIndex: 20, alignItems: "center" }}>
        <button onClick={() => setZoom(prev => Math.max(0.25, prev - 0.1))} style={zoomBtnStyle}>−</button>
        <span style={{ fontSize: 12, color: "#6B7280", alignSelf: "center", minWidth: 40, textAlign: "center" }}>{Math.round(zoom * 100)}%</span>
        <button onClick={() => setZoom(prev => Math.min(3, prev + 0.1))} style={zoomBtnStyle}>+</button>
        <button onClick={() => setZoom(1)} style={zoomBtnStyle}>100%</button>
        <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} style={zoomBtnStyle}>Reset</button>
        <div style={{ width: 1, height: 20, background: "#D1D5DB" }} />
        <button onClick={() => setSnapEnabled(!snapEnabled)} style={{
          ...zoomBtnStyle,
          background: snapEnabled ? "#FFF8ED" : "#fff",
          borderColor: snapEnabled ? "#F4A026" : "#D1D5DB",
          color: snapEnabled ? "#6B4200" : "#9CA3AF",
        }}>
          {snapEnabled ? "🔲 Snap On" : "⬜ Snap Off"}
        </button>
        <div
          onClick={() => bgInputRef.current?.click()}
          style={{
            width: 24, height: 24, borderRadius: 4, border: "2px solid #D1D5DB",
            background: canvasBg, cursor: "pointer", flexShrink: 0,
          }}
          title="Canvas background"
        />
        <input ref={bgInputRef} type="color" value={canvasBg} onChange={e => setCanvasBg(e.target.value)} style={{ display: "none" }} />
      </div>

      <div
        ref={canvasRef}
        style={{
          width: "100%", height: "100%",
          cursor: cursorMap[activeTool] || "default",
          overflow: "hidden", position: "relative",
          userSelect: "none",
        }}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseUp}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleCanvasClick}
      >
        <div
          style={{
            position: "absolute",
            left: pan.x,
            top: pan.y,
            transform: `scale(${zoom})`,
            transformOrigin: "0 0",
            width: screenWidth,
            height: screenHeight,
            background: screen?.backgroundColor || "#FCF8FA",
            borderRadius: 8,
            boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
          }}
        >
          {(screen?.components || []).slice().sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0)).map(comp => (
            <CanvasComponent
              key={comp.id}
              component={comp}
              isSelected={selectedIds.includes(comp.id)}
              onSelect={onSelect}
              onMove={handleMoveWithGuides}
              onMoveEnd={handleMoveEnd}
              onResize={onResize}
              gridSize={GRID_SIZE}
              activeTool={activeTool}
              onDoubleClick={onDoubleClick}
            />
          ))}

          {selectedIds.length > 1 && activeTool === "select" && (
            <MultiSelectBox
              componentIds={selectedIds}
              components={screen?.components || []}
              onResize={onResize}
              onMove={onMove}
              gridSize={GRID_SIZE}
            />
          )}

            {alignmentGuides.map((g, i) => (
              <div key={i} style={{
                position: "absolute",
                pointerEvents: "none",
                zIndex: 9998,
                background: "#60A5FA",
                ...(g.axis === "v" ? {
                  left: g.pos,
                  top: 0,
                  width: 1,
                  height: screenHeight,
                } : {
                  top: g.pos,
                  left: 0,
                  height: 1,
                  width: screenWidth,
                }),
              }} />
            ))}

            {drawing && (
            <div style={{
              position: "absolute",
              left: drawing.x,
              top: drawing.y,
              width: drawing.w,
              height: drawing.h,
              border: "1.5px dashed #F4A026",
              borderRadius: drawing.type === "ellipse" ? "50%" : 2,
              background: "rgba(244,160,38,0.08)",
              pointerEvents: "none",
              zIndex: 9999,
            }} />
          )}
        </div>

        {marquee && (
          <div style={{
            position: "absolute",
            left: marquee.left,
            top: marquee.top,
            width: marquee.width,
            height: marquee.height,
            border: "1px solid #60A5FA",
            background: "rgba(96,165,250,0.1)",
            pointerEvents: "none",
            zIndex: 9999,
          }} />
        )}

        {alignmentGuides.map((g, i) => (
          <div key={i} style={{
            position: "absolute",
            pointerEvents: "none",
            zIndex: 9998,
            background: "#60A5FA",
            ...(g.axis === "v" ? {
              left: g.pos * zoom + pan.x,
              top: 0,
              width: 1,
              height: "100vh",
            } : {
              top: g.pos * zoom + pan.y,
              left: 0,
              height: 1,
              width: "100vw",
            }),
          }} />
        ))}
      </div>
    </div>
  );
}

const zoomBtnStyle = {
  padding: "4px 10px", borderRadius: 6, border: "1px solid #D1D5DB",
  background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600,
  color: "#374151", fontFamily: "'Inter',sans-serif",
};
