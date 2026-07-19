import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Store } from "lucide-react";
import { useToast } from "../../contexts";
import { useIsMobile } from "../../hooks/useMediaQuery";
import { NAVY, AMBER, cardStyle } from "../../theme";
import { getIntegrations, toggleIntegration, getMyApp } from "../../services/api";
import { INTEGRATION_BADGE_COLORS, getTemplateIntegrationNames } from "../../services/mockData";
import { Loading, Empty, ErrorState } from "../layout/States";
import IntegrationConfigPanel from "./IntegrationConfigPanel";

const badgeStyle = INTEGRATION_BADGE_COLORS;

export default function Integrations() {
  const showToast = useToast();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [integrations, setIntegrations] = useState([]);
  const [relevantNames, setRelevantNames] = useState(null);
  const [appTemplate, setAppTemplate] = useState(null);
  const [catFilter, setCatFilter] = useState("All");
  const [configPanel, setConfigPanel] = useState(null);
  const [removeConfirm, setRemoveConfirm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadIntegrations = () => {
    setError(null);
    setLoading(true);
    Promise.all([
      getIntegrations(),
      getMyApp().catch(() => null),
    ]).then(([intData, appData]) => {
      const template = appData?.template || null;
      setAppTemplate(template);
      if (template) {
        const names = getTemplateIntegrationNames(template);
        setRelevantNames(new Set(names));
        const filtered = intData.map(cat => ({
          ...cat,
          items: cat.items.filter(item => names.includes(item.name)),
        })).filter(cat => cat.items.length > 0);
        setIntegrations(filtered);
      } else {
        setIntegrations(intData);
      }
    }).catch(() => setError("Failed to load integrations"))
    .finally(() => setLoading(false));
  };
  useEffect(loadIntegrations, []);

  const toggle = async (catIdx, itemIdx) => {
    const item = integrations[catIdx].items[itemIdx];
    if (item.locked) { showToast("Upgrade to Growth plan to unlock Premium integrations", "info"); return; }
    try {
      await toggleIntegration(item.name);
      setIntegrations(prev => prev.map((cat, ci) =>
        ci !== catIdx ? cat : {
          ...cat,
          items: cat.items.map((it, ii) =>
            ii !== itemIdx ? it : { ...it, active: !it.active }
          ),
        }
      ));
      showToast(item.active ? `${item.name} removed` : `${item.name} added to your app!`, item.active ? "info" : "success");
    } catch { showToast("Failed to toggle integration", "error"); }
  };

  const activeItems = integrations.flatMap(cat => cat.items.filter(i => i.active));
  const cats = ["All", ...(integrations.map(c => c.cat))];
  const filtered = catFilter === "All" ? integrations : integrations.filter(c => c.cat === catFilter);

  if (loading) return <Loading message="Loading integrations..." />;
  if (error) return <ErrorState message={error} onRetry={loadIntegrations} />;
  if (integrations.length === 0) return <Empty icon="🔌" message="No integrations available" sub="Integration categories will appear here" />;

  return (
    <div style={{ position: "relative" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: isMobile ? 22 : 28, color: NAVY, margin: "0 0 4px" }}>Integrations</h2>
        <p style={{ color: "#6B7280", margin: 0 }}>Manage the features powering your app. Add or remove anytime.</p>
      </div>

      {appTemplate && (
        <div style={{ background: "#FFF8ED", border: "1px solid #F4A026", borderRadius: 10, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
          <Store size={18} color={AMBER} />
          <div style={{ fontSize: 13, color: "#92400E" }}>
            Showing integrations compatible with your <strong>{appTemplate}</strong> app. {integrations.flatMap(c => c.items).length} available.
          </div>
        </div>
      )}
      {!appTemplate && (
        <div style={{ background: "#EFF6FF", border: "1px solid #93C5FD", borderRadius: 10, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
          <Store size={18} color="#3B82F6" />
          <div style={{ fontSize: 13, color: "#1E40AF" }}>
            Complete the app setup wizard to see integrations tailored to your template. Showing all integrations for now.
          </div>
        </div>
      )}

      <div style={{ ...cardStyle, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 16, color: NAVY }}>Active ({activeItems.length})</span>
        </div>
        {activeItems.length === 0 && (
          <p style={{ color: "#9CA3AF", fontSize: 14, textAlign: "center", padding: "20px 0" }}>No integrations active yet. Add one below.</p>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {activeItems.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: "#F9FAFB", borderRadius: 10, borderLeft: `4px solid ${AMBER}`, transition: "all 0.2s", animation: `fadeIn 0.3s ease ${i * 0.04}s both` }}>
              <span style={{ fontSize: 28 }}>{item.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: NAVY }}>{item.name}</div>
                <div style={{ fontSize: 12, color: "#2ECC71", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Connected ✓ {item.stat ? `— ${item.stat}` : ""}</div>
              </div>
              <button onClick={() => setConfigPanel(item)} style={{ background: "none", border: "none", color: AMBER, fontSize: 13, fontWeight: 600, cursor: "pointer", marginRight: 8, flexShrink: 0 }}>Configure</button>
              <button onClick={() => setRemoveConfirm(item)} style={{ background: "none", border: "none", color: "#9CA3AF", fontSize: 13, cursor: "pointer", flexShrink: 0 }}>Remove</button>
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...cardStyle }}>
        <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 16, color: NAVY, marginBottom: 16 }}>Expand Your App's Capabilities</div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {cats.map(c => (
            <button key={c} onClick={() => setCatFilter(c)} style={{ padding: "6px 14px", borderRadius: 20, border: "none", background: catFilter === c ? AMBER : "#F3F4F6", color: catFilter === c ? NAVY : "#6B7280", fontSize: 13, fontWeight: catFilter === c ? 700 : 500, cursor: "pointer", transition: "all 0.2s" }}>{c}</button>
          ))}
        </div>

        {filtered.map((cat, ci) => {
          const catIdx = integrations.findIndex(c => c.cat === cat.cat);
          return (
            <div key={ci} style={{ marginBottom: 28 }}>
              <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 15, color: NAVY, marginBottom: 12 }}>{cat.cat}</div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: 12 }}>
                {cat.items.map((item, ii) => {
                  const itemIdx = integrations[catIdx].items.findIndex(x => x.name === item.name);
                  const bc = badgeStyle[item.badge] || badgeStyle.Free;
                  return (
                    <div onClick={() => navigate(`/dashboard/integrations/${encodeURIComponent(item.name)}`)} style={{ border: `2px solid ${item.active ? AMBER : item.locked ? "#E5E7EB" : "#E5E7EB"}`, background: item.active ? "#FFF8ED" : item.locked ? "#F9FAFB" : "#fff", borderRadius: 10, padding: 16, opacity: item.locked ? 0.75 : 1, position: "relative", transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)", cursor: "pointer", animation: `fadeIn 0.3s ease ${(ci * 3 + ii) * 0.04}s both` }}>
                      {item.locked && <div style={{ position: "absolute", top: 10, right: 10 }}><Lock size={14} color="#9CA3AF" /></div>}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                        <span style={{ fontSize: 28 }}>{item.icon}</span>
                        <span style={{ background: bc.bg, color: bc.color, fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 10 }}>{item.badge}</span>
                      </div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: NAVY, marginBottom: 4 }}>{item.name}</div>
                      <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 12, lineHeight: 1.4 }}>{item.desc}</div>
                      <button
                        onClick={(e) => { e.stopPropagation(); item.locked ? showToast("Upgrade to Growth plan to unlock", "info") : toggle(catIdx, itemIdx); }}
                        style={{ width: "100%", background: item.active ? "#2ECC71" : item.locked ? "#E5E7EB" : AMBER, color: item.active ? "#fff" : item.locked ? "#9CA3AF" : NAVY, border: "none", borderRadius: 20, padding: "8px 0", fontSize: 13, fontWeight: 600, cursor: item.locked ? "not-allowed" : "pointer" }}
                      >
                        {item.active ? "✓ Added" : item.locked ? "🔒 Upgrade to Unlock" : "Add to App →"}
                      </button>
                      {item.active && <div style={{ fontSize: 11, color: AMBER, fontWeight: 600, marginTop: 8, textAlign: "center" }}>Click card for details →</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        <div style={{ background: "#FFF8ED", border: "1px solid #F4A026", borderRadius: 10, padding: 16, marginTop: 8 }}>
          <div style={{ fontSize: 13, color: "#92400E" }}>💡 You can add or remove integrations anytime. Changes go live within seconds.</div>
        </div>
      </div>

      {configPanel && (
        <IntegrationConfigPanel
          integration={configPanel}
          config={JSON.parse(localStorage.getItem(`dd_integration_config_${configPanel.name}`) || "null")}
          onConfig={(name, cfg) => localStorage.setItem(`dd_integration_config_${name}`, JSON.stringify(cfg))}
          onSave={(cfg) => {
            if (cfg) localStorage.setItem(`dd_integration_config_${configPanel.name}`, JSON.stringify(cfg));
            setConfigPanel(null);
            showToast(`${configPanel.name} settings saved!`, "success");
          }}
          onRemove={(item) => setRemoveConfirm(item)}
        />
      )}

      {removeConfirm && (
        <>
          <div onClick={() => setRemoveConfirm(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, animation: "fadeIn 0.2s ease" }} />
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "#fff", borderRadius: 16, padding: 32, width: isMobile ? "92%" : 400, maxWidth: 400, zIndex: 201, boxShadow: "0 20px 60px rgba(0,0,0,0.15)", textAlign: "center", boxSizing: "border-box", animation: "fadeScaleIn 0.25s ease" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>{removeConfirm.icon}</div>
            <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 20, color: NAVY, margin: "0 0 8px" }}>Remove {removeConfirm.name}?</h3>
            <p style={{ color: "#6B7280", fontSize: 14, margin: "0 0 24px" }}>This will remove {removeConfirm.name} from your app. You can re-add it anytime.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => {
                const catIdx = integrations.findIndex(c => c.items.some(i => i.name === removeConfirm.name));
                if (catIdx < 0) { setRemoveConfirm(null); return; }
                const itemIdx = integrations[catIdx].items.findIndex(i => i.name === removeConfirm.name);
                if (itemIdx < 0) { setRemoveConfirm(null); return; }
                toggle(catIdx, itemIdx);
                setRemoveConfirm(null);
                setConfigPanel(null);
              }} style={{ flex: 1, background: "#E74C3C", color: "#fff", border: "none", borderRadius: 24, height: 48, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Remove</button>
              <button onClick={() => setRemoveConfirm(null)} style={{ flex: 1, background: "none", border: "1px solid #E5E7EB", borderRadius: 24, height: 48, fontSize: 15, cursor: "pointer", color: "#6B7280" }}>Cancel</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
