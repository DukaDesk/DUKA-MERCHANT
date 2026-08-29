import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Store, LayoutGrid, BarChart3, MessageSquare, Link2, CreditCard, Users, Settings, Package, ShoppingCart, Contact, ClipboardList, HandCoins, CalendarCheck, Wallet, CalendarClock, Megaphone, Sparkles, Plus, ArrowRight, Lightbulb, X, CalendarDays, BadgeCheck, Ticket, Dumbbell } from "lucide-react";
import { toast } from "react-toastify";
import { useIsMobile } from "../../hooks/useMediaQuery";
import { NAVY, AMBER, cardStyle } from "../../theme";
import { getIntegrations, toggleIntegration, getMyApp, getIntegrationConfig, setIntegrationConfig, requestFeature } from "../../services/api";
import { INTEGRATION_BADGE_COLORS } from "../../config/integrations";
import { getTemplateIntegrationNames } from "../../config/wizard";
import { PRIMITIVES, PRIMITIVE_GROUPS } from "../../config/primitives";
import { useVertical } from "../../runtime/VerticalContext";
import { Loading, Empty, ErrorState } from "../layout/States";
import IntegrationConfigPanel from "./IntegrationConfigPanel";

const badgeStyle = INTEGRATION_BADGE_COLORS;

const PRIMITIVE_ICONS = {
  BarChart3, MessageSquare, Link2, Megaphone, CreditCard, Users, Contact, ClipboardList,
  HandCoins, CalendarCheck, Wallet, CalendarClock, Settings, Package, ShoppingCart, Sparkles,
  CalendarDays, BadgeCheck, Ticket, Dumbbell,
};

export default function Integrations() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { modules: enabledIds, isEnabled, toggleModule, savingModules } = useVertical();
  const [integrations, setIntegrations] = useState([]);
  const [relevantNames, setRelevantNames] = useState(null);
  const [appTemplate, setAppTemplate] = useState(null);
  const [catFilter, setCatFilter] = useState("All");
  const [configPanel, setConfigPanel] = useState(null);
  const [configPanelData, setConfigPanelData] = useState(null);
  const [removeConfirm, setRemoveConfirm] = useState(null);
  const [featureOpen, setFeatureOpen] = useState(false);
  const [featureForm, setFeatureForm] = useState({ title: "", desc: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadIntegrations = () => {
    setError(null);
    setLoading(true);
    Promise.all([
      getIntegrations(),
      getMyApp().catch(() => null),
    ]).then(([intData, appData]) => {
      const raw = Array.isArray(intData) ? intData : (Array.isArray(intData?.data) ? intData.data : (Array.isArray(intData?.integrations) ? intData.integrations : []));
      const list = raw.map(cat => ({
        ...cat,
        items: Array.isArray(cat.items) ? cat.items : [],
      }));
      const template = appData?.template || null;
      setAppTemplate(template);
      if (template) {
        const names = getTemplateIntegrationNames(template);
        setRelevantNames(new Set(names));
        const filtered = list.map(cat => ({
          ...cat,
          items: cat.items.filter(item => names.includes(item.name)),
        })).filter(cat => cat.items.length > 0);
        setIntegrations(filtered);
      } else {
        setIntegrations(list);
      }
    }).catch(() => setError("Failed to load integrations"))
    .finally(() => setLoading(false));
  };
  useEffect(loadIntegrations, []);

  useEffect(() => {
    if (configPanel) {
      getIntegrationConfig(configPanel.name).then(setConfigPanelData).catch(() => setConfigPanelData(null));
    } else {
      setConfigPanelData(null);
    }
  }, [configPanel]);

  const toggle = async (catIdx, itemIdx) => {
    const item = integrations[catIdx].items[itemIdx];
    if (item.locked) { toast.info("Upgrade to Growth plan to unlock Premium integrations"); return; }
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
      item.active ? toast.info(`${item.name} removed`) : toast.success(`${item.name} added to your app!`);
    } catch { toast.error("Failed to toggle integration"); }
  };

  const activeItems = integrations.flatMap(cat => cat.items.filter(i => i.active));
  const cats = ["All", ...(integrations.map(c => c.cat))];
  const filtered = catFilter === "All" ? integrations : integrations.filter(c => c.cat === catFilter);

  if (loading) return <Loading message="Loading integrations..." />;
  if (error) return <ErrorState message={error} onRetry={loadIntegrations} />;
  if (integrations.length === 0) return <Empty icon="ðŸ”Œ" message="No integrations available" sub="Integration categories will appear here" />;

  return (
    <div style={{ position: "relative" }}>
      <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: isMobile ? 22 : 28, color: NAVY, margin: "0 0 4px" }}>Integrations</h2>
          <p style={{ color: "#6B7280", margin: 0 }}>Choose features to power your back-office and your app. Add or remove anytime.</p>
        </div>
        <button onClick={() => setFeatureOpen(true)} style={{ background: "none", border: `1.5px solid var(--border)`, borderRadius: 10, padding: "10px 16px", fontSize: 13, fontWeight: 600, color: NAVY, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
          <Lightbulb size={16} color={AMBER} /> Request a feature
        </button>
      </div>

      <div style={{ ...cardStyle, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 16, color: NAVY, display: "flex", alignItems: "center", gap: 8 }}>
            <LayoutGrid size={17} /> Dashboard Primitives
          </span>
          <span style={{ fontSize: 12, color: "#6B7280" }}>{enabledIds.length} installed on your desk</span>
        </div>
        <p style={{ color: "#6B7280", fontSize: 13, margin: "0 0 16px" }}>These control what appears in your dashboard and sidebar. We ship the essentials for your category — add or remove what you need.</p>
        {PRIMITIVE_GROUPS.map(group => {
          const items = PRIMITIVES.filter(p => p.group === group);
          if (!items.length) return null;
          return (
            <div key={group} style={{ marginBottom: 18 }}>
              <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 14, color: NAVY, marginBottom: 10 }}>{group}</div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: 12 }}>
                {items.map(p => {
                  const Icon = PRIMITIVE_ICONS[p.icon] || Sparkles;
                  const active = isEnabled(p.id);
                  const core = ["integrations", "analytics"].includes(p.id);
                  return (
                    <div key={p.id} style={{ border: `2px solid ${active ? AMBER : "#E5E7EB"}`, background: active ? "#FFF8ED" : "#fff", borderRadius: 10, padding: 14, transition: "all 0.2s" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <div style={{ width: 34, height: 34, background: active ? `${AMBER}18` : "#F5F5FA", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Icon size={16} color={active ? AMBER : "#6B7280"} />
                        </div>
                        <span style={{ fontWeight: 600, fontSize: 14, color: NAVY, flex: 1 }}>{p.label}</span>
                        {p.page && <span style={{ fontSize: 10, fontWeight: 700, color: "#0D9488", background: "#F0FDF4", borderRadius: 8, padding: "2px 6px" }}>PAGE</span>}
                      </div>
                      <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.4, marginBottom: 12 }}>{p.desc}</div>
                      <button onClick={() => toggleModule(p.id)} disabled={savingModules || core} style={{ width: "100%", background: active ? "#2ECC71" : AMBER, color: active ? "#fff" : NAVY, border: "none", borderRadius: 20, padding: "8px 0", fontSize: 13, fontWeight: 600, cursor: savingModules || core ? (core ? "not-allowed" : "not-allowed") : "pointer", opacity: core ? 0.7 : 1 }}>
                        {core ? (active ? "Core ✓" : "Core") : active ? "Installed ✓" : "Add to desk →"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
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
                <div style={{ fontSize: 12, color: "#2ECC71", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Connected âœ“ {item.stat ? `â€” ${item.stat}` : ""}</div>
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
            <div key={cat.cat} style={{ marginBottom: 28 }}>
              <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 15, color: NAVY, marginBottom: 12 }}>{cat.cat}</div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: 12 }}>
                {cat.items.map((item, ii) => {
                  const itemIdx = integrations[catIdx].items.findIndex(x => x.name === item.name);
                  const bc = badgeStyle[item.badge] || badgeStyle.Free;
                  return (
                    <div key={item.name} onClick={() => navigate(`/dashboard/integrations/${encodeURIComponent(item.name)}`)} style={{ border: `2px solid ${item.active ? AMBER : item.locked ? "#E5E7EB" : "#E5E7EB"}`, background: item.active ? "#FFF8ED" : item.locked ? "#F9FAFB" : "#fff", borderRadius: 10, padding: 16, opacity: item.locked ? 0.75 : 1, position: "relative", transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)", cursor: "pointer", animation: `fadeIn 0.3s ease ${(ci * 3 + ii) * 0.04}s both` }}>
                      {item.locked && <div style={{ position: "absolute", top: 10, right: 10 }}><Lock size={14} color="#9CA3AF" /></div>}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                        <span style={{ fontSize: 28 }}>{item.icon}</span>
                        <span style={{ background: bc.bg, color: bc.color, fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 10 }}>{item.badge}</span>
                      </div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: NAVY, marginBottom: 4 }}>{item.name}</div>
                      <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 12, lineHeight: 1.4 }}>{item.desc}</div>
                      <button
                        onClick={(e) => { e.stopPropagation(); item.locked ? toast.info("Upgrade to Growth plan to unlock") : toggle(catIdx, itemIdx); }}
                        style={{ width: "100%", background: item.active ? "#2ECC71" : item.locked ? "#E5E7EB" : AMBER, color: item.active ? "#fff" : item.locked ? "#9CA3AF" : NAVY, border: "none", borderRadius: 20, padding: "8px 0", fontSize: 13, fontWeight: 600, cursor: item.locked ? "not-allowed" : "pointer" }}
                      >
                        {item.active ? "âœ“ Added" : item.locked ? "ðŸ”’ Upgrade to Unlock" : "Add to App â†’"}
                      </button>
                      {item.active && <div style={{ fontSize: 11, color: AMBER, fontWeight: 600, marginTop: 8, textAlign: "center" }}>Click card for details â†’</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        <div style={{ background: "#FFF8ED", border: "1px solid #F4A026", borderRadius: 10, padding: 16, marginTop: 8 }}>
          <div style={{ fontSize: 13, color: "#92400E" }}>ðŸ’¡ You can add or remove integrations anytime. Changes go live within seconds.</div>
        </div>
      </div>

      {configPanel && (
        <IntegrationConfigPanel
          integration={configPanel}
          config={configPanelData}
          onConfig={(name, cfg) => setConfigPanelData(cfg)}
          onSave={async (cfg) => {
            try {
              if (cfg) await setIntegrationConfig(configPanel.name, cfg);
              setConfigPanel(null);
              toast.success(`${configPanel.name} settings saved!`);
            } catch { toast.error("Failed to save settings"); }
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

      {featureOpen && (
        <>
          <div onClick={() => setFeatureOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, animation: "fadeIn 0.2s ease" }} />
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "#fff", borderRadius: 16, padding: 28, width: isMobile ? "92%" : 440, maxWidth: 440, zIndex: 201, boxShadow: "0 20px 60px rgba(0,0,0,0.15)", boxSizing: "border-box", animation: "fadeScaleIn 0.25s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, background: `${AMBER}18`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Lightbulb size={18} color={AMBER} />
                </div>
                <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 19, color: NAVY, margin: 0 }}>Request a feature</h3>
              </div>
              <button onClick={() => setFeatureOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF" }}>
                <X size={20} />
              </button>
            </div>
            <p style={{ color: "#6B7280", fontSize: 13, margin: "0 0 20px", lineHeight: 1.5 }}>
              Can't find what you need? Tell us what to build — we'll start a thread on your request.
            </p>
            <div style={{ marginBottom: 14 }}>
              <label htmlFor="feature-title" style={{ display: "block", fontSize: 13, fontWeight: 600, color: NAVY, marginBottom: 6 }}>What do you want?</label>
              <input id="feature-title" value={featureForm.title} onChange={e => setFeatureForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. WhatsApp order alerts" style={{ width: "100%", boxSizing: "border-box", border: "1px solid #E8E8F0", borderRadius: 10, padding: "12px 14px", fontSize: 14, outline: "none", fontFamily: "inherit" }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label htmlFor="feature-desc" style={{ display: "block", fontSize: 13, fontWeight: 600, color: NAVY, marginBottom: 6 }}>Tell us more</label>
              <textarea id="feature-desc" value={featureForm.desc} onChange={e => setFeatureForm(f => ({ ...f, desc: e.target.value }))} placeholder="Describe how you'd use it in your daily work…" rows={3} style={{ width: "100%", boxSizing: "border-box", border: "1px solid #E8E8F0", borderRadius: 10, padding: "12px 14px", fontSize: 14, outline: "none", resize: "vertical", fontFamily: "inherit" }} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => {
                if (!featureForm.title.trim()) { toast.error("Give your request a short title"); return; }
                try { requestFeature(featureForm); } catch { /* handled below */ }
                setFeatureForm({ title: "", desc: "" });
                setFeatureOpen(false);
                toast.success("Request received! We'll keep you posted.");
              }} style={{ flex: 1, background: AMBER, color: NAVY, border: "none", borderRadius: 24, height: 48, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                Submit request
              </button>
              <button onClick={() => setFeatureOpen(false)} style={{ flex: 1, background: "none", border: "1px solid #E5E7EB", borderRadius: 24, height: 48, fontSize: 15, cursor: "pointer", color: "#6B7280" }}>Cancel</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
