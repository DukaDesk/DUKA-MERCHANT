import { useState } from "react";
import { X, Download } from "lucide-react";
import { useToast } from "../App";
import { NAVY, AMBER, inputStyle, labelStyle, cardStyle } from "../theme";

const plans = [
  { name: "Starter", price: 0, label: "Free (Beta)", color: "#6B7280", features: { "Apps": "1", "Products": "20", "QR Scans": "Unlimited", "Customers": "500", "Integrations": "Basic", "Analytics": "Basic", "Team Members": "1", "Priority Support": false, "Custom Domain": false }, current: true },
  { name: "Growth", price: 9999, label: "₦9,999/mo", color: AMBER, features: { "Apps": "3", "Products": "Unlimited", "QR Scans": "Unlimited", "Customers": "Unlimited", "Integrations": "All", "Analytics": "Advanced", "Team Members": "3", "Priority Support": false, "Custom Domain": false }, current: false },
  { name: "Business", price: 24999, label: "₦24,999/mo", color: NAVY, features: { "Apps": "10", "Products": "Unlimited", "QR Scans": "Unlimited", "Customers": "Unlimited", "Integrations": "All + Premium", "Analytics": "Advanced + Export", "Team Members": "10", "Priority Support": true, "Custom Domain": true }, current: false },
];
const history = [
  { date: "Jun 1, 2025", desc: "Starter Plan (Beta)", amount: "₦0", status: "Paid" },
  { date: "May 1, 2025", desc: "Starter Plan (Beta)", amount: "₦0", status: "Paid" },
];

export default function Billing() {
  const showToast = useToast();
  const [upgradeModal, setUpgradeModal] = useState(null);
  const [payStep, setPayStep] = useState(0);
  const [cardNum, setCardNum] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const handleUpgrade = () => {
    if (!cardNum || !expiry || !cvv) { showToast("Please fill in all card details", "error"); return; }
    setPayStep(2);
    setTimeout(() => { setUpgradeModal(null); setPayStep(0); showToast(`Upgraded to ${upgradeModal.name} plan! 🎉`, "success"); }, 1500);
  };

  return (
    <div>
      <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 28, color: NAVY, margin: "0 0 24px" }}>Billing & Subscription</h2>

      <div style={{ background: `linear-gradient(135deg, ${AMBER}, #E8910A)`, borderRadius: 16, padding: 32, marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 28, color: "#fff", marginBottom: 4 }}>Starter Plan</div>
          <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 18, marginBottom: 8 }}>₦0 / month during beta</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {["1 App", "Unlimited QR scans", "Basic integrations", "Up to 500 customers"].map((f, i) => (
              <div key={i} style={{ color: "rgba(255,255,255,0.9)", fontSize: 14 }}>✓ {f}</div>
            ))}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginBottom: 8 }}>Renews: N/A (Beta)</div>
          <button onClick={() => setUpgradeModal(plans[1])} style={{ background: "#fff", color: AMBER, border: "none", borderRadius: 24, padding: "12px 28px", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}>Upgrade Plan →</button>
        </div>
      </div>

      <div style={{ ...cardStyle, marginBottom: 24 }}>
        <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 22, color: NAVY, margin: "0 0 24px", textAlign: "center" }}>Choose the Right Plan</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
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
            {Object.keys(plans[0].features).map((feat, fi) => (
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

      <div style={{ ...cardStyle }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 16, color: NAVY }}>Billing History</span>
          <button onClick={() => showToast("Downloading all invoices...", "info")} style={{ background: "none", border: "none", color: AMBER, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
            <Download size={14} /> Download All
          </button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
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
                <td style={{ padding: "12px 14px" }}><button onClick={() => showToast("Invoice downloaded", "success")} style={{ background: "none", border: "none", color: AMBER, fontSize: 13, cursor: "pointer" }}>Download PDF</button></td>
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
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "#fff", borderRadius: 20, padding: 40, width: 480, zIndex: 201, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            {payStep === 2 ? (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
                <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 24, color: NAVY, marginBottom: 8 }}>Welcome to {upgradeModal.name}!</h3>
                <p style={{ color: "#6B7280" }}>Your plan has been upgraded. New features are now active.</p>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                  <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 22, color: NAVY, margin: 0 }}>Upgrade to {upgradeModal.name}</h3>
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
                  <input value={cardNum} onChange={e => setCardNum(e.target.value.replace(/\D/g, "").slice(0, 16))} placeholder="1234 5678 9012 3456" style={inputStyle} onFocus={e => e.target.style.borderColor = AMBER} onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
                  <div>
                    <label style={labelStyle}>Expiry</label>
                    <input value={expiry} onChange={e => setExpiry(e.target.value)} placeholder="MM/YY" style={inputStyle} onFocus={e => e.target.style.borderColor = AMBER} onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
                  </div>
                  <div>
                    <label style={labelStyle}>CVV</label>
                    <input value={cvv} onChange={e => setCvv(e.target.value.slice(0, 3))} placeholder="123" type="password" style={inputStyle} onFocus={e => e.target.style.borderColor = AMBER} onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
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
