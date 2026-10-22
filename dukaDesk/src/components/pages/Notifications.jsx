import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Check, X, ArrowLeft, AlertCircle, Package, MessageSquare, CreditCard, TrendingUp, Megaphone, Send, Film, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useIsMobile } from "../../hooks/useMediaQuery";
import { NAVY, AMBER, cardStyle, inputStyle, labelStyle, btnPrimary, transition } from "../../theme";
import { getNotifications, markNotificationRead, dismissNotification, listPlatformUpdates, getPlatformUpdateThread, replyToPlatformUpdate, markPlatformUpdateRead } from "../../services/api";
import { Loading, Empty } from "../layout/States";

const iconMap = {
  order: { icon: Package, color: "#3B82F6", bg: "#EFF6FF" },
  message: { icon: MessageSquare, color: AMBER, bg: "#FFF8ED" },
  billing: { icon: CreditCard, color: "#2ECC71", bg: "#F0FDF4" },
  analytics: { icon: TrendingUp, color: "#7C3AED", bg: "#F5F3FF" },
  marketing: { icon: Megaphone, color: "#EC4899", bg: "#FDF2F8" },
};

function getIcon(type) {
  return iconMap[type] || { icon: Bell, color: "#6B7280", bg: "#F3F4F6" };
}

function platformMeta(item) {
  return item.kind === "direct"
    ? { icon: MessageSquare, color: AMBER, bg: "#FFF8ED", label: "Message from DukaDesk" }
    : { icon: Megaphone, color: "#EC4899", bg: "#FDF2F8", label: item.title || "Announcement from DukaDesk" };
}

export default function Notifications() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [platformUpdates, setPlatformUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  // Thread viewer (platform broadcasts + direct messages).
  const [thread, setThread] = useState(null);
  const [threadLoading, setThreadLoading] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);

  const loadNotifications = () => {
    setLoading(true);
    Promise.all([
      getNotifications().then(list => list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))).catch(() => { toast.error("Failed to load notifications"); return []; }),
      listPlatformUpdates().then(list => list).catch(() => []),
    ]).then(([notes, updates]) => {
      setNotifications(notes);
      setPlatformUpdates(updates);
      updates.filter(u => u.unread).forEach(u => { markPlatformUpdateRead(u.id).catch(() => {}); });
    }).finally(() => setLoading(false));
  };
  useEffect(loadNotifications, []);

  const handleMarkRead = async (id) => {
    await markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleDismiss = async (id) => {
    await dismissNotification(id);
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.info("Notification dismissed");
  };

  const openThread = (item) => {
    setThread({ ...item, replies: item.replies || [] });
    setReplyText("");
    if (item.unread) {
      markPlatformUpdateRead(item.id).catch(() => {});
      setPlatformUpdates(prev => prev.map(u => (u.id === item.id ? { ...u, unread: false, readAt: new Date().toISOString() } : u)));
    }
    setThreadLoading(true);
    getPlatformUpdateThread(item.id).then(full => {
      if (full?.id) setThread(current => (current?.id === full.id ? { ...current, ...full } : current));
    }).catch(() => {}).finally(() => setThreadLoading(false));
  };

  const sendReply = async () => {
    const text = replyText.trim();
    if (!text || !thread) return;
    setReplying(true);
    try {
      const reply = await replyToPlatformUpdate(thread.id, text);
      setThread(current => current ? { ...current, replies: [...(current.replies || []), reply] } : current);
      setReplyText("");
      setPlatformUpdates(prev => prev.map(u => (u.id === thread.id ? { ...u, canReply: true } : u)));
      toast.success("Reply sent to DukaDesk");
    } catch (error) {
      toast.error(error?.message || "Failed to send reply");
    } finally {
      setReplying(false);
    }
  };

  const platformUnread = platformUpdates.filter(u => u.unread).length;
  const unreadCount = notifications.filter(n => !n.read).length + platformUnread;

  if (loading) return <Loading message="Loading notifications..." />;

  const filtered = filter === "All" ? notifications : filter === "Unread" ? notifications.filter(n => !n.read) : notifications;

  return (
    <div style={{ animation: "fadeIn 0.35s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => navigate("/dashboard")} style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", display: "flex", padding: 0 }}>
              <ArrowLeft size={20} />
            </button>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: isMobile ? 22 : 28, color: NAVY, margin: 0 }}>Notifications</h2>
            {unreadCount > 0 && (
              <span style={{ background: AMBER, color: NAVY, fontSize: 12, fontWeight: 700, padding: "2px 10px", borderRadius: 10 }}>{unreadCount} new</span>
            )}
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["All", "Unread"].map(t => (
            <button key={t} onClick={() => setFilter(t)} style={{
              padding: "6px 14px", borderRadius: 8, border: "none",
              background: filter === t ? AMBER : "#F3F4F6",
              color: filter === t ? NAVY : "#6B7280",
              fontSize: 13, fontWeight: filter === t ? 700 : 500, cursor: "pointer",
            }}>{t}{t === "Unread" ? ` (${unreadCount})` : ""}</button>
          ))}
        </div>
      </div>

      {platformUpdates.length === 0 && filtered.length === 0 && (
        <Empty icon="ðŸ””" message={filter === "Unread" ? "No unread notifications" : "No notifications yet"} sub="Important alerts, updates and messages from DukaDesk will appear here" />
      )}

      {platformUpdates.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#9CA3AF", letterSpacing: 0.6, textTransform: "uppercase", margin: "0 0 8px" }}>DukaDesk</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {platformUpdates.map((item, i) => {
              const meta = platformMeta(item);
              const Icon = meta.icon;
              return (
                <div key={item.id} style={{
                  ...cardStyle,
                  display: "flex", gap: 14, alignItems: "flex-start",
                  opacity: item.unread ? 1 : 0.75,
                  borderLeft: item.unread ? `4px solid ${AMBER}` : "4px solid transparent",
                  animation: `fadeIn 0.3s ease ${i * 0.04}s both`,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }} onClick={() => openThread(item)} role="button" aria-label={`Open ${meta.label}`}>
                  <div style={{ width: 40, height: 40, background: meta.bg, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={18} color={meta.color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: item.unread ? 700 : 600, fontSize: 14, color: NAVY, marginBottom: 2 }}>{item.title || meta.label}</div>
                    <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.body}</div>
                    <div style={{ fontSize: 11, color: "#9CA3AF" }}>
                      {item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}
                      {item.kind === "direct" ? " · direct message" : " · broadcast"}
                      {(item.replies?.length || 0) > 0 && ` · ${item.replies.length} repl${item.replies.length === 1 ? "y" : "ies"}`}
                    </div>
                  </div>
                  {item.unread && <span style={{ fontSize: 11, fontWeight: 700, color: AMBER, borderRadius: 8, padding: "2px 8px", background: "#FFF8ED" }}>New</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {filtered.length > 0 && <div style={{ fontSize: 12, fontWeight: 700, color: "#9CA3AF", letterSpacing: 0.6, textTransform: "uppercase", margin: "0 0 8px" }}>Activity</div>}

      {filtered.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map((n, i) => {
            const meta = getIcon(n.type);
            const Icon = meta.icon;
            return (
              <div key={n.id} style={{
                ...cardStyle,
                display: "flex", gap: 14, alignItems: "flex-start",
                opacity: n.read ? 0.7 : 1,
                borderLeft: n.read ? `4px solid transparent` : `4px solid ${AMBER}`,
                animation: `fadeIn 0.3s ease ${i * 0.04}s both`,
                cursor: "pointer",
                transition: "all 0.2s",
              }} onClick={() => { if (!n.read) handleMarkRead(n.id); }}>
                <div style={{ width: 40, height: 40, background: meta.bg, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={18} color={meta.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: n.read ? 500 : 600, fontSize: 14, color: NAVY, marginBottom: 2 }}>{n.title || n.message}</div>
                  {n.message && <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 2 }}>{n.message}</div>}
                  <div style={{ fontSize: 11, color: "#9CA3AF" }}>{n.createdAt ? new Date(n.createdAt).toLocaleString() : ""}</div>
                </div>
                <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                  {!n.read && (
                    <button onClick={(e) => { e.stopPropagation(); handleMarkRead(n.id); }} title="Mark as read" style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", padding: 4, borderRadius: 6 }}>
                      <Check size={16} />
                    </button>
                  )}
                  <button onClick={(e) => { e.stopPropagation(); handleDismiss(n.id); }} title="Dismiss" style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", padding: 4, borderRadius: 6 }}>
                    <X size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {thread && (
        <div style={{ position: "fixed", inset: 0, zIndex: 320, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(15,15,26,0.5)", animation: "fadeIn 0.2s ease", padding: isMobile ? 12 : 0 }} onClick={() => setThread(null)}>
          <div style={{ ...cardStyle, width: "100%", maxWidth: 560, maxHeight: "88vh", display: "flex", flexDirection: "column", overflow: "hidden", animation: "fadeScaleIn 0.3s ease" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, padding: "18px 20px 12px", borderBottom: "1px solid var(--border)" }}>
              <div>
                <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 17, color: NAVY }}>{thread.title || platformMeta(thread).label}</div>
                <div style={{ fontSize: 12, color: "#9CA3AF" }}>{thread.kind === "direct" ? "Direct message" : "Broadcast"} · DukaDesk · {thread.createdAt ? new Date(thread.createdAt).toLocaleString() : ""}</div>
              </div>
              <button onClick={() => setThread(null)} style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer" }}><X size={18} /></button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12, background: "#FCFCFD" }}>
              <div style={{ ...cardStyle, alignSelf: "stretch", padding: 14 }}>
                {(thread.media || []).map((m, i) => (
                  <div key={i} style={{ borderRadius: 12, overflow: "hidden", marginBottom: m === thread.media[thread.media.length - 1] ? 10 : 8, border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", background: "#F9FAFB", minHeight: 120 }}>
                    {m.type === "image" ? (
                      <img src={m.url} alt="" style={{ width: "100%", display: "block", maxHeight: 240, objectFit: "cover" }} />
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: 24, color: NAVY, fontWeight: 600, fontSize: 13 }}><Film size={18} /> Video announcement</div>
                    )}
                  </div>
                ))}
                <div style={{ fontSize: 14, color: NAVY, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{thread.body}</div>
              </div>

              {threadLoading && <div style={{ color: "#9CA3AF", fontSize: 12, textAlign: "center" }}>Loading replies…</div>}
              {(thread.replies || []).map(reply => (
                <div key={reply.id} style={{ alignSelf: reply.author === "merchant" ? "flex-end" : "flex-start", maxWidth: "85%", background: reply.author === "merchant" ? "#FFF8ED" : "#F3F4F6", borderRadius: 14, padding: "10px 14px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: reply.author === "merchant" ? AMBER : "#6B7280", marginBottom: 3 }}>{reply.author === "merchant" ? "You" : "DukaDesk Team"}</div>
                  <div style={{ fontSize: 13.5, color: NAVY, lineHeight: 1.5 }}>{reply.body}</div>
                  <div style={{ fontSize: 10.5, color: "#9CA3AF", marginTop: 4 }}>{reply.createdAt ? new Date(reply.createdAt).toLocaleString() : ""}</div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: "1px solid var(--border)", padding: 14 }}>
              <label style={labelStyle}>Reply to DukaDesk</label>
              <textarea
                style={{ ...inputStyle, minHeight: 64, resize: "none" }}
                placeholder="Write a reply — replies land directly in the DukaDesk team thread"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                maxLength={2000}
              />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10, gap: 10 }}>
                <span style={{ fontSize: 13, color: "#9CA3AF" }}>Replies are private to your store</span>
                <button onClick={sendReply} disabled={replying || !replyText.trim()} style={{ ...btnPrimary, opacity: replying || !replyText.trim() ? 0.55 : 1, transition }}>
                  {replying ? <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> : <Send size={15} style={{ marginRight: 6 }} />} {replying ? "Sending" : "Send reply"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
