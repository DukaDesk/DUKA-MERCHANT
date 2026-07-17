import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode";
import { useToast } from "../../contexts";
import { useIsMobile } from "../../hooks/useMediaQuery";
import { NAVY, AMBER } from "../../theme";
import { setSetupData, getSetupData, deployApp } from "../../services/api";
import { WIZARD_CATEGORIES, WIZARD_TEMPLATES_BY_CATEGORY, WIZARD_ALWAYS_INCLUDED, WIZARD_INTEGRATIONS, WIZARD_COLORS, WIZARD_DAYS, WIZARD_PUBLISH_STEPS, INTEGRATION_BADGE_COLORS, getTemplateIntegrationNames } from "../../services/mockData";
import { loadAllTemplateScreens } from "../../services/TemplateLoader";
import { generateShopTemplate } from "../../services/TemplateGenerator";
import { SetupWizard } from "./SetupWizard";
import { InteractivePreview } from "../template/TemplateRenderer";
import { Share2, Download, QrCode, ExternalLink, Edit2 } from "lucide-react";

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
  const showToast = useToast();
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
    const templateId = `${category.toLowerCase()}/${template.toLowerCase().replace(/\s+/g, '-')}`;
    try {
      const { manifest, screens } = await loadAllTemplateScreens(templateId);
      setPreviewData({ manifest, screens });
      setPreviewScreenId(manifest?.navigation?.initialScreen || "menu");
    } catch {
      const generated = generateShopTemplate({
        category, template,
        appName: "", tagline: "", color: AMBER, logo: null,
        businessName: "", bizDesc: "", phone: "", address: "",
        hours: defaultHours(), selectedIntegrations: [],
      });
      setPreviewData({ manifest: generated, screens: {} });
      setPreviewScreenId(generated.navigation?.initialScreen || "menu");
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
      const templateId = `${category.toLowerCase()}/${template.toLowerCase().replace(/\s+/g, '-')}`;
      setCustomizeTemplateId(templateId);
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
      showToast(err.message || "Failed to deploy app", "error");
    }
  }, [showToast]);

  const renderPreview = useCallback((props) => (
    <InteractivePreview
      manifest={previewData.manifest}
      screens={previewData.screens}
      currentScreenId={previewScreenId}
      setCurrentScreenId={setPreviewScreenId}
      onAction={handlePreviewAction}
      openCustomize={openCustomize}
      branding={props.branding}
      isMobile={false}
    />
  ), [previewData, previewScreenId, handlePreviewAction, openCustomize]);

  if (published) return <Published data={initialData} showToast={showToast} isMobile={isMobile} navigate={navigate} />;

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

function Published({ data, showToast, isMobile, navigate }) {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [shareSupported, setShareSupported] = useState(false);
  const appName = data?.appName || "Your App";
  const slug = appName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const storeUrl = `dukadesk.app/${slug}`;
  const qrSize = isMobile ? 120 : 160;
  const fullUrl = `https://${storeUrl}`;

  useEffect(() => {
    QRCode.toDataURL(fullUrl, { width: qrSize * 2, margin: 1 }).then(setQrDataUrl).catch(() => {});
    setShareSupported(navigator.share !== undefined);
  }, [fullUrl, qrSize]);

  const copy = () => { navigator.clipboard.writeText(fullUrl); setCopied(true); showToast("Store link copied!", "success"); setTimeout(() => setCopied(false), 2000); };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: appName, text: `Check out my app: ${appName}`, url: fullUrl });
      } catch (e) { if (e.name !== "AbortError") copy(); }
    } else {
      copy();
    }
  };

  const downloadQR = () => {
    if (!qrDataUrl) { showToast("QR code not ready", "error"); return; }
    const a = document.createElement("a"); a.href = qrDataUrl; a.download = `${slug}-qr.png`; a.click();
    showToast("QR code downloaded!", "success");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F7F8FA", display: "flex", alignItems: "center", justifyContent: "center", padding: isMobile ? 16 : 40 }}>
      <div style={{ textAlign: "center", maxWidth: 780, animation: "slideUp 0.5s ease" }}>
        <div style={{ width: 80, height: 80, background: "#F0FDF4", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 40 }}>🎉</div>
        <h1 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: isMobile ? 32 : 44, color: NAVY, marginBottom: 8 }}>Your App is Ready!</h1>
        <p style={{ color: "#6B7280", fontSize: isMobile ? 16 : 18, marginBottom: 32 }}>{appName} has been built and saved. 🚀</p>

        <div style={{ background: "#fff", borderRadius: 16, padding: isMobile ? 24 : 36, boxShadow: "0 4px 24px rgba(0,0,0,0.06)", marginBottom: 24, border: "1px solid #E8E8F0", textAlign: "left" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 48, height: 48, background: (data?.color || AMBER) + "15", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{data?.logo || "📱"}</div>
            <div>
              <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 18, color: NAVY }}>{appName}</div>
              <div style={{ color: "#9CA3AF", fontSize: 13 }}>{data?.tagline || data?.category} · {data?.template}</div>
            </div>
            <span style={{ marginLeft: "auto", background: "#F0FDF4", color: "#065F46", fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 20 }}>● Built</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 16 }}>
            {[
              { label: "Category", value: data?.category },
              { label: "Template", value: data?.template },
              { label: "Integrations", value: (data?.selectedIntegrations?.length || 0) + " selected" },
              { label: "Store URL", value: storeUrl },
            ].map((r, i) => (
              <div key={i} style={{ background: "#F9FAFB", borderRadius: 8, padding: "10px 14px" }}>
                <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 2 }}>{r.label}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: NAVY }}>{r.value}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button onClick={handleShare} style={{ background: shareSupported ? "#2563EB" : AMBER, color: "#fff", border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Share2 size={14} /> {shareSupported ? "Share App" : "Copy Link"}
            </button>
            <button onClick={downloadQR} style={{ background: AMBER, color: NAVY, border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Download size={14} /> Download QR
            </button>
            <button onClick={copy} style={{ background: copied ? "#2ECC71" : "none", color: copied ? "#fff" : NAVY, border: `1.5px solid ${copied ? "#2ECC71" : "#E8E8F0"}`, borderRadius: 10, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
              <QrCode size={14} /> {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 16, padding: isMobile ? 24 : 36, boxShadow: "0 4px 24px rgba(0,0,0,0.06)", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 24 : 40, textAlign: "left", marginBottom: 32, border: "1px solid #E8E8F0" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 16, color: NAVY, marginBottom: 16 }}>Your QR Code</div>
            {qrDataUrl ? <img src={qrDataUrl} alt="QR code" style={{ width: qrSize, height: qrSize, borderRadius: 12, margin: "0 auto 16px", display: "block" }} /> : <div style={{ width: qrSize, height: qrSize, background: "#F3F4F6", borderRadius: 12, margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: isMobile ? 60 : 80 }}>▣</div>}
            <div style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 16, wordBreak: "break-all" }}>{fullUrl}</div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={downloadQR} style={{ background: AMBER, color: NAVY, border: "none", borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Download size={14} /> Download PNG
              </button>
              <button onClick={copy} style={{ background: copied ? "#2ECC71" : "none", color: copied ? "#fff" : NAVY, border: `1.5px solid ${copied ? "#2ECC71" : "#E8E8F0"}`, borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
                <QrCode size={14} /> {copied ? "Copied!" : "Copy Link"}
              </button>
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
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => navigate("/dashboard")} style={{ background: AMBER, color: NAVY, border: "none", borderRadius: 10, padding: "14px 40px", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}>Go to My Dashboard →</button>
          <button onClick={() => navigate("/canvas-editor")} style={{ background: "none", color: NAVY, border: "2px solid #E8E8F0", borderRadius: 10, padding: "14px 40px", fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "'Sora',sans-serif", display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Edit2 size={18} /> Open in Canvas Editor
          </button>
        </div>
      </div>
    </div>
  );
}