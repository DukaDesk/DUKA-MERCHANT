import { useState, useEffect } from "react";
import { Search, X, Download, Eye, ChevronRight } from "lucide-react";
import { useToast } from "../../App";
import { useIsMobile } from "../../hooks/useMediaQuery";
import { NAVY, AMBER, cardStyle, statusBadge } from "../../theme";
import { getOrders, updateOrderStatus } from "../../services/api";
import { Loading, Empty } from "../layout/States";

const nextStatus = { Pending: "Processing", Processing: "Completed" };
const tabs = ["All", "Pending", "Processing", "Completed", "Cancelled"];

export default function Orders() {
  const showToast = useToast();
  const isMobile = useIsMobile();
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState("All");
  const [detail, setDetail] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { getOrders().then(setOrders).catch(() => showToast("Failed to load orders", "error")).finally(() => setLoading(false)); }, []);

  const filtered = orders.filter(o => {
    if (tab !== "All" && o.status !== tab) return false;
    if (search && !o.id.toLowerCase().includes(search.toLowerCase()) && !o.customer.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const updateStatus = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      setOrders(o => o.map(x => x.id === id ? { ...x, status } : x));
      showToast(`Order ${id} updated to ${status}`, "success");
      if (detail?.id === id) setDetail(d => ({ ...d, status }));
    } catch { showToast("Failed to update order", "error"); }
  };

  if (loading) return <Loading message="Loading orders..." />;

  const orderStats = [
    { label: "Today", value: `${orders.length} orders`, sub: `₦${orders.reduce((a,o) => a+o.total,0).toLocaleString()}`, color: NAVY },
    { label: "Pending", value: orders.filter(o=>o.status==="Pending").length, sub: "Needs action", color: AMBER },
    { label: "Processing", value: orders.filter(o=>o.status==="Processing").length, sub: "In progress", color: "#3B82F6" },
    { label: "Completed", value: orders.filter(o=>o.status==="Completed").length, sub: "This month", color: "#2ECC71" },
  ];

  return (
    <div style={{ position: "relative", animation: "fadeIn 0.35s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 28, color: NAVY, margin: 0 }}>Orders</h2>
          <div style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>Track and manage customer orders</div>
        </div>
        <button onClick={() => showToast("Export started", "success")} style={{ border: "1.5px solid var(--border)", background: "#fff", borderRadius: 10, padding: "10px 16px", fontSize: 14, cursor: "pointer", color: NAVY, display: "flex", alignItems: "center", gap: 6 }}>
          <Download size={16} /> Export
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: isMobile ? 10 : 14, marginBottom: 24 }}>
        {orderStats.map((k, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 10, padding: 18, boxShadow: "0 1px 3px rgba(15,15,26,0.06)", border: "1px solid #E8E8F0" }}>
            <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 6 }}>{k.label}</div>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 22, color: k.color }}>{typeof k.value === "number" ? k.value : k.value}</div>
            <div style={{ fontSize: 12, color: "#9CA3AF" }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: 12, padding: "16px 20px", boxShadow: "0 1px 3px rgba(15,15,26,0.06)", border: "1px solid #E8E8F0", marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
          {tabs.map(t => {
            const count = t === "All" ? orders.length : orders.filter(o => o.status === t).length;
            return <button key={t} onClick={() => setTab(t)} style={{
              padding: "6px 16px", borderRadius: 8,
              border: `1.5px solid ${tab === t ? AMBER : "#E8E8F0"}`,
              background: tab === t ? "#FFF8ED" : "#fff",
              color: tab === t ? "#92400E" : "#6B7280",
              fontSize: 13, fontWeight: tab === t ? 600 : 400, cursor: "pointer",
            }}>{t} {count > 0 && `(${count})`}</button>;
          })}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F3F4F6", borderRadius: 10, padding: "8px 12px" }}>
          <Search size={16} color="#9CA3AF" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search order ID or customer name..." style={{ background: "none", border: "none", outline: "none", fontSize: 14, color: NAVY, flex: 1, fontFamily: "inherit" }} />
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(15,15,26,0.06)", border: "1px solid #E8E8F0" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", minWidth: isMobile ? 650 : "auto", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F9FAFB" }}>
                {["Order ID", "Customer", "Items", "Total", "Payment", "Status", "Date", ""].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid #E8E8F0", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((o, i) => {
                const ss = statusBadge[o.status] || statusBadge.Pending;
                return (
                  <tr key={o.id} style={{ borderBottom: "1px solid #F3F4F6", background: i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                    <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 700, color: NAVY, fontFamily: "'JetBrains Mono', monospace" }}>{o.id}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 30, height: 30, background: AMBER, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: NAVY, flexShrink: 0 }}>{(o.customer || "?")[0]}</div>
                        <span style={{ fontSize: 14, fontWeight: 500, color: NAVY }}>{o.customer}</span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#6B7280", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.items}</td>
                    <td style={{ padding: "14px 16px", fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 14, color: AMBER }}>₦{o.total.toLocaleString()}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#6B7280" }}>{o.payment}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ background: ss.bg, color: ss.color, fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 8 }}>{o.status}</span>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 12, color: "#9CA3AF", whiteSpace: "nowrap" }}>{o.date}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <button onClick={() => setDetail(o)} style={{ background: "none", border: "none", color: AMBER, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                        <Eye size={14} /> View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div style={{ padding: 40, textAlign: "center", color: "#9CA3AF" }}>No orders found.</div>}
      </div>

      {detail && (
        <>
          <div onClick={() => setDetail(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 100 }} />
          <div style={{ position: "fixed", right: 0, top: 0, width: 520, maxWidth: "100vw", height: "100vh", background: "#fff", zIndex: 101, boxShadow: "-8px 0 32px rgba(0,0,0,0.12)", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: 24, borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 18, color: NAVY }}>Order #{detail.id}</div>
                <span style={{ background: (statusBadge[detail.status]||statusBadge.Pending).bg, color: (statusBadge[detail.status]||statusBadge.Pending).color, fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 8, marginTop: 4, display: "inline-block" }}>{detail.status}</span>
              </div>
              <button onClick={() => setDetail(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280", display: "flex" }}><X size={22} /></button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
              <div style={{ background: "#F9FAFB", borderRadius: 12, padding: 16, marginBottom: 20 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ width: 44, height: 44, background: AMBER, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: NAVY, fontSize: 16 }}>{(detail.customer || "?")[0]}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15, color: NAVY }}>{detail.customer}</div>
                    <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>📍 {detail.address}</div>
                  </div>
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: NAVY, marginBottom: 10 }}>Items Ordered</div>
                <div style={{ background: "#F9FAFB", borderRadius: 8, padding: 12, fontSize: 14, color: "#374151" }}>{detail.items}</div>
              </div>
              <div style={{ background: "#FFF8ED", borderRadius: 12, padding: 16, marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ color: "#6B7280", fontSize: 13 }}>Subtotal</span>
                  <span style={{ fontSize: 13 }}>₦{(detail.total - 500).toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid #E8E8F0" }}>
                  <span style={{ color: "#6B7280", fontSize: 13 }}>Delivery</span>
                  <span style={{ fontSize: 13 }}>₦500</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: 700, color: NAVY }}>Total</span>
                  <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 18, color: AMBER }}>₦{detail.total.toLocaleString()}</span>
                </div>
              </div>
              <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 20 }}>Paid via {detail.payment} · {detail.date}</div>
              <div style={{ fontWeight: 600, fontSize: 14, color: NAVY, marginBottom: 12 }}>Order Timeline</div>
              {["Order placed", "Accepted", "Preparing", "Ready", "Delivered"].map((step, i) => {
                const doneSteps = { Pending: 0, Processing: 1, Completed: 4, Cancelled: 0 };
                const done = i <= (doneSteps[detail.status] || 0);
                return (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: done ? "#2ECC71" : "#E8E8F0", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: done ? "#fff" : "#9CA3AF", marginTop: 2 }}>{done ? "✓" : "○"}</div>
                    <span style={{ fontSize: 13, color: done ? NAVY : "#9CA3AF", fontWeight: done ? 500 : 400 }}>{step}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ padding: 24, borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 10 }}>
              {nextStatus[detail.status] && <button onClick={() => updateStatus(detail.id, nextStatus[detail.status])} style={{ background: "#2ECC71", color: "#fff", border: "none", borderRadius: 10, height: 48, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Accept Order →</button>}
              {detail.status === "Pending" && <button onClick={() => { updateStatus(detail.id, "Cancelled"); setDetail(null); }} style={{ background: "none", border: "1.5px solid #E74C3C", borderRadius: 10, height: 44, fontSize: 14, cursor: "pointer", color: "#E74C3C" }}>Reject Order</button>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
