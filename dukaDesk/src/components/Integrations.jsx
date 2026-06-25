import { useState } from "react";
const NAVY = "#1A1A2E", AMBER = "#F4A026";

const allIntegrations = [
  { cat: "Payments", items: [
    { icon: "💳", name: "Paystack", desc: "Cards, bank transfer & USSD", badge: "Popular", active: true, stat: "₦48,200 processed this month" },
    { icon: "💳", name: "Flutterwave", desc: "Pan-African payment gateway", badge: "Popular", active: false },
    { icon: "🏦", name: "Bank Transfer", desc: "Manual bank details", badge: "Free", active: false },
  ]},
  { cat: "Commerce", items: [
    { icon: "🛒", name: "Product Cart", desc: "Full cart & checkout flow", badge: "Popular", active: true, stat: "24 products · 124 orders" },
    { icon: "🏷️", name: "Discount Codes", desc: "Create promo codes", badge: "Free", active: false },
    { icon: "📦", name: "Order Tracking", desc: "Real-time order status", badge: "Popular", active: false },
    { icon: "❤️", name: "Wishlist", desc: "Let customers save products", badge: "Free", active: false },
  ]},
  { cat: "Booking", items: [
    { icon: "📅", name: "Appointment Calendar", desc: "Self-booking for customers", badge: "Popular", active: false },
    { icon: "⏰", name: "Booking Reminders", desc: "SMS/push reminders", badge: "Popular", active: false },
    { icon: "📋", name: "Waitlist", desc: "Queue for full time slots", badge: "Free", active: false },
  ]},
  { cat: "Loyalty & Engagement", items: [
    { icon: "⭐", name: "Loyalty Points", desc: "Earn & redeem rewards", badge: "Popular", active: false },
    { icon: "🔔", name: "Push Notifications", desc: "Broadcast offers to users", badge: "Popular", active: false },
    { icon: "👥", name: "Referral Program", desc: "Refer friends, earn rewards", badge: "Premium", active: false, locked: true },
  ]},
  { cat: "Communication", items: [
    { icon: "💬", name: "In-App Messaging", desc: "Live chat with customers", badge: "Popular", active: true, stat: "7 unread conversations" },
    { icon: "📱", name: "WhatsApp Link", desc: "Quick WhatsApp contact", badge: "Free", active: false },
    { icon: "📧", name: "Email Capture", desc: "Build your email list", badge: "Free", active: false },
  ]},
  { cat: "Content & Media", items: [
    { icon: "🖼️", name: "Photo Gallery", desc: "Image showcase", badge: "Free", active: false },
    { icon: "📄", name: "PDF Menu", desc: "Upload and display a PDF menu", badge: "Free", active: false },
    { icon: "🔗", name: "Social Media Links", desc: "Link Instagram, Facebook, TikTok", badge: "Free", active: false },
  ]},
];

const badgeStyle = {
  Popular: { bg: "#FFF8ED", color: "#92400E" },
  Free: { bg: "#F0FDF4", color: "#065F46" },
  Premium: { bg: `${NAVY}11`, color: NAVY },
};

export default function Integrations({ showToast }) {
  const [integrations, setIntegrations] = useState(allIntegrations);
  const [catFilter, setCatFilter] = useState("All");
  const [configPanel, setConfigPanel] = useState(null);
  const [removeConfirm, setRemoveConfirm] = useState(null);

  const toggle = (catIdx, itemIdx) => {
    const item = integrations[catIdx].items[itemIdx];
    if (item.locked) { showToast("Upgrade to Growth plan to unlock Premium integrations", "info"); return; }
    setIntegrations(prev => prev.map((cat, ci) =>
      ci !== catIdx ? cat : {
        ...cat,
        items: cat.items.map((it, ii) =>
          ii !== itemIdx ? it : { ...it, active: !it.active }
        ),
      }
    ));
    showToast(item.active ? `${item.name} removed` : `${item.name} added to your app!`, item.active ? "info" : "success");
  };

  const activeItems = integrations.flatMap(cat => cat.items.filter(i => i.active));
  const cats = ["All", ...allIntegrations.map(c => c.cat)];
  const filtered = catFilter === "All" ? integrations : integrations.filter(c => c.cat === catFilter);

  return (
    <div style={{ position: "relative" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 28, color: NAVY, margin: "0 0 4px" }}>Integrations</h2>
        <p style={{ color: "#6B7280", margin: 0 }}>Manage the features powering your app. Add or remove anytime.</p>
      </div>

      {/* Active integrations */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 16, color: NAVY }}>Active ({activeItems.length})</span>
        </div>
        {activeItems.length === 0 && (
          <p style={{ color: "#9CA3AF", fontSize: 14, textAlign: "center", padding: "20px 0" }}>No integrations active yet. Add one below.</p>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {activeItems.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: "#F9FAFB", borderRadius: 10, borderLeft: `4px solid ${AMBER}` }}>
              <span style={{ fontSize: 28 }}>{item.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: NAVY }}>{item.name}</div>
                <div style={{ fontSize: 12, color: "#2ECC71", fontWeight: 500 }}>Connected ✓ {item.stat ? `— ${item.stat}` : ""}</div>
              </div>
              <button onClick={() => setConfigPanel(item)} style={{ background: "none", border: "none", color: AMBER, fontSize: 13, fontWeight: 600, cursor: "pointer", marginRight: 8 }}>Configure</button>
              <button onClick={() => setRemoveConfirm(item)} style={{ background: "none", border: "none", color: "#9CA3AF", fontSize: 13, cursor: "pointer" }}>Remove</button>
            </div>
          ))}
        </div>
      </div>

      {/* Add more */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 16, color: NAVY, marginBottom: 16 }}>Expand Your App's Capabilities</div>

        {/* Category filter */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {cats.map(c => (
            <button key={c} onClick={() => setCatFilter(c)} style={{ padding: "6px 14px", borderRadius: 20, border: `1px solid ${catFilter === c ? AMBER : "#E5E7EB"}`, background: catFilter === c ? "#FFF8ED" : "#fff", color: catFilter === c ? "#92400E" : "#6B7280", fontSize: 13, fontWeight: catFilter === c ? 600 : 400, cursor: "pointer" }}>{c}</button>
          ))}
        </div>

        {filtered.map((cat, ci) => {
          const catIdx = integrations.findIndex(c => c.cat === cat.cat);
          return (
            <div key={ci} style={{ marginBottom: 28 }}>
              <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 15, color: NAVY, marginBottom: 12 }}>{cat.cat}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                {cat.items.map((item, ii) => {
                  const itemIdx = integrations[catIdx].items.findIndex(x => x.name === item.name);
                  const bc = badgeStyle[item.badge] || badgeStyle.Free;
                  return (
                    <div key={ii} style={{ border: `2px solid ${item.active ? AMBER : item.locked ? "#E5E7EB" : "#E5E7EB"}`, background: item.active ? "#FFF8ED" : item.locked ? "#F9FAFB" : "#fff", borderRadius: 10, padding: 16, opacity: item.locked ? 0.75 : 1, position: "relative", transition: "all 0.15s" }}>
                      {item.locked && <div style={{ position: "absolute", top: 10, right: 10, fontSize: 14 }}>🔒</div>}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                        <span style={{ fontSize: 28 }}>{item.icon}</span>
                        <span style={{ background: bc.bg, color: bc.color, fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 10 }}>{item.badge}</span>
                      </div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: NAVY, marginBottom: 4 }}>{item.name}</div>
                      <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 12, lineHeight: 1.4 }}>{item.desc}</div>
                      <button
                        onClick={() => item.locked ? showToast("Upgrade to Growth plan to unlock", "info") : toggle(catIdx, itemIdx)}
                        style={{ width: "100%", background: item.active ? "#2ECC71" : item.locked ? "#E5E7EB" : AMBER, color: item.active ? "#fff" : item.locked ? "#9CA3AF" : NAVY, border: "none", borderRadius: 20, padding: "8px 0", fontSize: 13, fontWeight: 600, cursor: item.locked ? "not-allowed" : "pointer" }}
                      >
                        {item.active ? "✓ Added" : item.locked ? "🔒 Upgrade to Unlock" : "Add to App →"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        <div style={{ background: "#FFF8ED", border: "1px solid #F4A026", borderRadius: 10, padding: 16, marginTop: 8 }}>
          <div style={{ fontSize: 13, color: "#92400E" }}>💡 You can add or remove integrations anytime. Changes go live within seconds.</div>
        </div>
      </div>

      {/* Configure panel */}
      {configPanel && (
        <>
          <div onClick={() => setConfigPanel(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 100 }} />
          <div style={{ position: "fixed", right: 0, top: 0, width: 480, height: "100vh", background: "#fff", zIndex: 101, boxShadow: "-8px 0 32px rgba(0,0,0,0.12)", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "24px", borderBottom: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 32 }}>{configPanel.icon}</span>
                <div>
                  <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 18, color: NAVY, margin: 0 }}>Configure {configPanel.name}</h3>
                  <span style={{ fontSize: 12, color: "#2ECC71", fontWeight: 500 }}>🟢 Connected</span>
                </div>
              </div>
              <button onClick={() => setConfigPanel(null)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#6B7280" }}>×</button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
              {configPanel.name === "Paystack" && (
                <>
                  {[["Business Name", "Mama's Kitchen"], ["Public Key", "pk_live_••••••••••••xxxx"], ["Currency", "NGN"]].map(([label, val]) => (
                    <div key={label} style={{ marginBottom: 16 }}>
                      <label style={lbl}>{label}</label>
                      <input defaultValue={val} style={inp} onFocus={e => e.target.style.borderColor = AMBER} onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
                    </div>
                  ))}
                  {[["Allow Bank Transfer", true], ["Allow USSD", true], ["Test Mode", false], ["Charge customer transaction fee", false]].map(([label, def]) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #F3F4F6" }}>
                      <span style={{ fontSize: 14, color: NAVY }}>{label}</span>
                      <label style={{ position: "relative", display: "inline-block", width: 44, height: 24 }}>
                        <input type="checkbox" defaultChecked={def} style={{ opacity: 0, width: 0, height: 0 }} />
                        <span style={{ position: "absolute", cursor: "pointer", inset: 0, background: def ? AMBER : "#E5E7EB", borderRadius: 12, transition: "0.3s" }} />
                      </label>
                    </div>
                  ))}
                </>
              )}
              {configPanel.name === "In-App Messaging" && (
                <>
                  <div style={{ background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 8, padding: 14, marginBottom: 20 }}>
                    <div style={{ fontSize: 13, color: "#065F46" }}>✓ 7 active conversations · Avg response time: 12 min</div>
                  </div>
                  {[["Auto-reply message", "Hi! Thanks for reaching out to Mama's Kitchen. We'll respond shortly 😊"], ["Away message", "We're currently closed. We'll reply when we reopen."]].map(([label, val]) => (
                    <div key={label} style={{ marginBottom: 16 }}>
                      <label style={lbl}>{label}</label>
                      <textarea defaultValue={val} style={{ ...inp, height: 72, paddingTop: 10, resize: "none" }} />
                    </div>
                  ))}
                </>
              )}
              {configPanel.name === "Product Cart" && (
                <div>
                  {[["Max items per cart", "20"], ["Minimum order amount (₦)", "500"]].map(([label, val]) => (
                    <div key={label} style={{ marginBottom: 16 }}>
                      <label style={lbl}>{label}</label>
                      <input defaultValue={val} type="number" style={inp} onFocus={e => e.target.style.borderColor = AMBER} onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
                    </div>
                  ))}
                  {[["Allow notes on order", true], ["Show estimated delivery time", true]].map(([label, def]) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #F3F4F6" }}>
                      <span style={{ fontSize: 14, color: NAVY }}>{label}</span>
                      <input type="checkbox" defaultChecked={def} style={{ width: 18, height: 18, cursor: "pointer", accentColor: AMBER }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ padding: 24, borderTop: "1px solid #E5E7EB", display: "flex", flexDirection: "column", gap: 10 }}>
              <button onClick={() => { setConfigPanel(null); showToast("Settings saved!", "success"); }} style={{ background: AMBER, color: NAVY, border: "none", borderRadius: 24, height: 48, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Save Changes</button>
              <button onClick={() => setRemoveConfirm(configPanel)} style={{ background: "none", border: "none", color: "#E74C3C", fontSize: 13, cursor: "pointer" }}>Disconnect {configPanel.name}</button>
            </div>
          </div>
        </>
      )}

      {/* Remove confirm modal */}
      {removeConfirm && (
        <>
          <div onClick={() => setRemoveConfirm(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200 }} />
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "#fff", borderRadius: 16, padding: 32, width: 400, zIndex: 201, boxShadow: "0 20px 60px rgba(0,0,0,0.15)", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>{removeConfirm.icon}</div>
            <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 20, color: NAVY, margin: "0 0 8px" }}>Remove {removeConfirm.name}?</h3>
            <p style={{ color: "#6B7280", fontSize: 14, margin: "0 0 24px" }}>This will remove {removeConfirm.name} from your app. You can re-add it anytime.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => {
                const catIdx = integrations.findIndex(c => c.items.some(i => i.name === removeConfirm.name));
                const itemIdx = integrations[catIdx].items.findIndex(i => i.name === removeConfirm.name);
                toggle(catIdx, itemIdx);
                setRemoveConfirm(null);
                setConfigPanel(null);
              }} style={{ flex: 1, background: "#E74C3C", color: "#fff", border: "none", borderRadius: 24, height: 48, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Remove</button>
              <button onClick={() => setRemoveConfirm(null)} style={{ flex: 1, background: "none", border: "1px solid #E5E7EB", borderRadius: 24, height: 48, fontSize: 15, cursor: "pointer", color: "#6B7280" }}>Cancel</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const lbl = { display: "block", fontSize: 13, fontWeight: 600, color: NAVY, marginBottom: 6 };
const inp = { width: "100%", height: 52, border: "1px solid #E5E7EB", borderRadius: 8, padding: "0 14px", fontSize: 15, color: NAVY, outline: "none", boxSizing: "border-box", fontFamily: "inherit", background: "#fff" };
