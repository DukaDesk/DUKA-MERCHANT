import { useState, useEffect } from "react";
import { X, Save, SlidersHorizontal, Palette, Layout, Code2 } from "lucide-react";
import { NAVY, AMBER, cardStyle } from "../../theme";

export function PropertyEditor({ node, onUpdate, onClose }) {
  const [props, setProps] = useState({});
  const [activeTab, setActiveTab] = useState("props");

  useEffect(() => {
    setProps({ ...node.props });
  }, [node]);

  const handleChange = (key, value) => {
    setProps(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onUpdate({ ...node, props });
    onClose();
  };

  const commonProps = {
    hero_banner: [
      { key: "title", label: "Title", type: "text", placeholder: "Welcome" },
      { key: "subtitle", label: "Subtitle", type: "textarea", placeholder: "Discover our delicious menu" },
      { key: "image", label: "Background Image URL", type: "text", placeholder: "https://example.com/banner.jpg" },
    ],
    category_pills: [
      { key: "categories", label: "Categories (comma-separated)", type: "textarea", placeholder: "Popular, Mains, Drinks, Desserts" },
    ],
    menu_grid: [
      { key: "columns", label: "Columns", type: "number", min: 1, max: 4, step: 1 },
      { key: "variant", label: "Variant", type: "select", options: ["default", "bold", "minimal", "dark"] },
    ],
    order_history: [
      { key: "showStatus", label: "Show Status", type: "boolean" },
      { key: "variant", label: "Variant", type: "select", options: ["default", "dark"] },
    ],
    info_list: [
      { key: "items", label: "Items (JSON)", type: "json", placeholder: '[{"icon":"📞","label":"Call","value":"+234..."}]' },
      { key: "variant", label: "Variant", type: "select", options: ["default", "dark"] },
    ],
    report_action: [
      { key: "title", label: "Title", type: "text", placeholder: "Report an Issue" },
    ],
    notification_list: [
      { key: "notifications", label: "Notifications (JSON)", type: "json" },
    ],
    primary_button: [
      { key: "label", label: "Button Label", type: "text", placeholder: "Action" },
    ],
    calendar_strip: [
      { key: "minDate", label: "Min Date", type: "text", placeholder: "today" },
      { key: "maxDate", label: "Max Date", type: "text", placeholder: "+30" },
      { key: "variant", label: "Variant", type: "select", options: ["default", "dark"] },
    ],
    slot_grid: [
      { key: "duration", label: "Slot Duration (minutes)", type: "number", min: 15, max: 120, step: 15 },
      { key: "variant", label: "Variant", type: "select", options: ["default", "dark"] },
    ],
    booking_summary: [],
    cart_summary: [],
    address_form: [],
    promotion_list: [
      { key: "offers", label: "Offers (JSON)", type: "json", placeholder: '[{"title":"Sale","subtitle":"Up to 30% off"}]' },
    ],
    section_header: [],
    dynamic_card: [],
  };

  const fields = commonProps[node.type] || [];

  const renderField = (field) => {
    const value = props[field.key] ?? "";
    switch (field.type) {
      case "text":
        return (
          <div key={field.key} style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: NAVY, marginBottom: 4 }}>{field.label}</label>
            <input
              type="text"
              value={value}
              onChange={e => handleChange(field.key, e.target.value)}
              placeholder={field.placeholder || ""}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 13, fontFamily: "inherit" }}
            />
          </div>
        );
      case "textarea":
        return (
          <div key={field.key} style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: NAVY, marginBottom: 4 }}>{field.label}</label>
            <textarea
              value={value}
              onChange={e => handleChange(field.key, e.target.value)}
              placeholder={field.placeholder || ""}
              rows={3}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 13, fontFamily: "inherit", resize: "vertical" }}
            />
          </div>
        );
      case "number":
        return (
          <div key={field.key} style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: NAVY, marginBottom: 4 }}>{field.label}</label>
            <input
              type="number"
              value={value}
              onChange={e => handleChange(field.key, Number(e.target.value) || 0)}
              min={field.min}
              max={field.max}
              step={field.step}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 13, fontFamily: "inherit" }}
            />
          </div>
        );
      case "boolean":
        return (
          <label key={field.key} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginBottom: 12 }}>
            <input
              type="checkbox"
              checked={value}
              onChange={e => handleChange(field.key, e.target.checked)}
              style={{ width: 16, height: 16, accentColor: AMBER }}
            />
            <span style={{ fontSize: 13, color: NAVY }}>{field.label}</span>
          </label>
        );
      case "select":
        return (
          <div key={field.key} style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: NAVY, marginBottom: 4 }}>{field.label}</label>
            <select
              value={value}
              onChange={e => handleChange(field.key, e.target.value)}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 13, fontFamily: "inherit", background: "#fff" }}
            >
              {field.options.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        );
      case "json":
        return (
          <div key={field.key} style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: NAVY, marginBottom: 4 }}>{field.label}</label>
            <textarea
              value={typeof value === "string" ? value : JSON.stringify(value, null, 2)}
              onChange={e => {
                try {
                  handleChange(field.key, JSON.parse(e.target.value));
                } catch {
                  handleChange(field.key, e.target.value);
                }
              }}
              placeholder={field.placeholder || ""}
              rows={5}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 11, fontFamily: "monospace", resize: "vertical", background: "#F9FAFB" }}
            />
            <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>Valid JSON array or object</div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ background: AMBER + "20", color: AMBER, padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, textTransform: "capitalize" }}>{node.type.replace(/_/g, ' ')}</span>
          <span style={{ color: "#6B7280", fontSize: 12 }}>{node.key}</span>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#9CA3AF", fontSize: 20, cursor: "pointer" }}>✕</button>
      </div>

      <div style={{ display: "flex", gap: 4, marginBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 8 }}>
        {["props", "actions", "style"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              border: "none",
              background: activeTab === tab ? AMBER + "20" : "transparent",
              color: activeTab === tab ? AMBER : "#6B7280",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflow: "auto" }}>
        {activeTab === "props" && (
          <div style={{ padding: 4 }}>
            {fields.length === 0 ? (
              <div style={{ textAlign: "center", color: "#6B7280", padding: 40 }}>
                <Palette size={32} style={{ marginBottom: 12, opacity: 0.5 }} />
                <div>No configurable properties for this component</div>
              </div>
            ) : (
              fields.map(renderField)
            )}
          </div>
        )}

        {activeTab === "actions" && (
          <div style={{ padding: 4 }}>
            <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 12 }}>Actions define what happens when users interact with this component. Configure action handlers in the JSON screen definition.</div>
            <div style={{ background: "#0F0F1A", borderRadius: 8, padding: 12, fontSize: 11, fontFamily: "monospace", color: "#9CA3AF" }}>
              {JSON.stringify(node.actions || {}, null, 2)}
            </div>
            <div style={{ marginTop: 12, fontSize: 12, color: "#6B7280" }}>
              Edit actions in the screen JSON (View Code button)
            </div>
          </div>
        )}

        {activeTab === "style" && (
          <div style={{ padding: 4 }}>
            <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 12 }}>Custom inline styles (optional)</div>
            <textarea
              value={JSON.stringify(node.style || {}, null, 2)}
              onChange={e => {
                try {
                  handleChange("style", JSON.parse(e.target.value));
                } catch {
                  handleChange("style", {});
                }
              }}
              rows={8}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 11, fontFamily: "monospace", resize: "vertical", background: "#F9FAFB" }}
              placeholder='{"marginBottom": 24, "background": "#F9FAFB"}'
            />
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <button onClick={handleSave} style={{ flex: 1, padding: "12px", background: AMBER, color: NAVY, border: "none", borderRadius: 8, fontWeight: 700, fontSize: 13, fontFamily: "'Sora',sans-serif", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <Save size={14} /> Save Changes
        </button>
      </div>
    </div>
  );
}