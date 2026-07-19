import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "../../hooks/useMediaQuery";
import { usePermission } from "../../hooks/usePermission";
import { useToast } from "../../contexts";
import { NAVY, AMBER, GREEN, RED, PURPLE, TEAL, cardStyle, inputStyle, labelStyle, btnPrimary, btnSecondary, pageHeading, pageSubtitle, statusBadge, transition } from "../../theme";
import { Users, Plus, Mail, X, User, Shield, MoreHorizontal, Check, Search, ArrowLeft } from "lucide-react";

const MOCK_TEAM = [
  { id: 1, name: "You", email: "merchant@example.com", role: "tenant_owner", status: "Active", joined: "Jun 2025", avatar: "Y" },
  { id: 2, name: "Amina Bello", email: "amina@example.com", role: "business_manager", status: "Active", joined: "Jul 2025", avatar: "A" },
  { id: 3, name: "Chidi Okafor", email: "chidi@example.com", role: "store_manager", status: "Active", joined: "Aug 2025", avatar: "C" },
  { id: 4, name: "Fatima Usman", email: "fatima@example.com", role: "sales_staff", status: "Inactive", joined: "Aug 2025", avatar: "F" },
];

const ROLE_OPTIONS = [
  { value: "tenant_owner", label: "Tenant Owner", color: AMBER },
  { value: "business_manager", label: "Business Manager", color: PURPLE },
  { value: "store_manager", label: "Store Manager", color: GREEN },
  { value: "sales_staff", label: "Sales Staff", color: "#3B82F6" },
  { value: "content_manager", label: "Content Manager", color: TEAL },
  { value: "member", label: "Member", color: "#6B7280" },
];

function getRoleLabel(role) {
  const r = ROLE_OPTIONS.find(o => o.value === role);
  return r ? r.label : role;
}

function getRoleColor(role) {
  const r = ROLE_OPTIONS.find(o => o.value === role);
  return r ? r.color : "#6B7280";
}

export default function Team() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const showToast = useToast();
  const { can } = usePermission();
  const [members, setMembers] = useState(MOCK_TEAM);
  const [showInvite, setShowInvite] = useState(false);
  const [search, setSearch] = useState("");
  const [inviteForm, setInviteForm] = useState({ email: "", role: "store_manager" });
  const [sending, setSending] = useState(false);

  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleInvite = async () => {
    if (!inviteForm.email.trim()) { showToast("Email is required", "error"); return; }
    setSending(true);
    await new Promise(r => setTimeout(r, 600));
    const newMember = {
      id: Date.now(),
      name: inviteForm.email.split("@")[0],
      email: inviteForm.email,
      role: inviteForm.role,
      status: "Active",
      joined: "Just now",
      avatar: inviteForm.email[0].toUpperCase(),
    };
    setMembers(prev => [...prev, newMember]);
    setSending(false);
    setShowInvite(false);
    setInviteForm({ email: "", role: "store_manager" });
    showToast(`Invitation sent to ${inviteForm.email}`, "success");
  };

  const handleRoleChange = (id, newRole) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, role: newRole } : m));
    showToast("Role updated", "success");
  };

  const handleRemove = (id) => {
    if (id === 1) { showToast("Cannot remove yourself", "error"); return; }
    setMembers(prev => prev.filter(m => m.id !== id));
    showToast("Member removed", "success");
  };

  return (
    <div style={{ animation: "fadeIn 0.35s ease" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4, flexWrap: "wrap", gap: 12 }}>
        <div>
          <button onClick={() => navigate("/dashboard")} style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 14, marginBottom: 8, padding: 0 }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          <h2 style={pageHeading}>Team</h2>
          <p style={pageSubtitle}>Manage your team members and their access roles</p>
        </div>
        <button onClick={() => setShowInvite(true)} style={btnPrimary}>
          <Plus size={16} /> Invite Member
        </button>
      </div>

      <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 360 }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
          <input style={{ ...inputStyle, paddingLeft: 36 }} placeholder="Search members..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
          {filtered.map((member, i) => (
            <div key={member.id} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "14px 20px",
              borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none",
              animation: `fadeIn 0.3s ease ${i * 0.05}s both`,
              transition,
            }}>
              <div style={{ width: 36, height: 36, background: `linear-gradient(135deg, ${getRoleColor(member.role)}, ${getRoleColor(member.role)}88)`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                {member.avatar}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: NAVY }}>{member.name} {member.id === 1 && <span style={{ fontSize: 11, color: AMBER, fontWeight: 700 }}>(You)</span>}</div>
                <div style={{ fontSize: 12, color: "#6B7280", display: "flex", alignItems: "center", gap: 8 }}>
                  <Mail size={11} /> {member.email}
                  <span style={{ color: "#9CA3AF" }}>·</span>
                  Joined {member.joined}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <select value={member.role} onChange={e => handleRoleChange(member.id, e.target.value)}
                  style={{
                    padding: "6px 10px", borderRadius: 6, border: `1.5px solid var(--border)`,
                    fontSize: 12, fontWeight: 600, color: getRoleColor(member.role),
                    background: `${getRoleColor(member.role)}11`,
                    cursor: "pointer", outline: "none",
                    ...(isMobile ? { maxWidth: 100 } : {}),
                  }}>
                  {ROLE_OPTIONS.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
                <div style={{
                  padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                  background: member.status === "Active" ? "#F0FDF4" : "#F3F4F6",
                  color: member.status === "Active" ? "#065F46" : "#6B7280",
                  whiteSpace: "nowrap",
                }}>
                  {member.status}
                </div>
                {member.id !== 1 && can("team:delete") && (
                  <button onClick={() => handleRemove(member.id)} style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer", padding: 4, borderRadius: 6, transition, display: isMobile ? "none" : "block" }}>
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: 40, textAlign: "center", color: "#9CA3AF" }}>
              <Users size={24} style={{ marginBottom: 8, opacity: 0.5 }} />
              <div style={{ fontSize: 14 }}>No members found</div>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", background: "#FFF8ED", borderRadius: 10, border: `1px solid ${AMBER}30` }}>
        <Shield size={16} color={AMBER} />
        <span style={{ fontSize: 13, color: "#92400E", flex: 1 }}>Only Tenant Owners can manage team members and roles.</span>
      </div>

      {showInvite && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(15,15,26,0.5)", animation: "fadeIn 0.2s ease" }} onClick={() => setShowInvite(false)}>
          <div style={{ ...cardStyle, width: "100%", maxWidth: 440, animation: "fadeScaleIn 0.3s ease" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 18, color: NAVY }}>Invite Team Member</h3>
              <button onClick={() => setShowInvite(false)} style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer", padding: 4 }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Email Address</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <Mail size={16} style={{ position: "absolute", left: 12, color: "#9CA3AF" }} />
                <input style={{ ...inputStyle, paddingLeft: 36 }} placeholder="colleague@example.com" value={inviteForm.email} onChange={e => setInviteForm(f => ({ ...f, email: e.target.value }))} />
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Role</label>
              <select style={inputStyle} value={inviteForm.role} onChange={e => setInviteForm(f => ({ ...f, role: e.target.value }))}>
                {ROLE_OPTIONS.filter(r => r.value !== "member").map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button onClick={() => setShowInvite(false)} style={btnSecondary}>Cancel</button>
              <button onClick={handleInvite} disabled={sending} style={{ ...btnPrimary, opacity: sending ? 0.7 : 1 }}>
                {sending ? "Sending..." : "Send Invite"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
