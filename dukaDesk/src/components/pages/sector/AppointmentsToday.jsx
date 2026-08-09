import { useState, useEffect } from "react";
import { CalendarClock, Users, DollarSign, Star, CheckCircle2, Clock } from "lucide-react";
import { useIsMobile } from "../../../hooks/useMediaQuery";
import { NAVY, AMBER, cardStyle, statCard } from "../../../theme";
import { getDashboardStats, getOrders } from "../../../services/api";
import { Loading, Empty, ErrorState } from "../../layout/States";

export default function AppointmentsToday() {
  const isMobile = useIsMobile();
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([getDashboardStats(), getOrders()])
      .then(([s, o]) => { setStats(s); setOrders(Array.isArray(o) ? o : []); })
      .catch(() => setError("Failed to load appointments"))
      .finally(() => setLoading(false));
  }, []);

  const today = orders.filter(o => o.status !== "Cancelled");

  const statsCards = [
    { label: "Today", value: today.length, icon: CalendarClock, color: AMBER },
    { label: "Customers", value: stats?.customers || 0, icon: Users, color: "#7C3AED" },
    { label: "Revenue (Month)", value: `₦${(stats?.revenue || 0).toLocaleString()}`, icon: DollarSign, color: "#0D9488" },
  ];

  if (loading) return <Loading message="Loading appointments..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div style={{ animation: "fadeIn 0.35s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: isMobile ? 22 : 28, color: NAVY, margin: 0 }}>Appointments</h2>
          <p style={{ color: "#6B7280", fontSize: 14, marginTop: 4 }}>Today&apos;s bookings at a glance.</p>
        </div>
        <span style={{ background: `${AMBER}15`, color: AMBER, fontSize: 13, fontWeight: 600, padding: "6px 14px", borderRadius: 20 }}><Sparkles size={14} style={{ verticalAlign: "middle", marginRight: 4 }} /> Live</span>
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
        <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 16, color: NAVY, marginBottom: 16 }}>Today&apos;s Bookings</div>
        {today.length === 0 ? (
          <Empty icon="📅" message="No bookings today" sub="Customer appointments will appear here." />
        ) : (
          today.slice(0, 12).map((o, i) => {
            const done = o.status === "Completed";
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: i < Math.min(today.length, 12) - 1 ? "1px solid #F3F4F6" : "none" }}>
                <div style={{ width: 36, height: 36, background: `${AMBER}14`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {done ? <CheckCircle2 size={18} color="#2ECC71" /> : <Clock size={18} color={AMBER} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: NAVY }}>{o.customer || "Customer"}</div>
                  <div style={{ fontSize: 12, color: "#6B7280" }}>{o.date || "Scheduled"} · {o.items || ""}</div>
                </div>
                <span style={{ background: done ? "#F0FDF4" : "#EFF6FF", color: done ? "#065F46" : "#1E40AF", fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 20 }}>{done ? "Completed" : o.status || "Scheduled"}</span>
              </div>
            );
          })
        )}
      </div>

      <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 16 }}>Initial view bound to orders &amp; dashboard statistics. A full calendar grid arrives in a later phase.</p>
    </div>
  );
}