const AMBER = "#F4A026", NAVY = "#1A1A2E";
const pageLabels = { dashboard: "Dashboard", products: "Products", orders: "Orders", analytics: "Analytics", messages: "Messages", integrations: "Integrations", billing: "Billing & Subscription" };
export default function Topbar({ page, setPage, showToast }) {
  return (
    <div style={{ height: 64, background: "#fff", borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", padding: "0 32px", gap: 16, flexShrink: 0 }}>
      <h1 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 20, color: NAVY, margin: 0, flex: 1 }}>Good morning, Ada 👋</h1>
      <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F3F4F6", borderRadius: 8, padding: "8px 12px", width: 220 }}>
        <span style={{ color: "#9CA3AF" }}>🔍</span>
        <input placeholder="Search..." style={{ background: "none", border: "none", outline: "none", fontSize: 14, color: NAVY, width: "100%", fontFamily: "inherit" }} />
      </div>
      <button onClick={() => showToast("No new notifications", "info")} style={{ position: "relative", background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>
        🔔
        <span style={{ position: "absolute", top: -2, right: -4, background: "#E74C3C", color: "#fff", fontSize: 10, fontWeight: 700, width: 16, height: 16, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>3</span>
      </button>
      <div style={{ width: 36, height: 36, background: AMBER, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: NAVY, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}>A</div>
    </div>
  );
}
