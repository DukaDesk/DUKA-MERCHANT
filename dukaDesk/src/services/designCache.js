// Local-first design cache for the builder (desktop).
//
// Guarantees: every edit is persisted to this machine within ~300ms even when
// the backend is down or slow. Server sync runs separately with retries, so a
// failed backend never blocks or loses local work.
//
// Storage layout (localStorage, per merchant id, `default` when signed out):
//   dukadesk_design:{id}          last fully-saved snapshot { savedAt, degraded, design }
//   dukadesk_design_pending:{id}  outbox: newest design not yet confirmed by the server
//   dukadesk_design               legacy un-namespaced key (read + migrated, then removed)

const LEGACY_KEY = "dukadesk_design";

function snapshotKey(tenantId) {
  return `dukadesk_design:${tenantId || "default"}`;
}

function outboxKey(tenantId) {
  return `dukadesk_design_pending:${tenantId || "default"}`;
}

export function resolveTenantId() {
  try {
    const raw = localStorage.getItem("dd_merchant");
    if (!raw) return "default";
    const merchant = JSON.parse(raw);
    return merchant?.merchantId || merchant?.tenantId || "default";
  } catch {
    return "default";
  }
}

function safeParse(raw) {
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function isDesign(value) {
  return !!value && typeof value === "object" && value.meta && value.screens && value.shared;
}

// Data-URL images (camera uploads, pasted logos) are what blow the ~5MB
// localStorage quota. The compacted copy keeps remote URLs and drops only
// embedded data blobs; the live design in memory is never touched.
function compactDesign(design) {
  let stripped = 0;
  const walk = value => {
    if (typeof value === "string") {
      if (value.length > 2048 && value.startsWith("data:")) {
        stripped += 1;
        return null;
      }
      return value;
    }
    if (Array.isArray(value)) return value.map(walk);
    if (value && typeof value === "object") {
      const out = {};
      for (const [key, entry] of Object.entries(value)) out[key] = walk(entry);
      return out;
    }
    return value;
  };
  return { design: walk(design), stripped };
}

function writeKey(key, envelope) {
  try {
    localStorage.setItem(key, JSON.stringify(envelope));
    return { ok: true, degraded: false, stripped: 0 };
  } catch (error) {
    const quota = error && (error.name === "QuotaExceededError" || error.code === 22);
    if (!quota || !envelope?.design) return { ok: false, degraded: false, stripped: 0 };
    try {
      const compacted = compactDesign(envelope.design);
      localStorage.setItem(key, JSON.stringify({ ...envelope, degraded: true, design: compacted.design }));
      return { ok: true, degraded: true, stripped: compacted.stripped };
    } catch {
      return { ok: false, degraded: false, stripped: 0 };
    }
  }
}

export function writeSnapshot(design, tenantId) {
  const id = tenantId || resolveTenantId();
  const envelope = { savedAt: new Date().toISOString(), degraded: false, design };
  const result = writeKey(snapshotKey(id), envelope);
  if (result.ok) migrateLegacy(id);
  return result;
}

export function readSnapshot(tenantId) {
  const id = tenantId || resolveTenantId();
  const envelope = safeParse(localStorage.getItem(snapshotKey(id)));
  if (envelope && isDesign(envelope.design)) return envelope;
  // Legacy single-key installs: adopt the snapshot under the current id.
  const legacy = safeParse(localStorage.getItem(LEGACY_KEY));
  if (legacy && isDesign(legacy.design || legacy)) {
    const design = legacy.design || legacy;
    const savedAt = legacy.savedAt || new Date(0).toISOString();
    return { savedAt, degraded: false, design, legacy: true };
  }
  return null;
}

function migrateLegacy(tenantId) {
  try {
    if (localStorage.getItem(LEGACY_KEY) != null) localStorage.removeItem(LEGACY_KEY);
  } catch { /* ignore */ }
}

export function queueSync(design, tenantId) {
  const id = tenantId || resolveTenantId();
  return writeKey(outboxKey(id), { updatedAt: new Date().toISOString(), design });
}

export function readOutbox(tenantId) {
  const id = tenantId || resolveTenantId();
  const envelope = safeParse(localStorage.getItem(outboxKey(id)));
  if (envelope && isDesign(envelope.design)) return envelope;
  return null;
}

export function clearOutbox(tenantId) {
  try {
    localStorage.removeItem(outboxKey(tenantId || resolveTenantId()));
    // eslint-disable-next-line no-empty
  } catch {}
}

export function clearCache(tenantId) {
  const id = tenantId || resolveTenantId();
  try {
    localStorage.removeItem(snapshotKey(id));
    localStorage.removeItem(outboxKey(id));
    // eslint-disable-next-line no-empty
  } catch {}
}

const RETRY_DELAYS = [5000, 15000, 60000];
let retryTimer = null;
let onlineHooked = false;

function scheduleRetry(saveFn, attempt) {
  if (retryTimer) clearTimeout(retryTimer);
  const delay = RETRY_DELAYS[Math.min(attempt, RETRY_DELAYS.length - 1)];
  retryTimer = setTimeout(() => {
    retryTimer = null;
    void flushOutbox(saveFn, attempt + 1);
  }, delay);
}

function hookOnline(saveFn, onStatus) {
  if (onlineHooked || typeof window === "undefined") return;
  onlineHooked = true;
  window.addEventListener("online", () => {
    const pending = readOutbox();
    if (pending) {
      onStatus?.("syncing");
      void flushOutbox(saveFn, 0);
    }
  });
}

// Push the newest outbox entry to the server. Resolves true when nothing is
// pending or the flush succeeded; schedules background retries otherwise.
export async function flushOutbox(saveFn, attempt = 0, onStatus) {
  hookOnline(saveFn, onStatus);
  const pending = readOutbox();
  if (!pending) return true;
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    onStatus?.("pending");
    scheduleRetry(saveFn, attempt);
    return false;
  }
  try {
    await saveFn(pending.design);
    // Only clear if nobody queued newer work while we were saving.
    const current = readOutbox();
    if (current && current.updatedAt === pending.updatedAt) clearOutbox();
    onStatus?.("synced");
    return true;
  } catch {
    onStatus?.("pending");
    scheduleRetry(saveFn, attempt);
    return false;
  }
}
