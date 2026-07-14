import { useRef, useCallback } from "react";

const RULER_SIZE = 20;
const TICK_STEP = 50;

function Ruler({ orientation, zoom, pan, length }) {
  const rulerRef = useRef(null);

  const ticks = [];
  const step = TICK_STEP * zoom;
  const total = length * zoom;
  for (let i = 0; i <= total; i += step) {
    const val = Math.round(i / zoom);
    if (val % 100 === 0) {
      ticks.push({ pos: i, label: String(val), major: true });
    } else {
      ticks.push({ pos: i, label: "", major: false });
    }
  }

  const offset = orientation === "horizontal" ? pan.x * zoom : pan.y * zoom;

  const handleMouseDown = useCallback((e) => {
    const startPos = e[orientation === "horizontal" ? "clientX" : "clientY"];
    const onMove = (ev) => {
      const currentPos = ev[orientation === "horizontal" ? "clientX" : "clientY"];
      const guidePos = Math.round((currentPos - startPos) / zoom);
      window.__canvasGuideDrag?.(orientation, guidePos);
    };
    const onUp = () => { document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, [orientation, zoom]);

  const isHoriz = orientation === "horizontal";

  return (
    <div
      ref={rulerRef}
      style={{
        width: isHoriz ? "100%" : RULER_SIZE,
        height: isHoriz ? RULER_SIZE : "100%",
        background: "#FAFAFA",
        borderBottom: isHoriz ? "1px solid #E5E7EB" : "none",
        borderRight: !isHoriz ? "1px solid #E5E7EB" : "none",
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
        cursor: "pointer",
        userSelect: "none",
      }}
      onMouseDown={handleMouseDown}
    >
      <div style={{
        position: "absolute",
        [isHoriz ? "left" : "top"]: -(isHoriz ? offset : offset),
        [isHoriz ? "top" : "left"]: isHoriz ? 0 : -offset,
        width: isHoriz ? total : RULER_SIZE,
        height: isHoriz ? RULER_SIZE : total,
      }}>
        {ticks.map((t, i) => (
          <div key={i} style={{
            position: "absolute",
            ...(isHoriz ? { left: t.pos, top: 0 } : { top: t.pos, left: 0 }),
          }}>
            <div style={{
              [isHoriz ? "width" : "height"]: 1,
              [isHoriz ? "height" : "width"]: t.major ? 10 : 5,
              background: "#D1D5DB",
            }} />
            {t.major && (
              <div style={{
                position: "absolute",
                fontSize: 8, color: "#9CA3AF", fontFamily: "'Inter',sans-serif",
                [isHoriz ? "left" : "top"]: isHoriz ? 2 : 2,
                [isHoriz ? "top" : "left"]: isHoriz ? 12 : 12,
                whiteSpace: "nowrap",
              }}>
                {t.label}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CanvasRulers({ zoom, pan, screenWidth, screenHeight, guides = [], onRemoveGuide }) {
  const displayW = screenWidth || 390;
  const displayH = screenHeight || 844;

  return (
    <div style={{ display: "flex", flexDirection: "column", flexShrink: 0 }}>
      <div style={{ display: "flex" }}>
        <div style={{ width: RULER_SIZE, height: RULER_SIZE, background: "#FAFAFA", borderBottom: "1px solid #E5E7EB", borderRight: "1px solid #E5E7EB", flexShrink: 0 }} />
        <Ruler orientation="horizontal" zoom={zoom} pan={pan} length={displayW} />
      </div>
      <div style={{ display: "flex", flex: 1 }}>
        <Ruler orientation="vertical" zoom={zoom} pan={pan} length={displayH} />
        <div style={{ position: "relative", flex: 1 }}>
          {guides.filter(g => g.orientation === "horizontal").map((g, i) => (
            <div
              key={`h-${i}`}
              style={{
                position: "absolute", top: g.position * zoom + pan.y, left: 0, right: 0,
                height: 1, background: "#E74C3C", zIndex: 100, cursor: "grab",
              }}
              onDoubleClick={() => onRemoveGuide?.(i)}
            />
          ))}
          {guides.filter(g => g.orientation === "vertical").map((g, i) => (
            <div
              key={`v-${i}`}
              style={{
                position: "absolute", left: g.position * zoom + pan.x, top: 0, bottom: 0,
                width: 1, background: "#E74C3C", zIndex: 100, cursor: "grab",
              }}
              onDoubleClick={() => onRemoveGuide?.(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
