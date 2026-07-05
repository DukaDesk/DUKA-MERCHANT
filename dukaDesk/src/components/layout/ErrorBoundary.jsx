import { Component } from "react";
import { NAVY, AMBER } from "../../theme";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 60, textAlign: "center" }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 24, color: NAVY, marginBottom: 8 }}>Something went wrong</h2>
          <p style={{ color: "#6B7280", marginBottom: 24, fontSize: 14 }}>
            {this.state.error?.message || "An unexpected error occurred. Please try again."}
          </p>
          <button onClick={() => window.location.reload()} style={{ background: AMBER, color: NAVY, border: "none", borderRadius: 10, padding: "12px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
