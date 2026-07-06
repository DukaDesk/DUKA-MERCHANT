import { lazy, Suspense, useState, createContext, useContext, useCallback, useEffect, useRef } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate, Outlet } from "react-router-dom";
import ErrorBoundary from "./components/layout/ErrorBoundary";
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
import { useIsMobile, useIsTablet } from "./hooks/useMediaQuery";
import { setToken, getSetupData } from "./services/api";

const Auth = lazy(() => import("./components/auth/Auth"));
const Dashboard = lazy(() => import("./components/pages/Dashboard"));
const Wizard = lazy(() => import("./components/app-builder/Wizard"));
const Products = lazy(() => import("./components/pages/Products"));
const Orders = lazy(() => import("./components/pages/Orders"));
const Analytics = lazy(() => import("./components/pages/Analytics"));
const Messages = lazy(() => import("./components/pages/Messages"));
const Integrations = lazy(() => import("./components/pages/Integrations"));
const IntegrationDetails = lazy(() => import("./components/pages/IntegrationDetails"));
const Billing = lazy(() => import("./components/pages/Billing"));
const Profile = lazy(() => import("./components/pages/Profile"));
const MiniAppPreview = lazy(() => import("./components/app-builder/MiniAppPreview"));

export const ToastContext = createContext();
export const AuthContext = createContext();
export const useToast = () => useContext(ToastContext);
export const useAuth = () => useContext(AuthContext);

function ToastItem({ toast, onRemove }) {
  const colors = {
    success: { bg: "#F0FDF4", border: "#2ECC71", text: "#065F46", icon: "✓" },
    error: { bg: "#FEF2F2", border: "#E74C3C", text: "#991B1B", icon: "✕" },
    info: { bg: "#FFF8ED", border: "#F4A026", text: "#92400E", icon: "ℹ" },
  };
  const c = colors[toast.type] || colors.info;
  return (
    <div onClick={onRemove} style={{
      animation: "slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s forwards",
      background: c.bg, border: `1px solid ${c.border}`,
      borderLeft: `4px solid ${c.border}`,
      borderRadius: 12, padding: "12px 16px",
      display: "flex", alignItems: "center", gap: 10,
      boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
      maxWidth: 380, cursor: "pointer",
    }}>
      <span style={{ width: 22, height: 22, borderRadius: "50%", background: c.border, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{c.icon}</span>
      <span style={{ fontSize: 14, color: c.text, fontWeight: 500, lineHeight: 1.4 }}>{toast.msg}</span>
    </div>
  );
}

function Loader() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 16 }}>
      <div style={{ width: 36, height: 36, border: "3px solid #E8E8F0", borderTopColor: "#F4A026", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <span style={{ color: "#9CA3AF", fontSize: 14, fontWeight: 500 }}>Loading...</span>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { merchant } = useAuth();
  const location = useLocation();
  if (!merchant) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

function PublicRoute({ children }) {
  const { merchant } = useAuth();
  if (merchant) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  const [merchant, setMerchant] = useState(() => {
    try { const m = localStorage.getItem("dd_merchant"); return m ? JSON.parse(m) : null; } catch { return null; }
  });
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((msg, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  const handleAuth = useCallback((data) => {
    setMerchant(data);
    try { localStorage.setItem("dd_merchant", JSON.stringify(data)); } catch {}
  }, []);

  const logout = useCallback(() => {
    setMerchant(null);
    setToken(null);
    const keys = ["dd_merchant", "dd_deployed_app", "dd_products", "dukadesk_setup", "dd_integration_states"];
    keys.forEach(k => { try { localStorage.removeItem(k); } catch {} });
    const toRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("dd_integration_config_")) toRemove.push(key);
    }
    toRemove.forEach(k => { try { localStorage.removeItem(k); } catch {} });
  }, []);

  return (
    <AuthContext.Provider value={{ merchant, logout, handleAuth }}>
    <ToastContext.Provider value={showToast}>
      <ErrorBoundary>
        <div style={{ fontFamily: "var(--font-sans)", minHeight: "100vh", background: "var(--bg)" }}>
          {toasts.length > 0 && (
            <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8, maxWidth: 380 }}>
              {toasts.map(t => <ToastItem key={t.id} toast={t} onRemove={() => setToasts(prev => prev.filter(x => x.id !== t.id))} />)}
            </div>
          )}
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/login" element={<PublicRoute><Auth onAuth={handleAuth} /></PublicRoute>} />
              <Route path="/signup" element={<PublicRoute><Auth onAuth={handleAuth} /></PublicRoute>} />
              <Route path="/forgot" element={<PublicRoute><Auth onAuth={handleAuth} /></PublicRoute>} />
              <Route path="/wizard" element={<ProtectedRoute><Wizard /></ProtectedRoute>} />
              <Route path="/miniapp" element={<ProtectedRoute><MiniAppPreview /></ProtectedRoute>} />
              <Route path="/" element={<Navigate to="/signup" replace />} />
              <Route path="/dashboard" element={<ProtectedRoute><ProtectedLayout /></ProtectedRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="orders" element={<Orders />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="messages" element={<Messages />} />
                <Route path="integrations" element={<Integrations />} />
                <Route path="integrations/:name" element={<IntegrationDetails />} />
                <Route path="billing" element={<Billing />} />
                <Route path="profile" element={<Profile />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </div>
      </ErrorBoundary>
    </ToastContext.Provider>
    </AuthContext.Provider>
  );
}

function ProtectedLayout() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const padding = isMobile ? "16px" : isTablet ? "24px" : "32px";
  const { merchant } = useAuth();
  const hasSetup = useRef(!!getSetupData());

  useEffect(() => {
    if (merchant && !hasSetup.current && window.location.pathname === "/dashboard") {
      navigate("/wizard", { replace: true });
    }
  }, [merchant, navigate]);

  return (
    <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", marginBottom: isMobile ? 64 : 0 }}>
        <Topbar />
        <main style={{ flex: 1, overflowY: "auto", padding, background: "var(--bg)" }}>
          <ErrorBoundary>
            <Suspense fallback={<Loader />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
