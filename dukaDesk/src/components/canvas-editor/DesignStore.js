import { useState, useCallback, useRef, useEffect } from "react";

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
  }));
}

function enrichSections(sections) {
  return (sections || []).map(sec => ({
    ...sec,
    id: sec.id || genSectionId(),
    components: enrichComponents(sec.components || []),
  }));
}

export function useDesignStore(initialData) {
  const [data, setData] = useState(() => {
    if (initialData) return initialData;
    try {
      const saved = localStorage.getItem("dukadesk_design");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.meta && parsed?.screens && parsed?.shared) {
          const sid = parsed.navigation?.initialScreen || Object.keys(parsed.screens)[0];
          if (!parsed.screens[sid]) parsed.screens[Object.keys(parsed.screens)[0]] = { name: "Home", backgroundColor: "#FCF8FA", bodySections: [] };
          return parsed;
        }
      }
    } catch {}
    return {
      meta: { category: "", appName: "", primaryColor: "#1A1A2E", logo: null },
      navigation: { initialScreen: "screen_1", tabs: [] },
      shared: {
        header: { id: "section_header", type: "header", name: "Header", backgroundColor: "#FCF8FA", components: [] },
        footer: { id: "section_footer", type: "footer", name: "Footer", backgroundColor: "#FCF8FA", components: [] },
      },
      screens: {
        screen_1: { name: "Home", backgroundColor: "#FCF8FA", bodySections: [] },
      },
    };
  });
  const [currentScreenId, setCurrentScreenId] = useState(data.navigation.initialScreen);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [selectedComponentId, setSelectedComponentId] = useState(null);
  const [activeTool, setActiveTool] = useState("select");
  const [bumpVal, bumpHistory] = useState(0); void bumpVal;
  const undoStack = useRef([]);
  const redoStack = useRef([]);
  const [copiedStyles, setCopiedStyles] = useState(null);
  const [assets, setAssets] = useState([]);
  const [lastSaved, setLastSaved] = useState(null);
  const saveTimerRef = useRef(null);

  useEffect(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem("dukadesk_design", JSON.stringify(data));
        setLastSaved(new Date());
      } catch {}
    }, 300);
    return () => clearTimeout(saveTimerRef.current);
  }, [data]);

  const clearDesign = useCallback(() => {
    try { localStorage.removeItem("dukadesk_design"); } catch {}
    setData({
      meta: { category: "", appName: "", primaryColor: "#1A1A2E", logo: null },
      navigation: { initialScreen: "screen_1", tabs: [] },
      shared: {
        header: { id: "section_header", type: "header", name: "Header", backgroundColor: "#FCF8FA", components: [] },
        footer: { id: "section_footer", type: "footer", name: "Footer", backgroundColor: "#FCF8FA", components: [] },
      },
      screens: {
        screen_1: { name: "Home", backgroundColor: "#FCF8FA", bodySections: [] },
      },
    });
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
    pushUndo();
    setData(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      fn(next);
      return next;
    });
  }, [pushUndo]);

  const screen = data.screens[currentScreenId] || data.screens[data.navigation.initialScreen];

  const getAllSections = useCallback(() => [
    data.shared.header,
    ...(screen?.bodySections || []),
    data.shared.footer,
  ], [data.shared.header, data.shared.footer, screen?.bodySections]);

  /* ── Screens ── */
  const addScreen = useCallback((id, name) => {
    const sid = id || genScreenId();
    updateData(d => {
      d.screens[sid] = { name: name || "New Screen", backgroundColor: "#FCF8FA", bodySections: [] };
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

  const setSectionColor = useCallback((screenId, sectionId, color) => {
    const sid = screenId || currentScreenId;
    updateData(d => {
      const s = d.screens[sid];
      if (!s || !s.bodySections) return;
      const sec = s.bodySections.find(x => x.id === sectionId);
      if (sec) sec.backgroundColor = color;
    });
  }, [updateData, currentScreenId]);

  const renameSection = useCallback((screenId, sectionId, name) => {
    const sid = screenId || currentScreenId;
    updateData(d => {
      const s = d.screens[sid];
      if (!s || !s.bodySections) return;
      const sec = s.bodySections.find(x => x.id === sectionId);
      if (sec) sec.name = name;
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

  /* ── Components within sections ── */
  function findSection(data, sectionId) {
    const shared = data.shared && Object.values(data.shared).find(s => s.id === sectionId);
    if (shared) return shared;
    for (const s of Object.values(data.screens)) {
      const sec = (s.bodySections || []).find(x => x.id === sectionId);
      if (sec) return sec;
    }
    return null;
  }

  const addComponentToSection = useCallback((sectionId, type, props) => {
    const id = genId();
    updateData(d => {
      const sec = findSection(d, sectionId);
      if (!sec) return;
      if (!sec.components) sec.components = [];
      sec.components.push({
        id, type, props: props || {},
        fills: [{ type: "solid", color: "#E8E5E0", opacity: 100 }],
        strokes: [], effects: [], cornerRadius: 0, opacity: 1, rotation: 0,
        locked: false, visible: true, zIndex: sec.components.length,
      });
    });
    setSelectedComponentId(id);
    return id;
  }, [updateData]);

  const removeComponentFromSection = useCallback((sectionId, compId) => {
    updateData(d => {
      const sec = findSection(d, sectionId);
      if (!sec || !sec.components) return;
      sec.components = sec.components.filter(c => c.id !== compId);
    });
    setSelectedComponentId(prev => prev === compId ? null : prev);
  }, [updateData]);

  const duplicateComponentInSection = useCallback((sectionId, compId) => {
    updateData(d => {
      const sec = findSection(d, sectionId);
      if (!sec || !sec.components) return;
      const idx = sec.components.findIndex(c => c.id === compId);
      if (idx === -1) return;
      const orig = sec.components[idx];
      const copy = JSON.parse(JSON.stringify(orig));
      copy.id = genId();
      copy.zIndex = sec.components.length;
      sec.components.splice(idx + 1, 0, copy);
    });
  }, [updateData]);

  const reorderComponent = useCallback((sectionId, compId, direction) => {
    updateData(d => {
      const sec = findSection(d, sectionId);
      if (!sec || !sec.components) return;
      const idx = sec.components.findIndex(c => c.id === compId);
      if (idx === -1) return;
      const target = direction === "up" ? idx - 1 : idx + 1;
      if (target < 0 || target >= sec.components.length) return;
      [sec.components[idx], sec.components[target]] = [sec.components[target], sec.components[idx]];
      sec.components.forEach((c, i) => c.zIndex = i);
    });
  }, [updateData]);

  const updateComponentInSection = useCallback((sectionId, compId, patch) => {
    updateData(d => {
      const sec = findSection(d, sectionId);
      if (!sec || !sec.components) return;
      const comp = sec.components.find(c => c.id === compId);
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
      const comp = sec.components.find(c => c.id === compId);
      if (comp) comp.props[key] = value;
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
      d.navigation.tabs.push({ id: `tab_${Date.now()}`, label: tab.label || "New Tab", icon: tab.icon || "\uD83D\uDCCB", screenId: tab.screenId || "" });
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

  /* ── Meta ── */
  const setMeta = useCallback((patch) => {
    updateData(d => { Object.assign(d.meta, patch); });
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
    pushUndo();
    const enriched = JSON.parse(JSON.stringify(templateData));
    // Enrich shared sections
    if (enriched.shared) {
      if (enriched.shared.header) {
        enriched.shared.header.components = enrichComponents(enriched.shared.header.components || []);
      }
      if (enriched.shared.footer) {
        enriched.shared.footer.components = enrichComponents(enriched.shared.footer.components || []);
      }
    }
    // Enrich screen body sections
    Object.keys(enriched.screens).forEach(sid => {
      const s = enriched.screens[sid];
      if (s.bodySections) {
        s.bodySections = enrichSections(s.bodySections);
      } else {
        s.bodySections = [];
      }
    });
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
    addBodySection, removeBodySection, reorderBodySection,
    setSectionColor, renameSection, duplicateSection,

    // Shared sections
    updateSharedSection, setSharedSectionColor,

    // Components
    addComponentToSection, removeComponentFromSection,
    duplicateComponentInSection,
    reorderComponent, updateComponentInSection, updateProp,

    // Navigation tabs
    addTab, removeTab, updateTab, reorderTab,

    // Meta / Navigation
    setMeta, setNavigation,

    // Undo / Redo
    undo, redo,
    canUndo: undoStack.current.length > 0,
    canRedo: redoStack.current.length > 0,

    // Template
    loadTemplate, getDesignJSON,

    // Persistence
    lastSaved, clearDesign,

    // Assets
    assets, addAsset, removeAsset,
  };
}
