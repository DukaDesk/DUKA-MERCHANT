import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from "recharts";
import { Plus, Package, BarChart3, MessageSquare, Store, TrendingUp, Users, DollarSign, Star, ArrowRight } from "lucide-react";
import QRCode from "qrcode";
import { useAuth, useToast } from "../../contexts";
import { useIsMobile, useIsTablet } from "../../hooks/useMediaQuery";
import { NAVY, AMBER, cardStyle } from "../../theme";
import ApiClient from "../../services/ApiClient";
import { Loading, Empty } from "../layout/States";
import { useDispatchAction } from "../../runtime/RuntimeContext";
import { EventBus } from "../../runtime/EventBus";

export default function Dashboard() {
  const navigate = useNavigate();
  const showToast = useToast();
  const dispatchAction = useDispatchAction();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const { merchant } = useAuth();
  const [qrCopied, setQrCopied] = useState(false);
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deployedApp, setDeployedApp] = useState(null);
  const [filterChanged, setFilterChanged] = useState(null);

  useEffect(() => {
    ApiClient.getMyApp().then(setDeployedApp).catch(() => {});
  }, []);

  useEffect(() => {
    const unsub = EventBus.on("filter:changed", (data) => {
      setFilterChanged(data);
      showToast(`Filter applied: ${JSON.stringify(data)}`, "info");
    });
    return unsub;
  }, [showToast]);

  const storeSlug = deployedApp?.slug || ((merchant?.business || "my-store") || "").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const storeUrl = deployedApp?.storeUrl || `dukadesk.app/${storeSlug}`;

  const downloadQr = async () => {
    try {
      const url = await QRCode.toDataURL(`https://${storeUrl}`, { width: 400, margin: 1 });
      const a = document.createElement("a"); a.href = url; a.download = `${storeSlug}-qr.png`; a.click();
      showToast("QR code downloaded!", "success");
    } catch { showToast("Failed to generate QR code", "error"); }
  };

  useEffect(() => {
    Promise.all([ApiClient.getDashboardStats(), ApiClient.getRevenue(), ApiClient.getActivity()])
      .then(([s, r, a]) => { setStats(s); setRevenueData(r); setActivity(a); })
      .catch(() => showToast("Failed to load dashboard data", "error"))
      .finally(() => setLoading(false));
  }, []);

  const setup = ApiClient.getSetupData();
  const statusItems = [
    { dot: "#7C3AED", label: merchant?.name || "Merchant", sub: merchant?.email || "No email" },
    { dot: "#0D9488", label: merchant?.business || "Business", sub: merchant?.phone || "No phone" },
    { dot: "#2ECC71", label: "App Live", sub: `${deployedApp?.appName || setup?.appName || "Your App"} is active at ${deployedApp?.storeUrl || "dukadesk.app/..."}` },
    ...(deployedApp?.category ? [{ dot: AMBER, label: "Category: " + deployedApp.category, sub: "Template: " + (deployedApp?.template || "Not set") }] : []),
    ...(setup?.selectedIntegrations?.length ? [{ dot: "#7C3AED", label: `${setup.selectedIntegrations.length} Integrations Enabled`, sub: setup.selectedIntegrations.slice(0,4).join(", ") + (setup.selectedIntegrations.length > 4 ? "..." : "") }] : []),
    { dot: AMBER, label: `${stats?.reviewsCount || 0} reviews received`, sub: `${Math.ceil((stats?.reviewsCount || 0) * 0.15)} need response` },
  ];

  const copyLink = () => { navigator.clipboard.writeText(storeUrl); setQrCopied(true); showToast("Store link copied!", "success"); setTimeout(() => setQrCopied(false), 2000); };

  const handleNavigate = useCallback((page) => {
    dispatchAction({ type: "navigate", payload: { push: `/dashboard/${page}` } });
  }, [dispatchAction]);

  if (loading) return <Loading message="Loading dashboard..." />;
  if (!stats) return <Empty icon="📊" message="No dashboard data yet" sub={setup ? "Setup data saved. Complete your app setup to see stats here." : "Complete your app setup to see stats here"} action={<button onClick={() => navigate("/canvas-editor")} style={{ background: AMBER, color: NAVY, border: "none", borderRadius: 10, padding: "10px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>{setup ? "Continue Setup →" : "Setup Your App →"}</button>} />;

  const kpiData = [
    { label: "Total Customers", value: stats.customers.toLocaleString(), trend: "+34 this week", trendUp: true, icon: Users, color: "#7C3AED" },
    { label: "Revenue (This Month)", value: `₦${stats.revenue.toLocaleString()}`, trend: "+18% vs last month", trendUp: true, icon: DollarSign, color: AMBER },
    { label: "Unread Messages", value: stats.unreadMessages, trend: "Reply now →", trendUp: null, icon: MessageSquare, color: "#0D9488", page: "messages" },
    { label: "Avg Rating", value: `${stats.avgRating} ⭐`, trend: `(${stats.reviewsCount} reviews)`, trendUp: null, icon: Star, color: "#EC4899" },
  ];

  return (
    <div style={{ animation: "fadeIn 0.35s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: isMobile ? 22 : 28, color: NAVY, margin: 0 }}>Dashboard</h2>
          <p style={{ color: "#6B7280", fontSize: 14, marginTop: 4 }}>Your business at a glance</p>
        </div>
        <button onClick={() => navigate("/canvas-editor")} style={{ background: AMBER, color: NAVY, border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <Plus size={16} /> Edit App
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : isTablet ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: isMobile ? 12 : 18, marginBottom: isMobile ? 20 : 28 }}>
        {kpiData.map((k, i) => (
          <div key={i} style={{ ...cardStyle, position: "relative", overflow: "hidden", cursor: k.page ? "pointer" : "default" }} onClick={() => k.page && handleNavigate(k.page)}>
            <div style={{ position: "absolute", top: -8, right: -8, width: 56, height: 56, background: `${k.color}0A`, borderRadius: "50%" }} />
            <div style={{ width: 36, height: 36, background: `${k.color}12`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
              <k.icon size={18} color={k.color} />
            </div>
            <div style={{ fontSize: 13, color: "#6B7280", fontWeight: 500, marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: isMobile ? 24 : 28, color: NAVY, marginBottom: 4 }}>{k.value}</div>
            <div style={{ fontSize: 13, color: k.trendUp === true ? "#2ECC71" : k.trendUp === false ? "#E74C3C" : AMBER, fontWeight: 500 }}>{k.trendUp === true ? "↑ " : ""}{k.trend}</div>
          </div>
        ))}
      </div>

      <div style={{ ...cardStyle, marginBottom: 20, display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 12 }}>
        <div style={{ background: "#F9FAFB", borderRadius: 8, padding: "10px 12px" }}>
          <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 2 }}>Merchant</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>{merchant?.name || "—"}</div>
        </div>
        <div style={{ background: "#F9FAFB", borderRadius: 8, padding: "10px 12px" }}>
          <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 2 }}>Business</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>{merchant?.business || "—"}</div>
        </div>
        <div style={{ background: "#F9FAFB", borderRadius: 8, padding: "10px 12px" }}>
          <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 2 }}>Email</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>{merchant?.email || "—"}</div>
        </div>
        <div style={{ background: "#F9FAFB", borderRadius: 8, padding: "10px 12px" }}>
          <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 2 }}>Phone</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>{merchant?.phone || "—"}</div>
        </div>
        {deployedApp?.appName && <>
          <div style={{ background: "#F9FAFB", borderRadius: 8, padding: "10px 12px" }}>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 2 }}>App Name</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>{deployedApp?.appName}</div>
          </div>
          <div style={{ background: "#F9FAFB", borderRadius: 8, padding: "10px 12px" }}>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 2 }}>Category</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>{deployedApp?.category || setup?.category || "—"}</div>
          </div>
          <div style={{ background: "#F9FAFB", borderRadius: 8, padding: "10px 12px" }}>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 2 }}>Template</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>{deployedApp?.template || setup?.template || "—"}</div>
          </div>
          <div style={{ background: "#F9FAFB", borderRadius: 8, padding: "10px 12px" }}>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 2 }}>Integrations</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>{(deployedApp?.selectedIntegrations?.length || setup?.selectedIntegrations?.length || 0) + " enabled"}</div>
          </div>
        </>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 380px", gap: isMobile ? 16 : 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ ...cardStyle }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 16, color: NAVY }}>Recent Activity</span>
                <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>Latest customer actions</div>
              </div>
              <button onClick={() => handleNavigate("orders")} style={{ background: "none", border: "none", color: AMBER, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                View All <ArrowRight size={14} />
              </button>
            </div>
            {activity.length === 0 ? <Empty icon="🔔" message="No recent activity" sub="Customer actions will appear here" /> : activity.map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: i < activity.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                <div style={{ width: 40, height: 40, background: a.color + "18", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{a.icon}</div>
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
              <div>
                <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 16, color: NAVY }}>Revenue Trend</span>
                <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>Last 30 days</div>
              </div>
              <span style={{ fontSize: 13, color: "#2ECC71", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                <TrendingUp size={14} /> +18%
              </span>
            </div>
            {revenueData.length === 0 ? <Empty icon="📈" message="No revenue data yet" sub="Revenue will appear once you start receiving orders" /> : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revenueData}>
                <defs><linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={AMBER} stopOpacity={0.25}/><stop offset="100%" stopColor={AMBER} stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="week" tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={v => `₦${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={v => [`₦${v.toLocaleString()}`, "Revenue"]} contentStyle={{ borderRadius: 10, border: "1px solid #E8E8F0", boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }} />
                <Area type="monotone" dataKey="revenue" stroke={AMBER} strokeWidth={3} fill="url(#revGrad)" dot={{ fill: AMBER, r: 4, strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
            )}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ ...cardStyle }}>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 16, color: NAVY, marginBottom: 16 }}>Quick Actions</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { label: "Add Product", icon: Plus, page: "products" },
                { label: "View Orders", icon: Package, page: "orders", accent: true },
                { label: "Messages", icon: MessageSquare, page: "messages", outline: true },
                { label: "Analytics", icon: BarChart3, page: "analytics", outline: true },
              ].map((a, i) => (
                <button key={i} onClick={() => handleNavigate(a.page)} style={{
                  background: a.accent ? NAVY : a.outline ? "#fff" : `${AMBER}15`,
                  color: a.accent ? "#fff" : NAVY,
                  border: a.outline ? `1.5px solid var(--border)` : "none",
                  borderRadius: 10, padding: "14px 12px", cursor: "pointer",
                  fontWeight: 600, fontSize: 13, fontFamily: "'Sora',sans-serif",
                  display: "flex", alignItems: "center", gap: 8, transition: "all 0.15s",
                }}>
                  <a.icon size={16} />{a.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ ...cardStyle }}>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 16, color: NAVY, marginBottom: 16 }}>App Status</div>
              <div style={{ marginBottom: 16, padding: "12px 14px", background: deployedApp ? "#F0FDF4" : "#FFF8ED", border: `1px solid ${deployedApp ? "#86EFAC" : AMBER}`, borderRadius: 10, display: "flex", alignItems: "center", gap: 10 }}>
                <Store size={20} color={deployedApp ? "#2ECC71" : AMBER} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: deployedApp ? "#065F46" : "#92400E" }}>{deployedApp?.appName || setup?.appName || "Your App"} {deployedApp ? "is live" : "not yet deployed"}</div>
                  <div style={{ fontSize: 12, color: deployedApp ? "#065F46" : "#92400E" }}>{deployedApp ? "Scannable QR ready" : "Complete the wizard to go live"}</div>
                </div>
              </div>
            {statusItems.map((r, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: i < statusItems.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                <div style={{ width: 8, height: 8, background: r.dot, borderRadius: "50%", marginTop: 5, flexShrink: 0, boxShadow: `0 0 0 2px ${r.dot}22` }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>{r.label}</div>
                  <div style={{ fontSize: 12, color: "#6B7280" }}>{r.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ ...cardStyle, textAlign: "center" }}>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 16, color: NAVY, marginBottom: 16 }}>Your QR Code</div>
            <div style={{ width: 100, height: 100, background: "#F3F4F6", borderRadius: 10, margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, border: "1px solid #E8E8F0" }}>▣</div>
            <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 12, wordBreak: "break-all" }}>{storeUrl}</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={copyLink} style={{
                flex: 1, background: qrCopied ? "#2ECC71" : AMBER,
                color: qrCopied ? "#fff" : NAVY, border: "none",
                borderRadius: 10, padding: "9px 0", fontSize: 13,
                fontWeight: 700, cursor: "pointer", fontFamily: "'Sora',sans-serif",
              }}>{qrCopied ? "Copied! ✓" : "Copy Link"}</button>
              <button onClick={downloadQr} style={{
                flex: 1, background: "none",
                border: `1.5px solid var(--border)`, color: NAVY,
                borderRadius: 10, padding: "9px 0", fontSize: 13,
                fontWeight: 600, cursor: "pointer",
              }}>Download</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
