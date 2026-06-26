import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from "recharts";
import { Download } from "lucide-react";
import { useIsMobile, useIsTablet } from "../hooks/useMediaQuery";
import { NAVY, AMBER, cardStyle } from "../theme";
import { getRevenueData, getOrderStats, getScanData, getTopProducts, getCustomerSplit } from "../services/api";

const PIE_COLORS = [AMBER, NAVY, "#E74C3C"];

export default function Analytics() {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const [rev, setRev] = useState([]);
  const [orders, setOrders] = useState([]);
  const [scans, setScans] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([{ name: "New", value: 34 }, { name: "Returning", value: 66 }]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getRevenueData(), getOrderStats(), getScanData(), getTopProducts(), getCustomerSplit()])
      .then(([r, o, s, p, c]) => { setRev(r); setOrders(o); setScans(s); setProducts(p); setCustomers(c); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalScans = scans.reduce((a, s) => a + s.scans, 0);

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: "#9CA3AF" }}>Loading analytics...</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 28, color: NAVY, margin: 0 }}>Analytics</h2>
        <div style={{ display: "flex", gap: 10 }}>
          <select style={{ border: "1px solid #E5E7EB", borderRadius: 8, padding: "8px 14px", fontSize: 14, color: NAVY, background: "#fff", cursor: "pointer" }}><option>Last 30 Days</option><option>Last 7 Days</option><option>This Month</option></select>
          <button style={{ border: "1px solid #E5E7EB", background: "#fff", borderRadius: 8, padding: "8px 16px", fontSize: 14, cursor: "pointer", color: NAVY, display: "flex", alignItems: "center", gap: 6 }}>
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : isTablet ? "repeat(3,1fr)" : "repeat(5,1fr)", gap: isMobile ? 10 : 14, marginBottom: 24 }}>
        {[
          { label:"Revenue", value:`₦${(rev.length ? rev[rev.length-1].v : 0).toLocaleString()}`, trend:"+18%", up:true },
          { label:"Orders", value:orders.reduce((a,o) => a+o.value, 0).toString(), trend:"Orders this period", up:null },
          { label:"Customers", value:customers.reduce((a,c) => a+c.value, 0).toString(), trend:"Total customers", up:null },
          { label:"QR Views", value:totalScans.toLocaleString(), trend:"via scan", up:null },
          { label:"Avg Rating", value:"4.8 ⭐", trend:"(234 reviews)", up:null },
        ].map((k,i) => (
          <div key={i} style={{ background:"#fff", borderRadius:10, padding:18, boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize:12, color:"#6B7280", marginBottom:6 }}>{k.label}</div>
            <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:22, color:NAVY }}>{k.value}</div>
            <div style={{ fontSize:12, color: k.up===true?"#2ECC71":k.up===false?"#E74C3C":AMBER, marginTop:4 }}>{k.up===true?"↑ ":""}{k.trend}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "3fr 2fr", gap:20, marginBottom:20 }}>
        <div style={{ ...cardStyle }}>
          <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:600, fontSize:16, color:NAVY, marginBottom:20 }}>Revenue Over Time</div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={rev}>
              <defs><linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={AMBER} stopOpacity={0.3}/><stop offset="100%" stopColor={AMBER} stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6"/>
              <XAxis dataKey="w" tick={{fontSize:12,fill:"#6B7280"}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:12,fill:"#6B7280"}} axisLine={false} tickLine={false} tickFormatter={v=>`₦${(v/1000).toFixed(0)}k`}/>
              <Tooltip formatter={v=>[`₦${v.toLocaleString()}`,"Revenue"]} contentStyle={{borderRadius:8,border:"none",boxShadow:"0 4px 16px rgba(0,0,0,0.1)"}}/>
              <Area type="monotone" dataKey="v" stroke={AMBER} strokeWidth={3} fill="url(#rg)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={{ ...cardStyle }}>
          <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:600, fontSize:16, color:NAVY, marginBottom:20 }}>Orders Breakdown</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={orders} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {orders.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]}/>)}
              </Pie>
              <Legend formatter={(v)=><span style={{fontSize:12,color:"#6B7280"}}>{v}</span>}/>
              <Tooltip/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap:20, marginBottom:20 }}>
        <div style={{ ...cardStyle }}>
          <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:600, fontSize:16, color:NAVY, marginBottom:4 }}>QR Scan Activity</div>
          <div style={{ fontSize:13, color:"#6B7280", marginBottom:16 }}>Your QR code was scanned {totalScans} times this week</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={scans}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6"/>
              <XAxis dataKey="day" tick={{fontSize:12,fill:"#6B7280"}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:12,fill:"#6B7280"}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{borderRadius:8,border:"none"}}/>
              <Bar dataKey="scans" fill={AMBER} radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ ...cardStyle }}>
          <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:600, fontSize:16, color:NAVY, marginBottom:4 }}>Customer Insights</div>
          <div style={{ fontSize:13, color:"#6B7280", marginBottom:16 }}>New vs returning customers</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={customers} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                {customers.map((_,i) => <Cell key={i} fill={i===0?NAVY:AMBER}/>)}
              </Pie>
              <Legend formatter={(v)=><span style={{fontSize:12,color:"#6B7280"}}>{v}</span>}/>
              <Tooltip/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ ...cardStyle }}>
        <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:600, fontSize:16, color:NAVY, marginBottom:16 }}>Top Products</div>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr style={{ background:"#F9FAFB" }}>{["#","Product","Views","Orders","Revenue","Trend"].map(h=><th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:12, fontWeight:600, color:"#6B7280", textTransform:"uppercase", letterSpacing:0.5, borderBottom:"1px solid #E5E7EB" }}>{h}</th>)}</tr></thead>
          <tbody>{products.map((p,i)=>(
            <tr key={i} style={{ borderBottom:"1px solid #F3F4F6", background: i%2===0?"#fff":"#FAFAFA" }}>
              <td style={{ padding:"12px 14px", fontSize:14, fontWeight:700, color:AMBER }}>#{i+1}</td>
              <td style={{ padding:"12px 14px", fontSize:14, fontWeight:600, color:NAVY }}>{p.name}</td>
              <td style={{ padding:"12px 14px", fontSize:14, color:"#6B7280" }}>{p.views}</td>
              <td style={{ padding:"12px 14px", fontSize:14, color:"#6B7280" }}>{p.orders}</td>
              <td style={{ padding:"12px 14px", fontSize:14, fontWeight:700, color:AMBER }}>₦{p.revenue.toLocaleString()}</td>
              <td style={{ padding:"12px 14px", fontSize:16, color: p.trend==="↑"?"#2ECC71":p.trend==="↓"?"#E74C3C":"#6B7280" }}>{p.trend}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
