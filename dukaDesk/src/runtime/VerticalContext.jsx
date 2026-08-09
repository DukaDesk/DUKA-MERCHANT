import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { getVertical, DEFAULT_VERTICAL } from "../config/verticals";
import { verticalPresetModules, getPrimitive } from "../config/primitives";
import { getMerchant, getSetupData, setSetupData, getMyApp, saveCategory, getDashboardModules, saveDashboardModules } from "../services/api";

const VerticalContext = createContext(null);

export function useVertical() {
  return useContext(VerticalContext) || {
    vertical: DEFAULT_VERTICAL,
    category: null,
    loading: false,
    setCategory: () => {},
    isNewTenant: false,
    modules: [],
    isEnabled: () => false,
    toggleModule: () => {},
    savingModules: false,
  };
}

export function VerticalProvider({ children }) {
  const [category, setCategoryState] = useState(() => {
    const merchant = getMerchant();
    if (merchant?.category) return merchant.category;
    const saved = getSetupData();
    return saved?.category || null;
  });
  const [enabledIds, setEnabledIds] = useState(() => {
    const saved = getDashboardModules();
    return saved || null;
  });
  const [loading, setLoading] = useState(false);
  const [savingModules, setSavingModules] = useState(false);

  const vertical = getVertical(category);
  const presetIds = useMemo(() => verticalPresetModules(vertical), [vertical]);

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
          setCategoryState(app.category);
          const saved = getSetupData();
          if (saved?.category !== app.category) {
            setSetupData({ ...(saved || {}), category: app.category });
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

  const setCategory = useCallback(async (value) => {
    const merchant = getMerchant();
    const next = { ...(merchant || {}), category: value };
    try { localStorage.setItem("dd_merchant", JSON.stringify(next)); } catch { /* ignore */ }
    const saved = getSetupData();
    setSetupData({ ...(saved || {}), category: value });
    setCategoryState(value);
    if (merchant?.tenantId) {
      try { await saveCategory(value); } catch { /* backend best-effort */ }
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

  return (
    <VerticalContext.Provider value={{
      vertical,
      category,
      loading,
      setCategory,
      modules: resolvedIds,
      isEnabled,
      toggleModule,
      savingModules,
    }}>
      {children}
    </VerticalContext.Provider>
  );
}