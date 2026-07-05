import { NAVY, AMBER } from "../../theme";

export function Loading({ message = "Loading..." }) {
  return (
    <div style={{ padding: 60, textAlign: "center", color: "#9CA3AF" }}>
      <div style={{ width: 32, height: 32, border: "3px solid #E8E8F0", borderTopColor: AMBER, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
      <div style={{ fontSize: 14, fontWeight: 500, color: "#6B7280" }}>{message}</div>
    </div>
  );
}

export function Skeleton({ width = "100%", height = 16, mb = 12, borderRadius = 8 }) {
  return (
    <div style={{
      width, height, borderRadius, marginBottom: mb,
      background: "linear-gradient(90deg, #F0F0F5 25%, #E8E8F0 50%, #F0F0F5 75%)",
      backgroundSize: "200px 100%",
      animation: "shimmer 1.5s ease-in-out infinite",
    }} />
  );
}

export function CardSkeleton() {
  return (
    <div style={{ background: "#fff", borderRadius: 14, padding: 24, border: "1px solid #E8E8F0" }}>
      <Skeleton width="60%" height={14} mb={16} />
      <Skeleton width="40%" height={32} mb={8} />
      <Skeleton width="30%" height={12} />
    </div>
  );
}

export function Empty({ icon = "📭", message = "Nothing here yet", sub, action }) {
  return (
    <div style={{ padding: 60, textAlign: "center" }}>
      <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.6 }}>{icon}</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: NAVY, marginBottom: 6 }}>{message}</div>
      {sub && <div style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 20 }}>{sub}</div>}
      {action && action}
    </div>
  );
}
