const STORAGE_PREFIX = "dukadesk:app-submission:";

function stableStringify(value, seen = new WeakSet()) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (seen.has(value)) return '"[Circular]"';
  seen.add(value);
  if (Array.isArray(value)) {
    return "[" + value.map(item => stableStringify(item, seen)).join(",") + "]";
  }
  const keys = Object.keys(value).sort();
  return "{" + keys.map(key => JSON.stringify(key) + ":" + stableStringify(value[key], seen)).join(",") + "}";
}

function cyrb53(input) {
  let h1 = 0xdeadbeef ^ input.length;
  let h2 = 0x41c6ce57 ^ input.length;
  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (h2 >>> 0).toString(16).padStart(8, "0") + (h1 >>> 0).toString(16).padStart(8, "0");
}

/** Deterministic fingerprint of the editable design, independent of key order. */
export function designFingerprint(design) {
  try {
    return cyrb53(stableStringify(design ?? null));
  } catch {
    return null;
  }
}

const storageKey = id => STORAGE_PREFIX + String(id || "");

export function readSubmissionState(id) {
  if (!id) return null;
  try {
    const stored = localStorage.getItem(storageKey(id));
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

export function writeSubmissionState(id, state) {
  if (!id) return;
  try {
    localStorage.setItem(storageKey(id), JSON.stringify(state));
  } catch {
    // Storage may be unavailable (private mode/quota); the in-memory state still works.
  }
}

export function clearSubmissionState(id) {
  if (!id) return;
  try {
    localStorage.removeItem(storageKey(id));
  } catch {
    // Ignore storage failures.
  }
}
