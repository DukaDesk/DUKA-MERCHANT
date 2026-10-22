import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { getVertical, DEFAULT_VERTICAL } from "../config/verticals";
import { resolveCanonicalCategory } from "../config/taxonomy";
import { verticalPresetModules, getPrimitive } from "../config/primitives";
import { getMerchant, getSetupData, setSetupData, getMyApp, saveCategory, getDashboardModules, saveDashboardModules } from "../services/api";
import { getCategoryName, getCategoryLower } from "../utils/categoryText";

const VerticalContext = createContext(null);

export function useVertical() {
  return useContext(VerticalContext) || {
    vertical: DEFAULT_VERTICAL,
    category: null,
    categoryName: "Business",
    categoryLower: "business",
    loading: false,
    setCategory: () => {},
    isNewTenant: false,
    modules: [],
    presetModules: [],
    isEnabled: () => false,
    toggleModule: () => {},
    resetModules: () => {},
    savingModules: false,
  };
}

export function VerticalProvider({ children }) {
  const [category, setCategoryState] = useState(() => {
    const merchant = getMerchant();
    // Migrate legacy stored values (Church, Booking, ...) to broad industries.
    const raw = merchant?.category || getSetupData()?.category || null;
    return resolveCanonicalCategory(raw) || raw || null;
  });
  const [enabledIds, setEnabledIds] = useState(() => {
    const saved = getDashboardModules();
    return saved || null;
  });
  const [loading, setLoading] = useState(false);
  const [savingModules, setSavingModules] = useState(false);

  const vertical = getVertical(category);
  const presetIds = useMemo(() => verticalPresetModules(vertical), [vertical]);
  const categoryName = getCategoryName(vertical, category);
  const categoryLower = getCategoryLower(vertical, category);

  const resolvedIds = useMemo(() => {
    if (Array.isArray(enabledIds) && enabledIds.length >= 0) return enabledIds;
    return presetIds;
  }, [enabledIds, presetIds]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getMyApp()
      .then(app => {
        if (!active) return;
        if (app?.category) {
          const canonical = resolveCanonicalCategory(app.category) || app.category;
          setCategoryState(canonical);
          const saved = getSetupData();
          if (saved?.category !== canonical) {
            setSetupData({ ...(saved || {}), category: canonical });
          }
        }
        if (Array.isArray(app?.modules) && app.modules.length) {
          setEnabledIds(app.modules);
        }
      })
        .catch(() => {})
        .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  // Launch default: Promotions ships with every desk. Backfill the saved
  // toolset once (flag-guarded so an explicit "remove" afterwards sticks).
  useEffect(() => {
    const BACKFILL_FLAG = "dd_promotions_preset_done";
    if (!Array.isArray(enabledIds) || enabledIds.includes("promotions")) return;
    try {
      if (window.localStorage.getItem(BACKFILL_FLAG)) return;
      window.localStorage.setItem(BACKFILL_FLAG, "1");
    } catch { /* storage unavailable — no backfill */ return; }
    const next = [...enabledIds, "promotions"];
    setEnabledIds(next);
    saveDashboardModules(next).catch(() => {});
  }, [enabledIds]);

  const setCategory = useCallback(async (value, opts = {}) => {
    // Always store the canonical broad industry (legacy aliases migrate here).
    const canonical = resolveCanonicalCategory(value) || value;
    const nextVertical = getVertical(canonical);
    const nextPreset = verticalPresetModules(nextVertical);
    const merchant = getMerchant();
    const next = { ...(merchant || {}), category: canonical };
    try { localStorage.setItem("dd_merchant", JSON.stringify(next)); } catch { /* ignore */ }
    const saved = getSetupData();
    // Preset the dashboard to the new category's default toolset so a
    // religion desk gets Donations (not Orders) and a shop desk gets Orders.
    // Pass { keepModules: true } only when the caller wants to preserve custom tools.
    const modulesToSave = opts.keepModules && Array.isArray(saved?.modules) && saved.modules.length
      ? saved.modules
      : nextPreset;
    setSetupData({ ...(saved || {}), category: canonical, modules: modulesToSave });
    setEnabledIds(modulesToSave);
    setCategoryState(canonical);
    if (merchant?.tenantId) {
      try { await saveCategory(canonical, modulesToSave); } catch { /* backend best-effort */ }
    } else {
      try { await saveDashboardModules(modulesToSave); } catch { /* local-only */ }
    }
  }, []);

  const isEnabled = useCallback((id) => {
    const list = resolvedIds;
    return list.includes(id);
  }, [resolvedIds]);

  const toggleModule = useCallback(async (id) => {
    const primitive = getPrimitive(id);
    if (!primitive) return;
    setSavingModules(true);
    try {
      const next = new Set(resolvedIds);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        (primitive.preset || []).forEach(p => next.add(p));
      }
      const list = [...next];
      setEnabledIds(list);
      try { await saveDashboardModules(list); } catch { /* backend best-effort */ }
    } finally {
      setSavingModules(false);
    }
  }, [resolvedIds]);

  const resetModules = useCallback(async () => {
    setEnabledIds(presetIds);
    try { await saveDashboardModules(presetIds); } catch { /* best-effort */ }
  }, [presetIds]);

  return (
    <VerticalContext.Provider value={{
      vertical,
      category,
      categoryName,
      categoryLower,
      loading,
      setCategory,
      modules: resolvedIds,
      presetModules: presetIds,
      isEnabled,
      toggleModule,
      resetModules,
      savingModules,
    }}>
      {children}
    </VerticalContext.Provider>
  );
}