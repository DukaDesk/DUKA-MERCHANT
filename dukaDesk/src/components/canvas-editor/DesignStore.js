import { useState, useCallback, useRef, useEffect } from "react";
import { getDesignData, saveDesignData } from "../../services/api";
import { getComponentType } from "./componentTypes";

let nextId = 1;
function genId() { return `c_${nextId++}`; }
function genSectionId() { return `sec_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`; }
function genScreenId() { return `screen_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`; }

function enrichComponents(components) {
  return components.map((comp, i) => ({
    ...comp,
    id: comp.id || genId(),
    zIndex: comp.zIndex ?? i,
    fills: comp.fills ?? [{ type: "solid", color: "#E8E5E0", opacity: 100 }],
    strokes: comp.strokes ?? [],
    effects: comp.effects ?? [],
    cornerRadius: comp.cornerRadius ?? 0,
    opacity: comp.opacity ?? 1,
    rotation: comp.rotation ?? 0,
    locked: comp.locked ?? false,
    visible: comp.visible ?? true,
    children: comp.children ? enrichComponents(comp.children) : [],
  }));
}

function enrichSections(sections) {
  return (sections || []).map(sec => ({
    ...sec,
    id: sec.id || genSectionId(),
    components: enrichComponents(sec.components || []),
  }));
}

function findSectionById(data, sectionId) {
  if (!data || !sectionId) return null;
  const shared = data.shared && Object.values(data.shared).find(s => s.id === sectionId);
  if (shared) return shared;
  for (const s of Object.values(data.screens || {})) {
    const sec = (s.bodySections || []).find(x => x.id === sectionId);
    if (sec) return sec;
  }
  return null;
}

function migrateScreens(data) {
  Object.values(data.screens || {}).forEach(s => ensureChrome(s));
  ensureSplash(data);
  // Remove splash screen from tabs if it somehow got added (splash is never on tabs)
  if (data.splash && Array.isArray(data.navigation?.tabs)) {
    const splashIds = Object.keys(data.screens).filter(id => {
      const sc = data.screens[id];
      return sc.name?.toLowerCase() === "splash" || id === "splash";
    });
    if (splashIds.length > 0) {
      data.navigation.tabs = data.navigation.tabs.filter(t => !splashIds.includes(t.screenId));
    }
  }
  return data;
}

function getDefaultChrome() {
  return { header: { mode: "inherit" }, footer: { mode: "inherit" } };
}

function ensureChrome(screen) {
  if (!screen) return screen;
  if (!screen.chrome) screen.chrome = getDefaultChrome();
  screen.chrome.header = screen.chrome.header || { mode: "inherit" };
  screen.chrome.footer = screen.chrome.footer || { mode: "inherit" };
  return screen;
}

export function getDefaultData() {
  return {
    meta: { category: "", appName: "", primaryColor: "#1A1A2E", logo: null },
    splash: {
      backgroundColor: "#1A1A2E",
      backgroundImage: "",
      logo: null,
    },
    navigation: { initialScreen: "screen_1", tabs: [] },
    shared: {
      header: { id: "section_header", type: "header", name: "Header", backgroundColor: "#FCF8FA", components: [] },
      footer: { id: "section_footer", type: "footer", name: "Footer", backgroundColor: "#FCF8FA", components: [] },
    },
    screens: {
      screen_1: ensureChrome({ name: "Home", backgroundColor: "#FCF8FA", bodySections: [] }),
    },
    savedSections: [],
  };
}

function ensureSplash(data) {
  if (!data.splash) {
    data.splash = { backgroundColor: "#1A1A2E", backgroundImage: "", logo: null };
  }
  return data.splash;
}

function loadLocalFallback() {
  try {
    const saved = localStorage.getItem("dukadesk_design");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed?.meta && parsed?.screens && parsed?.shared) {
        const sid = parsed.navigation?.initialScreen || Object.keys(parsed.screens)[0];
        if (!parsed.screens[sid]) parsed.screens[Object.keys(parsed.screens)[0]] = { name: "Home", backgroundColor: "#FCF8FA", bodySections: [] };
        parsed.savedSections = parsed.savedSections || [];
        return migrateScreens(parsed);
      }
    }
    // eslint-disable-next-line no-empty
  } catch {}
  return null;
}

export function useDesignStore(initialData, options = {}) {
  const deferSave = !!options.deferSave;
  const dirtyRef = useRef(false);
  const [data, setData] = useState(() => initialData || loadLocalFallback() || getDefaultData());
  const [serverLastSaved, setServerLastSaved] = useState(null);
  const [currentScreenId, setCurrentScreenId] = useState(data.navigation.initialScreen);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [selectedComponentId, setSelectedComponentId] = useState(null);
  const [bumpVal, bumpHistory] = useState(0); void bumpVal;
  const undoStack = useRef([]);
  const redoStack = useRef([]);
  const [assets, setAssets] = useState([]);
  const [lastSaved, setLastSaved] = useState(null);
  const [savingToServer, setSavingToServer] = useState(false);
  const saveTimerRef = useRef(null);
  const apiSaveTimerRef = useRef(null);

  const templateLoadedRef = useRef(false);
  const [hydrated, setHydrated] = useState(!!initialData);

  useEffect(() => {
    if (initialData) {
      setHydrated(true);
      return;
    }
    getDesignData().then(apiData => {
      if (!templateLoadedRef.current && apiData?.meta && apiData?.screens && apiData?.shared) {
        if (!Array.isArray(apiData.savedSections)) apiData.savedSections = [];
        migrateScreens(apiData);
        setData(apiData);
        setCurrentScreenId(apiData.navigation?.initialScreen || Object.keys(apiData.screens)[0]);
        setServerLastSaved(new Date());
      }
    }).catch(() => {}).finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (deferSave && !dirtyRef.current) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem("dukadesk_design", JSON.stringify(data));
        setLastSaved(new Date());
        // eslint-disable-next-line no-empty
      } catch {}
    }, 300);
    return () => clearTimeout(saveTimerRef.current);
  }, [data, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    if (deferSave && !dirtyRef.current) return;
    if (apiSaveTimerRef.current) clearTimeout(apiSaveTimerRef.current);
    apiSaveTimerRef.current = setTimeout(() => {
      setSavingToServer(true);
      saveDesignData(data).then(() => { setServerLastSaved(new Date()); setSavingToServer(false); }).catch(() => setSavingToServer(false));
    }, 2000);
    return () => clearTimeout(apiSaveTimerRef.current);
  }, [data, hydrated]);

  const saveToServer = useCallback(async () => {
    if (apiSaveTimerRef.current) clearTimeout(apiSaveTimerRef.current);
    setSavingToServer(true);
    try {
      await saveDesignData(data);
      setServerLastSaved(new Date());
      // eslint-disable-next-line no-empty
    } catch {} finally {
      setSavingToServer(false);
    }
  }, [data]);

  const clearDesign = useCallback(() => {
    dirtyRef.current = true;
    // eslint-disable-next-line no-empty
    try { localStorage.removeItem("dukadesk_design"); } catch {}
    setData(getDefaultData());
    undoStack.current = [];
    redoStack.current = [];
  }, []);

  const pushUndo = useCallback(() => {
    undoStack.current.push(JSON.parse(JSON.stringify(data)));
    if (undoStack.current.length > 100) undoStack.current.shift();
    redoStack.current = [];
    bumpHistory(v => v + 1);
  }, [data]);

  const updateData = useCallback((fn) => {
    dirtyRef.current = true;
    pushUndo();
    setData(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      fn(next);
      return next;
    });
  }, [pushUndo]);

  const screen = data.screens[currentScreenId] || data.screens[data.navigation.initialScreen];

  const findSavedSection = useCallback((id) => {
    return (data.savedSections || []).find(s => s.id === id) || null;
  }, [data.savedSections]);

  /* Resolve a section for rendering: linked body sections surface the library item content
     while keeping the instance id so selection/edit wiring keeps working. */
  const resolveSection = useCallback((section) => {
    if (!section) return null;
    if (section.kind === "saved" && section.libraryId) {
      const lib = findSavedSection(section.libraryId);
      if (lib) {
        return { ...lib, id: section.id, kind: "saved", libraryId: lib.id };
      }
    }
    return section;
  }, [findSavedSection]);

  /* Per-screen chrome resolution: inherit -> shared theme section, hide -> null, custom -> any section by id. */
  const resolveChrome = useCallback((type) => {
    const cfg = screen?.chrome?.[type] || { mode: "inherit" };
    if (cfg.mode === "hide") return null;
    if (cfg.mode === "custom" && cfg.sectionId) {
      return findSectionById(data, cfg.sectionId) || data.shared?.[type] || null;
    }
    return data.shared?.[type] || null;
  }, [screen, data]);

  const setScreenChrome = useCallback((screenId, type, mode, sectionId) => {
    const sid = screenId || currentScreenId;
    updateData(d => {
      const s = d.screens[sid];
      if (!s) return;
      s.chrome = s.chrome || getDefaultChrome();
      s.chrome[type] = { mode, sectionId: mode === "custom" ? sectionId : null };
    });
  }, [updateData, currentScreenId]);

  const getAllSections = useCallback(() => [
    resolveChrome("header"),
    ...(screen?.bodySections || []),
    resolveChrome("footer"),
  ].filter(Boolean), [resolveChrome, screen?.bodySections]);

  /* ── Screens ── */
  const addScreen = useCallback((id, name) => {
    const sid = id || genScreenId();
    updateData(d => {
      d.screens[sid] = ensureChrome({ name: name || "New Screen", backgroundColor: "#FCF8FA", bodySections: [] });
    });
    return sid;
  }, [updateData]);

  const removeScreen = useCallback((id) => {
    const remaining = Object.keys(data.screens).filter(k => k !== id);
    updateData(d => {
      delete d.screens[id];
      d.navigation.tabs = d.navigation.tabs.filter(t => t.screenId !== id);
    });
    if (currentScreenId === id && remaining.length > 0) {
      setCurrentScreenId(remaining[0]);
    }
  }, [updateData, currentScreenId, data.screens]);

  const renameScreen = useCallback((id, name) => {
    updateData(d => { if (d.screens[id]) d.screens[id].name = name; });
  }, [updateData]);

  /* ── Sections ── */
  const addBodySection = useCallback((screenId, section) => {
    const sid = screenId || currentScreenId;
    updateData(d => {
      const s = d.screens[sid];
      if (!s) return;
      if (!s.bodySections) s.bodySections = [];
      s.bodySections.push({
        id: section.id || genSectionId(),
        type: section.type || "custom",
        name: section.name || "New Section",
        backgroundColor: section.backgroundColor || "#FCF8FA",
        components: enrichComponents(section.components || []),
      });
    });
  }, [updateData, currentScreenId]);

  const removeBodySection = useCallback((screenId, sectionId) => {
    const sid = screenId || currentScreenId;
    updateData(d => {
      const s = d.screens[sid];
      if (!s || !s.bodySections) return;
      s.bodySections = s.bodySections.filter(sec => sec.id !== sectionId);
    });
    setSelectedSectionId(prev => prev === sectionId ? null : prev);
    setSelectedComponentId(null);
  }, [updateData, currentScreenId]);

  const reorderBodySection = useCallback((screenId, sectionId, direction) => {
    const sid = screenId || currentScreenId;
    updateData(d => {
      const s = d.screens[sid];
      if (!s || !s.bodySections) return;
      const idx = s.bodySections.findIndex(sec => sec.id === sectionId);
      if (idx === -1) return;
      const target = direction === "up" ? idx - 1 : idx + 1;
      if (target < 0 || target >= s.bodySections.length) return;
      [s.bodySections[idx], s.bodySections[target]] = [s.bodySections[target], s.bodySections[idx]];
    });
  }, [updateData, currentScreenId]);

  const moveBodySectionToIndex = useCallback((screenId, sectionId, toIndex) => {
    const sid = screenId || currentScreenId;
    updateData(d => {
      const s = d.screens[sid];
      if (!s || !s.bodySections) return;
      const fromIdx = s.bodySections.findIndex(sec => sec.id === sectionId);
      if (fromIdx === -1 || toIndex === fromIdx) return;
      const clamped = Math.max(0, Math.min(toIndex, s.bodySections.length - 1));
      const [item] = s.bodySections.splice(fromIdx, 1);
      s.bodySections.splice(clamped, 0, item);
    });
  }, [updateData, currentScreenId]);

  const setSectionColor = useCallback((screenId, sectionId, color) => {
    const sid = screenId || currentScreenId;
    updateData(d => {
      const s = d.screens[sid];
      if (!s || !s.bodySections) return;
      const idx = s.bodySections.findIndex(x => x.id === sectionId);
      if (idx === -1) return;
      const sec = s.bodySections[idx];
      if (sec.kind === "saved" && sec.libraryId) {
        const lib = (d.savedSections || []).find(x => x.id === sec.libraryId);
        if (lib) lib.backgroundColor = color;
        return;
      }
      sec.backgroundColor = color;
    });
  }, [updateData, currentScreenId]);

  const renameSection = useCallback((screenId, sectionId, name) => {
    const sid = screenId || currentScreenId;
    updateData(d => {
      const s = d.screens[sid];
      if (!s || !s.bodySections) return;
      const idx = s.bodySections.findIndex(x => x.id === sectionId);
      if (idx === -1) return;
      const sec = s.bodySections[idx];
      if (sec.kind === "saved" && sec.libraryId) {
        const lib = (d.savedSections || []).find(x => x.id === sec.libraryId);
        if (lib) lib.name = name;
        return;
      }
      sec.name = name;
    });
  }, [updateData, currentScreenId]);

  const setSectionVisible = useCallback((screenId, sectionId, visible) => {
    const sid = screenId || currentScreenId;
    updateData(d => {
      const s = d.screens[sid];
      if (!s || !s.bodySections) return;
      const sec = s.bodySections.find(x => x.id === sectionId);
      if (sec) sec.visible = !!visible;
    });
  }, [updateData, currentScreenId]);

  /* ── Shared sections ── */
  const updateSharedSection = useCallback((type, patch) => {
    updateData(d => {
      if (d.shared[type]) Object.assign(d.shared[type], patch);
    });
  }, [updateData]);

  const setSharedSectionColor = useCallback((type, color) => {
    updateData(d => {
      if (d.shared[type]) d.shared[type].backgroundColor = color;
    });
  }, [updateData]);

  /* ── Saved section library (ADR-015) ── */
  function genLibraryId() { return `lib_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`; }

  const saveSectionToLibrary = useCallback((screenId, sectionId, name) => {
    const sid = screenId || currentScreenId;
    let libraryId = null;
    updateData(d => {
      const s = d.screens[sid];
      if (!s || !s.bodySections) return;
      const idx = s.bodySections.findIndex(sec => sec.id === sectionId);
      if (idx === -1) return;
      const source = s.bodySections[idx];
      libraryId = source.kind === "saved" && source.libraryId
        ? source.libraryId
        : genLibraryId();
      let lib = (d.savedSections || []).find(x => x.id === libraryId);
      if (!lib) {
        if (!d.savedSections) d.savedSections = [];
        lib = { id: libraryId, name: name || source.name || "Saved Section", type: source.type || "custom", backgroundColor: source.backgroundColor || "#FCF8FA", components: [], published: true, updatedAt: Date.now() };
        d.savedSections.push(lib);
      }
      lib.name = name || lib.name || source.name || "Saved Section";
      lib.type = source.type || lib.type || "custom";
      lib.backgroundColor = source.backgroundColor || lib.backgroundColor || "#FCF8FA";
      lib.components = JSON.parse(JSON.stringify(source.components || []));
      lib.published = true;
      lib.updatedAt = Date.now();
      s.bodySections[idx] = { id: source.id, kind: "saved", libraryId, name: lib.name, type: lib.type, backgroundColor: lib.backgroundColor };
    });
    return libraryId;
  }, [updateData, currentScreenId]);

  const insertSavedSection = useCallback((screenId, libraryId) => {
    const sid = screenId || currentScreenId;
    const secId = genSectionId();
    updateData(d => {
      const lib = (d.savedSections || []).find(x => x.id === libraryId);
      if (!lib) return;
      const s = d.screens[sid];
      if (!s) return;
      if (!s.bodySections) s.bodySections = [];
      s.bodySections.push({ id: secId, kind: "saved", libraryId: lib.id, name: lib.name, type: lib.type || "custom", backgroundColor: lib.backgroundColor || "#FCF8FA" });
    });
    return secId;
  }, [updateData, currentScreenId]);

  const deleteSavedSection = useCallback((libraryId) => {
    updateData(d => {
      const lib = (d.savedSections || []).find(x => x.id === libraryId);
      const snapshotComponents = lib ? JSON.parse(JSON.stringify(lib.components || [])) : [];
      const snapshotType = lib?.type || "custom";
      const snapshotBg = lib?.backgroundColor || "#FCF8FA";
      d.savedSections = (d.savedSections || []).filter(x => x.id !== libraryId);
      Object.values(d.screens).forEach(s => {
        (s.bodySections || []).forEach((sec, i) => {
          if (sec.kind === "saved" && sec.libraryId === libraryId) {
            s.bodySections[i] = { id: sec.id, name: sec.name, type: snapshotType, backgroundColor: snapshotBg, components: JSON.parse(JSON.stringify(snapshotComponents)) };
          }
        });
      });
    });
  }, [updateData]);

  const renameSavedSection = useCallback((libraryId, name) => {
    updateData(d => {
      const lib = (d.savedSections || []).find(x => x.id === libraryId);
      if (lib) lib.name = name;
    });
  }, [updateData]);

  const setSavedSectionPublished = useCallback((libraryId, published) => {
    updateData(d => {
      const lib = (d.savedSections || []).find(x => x.id === libraryId);
      if (lib) lib.published = !!published;
    });
  }, [updateData]);

  const detachSection = useCallback((screenId, sectionId) => {
    const sid = screenId || currentScreenId;
    updateData(d => {
      const s = d.screens[sid];
      if (!s || !s.bodySections) return;
      const idx = s.bodySections.findIndex(sec => sec.id === sectionId);
      if (idx === -1) return;
      const sec = s.bodySections[idx];
      const lib = sec.kind === "saved" ? (d.savedSections || []).find(x => x.id === sec.libraryId) : null;
      s.bodySections[idx] = {
        id: sec.id,
        name: sec.name || lib?.name || "Section",
        type: lib?.type || sec.type || "custom",
        backgroundColor: lib?.backgroundColor || sec.backgroundColor || "#FCF8FA",
        components: lib ? JSON.parse(JSON.stringify(lib.components || [])) : (sec.components ? JSON.parse(JSON.stringify(sec.components)) : []),
      };
    });
  }, [updateData, currentScreenId]);

  /* ── Components within sections ── */
  function findSection(data, sectionId) {
    const shared = data.shared && Object.values(data.shared).find(s => s.id === sectionId);
    if (shared) return shared;
    for (const s of Object.values(data.screens)) {
      const sec = (s.bodySections || []).find(x => x.id === sectionId);
      if (sec) {
        if (sec.kind === "saved" && sec.libraryId) {
          const lib = (data.savedSections || []).find(x => x.id === sec.libraryId);
          if (lib) return lib;
        }
        return sec;
      }
    }
    return null;
  }

  /* Recursively locate a component anywhere inside a section's tree. */
  function findComponentDeep(components, compId) {
    for (const c of components || []) {
      if (c.id === compId) return c;
      const hit = findComponentDeep(c.children || [], compId);
      if (hit) return hit;
    }
    return null;
  }

  /* Return { parent, list, index } for a nested component so mutators can add/remove/reorder in place. */
  function findComponentPlacement(components, componentId) {
    for (let i = 0; i < (components || []).length; i++) {
      const c = components[i];
      if (c.id === componentId) return { parent: components, index: i };
      const hit = findComponentPlacement(c.children || [], componentId);
      if (hit) return hit;
    }
    return null;
  }

  const addComponentToSection = useCallback((sectionId, type, props, parentCompId) => {
    const id = genId();
    updateData(d => {
      const sec = findSection(d, sectionId);
      if (!sec) return;
      const comp = {
        id, type, props: props || {},
        fills: [{ type: "solid", color: "#E8E5E0", opacity: 100 }],
        strokes: [], effects: [], cornerRadius: 0, opacity: 1, rotation: 0,
        locked: false, visible: true, zIndex: 0,
      };
      if (parentCompId) {
        const container = findComponentDeep(sec.components || [], parentCompId);
        if (!container) return;
        if (!container.children) container.children = [];
        comp.zIndex = container.children.length;
        container.children.push(comp);
      } else {
        if (!sec.components) sec.components = [];
        comp.zIndex = sec.components.length;
        sec.components.push(comp);
      }
    });
    setSelectedComponentId(id);
    return id;
  }, [updateData]);

  const removeComponentFromSection = useCallback((sectionId, compId) => {
    updateData(d => {
      const sec = findSection(d, sectionId);
      if (!sec || !sec.components) return;
      const placement = findComponentPlacement(sec.components, compId);
      if (!placement) return;
      placement.parent.splice(placement.index, 1);
    });
    setSelectedComponentId(prev => prev === compId ? null : prev);
  }, [updateData]);

  const insertComponentAt = useCallback((sectionId, parentCompId, index, type, props) => {
    const id = genId();
    updateData(d => {
      const sec = findSection(d, sectionId);
      if (!sec) return;
      const container = findComponentDeep(sec.components || [], parentCompId);
      if (!container) return;
      if (!container.children) container.children = [];
      const comp = {
        id, type, props: props || {},
        fills: [{ type: "solid", color: "#E8E5E0", opacity: 100 }],
        strokes: [], effects: [], cornerRadius: 0, opacity: 1, rotation: 0,
        locked: false, visible: true, zIndex: container.children.length,
        children: [],
      };
      const pos = Math.max(0, Math.min(index, container.children.length));
      container.children.splice(pos, 0, comp);
    });
    setSelectedComponentId(id);
    return id;
  }, [updateData]);

  const duplicateComponentInSection = useCallback((sectionId, compId) => {
    updateData(d => {
      const sec = findSection(d, sectionId);
      if (!sec || !sec.components) return;
      const placement = findComponentPlacement(sec.components, compId);
      if (!placement) return;
      const orig = placement.parent[placement.index];
      const copy = JSON.parse(JSON.stringify(orig));
      copy.id = genId();
      copy.zIndex = placement.parent.length;
      placement.parent.splice(placement.index + 1, 0, copy);
    });
  }, [updateData]);

  const reorderComponent = useCallback((sectionId, compId, direction) => {
    updateData(d => {
      const sec = findSection(d, sectionId);
      if (!sec || !sec.components) return;
      const placement = findComponentPlacement(sec.components, compId);
      if (!placement) return;
      const list = placement.parent;
      const idx = placement.index;
      const target = direction === "up" ? idx - 1 : idx + 1;
      if (target < 0 || target >= list.length) return;
      [list[idx], list[target]] = [list[target], list[idx]];
    });
  }, [updateData]);

  const updateComponentInSection = useCallback((sectionId, compId, patch) => {
    updateData(d => {
      const sec = findSection(d, sectionId);
      if (!sec || !sec.components) return;
      const comp = findComponentDeep(sec.components, compId);
      if (comp) {
        Object.assign(comp, patch);
        if (patch.props) {
          Object.assign(comp.props, patch.props);
        }
      }
    });
  }, [updateData]);

  const updateProp = useCallback((sectionId, compId, key, value) => {
    updateData(d => {
      const sec = findSection(d, sectionId);
      if (!sec || !sec.components) return;
      const comp = findComponentDeep(sec.components, compId);
      if (comp) comp.props[key] = value;
    });
  }, [updateData]);

  const clearProp = useCallback((sectionId, compId, key) => {
    updateData(d => {
      const sec = findSection(d, sectionId);
      if (!sec || !sec.components) return;
      const comp = findComponentDeep(sec.components, compId);
      if (!comp) return;
      const def = getComponentType(comp.type);
      const defVal = def?.defaultProps?.[key];
      comp.props[key] = typeof defVal === "undefined" ? "" : (defVal === null ? "" : defVal);
    });
  }, [updateData]);

  const updateTextStyle = useCallback((sectionId, compId, subKey, field, value) => {
    updateData(d => {
      const sec = findSection(d, sectionId);
      if (!sec || !sec.components) return;
      const comp = findComponentDeep(sec.components, compId);
      if (!comp) return;
      if (!comp.props.textStyles) comp.props.textStyles = {};
      if (!comp.props.textStyles[subKey]) comp.props.textStyles[subKey] = {};
      comp.props.textStyles[subKey][field] = value;
    });
  }, [updateData]);

  const clearTextStyle = useCallback((sectionId, compId, subKey, field) => {
    updateData(d => {
      const sec = findSection(d, sectionId);
      if (!sec || !sec.components) return;
      const comp = findComponentDeep(sec.components, compId);
      if (!comp?.props?.textStyles?.[subKey]) return;
      const def = getComponentType(comp.type);
      const fallback = def?.defaultProps?.textStyles?.[subKey]?.[field];
      if (fallback !== undefined) comp.props.textStyles[subKey][field] = fallback;
      else delete comp.props.textStyles[subKey][field];
    });
  }, [updateData]);

  /* ── Screen background color ── */
  const setScreenBackgroundColor = useCallback((screenId, color) => {
    updateData(d => {
      if (d.screens[screenId]) d.screens[screenId].backgroundColor = color;
    });
  }, [updateData]);

  /* ── Duplicate section ── */
  const duplicateSection = useCallback((screenId, sectionId) => {
    const sid = screenId || currentScreenId;
    updateData(d => {
      const s = d.screens[sid];
      if (!s || !s.bodySections) return;
      const idx = s.bodySections.findIndex(sec => sec.id === sectionId);
      if (idx === -1) return;
      const copy = JSON.parse(JSON.stringify(s.bodySections[idx]));
      copy.id = genSectionId();
      copy.name = copy.name + " (copy)";
      copy.components = enrichComponents(copy.components || []);
      s.bodySections.splice(idx + 1, 0, copy);
    });
  }, [updateData, currentScreenId]);

  /* ── Navigation tabs ── */
  const addTab = useCallback((tab) => {
    updateData(d => {
      if (!d.navigation.tabs) d.navigation.tabs = [];
      d.navigation.tabs.push({ id: `tab_${Date.now()}`, label: tab.label || "New Tab", icon: tab.icon || "Home", screenId: tab.screenId || "" });
    });
  }, [updateData]);

  const addTabs = useCallback((tabs) => {
    updateData(d => {
      if (!Array.isArray(tabs) || tabs.length === 0) return;
      const existing = d.navigation.tabs || [];
      const startIdx = existing.length;
      const next = tabs.map((t, i) => ({
        id: `tab_${Date.now()}_${i}`,
        label: t.label || `Tab ${startIdx + i + 1}`,
        icon: t.icon || "Home",
        screenId: t.screenId || "",
      }));
      d.navigation.tabs = [...existing, ...next];
    });
  }, [updateData]);

  const removeTab = useCallback((index) => {
    updateData(d => {
      if (!d.navigation.tabs) return;
      d.navigation.tabs = d.navigation.tabs.filter((_, i) => i !== index);
    });
  }, [updateData]);

  const updateTab = useCallback((index, patch) => {
    updateData(d => {
      if (!d.navigation.tabs || !d.navigation.tabs[index]) return;
      Object.assign(d.navigation.tabs[index], patch);
    });
  }, [updateData]);

  const reorderTab = useCallback((index, direction) => {
    updateData(d => {
      if (!d.navigation.tabs) return;
      const target = direction === "left" ? index - 1 : index + 1;
      if (target < 0 || target >= d.navigation.tabs.length) return;
      [d.navigation.tabs[index], d.navigation.tabs[target]] = [d.navigation.tabs[target], d.navigation.tabs[index]];
    });
  }, [updateData]);

  /* ── Meta & Splash ── */
  const setMeta = useCallback((patch) => {
    updateData(d => { Object.assign(d.meta, patch); });
  }, [updateData]);

  const setSplash = useCallback((patch) => {
    updateData(d => {
      ensureSplash(d);
      Object.assign(d.splash, patch);
    });
  }, [updateData]);

  const setNavigation = useCallback((patch) => {
    updateData(d => { Object.assign(d.navigation, patch); });
  }, [updateData]);

  /* ── Undo / Redo ── */
  const undo = useCallback(() => {
    const prev = undoStack.current.pop();
    if (!prev) return;
    redoStack.current.push(JSON.parse(JSON.stringify(data)));
    setData(prev);
    bumpHistory(v => v + 1);
  }, [data]);

  const redo = useCallback(() => {
    const next = redoStack.current.pop();
    if (!next) return;
    undoStack.current.push(JSON.parse(JSON.stringify(data)));
    setData(next);
    bumpHistory(v => v + 1);
  }, [data]);

  /* ── Load Template ── */
  const loadTemplate = useCallback((templateData) => {
    templateLoadedRef.current = true;
    dirtyRef.current = true;
    pushUndo();
    const enriched = JSON.parse(JSON.stringify(templateData));
    if (enriched.shared) {
      if (enriched.shared.header) {
        enriched.shared.header.components = enrichComponents(enriched.shared.header.components || []);
      }
      if (enriched.shared.footer) {
        enriched.shared.footer.components = enrichComponents(enriched.shared.footer.components || []);
      }
    }
    Object.keys(enriched.screens).forEach(sid => {
      const s = ensureChrome(enriched.screens[sid]);
      if (s.bodySections) {
        s.bodySections = enrichSections(s.bodySections);
      } else {
        s.bodySections = [];
      }
      enriched.screens[sid] = s;
    });
    enriched.savedSections = Array.isArray(enriched.savedSections) ? enriched.savedSections : [];
    setData(enriched);
    setCurrentScreenId(templateData.navigation?.initialScreen || Object.keys(templateData.screens)[0]);
    setSelectedSectionId(null);
    setSelectedComponentId(null);
    setSelectedIds([]);
  }, [pushUndo]);

  const getDesignJSON = useCallback(() => data, [data]);

  const addAsset = useCallback((file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const asset = { id: `asset_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, name: file.name, url: reader.result, type: file.type, size: file.size };
        setAssets(prev => [...prev, asset]);
        resolve(asset);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const removeAsset = useCallback((id) => {
    setAssets(prev => prev.filter(a => a.id !== id));
  }, []);

  return {
    data, currentScreenId, setCurrentScreenId,
    screen,
    selectedSectionId, setSelectedSectionId,
    selectedComponentId, setSelectedComponentId,
    selectedIds, setSelectedIds,

    // Screens
    addScreen, removeScreen, renameScreen,
    setScreenBackgroundColor,

    // Sections
    getAllSections,
    addBodySection, removeBodySection, reorderBodySection, moveBodySectionToIndex,
    setSectionColor, renameSection, duplicateSection, setSectionVisible,

    // Saved section library (ADR-015)
    savedSections: data.savedSections || [],
    resolveSection, resolveChrome, setScreenChrome,
    saveSectionToLibrary, insertSavedSection, deleteSavedSection,
    renameSavedSection, setSavedSectionPublished, detachSection,

    // Shared sections
    updateSharedSection, setSharedSectionColor,

    // Components
    addComponentToSection, removeComponentFromSection,
    insertComponentAt,
    duplicateComponentInSection,
    reorderComponent, updateComponentInSection, updateProp, clearProp,
    updateTextStyle, clearTextStyle,

    // Navigation tabs
    addTab, addTabs, removeTab, updateTab, reorderTab,

    // Meta / Splash / Navigation
    setMeta, setSplash, setNavigation,

    // Undo / Redo
    undo, redo,
    canUndo: undoStack.current.length > 0,
    canRedo: redoStack.current.length > 0,

    // Template
    loadTemplate, getDesignJSON,

    // Persistence
    lastSaved, serverLastSaved, savingToServer, saveToServer, clearDesign,

    // Assets
    assets, addAsset, removeAsset,
  };
}
