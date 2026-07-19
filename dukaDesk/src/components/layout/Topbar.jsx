import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bell, Search, Grid } from "lucide-react";
import { useAuth, useToast } from "../../contexts";
import { useIsMobile } from "../../hooks/useMediaQuery";
import { AMBER, NAVY, transition } from "../../theme";

export default function Topbar() {
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const showToast = useToast();
  const { merchant } = useAuth();
  const page = location.pathname.split("/")[2] || "dashboard";
  const greetingName = merchant?.name?.split(" ")[0] || "there";
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const pageTitles = {
    dashboard: "Dashboard",
    products: "Products",
    orders: "Orders",
    analytics: "Analytics",
    messages: "Messages",
    integrations: "Integrations",
    billing: "Billing",
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div style={{
      height: isMobile ? 56 : 64,
      background: "rgba(255,255,255,0.85)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--border)",
      display: "flex",
      alignItems: "center",
      padding: `0 ${isMobile ? 16 : 32}px`,
      gap: isMobile ? 8 : 16,
      flexShrink: 0,
      position: "sticky",
      top: 0,
      zIndex: 50,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        {isMobile ? (
          <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 16, color: NAVY }}>{pageTitles[page] || "Dashboard"}</div>
        ) : (
          <div>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 18, color: NAVY, marginBottom: 1 }}>{greeting()}, {greetingName}</div>
            <div style={{ fontSize: 13, color: "#6B7280" }}>{pageTitles[page] || "Dashboard"} overview</div>
          </div>
        )}
      </div>

      {!isMobile && (
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: searchFocused ? "#fff" : "#F3F4F6",
          borderRadius: 10, padding: "8px 12px", width: searchFocused ? 280 : 220,
          transition, border: searchFocused ? `1.5px solid ${AMBER}` : "1.5px solid transparent",
          boxShadow: searchFocused ? "0 0 0 3px rgba(244,160,38,0.1)" : "none",
        }}>
          <Search size={16} color={searchFocused ? AMBER : "#9CA3AF"} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            onKeyDown={e => e.key === "Enter" && showToast(`Searching for "${search}"...`, "info")}
            placeholder="Search orders, products..."
            style={{ background: "none", border: "none", outline: "none", fontSize: 13, color: NAVY, width: "100%", fontFamily: "inherit" }}
          />
        </div>
      )}

      <button onClick={() => navigate("/miniapp")} style={{
        background: "none", border: "1px solid var(--border)", borderRadius: 10,
        cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
        padding: "8px 12px", color: NAVY, fontSize: 13, fontWeight: 500, transition,
      }}>
        <Grid size={16} />
        {!isMobile && <span>Preview App</span>}
      </button>

      <button onClick={() => showToast("No new notifications", "info")} style={{
        position: "relative", background: "none", border: "none",
        cursor: "pointer", display: "flex", alignItems: "center", padding: 8, transition,
      }}>
        <Bell size={isMobile ? 18 : 20} color="#6B7280" />
        <span style={{
          position: "absolute", top: 4, right: 4,
          background: "#E74C3C", color: "#fff", fontSize: 9, fontWeight: 700,
          width: 16, height: 16, borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          border: "2px solid #fff",
          animation: "badgePop 0.3s ease",
        }}>3</span>
      </button>

      <button onClick={() => navigate("/dashboard/profile")} style={{
        width: isMobile ? 34 : 38, height: isMobile ? 34 : 38,
        background: `linear-gradient(135deg, ${AMBER}, #E8910A)`,
        borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 700, color: NAVY, cursor: "pointer",
        fontFamily: "'Sora',sans-serif", fontSize: isMobile ? 14 : 16,
        flexShrink: 0, border: "2px solid rgba(255,255,255,0.8)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1), 0 0 0 2px rgba(244,160,38,0.15)",
        transition,
      }}>
        {merchant?.avatar?.[0] || merchant?.name?.[0] || "M"}
      </button>
    </div>
  );
}
