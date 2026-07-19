import { NAVY, AMBER, font } from "../../theme";

export function Loading({ message = "Loading..." }) {
  return (
    <div style={{ padding: 60, textAlign: "center" }}>
      <div style={{ width: 36, height: 36, border: "3px solid #E8E8F0", borderTopColor: AMBER, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 20px" }} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, maxWidth: 240, margin: "0 auto" }}>
        <div style={{ height: 10, width: "80%", borderRadius: 4, background: "linear-gradient(90deg, #F0F0F5 25%, #E8E8F0 50%, #F0F0F5 75%)", backgroundSize: "400px 100%", animation: "shimmer 1.5s ease-in-out infinite" }} />
        <div style={{ height: 10, width: "60%", borderRadius: 4, background: "linear-gradient(90deg, #F0F0F5 25%, #E8E8F0 50%, #F0F0F5 75%)", backgroundSize: "400px 100%", animation: "shimmer 1.5s ease-in-out infinite 0.2s" }} />
        <div style={{ height: 10, width: "40%", borderRadius: 4, background: "linear-gradient(90deg, #F0F0F5 25%, #E8E8F0 50%, #F0F0F5 75%)", backgroundSize: "400px 100%", animation: "shimmer 1.5s ease-in-out infinite 0.4s" }} />
      </div>
      <div style={{ fontSize: 14, fontWeight: 500, color: "#6B7280", marginTop: 16 }}>{message}</div>
    </div>
  );
}

export function Skeleton({ width = "100%", height = 16, mb = 12, borderRadius = 8 }) {
  return (
    <div style={{
      width, height, borderRadius, marginBottom: mb,
      background: "linear-gradient(90deg, #F0F0F5 25%, #E8E8F0 50%, #F0F0F5 75%)",
      backgroundSize: "400px 100%",
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
      <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.6, animation: "fadeScaleIn 0.4s ease" }}>{icon}</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: NAVY, marginBottom: 6, fontFamily: font.display }}>{message}</div>
      {sub && <div style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 20, maxWidth: 320, margin: "0 auto 20px" }}>{sub}</div>}
      {action && <div style={{ animation: "fadeIn 0.3s ease 0.2s both" }}>{action}</div>}
    </div>
  );
}

export function ErrorState({ message = "Something went wrong", sub, onRetry }) {
  return (
    <div style={{ padding: 60, textAlign: "center" }}>
      <div style={{ width: 64, height: 64, background: "#FEF2F2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 28 }}>⚠️</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: NAVY, marginBottom: 6 }}>{message}</div>
      {sub && <div style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 20 }}>{sub}</div>}
      {onRetry && (
        <button onClick={onRetry} style={{ background: AMBER, color: NAVY, border: "none", borderRadius: 10, padding: "10px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: font.display }}>
          Try Again
        </button>
      )}
    </div>
  );
}
