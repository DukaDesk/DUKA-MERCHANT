import { useState, useEffect } from "react";
import { Search, X, Send, Paperclip, ChevronLeft, AlertTriangle } from "lucide-react";
import { useToast } from "../../App";
import { useIsMobile } from "../../hooks/useMediaQuery";
import { NAVY, AMBER, inputStyle } from "../../theme";
import { getConversations, getMessages, sendMessage } from "../../services/api";
import { MESSAGE_REPORT_REASONS } from "../../services/mockData";
import { Loading, Empty } from "../layout/States";

export default function Messages() {
  const showToast = useToast();
  const isMobile = useIsMobile();
  const [conversations, setConversations] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState({});
  const [text, setText] = useState("");
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [tab, setTab] = useState("All");
  const [convLoading, setConvLoading] = useState(true);

  useEffect(() => {
    getConversations().then(list => {
      setConversations(list);
      if (list.length > 0) setActive(list[0]);
    }).catch(() => showToast("Failed to load conversations", "error")).finally(() => setConvLoading(false));
  }, []);

  useEffect(() => {
    if (!active) return;
    if (!messages[active.id]) {
      getMessages(active.id).then(msgs => setMessages(m => ({ ...m, [active.id]: msgs }))).catch(() => showToast("Failed to load messages", "error"));
    }
  }, [active?.id]);

  const send = async () => {
    if (!text.trim()) return;
    const msg = { from: "merchant", text, time: "Just now" };
    setMessages(m => ({ ...m, [active.id]: [...(m[active.id] || []), msg] }));
    setText("");
    try {
      await sendMessage(active.id, text);
      setTimeout(async () => {
        await sendMessage(active.id, "Got it, thanks! 🙏");
        setMessages(m => ({ ...m, [active.id]: [...(m[active.id] || []), { from: "customer", text: "Got it, thanks! 🙏", time: "Just now" }] }));
      }, 1200);
    } catch { showToast("Failed to send message", "error"); }
  };

  const submitReport = () => {
    if (!reportReason) { showToast("Please select a reason", "error"); return; }
    setReportOpen(false);
    showToast("Report submitted. Our team will review within 24 hours.", "success");
    setReportReason("");
  };

  const filtered = tab === "All" ? conversations : conversations.filter(c => c.unread > 0);

  if (convLoading) return <Loading message="Loading messages..." />;
  if (conversations.length === 0) return <Empty icon="💬" message="No conversations yet" sub="Messages from customers will appear here" />;

  return (
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "300px 1fr 280px", height: isMobile ? "calc(100vh - 120px)" : "calc(100vh - 128px)", background: "#fff", borderRadius: 12, overflow: "hidden", border: "1px solid #E8E8F0", boxShadow: "0 1px 3px rgba(15,15,26,0.06)" }}>
      <div style={{ borderRight: "1px solid #E8E8F0", display: isMobile && active ? "none" : "flex", flexDirection: "column" }}>
        <div style={{ padding: "20px 16px 12px" }}>
          <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 18, color: NAVY, marginBottom: 12 }}>Messages</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F3F4F6", borderRadius: 10, padding: "8px 12px" }}>
            <Search size={16} color="#9CA3AF" />
            <input placeholder="Search customers..." style={{ background: "none", border: "none", outline: "none", fontSize: 13, color: NAVY, flex: 1, fontFamily: "inherit" }} />
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
            {["All", "Unread"].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: "5px 12px", borderRadius: 8,
                border: `1.5px solid ${tab===t?AMBER:"#E8E8F0"}`,
                background: tab===t?"#FFF8ED":"#fff",
                color: tab===t?"#92400E":"#6B7280",
                fontSize: 12, fontWeight: tab===t?600:400, cursor: "pointer",
              }}>{t}{t==="Unread"?" (3)":""}</button>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {filtered.map(c => (
            <div key={c.id} onClick={() => setActive(c)} style={{
              padding: "14px 16px", cursor: "pointer",
              background: active?.id === c.id ? "#FFF8ED" : c.unread ? "#fff" : "#FAFAFA",
              borderLeft: active?.id === c.id ? `3px solid ${AMBER}` : "3px solid transparent",
              borderBottom: "1px solid #F3F4F6",
              display: "flex", gap: 10,
            }}>
              <div style={{ width: 44, height: 44, background: AMBER, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: NAVY, flexShrink: 0, fontSize: 16 }}>{(c.name || "?")[0]}</div>
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

      {active ? (
        <>
          <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #E8E8F0", display: "flex", alignItems: "center", gap: 12 }}>
              {isMobile && <button onClick={() => setActive(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280", display: "flex" }}><ChevronLeft size={20} /></button>}
              <div style={{ width: 40, height: 40, background: AMBER, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: NAVY }}>{(active.name || "?")[0]}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15, color: NAVY }}>{active.name}</div>
                <div style={{ fontSize: 12, color: "#6B7280" }}>Customer · {active.orders} orders</div>
              </div>
              <button onClick={() => setReportOpen(true)} style={{ marginLeft: "auto", background: "#FEE2E2", color: "#E74C3C", border: "1px solid #FECACA", borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                <AlertTriangle size={12} /> Report
              </button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ textAlign: "center", fontSize: 11, color: "#9CA3AF", padding: "4px 0", background: "#F9FAFB", borderRadius: 6 }}>Today</div>
              {(messages[active.id] || []).map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: m.from === "merchant" ? "flex-end" : "flex-start", gap: 8, animation: "fadeIn 0.2s ease" }}>
                  {m.from === "customer" && <div style={{ width: 28, height: 28, background: AMBER, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: NAVY, flexShrink: 0, alignSelf: "flex-end" }}>{(active.name || "?")[0]}</div>}
                  <div style={{ maxWidth: "65%", background: m.from === "merchant" ? AMBER : "#F3F4F6", color: m.from === "merchant" ? NAVY : "#374151", borderRadius: m.from === "merchant" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", padding: "10px 14px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                    <div style={{ fontSize: 14, lineHeight: 1.5 }}>{m.text}</div>
                    <div style={{ fontSize: 10, color: m.from === "merchant" ? "rgba(15,15,26,0.4)" : "#9CA3AF", marginTop: 4, textAlign: "right" }}>{m.time}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: "12px 20px", borderTop: "1px solid #E8E8F0", display: "flex", gap: 10, alignItems: "center" }}>
              <button onClick={() => showToast("File attachment coming soon", "info")} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", display: "flex", padding: 4 }}>
                <Paperclip size={20} />
              </button>
              <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Type a reply..." style={{ flex: 1, height: 44, border: "1.5px solid #E8E8F0", borderRadius: 22, padding: "0 16px", fontSize: 14, fontFamily: "inherit", outline: "none", background: "#F9FAFB" }} />
              <button onClick={send} style={{ width: 44, height: 44, background: AMBER, border: "none", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Send size={18} color={NAVY} />
              </button>
            </div>
          </div>

          {!isMobile && (
            <div style={{ borderLeft: "1px solid #E8E8F0", padding: 20, overflowY: "auto" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>Customer Details</div>
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{ width: 56, height: 56, background: AMBER, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 22, color: NAVY, margin: "0 auto 8px" }}>{(active.name || "?")[0]}</div>
                <div style={{ fontWeight: 600, fontSize: 16, color: NAVY }}>{active.name}</div>
                <div style={{ fontSize: 12, color: "#9CA3AF" }}>{active.name.toLowerCase().replace(" ",".")}@gmail.com</div>
              </div>
              <div style={{ background: "#F9FAFB", borderRadius: 10, padding: 14, marginBottom: 16 }}>
                {[
                  { label: "Total Spent", value: `₦${active.spent.toLocaleString()}` },
                  { label: "Orders", value: active.orders },
                  { label: "Customer Since", value: "May 2025" },
                ].map((r, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 2 ? "1px solid #E8E8F0" : "none" }}>
                    <span style={{ fontSize: 12, color: "#6B7280" }}>{r.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>{r.value}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Recent Orders</div>
              {[{ id: "DD-2041", total: "₦7,000", status: "Completed" }, { id: "DD-2038", total: "₦3,500", status: "Completed" }].map((o, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F3F4F6", fontSize: 13 }}>
                  <span style={{ color: AMBER, fontWeight: 600, fontFamily: "'JetBrains Mono',monospace" }}>{o.id}</span>
                  <span style={{ color: "#6B7280" }}>{o.total}</span>
                  <span style={{ color: "#2ECC71" }}>✓</span>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        !isMobile && <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, color: "#9CA3AF", fontSize: 14 }}>Select a conversation to start chatting</div>
      )}

      {reportOpen && (
        <>
          <div onClick={() => setReportOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200 }} />
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "#fff", borderRadius: 16, padding: 32, width: isMobile ? "92%" : 420, maxWidth: 420, zIndex: 201, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", boxSizing: "border-box" }}>
            <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 20, color: NAVY, margin: "0 0 20px" }}>Report this conversation</h3>
            {MESSAGE_REPORT_REASONS.map(r => (
              <label key={r} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid #F3F4F6", cursor: "pointer" }}>
                <input type="radio" name="report" value={r} checked={reportReason === r} onChange={() => setReportReason(r)} style={{ accentColor: AMBER }} />
                <span style={{ fontSize: 14, color: NAVY }}>{r}</span>
              </label>
            ))}
            <textarea placeholder="Add details (optional)..." style={{ width: "100%", marginTop: 16, border: "1.5px solid #E8E8F0", borderRadius: 8, padding: 12, fontSize: 14, fontFamily: "inherit", resize: "none", height: 72, boxSizing: "border-box", outline: "none" }} />
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={submitReport} style={{ flex: 1, background: "#E74C3C", color: "#fff", border: "none", borderRadius: 10, height: 48, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Submit Report</button>
              <button onClick={() => setReportOpen(false)} style={{ flex: 1, background: "none", border: "1.5px solid #E8E8F0", borderRadius: 10, height: 48, fontSize: 15, cursor: "pointer", color: "#6B7280" }}>Cancel</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
