import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "../../hooks/useMediaQuery";
import { useAuth, useToast } from "../../contexts";
import { NAVY, AMBER, GREEN, PURPLE, cardStyle, inputStyle, labelStyle, btnPrimary, btnSecondary, pageHeading, pageSubtitle, transition } from "../../theme";
import { Store, Mail, Phone, MapPin, Globe, Clock, Save, ArrowLeft, Building, Palette, RefreshCw } from "lucide-react";
import { getMerchant, updateTenant, getTenantConfig, updateTenantConfig } from "../../services/api";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function Settings() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const showToast = useToast();
  const { merchant } = useAuth();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    businessName: "My Store",
    businessDescription: "Your favorite local business serving quality products and services.",
    email: "merchant@example.com",
    phone: "+234 800 000 0000",
    address: "12 Admiralty Way, Lekki Phase 1",
    city: "Lagos",
    country: "Nigeria",
    website: "",
    timezone: "Africa/Lagos",
    hours: { Monday: "09:00 - 18:00", Tuesday: "09:00 - 18:00", Wednesday: "09:00 - 18:00", Thursday: "09:00 - 18:00", Friday: "09:00 - 17:00", Saturday: "10:00 - 15:00", Sunday: "Closed" },
    accentColor: AMBER,
    logo: null,
  });

  useEffect(() => {
    const tenantId = merchant?.tenantId || getMerchant()?.tenantId;
    if (tenantId) {
      updateTenant(tenantId, {}).then(t => {
        if (t) setForm(f => ({ ...f, businessName: t.name || f.businessName }));
      }).catch(() => {});
      getTenantConfig(tenantId).then(cfg => {
        if (cfg) {
          setForm(f => ({
            ...f,
            ...cfg,
            businessName: cfg.businessName || f.businessName,
            hours: cfg.hours || f.hours,
            accentColor: cfg.accentColor || f.accentColor,
          }));
        }
      }).catch(() => {});
    }
    const saved = localStorage.getItem("dd_settings");
    if (saved) {
      try { setForm(prev => ({ ...prev, ...JSON.parse(saved) })); } catch { /* ignore */ }
    }
    setLoading(false);
  }, []);

  const handleChange = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleHourChange = (day, value) => setForm(f => ({ ...f, hours: { ...f.hours, [day]: value } }));

  const handleSave = async () => {
    setSaving(true);
    const tenantId = merchant?.tenantId || getMerchant()?.tenantId;
    try {
      if (tenantId) {
        await updateTenant(tenantId, { name: form.businessName });
        await updateTenantConfig(tenantId, {
          businessName: form.businessName,
          businessDescription: form.businessDescription,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          country: form.country,
          website: form.website,
          timezone: form.timezone,
          hours: form.hours,
          accentColor: form.accentColor,
        });
      }
      localStorage.setItem("dd_settings", JSON.stringify(form));
      showToast("Settings saved successfully!", "success");
    } catch {
      localStorage.setItem("dd_settings", JSON.stringify(form));
      showToast("Settings saved locally!", "success");
    }
    setSaving(false);
  };

  return (
    <div style={{ animation: "fadeIn 0.35s ease", maxWidth: 800 }}>
      <button onClick={() => navigate("/dashboard")} style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 14, marginBottom: 12, padding: 0 }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </button>
      <h2 style={pageHeading}>Settings</h2>
      <p style={pageSubtitle}>Manage your business configuration and branding</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, background: `${AMBER}15`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Building size={18} color={AMBER} />
            </div>
            <div>
              <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 16, color: NAVY }}>Business Information</div>
              <div style={{ fontSize: 13, color: "#6B7280" }}>Your public business details</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
            <div>
              <label htmlFor="settings-business-name" style={labelStyle}>Business Name</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <Store size={16} style={{ position: "absolute", left: 12, color: "#9CA3AF" }} />
                <input id="settings-business-name" name="settings-business-name" style={{ ...inputStyle, paddingLeft: 36 }} value={form.businessName} onChange={e => handleChange("businessName", e.target.value)} placeholder="Business name" />
              </div>
            </div>
            <div>
              <label htmlFor="settings-website" style={labelStyle}>Website</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <Globe size={16} style={{ position: "absolute", left: 12, color: "#9CA3AF" }} />
                <input id="settings-website" name="settings-website" style={{ ...inputStyle, paddingLeft: 36 }} value={form.website} onChange={e => handleChange("website", e.target.value)} placeholder="https://example.com" />
              </div>
            </div>
            <div style={{ gridColumn: isMobile ? "auto" : "1 / -1" }}>
              <label htmlFor="settings-description" style={labelStyle}>Business Description</label>
              <textarea id="settings-description" name="settings-description" style={{ ...inputStyle, height: 80, padding: 12, resize: "vertical" }} value={form.businessDescription} onChange={e => handleChange("businessDescription", e.target.value)} placeholder="Describe your business" />
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, background: `${GREEN}15`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Phone size={18} color={GREEN} />
            </div>
            <div>
              <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 16, color: NAVY }}>Contact Information</div>
              <div style={{ fontSize: 13, color: "#6B7280" }}>How customers can reach you</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
            <div>
              <label htmlFor="settings-email" style={labelStyle}>Email</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <Mail size={16} style={{ position: "absolute", left: 12, color: "#9CA3AF" }} />
                <input id="settings-email" name="settings-email" style={{ ...inputStyle, paddingLeft: 36 }} value={form.email} onChange={e => handleChange("email", e.target.value)} placeholder="Email address" />
              </div>
            </div>
            <div>
              <label htmlFor="settings-phone" style={labelStyle}>Phone</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <Phone size={16} style={{ position: "absolute", left: 12, color: "#9CA3AF" }} />
                <input id="settings-phone" name="settings-phone" style={{ ...inputStyle, paddingLeft: 36 }} value={form.phone} onChange={e => handleChange("phone", e.target.value)} placeholder="Phone number" />
              </div>
            </div>
            <div>
              <label htmlFor="settings-address" style={labelStyle}>Address</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <MapPin size={16} style={{ position: "absolute", left: 12, color: "#9CA3AF" }} />
                <input id="settings-address" name="settings-address" style={{ ...inputStyle, paddingLeft: 36 }} value={form.address} onChange={e => handleChange("address", e.target.value)} placeholder="Street address" />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label htmlFor="settings-city" style={labelStyle}>City</label>
                <input id="settings-city" name="settings-city" style={inputStyle} value={form.city} onChange={e => handleChange("city", e.target.value)} placeholder="City" />
              </div>
              <div>
                <label htmlFor="settings-country" style={labelStyle}>Country</label>
                <input id="settings-country" name="settings-country" style={inputStyle} value={form.country} onChange={e => handleChange("country", e.target.value)} placeholder="Country" />
              </div>
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, background: `${PURPLE}15`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Clock size={18} color={PURPLE} />
            </div>
            <div>
              <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 16, color: NAVY }}>Business Hours</div>
              <div style={{ fontSize: 13, color: "#6B7280" }}>When your business is open</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
            {DAYS.map(day => {
              const dayId = `settings-hours-${day.toLowerCase()}`;
              return (
              <div key={day}>
                <label htmlFor={dayId} style={{ ...labelStyle, marginBottom: 4, fontSize: 12 }}>{day}</label>
                <input id={dayId} name={dayId} style={inputStyle} value={form.hours[day] || ""} onChange={e => handleHourChange(day, e.target.value)} placeholder="Closed" />
              </div>);
            })}
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, background: `${AMBER}15`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Palette size={18} color={AMBER} />
            </div>
            <div>
              <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 16, color: NAVY }}>Branding</div>
              <div style={{ fontSize: 13, color: "#6B7280" }}>Customize your app appearance</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
            <div>
              <label htmlFor="settings-accent-color" style={labelStyle}>Accent Color</label>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input id="settings-accent-color" name="settings-accent-color" type="color" value={form.accentColor} onChange={e => handleChange("accentColor", e.target.value)}
                  style={{ width: 48, height: 48, borderRadius: 10, border: "1.5px solid var(--border)", cursor: "pointer", padding: 2 }} />
                <span style={{ fontSize: 13, color: "#6B7280", fontFamily: "monospace" }}>{form.accentColor}</span>
              </div>
            </div>
            <div>
              <label htmlFor="settings-timezone" style={labelStyle}>Timezone</label>
              <select id="settings-timezone" name="settings-timezone" style={inputStyle} value={form.timezone} onChange={e => handleChange("timezone", e.target.value)}>
                <option value="Africa/Lagos">Africa/Lagos (UTC+1)</option>
                <option value="Africa/Nairobi">Africa/Nairobi (UTC+3)</option>
                <option value="Africa/Cairo">Africa/Cairo (UTC+2)</option>
                <option value="Africa/Johannesburg">Africa/Johannesburg (UTC+2)</option>
                <option value="America/New_York">America/New_York (UTC-5)</option>
                <option value="Europe/London">Europe/London (UTC+0)</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", paddingTop: 4 }}>
          <button onClick={() => navigate("/dashboard")} style={btnSecondary}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.7 : 1 }}>
            <Save size={16} /> {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
