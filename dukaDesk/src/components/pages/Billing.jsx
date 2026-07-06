import { useState, useEffect } from "react";
import { X, Download } from "lucide-react";
import { useToast } from "../../App";
import { useIsMobile } from "../../hooks/useMediaQuery";
import { NAVY, AMBER, inputStyle, labelStyle, cardStyle } from "../../theme";
import { getCurrentPlan, getPlans, getBillingHistory, upgradePlan } from "../../services/api";
import { Loading, Empty } from "../layout/States";

export default function Billing() {
  const showToast = useToast();
  const isMobile = useIsMobile();
  const [currentPlan, setCurrentPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const [history, setHistory] = useState([]);
  const [upgradeModal, setUpgradeModal] = useState(null);
  const [payStep, setPayStep] = useState(0);
  const [cardNum, setCardNum] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(true);
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    Promise.all([getCurrentPlan(), getPlans(), getBillingHistory()])
      .then(([cp, p, h]) => { setCurrentPlan(cp); setPlans(p); setHistory(h); })
      .catch(() => showToast("Failed to load billing info", "error"))
      .finally(() => setLoading(false));
  }, []);

  const handleUpgrade = async () => {
    if (!cardNum || !expiry || !cvv) { showToast("Please fill in all card details", "error"); return; }
    setPayStep(2);
    try {
      await upgradePlan({ planName: upgradeModal.name, cardNumber: cardNum, expiry, cvv });
      setTimeout(() => { setUpgradeModal(null); setPayStep(0); showToast(`Upgraded to ${upgradeModal.name} plan! 🎉`, "success"); }, 1500);
    } catch { showToast("Upgrade failed. Please try again.", "error"); setPayStep(0); }
  };

  if (loading) return <Loading message="Loading billing info..." />;
  if (!currentPlan && plans.length === 0) return <Empty icon="💳" message="No billing data available" sub="Your subscription information will appear here" />;

  return (
    <div>
      <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: isMobile ? 22 : 28, color: NAVY, margin: "0 0 24px" }}>Billing & Subscription</h2>

      {currentPlan && (
        <div style={{ background: `linear-gradient(135deg, ${AMBER}, #E8910A)`, borderRadius: 16, padding: isMobile ? 20 : 32, marginBottom: 24, display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "stretch" : "center", gap: isMobile ? 16 : 0 }}>
          <div>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: isMobile ? 22 : 28, color: "#fff", marginBottom: 4 }}>{currentPlan.plan}</div>
            <div style={{ color: "rgba(255,255,255,0.85)", fontSize: isMobile ? 16 : 18, marginBottom: 8 }}>{currentPlan.label}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {currentPlan.features.map((f, i) => (
                <div key={i} style={{ color: "rgba(255,255,255,0.9)", fontSize: 14 }}>✓ {f}</div>
              ))}
            </div>
          </div>
          <div style={{ textAlign: isMobile ? "left" : "right" }}>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginBottom: 8 }}>Renews: {currentPlan.renews}</div>
            <button onClick={() => setUpgradeModal(plans.find(p => !p.current) || plans[0])} style={{ background: "#fff", color: AMBER, border: "none", borderRadius: 24, padding: "12px 28px", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}>Upgrade Plan →</button>
          </div>
        </div>
      )}

      <div style={{ ...cardStyle, marginBottom: 24, overflowX: "auto" }}>
        <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: isMobile ? 18 : 22, color: NAVY, margin: "0 0 24px", textAlign: "center" }}>Choose the Right Plan</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: isMobile ? 600 : "auto" }}>
          <thead>
            <tr>
              <th style={{ padding: "14px 16px", textAlign: "left", fontSize: 13, color: "#6B7280", fontWeight: 600, width: "30%" }}>Feature</th>
              {plans.map(p => (
                <th key={p.name} style={{ padding: "14px 16px", textAlign: "center", background: p.current ? "#FFF8ED" : p.name === "Business" ? `${NAVY}08` : "transparent", borderRadius: p.current ? "8px 8px 0 0" : 0 }}>
                  <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 16, color: p.color }}>{p.name}</div>
                  <div style={{ fontSize: 13, color: "#6B7280", fontWeight: 400 }}>{p.label}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {plans.length > 0 && Object.keys(plans[0].features).map((feat, fi) => (
              <tr key={feat} style={{ background: fi % 2 === 0 ? "#F9FAFB" : "#fff" }}>
                <td style={{ padding: "12px 16px", fontSize: 14, color: "#374151", fontWeight: 500 }}>{feat}</td>
                {plans.map(p => (
                  <td key={p.name} style={{ padding: "12px 16px", textAlign: "center", background: p.current ? "#FFF8ED" : "transparent" }}>
                    {typeof p.features[feat] === "boolean"
                      ? <span style={{ fontSize: 18, color: p.features[feat] ? "#2ECC71" : "#D1D5DB" }}>{p.features[feat] ? "✓" : "✗"}</span>
                      : <span style={{ fontSize: 14, color: NAVY, fontWeight: 500 }}>{p.features[feat]}</span>}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td style={{ padding: "16px" }} />
              {plans.map(p => (
                <td key={p.name} style={{ padding: "16px", textAlign: "center" }}>
                  {p.current
                    ? <div style={{ background: "#F3F4F6", color: "#9CA3AF", borderRadius: 24, padding: "10px 0", fontSize: 14, fontWeight: 600 }}>Current Plan</div>
                    : <button onClick={() => setUpgradeModal(p)} style={{ width: "100%", background: p.name === "Business" ? NAVY : AMBER, color: p.name === "Business" ? "#fff" : NAVY, border: "none", borderRadius: 24, padding: "10px 0", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Upgrade to {p.name}</button>}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ ...cardStyle, overflowX: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 16, color: NAVY }}>Billing History</span>
          <button onClick={() => {
            const csv = [["Date","Description","Amount","Status"].join(","), ...history.map(r =>
              [r.date, `"${r.desc}"`, r.amount, r.status].join(",")
            )].join("\n");
            const blob = new Blob([csv], {type:"text/csv"});
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a"); a.href = url; a.download = "billing-history.csv"; a.click();
            URL.revokeObjectURL(url);
            showToast("All invoices downloaded!", "success");
          }} style={{ background: "none", border: "none", color: AMBER, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
            <Download size={14} /> Download All
          </button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: isMobile ? 500 : "auto" }}>
          <thead>
            <tr style={{ background: "#F9FAFB" }}>
              {["Date", "Description", "Amount", "Status", "Invoice"].map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 12, color: "#6B7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid #E5E7EB" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {history.map((row, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #F3F4F6" }}>
                <td style={{ padding: "12px 14px", fontSize: 14, color: "#374151" }}>{row.date}</td>
                <td style={{ padding: "12px 14px", fontSize: 14, color: "#374151" }}>{row.desc}</td>
                <td style={{ padding: "12px 14px", fontSize: 14, fontWeight: 600, color: NAVY }}>{row.amount}</td>
                <td style={{ padding: "12px 14px" }}><span style={{ background: "#F0FDF4", color: "#065F46", fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 10 }}>{row.status} ✓</span></td>
                <td style={{ padding: "12px 14px" }}><button onClick={() => {
                  const txt = `DUKADESK INVOICE\n${"=".repeat(40)}\nDate: ${row.date}\nDescription: ${row.desc}\nAmount: ${row.amount}\nStatus: ${row.status}\n${"=".repeat(40)}\nThank you for your business!`;
                  const blob = new Blob([txt], {type:"text/plain"});
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a"); a.href = url; a.download = `invoice-${row.date.replace(/\//g,"-")}.txt`; a.click();
                  URL.revokeObjectURL(url);
                  showToast("Invoice downloaded", "success");
                }} style={{ background: "none", border: "none", color: AMBER, fontSize: 13, cursor: "pointer" }}>Download PDF</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ background: "#FFF8ED", border: "1px solid #F4A026", borderRadius: 8, padding: 14, marginTop: 16 }}>
          <div style={{ fontSize: 13, color: "#92400E" }}>ℹ Invoices will appear here once you upgrade to a paid plan.</div>
        </div>
      </div>

      {upgradeModal && (
        <>
          <div onClick={() => { setUpgradeModal(null); setPayStep(0); }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200 }} />
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "#fff", borderRadius: 20, padding: isMobile ? 24 : 40, width: isMobile ? "92%" : 480, maxWidth: 480, zIndex: 201, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", boxSizing: "border-box" }}>
            {payStep === 2 ? (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
                <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 24, color: NAVY, marginBottom: 8 }}>Welcome to {upgradeModal.name}!</h3>
                <p style={{ color: "#6B7280" }}>Your plan has been upgraded. New features are now active.</p>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                  <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: isMobile ? 18 : 22, color: NAVY, margin: 0 }}>Upgrade to {upgradeModal.name}</h3>
                  <button onClick={() => { setUpgradeModal(null); setPayStep(0); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280", display: "flex" }}>
                    <X size={22} />
                  </button>
                </div>
                <div style={{ background: "#FFF8ED", borderRadius: 10, padding: 16, marginBottom: 24 }}>
                  <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 24, color: AMBER }}>{upgradeModal.label}</div>
                  <div style={{ fontSize: 13, color: "#92400E", marginTop: 4 }}>Billed monthly · Cancel anytime</div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Card Number</label>
                  <input value={cardNum} onChange={e => setCardNum(e.target.value.replace(/\D/g, "").slice(0, 16))} placeholder="1234 5678 9012 3456" style={{ ...inputStyle, borderColor: focusedField === "card" ? AMBER : undefined }} onFocus={() => setFocusedField("card")} onBlur={() => setFocusedField(null)} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
                  <div>
                    <label style={labelStyle}>Expiry</label>
                    <input value={expiry} onChange={e => setExpiry(e.target.value)} placeholder="MM/YY" style={{ ...inputStyle, borderColor: focusedField === "expiry" ? AMBER : undefined }} onFocus={() => setFocusedField("expiry")} onBlur={() => setFocusedField(null)} />
                  </div>
                  <div>
                    <label style={labelStyle}>CVV</label>
                    <input value={cvv} onChange={e => setCvv(e.target.value.slice(0, 3))} placeholder="123" type="password" style={{ ...inputStyle, borderColor: focusedField === "cvv" ? AMBER : undefined }} onFocus={() => setFocusedField("cvv")} onBlur={() => setFocusedField(null)} />
                  </div>
                </div>
                <button onClick={handleUpgrade} style={{ width: "100%", background: AMBER, color: NAVY, border: "none", borderRadius: 28, height: 52, fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}>{payStep === 1 ? "Processing..." : `Subscribe — ${upgradeModal.label}`}</button>
                <p style={{ textAlign: "center", fontSize: 12, color: "#9CA3AF", marginTop: 12 }}>🔒 Secured by Paystack · Cancel anytime</p>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
