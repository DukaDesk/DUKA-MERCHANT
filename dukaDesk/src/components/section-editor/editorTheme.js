import { NAVY, AMBER } from "../../theme";

export const theme = {
  canvas: "#F0F1F3",
  surface: "#fff",
  active: AMBER,
  selection: "#3B82F6",
  danger: "#E74C3C",
  success: "#2ECC71",
  text: "#1C1B1D",
  textSecondary: "#6B7280",
  textMuted: "#9CA3AF",
  border: "#E5E7EB",
  borderLight: "#F3F4F6",
  hover: "#F9FAFB",
  hoverAmber: "#FFF8ED",
  dangerLight: "#FEF2F2",
  dangerBorder: "#FECACA",
  shadow: "0 1px 2px rgba(0,0,0,0.04)",
  shadowMd: "0 4px 12px rgba(0,0,0,0.08)",
  shadowLg: "0 8px 24px rgba(0,0,0,0.12)",
  shadowCanvas: "0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05)",
  radius: {
    sm: 6,
    md: 8,
    lg: 10,
    xl: 12,
    "2xl": 16,
  },
  transition: "0.15s ease",
};

export const iconBtn = {
  background: theme.surface,
  border: `1px solid ${theme.border}`,
  borderRadius: theme.radius.sm,
  cursor: "pointer",
  padding: "6px",
  color: theme.textSecondary,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  transition: `all ${theme.transition}`,
  boxShadow: theme.shadow,
  lineHeight: 1,
};

export const iconBtnDanger = {
  ...iconBtn,
  background: theme.dangerLight,
  border: `1px solid ${theme.dangerBorder}`,
  color: theme.danger,
};

export const primaryBtn = {
  background: theme.active,
  color: NAVY,
  border: "none",
  borderRadius: theme.radius.md,
  padding: "7px 18px",
  fontWeight: 700,
  fontSize: 13,
  cursor: "pointer",
  fontFamily: "'Inter',sans-serif",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  transition: `all ${theme.transition}`,
  boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
};

export const ghostBtn = {
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: "4px",
  color: theme.textSecondary,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  transition: `color ${theme.transition}`,
};

export const textInput = {
  width: "100%",
  padding: "6px 10px",
  borderRadius: theme.radius.sm,
  border: `1px solid ${theme.border}`,
  fontSize: 13,
  fontFamily: "'Inter',sans-serif",
  outline: "none",
  boxSizing: "border-box",
  background: theme.surface,
  transition: `border-color ${theme.transition}, box-shadow ${theme.transition}`,
};

export const panelHeader = {
  padding: "10px 12px 4px",
  fontFamily: "'Sora',sans-serif",
  fontWeight: 700,
  fontSize: 13,
  color: theme.text,
  borderBottom: `1px solid ${theme.borderLight}`,
  marginBottom: 4,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

export const labelStyle = {
  display: "block",
  fontSize: 11,
  fontWeight: 600,
  color: theme.textSecondary,
  marginBottom: 4,
  fontFamily: "'Inter',sans-serif",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

export const HEADER_VARIANTS = [
  {
    id: "logo_name",
    name: "Logo + Name",
    desc: "Logo with app name",
    components: [{ type: "header_bar", props: { appName: "My App", logo: null } }],
  },
  {
    id: "centered_hero",
    name: "Centered Hero",
    desc: "Big centered name + tagline",
    components: [
      { type: "text_block", props: { text: "Your App Name", fontSize: 22, fontWeight: 700, color: "#1C1B1D", alignment: "center" } },
      { type: "text_block", props: { text: "Your tagline here", fontSize: 13, fontWeight: 400, color: "#6B7280", alignment: "center" } },
    ],
  },
  {
    id: "logo_tagline",
    name: "Logo + Tagline",
    desc: "Logo with stacked name + tagline",
    components: [{ type: "header_bar", props: { appName: "My App", logo: null } }],
  },
  {
    id: "minimal",
    name: "Minimal",
    desc: "Just the app name",
    components: [{ type: "text_block", props: { text: "App Name", fontSize: 16, fontWeight: 700, color: "#1C1B1D", alignment: "center" } }],
  },
];
