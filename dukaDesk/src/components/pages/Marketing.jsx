import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, X, ArrowLeft, Tag, Percent, Calendar, Users, Bell, Edit3 } from "lucide-react";
import { useIsMobile } from "../../hooks/useMediaQuery";
import { useToast } from "../../contexts";
import { NAVY, AMBER, GREEN, RED, PURPLE, TEAL, cardStyle, inputStyle, labelStyle, btnPrimary, btnSecondary, statCard, pageHeading, pageSubtitle, transition } from "../../theme";

const MOCK_COUPONS = [
  { id: 1, code: "WELCOME10", type: "percentage", value: 10, usage: 45, maxUsage: 100, minOrder: 2000, expires: "2026-09-30", status: "Active" },
  { id: 2, code: "FREESHIP", type: "fixed", value: 500, usage: 23, maxUsage: 50, minOrder: 3000, expires: "2026-08-15", status: "Active" },
  { id: 3, code: "SUMMER25", type: "percentage", value: 25, usage: 12, maxUsage: 200, minOrder: 5000, expires: "2026-07-25", status: "Active" },
  { id: 4, code: "HALFPRICE", type: "percentage", value: 50, usage: 0, maxUsage: 10, minOrder: 10000, expires: "2026-07-01", status: "Expired" },
];

const MOCK_CAMPAIGNS = [
  { id: 1, name: "Weekend Special", type: "push", audience: "All Customers", sent: 1240, opened: 380, status: "Sent", date: "Jul 18" },
  { id: 2, name: "New Menu Launch", type: "push", audience: "Active Customers", sent: 860, opened: 290, status: "Scheduled", date: "Jul 25" },
  { id: 3, name: "Loyalty Rewards", type: "sms", audience: "VIP Customers", sent: 120, opened: 85, status: "Draft", date: "-" },
];

export default function Marketing() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const showToast = useToast();
  const [tab, setTab] = useState("coupons");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ code: "", type: "percentage", value: "", minOrder: "", maxUsage: "", expires: "" });

  const handleCreate = async () => {
    if (!form.code || !form.value) { showToast("Code and value are required", "error"); return; }
    await new Promise(r => setTimeout(r, 400));
    showToast(`Coupon "${form.code}" created!`, "success");
    setShowCreate(false);
    setForm({ code: "", type: "percentage", value: "", minOrder: "", maxUsage: "", expires: "" });
  };

  return (
    <div style={{ animation: "fadeIn 0.35s ease" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 4 }}>
        <div>
          <button onClick={() => navigate("/dashboard")} style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 14, marginBottom: 8, padding: 0 }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          <h2 style={pageHeading}>Marketing</h2>
          <p style={pageSubtitle}>Manage promotions, coupons, and campaigns</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {["coupons", "campaigns"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "8px 20px", borderRadius: 8, border: "none",
            background: tab === t ? AMBER : "#F3F4F6",
            color: tab === t ? NAVY : "#6B7280",
            fontSize: 14, fontWeight: tab === t ? 700 : 500, cursor: "pointer", textTransform: "capitalize", transition,
          }}>{t === "coupons" ? "Coupons & Discounts" : "Campaigns"}</button>
        ))}
      </div>

      {tab === "coupons" && (
        <>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
            <button onClick={() => setShowCreate(true)} style={btnPrimary}>
              <Plus size={16} /> Create Coupon
            </button>
          </div>

          <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
            {MOCK_COUPONS.length === 0 ? (
              <div style={{ padding: 60, textAlign: "center", color: "#9CA3AF" }}>
                <Tag size={32} style={{ marginBottom: 8, opacity: 0.5 }} />
                <div style={{ fontSize: 14 }}>No coupons yet</div>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
                  <thead>
                    <tr style={{ background: "#F9FAFB", borderBottom: "1px solid var(--border)" }}>
                      {["Code", "Type", "Value", "Usage", "Min Order", "Expires", "Status"].map(h => (
                        <th key={h} style={{ padding: "12px 16px", fontSize: 12, fontWeight: 600, color: "#6B7280", textAlign: "left", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_COUPONS.map((c, i) => (
                      <tr key={c.id} style={{ borderBottom: "1px solid #F3F4F6", animation: `fadeIn 0.2s ease ${i * 0.05}s both` }}>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 13, color: NAVY, background: "#FFF8ED", padding: "3px 8px", borderRadius: 4 }}>{c.code}</span>
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: 13, color: "#6B7280", textTransform: "capitalize" }}>{c.type}</td>
                        <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 700, color: AMBER }}>
                          {c.type === "percentage" ? `${c.value}%` : `₦${c.value.toLocaleString()}`}
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: 13, color: NAVY }}>{c.usage}/{c.maxUsage}</td>
                        <td style={{ padding: "12px 16px", fontSize: 13, color: "#6B7280" }}>₦{c.minOrder.toLocaleString()}</td>
                        <td style={{ padding: "12px 16px", fontSize: 12, color: "#9CA3AF" }}>{c.expires}</td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{
                            padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                            background: c.status === "Active" ? "#F0FDF4" : "#F3F4F6",
                            color: c.status === "Active" ? "#065F46" : "#6B7280",
                          }}>{c.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {tab === "campaigns" && (
        <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
              <thead>
                <tr style={{ background: "#F9FAFB", borderBottom: "1px solid var(--border)" }}>
                  {["Name", "Type", "Audience", "Sent", "Opened", "Status", "Date"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", fontSize: 12, fontWeight: 600, color: "#6B7280", textAlign: "left", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_CAMPAIGNS.map((c, i) => (
                  <tr key={c.id} style={{ borderBottom: "1px solid #F3F4F6", animation: `fadeIn 0.2s ease ${i * 0.05}s both` }}>
                    <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: NAVY }}>{c.name}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#6B7280", textTransform: "capitalize" }}>{c.type}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#6B7280" }}>{c.audience}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: NAVY }}>{c.sent.toLocaleString()}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: NAVY }}>{c.opened.toLocaleString()}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{
                        padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                        background: c.status === "Sent" ? "#F0FDF4" : c.status === "Scheduled" ? "#EFF6FF" : "#F3F4F6",
                        color: c.status === "Sent" ? "#065F46" : c.status === "Scheduled" ? "#1E40AF" : "#6B7280",
                      }}>{c.status}</span>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: "#9CA3AF" }}>{c.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showCreate && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(15,15,26,0.5)", animation: "fadeIn 0.2s ease" }} onClick={() => setShowCreate(false)}>
          <div style={{ ...cardStyle, width: "100%", maxWidth: 440, animation: "fadeScaleIn 0.3s ease" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 18, color: NAVY }}>Create Coupon</h3>
              <button onClick={() => setShowCreate(false)} style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer" }}><X size={18} /></button>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Coupon Code</label>
              <input style={{ ...inputStyle, fontFamily: "monospace", textTransform: "uppercase" }} value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="SUMMER20" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Type</label>
                <select style={inputStyle} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Value</label>
                <input type="number" style={inputStyle} value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} placeholder={form.type === "percentage" ? "10" : "500"} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Min Order (₦)</label>
                <input type="number" style={inputStyle} value={form.minOrder} onChange={e => setForm(f => ({ ...f, minOrder: e.target.value }))} placeholder="0" />
              </div>
              <div>
                <label style={labelStyle}>Max Usage</label>
                <input type="number" style={inputStyle} value={form.maxUsage} onChange={e => setForm(f => ({ ...f, maxUsage: e.target.value }))} placeholder="Unlimited" />
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Expires</label>
              <input type="date" style={inputStyle} value={form.expires} onChange={e => setForm(f => ({ ...f, expires: e.target.value }))} />
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button onClick={() => setShowCreate(false)} style={btnSecondary}>Cancel</button>
              <button onClick={handleCreate} style={btnPrimary}>Create Coupon</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
