import { NAVY, AMBER } from "../../theme";
import { createContext, useContext, useState, useEffect } from "react";

export const lightTheme = {
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

export const darkTheme = {
  canvas: "#16161C",
  surface: "#1E1E26",
  active: AMBER,
  selection: "#60A5FA",
  danger: "#F87171",
  success: "#34D399",
  text: "#E5E7EB",
  textSecondary: "#9CA3AF",
  textMuted: "#6B7280",
  border: "#2E2E38",
  borderLight: "#26262E",
  hover: "#2A2A34",
  hoverAmber: "#2A2415",
  dangerLight: "#2A1A1A",
  dangerBorder: "#5C2A2A",
  shadow: "0 1px 2px rgba(0,0,0,0.4)",
  shadowMd: "0 4px 12px rgba(0,0,0,0.5)",
  shadowLg: "0 8px 24px rgba(0,0,0,0.6)",
  shadowCanvas: "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
  radius: lightTheme.radius,
  transition: "0.15s ease",
};

/* Light theme kept as a static default for non-context callers (e.g. preview mode). */
export const theme = lightTheme;

function buildHelpers(t) {
  const iconBtn = {
    background: t.surface,
    border: `1px solid ${t.border}`,
    borderRadius: t.radius.sm,
    cursor: "pointer",
    padding: "6px",
    color: t.textSecondary,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: `all ${t.transition}`,
    boxShadow: t.shadow,
    lineHeight: 1,
  };

  const iconBtnDanger = {
    ...iconBtn,
    background: t.dangerLight,
    border: `1px solid ${t.dangerBorder}`,
    color: t.danger,
  };

  const primaryBtn = {
    background: t.active,
    color: NAVY,
    border: "none",
    borderRadius: t.radius.md,
    padding: "7px 18px",
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "'Inter',sans-serif",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    transition: `all ${t.transition}`,
    boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
  };

  const ghostBtn = {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px",
    color: t.textSecondary,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: `color ${t.transition}`,
  };

  const textInput = {
    width: "100%",
    padding: "6px 10px",
    borderRadius: t.radius.sm,
    border: `1px solid ${t.border}`,
    fontSize: 13,
    fontFamily: "'Inter',sans-serif",
    outline: "none",
    boxSizing: "border-box",
    background: t.surface,
    transition: `border-color ${t.transition}, box-shadow ${t.transition}`,
  };

  const panelHeader = {
    padding: "10px 12px 4px",
    fontFamily: "'Sora',sans-serif",
    fontWeight: 700,
    fontSize: 13,
    color: t.text,
    borderBottom: `1px solid ${t.borderLight}`,
    marginBottom: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const labelStyle = {
    display: "block",
    fontSize: 11,
    fontWeight: 600,
    color: t.textSecondary,
    marginBottom: 4,
    fontFamily: "'Inter',sans-serif",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  return { iconBtn, iconBtnDanger, primaryBtn, ghostBtn, textInput, panelHeader, labelStyle };
}

const ThemeCtx = createContext(null);

export function EditorThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    try { return localStorage.getItem("ed-theme-dark") === "1"; } catch { return false; }
  });

  useEffect(() => {
    try { localStorage.setItem("ed-theme-dark", isDark ? "1" : "0"); } catch { /* noop */ }
  }, [isDark]);

  const active = isDark ? darkTheme : lightTheme;
  return (
    <ThemeCtx.Provider value={{ theme: active, isDark, toggleDark: () => setIsDark(v => !v), ...buildHelpers(active) }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export function useEditorTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) {
    const t = lightTheme;
    return { theme: t, isDark: false, toggleDark: () => {}, ...buildHelpers(t) };
  }
  return ctx;
}

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

export function ColorInput({ value, onChange }) {
  const { theme, textInput } = useEditorTheme();
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <input type="color" value={value || "#000000"}
        onChange={e => onChange(e.target.value)}
        style={{ width: 36, height: 36, borderRadius: theme.radius.sm, border: `1px solid ${theme.border}`, padding: 0, cursor: "pointer" }} />
      <input value={value || ""}
        onChange={e => onChange(e.target.value)}
        style={{
          ...textInput,
          borderColor: focused ? theme.active : theme.border,
          boxShadow: focused ? `0 0 0 2px ${theme.active}22` : "none",
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="#000000" />
    </div>
  );
}
