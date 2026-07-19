import { useState, useEffect, useRef } from "react";
import { Search, Plus, X, Upload, Trash2 } from "lucide-react";
import { useToast } from "../../contexts";
import { useIsMobile, useIsTablet } from "../../hooks/useMediaQuery";
import { usePermission } from "../../hooks/usePermission";
import { NAVY, AMBER, inputStyle, labelStyle, cardStyle, statusBadge, glidePanel, rowHover } from "../../theme";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../../services/api";
import { Loading, Empty, ErrorState } from "../layout/States";

const EMOJI_GRID = ["🍛", "🍗", "🐟", "🥣", "🥤", "🍩", "🍕", "🥗", "🍔", "🍜", "🍦", "🥘"];
const STATUS_OPTS = ["In Stock", "Low Stock", "Out of Stock"];

export default function Products() {
  const showToast = useToast();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const { can } = usePermission();
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [panel, setPanel] = useState(null);
  const [form, setForm] = useState({ name: "", cat: "", price: "", stock: "", status: "In Stock", img: "🍛" });
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grid");

  const loadProducts = () => {
    setError(null);
    setLoading(true);
    getProducts().then(setProducts).catch(() => setError("Failed to load products")).finally(() => setLoading(false));
  };
  useEffect(loadProducts, []);

  const filtered = products.filter(p => {
    if (filter !== "All" && p.status !== filter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const toggleSelect = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const deleteSelected = async () => {
    await Promise.all(selected.map(id => deleteProduct(id).catch(() => showToast("Failed to delete some products", "error"))));
    setProducts(p => p.filter(x => !selected.includes(x.id)));
    setSelected([]);
    showToast(`${selected.length} product(s) deleted`, "info");
  };

  const saveProduct = async () => {
    if (!form.name || !form.price) { showToast("Name and price are required", "error"); return; }
    try {
      if (panel?.id) {
        await updateProduct(panel.id, { ...form, price: Number(form.price), stock: Number(form.stock) || 0 });
        setProducts(p => p.map(x => x.id === panel.id ? { ...x, ...form, price: Number(form.price), stock: Number(form.stock) || 0 } : x));
        showToast("Product updated!", "success");
      } else {
        const created = await createProduct({ ...form, price: Number(form.price), stock: Number(form.stock) || 0 });
        setProducts(p => [...p, created]);
        showToast("Product added!", "success");
      }
    } catch { showToast("Failed to save product", "error"); }
    setPanel(null);
  };

  const fileRef = useRef(null);
  const handleCSVImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const text = evt.target.result;
      const lines = text.split("\n").filter(Boolean);
      if (lines.length < 2) { showToast("CSV must have a header row and at least one product", "error"); return; }
      const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
      const nameIdx = headers.indexOf("name");
      const priceIdx = headers.indexOf("price");
      if (nameIdx < 0 || priceIdx < 0) { showToast("CSV must have 'name' and 'price' columns", "error"); return; }
      let imported = 0;
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",").map(c => c.trim().replace(/^"|"$/g, ""));
        const p = {
          name: cols[nameIdx] || "Untitled",
          price: Number(cols[priceIdx]) || 0,
          cat: cols[headers.indexOf("category")] || "",
          stock: Number(cols[headers.indexOf("stock")]) || 0,
          status: cols[headers.indexOf("status")] || "In Stock",
          img: cols[headers.indexOf("emoji")] || "🍛",
        };
        try {
          const created = await createProduct(p);
          setProducts(pr => [...pr, created]);
          imported++;
        } catch { /* skip row */ }
      }
      showToast(`${imported} product(s) imported from CSV`, "success");
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const openEdit = (p) => {
    setForm({ name: p.name, cat: p.cat, price: String(p.price), stock: String(p.stock), status: p.status, img: p.img });
    setPanel(p);
  };
  const openAdd = () => {
    setForm({ name: "", cat: "", price: "", stock: "", status: "In Stock", img: "🍛" });
    setPanel("add");
  };

  if (loading) return <Loading message="Loading products..." />;
  if (error) return <ErrorState message={error} onRetry={loadProducts} />;

  return (
    <div style={{ position: "relative", animation: "fadeIn 0.35s ease" }}>
      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "stretch" : "center", gap: 12, marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: isMobile ? 22 : 28, color: NAVY, margin: 0 }}>Products</h2>
          <div style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>{products.length} total · {products.filter(p => p.status === "Low Stock").length} low stock · {products.filter(p => p.status === "Out of Stock").length} out of stock</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {can("product:create") && <>
            <input type="file" ref={fileRef} accept=".csv" onChange={handleCSVImport} style={{ display: "none" }} />
            <button onClick={() => fileRef.current?.click()} style={{ border: "1.5px solid var(--border)", background: "#fff", borderRadius: 10, padding: "10px 16px", fontSize: 14, cursor: "pointer", color: NAVY, display: "flex", alignItems: "center", gap: 6 }}>
              <Upload size={16} /> {isMobile ? "" : "Import CSV"}
            </button>
            <button onClick={openAdd} style={{ background: AMBER, color: NAVY, border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              <Plus size={18} /> {isMobile ? "Add" : "Add Product"}
            </button>
          </>}
        </div>
      </div>

      {can("product:delete") && selected.length > 0 && (
        <div style={{ background: NAVY, color: "#fff", borderRadius: 10, padding: "12px 20px", marginBottom: 16, display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 14, fontWeight: 500 }}>{selected.length} selected</span>
          <button onClick={deleteSelected} style={{ background: "#E74C3C", color: "#fff", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
            <Trash2 size={14} /> Delete
          </button>
          <button onClick={() => setSelected([])} style={{ background: "none", border: "1px solid #6B7280", color: "#D1D5DB", borderRadius: 8, padding: "6px 14px", fontSize: 13, cursor: "pointer" }}>
            <X size={14} style={{ verticalAlign: "middle", marginRight: 4 }} /> Clear
          </button>
        </div>
      )}

      <div style={{ ...cardStyle, padding: "14px 16px", marginBottom: 20, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F3F4F6", borderRadius: 10, padding: "8px 12px", flex: 1, minWidth: 200, transition: "border 0.2s, box-shadow 0.2s", border: "2px solid transparent" }}>
          <Search size={16} color="#9CA3AF" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." style={{ background: "none", border: "none", outline: "none", fontSize: 14, color: NAVY, flex: 1, fontFamily: "inherit" }} />
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["All", "In Stock", "Low Stock", "Out of Stock"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "6px 14px", borderRadius: 8,
              border: "none",
              background: filter === f ? AMBER : "#F3F4F6",
              color: filter === f ? NAVY : "#6B7280",
              fontSize: 13, fontWeight: filter === f ? 700 : 500, cursor: "pointer",
              transition: "all 0.2s",
            }}>{f}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Empty icon={products.length === 0 ? "📦" : "🔍"} message={products.length === 0 ? "No products yet" : "No products match your filter"}
          sub={products.length === 0 ? "Click 'Add Product' to get started" : "Try a different filter or search term"}
          action={products.length === 0 ? <button onClick={openAdd} style={{ background: AMBER, color: NAVY, border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Add Product</button> : null}
        />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2,1fr)" : "repeat(3,1fr)", gap: isMobile ? 12 : 16 }}>
          {filtered.map(p => {
            const ss = statusBadge[p.status] || statusBadge["In Stock"];
            const isSel = selected.includes(p.id);
            return (
              <div key={p.id} style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(15,15,26,0.06)", border: isSel ? `2px solid ${AMBER}` : "1px solid #E8E8F0", transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)", animation: `fadeIn 0.3s ease ${i * 0.05}s both` }}>
                <div style={{ height: 160, background: "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64, position: "relative", borderBottom: "1px solid #F3F4F6" }}>
                  {p.img}
                  <span style={{ position: "absolute", top: 10, left: 10, background: ss.bg, color: ss.color, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 8 }}>{p.status}</span>
                  <input type="checkbox" checked={isSel} onChange={() => toggleSelect(p.id)} style={{ position: "absolute", top: 10, right: 10, width: 18, height: 18, cursor: "pointer", accentColor: AMBER }} />
                </div>
                <div style={{ padding: 16 }}>
                  <div style={{ fontWeight: 600, fontSize: 15, color: NAVY, marginBottom: 4 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 8 }}>{p.cat}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 18, color: AMBER }}>₦{p.price.toLocaleString()}</span>
                    {p.oldPrice && <span style={{ fontSize: 13, color: "#9CA3AF", textDecoration: "line-through" }}>₦{p.oldPrice.toLocaleString()}</span>}
                  </div>
                  <div style={{ fontSize: 12, color: "#6B7280" }}>📦 {p.stock} in stock</div>
                </div>
                <div style={{ padding: "10px 16px", borderTop: "1px solid #F3F4F6", display: "flex", gap: 12 }}>
                  {can("product:update") && <button onClick={() => openEdit(p)} style={{ background: "none", border: "none", color: AMBER, fontSize: 13, fontWeight: 600, cursor: "pointer", padding: "4px 0" }}>Edit</button>}
                  {can("product:delete") && <button onClick={async () => { try { await deleteProduct(p.id); setProducts(pr => pr.filter(x => x.id !== p.id)); showToast("Product deleted", "info"); } catch { showToast("Failed to delete", "error"); } }} style={{ background: "none", border: "none", color: "#E74C3C", fontSize: 13, cursor: "pointer", padding: "4px 0" }}>Delete</button>}
                </div>
              </div>
            );
          })}
          <div onClick={openAdd} style={{ border: "2px dashed #E8E8F0", borderRadius: 12, minHeight: 240, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer", background: "#FAFAFA", transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)" }}>
            <div style={{ width: 48, height: 48, background: "#FFF8ED", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Plus size={24} color={AMBER} />
            </div>
            <span style={{ fontWeight: 600, fontSize: 14, color: NAVY }}>Add New Product</span>
          </div>
        </div>
      )}

      {panel && (
        <>
          <div onClick={() => setPanel(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 100 }} />
          <div style={{ ...glidePanel, width: 520, maxWidth: "100vw" }}>
            <div style={{ padding: "24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 20, color: NAVY, margin: 0 }}>{panel === "add" ? "Add New Product" : "Edit Product"}</h3>
              <button onClick={() => setPanel(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280", display: "flex" }}><X size={22} /></button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
              {[["Product Name *", "name", "text", "Jollof Rice & Chicken"], ["Category", "cat", "text", "Mains"], ["Price (₦) *", "price", "number", "2500"], ["Stock Quantity", "stock", "number", "10"]].map(([label, key, type, ph]) => (
                <div key={key} style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>{label}</label>
                  <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={ph} style={inputStyle} />
                </div>
              ))}
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} style={{ ...inputStyle, cursor: "pointer" }}>
                  {STATUS_OPTS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Emoji Icon</label>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {EMOJI_GRID.map(e => (
                    <div key={e} onClick={() => setForm(f => ({ ...f, img: e }))} style={{
                      width: 44, height: 44, background: form.img === e ? "#FFF8ED" : "#F3F4F6",
                      border: `2px solid ${form.img === e ? AMBER : "transparent"}`,
                      borderRadius: 8, display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: 22, cursor: "pointer",
                      transition: "all 0.15s",
                    }}>{e}</div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ padding: 24, borderTop: "1px solid var(--border)", display: "flex", gap: 10 }}>
              <button onClick={saveProduct} style={{ flex: 1, background: AMBER, color: NAVY, border: "none", borderRadius: 10, height: 48, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}>Save Product</button>
              <button onClick={() => setPanel(null)} style={{ background: "none", border: "1.5px solid var(--border)", borderRadius: 10, height: 48, padding: "0 20px", fontSize: 15, cursor: "pointer", color: "#6B7280" }}>Cancel</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
