import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, BarChart3, MessageSquare, Link2, CreditCard, Settings as SettingsIcon, Users, ChevronLeft, ChevronRight, Store, LogOut, Sparkles, PenTool, Contact, ClipboardList, Megaphone } from "lucide-react";
import { useIsMobile } from "../../hooks/useMediaQuery";
import { useAuth } from "../../contexts";
import { NAVY, AMBER, transition } from "../../theme";
import { getOrders, getConversations } from "../../services/api";

const roleAccess = {
  super_admin: ["dashboard", "products", "orders", "customers", "inventory", "analytics", "messages", "marketing", "integrations", "billing", "team", "settings"],
  platform_operator: ["dashboard", "products", "orders", "customers", "inventory", "analytics", "messages", "marketing", "integrations", "billing", "team"],
  support_agent: ["dashboard", "orders", "customers", "messages", "analytics"],
  tenant_owner: ["dashboard", "products", "orders", "customers", "inventory", "analytics", "messages", "marketing", "integrations", "billing", "team", "settings"],
  business_manager: ["dashboard", "products", "orders", "customers", "inventory", "analytics", "messages", "marketing", "integrations", "billing"],
  store_manager: ["dashboard", "products", "orders", "customers", "inventory", "messages", "integrations"],
  sales_staff: ["dashboard", "orders", "customers", "messages"],
  content_manager: ["dashboard", "products", "messages", "marketing"],
  customer: ["dashboard"],
  member: ["dashboard"],
};

const navItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "products", icon: Package, label: "Products" },
  { id: "orders", icon: ShoppingCart, label: "Orders" },
  { id: "customers", icon: Contact, label: "Customers" },
  { id: "inventory", icon: ClipboardList, label: "Inventory" },
  { id: "analytics", icon: BarChart3, label: "Analytics" },
  { id: "messages", icon: MessageSquare, label: "Messages" },
  { id: "marketing", icon: Megaphone, label: "Marketing" },
  { id: "integrations", icon: Link2, label: "Integrations" },
  { id: "billing", icon: CreditCard, label: "Billing" },
  { id: "team", icon: Users, label: "Team" },
  { id: "settings", icon: SettingsIcon, label: "Settings" },
];

function getVisibleNav(role) {
  const allowed = roleAccess[role] || roleAccess.member;
  return navItems.filter(item => allowed.includes(item.id));
}

export default function Sidebar() {
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);
  const [badges, setBadges] = useState({ orders: 0, messages: 0 });
  const location = useLocation();
  const navigate = useNavigate();
  const currentPage = location.pathname.split("/")[2] || "dashboard";
  const navigateTo = (path) => navigate(path === "dashboard" ? "/dashboard" : `/dashboard/${path}`);
  const { merchant, logout } = useAuth();
  const handleLogout = () => { logout(); };
  const visibleNav = getVisibleNav(merchant?.role || "member");

  useEffect(() => {
    getOrders().then(data => setBadges(b => ({ ...b, orders: data.length || 0 }))).catch(() => {});
    getConversations().then(data => {
      const unread = data.filter(c => c.unread > 0).length;
      setBadges(b => ({ ...b, messages: unread }));
    }).catch(() => {});
  }, []); 

  if (isMobile) {
    return (
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100, background: NAVY, display: "flex", padding: "2px 0", paddingBottom: "env(safe-area-inset-bottom, 2px)", borderTop: "1px solid rgba(255,255,255,0.06)", justifyContent: "space-around", backdropFilter: "blur(20px)" }}>
        {[...visibleNav, { id: "canvas-editor", icon: PenTool, label: "Editor" }].filter(i => ["dashboard","products","orders","customers","inventory","analytics","messages","marketing","integrations","billing","team","settings","canvas-editor"].includes(i.id)).map(item => {
          const active = currentPage === item.id;
          const Icon = item.icon;
          return (
            <button key={item.id} onClick={() => item.id === "canvas-editor" ? navigate("/canvas-editor") : navigateTo(item.id)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "8px 0 6px", minHeight: 48, background: "none", border: "none", cursor: "pointer", position: "relative", transition }}>
              {active && <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 24, height: 3, background: AMBER, borderRadius: "0 0 3px 3px" }} />}
              <Icon size={20} color={active ? AMBER : "#6B7280"} />
              <span style={{ fontSize: 10, color: active ? AMBER : "#6B7280", fontWeight: active ? 600 : 400, letterSpacing: "0.01em" }}>{item.label}</span>
              {badges[item.id] > 0 && <span style={{ position: "absolute", top: 2, right: "10%", background: AMBER, color: NAVY, fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 8, lineHeight: 1.4, animation: "badgePop 0.3s ease" }}>{badges[item.id]}</span>}
            </button>
          );
        })}
        <button onClick={handleLogout} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "8px 0 6px", minHeight: 48, background: "none", border: "none", cursor: "pointer", transition }}>
          <LogOut size={20} color="#6B7280" />
          <span style={{ fontSize: 10, color: "#6B7280", letterSpacing: "0.01em" }}>Logout</span>
        </button>
      </div>
    );
  }

  const navBtn = (active) => ({
    width: "100%", display: "flex", alignItems: "center", gap: 12,
    padding: collapsed ? "10px 0" : "10px 16px", justifyContent: collapsed ? "center" : "flex-start",
    background: active ? "rgba(244,160,38,0.1)" : "transparent",
    border: "none", borderLeft: active ? `3px solid ${AMBER}` : "3px solid transparent",
    cursor: "pointer", transition,
    position: "relative",
  });

  const navLabel = (active) => ({
    color: active ? AMBER : "#D1D5DB",
    fontSize: 14, fontWeight: active ? 600 : 400,
    flex: 1, textAlign: "left",
    transition,
  });

  return (
    <div style={{
      width: collapsed ? 68 : 240,
      background: `linear-gradient(180deg, ${NAVY} 0%, #15152A 100%)`,
      minHeight: "100vh", display: "flex", flexDirection: "column",
      transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      flexShrink: 0, position: "sticky", top: 0, height: "100vh", overflow: "hidden",
    }}>
      <div style={{
        padding: collapsed ? "20px 0" : "20px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", gap: 10,
        justifyContent: collapsed ? "center" : "flex-start",
      }}>
        <div style={{ width: 36, height: 36, background: AMBER, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ color: NAVY, fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 18 }}>D</span>
        </div>
        {!collapsed && (
          <div style={{ overflow: "hidden" }}>
            <div style={{ color: "#fff", fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 16, whiteSpace: "nowrap" }}>DukaDesk</div>
            <span style={{ background: AMBER, color: NAVY, fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 10 }}>MERCHANT</span>
          </div>
        )}
      </div>

      {!collapsed && (
        <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div onClick={() => navigate("/dashboard/profile")} style={{
            background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "10px 12px",
            display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
            border: "1px solid rgba(255,255,255,0.06)", transition,
          }}>
            <div style={{ width: 30, height: 30, background: "rgba(46,204,113,0.2)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Store size={14} color="#2ECC71" />
            </div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div style={{ color: "#fff", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{merchant?.business || "My Store"}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 6, height: 6, background: "#2ECC71", borderRadius: "50%", animation: "pulse 2s ease-in-out infinite" }} />
                <span style={{ color: "#6B7280", fontSize: 11 }}>Live</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <nav style={{ flex: 1, padding: "8px 0", overflowY: "auto", overflowX: "hidden" }}>
        {visibleNav.map(item => {
          const active = currentPage === item.id;
          const Icon = item.icon;
          return (
            <button key={item.id} onClick={() => navigateTo(item.id)} style={navBtn(active)} title={collapsed ? item.label : ""}>
              <Icon size={20} color={active ? AMBER : "#6B7280"} />
              {!collapsed && (
                <>
                  <span style={navLabel(active)}>{item.label}</span>
                  {badges[item.id] > 0 && <span style={{ background: AMBER, color: NAVY, fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 10, animation: "badgePop 0.3s ease" }}>{badges[item.id]}</span>}
                </>
              )}
            </button>
          );
        })}

        {!collapsed && <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "8px 16px" }} />}

        <button onClick={() => navigate("/canvas-editor")} style={navBtn(location.pathname === "/canvas-editor")} title={collapsed ? "Canvas Editor" : ""}>
          <PenTool size={20} color={location.pathname === "/canvas-editor" ? AMBER : "#6B7280"} />
          {!collapsed && <span style={navLabel(location.pathname === "/canvas-editor")}>Canvas Editor</span>}
        </button>

        <button onClick={() => navigate("/dashboard/profile")} style={navBtn(location.pathname === "/dashboard/profile")} title={collapsed ? "Profile" : ""}>
          <Store size={20} color={location.pathname === "/dashboard/profile" ? AMBER : "#6B7280"} />
          {!collapsed && <span style={navLabel(location.pathname === "/dashboard/profile")}>Profile</span>}
        </button>
      </nav>

      {!collapsed && (
        <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ background: "linear-gradient(135deg, rgba(244,160,38,0.15), rgba(244,160,38,0.05))", border: "1px solid rgba(244,160,38,0.2)", borderRadius: 12, padding: "12px 14px" }}>
            <Sparkles size={14} color={AMBER} style={{ marginBottom: 4 }} />
            <div style={{ color: AMBER, fontSize: 12, fontWeight: 600, marginBottom: 2 }}>Starter Plan</div>
            <div style={{ color: "#6B7280", fontSize: 11, marginBottom: 8 }}>1 of 1 apps used</div>
            <button onClick={() => navigate("/dashboard/billing")} style={{ background: AMBER, color: NAVY, border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", width: "100%", transition }}>
              Upgrade Plan ↑
            </button>
          </div>
        </div>
      )}

      <div style={{ padding: collapsed ? "12px 0" : "12px 16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div onClick={() => navigate("/dashboard/profile")} style={{
          display: "flex", alignItems: "center", gap: 10,
          justifyContent: collapsed ? "center" : "flex-start",
          marginBottom: 8, cursor: "pointer", transition,
          borderRadius: 8, padding: collapsed ? "4px 0" : "4px 6px",
        }}>
          <div style={{ width: 32, height: 32, background: `linear-gradient(135deg, ${AMBER}, #E8910A)`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: NAVY, flexShrink: 0, boxShadow: "0 2px 8px rgba(244,160,38,0.3)" }}>
            {merchant?.avatar?.[0] || merchant?.name?.[0] || "M"}
          </div>
          {!collapsed && <div style={{ flex: 1, overflow: "hidden" }}>
            <div style={{ color: "#fff", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{merchant?.name || "Merchant"}</div>
            <div style={{ color: "#6B7280", fontSize: 11, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{merchant?.email || ""}</div>
          </div>}
        </div>
        <button onClick={handleLogout} style={{
          width: "100%", display: "flex", alignItems: "center", gap: 8,
          justifyContent: collapsed ? "center" : "flex-start",
          padding: "8px 10px", background: "transparent",
          border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
          color: "#6B7280", cursor: "pointer", fontSize: 13, transition,
        }} title="Logout">
          <LogOut size={14} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      <button onClick={() => setCollapsed(!collapsed)} style={{
        background: "rgba(255,255,255,0.03)", border: "none",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        color: "#6B7280", padding: "10px", cursor: "pointer",
        fontSize: 14, display: "flex", alignItems: "center",
        justifyContent: "center", gap: 6, transition,
      }}>
        {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /> Collapse</>}
      </button>
    </div>
  );
}
