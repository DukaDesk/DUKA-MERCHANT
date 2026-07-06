import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useIsMobile } from "../../hooks/useMediaQuery";
import { useAuth } from "../../App";
import { getMyApp, getSetupData } from "../../services/api";
import { AMBER, NAVY } from "../../theme";

const FALLBACK_COLOR = "#1B4332";
const FALLBACK_ITEMS = [
  { id: 1, name: "Jollof Rice & Chicken", desc: "Rich, smoky jollof with tender grilled chicken", price: 2500, img: "🍛", cat: "Popular" },
  { id: 2, name: "Peppered Gizzard", desc: "Spicy peppered gizzard with fried plantain", price: 1800, img: "🍗", cat: "Popular" },
  { id: 3, name: "Grilled Tilapia", desc: "Fresh tilapia grilled with peppers & spices", price: 4500, img: "🐟", cat: "Mains" },
  { id: 4, name: "Egusi Soup + Eba", desc: "Thick egusi soup with eba or pounded yam", price: 3200, img: "🥣", cat: "Mains" },
];

const DEFAULT_CATS = ["Popular", "Mains", "Drinks"];

export default function MiniAppPreview() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { merchant } = useAuth();
  const [app, setApp] = useState(null);
  const [activeCat, setActiveCat] = useState("Popular");
  const [cart, setCart] = useState({});
  const [orderType, setOrderType] = useState("Delivery");
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("menu");
  const [showCartModal, setShowCartModal] = useState(false);

  useEffect(() => {
    getMyApp().then(data => { setApp(data); }).catch(() => {
      // fallback to setup data if no deployed app
      const setup = getSetupData();
      if (setup) setApp(setup);
    }).finally(() => setLoading(false));
  }, []);

  const brandColor = app?.color || FALLBACK_COLOR;
  const storeName = app?.appName || app?.businessName || app?.business || merchant?.business || "My Store";
  const menuItems = app?.products?.length > 0 ? app.products.map(p => ({
    id: p.id, name: p.name, desc: p.cat || "", price: p.price, img: p.img || "🍛", cat: p.cat || "Mains",
  })) : FALLBACK_ITEMS;

  const cats = [...new Set(menuItems.map(m => m.cat))];
  const filteredItems = activeCat === "All" ? menuItems : menuItems.filter(m => m.cat === activeCat);
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = menuItems.find(m => String(m.id) === String(id));
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const addToCart = (item) => {
    setCart(c => ({ ...c, [item.id]: (c[item.id] || 0) + 1 }));
  };

  return (
    <div style={{ minHeight: "100vh", background: "#1a1a2e", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "#252547", padding: isMobile ? "10px 12px" : "12px 32px", display: "flex", gap: 8, alignItems: "center" }}>
        <button onClick={() => navigate("/dashboard")} style={{ background: "none", border: "1px solid #6B7280", color: "#D1D5DB", borderRadius: 8, padding: "8px 14px", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <span style={{ color: "#9CA3AF", fontSize: 12, marginLeft: 8 }}>
          {loading ? "Loading app..." : app ? `App: ${app.appName}` : "No app deployed yet"}
        </span>
        {app && (
          <a href={`https://${app.storeUrl}`} target="_blank" rel="noopener noreferrer" style={{ marginLeft: "auto", color: AMBER, fontSize: 13, textDecoration: "none" }}>
            {app.storeUrl} ↗
          </a>
        )}
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: isMobile ? "16px 8px" : "40px 20px" }}>
        <div style={{ width: isMobile ? "calc(100vw - 32px)" : 390, maxWidth: 390, background: NAVY, borderRadius: 44, padding: "12px", boxShadow: "0 40px 120px rgba(0,0,0,0.6)", position: "relative", margin: "0 auto" }}>
          <div style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", width: 120, height: 32, background: NAVY, borderRadius: "0 0 20px 20px", zIndex: 10 }} />
          <div style={{ background: "#fff", borderRadius: 36, overflow: "hidden", position: "relative", minHeight: isMobile ? 500 : 760 }}>
            <div onClick={() => navigate("/dashboard")} style={{ position: "absolute", top: 16, right: 16, zIndex: 10 }}>
              <div style={{ width: isMobile ? 36 : 40, height: isMobile ? 36 : 40, background: AMBER, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 16px rgba(0,0,0,0.3)", border: "2px solid rgba(255,255,255,0.6)" }}>
                <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: isMobile ? 16 : 18, color: NAVY }}>D</span>
              </div>
            </div>

            <div style={{ background: `linear-gradient(180deg, ${brandColor} 0%, ${brandColor}DD 100%)`, padding: "48px 16px 16px", minHeight: isMobile ? 130 : 160, position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23ffffff\\' fill-opacity=\\'0.03\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }} />
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>🟢 Open Now · 4.8 ⭐</div>
              <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: isMobile ? 18 : 22, color: "#fff", marginBottom: 10 }}>{storeName}</div>
              {app?.tagline && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", marginBottom: 10 }}>{app.tagline}</div>}
              <div style={{ display: "flex", gap: 8 }}>
                {["Delivery", "Pickup"].map(t => (
                  <button key={t} onClick={() => setOrderType(t)} style={{ padding: "7px 18px", borderRadius: 20, border: `1.5px solid ${orderType === t ? "#fff" : "rgba(255,255,255,0.3)"}`, background: orderType === t ? "#fff" : "transparent", color: orderType === t ? brandColor : "#fff", fontSize: isMobile ? 12 : 13, fontWeight: orderType === t ? 700 : 400, cursor: "pointer" }}>{t}</button>
                ))}
              </div>
            </div>

            <div style={{ padding: "12px 12px 4px", display: "flex", gap: 8, overflowX: "auto", background: "#fff", borderBottom: "1px solid #F3F4F6" }}>
              <button onClick={() => setActiveCat("All")} style={{ padding: "6px 14px", borderRadius: 20, border: `1.5px solid ${activeCat === "All" ? brandColor : "#E5E7EB"}`, background: activeCat === "All" ? brandColor : "#fff", color: activeCat === "All" ? "#fff" : "#6B7280", fontSize: 12, fontWeight: activeCat === "All" ? 600 : 400, cursor: "pointer", whiteSpace: "nowrap" }}>🔥 All</button>
              {cats.map(c => (
                <button key={c} onClick={() => setActiveCat(c)} style={{ padding: "6px 14px", borderRadius: 20, border: `1.5px solid ${activeCat === c ? brandColor : "#E5E7EB"}`, background: activeCat === c ? brandColor : "#fff", color: activeCat === c ? "#fff" : "#6B7280", fontSize: 12, fontWeight: activeCat === c ? 600 : 400, cursor: "pointer", whiteSpace: "nowrap" }}>{c}</button>
              ))}
            </div>

            <div style={{ padding: "8px 12px", background: "#F9FAFB", flex: 1 }}>
              {filteredItems.slice(0, 6).map(item => (
                <div key={item.id} style={{ display: "flex", gap: 10, padding: "12px 10px", background: "#fff", borderRadius: 10, marginBottom: 8, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                  <div style={{ width: isMobile ? 60 : 80, height: isMobile ? 60 : 80, background: "#F3F4F6", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: isMobile ? 28 : 36, flexShrink: 0 }}>{item.img}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: isMobile ? 12 : 13, color: NAVY, marginBottom: 3 }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 6, lineHeight: 1.3 }}>{item.desc}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: isMobile ? 13 : 14, color: brandColor }}>₦{item.price.toLocaleString()}</span>
                      <button onClick={() => addToCart(item)} style={{ background: AMBER, color: NAVY, border: "none", borderRadius: 16, padding: "5px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                        {cart[item.id] ? `${cart[item.id]} +` : "Add +"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {cartCount > 0 && (
              <div style={{ position: "absolute", bottom: 56, left: 0, right: 0, zIndex: 50, padding: "0 12px" }}>
                <div style={{ background: AMBER, borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", boxShadow: "0 8px 24px rgba(244,160,38,0.4)" }}>
                  <span style={{ fontSize: 18, marginRight: 8 }}>🛒</span>
                  <span style={{ fontWeight: 600, fontSize: 13, color: NAVY, flex: 1 }}>{cartCount} {cartCount === 1 ? "item" : "items"} · ₦{cartTotal.toLocaleString()}</span>
                  <span onClick={() => setShowCartModal(true)} style={{ fontWeight: 700, fontSize: 13, color: NAVY, cursor: "pointer" }}>View Cart →</span>
                </div>
              </div>
            )}

            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 52, background: "#fff", borderTop: "1px solid #E5E7EB", display: "flex", zIndex: 40 }}>
              {[{ id:"menu", icon: "🏠", label: "Menu" }, { id:"orders", icon: "📦", label: "Orders" }, { id:"reserve", icon: "📅", label: "Reserve" }, { id:"info", icon: "ℹ️", label: "Info" }].map(t => (
                <div key={t.id} onClick={() => setView(t.id)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, cursor: "pointer" }}>
                  <span style={{ fontSize: 16 }}>{t.icon}</span>
                  <span style={{ fontSize: 9, color: view === t.id ? brandColor : "#9CA3AF", fontWeight: view === t.id ? 700 : 400 }}>{t.label}</span>
                </div>
              ))}
            </div>

            {showCartModal && (
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 60, display: "flex", alignItems: "flex-end" }}>
                <div style={{ background: "#fff", borderRadius: "20px 20px 0 0", width: "100%", maxHeight: "70%", overflowY: "auto", padding: "20px 16px", animation: "fadeIn 0.2s ease" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 18, color: NAVY }}>Your Cart ({cartCount})</span>
                    <button onClick={() => setShowCartModal(false)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#6B7280" }}>✕</button>
                  </div>
                  {Object.entries(cart).filter(([,q]) => q > 0).map(([id, qty]) => {
                    const item = menuItems.find(m => String(m.id) === String(id));
                    if (!item) return null;
                    return (
                      <div key={id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #F3F4F6" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 24 }}>{item.img}</span>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 13, color: NAVY }}>{item.name}</div>
                            <div style={{ fontSize: 12, color: "#9CA3AF" }}>₦{item.price.toLocaleString()} × {qty}</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 14, color: brandColor }}>₦{(item.price * qty).toLocaleString()}</span>
                          <button onClick={() => {
                            setCart(c => { const n = { ...c }; if (n[id] <= 1) delete n[id]; else n[id]--; return n; });
                            if (cartCount <= 1) setShowCartModal(false);
                          }} style={{ background: "#FEE2E2", border: "none", borderRadius: 6, padding: "4px 8px", cursor: "pointer", fontSize: 12, color: "#E74C3C" }}>Remove</button>
                        </div>
                      </div>
                    );
                  })}
                  {cartCount > 0 && (
                    <div style={{ marginTop: 16 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 18, color: NAVY, marginBottom: 12 }}>
                        <span>Total</span>
                        <span style={{ color: AMBER }}>₦{cartTotal.toLocaleString()}</span>
                      </div>
                      <button style={{ width: "100%", background: AMBER, color: NAVY, border: "none", borderRadius: 12, padding: "14px 0", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
                        Proceed to Checkout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
