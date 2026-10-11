import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useIsMobile } from "../../hooks/useMediaQuery";
import { NAVY, AMBER } from "../../theme";
import { setSetupData, getSetupData, deployApp } from "../../services/api";
import { WIZARD_CATEGORIES, WIZARD_ALWAYS_INCLUDED, WIZARD_INTEGRATIONS, WIZARD_COLORS, WIZARD_DAYS, getTemplateIntegrationNames } from "../../config/wizard";
import { INTEGRATION_BADGE_COLORS } from "../../config/integrations";
import { loadAllTemplateScreens } from "../../services/TemplateLoader";
import { generateShopTemplate } from "../../services/TemplateGenerator";
import { resolveTemplateId } from "../../services/staticTemplates";
import { SetupWizard } from "./SetupWizard";
import { TemplatePreview } from "../template/TemplateRenderer";
import { Check, Edit2 } from "lucide-react";

const CATEGORY_TO_TEMPLATE = {
  Restaurant: "Restaurant / Cafe",
  Ecommerce: "Retail / Shop",
  "Food Vendor": "Restaurant / Cafe",
  Grocery: "Retail / Shop",
  Church: "Custom",
  School: "Custom",
  Booking: "Custom",
};

export default function Wizard() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const saved = getSetupData();
  const defaultHours = () => WIZARD_DAYS.map((d, i) => ({ day: d, open: i < 5, start: "09:00", end: "22:00" }));
  const [published, setPublished] = useState(false);
  const [previewData, setPreviewData] = useState({ manifest: null, screens: {} });
  const [previewScreenId, setPreviewScreenId] = useState("menu");
  const [showCustomize, setShowCustomize] = useState(false);
  const [customizeTemplateId, setCustomizeTemplateId] = useState(null);

  const initialData = saved ? {
    category: saved.category,
    template: saved.template,
    logo: saved.logo,
    appName: saved.appName,
    tagline: saved.tagline,
    color: saved.color,
    selectedIntegrations: saved.selectedIntegrations,
    bizDesc: saved.bizDesc,
    phone: saved.phone,
    address: saved.address,
    hours: saved.hours,
  } : null;

  const loadPreview = useCallback(async (category, template) => {
    if (!category || !template) return;
    const templateId = resolveTemplateId(category, template);
    try {
      const { manifest, screens } = await loadAllTemplateScreens(templateId);
       return { manifest, screens };
    } catch {
       const generatedCategory = category || String(template).split("/")[0].replace(/-/g, " ").replace(/\b\w/g, letter => letter.toUpperCase());
       const generatedTemplate = String(template).split("/").pop().replace(/-/g, " ").replace(/\b\w/g, letter => letter.toUpperCase());
       const generated = generateShopTemplate({
         category: generatedCategory, template: generatedTemplate,
        appName: "", tagline: "", color: AMBER, logo: null,
        businessName: "", bizDesc: "", phone: "", address: "",
        hours: defaultHours(), selectedIntegrations: [],
      });
       return {
         manifest: generated,
         screens: Object.fromEntries((generated.screens || []).map(screen => [screen.screenId, screen])),
       };
    }
  }, []);

  const handlePreviewAction = useCallback((actionKey, payload) => {
    if (actionKey === "navigate" && payload?.push) {
      const screenMatch = payload.push.match(/\/([^/]+)$/);
      if (screenMatch) {
        const newScreenId = screenMatch[1].replace(/-/g, '');
        const found = previewData.manifest?.screens?.find(s => s.id === newScreenId || s.id.replace(/-/g, '') === newScreenId);
        if (found) setPreviewScreenId(found.id);
      }
    }
  }, [previewData.manifest]);

  const openCustomize = useCallback(() => {
    const { category, template } = initialData || {};
    if (category && template) {
      setCustomizeTemplateId(resolveTemplateId(category, template));
      setShowCustomize(true);
    }
  }, [initialData]);

  const handleComplete = useCallback(async (data) => {
    setSetupData({ category: data.category, template: data.template, appName: data.appName, tagline: data.tagline, color: data.color, logo: data.logo, selectedIntegrations: data.selectedIntegrations, bizDesc: data.bizDesc, phone: data.phone, address: data.address, hours: data.hours });
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
      toast.error(err.message || "Failed to deploy app");
    }
  }, []);

  const renderPreview = useCallback(() => (
    <TemplatePreview
       templateId={previewData.manifest?.templateId}
       initialScreenId={previewScreenId}
       manifest={previewData.manifest}
       screens={previewData.screens}
       onScreenChange={setPreviewScreenId}
     />
  ), [previewData, previewScreenId, handlePreviewAction, openCustomize]);

  if (published) return <Published data={initialData} isMobile={isMobile} navigate={navigate} />;

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
    <SetupWizard
      initialData={initialData}
      onComplete={handleComplete}
      onSkipToEditor={() => navigate("/canvas-editor")}
      showPreview={!isMobile}
      loadPreview={loadPreview}
      previewProps={{ renderPreview }}
      sidebarStyle="wizard"
      title="DukaDesk"
      subtitle="App Setup Wizard"
      isMobile={isMobile}
    />
  );
}

function Published({ data, isMobile, navigate }) {
  const appName = data?.appName || "Your App";

  return (
    <div style={{ minHeight: "100vh", background: "#F7F8FA", display: "flex", alignItems: "center", justifyContent: "center", padding: isMobile ? 16 : 40 }}>
      <div style={{ textAlign: "center", maxWidth: 680, animation: "slideUp 0.5s ease" }}>
        <div style={{ width: 72, height: 72, background: "#FFF7E8", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}><Check size={32} color={NAVY} /></div>
        <h1 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: isMobile ? 30 : 40, color: NAVY, marginBottom: 8 }}>Setup saved</h1>
        <p style={{ color: "#6B7280", fontSize: isMobile ? 16 : 18, marginBottom: 28 }}>{appName} is not live yet. Finish building the app, then submit it for admin review.</p>
        <div style={{ background: "#fff", borderRadius: 16, padding: isMobile ? 22 : 30, boxShadow: "0 4px 24px rgba(0,0,0,0.06)", marginBottom: 24, border: "1px solid #E8E8F0", textAlign: "left" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
            <div style={{ width: 48, height: 48, background: (data?.color || AMBER) + "15", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{data?.logo || <Edit2 size={22} color={NAVY} />}</div>
            <div>
              <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 18, color: NAVY }}>{appName}</div>
              <div style={{ color: "#9CA3AF", fontSize: 13 }}>{data?.tagline || data?.category} | {data?.template}</div>
            </div>
            <span style={{ marginLeft: "auto", background: "#FFF7E8", color: "#8A5A00", fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 20 }}>Draft</span>
          </div>
          <p style={{ color: "#4B5563", lineHeight: 1.6, margin: 0 }}>After you submit from the app builder, an administrator will review the saved design. Public links and QR codes become available after approval.</p>
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => navigate("/canvas-editor")} style={{ background: AMBER, color: NAVY, border: "none", borderRadius: 10, padding: "14px 32px", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'Sora',sans-serif", display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Edit2 size={18} /> Continue in App Builder
          </button>
          <button onClick={() => navigate("/dashboard")} style={{ background: "none", color: NAVY, border: "2px solid #E8E8F0", borderRadius: 10, padding: "14px 32px", fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}>Go to dashboard</button>
        </div>
      </div>
    </div>
  );
}
