import { useState, useEffect, useRef } from "react";
import { Search, Plus, X, Upload, Trash2, Package, ImagePlus } from "lucide-react";
import { toast } from "react-toastify";
import { useIsMobile, useIsTablet } from "../../hooks/useMediaQuery";
import { usePermission } from "../../hooks/usePermission";
import { NAVY, AMBER, inputStyle, labelStyle, cardStyle, statusBadge, glidePanel } from "../../theme";
import { getProducts, createProduct, updateProduct, deleteProduct, getProductCategories, createProductCategory, uploadMediaAsset } from "../../services/api";
import { Loading, Empty, ErrorState } from "../layout/States";

// Stock at or below this is "Low Stock"; zero is always "Out of Stock".
const LOW_STOCK_AT = 5;
export const STATUS_OPTS = ["In Stock", "Low Stock", "Out of Stock"];

export function deriveStatus(stock) {
  const qty = Number(stock) || 0;
  if (qty <= 0) return "Out of Stock";
  if (qty <= LOW_STOCK_AT) return "Low Stock";
  return "In Stock";
}

export function discountPercent(price, compareAt) {
  const current = Number(price) || 0;
  const was = Number(compareAt) || 0;
  if (!current || !was || was <= current) return 0;
  return Math.round(((was - current) / was) * 100);
}

const emptyForm = () => ({ name: "", description: "", cat: "", categoryId: "", price: "", compareAt: "", stock: "", badge: "", tags: "", images: [], newCat: "" });

export default function Products() {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const { can } = usePermission();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [panel, setPanel] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showNewCat, setShowNewCat] = useState(false);

  const loadAll = () => {
    setError(null);
    setLoading(true);
    Promise.all([getProducts(), getProductCategories().catch(() => [])])
      .then(([items, cats]) => { setProducts(items); setCategories(cats); })
      .catch(() => setError("Failed to load products"))
      .finally(() => setLoading(false));
  };
  useEffect(loadAll, []);

  const statusOf = (p) => deriveStatus(p.stock);
  const filtered = products.filter(p => {
    if (filter !== "All" && statusOf(p) !== filter) return false;
    if (catFilter !== "All" && (p.cat || "") !== catFilter) return false;
    if (search) {
      const haystack = `${p.name} ${p.description || ""} ${p.cat || ""} ${(p.tags || []).join(" ")}`.toLowerCase();
      if (!haystack.includes(search.toLowerCase())) return false;
    }
    return true;
  });

  const toggleSelect = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const deleteSelected = async () => {
    await Promise.all(selected.map(id => deleteProduct(id).catch(() => toast.error("Failed to delete some products"))));
    setProducts(p => p.filter(x => !selected.includes(x.id)));
    setSelected([]);
    toast.info(`${selected.length} product(s) deleted`);
  };

  const resolveCategoryId = async () => {
    if (form.categoryId) return form.categoryId;
    const name = (form.newCat || form.cat || "").trim();
    if (!name) return null;
    const existing = categories.find(c => c.name.toLowerCase() === name.toLowerCase());
    if (existing) return existing.id;
    const created = await createProductCategory({ name });
    if (created?.id) setCategories(c => [...c, created]);
    return created?.id || null;
  };

  const saveProduct = async () => {
    if (!form.name || !form.price) { toast.error("Name and price are required"); return; }
    try {
      const categoryId = await resolveCategoryId().catch(() => form.categoryId || null);
      const tags = String(form.tags || "").split(",").map(t => t.trim()).filter(Boolean);
      const body = {
        name: form.name.trim(),
        description: form.description?.trim() || undefined,
        price: Number(form.price),
        compareAtPrice: form.compareAt === "" ? null : Number(form.compareAt),
        stock: Number(form.stock) || 0,
        categoryId,
        cat: form.newCat?.trim() || form.cat,
        images: form.images,
        badge: form.badge.trim(),
        tags,
      };
      if (panel?.id) {
        const updated = await updateProduct(panel.id, body);
        setProducts(p => p.map(x => x.id === panel.id ? { ...x, ...updated } : x));
        toast.success("Product updated!");
      } else {
        const created = await createProduct(body);
        setProducts(p => [created, ...p]);
        toast.success("Product added!");
      }
    } catch { toast.error("Failed to save product"); }
    setPanel(null);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const asset = await uploadMediaAsset(file, { purpose: "product-image", alt: form.name || "Product image" });
      const url = asset?.url;
      if (!url) throw new Error("Upload returned no URL");
      setForm(f => ({ ...f, images: [...f.images, url] }));
      toast.success("Image uploaded");
    } catch { toast.error("Image upload failed"); }
    finally { setUploading(false); }
  };

  const fileRef = useRef(null);
  const imgRef = useRef(null);
  const handleCSVImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const text = evt.target.result;
      const lines = text.split("\n").filter(Boolean);
      if (lines.length < 2) { toast.error("CSV must have a header row and at least one product"); return; }
      const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
      const nameIdx = headers.indexOf("name");
      const priceIdx = headers.indexOf("price");
      if (nameIdx < 0 || priceIdx < 0) { toast.error("CSV must have 'name' and 'price' columns"); return; }
      const col = (row, key) => { const i = headers.indexOf(key); return i < 0 ? "" : (row[i] || "").trim().replace(/^"|"$/g, ""); };
      let imported = 0;
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",").map(c => c.trim());
        const p = {
          name: cols[nameIdx] || "Untitled",
          price: Number(cols[priceIdx]) || 0,
          compareAtPrice: col(cols, "compareat") || col(cols, "original price") ? Number(col(cols, "compareat") || col(cols, "original price")) : null,
          description: col(cols, "description"),
          cat: col(cols, "category"),
          stock: Number(col(cols, "stock")) || 0,
          badge: col(cols, "badge"),
          tags: col(cols, "tags").split(";").map(t => t.trim()).filter(Boolean),
          images: col(cols, "imageurl") || col(cols, "image") ? [col(cols, "imageurl") || col(cols, "image")] : [],
        };
        try {
          const created = await createProduct(p);
          setProducts(pr => [created, ...pr]);
          imported++;
        } catch { /* skip row */ }
      }
      toast.success(`${imported} product(s) imported from CSV`);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const openEdit = (p) => {
    setForm({
      name: p.name || "",
      description: p.description || "",
      cat: p.cat || "",
      categoryId: p.categoryId || "",
      price: String(p.price ?? ""),
      compareAt: p.compareAtPrice != null ? String(p.compareAtPrice) : "",
      stock: String(p.stock ?? ""),
      badge: p.badge || "",
      tags: (p.tags || []).join(", "),
      images: p.images || (p.img && p.img.startsWith("http") ? [p.img] : []),
      newCat: "",
    });
    setShowNewCat(false);
    setPanel(p);
  };
  const openAdd = () => {
    setForm(emptyForm());
    setShowNewCat(false);
    setPanel("add");
  };

  if (loading) return <Loading message="Loading products..." />;
  if (error) return <ErrorState message={error} onRetry={loadAll} />;

  const counts = {
    low: products.filter(p => statusOf(p) === "Low Stock").length,
    out: products.filter(p => statusOf(p) === "Out of Stock").length,
  };

  return (
    <div style={{ position: "relative", animation: "fadeIn 0.35s ease" }}>
      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "stretch" : "center", gap: 12, marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: isMobile ? 22 : 28, color: NAVY, margin: 0 }}>Products</h2>
          <div style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>{products.length} total · {counts.low} low stock · {counts.out} out of stock</div>
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
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)} style={{ padding: "6px 10px", borderRadius: 8, border: "none", background: "#F3F4F6", color: "#6B7280", fontSize: 13, cursor: "pointer" }}>
            <option value="All">All categories</option>
            {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
          {["All", ...STATUS_OPTS].map(f => (
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
        <Empty icon={products.length === 0 ? <Package size={40} color="#9CA3AF" /> : <Search size={40} color="#9CA3AF" />} message={products.length === 0 ? "No products yet" : "No products match your filter"}
          sub={products.length === 0 ? "Click 'Add Product' to get started" : "Try a different filter or search term"}
          action={products.length === 0 ? <button onClick={openAdd} style={{ background: AMBER, color: NAVY, border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Add Product</button> : null}
        />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2,1fr)" : "repeat(3,1fr)", gap: isMobile ? 12 : 16 }}>
          {filtered.map((p, i) => {
            const status = statusOf(p);
            const ss = statusBadge[status] || statusBadge["In Stock"];
            const isSel = selected.includes(p.id);
            const img = (p.images && p.images[0]) || null;
            const pct = discountPercent(p.price, p.compareAtPrice);
            return (
              <div key={p.id} style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(15,15,26,0.06)", border: isSel ? `2px solid ${AMBER}` : "1px solid #E8E8F0", transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)", animation: `fadeIn 0.3s ease ${i * 0.05}s both` }}>
                <div style={{ height: 160, background: "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", borderBottom: "1px solid #F3F4F6", overflow: "hidden" }}>
                  {img ? (
                    <img src={img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <Package size={56} strokeWidth={1.5} color="#6B7280" />
                  )}
                  <span style={{ position: "absolute", top: 10, left: 10, background: ss.bg, color: ss.color, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 8 }}>{status}</span>
                  {p.badge ? (
                    <span style={{ position: "absolute", top: 10, right: 44, background: "#E74C3C", color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 8, textTransform: "uppercase" }}>{p.badge}</span>
                  ) : null}
                  <input type="checkbox" checked={isSel} onChange={() => toggleSelect(p.id)} style={{ position: "absolute", top: 10, right: 10, width: 18, height: 18, cursor: "pointer", accentColor: AMBER }} />
                </div>
                <div style={{ padding: 16 }}>
                  <div style={{ fontWeight: 600, fontSize: 15, color: NAVY, marginBottom: 4 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 8 }}>{p.cat}</div>
                  {p.description ? (
                    <div style={{ fontSize: 13, color: "#4B5563", marginBottom: 8, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.description}</div>
                  ) : null}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 18, color: AMBER }}>₦{Number(p.price || 0).toLocaleString()}</span>
                    {p.compareAtPrice && Number(p.compareAtPrice) > Number(p.price) ? (
                      <>
                        <span style={{ fontSize: 13, color: "#9CA3AF", textDecoration: "line-through" }}>₦{Number(p.compareAtPrice).toLocaleString()}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", background: "#E74C3C", padding: "2px 8px", borderRadius: 8 }}>-{pct}%</span>
                      </>
                    ) : null}
                  </div>
                  {(p.tags || []).length > 0 && (
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                      {(p.tags || []).map(t => (
                        <span key={t} style={{ fontSize: 11, color: "#6B7280", background: "#F3F4F6", padding: "2px 8px", borderRadius: 8 }}>#{t}</span>
                      ))}
                    </div>
                  )}
                  <div style={{ fontSize: 12, color: status === "Out of Stock" ? "#E74C3C" : "#6B7280" }}><Package size={12} style={{ verticalAlign: "-2px", marginRight: 4 }} />{p.stock} in stock</div>
                </div>
                <div style={{ padding: "10px 16px", borderTop: "1px solid #F3F4F6", display: "flex", gap: 12 }}>
                  {can("product:update") && <button onClick={() => openEdit(p)} style={{ background: "none", border: "none", color: AMBER, fontSize: 13, fontWeight: 600, cursor: "pointer", padding: "4px 0" }}>Edit</button>}
                  {can("product:delete") && <button onClick={async () => { try { await deleteProduct(p.id); setProducts(pr => pr.filter(x => x.id !== p.id)); toast.info("Product deleted"); } catch { toast.error("Failed to delete"); } }} style={{ background: "none", border: "none", color: "#E74C3C", fontSize: 13, cursor: "pointer", padding: "4px 0" }}>Delete</button>}
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
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Product Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Jollof Rice & Chicken" style={inputStyle} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Description</label>
                <textarea value={form.description || ""} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Tasty details customers see on the store…" rows={3} style={{ ...inputStyle, resize: "vertical" }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Category</label>
                <select value={form.categoryId || ""} onChange={e => {
                  const v = e.target.value;
                  if (v === "__new") { setShowNewCat(true); setForm(f => ({ ...f, categoryId: "" })); return; }
                  setShowNewCat(false);
                  const found = categories.find(c => c.id === v);
                  setForm(f => ({ ...f, categoryId: v, cat: found ? found.name : f.cat, newCat: "" }));
                }} style={{ ...inputStyle, cursor: "pointer" }}>
                  <option value="">Select category…</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  <option value="__new">＋ New category…</option>
                </select>
                {showNewCat && (
                  <input value={form.newCat} onChange={e => setForm(f => ({ ...f, newCat: e.target.value }))} placeholder="New category name" style={{ ...inputStyle, marginTop: 8 }} />
                )}
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ marginBottom: 16, flex: 1 }}>
                  <label style={labelStyle}>Discount price (₦) *</label>
                  <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="2500" style={inputStyle} />
                </div>
                <div style={{ marginBottom: 16, flex: 1 }}>
                  <label style={labelStyle}>Original price (₦)</label>
                  <input type="number" value={form.compareAt} onChange={e => setForm(f => ({ ...f, compareAt: e.target.value }))} placeholder="Optional — shows sale" style={inputStyle} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ marginBottom: 16, flex: 1 }}>
                  <label style={labelStyle}>Stock Quantity</label>
                  <input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} placeholder="10" style={inputStyle} />
                </div>
                <div style={{ marginBottom: 16, flex: 1 }}>
                  <label style={labelStyle}>Status (auto)</label>
                  <div style={{ ...inputStyle, background: "#F9FAFB", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: (statusBadge[deriveStatus(form.stock)] || {}).dot || "#2ECC71" }} />
                    {deriveStatus(form.stock)}
                  </div>
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Sale badge (optional)</label>
                <input value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))} placeholder="e.g. FLASH SALE" style={inputStyle} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Tags (comma separated)</label>
                <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="e.g. spicy, bestseller" style={inputStyle} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Product images</label>
                <input type="file" ref={imgRef} accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
                  {form.images.map((url, i) => (
                    <div key={i} style={{ position: "relative", width: 72, height: 72, borderRadius: 10, overflow: "hidden", border: "1px solid #E8E8F0" }}>
                      <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <button onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, j) => j !== i) }))} style={{ position: "absolute", top: 2, right: 2, width: 20, height: 20, borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.55)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={12} /></button>
                    </div>
                  ))}
                  <button onClick={() => imgRef.current?.click()} disabled={uploading} style={{ width: 72, height: 72, borderRadius: 10, border: "1.5px dashed #E8E8F0", background: "#FAFAFA", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, color: AMBER }}>
                    <ImagePlus size={20} /> <span style={{ fontSize: 10, color: "#6B7280" }}>{uploading ? "…" : "Add"}</span>
                  </button>
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
