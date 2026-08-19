import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store, ArrowLeft, ArrowRight, Check, Search } from "lucide-react";
import PropTypes from "prop-types";
import { useIsMobile } from "../../hooks/useMediaQuery";
import { NAVY, AMBER, inputStyle, labelStyle } from "../../theme";
import { ONBOARDING_CATEGORIES } from "../../config/taxonomy";
import { useAuth } from "../../contexts";
import { useVertical } from "../../runtime/VerticalContext";
import { updateTenant, getMerchant, ensureTenant } from "../../services/api";
import dukaLogo from "../../assets/image/Dukalogo.png";

export default function Onboarding({ onAuth }) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { merchant } = useAuth();
  const { setCategory } = useVertical();
  const [step, setStep] = useState(0);
  const [name, setName] = useState(() => {
    const m = getMerchant();
    return (merchant?.business || m?.business || "").trim();
  });
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState(merchant?.category || null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const filtered = ONBOARDING_CATEGORIES.filter(c =>
    !search || c.label.toLowerCase().includes(search.toLowerCase()) || (c.desc || "").toLowerCase().includes(search.toLowerCase())
  );

  const saveName = async () => {
    const m = getMerchant();
    const value = name.trim();
    if (!value) return;
    if (m?.tenantId) {
      await updateTenant(m.tenantId, { name: value });
    } else {
      await ensureTenant(value);
    }
  };

  const finishSetup = async (key) => {
    setSaving(true); setError("");
    try {
      await saveName();
      await setCategory(key);
      const m1 = getMerchant();
      onAuth?.({ ...(m1 || {}), category: key });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally { setSaving(false); }
  };

  const handleNext = async () => {
    setSaving(true); setError("");
    try {
      if (step === 0) await saveName();
      if (step === 1) {
        await finishSetup(categoryId);
        return;
      }
      setStep(s => s + 1);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally { setSaving(false); }
  };

  const pick = async (key) => {
    setCategoryId(key);
    await finishSetup(key);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: isMobile ? "24px 16px" : "40px 24px" }}>
      <div style={{ width: "100%", maxWidth: 760, animation: "fadeIn 0.4s ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <img src={dukaLogo} alt="DukaDesk" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div>
            <span style={{ color: NAVY, fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 20 }}>DukaDesk</span>
            <span style={{ background: AMBER, color: NAVY, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, marginLeft: 6, verticalAlign: "middle" }}>SETUP</span>
          </div>
        </div>

        {step === 0 ? (
          <div style={{ background: "#fff", borderRadius: 16, padding: isMobile ? 24 : 40, boxShadow: "0 10px 40px rgba(0,0,0,0.08)" }}>
            <div style={{ width: 56, height: 56, background: "#FFF8ED", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}><Store size={26} color={AMBER} /></div>
            <h1 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: isMobile ? 22 : 28, color: NAVY, margin: "0 0 8px" }}>What should we call your desk?</h1>
            <p style={{ color: "#6B7280", fontSize: 14, margin: "0 0 28px", lineHeight: 1.6 }}>
              {name.trim() ? "We've filled the name from your account — edit it if needed." : "Give your desk a name so it's easy to recognize."}
            </p>
            <label htmlFor="onboard-name" style={labelStyle}>Desk name</label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <Store size={18} style={{ position: "absolute", left: 14, color: "#9CA3AF", zIndex: 1 }} />
              <input id="onboard-name" value={name} onChange={e => setName(e.target.value)} placeholder="Ada's Kitchen" autoFocus style={{ ...inputStyle, paddingLeft: 42 }} />
            </div>
            {error && <p style={{ color: "#E74C3C", fontSize: 13, marginTop: 10 }}>{error}</p>}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28 }}>
              <button onClick={() => setStep(1)} style={{ background: "none", border: "1px solid #E8E8F0", borderRadius: 10, padding: "12px 20px", fontSize: 14, color: "#6B7280", cursor: "pointer", fontWeight: 600 }}>
                Skip
              </button>
              <button onClick={handleNext} disabled={saving || !name.trim()} style={{ background: AMBER, color: NAVY, border: "none", borderRadius: 10, padding: "12px 24px", fontSize: 14, fontWeight: 700, cursor: saving || !name.trim() ? "not-allowed" : "pointer", opacity: saving || !name.trim() ? 0.6 : 1, display: "flex", alignItems: "center", gap: 8 }}>
                {saving ? "Saving..." : "Continue"} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div style={{ background: "#fff", borderRadius: 16, padding: isMobile ? 28 : 40, boxShadow: "0 10px 40px rgba(0,0,0,0.08)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <button onClick={() => setStep(0)} style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 600 }}>
                <ArrowLeft size={15} /> Back
              </button>
            </div>
            <h1 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: isMobile ? 22 : 28, color: NAVY, margin: "12px 0 6px" }}>What are you building?</h1>
            <p style={{ color: "#6B7280", fontSize: 14, margin: "0 0 24px", lineHeight: 1.6 }}>
              Pick the type that fits best. You can change this anytime — we'll tailor your desk to match ({name || merchant?.business || "your name"}) later.
            </p>
            <div style={{ position: "relative", marginBottom: 20 }}>
              <Search size={17} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", zIndex: 1 }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search types…" style={{ ...inputStyle, paddingLeft: 40 }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
              {filtered.map(cat => {
                const selected = categoryId === cat.key;
                const active = selected;
                return (
                  <button key={cat.key} onClick={() => pick(cat.key)} disabled={saving} style={{
                    display: "flex", alignItems: "center", gap: 14, textAlign: "left",
                    border: active ? `1.5px solid ${AMBER}` : "1px solid #E8E8F0",
                    background: active ? "#FFF8ED" : "#fff", borderRadius: 12, padding: "14px 16px",
                    cursor: saving ? "wait" : "pointer", transition: "all 0.15s", position: "relative",
                    opacity: saving ? 0.6 : 1,
                  }}>
                    <div style={{ width: 42, height: 42, background: active ? `${AMBER}18` : "#F5F5FA", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{cat.icon}</div>
                    <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>{cat.label}</div>
                      <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>{cat.desc}</div>
                    </div>
                    {active && <Check size={18} color={AMBER} style={{ flexShrink: 0 }} />}
                  </button>
                );
              })}
            </div>
            {error && <p style={{ color: "#E74C3C", fontSize: 13, marginTop: 12 }}>{error}</p>}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28 }}>
              <button onClick={() => setStep(0)} style={{ background: "none", border: "1px solid #E8E8F0", borderRadius: 10, padding: "12px 20px", fontSize: 14, color: "#6B7280", cursor: "pointer", fontWeight: 600 }}>
                Back
              </button>
              <button onClick={handleNext} disabled={saving || !categoryId} style={{ background: AMBER, color: NAVY, border: "none", borderRadius: 10, padding: "12px 24px", fontSize: 14, fontWeight: 700, cursor: saving || !categoryId ? "not-allowed" : "pointer", opacity: saving || !categoryId ? 0.6 : 1, display: "flex", alignItems: "center", gap: 8 }}>
                {saving ? "Setting up…" : "Finish setup"} {!saving && <ArrowRight size={16} />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

Onboarding.propTypes = { onAuth: PropTypes.func.isRequired };