import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, LayoutTemplate, PenTool, Smartphone, Globe, Check, X, Store } from "lucide-react";
import { useIsMobile, useIsTablet } from "../../hooks/useMediaQuery";
import { NAVY, AMBER, cardStyle, btnSecondary } from "../../theme";
import { getMyApp, getDesignData } from "../../services/api";
import { Loading } from "../layout/States";

export default function MyApp() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const [app, setApp] = useState(null);
  const [design, setDesign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([
      getMyApp().catch(() => null),
      getDesignData().catch(() => null),
    ])
      .then(([a, d]) => { setApp(a); setDesign(d); })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  if (loading) return <Loading message="Loading your app..." />;

  const cols = isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(2, 1fr)";
  const isLive = app?.status === "live";
  const brandColor = app?.color || AMBER;
  const storeName = app?.appName || app?.businessName || app?.business || "My App";

  const chooseTemplate = () => { setShowNew(false); navigate("/desk-design"); };
  const chooseBlank = () => { setShowNew(false); navigate("/canvas-editor?blank=1"); };

  return (
    <div style={{ animation: "fadeIn 0.35s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: isMobile ? 22 : 28, color: NAVY, margin: "0 0 4px" }}>My App</h2>
          <p style={{ color: "#6B7280", fontSize: 14, margin: 0 }}>Your customer-facing app — view it, customize it, or start fresh.</p>
        </div>
      </div>

      {!app && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 16, color: NAVY, marginBottom: 4 }}>No app built yet</div>
          <div style={{ fontSize: 13, color: "#9CA3AF" }}>Build your customer-facing app with a template or from a blank sheet.</div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: cols, gap: 18 }}>
        <div
          onClick={() => setShowNew(true)}
          style={{
            border: "1.5px dashed #D1D5DB", borderRadius: 14, background: "rgba(255,255,255,0.6)",
            minHeight: 170, cursor: "pointer", display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 8, textAlign: "center",
            transition: "all 0.2s", padding: 20,
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = AMBER}
          onMouseLeave={e => e.currentTarget.style.borderColor = "#D1D5DB"}
        >
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#FFF8ED", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Plus size={22} color={AMBER} />
          </div>
          <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 15, color: NAVY }}>New App</div>
          <div style={{ fontSize: 12, color: "#9CA3AF" }}>Template or blank sheet</div>
        </div>

        {app && (
          <div style={{ ...cardStyle, padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ background: `linear-gradient(135deg, ${brandColor}, ${brandColor}CC)`, padding: 24, color: "#fff", position: "relative" }}>
              <div style={{ position: "absolute", top: -12, right: -12, width: 96, height: 96, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "rgba(255,255,255,0.85)", marginBottom: 10 }}>
                <Store size={14} /> {app.category || "Your business"}
              </div>
              <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 22, marginBottom: 4 }}>{storeName}</div>
              {app.tagline && <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)" }}>{app.tagline}</div>}
              {app.template && (
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.18)", borderRadius: 12, padding: "4px 12px", fontSize: 12, marginTop: 14 }}>
                  <LayoutTemplate size={14} /> Template: {app.template}
                </div>
              )}
            </div>

            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
                <div style={{ background: "#F9FAFB", borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 2 }}>Status</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: NAVY }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: isLive ? "#2ECC71" : "#9CA3AF" }} />
                    {isLive ? "Live" : "Draft"}
                  </div>
                </div>
                <div style={{ background: "#F9FAFB", borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 2 }}>Template</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>{app.template || "Not set"}</div>
                </div>
                <div style={{ background: "#F9FAFB", borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 2 }}>Store URL</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: NAVY, wordBreak: "break-all", display: "flex", alignItems: "center", gap: 4 }}>
                    <Globe size={13} color="#6B7280" /> {app.storeUrl || "dukadesk.app/..."}
                  </div>
                </div>
                <div style={{ background: "#F9FAFB", borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 2 }}>Design</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: NAVY, display: "flex", alignItems: "center", gap: 4 }}>
                    {design?.screens ? <><Check size={13} color="#2ECC71" /> Custom design ready</> : <>Template design</>}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: "auto", paddingTop: 6 }}>
                <button onClick={() => navigate("/canvas-editor")} style={{ flex: 1, minWidth: 140, background: AMBER, color: NAVY, border: "none", borderRadius: 10, padding: "12px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: "'Sora',sans-serif" }}>
                  <PenTool size={16} /> Customize
                </button>
                <button onClick={() => navigate("/miniapp")} style={{ ...btnSecondary, flex: 1, minWidth: 140 }}>
                  <Smartphone size={16} /> Preview
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showNew && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(15,15,26,0.5)", animation: "fadeIn 0.2s ease", padding: 16 }} onClick={() => setShowNew(false)}>
          <div style={{ ...cardStyle, width: "100%", maxWidth: 480, animation: "fadeScaleIn 0.3s ease" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 18, color: NAVY, margin: "0 0 4px" }}>Create a new app</h3>
                <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>How would you like to start?</p>
              </div>
              <button onClick={() => setShowNew(false)} style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer" }}><X size={18} /></button>
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              <div onClick={chooseTemplate} style={{ border: `1.5px solid ${AMBER}`, background: "#FFF8ED", borderRadius: 12, padding: 18, cursor: "pointer", display: "flex", gap: 14, alignItems: "flex-start", transition: "all 0.15s" }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: AMBER, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <LayoutTemplate size={20} color={NAVY} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 15, color: NAVY, marginBottom: 4 }}>Start from a template</div>
                  <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.4 }}>Pick a pre-made design for your category, then customize it to your brand.</div>
                </div>
              </div>

              <div onClick={chooseBlank} style={{ border: "1.5px solid #E8E8F0", borderRadius: 12, padding: 18, cursor: "pointer", display: "flex", gap: 14, alignItems: "flex-start", transition: "all 0.15s" }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <PenTool size={20} color="#6B7280" />
                </div>
                <div>
                  <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 15, color: NAVY, marginBottom: 4 }}>Start with a blank sheet</div>
                  <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.4 }}>Open an empty canvas and build your app from scratch.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}