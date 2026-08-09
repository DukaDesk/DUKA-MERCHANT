import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./api", () => ({
  getReleases: vi.fn(),
  getCurrentDeployment: vi.fn(),
  saveReleases: vi.fn(),
  saveDeployment: vi.fn(),
}));

vi.mock("./ValidationEngine", () => ({
  validateProject: vi.fn(),
}));

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
    validateProject.mockReturnValue({ valid: true, errors: [], warnings: [] });
  });

  describe("publishProject", () => {
    it("returns validation error when project is invalid", async () => {
      validateProject.mockReturnValue({
        valid: false,
        errors: [{ severity: "error", path: "meta.appName", message: "Missing" }],
        warnings: [],
      });

      const result = await publishProject(validProject);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Validation failed");
      expect(api.saveReleases).not.toHaveBeenCalled();
    });

    it("creates a release with incremented version", async () => {
      api.getReleases.mockResolvedValue([
        { id: "rel_1", version: "1.0.0", status: "published", timestamp: "2024-01-01T00:00:00.000Z", project: {}, validationResult: { errors: 0, warnings: 0 }, environment: "production" },
      ]);

      const result = await publishProject(validProject);

      expect(result.success).toBe(true);
      expect(result.version).toBe("1.0.1");
      expect(api.saveReleases).toHaveBeenCalledOnce();
      expect(api.saveDeployment).toHaveBeenCalledOnce();
    });

    it("starts at 0.0.1 when no prior releases", async () => {
      api.getReleases.mockResolvedValue([]);

      const result = await publishProject(validProject);

      expect(result.success).toBe(true);
      expect(result.version).toBe("0.0.1");
    });

    it("increments only from published releases", async () => {
      api.getReleases.mockResolvedValue([
        { id: "rel_1", version: "2.0.0", status: "rolled_back", timestamp: "2024-01-01T00:00:00.000Z", project: {}, validationResult: { errors: 0, warnings: 0 }, environment: "production" },
      ]);

      const result = await publishProject(validProject);

      expect(result.version).toBe("0.0.1");
    });

    it("saves the full project in the release", async () => {
      api.getReleases.mockResolvedValue([]);

      const result = await publishProject(validProject);

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

      await publishProject(validProject);

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

      const result = await publishProject(validProject);

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
