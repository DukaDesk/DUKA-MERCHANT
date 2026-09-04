import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "../../hooks/useMediaQuery";
import { NAVY, AMBER, cardStyle } from "../../theme";
import { toast } from "react-toastify";
import { setSetupData, getSetupData, deployApp, getMerchant, saveDesignData } from "../../services/api";
import { loadTemplateForCanvas } from "../../services/staticTemplates";
import { Store, Sparkles } from "lucide-react";
import TemplateGallery from "../app-builder/TemplateGallery";

export default function DeskDesign() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);

  const saved = getSetupData() || {};

  const handleSelect = (templateName) => setSelected(templateName);

  const handleApply = async () => {
    if (!selected) { toast.error("Please select a template first"); return; }
    setSaving(true);
    try {
      const merchant = getMerchant();
      const tmpl = selected;
      const appData = {
        appName: saved.appName || merchant?.business || "My App",
        category: saved.category || "Restaurant",
        template: tmpl,
        color: saved.color || AMBER,
        tagline: saved.tagline || "",
        bizDesc: saved.bizDesc || "",
        phone: saved.phone || "",
        address: saved.address || "",
        hours: saved.hours || [],
        selectedIntegrations: saved.selectedIntegrations || [],
      };
      await deployApp(appData);
      setSetupData({ ...saved, template: tmpl, category: appData.category });

      const design = await loadTemplateForCanvas(tmpl);
      await saveDesignData(design);
      try { localStorage.setItem("dukadesk_design", JSON.stringify(design)); } catch { /* ignore */ }

      toast.success("Template applied! Loading into Canvas...");
      navigate("/canvas-editor");
    } catch {
      toast.error("Failed to apply template");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ animation: "fadeIn 0.35s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: isMobile ? 22 : 28, color: NAVY, margin: "0 0 6px" }}>Desk Design</h2>
          <p style={{ color: "#6B7280", fontSize: 14, margin: 0 }}>Choose a template to power your customer-facing app.</p>
        </div>
      </div>

      <div style={{ ...cardStyle, padding: isMobile ? 16 : 28, marginTop: 20 }}>
        <TemplateGallery value={selected} onChange={handleSelect} isMobile={isMobile} />
      </div>

      {selected && (
        <div style={{ position: "sticky", bottom: 0, background: "#fff", borderTop: "1px solid #E8E8F0", padding: "12px 0", marginTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Sparkles size={18} color={AMBER} />
            <span style={{ fontWeight: 600, fontSize: 14, color: NAVY }}>Selected: <span style={{ color: AMBER }}>{selected}</span></span>
          </div>
          <button onClick={handleApply} disabled={saving} style={{
            background: AMBER, color: NAVY, border: "none", borderRadius: 10,
            padding: "10px 28px", fontSize: 14, fontWeight: 700,
            cursor: saving ? "wait" : "pointer", display: "flex", alignItems: "center", gap: 6,
            fontFamily: "'Sora',sans-serif",
          }}>
            <Store size={16} /> {saving ? "Applying..." : "Apply Template"}
          </button>
        </div>
      )}
    </div>
  );
}
