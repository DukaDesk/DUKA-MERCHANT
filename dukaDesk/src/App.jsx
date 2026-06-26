import { lazy, Suspense, useState, createContext, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

const Auth = lazy(() => import("./components/Auth"));
const Dashboard = lazy(() => import("./components/Dashboard"));
const Wizard = lazy(() => import("./components/Wizard"));
const Products = lazy(() => import("./components/Products"));
const Orders = lazy(() => import("./components/Orders"));
const Analytics = lazy(() => import("./components/Analytics"));
const Messages = lazy(() => import("./components/Messages"));
const Integrations = lazy(() => import("./components/Integrations"));
const Billing = lazy(() => import("./components/Billing"));
const MiniAppPreview = lazy(() => import("./components/MiniAppPreview"));

const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);

function Toast({ toast }) {
  const colors = {
    success: { bg: "#F0FDF4", border: "#2ECC71", text: "#065F46" },
    error: { bg: "#FEF2F2", border: "#E74C3C", text: "#991B1B" },
    info: { bg: "#FFF8ED", border: "#F4A026", text: "#92400E" },
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
      <span style={{ fontSize: 14, color: c.text, fontWeight: 500 }}>{toast.msg}</span>
    </div>
  );
}

export default function App() {
  const [merchant, setMerchant] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleAuth = (data) => {
    setMerchant(data);
  };

  return (
    <ToastContext.Provider value={showToast}>
      <ErrorBoundary>
        <div style={{ fontFamily: "'Inter', sans-serif", minHeight: "100vh", background: "#F7F8FA" }}>
          {toast && <Toast toast={toast} />}
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/login" element={<Auth onAuth={handleAuth} />} />
              <Route path="/signup" element={<Auth onAuth={handleAuth} />} />
              <Route path="/forgot" element={<Auth onAuth={handleAuth} />} />
              <Route path="/wizard" element={<Wizard />} />
              <Route path="/miniapp" element={<MiniAppPreview onBack={() => {}} />} />
              <Route path="/" element={<ProtectedLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="orders" element={<Orders />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="messages" element={<Messages />} />
                <Route path="integrations" element={<Integrations />} />
                <Route path="billing" element={<Billing />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </div>
      </ErrorBoundary>
    </ToastContext.Provider>
  );
}

function ProtectedLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Topbar />
        <main style={{ flex: 1, overflowY: "auto", padding: "32px", background: "#F7F8FA" }}>
          <ErrorBoundary>
            <Suspense fallback={<Loader />}>
              <Routes>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="orders" element={<Orders />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="messages" element={<Messages />} />
                <Route path="integrations" element={<Integrations />} />
                <Route path="billing" element={<Billing />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}

function Loader() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
      <div style={{ width: 40, height: 40, border: "4px solid #E5E7EB", borderTopColor: "#F4A026", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
