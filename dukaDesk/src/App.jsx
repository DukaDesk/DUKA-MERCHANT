import { useState } from "react";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import Wizard from "./components/Wizard";
import Products from "./components/Products";
import Orders from "./components/Orders";
import Analytics from "./components/Analytics";
import Messages from "./components/Messages";
import Integrations from "./components/Integrations";
import Billing from "./components/Billing";
import MiniAppPreview from "./components/MiniAppPreview";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

export default function App() {
  const [page, setPage] = useState("login");
  const [merchant, setMerchant] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleAuth = (data) => {
    setMerchant(data);
    setPage("wizard");
  };

  const isAuthPage = page === "login" || page === "signup" || page === "forgot";
  const isWizard = page === "wizard";
  const isMiniApp = page === "miniapp";

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", minHeight: "100vh", background: "#F7F8FA" }}>
      {toast && <Toast toast={toast} />}

      {isAuthPage && (
        <Auth page={page} setPage={setPage} onAuth={handleAuth} showToast={showToast} />
      )}

      {isWizard && (
        <Wizard
          onFinish={() => setPage("dashboard")}
          showToast={showToast}
          merchant={merchant}
        />
      )}

      {isMiniApp && (
        <MiniAppPreview onBack={() => setPage("dashboard")} />
      )}

      {!isAuthPage && !isWizard && !isMiniApp && (
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <Sidebar page={page} setPage={setPage} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <Topbar page={page} setPage={setPage} showToast={showToast} />
            <main style={{ flex: 1, overflowY: "auto", padding: "32px", background: "#F7F8FA" }}>
              {page === "dashboard" && <Dashboard setPage={setPage} showToast={showToast} />}
              {page === "products" && <Products showToast={showToast} />}
              {page === "orders" && <Orders showToast={showToast} />}
              {page === "analytics" && <Analytics />}
              {page === "messages" && <Messages showToast={showToast} />}
              {page === "integrations" && <Integrations showToast={showToast} />}
              {page === "billing" && <Billing showToast={showToast} />}
            </main>
          </div>
        </div>
      )}
    </div>
  );
}

function Toast({ toast }) {
  const colors = {
    success: { bg: "#F0FDF4", border: "#2ECC71", text: "#065F46", icon: "✓" },
    error: { bg: "#FEF2F2", border: "#E74C3C", text: "#991B1B", icon: "✕" },
    info: { bg: "#FFF8ED", border: "#F4A026", text: "#92400E", icon: "ℹ" },
  };
  const c = colors[toast.type] || colors.info;
  return (
    <div style={{
      position: "fixed", top: 20, right: 20, zIndex: 9999,
      background: c.bg, border: `1px solid ${c.border}`,
      borderLeft: `4px solid ${c.border}`,
      borderRadius: 12, padding: "14px 18px",
      display: "flex", alignItems: "center", gap: 10,
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      maxWidth: 380, animation: "slideIn 0.3s ease"
    }}>
      <span style={{ fontSize: 18, color: c.border }}>{c.icon}</span>
      <span style={{ fontSize: 14, color: c.text, fontWeight: 500 }}>{toast.msg}</span>
    </div>
  );
}
