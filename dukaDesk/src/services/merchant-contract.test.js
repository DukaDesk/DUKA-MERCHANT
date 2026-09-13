import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./httpClient", () => {
  const mock = { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() };
  return { default: mock };
});

import httpClient from "./httpClient";
import { getDesignData, saveDesignData, getPublishedDefinition, verifyPublishedParity, getMediaAssets, uploadMediaAsset } from "./api";

const mockHttp = vi.mocked(httpClient);

function setMerchant(m = { merchantId: "m_123", tenantId: "m_123", business: "Test Biz" }) {
  localStorage.setItem("dd_merchant", JSON.stringify(m));
}

describe("merchant draft/publish separation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    setMerchant();
  });

  it("getDesignData tries backend draft endpoint first", async () => {
    mockHttp.get.mockResolvedValueOnce({ data: { design: { meta: { appName: "Draft App" }, screens: { s1: {} }, shared: {}, navigation: {} } } });
    const design = await getDesignData();
    expect(mockHttp.get).toHaveBeenCalledWith("/api/v1/merchants/m_123/publishing/draft");
    expect(design.meta.appName).toBe("Draft App");
  });

  it("saveDesignData tries backend draft put", async () => {
    mockHttp.put.mockResolvedValueOnce({ data: {} });
    await saveDesignData({ meta: { appName: "X" }, screens: {} });
    expect(mockHttp.put).toHaveBeenCalledWith("/api/v1/merchants/m_123/publishing/draft", { design: { meta: { appName: "X" }, screens: {} } });
  });

  it("getPublishedDefinition uses public definition endpoint, not draft", async () => {
    mockHttp.get.mockResolvedValueOnce({ data: { manifestVersion: "1.0.0", screens: { s1: {} } } });
    const def = await getPublishedDefinition("m_123");
    expect(mockHttp.get).toHaveBeenCalledWith("/api/v1/merchants/m_123/definition");
    expect(def.manifestVersion).toBe("1.0.0");
  });

  it("verifyPublishedParity checks both read paths", async () => {
    mockHttp.get.mockResolvedValueOnce({ data: { version: "1.0.1", screens: { s1: {} }, manifestVersion: "1.0.0", metadata: {} } });
    mockHttp.get.mockResolvedValueOnce({ data: { version: "1.0.1", screens: { s1: {} }, manifestVersion: "1.0.0", metadata: {} } });
    const res = await verifyPublishedParity("m_123", "test-slug");
    expect(res.ok).toBe(true);
    expect(mockHttp.get).toHaveBeenCalledWith("/api/v1/merchants/m_123/definition");
    expect(mockHttp.get).toHaveBeenCalledWith("/api/v1/bff/mobile/tenant/test-slug/manifest");
  });

  it("media upload uses App tier without invalid folderId", async () => {
    mockHttp.post.mockResolvedValueOnce({ data: { id: "a1", url: "https://cdn.example/a.jpg" } });
    const file = new File(["hello"], "a.jpg", { type: "image/jpeg" });
    const asset = await uploadMediaAsset(file, {});
    // Must NOT send folderId=builder (FK violation), only send when valid UUID
    expect(mockHttp.post).toHaveBeenCalledWith("/api/v1/app/media/upload", expect.any(FormData), expect.not.objectContaining({ params: expect.objectContaining({ folderId: "builder" }) }));
    expect(asset.id).toBe("a1");
  });

  it("media upload forwards valid UUID folderId", async () => {
    mockHttp.post.mockResolvedValueOnce({ data: { id: "a2", url: "https://cdn.example/b.jpg" } });
    const file = new File(["hello"], "b.jpg", { type: "image/jpeg" });
    const validId = "123e4567-e89b-12d3-a456-426614174000";
    const asset = await uploadMediaAsset(file, { folderId: validId });
    expect(mockHttp.post).toHaveBeenCalledWith("/api/v1/app/media/upload", expect.any(FormData), expect.objectContaining({ params: { folderId: validId } }));
    expect(asset.id).toBe("a2");
  });

  it("getMediaAssets uses App tier", async () => {
    mockHttp.get.mockResolvedValueOnce({ data: [{ id: "a1", url: "https://cdn.example/a.jpg" }] });
    const list = await getMediaAssets();
    expect(mockHttp.get).toHaveBeenCalledWith("/api/v1/app/media", expect.anything());
    expect(list[0].id).toBe("a1");
  });
});
