import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn(), info: vi.fn() },
}));

vi.mock("../../hooks/useMediaQuery", () => ({
  useIsMobile: () => false,
}));

const mockGetIntegrations = vi.fn();
const mockGetMyApp = vi.fn();
const mockGetIntegrationConfig = vi.fn();
const mockGetTemplateIntegrationNames = vi.fn();

vi.mock("../../services/api", () => ({
  getIntegrations: (...args) => mockGetIntegrations(...args),
  toggleIntegration: vi.fn(),
  getMyApp: (...args) => mockGetMyApp(...args),
  getIntegrationConfig: (...args) => mockGetIntegrationConfig(...args),
  setIntegrationConfig: vi.fn(),
}));

vi.mock("../../config/integrations", () => ({
  INTEGRATION_BADGE_COLORS: {
    Popular: { bg: "#FFF8ED", color: "#92400E" },
    Free: { bg: "#F0FDF4", color: "#065F46" },
    Premium: { bg: "#1A1A2E11", color: "#1A1A2E" },
  },
}));

vi.mock("../../config/wizard", () => ({
  getTemplateIntegrationNames: (...args) => mockGetTemplateIntegrationNames(...args),
}));

import Integrations from "./Integrations";

const SAMPLE_INTEGRATIONS = [
  {
    cat: "Payments",
    items: [
      { name: "Paystack", icon: "P", desc: "Payment gateway", badge: "Free", active: false, locked: false },
      { name: "Flutterwave", icon: "F", desc: "Payment processor", badge: "Free", active: true, locked: false },
    ],
  },
  {
    cat: "Marketing",
    items: [
      { name: "Email Campaign", icon: "E", desc: "Email marketing", badge: "Premium", active: false, locked: true },
    ],
  },
];

describe("Integrations page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state initially", () => {
    mockGetIntegrations.mockReturnValue(new Promise(() => {}));
    mockGetMyApp.mockResolvedValue(null);
    render(<Integrations />);
    expect(screen.getByText("Loading integrations...")).toBeTruthy();
  });

  it("shows error state on API failure", async () => {
    mockGetIntegrations.mockRejectedValue(new Error("Network error"));
    mockGetMyApp.mockResolvedValue(null);
    render(<Integrations />);
    expect(await screen.findByText("Failed to load integrations")).toBeTruthy();
    expect(screen.getByText("Try Again")).toBeTruthy();
  });

  it("shows empty state when no integrations", async () => {
    mockGetIntegrations.mockResolvedValue([]);
    mockGetMyApp.mockResolvedValue(null);
    render(<Integrations />);
    expect(await screen.findByText("No integrations available")).toBeTruthy();
  });

  it("renders integration cards and active list", async () => {
    mockGetIntegrations.mockResolvedValue(SAMPLE_INTEGRATIONS);
    mockGetMyApp.mockResolvedValue(null);
    render(<Integrations />);
    expect(await screen.findByText("Paystack")).toBeTruthy();
    const flutterwave = await screen.findAllByText("Flutterwave");
    expect(flutterwave.length).toBe(2);
    expect(await screen.findByText("Email Campaign")).toBeTruthy();
    expect(await screen.findByText("Active (1)")).toBeTruthy();
  });

  it("shows template banner when app template exists", async () => {
    mockGetIntegrations.mockResolvedValue(SAMPLE_INTEGRATIONS);
    mockGetMyApp.mockResolvedValue({ template: "Restaurant" });
    mockGetTemplateIntegrationNames.mockReturnValue(["Paystack", "Flutterwave"]);
    render(<Integrations />);
    expect(await screen.findByText(/Restaurant/)).toBeTruthy();
  });
});
