import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import PropTypes from "prop-types";
import { useIsMobile } from "../hooks/useMediaQuery";
import { AMBER, NAVY } from "../theme";

const MERCHANT_COLOR = "#1B4332";

const menuItems = [
  { id: 1, name: "Jollof Rice & Chicken", desc: "Rich, smoky jollof with tender grilled chicken", price: 2500, img: "🍛", cat: "Popular" },
  { id: 2, name: "Peppered Gizzard", desc: "Spicy peppered gizzard with fried plantain", price: 1800, img: "🍗", cat: "Popular" },
  { id: 3, name: "Grilled Tilapia", desc: "Fresh tilapia grilled with peppers & spices", price: 4500, img: "🐟", cat: "Mains" },
  { id: 4, name: "Egusi Soup + Eba", desc: "Thick egusi soup with eba or pounded yam", price: 3200, img: "🥣", cat: "Mains" },
  { id: 5, name: "Zobo Drink", desc: "Chilled hibiscus drink", price: 500, img: "🥤", cat: "Drinks" },
  { id: 6, name: "Chilled Chapman", desc: "Classic Nigerian Chapman cocktail", price: 800, img: "🍹", cat: "Drinks" },
];

const cats = ["Popular", "Mains", "Grills", "Drinks", "Desserts"];

export default function MiniAppPreview({ onBack }) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [frame, setFrame] = useState(1);
  const [activeCat, setActiveCat] = useState("Popular");
  const [cart, setCart] = useState({});
  const [orderType, setOrderType] = useState("Delivery");
  const [leaveSheet, setLeaveSheet] = useState(false);
  const [tooltipDismissed, setTooltipDismissed] = useState(false);
  const [showToast, setShowToast] = useState(null);

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = menuItems.find(m => m.id === Number(id));
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const addToCart = (item) => {
    setCart(c => ({ ...c, [item.id]: (c[item.id] || 0) + 1 }));
    setFrame(3);
    setShowToast(`${item.name} added to cart`);
    setTimeout(() => setShowToast(null), 2000);
  };

  const handleDIconTap = () => {
    if (frame === 4) { setLeaveSheet(false); setFrame(2); return; }
    setLeaveSheet(true);
    setFrame(4);
    setTooltipDismissed(true);
  };

  const handleLeave = () => { onBack(); navigate("/"); };
  const handleStay = () => { setLeaveSheet(false); setFrame(cartCount > 0 ? 3 : 2); };

  const filteredItems = menuItems.filter(m => activeCat === "Popular" ? m.cat === "Popular" : m.cat === activeCat);
  const visibleItems = filteredItems.length > 0 ? filteredItems : menuItems.slice(0, 3);

  return (
    <div style={{ minHeight: "100vh", background: "#1a1a2e", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "#252547", padding: isMobile ? "10px 12px" : "12px 32px", display: "flex", gap: 8, alignItems: "center", overflowX: "auto", flexWrap: isMobile ? "nowrap" : "wrap" }}>
        <button onClick={() => navigate("/")} style={{ background: "none", border: "1px solid #6B7280", color: "#D1D5DB", borderRadius: 8, padding: "8px 14px", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
          <ChevronLeft size={16} /> Back
        </button>
        <span style={{ color: "#9CA3AF", fontSize: 13, flexShrink: 0 }}>|</span>
        <span style={{ color: "#9CA3AF", fontSize: 13, flexShrink: 0, display: isMobile ? "none" : "inline" }}>Frames:</span>
        {[
          { num: 1, label: isMobile ? "Entry" : "First Entry" },
          { num: 2, label: isMobile ? "Browse" : "Browsing" },
          { num: 3, label: isMobile ? "Cart" : "Cart Active" },
          { num: 4, label: isMobile ? "Leave" : "Leave Prompt" },
        ].map(f => (
          <button key={f.num} onClick={() => { setFrame(f.num); setLeaveSheet(f.num === 4); setTooltipDismissed(f.num > 1); }} style={{ background: frame === f.num ? AMBER : "#374151", color: frame === f.num ? NAVY : "#D1D5DB", border: "none", borderRadius: 8, padding: "8px 10px", fontSize: isMobile ? 12 : 13, fontWeight: frame === f.num ? 700 : 400, cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap" }}>F{f.num}: {f.label}</button>
        ))}
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: isMobile ? "16px 8px" : "40px 20px" }}>
        <div style={{ position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <span style={{ background: AMBER, color: NAVY, fontSize: 13, fontWeight: 700, padding: "6px 16px", borderRadius: 20 }}>
              Frame {frame}: {["","First Entry (Tooltip)","Browsing Menu","Item Added to Cart","Leave Confirmation"][frame]}
            </span>
          </div>

          <div style={{ width: isMobile ? "calc(100vw - 32px)" : 390, maxWidth: 390, background: NAVY, borderRadius: 44, padding: "12px", boxShadow: "0 40px 120px rgba(0,0,0,0.6)", position: "relative", margin: "0 auto" }}>
            <div style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", width: 120, height: 32, background: NAVY, borderRadius: "0 0 20px 20px", zIndex: 10 }} />

            <div style={{ background: "#fff", borderRadius: 36, overflow: "hidden", position: "relative", minHeight: isMobile ? 500 : 760 }}>
              <div style={{ position: "absolute", top: 16, right: 16, zIndex: 1000 }}>
                <div onClick={handleDIconTap} style={{ width: isMobile ? 36 : 40, height: isMobile ? 36 : 40, background: AMBER, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 16px rgba(0,0,0,0.3)", border: "2px solid rgba(255,255,255,0.6)" }}>
                  <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: isMobile ? 16 : 18, color: NAVY }}>D</span>
                </div>
                {frame === 1 && !tooltipDismissed && (
                  <div style={{ position: "absolute", top: 48, right: 0, background: NAVY, color: "#fff", fontSize: 11, padding: "8px 12px", borderRadius: 8, whiteSpace: "nowrap", boxShadow: "0 4px 12px rgba(0,0,0,0.2)", zIndex: 1001 }}>
                    Tap to return to DukaDesk
                    <div style={{ position: "absolute", top: -6, right: 14, width: 12, height: 12, background: NAVY, transform: "rotate(45deg)" }} />
                  </div>
                )}
              </div>

              <div style={{ background: `linear-gradient(180deg, ${MERCHANT_COLOR} 0%, ${MERCHANT_COLOR}DD 100%)`, padding: "48px 16px 16px", minHeight: isMobile ? 130 : 160, position: "relative" }}>
                <div style={{ position: "absolute", inset: 0, backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }} />
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>🟢 Open Now · 4.8 ⭐ · Nigerian Cuisine</div>
                <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: isMobile ? 18 : 22, color: "#fff", marginBottom: 10 }}>Mama's Kitchen</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {["Delivery", "Pickup"].map(t => (
                    <button key={t} onClick={() => setOrderType(t)} style={{ padding: "7px 18px", borderRadius: 20, border: `1.5px solid ${orderType === t ? "#fff" : "rgba(255,255,255,0.3)"}`, background: orderType === t ? "#fff" : "transparent", color: orderType === t ? MERCHANT_COLOR : "#fff", fontSize: isMobile ? 12 : 13, fontWeight: orderType === t ? 700 : 400, cursor: "pointer" }}>{t}</button>
                  ))}
                </div>
              </div>

              <div style={{ padding: "12px 12px 4px", display: "flex", gap: 8, overflowX: "auto", background: "#fff", borderBottom: "1px solid #F3F4F6" }}>
                {cats.map(c => (
                  <button key={c} onClick={() => setActiveCat(c)} style={{ padding: "6px 14px", borderRadius: 20, border: `1.5px solid ${activeCat === c ? MERCHANT_COLOR : "#E5E7EB"}`, background: activeCat === c ? MERCHANT_COLOR : "#fff", color: activeCat === c ? "#fff" : "#6B7280", fontSize: 12, fontWeight: activeCat === c ? 600 : 400, cursor: "pointer", whiteSpace: "nowrap" }}>
                    {c === "Popular" ? "🔥 " : ""}{c}
                  </button>
                ))}
              </div>

              <div style={{ padding: "8px 12px", background: "#F9FAFB", flex: 1 }}>
                {visibleItems.slice(0, 4).map(item => (
                  <div key={item.id} style={{ display: "flex", gap: 10, padding: "12px 10px", background: "#fff", borderRadius: 10, marginBottom: 8, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                    <div style={{ width: isMobile ? 60 : 80, height: isMobile ? 60 : 80, background: "#F3F4F6", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: isMobile ? 28 : 36, flexShrink: 0 }}>{item.img}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: isMobile ? 12 : 13, color: NAVY, marginBottom: 3 }}>{item.name}</div>
                      <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 6, lineHeight: 1.3 }}>{item.desc}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: isMobile ? 13 : 14, color: MERCHANT_COLOR }}>₦{item.price.toLocaleString()}</span>
                        <button onClick={() => addToCart(item)} style={{ background: AMBER, color: NAVY, border: "none", borderRadius: 16, padding: "5px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                          {cart[item.id] ? `${cart[item.id]} +` : "Add +"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {cartCount > 0 && !leaveSheet && (
                <div style={{ position: "absolute", bottom: 56, left: 0, right: 0, zIndex: 50, padding: "0 12px" }}>
                  <div style={{ background: AMBER, borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", boxShadow: "0 8px 24px rgba(244,160,38,0.4)" }}>
                    <span style={{ fontSize: 18, marginRight: 8 }}>🛒</span>
                    <span style={{ fontWeight: 600, fontSize: 13, color: NAVY, flex: 1 }}>{cartCount} {cartCount === 1 ? "item" : "items"} · ₦{cartTotal.toLocaleString()}</span>
                    <span style={{ fontWeight: 700, fontSize: 13, color: NAVY }}>View Cart →</span>
                  </div>
                </div>
              )}

              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 52, background: "#fff", borderTop: "1px solid #E5E7EB", display: "flex", zIndex: 40 }}>
                {[{ icon: "🏠", label: "Menu", active: true }, { icon: "📦", label: "Orders" }, { icon: "📅", label: "Reserve" }, { icon: "ℹ️", label: "Info" }].map((t, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, cursor: "pointer" }}>
                    <span style={{ fontSize: 16 }}>{t.icon}</span>
                    <span style={{ fontSize: 9, color: t.active ? MERCHANT_COLOR : "#9CA3AF", fontWeight: t.active ? 700 : 400 }}>{t.label}</span>
                  </div>
                ))}
              </div>

              {leaveSheet && (
                <>
                  <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200 }} onClick={handleStay} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "#fff", borderRadius: "20px 20px 0 0", padding: "24px 20px 36px", zIndex: 201, boxShadow: "0 -8px 32px rgba(0,0,0,0.2)" }}>
                    <div style={{ width: 40, height: 4, background: "#E5E7EB", borderRadius: 2, margin: "0 auto 20px" }} />
                    <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 18, color: NAVY, marginBottom: 6, textAlign: "center" }}>Leave Mama's Kitchen?</div>
                    <div style={{ fontSize: 13, color: "#6B7280", textAlign: "center", marginBottom: 8 }}>You'll return to the DukaDesk home screen.</div>
                    {cartCount > 0 && <div style={{ background: "#FFF8ED", border: "1px solid #F4A026", borderRadius: 8, padding: "8px 12px", marginBottom: 16, textAlign: "center" }}>
                      <span style={{ fontSize: 12, color: "#92400E" }}>🛒 Your cart will be saved for 24 hours.</span>
                    </div>}
                    <div style={{ display: "flex", gap: 10 }}>
                      <button onClick={handleStay} style={{ flex: 1, background: "#fff", border: `1.5px solid ${MERCHANT_COLOR}`, color: MERCHANT_COLOR, borderRadius: 24, height: 48, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Stay</button>
                      <button onClick={handleLeave} style={{ flex: 1, background: AMBER, border: "none", color: NAVY, borderRadius: 24, height: 48, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Leave</button>
                    </div>
                  </div>
                </>
              )}

              {showToast && (
                <div style={{ position: "absolute", top: 64, left: 12, right: 12, zIndex: 300, background: NAVY, color: "#fff", borderRadius: 10, padding: "10px 14px", fontSize: 13, fontWeight: 500, boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}>
                  ✓ {showToast}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

MiniAppPreview.propTypes = { onBack: PropTypes.func };
