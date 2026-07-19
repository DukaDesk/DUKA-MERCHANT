import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User, Store, Phone, ArrowLeft, KeyRound, AlertCircle, CheckCircle } from "lucide-react";
import PropTypes from "prop-types";
import { useIsMobile } from "../../hooks/useMediaQuery";
import { useToast } from "../../contexts";
import { NAVY, AMBER, GREEN, RED, PURPLE, inputStyle, labelStyle } from "../../theme";
import { login, signup, forgotPassword, setToken } from "../../services/api";

export default function Auth({ onAuth }) {
  const isMobile = useIsMobile();
  const location = useLocation();
  const page = location.pathname.replace("/", "") || "login";
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", minHeight: "100vh" }}>
      <LeftPanel page={page} isMobile={isMobile} />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", padding: isMobile ? "24px 16px" : "40px 24px" }}>
        <div style={{ width: "100%", maxWidth: 460, animation: "fadeIn 0.4s ease" }}>
          {page === "login" && <LoginForm onAuth={onAuth} setPage={navigate} />}
          {page === "signup" && <SignupForm onAuth={onAuth} setPage={navigate} />}
          {page === "forgot" && <ForgotForm setPage={navigate} />}
        </div>
      </div>
    </div>
  );
}

Auth.propTypes = { onAuth: PropTypes.func.isRequired };

function LeftPanel({ page, isMobile }) {
  const copy = {
    login: { headline: "Welcome back.", sub: "Your apps, orders, and customers are waiting.", stats: ["2,000+ Merchants", "10,000+ Consumers", "500+ Apps Live"] },
    signup: { headline: "Launch your mobile app in days.", sub: "No developers. No agencies. Just build, scan, and go live.", props: [{ icon: "📱", text: "Your business gets a real mobile app" }, { icon: "📲", text: "Customers scan your QR code to access it" }, { icon: "📊", text: "Manage everything from this dashboard" }] },
    forgot: { headline: "We've got you.", sub: "Password resets are quick and secure." },
  };
  const c = copy[page] || copy.login;
  return (
    <div style={{ width: isMobile ? "100%" : 520, background: `linear-gradient(160deg, ${NAVY} 0%, #1A1A2E 100%)`, minHeight: isMobile ? "auto" : "100vh", display: "flex", flexDirection: "column", padding: isMobile ? "28px 20px" : "48px 48px", position: isMobile ? "relative" : "sticky", top: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "-40%", right: "-20%", width: "60%", height: "60%", background: `radial-gradient(circle, rgba(244,160,38,0.08) 0%, transparent 70%)`, borderRadius: "50%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-30%", left: "-10%", width: "50%", height: "50%", background: `radial-gradient(circle, rgba(244,160,38,0.05) 0%, transparent 70%)`, borderRadius: "50%", pointerEvents: "none" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: isMobile ? 28 : 56, position: "relative", zIndex: 1 }}>
        <div style={{ width: 38, height: 38, background: AMBER, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: NAVY, fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 20 }}>D</span>
        </div>
        <div>
          <span style={{ color: "#fff", fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 20 }}>DukaDesk</span>
          <span style={{ background: AMBER, color: NAVY, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, marginLeft: 6, verticalAlign: "middle" }}>MERCHANT</span>
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 1 }}>
        <h1 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: isMobile ? 28 : 44, color: "#fff", margin: "0 0 12px", lineHeight: 1.15 }}>{c.headline}</h1>
        <p style={{ color: "#9CA3AF", fontSize: isMobile ? 14 : 16, margin: "0 0 36px", lineHeight: 1.6, maxWidth: 380 }}>{c.sub}</p>
        {c.props && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {c.props.map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 40, height: 40, background: "rgba(255,255,255,0.06)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{p.icon}</div>
                <span style={{ color: "#D1D5DB", fontSize: 15 }}>{p.text}</span>
              </div>
            ))}
          </div>
        )}
        {c.stats && (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {c.stats.map((s, i) => (
              <span key={i} style={{ background: "rgba(244,160,38,0.12)", border: "1px solid rgba(244,160,38,0.25)", color: AMBER, borderRadius: 20, padding: "6px 14px", fontSize: 13, fontWeight: 500 }}>{s}</span>
            ))}
          </div>
        )}
      </div>
      <div style={{ marginTop: 40, position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          {["Ada", "Ibrahim", "Grace", "Fatima"].map((n, i) => (
            <div key={i} style={{ width: 32, height: 32, borderRadius: "50%", background: [GREEN, RED, PURPLE, AMBER][i], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", border: `2px solid ${NAVY}`, marginLeft: i > 0 ? -10 : 0, position: "relative", zIndex: 4 - i }}>{n[0]}</div>
          ))}
          <span style={{ color: "#6B7280", fontSize: 13, marginLeft: 16 }}>Join 2,000+ Nigerian businesses</span>
        </div>
      </div>
    </div>
  );
}

function LoginForm({ onAuth, setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const validateEmail = (value) => {
    if (!value) return "Email is required";
    if (!value.includes("@")) return "Enter a valid email";
    return "";
  };

  const validatePassword = (value) => {
    if (!value) return "Password is required";
    return "";
  };

  const handleEmailBlur = () => setFieldErrors(e => ({ ...e, email: validateEmail(email) }));
  const handlePasswordBlur = () => setFieldErrors(e => ({ ...e, password: validatePassword(password) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    if (emailErr || passErr) {
      setFieldErrors({ email: emailErr, password: passErr });
      return;
    }
    setLoading(true); setError("");
    try {
      const res = await login({ email, password });
      setToken(res.token);
      onAuth(res.merchant);
      setPage("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <>
      <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 30, color: NAVY, margin: "0 0 6px" }}>Log in to your dashboard</h2>
      <p style={{ color: "#6B7280", fontSize: 15, margin: "0 0 32px" }}>Manage your apps, orders, and customers.</p>
      {error && <ErrorBox message={error} />}
      <form onSubmit={handleSubmit}>
        <Field label="Email address" type="email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }} onBlur={handleEmailBlur} placeholder="ada@example.com" icon={<Mail size={18} />} error={fieldErrors.email} />
        <Field label="Password" type={showPw ? "text" : "password"} value={password} onChange={e => { setPassword(e.target.value); setError(""); }} onBlur={handlePasswordBlur} placeholder="Your password" icon={<Lock size={18} />} error={fieldErrors.password} suffix={
          <button type="button" onClick={() => setShowPw(!showPw)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280", display: "flex", alignItems: "center" }}>
            {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        } />
        <div style={{ textAlign: "right", marginBottom: 24 }}>
          <button type="button" onClick={() => setPage("/forgot")} style={{ background: "none", border: "none", color: AMBER, fontSize: 13, cursor: "pointer", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 6 }}>
            <KeyRound size={14} /> Forgot password?
          </button>
        </div>
        <PrimaryBtn loading={loading}>{loading ? "Logging in..." : "Log in"}</PrimaryBtn>
      </form>
      <Divider />
      <SocialBtn icon="G" provider="Google" disabled />
      <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "#6B7280" }}>
        Don't have an account?{" "}
        <button onClick={() => setPage("/signup")} style={{ background: "none", border: "none", color: AMBER, fontWeight: 600, cursor: "pointer" }}>Sign up →</button>
      </p>
    </>
  );
}

LoginForm.propTypes = { onAuth: PropTypes.func.isRequired, setPage: PropTypes.func.isRequired };

function SignupForm({ onAuth, setPage }) {
  const [form, setForm] = useState({ name: "", business: "", email: "", phone: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const passwordInputRef = useRef(null);
  const confirmInputRef = useRef(null);

  const strength = (pw) => {
    if (!pw) return 0; let s = 0;
    if (pw.length >= 8) s++; if (/[A-Z]/.test(pw)) s++; if (/[0-9!@#$%]/.test(pw)) s++;
    return s;
  };
  const pw = form.password;
  const s = strength(pw);
  const strLabel = ["", "Weak", "Medium", "Strong"][s];
  const strColor = ["", "#E74C3C", "#F4A026", "#2ECC71"][s];

  const validators = {
    name: (v) => !v ? "Full name is required" : v.length < 2 ? "Name too short" : "",
    business: (v) => !v ? "Business name is required" : v.length < 2 ? "Name too short" : "",
    email: (v) => !v ? "Email is required" : !v.includes("@") ? "Enter a valid email" : "",
    phone: (v) => !v ? "Phone number is required" : v.replace(/\s/g, "").length < 10 ? "Enter a valid Nigerian number" : "",
    password: (v) => !v ? "Password is required" : v.length < 8 ? "Minimum 8 characters" : !/[A-Z]/.test(v) ? "Add an uppercase letter" : !/[0-9!@#$%]/.test(v) ? "Add a number or symbol" : "",
    confirm: (v) => !v ? "Confirm your password" : v !== form.password ? "Passwords do not match" : "",
  };

  const validateField = (name, value) => validators[name]?.(value) || "";

  const handleBlur = (name) => {
    setTouched(t => ({ ...t, [name]: true }));
    const err = validateField(name, form[name]);
    setErrors(e => ({ ...e, [name]: err }));
  };

  const handleChange = (name) => (e) => {
    const value = e.target.value;
    setForm(f => ({ ...f, [name]: value }));
    if (touched[name]) {
      setErrors(e => ({ ...e, [name]: validateField(name, value) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    let hasError = false;
    Object.keys(validators).forEach(key => {
      const err = validateField(key, form[key]);
      if (err) { newErrors[key] = err; hasError = true; }
    });
    setTouched(Object.keys(validators).reduce((acc, k) => ({ ...acc, [k]: true }), {}));
    setErrors(newErrors);
    if (hasError) return;

    setLoading(true);
    try {
      const res = await signup({ fullName: form.name, businessName: form.business, email: form.email, phone: form.phone, password: form.password });
      setToken(res.token);
      onAuth(res.merchant);
      setPage("/canvas-editor");
    } catch (err) {
      setErrors({ submit: err.message || "Signup failed. Please try again." });
    } finally { setLoading(false); }
  };

  return (
    <>
      <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 30, color: NAVY, margin: "0 0 6px" }}>Create your merchant account</h2>
      <p style={{ color: "#6B7280", fontSize: 15, margin: "0 0 28px" }}>Start free. No credit card required.</p>
      {errors.submit && <ErrorBox message={errors.submit} />}
      <form onSubmit={handleSubmit}>
        <Field label="Full name" value={form.name} onChange={handleChange("name")} onBlur={() => handleBlur("name")} placeholder="Ada Okafor" error={touched.name ? errors.name : undefined} icon={<User size={18} />} />
        <Field label="Business name" value={form.business} onChange={handleChange("business")} onBlur={() => handleBlur("business")} placeholder="Ada's Kitchen" error={touched.business ? errors.business : undefined} icon={<Store size={18} />} />
        <Field label="Email address" type="email" value={form.email} onChange={handleChange("email")} onBlur={() => handleBlur("email")} placeholder="ada@example.com" error={touched.email ? errors.email : undefined} icon={<Mail size={18} />} />
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Phone number</label>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Phone size={18} color="#9CA3AF" />
            <div style={{ ...inputStyle, width: 80, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, cursor: "default", flexShrink: 0 }}>🇳🇬 +234</div>
            <input style={{ ...inputStyle, flex: 1 }} placeholder="801 234 5678" type="tel" value={form.phone} onChange={handleChange("phone")} onBlur={() => handleBlur("phone")} />
          </div>
          {touched.phone && errors.phone && <p style={{ color: "#E74C3C", fontSize: 12, marginTop: 4 }}>{errors.phone}</p>}
        </div>
        <Field label="Password" type={showPw ? "text" : "password"} value={form.password} onChange={handleChange("password")} onBlur={() => handleBlur("password")} placeholder="Min. 8 characters" error={touched.password ? errors.password : undefined} icon={<Lock size={18} />} ref={passwordInputRef} suffix={
          <button type="button" onClick={() => setShowPw(!showPw)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280", display: "flex", alignItems: "center" }}>
            {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        } />
        {pw && (
          <div style={{ marginTop: -8, marginBottom: 16 }}>
            <div style={{ height: 4, background: "#E8E8F0", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(s / 3) * 100}%`, background: strColor, transition: "all 0.3s", borderRadius: 2 }} />
            </div>
            <span style={{ fontSize: 11, color: strColor, fontWeight: 600 }}>{strLabel}</span>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>Use 8+ chars, 1 uppercase, 1 number/symbol</div>
          </div>
        )}
        <Field label="Confirm password" type={showConfirmPw ? "text" : "password"} value={form.confirm} onChange={handleChange("confirm")} onBlur={() => handleBlur("confirm")} placeholder="Repeat password" error={touched.confirm ? errors.confirm : undefined} icon={<Lock size={18} />} ref={confirmInputRef} suffix={
          <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280", display: "flex", alignItems: "center" }}>
            {showConfirmPw ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        } />
        <p style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 20 }}>
          By signing up you agree to our <span onClick={() => window.open("https://dukadesk.com/terms", "_blank")} style={{ color: AMBER, cursor: "pointer", fontWeight: 500 }}>Terms</span> & <span onClick={() => window.open("https://dukadesk.com/privacy", "_blank")} style={{ color: AMBER, cursor: "pointer", fontWeight: 500 }}>Privacy Policy</span>
        </p>
        <PrimaryBtn loading={loading}>{loading ? "Creating account..." : "Create merchant account"}</PrimaryBtn>
      </form>
      <Divider />
      <SocialBtn icon="G" provider="Google" disabled />
      <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "#6B7280" }}>
        Already have an account?{" "}
        <button onClick={() => setPage("/login")} style={{ background: "none", border: "none", color: AMBER, fontWeight: 600, cursor: "pointer" }}>Log in →</button>
      </p>
    </>
  );
}

SignupForm.propTypes = { onAuth: PropTypes.func.isRequired, setPage: PropTypes.func.isRequired };

function ForgotForm({ setPage }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);

  const validateEmail = (value) => {
    if (!value) return "Email is required";
    if (!value.includes("@")) return "Enter a valid email";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateEmail(email);
    if (err) { setError(err); setTouched(true); return; }
    setLoading(true); setError("");
    try {
      await forgotPassword({ email });
      setSent(true);
    } catch (err) {
      setError(err.message || "Request failed. Please try again.");
    } finally { setLoading(false); }
  };

  if (sent) return (
    <div style={{ textAlign: "center", animation: "fadeIn 0.4s ease" }}>
      <div style={{ width: 80, height: 80, background: "#F0FDF4", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 36 }}>✉️</div>
      <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 26, color: NAVY, marginBottom: 8 }}>Check your inbox</h2>
      <p style={{ color: "#6B7280", marginBottom: 28, fontSize: 15 }}>We sent a reset link to <strong>{email}</strong>. It expires in 15 minutes.</p>
      <button onClick={() => { setSent(false); setEmail(""); }} style={{ background: "none", border: "1px solid #E8E8F0", borderRadius: 10, padding: "12px 28px", fontSize: 14, cursor: "pointer", color: NAVY, fontWeight: 600 }}>Resend link</button>
      <button onClick={() => setPage("/login")} style={{ display: "block", margin: "16px auto 0", background: "none", border: "none", color: AMBER, fontWeight: 600, cursor: "pointer", fontSize: 14 }}>
        <ArrowLeft size={14} style={{ verticalAlign: "middle", marginRight: 4 }} /> Back to login
      </button>
    </div>
  );

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ width: 72, height: 72, background: "#FFF8ED", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 32 }}>🔒</div>
        <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 26, color: NAVY, marginBottom: 6 }}>Reset your password</h2>
        <p style={{ color: "#6B7280", fontSize: 15 }}>Enter your email and we'll send a reset link.</p>
      </div>
      {error && <ErrorBox message={error} />}
      <form onSubmit={handleSubmit}>
        <Field label="Email address" type="email" value={email} onChange={e => { setEmail(e.target.value); if (touched) setError(""); }} onBlur={() => { setTouched(true); const err = validateEmail(email); if (err) setError(err); }} placeholder="ada@example.com" icon={<Mail size={18} />} error={touched ? error || undefined : undefined} />
        <PrimaryBtn loading={loading}>{loading ? "Sending..." : "Send reset link"}</PrimaryBtn>
      </form>
      <button onClick={() => setPage("/login")} style={{ display: "block", margin: "16px auto 0", background: "none", border: "none", color: AMBER, fontWeight: 600, cursor: "pointer", fontSize: 14 }}>
        <ArrowLeft size={14} style={{ verticalAlign: "middle", marginRight: 4 }} /> Back to login
      </button>
    </div>
  );
}

ForgotForm.propTypes = { setPage: PropTypes.func.isRequired };

function Field({ label, error, icon, suffix, ref, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={labelStyle}>{label}</label>
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        {icon && <span style={{ position: "absolute", left: 14, color: "#9CA3AF", display: "flex", zIndex: 1 }}>{icon}</span>}
        <input ref={ref} style={{ ...inputStyle, paddingLeft: icon ? 42 : 14, paddingRight: suffix ? 42 : 14, borderColor: error ? "#E74C3C" : focused ? AMBER : "var(--border)", boxShadow: focused ? `0 0 0 3px rgba(244,160,38,0.1)` : "none" }} {...props} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
        {suffix && <span style={{ position: "absolute", right: 14 }}>{suffix}</span>}
        {error && <span style={{ position: "absolute", right: suffix ? 50 : 14, color: "#E74C3C", fontSize: 16 }}><AlertCircle size={16} /></span>}
      </div>
      {error && <p style={{ color: "#E74C3C", fontSize: 12, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}><AlertCircle size={12} /> {error}</p>}
    </div>
  );
}

Field.propTypes = { label: PropTypes.string.isRequired, error: PropTypes.string, icon: PropTypes.node, suffix: PropTypes.node, ref: PropTypes.object };

function PrimaryBtn({ children, loading, onClick, type = "submit" }) {
  return (
    <button type={type} onClick={onClick} disabled={loading} style={{
      width: "100%", height: 50, borderRadius: 10, border: "none",
      fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 15,
      cursor: loading ? "wait" : "pointer",
      background: loading ? "#D1D5DB" : AMBER, color: NAVY,
      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      opacity: loading ? 0.7 : 1,
    }}>
      {children}
    </button>
  );
}

PrimaryBtn.propTypes = { children: PropTypes.node.isRequired, loading: PropTypes.bool, onClick: PropTypes.func, type: PropTypes.string };

function SocialBtn({ icon, provider, disabled }) {
  const showToast = useToast();
  const handleClick = () => {
    if (disabled) return;
    showToast(`${provider} sign-in coming soon`, "info");
  };
  return (
    <button onClick={handleClick} disabled={disabled} style={{ width: "100%", height: 50, borderRadius: 10, border: disabled ? "1.5px solid #E8E8F0" : "1.5px solid #D1D5DB", background: disabled ? "#fff" : "#F9FAFB", fontSize: 14, color: disabled ? NAVY : "#9CA3AF", cursor: disabled ? "pointer" : "not-allowed", fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s", opacity: disabled ? 1 : 0.6 }}>
      <div style={{ width: 20, height: 20, background: NAVY, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700 }}>{icon}</div>
      Continue with {provider}
    </button>
  );
}

SocialBtn.propTypes = { icon: PropTypes.string, provider: PropTypes.string, disabled: PropTypes.bool };

function Divider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
      <div style={{ flex: 1, height: 1, background: "#E8E8F0" }} />
      <span style={{ color: "#9CA3AF", fontSize: 13 }}>OR</span>
      <div style={{ flex: 1, height: 1, background: "#E8E8F0" }} />
    </div>
  );
}

function ErrorBox({ message }) {
  return (
    <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "12px 16px", color: "#991B1B", fontSize: 14, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
      <AlertCircle size={16} /> {message}
    </div>
  );
}

ErrorBox.propTypes = { message: PropTypes.string };