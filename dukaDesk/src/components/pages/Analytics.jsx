import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Download, TrendingUp, DollarSign, Star } from "lucide-react";
import { toast } from "react-toastify";
import { useIsMobile } from "../../hooks/useMediaQuery";
import { NAVY, AMBER, cardStyle } from "../../theme";
import { getRevenueData, getOrderStats, getTopProducts, getAnalyticsSummary } from "../../services/api";
import { Loading, Empty, ErrorState } from "../layout/States";

const PIE_COLORS = [AMBER, NAVY, "#E74C3C"];

export default function Analytics() {
  const isMobile = useIsMobile();
  const [rev, setRev] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAnalytics = () => {
    setError(null);
    setLoading(true);
    Promise.all([
      getRevenueData().catch(() => []),
      getOrderStats().catch(() => []),
      getTopProducts().catch(() => []),
      getAnalyticsSummary().catch(() => ({})),
    ]).then(([r, o, p]) => { setRev(r); setOrders(o); setProducts(p); })
      .catch(() => setError("Failed to load analytics"))
      .finally(() => setLoading(false));
  };
  useEffect(loadAnalytics, []);

  const totalRevenue = rev.length > 0 ? rev[rev.length - 1].v : 0;

  if (loading) return <Loading message="Loading analytics..." />;
  if (error) return <ErrorState message={error} onRetry={loadAnalytics} />;

  const metrics = [
    { icon: DollarSign, label: "Revenue", value: `₦${totalRevenue.toLocaleString()}`, trend: "+18%", up: true, color: AMBER },
    { icon: TrendingUp, label: "Orders", value: orders.reduce((a, o) => a + o.value, 0).toString(), trend: "This period", up: null, color: "#3B82F6" },
    { icon: Star, label: "Avg Rating", value: "4.8", trend: "(234 reviews)", up: null, color: "#EC4899" },
  ];

  return (
    <div style={{ animation: "fadeIn 0.35s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 28, color: NAVY, margin: 0 }}>Analytics</h2>
          <div style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>Your business performance metrics</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <select value={dateRange} onChange={e => setDateRange(e.target.value)} style={{ border: "1.5px solid var(--border)", borderRadius: 10, padding: "8px 14px", fontSize: 14, color: NAVY, background: "#fff", cursor: "pointer", outline: "none" }}>
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
            <option>This Month</option>
          </select>
          <button onClick={() => {
            const csv = [["Week","Revenue","Orders","Scans"].join(","), ...rev.map((r,i)=>
              [r.w, r.v, orders[i]?.value||0, scans[i]?.scans||0].join(",")
            )].join("\n");
            const blob = new Blob([csv], {type:"text/csv"});
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a"); a.href = url; a.download = `analytics-${dateRange.replace(/\s/g,"-").toLowerCase()}.csv`; a.click();
            URL.revokeObjectURL(url);
            toast.success("Analytics exported!");
          }} style={{ border: "1.5px solid var(--border)", background: "#fff", borderRadius: 10, padding: "8px 16px", fontSize: 14, cursor: "pointer", color: NAVY, display: "flex", alignItems: "center", gap: 6 }}>
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(3,1fr)", gap: isMobile ? 10 : 14, marginBottom: 24 }}>
        {metrics.map((m, i) => (
          <div key={i} style={{ ...cardStyle, animation: `fadeIn 0.35s ease ${i * 0.07}s both` }}>
            <div style={{ width: 32, height: 32, background: `${m.color}12`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
              <m.icon size={16} color={m.color} />
            </div>
            <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>{m.label}</div>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 20, color: NAVY }}>{m.value}</div>
            <div style={{ fontSize: 12, color: m.up === true ? "#2ECC71" : m.up === false ? "#E74C3C" : AMBER, marginTop: 2 }}>{m.up === true ? "up " : ""}{m.trend}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "3fr 2fr", gap: 18, marginBottom: 20 }}>
        <div style={{ ...cardStyle }}>
          <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 16, color: NAVY, marginBottom: 20 }}>Revenue Over Time</div>
          {rev.length === 0 ? <Empty icon="TrendingUp" message="No revenue data yet" /> : (
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={rev}>
              <defs><linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={AMBER} stopOpacity={0.3}/><stop offset="100%" stopColor={AMBER} stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6"/>
              <XAxis dataKey="w" tick={{fontSize:12,fill:"#9CA3AF"}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:12,fill:"#9CA3AF"}} axisLine={false} tickLine={false} tickFormatter={v=>`₦${(v/1000).toFixed(0)}k`}/>
              <Tooltip formatter={v=>[`₦${v.toLocaleString()}`,"Revenue"]} contentStyle={{borderRadius:10,border:"1px solid #E8E8F0",boxShadow:"0 8px 24px rgba(0,0,0,0.1)"}}/>
              <Area type="monotone" dataKey="v" stroke={AMBER} strokeWidth={3} fill="url(#revGrad2)" dot={{fill:AMBER,r:4,strokeWidth:2,stroke:"#fff"}} activeDot={{r:6}}/>
            </AreaChart>
          </ResponsiveContainer>
          )}
        </div>
        <div style={{ ...cardStyle }}>
          <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 16, color: NAVY, marginBottom: 20 }}>Orders Breakdown</div>
          {orders.length === 0 ? <Empty icon="Package" message="No orders yet" /> : (
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={orders} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {orders.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]}/>)}
              </Pie>
              <Legend formatter={(v)=><span style={{fontSize:12,color:"#6B7280"}}>{v}</span>}/>
              <Tooltip/>
            </PieChart>
          </ResponsiveContainer>
          )}
        </div>
      </div>

      <div style={{ ...cardStyle }}>
        <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 16, color: NAVY, marginBottom: 4 }}>Top Products</div>
        <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 16 }}>Best performing items this period</div>
        {products.length === 0 ? <Empty icon="Trophy" message="No product data yet" sub="Sales data will appear once you start receiving orders" /> : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}>
            <thead><tr style={{ background: "#F9FAFB" }}>{["#","Product","Views","Orders","Revenue","Trend"].map(h => (
              <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:12, fontWeight:600, color:"#6B7280", textTransform:"uppercase", letterSpacing:0.5, borderBottom:"1px solid #E8E8F0" }}>{h}</th>
            ))}</tr></thead>
            <tbody>{products.map((p,i)=>(
              <tr key={i} style={{ borderBottom:"1px solid #F3F4F6", background:"#fff", transition:"background 0.2s", animation:`fadeIn 0.3s ease ${i*0.05}s both` }}>
                <td style={{ padding:"12px 14px", fontSize:14, fontWeight:700, color:AMBER, fontFamily:"'JetBrains Mono',monospace" }}>#{i+1}</td>
                <td style={{ padding:"12px 14px", fontSize:14, fontWeight:600, color:NAVY }}>{p.name}</td>
                <td style={{ padding:"12px 14px", fontSize:14, color:"#6B7280" }}>{p.views}</td>
                <td style={{ padding:"12px 14px", fontSize:14, color:"#6B7280" }}>{p.orders}</td>
                <td style={{ padding:"12px 14px", fontSize:14, fontWeight:700, color:AMBER }}>₦{p.revenue.toLocaleString()}</td>
                <td style={{ padding:"12px 14px", fontSize:16, color: p.trend==="up"?"#2ECC71":p.trend==="down"?"#E74C3C":"#6B7280" }}>{p.trend}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        )}
      </div>


    </div>
  );
}
