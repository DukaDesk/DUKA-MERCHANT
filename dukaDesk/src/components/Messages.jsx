import { useState } from "react";
import { Search, X, Send, Paperclip, ChevronLeft } from "lucide-react";
import { useToast } from "../App";
import { useIsMobile } from "../hooks/useMediaQuery";
import { NAVY, AMBER, inputStyle } from "../theme";

const conversations = [
  { id: 1, name: "Chika Obi", last: "Is peppered gizzard still available?", time: "10:24 AM", unread: 2, orders: 5, spent: 12500 },
  { id: 2, name: "Tunde Adeyemi", last: "Thanks! Order received.", time: "9:05 AM", unread: 0, orders: 3, spent: 8200 },
  { id: 3, name: "Fatima Bello", last: "Can I get extra sauce?", time: "Yesterday", unread: 1, orders: 7, spent: 21000 },
  { id: 4, name: "Ibrahim Musa", last: "What time do you close?", time: "Yesterday", unread: 0, orders: 1, spent: 3200 },
];
const initMessages = {
  1: [
    { from: "customer", text: "Hi! Is peppered gizzard still available today?", time: "10:22 AM" },
    { from: "merchant", text: "Yes we do! 😊 Would you like to add it to an order?", time: "10:23 AM" },
    { from: "customer", text: "Yes please, with extra sauce", time: "10:24 AM" },
  ],
  2: [
    { from: "merchant", text: "Hi Tunde! Your order #DD-2041 has been confirmed.", time: "9:00 AM" },
    { from: "customer", text: "Thanks! Order received.", time: "9:05 AM" },
  ],
  3: [
    { from: "customer", text: "Can I get extra sauce with my jollof?", time: "Yesterday" },
    { from: "merchant", text: "Of course! Extra sauce noted 🍛", time: "Yesterday" },
    { from: "customer", text: "Can I get extra sauce?", time: "Yesterday" },
  ],
  4: [
    { from: "customer", text: "What time do you close today?", time: "Yesterday" },
  ],
};

export default function Messages() {
  const showToast = useToast();
  const isMobile = useIsMobile();
  const [active, setActive] = useState(conversations[0]);
  const [messages, setMessages] = useState(initMessages);
  const [text, setText] = useState("");
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [tab, setTab] = useState("All");

  const send = () => {
    if (!text.trim()) return;
    setMessages(m => ({ ...m, [active.id]: [...(m[active.id] || []), { from: "merchant", text, time: "Just now" }] }));
    setText("");
    showToast("Message sent!", "success");
    setTimeout(() => {
      setMessages(m => ({ ...m, [active.id]: [...(m[active.id] || []), { from: "customer", text: "Got it, thanks! 🙏", time: "Just now" }] }));
    }, 1200);
  };

  const submitReport = () => {
    if (!reportReason) { showToast("Please select a reason", "error"); return; }
    setReportOpen(false);
    showToast("Report submitted. Our team will review within 24 hours.", "success");
    setReportReason("");
  };

  const filtered = tab === "All" ? conversations : conversations.filter(c => c.unread > 0);

  return (
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "300px 1fr 280px", height: isMobile ? "calc(100vh - 120px)" : "calc(100vh - 128px)", background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
      <div style={{ borderRight: "1px solid #E5E7EB", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "20px 16px 12px" }}>
          <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 18, color: NAVY, marginBottom: 12 }}>Messages</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F3F4F6", borderRadius: 8, padding: "8px 12px" }}>
            <Search size={16} color="#9CA3AF" />
            <input placeholder="Search customers..." style={{ background: "none", border: "none", outline: "none", fontSize: 13, color: NAVY, flex: 1, fontFamily: "inherit" }} />
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
            {["All", "Unread"].map(t => <button key={t} onClick={() => setTab(t)} style={{ padding: "5px 12px", borderRadius: 16, border: `1px solid ${tab===t?AMBER:"#E5E7EB"}`, background: tab===t?"#FFF8ED":"#fff", color: tab===t?"#92400E":"#6B7280", fontSize: 12, fontWeight: tab===t?600:400, cursor: "pointer" }}>{t}{t==="Unread"?" (3)":""}</button>)}
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {filtered.map(c => (
            <div key={c.id} onClick={() => setActive(c)} style={{ padding: "14px 16px", cursor: "pointer", background: active.id === c.id ? "#FFF8ED" : c.unread ? "#fff" : "#FAFAFA", borderLeft: active.id === c.id ? `3px solid ${AMBER}` : "3px solid transparent", borderBottom: "1px solid #F3F4F6", display: "flex", gap: 10 }}>
              <div style={{ width: 44, height: 44, background: AMBER, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: NAVY, flexShrink: 0, fontSize: 16 }}>{c.name[0]}</div>
              <div style={{ flex: 1, overflow: "hidden" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: c.unread ? 700 : 500, fontSize: 14, color: NAVY }}>{c.name}</span>
                  <span style={{ fontSize: 11, color: "#9CA3AF" }}>{c.time}</span>
                </div>
                <div style={{ fontSize: 12, color: "#6B7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 2 }}>{c.last}</div>
              </div>
              {c.unread > 0 && <span style={{ background: AMBER, color: NAVY, fontSize: 11, fontWeight: 700, width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{c.unread}</span>}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, background: AMBER, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: NAVY }}>{active.name[0]}</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, color: NAVY }}>{active.name}</div>
            <div style={{ fontSize: 12, color: "#6B7280" }}>Customer since May 2025 · {active.orders} orders</div>
          </div>
          <button onClick={() => setReportOpen(true)} style={{ marginLeft: "auto", background: "#FEE2E2", color: "#E74C3C", border: "1px solid #FECACA", borderRadius: 20, padding: "5px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>⚠️ Report</button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ textAlign: "center", fontSize: 11, color: "#9CA3AF", padding: "4px 0" }}>Today</div>
          {(messages[active.id] || []).map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.from === "merchant" ? "flex-end" : "flex-start", gap: 8 }}>
              {m.from === "customer" && <div style={{ width: 28, height: 28, background: AMBER, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: NAVY, flexShrink: 0, alignSelf: "flex-end" }}>{active.name[0]}</div>}
              <div style={{ maxWidth: "60%", background: m.from === "merchant" ? AMBER : "#fff", color: m.from === "merchant" ? NAVY : "#374151", borderRadius: m.from === "merchant" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", padding: "10px 14px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize: 14, lineHeight: 1.5 }}>{m.text}</div>
                <div style={{ fontSize: 10, color: m.from === "merchant" ? "rgba(26,26,46,0.5)" : "#9CA3AF", marginTop: 4, textAlign: "right" }}>{m.time} {m.from === "merchant" ? "✓✓" : ""}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: "12px 20px", borderTop: "1px solid #E5E7EB", display: "flex", gap: 10, alignItems: "center" }}>
          <button onClick={() => showToast("File attachment coming soon", "info")} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", display: "flex" }}>
            <Paperclip size={20} />
          </button>
          <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Type a reply..." style={{ flex: 1, height: 44, border: "1px solid #E5E7EB", borderRadius: 22, padding: "0 16px", fontSize: 14, fontFamily: "inherit", outline: "none", background: "#F9FAFB" }} onFocus={e => e.target.style.borderColor = AMBER} onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
          <button onClick={send} style={{ width: 44, height: 44, background: AMBER, border: "none", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Send size={18} color={NAVY} />
          </button>
        </div>
      </div>

      {!isMobile && <div style={{ borderLeft: "1px solid #E5E7EB", padding: 20, overflowY: "auto" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>Customer Details</div>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ width: 56, height: 56, background: AMBER, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 22, color: NAVY, margin: "0 auto 8px" }}>{active.name[0]}</div>
          <div style={{ fontWeight: 600, fontSize: 16, color: NAVY }}>{active.name}</div>
          <div style={{ fontSize: 12, color: "#9CA3AF" }}>{active.name.toLowerCase().replace(" ",".")}@gmail.com</div>
        </div>
        <div style={{ background: "#F9FAFB", borderRadius: 10, padding: 14, marginBottom: 16 }}>
          {[
            { label: "Total Spent", value: `₦${active.spent.toLocaleString()}` },
            { label: "Orders", value: active.orders },
            { label: "Customer Since", value: "May 2025" },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 2 ? "1px solid #E5E7EB" : "none" }}>
              <span style={{ fontSize: 12, color: "#6B7280" }}>{r.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>{r.value}</span>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Recent Orders</div>
        {[{ id: "DD-2041", total: "₦7,000", status: "Completed" }, { id: "DD-2038", total: "₦3,500", status: "Completed" }].map((o, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F3F4F6", fontSize: 13 }}>
            <span style={{ color: AMBER, fontWeight: 600 }}>{o.id}</span>
            <span style={{ color: "#6B7280" }}>{o.total}</span>
            <span style={{ color: "#2ECC71" }}>✓</span>
          </div>
        ))}
      </div>}

      {reportOpen && (
        <>
          <div onClick={() => setReportOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200 }} />
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "#fff", borderRadius: 16, padding: 32, width: 420, zIndex: 201, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 20, color: NAVY, margin: "0 0 20px" }}>Report this conversation</h3>
            {["Scam or Fraud", "Harassment or Abuse", "Spam", "Fake Business", "Other"].map(r => (
              <label key={r} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid #F3F4F6", cursor: "pointer" }}>
                <input type="radio" name="report" value={r} checked={reportReason === r} onChange={() => setReportReason(r)} />
                <span style={{ fontSize: 14, color: NAVY }}>{r}</span>
              </label>
            ))}
            <textarea placeholder="Add details (optional)..." style={{ width: "100%", marginTop: 16, border: "1px solid #E5E7EB", borderRadius: 8, padding: 12, fontSize: 14, fontFamily: "inherit", resize: "none", height: 72, boxSizing: "border-box", outline: "none" }} />
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={submitReport} style={{ flex: 1, background: "#E74C3C", color: "#fff", border: "none", borderRadius: 24, height: 48, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Submit Report</button>
              <button onClick={() => setReportOpen(false)} style={{ flex: 1, background: "none", border: "1px solid #E5E7EB", borderRadius: 24, height: 48, fontSize: 15, cursor: "pointer", color: "#6B7280" }}>Cancel</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
