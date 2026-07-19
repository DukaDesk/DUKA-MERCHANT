export const NAVY = "#0F0F1A";
export const NAVY_LIGHT = "#1A1A2E";
export const AMBER = "#F4A026";
export const AMBER_HOVER = "#E8910A";
export const GREEN = "#2ECC71";
export const RED = "#E74C3C";
export const PURPLE = "#7C3AED";
export const TEAL = "#0D9488";
export const PINK = "#EC4899";

export const GRAY = {
  50: "#F9FAFB",
  100: "#F3F4F6",
  200: "#E5E7EB",
  300: "#D1D5DB",
  400: "#9CA3AF",
  500: "#6B7280",
  600: "#4B5563",
  700: "#374151",
  800: "#1F2937",
  900: "#111827",
};

export const spacing = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48,
};

export const font = {
  sans: "'Inter', sans-serif",
  display: "'Sora', 'Inter', sans-serif",
  mono: "'JetBrains Mono', monospace",
};

export const transition = "0.25s cubic-bezier(0.4, 0, 0.2, 1)";
export const transitionFast = "0.15s cubic-bezier(0.4, 0, 0.2, 1)";

export const inputStyle = {
  width: "100%",
  height: 48,
  border: `1.5px solid var(--border, #E8E8F0)`,
  borderRadius: 10,
  padding: "0 14px",
  fontSize: 14,
  color: NAVY,
  outline: "none",
  fontFamily: "inherit",
  background: "#fff",
  transition: "border-color 0.2s, box-shadow 0.2s",
  boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
};

export const labelStyle = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  color: NAVY,
  marginBottom: 6,
};

export const cardStyle = {
  background: "#fff",
  borderRadius: 14,
  padding: 24,
  boxShadow: "0 1px 3px rgba(15,15,26,0.04), 0 4px 12px rgba(15,15,26,0.03), 0 0 0 1px rgba(15,15,26,0.02)",
  transition,
};

export const cardHover = {
  ...cardStyle,
  cursor: "pointer",
};

export const statCard = {
  background: "#fff",
  borderRadius: 12,
  padding: 20,
  boxShadow: "0 1px 2px rgba(15,15,26,0.04), 0 2px 6px rgba(15,15,26,0.03)",
  border: "1px solid var(--border, #E8E8F0)",
  transition,
};

export const pageHeading = {
  fontFamily: font.display,
  fontWeight: 700,
  fontSize: 28,
  color: NAVY,
  margin: "0 0 4px",
};

export const pageSubtitle = {
  fontSize: 14,
  color: "#6B7280",
  margin: "0 0 24px",
};

export const statusBadge = {
  "In Stock": { bg: "#F0FDF4", color: "#065F46", dot: "#2ECC71" },
  "Low Stock": { bg: "#FFF8ED", color: "#92400E", dot: "#F4A026" },
  "Out of Stock": { bg: "#FEF2F2", color: "#991B1B", dot: "#E74C3C" },
  Pending: { bg: "#FFF8ED", color: "#92400E", dot: "#F4A026" },
  Processing: { bg: "#EFF6FF", color: "#1E40AF", dot: "#3B82F6" },
  Completed: { bg: "#F0FDF4", color: "#065F46", dot: "#2ECC71" },
  Cancelled: { bg: "#FEF2F2", color: "#991B1B", dot: "#E74C3C" },
  Paid: { bg: "#F0FDF4", color: "#065F46", dot: "#2ECC71" },
  Active: { bg: "#F0FDF4", color: "#065F46", dot: "#2ECC71" },
  Inactive: { bg: "#F3F4F6", color: "#6B7280", dot: "#9CA3AF" },
};

export const planColors = {
  Starter: { bg: "linear-gradient(135deg, #6B7280, #4B5563)", accent: "#9CA3AF" },
  Growth: { bg: "linear-gradient(135deg, #F4A026, #E8910A)", accent: "#fff" },
  Business: { bg: "linear-gradient(135deg, #0F0F1A, #1A1A2E)", accent: "#F4A026" },
};

export const btnPrimary = {
  background: AMBER,
  color: NAVY,
  border: "none",
  borderRadius: 10,
  height: 48,
  padding: "0 24px",
  fontSize: 15,
  fontWeight: 700,
  cursor: "pointer",
  fontFamily: font.display,
  transition,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
};

export const btnSecondary = {
  background: "#fff",
  color: NAVY,
  border: "1.5px solid var(--border, #E8E8F0)",
  borderRadius: 10,
  height: 48,
  padding: "0 24px",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: font.sans,
  transition,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
};

export const btnDanger = {
  background: "#E74C3C",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  height: 48,
  padding: "0 24px",
  fontSize: 14,
  fontWeight: 700,
  cursor: "pointer",
  fontFamily: font.sans,
  transition,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
};

export const btnGhost = {
  background: "transparent",
  color: "#6B7280",
  border: "none",
  borderRadius: 10,
  height: 48,
  padding: "0 24px",
  fontSize: 14,
  fontWeight: 500,
  cursor: "pointer",
  fontFamily: font.sans,
  transition,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
};

export const tabPill = (active) => ({
  padding: "6px 16px",
  borderRadius: 8,
  border: `1.5px solid ${active ? AMBER : "var(--border, #E8E8F0)"}`,
  background: active ? "#FFF8ED" : "#fff",
  color: active ? "#92400E" : "#6B7280",
  fontSize: 13,
  fontWeight: active ? 600 : 400,
  cursor: "pointer",
  transition,
});

export const rowHover = {
  transition,
  cursor: "pointer",
};

export const glidePanel = {
  position: "fixed",
  top: 0,
  right: 0,
  width: 420,
  maxWidth: "100vw",
  height: "100vh",
  background: "#fff",
  boxShadow: "-8px 0 40px rgba(15,15,26,0.12)",
  zIndex: 200,
  display: "flex",
  flexDirection: "column",
  animation: "slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
};
