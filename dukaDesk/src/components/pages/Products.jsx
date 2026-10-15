import { useState, useEffect, useRef } from "react";
import { Search, Plus, X, Upload, Trash2, Package, ImagePlus, LayoutGrid, List, Pencil } from "lucide-react";
import { toast } from "react-toastify";
import { useIsMobile } from "../../hooks/useMediaQuery";
import { usePermission } from "../../hooks/usePermission";
import { useAuth } from "../../contexts";
import { formatMoney, currencySymbol, getMerchantCurrency } from "../../utils/currency";
import { NAVY, AMBER, inputStyle, labelStyle, cardStyle, statusBadge, glidePanel } from "../../theme";
import { getProducts, createProduct, updateProduct, deleteProduct, getProductCategories, createProductCategory, uploadMediaAsset } from "../../services/api";
import { Loading, Empty, ErrorState } from "../layout/States";

// Stock at or below this is "Low Stock"; zero is always "Out of Stock".
const LOW_STOCK_AT = 5;
// Buyer-education copy limits: full description 800, short hook 100.
export const DESCRIPTION_MAX = 800;
export const SHORT_DESCRIPTION_MAX = 100;
export const STATUS_OPTS = ["In Stock", "Low Stock", "Out of Stock"];

// Sample CSV merchants can download to see the expected import format.
// NOTE: keep commas out of field values — the importer splits on commas.
export const SAMPLE_CSV = [
  "name,price,compareAt,description,category,stock,badge,tags,imageUrl",
  'Jollof Rice & Chicken,2500,3000,"Party-style smoky jollof with grilled chicken",Food,20,FLASH SALE,"spicy;bestseller",https://example.com/jollof.jpg',
  'Ankara Fabric (6 yards),15000,,"Premium cotton ankara with vibrant prints",Fashion,50,,"cotton;new",',
].join("\n");

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

// Serial-style SKU auto-generated when the merchant leaves the field blank:
// 3 letters from the product name + timestamp/random suffix (e.g. JOL-3F8K2Q).
export function generateSku(name) {
  const prefix = (String(name || "").replace(/[^a-z0-9]/gi, "").slice(0, 3) || "PRD").toUpperCase().padEnd(3, "X");
  const suffix = (Date.now().toString(36) + Math.random().toString(36).slice(2)).replace(/[^a-z0-9]/gi, "").slice(-6).toUpperCase().padEnd(6, "0");
  return `${prefix}-${suffix}`;
}

// Parse CSV text into preview rows. Exported for tests; the modal's Confirm
// step imports only rows marked valid (named with a price above 0).
export function parseCsvText(text) {
  const lines = text.split("\n").map(l => l.replace(/\r$/, "")).filter(l => l.trim() !== "");
  if (lines.length < 2) return { rows: [], error: "CSV must have a header row and at least one product" };
  const headers = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/^"|"$/g, ""));
  const nameIdx = headers.indexOf("name");
  const priceIdx = headers.indexOf("price");
  if (nameIdx < 0 || priceIdx < 0) return { rows: [], error: "CSV must have 'name' and 'price' columns" };
  const col = (row, key) => { const i = headers.indexOf(key); return i < 0 ? "" : (row[i] || "").trim().replace(/^"|"$/g, ""); };
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",").map(c => c.trim());
    const rawName = (cols[nameIdx] || "").replace(/^"|"$/g, "");
    const price = Number(cols[priceIdx]) || 0;
    const valid = Boolean(rawName) && price > 0;
    rows.push({
      name: rawName || `Row ${i + 1}`,
      price,
      sku: generateSku(rawName || "Untitled"),
      compareAtPrice: col(cols, "compareat") || col(cols, "original price") ? Number(col(cols, "compareat") || col(cols, "original price")) : null,
      description: col(cols, "description"),
      cat: col(cols, "category"),
      stock: Number(col(cols, "stock")) || 0,
      badge: col(cols, "badge"),
      tags: col(cols, "tags").split(";").map(t => t.trim()).filter(Boolean),
      images: col(cols, "imageurl") || col(cols, "image") ? [col(cols, "imageurl") || col(cols, "image")] : [],
      valid,
      error: !rawName ? "Missing name" : price <= 0 ? "Price must be above 0" : "",
    });
  }
  return { rows, error: "" };
}

const emptyForm = () => ({ name: "", description: "", shortDescription: "", weight: "", weightUnit: "kg", length: "", width: "", height: "", dimensionUnit: "cm", sku: "", cat: "", categoryId: "", price: "", compareAt: "", stock: "", badge: "", tags: "", images: [], newCat: "" });

const WEIGHT_UNITS = ["kg", "g", "lb", "oz"];
const DIMENSION_UNITS = ["cm", "m", "in"];

export default function Products() {
  const isMobile = useIsMobile();
  const { can } = usePermission();
  const { merchant } = useAuth() || {};
  const currency = getMerchantCurrency(merchant);
  const sym = currencySymbol(currency);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [panel, setPanel] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [selected, setSelected] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [selectMode, setSelectMode] = useState(false);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showNewCat, setShowNewCat] = useState(false);
  const [skuManual, setSkuManual] = useState(false);
  const [csvOpen, setCsvOpen] = useState(false);
  const [csvName, setCsvName] = useState("");
  const [csvRows, setCsvRows] = useState([]);
  const [csvError, setCsvError] = useState("");
  const [csvBusy, setCsvBusy] = useState(false);

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
    if (detail && selected.includes(detail.id)) setDetail(null);
    setSelected([]);
    if (selectMode) setSelectMode(false);
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
    if (saving) return;
    if (!form.name || !form.price) { toast.error("Name and price are required"); return; }
    if (!form.description?.trim()) { toast.error("Description is required — buyers need to know what this is"); return; }
    if (form.description.trim().length > DESCRIPTION_MAX) { toast.error(`Description must be ${DESCRIPTION_MAX} characters or less`); return; }
    if ((form.shortDescription || "").length > SHORT_DESCRIPTION_MAX) { toast.error(`Short description must be ${SHORT_DESCRIPTION_MAX} characters or less`); return; }
    if (uploading) { toast.info("Wait for the image upload to finish"); return; }
    setSaving(true);
    try {
      const categoryId = await resolveCategoryId().catch(() => form.categoryId || null);
      const tags = String(form.tags || "").split(",").map(t => t.trim()).filter(Boolean);
      const numOrNull = (v) => (v === "" || v == null ? null : Number(v));
      const body = {
        name: form.name.trim(),
        description: form.description.trim(),
        shortDescription: form.shortDescription?.trim() || null,
        weight: numOrNull(form.weight),
        weightUnit: form.weight === "" ? null : form.weightUnit,
        length: numOrNull(form.length),
        width: numOrNull(form.width),
        height: numOrNull(form.height),
        dimensionUnit: (form.length === "" && form.width === "" && form.height === "") ? null : form.dimensionUnit,
        sku: form.sku?.trim() || generateSku(form.name),
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
        const merged = { ...panel, ...updated };
        setProducts(p => p.map(x => x.id === panel.id ? { ...x, ...updated } : x));
        if (detail?.id === panel.id) setDetail(merged);
        toast.success("Product updated!");
      } else {
        const created = await createProduct(body);
        setProducts(p => [created, ...p]);
        toast.success("Product added!");
      }
      setPanel(null);
    } catch (err) {
      // Stay in the form so the merchant can fix the highlighted problem
      // (e.g. a duplicate SKU) instead of losing their edits.
      const raw = err?.response?.data?.message || err?.message || "";
      const leaked = /invalid `.*prisma.*invocation|unique constraint failed|prisma\./i.test(raw);
      toast.error(
        leaked
          ? "Could not save — a product with this name or SKU may already exist. Change one and try again."
          : raw && raw !== "Failed to save product" ? raw : "Failed to save product",
      );
    } finally { setSaving(false); }
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

  const imgRef = useRef(null);
  const csvFileRef = useRef(null);

  const downloadSampleCsv = () => {
    const blob = new Blob([SAMPLE_CSV], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dukadesk-products-sample.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleCsvFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const { rows, error } = parseCsvText(String(evt.target.result || ""));
      setCsvName(file.name);
      setCsvRows(rows);
      setCsvError(error);
    };
    reader.readAsText(file);
  };

  const closeCsvModal = () => {
    if (csvBusy) return;
    setCsvOpen(false);
    setCsvName("");
    setCsvRows([]);
    setCsvError("");
  };

  const confirmCsvImport = async () => {
    const valid = csvRows.filter(r => r.valid);
    if (!valid.length || csvBusy) return;
    setCsvBusy(true);
    let imported = 0;
    for (const r of valid) {
      const { valid: _v, error: _e, ...body } = r;
      try {
        const created = await createProduct(body);
        setProducts(pr => [created, ...pr]);
        imported++;
      } catch { /* skip row */ }
    }
    const skipped = csvRows.length - valid.length;
    toast.success(skipped ? `${imported} imported, ${skipped} skipped` : `${imported} product(s) imported from CSV`);
    setCsvBusy(false);
    closeCsvModal();
  };

  const openEdit = (p) => {
    setForm({
      name: p.name || "",
      description: p.description || "",
      shortDescription: p.shortDescription || "",
      weight: p.weight != null ? String(p.weight) : "",
      weightUnit: p.weightUnit || "kg",
      length: p.length != null ? String(p.length) : "",
      width: p.width != null ? String(p.width) : "",
      height: p.height != null ? String(p.height) : "",
      dimensionUnit: p.dimensionUnit || "cm",
      sku: p.sku || "",
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
    setSkuManual(true);
    setPanel(p);
  };
  const openAdd = () => {
    setForm({ ...emptyForm(), sku: generateSku("") });
    setShowNewCat(false);
    setSkuManual(false);
    setPanel("add");
  };

  if (loading) return <Loading message="Loading products..." />;
  if (error) return <ErrorState message={error} onRetry={loadAll} />;

  const counts = {
    low: products.filter(p => statusOf(p) === "Low Stock").length,
    out: products.filter(p => statusOf(p) === "Out of Stock").length,
  };

  // In list view (desktop) the details live in the right-hand pane, so the
  // same card renders inline there and inside the modal everywhere else.
  const renderDetailCard = (p, dismissible) => {
    const status = statusOf(p);
    const ss = statusBadge[status] || statusBadge["In Stock"];
    const img = (p.images && p.images[0]) || null;
    const pct = discountPercent(p.price, p.compareAtPrice);
    const dims = [p.length, p.width, p.height].filter(v => v !== "" && v != null).join(" × ");
    return (
      <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(15,15,26,0.06)", border: "1px solid #E8E8F0", animation: "fadeIn 0.25s ease" }}>
        <div style={{ height: 220, background: "#F9FAFB", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {img ? (
            <img src={img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          ) : (
            <Package size={64} strokeWidth={1.5} color="#6B7280" />
          )}
          <span style={{ position: "absolute", top: 12, left: 12, background: ss.bg, color: ss.color, fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 8 }}>{status}</span>
          {dismissible && (
            <button onClick={() => setDetail(null)} style={{ position: "absolute", top: 12, right: 12, width: 32, height: 32, borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.5)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={16} /></button>
          )}
        </div>
        <div style={{ padding: 20 }}>
          {p.badge ? (
            <span style={{ display: "inline-block", background: "#E74C3C", color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 8, textTransform: "uppercase", marginBottom: 8 }}>{p.badge}</span>
          ) : null}
          <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 20, color: NAVY, margin: "0 0 4px" }}>{p.name}</h3>
          <div style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 12 }}>{p.cat}{p.sku ? ` · SKU ${p.sku}` : ""}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 22, color: AMBER }}>{formatMoney(p.price, currency)}</span>
            {p.compareAtPrice && Number(p.compareAtPrice) > Number(p.price) ? (
              <>
                <span style={{ fontSize: 14, color: "#9CA3AF", textDecoration: "line-through" }}>{formatMoney(p.compareAtPrice, currency)}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#fff", background: "#E74C3C", padding: "2px 10px", borderRadius: 8 }}>-{pct}%</span>
              </>
            ) : null}
          </div>
          <div style={{ fontSize: 13, color: status === "Out of Stock" ? "#E74C3C" : "#6B7280", marginBottom: 16 }}><Package size={13} style={{ verticalAlign: "-2px", marginRight: 6 }} />{p.stock} in stock</div>
          {p.shortDescription ? (
            <div style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 6 }}>{p.shortDescription}</div>
          ) : null}
          {p.description ? (
            <div style={{ fontSize: 14, color: "#4B5563", lineHeight: 1.6, marginBottom: 16 }}>{p.description}</div>
          ) : null}
          {(p.weight || dims || (p.tags || []).length > 0) && (
            <div style={{ background: "#F9FAFB", borderRadius: 10, padding: "12px 14px", marginBottom: 16, display: "flex", flexDirection: "column", gap: 6 }}>
              {p.weight ? <div style={{ fontSize: 13, color: "#4B5563" }}>Weight: <strong style={{ color: NAVY }}>{p.weight} {p.weightUnit || ""}</strong></div> : null}
              {dims ? <div style={{ fontSize: 13, color: "#4B5563" }}>Dimensions: <strong style={{ color: NAVY }}>{dims} {p.dimensionUnit || ""}</strong></div> : null}
              {(p.tags || []).length > 0 && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 }}>
                  {(p.tags || []).map(t => (
                    <span key={t} style={{ fontSize: 11, color: "#6B7280", background: "#fff", border: "1px solid #E8E8F0", padding: "2px 10px", borderRadius: 8 }}>#{t}</span>
                  ))}
                </div>
              )}
            </div>
          )}
          {(p.images || []).length > 1 && (
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {(p.images || []).slice(1, 5).map((url, idx) => (
                <div key={idx} style={{ width: 56, height: 56, borderRadius: 8, overflow: "hidden", border: "1px solid #E8E8F0" }}>
                  <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
            </div>
          )}
          <div style={{ display: "flex", gap: 10 }}>
            {can("product:update") && (
              <button onClick={() => { const current = detail?.id === p.id ? detail : p; setDetail(null); openEdit(current); }} style={{ flex: 1, background: AMBER, color: NAVY, border: "none", borderRadius: 10, height: 46, fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <Pencil size={15} /> Edit
              </button>
            )}
            {can("product:delete") && (
              <button onClick={async () => { try { await deleteProduct(p.id); setProducts(pr => pr.filter(x => x.id !== p.id)); setSelected(s => s.filter(x => x !== p.id)); if (detail?.id === p.id) setDetail(null); toast.info("Product deleted"); } catch { toast.error("Failed to delete"); } }} style={{ flex: 1, background: "#FEF2F2", color: "#E74C3C", border: "1px solid #FECACA", borderRadius: 10, height: 46, fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <Trash2 size={15} /> Delete
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // List view (desktop) keeps a live selection: explicit click wins, otherwise
  // the first visible row fills the right-hand pane so it never sits empty.
  const listActive = (detail && filtered.find(x => x.id === detail.id)) || filtered[0] || null;

  return (
    <div style={{ position: "relative", animation: "fadeIn 0.35s ease" }}>
      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "stretch" : "center", gap: 12, marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: isMobile ? 22 : 28, color: NAVY, margin: 0 }}>Products</h2>
          <div style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>{products.length} total · {counts.low} low stock · {counts.out} out of stock</div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", background: "#F3F4F6", borderRadius: 10, padding: 3, gap: 2 }} role="tablist" aria-label="View mode">
            <button onClick={() => setViewMode("grid")} title="Grid view" aria-pressed={viewMode === "grid"} style={{ border: "none", background: viewMode === "grid" ? "#fff" : "transparent", color: viewMode === "grid" ? NAVY : "#9CA3AF", borderRadius: 8, padding: "7px 10px", cursor: "pointer", display: "flex", alignItems: "center", boxShadow: viewMode === "grid" ? "0 1px 3px rgba(15,15,26,0.12)" : "none" }}>
              <LayoutGrid size={16} />
            </button>
            <button onClick={() => setViewMode("list")} title="List view" aria-pressed={viewMode === "list"} style={{ border: "none", background: viewMode === "list" ? "#fff" : "transparent", color: viewMode === "list" ? NAVY : "#9CA3AF", borderRadius: 8, padding: "7px 10px", cursor: "pointer", display: "flex", alignItems: "center", boxShadow: viewMode === "list" ? "0 1px 3px rgba(15,15,26,0.12)" : "none" }}>
              <List size={16} />
            </button>
          </div>
          {can("product:delete") && products.length > 0 && (
            <button onClick={() => { setSelectMode(s => !s); if (selectMode) setSelected([]); }} style={{ border: selectMode ? `1.5px solid ${AMBER}` : "1.5px solid var(--border)", background: selectMode ? "#FFF8ED" : "#fff", borderRadius: 10, padding: "10px 16px", fontSize: 14, cursor: "pointer", color: NAVY, fontWeight: selectMode ? 700 : 500 }}>
              {selectMode ? "Done" : "Select"}
            </button>
          )}
          {can("product:create") && <>
            <button onClick={() => setCsvOpen(true)} style={{ border: "1.5px solid var(--border)", background: "#fff", borderRadius: 10, padding: "10px 16px", fontSize: 14, cursor: "pointer", color: NAVY, display: "flex", alignItems: "center", gap: 6 }}>
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
      ) : viewMode === "list" ? (
        isMobile ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filtered.map((p) => {
              const status = statusOf(p);
              const ss = statusBadge[status] || statusBadge["In Stock"];
              const isSel = selected.includes(p.id);
              const img = (p.images && p.images[0]) || null;
              return (
                <div key={p.id} onClick={() => { if (selectMode) toggleSelect(p.id); else setDetail(p); }} style={{ background: "#fff", borderRadius: 10, border: isSel ? `2px solid ${AMBER}` : "1px solid #E8E8F0", boxShadow: "0 1px 3px rgba(15,15,26,0.06)", padding: "10px 12px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                  {selectMode && (
                    <input type="checkbox" checked={isSel} onChange={() => toggleSelect(p.id)} onClick={e => e.stopPropagation()} style={{ width: 16, height: 16, cursor: "pointer", accentColor: AMBER, flexShrink: 0 }} />
                  )}
                  <div style={{ width: 48, height: 48, borderRadius: 8, background: "#F9FAFB", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {img ? (
                      <img src={img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <Package size={22} strokeWidth={1.5} color="#6B7280" />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0, marginLeft: 88 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: NAVY, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: "#9CA3AF", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.cat}</div>
                  </div>
                  <span style={{ background: ss.bg, color: ss.color, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 8, flexShrink: 0 }}>{status}</span>
                  <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 14, color: NAVY, flexShrink: 0 }}>{formatMoney(p.price, currency)}</span>
                  <span style={{ fontSize: 12, color: status === "Out of Stock" ? "#E74C3C" : "#6B7280", flexShrink: 0, minWidth: 72, textAlign: "right" }}>{p.stock} in stock</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ display: "flex", gap: 24, alignItems: "flex-start", justifyContent: "space-between" }}>
            <div style={{ flex: "1 1 560px", maxWidth: 640, minWidth: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              {filtered.map((p) => {
                const status = statusOf(p);
                const ss = statusBadge[status] || statusBadge["In Stock"];
                const isSel = selected.includes(p.id);
                const isActive = listActive?.id === p.id;
                const img = (p.images && p.images[0]) || null;
                return (
                  <div key={p.id} onClick={() => { if (selectMode) toggleSelect(p.id); else setDetail(p); }} style={{ background: isActive && !selectMode ? "#FFF8ED" : "#fff", borderRadius: 10, border: isSel || (isActive && !selectMode) ? `2px solid ${AMBER}` : "1px solid #E8E8F0", boxShadow: "0 1px 3px rgba(15,15,26,0.06)", padding: "10px 12px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                    {selectMode && (
                      <input type="checkbox" checked={isSel} onChange={() => toggleSelect(p.id)} onClick={e => e.stopPropagation()} style={{ width: 16, height: 16, cursor: "pointer", accentColor: AMBER, flexShrink: 0 }} />
                    )}
                    <div style={{ width: 48, height: 48, borderRadius: 8, background: "#F9FAFB", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {img ? (
                        <img src={img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <Package size={22} strokeWidth={1.5} color="#6B7280" />
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0, marginLeft: 88 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: NAVY, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: "#9CA3AF", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.cat}</div>
                    </div>
                    <span style={{ background: ss.bg, color: ss.color, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 8, flexShrink: 0 }}>{status}</span>
                    <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 14, color: NAVY, flexShrink: 0 }}>{formatMoney(p.price, currency)}</span>
                  <span style={{ fontSize: 12, color: status === "Out of Stock" ? "#E74C3C" : "#6B7280", flexShrink: 0, minWidth: 72, textAlign: "right" }}>{p.stock} in stock</span>
                  </div>
                );
              })}
            </div>
            <div style={{ flex: "0 1 460px", width: 460, maxWidth: "100%", minWidth: 0, position: "sticky", top: 12 }}>
              {listActive ? renderDetailCard(listActive, false) : null}
            </div>
          </div>
        )
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 10 }}>
          {filtered.map((p, i) => {
            const status = statusOf(p);
            const ss = statusBadge[status] || statusBadge["In Stock"];
            const isSel = selected.includes(p.id);
            const img = (p.images && p.images[0]) || null;
            return (
              <div key={p.id} onClick={() => { if (selectMode) toggleSelect(p.id); else setDetail(p); }} style={{ background: "#fff", borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 3px rgba(15,15,26,0.06)", border: isSel ? `2px solid ${AMBER}` : "1px solid #E8E8F0", transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)", animation: `fadeIn 0.3s ease ${i * 0.05}s both`, aspectRatio: "1 / 1", display: "flex", flexDirection: "column", cursor: "pointer" }}>
                <div style={{ height: "58%", minHeight: 0, background: "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", borderBottom: "1px solid #F3F4F6", overflow: "hidden", flexShrink: 0 }}>
                  {img ? (
                    <img src={img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <Package size={32} strokeWidth={1.5} color="#6B7280" />
                  )}
                  <span style={{ position: "absolute", top: 6, left: 6, background: ss.bg, color: ss.color, fontSize: 9, fontWeight: 600, padding: "2px 6px", borderRadius: 6 }}>{status}</span>
                  {p.badge ? (
                    <span style={{ position: "absolute", top: 6, right: 6, background: "#E74C3C", color: "#fff", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 6, textTransform: "uppercase", maxWidth: "60%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.badge}</span>
                  ) : null}
                  {selectMode && (
                    <input type="checkbox" checked={isSel} onChange={() => toggleSelect(p.id)} onClick={e => e.stopPropagation()} style={{ position: "absolute", bottom: 6, right: 6, width: 16, height: 16, cursor: "pointer", accentColor: AMBER }} />
                  )}
                </div>
                <div style={{ padding: "6px 8px", flex: 1, minHeight: 0, overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div style={{ fontWeight: 600, fontSize: 12, color: NAVY, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 6, marginTop: 2 }}>
                    <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 13, color: AMBER, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{formatMoney(p.price, currency)}</span>
                    <span style={{ fontSize: 10, color: status === "Out of Stock" ? "#E74C3C" : "#6B7280", flexShrink: 0 }}>{p.stock} left</span>
                  </div>
                </div>
              </div>
            );
          })}
          <div onClick={openAdd} style={{ border: "2px dashed #E8E8F0", borderRadius: 10, aspectRatio: "1 / 1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer", background: "#FAFAFA", transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)" }}>
            <div style={{ width: 36, height: 36, background: "#FFF8ED", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Plus size={18} color={AMBER} />
            </div>
            <span style={{ fontWeight: 600, fontSize: 12, color: NAVY }}>Add Product</span>
          </div>
        </div>
      )}

      {detail && !panel && (viewMode !== "list" || isMobile) && (
        <>
          <div onClick={() => setDetail(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 90 }} />
          <div style={{ position: "fixed", inset: 0, zIndex: 91, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, pointerEvents: "none" }}>
            <div style={{ pointerEvents: "auto", width: 480, maxWidth: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.25)", borderRadius: 16 }}>
              {renderDetailCard(detail, true)}
            </div>
          </div>
        </>
      )}

      {csvOpen && (
        <>
          <div onClick={closeCsvModal} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100 }} />
          <div style={{ position: "fixed", inset: 0, zIndex: 101, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, pointerEvents: "none" }}>
            <div style={{ pointerEvents: "auto", background: "#fff", borderRadius: 16, width: 560, maxWidth: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.25)", animation: "fadeIn 0.25s ease", padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 18, color: NAVY, margin: 0 }}>Import products from CSV</h3>
                <button onClick={closeCsvModal} style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280", display: "flex" }}><X size={20} /></button>
              </div>
              <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 16px", lineHeight: 1.5 }}>Columns: <strong>name, price</strong> (required), compareAt, description, category, stock, badge, tags (separated with ;), imageUrl. Avoid commas inside values.</p>
              <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
                <button onClick={downloadSampleCsv} style={{ border: "1.5px solid var(--border)", background: "#fff", borderRadius: 10, padding: "10px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", color: NAVY, display: "flex", alignItems: "center", gap: 6 }}>
                  <Upload size={15} /> Download sample CSV
                </button>
                <input type="file" ref={csvFileRef} accept=".csv" onChange={handleCsvFile} style={{ display: "none" }} />
                <button onClick={() => csvFileRef.current?.click()} style={{ background: NAVY, color: "#fff", border: "none", borderRadius: 10, padding: "10px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  {csvName ? "Choose a different file" : "Choose CSV file"}
                </button>
              </div>
              {csvName && (
                <div style={{ fontSize: 13, color: NAVY, fontWeight: 600, marginBottom: 8 }}>{csvName} · {csvRows.filter(r => r.valid).length} of {csvRows.length} rows ready</div>
              )}
              {csvError && (
                <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#DC2626", marginBottom: 12 }}>{csvError}</div>
              )}
              {csvRows.length > 0 && (
                <div style={{ border: "1px solid #E8E8F0", borderRadius: 10, overflow: "hidden", marginBottom: 16 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 90px 110px", gap: 8, padding: "8px 12px", background: "#F9FAFB", fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase" }}>
                    <span>Product</span><span style={{ textAlign: "right" }}>Price</span><span style={{ textAlign: "right" }}>Status</span>
                  </div>
                  <div style={{ maxHeight: 220, overflowY: "auto" }}>
                    {csvRows.slice(0, 8).map((r, idx) => (
                      <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr 90px 110px", gap: 8, padding: "8px 12px", fontSize: 13, color: r.valid ? NAVY : "#9CA3AF", borderTop: "1px solid #F3F4F6", alignItems: "center" }}>
                        <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</span>
                        <span style={{ textAlign: "right" }}>{formatMoney(r.price, currency)}</span>
                        <span style={{ textAlign: "right", color: r.valid ? "#16A34A" : "#DC2626", fontSize: 12 }}>{r.valid ? "Ready" : r.error}</span>
                      </div>
                    ))}
                  </div>
                  {csvRows.length > 8 && (
                    <div style={{ padding: "8px 12px", fontSize: 12, color: "#9CA3AF", borderTop: "1px solid #F3F4F6" }}>…and {csvRows.length - 8} more</div>
                  )}
                </div>
              )}
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={confirmCsvImport} disabled={csvBusy || !csvRows.some(r => r.valid)} style={{ flex: 1, background: csvBusy || !csvRows.some(r => r.valid) ? "#D1D5DB" : AMBER, color: NAVY, border: "none", borderRadius: 10, height: 46, fontSize: 14, fontWeight: 700, cursor: csvBusy || !csvRows.some(r => r.valid) ? "not-allowed" : "pointer" }}>
                  {csvBusy ? "Importing..." : `Import ${csvRows.filter(r => r.valid).length} product(s)`}
                </button>
                <button onClick={closeCsvModal} disabled={csvBusy} style={{ background: "none", border: "1.5px solid var(--border)", borderRadius: 10, height: 46, padding: "0 20px", fontSize: 14, cursor: "pointer", color: "#6B7280" }}>Cancel</button>
              </div>
            </div>
          </div>
        </>
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
                <input value={form.name} onChange={e => { const value = e.target.value; setForm(f => ({ ...f, name: value, ...(!skuManual ? { sku: generateSku(value) } : {}) })); }} placeholder="Jollof Rice & Chicken" style={inputStyle} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Description * ({(form.description || "").length}/{DESCRIPTION_MAX})</label>
                <textarea value={form.description || ""} maxLength={DESCRIPTION_MAX} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="What buyers need to know — materials, usage, care…" rows={3} style={{ ...inputStyle, resize: "vertical" }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Short description ({(form.shortDescription || "").length}/{SHORT_DESCRIPTION_MAX})</label>
                <input value={form.shortDescription} maxLength={SHORT_DESCRIPTION_MAX} onChange={e => setForm(f => ({ ...f, shortDescription: e.target.value }))} placeholder="One line for cards and search results" style={inputStyle} />
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ marginBottom: 16, flex: 1 }}>
                  <label style={labelStyle}>Weight</label>
                  <input type="number" value={form.weight} onChange={e => setForm(f => ({ ...f, weight: e.target.value }))} placeholder="e.g. 500" style={inputStyle} />
                </div>
                <div style={{ marginBottom: 16, flex: 1 }}>
                  <label style={labelStyle}>Weight unit</label>
                  <select value={form.weightUnit} onChange={e => setForm(f => ({ ...f, weightUnit: e.target.value }))} style={{ ...inputStyle, cursor: "pointer" }}>
                    {WEIGHT_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: 16, flex: 1 }}>
                  <label style={labelStyle}>SKU (serial)</label>
                  <input value={form.sku} onChange={e => { setForm(f => ({ ...f, sku: e.target.value })); setSkuManual(true); }} placeholder="PRD-000000" style={inputStyle} />
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Dimensions (L × W × H)</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {["length", "width", "height"].map(k => (
                    <input key={k} type="number" value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} placeholder={k[0].toUpperCase()} style={{ ...inputStyle, flex: 1 }} />
                  ))}
                  <select value={form.dimensionUnit} onChange={e => setForm(f => ({ ...f, dimensionUnit: e.target.value }))} style={{ ...inputStyle, cursor: "pointer", flex: 1 }}>
                    {DIMENSION_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
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
                  <label style={labelStyle}>Discount price ({sym}) *</label>
                  <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="2500" style={inputStyle} />
                </div>
                <div style={{ marginBottom: 16, flex: 1 }}>
                  <label style={labelStyle}>Original price ({sym})</label>
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
              <button onClick={saveProduct} disabled={saving} style={{ flex: 1, background: saving ? "#D1D5DB" : AMBER, color: NAVY, border: "none", borderRadius: 10, height: 48, fontSize: 15, fontWeight: 700, cursor: saving ? "wait" : "pointer", fontFamily: "'Sora',sans-serif", opacity: saving ? 0.7 : 1 }}>{saving ? "Saving..." : "Save Product"}</button>
              <button onClick={() => setPanel(null)} style={{ background: "none", border: "1.5px solid var(--border)", borderRadius: 10, height: 48, padding: "0 20px", fontSize: 15, cursor: "pointer", color: "#6B7280" }}>Cancel</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
