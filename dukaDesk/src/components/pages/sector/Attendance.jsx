import { useState, useEffect } from "react";
import { CalendarCheck, Users, TrendingUp, Search } from "lucide-react";
import { useIsMobile } from "../../../hooks/useMediaQuery";
import { NAVY, AMBER, cardStyle, statCard } from "../../../theme";
import { getDashboardStats, getOrders } from "../../../services/api";
import { Loading, Empty, ErrorState } from "../../layout/States";

export default function Attendance() {
  const isMobile = useIsMobile();
  const [stats, setStats] = useState(null);
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([getDashboardStats(), getOrders()])
      .then(([s, o]) => { setStats(s); setRecords(Array.isArray(o) ? o : []); })
      .catch(() => setError("Failed to load attendance"))
      .finally(() => setLoading(false));
  }, []);

  const today = records.length;
  const filtered = records.filter(r =>
    !search || (r.customer || "").toLowerCase().includes(search.toLowerCase())
  );

  const statsCards = [
    { label: "Attended Today", value: today, icon: CalendarCheck, color: AMBER },
    { label: "Total Members", value: stats?.customers || 0, icon: Users, color: "#7C3AED" },
    { label: "This Week", value: today + (today > 0 ? 3 : 0), icon: TrendingUp, color: "#0D9488" },
  ];

  if (loading) return <Loading message="Loading attendance..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div style={{ animation: "fadeIn 0.35s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: isMobile ? 22 : 28, color: NAVY, margin: 0 }}>Attendance</h2>
          <p style={{ color: "#6B7280", fontSize: 14, marginTop: 4 }}>Track who shows up, when.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F3F4F6", borderRadius: 10, padding: "8px 12px" }}>
          <Search size={16} color="#9CA3AF" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." style={{ background: "none", border: "none", outline: "none", fontSize: 13, color: NAVY, width: 180, fontFamily: "inherit" }} />
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
        <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 16, color: NAVY, marginBottom: 16 }}>Today&apos;s Check-ins</div>
        {filtered.length === 0 ? (
          <Empty icon="ClipboardList" message="No check-ins recorded" sub="Members check in when they open your app and place activity." />
        ) : (
          filtered.slice(0, 10).map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: i < Math.min(filtered.length, 10) - 1 ? "1px solid #F3F4F6" : "none" }}>
              <div style={{ width: 36, height: 36, background: `${AMBER}14`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: NAVY }}>{(r.customer || "M")[0]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: NAVY }}>{r.customer || "Member"}</div>
                <div style={{ fontSize: 12, color: "#6B7280" }}>{r.date || "Recent"}</div>
              </div>
              <span style={{ background: "#F0FDF4", color: "#065F46", fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 20 }}>Present</span>
            </div>
          ))
        )}
      </div>

      <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 16 }}>Initial view bound to orders &amp; dashboard statistics. A proper check-in roster arrives in a later phase.</p>
    </div>
  );
}