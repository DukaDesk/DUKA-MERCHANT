import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "../../hooks/useMediaQuery";
import { useAuth } from "../../contexts";
import { toast } from "react-toastify";
import { NAVY, AMBER, cardStyle, inputStyle, labelStyle } from "../../theme";
import { getMerchantProfile, updateMerchantProfile, getCurrentPlan, deactivateAccount, reactivateAccount, permanentlyDeleteAccount, getDeactivationStatus } from "../../services/api";
import { Loading, ErrorState } from "../layout/States";
import { Store, Mail, Phone, User, Save, ArrowLeft, Sparkles, AlertTriangle, Undo2, Trash2, X } from "lucide-react";

export default function Profile() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { merchant: contextMerchant, handleAuth, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: "", business: "", email: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [deactivation, setDeactivation] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [busy, setBusy] = useState(false);

  const loadProfile = () => {
    setError(null);
    setLoading(true);
    getMerchantProfile().then(m => {
      setProfile(m);
      setForm({ name: m.name || "", business: m.business || "", email: m.email || "", phone: m.phone || "" });
    }).catch(() => setError("Failed to load profile"))
    .finally(() => setLoading(false));
    getCurrentPlan().then(p => setCurrentPlan(p)).catch(() => {});
    getDeactivationStatus().then(s => setDeactivation(s)).catch(() => {});
  };
  useEffect(loadProfile, []);

  const handleSave = async () => {
    if (!form.name.trim() || !form.business.trim()) { toast.error("Name and business name are required"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { toast.error("Invalid email format"); return; }
    if (form.phone && !/^[\d\s\+\-\(\)]{7,20}$/.test(form.phone)) { toast.error("Invalid phone number format"); return; }
    setSaving(true);
    try {
      const updated = await updateMerchantProfile({ name: form.name, business: form.business, email: form.email, phone: form.phone });
      setProfile(updated);
      handleAuth(updated);
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile");
    } finally { setSaving(false); }
  };

  const handleDeactivate = async () => {
    setBusy(true);
    try {
      await deactivateAccount();
      toast.success("Account scheduled for deletion (30 days). You can reactivate during this window.");
      const s = await getDeactivationStatus();
      setDeactivation(s);
    } catch {
      toast.error("Failed to deactivate account");
    } finally { setBusy(false); }
  };

  const handleReactivate = async () => {
    setBusy(true);
    try {
      await reactivateAccount();
      setDeactivation(null);
      toast.success("Account reactivated!");
    } catch {
      toast.error("Failed to reactivate account");
    } finally { setBusy(false); }
  };

  const handlePermanentDelete = async () => {
    if (confirmText.toLowerCase() !== "delete") { toast.error("Type DELETE PERMANENTLY to confirm"); return; }
    setBusy(true);
    try {
      await permanentlyDeleteAccount();
      toast.success("Account permanently deleted");
      logout();
      navigate("/login");
    } catch {
      toast.error("Failed to delete account");
    } finally { setBusy(false); setDeleteModal(false); }
  };

  const isDeactivated = !!(deactivation && (deactivation.status === "deactivated" || deactivation.deactivatedAt));
  const remainingDays = deactivation?.daysRemaining ?? deactivation?.remainingDays;

  if (loading) return <Loading message="Loading profile..." />;
  if (error) return <ErrorState message={error} onRetry={loadProfile} />;

  return (
    <div style={{ animation: "fadeIn 0.35s ease", maxWidth: 720 }}>
      <button onClick={() => navigate("/dashboard")} style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 14, marginBottom: 12, padding: 0 }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </button>
      <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: isMobile ? 22 : 28, color: NAVY, margin: "0 0 6px" }}>Profile</h2>
      <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 24 }}>Manage your merchant account</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ ...cardStyle, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 64, height: 64, background: `linear-gradient(135deg, ${AMBER}, #E8910A)`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 800, color: NAVY, flexShrink: 0, boxShadow: `0 4px 12px ${AMBER}40` }}>
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

        {currentPlan && currentPlan.plan === "Starter Plan" && (
          <div style={{ ...cardStyle, background: "linear-gradient(135deg, rgba(244,160,38,0.08), rgba(244,160,38,0.02))", border: "1px solid rgba(244,160,38,0.2)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, background: `${AMBER}20`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Sparkles size={20} color={AMBER} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: NAVY }}>{currentPlan.plan}</div>
                <div style={{ fontSize: 13, color: "#6B7280" }}>{currentPlan.label}</div>
              </div>
            </div>
            <button onClick={() => navigate("/dashboard/billing")} style={{ background: AMBER, color: NAVY, border: "none", borderRadius: 8, padding: "8px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
              Upgrade â†‘
            </button>
          </div>
        )}

        <div style={{ ...cardStyle }}>
          <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 16, color: NAVY, marginBottom: 20 }}>Account Details</div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
            <div>
              <label htmlFor="profile-full-name" style={labelStyle}>Full Name</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <User size={16} style={{ position: "absolute", left: 12, color: "#9CA3AF" }} />
                <input id="profile-full-name" name="profile-full-name" style={{ ...inputStyle, paddingLeft: 36 }} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" />
              </div>
            </div>
            <div>
              <label htmlFor="profile-business-name" style={labelStyle}>Business Name</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <Store size={16} style={{ position: "absolute", left: 12, color: "#9CA3AF" }} />
                <input id="profile-business-name" name="profile-business-name" style={{ ...inputStyle, paddingLeft: 36 }} value={form.business} onChange={e => setForm(f => ({ ...f, business: e.target.value }))} placeholder="Business name" />
              </div>
            </div>
            <div>
              <label htmlFor="profile-email" style={labelStyle}>Email</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <Mail size={16} style={{ position: "absolute", left: 12, color: "#9CA3AF" }} />
                <input id="profile-email" name="profile-email" style={{ ...inputStyle, paddingLeft: 36 }} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="Email address" />
              </div>
            </div>
            <div>
              <label htmlFor="profile-phone" style={labelStyle}>Phone</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <Phone size={16} style={{ position: "absolute", left: 12, color: "#9CA3AF" }} />
                <input id="profile-phone" name="profile-phone" style={{ ...inputStyle, paddingLeft: 36 }} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="Phone number" />
              </div>
            </div>
          </div>
          <button onClick={handleSave} disabled={saving} style={{ marginTop: 20, background: AMBER, color: NAVY, border: "none", borderRadius: 10, padding: "10px 28px", fontSize: 14, fontWeight: 700, cursor: saving ? "wait" : "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s" }}>
            <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <div style={{ ...cardStyle, border: "1px solid rgba(220,38,38,0.25)", background: "linear-gradient(135deg, rgba(220,38,38,0.04), rgba(220,38,38,0.01))" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <AlertTriangle size={18} color="#DC2626" />
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 16, color: NAVY }}>Account</div>
          </div>
          <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 16px", lineHeight: 1.6 }}>
            Deactivating schedules account deletion in 30 days — you can reactivate anytime during that window. Deleting permanently is immediate and irreversible.
          </p>

          {isDeactivated ? (
            <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "14px 16px", marginBottom: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#DC2626" }}>Account scheduled for deletion</div>
              <div style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>
                {remainingDays != null && remainingDays > 0
                  ? `Permanently deleted in approximately ${remainingDays} day${remainingDays === 1 ? "" : "s"}.`
                  : "Deletion is in progress."}
              </div>
            </div>
          ) : null}

          <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 12 }}>
            <button onClick={isDeactivated ? handleReactivate : handleDeactivate} disabled={busy} style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "12px 16px", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: busy ? "wait" : "pointer",
              background: isDeactivated ? "#F0FDF4" : "#fff", color: isDeactivated ? "#16A34A" : "#DC2626",
              border: isDeactivated ? "1.5px solid #86EFAC" : "1.5px solid #FCA5A5", transition: "all 0.15s",
            }}>
              {isDeactivated ? <><Undo2 size={16} /> Reactivate account</> : <><Undo2 size={16} /> Deactivate account</>}
            </button>
            <button onClick={() => { setConfirmText(""); setDeleteModal(true); }} disabled={busy} style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "12px 16px", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: busy ? "wait" : "pointer",
              background: "#DC2626", color: "#fff", border: "none", transition: "all 0.15s",
            }}>
              <Trash2 size={16} /> Delete permanently
            </button>
          </div>
        </div>
      </div>

      {deleteModal && (
        <div onClick={() => !busy && setDeleteModal(false)} style={{
          position: "fixed", inset: 0, zIndex: 99999, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.2s ease", padding: 20,
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "#fff", borderRadius: 16, maxWidth: 420, width: "100%", padding: 32,
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)", animation: "scaleIn 0.25s ease",
          }}>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
              <button onClick={() => !busy && setDeleteModal(false)} style={{ background: "none", border: "none", cursor: busy ? "not-allowed" : "pointer", color: "#9CA3AF" }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ width: 52, height: 52, background: "#FEF2F2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Trash2 size={26} color="#DC2626" />
            </div>
            <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 18, color: NAVY, margin: "0 0 8px", textAlign: "center" }}>Delete account permanently?</h3>
            <p style={{ color: "#6B7280", fontSize: 14, margin: "0 0 20px", lineHeight: 1.6, textAlign: "center" }}>
              This permanently deletes your account and all associated data. This action <strong>cannot be undone</strong>.
            </p>
            <label htmlFor="delete-confirm" style={labelStyle}>Type DELETE to confirm</label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <input id="delete-confirm" name="delete-confirm" value={confirmText} onChange={e => setConfirmText(e.target.value)} disabled={busy} placeholder="DELETE" style={{ ...inputStyle, textTransform: confirmText ? "uppercase" : "none", borderColor: confirmText.toLowerCase() === "delete" ? "#DC2626" : undefined }} autoFocus />
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              <button onClick={() => setDeleteModal(false)} disabled={busy} style={{ flex: 1, background: "#fff", border: "1px solid #E8E8F0", borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 600, color: "#6B7280", cursor: busy ? "not-allowed" : "pointer" }}>Cancel</button>
              <button onClick={handlePermanentDelete} disabled={busy || confirmText.toLowerCase() !== "delete"} style={{ flex: 1, background: "#DC2626", color: "#fff", border: "none", borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 700, cursor: busy || confirmText.toLowerCase() !== "delete" ? "not-allowed" : "pointer", opacity: busy || confirmText.toLowerCase() !== "delete" ? 0.5 : 1 }}>
                {busy ? "Deleting..." : "Delete permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
