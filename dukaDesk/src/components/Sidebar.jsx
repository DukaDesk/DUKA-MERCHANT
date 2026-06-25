import { useState } from "react";
const NAVY = "#1A1A2E", AMBER = "#F4A026";
const navItems = [
  { id: "dashboard", icon: "🏠", label: "Dashboard" },
  { id: "products", icon: "📦", label: "Products" },
  { id: "orders", icon: "🛒", label: "Orders", badge: 5 },
  { id: "analytics", icon: "📊", label: "Analytics" },
  { id: "messages", icon: "💬", label: "Messages", badge: 7 },
  { id: "integrations", icon: "🔗", label: "Integrations" },
  { id: "billing", icon: "💳", label: "Billing" },
];
export default function Sidebar({ page, setPage }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div style={{ width: collapsed ? 68 : 240, background: NAVY, minHeight: "100vh", display: "flex", flexDirection: "column", transition: "width 0.25s ease", flexShrink: 0, position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}>
      <div style={{ padding: collapsed ? "24px 16px" : "24px 20px", borderBottom: "1px solid #252547", display: "flex", alignItems: "center", gap: 10, justifyContent: collapsed ? "center" : "flex-start" }}>
        <div style={{ width: 36, height: 36, background: AMBER, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ color: NAVY, fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 18 }}>D</span>
        </div>
        {!collapsed && <div><div style={{ color: "#fff", fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 16 }}>DukaDesk</div><span style={{ background: AMBER, color: NAVY, fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 10 }}>MERCHANT</span></div>}
      </div>
      {!collapsed && (
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #252547" }}>
          <div style={{ background: "#252547", borderRadius: 8, padding: "10px 12px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <div style={{ width: 28, height: 28, background: "#2ECC71", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }}>M</div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div style={{ color: "#fff", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Mama's Kitchen</div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 6, height: 6, background: "#2ECC71", borderRadius: "50%" }} /><span style={{ color: "#9CA3AF", fontSize: 11 }}>Live</span></div>
            </div>
            <span style={{ color: "#9CA3AF", fontSize: 12 }}>▼</span>
          </div>
        </div>
      )}
      <nav style={{ flex: 1, padding: "12px 0" }}>
        {navItems.map(item => {
          const active = page === item.id;
          return (
            <button key={item.id} onClick={() => setPage(item.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: collapsed ? "12px 0" : "12px 20px", justifyContent: collapsed ? "center" : "flex-start", background: active ? "#252547" : "transparent", border: "none", borderLeft: active ? `3px solid ${AMBER}` : "3px solid transparent", cursor: "pointer", transition: "all 0.15s" }} title={collapsed ? item.label : ""}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              {!collapsed && <><span style={{ color: active ? AMBER : "#D1D5DB", fontSize: 14, fontWeight: active ? 600 : 400, flex: 1, textAlign: "left" }}>{item.label}</span>{item.badge && <span style={{ background: AMBER, color: NAVY, fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 12 }}>{item.badge}</span>}</>}
            </button>
          );
        })}
      </nav>
      <div style={{ padding: collapsed ? "16px 0" : "16px 20px", borderTop: "1px solid #252547" }}>
        {!collapsed && <div style={{ background: `${AMBER}22`, border: `1px solid ${AMBER}44`, borderRadius: 10, padding: "12px 14px", marginBottom: 12 }}><div style={{ color: AMBER, fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Starter Plan</div><div style={{ color: "#9CA3AF", fontSize: 11, marginBottom: 8 }}>1 of 1 apps used</div><button style={{ background: AMBER, color: NAVY, border: "none", borderRadius: 20, padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", width: "100%" }}>Upgrade Plan ↑</button></div>}
        <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: collapsed ? "center" : "flex-start" }}>
          <div style={{ width: 32, height: 32, background: AMBER, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: NAVY, flexShrink: 0 }}>A</div>
          {!collapsed && <div style={{ flex: 1, overflow: "hidden" }}><div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>Ada Okafor</div><div style={{ color: "#9CA3AF", fontSize: 11 }}>ada@mamaskitchen.com</div></div>}
        </div>
      </div>
      <button onClick={() => setCollapsed(!collapsed)} style={{ background: "#252547", border: "none", color: "#9CA3AF", padding: "10px", cursor: "pointer", fontSize: 14, width: "100%" }}>{collapsed ? "→" : "← Collapse"}</button>
    </div>
  );
}
