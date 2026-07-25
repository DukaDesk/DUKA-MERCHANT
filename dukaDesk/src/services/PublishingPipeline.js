import { validateProject } from "./ValidationEngine";
import { getReleases, getCurrentDeployment, saveReleases, saveDeployment } from "./api";

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

  try {
    const history = await getReleases();
    history.push(release);
    await saveReleases(history);
    await saveDeployment({
      ...release.project,
      publishedAt: release.timestamp,
      version: release.version,
      status: "published",
    });
  } catch (e) {
    return { success: false, error: "Failed to save: " + e.message, validation };
  }

  return { success: true, version, releaseId: release.id, validation };
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
