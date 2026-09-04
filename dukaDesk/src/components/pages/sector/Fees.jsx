import { useState, useEffect } from "react";
import { Wallet, Users, Receipt, CheckCircle2, Search } from "lucide-react";
import { useIsMobile } from "../../../hooks/useMediaQuery";
import { NAVY, AMBER, cardStyle, statCard } from "../../../theme";
import { getDashboardStats, getOrders } from "../../../services/api";
import { Loading, Empty, ErrorState } from "../../layout/States";

export default function Fees() {
  const isMobile = useIsMobile();
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([getDashboardStats(), getOrders()])
      .then(([s, o]) => { setStats(s); setOrders(Array.isArray(o) ? o : []); })
      .catch(() => setError("Failed to load fees"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = orders.filter(o =>
    !search || (o.customer || "").toLowerCase().includes(search.toLowerCase())
  );

  const statsCards = [
    { label: "Fees Collected", value: `₦${(stats?.revenue || 0).toLocaleString()}`, icon: Wallet, color: AMBER },
    { label: "Paying Students", value: stats?.customers || 0, icon: Users, color: "#7C3AED" },
    { label: "Pending Records", value: orders?.filter(o => o.status !== "Completed").length || 0, icon: Receipt, color: "#0D9488" },
  ];

  if (loading) return <Loading message="Loading fees..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div style={{ animation: "fadeIn 0.35s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: isMobile ? 22 : 28, color: NAVY, margin: 0 }}>Fees</h2>
          <p style={{ color: "#6B7280", fontSize: 14, marginTop: 4 }}>Track collections and outstanding balances.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F3F4F6", borderRadius: 10, padding: "8px 12px" }}>
          <Search size={16} color="#9CA3AF" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search student..." style={{ background: "none", border: "none", outline: "none", fontSize: 13, color: NAVY, width: 180, fontFamily: "inherit" }} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
        {statsCards.map((s, i) => (
          <div key={i} style={{ ...statCard, display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 40, height: 40, background: s.color + "14", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}><s.icon size={20} color={s.color} /></div>
            <div>
              <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 500 }}>{s.label}</div>
              <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 22, color: NAVY }}>{typeof s.value === "number" ? s.value.toLocaleString() : s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ ...cardStyle }}>
        <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 16, color: NAVY, marginBottom: 16 }}>Payment Records</div>
        {filtered.length === 0 ? (
          <Empty icon="FileText" message="No fee records yet" sub="Student fee payments will appear here." />
        ) : (
          filtered.slice(0, 12).map((o, i) => {
            const paid = o.status === "Completed";
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: i < Math.min(filtered.length, 12) - 1 ? "1px solid #F3F4F6" : "none" }}>
                <div style={{ width: 36, height: 36, background: `${AMBER}14`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: NAVY }}>{(o.customer || "S")[0]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: NAVY }}>{o.customer || "Student"}</div>
                  <div style={{ fontSize: 12, color: "#6B7280" }}>{o.date || "Recent"}</div>
                </div>
                <span style={{ background: paid ? "#F0FDF4" : "#FFF8ED", color: paid ? "#065F46" : "#92400E", fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 20, display: "flex", alignItems: "center", gap: 4 }}>
                  {paid && <CheckCircle2 size={12} />} {paid ? "Paid" : "Pending"}
                </span>
                <span style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>₦{(o.total || 0).toLocaleString()}</span>
              </div>
            );
          })
        )}
      </div>

      <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 16 }}>Initial view bound to orders &amp; dashboard statistics. Full fee ledger and invoicing arrive in a later phase.</p>
    </div>
  );
}