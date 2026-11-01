import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./notifier", () => ({
  emit: vi.fn(),
}));

vi.mock("./httpClient", () => {
  const mock = { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() };
  return { default: mock };
});

vi.mock("axios", () => {
  const mock = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    create: vi.fn(() => mock),
    interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
  };
  return { default: mock };
});

import { forgotPassword, confirmPasswordReset } from "./api";
import httpClient from "./httpClient";

const mockHttpClient = vi.mocked(httpClient);

describe("recovery API (forgot / reset password)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe("forgotPassword", () => {
    it("posts only the email to the forgot-password endpoint", async () => {
      mockHttpClient.post.mockResolvedValue({
        data: { message: "If the email exists, a reset link has been sent" },
      });

      const result = await forgotPassword({ email: "ada@example.com" });

      expect(mockHttpClient.post).toHaveBeenCalledWith("/api/v1/auth/forgot-password", {
        email: "ada@example.com",
      });
      expect(result.message).toBe("If the email exists, a reset link has been sent");
    });

    it("falls back to a client-side message when the server returns none", async () => {
      mockHttpClient.post.mockResolvedValue({ data: {} });

      const result = await forgotPassword({ email: "ada@example.com" });

      expect(result.message).toBe("Password reset link sent to ada@example.com");
    });

    it("unwraps a nested data.message envelope", async () => {
      mockHttpClient.post.mockResolvedValue({
        data: { data: { message: "If the email exists, a reset link has been sent" } },
      });

      const result = await forgotPassword({ email: "ada@example.com" });

      expect(result.message).toBe("If the email exists, a reset link has been sent");
    });

    it("propagates errors so the form can display them", async () => {
      mockHttpClient.post.mockRejectedValue(new Error("network down"));

      await expect(forgotPassword({ email: "ada@example.com" })).rejects.toThrow("network down");
    });
  });

  describe("confirmPasswordReset", () => {
    it("posts token and password only — no otp field", async () => {
      mockHttpClient.post.mockResolvedValue({
        data: { message: "Password reset successfully" },
      });

      const result = await confirmPasswordReset({
        token: "tok-123",
        password: "NewPassw0rd!",
        otp: "",
      });

      expect(mockHttpClient.post).toHaveBeenCalledWith("/api/v1/auth/reset-password", {
        token: "tok-123",
        password: "NewPassw0rd!",
      });
      const payload = mockHttpClient.post.mock.calls[0][1];
      expect(payload).not.toHaveProperty("otp");
      expect(result.message).toBe("Password reset successfully");
    });

    it("returns the raw payload when res.data is absent", async () => {
      mockHttpClient.post.mockResolvedValue({ message: "Password reset successfully" });

      const result = await confirmPasswordReset({ token: "t", password: "p" });

      expect(result.message).toBe("Password reset successfully");
    });

    it("propagates backend validation errors", async () => {
      mockHttpClient.post.mockRejectedValue(new Error("Invalid or expired reset token"));

      await expect(
        confirmPasswordReset({ token: "expired", password: "NewPassw0rd!" }),
      ).rejects.toThrow("Invalid or expired reset token");
    });
  });
});
