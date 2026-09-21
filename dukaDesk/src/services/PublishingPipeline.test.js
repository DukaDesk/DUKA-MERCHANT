import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./api", () => ({
  getReleases: vi.fn(),
  getCurrentDeployment: vi.fn(),
  saveReleases: vi.fn(),
  saveDeployment: vi.fn(),
  uploadMediaAsset: vi.fn(),
  getSetupData: vi.fn(() => null),
  getMerchant: vi.fn(() => null),
  isDemoId: vi.fn(id => String(id).includes('demo')),
}));

vi.mock("./ValidationEngine", () => ({
  validateProject: vi.fn(),
}));

vi.mock('./httpClient', () => ({ default: { post: vi.fn(), get: vi.fn() } }));
import httpClient from './httpClient';

import { publishProject, getReleaseHistory, rollbackToRelease } from "./PublishingPipeline";
import * as api from "./api";
import { validateProject } from "./ValidationEngine";

const validProject = {
  meta: { appName: "Test App", category: "Restaurant" },
  screens: { screen_1: { name: "Home", bodySections: [] } },
  shared: { header: { components: [] }, footer: { components: [] } },
  navigation: { initialScreen: "screen_1" },
};

describe("PublishingPipeline", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    sessionStorage.clear();
    api.getMerchant.mockReturnValue({ merchantId: 'tenant_demo_001' });
    validateProject.mockReturnValue({ valid: true, errors: [], warnings: [] });
  });

  describe("publishProject", () => {
    it("returns validation error when project is invalid", async () => {
      validateProject.mockReturnValue({
        valid: false,
        errors: [{ severity: "error", path: "meta.appName", message: "Missing" }],
        warnings: [],
      });

      const result = await publishProject({ ...validProject, tenantId: "tenant_demo_001" });

      expect(result.success).toBe(false);
      expect(result.error).toBe("Validation failed");
      expect(api.saveReleases).not.toHaveBeenCalled();
    });

    it("creates a release with incremented version", async () => {
      api.getReleases.mockResolvedValue([
        { id: "rel_1", version: "1.0.0", status: "published", timestamp: "2024-01-01T00:00:00.000Z", project: {}, validationResult: { errors: 0, warnings: 0 }, environment: "production" },
      ]);

      const result = await publishProject({ ...validProject, tenantId: "tenant_demo_001" });

      expect(result.success).toBe(true);
      expect(result.version).toBe("1.0.1");
      expect(api.saveReleases).toHaveBeenCalledOnce();
      expect(api.saveDeployment).toHaveBeenCalledOnce();
    });

    it("starts at 0.0.1 when no prior releases", async () => {
      api.getReleases.mockResolvedValue([]);

      const result = await publishProject({ ...validProject, tenantId: "tenant_demo_001" });

      expect(result.success).toBe(true);
      expect(result.version).toBe("0.0.1");
    });

    it("increments only from published releases", async () => {
      api.getReleases.mockResolvedValue([
        { id: "rel_1", version: "2.0.0", status: "rolled_back", timestamp: "2024-01-01T00:00:00.000Z", project: {}, validationResult: { errors: 0, warnings: 0 }, environment: "production" },
      ]);

      const result = await publishProject({ ...validProject, tenantId: "tenant_demo_001" });

      expect(result.version).toBe("0.0.1");
    });

    it("saves the full project in the release", async () => {
      api.getReleases.mockResolvedValue([]);

      const result = await publishProject({ ...validProject, tenantId: "tenant_demo_001" });

      expect(result.success).toBe(true);
      const savedReleases = api.saveReleases.mock.calls[0][0];
      expect(savedReleases).toHaveLength(1);
      expect(savedReleases[0].project.meta.appName).toBe("Test App");
      expect(savedReleases[0].environment).toBe("production");
    });

    it("sets validation result counts on release", async () => {
      validateProject.mockReturnValue({
        valid: true,
        errors: [{ severity: "error", path: "x", message: "E1" }],
        warnings: [{ severity: "warning", path: "y", message: "W1" }],
      });
      api.getReleases.mockResolvedValue([]);

      await publishProject({ ...validProject, tenantId: "tenant_demo_001" });

      const saved = api.saveReleases.mock.calls[0][0][0];
      expect(saved.validationResult).toEqual({ errors: 1, warnings: 1 });
    });

    it("passes validation warnings without blocking", async () => {
      validateProject.mockReturnValue({
        valid: true,
        errors: [],
        warnings: [{ severity: "warning", path: "meta", message: "Missing description" }],
      });
      api.getReleases.mockResolvedValue([]);

      const result = await publishProject({ ...validProject, tenantId: "tenant_demo_001" });

      expect(result.success).toBe(true);
    });
  });

  describe("getReleaseHistory", () => {
    it("returns releases from api", async () => {
      const releases = [{ id: "rel_1", version: "1.0.0" }];
      api.getReleases.mockResolvedValue(releases);

      const result = await getReleaseHistory();

      expect(result).toEqual(releases);
    });

    it("returns empty array on error", async () => {
      api.getReleases.mockRejectedValue(new Error("network"));

      const result = await getReleaseHistory();

      expect(result).toEqual([]);
    });
  });

  describe("rollbackToRelease", () => {
    it("returns error when release not found", async () => {
      api.getReleases.mockResolvedValue([]);

      const result = await rollbackToRelease("nonexistent");

      expect(result.success).toBe(false);
      expect(result.error).toContain("not found");
    });

    it("marks other published releases as rolled_back", async () => {
      const releases = [
        { id: "rel_1", version: "1.0.0", status: "published", project: {}, timestamp: "2024-01-01T00:00:00.000Z", validationResult: {}, environment: "production" },
        { id: "rel_2", version: "1.0.1", status: "published", project: {}, timestamp: "2024-01-02T00:00:00.000Z", validationResult: {}, environment: "production" },
      ];
      api.getReleases.mockResolvedValue(releases);

      const result = await rollbackToRelease("rel_1");

      expect(result.success).toBe(true);
      const saved = api.saveReleases.mock.calls[0][0];
      expect(saved.find(r => r.id === "rel_1").status).toBe("published");
      expect(saved.find(r => r.id === "rel_2").status).toBe("rolled_back");
    });

    it("deploys the rolled-back release", async () => {
      const projectData = { meta: { appName: "Test" } };
      const releases = [
        { id: "rel_1", version: "1.0.0", status: "published", project: projectData, timestamp: "2024-01-01T00:00:00.000Z", validationResult: {}, environment: "production" },
      ];
      api.getReleases.mockResolvedValue(releases);

      const result = await rollbackToRelease("rel_1");

      expect(result.success).toBe(true);
      expect(api.saveDeployment).toHaveBeenCalledOnce();
      const deployed = api.saveDeployment.mock.calls[0][0];
      expect(deployed.version).toBe("1.0.0");
      expect(deployed.rollbackFrom).toBe("rel_1");
    });
  });
});

describe('live publishing confirmation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    api.getMerchant.mockReturnValue({ merchantId: 'real-merchant' });
    api.getReleases.mockResolvedValue([]);
    validateProject.mockReturnValue({ valid: true, errors: [], warnings: [] });
    httpClient.post.mockImplementation(async (_, body) => ({ data: { releaseId: 'backend-release', version: body.version, checksum: 'server-checksum' } }));
    httpClient.get.mockImplementation(async url => url.endsWith('/publishing/releases') ? { data: [] } : { data: httpClient.post.mock.calls[0][1].manifest });
  });

  it('preserves a large URL-only manifest without claiming compression', async () => {
    const project = { ...validProject, meta: { ...validProject.meta, logo: 'https://cdn.example.com/logo.webp' }, screens: {
      home: { name: 'Home', bodySections: [{ components: [{ type: 'text', props: { text: 'x'.repeat(850 * 1024) } }] }] },
    } };
    const result = await publishProject(project);
    expect(result.success).toBe(true);
    expect(result.payloadStripped).toBeUndefined();
    expect(httpClient.post.mock.calls[0][1].manifest.theme.brand.logo).toBe(project.meta.logo);
    expect(api.saveDeployment).not.toHaveBeenCalled();
    expect(result.releaseId).toBe('backend-release');
  });

  it('does not record success when the backend rejects publishing', async () => {
    httpClient.post.mockRejectedValue(new Error('Backend unavailable'));
    const result = await publishProject(validProject);
    expect(result.success).toBe(false);
    expect(result.error).toContain('Backend unavailable');
    expect(api.saveReleases).not.toHaveBeenCalled();
    expect(api.saveDeployment).not.toHaveBeenCalled();
  });

  it('does not retry a 413 by erasing images', async () => {
    httpClient.post.mockRejectedValue({ response: { status: 413 } });
    const result = await publishProject(validProject);
    expect(result.success).toBe(false);
    expect(result.error).toContain('413');
    expect(httpClient.post).toHaveBeenCalledOnce();
    expect(api.saveReleases).not.toHaveBeenCalled();
  });

  it.each([
    { name: 'Owner', screens: [], navigation: [], theme: { logo: null } },
    { version: '0.0.7', screens: { shop: {} } },
  ])('rejects an empty or stale mobile definition', async definition => {
    httpClient.get.mockImplementation(async url => ({ data: url.endsWith('/publishing/releases') ? [] : definition }));
    const result = await publishProject(validProject);
    expect(result.success).toBe(false);
    expect(result.error).toContain('has not been confirmed live');
    expect(api.saveReleases).not.toHaveBeenCalled();
  });
});