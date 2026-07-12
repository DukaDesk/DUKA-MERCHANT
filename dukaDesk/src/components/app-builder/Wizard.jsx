import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode";
import { useToast } from "../../App";
import { useIsMobile } from "../../hooks/useMediaQuery";
import { NAVY, AMBER, inputStyle, labelStyle, cardStyle } from "../../theme";
import { setSetupData, getSetupData, deployApp } from "../../services/api";
import { WIZARD_STEPS, WIZARD_CATEGORIES, WIZARD_TEMPLATES_BY_CATEGORY, WIZARD_FEATURE_INTEGRATION_MAP, WIZARD_ALWAYS_INCLUDED, WIZARD_INTEGRATIONS, WIZARD_PREVIEW_DATA, WIZARD_COLORS, WIZARD_DAYS, WIZARD_PUBLISH_STEPS, INTEGRATION_BADGE_COLORS, getTemplateIntegrationNames } from "../../services/mockData";
import { TemplatePreview } from "../template/TemplateRenderer";
import { loadAllTemplateScreens } from "../../services/TemplateLoader";
import { generateShopTemplate } from "../../services/TemplateGenerator";
import { Palette, Eye, MousePointer, SlidersHorizontal, Sparkles, ArrowRight } from "lucide-react";

const steps = WIZARD_STEPS;
const categories = WIZARD_CATEGORIES;

export default function Wizard() {
  const navigate = useNavigate();
  const showToast = useToast();
  const isMobile = useIsMobile();
  const saved = getSetupData();
  const defaultHours = () => WIZARD_DAYS.map((d, i) => ({ day: d, open: i < 5, start: "09:00", end: "22:00" }));
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    category: saved?.category || null,
    template: saved?.template || null,
    logo: saved?.logo || null,
    appName: saved?.appName || "",
    tagline: saved?.tagline || "",
    color: saved?.color || AMBER,
    selectedIntegrations: saved?.selectedIntegrations || [...WIZARD_ALWAYS_INCLUDED],
    bizDesc: saved?.bizDesc || "",
    phone: saved?.phone || "",
    address: saved?.address || "",
    hours: (saved?.hours && saved.hours.length > 0) ? saved.hours : defaultHours(),
  });
  const [errors, setErrors] = useState({});
  const [published, setPublished] = useState(false);
  const [previewScreenId, setPreviewScreenId] = useState("menu");
  const [templateManifest, setTemplateManifest] = useState(null);
  const [templateScreens, setTemplateScreens] = useState({});
  const [showCustomize, setShowCustomize] = useState(false);
  const [customizeTemplateId, setCustomizeTemplateId] = useState(null);

  const validate = () => {
    const e = {};
    if (step === 2 && !data.appName.trim()) e.appName = "App name is required";
    if (step === 3 && !data.phone.trim()) e.phone = "Phone number is required for customer contact";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const saveProgress = () => {
    setSetupData({ category: data.category, template: data.template, appName: data.appName, tagline: data.tagline, color: data.color, logo: data.logo, selectedIntegrations: data.selectedIntegrations, bizDesc: data.bizDesc, phone: data.phone, address: data.address, hours: data.hours });
  };

  const next = () => { if (!validate()) return; saveProgress(); if (step < 4) setStep(s => s + 1); else handlePublish(); };
  const back = () => setStep(s => s - 1);
  const canNext = () => {
    if (step === 0) return !!data.category;
    if (step === 1) return !!data.template;
    return true;
  };

  const handlePublish = async () => {
    saveProgress();
    try {
      await deployApp({
        category: data.category, template: data.template, appName: data.appName,
        tagline: data.tagline, color: data.color, logo: data.logo,
        selectedIntegrations: data.selectedIntegrations,
        bizDesc: data.bizDesc, phone: data.phone, address: data.address,
        hours: data.hours,
      });
      setPublished(true);
    } catch (err) {
      showToast(err.message || "Failed to deploy app", "error");
    }
  };

  // Load template preview when category/template selected
  useEffect(() => {
    if (data.category && data.template && typeof data.category === 'string' && typeof data.template === 'string') {
      const templateId = `${data.category.toLowerCase()}/${data.template.toLowerCase().replace(/\s+/g, '-')}`;
      loadAllTemplateScreens(templateId).then(({ manifest, screens }) => {
        setTemplateManifest(manifest);
        setTemplateScreens(screens);
        setPreviewScreenId(manifest?.navigation?.initialScreen || "menu");
      }).catch(() => {
        // Fallback to generated template
        const generated = generateShopTemplate({
          category: data.category,
          template: data.template,
          appName: data.appName,
          tagline: data.tagline,
          color: data.color,
          logo: data.logo,
          businessName: data.appName,
          bizDesc: data.bizDesc,
          phone: data.phone,
          address: data.address,
          hours: data.hours,
          selectedIntegrations: data.selectedIntegrations,
        });
        setTemplateManifest(generated);
        setTemplateScreens({});
        setPreviewScreenId(generated.navigation?.initialScreen || "menu");
      });
    }
  }, [data.category, data.template]);

  const openCustomize = () => {
    if (data.category && data.template) {
      const templateId = `${data.category.toLowerCase()}/${data.template.toLowerCase().replace(/\s+/g, '-')}`;
      setCustomizeTemplateId(templateId);
      setShowCustomize(true);
    }
  };

  const handlePreviewAction = (actionKey, payload) => {
    if (actionKey === "navigate" && payload?.push) {
      const screenMatch = payload.push.match(/\/([^/]+)$/);
      if (screenMatch) {
        const newScreenId = screenMatch[1].replace(/-/g, '');
        const found = templateManifest?.screens?.find(s => s.id === newScreenId || s.id.replace(/-/g, '') === newScreenId);
        if (found) {
          setPreviewScreenId(found.id);
        }
      }
    }
  };

  const stepLabels = ["Choose category", "Pick template", "Brand your app", "Business info", "Integrations"];

  if (published) return <Published data={data} onFinish={() => navigate("/dashboard")} showToast={showToast} isMobile={isMobile} />;

  // Render customize modal
  if (showCustomize && customizeTemplateId) {
    return (
      <div style={{ minHeight: "100vh", background: "#F7F8FA", position: "relative" }}>
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 99, onClick: () => setShowCustomize(false) }} />
        <iframe
          src={`/template-editor/${customizeTemplateId}`}
          style={{ position: "fixed", top: "40px", left: "40px", right: "40px", bottom: "40px", border: "none", borderRadius: 12, boxShadow: "0 20px 60px rgba(0,0,0,0.3)", zIndex: 100 }}
        />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F7F8FA", display: "flex", flexDirection: isMobile ? "column" : "row" }}>
      <div style={isMobile ? {
        background: NAVY, padding: "12px 16px", display: "flex", alignItems: "center", gap: 8, overflowX: "auto", flexShrink: 0,
      } : {
        width: 240, minHeight: "100vh", background: `linear-gradient(180deg, ${NAVY} 0%, #15152A 100%)`, padding: "32px 20px", flexShrink: 0, display: "flex", flexDirection: "column",
      }}>
        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40 }}>
            <div style={{ width: 36, height: 36, background: AMBER, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: NAVY, fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 18 }}>D</span>
            </div>
            <div><div style={{ color: "#fff", fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 16 }}>DukaDesk</div><span style={{ color: "#9CA3AF", fontSize: 11 }}>App Setup Wizard</span></div>
          </div>
        )}
        {steps.map((s, i) => {
          const done = i < step;
          const current = i === step;
          return (
            <div key={i} style={isMobile ? {
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              padding: "6px 10px", opacity: i > step ? 0.35 : 1, whiteSpace: "nowrap",
            } : {
              display: "flex", alignItems: "center", gap: 12, padding: "14px 0", opacity: i > step ? 0.35 : 1,
            }}>
              <div style={{ width: isMobile ? 30 : 26, height: isMobile ? 30 : 26, borderRadius: "50%", background: done ? "#2ECC71" : current ? AMBER : "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: isMobile ? 13 : 11, fontWeight: 700, color: done || current ? NAVY : "#6B7280", flexShrink: 0, transition: "all 0.3s" }}>
                {done ? "✓" : i + 1}
              </div>
              {!isMobile && <span style={{ color: current ? AMBER : done ? "#D1D5DB" : "#6B7280", fontSize: 13, fontWeight: current ? 600 : 400 }}>{s}</span>}
            </div>
          );
        })}
      </div>

      <div style={{ flex: 1, padding: isMobile ? "24px 16px" : "48px", overflowY: "auto" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {isMobile && (
            <div style={{ textAlign: "center", marginBottom: 20, animation: "fadeIn 0.3s ease" }}>
              <span style={{ background: AMBER, color: NAVY, fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 12 }}>{stepLabels[step]}</span>
            </div>
          )}

          <div style={{ animation: "fadeIn 0.35s ease" }}>
            {step === 0 && <StepCategory data={data} setData={setData} isMobile={isMobile} />}
            {step === 1 && <StepTemplate data={data} setData={setData} isMobile={isMobile}
              templatesByCategory={WIZARD_TEMPLATES_BY_CATEGORY}
              getTemplateIntegrations={getTemplateIntegrationNames}
              templateManifest={templateManifest}
              templateScreens={templateScreens}
              previewScreenId={previewScreenId}
              setPreviewScreenId={setPreviewScreenId}
              onPreviewAction={handlePreviewAction}
              openCustomize={openCustomize}
            />}
            {step === 2 && <StepBranding data={data} setData={setData} errors={errors} setErrors={setErrors} isMobile={isMobile}
              templateManifest={templateManifest}
              templateScreens={templateScreens}
              previewScreenId={previewScreenId}
              setPreviewScreenId={setPreviewScreenId}
              onPreviewAction={handlePreviewAction}
              openCustomize={openCustomize}
            />}
            {step === 3 && <StepBusiness data={data} setData={setData} errors={errors} setErrors={setErrors} isMobile={isMobile}
              templateManifest={templateManifest}
              templateScreens={templateScreens}
              previewScreenId={previewScreenId}
              setPreviewScreenId={setPreviewScreenId}
              onPreviewAction={handlePreviewAction}
            />}
            {step === 4 && <StepIntegrations data={data} setData={setData} isMobile={isMobile}
              getTemplateIntegrations={getTemplateIntegrationNames}
              templateManifest={templateManifest}
              templateScreens={templateScreens}
              previewScreenId={previewScreenId}
              setPreviewScreenId={setPreviewScreenId}
              onPreviewAction={handlePreviewAction}
            />}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
            <button onClick={back} disabled={step === 0} style={{
              padding: "12px 28px", borderRadius: 10, border: "1.5px solid var(--border)",
              background: "#fff", color: step === 0 ? "#D1D5DB" : "#6B7280",
              fontWeight: 600, cursor: step === 0 ? "not-allowed" : "pointer",
              opacity: step === 0 ? 0.4 : 1, fontSize: 14, fontFamily: "inherit",
            }}>← Back</button>
            <button onClick={next} disabled={!canNext()} style={{
              padding: "12px 36px", borderRadius: 10,
              background: canNext() ? AMBER : "#E8E8F0",
              color: canNext() ? NAVY : "#9CA3AF",
              border: "none", fontWeight: 700, fontFamily: "'Sora',sans-serif",
              cursor: canNext() ? "pointer" : "not-allowed", fontSize: 14,
            }}>{step === 4 ? "🚀 Publish My App" : "Continue →"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepCategory({ data, setData, isMobile }) {
  const [hovered, setHovered] = useState(null);
  return (
    <div>
      <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: isMobile ? 24 : 36, color: NAVY, margin: "0 0 8px" }}>What type of business are you?</h2>
      <p style={{ color: "#6B7280", fontSize: isMobile ? 14 : 16, margin: "0 0 36px" }}>We'll recommend the best templates and integrations for you.</p>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3,1fr)", gap: isMobile ? 12 : 16 }}>
        {categories.map((c, i) => {
          const selected = data.category === c.name;
          return (
            <div key={i} onClick={() => setData(d => ({ ...d, category: c.name, template: d.category === c.name ? d.template : null }))}
              onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
              style={{
                background: selected ? "#FFF8ED" : hovered === i ? "#F9FAFB" : "#fff",
                border: `1.5px solid ${selected ? AMBER : hovered === i ? "#D1D5DB" : "#E8E8F0"}`,
                borderRadius: 12, padding: isMobile ? 16 : 24, cursor: "pointer",
                transition: "all 0.15s", position: "relative",
                transform: hovered === i && !selected ? "translateY(-2px)" : "none",
                boxShadow: hovered === i && !selected ? "0 4px 16px rgba(0,0,0,0.06)" : "none",
              }}>
              {selected && <div style={{ position: "absolute", top: 8, right: 8, background: AMBER, color: NAVY, borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>✓</div>}
              <div style={{ fontSize: isMobile ? 28 : 40, marginBottom: 10 }}>{c.icon}</div>
              <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: isMobile ? 14 : 16, color: NAVY, marginBottom: 4 }}>{c.name}</div>
              <div style={{ fontSize: isMobile ? 12 : 13, color: "#6B7280", lineHeight: 1.4 }}>{c.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepTemplate({ data, setData, isMobile, templatesByCategory, getTemplateIntegrations, templateManifest, templateScreens, previewScreenId, setPreviewScreenId, onPreviewAction, openCustomize }) {
  const templates = templatesByCategory[data.category] || [];
  const [hovered, setHovered] = useState(null);
  
  return (
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 420px", gap: isMobile ? 24 : 40 }}>
      <div>
        <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: isMobile ? 24 : 36, color: NAVY, margin: "0 0 8px" }}>Choose your template</h2>
        <p style={{ color: "#6B7280", fontSize: isMobile ? 14 : 16, margin: "0 0 36px" }}>Pick the look and feel for your app. Each template gives you a different set of screens and layout.</p>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: 20 }}>
          {templates.map((t, i) => {
            const selected = data.template === t.name;
            return (
              <div key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
                style={{
                  background: "#fff", border: `1.5px solid ${selected ? AMBER : hovered === i ? "#D1D5DB" : "#E8E8F0"}`,
                  borderRadius: 12, overflow: "hidden", cursor: "pointer", transition: "all 0.15s",
                  position: "relative", transform: hovered === i && !selected ? "translateY(-2px)" : "none",
                  boxShadow: hovered === i && !selected ? "0 4px 16px rgba(0,0,0,0.06)" : "none",
                }}
                onClick={() => {
                  setData(d => ({ ...d, template: t.name, selectedIntegrations: getTemplateIntegrations(t.name) }));
                  setTimeout(() => setStep(2), 100);
                }}>
                {selected && <div style={{ position: "absolute", top: 8, left: 8, background: AMBER, color: NAVY, fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 8, zIndex: 2 }}>Selected</div>}
                <div style={{ height: isMobile ? 130 : 170, background: `linear-gradient(135deg, ${NAVY}, #1a1a2e)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: isMobile ? 56 : 72 }}>{t.preview}</div>
                <div style={{ padding: 16 }}>
                  <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 15, color: NAVY, marginBottom: 8 }}>{t.name}</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                    {t.tags.map((tag, j) => <span key={j} style={{ background: "#F3F4F6", color: "#6B7280", fontSize: 11, padding: "3px 8px", borderRadius: 8 }}>{tag}</span>)}
                  </div>
                  <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.5 }}>{t.features.map(f => `✓ ${f}`).join("  ")}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {!isMobile && templateManifest && (
        <div style={{ position: "sticky", top: 20, animation: "slideIn 0.3s ease" }}>
          <InteractivePreview
            manifest={templateManifest}
            screens={templateScreens}
            currentScreenId={previewScreenId}
            setCurrentScreenId={setPreviewScreenId}
            onAction={onPreviewAction}
            openCustomize={openCustomize}
            isMobile={false}
          />
        </div>
      )}
    </div>
  );
}

function StepBranding({ data, setData, errors, setErrors, isMobile, templateManifest, templateScreens, previewScreenId, setPreviewScreenId, onPreviewAction, openCustomize }) {
  const colors = WIZARD_COLORS;
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
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 420px", gap: isMobile ? 24 : 40 }}>
      <div>
        <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: isMobile ? 24 : 36, color: NAVY, margin: "0 0 8px" }}>Brand your app</h2>
        <p style={{ color: "#6B7280", fontSize: isMobile ? 14 : 16, margin: "0 0 32px" }}>Your logo, colors and name appear throughout your customer-facing app. Changes update the live preview instantly.</p>
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
            <span style={{ fontSize: 11, color: "#D1D5DB" }}>PNG · Max 5MB</span></>}
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
          <p style={{ fontSize: 12, color: "#6B7280", marginBottom: 12 }}>Used for buttons, highlights and accents in your app.</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {colors.map((c, i) => (
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

      {!isMobile && templateManifest && (
        <div style={{ position: "sticky", top: 20, animation: "slideIn 0.3s ease" }}>
          <InteractivePreview
            manifest={templateManifest}
            screens={templateScreens}
            currentScreenId={previewScreenId}
            setCurrentScreenId={setPreviewScreenId}
            onAction={handlePreviewAction}
            openCustomize={openCustomize}
            branding={data}
            isMobile={false}
          />
        </div>
      )}
    </div>
  );
}

function StepBusiness({ data, setData, errors, setErrors, isMobile, templateManifest, templateScreens, previewScreenId, setPreviewScreenId, onPreviewAction }) {
  const defaultHours = WIZARD_DAYS.map((d, i) => ({ day: d, open: i < 5, start: "09:00", end: "22:00" }));
  const [focused, setFocused] = useState(null);
  return (
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 420px", gap: isMobile ? 24 : 40 }}>
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
            {(data.hours || defaultHours).map((h, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: isMobile ? 8 : 16, padding: "12px 16px", borderBottom: i < 6 ? "1px solid #F3F4F6" : "none", flexWrap: isMobile ? "wrap" : "nowrap" }}>
                <span style={{ width: isMobile ? 60 : 90, fontSize: 14, color: NAVY, fontWeight: 500 }}>{h.day}</span>
                <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                  <input type="checkbox" checked={h.open} onChange={e => { const hh = [...(data.hours || defaultHours)]; hh[i] = { ...hh[i], open: e.target.checked }; setData(d => ({ ...d, hours: hh })); }} style={{ accentColor: AMBER }} />
                  <span style={{ fontSize: 13, color: "#6B7280" }}>Open</span>
                </label>
                <input type="time" value={h.start} onChange={e => { const hh = [...(data.hours || defaultHours)]; hh[i] = { ...hh[i], start: e.target.value }; setData(d => ({ ...d, hours: hh })); }} style={{ border: "1px solid #E8E8F0", borderRadius: 6, padding: "4px 8px", fontSize: 13 }} />
                <span style={{ color: "#9CA3AF" }}>to</span>
                <input type="time" value={h.end} onChange={e => { const hh = [...(data.hours || defaultHours)]; hh[i] = { ...hh[i], end: e.target.value }; setData(d => ({ ...d, hours: hh })); }} style={{ border: "1px solid #E8E8F0", borderRadius: 6, padding: "4px 8px", fontSize: 13 }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {!isMobile && templateManifest && (
        <div style={{ position: "sticky", top: 20, animation: "slideIn 0.3s ease" }}>
          <InteractivePreview
            manifest={templateManifest}
            screens={templateScreens}
            currentScreenId={previewScreenId}
            setCurrentScreenId={setPreviewScreenId}
            onAction={handlePreviewAction}
            branding={data}
            isMobile={false}
          />
        </div>
      )}
    </div>
  );
}

function StepIntegrations({ data, setData, isMobile, getTemplateIntegrations, templateManifest, templateScreens, previewScreenId, setPreviewScreenId, onPreviewAction }) {
  const toggle = (name) => setData(d => {
    const has = d.selectedIntegrations.includes(name);
    return { ...d, selectedIntegrations: has ? d.selectedIntegrations.filter(x => x !== name) : [...d.selectedIntegrations, name] };
  });
  const relevant = getTemplateIntegrations(data.template);
  const relevantSet = new Set(relevant);
  const filteredIntegrations = WIZARD_INTEGRATIONS
    .map(cat => ({ ...cat, items: cat.items.filter(item => relevantSet.has(item.name)) }))
    .filter(cat => cat.items.length > 0);

  return (
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 420px", gap: isMobile ? 24 : 40 }}>
      <div>
        <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: isMobile ? 24 : 36, color: NAVY, margin: "0 0 8px" }}>Supercharge your app</h2>
        <p style={{ color: "#6B7280", fontSize: isMobile ? 14 : 16, margin: "0 0 32px" }}>Integrations tailored to your template. Add more anytime.</p>
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
                      }}>{added ? "✓ Added" : "Add →"}</button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {!isMobile && templateManifest && (
        <div style={{ position: "sticky", top: 20, animation: "slideIn 0.3s ease" }}>
          <InteractivePreview
            manifest={templateManifest}
            screens={templateScreens}
            currentScreenId={previewScreenId}
            setCurrentScreenId={setPreviewScreenId}
            onAction={handlePreviewAction}
            isMobile={false}
          />
        </div>
      )}
    </div>
  );
}

function Published({ data, onFinish, showToast, isMobile }) {
  const [copied, setCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const appName = data.appName || "Your App";
  const slug = appName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const storeUrl = `dukadesk.app/${slug}`;
  const qrSize = isMobile ? 120 : 160;

  useEffect(() => { QRCode.toDataURL(`https://${storeUrl}`, { width: qrSize * 2, margin: 1 }).then(setQrDataUrl).catch(() => {}); }, [storeUrl, qrSize]);

  const copy = () => { navigator.clipboard.writeText(storeUrl); setCopied(true); showToast("Store link copied!", "success"); setTimeout(() => setCopied(false), 2000); };

  const generatedCode = {
    app: { name: appName, slug, url: storeUrl, tagline: data.tagline, category: data.category, template: data.template, color: data.color },
    business: { description: data.bizDesc, phone: data.phone, address: data.address },
    integrations: data.selectedIntegrations.map(name => ({ name, active: true })),
    config: { support: true, qrCode: true, orderingEnabled: true },
  };

  const codeStr = JSON.stringify(generatedCode, null, 2);

  const copyCode = () => {
    navigator.clipboard.writeText(codeStr);
    setCodeCopied(true);
    showToast("App code copied!", "success");
    setTimeout(() => setCodeCopied(false), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F7F8FA", display: "flex", alignItems: "center", justifyContent: "center", padding: isMobile ? 16 : 40 }}>
      <div style={{ textAlign: "center", maxWidth: 780, animation: "slideUp 0.5s ease" }}>
        <div style={{ width: 80, height: 80, background: "#F0FDF4", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 40 }}>🎉</div>
        <h1 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: isMobile ? 32 : 44, color: NAVY, marginBottom: 8 }}>Your App is Ready!</h1>
        <p style={{ color: "#6B7280", fontSize: isMobile ? 16 : 18, marginBottom: 32 }}>{appName} has been built and saved. 🚀</p>

        <div style={{ background: "#fff", borderRadius: 16, padding: isMobile ? 24 : 36, boxShadow: "0 4px 24px rgba(0,0,0,0.06)", marginBottom: 24, border: "1px solid #E8E8F0", textAlign: "left" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 48, height: 48, background: data.color + "15", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{data.logo || "📱"}</div>
            <div>
              <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 18, color: NAVY }}>{appName}</div>
              <div style={{ color: "#9CA3AF", fontSize: 13 }}>{data.tagline || data.category} · {data.template}</div>
            </div>
            <span style={{ marginLeft: "auto", background: "#F0FDF4", color: "#065F46", fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 20 }}>● Built</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 16 }}>
            {[
              { label: "Category", value: data.category },
              { label: "Template", value: data.template },
              { label: "Integrations", value: data.selectedIntegrations.length + " selected" },
              { label: "Store URL", value: storeUrl },
            ].map((r, i) => (
              <div key={i} style={{ background: "#F9FAFB", borderRadius: 8, padding: "10px 14px" }}>
                <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 2 }}>{r.label}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: NAVY }}>{r.value}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setShowCode(!showCode)} style={{ background: "none", border: "1.5px solid #E8E8F0", borderRadius: 10, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", color: NAVY, flex: 1 }}>{showCode ? "Hide App Code" : "View App Code"}</button>
            <button onClick={copyCode} style={{ background: codeCopied ? "#2ECC71" : AMBER, color: codeCopied ? "#fff" : NAVY, border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", flex: 1 }}>{codeCopied ? "Copied! ✓" : "Copy App Code"}</button>
          </div>
          {showCode && (
            <pre style={{ background: "#1A1A2E", color: "#E8E8F0", borderRadius: 10, padding: 16, marginTop: 12, fontSize: 12, lineHeight: 1.6, overflowX: "auto", maxHeight: 300, textAlign: "left", whiteSpace: "pre-wrap", fontFamily: "'Fira Code','Cascadia Code',monospace" }}>{codeStr}</pre>
          )}
        </div>

        <div style={{ background: "#fff", borderRadius: 16, padding: isMobile ? 24 : 36, boxShadow: "0 4px 24px rgba(0,0,0,0.06)", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 24 : 40, textAlign: "left", marginBottom: 32, border: "1px solid #E8E8F0" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 16, color: NAVY, marginBottom: 16 }}>Your QR Code</div>
            {qrDataUrl ? <img src={qrDataUrl} alt="QR code" style={{ width: qrSize, height: qrSize, borderRadius: 12, margin: "0 auto 16px", display: "block" }} /> : <div style={{ width: qrSize, height: qrSize, background: "#F3F4F6", borderRadius: 12, margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: isMobile ? 60 : 80 }}>▣</div>}
            <div style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 16, wordBreak: "break-all" }}>{storeUrl}</div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button onClick={() => {
                if (!qrDataUrl) { showToast("QR code not ready", "error"); return; }
                const a = document.createElement("a"); a.href = qrDataUrl; a.download = `${slug}-qr.png`; a.click();
                showToast("QR code downloaded!", "success");
              }} style={{ background: AMBER, color: NAVY, border: "none", borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>⬇ Download PNG</button>
              <button onClick={copy} style={{ background: copied ? "#2ECC71" : "none", color: copied ? "#fff" : NAVY, border: `1.5px solid ${copied ? "#2ECC71" : "#E8E8F0"}`, borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{copied ? "Copied! ✓" : "Copy Link"}</button>
            </div>
          </div>
          <div>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 16, color: NAVY, marginBottom: 16 }}>What Happens Next</div>
            {WIZARD_PUBLISH_STEPS.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 14, alignItems: "flex-start" }}>
                <div style={{ width: 26, height: 26, background: AMBER, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: NAVY, flexShrink: 0 }}>{i + 1}</div>
                <span style={{ fontSize: 14, color: "#374151", lineHeight: 1.5 }}>{step}</span>
              </div>
            ))}
          </div>
        </div>
        <button onClick={onFinish} style={{ background: AMBER, color: NAVY, border: "none", borderRadius: 10, padding: "14px 40px", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}>Go to My Dashboard →</button>
      </div>
    </div>
  );
}

function InteractivePreview({ manifest, screens, currentScreenId, setCurrentScreenId, onAction, openCustomize, branding, isMobile }) {
  const tabs = manifest?.navigation?.tabs || [];
  const brandColor = manifest?.theme?.primaryColor || branding?.color || AMBER;
  const storeName = manifest?.branding?.appName || branding?.appName || "Your App";
  const tagline = manifest?.branding?.tagline || branding?.tagline || "";
  
  const isDark = (hex) => {
    if (!hex) return false;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.5;
  };
  
  const isDarkMode = isDark(brandColor);
  const textColor = isDarkMode ? "#fff" : "#0F0F1A";
  const inactiveColor = isDarkMode ? "rgba(255,255,255,0.5)" : "#6B7280";
  const activeTextColor = isDarkMode ? "#0F0F1A" : "#fff";
  const headerBg = `linear-gradient(180deg, ${brandColor} 0%, ${brandColor}DD 100%)`;
  
  const getContrastColor = (hex) => {
    if (!hex) return "#fff";
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.5 ? "#fff" : "#0F0F1A";
  };
  
  const brandContrastColor = getContrastColor(brandColor);
  
  const handleDeliveryPickupClick = (type) => {
    console.log(`${type} selected`);
  };
  
  const handlePreviewAction = (actionKey, payload) => {
    console.log("Preview action:", actionKey, payload);
    if (onAction) onAction(actionKey, payload);
};
  
  return (
    <div style={{ 
      width: isMobile ? "calc(100vw - 32px)" : 390, 
      maxWidth: 390, 
      background: NAVY, 
      borderRadius: 44, 
      padding: "12px", 
      boxShadow: "0 40px 120px rgba(0,0,0,0.6)", 
      position: "relative", 
      margin: "0 auto",
      minHeight: isMobile ? 500 : 760,
      display: "flex",
      flexDirection: "column"
    }}>
      <div style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", width: 120, height: 32, background: NAVY, borderRadius: "0 0 20px 20px", zIndex: 10 }} />
      <div style={{ background: "#fff", borderRadius: 36, overflow: "hidden", position: "relative", flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
        <div onClick={() => {}} style={{ position: "absolute", top: 16, right: 16, zIndex: 10 }}>
          <div style={{ width: 36, height: 36, background: AMBER, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 16px rgba(0,0,0,0.3)", border: "2px solid rgba(255,255,255,0.6)" }}>
            <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: 16, color: NAVY }}>D</span>
          </div>
        </div>

        {manifest?.navigation?.tabs && manifest.navigation.tabs.length > 0 ? (
          <>
            <div style={{ background: headerBg, padding: "48px 16px 16px", minHeight: 140, position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, backgroundImage: "url('data:image/svg+xml,%3Csvg width=%2760%27 height=%2760%27 viewBox=%270 0 60 60%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg fill=%27none%27 fill-rule=%27evenodd%27%3E%3Cg fill=%27%23ffffff%27 fill-opacity=%270.03%27%3E%3Cpath d=%27M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }} />
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>🟢 Open Now · 4.8 ⭐</div>
              <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 22, color: "#fff", marginBottom: 10 }}>{storeName}</div>
              {tagline && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", marginBottom: 10 }}>{tagline}</div>}
              <div style={{ display: "flex", gap: 8 }}>
                {["Delivery", "Pickup"].map(t => (
                  <button 
                    key={t} 
                    onClick={() => handleDeliveryPickupClick(t)}
                    style={{ 
                      padding: "7px 18px", 
                      borderRadius: 20, 
                      border: `1.5px solid ${t === "Delivery" ? "#fff" : "rgba(255,255,255,0.3)"}`, 
                      background: t === "Delivery" ? "#fff" : "transparent", 
                      color: t === "Delivery" ? brandColor : "#fff", 
                      fontSize: 13, 
                      fontWeight: t === "Delivery" ? 700 : 400, 
                      cursor: "pointer" 
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ padding: "12px 12px 4px", display: "flex", gap: 8, overflowX: "auto", background: "#fff", borderBottom: "1px solid #F3F4F6" }}>
              {tabs.map((tab, idx) => (
                <button 
                  key={tab.screenId}
                  onClick={() => setCurrentScreenId(tab.screenId)}
                  style={{ 
                    padding: "6px 14px", 
                    borderRadius: 20, 
                    border: `1.5px solid ${currentScreenId === tab.screenId ? brandColor : "#E5E7EB"}`, 
                    background: currentScreenId === tab.screenId ? brandColor : "#fff", 
                    color: currentScreenId === tab.screenId ? (isDarkMode ? activeTextColor : NAVY) : inactiveColor, 
                    fontSize: 12, 
                    fontWeight: currentScreenId === tab.screenId ? 600 : 400, 
                    cursor: "pointer", 
                    whiteSpace: "nowrap",
                    display: "flex",
                    alignItems: "center",
                    gap: 4
                  }}
                >
                  {tab.icon && <span>{tab.icon}</span>}
                  {tab.label}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div style={{ padding: "48px 16px", textAlign: "center", color: "#9CA3AF" }}>
            <div style={{ fontSize: 14 }}>No navigation configured</div>
          </div>
        )}

        <div style={{ flex: 1, overflow: "auto", background: "#F9FAFB", padding: 16 }}>
          {manifest && screens[currentScreenId] && manifest.category && manifest.template ? (
            <TemplatePreview
              templateId={`${manifest.category.toLowerCase()}/${manifest.template.toLowerCase().replace(/\s+/g, '-')}`}
              initialScreenId={currentScreenId}
              onScreenChange={setCurrentScreenId}
            />
          ) : (
            <FallbackPreview branding={branding || { appName: "Your App", tagline: "", color: AMBER }} screenId={currentScreenId} onAction={handlePreviewAction} />
          )}
        </div>

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 60, background: "#fff", borderTop: "1px solid #E5E7EB", display: "flex", zIndex: 40 }}>
          {tabs.map(t => (
            <div 
              key={t.id} 
              onClick={() => setCurrentScreenId(t.screenId)} 
              style={{ 
                flex: 1, 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center", 
                justifyContent: "center", 
                gap: 2, 
                cursor: "pointer",
                padding: "8px 0",
                color: currentScreenId === t.screenId ? brandColor : inactiveColor
              }}
            >
              <span style={{ fontSize: 20 }}>{t.icon || "📱"}</span>
              <span style={{ fontSize: 10, fontWeight: currentScreenId === t.screenId ? 700 : 400 }}>{t.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FallbackPreview({ branding, screenId, onAction }) {
  const brandColor = branding?.color || AMBER;
  const storeName = branding?.appName || "Your App";
  const pv = WIZARD_PREVIEW_DATA.Restaurant;
  
  if (screenId === "menu") {
    return (
      <div>
        <div style={{ background: `linear-gradient(135deg, ${brandColor}, ${darken(brandColor, 20)})`, padding: "48px 16px 16px", minHeight: 140, position: "relative" }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>🟢 Open Now · 4.8 ⭐</div>
          <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 22, color: "#fff", marginBottom: 10 }}>{storeName}</div>
          {branding?.tagline && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", marginBottom: 10 }}>{branding.tagline}</div>}
          <div style={{ display: "flex", gap: 8 }}>
            {["Delivery", "Pickup"].map(t => (
              <button key={t} style={{ padding: "7px 18px", borderRadius: 20, border: `1.5px solid rgba(255,255,255,0.3)`, background: "transparent", color: "#fff", fontSize: 13, fontWeight: 400, cursor: "pointer" }}>{t}</button>
            ))}
          </div>
        </div>
        <div style={{ padding: "12px 12px 4px", display: "flex", gap: 8, overflowX: "auto", background: "#fff", borderBottom: "1px solid #F3F4F6" }}>
          <button style={{ padding: "6px 14px", borderRadius: 20, border: `1.5px solid ${brandColor}`, background: brandColor, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>🔥 All</button>
          {pv.categories.map(c => (
            <button key={c} style={{ padding: "6px 14px", borderRadius: 20, border: `1.5px solid #E5E7EB`, background: "#fff", color: "#6B7280", fontSize: 12, fontWeight: 400, cursor: "pointer", whiteSpace: "nowrap" }}>{c}</button>
          ))}
        </div>
        <div style={{ padding: "8px 12px", background: "#F9FAFB" }}>
          {pv.items.slice(0, 6).map(item => (
            <div key={item.id} style={{ display: "flex", gap: 10, padding: "12px 10px", background: "#fff", borderRadius: 10, marginBottom: 8, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <div style={{ width: 60, height: 60, background: "#F3F4F6", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>{item.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: NAVY, marginBottom: 3 }}>{item.name}</div>
                <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 6, lineHeight: 1.3 }}>{item.desc}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 14, color: brandColor }}>{item.price}</span>
                  <button onClick={() => onAction?.("add_to_cart", { item })} style={{ background: AMBER, color: NAVY, border: "none", borderRadius: 16, padding: "5px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Add +</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ position: "sticky", bottom: 0, background: "#fff", borderTop: "1px solid #E5E7EB", padding: "8px 12px", display: "flex", gap: 8 }}>
          {[{ id:"menu", icon: "🏠", label: "Menu" }, { id:"orders", icon: "📦", label: "Orders" }, { id:"reserve", icon: "📅", label: "Reserve" }, { id:"info", icon: "ℹ️", label: "Info" }].map(t => (
            <div key={t.id} onClick={() => {}} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, cursor: "pointer" }}>
              <span style={{ fontSize: 16 }}>{t.icon}</span>
              <span style={{ fontSize: 9, color: t.id === "menu" ? brandColor : "#9CA3AF", fontWeight: t.id === "menu" ? 700 : 400 }}>{t.label}</span>
            </div>
          ))}
        </div>
      </div>
);
    }
}

function darken(hex, percent) {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, (num >> 16) - amt);
  const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
  const B = Math.max(0, (num & 0x0000FF) - amt);
  return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}