import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { useAuth, useToast } from "../../contexts";
import { useIsMobile } from "../../hooks/useMediaQuery";
import { NAVY, AMBER, inputStyle, labelStyle } from "../../theme";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const fieldStyle = { marginBottom: 16 };
const toggleRow = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #F3F4F6" };
const smallBtn = { background: "none", border: "1px solid #E5E7EB", borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer", color: "#6B7280" };
const badge = { fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 8 };

export default function IntegrationConfigPanel({ integration, config, onConfig, onSave, onRemove }) {
  const isMobile = useIsMobile();
  const showToast = useToast();
  const { merchant } = useAuth();
  const setVal = (key, val) => onConfig(integration.name, { ...config, [key]: val });
  const getVal = (key, def) => config?.[key] ?? def;

  const input = (label, key, placeholder, type = "text") => (
    <div style={fieldStyle}>
      <label style={labelStyle}>{label}</label>
      <input value={getVal(key, "")} onChange={e => setVal(key, e.target.value)} placeholder={placeholder} type={type} style={inputStyle} />
    </div>
  );

  const textarea = (label, key, placeholder) => (
    <div style={fieldStyle}>
      <label style={labelStyle}>{label}</label>
      <textarea value={getVal(key, "")} onChange={e => setVal(key, e.target.value)} placeholder={placeholder} style={{ ...inputStyle, height: 80, paddingTop: 10, resize: "vertical" }} />
    </div>
  );

  const toggle = (label, key, def = false) => (
    <div key={key} style={toggleRow}>
      <span style={{ fontSize: 14, color: NAVY }}>{label}</span>
      <label style={{ position: "relative", display: "inline-block", width: 44, height: 24, cursor: "pointer" }}>
        <input type="checkbox" checked={getVal(key, def)} onChange={e => setVal(key, e.target.checked)} style={{ opacity: 0, width: 0, height: 0 }} />
        <span style={{
          position: "absolute", inset: 0, background: getVal(key, def) ? AMBER : "#D1D5DB", borderRadius: 24, transition: "0.2s",
          boxShadow: getVal(key, def) ? `0 0 0 3px ${AMBER}22` : "none",
        }}>
          <span style={{
            position: "absolute", top: 2, left: getVal(key, def) ? 22 : 2, width: 20, height: 20, background: "#fff",
            borderRadius: "50%", transition: "0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
          }} />
        </span>
      </label>
    </div>
  );

  const select = (label, key, options, def = options[0]) => (
    <div style={fieldStyle}>
      <label style={labelStyle}>{label}</label>
      <select value={getVal(key, def)} onChange={e => setVal(key, e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  const renderForm = () => {
    switch (integration.name) {
      case "Paystack":
        return (<>
          <div style={{ background: "#FFF8ED", border: "1px solid #F4A026", borderRadius: 8, padding: 14, marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: "#92400E" }}>🔒 Your keys are encrypted at rest. Never share your secret key.</div>
          </div>
          {input("Business Name", "businessName", merchant?.business || "My Store")}
          {input("Public Key", "publicKey", "pk_live_xxxxxxxxxxxx")}
          <div style={fieldStyle}>
            <label style={labelStyle}>Secret Key</label>
            <div style={{ position: "relative" }}>
              <input value={getVal("secretKey", "")} onChange={e => setVal("secretKey", e.target.value)} placeholder="sk_live_xxxxxxxxxxxx" type="password" style={inputStyle} />
            </div>
          </div>
          {select("Currency", "currency", ["NGN", "GHS", "USD", "ZAR"])}
          {input("Webhook URL", "webhookUrl", "https://yourdomain.com/webhook/paystack")}
          <div style={{ borderTop: "1px solid #E5E7EB", marginTop: 8, paddingTop: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#6B7280", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Payment Methods</div>
            {toggle("Cards", "cards", true)}
            {toggle("Bank Transfer", "bankTransfer", true)}
            {toggle("USSD", "ussd", true)}
            {toggle("QR", "qr", false)}
          </div>
          <div style={{ borderTop: "1px solid #E5E7EB", marginTop: 8, paddingTop: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#6B7280", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Settings</div>
            {toggle("Test Mode", "testMode", false)}
            {toggle("Charge transaction fee to customer", "chargeFee", false)}
          </div>
        </>);

      case "Flutterwave":
        return (<>
          <div style={{ background: "#EEF2FF", border: "1px solid #A5B4FC", borderRadius: 8, padding: 14, marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: "#312E81" }}>🌍 Pan-African payments — accept cards, mobile money & bank transfer.</div>
          </div>
          {input("Business Name", "businessName", merchant?.business || "My Store")}
          {input("Public Key", "publicKey", "FLWPUBK-xxxxxxxxxxxx")}
          <div style={fieldStyle}>
            <label style={labelStyle}>Secret Key</label>
            <input value={getVal("secretKey", "")} onChange={e => setVal("secretKey", e.target.value)} placeholder="FLWSECK-xxxxxxxxxxxx" type="password" style={inputStyle} />
          </div>
          {input("Encryption Key", "encKey", "FLWSECK-xxxxxxxxxxxx")}
          {select("Currency", "currency", ["NGN", "GHS", "KES", "UGX", "ZAR", "USD"])}
          {input("Webhook URL", "webhookUrl", "https://yourdomain.com/webhook/flutterwave")}
          <div style={{ borderTop: "1px solid #E5E7EB", marginTop: 8, paddingTop: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#6B7280", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Payment Methods</div>
            {toggle("Card Payments", "cards", true)}
            {toggle("Bank Transfer", "bankTransfer", true)}
            {toggle("USSD", "ussd", true)}
            {toggle("Mobile Money (Ghana)", "mobileMoneyGh", true)}
            {toggle("Mobile Money (Uganda)", "mobileMoneyUg", false)}
            {toggle("MPesa", "mpesa", false)}
          </div>
        </>);

      case "Bank Transfer":
        return (<>
          <div style={{ background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 8, padding: 14, marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: "#065F46" }}>🏦 Customers will see these bank details at checkout.</div>
          </div>
          {input("Bank Name", "bankName", "GTBank")}
          {input("Account Name", "accountName", merchant?.business || "My Store")}
          {input("Account Number", "accountNumber", "0123456789")}
          {textarea("Payment Instructions", "instructions", `Pay into the account above and upload your receipt. We'll confirm within 30 minutes.`)}
          <div style={{ borderTop: "1px solid #E5E7EB", marginTop: 8, paddingTop: 8 }}>
            {toggle("Auto-confirm on receipt upload", "autoConfirm", true)}
            {toggle("Send SMS on confirmation", "smsNotify", false)}
          </div>
        </>);

      case "Product Cart":
        return (<>
          <div style={{ background: "#FEF3C7", border: "1px solid #FDE68A", borderRadius: 8, padding: 14, marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: "#92400E" }}>🛒 Configure how customers add items and checkout.</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Max items per cart</label>
              <input value={getVal("maxItems", "20")} onChange={e => setVal("maxItems", e.target.value)} type="number" min="1" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Min order (₦)</label>
              <input value={getVal("minOrder", "500")} onChange={e => setVal("minOrder", e.target.value)} type="number" min="0" style={inputStyle} />
            </div>
          </div>
          <div style={{ borderTop: "1px solid #E5E7EB", marginTop: 8, paddingTop: 8 }}>
            {toggle("Allow notes on order", "allowNotes", true)}
            {toggle("Show estimated delivery time", "showDelivery", true)}
            {toggle("Auto-confirm orders", "autoConfirm", false)}
            {toggle("Guest checkout", "guestCheckout", true)}
            {toggle("Enable quantity increment/decrement", "qtyButtons", true)}
          </div>
        </>);

      case "Discount Codes":
        return (<>
          <div style={{ background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 8, padding: 14, marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: "#065F46" }}>🏷️ Create promo codes to attract and retain customers.</div>
          </div>
          {input("Discount Code", "code", "e.g. WELCOME10")}
          <div style={fieldStyle}>
            <label style={labelStyle}>Discount Type</label>
            <div style={{ display: "flex", gap: 10 }}>
              {["Percentage", "Fixed Amount"].map(t => (
                <label key={t} onClick={() => setVal("type", t)} style={{
                  flex: 1, padding: "10px 0", textAlign: "center", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600,
                  border: `1.5px solid ${getVal("type", "Percentage") === t ? AMBER : "#E5E7EB"}`,
                  background: getVal("type", "Percentage") === t ? "#FFF8ED" : "#fff",
                  color: getVal("type", "Percentage") === t ? "#92400E" : "#6B7280",
                }}>{t}</label>
              ))}
            </div>
          </div>
          {input("Amount", "amount", getVal("type", "Percentage") === "Percentage" ? "10" : "1000")}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Min. order (₦)</label>
              <input value={getVal("minOrder", "0")} onChange={e => setVal("minOrder", e.target.value)} type="number" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Max uses</label>
              <input value={getVal("maxUses", "100")} onChange={e => setVal("maxUses", e.target.value)} type="number" style={inputStyle} />
            </div>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Expiry date</label>
            <input value={getVal("expiry", "")} onChange={e => setVal("expiry", e.target.value)} type="date" style={inputStyle} />
          </div>
          {toggle("Active", "active", true)}
        </>);

      case "Order Tracking":
        return (<>
          <div style={{ background: "#EFF6FF", border: "1px solid #93C5FD", borderRadius: 8, padding: 14, marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: "#1E40AF" }}>📦 Keep customers informed about their order status.</div>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Order Status Flow</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {["Pending → Confirmed → Preparing → Ready → Delivered"].map((flow, i) => (
                <label key={i} onClick={() => setVal("statusFlow", flow)} style={{
                  padding: "8px 12px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 500,
                  border: `1px solid ${getVal("statusFlow", "Pending → Confirmed → Preparing → Ready → Delivered") === flow ? AMBER : "#E5E7EB"}`,
                  background: getVal("statusFlow", "Pending → Confirmed → Preparing → Ready → Delivered") === flow ? "#FFF8ED" : "#F9FAFB",
                  color: NAVY,
                }}>{flow}</label>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid #E5E7EB", marginTop: 8, paddingTop: 8 }}>
            {toggle("SMS status updates", "smsUpdates", true)}
            {toggle("Email status updates", "emailUpdates", true)}
            {toggle("Push notifications", "pushUpdates", false)}
            {toggle("Show estimated delivery time", "showEta", true)}
          </div>
        </>);

      case "Wishlist":
        return (<>
          <div style={{ background: "#FDF2F8", border: "1px solid #FBCFE8", borderRadius: 8, padding: 14, marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: "#9D174D" }}>❤️ Let customers save products for later.</div>
          </div>
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <span style={{ fontSize: 64 }}>❤️</span>
            <div style={{ fontWeight: 600, fontSize: 16, color: NAVY, marginTop: 8 }}>Wishlist</div>
            <div style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>Customers can save items and come back later</div>
          </div>
          {toggle("Enable Wishlist", "enabled", true)}
          {toggle("Share wishlist", "shareEnabled", true)}
          {toggle("Notify on price drop", "priceDropNotify", false)}
        </>);

      case "Appointment Calendar":
        return (<>
          <div style={{ background: "#F0F9FF", border: "1px solid #BAE6FD", borderRadius: 8, padding: 14, marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: "#0369A1" }}>📅 Let customers book appointments directly from your app.</div>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Business Hours</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {DAYS.map(d => (
                <button key={d} onClick={() => {
                  const cur = getVal("days", ["Mon","Tue","Wed","Thu","Fri"]);
                  setVal("days", cur.includes(d) ? cur.filter(x => x !== d) : [...cur, d]);
                }} style={{
                  padding: "6px 14px", borderRadius: 8, border: `1.5px solid ${getVal("days", ["Mon","Tue","Wed","Thu","Fri"]).includes(d) ? AMBER : "#E5E7EB"}`,
                  background: getVal("days", ["Mon","Tue","Wed","Thu","Fri"]).includes(d) ? "#FFF8ED" : "#fff",
                  color: getVal("days", ["Mon","Tue","Wed","Thu","Fri"]).includes(d) ? "#92400E" : "#6B7280",
                  fontSize: 13, fontWeight: 600, cursor: "pointer",
                }}>{d}</button>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Open time</label>
              <input value={getVal("openTime", "09:00")} onChange={e => setVal("openTime", e.target.value)} type="time" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Close time</label>
              <input value={getVal("closeTime", "17:00")} onChange={e => setVal("closeTime", e.target.value)} type="time" style={inputStyle} />
            </div>
          </div>
          {select("Slot duration", "slotDuration", ["15 min", "30 min", "45 min", "60 min", "90 min", "120 min"])}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Buffer (min)</label>
              <input value={getVal("buffer", "15")} onChange={e => setVal("buffer", e.target.value)} type="number" min="0" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Max bookings/day</label>
              <input value={getVal("maxPerSlot", "10")} onChange={e => setVal("maxPerSlot", e.target.value)} type="number" min="1" style={inputStyle} />
            </div>
          </div>
          {toggle("Allow same-day booking", "sameDay", true)}
        </>);

      case "Booking Reminders":
        return (<>
          <div style={{ background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 8, padding: 14, marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: "#065F46" }}>⏰ Reduce no-shows with automatic booking reminders.</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>First reminder</label>
              <select value={getVal("firstReminder", "24 hours before")} onChange={e => setVal("firstReminder", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                {["1 hour before", "2 hours before", "6 hours before", "12 hours before", "24 hours before", "48 hours before"].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Second reminder</label>
              <select value={getVal("secondReminder", "1 hour before")} onChange={e => setVal("secondReminder", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                {["None", "30 min before", "1 hour before", "2 hours before"].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
          {select("Notification channel", "channel", ["SMS & Push", "SMS only", "Push only"])}
          {textarea("Reminder message", "message", `Hi {name}! This is a reminder for your {service} booking at {time} on {date}. Reply C to confirm.`)}
        </>);

      case "Waitlist":
        return (<>
          <div style={{ background: "#FFF8ED", border: "1px solid #FDE68A", borderRadius: 8, padding: 14, marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: "#92400E" }}>📋 When you're fully booked, customers can join the waitlist.</div>
          </div>
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <span style={{ fontSize: 64 }}>📋</span>
            <div style={{ fontWeight: 600, fontSize: 16, color: NAVY, marginTop: 8 }}>Waitlist Queue</div>
            <div style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>Customers queue up when slots are full</div>
          </div>
          {input("Max waitlist size", "maxSize", "50")}
          {toggle("Auto-notify when slot opens", "autoNotify", true)}
          {textarea("Notification message", "notifyMsg", `Great news {name}! A slot just opened up at {time} on {date}. Grab it before someone else does!`)}
        </>);

      case "Loyalty Points":
        return (<>
          <div style={{ background: "#FFF8ED", border: "1px solid #FDE68A", borderRadius: 8, padding: 14, marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: "#92400E" }}>⭐ Reward loyal customers and keep them coming back.</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Points per ₦100 spent</label>
              <input value={getVal("pointsPerHundred", "5")} onChange={e => setVal("pointsPerHundred", e.target.value)} type="number" min="1" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>₦ value per point</label>
              <input value={getVal("pointValue", "0.10")} onChange={e => setVal("pointValue", e.target.value)} type="number" step="0.01" min="0.01" style={inputStyle} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Min. redemption points</label>
              <input value={getVal("minRedeem", "100")} onChange={e => setVal("minRedeem", e.target.value)} type="number" min="1" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Welcome bonus points</label>
              <input value={getVal("welcomeBonus", "50")} onChange={e => setVal("welcomeBonus", e.target.value)} type="number" min="0" style={inputStyle} />
            </div>
          </div>
          {input("Points expire after (days, 0 = never)", "expiryDays", "365")}
          {toggle("Notify customer on points earned", "earnNotify", true)}
          {toggle("Allow points + cash checkout", "mixedCheckout", true)}
        </>);

      case "Push Notifications":
        return (<>
          <div style={{ background: "#EFF6FF", border: "1px solid #93C5FD", borderRadius: 8, padding: 14, marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: "#1E40AF" }}>🔔 Send instant updates to your customers' phones.</div>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>FCM Server Key</label>
            <input value={getVal("serverKey", "")} onChange={e => setVal("serverKey", e.target.value)} placeholder="AAAAxxxxxxxxxxxx" type="password" style={inputStyle} />
          </div>
          {input("Default title", "defaultTitle", merchant?.business || "My Store")}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Icon URL</label>
              <input value={getVal("iconUrl", "")} onChange={e => setVal("iconUrl", e.target.value)} placeholder="https://..." style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Sound</label>
              <select value={getVal("sound", "default")} onChange={e => setVal("sound", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                {["default", "chime", "bell", "alert", "none"].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
          {textarea("Default message body", "defaultBody", `Hi {name}! We have a special offer just for you. Check it out now!`)}
          {toggle("Send to all customers", "broadcastEnabled", true)}
        </>);

      case "Referral Program":
        return (<>
          <div style={{ background: "linear-gradient(135deg, #1A1A2E, #2D2D5E)", borderRadius: 8, padding: 16, marginBottom: 20 }}>
            <div style={{ color: AMBER, fontSize: 13, fontWeight: 600 }}>👥 Premium Integration</div>
            <div style={{ color: "#fff", fontSize: 12, marginTop: 4 }}>Referral programs drive word-of-mouth growth.</div>
          </div>
          {select("Reward type", "rewardType", ["Discount", "Points", "Cash"])}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Reward amount</label>
              <input value={getVal("rewardAmount", "500")} onChange={e => setVal("rewardAmount", e.target.value)} type="number" min="1" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Min. referrals</label>
              <input value={getVal("minReferrals", "1")} onChange={e => setVal("minReferrals", e.target.value)} type="number" min="1" style={inputStyle} />
            </div>
          </div>
          {input("Referrer reward", "referrerReward", "200")}
          {textarea("Share message", "shareMsg", `Hey! Check out ${merchant?.business || "my store"} on DukaDesk. Use my referral link to get ₦500 off your first order! 🎉`)}
          {toggle("Active", "active", true)}
        </>);

      case "In-App Messaging":
        return (<>
          <div style={{ background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 8, padding: 14, marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: "#065F46" }}>💬 Chat with customers in real-time from your dashboard.</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Business hours start</label>
              <input value={getVal("hoursStart", "09:00")} onChange={e => setVal("hoursStart", e.target.value)} type="time" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Business hours end</label>
              <input value={getVal("hoursEnd", "18:00")} onChange={e => setVal("hoursEnd", e.target.value)} type="time" style={inputStyle} />
            </div>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Response time target</label>
            <select value={getVal("responseSla", "15 min")} onChange={e => setVal("responseSla", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
              {["Instant", "5 min", "15 min", "30 min", "1 hour", "2 hours"].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          {textarea("Auto-reply message", "autoReply", `Hi! 👋 Thanks for reaching out to ${merchant?.business || "our store"}. We'll respond shortly.`)}
          {textarea("Away message", "awayMsg", `We're currently closed. We'll reply as soon as we reopen during business hours.`)}
          {toggle("Show typing indicator", "typingIndicator", true)}
          {toggle("Read receipts", "readReceipts", true)}
          {toggle("Customer can send images", "allowImages", true)}
        </>);

      case "WhatsApp Link":
        return (<>
          <div style={{ background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 8, padding: 14, marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: "#065F46" }}>📱 Connect with customers directly on WhatsApp.</div>
          </div>
          <div style={{ textAlign: "center", padding: "12px 0" }}>
            <span style={{ fontSize: 56 }}>📱</span>
          </div>
          {input("WhatsApp Number", "phone", "+2348012345678")}
          {textarea("Pre-filled message", "prefillMsg", `Hi! I'm interested in ${merchant?.business || "your store"}. Can you help?`)}
          {input("Button label", "btnLabel", "Chat on WhatsApp")}
          {select("Button style", "btnStyle", ["Icon only", "Icon + text", "Text only"])}
          {toggle("Show in header", "showInHeader", true)}
        </>);

      case "Email Capture":
        return (<>
          <div style={{ background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 8, padding: 14, marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: "#065F46" }}>📧 Build your email subscriber list directly from your app.</div>
          </div>
          {input("List name", "listName", `${merchant?.business || "Store"} Subscribers`)}
          <div style={fieldStyle}>
            <label style={labelStyle}>Trigger</label>
            <select value={getVal("trigger", "On page load")} onChange={e => setVal("trigger", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
              {["On page load", "After 5 seconds", "On scroll", "On exit intent"].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          {textarea("Thank you message", "thankYouMsg", `Thanks for subscribing! We'll keep you posted on new items and offers. 🎉`)}
          {toggle("Send welcome email", "welcomeEmail", true)}
          {toggle("Double opt-in", "doubleOptIn", false)}
          {toggle("GDPR consent checkbox", "gdprConsent", true)}
        </>);

      case "FAQ Widget":
        return (<>
          <div style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 8, padding: 14, marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: "#6B7280" }}>❓ Answer common questions before customers ask.</div>
          </div>
          {input("Header title", "headerTitle", "Frequently Asked Questions")}
          <div style={fieldStyle}>
            <label style={labelStyle}>FAQ Items</label>
            {(getVal("faqs", [])).map((faq, i) => (
              <div key={i} style={{ background: "#F9FAFB", borderRadius: 8, padding: 12, marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#6B7280" }}>Q{i + 1}</span>
                  <button onClick={() => setVal("faqs", getVal("faqs", []).filter((_, j) => j !== i))} style={{ background: "none", border: "none", cursor: "pointer", color: "#E74C3C", fontSize: 12 }}>Remove</button>
                </div>
                <input value={faq.q} onChange={e => {
                  const faqs = [...getVal("faqs", [])];
                  faqs[i] = { ...faqs[i], q: e.target.value };
                  setVal("faqs", faqs);
                }} placeholder="Question" style={{ ...inputStyle, marginBottom: 6 }} />
                <textarea value={faq.a} onChange={e => {
                  const faqs = [...getVal("faqs", [])];
                  faqs[i] = { ...faqs[i], a: e.target.value };
                  setVal("faqs", faqs);
                }} placeholder="Answer" style={{ ...inputStyle, height: 60, paddingTop: 8, resize: "vertical" }} />
              </div>
            ))}
            <button onClick={() => setVal("faqs", [...getVal("faqs", []), { q: "", a: "" }])} style={{ width: "100%", padding: "10px 0", border: "1.5px dashed #E5E7EB", borderRadius: 8, background: "none", fontSize: 13, color: "#6B7280", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <Plus size={14} /> Add FAQ
            </button>
          </div>
          {toggle("Show search bar", "showSearch", true)}
        </>);

      case "Live Chat Support":
        return (<>
          <div style={{ background: "linear-gradient(135deg, #1A1A2E, #2D2D5E)", borderRadius: 8, padding: 16, marginBottom: 20 }}>
            <div style={{ color: AMBER, fontSize: 13, fontWeight: 600 }}>💁 Premium Integration</div>
            <div style={{ color: "#fff", fontSize: 12, marginTop: 4 }}>Offer real-time support with a dedicated chat widget.</div>
          </div>
          {input("Agent display name", "agentName", merchant?.name || "Support Team")}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Business hours start</label>
              <input value={getVal("hoursStart", "09:00")} onChange={e => setVal("hoursStart", e.target.value)} type="time" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Business hours end</label>
              <input value={getVal("hoursEnd", "18:00")} onChange={e => setVal("hoursEnd", e.target.value)} type="time" style={inputStyle} />
            </div>
          </div>
          {select("Response time SLA", "responseSla", ["Instant", "5 min", "15 min", "30 min", "1 hour"])}
          {textarea("Away message", "awayMsg", `We're currently offline. Leave a message and we'll get back to you during business hours.`)}
          {toggle("Show estimated wait time", "showWaitTime", true)}
          {toggle("File attachment support", "fileAttach", true)}
        </>);

      default:
        return (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#9CA3AF" }}>
            <span style={{ fontSize: 48 }}>{integration.icon || "🔌"}</span>
            <div style={{ fontSize: 16, fontWeight: 600, color: NAVY, marginTop: 12 }}>{integration.name}</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>Configuration for this integration is coming soon.</div>
          </div>
        );
    }
  };

  return (
    <>
      <div onClick={() => onSave(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 100 }} />
      <div style={{ position: "fixed", right: 0, top: 0, width: isMobile ? "100%" : 520, maxWidth: "100vw", height: "100vh", background: "#fff", zIndex: 101, boxShadow: "-8px 0 32px rgba(0,0,0,0.12)", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "24px", borderBottom: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 32 }}>{integration.icon}</span>
            <div>
              <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 18, color: NAVY, margin: 0 }}>Configure {integration.name}</h3>
              <span style={{ fontSize: 12, color: "#2ECC71", fontWeight: 500 }}>🟢 Connected</span>
            </div>
          </div>
          <button onClick={() => onSave(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280", display: "flex" }}>
            <X size={22} />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          {renderForm()}
        </div>
        <div style={{ padding: 24, borderTop: "1px solid #E5E7EB", display: "flex", flexDirection: "column", gap: 10 }}>
          <button onClick={() => onSave(config)} style={{ background: AMBER, color: NAVY, border: "none", borderRadius: 24, height: 48, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Save Changes</button>
          <button onClick={() => onRemove(integration)} style={{ background: "none", border: "none", color: "#E74C3C", fontSize: 13, cursor: "pointer" }}>Disconnect {integration.name}</button>
        </div>
      </div>
    </>
  );
}
