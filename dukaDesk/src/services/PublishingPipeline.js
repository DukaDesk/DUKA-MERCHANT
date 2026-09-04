import { validateProject } from "./ValidationEngine";
import { getReleases, getCurrentDeployment, saveReleases, saveDeployment, saveDesignData } from "./api";
import httpClient from "./httpClient";
import { getMerchant } from "./api";

function generateId() {
  return `rel_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

async function getLastVersion() {
  try {
    const releases = await getReleases();
    if (!Array.isArray(releases) || releases.length === 0) return "0.0.0";
    const versions = releases
      .filter(r => r.status === "published")
      .map(r => r.version.split(".").map(Number));
    if (versions.length === 0) return "0.0.0";
    const sorted = versions.sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]);
    const last = sorted[sorted.length - 1];
    return `${last[0]}.${last[1]}.${last[2]}`;
  } catch {
    return "0.0.0";
  }
}

function incrementVersion(version) {
  const [major, minor, patch] = version.split(".").map(Number);
  return `${major}.${minor}.${patch + 1}`;
}

export async function publishProject(projectData) {
  const validation = validateProject(projectData);
  if (!validation.valid) {
    return { success: false, error: "Validation failed", validation };
  }

  const lastVersion = await getLastVersion();
  const version = incrementVersion(lastVersion);

  const release = {
    id: generateId(),
    version,
    timestamp: new Date().toISOString(),
    status: "published",
    project: JSON.parse(JSON.stringify(projectData)),
    validationResult: { errors: validation.errors.length, warnings: validation.warnings.length },
    environment: "production",
  };

  // ── Generation: compile SDUI manifest for mobile BFF ──
  // The canvas design already is the SDUI manifest shape { meta, navigation, screens, shared, savedSections }.
  // We enrich it with deployment metadata so mobile can consume via GET /api/v1/merchants/:id/definition
  // or BFF GET /api/v1/bff/mobile/tenant/:slug/manifest
  const manifest = {
    ...JSON.parse(JSON.stringify(projectData)),
    publishedAt: release.timestamp,
    version: release.version,
    status: "published",
  };

  try {
    // 1) Persist design to tenant config (PUT /api/v1/merchants/:id/config with { design })
    //    In demo mode this writes to localStorage; with real backend it hits the API.
    await saveDesignData(projectData);

    // 2) Create release + deployment in local demo store (always)
    const history = await getReleases();
    history.push(release);
    await saveReleases(history);
    await saveDeployment(manifest);

    // 3) Try to publish to real backend publishing pipeline
    //    POST /api/v1/merchants/:id/publishing/publish  (ADR-010)
    //    Fallback to POST /api/v1/merchants/:id/publish  and PUT /api/v1/merchants/:id/config
    const merchant = getMerchant();
    const merchantId = merchant?.merchantId || merchant?.tenantId;
    const slug = merchant?.merchantSlug || merchant?.tenantSlug || projectData?.meta?.appName?.toLowerCase().replace(/\s+/g, "-") || "demo";
    if (merchantId) {
      // Attempt SDUI publishing pipeline (primary)
      try {
        await httpClient.post(`/api/v1/merchants/${merchantId}/publishing/publish`, {
          version,
          manifest,
          design: projectData,
          // Mobile BFF expects { theme, navigation, screens } — we provide full manifest
          theme: projectData?.meta?.primaryColor ? { primaryColor: projectData.meta.primaryColor } : undefined,
          navigation: projectData?.navigation,
          screens: projectData?.screens,
        });
      } catch (e) {
        // Non-fatal — backend may be in demo mode or endpoint not yet deployed
        console.warn("[publishProject] publishing/publish failed (demo fallback):", e?.message || e);
      }

      // Also ensure tenant config has the deployed manifest for GET /api/v1/merchants/:id/definition
      try {
        await httpClient.put(`/api/v1/merchants/${merchantId}/config`, {
          config: {
            design: projectData,
            deployed: manifest,
            // Also store as app.templateConfig so MiniAppPreview (which reads getMyApp().templateConfig) can render
            app: { templateConfig: manifest },
          },
        });
      } catch (e) {
        console.warn("[publishProject] config PUT failed (demo fallback):", e?.message || e);
      }

      // Also publish tenant (sets status live)
      try {
        await httpClient.post(`/api/v1/merchants/${merchantId}/publish`);
      } catch (e) {
        console.warn("[publishProject] tenant publish failed (demo fallback):", e?.message || e);
      }

      // Best-effort: also push to BFF mobile manifest cache
      try {
        await httpClient.post(`/api/v1/bff/mobile/tenant/${slug}/manifest`, manifest).catch(() => {});
      } catch { /* ignore */ }
    }
  } catch (e) {
    return { success: false, error: "Failed to save: " + e.message, validation };
  }

  return { success: true, version, releaseId: release.id, validation, manifest };
}

export async function getReleaseHistory() {
  try {
    return await getReleases();
  } catch {
    return [];
  }
}

export { getCurrentDeployment };

export async function rollbackToRelease(releaseId) {
  try {
    const history = await getReleases();
    const release = history.find(r => r.id === releaseId);
    if (!release) {
      return { success: false, error: `Release "${releaseId}" not found` };
    }

    const updated = history.map(r => {
      if (r.status === "published" && r.id !== releaseId) {
        return { ...r, status: "rolled_back" };
      }
      return r;
    });

    await saveReleases(updated);
    await saveDeployment({
      ...release.project,
      publishedAt: new Date().toISOString(),
      version: release.version,
      status: "published",
      rollbackFrom: releaseId,
    });

    return { success: true, version: release.version };
  } catch (e) {
    return { success: false, error: "Failed to rollback: " + e.message };
  }
}
