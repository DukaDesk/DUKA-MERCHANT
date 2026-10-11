import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, ArrowLeft, Package, AlertTriangle, TrendingUp } from "lucide-react";
import { useIsMobile } from "../../hooks/useMediaQuery";
import { toast } from "react-toastify";
import { NAVY, AMBER, GREEN, RED, cardStyle, inputStyle, statCard, transition, statusBadge } from "../../theme";
import { getProducts, adjustProductStock } from "../../services/api";
import { deriveStatus } from "./Products";
import { Loading, Empty, ErrorState } from "../layout/States";

export default function Inventory() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [editItem, setEditItem] = useState(null);
  const [adjustQty, setAdjustQty] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadItems = () => {
    setError(null);
    setLoading(true);
    getProducts()
      .then(list => setItems(Array.isArray(list) ? list : []))
      .catch(() => setError("Failed to load inventory"))
      .finally(() => setLoading(false));
  };
  useEffect(loadItems, []);

  const statusOf = (item) => deriveStatus(item.stock);
  const filtered = items.filter(i => {
    if (filter !== "All" && statusOf(i) !== filter) return false;
    if (search && !`${i.name} ${i.sku || ""} ${i.cat || ""}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const lowItems = items.filter(i => statusOf(i) !== "In Stock");
  const totalValue = items.reduce((sum, i) => sum + (Number(i.stock) || 0) * (Number(i.price) || 0), 0);
  const reservedTotal = items.reduce((sum, i) => sum + (Number(i.reservedStock ?? i.reserved ?? 0) || 0), 0);

  const handleAdjust = async () => {
    if (!editItem || adjustQty === "") return;
    const qty = parseInt(adjustQty, 10);
    if (isNaN(qty) || qty === 0) { toast.error("Enter a non-zero number"); return; }
    setSaving(true);
    try {
      const updated = await adjustProductStock(editItem.id, qty);
      const nextStock = Number.isFinite(updated?.stock) ? updated.stock : Math.max(0, (Number(editItem.stock) || 0) + qty);
      setItems(prev => prev.map(i => (i.id === editItem.id
        ? { ...i, stock: nextStock, reservedStock: updated?.reservedStock ?? i.reservedStock }
        : i)));
      toast.success(`${editItem.name} stock ${qty >= 0 ? "increased" : "decreased"} by ${Math.abs(qty)}`);
      setEditItem(null);
      setAdjustQty("");
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Stock update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading message="Loading inventory..." />;
  if (error) return <ErrorState message={error} onRetry={loadItems} />;

  return (
    <div style={{ animation: "fadeIn 0.35s ease" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4, flexWrap: "wrap", gap: 12 }}>
        <div>
          <button onClick={() => navigate("/dashboard")} style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 14, marginBottom: 8, padding: 0 }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: isMobile ? 22 : 28, color: NAVY, margin: 0 }}>Inventory</h2>
          <div style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>{items.length} products tracked · {reservedTotal} units reserved in carts</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: isMobile ? 10 : 14, marginBottom: 24 }}>
        {[
          { label: "Total Items", value: items.length, icon: Package, color: NAVY },
          { label: "Low Stock Alerts", value: lowItems.length, icon: AlertTriangle, color: lowItems.length > 0 ? RED : GREEN },
          { label: "Stock Value", value: `₦${totalValue.toLocaleString()}`, icon: TrendingUp, color: AMBER },
          { label: "Out of Stock", value: items.filter(i => statusOf(i) === "Out of Stock").length, icon: Package, color: RED },
        ].map((k, i) => (
          <div key={k.label} style={{ ...statCard, animation: `fadeIn 0.3s ease ${i * 0.1}s both` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <k.icon size={15} color={k.color} />
              <span style={{ fontSize: 12, color: "#6B7280" }}>{k.label}</span>
            </div>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: isMobile ? 20 : 24, color: NAVY }}>{k.value}</div>
          </div>
        ))}
      </div>

      {lowItems.length > 0 && (
        <div style={{ ...cardStyle, marginBottom: 20, borderLeft: `4px solid ${RED}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, fontSize: 14, fontWeight: 700, color: NAVY }}>
            <AlertTriangle size={16} color={RED} /> Needs restocking ({lowItems.length})
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {lowItems.slice(0, 12).map(item => (
              <button key={item.id} onClick={() => { setEditItem(item); setAdjustQty(""); }} style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 600, color: "#991B1B", cursor: "pointer" }}>
                {item.name} · {Number(item.stock) || 0} left
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ ...cardStyle, padding: "14px 16px", marginBottom: 20, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F3F4F6", borderRadius: 10, padding: "8px 12px", flex: 1, minWidth: 200 }}>
          <Search size={16} color="#9CA3AF" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, SKU or category..." style={{ background: "none", border: "none", outline: "none", fontSize: 14, color: NAVY, flex: 1, fontFamily: "inherit" }} />
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["All", "In Stock", "Low Stock", "Out of Stock"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "6px 14px", borderRadius: 8, border: "none",
              background: filter === f ? AMBER : "#F3F4F6",
              color: filter === f ? NAVY : "#6B7280",
              fontSize: 13, fontWeight: filter === f ? 700 : 500, cursor: "pointer", transition,
            }}>{f}</button>
          ))}
        </div>
      </div>

      <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
        {filtered.length === 0 ? (
          <Empty icon={<Package size={40} color="#9CA3AF" />} message={items.length === 0 ? "No inventory yet" : "No inventory items match your filter"}
            sub={items.length === 0 ? "Add products first — they appear here automatically" : "Try a different filter or search term"} />
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
              <thead>
                <tr style={{ background: "#F9FAFB", borderBottom: "1px solid var(--border)" }}>
                  {["Product", "SKU", "Category", "Stock", "Reserved", "Price", "Value", "Status", "Actions"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", fontSize: 12, fontWeight: 600, color: "#6B7280", textAlign: "left", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, i) => {
                  const status = statusOf(item);
                  const sc = statusBadge[status] || statusBadge["In Stock"];
                  const stock = Number(item.stock) || 0;
                  const reserved = Number(item.reservedStock ?? item.reserved ?? 0) || 0;
                  return (
                    <tr key={item.id} style={{ borderBottom: "1px solid #F3F4F6", animation: `fadeIn 0.2s ease ${i * 0.03}s both`, transition }}>
                      <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: NAVY }}>{item.name}</td>
                      <td style={{ padding: "12px 16px", fontSize: 12, color: "#6B7280", fontFamily: "monospace" }}>{item.sku || "—"}</td>
                      <td style={{ padding: "12px 16px", fontSize: 12, color: "#6B7280" }}>{item.cat || "—"}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: status === "In Stock" ? NAVY : RED }}>{stock}</span>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 13, color: "#6B7280" }}>{reserved}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: NAVY }}>₦{Number(item.price || 0).toLocaleString()}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13, color: "#6B7280" }}>₦{(stock * Number(item.price || 0)).toLocaleString()}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: sc.bg, color: sc.color }}>{status}</span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <button onClick={() => { setEditItem(item); setAdjustQty(""); }} style={{ background: "none", border: "1px solid var(--border)", borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer", color: NAVY, transition }}>
                          Adjust
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editItem && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(15,15,26,0.5)", animation: "fadeIn 0.2s ease" }} onClick={() => setEditItem(null)}>
          <div style={{ ...cardStyle, width: "100%", maxWidth: 400, animation: "fadeScaleIn 0.3s ease" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 18, color: NAVY }}>Adjust Stock</h3>
              <button onClick={() => setEditItem(null)} style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer" }}><X size={18} /></button>
            </div>
            <div style={{ background: "#F9FAFB", borderRadius: 10, padding: 12, marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: NAVY }}>{editItem.name}</div>
              <div style={{ fontSize: 12, color: "#6B7280" }}>Current stock: <strong>{Number(editItem.stock) || 0}</strong> · {statusOf(editItem)}</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: NAVY, marginBottom: 6 }}>Quantity Change</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input type="number" style={inputStyle} value={adjustQty} onChange={e => setAdjustQty(e.target.value)} placeholder="e.g. +10 or -5" />
              </div>
              <div style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>Use positive numbers to add, negative to subtract. Saved to the backend immediately.</div>
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button onClick={() => setEditItem(null)} style={{ border: "1.5px solid var(--border)", background: "#fff", borderRadius: 10, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer", color: "#6B7280" }}>Cancel</button>
              <button onClick={handleAdjust} disabled={saving} style={{ background: AMBER, color: NAVY, border: "none", borderRadius: 10, padding: "10px 24px", fontSize: 14, fontWeight: 700, cursor: saving ? "wait" : "pointer", opacity: saving ? 0.6 : 1 }}>
                {saving ? "Saving…" : "Update Stock"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
