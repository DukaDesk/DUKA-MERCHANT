import { useState, useRef, useEffect, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "../../hooks/useMediaQuery";
import { NAVY, AMBER, inputStyle, labelStyle } from "../../theme";
import {
  WIZARD_TEMPLATES_BY_CATEGORY,
  WIZARD_ALWAYS_INCLUDED,
  WIZARD_INTEGRATIONS,
  WIZARD_COLORS,
  WIZARD_DAYS,
  INTEGRATION_BADGE_COLORS,
  getTemplateIntegrationNames,
} from "../../services/mockData";

const SETUP_STEPS = ["Gallery", "Branding", "Business Info", "Integrations"];
const STEP_LABELS = ["Choose template", "Brand your app", "Business info", "Integrations"];
const defaultHours = () => WIZARD_DAYS.map((d, i) => ({ day: d, open: i < 5, start: "09:00", end: "22:00" }));

const ALL_TEMPLATES = Object.values(WIZARD_TEMPLATES_BY_CATEGORY).flat();
const CATEGORIES = Object.keys(WIZARD_TEMPLATES_BY_CATEGORY);

export function SetupWizard({
  initialData,
  onComplete,
  onCancel,
  onSkipToEditor,
  showPreview = false,
  loadPreview = null,
  previewProps = {},
  isMobile: isMobileProp,
  sidebarStyle = "wizard",
  title = "App Setup Wizard",
  subtitle = "Let's set up your mobile app",
}) {
  const navigate = useNavigate();
  const isMobile = isMobileProp ?? useIsMobile();
  const saved = initialData || {};
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    category: saved.category || null,
    template: saved.template || null,
    logo: saved.logo || null,
    appName: saved.appName || "",
    tagline: saved.tagline || "",
    color: saved.color || AMBER,
    selectedIntegrations: saved.selectedIntegrations || [...WIZARD_ALWAYS_INCLUDED],
    bizDesc: saved.bizDesc || "",
    phone: saved.phone || "",
    address: saved.address || "",
    hours: (saved.hours && saved.hours.length > 0) ? saved.hours : defaultHours(),
  });
  const [errors, setErrors] = useState({});
  const [previewData, setPreviewData] = useState({ manifest: null, screens: {} });
  const [previewScreenId, setPreviewScreenId] = useState("menu");

  const validate = useCallback(() => {
    const e = {};
    if (step === 1 && !data.appName.trim()) e.appName = "App name is required";
    if (step === 2 && !data.phone.trim()) e.phone = "Phone number is required for customer contact";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [step, data]);

  const canNext = useCallback(() => {
    if (step === 0) return !!data.template;
    return true;
  }, [step, data]);

  const handleNext = useCallback(() => {
    if (!validate()) return;
    if (step < 3) setStep(s => s + 1);
    else onComplete?.(data);
  }, [step, validate, data, onComplete]);

  const handleBack = useCallback(() => setStep(s => s - 1), []);

  const handleTemplateSelect = useCallback((templateName) => {
    const tmpl = ALL_TEMPLATES.find(t => t.name === templateName);
    setData(d => ({
      ...d,
      template: templateName,
      category: tmpl?.category || d.category,
      selectedIntegrations: getTemplateIntegrationNames(templateName),
    }));
  }, []);

  const Sidebar = memo(function Sidebar() {
    return (
      <div style={isMobile ? mobileSidebarStyle : sidebarStyles[sidebarStyle]}>
        {!isMobile && sidebarStyle === "wizard" && (
          <div style={sidebarHeaderStyle}>
            <div style={logoStyle}>
              <span style={logoTextStyle}>D</span>
            </div>
            <div>
              <div style={titleStyle}>{title}</div>
              <span style={subtitleStyle}>{subtitle}</span>
            </div>
          </div>
        )}
        {!isMobile && sidebarStyle === "canvas" && (
          <div style={canvasSidebarHeaderStyle}>
            <div style={logoStyle}>
              <span style={logoTextStyle}>D</span>
            </div>
            <div>
              <div style={titleStyle}>DukaDesk</div>
              <span style={subtitleStyle}>App Builder</span>
            </div>
          </div>
        )}
        <div style={stepsContainerStyle}>
          {SETUP_STEPS.map((s, i) => {
            const done = i < step;
            const current = i === step;
            return (
              <div key={i} style={isMobile ? mobileStepStyle(done, current, i) : stepStyle(done, current, i)}>
                <div style={stepNumberStyle(done, current)}>{done ? "✓" : i + 1}</div>
                {!isMobile && <span style={stepLabelStyle(current, done)}>{s}</span>}
              </div>
            );
          })}
        </div>
      </div>
    );
  });

  const mobileSidebarStyle = {
    background: NAVY,
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    gap: 8,
    overflowX: "auto",
    flexShrink: 0,
  };

  const sidebarStyles = {
    wizard: {
      width: 240,
      minHeight: "100vh",
      background: `linear-gradient(180deg, ${NAVY} 0%, #15152A 100%)`,
      padding: "32px 20px",
      flexShrink: 0,
      display: "flex",
      flexDirection: "column",
    },
    canvas: {
      width: 240,
      minHeight: "100vh",
      background: `linear-gradient(180deg, ${NAVY} 0%, #15152A 100%)`,
      padding: "32px 20px",
      flexShrink: 0,
      display: "flex",
      flexDirection: "column",
    },
  };

  const sidebarHeaderStyle = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 40,
  };

  const canvasSidebarHeaderStyle = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 40,
  };

  const logoStyle = {
    width: 36,
    height: 36,
    background: AMBER,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const logoTextStyle = {
    color: NAVY,
    fontFamily: "'Sora',sans-serif",
    fontWeight: 800,
    fontSize: 18,
  };

  const titleStyle = {
    color: "#fff",
    fontFamily: "'Sora',sans-serif",
    fontWeight: 700,
    fontSize: 16,
  };

  const subtitleStyle = {
    color: "#9CA3AF",
    fontSize: 11,
  };

  const stepsContainerStyle = {
    display: "flex",
    flexDirection: isMobile ? "row" : "column",
    gap: isMobile ? 8 : 0,
    flex: 1,
    overflowX: isMobile ? "auto" : "hidden",
    paddingBottom: isMobile ? 8 : 0,
  };

  const mobileStepStyle = (done, current, index) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    padding: "6px 10px",
    opacity: index > step ? 0.35 : 1,
    whiteSpace: "nowrap",
  });

  const stepStyle = (done, current, index) => ({
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "14px 0",
    opacity: index > step ? 0.35 : 1,
  });

  const stepNumberStyle = (done, current) => ({
    width: isMobile ? 30 : 26,
    height: isMobile ? 30 : 26,
    borderRadius: "50%",
    background: done ? "#2ECC71" : current ? AMBER : "rgba(255,255,255,0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: isMobile ? 13 : 11,
    fontWeight: 700,
    color: done || current ? NAVY : "#6B7280",
    flexShrink: 0,
    transition: "all 0.3s",
  });

  const stepLabelStyle = (current, done) => ({
    color: current ? AMBER : done ? "#D1D5DB" : "#6B7280",
    fontSize: 13,
    fontWeight: current ? 600 : 400,
  });

  if (showPreview && !isMobile && previewData.manifest) {
    return (
      <div style={{ minHeight: "100vh", background: "#F7F8FA", display: "flex", flexDirection: "row" }}>
        <Sidebar />
        <div style={{ flex: 1, padding: isMobile ? "24px 16px" : "48px", overflowY: "auto" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            {isMobile && (
              <div style={{ textAlign: "center", marginBottom: 20, animation: "fadeIn 0.3s ease" }}>
                <span style={{ background: AMBER, color: NAVY, fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 12 }}>{STEP_LABELS[step]}</span>
              </div>
            )}
            <div style={{ animation: "fadeIn 0.35s ease" }}>
              {renderStep()}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40, paddingTop: 24, borderTop: "1px solid #E8E8F0" }}>
              <button onClick={handleBack} disabled={step === 0} style={backButtonStyle(step === 0)}>Back</button>
              <button onClick={handleNext} disabled={!canNext()} style={nextButtonStyle(canNext(), step === 3)}>
                {step === 3 ? "Enter Editor" : "Continue"}
              </button>
            </div>
          </div>
        </div>
        <div style={{ position: "sticky", top: 20, animation: "slideIn 0.3s ease" }}>
          {previewProps.renderPreview?.({
            manifest: previewData.manifest,
            screens: previewData.screens,
            currentScreenId: previewScreenId,
            setCurrentScreenId: setPreviewScreenId,
            onAction: handlePreviewAction,
            branding: data,
            ...previewProps,
          })}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F7F8FA", display: "flex", flexDirection: isMobile ? "column" : "row" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: isMobile ? "24px 16px" : "48px", overflowY: "auto" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {isMobile && (
            <div style={{ textAlign: "center", marginBottom: 20, animation: "fadeIn 0.3s ease" }}>
              <span style={{ background: AMBER, color: NAVY, fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 12 }}>{STEP_LABELS[step]}</span>
            </div>
          )}
          <div style={{ animation: "fadeIn 0.35s ease" }}>
            {renderStep()}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40, paddingTop: 24, borderTop: "1px solid #E8E8F0" }}>
            <button onClick={handleBack} disabled={step === 0} style={backButtonStyle(step === 0)}>Back</button>
            <button onClick={handleNext} disabled={!canNext()} style={nextButtonStyle(canNext(), step === 3)}>
              {step === 3 ? "Enter Editor" : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  function renderStep() {
    switch (step) {
      case 0: return <TemplateGallery value={data.template} onChange={handleTemplateSelect} onSkipToEditor={onSkipToEditor} isMobile={isMobile} />;
      case 1: return <SetupBranding data={data} setData={setData} errors={errors} setErrors={setErrors} isMobile={isMobile} />;
      case 2: return <SetupBusiness data={data} setData={setData} errors={errors} setErrors={setErrors} isMobile={isMobile} />;
      case 3: return <SetupIntegrations data={data} setData={setData} isMobile={isMobile} />;
      default: return null;
    }
  }
}

function TemplateGallery({ value, onChange, onSkipToEditor, isMobile }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [hovered, setHovered] = useState(null);

  const filtered = ALL_TEMPLATES.filter(t => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase())) || t.category.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === "All" || t.category === activeCategory;
    return matchSearch && matchCategory;
  });

  const getInitials = (name) => name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div>
      <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: isMobile ? 24 : 36, color: NAVY, margin: "0 0 8px" }}>Choose your template</h2>
      <p style={{ color: "#6B7280", fontSize: isMobile ? 14 : 16, margin: "0 0 28px" }}>Pick a pre-made template to get started quickly, or build your own from scratch.</p>

      <div style={{ marginBottom: 24, display: "flex", gap: 12, flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "stretch" : "center" }}>
        <div style={{ flex: 1, position: "relative" }}>
          <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", pointerEvents: "none" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search templates..." style={{ width: "100%", padding: "10px 14px 10px 40px", border: "1.5px solid #E8E8F0", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box", background: "#fff" }} />
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
        <button onClick={() => setActiveCategory("All")} style={chipStyle(activeCategory === "All")}>All</button>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={chipStyle(activeCategory === cat)}>{cat}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: 20 }}>
        <div onClick={() => onSkipToEditor?.({ category: "Custom" })} onMouseEnter={() => setHovered("custom")} onMouseLeave={() => setHovered(null)}
          style={{
            background: hovered === "custom" ? "#FFF8ED" : "#fff",
            border: `2px dashed ${hovered === "custom" ? AMBER : "#E8E8F0"}`,
            borderRadius: 12, cursor: "pointer", transition: "all 0.15s",
            transform: hovered === "custom" ? "translateY(-2px)" : "none",
            boxShadow: hovered === "custom" ? "0 4px 16px rgba(0,0,0,0.06)" : "none",
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", padding: isMobile ? 24 : 40, minHeight: isMobile ? 200 : 300,
          }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </div>
          <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: isMobile ? 16 : 18, color: NAVY, marginBottom: 8 }}>Create your own</div>
          <div style={{ fontSize: isMobile ? 13 : 14, color: "#6B7280", textAlign: "center", lineHeight: 1.5 }}>Start with a blank canvas<br />and build from scratch</div>
        </div>
        {filtered.map((t, i) => {
          const selected = value === t.name;
          return (
            <div key={t.name} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
              style={{
                background: "#fff", border: `1.5px solid ${selected ? AMBER : hovered === i ? "#D1D5DB" : "#E8E8F0"}`,
                borderRadius: 12, overflow: "hidden", cursor: "pointer", transition: "all 0.15s",
                position: "relative", transform: hovered === i && !selected ? "translateY(-2px)" : "none",
                boxShadow: hovered === i && !selected ? "0 4px 16px rgba(0,0,0,0.06)" : "none",
              }}
              onClick={() => onChange(t.name)}>
              {selected && <div style={{ position: "absolute", top: 8, left: 8, background: AMBER, color: NAVY, fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 8, zIndex: 2 }}>Selected</div>}
              <div style={{ height: isMobile ? 100 : 140, background: `linear-gradient(135deg, ${t.primaryColor}, ${t.secondaryColor})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: isMobile ? 28 : 36, fontWeight: 800, color: "#fff", fontFamily: "'Sora',sans-serif", textShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>{getInitials(t.name)}</span>
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 15, color: NAVY }}>{t.name}</div>
                  <span style={{ fontSize: 11, color: "#9CA3AF" }}>{t.category}</span>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {t.tags.map((tag, j) => <span key={j} style={{ background: "#F3F4F6", color: "#6B7280", fontSize: 11, padding: "3px 8px", borderRadius: 8 }}>{tag}</span>)}
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 40, color: "#9CA3AF" }}>
            No templates match your search. Try a different term.
          </div>
        )}
      </div>
    </div>
  );
}

const chipStyle = (active) => ({
  padding: "7px 18px", borderRadius: 20, border: "none",
  background: active ? AMBER : "#F3F4F6",
  color: active ? NAVY : "#6B7280",
  fontWeight: active ? 700 : 500,
  fontSize: 13, cursor: "pointer", fontFamily: "inherit",
  transition: "all 0.12s",
});

function SetupBranding({ data, setData, errors, setErrors, isMobile }) {
  const logoInputRef = useRef(null);
  const [focused, setFocused] = useState(null);
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("File too large. Max 5MB."); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setData(d => ({ ...d, logo: ev.target.result }));
    reader.readAsDataURL(file);
  };
  return (
    <div>
      <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: isMobile ? 24 : 36, color: NAVY, margin: "0 0 8px" }}>Brand your app</h2>
      <p style={{ color: "#6B7280", fontSize: isMobile ? 14 : 16, margin: "0 0 32px" }}>Your logo, name and colors appear throughout your customer app. Changes update the live preview instantly.</p>
      <div style={{ maxWidth: 600 }}>
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>App Logo</label>
          <input ref={logoInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleLogoUpload} />
          <div onClick={() => logoInputRef.current?.click()} style={{
            width: isMobile ? 100 : 130, height: isMobile ? 100 : 130,
            border: "2px dashed #E8E8F0", borderRadius: 12,
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", cursor: "pointer",
            background: data.logo ? `url(${data.logo}) center/cover no-repeat` : "#FAFAFA", gap: 8,
          }}>
            {!data.logo && <><span style={{ fontSize: isMobile ? 28 : 32 }}>📷</span>
            <span style={{ fontSize: 13, color: "#9CA3AF" }}>Upload Logo</span>
            <span style={{ fontSize: 11, color: "#D1D5DB" }}>PNG \u00B7 Max 5MB</span></>}
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>App / Business Name *</label>
          <input value={data.appName} onChange={e => { setData(d => ({ ...d, appName: e.target.value })); if (errors.appName) setErrors(e => ({ ...e, appName: "" })); }}
            style={{ ...inputStyle, borderColor: errors.appName ? "#E74C3C" : focused === "appName" ? AMBER : undefined }}
            onFocus={() => setFocused("appName")} onBlur={() => setFocused(null)} placeholder="Ada's Kitchen" />
          {errors.appName && <div style={{ color: "#E74C3C", fontSize: 12, marginTop: 4 }}>{errors.appName}</div>}
          <div style={{ textAlign: "right", fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>{data.appName.length}/50</div>
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>Tagline</label>
          <input value={data.tagline} onChange={e => setData(d => ({ ...d, tagline: e.target.value }))}
            placeholder="Authentic Nigerian home cooking"
            style={{ ...inputStyle, borderColor: focused === "tagline" ? AMBER : undefined }}
            onFocus={() => setFocused("tagline")} onBlur={() => setFocused(null)} />
        </div>
        <div>
          <label style={labelStyle}>Brand Color</label>
          <p style={{ fontSize: 12, color: "#6B7280", marginBottom: 12 }}>Used for buttons, highlights and accents.</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {WIZARD_COLORS.map((c, i) => (
              <div key={i} onClick={() => setData(d => ({ ...d, color: c }))} style={{
                width: isMobile ? 36 : 40, height: isMobile ? 36 : 40, background: c, borderRadius: "50%",
                cursor: "pointer", border: data.color === c ? `3px solid ${AMBER}` : "3px solid transparent",
                outline: data.color === c ? `2px solid ${AMBER}` : "none", outlineOffset: 2,
                display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s",
              }}>
                {data.color === c && <span style={{ color: c === "#fff" ? NAVY : "#fff", fontSize: 14, fontWeight: 700 }}>✓</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SetupBusiness({ data, setData, errors, setErrors, isMobile }) {
  const [focused, setFocused] = useState(null);
  return (
    <div style={{ maxWidth: 600 }}>
      <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: isMobile ? 24 : 36, color: NAVY, margin: "0 0 8px" }}>Tell customers about your business</h2>
      <p style={{ color: "#6B7280", fontSize: isMobile ? 14 : 16, margin: "0 0 32px" }}>This information appears on your store page in the DukaDesk app.</p>
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>About Your Business</label>
        <textarea value={data.bizDesc} onChange={e => setData(d => ({ ...d, bizDesc: e.target.value }))} placeholder="Tell customers what makes you special..." style={{ ...inputStyle, height: 100, resize: "vertical", paddingTop: 12 }} />
        <div style={{ textAlign: "right", fontSize: 11, color: "#9CA3AF" }}>{(data.bizDesc || "").length}/500</div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Contact Phone *</label>
        <div style={{ display: "flex", gap: 8, flexDirection: isMobile ? "column" : "row" }}>
          <div style={{ ...inputStyle, maxWidth: isMobile ? "100%" : 90, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>🇳🇬 +234</div>
          <input value={data.phone} onChange={e => { setData(d => ({ ...d, phone: e.target.value })); if (errors.phone) setErrors(e => ({ ...e, phone: "" })); }} placeholder="801 234 5678" style={{ ...inputStyle, flex: 1, borderColor: errors.phone ? "#E74C3C" : undefined }} />
        </div>
        {errors.phone && <div style={{ color: "#E74C3C", fontSize: 12, marginTop: 4 }}>{errors.phone}</div>}
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Business Address</label>
        <input value={data.address} onChange={e => setData(d => ({ ...d, address: e.target.value }))} placeholder="12 Admiralty Way, Lekki, Lagos" style={{ ...inputStyle, borderColor: focused === "address" ? AMBER : undefined }} onFocus={() => setFocused("address")} onBlur={() => setFocused(null)} />
      </div>
      <div style={{ marginBottom: 24 }}>
        <label style={labelStyle}>Operating Hours</label>
        <div style={{ background: "#fff", border: "1px solid #E8E8F0", borderRadius: 10, overflow: "hidden" }}>
          {(data.hours || defaultHours()).map((h, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: isMobile ? 8 : 16, padding: "12px 16px", borderBottom: i < 6 ? "1px solid #F3F4F6" : "none", flexWrap: isMobile ? "wrap" : "nowrap" }}>
              <span style={{ width: isMobile ? 60 : 90, fontSize: 14, color: NAVY, fontWeight: 500 }}>{h.day}</span>
              <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                <input type="checkbox" checked={h.open} onChange={e => { const hh = [...(data.hours || defaultHours())]; hh[i] = { ...hh[i], open: e.target.checked }; setData(d => ({ ...d, hours: hh })); }} style={{ accentColor: AMBER }} />
                <span style={{ fontSize: 13, color: "#6B7280" }}>Open</span>
              </label>
              <input type="time" value={h.start} onChange={e => { const hh = [...(data.hours || defaultHours())]; hh[i] = { ...hh[i], start: e.target.value }; setData(d => ({ ...d, hours: hh })); }} style={{ border: "1px solid #E8E8F0", borderRadius: 6, padding: "4px 8px", fontSize: 13 }} />
              <span style={{ color: "#9CA3AF" }}>to</span>
              <input type="time" value={h.end} onChange={e => { const hh = [...(data.hours || defaultHours())]; hh[i] = { ...hh[i], end: e.target.value }; setData(d => ({ ...d, hours: hh })); }} style={{ border: "1px solid #E8E8F0", borderRadius: 6, padding: "4px 8px", fontSize: 13 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SetupIntegrations({ data, setData, isMobile }) {
  const toggle = (name) => setData(d => {
    const has = d.selectedIntegrations.includes(name);
    return { ...d, selectedIntegrations: has ? d.selectedIntegrations.filter(x => x !== name) : [...d.selectedIntegrations, name] };
  });
  const relevant = getTemplateIntegrationNames(data.template);
  const relevantSet = new Set(relevant);
  const filteredIntegrations = WIZARD_INTEGRATIONS
    .map(cat => ({ ...cat, items: cat.items.filter(item => relevantSet.has(item.name)) }))
    .filter(cat => cat.items.length > 0);
  return (
    <div>
      <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: isMobile ? 24 : 36, color: NAVY, margin: "0 0 8px" }}>Supercharge your app</h2>
      <p style={{ color: "#6B7280", fontSize: isMobile ? 14 : 16, margin: "0 0 32px" }}>Integrations tailored to your template. Add more anytime from settings.</p>
      <div>
        {filteredIntegrations.map((cat, ci) => (
          <div key={ci} style={{ marginBottom: 28 }}>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 16, color: NAVY, marginBottom: 12 }}>{cat.cat}</div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
              {cat.items.map((item, ii) => {
                const added = data.selectedIntegrations.includes(item.name);
                const bc = INTEGRATION_BADGE_COLORS[item.badge] || INTEGRATION_BADGE_COLORS.Free;
                return (
                  <div key={ii} style={{
                    background: added ? "#FFF8ED" : "#fff",
                    border: `1.5px solid ${added ? AMBER : "#E8E8F0"}`,
                    borderRadius: 10, padding: 16, cursor: "pointer", transition: "all 0.15s",
                  }} onClick={() => toggle(item.name)}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                      <span style={{ fontSize: 24 }}>{item.icon}</span>
                      <span style={{ background: bc.bg, color: bc.color, fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 10 }}>{item.badge}</span>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: NAVY, marginBottom: 4 }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 10 }}>{item.desc}</div>
                    <button style={{
                      background: added ? "#2ECC71" : AMBER, color: "#fff",
                      border: "none", borderRadius: 8, padding: "6px 12px",
                      fontSize: 12, fontWeight: 600, cursor: "pointer", width: "100%",
                      transition: "all 0.12s",
                    }} onClick={e => { e.stopPropagation(); toggle(item.name); }}
                      onMouseEnter={e => { if (!added) { e.currentTarget.style.background = "#E89113"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
                      onMouseLeave={e => { if (!added) { e.currentTarget.style.background = AMBER; e.currentTarget.style.transform = "translateY(0)"; } }}
                    >{added ? "Added" : "Add"}</button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const backButtonStyle = (disabled) => ({
  padding: "12px 28px", borderRadius: 10, border: "1.5px solid #E8E8F0",
  background: "#fff", color: disabled ? "#D1D5DB" : "#6B7280",
  fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
  opacity: disabled ? 0.4 : 1, fontSize: 14, fontFamily: "inherit",
  transition: "all 0.15s",
  display: "inline-flex", alignItems: "center", gap: 6,
});

const nextButtonStyle = (enabled, isLast) => ({
  padding: "12px 36px", borderRadius: 10,
  background: enabled ? AMBER : "#E8E8F0",
  color: enabled ? NAVY : "#9CA3AF",
  border: "none", fontWeight: 700, fontFamily: "'Sora',sans-serif",
  cursor: enabled ? "pointer" : "not-allowed", fontSize: 14,
  transition: "all 0.15s",
  display: "inline-flex", alignItems: "center", gap: 6,
  boxShadow: enabled ? "0 2px 8px rgba(244,160,38,0.3)" : "none",
});
