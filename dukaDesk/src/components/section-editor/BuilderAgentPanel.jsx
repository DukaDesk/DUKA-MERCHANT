import { useRef, useState } from "react";
import { LoaderCircle, Send, Sparkles, X } from "lucide-react";
import { validateProject } from "../../services/ValidationEngine";
import { applyBuilderAgentProposal, createBuilderAgentPlan } from "../../services/builderAgent";
import { requestBuilderAgentCompletion } from "../../services/api";

const STARTERS = [
  "Create a welcoming home screen for my business",
  "Add a services screen with clear service cards",
  "Make the home screen feel more polished",
];

function summarizeProposal(response) {
  const changes = [];
  if (response.proposal?.app?.appName) changes.push(`App name: ${response.proposal.app.appName}`);
  for (const screen of response.proposal?.screens || []) {
    changes.push(`${screen.mode === "append" ? "Add to" : "Build"} ${screen.name || screen.id} (${screen.sections?.length || 0} sections)`);
  }
  if (response.proposal?.navigation) changes.push("Update screen navigation");
  return changes;
}

export default function BuilderAgentPanel({ design, currentScreenId, theme, onApply, onClose }) {
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const [proposal, setProposal] = useState(null);
  const [error, setError] = useState("");
  const transcriptRef = useRef(null);

  const send = async (value = prompt) => {
    const request = value.trim();
    if (!request || busy) return;
    setPrompt("");
    setProposal(null);
    setError("");
    setMessages(current => [...current, { role: "user", text: request }]);
    setBusy(true);
    try {
      const response = await createBuilderAgentPlan(request, design, requestBuilderAgentCompletion, currentScreenId, messages);
      if (response.scope !== "in_scope") {
        setMessages(current => [...current, { role: "assistant", text: response.reply }]);
        return;
      }
      const nextDesign = applyBuilderAgentProposal(design, response);
      const validation = validateProject(nextDesign);
      if (!validation.valid) {
        const issues = validation.errors.slice(0, 4).map(issue => `${issue.path}: ${issue.message}`).join("\n");
        setMessages(current => [...current, {
          role: "assistant",
          text: `I drafted a change, but it does not pass the builder's checks yet, so I have not applied it.\n${issues}`,
        }]);
        return;
      }
      setMessages(current => [...current, { role: "assistant", text: response.reply }]);
      setProposal({ design: nextDesign, validation, changes: summarizeProposal(response) });
    } catch (requestError) {
      setError(requestError.message || "I couldn't prepare a proposal. Please try again.");
    } finally {
      setBusy(false);
      requestAnimationFrame(() => {
        if (transcriptRef.current) transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
      });
    }
  };

  const inputStyle = {
    width: "100%", resize: "vertical", minHeight: 78, maxHeight: 150,
    border: `1px solid ${theme.border}`, borderRadius: 8, padding: "10px 12px",
    background: theme.canvas, color: theme.text, font: "inherit", fontSize: 13,
    outlineColor: theme.active, boxSizing: "border-box",
  };

  return (
    <aside aria-label="DukaDesk Builder Agent" style={{
      position: "absolute", zIndex: 80, top: 52, right: 0, bottom: 48,
      width: "min(390px, calc(100vw - 16px))", display: "flex", flexDirection: "column",
      background: theme.surface, borderLeft: `1px solid ${theme.border}`,
      boxShadow: "-12px 0 32px rgba(15, 23, 42, 0.16)", color: theme.text,
      fontFamily: "'Inter',sans-serif",
    }}>
      <header style={{ display: "flex", alignItems: "center", gap: 11, padding: "14px 16px", borderBottom: `1px solid ${theme.border}` }}>
        <div style={{ width: 34, height: 34, display: "grid", placeItems: "center", borderRadius: 9, background: "#FFF1D6", color: "#8A4B08" }}>
          <Sparkles size={18} aria-hidden="true" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Build with AI</div>
          <div style={{ color: theme.textMuted, fontSize: 11, marginTop: 2 }}>DukaDesk Builder Agent</div>
        </div>
        <button type="button" onClick={onClose} aria-label="Close Builder Agent" title="Close Builder Agent" style={{ border: 0, background: "transparent", color: theme.textSecondary, cursor: "pointer", padding: 6 }}>
          <X size={18} />
        </button>
      </header>

      <div ref={transcriptRef} aria-live="polite" style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.length === 0 && (
          <div style={{ paddingTop: 5 }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>What would you like to build?</div>
            <p style={{ margin: "0 0 16px", fontSize: 12, lineHeight: 1.55, color: theme.textSecondary }}>
              Describe the screens or visual changes you need. I’ll use DukaDesk components and check the proposal before it reaches your canvas.
            </p>
            <div style={{ display: "grid", gap: 8 }}>
              {STARTERS.map(starter => (
                <button key={starter} type="button" onClick={() => send(starter)} disabled={busy} style={{
                  textAlign: "left", background: theme.canvas, color: theme.text, border: `1px solid ${theme.border}`,
                  borderRadius: 8, padding: "10px 11px", fontSize: 12, lineHeight: 1.4, cursor: "pointer",
                }}>{starter}</button>
              ))}
            </div>
          </div>
        )}
        {messages.map((message, index) => (
          <div key={`${index}-${message.role}`} style={{
            alignSelf: message.role === "user" ? "flex-end" : "stretch", maxWidth: message.role === "user" ? "88%" : "100%",
            whiteSpace: "pre-wrap", overflowWrap: "anywhere", fontSize: 12, lineHeight: 1.55,
            padding: "10px 12px", borderRadius: 10,
            background: message.role === "user" ? theme.active : theme.canvas,
            color: message.role === "user" ? "#1F2937" : theme.text,
            border: message.role === "user" ? "none" : `1px solid ${theme.border}`,
          }}>{message.text}</div>
        ))}
        {busy && <div role="status" style={{ display: "flex", alignItems: "center", gap: 8, color: theme.textSecondary, fontSize: 12 }}><LoaderCircle size={15} style={{ animation: "spin 0.8s linear infinite" }} /> Thinking through the builder rules…</div>}
        {error && <div role="alert" style={{ padding: 10, borderRadius: 8, background: "#FEF2F2", color: "#991B1B", fontSize: 12, lineHeight: 1.45 }}>{error}</div>}
        {proposal && (
          <section aria-label="Proposed canvas changes" style={{ border: `1px solid ${theme.border}`, borderTop: `3px solid ${theme.active}`, borderRadius: 8, padding: 12, background: theme.surface }}>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>Review changes</div>
            <ul style={{ margin: 0, paddingLeft: 17, display: "grid", gap: 5, fontSize: 11, lineHeight: 1.45, color: theme.textSecondary }}>
              {proposal.changes.map((change, index) => <li key={`${index}-${change}`}>{change}</li>)}
            </ul>
            {proposal.validation.warnings.length > 0 && <div style={{ fontSize: 11, lineHeight: 1.45, color: "#92400E", marginTop: 9 }}>{proposal.validation.warnings.length} validation warning(s) to review after applying.</div>}
            <button type="button" onClick={() => onApply(proposal.design)} style={{
              width: "100%", marginTop: 12, border: 0, borderRadius: 7, padding: "10px 12px",
              background: theme.active, color: "#1F2937", fontSize: 12, fontWeight: 700, cursor: "pointer",
            }}>Apply to canvas</button>
          </section>
        )}
      </div>

      <form onSubmit={event => { event.preventDefault(); send(); }} style={{ padding: 12, borderTop: `1px solid ${theme.border}`, display: "grid", gap: 8 }}>
        <label htmlFor="builder-agent-prompt" style={{ fontSize: 11, fontWeight: 600, color: theme.textSecondary }}>Describe a screen or visual change</label>
        <textarea id="builder-agent-prompt" value={prompt} onChange={event => setPrompt(event.target.value)} onKeyDown={event => {
          if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); send(); }
        }} placeholder="Describe what your customers need to see…" disabled={busy} style={inputStyle} />
        <button type="submit" disabled={busy || !prompt.trim()} style={{
          justifySelf: "end", display: "inline-flex", alignItems: "center", gap: 7,
          border: 0, borderRadius: 7, padding: "9px 13px", background: theme.active,
          color: "#1F2937", fontSize: 12, fontWeight: 700, cursor: busy || !prompt.trim() ? "not-allowed" : "pointer",
          opacity: busy || !prompt.trim() ? 0.55 : 1,
        }}><Send size={14} /> Generate proposal</button>
      </form>
    </aside>
  );
}