import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Check, X, ArrowLeft, AlertCircle, Package, MessageSquare, CreditCard, TrendingUp, Megaphone } from "lucide-react";
import { useToast } from "../../contexts";
import { useIsMobile } from "../../hooks/useMediaQuery";
import { NAVY, AMBER, cardStyle } from "../../theme";
import { getNotifications, markNotificationRead, dismissNotification } from "../../services/api";
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

export default function Notifications() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const showToast = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const loadNotifications = () => {
    setLoading(true);
    getNotifications().then(list => {
      const sorted = list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      setNotifications(sorted);
    }).catch(() => showToast("Failed to load notifications", "error"))
    .finally(() => setLoading(false));
  };
  useEffect(loadNotifications, []);

  const handleMarkRead = async (id) => {
    await markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleDismiss = async (id) => {
    await dismissNotification(id);
    setNotifications(prev => prev.filter(n => n.id !== id));
    showToast("Notification dismissed", "info");
  };

  const filtered = filter === "All" ? notifications : filter === "Unread" ? notifications.filter(n => !n.read) : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) return <Loading message="Loading notifications..." />;

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

      {filtered.length === 0 ? (
        <Empty icon="🔔" message={filter === "Unread" ? "No unread notifications" : "No notifications yet"} sub="Important alerts and updates will appear here" />
      ) : (
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
    </div>
  );
}
