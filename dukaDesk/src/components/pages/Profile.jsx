import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "../../hooks/useMediaQuery";
import { useAuth, useToast } from "../../App";
import { NAVY, AMBER, cardStyle, inputStyle, labelStyle } from "../../theme";
import { getMerchantProfile, updateMerchantProfile } from "../../services/api";
import { Loading } from "../layout/States";
import { Store, Mail, Phone, User, Save, ArrowLeft } from "lucide-react";

export default function Profile() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const showToast = useToast();
  const { merchant: contextMerchant, handleAuth } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: "", business: "", email: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMerchantProfile().then(m => {
      setProfile(m);
      setForm({ name: m.name || "", business: m.business || "", email: m.email || "", phone: m.phone || "" });
    }).catch(() => showToast("Failed to load profile", "error"))
    .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!form.name.trim() || !form.business.trim()) { showToast("Name and business name are required", "error"); return; }
    setSaving(true);
    try {
      const updated = await updateMerchantProfile({ name: form.name, business: form.business, email: form.email, phone: form.phone });
      setProfile(updated);
      handleAuth(updated);
      showToast("Profile updated!", "success");
    } catch {
      showToast("Failed to update profile", "error");
    } finally { setSaving(false); }
  };

  if (loading) return <Loading message="Loading profile..." />;

  return (
    <div style={{ animation: "fadeIn 0.35s ease", maxWidth: 720 }}>
      <button onClick={() => navigate("/dashboard")} style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 14, marginBottom: 12, padding: 0 }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </button>
      <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: isMobile ? 22 : 28, color: NAVY, margin: "0 0 6px" }}>Profile</h2>
      <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 24 }}>Manage your merchant account</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ ...cardStyle, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 64, height: 64, background: `linear-gradient(135deg, ${AMBER}, #E8910A)`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 800, color: NAVY, flexShrink: 0 }}>
            {profile?.avatar?.[0] || profile?.name?.[0] || "M"}
          </div>
          <div>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 18, color: NAVY }}>{profile?.name || "Merchant"}</div>
            <div style={{ fontSize: 14, color: "#6B7280" }}>{profile?.business || ""}</div>
            <div style={{ fontSize: 13, color: "#9CA3AF", marginTop: 4 }}>
              Joined {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "recently"}
            </div>
          </div>
        </div>

        <div style={{ ...cardStyle }}>
          <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 16, color: NAVY, marginBottom: 20 }}>Account Details</div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <User size={16} style={{ position: "absolute", left: 12, color: "#9CA3AF" }} />
                <input style={{ ...inputStyle, paddingLeft: 36 }} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Business Name</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <Store size={16} style={{ position: "absolute", left: 12, color: "#9CA3AF" }} />
                <input style={{ ...inputStyle, paddingLeft: 36 }} value={form.business} onChange={e => setForm(f => ({ ...f, business: e.target.value }))} placeholder="Business name" />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <Mail size={16} style={{ position: "absolute", left: 12, color: "#9CA3AF" }} />
                <input style={{ ...inputStyle, paddingLeft: 36 }} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="Email address" />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Phone</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <Phone size={16} style={{ position: "absolute", left: 12, color: "#9CA3AF" }} />
                <input style={{ ...inputStyle, paddingLeft: 36 }} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="Phone number" />
              </div>
            </div>
          </div>
          <button onClick={handleSave} disabled={saving} style={{ marginTop: 20, background: AMBER, color: NAVY, border: "none", borderRadius: 10, padding: "10px 28px", fontSize: 14, fontWeight: 700, cursor: saving ? "wait" : "pointer", display: "flex", alignItems: "center", gap: 8 }}>
            <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
