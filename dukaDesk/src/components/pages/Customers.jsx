import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Mail, Phone, MapPin, ShoppingBag, ArrowLeft, Calendar, MoreHorizontal } from "lucide-react";
import { useIsMobile } from "../../hooks/useMediaQuery";
import { useToast } from "../../contexts";
import { NAVY, AMBER, GREEN, cardStyle, inputStyle, glidePanel, transition } from "../../theme";

const MOCK_CUSTOMERS = [
  { id: 1, name: "Tunde Adeyemi", email: "tunde@example.com", phone: "+234 801 234 5678", orders: 12, spent: 84500, lastOrder: "2026-07-18", status: "Active", city: "Lekki", avatar: "T" },
  { id: 2, name: "Chika Obi", email: "chika@example.com", phone: "+234 802 345 6789", orders: 8, spent: 42300, lastOrder: "2026-07-17", status: "Active", city: "Ikeja", avatar: "C" },
  { id: 3, name: "Fatima Bello", email: "fatima@example.com", phone: "+234 803 456 7890", orders: 5, spent: 21200, lastOrder: "2026-07-15", status: "Active", city: "Abuja", avatar: "F" },
  { id: 4, name: "Ibrahim Musa", email: "ibrahim@example.com", phone: "+234 804 567 8901", orders: 3, spent: 9600, lastOrder: "2026-07-10", status: "Active", city: "Kano", avatar: "I" },
  { id: 5, name: "Grace Eze", email: "grace@example.com", phone: "+234 805 678 9012", orders: 15, spent: 124000, lastOrder: "2026-07-19", status: "Active", city: "Port Harcourt", avatar: "G" },
  { id: 6, name: "Amina Suleiman", email: "amina@example.com", phone: "+234 806 789 0123", orders: 1, spent: 3200, lastOrder: "2026-06-28", status: "Inactive", city: "Kaduna", avatar: "A" },
];

const MOCK_ORDERS_BY_CUSTOMER = {
  1: [
    { id: "DD-2041", date: "Jul 18", items: "Jollof Rice ×2", total: 7000, status: "Delivered" },
    { id: "DD-2032", date: "Jul 10", items: "Grilled Tilapia ×1", total: 4500, status: "Delivered" },
    { id: "DD-2018", date: "Jun 28", items: "Peppered Gizzard ×2", total: 3600, status: "Delivered" },
  ],
};

export default function Customers() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const showToast = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  const filtered = MOCK_CUSTOMERS.filter(c => {
    if (statusFilter !== "All" && c.status !== statusFilter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.email.toLowerCase().includes(search.toLowerCase()) && !c.phone.includes(search)) return false;
    return true;
  });

  const customerOrders = selected ? MOCK_ORDERS_BY_CUSTOMER[selected.id] || [] : [];

  return (
    <div style={{ animation: "fadeIn 0.35s ease" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4, flexWrap: "wrap", gap: 12 }}>
        <div>
          <button onClick={() => navigate("/dashboard")} style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 14, marginBottom: 8, padding: 0 }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: isMobile ? 22 : 28, color: NAVY, margin: 0 }}>Customers</h2>
          <div style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>{MOCK_CUSTOMERS.length} total · {MOCK_CUSTOMERS.filter(c => c.status === "Active").length} active</div>
        </div>
      </div>

      <div style={{ ...cardStyle, padding: "14px 16px", marginBottom: 20, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F3F4F6", borderRadius: 10, padding: "8px 12px", flex: 1, minWidth: 200 }}>
          <Search size={16} color="#9CA3AF" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers..." style={{ background: "none", border: "none", outline: "none", fontSize: 14, color: NAVY, flex: 1, fontFamily: "inherit" }} />
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["All", "Active", "Inactive"].map(f => (
            <button key={f} onClick={() => setStatusFilter(f)} style={{
              padding: "6px 14px", borderRadius: 8, border: "none",
              background: statusFilter === f ? AMBER : "#F3F4F6",
              color: statusFilter === f ? NAVY : "#6B7280",
              fontSize: 13, fontWeight: statusFilter === f ? 700 : 500, cursor: "pointer", transition,
            }}>{f}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: 12 }}>
        {filtered.map((c, i) => (
          <div key={c.id} onClick={() => setSelected(c)} style={{
            ...cardStyle, cursor: "pointer", transition,
            animation: `fadeIn 0.3s ease ${i * 0.04}s both`,
            border: selected?.id === c.id ? `2px solid ${AMBER}` : "1px solid var(--border)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, background: `linear-gradient(135deg, ${AMBER}, ${GREEN})`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: NAVY, flexShrink: 0 }}>{c.avatar}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: NAVY }}>{c.name}</div>
                <div style={{ fontSize: 12, color: "#6B7280" }}>{c.email}</div>
              </div>
              <div style={{
                padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                background: c.status === "Active" ? "#F0FDF4" : "#F3F4F6",
                color: c.status === "Active" ? "#065F46" : "#6B7280",
              }}>{c.status}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 13, color: "#6B7280" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <ShoppingBag size={13} /> {c.orders} orders
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Calendar size={13} /> Last: {c.lastOrder}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                ₦{c.spent.toLocaleString()} total
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <MapPin size={13} /> {c.city}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ padding: 60, textAlign: "center", color: "#9CA3AF" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: 14, fontWeight: 500 }}>No customers match your search</div>
        </div>
      )}

      {selected && (
        <>
          <div onClick={() => setSelected(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 100 }} />
          <div style={{ ...glidePanel, width: 480 }}>
            <div style={{ padding: 24, borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 44, height: 44, background: `linear-gradient(135deg, ${AMBER}, ${GREEN})`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: NAVY }}>{selected.avatar}</div>
                <div>
                  <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 18, color: NAVY, margin: 0 }}>{selected.name}</h3>
                  <span style={{ fontSize: 13, color: "#6B7280" }}>Customer since {selected.lastOrder}</span>
                </div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280" }}><X size={22} /></button>
            </div>
            <div style={{ padding: 24, flex: 1, overflowY: "auto" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
                {[
                  { icon: Mail, label: "Email", value: selected.email },
                  { icon: Phone, label: "Phone", value: selected.phone },
                  { icon: MapPin, label: "Location", value: selected.city },
                  { icon: ShoppingBag, label: "Total Spent", value: `₦${selected.spent.toLocaleString()}` },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} style={{ background: "#F9FAFB", borderRadius: 10, padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <Icon size={13} color="#6B7280" />
                      <span style={{ fontSize: 12, color: "#6B7280" }}>{label}</span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: NAVY }}>{value}</div>
                  </div>
                ))}
              </div>

              <h4 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 15, color: NAVY, marginBottom: 12 }}>Order History</h4>
              {customerOrders.length === 0 ? (
                <div style={{ padding: 24, textAlign: "center", color: "#9CA3AF", fontSize: 13 }}>No orders yet</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {customerOrders.map(o => (
                    <div key={o.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "#F9FAFB", borderRadius: 10 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: GREEN, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>{o.id} · {o.items}</div>
                        <div style={{ fontSize: 12, color: "#6B7280" }}>{o.date}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>₦{o.total.toLocaleString()}</div>
                        <span style={{ fontSize: 11, color: GREEN, fontWeight: 600 }}>{o.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
