import { useState } from "react";

const NAVY = "#1A1A2E";
const AMBER = "#F4A026";

export default function Auth({ page, setPage, onAuth, showToast }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <LeftPanel page={page} />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", padding: "40px 24px" }}>
        {page === "login" && <LoginForm setPage={setPage} onAuth={onAuth} showToast={showToast} />}
        {page === "signup" && <SignupForm setPage={setPage} onAuth={onAuth} showToast={showToast} />}
        {page === "forgot" && <ForgotForm setPage={setPage} showToast={showToast} />}
      </div>
    </div>
  );
}

function LeftPanel({ page }) {
  const copy = {
    login: {
      headline: "Welcome back.",
      sub: "Your apps and customers are waiting.",
      stats: ["2,000+ Merchants", "10,000+ Consumers", "500+ Apps Live"],
    },
    signup: {
      headline: "Launch your mobile app in days.",
      sub: "No developers. No agencies. Just build, scan, and go live.",
      props: [
        { icon: "📱", text: "Your business gets a real mobile app" },
        { icon: "📲", text: "Customers scan your QR code to access it" },
        { icon: "📊", text: "Manage everything from this dashboard" },
      ],
    },
    forgot: {
      headline: "We've got you.",
      sub: "Password resets are quick and secure.",
    },
  };
  const c = copy[page] || copy.login;
  return (
    <div style={{ width: 520, background: NAVY, minHeight: "100vh", display: "flex", flexDirection: "column", padding: "48px 56px", position: "sticky", top: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 64 }}>
        <div style={{ width: 36, height: 36, background: AMBER, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: NAVY, fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 18 }}>D</span>
        </div>
        <span style={{ color: "#fff", fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 20 }}>DukaDesk</span>
        <span style={{ background: AMBER, color: NAVY, fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20, marginLeft: 4 }}>Merchant</span>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <h1 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 48, color: "#fff", margin: "0 0 16px", lineHeight: 1.1 }}>{c.headline}</h1>
        <p style={{ color: "#9CA3AF", fontSize: 18, margin: "0 0 48px", lineHeight: 1.6 }}>{c.sub}</p>
        {c.props && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {c.props.map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontSize: 24 }}>{p.icon}</span>
                <span style={{ color: "#fff", fontSize: 16 }}>{p.text}</span>
              </div>
            ))}
          </div>
        )}
        {c.stats && (
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {c.stats.map((s, i) => (
              <span key={i} style={{ background: "rgba(244,160,38,0.15)", border: "1px solid rgba(244,160,38,0.3)", color: AMBER, borderRadius: 20, padding: "6px 14px", fontSize: 13, fontWeight: 500 }}>{s}</span>
            ))}
          </div>
        )}
      </div>
      <div style={{ marginTop: 48 }}>
        <div style={{ display: "flex", gap: 8 }}>
          {["Ada", "Ibrahim", "Grace"].map((n, i) => (
            <div key={i} style={{ width: 32, height: 32, borderRadius: "50%", background: ["#2ECC71", "#E74C3C", "#7C3AED"][i], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", border: "2px solid " + NAVY, marginLeft: i > 0 ? -8 : 0 }}>{n[0]}</div>
          ))}
          <span style={{ color: "#9CA3AF", fontSize: 13, marginLeft: 12, alignSelf: "center" }}>Join 2,000+ businesses</span>
        </div>
      </div>
    </div>
  );
}

function LoginForm({ setPage, onAuth, showToast }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onAuth({ name: "Ada Okafor", business: "Mama's Kitchen", email });
    }, 1200);
  };

  return (
    <div style={{ width: "100%", maxWidth: 460 }}>
      <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 32, color: NAVY, margin: "0 0 8px" }}>Log in to your dashboard</h2>
      <p style={{ color: "#6B7280", fontSize: 15, margin: "0 0 36px" }}>Manage your apps, orders, and customers.</p>
      {error && <div style={{ background: "#FEF2F2", border: "1px solid #E74C3C", borderRadius: 8, padding: "12px 16px", color: "#991B1B", fontSize: 14, marginBottom: 20 }}>⚠ {error}</div>}
      <form onSubmit={handleSubmit}>
        <Field label="Email address" type="email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }} placeholder="ada@mamaskitchen.com" />
        <div style={{ position: "relative", marginBottom: 8 }}>
          <Field label="Password" type={showPw ? "text" : "password"} value={password} onChange={e => { setPassword(e.target.value); setError(""); }} placeholder="Your password" />
          <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 14, top: 38, background: "none", border: "none", cursor: "pointer", color: "#6B7280", fontSize: 13 }}>{showPw ? "Hide" : "Show"}</button>
        </div>
        <div style={{ textAlign: "right", marginBottom: 24 }}>
          <button type="button" onClick={() => setPage("forgot")} style={{ background: "none", border: "none", color: AMBER, fontSize: 13, cursor: "pointer", fontWeight: 500 }}>Forgot password?</button>
        </div>
        <Btn loading={loading}>{loading ? "Logging in..." : "Log in"}</Btn>
      </form>
      <Divider />
      <OutlineBtn onClick={() => showToast("Google OAuth coming soon", "info")}>Continue with Google</OutlineBtn>
      <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "#6B7280" }}>
        Don't have an account?{" "}
        <button onClick={() => setPage("signup")} style={{ background: "none", border: "none", color: AMBER, fontWeight: 600, cursor: "pointer" }}>Sign up →</button>
      </p>
    </div>
  );
}

function SignupForm({ setPage, onAuth, showToast }) {
  const [form, setForm] = useState({ name: "", business: "", email: "", phone: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const strength = (pw) => {
    if (!pw) return 0;
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9!@#$%]/.test(pw)) s++;
    return s;
  };
  const pw = form.password;
  const s = strength(pw);
  const strLabel = ["", "Weak", "Medium", "Strong"][s];
  const strColor = ["", "#E74C3C", "#F4A026", "#2ECC71"][s];

  const validate = () => {
    const e = {};
    if (!form.name) e.name = "Required";
    if (!form.business) e.business = "Required";
    if (!form.email.includes("@")) e.email = "Enter a valid email";
    if (form.password.length < 8) e.password = "Min. 8 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords do not match";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onAuth({ name: form.name, business: form.business, email: form.email });
    }, 1400);
  };

  const set = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); setErrors(er => ({ ...er, [k]: "" })); };

  return (
    <div style={{ width: "100%", maxWidth: 480 }}>
      <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 32, color: NAVY, margin: "0 0 8px" }}>Create your merchant account</h2>
      <p style={{ color: "#6B7280", fontSize: 15, margin: "0 0 32px" }}>Start free. No credit card required.</p>
      <form onSubmit={handleSubmit}>
        <Field label="Full name" value={form.name} onChange={set("name")} placeholder="Ada Okafor" error={errors.name} />
        <Field label="Business name" value={form.business} onChange={set("business")} placeholder="Mama's Kitchen" error={errors.business} />
        <Field label="Email address" type="email" value={form.email} onChange={set("email")} placeholder="ada@mamaskitchen.com" error={errors.email} />
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Phone number</label>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ ...inputStyle, width: 80, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, cursor: "default" }}>🇳🇬 +234</div>
            <input style={{ ...inputStyle, flex: 1 }} placeholder="801 234 5678" type="tel" />
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <Field label="Password" type={showPw ? "text" : "password"} value={form.password} onChange={set("password")} placeholder="Min. 8 characters" error={errors.password} />
          <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 14, top: 38, background: "none", border: "none", cursor: "pointer", color: "#6B7280", fontSize: 13 }}>{showPw ? "Hide" : "Show"}</button>
        </div>
        {pw && (
          <div style={{ marginTop: -8, marginBottom: 16 }}>
            <div style={{ height: 4, background: "#E5E7EB", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(s / 3) * 100}%`, background: strColor, transition: "all 0.3s", borderRadius: 2 }} />
            </div>
            <span style={{ fontSize: 11, color: strColor, fontWeight: 600 }}>{strLabel}</span>
          </div>
        )}
        <Field label="Confirm password" type="password" value={form.confirm} onChange={set("confirm")} placeholder="Repeat password" error={errors.confirm} />
        <p style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 20 }}>
          By signing up you agree to our{" "}
          <span style={{ color: AMBER, cursor: "pointer" }}>Terms</span> &{" "}
          <span style={{ color: AMBER, cursor: "pointer" }}>Privacy Policy</span>
        </p>
        <Btn loading={loading}>{loading ? "Creating account..." : "Create merchant account"}</Btn>
      </form>
      <Divider />
      <OutlineBtn onClick={() => showToast("Google OAuth coming soon", "info")}>Continue with Google</OutlineBtn>
      <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "#6B7280" }}>
        Already have an account?{" "}
        <button onClick={() => setPage("login")} style={{ background: "none", border: "none", color: AMBER, fontWeight: 600, cursor: "pointer" }}>Log in →</button>
      </p>
    </div>
  );
}

function ForgotForm({ setPage, showToast }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1200);
  };

  if (sent) return (
    <div style={{ width: "100%", maxWidth: 420, textAlign: "center" }}>
      <div style={{ width: 80, height: 80, background: "#F0FDF4", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 36 }}>✉️</div>
      <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 28, color: NAVY, marginBottom: 12 }}>Check your inbox</h2>
      <p style={{ color: "#6B7280", marginBottom: 32 }}>We sent a reset link to <strong>{email}</strong>. It expires in 15 minutes.</p>
      <OutlineBtn onClick={() => { setSent(false); setEmail(""); }}>Resend link</OutlineBtn>
      <button onClick={() => setPage("login")} style={{ display: "block", margin: "16px auto 0", background: "none", border: "none", color: AMBER, fontWeight: 600, cursor: "pointer", fontSize: 14 }}>← Back to login</button>
    </div>
  );

  return (
    <div style={{ width: "100%", maxWidth: 420 }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ width: 80, height: 80, background: "#FFF8ED", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 36 }}>🔒</div>
        <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 28, color: NAVY, marginBottom: 8 }}>Reset your password</h2>
        <p style={{ color: "#6B7280" }}>Enter your email and we'll send a reset link.</p>
      </div>
      <form onSubmit={handleSubmit}>
        <Field label="Email address" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ada@mamaskitchen.com" />
        <Btn loading={loading}>{loading ? "Sending..." : "Send reset link"}</Btn>
      </form>
      <button onClick={() => setPage("login")} style={{ display: "block", margin: "16px auto 0", background: "none", border: "none", color: AMBER, fontWeight: 600, cursor: "pointer", fontSize: 14 }}>← Back to login</button>
    </div>
  );
}

// ── Shared UI helpers ──────────────────────────────────────────────────────
const labelStyle = { display: "block", fontSize: 13, fontWeight: 600, color: NAVY, marginBottom: 6 };
const inputStyle = { width: "100%", height: 52, border: "1px solid #E5E7EB", borderRadius: 8, padding: "0 14px", fontSize: 15, color: NAVY, outline: "none", boxSizing: "border-box", fontFamily: "inherit", background: "#fff" };

function Field({ label, error, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={labelStyle}>{label}</label>
      <input style={{ ...inputStyle, ...(error ? { borderColor: "#E74C3C" } : {}) }} {...props} onFocus={e => e.target.style.borderColor = AMBER} onBlur={e => e.target.style.borderColor = error ? "#E74C3C" : "#E5E7EB"} />
      {error && <p style={{ color: "#E74C3C", fontSize: 12, marginTop: 4 }}>⚠ {error}</p>}
    </div>
  );
}

function Btn({ children, loading, onClick, type = "submit", variant = "primary" }) {
  const base = { width: "100%", height: 52, borderRadius: 28, border: "none", fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 16, cursor: loading ? "wait" : "pointer", transition: "opacity 0.2s" };
  const styles = {
    primary: { background: loading ? "#D1D5DB" : AMBER, color: NAVY },
  };
  return <button type={type} onClick={onClick} style={{ ...base, ...styles[variant] }}>{children}</button>;
}

function OutlineBtn({ children, onClick }) {
  return (
    <button onClick={onClick} style={{ width: "100%", height: 52, borderRadius: 28, border: "1px solid #E5E7EB", background: "#fff", fontFamily: "inherit", fontSize: 15, color: NAVY, cursor: "pointer", fontWeight: 500, marginBottom: 8 }}>
      {children}
    </button>
  );
}

function Divider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
      <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
      <span style={{ color: "#9CA3AF", fontSize: 13 }}>OR</span>
      <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
    </div>
  );
}
