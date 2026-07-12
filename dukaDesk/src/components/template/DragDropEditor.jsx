import { useState, useRef, useCallback, useEffect } from "react";
import { GripVertical, Trash2, Edit3, Copy, Eye, MousePointer, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";
import { AMBER, NAVY, cardStyle } from "../../theme";

export function DraggableComponent({ 
  node, 
  index, 
  isSelected, 
  onSelect, 
  onMove, 
  onDelete, 
  onDuplicate,
  onEditProps,
  children,
  depth = 0
}) {
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef(null);
  const dragOverRef = useRef(false);

  const handleDragStart = (e) => {
    setDragging(true);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("component-index", index);
    e.dataTransfer.setData("component-type", node.type);
    dragRef.current = { node, index };
  };

  const handleDragEnd = () => {
    setDragging(false);
    dragRef.current = null;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (!dragOverRef.current) {
      dragOverRef.current = true;
    }
  };

  const handleDragLeave = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (e.clientY <= rect.top || e.clientY >= rect.bottom || e.clientX <= rect.left || e.clientX >= rect.right) {
      dragOverRef.current = false;
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    dragOverRef.current = false;
    const sourceIndex = parseInt(e.dataTransfer.getData("component-index"), 10);
    if (sourceIndex !== index && !isNaN(sourceIndex)) {
      onMove(sourceIndex, index);
    }
  };

  const handleClick = (e) => {
    e.stopPropagation();
    onSelect(node, index);
  };

  const Indicator = () => (
    <div style={{
      position: "absolute",
      top: 0,
      left: -28,
      width: 24,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
      opacity: isSelected || dragging ? 1 : 0,
      transition: "opacity 0.2s",
      pointerEvents: "none",
      zIndex: 10
    }}>
      <button
        onClick={(e) => { e.stopPropagation(); onMove(index, index - 1); }}
        disabled={index === 0}
        style={{ padding: 4, background: NAVY, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
        title="Move up"
      ><ArrowUp size={12} /></button>
      <button
        onClick={(e) => { e.stopPropagation(); onMove(index, index + 1); }}
        style={{ padding: 4, background: NAVY, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
        title="Move down"
      ><ArrowDown size={12} /></button>
    </div>
  );

  const Toolbar = () => (
    <div style={{
      position: "absolute",
      top: -36,
      right: 0,
      display: "flex",
      gap: 4,
      opacity: isSelected ? 1 : 0,
      transition: "opacity 0.2s",
      pointerEvents: isSelected ? "auto" : "none"
    }}>
      <button onClick={(e) => { e.stopPropagation(); onEditProps(node); }} style={toolbarBtn} title="Edit props"><Edit3 size={12} /></button>
      <button onClick={(e) => { e.stopPropagation(); onDuplicate(node); }} style={toolbarBtn} title="Duplicate"><Copy size={12} /></button>
      <button onClick={(e) => { e.stopPropagation(); onDelete(index); }} style={{ ...toolbarBtn, color: "#E74C3C" }} title="Delete"><Trash2 size={12} /></button>
    </div>
  );

  const toolbarBtn = {
    padding: 6,
    background: "#fff",
    border: "1px solid #E5E7EB",
    borderRadius: 6,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    color: "#374151"
  };

  return (
    <div
      ref={(el) => { if (el) el.dataset.componentIndex = index; }}
      draggable={!editMode}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      style={{
        position: "relative",
        border: isSelected ? `2px solid ${AMBER}` : dragging ? "2px dashed #9CA3AF" : "1px dashed transparent",
        borderRadius: 8,
        background: dragging ? "#F9FAFB" : "transparent",
        transition: "all 0.15s",
        padding: "8px",
        marginBottom: 8,
        ...(depth > 0 && { marginLeft: depth * 16 })
      }}
    >
      <Indicator />
      <Toolbar />
      <div style={{
        padding: 8,
        background: "#fff",
        borderRadius: 6,
        border: "1px solid #E5E7EB",
        position: "relative",
        minHeight: 40
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, fontSize: 11, color: "#9CA3AF" }}>
          <GripVertical size={12} style={{ cursor: "grab" }} />
          <span style={{ fontWeight: 600, color: NAVY, textTransform: "capitalize" }}>{node.type.replace(/_/g, ' ')}</span>
          <span style={{ background: AMBER + "15", color: AMBER, padding: "2px 6px", borderRadius: 4, fontSize: 10 }}>{node.key}</span>
        </div>
        {children}
      </div>
      {dragOverRef.current && (
        <div style={{ position: "absolute", inset: 0, background: AMBER + "20", border: `2px dashed ${AMBER}`, borderRadius: 8, pointerEvents: "none", zIndex: 5 }} />
      )}
    </div>
  );
}

export function DropZone({ onDrop, children, style = {}, accept = [] }) {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (e.clientY <= rect.top || e.clientY >= rect.bottom || e.clientX <= rect.left || e.clientX >= rect.right) {
      setDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const type = e.dataTransfer.getData("component-type");
    if (accept.length === 0 || accept.includes(type)) {
      onDrop(type, e);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        minHeight: 60,
        border: dragOver ? `2px dashed ${AMBER}` : "1px dashed #D1D5DB",
        borderRadius: 8,
        background: dragOver ? AMBER + "10" : "transparent",
        transition: "all 0.15s",
        padding: 16,
        ...style
      }}
    >
      {dragOver ? (
        <div style={{ textAlign: "center", color: AMBER, fontWeight: 600, padding: 20 }}>
          Drop component here
        </div>
      ) : (
        children
      )}
    </div>
  );
}

export function ComponentPalette({ onAddComponent }) {
  const [expanded, setExpanded] = useState({ sections: true, commerce: true, booking: true, engagement: true });

  const categories = [
    { key: "sections", label: "Section Components", icon: Layers, items: [
      { type: "section_header", label: "Section Header", desc: "Heading with optional subtitle" },
      { type: "hero_banner", label: "Hero Banner", desc: "Full-width banner with title/subtitle" },
      { type: "promotion_list", label: "Promotion Carousel", desc: "Horizontal scrolling offer cards" },
    ]},
    { key: "commerce", label: "Commerce", icon: ShoppingCart, items: [
      { type: "category_pills", label: "Category Pills", desc: "Horizontal filter chips" },
      { type: "menu_grid", label: "Product Grid", desc: "Grid of products/menu items" },
      { type: "dynamic_card", label: "Dynamic Card", desc: "Individual product card with actions" },
      { type: "cart_summary", label: "Cart Summary", desc: "Cart totals + checkout button" },
      { type: "order_history", label: "Order History", desc: "List of past orders" },
    ]},
    { key: "booking", label: "Booking", icon: Calendar, items: [
      { type: "calendar_strip", label: "Date Picker", desc: "Horizontal date strip" },
      { type: "slot_grid", label: "Time Slots", desc: "Grid of available time slots" },
      { type: "booking_summary", label: "Booking Summary", desc: "Confirmation before submit" },
    ]},
    { key: "engagement", label: "Engagement", icon: Heart, items: [
      { type: "info_list", label: "Info List", desc: "Contact info rows (phone, email, location)" },
      { type: "notification_list", label: "Notifications", desc: "Notification feed with actions" },
      { type: "report_action", label: "Report Form", desc: "Feedback/report submission" },
      { type: "primary_button", label: "Primary Button", desc: "Call-to-action button" },
      { type: "address_form", label: "Address Form", desc: "Delivery address input" },
    ]},
  ];

  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", overflow: "hidden", width: 280 }}>
      <div style={{ padding: "12px 16px", background: "#F9FAFB", borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontWeight: 600, color: NAVY, fontSize: 13 }}>Components</span>
        <span style={{ fontSize: 11, color: "#9CA3AF" }}>Drag to canvas</span>
      </div>
      <div style={{ maxHeight: 500, overflowY: "auto", padding: 8 }}>
        {categories.map(cat => (
          <div key={cat.key}>
            <button
              onClick={() => setExpanded({ ...expanded, [cat.key]: !expanded[cat.key] })}
              style={{ width: "100%", textAlign: "left", padding: "8px 12px", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, color: expanded[cat.key] ? NAVY : "#6B7280", fontSize: 12, fontWeight: 600 }}
            >
              <cat.icon size={14} />
              <ChevronRight size={12} style={{ marginLeft: "auto", transform: expanded[cat.key] ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
              {cat.label}
            </button>
            {expanded[cat.key] && (
              <div style={{ paddingLeft: 20 }}>
                {cat.items.map(item => (
                  <div
                    key={item.type}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.effectAllowed = "copy";
                      e.dataTransfer.setData("component-type", item.type);
                    }}
                    onClick={() => onAddComponent(item.type)}
                    style={{
                      padding: "10px 12px",
                      margin: "4px 8px",
                      background: "#F9FAFB",
                      border: "1px solid #E5E7EB",
                      borderRadius: 8,
                      cursor: "grab",
                      transition: "all 0.15s",
                      fontSize: 12
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#F3F4F6"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "#F9FAFB"}
                  >
                    <div style={{ fontWeight: 600, color: NAVY, marginBottom: 2 }}>{item.label}</div>
                    <div style={{ fontSize: 10, color: "#9CA3AF" }}>{item.desc}</div>
                    <div style={{ marginTop: 6, fontSize: 10, color: AMBER, display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <MousePointer size={10} /> Add to screen
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function PropertyEditor({ node, onUpdate, onClose }) {
  if (!node) return null;

  const brand = { NAVY, AMBER };

  return (
    <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: 360, background: "#fff", borderLeft: "1px solid #E5E7EB", boxShadow: "-8px 0 32px rgba(0,0,0,0.12)", zIndex: 100, display: "flex", flexDirection: "column", animation: "slideIn 0.2s ease" }}>
      <style jsx>{`
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
      <div style={{ padding: "16px", borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontWeight: 700, color: NAVY, fontSize: 14, textTransform: "capitalize" }}>{node.type.replace(/_/g, ' ')}</div>
          <div style={{ fontSize: 11, color: "#9CA3AF" }}>{node.key}</div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#9CA3AF" }}>✕</button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: NAVY, marginBottom: 6 }}>Props (JSON)</label>
          <textarea
            value={JSON.stringify(node.props || {}, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                onUpdate({ ...node, props: parsed });
              } catch {}
            }}
            style={{
              width: "100%",
              minHeight: 120,
              padding: 10,
              borderRadius: 8,
              border: "1px solid #E5E7EB",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: NAVY,
              resize: "vertical"
            }}
            placeholder="{}"
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: NAVY, marginBottom: 6 }}>Actions (JSON)</label>
          <textarea
            value={JSON.stringify(node.actions || {}, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                onUpdate({ ...node, actions: parsed });
              } catch {}
            }}
            style={{
              width: "100%",
              minHeight: 100,
              padding: 10,
              borderRadius: 8,
              border: "1px solid #E5E7EB",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: NAVY,
              resize: "vertical"
            }}
            placeholder="{}"
          />
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: "auto", paddingTop: 16, borderTop: "1px solid #E5E7EB" }}>
          <button onClick={() => onUpdate({ ...node, visibleWhen: "" })} style={{ flex: 1, padding: "10px", background: "#F3F4F6", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 12, fontWeight: 600, color: NAVY, cursor: "pointer" }}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}