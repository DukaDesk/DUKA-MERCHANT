import { useState } from "react";
import { NAVY, AMBER } from "../../theme";
import {
  WIZARD_TEMPLATES_BY_CATEGORY,
} from "../../services/mockData";

const ALL_TEMPLATES = Object.values(WIZARD_TEMPLATES_BY_CATEGORY).flat();
const CATEGORIES = Object.keys(WIZARD_TEMPLATES_BY_CATEGORY);

function getInitials(name) {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

export default function TemplateGallery({ value, onChange, onSkip, isMobile }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [hovered, setHovered] = useState(null);

  const filtered = ALL_TEMPLATES.filter(t => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase())) || t.category.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === "All" || t.category === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div>
      <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: isMobile ? 24 : 36, color: NAVY, margin: "0 0 8px" }}>Choose your template</h2>
      <p style={{ color: "#6B7280", fontSize: isMobile ? 14 : 16, margin: "0 0 28px" }}>Pick a pre-made template to get started quickly.</p>

      <div style={{ marginBottom: 24, display: "flex", gap: 12, flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "stretch" : "center" }}>
        <div style={{ flex: 1, position: "relative" }}>
          <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", pointerEvents: "none" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search templates..." style={{ width: "100%", padding: "10px 14px 10px 40px", border: "1.5px solid #E8E8F0", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box", background: "#fff" }} />
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
        <button onClick={() => setActiveCategory("All")} style={chipStyle(activeCategory === "All")}>All</button>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={chipStyle(activeCategory === cat)}>{cat}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: 20 }}>
        {filtered.map((t, i) => {
          const selected = value === t.name;
          return (
            <div key={t.name} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
              style={{
                background: "#fff", border: `1.5px solid ${selected ? AMBER : hovered === i ? "#D1D5DB" : "#E8E8F0"}`,
                borderRadius: 12, overflow: "hidden", cursor: "pointer", transition: "all 0.15s",
                position: "relative", transform: hovered === i && !selected ? "translateY(-2px)" : "none",
                boxShadow: hovered === i && !selected ? "0 4px 16px rgba(0,0,0,0.06)" : "none",
              }}
              onClick={() => onChange(t.name)}>
              {selected && <div style={{ position: "absolute", top: 8, left: 8, background: AMBER, color: NAVY, fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 8, zIndex: 2 }}>Selected</div>}
              <div style={{ height: isMobile ? 100 : 140, background: `linear-gradient(135deg, ${t.primaryColor}, ${t.secondaryColor})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: isMobile ? 28 : 36, fontWeight: 800, color: "#fff", fontFamily: "'Sora',sans-serif", textShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>{getInitials(t.name)}</span>
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 15, color: NAVY }}>{t.name}</div>
                  <span style={{ fontSize: 11, color: "#9CA3AF" }}>{t.category}</span>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {t.tags.map((tag, j) => <span key={j} style={{ background: "#F3F4F6", color: "#6B7280", fontSize: 11, padding: "3px 8px", borderRadius: 8 }}>{tag}</span>)}
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 40, color: "#9CA3AF" }}>
            No templates match your search. Try a different term.
          </div>
        )}
      </div>
    </div>
  );
}

const chipStyle = (active) => ({
  padding: "7px 18px", borderRadius: 20, border: "none",
  background: active ? AMBER : "#F3F4F6",
  color: active ? NAVY : "#6B7280",
  fontWeight: active ? 700 : 500,
  fontSize: 13, cursor: "pointer", fontFamily: "inherit",
  transition: "all 0.12s",
});
