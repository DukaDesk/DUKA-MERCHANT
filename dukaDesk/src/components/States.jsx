import { NAVY } from "../theme";

export function Loading({ message = "Loading..." }) {
  return (
    <div style={{ padding: 60, textAlign: "center", color: "#9CA3AF" }}>
      <div style={{ width: 32, height: 32, border: "3px solid #E5E7EB", borderTopColor: NAVY, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ fontSize: 14 }}>{message}</div>
    </div>
  );
}

export function Empty({ icon = "📭", message = "Nothing here yet", sub }) {
  return (
    <div style={{ padding: 60, textAlign: "center", color: "#9CA3AF" }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: "#6B7280", marginBottom: 4 }}>{message}</div>
      {sub && <div style={{ fontSize: 13 }}>{sub}</div>}
    </div>
  );
}
