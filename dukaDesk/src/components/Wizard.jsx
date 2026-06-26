import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../App";
import { useIsMobile } from "../hooks/useMediaQuery";
import { NAVY, AMBER, inputStyle, labelStyle } from "../theme";

const steps = ["Category", "Template", "Branding", "Business Info", "Integrations"];
const categories = [
  { icon: "🍽️", name: "Restaurant", desc: "Full menus, ordering & delivery" },
  { icon: "🛍️", name: "Ecommerce", desc: "Products, cart & checkout" },
  { icon: "🥗", name: "Food Vendor", desc: "Bukas, home kitchens, caterers" },
  { icon: "🛒", name: "Grocery", desc: "Supermarkets & local stores" },
  { icon: "⛪", name: "Church", desc: "Events, giving & community" },
  { icon: "🏫", name: "School", desc: "Timetables, fees & announcements" },
  { icon: "📅", name: "Booking", desc: "Appointments & scheduling" },
];
const templates = [
  { name: "Classic Dine", tags: ["Elegant", "Warm tones"], features: ["Menu", "Cart", "Orders", "Reservations"], preview: "🍜" },
  { name: "Modern Bites", tags: ["Dark theme", "Bold type"], features: ["Menu", "Cart", "Orders", "Table Booking"], preview: "🍔" },
  { name: "Fresh & Bright", tags: ["Minimal", "Photo-forward"], features: ["Menu", "Cart", "Delivery", "Pickup"], preview: "🥗" },
];
const integrations = [
  { cat: "Payments", items: [{ icon: "💳", name: "Paystack", desc: "Cards, bank transfer & USSD", badge: "Popular" }, { icon: "💳", name: "Flutterwave", desc: "Pan-African gateway", badge: "Popular" }, { icon: "🏦", name: "Bank Transfer", desc: "Manual bank details", badge: "Free" }] },
  { cat: "Commerce", items: [{ icon: "🛒", name: "Product Cart", desc: "Full cart & checkout flow", badge: "Popular" }, { icon: "🏷️", name: "Discount Codes", desc: "Create promo codes", badge: "Free" }, { icon: "📦", name: "Order Tracking", desc: "Real-time order status", badge: "Popular" }] },
  { cat: "Booking", items: [{ icon: "📅", name: "Appointment Calendar", desc: "Self-booking for customers", badge: "Popular" }, { icon: "⏰", name: "Booking Reminders", desc: "SMS/push reminders", badge: "Popular" }] },
  { cat: "Loyalty", items: [{ icon: "⭐", name: "Loyalty Points", desc: "Earn & redeem rewards", badge: "Popular" }, { icon: "🔔", name: "Push Notifications", desc: "Broadcast offers to users", badge: "Popular" }] },
  { cat: "Communication", items: [{ icon: "💬", name: "In-App Messaging", desc: "Live chat with customers", badge: "Popular" }, { icon: "📱", name: "WhatsApp Link", desc: "Quick WhatsApp contact", badge: "Free" }] },
];

export default function Wizard() {
  const navigate = useNavigate();
  const showToast = useToast();
  const isMobile = useIsMobile();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ category: null, template: null, logo: null, appName: "Mama's Kitchen", tagline: "Authentic Nigerian home cooking", color: AMBER, selectedIntegrations: ["Paystack", "Product Cart", "In-App Messaging"], bizDesc: "", phone: "", address: "" });
  const [published, setPublished] = useState(false);

  const next = () => { if (step < 4) setStep(s => s + 1); else handlePublish(); };
  const back = () => setStep(s => s - 1);
  const canNext = () => {
    if (step === 0) return !!data.category;
    if (step === 1) return !!data.template;
    return true;
  };
  const handlePublish = () => { setPublished(true); };

  if (published) return <Published onFinish={() => navigate("/dashboard")} showToast={showToast} isMobile={isMobile} />;

  return (
    <div style={{ minHeight: "100vh", background: "#F7F8FA", display: "flex", flexDirection: isMobile ? "column" : "row" }}>
      {/* Sidebar / Mobile steps bar */}
      <div style={isMobile ? {
        background: NAVY,
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        gap: 8,
        overflowX: "auto",
        flexShrink: 0,
      } : {
        width: 240,
        minHeight: "100vh",
        background: NAVY,
        padding: "32px 20px",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
      }}>
        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 48 }}>
            <div style={{ width: 36, height: 36, background: AMBER, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: NAVY, fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 18 }}>D</span></div>
            <div><div style={{ color: "#fff", fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 16 }}>DukaDesk</div><span style={{ color: "#9CA3AF", fontSize: 11 }}>App Setup Wizard</span></div>
          </div>
        )}
        {steps.map((s, i) => (
          <div key={i} style={isMobile ? {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            padding: "6px 10px",
            opacity: i > step ? 0.4 : 1,
            whiteSpace: "nowrap",
          } : {
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 0",
            opacity: i > step ? 0.4 : 1,
          }}>
            <div style={{
              width: isMobile ? 24 : 28, height: isMobile ? 24 : 28, borderRadius: "50%",
              background: i < step ? "#2ECC71" : i === step ? AMBER : "#252547",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: isMobile ? 10 : 12, fontWeight: 700,
              color: i < step ? "#fff" : NAVY, flexShrink: 0,
            }}>
              {i < step ? "✓" : i + 1}
            </div>
            {!isMobile && (
              <span style={{ color: i === step ? AMBER : i < step ? "#D1D5DB" : "#9CA3AF", fontSize: 13, fontWeight: i === step ? 600 : 400 }}>{s}</span>
            )}
          </div>
        ))}
      </div>

      <div style={{ flex: 1, padding: isMobile ? "24px 16px" : "48px", overflowY: "auto" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          {/* Mobile step label */}
          {isMobile && (
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <span style={{ background: AMBER, color: NAVY, fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 12 }}>Step {step + 1}: {steps[step]}</span>
            </div>
          )}

          {step === 0 && <StepCategory data={data} setData={setData} isMobile={isMobile} />}
          {step === 1 && <StepTemplate data={data} setData={setData} isMobile={isMobile} />}
          {step === 2 && <StepBranding data={data} setData={setData} isMobile={isMobile} />}
          {step === 3 && <StepBusiness data={data} setData={setData} isMobile={isMobile} />}
          {step === 4 && <StepIntegrations data={data} setData={setData} isMobile={isMobile} />}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40, paddingTop: 24, borderTop: "1px solid #E5E7EB" }}>
            <button onClick={back} disabled={step === 0} style={{ padding: "12px 28px", borderRadius: 24, border: "1px solid #E5E7EB", background: "#fff", color: "#6B7280", fontWeight: 600, cursor: step === 0 ? "not-allowed" : "pointer", opacity: step === 0 ? 0.4 : 1, fontSize: 15, fontFamily: "inherit" }}>← Back</button>
            <button onClick={next} disabled={!canNext()} style={{ padding: "12px 36px", borderRadius: 24, background: canNext() ? AMBER : "#D1D5DB", color: canNext() ? NAVY : "#9CA3AF", border: "none", fontWeight: 700, cursor: canNext() ? "pointer" : "not-allowed", fontSize: 15, fontFamily: "'Sora',sans-serif" }}>{step === 4 ? "🚀 Publish My App" : "Continue →"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepCategory({ data, setData, isMobile }) {
  return (
    <div>
      <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: isMobile ? 24 : 36, color: NAVY, margin: "0 0 8px" }}>What type of business are you?</h2>
      <p style={{ color: "#6B7280", fontSize: isMobile ? 14 : 16, margin: "0 0 36px" }}>We&apos;ll recommend the best templates and integrations for you.</p>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3,1fr)", gap: isMobile ? 12 : 16 }}>
        {categories.map((c, i) => {
          const selected = data.category === c.name;
          return (
            <div key={i} onClick={() => setData(d => ({ ...d, category: c.name }))} style={{ background: selected ? "#FFF8ED" : "#fff", border: `2px solid ${selected ? AMBER : "#E5E7EB"}`, borderRadius: 12, padding: isMobile ? 16 : 24, cursor: "pointer", transition: "all 0.15s", position: "relative" }}>
              {selected && <div style={{ position: "absolute", top: 10, right: 10, background: AMBER, color: "#fff", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>✓</div>}
              <div style={{ fontSize: isMobile ? 28 : 40, marginBottom: 12 }}>{c.icon}</div>
              <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: isMobile ? 14 : 16, color: NAVY, marginBottom: 4 }}>{c.name}</div>
              <div style={{ fontSize: isMobile ? 12 : 13, color: "#6B7280" }}>{c.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepTemplate({ data, setData, isMobile }) {
  return (
    <div>
      <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: isMobile ? 24 : 36, color: NAVY, margin: "0 0 8px" }}>Choose your template</h2>
      <p style={{ color: "#6B7280", fontSize: isMobile ? 14 : 16, margin: "0 0 36px" }}>Pick the look and feel for your app. You can customise everything next.</p>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: 20 }}>
        {templates.map((t, i) => {
          const selected = data.template === t.name;
          return (
            <div key={i} style={{ background: "#fff", border: `2px solid ${selected ? AMBER : "#E5E7EB"}`, borderRadius: 12, overflow: "hidden", cursor: "pointer", transition: "all 0.15s", position: "relative" }} onClick={() => setData(d => ({ ...d, template: t.name }))}>
              {selected && <div style={{ position: "absolute", top: 10, left: 10, background: AMBER, color: NAVY, fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 12, zIndex: 2 }}>Selected ✓</div>}
              <div style={{ height: isMobile ? 140 : 180, background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", fontSize: isMobile ? 56 : 72 }}>{t.preview}</div>
              <div style={{ padding: 16 }}>
                <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 16, color: NAVY, marginBottom: 8 }}>{t.name}</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>{t.tags.map((tag, j) => <span key={j} style={{ background: "#F3F4F6", color: "#6B7280", fontSize: 11, padding: "3px 8px", borderRadius: 12 }}>{tag}</span>)}</div>
                <div style={{ fontSize: 12, color: "#6B7280" }}>{t.features.map(f => `✓ ${f}`).join("  ")}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepBranding({ data, setData, isMobile }) {
  const colors = ["#1A1A2E", "#F4A026", "#2ECC71", "#E74C3C", "#7C3AED", "#0D9488", "#EA580C", "#EC4899", "#000000"];
  const logoInputRef = useRef(null);
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("File too large. Max 5MB."); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setData(d => ({ ...d, logo: ev.target.result }));
    reader.readAsDataURL(file);
  };
  return (
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 320px", gap: isMobile ? 24 : 40 }}>
      <div>
        <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: isMobile ? 24 : 36, color: NAVY, margin: "0 0 8px" }}>Brand your app</h2>
        <p style={{ color: "#6B7280", fontSize: isMobile ? 14 : 16, margin: "0 0 32px" }}>Your logo, colors and name appear throughout your customer-facing app.</p>
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>App Logo</label>
          <input ref={logoInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleLogoUpload} />
          <div onClick={() => logoInputRef.current?.click()} style={{ width: isMobile ? 100 : 140, height: isMobile ? 100 : 140, border: "2px dashed #E5E7EB", borderRadius: 12, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", background: data.logo ? `url(${data.logo}) center/cover no-repeat` : "#FAFAFA", gap: 8 }}>
            {!data.logo && <><span style={{ fontSize: isMobile ? 24 : 32 }}>📷</span>
            <span style={{ fontSize: 13, color: "#9CA3AF" }}>Upload Logo</span>
            <span style={{ fontSize: 11, color: "#D1D5DB" }}>PNG · Max 5MB</span></>}
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>App / Business Name</label>
          <input value={data.appName} onChange={e => setData(d => ({ ...d, appName: e.target.value }))} style={inputStyle} onFocus={e => e.target.style.borderColor = AMBER} onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
          <div style={{ textAlign: "right", fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>{data.appName.length}/50</div>
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>Tagline</label>
          <input value={data.tagline} onChange={e => setData(d => ({ ...d, tagline: e.target.value }))} placeholder="Authentic Nigerian home cooking" style={inputStyle} onFocus={e => e.target.style.borderColor = AMBER} onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
        </div>
        <div>
          <label style={labelStyle}>Brand Color</label>
          <p style={{ fontSize: 12, color: "#6B7280", marginBottom: 12 }}>Used for buttons, highlights and accents in your app.</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {colors.map((c, i) => (
              <div key={i} onClick={() => setData(d => ({ ...d, color: c }))} style={{ width: isMobile ? 36 : 40, height: isMobile ? 36 : 40, background: c, borderRadius: "50%", cursor: "pointer", border: data.color === c ? `3px solid ${AMBER}` : "3px solid transparent", outline: data.color === c ? `2px solid ${AMBER}` : "none", outlineOffset: 2, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
                {data.color === c && <span style={{ color: c === "#fff" ? NAVY : "#fff", fontSize: 14, fontWeight: 700 }}>✓</span>}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, padding: "12px 16px", background: "#F9FAFB", borderRadius: 8 }}>
            <span style={{ fontSize: 12, color: "#6B7280" }}>Button preview: </span>
            <button style={{ background: data.color, color: data.color === "#fff" ? NAVY : "#fff", border: "none", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "default" }}>Add to Cart</button>
          </div>
        </div>
      </div>
      {!isMobile && (
        <div style={{ position: "sticky", top: 20 }}>
          <div style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Live Preview</div>
          <div style={{ background: NAVY, borderRadius: 32, padding: 12, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", width: 240 }}>
            <div style={{ background: "#fff", borderRadius: 24, overflow: "hidden", minHeight: 420 }}>
              <div style={{ background: data.color, padding: "20px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                {data.logo && <img src={data.logo} alt="logo" style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover" }} />}
                <div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>Open Now · 4.8 ⭐</div>
                  <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 18, color: "#fff" }}>{data.appName || "Your App"}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", marginTop: 4 }}>{data.tagline}</div>
                </div>
              </div>
              <div style={{ padding: "12px 12px 8px" }}>
                {["Popular", "Mains", "Drinks"].map((cat, i) => (
                  <span key={i} style={{ background: i === 0 ? data.color : "#F3F4F6", color: i === 0 ? "#fff" : "#6B7280", fontSize: 11, padding: "4px 10px", borderRadius: 12, marginRight: 6, fontWeight: i === 0 ? 600 : 400 }}>{cat}</span>
                ))}
              </div>
              {[{ name: "Jollof Rice", price: "₦2,500" }, { name: "Grilled Chicken", price: "₦4,500" }].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderTop: "1px solid #F3F4F6" }}>
                  <div style={{ width: 48, height: 48, background: "#F3F4F6", borderRadius: 6, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🍛</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: NAVY }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: data.color, fontWeight: 700 }}>{item.price}</div>
                  </div>
                  <div style={{ background: data.color, color: data.color === "#fff" ? NAVY : "#fff", borderRadius: 12, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700 }}>+</div>
                </div>
              ))}
            </div>
          </div>
          <p style={{ fontSize: 11, color: "#9CA3AF", textAlign: "center", marginTop: 8 }}>Updates as you type</p>
        </div>
      )}
    </div>
  );
}

function StepBusiness({ data, setData, isMobile }) {
  return (
    <div style={{ maxWidth: 600 }}>
      <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: isMobile ? 24 : 36, color: NAVY, margin: "0 0 8px" }}>Tell customers about your business</h2>
      <p style={{ color: "#6B7280", fontSize: isMobile ? 14 : 16, margin: "0 0 32px" }}>This information appears on your store page in the DukaDesk app.</p>
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>About Your Business</label>
        <textarea value={data.bizDesc} onChange={e => setData(d => ({ ...d, bizDesc: e.target.value }))} placeholder="Tell customers what makes you special..." style={{ ...inputStyle, height: 100, resize: "vertical", paddingTop: 12 }} />
        <div style={{ textAlign: "right", fontSize: 11, color: "#9CA3AF" }}>{(data.bizDesc || "").length}/500</div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Contact Phone</label>
        <div style={{ display: "flex", gap: 8, flexDirection: isMobile ? "column" : "row" }}>
          <div style={{ ...inputStyle, maxWidth: isMobile ? "100%" : 90, display: "flex", alignItems: "center", justifyContent: "center" }}>🇳🇬 +234</div>
          <input value={data.phone} onChange={e => setData(d => ({ ...d, phone: e.target.value }))} placeholder="801 234 5678" style={{ ...inputStyle, flex: 1 }} />
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Business Address</label>
        <input value={data.address} onChange={e => setData(d => ({ ...d, address: e.target.value }))} placeholder="12 Admiralty Way, Lekki, Lagos" style={inputStyle} onFocus={e => e.target.style.borderColor = AMBER} onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
      </div>
      <div style={{ marginBottom: 24 }}>
        <label style={labelStyle}>Operating Hours</label>
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: isMobile ? 8 : 16, padding: "12px 16px", borderBottom: i < 6 ? "1px solid #F3F4F6" : "none", flexWrap: isMobile ? "wrap" : "nowrap" }}>
              <span style={{ width: isMobile ? 60 : 90, fontSize: 14, color: NAVY, fontWeight: 500 }}>{day}</span>
              <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                <input type="checkbox" defaultChecked={i < 5} />
                <span style={{ fontSize: 13, color: "#6B7280" }}>Open</span>
              </label>
              <input type="time" defaultValue="09:00" style={{ border: "1px solid #E5E7EB", borderRadius: 6, padding: "4px 8px", fontSize: 13 }} />
              <span style={{ color: "#9CA3AF" }}>to</span>
              <input type="time" defaultValue="22:00" style={{ border: "1px solid #E5E7EB", borderRadius: 6, padding: "4px 8px", fontSize: 13 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepIntegrations({ data, setData, isMobile }) {
  const toggle = (name) => setData(d => {
    const has = d.selectedIntegrations.includes(name);
    return { ...d, selectedIntegrations: has ? d.selectedIntegrations.filter(x => x !== name) : [...d.selectedIntegrations, name] };
  });
  const badgeColor = { Popular: { bg: "#FFF8ED", color: "#92400E" }, Free: { bg: "#F0FDF4", color: "#065F46" }, Premium: { bg: `${NAVY}11`, color: NAVY } };

  return (
    <div>
      <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: isMobile ? 24 : 36, color: NAVY, margin: "0 0 8px" }}>Supercharge your app</h2>
      <p style={{ color: "#6B7280", fontSize: isMobile ? 14 : 16, margin: "0 0 32px" }}>Pick the integrations that match your business. Add more anytime.</p>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 300px", gap: 28 }}>
        <div>
          {integrations.map((cat, ci) => (
            <div key={ci} style={{ marginBottom: 28 }}>
              <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 16, color: NAVY, marginBottom: 12 }}>{cat.cat}</div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
                {cat.items.map((item, ii) => {
                  const added = data.selectedIntegrations.includes(item.name);
                  const bc = badgeColor[item.badge] || badgeColor.Free;
                  return (
                    <div key={ii} style={{ background: added ? "#FFF8ED" : "#fff", border: `2px solid ${added ? AMBER : "#E5E7EB"}`, borderRadius: 10, padding: 16, cursor: "pointer", transition: "all 0.15s" }} onClick={() => toggle(item.name)}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                        <span style={{ fontSize: 24 }}>{item.icon}</span>
                        <span style={{ background: bc.bg, color: bc.color, fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 10 }}>{item.badge}</span>
                      </div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: NAVY, marginBottom: 4 }}>{item.name}</div>
                      <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 10 }}>{item.desc}</div>
                      <button style={{ background: added ? "#2ECC71" : AMBER, color: "#fff", border: "none", borderRadius: 16, padding: "5px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", width: "100%" }}>{added ? "✓ Added" : "Add →"}</button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        {!isMobile && (
          <div style={{ position: "sticky", top: 20 }}>
            <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #E5E7EB", marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 15, color: NAVY }}>Selected ({data.selectedIntegrations.length})</span>
                <button onClick={() => setData(d => ({ ...d, selectedIntegrations: [] }))} style={{ background: "none", border: "none", color: AMBER, fontSize: 12, cursor: "pointer" }}>Clear All</button>
              </div>
              {data.selectedIntegrations.length === 0 && <p style={{ color: "#9CA3AF", fontSize: 13 }}>No integrations selected yet.</p>}
              {data.selectedIntegrations.map((name, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #F3F4F6" }}>
                  <span style={{ fontSize: 14, color: NAVY, fontWeight: 500 }}>✓ {name}</span>
                  <button onClick={(e) => { e.stopPropagation(); toggle(name); }} style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer", fontSize: 16 }}>×</button>
                </div>
              ))}
            </div>
            <div style={{ background: "#FFF8ED", border: "1px solid #F4A026", borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 13, color: "#92400E" }}>💡 You can add or remove integrations anytime from your dashboard.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Published({ onFinish, showToast, isMobile }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { setCopied(true); showToast("Store link copied!", "success"); setTimeout(() => setCopied(false), 2000); };
  return (
    <div style={{ minHeight: "100vh", background: "#F7F8FA", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", maxWidth: 760, padding: isMobile ? 20 : 40 }}>
        <div style={{ fontSize: 80, marginBottom: 16 }}>🎉</div>
        <div style={{ width: 80, height: 80, background: "#F0FDF4", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 40 }}>✓</div>
        <h1 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: isMobile ? 32 : 48, color: NAVY, marginBottom: 8 }}>Your App is Live!</h1>
        <p style={{ color: "#6B7280", fontSize: isMobile ? 16 : 18, marginBottom: 40 }}>Mama&apos;s Kitchen is now on DukaDesk. 🚀</p>
        <div style={{ background: "#fff", borderRadius: 16, padding: isMobile ? 24 : 40, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 24 : 40, textAlign: "left", marginBottom: 32 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 16, color: NAVY, marginBottom: 16 }}>Your QR Code</div>
            <div style={{ width: isMobile ? 120 : 160, height: isMobile ? 120 : 160, background: "#F3F4F6", borderRadius: 12, margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: isMobile ? 60 : 80 }}>▣</div>
            <div style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 16, wordBreak: "break-all" }}>dukadesk.app/mamas-kitchen</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
              <button onClick={() => showToast("QR downloaded!", "success")} style={{ background: AMBER, color: NAVY, border: "none", borderRadius: 20, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>⬇ Download PNG</button>
              <button onClick={copy} style={{ background: copied ? "#2ECC71" : "none", color: copied ? "#fff" : AMBER, border: `1px solid ${copied ? "#2ECC71" : AMBER}`, borderRadius: 20, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{copied ? "Copied! ✓" : "Copy Link"}</button>
            </div>
          </div>
          <div>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 16, color: NAVY, marginBottom: 16 }}>What Happens Next</div>
            {[
              "Our team reviews your app (usually within 2 hours)",
              "You'll receive an email when you go live",
              "Start adding your products from your dashboard",
              "Share your QR code — customers scan to access your app!",
            ].map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 14, alignItems: "flex-start" }}>
                <div style={{ width: 24, height: 24, background: AMBER, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: NAVY, flexShrink: 0 }}>{i + 1}</div>
                <span style={{ fontSize: 14, color: "#374151", lineHeight: 1.5 }}>{step}</span>
              </div>
            ))}
          </div>
        </div>
        <button onClick={onFinish} style={{ background: AMBER, color: NAVY, border: "none", borderRadius: 28, padding: "16px 40px", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'Sora',sans-serif", marginRight: 12 }}>Go to My Dashboard →</button>
      </div>
    </div>
  );
}
