import { lazy, Suspense, useState, useCallback, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorBoundary from "./components/layout/ErrorBoundary";
import DashboardShell from "./components/layout/DashboardShell";
import { setToken, logout as apiLogout } from "./services/api";
import { RuntimeContext } from "./runtime/RuntimeContext";
import { dispatchEngine, setupActionRouter, clearActionRouter } from "./runtime/ActionEngine";
import { BrandThemeProvider } from "./runtime/BrandThemeProvider";
import { AuthContext, useAuth } from "./contexts";
import { on as onNotify } from "./services/notifier";

const Auth = lazy(() => import("./components/auth/Auth"));
const Dashboard = lazy(() => import("./components/pages/Dashboard"));
const Products = lazy(() => import("./components/pages/Products"));
const Orders = lazy(() => import("./components/pages/Orders"));
const Analytics = lazy(() => import("./components/pages/Analytics"));
const Messages = lazy(() => import("./components/pages/Messages"));
const Integrations = lazy(() => import("./components/pages/Integrations"));
const IntegrationDetails = lazy(() => import("./components/pages/IntegrationDetails"));
const Billing = lazy(() => import("./components/pages/Billing"));
const Profile = lazy(() => import("./components/pages/Profile"));
const Team = lazy(() => import("./components/pages/Team"));
const Settings = lazy(() => import("./components/pages/Settings"));
const Customers = lazy(() => import("./components/pages/Customers"));
const Inventory = lazy(() => import("./components/pages/Inventory"));
const Marketing = lazy(() => import("./components/pages/Marketing"));
const Notifications = lazy(() => import("./components/pages/Notifications"));
const CompliancePage = lazy(() => import("./components/pages/Compliance"));
const DeskDesignPage = lazy(() => import("./components/pages/DeskDesign"));
const MiniAppPreview = lazy(() => import("./components/app-builder/MiniAppPreview"));
const TemplateEditor = lazy(() => import("./components/template/TemplateEditor"));
const CanvasEditor = lazy(() => import("./components/canvas-editor/CanvasEditor"));

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

  const handleAuth = useCallback((data) => {
    setMerchant(data);
    try { localStorage.setItem("dd_merchant", JSON.stringify(data)); } catch { /* ignore */ }
  }, []);

  const logout = useCallback(() => {
    apiLogout();
    setMerchant(null);
    const keys = ["dd_merchant", "dd_deployed_app", "dd_products", "dukadesk_setup", "dd_integration_states"];
    keys.forEach(k => { try { localStorage.removeItem(k); } catch { /* ignore */ } });
    const toRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("dd_integration_config_")) toRemove.push(key);
    }
    toRemove.forEach(k => { try { localStorage.removeItem(k); } catch { /* ignore */ } });
  }, []);

  const navigate = useNavigate();
  const dispatchAction = useCallback((action) => {
    dispatchEngine(action, null);
  }, []);

  useEffect(() => {
    setupActionRouter({
      navigate: (path) => navigate(path),
      logout: () => { logout(); navigate("/login"); },
    });
    return () => clearActionRouter();
  }, [navigate, logout]);

  useEffect(() => {
    const unsubs = [
      onNotify('error', msg => toast.error(msg)),
      onNotify('success', msg => toast.success(msg)),
    ];
    return () => unsubs.forEach(fn => fn());
  }, []);

  return (
    <AuthContext.Provider value={{ merchant, logout, handleAuth }}>
    <RuntimeContext.Provider value={{ dispatchAction }}>
    <BrandThemeProvider>
      <ErrorBoundary>
        <div style={{ fontFamily: "var(--font-sans)", minHeight: "100vh", background: "var(--bg)" }}>
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover theme="light" />
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/login" element={<PublicRoute><Auth onAuth={handleAuth} /></PublicRoute>} />
              <Route path="/signup" element={<PublicRoute><Auth onAuth={handleAuth} /></PublicRoute>} />
              <Route path="/forgot" element={<PublicRoute><Auth onAuth={handleAuth} /></PublicRoute>} />
              <Route path="/reset-password" element={<PublicRoute><Auth onAuth={handleAuth} /></PublicRoute>} />
              <Route path="/reset-password-confirm" element={<PublicRoute><Auth onAuth={handleAuth} /></PublicRoute>} />
              <Route path="/miniapp" element={<ProtectedRoute><MiniAppPreview /></ProtectedRoute>} />
              <Route path="/template-editor/:templateId" element={<ProtectedRoute><TemplateEditor /></ProtectedRoute>} />
              <Route path="/canvas-editor" element={<ProtectedRoute><CanvasEditor /></ProtectedRoute>} />
              <Route path="/compliance" element={<ProtectedRoute><CompliancePage /></ProtectedRoute>} />
              <Route path="/desk-design" element={<ProtectedRoute><DeskDesignPage /></ProtectedRoute>} />
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardShell /></ProtectedRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="orders" element={<Orders />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="messages" element={<Messages />} />
                <Route path="integrations" element={<Integrations />} />
                <Route path="integrations/:name" element={<IntegrationDetails />} />
                <Route path="billing" element={<Billing />} />
                <Route path="profile" element={<Profile />} />
                <Route path="customers" element={<Customers />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="marketing" element={<Marketing />} />
                <Route path="team" element={<Team />} />
                <Route path="settings" element={<Settings />} />
                <Route path="notifications" element={<Notifications />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </div>
      </ErrorBoundary>
    </BrandThemeProvider>
    </RuntimeContext.Provider>
    </AuthContext.Provider>
  );
}


