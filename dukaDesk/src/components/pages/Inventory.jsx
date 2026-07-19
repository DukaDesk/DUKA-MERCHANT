import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, ArrowLeft, Package, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { useIsMobile } from "../../hooks/useMediaQuery";
import { useToast } from "../../contexts";
import { NAVY, AMBER, GREEN, RED, cardStyle, inputStyle, statCard, transition } from "../../theme";

const MOCK_INVENTORY = [
  { id: 1, name: "Jollof Rice & Chicken", sku: "JR-001", category: "Mains", stock: 34, minStock: 10, cost: 1500, price: 2500, unit: "portions", status: "In Stock" },
  { id: 2, name: "Peppered Gizzard", sku: "PG-002", category: "Sides", stock: 12, minStock: 10, cost: 800, price: 1800, unit: "portions", status: "Low Stock" },
  { id: 3, name: "Grilled Tilapia", sku: "GT-003", category: "Mains", stock: 4, minStock: 8, cost: 2000, price: 4500, unit: "portions", status: "Low Stock" },
  { id: 4, name: "Egusi Soup", sku: "ES-004", category: "Mains", stock: 0, minStock: 5, cost: 1200, price: 3200, unit: "portions", status: "Out of Stock" },
  { id: 5, name: "Zobo Drink", sku: "ZD-005", category: "Drinks", stock: 50, minStock: 15, cost: 200, price: 500, unit: "cups", status: "In Stock" },
  { id: 6, name: "Puff Puff (10 pcs)", sku: "PP-006", category: "Snacks", stock: 20, minStock: 10, cost: 350, price: 800, unit: "packs", status: "In Stock" },
  { id: 7, name: "Chapman Drink", sku: "CD-007", category: "Drinks", stock: 8, minStock: 5, cost: 300, price: 800, unit: "cups", status: "Low Stock" },
];

export default function Inventory() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const showToast = useToast();
  const [items, setItems] = useState(MOCK_INVENTORY);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [editItem, setEditItem] = useState(null);
  const [adjustQty, setAdjustQty] = useState("");

  const filtered = items.filter(i => {
    if (filter !== "All" && i.status !== filter) return false;
    if (search && !i.name.toLowerCase().includes(search.toLowerCase()) && !i.sku.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const lowStockCount = items.filter(i => i.status === "Low Stock" || i.status === "Out of Stock").length;
  const totalValue = items.reduce((a, i) => a + i.stock * i.cost, 0);

  const handleAdjust = () => {
    if (!editItem || !adjustQty) return;
    const qty = parseInt(adjustQty);
    if (isNaN(qty)) { showToast("Enter a valid number", "error"); return; }
    setItems(prev => prev.map(i => {
      if (i.id !== editItem.id) return i;
      const newStock = Math.max(0, i.stock + qty);
      const newStatus = newStock === 0 ? "Out of Stock" : newStock <= i.minStock ? "Low Stock" : "In Stock";
      return { ...i, stock: newStock, status: newStatus };
    }));
    showToast(`${editItem.name} stock ${qty >= 0 ? "increased" : "decreased"} by ${Math.abs(qty)}`, "success");
    setEditItem(null);
    setAdjustQty("");
  };

  return (
    <div style={{ animation: "fadeIn 0.35s ease" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4, flexWrap: "wrap", gap: 12 }}>
        <div>
          <button onClick={() => navigate("/dashboard")} style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 14, marginBottom: 8, padding: 0 }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: isMobile ? 22 : 28, color: NAVY, margin: 0 }}>Inventory</h2>
          <div style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>{items.length} products tracked</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: isMobile ? 10 : 14, marginBottom: 24 }}>
        {[
          { label: "Total Items", value: items.length, icon: Package, color: NAVY },
          { label: "Low Stock Alerts", value: lowStockCount, icon: AlertTriangle, color: lowStockCount > 0 ? RED : GREEN },
          { label: "Stock Value", value: `₦${totalValue.toLocaleString()}`, icon: TrendingUp, color: AMBER },
          { label: "Categories", value: [...new Set(items.map(i => i.category))].length, icon: Package, color: "#3B82F6" },
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

      <div style={{ ...cardStyle, padding: "14px 16px", marginBottom: 20, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F3F4F6", borderRadius: 10, padding: "8px 12px", flex: 1, minWidth: 200 }}>
          <Search size={16} color="#9CA3AF" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search inventory..." style={{ background: "none", border: "none", outline: "none", fontSize: 14, color: NAVY, flex: 1, fontFamily: "inherit" }} />
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
          <div style={{ padding: 60, textAlign: "center", color: "#9CA3AF" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>No inventory items match your filter</div>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
              <thead>
                <tr style={{ background: "#F9FAFB", borderBottom: "1px solid var(--border)" }}>
                  {["Product", "SKU", "Category", "Stock", "Min Stock", "Cost", "Price", "Status", "Actions"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", fontSize: 12, fontWeight: 600, color: "#6B7280", textAlign: "left", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, i) => {
                  const statusColors = {
                    "In Stock": { bg: "#F0FDF4", color: "#065F46" },
                    "Low Stock": { bg: "#FFF8ED", color: "#92400E" },
                    "Out of Stock": { bg: "#FEF2F2", color: "#991B1B" },
                  };
                  const sc = statusColors[item.status];
                  return (
                    <tr key={item.id} style={{ borderBottom: "1px solid #F3F4F6", animation: `fadeIn 0.2s ease ${i * 0.03}s both`, transition }}>
                      <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: NAVY }}>{item.name}</td>
                      <td style={{ padding: "12px 16px", fontSize: 12, color: "#6B7280", fontFamily: "monospace" }}>{item.sku}</td>
                      <td style={{ padding: "12px 16px", fontSize: 12, color: "#6B7280" }}>{item.category}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: item.stock <= item.minStock ? RED : NAVY }}>{item.stock}</span>
                        <span style={{ fontSize: 11, color: "#9CA3AF", marginLeft: 4 }}>{item.unit}</span>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 13, color: "#6B7280" }}>{item.minStock}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13, color: "#6B7280" }}>₦{item.cost.toLocaleString()}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: NAVY }}>₦{item.price.toLocaleString()}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: sc.bg, color: sc.color }}>{item.status}</span>
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
              <div style={{ fontSize: 12, color: "#6B7280" }}>Current stock: <strong>{editItem.stock} {editItem.unit}</strong> · Min: {editItem.minStock}</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: NAVY, marginBottom: 6 }}>Quantity Change</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input type="number" style={inputStyle} value={adjustQty} onChange={e => setAdjustQty(e.target.value)} placeholder="e.g. +10 or -5" />
              </div>
              <div style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>Use positive numbers to add, negative to subtract</div>
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button onClick={() => setEditItem(null)} style={{ border: "1.5px solid var(--border)", background: "#fff", borderRadius: 10, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer", color: "#6B7280" }}>Cancel</button>
              <button onClick={handleAdjust} style={{ background: AMBER, color: NAVY, border: "none", borderRadius: 10, padding: "10px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                Update Stock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
