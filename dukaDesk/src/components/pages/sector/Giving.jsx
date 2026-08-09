import { useState, useEffect } from "react";
import { HandCoins, Users, Heart, Receipt, Plus } from "lucide-react";
import { useIsMobile } from "../../../hooks/useMediaQuery";
import { NAVY, AMBER, cardStyle, statCard } from "../../../theme";
import { getDashboardStats, getOrders } from "../../../services/api";
import { Loading, Empty, ErrorState } from "../../layout/States";

export default function Giving() {
  const isMobile = useIsMobile();
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([getDashboardStats(), getOrders()])
      .then(([s, o]) => { setStats(s); setOrders(Array.isArray(o) ? o : []); })
      .catch(() => setError("Failed to load giving records"))
      .finally(() => setLoading(false));
  }, []);

  const statsCards = [
    { label: "Total Donations", value: `₦${(stats?.revenue || 0).toLocaleString()}`, icon: HandCoins, color: AMBER },
    { label: "Givers", value: stats?.customers || 0, icon: Users, color: "#7C3AED" },
    { label: "New Givers", value: orders?.length || 0, icon: Heart, color: "#EC4899" },
  ];

  if (loading) return <Loading message="Loading giving records..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div style={{ animation: "fadeIn 0.35s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: isMobile ? 22 : 28, color: NAVY, margin: 0 }}>Donations</h2>
          <p style={{ color: "#6B7280", fontSize: 14, marginTop: 4 }}>Track donations and givers in one place</p>
        </div>
        <button style={{ background: AMBER, color: NAVY, border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}><Plus size={16} /> Record Donation</button>
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
        <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 16, color: NAVY, marginBottom: 16 }}>Recent Donations</div>
        {orders.length === 0 ? (
          <Empty icon="🪙" message="No donations yet" sub="Donations will appear here as members give via your app." />
        ) : (
          orders.slice(0, 8).map((o, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: i < Math.min(orders.length, 8) - 1 ? "1px solid #F3F4F6" : "none" }}>
              <div style={{ width: 38, height: 38, background: `${AMBER}14`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}><Receipt size={18} color={AMBER} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: NAVY }}>{o.customer || "Member"}</div>
                <div style={{ fontSize: 12, color: "#6B7280" }}>{o.date || "Recent"}</div>
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>₦{(o.total || 0).toLocaleString()}</span>
            </div>
          ))
        )}
      </div>

      <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 16 }}>Initial view bound to orders &amp; dashboard statistics. Deepened donation ledger arrives in a later phase.</p>
    </div>
  );
}