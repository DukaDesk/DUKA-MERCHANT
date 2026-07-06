import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Settings, Check, Plus, Shield, Zap, Smartphone, MessageSquare, Star, Clock, Gift, Bell, Mail, HelpCircle, Headphones } from "lucide-react";
import { useToast } from "../../App";
import { useIsMobile } from "../../hooks/useMediaQuery";
import { NAVY, AMBER, cardStyle } from "../../theme";
import { INTEGRATION_BADGE_COLORS, INTEGRATION_DETAILS } from "../../services/mockData";
import { getIntegrations, toggleIntegration } from "../../services/api";
import { Loading, Empty } from "../layout/States";
import IntegrationConfigPanel from "./IntegrationConfigPanel";



export default function IntegrationDetails() {
  const { name } = useParams();
  const navigate = useNavigate();
  const showToast = useToast();
  const isMobile = useIsMobile();
  const [integration, setIntegration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(false);
  const [configPanel, setConfigPanel] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState([]);

  const details = INTEGRATION_DETAILS[name];

  useEffect(() => {
    getIntegrations().then(data => {
      for (const cat of data) {
        const found = cat.items.find(i => i.name === name);
        if (found) {
          setIntegration(found);
          setActive(found.active);
          return;
        }
      }
    }).catch(() => showToast("Failed to load integration", "error"))
    .finally(() => setLoading(false));
  }, [name]);

  if (loading) return <Loading message={`Loading ${name}...`} />;
  if (!integration) return <Empty icon="🔌" message="Integration not found" sub="This integration doesn't exist or has been removed" action={<button onClick={() => navigate("/dashboard/integrations")} style={{ background: AMBER, color: NAVY, border: "none", borderRadius: 10, padding: "10px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Back to Integrations</button>} />;

  const bc = INTEGRATION_BADGE_COLORS[integration.badge] || INTEGRATION_BADGE_COLORS.Free;

  const toggleType = (typeName) => {
    setSelectedTypes(prev =>
      prev.includes(typeName) ? prev.filter(t => t !== typeName) : [...prev, typeName]
    );
  };

  return (
    <div style={{ animation: "fadeIn 0.35s ease" }}>
      <button onClick={() => navigate("/dashboard/integrations")} style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 14, marginBottom: 20, padding: 0 }}>
        <ArrowLeft size={16} /> Back to Integrations
      </button>

      <div style={{ ...cardStyle, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: isMobile ? 14 : 20 }}>
          <div style={{ width: isMobile ? 64 : 80, height: isMobile ? 64 : 80, background: `${bc.bg}`, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: isMobile ? 32 : 40, flexShrink: 0 }}>
            {details?.preview || integration.icon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
              <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: isMobile ? 22 : 28, color: NAVY, margin: 0 }}>{integration.name}</h2>
              <span style={{ background: bc.bg, color: bc.color, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 12 }}>{integration.badge}</span>
            </div>
            <p style={{ color: "#6B7280", fontSize: isMobile ? 14 : 15, margin: "4px 0 0", lineHeight: 1.5 }}>{details?.summary || integration.desc}</p>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button onClick={async () => {
                try {
                  await toggleIntegration(integration.name);
                  setActive(!active);
                  showToast(active ? `${integration.name} disabled` : `${integration.name} enabled!`, active ? "info" : "success");
                } catch { showToast("Failed to toggle integration", "error"); }
              }} style={{
                background: active ? "#2ECC71" : AMBER, color: active ? "#fff" : NAVY, border: "none",
                borderRadius: 10, padding: "10px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                {active ? <><Check size={16} /> Enabled</> : <><Plus size={16} /> Enable</>}
              </button>
              {active && <button onClick={() => setConfigPanel(integration)} style={{
                background: "none", border: "1.5px solid #E5E7EB", borderRadius: 10,
                padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer", color: NAVY,
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <Settings size={16} /> Configure
              </button>}
            </div>
          </div>
        </div>
      </div>

      {details?.types && (
        <div style={{ ...cardStyle, marginBottom: 24 }}>
          <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 18, color: NAVY, margin: "0 0 6px" }}>Types & Modes</h3>
          <p style={{ color: "#6B7280", fontSize: 14, margin: "0 0 20px" }}>Choose the variant that best suits your business.</p>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 12 }}>
            {details.types.map((t, i) => {
              const selected = selectedTypes.includes(t.name);
              return (
                <div key={i} onClick={() => toggleType(t.name)} style={{
                  background: selected ? "#FFF8ED" : "#fff",
                  border: `1.5px solid ${selected ? AMBER : "#E8E8F0"}`,
                  borderRadius: 12, padding: 16, cursor: "pointer", transition: "all 0.15s",
                  position: "relative",
                }}>
                  {selected && <div style={{ position: "absolute", top: 8, right: 8, background: AMBER, color: NAVY, borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>✓</div>}
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{t.icon}</div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: NAVY, marginBottom: 4 }}>{t.name}</div>
                  <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.4 }}>{t.desc}</div>
                  {t.popular && <span style={{ display: "inline-block", background: "#FFF8ED", color: "#92400E", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10, marginTop: 8 }}>✦ Popular</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ ...cardStyle, background: "#F9FAFB", border: "1px dashed #E5E7EB" }}>
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>{details?.preview || integration.icon}</div>
          <h4 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 16, color: NAVY, margin: "0 0 6px" }}>{integration.name}</h4>
          <p style={{ color: "#6B7280", fontSize: 13, margin: "0 auto", maxWidth: 400, lineHeight: 1.5 }}>{details?.summary || integration.desc}</p>
          <button onClick={async () => {
            try {
              await toggleIntegration(integration.name);
              setActive(!active);
              showToast(active ? `${integration.name} disabled` : `${integration.name} enabled!`, active ? "info" : "success");
            } catch { showToast("Failed to toggle integration", "error"); }
          }} style={{
            marginTop: 16, background: active ? "#2ECC71" : AMBER, color: active ? "#fff" : NAVY,
            border: "none", borderRadius: 10, padding: "10px 24px", fontSize: 14, fontWeight: 700,
            cursor: "pointer",
          }}>
            {active ? "✓ Enabled" : "Enable Integration"}
          </button>
        </div>
      </div>

      {configPanel && (
        <IntegrationConfigPanel
          integration={configPanel}
          config={(() => { try { return JSON.parse(localStorage.getItem(`dd_integration_config_${configPanel.name}`)); } catch { return null; } })()}
          onConfig={(name, cfg) => localStorage.setItem(`dd_integration_config_${name}`, JSON.stringify(cfg))}
          onSave={(cfg) => {
            if (cfg) localStorage.setItem(`dd_integration_config_${configPanel.name}`, JSON.stringify(cfg));
            setConfigPanel(null);
            showToast(`${configPanel.name} settings saved!`, "success");
          }}
          onRemove={async (item) => {
            try {
              const { toggleIntegration } = await import("../../services/api");
              await toggleIntegration(item.name);
              setActive(false);
              setConfigPanel(null);
              showToast(`${item.name} disconnected`, "info");
            } catch { showToast("Failed to disconnect", "error"); }
          }}
        />
      )}
    </div>
  );
}
