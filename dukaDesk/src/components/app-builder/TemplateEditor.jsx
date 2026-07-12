import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Eye, Code, Layers, Palette, RotateCcw, Download, Upload, Undo, Redo, ChevronLeft, ChevronRight, MousePointer, GripVertical, Trash2, Edit3, Copy, Plus, X } from "lucide-react";
import { AMBER, NAVY, cardStyle, btnPrimary, btnSecondary } from "../../theme";
import { TemplateRenderer, TemplateScreenList, loadAllTemplateScreens, loadTemplateManifest } from "./TemplateRenderer";
import { ComponentPalette } from "./DragDropEditor";
import { NAVY as NAVY_COLOR, AMBER as AMBER_COLOR } from "../../theme";

const DEFAULT_SCREEN_NODES = {
  hero_banner: { type: "hero_banner", key: "hero", props: { title: "Welcome", subtitle: "Discover our menu" }, actions: {} },
  category_pills: { type: "category_pills", key: "categories", props: { categories: ["Popular", "Mains", "Drinks"] }, actions: { selectCategory: { type: "filter", payload: { source: "category" } } } },
  menu_grid: { type: "menu_grid", key: "items", props: { columns: 2 }, actions: { addItem: { type: "add_to_cart" }, viewDetails: { type: "navigate", payload: { push: "/item-detail" } } } },
  order_history: { type: "order_history", key: "orders", props: { showStatus: true }, actions: { selectOrder: { type: "navigate", payload: { push: "/order-detail" } } } },
  info_list: { type: "info_list", key: "contact", props: { items: [] }, actions: { call: { type: "call_phone", payload: { phone: "" } }, email: { type: "email", payload: { to: "" } } } },
  report_action: { type: "report_action", key: "report", props: { title: "Report an Issue" }, actions: { submit: { type: "submit_form", payload: {} } } },
  notification_list: { type: "notification_list", key: "notifications", props: { notifications: [] }, actions: { tap: { type: "navigate", payload: { push: "/notification" } } } },
  primary_button: { type: "primary_button", key: "cta", props: { label: "Action" }, actions: { default: { type: "navigate", payload: { push: "/target" } } } },
  calendar_strip: { type: "calendar_strip", key: "dates", props: { minDate: "today", maxDate: "+30" }, actions: { selectDate: { type: "filter", payload: { source: "date" } } } },
  slot_grid: { type: "slot_grid", key: "slots", props: { duration: 60 }, actions: { selectSlot: { type: "filter", payload: { source: "slot" } } } },
  booking_summary: { type: "booking_summary", key: "summary", props: {}, actions: { confirm: { type: "api_request", payload: { method: "POST", path: "/bookings" } } } },
  cart_summary: { type: "cart_summary", key: "cart", props: {}, actions: { checkout: { type: "checkout" }, removeItem: { type: "remove_from_cart" } } },
  address_form: { type: "address_form", key: "address", props: {}, actions: { submit: { type: "submit_form", payload: {} } } },
  promotion_list: { type: "promotion_list", key: "promos", props: { offers: [] }, actions: { tap: { type: "navigate", payload: { push: "/offer" } } } },
  section_header: { type: "section_header", key: "section-title", props: {}, actions: {} },
};

export default function TemplateEditor({ templateId }) {
  const navigate = useNavigate();
  const [manifest, setManifest] = useState(null);
  const [screens, setScreens] = useState({});
  const [currentScreenId, setCurrentScreenId] = useState(null);
  const [screenNodes, setScreenNodes] = useState({});
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedNodeIndex, setSelectedNodeIndex] = useState(-1);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showCode, setShowCode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  const [editSidebar, setEditSidebar] = useState(false);

  const saveToHistory = useCallback((newNodes) => {
    setHistory(prev => {
      const next = prev.slice(0, historyIndex + 1);
      next.push(JSON.parse(JSON.stringify(newNodes)));
      if (next.length > 50) next.shift();
      return next;
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [historyIndex]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [m, { screens: scr }] = await Promise.all([
          loadTemplateManifest(templateId),
          loadAllTemplateScreens(templateId),
        ]);
        setManifest(m);
        setScreens(scr);
        const firstScreenId = m?.navigation?.tabs?.[0]?.screenId || Object.keys(scr)[0];
        setCurrentScreenId(firstScreenId);
        
        const initialNodes = {};
        Object.entries(scr).forEach(([id, def]) => {
          if (def.layout) {
            const extractNodes = (layout) => {
              const nodes = [];
              const traverse = (node) => {
                if (node.kind) {
                  node.children?.forEach(traverse);
                } else {
                  nodes.push(node);
                }
              };
              traverse(layout);
              return nodes;
            };
            initialNodes[id] = extractNodes(def.layout);
          } else if (def.children) {
            initialNodes[id] = def.children;
          } else {
            initialNodes[id] = [];
          }
        });
        setScreenNodes(initialNodes);
        saveToHistory(initialNodes);
      } catch (err) {
        console.error("Failed to load template:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [templateId]);

  const nodes = screenNodes[currentScreenId] || [];

  const handleAddComponent = (type) => {
    const newNode = DEFAULT_SCREEN_NODES[type] || { type, key: `${type}-${Date.now()}`, props: {}, actions: {} };
    const newNodes = { ...screenNodes, [currentScreenId]: [...nodes, { ...newNode, key: `${newNode.key}-${nodes.length}` }] };
    setScreenNodes(newNodes);
    saveToHistory(newNodes);
  };

  const handleMove = (fromIndex, toIndex) => {
    const newArr = [...nodes];
    const [moved] = newArr.splice(fromIndex, 1);
    newArr.splice(toIndex, 0, moved);
    const newNodes = { ...screenNodes, [currentScreenId]: newArr };
    setScreenNodes(newNodes);
    saveToHistory(newNodes);
  };

  const handleDelete = (index) => {
    const newArr = nodes.filter((_, i) => i !== index);
    const newNodes = { ...screenNodes, [currentScreenId]: newArr };
    setScreenNodes(newNodes);
    if (selectedNodeIndex === index) setSelectedNode(null);
    saveToHistory(newNodes);
  };

  const handleDuplicate = (node) => {
    const newNodes = { ...screenNodes, [currentScreenId]: [...nodes, { ...node, key: `${node.key}-copy-${Date.now()}` }] };
    setScreenNodes(newNodes);
    saveToHistory(newNodes);
  };

  const handleUpdateNode = (updatedNode) => {
    const newArr = nodes.map((n, i) => i === selectedNodeIndex ? updatedNode : n);
    const newNodes = { ...screenNodes, [currentScreenId]: newArr };
    setScreenNodes(newNodes);
    setSelectedNode(updatedNode);
    saveToHistory(newNodes);
  };

  const handleSelect = (node, index) => {
    setSelectedNode(node);
    setSelectedNodeIndex(index);
    setEditSidebar(true);
  };

  const handleScreenChange = (screenId) => {
    setCurrentScreenId(screenId);
    setSelectedNode(null);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setScreenNodes(prev);
      setHistoryIndex(prev => prev - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setScreenNodes(next);
      setHistoryIndex(prev => prev + 1);
    }
  };

  const exportJSON = () => {
    const exportData = {
      templateId,
      manifest,
      screens: screenNodes,
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${templateId}-template.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderCanvas = () => {
    if (previewMode) {
      return (
        <TemplateRenderer
          templateId={templateId}
          screenId={currentScreenId}
          onAction={(actionKey, payload) => console.log("Preview action:", actionKey, payload)}
        />
      );
    }

    return (
      <div style={{ flex: 1, overflow: "auto", padding: 16, background: "#F3F4F6", borderRadius: 12 }}>
        {nodes.length === 0 ? (
          <div
            onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = "copy"; }}
            onDrop={e => { e.preventDefault(); const type = e.dataTransfer.getData("component-type"); if (type) handleAddComponent(type); }}
            style={{ textAlign: "center", minHeight: 200, border: "2px dashed #D1D5DB", borderRadius: 12, padding: 40, background: "#fff" }}
          >
            <Layers size={48} style={{ marginBottom: 12, opacity: 0.5, color: "#9CA3AF" }} />
            <div style={{ fontWeight: 600, marginBottom: 4, color: "#374151" }}>Empty Screen</div>
            <div style={{ fontSize: 13, color: "#9CA3AF" }}>Drag components from the palette or click to add</div>
          </div>
        ) : (
          <>
            {nodes.map((node, i) => (
              <DraggableComponent
                key={i}
                node={node}
                index={i}
                isSelected={selectedNodeIndex === i}
                onSelect={handleSelect}
                onMove={handleMove}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
                onEditProps={handleSelect}
              >
                <div style={{ padding: 12, background: "#F9FAFB", borderRadius: 6, border: "1px solid #E5E7EB", fontSize: 12, fontFamily: "monospace", color: "#6B7280" }}>
                  {node.type}: {node.key}
                </div>
              </DraggableComponent>
            ))}
            <div
              onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = "copy"; }}
              onDrop={e => { e.preventDefault(); const type = e.dataTransfer.getData("component-type"); if (type) handleAddComponent(type); }}
              style={{ textAlign: "center", padding: 20, border: "2px dashed #D1D5DB", borderRadius: 12, marginTop: 8, background: "#fff", color: "#9CA3AF" }}
            >
              Drop new component here
            </div>
          </>
        )
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
        Loading template editor...
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#1a1a2e", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "#252547", padding: "12px 24px", display: "flex", gap: 12, alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <button onClick={() => navigate("/wizard")} style={{ background: "none", border: "1px solid #6B7280", color: "#D1D5DB", borderRadius: 8, padding: "8px 14px", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
          <ArrowLeft size={16} /> Back
        </button>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: AMBER, fontWeight: 700, fontSize: 14 }}>{manifest?.name || templateId}</span>
          <span style={{ color: "#6B7280", fontSize: 11 }}>Visual Editor</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={handleUndo} disabled={historyIndex <= 0} style={{ ...btnSecondary, opacity: historyIndex <= 0 ? 0.5 : 1, padding: "8px 12px" }} title="Undo"><Undo size={14} /></button>
          <button onClick={handleRedo} disabled={historyIndex >= history.length - 1} style={{ ...btnSecondary, opacity: historyIndex >= history.length - 1 ? 0.5 : 1, padding: "8px 12px" }} title="Redo"><Redo size={14} /></button>
          <button onClick={exportJSON} style={{ ...btnSecondary, padding: "8px 12px" }} title="Export JSON"><Download size={14} /></button>
          <button onClick={() => setPreviewMode(!previewMode)} style={{ background: previewMode ? AMBER : "transparent", border: previewMode ? "none" : "1px solid #6B7280", color: previewMode ? NAVY : "#D1D5DB", borderRadius: 8, padding: "8px 14px", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
            {previewMode ? <MousePointer size={16} /> : <Eye size={16} />}
            {previewMode ? "Exit Preview" : "Preview"}
          </button>
          <button onClick={() => setShowCode(!showCode)} style={{ ...btnSecondary, padding: "8px 12px" }} title="View JSON"><Code size={14} /></button>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <div style={{ width: 280, background: "#252547", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "12px 16px", background: "#1A1A2E", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 600, color: "#fff", fontSize: 13 }}>Screens</span>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 8 }}>
            {manifest?.navigation?.tabs?.map(tab => (
              <button
                key={tab.screenId}
                onClick={() => handleScreenChange(tab.screenId)}
                style={{ width: "100%", textAlign: "left", padding: "10px 12px", background: currentScreenId === tab.screenId ? "rgba(244,160,38,0.15)" : "transparent", border: "none", borderLeft: currentScreenId === tab.screenId ? `3px solid ${AMBER}` : "3px solid transparent", borderRadius: "0 8px 8px 0", color: currentScreenId === tab.screenId ? AMBER : "#D1D5DB", fontSize: 12, fontWeight: currentScreenId === tab.screenId ? 600 : 400, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all 0.15s" }}
              >
                {tab.icon && <span>{tab.icon}</span>}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#1a1a2e", minWidth: 0 }}>
          <div style={{ background: "#252547", padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>Canvas</span>
            <span style={{ color: "#6B7280", fontSize: 11, marginLeft: "auto" }}>{nodes.length} components</span>
          </div>
          <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
            {renderCanvas()}
          </div>
        </div>

        <ComponentPalette onAddComponent={handleAddComponent} />
      </div>

      {editSidebar && selectedNode && (
        <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: 360, background: "#fff", borderLeft: "1px solid #E5E7EB", boxShadow: "-8px 0 32px rgba(0,0,0,0.12)", zIndex: 100, animation: "slideIn 0.2s ease" }}>
          <style jsx>{`
            @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
          `}</style>
          <div style={{ padding: "16px", borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontWeight: 700, color: NAVY, fontSize: 14, textTransform: "capitalize" }}>{selectedNode.type.replace(/_/g, ' ')}</div>
              <div style={{ fontSize: 11, color: "#9CA3AF" }}>{selectedNode.key}</div>
            </div>
            <button onClick={() => setEditSidebar(false)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#9CA3AF" }}>✕</button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: NAVY, marginBottom: 6 }}>Props (JSON)</label>
              <textarea
                value={JSON.stringify(selectedNode.props || {}, null, 2)}
                onChange={e => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    handleUpdateNode({ ...selectedNode, props: parsed });
                  } catch {}
                }}
                style={{ width: "100%", minHeight: 120, padding: 10, borderRadius: 8, border: "1px solid #E5E7EB", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: NAVY, resize: "vertical", background: "#F9FAFB" }}
                placeholder="{}"
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: NAVY, marginBottom: 6 }}>Actions (JSON)</label>
              <textarea
                value={JSON.stringify(selectedNode.actions || {}, null, 2)}
                onChange={e => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    handleUpdateNode({ ...selectedNode, actions: parsed });
                  } catch {}
                }}
                style={{ width: "100%", minHeight: 100, padding: 10, borderRadius: 8, border: "1px solid #E5E7EB", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: NAVY, resize: "vertical", background: "#F9FAFB" }}
                placeholder="{}"
              />
            </div>
          </div>
          <div style={{ padding: 16, borderTop: "1px solid #E5E7EB" }}>
            <button onClick={() => setEditSidebar(false)} style={{ width: "100%", padding: "12px", background: AMBER, color: NAVY, border: "none", borderRadius: 8, fontWeight: 700, fontSize: 13, fontFamily: "'Sora',sans-serif", cursor: "pointer" }}>
              Done
            </button>
          </div>
        </div>
      )}

      {showCode && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 200, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "16px 24px", background: "#1A1A2E", borderBottom: "1px solid #374151", display: "flex", alignItems: "center", justifyContent: "space-between", color: "#fff" }}>
            <span style={{ fontWeight: 600 }}>Screen JSON — {currentScreenId}</span>
            <button onClick={() => setShowCode(false)} style={{ background: "none", border: "none", color: "#9CA3AF", fontSize: 20, cursor: "pointer" }}>✕</button>
          </div>
          <div style={{ flex: 1, overflow: "auto", padding: 24 }}>
            <pre style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#D1D5DB", background: "#0F0F1A", padding: 20, borderRadius: 8, overflow: "auto", margin: 0 }}>
              {JSON.stringify(screenNodes[currentScreenId] || [], null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

function DraggableComponent({ node, index, isSelected, onSelect, onMove, onDelete, onDuplicate, onEditProps, children }) {
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef(null);

  const handleDragStart = (e) => {
    setDragging(true);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("component-index", index);
    dragRef.current = { node, index };
  };

  const handleDragEnd = () => { setDragging(false); dragRef.current = null; };

  const handleDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; };
  const handleDragLeave = (e) => { const rect = e.currentTarget.getBoundingClientRect(); if (e.clientY <= rect.top || e.clientY >= rect.bottom) {} };
  const handleDrop = (e) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData("component-index"), 10);
    if (sourceIndex !== index && !isNaN(sourceIndex)) onMove(sourceIndex, index);
  };

  const handleClick = (e) => { e.stopPropagation(); onSelect(node, index); };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      style={{
        position: "relative",
        border: isSelected ? `2px solid ${AMBER}` : dragging ? "2px dashed #9CA3AF" : "1px dashed transparent",
        borderRadius: 8,
        background: dragging ? "#F9FAFB" : "transparent",
        transition: "all 0.15s",
        padding: "8px",
        marginBottom: 8,
      }}
    >
      <div style={{ position: "absolute", top: -28, left: -28, width: 24, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, opacity: isSelected || dragging ? 1 : 0, transition: "opacity 0.2s", pointerEvents: "none", zIndex: 10 }}>
        <button onClick={e => { e.stopPropagation(); onMove(index, index - 1); }} disabled={index === 0} style={{ padding: 4, background: NAVY, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} title="Move up"><ChevronLeft size={12} /></button>
        <button onClick={e => { e.stopPropagation(); onMove(index, index + 1); }} style={{ padding: 4, background: NAVY, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} title="Move down"><ChevronRight size={12} /></button>
      </div>
      <div style={{ position: "absolute", top: -36, right: 0, display: "flex", gap: 4, opacity: isSelected ? 1 : 0, transition: "opacity 0.2s", pointerEvents: isSelected ? "auto" : "none" }}>
        <button onClick={e => { e.stopPropagation(); onEditProps(node); }} style={toolbarBtn} title="Edit props"><Edit3 size={12} /></button>
        <button onClick={e => { e.stopPropagation(); onDuplicate(node); }} style={toolbarBtn} title="Duplicate"><Copy size={12} /></button>
        <button onClick={e => { e.stopPropagation(); onDelete(index); }} style={{ ...toolbarBtn, color: "#E74C3C" }} title="Delete"><Trash2 size={12} /></button>
      </div>
      <div style={{ padding: 8, background: "#fff", borderRadius: 6, border: "1px solid #E5E7EB", position: "relative", minHeight: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, fontSize: 11, color: "#9CA3AF" }}>
          <GripVertical size={12} style={{ cursor: "grab" }} />
          <span style={{ fontWeight: 600, color: NAVY, textTransform: "capitalize" }}>{node.type.replace(/_/g, ' ')}</span>
          <span style={{ background: AMBER + "15", color: AMBER, padding: "2px 6px", borderRadius: 4, fontSize: 10 }}>{node.key}</span>
        </div>
        {children}
      </div>
    </div>
  );
}

const toolbarBtn = { padding: 6, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", color: "#374151" };