import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  writeSnapshot,
  readSnapshot,
  queueSync,
  readOutbox,
  clearOutbox,
  clearCache,
  flushOutbox,
  resolveTenantId,
} from "./designCache";

const design = () => ({
  meta: { appName: "Shop", category: "Retail" },
  screens: { s1: { name: "Home", backgroundColor: "#fff", bodySections: [] } },
  shared: { header: { components: [] }, footer: { components: [] } },
});

describe("designCache (desktop local-first builder cache)", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
    localStorage.clear();
  });

  it("persists snapshots per merchant id", () => {
    localStorage.setItem("dd_merchant", JSON.stringify({ tenantId: "tenant_a" }));
    writeSnapshot(design());
    expect(readSnapshot().design.meta.appName).toBe("Shop");
    localStorage.setItem("dd_merchant", JSON.stringify({ tenantId: "tenant_b" }));
    expect(readSnapshot()).toBeNull();
    expect(resolveTenantId()).toBe("tenant_b");
  });

  it("migrates the legacy single-key snapshot", () => {
    localStorage.setItem("dukadesk_design", JSON.stringify(design()));
    const snapshot = readSnapshot();
    expect(snapshot.design.meta.appName).toBe("Shop");
    expect(snapshot.legacy).toBe(true);
    writeSnapshot(design());
    expect(localStorage.getItem("dukadesk_design")).toBeNull();
  });

  it("queues failed syncs and flushes them with retry", async () => {
    const saveFn = vi.fn()
      .mockRejectedValueOnce(new Error("backend down"))
      .mockResolvedValueOnce({});
    queueSync(design());
    expect(readOutbox()).not.toBeNull();
    await expect(flushOutbox(saveFn, 0)).resolves.toBe(false);
    expect(saveFn).toHaveBeenCalledTimes(1);
    expect(readOutbox()).not.toBeNull();
    await vi.runOnlyPendingTimersAsync();
    expect(saveFn).toHaveBeenCalledTimes(2);
    expect(readOutbox()).toBeNull();
  });

  it("does not attempt sync while offline and retries on reconnect", async () => {
    const saveFn = vi.fn().mockResolvedValue({});
    Object.defineProperty(window.navigator, "onLine", { value: false, configurable: true });
    queueSync(design());
    await expect(flushOutbox(saveFn, 0)).resolves.toBe(false);
    expect(saveFn).not.toHaveBeenCalled();
    Object.defineProperty(window.navigator, "onLine", { value: true, configurable: true });
    window.dispatchEvent(new Event("online"));
    await vi.runOnlyPendingTimersAsync();
    expect(readOutbox()).toBeNull();
  });

  it("degrades gracefully when storage quota is exceeded", () => {
    const big = design();
    big.screens.s1.bodySections = [{ components: [{ props: { source: "data:image/png;base64," + "x".repeat(100000) } }] }];
    const realSetItem = Storage.prototype.setItem;
    let calls = 0;
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(function (key, value) {
      calls += 1;
      if (calls === 1 && String(value).length > 1000) {
        const error = new Error("quota");
        error.name = "QuotaExceededError";
        throw error;
      }
      return realSetItem.call(this, key, value);
    });
    const result = writeSnapshot(big);
    expect(result.ok).toBe(true);
    expect(result.degraded).toBe(true);
    expect(result.stripped).toBeGreaterThan(0);
    expect(readSnapshot().degraded).toBe(true);
  });

  it("clearCache removes snapshot and outbox", () => {
    writeSnapshot(design());
    queueSync(design());
    clearCache();
    expect(readSnapshot()).toBeNull();
    expect(readOutbox()).toBeNull();
    expect(clearOutbox).toBeDefined();
  });
});
