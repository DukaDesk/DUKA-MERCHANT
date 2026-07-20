import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "../../hooks/useMediaQuery";
import { NAVY, AMBER, inputStyle, labelStyle, cardStyle } from "../../theme";
import { useToast } from "../../contexts";
import { getMerchant, setSetupData, getSetupData, updateTenant } from "../../services/api";
import { Store, Building2, FileText, CheckCircle, ArrowLeft, ArrowRight, Upload, X, ShieldCheck } from "lucide-react";

const STEPS = [
  { id: "business", label: "Business Info", icon: Building2 },
  { id: "verification", label: "Verification", icon: FileText },
  { id: "review", label: "Review", icon: CheckCircle },
];

export default function Compliance() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const showToast = useToast();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const saved = getSetupData() || {};
  const [form, setForm] = useState({
    businessName: saved.businessName || "",
    regNumber: saved.regNumber || "",
    taxId: saved.taxId || "",
    address: saved.address || "",
    city: saved.city || "",
    state: saved.state || "",
    country: saved.country || "Nigeria",
    phone: saved.phone || "",
    website: saved.website || "",
    businessType: saved.businessType || "",
    idDoc: saved.idDoc || null,
    bizDoc: saved.bizDoc || null,
    utrDoc: saved.utrDoc || null,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (getSetupData()?.complianceDone) {
      setDone(true);
    }
  }, []);

  const validate = () => {
    const e = {};
    if (step === 0) {
      if (!form.businessName.trim()) e.businessName = "Business name is required";
      if (!form.address.trim()) e.address = "Business address is required";
      if (!form.phone.trim()) e.phone = "Phone number is required";
    }
    if (step === 1) {
      if (!form.idDoc) e.idDoc = "ID document is required";
      if (!form.bizDoc) e.bizDoc = "Business document is required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    if (step < 2) setStep(s => s + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(s => s - 1);
  };

  const handleSkip = () => {
    navigate("/dashboard");
  };

  const handleComplete = async () => {
    setSaving(true);
    try {
      const merchant = getMerchant();
      if (merchant?.tenantId) {
        await updateTenant(merchant.tenantId, {
          name: form.businessName,
          phone: form.phone,
          address: `${form.address}, ${form.city}, ${form.state}, ${form.country}`,
        }).catch(() => {});
      }
      setSetupData({ ...form, complianceDone: true });
      showToast("Compliance submitted! Now pick a template.", "success");
      navigate("/desk-design");
    } catch {
      showToast("Failed to save compliance data", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleFile = (field) => (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast("File too large. Max 5MB.", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setForm(f => ({ ...f, [field]: { name: file.name, data: ev.target.result } }));
    reader.readAsDataURL(file);
  };

  const removeFile = (field) => setForm(f => ({ ...f, [field]: null }));

  if (done) {
    return (
      <div style={{ animation: "fadeIn 0.35s ease", maxWidth: 640, margin: "0 auto", textAlign: "center", paddingTop: 60 }}>
        <div style={{ width: 72, height: 72, background: "#F0FDF4", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <ShieldCheck size={36} color="#2ECC71" />
        </div>
        <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 28, color: NAVY, margin: "0 0 8px" }}>Compliance Verified</h2>
        <p style={{ color: "#6B7280", fontSize: 15, marginBottom: 28 }}>Your business verification is complete. You can now design your app.</p>
        <button onClick={() => navigate("/desk-design")} style={{ background: AMBER, color: NAVY, border: "none", borderRadius: 10, padding: "12px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
          Go to Desk Design →
        </button>
        <button onClick={() => navigate("/dashboard")} style={{ display: "block", margin: "12px auto 0", background: "none", border: "none", color: "#6B7280", fontSize: 14, cursor: "pointer" }}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={{ animation: "fadeIn 0.35s ease", maxWidth: 720, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
        <div>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: isMobile ? 22 : 28, color: NAVY, margin: "0 0 6px" }}>Business Compliance</h2>
          <p style={{ color: "#6B7280", fontSize: 14, margin: 0 }}>Verify your business to unlock Desk Design and go live.</p>
        </div>
        <button onClick={handleSkip} style={{ background: "none", border: "1.5px solid #E8E8F0", borderRadius: 8, padding: "8px 16px", fontSize: 13, color: "#6B7280", cursor: "pointer", fontWeight: 500 }}>
          Skip for now
        </button>
      </div>

      <div style={{ display: "flex", gap: isMobile ? 4 : 8, marginBottom: 36 }}>
        {STEPS.map((s, i) => {
          const active = i === step;
          const complete = i < step;
          return (
            <div key={s.id} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{
                width: "100%", height: 4, borderRadius: 4,
                background: complete ? "#2ECC71" : active ? AMBER : "#E8E8F0",
                transition: "all 0.3s",
              }} />
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: complete ? "#2ECC71" : active ? AMBER : "#F3F4F6",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.3s",
                }}>
                  {complete ? <CheckCircle size={14} color="#fff" /> : <s.icon size={14} color={active ? "#fff" : "#9CA3AF"} />}
                </div>
                {!isMobile && <span style={{ fontSize: 12, fontWeight: active ? 700 : 500, color: active ? NAVY : complete ? "#2ECC71" : "#9CA3AF" }}>{s.label}</span>}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ ...cardStyle, padding: isMobile ? 20 : 32 }}>
        {step === 0 && (
          <div>
            <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 18, color: NAVY, margin: "0 0 24px" }}>Business Information</h3>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
              <div style={{ gridColumn: isMobile ? "1" : "1 / -1" }}>
                <label style={labelStyle}>Business Name *</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <Store size={16} style={{ position: "absolute", left: 12, color: "#9CA3AF" }} />
                  <input value={form.businessName} onChange={e => setForm(f => ({ ...f, businessName: e.target.value }))} placeholder="Your registered business name" style={{ ...inputStyle, paddingLeft: 36, borderColor: errors.businessName ? "#E74C3C" : undefined }} />
                </div>
                {errors.businessName && <div style={{ color: "#E74C3C", fontSize: 12, marginTop: 4 }}>{errors.businessName}</div>}
              </div>
              <div>
                <label style={labelStyle}>Business Type</label>
                <select value={form.businessType} onChange={e => setForm(f => ({ ...f, businessType: e.target.value }))} style={{ ...inputStyle, appearance: "none" }}>
                  <option value="">Select type</option>
                  <option value="Restaurant">Restaurant / Food Service</option>
                  <option value="Retail">Retail / Ecommerce</option>
                  <option value="Service">Service Provider</option>
                  <option value="School">School / Education</option>
                  <option value="Church">Church / Religious</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Registration Number</label>
                <input value={form.regNumber} onChange={e => setForm(f => ({ ...f, regNumber: e.target.value }))} placeholder="RC or CAC number" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Tax ID (TIN)</label>
                <input value={form.taxId} onChange={e => setForm(f => ({ ...f, taxId: e.target.value }))} placeholder="Tax Identification Number" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Phone Number *</label>
                <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+234 801 234 5678" style={{ ...inputStyle, borderColor: errors.phone ? "#E74C3C" : undefined }} />
                {errors.phone && <div style={{ color: "#E74C3C", fontSize: 12, marginTop: 4 }}>{errors.phone}</div>}
              </div>
              <div>
                <label style={labelStyle}>Website (optional)</label>
                <input value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="https://example.com" style={inputStyle} />
              </div>
              <div style={{ gridColumn: isMobile ? "1" : "1 / -1" }}>
                <label style={labelStyle}>Business Address *</label>
                <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Street address" style={{ ...inputStyle, borderColor: errors.address ? "#E74C3C" : undefined }} />
                {errors.address && <div style={{ color: "#E74C3C", fontSize: 12, marginTop: 4 }}>{errors.address}</div>}
              </div>
              <div>
                <label style={labelStyle}>City</label>
                <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="Lagos" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>State</label>
                <input value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} placeholder="Lagos State" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Country</label>
                <select value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} style={{ ...inputStyle, appearance: "none" }}>
                  <option>Nigeria</option>
                  <option>Ghana</option>
                  <option>Kenya</option>
                  <option>South Africa</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 18, color: NAVY, margin: "0 0 24px" }}>Verification Documents</h3>
            <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 24 }}>Upload clear scans or photos of the following documents.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { field: "idDoc", label: "Government ID", desc: "Valid passport, driver's license, or national ID", accept: "image/*,.pdf" },
                { field: "bizDoc", label: "Business Registration", desc: "CAC certificate or business registration document", accept: "image/*,.pdf" },
                { field: "utrDoc", label: "Utility Bill / Address Proof", desc: "Recent utility bill or bank statement (optional)", accept: "image/*,.pdf" },
              ].map((doc) => (
                <div key={doc.field} style={{ background: "#FAFAFA", borderRadius: 10, padding: 16, border: errors[doc.field] ? "1.5px solid #E74C3C" : "1px solid #E8E8F0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: NAVY }}>{doc.label}</div>
                      <div style={{ fontSize: 12, color: "#6B7280" }}>{doc.desc}</div>
                    </div>
                    {form[doc.field] ? (
                      <button onClick={() => removeFile(doc.field)} style={{ background: "#FEF2F2", border: "none", borderRadius: 8, padding: "6px 10px", color: "#E74C3C", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                        <X size={14} /> Remove
                      </button>
                    ) : (
                      <label style={{ background: AMBER, color: NAVY, border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                        <Upload size={14} /> Upload
                        <input type="file" accept={doc.accept} onChange={handleFile(doc.field)} style={{ display: "none" }} />
                      </label>
                    )}
                  </div>
                  {form[doc.field] && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, padding: "8px 12px", background: "#F0FDF4", borderRadius: 8 }}>
                      <CheckCircle size={16} color="#2ECC71" />
                      <span style={{ fontSize: 13, color: "#065F46" }}>{form[doc.field].name}</span>
                    </div>
                  )}
                  {errors[doc.field] && <div style={{ color: "#E74C3C", fontSize: 12, marginTop: 4 }}>{errors[doc.field]}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 18, color: NAVY, margin: "0 0 8px" }}>Review & Submit</h3>
            <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 24 }}>Please review your information before submitting.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Business Name", value: form.businessName },
                { label: "Business Type", value: form.businessType || "—" },
                { label: "Registration Number", value: form.regNumber || "—" },
                { label: "Tax ID", value: form.taxId || "—" },
                { label: "Phone", value: form.phone },
                { label: "Address", value: `${form.address}, ${form.city}, ${form.state}, ${form.country}` },
                { label: "ID Document", value: form.idDoc?.name || "Not uploaded" },
                { label: "Business Document", value: form.bizDoc?.name || "Not uploaded" },
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: "#F9FAFB", borderRadius: 8 }}>
                  <span style={{ fontSize: 13, color: "#6B7280" }}>{r.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32, paddingTop: 20, borderTop: "1px solid #E8E8F0" }}>
          <button onClick={handleBack} disabled={step === 0} style={{
            padding: "10px 24px", borderRadius: 10, border: "1.5px solid #E8E8F0",
            background: "#fff", color: step === 0 ? "#D1D5DB" : "#6B7280",
            fontWeight: 600, cursor: step === 0 ? "not-allowed" : "pointer",
            fontSize: 14, display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit",
          }}>
            <ArrowLeft size={16} /> Back
          </button>
          {step < 2 ? (
            <button onClick={handleNext} style={{
              padding: "10px 28px", borderRadius: 10, background: AMBER, color: NAVY,
              border: "none", fontWeight: 700, cursor: "pointer", fontSize: 14,
              display: "flex", alignItems: "center", gap: 6, fontFamily: "'Sora',sans-serif",
            }}>
              Continue <ArrowRight size={16} />
            </button>
          ) : (
            <button onClick={handleComplete} disabled={saving} style={{
              padding: "10px 28px", borderRadius: 10, background: AMBER, color: NAVY,
              border: "none", fontWeight: 700, cursor: saving ? "wait" : "pointer",
              fontSize: 14, display: "flex", alignItems: "center", gap: 6, fontFamily: "'Sora',sans-serif",
            }}>
              <ShieldCheck size={16} /> {saving ? "Submitting..." : "Submit & Continue"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
