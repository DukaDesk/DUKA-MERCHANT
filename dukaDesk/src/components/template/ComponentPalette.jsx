import { useState } from "react";
import { Layers, ShoppingCart, Calendar, Heart, ChevronRight, MousePointer } from "lucide-react";
import { AMBER, NAVY } from "../../theme";

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
    <div style={{ background: "#252547", borderLeft: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", width: 280 }}>
      <div style={{ padding: "12px 16px", background: "#1A1A2E", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontWeight: 600, color: "#fff", fontSize: 13 }}>Components</span>
        <span style={{ fontSize: 11, color: "#9CA3AF" }}>Drag to canvas</span>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 8 }}>
        {categories.map(cat => (
          <div key={cat.key}>
            <button
              onClick={() => setExpanded({ ...expanded, [cat.key]: !expanded[cat.key] })}
              style={{ width: "100%", textAlign: "left", padding: "8px 12px", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, color: expanded[cat.key] ? AMBER : "#D1D5DB", fontSize: 12, fontWeight: 600 }}
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
                      background: "#1A1A2E",
                      border: "1px solid #374151",
                      borderRadius: 8,
                      cursor: "grab",
                      transition: "all 0.15s",
                      fontSize: 12,
                      color: "#D1D5DB"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#252547"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "#1A1A2E"}
                  >
                    <div style={{ fontWeight: 600, color: "#fff", marginBottom: 2 }}>{item.label}</div>
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