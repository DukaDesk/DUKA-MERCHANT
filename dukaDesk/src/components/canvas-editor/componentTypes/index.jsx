const types = {};

export function registerComponentType(typeName, def) {
  types[typeName] = def;
}

export function getComponentType(typeName) {
  return types[typeName];
}

export function getAllComponentTypes() {
  return Object.values(types);
}

export function getTypeNames() {
  return Object.keys(types);
}

registerComponentType("hero_banner", {
  type: "hero_banner",
  label: "Hero Banner",
  icon: "🖼️",
  category: "SDUI Components",
  defaultWidth: 390,
  defaultHeight: 200,
  defaultProps: { title: "Welcome", subtitle: "Your tagline here", badge: "Open Now", color: "#1A1A2E" },
  propFields: [
    { key: "title", label: "Title", type: "text" },
    { key: "subtitle", label: "Subtitle", type: "text" },
    { key: "badge", label: "Badge", type: "text" },
    { key: "color", label: "Background Color", type: "color" },
  ],
  render: (props) => (
    <div style={{
      background: `linear-gradient(135deg, ${props.color || "#1A1A2E"}, #15152A)`,
      color: "#fff", borderRadius: 16, padding: 32, textAlign: "center",
      width: "100%", height: "100%", display: "flex", flexDirection: "column",
      justifyContent: "center", alignItems: "center",
    }}>
      <span style={{ fontSize: 11, fontWeight: 600, background: "#F4A026", color: "#6B4200", padding: "4px 12px", borderRadius: 20, marginBottom: 12, display: "inline-block" }}>{props.badge || "Open Now"}</span>
      <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 22, marginBottom: 4 }}>{props.title}</div>
      {props.subtitle && <div style={{ fontSize: 13, opacity: 0.8 }}>{props.subtitle}</div>}
    </div>
  ),
});

registerComponentType("menu_item", {
  type: "menu_item",
  label: "Menu Item",
  icon: "🍽️",
  category: "SDUI Components",
  defaultWidth: 358,
  defaultHeight: 80,
  defaultProps: { name: "Jollof Rice", price: "₦2,500", desc: "Rich, smoky jollof rice", emoji: "🍛" },
  propFields: [
    { key: "name", label: "Name", type: "text" },
    { key: "price", label: "Price", type: "text" },
    { key: "desc", label: "Description", type: "text" },
    { key: "emoji", label: "Emoji", type: "text" },
  ],
  render: (props) => (
    <div style={{ display: "flex", gap: 12, padding: "12px 16px", background: "#FCF8FA", borderRadius: 12, boxShadow: "0px 2px 12px rgba(0,0,0,0.08)", border: "1px solid rgba(200,197,205,0.3)", width: "100%", height: "100%", alignItems: "center" }}>
      <div style={{ width: 48, height: 48, background: "#F1EDEF", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{props.emoji || "🍽️"}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: "#1C1B1D", marginBottom: 2 }}>{props.name}</div>
        {props.desc && <div style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.3 }}>{props.desc}</div>}
      </div>
      <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 14, color: "#1A1A2E", whiteSpace: "nowrap" }}>{props.price}</span>
    </div>
  ),
});

registerComponentType("category_pills", {
  type: "category_pills",
  label: "Category Pills",
  icon: "🏷️",
  category: "SDUI Components",
  defaultWidth: 358,
  defaultHeight: 48,
  defaultProps: { categories: "Popular, Mains, Drinks" },
  propFields: [
    { key: "categories", label: "Categories (comma-separated)", type: "text" },
  ],
  render: (props) => {
    const cats = typeof props.categories === "string" ? props.categories.split(",") : (props.categories || []);
    return (
      <div style={{ display: "flex", gap: 8, padding: "6px 0", overflow: "hidden", width: "100%" }}>
        {cats.map((c, i) => (
          <span key={i} style={{ padding: "6px 16px", borderRadius: 20, background: i === 0 ? "#1A1A2E" : "#E5E1E3", color: i === 0 ? "#fff" : "#47464C", fontSize: 13, fontWeight: i === 0 ? 600 : 500, whiteSpace: "nowrap", fontFamily: "'Inter',sans-serif" }}>{c.trim()}</span>
        ))}
      </div>
    );
  },
});

registerComponentType("text_block", {
  type: "text_block",
  label: "Text",
  icon: "Aa",
  category: "Primitives",
  defaultWidth: 200,
  defaultHeight: 30,
  defaultProps: { text: "Text", fontSize: 14, fontWeight: 400, color: "#1C1B1D", alignment: "left" },
  propFields: [
    { key: "text", label: "Content", type: "text" },
    { key: "fontSize", label: "Font Size", type: "number" },
    { key: "fontWeight", label: "Font Weight", type: "number" },
    { key: "color", label: "Color", type: "color" },
    { key: "alignment", label: "Alignment", type: "select", options: ["left", "center", "right"] },
  ],
  render: (props) => (
    <div style={{
      fontSize: props.fontSize || 14, fontWeight: props.fontWeight || 400,
      color: props.color || "#1C1B1D", textAlign: props.alignment || "left",
      fontFamily: "'Inter',sans-serif", padding: "2px 0", lineHeight: 1.4,
      width: "100%", height: "100%", overflow: "hidden",
    }}>{props.text}</div>
  ),
});

registerComponentType("image_block", {
  type: "image_block",
  label: "Image",
  icon: "🖼️",
  category: "Primitives",
  defaultWidth: 200,
  defaultHeight: 200,
  defaultProps: { src: "", alt: "Image", fit: "cover" },
  propFields: [
    { key: "src", label: "Image URL", type: "text" },
    { key: "alt", label: "Alt Text", type: "text" },
    { key: "fit", label: "Object Fit", type: "select", options: ["cover", "contain", "fill"] },
  ],
  render: (props) => (
    <div style={{ width: "100%", height: "100%", overflow: "hidden", borderRadius: 8, background: "#F1EDEF", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {props.src ? (
        <img src={props.src} alt={props.alt || ""} style={{ width: "100%", height: "100%", objectFit: props.fit || "cover" }} />
      ) : (
        <span style={{ color: "#9CA3AF", fontSize: 12 }}>No image</span>
      )}
    </div>
  ),
});

registerComponentType("rectangle", {
  type: "rectangle",
  label: "Rectangle",
  icon: "▬",
  category: "Primitives",
  defaultWidth: 100,
  defaultHeight: 100,
  defaultProps: {},
  propFields: [],
  render: () => <div style={{ width: "100%", height: "100%" }} />,
});

registerComponentType("button", {
  type: "button",
  label: "Button",
  icon: "🔘",
  category: "Primitives",
  defaultWidth: 120,
  defaultHeight: 40,
  defaultProps: { label: "Button", color: "#1C1B1D", action: "" },
  propFields: [
    { key: "label", label: "Label", type: "text" },
    { key: "color", label: "Text Color", type: "color" },
    { key: "action", label: "Action (JSON)", type: "json" },
  ],
  render: (props) => (
    <div style={{
      width: "100%", height: "100%",
      color: props.color || "#1C1B1D",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: 14,
      cursor: "pointer",
    }}>{props.label || "Button"}</div>
  ),
});

registerComponentType("path", {
  type: "path",
  label: "Vector Path",
  icon: "✏️",
  category: "Primitives",
  defaultWidth: 100,
  defaultHeight: 100,
  defaultProps: { d: "M10,50 Q50,10 90,50" },
  propFields: [
    { key: "d", label: "Path Data (d)", type: "text" },
  ],
  render: (props) => {
    const fill = props._fills?.[0]?.color || "transparent";
    const stroke = props._strokes?.[0]?.color || "#1C1B1D";
    const sw = props._strokes?.[0]?.width || 2;
    return (
      <svg width="100%" height="100%" style={{ overflow: "visible" }}>
        <path d={props.d || "M0,0"} fill={fill} stroke={stroke} strokeWidth={sw} />
      </svg>
    );
  },
});

registerComponentType("ellipse", {
  type: "ellipse",
  label: "Ellipse",
  icon: "⬭",
  category: "Primitives",
  defaultWidth: 120,
  defaultHeight: 120,
  defaultProps: {},
  propFields: [],
  render: (props) => {
    const fillColor = props._fills?.[0]?.color || "#E5E1E3";
    const strokeColor = props._strokes?.[0]?.color || "transparent";
    const strokeW = props._strokes?.[0]?.width || 0;
    return (
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <ellipse cx="50" cy="50" rx="50" ry="50" fill={fillColor} stroke={strokeColor} strokeWidth={strokeW} />
      </svg>
    );
  },
});

registerComponentType("line", {
  type: "line",
  label: "Line",
  icon: "╱",
  category: "Primitives",
  defaultWidth: 200,
  defaultHeight: 2,
  defaultProps: {},
  propFields: [],
  render: (props) => {
    const strokeColor = props._strokes?.[0]?.color || "#1C1B1D";
    const strokeW = props._strokes?.[0]?.width || 2;
    return (
      <svg width="100%" height="100%" style={{ overflow: "visible" }}>
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke={strokeColor} strokeWidth={strokeW} />
      </svg>
    );
  },
});

registerComponentType("arrow", {
  type: "arrow",
  label: "Arrow",
  icon: "→",
  category: "Primitives",
  defaultWidth: 200,
  defaultHeight: 40,
  defaultProps: {},
  propFields: [],
  render: (props) => {
    const sw = props._strokes?.[0]?.width || 2;
    const strokeColor = props._strokes?.[0]?.color || "#1C1B1D";
    const head = 10 + sw;
    return (
      <svg width="100%" height="100%" style={{ overflow: "visible" }}>
        <defs>
          <marker id={`arrowhead-${head}`} markerWidth={head} markerHeight={head} refX={head} refY={head / 2} orient="auto">
            <polygon points={`0 0, ${head} ${head / 2}, 0 ${head}`} fill={strokeColor} />
          </marker>
        </defs>
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke={strokeColor} strokeWidth={sw} markerEnd={`url(#arrowhead-${head})`} />
      </svg>
    );
  },
});

registerComponentType("divider", {
  type: "divider",
  label: "Divider",
  icon: "➖",
  category: "Primitives",
  defaultWidth: 358,
  defaultHeight: 2,
  defaultProps: { color: "#E5E1E3", thickness: 1 },
  propFields: [
    { key: "color", label: "Color", type: "color" },
    { key: "thickness", label: "Thickness", type: "number" },
  ],
  render: (props) => (
    <div style={{ width: "100%", height: props.thickness || 1, background: props.color || "#E5E1E3" }} />
  ),
});

registerComponentType("header_bar", {
  type: "header_bar",
  label: "Header Bar",
  icon: "🗂️",
  category: "SDUI Components",
  defaultWidth: 390,
  defaultHeight: 56,
  defaultProps: { logo: null, appName: "My App" },
  propFields: [
    { key: "appName", label: "App Name", type: "text" },
    { key: "logo", label: "Logo URL", type: "text" },
  ],
  render: (props) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 16px", width: "100%", height: "100%" }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
        background: props.logo ? `url(${props.logo}) center/cover no-repeat` : "#F1EDEF",
        border: props.logo ? "none" : "2px dashed #D1D5DB",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 14, color: "#9CA3AF",
      }}>
        {!props.logo && "📷"}
      </div>
      <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 15, color: "#1C1B1D" }}>
        {props.appName || "App Name"}
      </div>
    </div>
  ),
});

registerComponentType("menu_grid", {
  type: "menu_grid",
  label: "Menu Grid",
  icon: "📋",
  category: "SDUI Components",
  defaultWidth: 358,
  defaultHeight: 320,
  defaultProps: { columns: 2 },
  propFields: [
    { key: "columns", label: "Columns", type: "number" },
  ],
  render: (props) => (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${props.columns || 2}, 1fr)`, gap: 12, width: "100%", padding: 4 }}>
      {[1,2,3,4].map(i => (
        <div key={i} style={{ background: "#FCF8FA", borderRadius: 12, padding: 12, boxShadow: "0px 2px 12px rgba(0,0,0,0.08)", border: "1px solid rgba(200,197,205,0.3)", textAlign: "center" }}>
          <div style={{ fontSize: 28, marginBottom: 6 }}>{"🍛🍗🥤🍹"[i-1]}</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#1C1B1D" }}>Item {i}</div>
          <div style={{ fontSize: 11, color: "#F4A026", fontWeight: 700 }}>₦{(i * 1000).toLocaleString()}</div>
        </div>
      ))}
    </div>
  ),
});
