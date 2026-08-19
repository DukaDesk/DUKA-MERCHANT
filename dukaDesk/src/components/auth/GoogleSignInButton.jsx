import { useEffect, useRef } from "react";
import PropTypes from "prop-types";

const GSI_SRC = "https://accounts.google.com/gsi/client";

function loadGsi() {
  return new Promise((resolve) => {
    if (window.google?.accounts?.id) return resolve(true);
    const existing = document.querySelector(`script.gsi-client`);
    if (existing) {
      if (existing.dataset.loaded === "1") return resolve(true);
      existing.addEventListener("load", () => resolve(true), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = GSI_SRC;
    script.async = true;
    script.defer = true;
    script.className = "gsi-client";
    script.addEventListener("load", () => { script.dataset.loaded = "1"; resolve(true); }, { once: true });
    script.addEventListener("error", () => resolve(false), { once: true });
    document.head.appendChild(script);
  });
}

export default function GoogleSignInButton({ clientId, onToken, label }) {
  const holderRef = useRef(null);
  const visualRef = useRef(null);
  const callbackRef = useRef(null);
  callbackRef.current = onToken;

  const id = clientId?.trim() || import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() || "";

  useEffect(() => {
    let cancelled = false;
    if (!id) {
      console.error("[GoogleSignInButton] No Google Client ID configured. Set VITE_GOOGLE_CLIENT_ID (or pass a clientId prop) before using Google sign-in.");
      return () => { cancelled = true; };
    }
    loadGsi().then((ok) => {
      if (cancelled || !ok || !holderRef.current) return;

      window.google.accounts.id.initialize({
        client_id: id,
        callback: (response) => callbackRef.current?.(response.credential),
        ux_mode: "popup",
        auto_select: false,
      });

      window.google.accounts.id.renderButton(holderRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        width: holderRef.current.clientWidth,
        height: 50,
        text: "continue_with",
        shape: "pill",
        logo_alignment: "left",
      });
    });
    return () => { cancelled = true; };
  }, [id]);

  return (
    <div style={{ position: "relative", width: "100%", height: 50 }}>
      <button
        type="button"
        ref={visualRef}
        tabIndex={-1}
        aria-hidden="true"
        style={{
          width: "100%",
          height: 50,
          borderRadius: 25,
          border: "1.5px solid #D1D5DB",
          background: "#fff",
          fontSize: 14,
          color: NAVY_DARK,
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          fontFamily: "inherit",
          pointerEvents: "none",
        }}
      >
        <GoogleG />
        {label || "Continue with Google"}
      </button>
      <div
        ref={holderRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: 50,
          opacity: 0,
          zIndex: 2,
        }}
        title="Sign in with Google"
      />
    </div>
  );
}

GoogleSignInButton.propTypes = {
  clientId: PropTypes.string,
  onToken: PropTypes.func.isRequired,
  label: PropTypes.string,
};

function GoogleG() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

const NAVY_DARK = "#0F0F1A";