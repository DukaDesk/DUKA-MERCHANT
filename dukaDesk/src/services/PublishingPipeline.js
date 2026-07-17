import { validateProject } from "./ValidationEngine";

const STORAGE_KEY_RELEASES = "dukadesk_releases";
const STORAGE_KEY_DEPLOYED = "dukadesk_deployed";

function generateId() {
  return `rel_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

function getLastVersion() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RELEASES);
    if (!raw) return "0.0.0";
    const releases = JSON.parse(raw);
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

export function publishProject(projectData) {
  const validation = validateProject(projectData);
  if (!validation.valid) {
    return { success: false, error: "Validation failed", validation };
  }

  const lastVersion = getLastVersion();
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

  // Append to release history
  const history = getReleaseHistory();
  history.push(release);
  try {
    localStorage.setItem(STORAGE_KEY_RELEASES, JSON.stringify(history));
    localStorage.setItem(STORAGE_KEY_DEPLOYED, JSON.stringify({
      ...release.project,
      publishedAt: release.timestamp,
      version: release.version,
      status: "published",
    }));
  } catch (e) {
    return { success: false, error: "Failed to save: " + e.message, validation };
  }

  return { success: true, version, releaseId: release.id, validation };
}

export function getReleaseHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RELEASES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getCurrentDeployment() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DEPLOYED);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function rollbackToRelease(releaseId) {
  const history = getReleaseHistory();
  const release = history.find(r => r.id === releaseId);
  if (!release) {
    return { success: false, error: `Release "${releaseId}" not found` };
  }

  // Mark current releases as rolled_back
  const updated = history.map(r => {
    if (r.status === "published" && r.id !== releaseId) {
      return { ...r, status: "rolled_back" };
    }
    return r;
  });

  // Restore the release project as deployed
  try {
    localStorage.setItem(STORAGE_KEY_RELEASES, JSON.stringify(updated));
    localStorage.setItem(STORAGE_KEY_DEPLOYED, JSON.stringify({
      ...release.project,
      publishedAt: new Date().toISOString(),
      version: release.version,
      status: "published",
      rollbackFrom: releaseId,
    }));
  } catch (e) {
    return { success: false, error: "Failed to rollback: " + e.message };
  }

  return { success: true, version: release.version };
}
