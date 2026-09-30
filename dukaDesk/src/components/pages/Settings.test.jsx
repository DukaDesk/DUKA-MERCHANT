import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn(), info: vi.fn() },
}));

vi.mock("../../hooks/useMediaQuery", () => ({
  useIsMobile: () => false,
}));

vi.mock("../../contexts", () => ({
  useAuth: () => ({ merchant: { tenantId: "tenant_123" } }),
}));

vi.mock("../../services/api", () => ({
  getMerchant: () => null,
  updateTenant: vi.fn().mockResolvedValue(null),
  getTenantConfig: vi.fn().mockRejectedValue(null),
  updateTenantConfig: vi.fn().mockResolvedValue(null),
}));

vi.mock("lucide-react", () => ({
  Store: "svg", Mail: "svg", Phone: "svg", MapPin: "svg",
  Globe: "svg", Clock: "svg", Save: "svg", ArrowLeft: "svg",
  Building: "svg", Palette: "svg", RefreshCw: "svg",
}));

import Settings from "./Settings";

describe("Settings page", () => {
  it("renders without crashing", async () => {
    render(<Settings />);
    expect(await screen.findByText("Settings")).toBeTruthy();
  });

  it("shows all 4 form sections", async () => {
    render(<Settings />);
    expect(await screen.findByText("Business Information")).toBeTruthy();
    expect(await screen.findByText("Contact Information")).toBeTruthy();
    expect(await screen.findByText("Business Hours")).toBeTruthy();
    expect(await screen.findByText("Branding")).toBeTruthy();
  });

  it("has save and cancel buttons", async () => {
    render(<Settings />);
    const save = (await screen.findAllByText("Save Settings"))[0];
    expect(save).toBeTruthy();
    expect(await screen.findByText("Cancel")).toBeTruthy();
  });

  it("leaves opening hours blank when no business data is available", async () => {
    render(<Settings />);
    const hours = screen.getAllByPlaceholderText("Closed");
    expect(hours).toHaveLength(7);
    hours.forEach(input => expect(input.value).toBe(""));
    expect(screen.queryByDisplayValue("merchant@example.com")).toBeNull();
  });
});
