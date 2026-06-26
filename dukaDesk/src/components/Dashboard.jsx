import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Plus, Package, BarChart3, MessageSquare } from "lucide-react";
import { useToast } from "../App";
import { NAVY, AMBER, cardStyle } from "../theme";

const revenueData = [
  { week: "W1", revenue: 12000 }, { week: "W2", revenue: 28000 },
  { week: "W3", revenue: 22000 }, { week: "W4", revenue: 48200 },
];
const activity = [
  { icon: "🛒", title: "New order from Tunde Adeyemi", sub: "₦3,500 · 2 items", time: "10 min ago", color: AMBER },
  { icon: "💬", title: "New message from Chika Obi", sub: "Hi, is delivery available?", time: "25 min ago", color: "#7C3AED" },
  { icon: "⭐", title: "New 5-star review", sub: "Amazing food, will order again!", time: "1 hr ago", color: "#2ECC71" },
  { icon: "🛒", title: "New order from Fatima Bello", sub: "₦5,200 · 3 items", time: "3 hrs ago", color: AMBER },
  { icon: "📱", title: "App viewed 43 times today", sub: "Via QR scan", time: "Today", color: NAVY },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const showToast = useToast();
  const [qrCopied, setQrCopied] = useState(false);
  const copyLink = () => { setQrCopied(true); showToast("Store link copied!", "success"); setTimeout(() => setQrCopied(false), 2000); };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginBottom: 28 }}>
        {[
          { label: "Total Customers", value: "1,204", trend: "+34 this week", trendUp: true },
          { label: "Revenue (This Month)", value: "₦48,200", trend: "+18% vs last month", trendUp: true, amber: true },
          { label: "Unread Messages", value: "7", trend: "Reply now →", trendUp: null, action: () => navigate("/messages") },
          { label: "Avg Rating", value: "4.8 ⭐", trend: "(234 reviews)", trendUp: null },
        ].map((k, i) => (
          <div key={i} style={{ ...cardStyle }}>
            <div style={{ fontSize: 13, color: "#6B7280", fontWeight: 500, marginBottom: 8 }}>{k.label}</div>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 32, color: k.amber ? AMBER : NAVY, marginBottom: 6 }}>{k.value}</div>
            <div onClick={k.action} style={{ fontSize: 13, color: k.trendUp === true ? "#2ECC71" : k.trendUp === false ? "#E74C3C" : AMBER, fontWeight: 500, cursor: k.action ? "pointer" : "default" }}>{k.trendUp === true ? "↑ " : ""}{k.trend}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ ...cardStyle }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 16, color: NAVY }}>Recent Activity</span>
              <button onClick={() => navigate("/orders")} style={{ background: "none", border: "none", color: AMBER, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>View All →</button>
            </div>
            {activity.map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: i < activity.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                <div style={{ width: 40, height: 40, background: a.color + "22", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{a.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: NAVY }}>{a.title}</div>
                  <div style={{ fontSize: 12, color: "#6B7280" }}>{a.sub}</div>
                </div>
                <div style={{ fontSize: 12, color: "#9CA3AF", whiteSpace: "nowrap" }}>{a.time}</div>
              </div>
            ))}
          </div>

          <div style={{ ...cardStyle }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 16, color: NAVY }}>Revenue Trend</span>
              <span style={{ fontSize: 13, color: "#6B7280" }}>Last 30 Days</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="week" tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} tickFormatter={v => `₦${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={v => [`₦${v.toLocaleString()}`, "Revenue"]} contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }} />
                <Line type="monotone" dataKey="revenue" stroke={AMBER} strokeWidth={3} dot={{ fill: AMBER, r: 5 }} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ ...cardStyle }}>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 16, color: NAVY, marginBottom: 16 }}>Quick Actions</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { label: "Add Product", icon: Plus, page: "products" },
                { label: "View Orders", icon: Package, page: "orders", bg: NAVY, color: "#fff" },
                { label: "Messages", icon: MessageSquare, page: "messages", border: true },
                { label: "Analytics", icon: BarChart3, page: "analytics", border: true },
              ].map((a, i) => (
                <button key={i} onClick={() => navigate(`/${a.page}`)} style={{ background: a.bg || `${AMBER}22`, color: a.color || NAVY, border: a.border ? `1px solid ${AMBER}` : "none", borderRadius: 10, padding: "14px 12px", cursor: "pointer", fontWeight: 600, fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
                  <a.icon size={16} />{a.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ ...cardStyle }}>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 16, color: NAVY, marginBottom: 16 }}>App Status</div>
            {[
              { dot: "#2ECC71", label: "App Live", sub: "Your app is active" },
              { dot: "#2ECC71", label: "Paystack Connected", sub: "Payments enabled" },
              { dot: AMBER, label: "No products added yet", sub: "Add products →", action: () => navigate("/products") },
              { dot: AMBER, label: "2 unresponded reviews", sub: "Respond now →" },
            ].map((r, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: i < 3 ? "1px solid #F3F4F6" : "none" }}>
                <div style={{ width: 8, height: 8, background: r.dot, borderRadius: "50%", marginTop: 5, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>{r.label}</div>
                  <div onClick={r.action} style={{ fontSize: 12, color: r.action ? AMBER : "#6B7280", cursor: r.action ? "pointer" : "default" }}>{r.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ ...cardStyle, textAlign: "center" }}>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 16, color: NAVY, marginBottom: 16 }}>Your QR Code</div>
            <div style={{ width: 100, height: 100, background: "#F3F4F6", borderRadius: 8, margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>▣</div>
            <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 12 }}>dukadesk.app/mamas-kitchen</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={copyLink} style={{ flex: 1, background: qrCopied ? "#2ECC71" : AMBER, color: qrCopied ? "#fff" : NAVY, border: "none", borderRadius: 20, padding: "8px 0", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>{qrCopied ? "Copied! ✓" : "Copy Link"}</button>
              <button onClick={() => showToast("QR code downloaded!", "success")} style={{ flex: 1, background: "none", border: `1px solid ${AMBER}`, color: AMBER, borderRadius: 20, padding: "8px 0", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Download</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
