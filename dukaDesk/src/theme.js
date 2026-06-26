export const NAVY = "#1A1A2E";
export const AMBER = "#F4A026";
export const GREEN = "#2ECC71";
export const RED = "#E74C3C";
export const PURPLE = "#7C3AED";
export const GRAY_50 = "#F9FAFB";
export const GRAY_100 = "#F3F4F6";
export const GRAY_200 = "#E5E7EB";
export const GRAY_400 = "#9CA3AF";
export const GRAY_500 = "#6B7280";
export const GRAY_700 = "#374151";

export const inputStyle = {
  width: "100%",
  height: 52,
  border: `1px solid ${GRAY_200}`,
  borderRadius: 8,
  padding: "0 14px",
  fontSize: 15,
  color: NAVY,
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
  background: "#fff",
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
  borderRadius: 12,
  padding: 24,
  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
};

export const statusColors = {
  "In Stock": { bg: "#F0FDF4", color: "#065F46" },
  "Low Stock": { bg: "#FFF8ED", color: "#92400E" },
  "Out of Stock": { bg: "#FEF2F2", color: "#991B1B" },
  Pending: { bg: "#FFF8ED", color: "#92400E" },
  Processing: { bg: `${NAVY}11`, color: NAVY },
  Completed: { bg: "#F0FDF4", color: "#065F46" },
  Cancelled: { bg: "#FEF2F2", color: "#991B1B" },
};
