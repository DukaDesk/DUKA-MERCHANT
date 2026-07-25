import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./notifier", () => ({
  emit: vi.fn(),
}));

vi.mock("./httpClient", () => {
  const mock = { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() };
  return { default: mock };
});

import { getIntegrationConfig, setIntegrationConfig, getDesignData, saveDesignData, getReleases, getCurrentDeployment, saveReleases, saveDeployment, signup } from "./api";
import httpClient from "./httpClient";

const mockHttpClient = vi.mocked(httpClient);

const TENANT_ID = "tenant_123";
const DEFAULT_MERCHANT = { id: "user_1", tenantId: TENANT_ID, name: "Test User" };

function setupMerchant(merchant = DEFAULT_MERCHANT) {
  localStorage.setItem("dd_merchant", JSON.stringify(merchant));
}

describe("api helpers (tenant config-based)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe("getIntegrationConfig", () => {
    it("returns null when no merchant", async () => {
      const result = await getIntegrationConfig("Paystack");
      expect(result).toBeNull();
    });

    it("fetches config from tenant config", async () => {
      setupMerchant();
      mockHttpClient.get.mockResolvedValue({
        data: {
          integrationConfigs: { Paystack: { apiKey: "sk_test_123" } },
        },
      });

      const result = await getIntegrationConfig("Paystack");

      expect(result).toEqual({ apiKey: "sk_test_123" });
      expect(mockHttpClient.get).toHaveBeenCalledWith(`/api/v1/tenants/${TENANT_ID}/config`);
    });

    it("returns null when integration not configured", async () => {
      setupMerchant();
      mockHttpClient.get.mockResolvedValue({ data: {} });

      const result = await getIntegrationConfig("Paystack");

      expect(result).toBeNull();
    });
  });

  describe("setIntegrationConfig", () => {
    it("merges new config into existing integrationConfigs", async () => {
      setupMerchant();
      mockHttpClient.get.mockResolvedValue({
        data: {
          integrationConfigs: { ExistingInt: { key: "val" } },
        },
      });
      mockHttpClient.put.mockResolvedValue({ data: {} });

      await setIntegrationConfig("Paystack", { apiKey: "sk_test_456" });

      expect(mockHttpClient.put).toHaveBeenCalledWith(`/api/v1/tenants/${TENANT_ID}/config`, expect.objectContaining({
        integrationConfigs: expect.objectContaining({
          ExistingInt: { key: "val" },
          Paystack: { apiKey: "sk_test_456" },
        }),
      }));
    });
  });

  describe("getDesignData", () => {
    it("returns design from tenant config", async () => {
      setupMerchant();
      mockHttpClient.get.mockResolvedValue({
        data: { design: { screens: { home: {} } } },
      });

      const result = await getDesignData();

      expect(result).toEqual({ screens: { home: {} } });
    });

    it("returns null when no design in config", async () => {
      setupMerchant();
      mockHttpClient.get.mockResolvedValue({ data: {} });

      const result = await getDesignData();

      expect(result).toBeNull();
    });
  });

  describe("saveDesignData", () => {
    it("saves design via tenant config", async () => {
      setupMerchant();
      mockHttpClient.get.mockResolvedValue({ data: { businessName: "Test" } });
      mockHttpClient.put.mockResolvedValue({ data: {} });

      await saveDesignData({ screens: { home: {} } });

      expect(mockHttpClient.put).toHaveBeenCalledWith(`/api/v1/tenants/${TENANT_ID}/config`, expect.objectContaining({
        businessName: "Test",
        design: { screens: { home: {} } },
      }));
    });
  });

  describe("getReleases / saveReleases", () => {
    it("getReleases returns releases array", async () => {
      setupMerchant();
      mockHttpClient.get.mockResolvedValue({
        data: { releases: [{ id: "r1", version: "1.0.0" }] },
      });

      const result = await getReleases();

      expect(result).toEqual([{ id: "r1", version: "1.0.0" }]);
    });

    it("getReleases returns empty array on error", async () => {
      setupMerchant();
      mockHttpClient.get.mockRejectedValue(new Error("fail"));

      const result = await getReleases();

      expect(result).toEqual([]);
    });
  });

  describe("getCurrentDeployment", () => {
    it("returns deployed object from config", async () => {
      setupMerchant();
      mockHttpClient.get.mockResolvedValue({
        data: { deployed: { version: "1.0.0", status: "published" } },
      });

      const result = await getCurrentDeployment();

      expect(result).toEqual({ version: "1.0.0", status: "published" });
    });

    it("returns null on error", async () => {
      setupMerchant();
      mockHttpClient.get.mockRejectedValue(new Error("fail"));

      const result = await getCurrentDeployment();

      expect(result).toBeNull();
    });
  });

  describe("saveDeployment", () => {
    it("saves deployment to tenant config", async () => {
      setupMerchant();
      mockHttpClient.get.mockResolvedValue({ data: {} });
      mockHttpClient.put.mockResolvedValue({ data: {} });

      await saveDeployment({ version: "2.0.0", status: "published" });

      expect(mockHttpClient.put).toHaveBeenCalledWith(`/api/v1/tenants/${TENANT_ID}/config`, expect.objectContaining({
        deployed: { version: "2.0.0", status: "published" },
      }));
    });
  });
});

describe("signup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("registers user and fetches tenant from user.tenantId", async () => {
    mockHttpClient.post.mockResolvedValueOnce({
      data: {
        user: { id: "u1", firstName: "Ada", lastName: "Okafor", email: "ada@test.com", tenantId: "t1" },
        accessToken: "tok_123",
        refreshToken: "rtok_123",
      },
    });
    mockHttpClient.get.mockResolvedValueOnce({
      data: { id: "t1", name: "Ada's Kitchen", slug: "adas-kitchen" },
    });

    const result = await signup({
      fullName: "Ada Okafor",
      businessName: "Ada's Kitchen",
      email: "ada@test.com",
      phone: "8012345678",
      password: "Pass1234",
    });

    expect(result.token).toBe("tok_123");
    expect(result.merchant.tenantId).toBe("t1");
    expect(result.merchant.name).toBe("Ada Okafor");
  });

  it("falls back to fetching tenant list when no user.tenantId", async () => {
    mockHttpClient.post.mockResolvedValueOnce({
      data: {
        user: { id: "u1", firstName: "Bob", lastName: "", email: "bob@test.com" },
        accessToken: "tok_456",
        refreshToken: "rtok_456",
      },
    });
    mockHttpClient.get.mockResolvedValueOnce({
      data: [{ id: "t2", name: "Bob's Shop", slug: "bobs-shop" }],
    });

    const result = await signup({
      fullName: "Bob",
      businessName: "Bob's Shop",
      email: "bob@test.com",
      phone: "8012345678",
      password: "Pass1234",
    });

    expect(result.merchant.tenantId).toBe("t2");
  });

  it("proceeds with null tenant when all fetches fail", async () => {
    mockHttpClient.post.mockResolvedValueOnce({
      data: {
        user: { id: "u1", firstName: "Test", lastName: "User", email: "test@test.com" },
        accessToken: "tok_789",
        refreshToken: "rtok_789",
      },
    });
    mockHttpClient.get.mockRejectedValueOnce(new Error("not found"));
    mockHttpClient.get.mockRejectedValueOnce(new Error("no tenants"));

    const result = await signup({
      fullName: "Test User",
      businessName: "Test Co",
      email: "test@test.com",
      phone: "8012345678",
      password: "Pass1234",
    });

    expect(result.merchant.tenantId).toBeNull();
    expect(result.token).toBe("tok_789");
  });
});
