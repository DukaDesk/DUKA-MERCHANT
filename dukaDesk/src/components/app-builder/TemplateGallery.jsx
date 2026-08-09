import { useState, useEffect } from "react";
import { NAVY, AMBER } from "../../theme";
import { getTemplateCatalog } from "../../services/staticTemplates";

function getInitials(name) {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

export default function TemplateGallery({ value, onChange, isMobile, loading = false }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [hovered, setHovered] = useState(null);
  const [catalog, setCatalog] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    getTemplateCatalog()
      .then(cats => { if (mounted) setCatalog(cats); })
      .catch(() => { if (mounted) setError("Failed to load templates"); });
    return () => { mounted = false; };
  }, []);

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "48px 24px", color: "#9CA3AF", fontSize: 14 }}>
        {error}. Please make sure templates are published and reload.
      </div>
    );
  }

  if (!catalog) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px", gap: 12, color: "#9CA3AF" }}>
        <div style={{ width: 28, height: 28, border: "3px solid #E8E8F0", borderTopColor: AMBER, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <span style={{ fontSize: 14 }}>Loading templates...</span>
      </div>
    );
  }

  const categories = catalog.map(cat => cat.name);
  const allTemplates = catalog.flatMap(cat => cat.templates.map(t => ({ ...t, category: cat.name })));
  const filtered = allTemplates.filter(t => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || (t.tags || []).some(tag => tag.toLowerCase().includes(search.toLowerCase())) || t.category.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === "All" || t.category === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div>
      <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: isMobile ? 24 : 28, color: NAVY, margin: "0 0 8px" }}>Choose your template</h2>
      <p style={{ color: "#6B7280", fontSize: isMobile ? 14 : 15, margin: "0 0 24px" }}>Pick a pre-made template to get started quickly.</p>

      <div style={{ marginBottom: 24, display: "flex", gap: 12, flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "stretch" : "center" }}>
        <div style={{ flex: 1, position: "relative" }}>
          <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", pointerEvents: "none" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search templates..." style={{ width: "100%", padding: "10px 14px 10px 40px", border: "1.5px solid #E8E8F0", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box", background: "#fff" }} />
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
        <button onClick={() => setActiveCategory("All")} style={chipStyle(activeCategory === "All")}>All</button>
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={chipStyle(activeCategory === cat)}>{cat}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: 20 }}>
        {filtered.map((t, i) => {
          const selected = value === t.id;
          return (
            <div key={t.id} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
              onClick={() => { if (!loading) onChange(t.id); }}
              style={{
                background: "#fff", border: `1.5px solid ${selected ? AMBER : hovered === i ? "#D1D5DB" : "#E8E8F0"}`,
                borderRadius: 12, overflow: "hidden", cursor: loading ? "wait" : "pointer", transition: "all 0.15s",
                position: "relative", transform: hovered === i && !selected ? "translateY(-2px)" : "none",
                boxShadow: hovered === i && !selected ? "0 4px 16px rgba(0,0,0,0.06)" : "none",
                opacity: loading ? 0.6 : 1, pointerEvents: loading ? "none" : "auto",
              }}>
              {selected && <div style={{ position: "absolute", top: 8, left: 8, background: AMBER, color: NAVY, fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 8, zIndex: 2 }}>Selected</div>}
              <div style={{ height: isMobile ? 100 : 140, background: `linear-gradient(135deg, ${t.primaryColor}, ${t.secondaryColor})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {t.preview ? (
                  <span style={{ fontSize: isMobile ? 32 : 40 }}>{t.preview}</span>
                ) : (
                  <span style={{ fontSize: isMobile ? 28 : 36, fontWeight: 800, color: "#fff", fontFamily: "'Sora',sans-serif", textShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>{getInitials(t.name)}</span>
                )}
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 15, color: NAVY }}>{t.name}</div>
                  <span style={{ fontSize: 11, color: "#9CA3AF" }}>{t.category}</span>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {(t.tags || []).map((tag, j) => <span key={j} style={{ background: "#F3F4F6", color: "#6B7280", fontSize: 11, padding: "3px 8px", borderRadius: 8 }}>{tag}</span>)}
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