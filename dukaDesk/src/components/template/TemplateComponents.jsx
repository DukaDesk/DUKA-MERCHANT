import { useState, useEffect } from "react";
import { useDispatchAction } from "../../runtime/RuntimeContext";
import { EventBus } from "../../runtime/EventBus";
import { registerComponent } from "../../runtime/ComponentRegistry";
import { useBrand } from "../../runtime/BrandThemeProvider";
import { Search, Filter, ChevronDown, ChevronUp, Plus, Minus, Trash2, Edit, Eye, ArrowRight, MapPin, Phone, Mail, Clock, Star, ShoppingCart, Heart, Tag, Calendar, Bell, Check, X, Menu, Grid, List } from "lucide-react";

function withActionProps(Component) {
  return function WrappedComponent(props) {
    const dispatchAction = useDispatchAction();
    const actions = props.actions || {};
    const wrappedProps = {
      ...props,
      onAction: (actionKey, payload) => {
        const actionDef = actions[actionKey];
        if (actionDef && dispatchAction) {
          dispatchAction({ ...actionDef, payload: { ...actionDef.payload, ...payload } });
        }
      },
    };
    return <Component {...wrappedProps} />;
  };
}

export function HeroBanner({ title, subtitle, image, style = {}, onAction }) {
  const brand = useBrand();
  return (
    <div style={{
      background: image ? `url(${image}) center/cover` : `linear-gradient(135deg, ${brand.AMBER || '#F4A026'}, ${brand.NAVY || '#0F0F1A'})`,
      color: "#fff",
      borderRadius: 16,
      padding: 32,
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
      ...style
    }}>
      <div style={{ position: "relative", zIndex: 1 }}>
        <h1 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 28, marginBottom: 8 }}>{title}</h1>
        <p style={{ fontSize: 16, opacity: 0.9, marginBottom: 16 }}>{subtitle}</p>
      </div>
    </div>
  );
}

export function CategoryPills({ categories = [], activeCategory, style = {}, onAction }) {
  const brand = useBrand();
  return (
    <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, ...style }}>
      {categories.map((cat, i) => (
        <button
          key={cat}
          onClick={() => onAction?.("selectCategory", { category: cat, index: i })}
          style={{
            padding: "8px 16px",
            borderRadius: 20,
            border: "none",
            background: activeCategory === cat ? brand.AMBER || '#F4A026' : "#fff",
            color: activeCategory === cat ? brand.NAVY || '#0F0F1A' : brand.NAVY || '#0F0F1A',
            fontWeight: 600,
            fontSize: 13,
            cursor: "pointer",
            whiteSpace: "nowrap",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            transition: "all 0.2s"
          }}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

export function MenuGrid({ items = [], columns = 2, variant = "default", style = {}, onAction }) {
  const brand = useBrand();
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: 12,
      ...style
    }}>
      {items.map((item, i) => (
        <div
          key={item.id || i}
          style={{
            background: brand.cardColor || "#fff",
            borderRadius: 14,
            padding: 16,
            border: `1px solid ${brand.GRAY?.[200] || '#E5E7EB'}`,
            cursor: "pointer",
            transition: "transform 0.2s, box-shadow 0.2s",
            display: "flex",
            flexDirection: "column",
            gap: 8
          }}
          onClick={() => onAction?.("viewDetails", { item, index: i })}
          onDoubleClick={() => onAction?.("addItem", { item, index: i })}
        >
          <div style={{ fontSize: 32, textAlign: "center" }}>{item.emoji || item.img || "🍽️"}</div>
          <div style={{ fontWeight: 700, fontSize: 14, color: brand.NAVY || '#0F0F1A' }}>{item.name}</div>
          {item.desc && <div style={{ fontSize: 12, color: brand.GRAY?.[500] || '#6B7280' }}>{item.desc}</div>}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: brand.AMBER || '#F4A026' }}>{item.price ? `₦${item.price.toLocaleString()}` : ""}</span>
            <button
              onClick={(e) => { e.stopPropagation(); onAction?.("addItem", { item, index: i }); }}
              style={{
                background: brand.AMBER || '#F4A026',
                color: brand.NAVY || '#0F0F1A',
                border: "none",
                borderRadius: 8,
                padding: "6px 12px",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              Add
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export function OrderHistory({ orders = [], showStatus = true, style = {}, onAction }) {
  const brand = useBrand();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, ...style }}>
      {orders.map((order, i) => (
        <div
          key={order.id || i}
          style={{
            background: brand.cardColor || "#fff",
            borderRadius: 12,
            padding: 16,
            border: `1px solid ${brand.GRAY?.[200] || '#E5E7EB'}`,
            display: "flex",
            flexDirection: "column",
            gap: 8
          }}
          onClick={() => onAction?.("selectOrder", { order, index: i })}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontWeight: 700, color: brand.NAVY || '#0F0F1A' }}>{order.id || `Order #${i+1}`}</div>
            {showStatus && order.status && (
              <span style={{
                padding: "4px 10px",
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 700,
                background: brand.statusBadge?.[order.status]?.bg || "#F3F4F6",
                color: brand.statusBadge?.[order.status]?.color || "#374151"
              }}>
                {order.status}
              </span>
            )}
          </div>
          <div style={{ color: brand.GRAY?.[600] || '#4B5563', fontSize: 13 }}>{order.items || order.sub || "Items"}</div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
            <span style={{ color: brand.GRAY?.[500] }}>{order.date || order.time}</span>
            <span style={{ fontWeight: 700, color: brand.NAVY }}>{order.total ? `₦${order.total.toLocaleString()}` : ""}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function InfoList({ items = [], variant = "default", style = {}, onAction }) {
  const brand = useBrand();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, ...style }}>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 16px",
            background: brand.cardColor || "#fff",
            borderRadius: 12,
            border: `1px solid ${brand.GRAY?.[200] || '#E5E7EB'}`,
            cursor: item.action ? "pointer" : "default"
          }}
          onClick={() => item.action && onAction?.(item.action, { item, index: i })}
        >
          <div style={{ fontSize: 20 }}>{item.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: brand.NAVY }}>{item.label}</div>
            <div style={{ fontSize: 13, color: brand.GRAY?.[500] }}>{item.value}</div>
          </div>
          {item.action && <ChevronRight size={16} color={brand.GRAY?.[400]} />}
        </div>
      ))}
    </div>
  );
}

export function ReportAction({ title = "Report an Issue", style = {}, onAction }) {
  const brand = useBrand();
  const [text, setText] = useState("");
  return (
    <div style={{ background: brand.cardColor || "#fff", borderRadius: 14, padding: 20, border: `1px solid ${brand.GRAY?.[200]}`, ...style }}>
      <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 16, color: brand.NAVY, marginBottom: 12 }}>{title}</div>
      <textarea
        placeholder="Describe the issue..."
        value={text}
        onChange={e => setText(e.target.value)}
        style={{
          width: "100%",
          minHeight: 100,
          padding: 12,
          borderRadius: 10,
          border: `1px solid ${brand.GRAY?.[200]}`,
          fontFamily: "inherit",
          fontSize: 14,
          resize: "vertical"
        }}
      />
      <button
        onClick={() => onAction?.("submit", { text })}
        style={{
          marginTop: 12,
          width: "100%",
          padding: "12px",
          background: brand.AMBER || '#F4A026',
          color: brand.NAVY || '#0F0F1A',
          border: "none",
          borderRadius: 10,
          fontWeight: 700,
          fontSize: 14,
          cursor: "pointer"
        }}
        disabled={!text.trim()}
      >
        Submit Report
      </button>
    </div>
  );
}

export function NotificationList({ notifications = [], style = {}, onAction }) {
  const brand = useBrand();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, ...style }}>
      {notifications.map((n, i) => (
        <div
          key={n.id || i}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            padding: 14,
            background: brand.cardColor || "#fff",
            borderRadius: 12,
            border: `1px solid ${brand.GRAY?.[200]}`,
            cursor: "pointer"
          }}
          onClick={() => onAction?.("tap", { notification: n, index: i })}
        >
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: `${brand.AMBER}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{n.icon || "🔔"}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, color: brand.NAVY }}>{n.title}</div>
            <div style={{ fontSize: 13, color: brand.GRAY?.[500], marginTop: 2 }}>{n.message}</div>
            <div style={{ fontSize: 11, color: brand.GRAY?.[400], marginTop: 4 }}>{n.time}</div>
          </div>
          {n.unread && <div style={{ width: 8, height: 8, borderRadius: "50%", background: brand.AMBER }} />}
        </div>
      ))}
    </div>
  );
}

export function PrimaryButton({ label = "Action", style = {}, onAction }) {
  const brand = useBrand();
  return (
    <button
      onClick={() => onAction?.("default", {})}
      style={{
        width: "100%",
        padding: "14px 24px",
        background: brand.AMBER || '#F4A026',
        color: brand.NAVY || '#0F0F1A',
        border: "none",
        borderRadius: 12,
        fontWeight: 700,
        fontSize: 15,
        fontFamily: "'Sora',sans-serif",
        cursor: "pointer",
        transition: "all 0.2s",
        ...style
      }}
    >
      {label}
    </button>
  );
}

export function CalendarStrip({ minDate = "today", maxDate = "+30", variant = "default", style = {}, onAction }) {
  const brand = useBrand();
  const [selected, setSelected] = useState(new Date().toISOString().split('T')[0]);
  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split('T')[0];
  });
  return (
    <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, ...style }}>
      {dates.map(d => {
        const date = new Date(d);
        const isSelected = d === selected;
        return (
          <button
            key={d}
            onClick={() => { setSelected(d); onAction?.("selectDate", { date: d }); }}
            style={{
              flex: "0 0 auto",
              width: 56,
              padding: "10px 0",
              borderRadius: 12,
              border: "none",
              background: isSelected ? brand.AMBER : brand.cardColor,
              color: isSelected ? brand.NAVY : brand.NAVY,
              fontWeight: isSelected ? 700 : 500,
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              boxShadow: isSelected ? `0 4px 12px ${brand.AMBER}40` : "none"
            }}
          >
            <div style={{ fontSize: 11, textTransform: "uppercase" }}>{date.toLocaleDateString(undefined, { weekday: 'short' })}</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{date.getDate()}</div>
            <div style={{ fontSize: 10 }}>{date.toLocaleDateString(undefined, { month: 'short' })}</div>
          </button>
        );
      })}
    </div>
  );
}

export function SlotGrid({ duration = 60, variant = "default", style = {}, onAction }) {
  const brand = useBrand();
  const [selectedSlot, setSelectedSlot] = useState(null);
  const slots = [
    "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00",
    "17:00", "18:00", "19:00", "20:00"
  ];
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, ...style }}>
      {slots.map(slot => (
        <button
          key={slot}
          onClick={() => { setSelectedSlot(slot); onAction?.("selectSlot", { slot }); }}
          style={{
            flex: "0 0 calc(25% - 6px)",
            padding: "12px 8px",
            borderRadius: 10,
            border: `1px solid ${selectedSlot === slot ? brand.AMBER : brand.GRAY?.[200]}`,
            background: selectedSlot === slot ? `${brand.AMBER}15` : brand.cardColor,
            color: selectedSlot === slot ? brand.AMBER : brand.NAVY,
            fontWeight: 600,
            fontSize: 13,
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          {slot}
        </button>
      ))}
    </div>
  );
}

export function BookingSummary({ style = {}, onAction }) {
  const brand = useBrand();
  return (
    <div style={{ background: brand.cardColor || "#fff", borderRadius: 14, padding: 20, border: `1px solid ${brand.GRAY?.[200]}`, ...style }}>
      <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 16, color: brand.NAVY, marginBottom: 16 }}>Booking Summary</div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, color: brand.GRAY?.[600] }}>
        <span>Service</span><span style={{ fontWeight: 600 }}>Hair Styling</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, color: brand.GRAY?.[600] }}>
        <span>Date</span><span style={{ fontWeight: 600 }}>Tomorrow, 2:00 PM</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, color: brand.GRAY?.[600] }}>
        <span>Duration</span><span style={{ fontWeight: 600 }}>60 min</span>
      </div>
      <div style={{ borderTop: `1px solid ${brand.GRAY?.[200]}`, paddingTop: 12, marginTop: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 16, color: brand.NAVY }}>
          <span>Total</span><span>₦8,000</span>
        </div>
      </div>
      <button
        onClick={() => onAction?.("confirm", {})}
        style={{
          marginTop: 16,
          width: "100%",
          padding: "14px",
          background: brand.AMBER,
          color: brand.NAVY,
          border: "none",
          borderRadius: 10,
          fontWeight: 700,
          fontSize: 15,
          fontFamily: "'Sora',sans-serif",
          cursor: "pointer"
        }}
      >
        Confirm Booking
      </button>
    </div>
  );
}

export function CartSummary({ style = {}, onAction }) {
  const brand = useBrand();
  return (
    <div style={{ background: brand.cardColor || "#fff", borderRadius: 14, padding: 20, border: `1px solid ${brand.GRAY?.[200]}`, ...style }}>
      <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 16, color: brand.NAVY, marginBottom: 16 }}>Your Cart</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, background: brand.GRAY?.[50], borderRadius: 10 }}>
          <div style={{ fontSize: 24 }}>🍛</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, color: brand.NAVY }}>Jollof Rice & Chicken</div>
            <div style={{ fontSize: 13, color: brand.GRAY?.[500] }}>₦2,500 × 2</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => onAction?.("removeItem", { id: 1 })} style={{ background: "none", border: "none", cursor: "pointer", color: brand.RED, fontSize: 18 }}>−</button>
            <span style={{ fontWeight: 700 }}>2</span>
            <button onClick={() => onAction?.("addItem", { id: 1 })} style={{ background: "none", border: "none", cursor: "pointer", color: brand.AMBER, fontSize: 18 }}>+</button>
          </div>
        </div>
      </div>
      <div style={{ borderTop: `1px solid ${brand.GRAY?.[200]}`, paddingTop: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, color: brand.GRAY?.[600] }}>
          <span>Subtotal</span><span>₦5,000</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, color: brand.GRAY?.[600] }}>
          <span>Delivery</span><span>₦500</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 16, color: brand.NAVY }}>
          <span>Total</span><span>₦5,500</span>
        </div>
      </div>
      <button
        onClick={() => onAction?.("checkout", {})}
        style={{
          marginTop: 16,
          width: "100%",
          padding: "14px",
          background: brand.AMBER,
          color: brand.NAVY,
          border: "none",
          borderRadius: 10,
          fontWeight: 700,
          fontSize: 15,
          fontFamily: "'Sora',sans-serif",
          cursor: "pointer"
        }}
      >
        Checkout
      </button>
    </div>
  );
}

export function AddressForm({ style = {}, onAction }) {
  const brand = useBrand();
  const [form, setForm] = useState({ street: "", city: "", state: "", phone: "" });
  return (
    <div style={{ background: brand.cardColor || "#fff", borderRadius: 14, padding: 20, border: `1px solid ${brand.GRAY?.[200]}`, ...style }}>
      <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 16, color: brand.NAVY, marginBottom: 16 }}>Delivery Address</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input placeholder="Street Address" value={form.street} onChange={e => setForm({ ...form, street: e.target.value })} style={{ padding: "12px", borderRadius: 10, border: `1px solid ${brand.GRAY?.[200]}`, fontSize: 14 }} />
        <div style={{ display: "flex", gap: 12 }}>
          <input placeholder="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} style={{ flex: 1, padding: "12px", borderRadius: 10, border: `1px solid ${brand.GRAY?.[200]}`, fontSize: 14 }} />
          <input placeholder="State" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} style={{ flex: 1, padding: "12px", borderRadius: 10, border: `1px solid ${brand.GRAY?.[200]}`, fontSize: 14 }} />
        </div>
        <input placeholder="Phone Number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={{ padding: "12px", borderRadius: 10, border: `1px solid ${brand.GRAY?.[200]}`, fontSize: 14 }} />
      </div>
      <button
        onClick={() => onAction?.("submit", { ...form })}
        style={{
          marginTop: 16,
          width: "100%",
          padding: "14px",
          background: brand.AMBER,
          color: brand.NAVY,
          border: "none",
          borderRadius: 10,
          fontWeight: 700,
          fontSize: 15,
          fontFamily: "'Sora',sans-serif",
          cursor: "pointer"
        }}
      >
        Save Address
      </button>
    </div>
  );
}

export function PromotionList({ offers = [], style = {}, onAction }) {
  const brand = useBrand();
  return (
    <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8, ...style }}>
      {offers.map((offer, i) => (
        <div
          key={i}
          style={{
            flex: "0 0 280px",
            borderRadius: 14,
            overflow: "hidden",
            background: brand.cardColor || "#fff",
            border: `1px solid ${brand.GRAY?.[200]}`,
            cursor: "pointer"
          }}
          onClick={() => onAction?.("tap", { offer, index: i })}
        >
          <div style={{ height: 120, background: offer.image ? `url(${offer.image}) center/cover` : `linear-gradient(135deg, ${brand.AMBER}, ${brand.NAVY})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 18 }}>
            {offer.icon || "🎉"}
          </div>
          <div style={{ padding: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: brand.NAVY, marginBottom: 4 }}>{offer.title}</div>
            <div style={{ fontSize: 13, color: brand.GRAY?.[500], marginBottom: 8 }}>{offer.subtitle}</div>
            <div style={{ background: `${brand.AMBER}15`, color: brand.AMBER, padding: "6px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, display: "inline-block" }}>{offer.badge || "Offer"}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SectionHeader({ children, style = {} }) {
  const brand = useBrand();
  return (
    <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 16, color: brand.NAVY, marginBottom: 16, ...style }}>
      {children}
    </div>
  );
}

const components = {
  hero_banner: HeroBanner,
  category_pills: CategoryPills,
  menu_grid: MenuGrid,
  order_history: OrderHistory,
  info_list: InfoList,
  report_action: ReportAction,
  notification_list: NotificationList,
  primary_button: PrimaryButton,
  calendar_strip: CalendarStrip,
  slot_grid: SlotGrid,
  booking_summary: BookingSummary,
  cart_summary: CartSummary,
  address_form: AddressForm,
  promotion_list: PromotionList,
  section_header: SectionHeader,
};

Object.entries(components).forEach(([type, Component]) => {
  registerComponent(type, withActionProps(Component));
});

export const TemplateComponents = components;
export { components };