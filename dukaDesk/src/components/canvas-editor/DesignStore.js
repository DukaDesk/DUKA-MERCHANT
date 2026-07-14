import { useState, useCallback, useRef } from "react";

let nextId = 1;
function genId() { return `c_${nextId++}`; }

export function useDesignStore(initialScreens) {
  const [data, setData] = useState(() => ({
    meta: { category: "", appName: "", primaryColor: "#1A1A2E", logo: null },
    navigation: { initialScreen: "screen_1", tabs: [] },
    screens: initialScreens || {
      screen_1: { name: "Home", width: 390, height: 844, backgroundColor: "#FCF8FA", components: [] },
    },
  }));
  const [currentScreenId, setCurrentScreenId] = useState(data.navigation.initialScreen);
  const [selectedIds, setSelectedIds] = useState([]);
  const [clipboard, setClipboard] = useState(null);
  const [activeTool, setActiveTool] = useState("select");
  const [bumpVal, bumpHistory] = useState(0); void bumpVal;
  const undoStack = useRef([]);
  const redoStack = useRef([]);

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

  const addScreen = useCallback((id, name) => {
    const sid = id || `screen_${Date.now()}`;
    updateData(d => {
      d.screens[sid] = { name: name || "New Screen", width: 390, height: 844, backgroundColor: "#FCF8FA", components: [] };
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

  const addPrimitive = useCallback((type, x, y, w, h, defaults) => {
    const id = genId();
    updateData(d => {
      const comps = d.screens[currentScreenId]?.components;
      if (!comps) return;
      comps.push({
        id, type, x, y, width: w || 120, height: h || 120,
        props: defaults?.props || {},
        style: defaults?.style || {},
        locked: false, visible: true, zIndex: comps.length,
        rotation: 0,
        fills: defaults?.fills || [{ type: "solid", color: "#E5E1E3" }],
        strokes: defaults?.strokes || [],
        effects: defaults?.effects || [],
        cornerRadius: defaults?.cornerRadius ?? 0,
        opacity: defaults?.opacity ?? 1,
      });
    });
    setSelectedIds([id]);
    return id;
  }, [updateData, currentScreenId]);

  const addComponent = useCallback((type, x, y, defaults) => {
    const id = genId();
    updateData(d => {
      const comps = d.screens[currentScreenId]?.components;
      if (!comps) return;
      comps.push({
        id, type, x, y, width: defaults?.width || 120, height: defaults?.height || 40,
        props: defaults?.props || {},
        style: defaults?.style || {},
        locked: false, visible: true, zIndex: comps.length,
        rotation: 0,
        fills: defaults?.fills || [{ type: "solid", color: "#E5E1E3" }],
        strokes: defaults?.strokes || [],
        effects: defaults?.effects || [],
        cornerRadius: defaults?.cornerRadius ?? 0,
        opacity: defaults?.opacity ?? 1,
      });
    });
    setSelectedIds([id]);
    return id;
  }, [updateData, currentScreenId]);

  const updateComponent = useCallback((id, patch) => {
    updateData(d => {
      const comp = d.screens[currentScreenId]?.components.find(c => c.id === id);
      if (comp) Object.assign(comp, patch);
    });
  }, [updateData, currentScreenId]);

  const removeComponents = useCallback((ids) => {
    updateData(d => {
      const comps = d.screens[currentScreenId]?.components;
      if (!comps) return;
      d.screens[currentScreenId].components = comps.filter(c => !ids.includes(c.id));
    });
    setSelectedIds([]);
  }, [updateData, currentScreenId]);

  const duplicateComponents = useCallback((ids) => {
    let newIds = [];
    updateData(d => {
      const comps = d.screens[currentScreenId]?.components;
      if (!comps) return;
      const newComps = [];
      ids.forEach(id => {
        const orig = comps.find(c => c.id === id);
        if (orig) {
          const nid = genId();
          newComps.push({ ...JSON.parse(JSON.stringify(orig)), id: nid, x: orig.x + 20, y: orig.y + 20, zIndex: comps.length + newComps.length });
          newIds.push(nid);
        }
      });
      comps.push(...newComps);
    });
    setSelectedIds(newIds);
  }, [updateData, currentScreenId]);

  const moveLayer = useCallback((id, direction) => {
    updateData(d => {
      const comps = d.screens[currentScreenId]?.components;
      if (!comps) return;
      const idx = comps.findIndex(c => c.id === id);
      if (idx === -1) return;
      const [item] = comps.splice(idx, 1);
      const newIdx = direction === "up" ? Math.min(comps.length, idx + 1) : Math.max(0, idx - 1);
      comps.splice(newIdx, 0, item);
      comps.forEach((c, i) => c.zIndex = i);
    });
  }, [updateData, currentScreenId]);

  const updateProp = useCallback((id, key, value) => {
    updateData(d => {
      const comp = d.screens[currentScreenId]?.components.find(c => c.id === id);
      if (comp) comp.props[key] = value;
    });
  }, [updateData, currentScreenId]);

  const updateStyle = useCallback((id, key, value) => {
    updateData(d => {
      const comp = d.screens[currentScreenId]?.components.find(c => c.id === id);
      if (comp) comp.style[key] = value;
    });
  }, [updateData, currentScreenId]);

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

  const select = useCallback((id, multi) => {
    if (multi) {
      setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    } else {
      setSelectedIds([id]);
    }
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(screen?.components.map(c => c.id) || []);
  }, [screen]);

  const clearSelection = useCallback(() => setSelectedIds([]), []);

  const setMeta = useCallback((patch) => {
    updateData(d => { Object.assign(d.meta, patch); });
  }, [updateData]);

  const setNavigation = useCallback((patch) => {
    updateData(d => { Object.assign(d.navigation, patch); });
  }, [updateData]);

  const getDesignJSON = useCallback(() => data, [data]);

  const loadTemplate = useCallback((templateData) => {
    pushUndo();
    const enriched = JSON.parse(JSON.stringify(templateData));
    Object.keys(enriched.screens).forEach(sid => {
      const comps = enriched.screens[sid].components;
      comps.forEach((comp, i) => {
        comp.id = comp.id || `c_${Date.now()}_${i}_${Math.random().toString(36).slice(2, 6)}`;
        comp.zIndex = comp.zIndex ?? i;
        comp.fills = comp.fills ?? [{ type: "solid", color: "#E8E5E0", opacity: 100 }];
        comp.strokes = comp.strokes ?? [];
        comp.effects = comp.effects ?? [];
        comp.cornerRadius = comp.cornerRadius ?? 0;
        comp.opacity = comp.opacity ?? 100;
        comp.rotation = comp.rotation ?? 0;
        comp.locked = comp.locked ?? false;
        comp.visible = comp.visible ?? true;
      });
    });
    setData(enriched);
    setCurrentScreenId(templateData.navigation?.initialScreen || Object.keys(templateData.screens)[0]);
    setSelectedIds([]);
  }, [pushUndo]);

  const updateFills = useCallback((id, fills) => {
    updateData(d => {
      const comp = d.screens[currentScreenId]?.components.find(c => c.id === id);
      if (comp) comp.fills = fills;
    });
  }, [updateData, currentScreenId]);

  const updateStrokes = useCallback((id, strokes) => {
    updateData(d => {
      const comp = d.screens[currentScreenId]?.components.find(c => c.id === id);
      if (comp) comp.strokes = strokes;
    });
  }, [updateData, currentScreenId]);

  const updateEffects = useCallback((id, effects) => {
    updateData(d => {
      const comp = d.screens[currentScreenId]?.components.find(c => c.id === id);
      if (comp) comp.effects = effects;
    });
  }, [updateData, currentScreenId]);

  const updateRotation = useCallback((id, rotation) => {
    updateData(d => {
      const comp = d.screens[currentScreenId]?.components.find(c => c.id === id);
      if (comp) comp.rotation = rotation;
    });
  }, [updateData, currentScreenId]);

  const updateOpacity = useCallback((id, opacity) => {
    updateData(d => {
      const comp = d.screens[currentScreenId]?.components.find(c => c.id === id);
      if (comp) comp.opacity = Math.max(0, Math.min(1, opacity));
    });
  }, [updateData, currentScreenId]);

  const alignLeft = useCallback(() => {
    const comps = screen?.components || [];
    const ids = selectedIds.length > 0 ? selectedIds : [];
    if (ids.length < 2) return;
    const target = Math.min(...ids.map(id => comps.find(c => c.id === id)?.x ?? Infinity));
    updateData(d => {
      const cs = d.screens[currentScreenId]?.components;
      if (!cs) return;
      ids.forEach(id => {
        const c = cs.find(x => x.id === id);
        if (c) c.x = target;
      });
    });
  }, [screen, selectedIds, updateData, currentScreenId]);

  const alignCenter = useCallback(() => {
    const comps = screen?.components || [];
    const ids = selectedIds.length > 0 ? selectedIds : [];
    if (ids.length < 2) return;
    const min = Math.min(...ids.map(id => comps.find(c => c.id === id)?.x ?? Infinity));
    const max = Math.max(...ids.map(id => (comps.find(c => c.id === id)?.x ?? 0) + (comps.find(c => c.id === id)?.width ?? 0)));
    const center = (min + max) / 2;
    updateData(d => {
      const cs = d.screens[currentScreenId]?.components;
      if (!cs) return;
      ids.forEach(id => {
        const c = cs.find(x => x.id === id);
        if (c) c.x = center - c.width / 2;
      });
    });
  }, [screen, selectedIds, updateData, currentScreenId]);

  const alignRight = useCallback(() => {
    const comps = screen?.components || [];
    const ids = selectedIds.length > 0 ? selectedIds : [];
    if (ids.length < 2) return;
    const target = Math.max(...ids.map(id => (comps.find(c => c.id === id)?.x ?? 0) + (comps.find(c => c.id === id)?.width ?? 0)));
    updateData(d => {
      const cs = d.screens[currentScreenId]?.components;
      if (!cs) return;
      ids.forEach(id => {
        const c = cs.find(x => x.id === id);
        if (c) c.x = target - c.width;
      });
    });
  }, [screen, selectedIds, updateData, currentScreenId]);

  const alignTop = useCallback(() => {
    const comps = screen?.components || [];
    const ids = selectedIds.length > 0 ? selectedIds : [];
    if (ids.length < 2) return;
    const target = Math.min(...ids.map(id => comps.find(c => c.id === id)?.y ?? Infinity));
    updateData(d => {
      const cs = d.screens[currentScreenId]?.components;
      if (!cs) return;
      ids.forEach(id => {
        const c = cs.find(x => x.id === id);
        if (c) c.y = target;
      });
    });
  }, [screen, selectedIds, updateData, currentScreenId]);

  const alignMiddle = useCallback(() => {
    const comps = screen?.components || [];
    const ids = selectedIds.length > 0 ? selectedIds : [];
    if (ids.length < 2) return;
    const min = Math.min(...ids.map(id => comps.find(c => c.id === id)?.y ?? Infinity));
    const max = Math.max(...ids.map(id => (comps.find(c => c.id === id)?.y ?? 0) + (comps.find(c => c.id === id)?.height ?? 0)));
    const mid = (min + max) / 2;
    updateData(d => {
      const cs = d.screens[currentScreenId]?.components;
      if (!cs) return;
      ids.forEach(id => {
        const c = cs.find(x => x.id === id);
        if (c) c.y = mid - c.height / 2;
      });
    });
  }, [screen, selectedIds, updateData, currentScreenId]);

  const alignBottom = useCallback(() => {
    const comps = screen?.components || [];
    const ids = selectedIds.length > 0 ? selectedIds : [];
    if (ids.length < 2) return;
    const target = Math.max(...ids.map(id => (comps.find(c => c.id === id)?.y ?? 0) + (comps.find(c => c.id === id)?.height ?? 0)));
    updateData(d => {
      const cs = d.screens[currentScreenId]?.components;
      if (!cs) return;
      ids.forEach(id => {
        const c = cs.find(x => x.id === id);
        if (c) c.y = target - c.height;
      });
    });
  }, [screen, selectedIds, updateData, currentScreenId]);

  const distributeH = useCallback(() => {
    const comps = screen?.components || [];
    const ids = selectedIds.length > 0 ? selectedIds : [];
    if (ids.length < 3) return;
    const sorted = ids.map(id => comps.find(c => c.id === id)).filter(Boolean).sort((a, b) => a.x - b.x);
    const totalW = sorted.reduce((s, c) => s + c.width, 0);
    const startX = sorted[0].x;
    const endX = sorted[sorted.length - 1].x + sorted[sorted.length - 1].width;
    const gap = (endX - startX - totalW) / (sorted.length - 1);
    updateData(d => {
      const cs = d.screens[currentScreenId]?.components;
      if (!cs) return;
      let cx = startX;
      sorted.forEach(c => {
        const comp = cs.find(x => x.id === c.id);
        if (comp) { comp.x = cx; cx += comp.width + gap; }
      });
    });
  }, [screen, selectedIds, updateData, currentScreenId]);

  const distributeV = useCallback(() => {
    const comps = screen?.components || [];
    const ids = selectedIds.length > 0 ? selectedIds : [];
    if (ids.length < 3) return;
    const sorted = ids.map(id => comps.find(c => c.id === id)).filter(Boolean).sort((a, b) => a.y - b.y);
    const totalH = sorted.reduce((s, c) => s + c.height, 0);
    const startY = sorted[0].y;
    const endY = sorted[sorted.length - 1].y + sorted[sorted.length - 1].height;
    const gap = (endY - startY - totalH) / (sorted.length - 1);
    updateData(d => {
      const cs = d.screens[currentScreenId]?.components;
      if (!cs) return;
      let cy = startY;
      sorted.forEach(c => {
        const comp = cs.find(x => x.id === c.id);
        if (comp) { comp.y = cy; cy += comp.height + gap; }
      });
    });
  }, [screen, selectedIds, updateData, currentScreenId]);

  const nudge = useCallback((dx, dy) => {
    if (selectedIds.length === 0) return;
    updateData(d => {
      const cs = d.screens[currentScreenId]?.components;
      if (!cs) return;
      selectedIds.forEach(id => {
        const c = cs.find(x => x.id === id);
        if (c) { c.x = Math.max(0, c.x + dx); c.y = Math.max(0, c.y + dy); }
      });
    });
  }, [selectedIds, updateData, currentScreenId]);

  const toggleVisible = useCallback((id) => {
    updateData(d => {
      const comp = d.screens[currentScreenId]?.components.find(c => c.id === id);
      if (comp) comp.visible = !comp.visible;
    });
  }, [updateData, currentScreenId]);

  const toggleLocked = useCallback((id) => {
    updateData(d => {
      const comp = d.screens[currentScreenId]?.components.find(c => c.id === id);
      if (comp) comp.locked = !comp.locked;
    });
  }, [updateData, currentScreenId]);

  const groupComponents = useCallback((ids) => {
    if (ids.length < 2) return;
    updateData(d => {
      const comps = d.screens[currentScreenId]?.components;
      if (!comps) return;
      const groupId = genId();
      const minX = Math.min(...ids.map(id => comps.find(c => c.id === id)?.x ?? 0));
      const minY = Math.min(...ids.map(id => comps.find(c => c.id === id)?.y ?? 0));
      const maxX = Math.max(...ids.map(id => (comps.find(c => c.id === id)?.x ?? 0) + (comps.find(c => c.id === id)?.width ?? 0)));
      const maxY = Math.max(...ids.map(id => (comps.find(c => c.id === id)?.y ?? 0) + (comps.find(c => c.id === id)?.height ?? 0)));
      ids.forEach(id => {
        const c = comps.find(x => x.id === id);
        if (c) c.groupId = groupId;
      });
      comps.push({
        id: groupId, type: "rectangle", x: minX, y: minY,
        width: maxX - minX, height: maxY - minY,
        props: {}, style: {}, locked: false, visible: true,
        zIndex: comps.length, isGroup: true, groupChildIds: ids,
        fills: [{ type: "solid", color: "rgba(96,165,250,0.08)" }],
        strokes: [{ color: "#60A5FA", width: 1 }],
        opacity: 1,
      });
    });
    setSelectedIds([]);
  }, [updateData, currentScreenId]);

  const ungroupComponents = useCallback((id) => {
    updateData(d => {
      const comps = d.screens[currentScreenId]?.components;
      if (!comps) return;
      const group = comps.find(c => c.id === id);
      if (!group || !group.isGroup) return;
      comps.forEach(c => {
        if (group.groupChildIds?.includes(c.id)) c.groupId = undefined;
      });
      d.screens[currentScreenId].components = comps.filter(c => c.id !== id);
    });
  }, [updateData, currentScreenId]);

  const [copiedStyles, setCopiedStyles] = useState(null);
  const [assets, setAssets] = useState([]);

  const addToken = useCallback((type, value) => {
    updateData(d => {
      if (!d.tokens) d.tokens = { colors: [], textStyles: [], effects: [] };
      const token = {
        id: `token_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        type, value, name: value.name || `Style ${(d.tokens[type]?.length || 0) + 1}`,
        createdAt: Date.now(),
      };
      if (!d.tokens[type]) d.tokens[type] = [];
      d.tokens[type].push(token);
    });
  }, [updateData]);

  const removeToken = useCallback((type, tokenId) => {
    updateData(d => {
      if (!d.tokens?.[type]) return;
      d.tokens[type] = d.tokens[type].filter(t => t.id !== tokenId);
    });
  }, [updateData]);

  const applyToken = useCallback((compId, tokenType, tokenId) => {
    updateData(d => {
      const comp = d.screens[currentScreenId]?.components.find(c => c.id === compId);
      if (!comp || !d.tokens?.[tokenType]) return;
      const token = d.tokens[tokenType].find(t => t.id === tokenId);
      if (!token) return;
      if (tokenType === "colors") {
        comp.fills = [{ type: "solid", color: token.value.color, opacity: token.value.opacity ?? 100 }];
      }
    });
  }, [updateData, currentScreenId]);

  const setLayout = useCallback((id, layout) => {
    updateData(d => {
      const comp = d.screens[currentScreenId]?.components.find(c => c.id === id);
      if (!comp) return;
      Object.assign(comp, layout);
      // Auto-layout children
      if (layout.layoutMode && layout.layoutMode !== "none") {
        const children = (d.screens[currentScreenId]?.components || []).filter(c => c.groupId === id).sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
        const gap = layout.layoutGap ?? 8;
        const pad = layout.layoutPadding ?? 0;
        let cx = pad, cy = pad;
        children.forEach(child => {
          if (layout.layoutDirection === "horizontal") {
            child.x = comp.x + cx;
            child.y = comp.y + pad;
            cx += child.width + gap;
          } else {
            child.x = comp.x + pad;
            child.y = comp.y + cy;
            cy += child.height + gap;
          }
        });
      }
    });
  }, [updateData, currentScreenId]);

  const saveToLibrary = useCallback((id) => {
    const comp = screen?.components.find(c => c.id === id);
    if (!comp) return;
    updateData(d => {
      if (!d.componentLibrary) d.componentLibrary = [];
      d.componentLibrary.push({
        id: `lib_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        name: comp.name || comp.type,
        type: comp.type,
        savedAt: Date.now(),
        component: JSON.parse(JSON.stringify(comp)),
      });
    });
  }, [screen, updateData]);

  const removeFromLibrary = useCallback((libId) => {
    updateData(d => {
      if (!d.componentLibrary) return;
      d.componentLibrary = d.componentLibrary.filter(item => item.id !== libId);
    });
  }, [updateData]);

  const copyStyles = useCallback((ids) => {
    const comps = screen?.components || [];
    const first = comps.find(c => c.id === ids[0]);
    if (!first) return;
    setCopiedStyles({
      fills: JSON.parse(JSON.stringify(first.fills)),
      strokes: JSON.parse(JSON.stringify(first.strokes)),
      effects: JSON.parse(JSON.stringify(first.effects)),
      cornerRadius: first.cornerRadius,
      opacity: first.opacity,
    });
  }, [screen]);

  const pasteStyles = useCallback((ids) => {
    if (!copiedStyles) return;
    updateData(d => {
      const comps = d.screens[currentScreenId]?.components;
      if (!comps) return;
      ids.forEach(id => {
        const c = comps.find(x => x.id === id);
        if (c) {
          c.fills = JSON.parse(JSON.stringify(copiedStyles.fills));
          c.strokes = JSON.parse(JSON.stringify(copiedStyles.strokes));
          c.effects = JSON.parse(JSON.stringify(copiedStyles.effects));
          c.cornerRadius = copiedStyles.cornerRadius;
          c.opacity = copiedStyles.opacity;
        }
      });
    });
  }, [copiedStyles, updateData, currentScreenId]);

  const addAsset = useCallback((file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const asset = {
          id: `asset_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          name: file.name,
          url: reader.result,
          type: file.type,
          size: file.size,
        };
        setAssets(prev => [...prev, asset]);
        resolve(asset);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const removeAsset = useCallback((id) => {
    setAssets(prev => prev.filter(a => a.id !== id));
  }, []);

  const getDrawingCursor = useCallback(() => {
    switch (activeTool) {
      case "rectangle": return "crosshair";
      case "ellipse": return "crosshair";
      case "text": return "text";
      case "line": return "crosshair";
      case "arrow": return "crosshair";
      case "hand": return "grab";
      default: return "default";
    }
  }, [activeTool]);

  return {
    data, currentScreenId, setCurrentScreenId,
    screen, selectedIds, select, selectAll, clearSelection,
    addScreen, removeScreen, renameScreen,
    addComponent, addPrimitive, updateComponent, removeComponents, duplicateComponents,
    moveLayer, updateProp, updateStyle,
    updateFills, updateStrokes, updateEffects, updateRotation, updateOpacity,
    setMeta, setNavigation,
    undo, redo, canUndo: undoStack.current.length > 0, canRedo: redoStack.current.length > 0,
    clipboard, setClipboard, activeTool, setActiveTool, getDrawingCursor,
    getDesignJSON, loadTemplate,
    alignLeft, alignCenter, alignRight, alignTop, alignMiddle, alignBottom,
    distributeH, distributeV, nudge,
    toggleVisible, toggleLocked, groupComponents, ungroupComponents,
    setLayout,
    addToken, removeToken, applyToken,
    saveToLibrary, removeFromLibrary,
    copyStyles, pasteStyles, copiedStyles,
    assets, addAsset, removeAsset,
  };
}
