import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import ErrorBoundary from "./ErrorBoundary";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useIsMobile, useIsTablet } from "../../hooks/useMediaQuery";

export default function DashboardShell() {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const padding = isMobile ? "16px" : isTablet ? "24px" : "32px";

  return (
    <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", marginBottom: isMobile ? 64 : 0 }}>
        <Topbar />
        <main style={{ flex: 1, overflowY: "auto", padding, background: "var(--bg)" }}>
          <ErrorBoundary>
            <Suspense fallback={<div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 16 }}>
              <div style={{ width: 36, height: 36, border: "3px solid #E8E8F0", borderTopColor: "#F4A026", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              <span style={{ color: "#9CA3AF", fontSize: 14, fontWeight: 500 }}>Loading...</span>
            </div>}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
