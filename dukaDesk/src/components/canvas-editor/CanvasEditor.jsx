import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Canvas from "./Canvas";
import Toolbar from "./Toolbar";
import ComponentPalette from "./ComponentPalette";
import ScreenManager from "./ScreenManager";
import PropertiesPanel from "./PropertiesPanel";
import LayersPanel from "./LayersPanel";
import PhonePreview from "./PhonePreview";
import InlineTextEditor from "./InlineTextEditor";
import AlignmentToolbar from "./AlignmentToolbar";
import CanvasRulers from "./CanvasRulers";
import ContextMenu from "./ContextMenu";
import HistoryPanel from "./HistoryPanel";
import ShortcutsHelp from "./ShortcutsHelp";
import ExportMenu from "./ExportMenu";
import { useDesignStore } from "./DesignStore";
import { getComponentType } from "./componentTypes";
import templateDefaults from "./templateDefaults";

export default function CanvasEditor() {
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [showCategoryPicker, setShowCategoryPicker] = useState(true);

  const store = useDesignStore(null);
  const [editingTextId, setEditingTextId] = useState(null);
  const [guides, setGuides] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [prototyping, setPrototyping] = useState(false);

  const handleStartTextEdit = useCallback((id) => {
    setEditingTextId(id);
  }, []);

  const handleEndTextEdit = useCallback(() => {
    setEditingTextId(null);
  }, []);

  const handleSelectCategory = useCallback((cat) => {
    setCategory(cat);
    setShowCategoryPicker(false);
    const defaults = templateDefaults[cat];
    if (defaults) {
      store.loadTemplate(defaults);
    }
  }, [store]);

  const handleContextAction = useCallback((action) => {
    switch (action) {
      case "delete": store.removeComponents(store.selectedIds); break;
      case "duplicate": store.duplicateComponents(store.selectedIds); break;
      case "group": store.groupComponents(store.selectedIds); break;
      case "ungroup": store.ungroupComponents(store.selectedIds[0]); break;
      case "lock": store.selectedIds.forEach(id => store.toggleLocked(id)); break;
      case "hide": store.selectedIds.forEach(id => store.toggleVisible(id)); break;
      case "bringForward": store.selectedIds.forEach(id => store.moveLayer(id, "up")); break;
      case "sendBackward": store.selectedIds.forEach(id => store.moveLayer(id, "down")); break;
      case "copy": store.setClipboard(store.selectedIds); break;
      case "paste": if (store.clipboard?.length > 0) store.duplicateComponents(store.clipboard); break;
      case "cut": store.setClipboard(store.selectedIds); store.removeComponents(store.selectedIds); break;
      case "copyStyles": store.copyStyles(store.selectedIds); break;
      case "pasteStyles": store.pasteStyles(store.selectedIds); break;
      case "saveToLibrary": store.saveToLibrary(store.selectedIds[0]); break;
    }
  }, [store]);

  const handleCanvasContextMenu = useCallback((e) => {
    e.preventDefault();
    const hasSelection = store.selectedIds.length > 0;
    const isGroup = hasSelection && store.selectedIds.length === 1 &&
      store.screen?.components.find(c => c.id === store.selectedIds[0])?.isGroup;
    setContextMenu({ x: e.clientX, y: e.clientY, hasSelection, isGroup });
  }, [store]);

  useEffect(() => {
    window.__canvasGuideDrag = (orientation, position) => {
      setGuides(prev => [...prev, { orientation, position }]);
    };
    return () => { delete window.__canvasGuideDrag; };
  }, []);

  const handleAlign = useCallback((action) => {
    const alignMap = {
      alignLeft: store.alignLeft, alignCenter: store.alignCenter, alignRight: store.alignRight,
      alignTop: store.alignTop, alignMiddle: store.alignMiddle, alignBottom: store.alignBottom,
      distributeH: store.distributeH, distributeV: store.distributeV,
    };
    alignMap[action]?.();
  }, [store]);

  const handleKeyDown = useCallback((e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT") return;
    if (e.key === "Delete" || e.key === "Backspace") {
      if (store.selectedIds.length > 0) store.removeComponents(store.selectedIds);
    }
    if (e.ctrlKey || e.metaKey) {
      if (e.key === "z" && !e.shiftKey) { e.preventDefault(); store.undo(); }
      if (e.key === "z" && e.shiftKey) { e.preventDefault(); store.redo(); }
      if (e.key === "d") { e.preventDefault(); if (store.selectedIds.length > 0) store.duplicateComponents(store.selectedIds); }
      if (e.key === "a") { e.preventDefault(); store.selectAll(); }
      if (e.key === "c" && !e.shiftKey) { e.preventDefault(); store.setClipboard(store.selectedIds); }
      if (e.key === "c" && e.shiftKey) { e.preventDefault(); if (store.selectedIds.length > 0) store.copyStyles(store.selectedIds); }
      if (e.key === "v" && !e.shiftKey) { e.preventDefault(); if (store.clipboard && store.clipboard.length > 0) store.duplicateComponents(store.clipboard); }
      if (e.key === "v" && e.shiftKey) { e.preventDefault(); if (store.selectedIds.length > 0) store.pasteStyles(store.selectedIds); }
    }
    if (e.key === "?") {
      setShowShortcuts(prev => !prev);
    }
    if (e.key === "Escape") {
      store.clearSelection();
      store.setActiveTool("select");
      setShowShortcuts(false);
    }
    if (e.key.startsWith("Arrow")) {
      if (store.selectedIds.length === 0) return;
      e.preventDefault();
      const step = e.shiftKey ? 10 : 1;
      const dx = e.key === "ArrowRight" ? step : e.key === "ArrowLeft" ? -step : 0;
      const dy = e.key === "ArrowDown" ? step : e.key === "ArrowUp" ? -step : 0;
      store.nudge(dx, dy);
    }
  }, [store]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    window.__canvasSetTabs = (tabs) => store.setNavigation({ tabs });
    return () => { delete window.__canvasSetTabs; };
  }, [store]);

  const handleDrop = useCallback((type, x, y, componentData) => {
    if (componentData) {
      const comp = { ...componentData, id: undefined, x, y, zIndex: undefined };
      store.addComponent(type, x, y, { width: comp.width, height: comp.height, props: comp.props || {}, fills: comp.fills, strokes: comp.strokes, effects: comp.effects, cornerRadius: comp.cornerRadius, opacity: comp.opacity });
      return;
    }
    const def = getComponentType(type);
    store.addComponent(type, x, y, def ? { width: def.defaultWidth, height: def.defaultHeight, props: { ...def.defaultProps } } : undefined);
  }, [store]);

  const handleAssetDrop = useCallback((url, x, y) => {
    store.addComponent("image_block", x, y, {
      width: 160, height: 160,
      props: { src: url, alt: "Uploaded image", fit: "cover" },
    });
  }, [store]);

  const handleMove = useCallback((id, x, y) => {
    store.updateComponent(id, { x, y });
  }, [store]);

  const handleResize = useCallback((id, x, y, w, h) => {
    store.updateComponent(id, { x, y, width: w, height: h });
  }, [store]);

  const handleAddPrimitive = useCallback((type, x, y, w, h, defaults) => {
    const def = getComponentType(type);
    store.addPrimitive(type, x, y, w, h, defaults || (def ? { width: def.defaultWidth, height: def.defaultHeight, props: { ...def.defaultProps } } : undefined));
  }, [store]);

  const selectedComponent = store.selectedIds.length === 1
    ? store.screen?.components.find(c => c.id === store.selectedIds[0])
    : null;
  const selectedComps = store.selectedIds.length > 1
    ? store.selectedIds.map(id => store.screen?.components.find(c => c.id === id)).filter(Boolean)
    : [];

  if (showCategoryPicker) {
    return (
      <div style={{ minHeight: "100vh", background: "#F7F8FA", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: 500 }}>
          <h1 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 32, color: "#0F0F1A", marginBottom: 8 }}>What type of business?</h1>
          <p style={{ color: "#6B7280", marginBottom: 32, fontSize: 15 }}>Choose a category to start with pre-built screens</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {Object.keys(templateDefaults).map(cat => (
              <button
                key={cat}
                onClick={() => handleSelectCategory(cat)}
                style={{
                  padding: "16px 20px", borderRadius: 12, border: "2px solid #E5E7EB",
                  background: "#fff", cursor: "pointer", textAlign: "left",
                  fontFamily: "'Inter',sans-serif", transition: "all 0.1s",
                  fontSize: 15, fontWeight: 600, color: "#0F0F1A",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#F4A026"; e.currentTarget.style.background = "#FFF8ED"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.background = "#fff"; }}
              >
                {templateDefaults[cat]?.meta?.emoji || "📱"} {cat}
              </button>
            ))}
          </div>
          <button
            onClick={() => handleSelectCategory("Custom")}
            style={{ marginTop: 20, background: "none", border: "none", color: "#6B7280", cursor: "pointer", fontSize: 14, textDecoration: "underline" }}
          >
            Or start from scratch →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#F7F8FA" }}>
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 16px", background: "#fff", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => navigate("/dashboard")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#6B7280" }}>&larr;</button>
          <input
            value={store.data.meta.appName}
            onChange={e => store.setMeta({ appName: e.target.value })}
            placeholder="App Name"
            style={{ border: "none", outline: "none", fontSize: 16, fontWeight: 700, fontFamily: "'Sora',sans-serif", color: "#0F0F1A", background: "transparent", width: 200 }}
          />
          <span style={{ fontSize: 12, color: "#9CA3AF" }}>{category}</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <AlignmentToolbar onAlign={handleAlign} hasMultiSelection={store.selectedIds.length > 1} />
          <button onClick={() => { store.undo(); }} style={topBtn} title="Undo">↩ Undo</button>
          <button onClick={() => { store.redo(); }} style={topBtn} title="Redo">↪ Redo</button>
          <HistoryPanel onUndo={store.undo} onRedo={store.redo} canUndo={store.canUndo} canRedo={store.canRedo} />
          <ExportMenu designJSON={store.getDesignJSON()} />
          <button
            onClick={() => setPrototyping(!prototyping)}
            style={{
              ...topBtn,
              background: prototyping ? "#FFF8ED" : "#fff",
              borderColor: prototyping ? "#F4A026" : "#E5E7EB",
              color: prototyping ? "#6B4200" : "#374151",
            }}
          >▶ {prototyping ? "Stop Prototype" : "Prototype"}</button>
          <button
            style={{ background: "#F4A026", color: "#1C1B1D", border: "none", borderRadius: 8, padding: "8px 20px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'Inter',sans-serif" }}
          >Publish</button>
        </div>
      </div>

      {/* Main area */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <Toolbar activeTool={store.activeTool} onSetTool={store.setActiveTool} />
        <ComponentPalette
          assets={store.assets}
          onAddAsset={store.addAsset}
          onRemoveAsset={store.removeAsset}
          componentLibrary={store.data.componentLibrary}
          onRemoveFromLibrary={store.removeFromLibrary}
          tokens={store.data.tokens}
        />
        <ScreenManager
          data={store.data}
          currentScreenId={store.currentScreenId}
          setCurrentScreenId={store.setCurrentScreenId}
          addScreen={store.addScreen}
          removeScreen={store.removeScreen}
          renameScreen={store.renameScreen}
        />
        <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
            <CanvasRulers
              zoom={1}
              pan={{ x: 0, y: 0 }}
              screenWidth={store.screen?.width || 390}
              screenHeight={store.screen?.height || 844}
              guides={guides}
              onRemoveGuide={(i) => setGuides(prev => prev.filter((_, idx) => idx !== i))}
            />
            <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>
              <div onContextMenu={handleCanvasContextMenu} style={{ width: "100%", height: "100%" }}>
                <Canvas
                  screen={store.screen}
                  selectedIds={store.selectedIds}
                  onSelect={store.select}
                  onMove={handleMove}
                  onResize={handleResize}
                  onDrop={handleDrop}
                  onAssetDrop={handleAssetDrop}
                  clearSelection={store.clearSelection}
                  activeTool={store.activeTool}
                  onAddPrimitive={handleAddPrimitive}
                  onSetTool={store.setActiveTool}
                  onDoubleClick={handleStartTextEdit}
                />
              </div>
              {editingTextId && store.screen && (() => {
                const comp = store.screen.components.find(c => c.id === editingTextId);
                if (!comp || comp.type !== "text_block") return null;
                return (
                  <InlineTextEditor
                    component={comp}
                    onUpdateProp={store.updateProp}
                    onEndEdit={handleEndTextEdit}
                  />
                );
              })()}
            </div>
          </div>
          <PropertiesPanel
          selectedComponent={selectedComponent}
          selectedComps={selectedComps}
          onUpdateProp={store.updateProp}
          onUpdateStyle={store.updateStyle}
          onUpdateComponent={store.updateComponent}
          onUpdateFills={store.updateFills}
          onUpdateStrokes={store.updateStrokes}
          onUpdateEffects={store.updateEffects}
          onUpdateRotation={store.updateRotation}
          onUpdateOpacity={store.updateOpacity}
          onSetLayout={store.setLayout}
          onAddToken={store.addToken}
        />
        <PhonePreview
          data={store.data}
          currentScreenId={store.currentScreenId}
          setCurrentScreenId={store.setCurrentScreenId}
          prototyping={prototyping}
        />
      </div>

      <LayersPanel
        screen={store.screen}
        selectedIds={store.selectedIds}
        onSelect={store.select}
        onMoveLayer={store.moveLayer}
        onRemoveComponents={store.removeComponents}
        onDuplicateComponents={store.duplicateComponents}
        onToggleVisible={store.toggleVisible}
        onToggleLocked={store.toggleLocked}
        onGroup={store.groupComponents}
        onUngroup={store.ungroupComponents}
        onRename={(id, name) => store.updateComponent(id, { name })}
      />

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          hasSelection={contextMenu.hasSelection}
          isGroup={contextMenu.isGroup}
          onAction={handleContextAction}
          onClose={() => setContextMenu(null)}
        />
      )}
      {showShortcuts && <ShortcutsHelp onClose={() => setShowShortcuts(false)} />}
    </div>
  );
}

const topBtn = {
  padding: "6px 12px", borderRadius: 6, border: "1px solid #E5E7EB",
  background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600,
  color: "#374151", fontFamily: "'Inter',sans-serif",
};
