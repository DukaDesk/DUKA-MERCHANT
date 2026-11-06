import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, X, Trash2, Pencil, EyeOff, Film, Heart, Share2, ShoppingBag, Sparkles, ArrowLeft, Upload, Loader2, Music2, Play, MessageCircle, Send } from "lucide-react";
import { toast } from "react-toastify";
import { useIsMobile } from "../../hooks/useMediaQuery";
import { getMerchantCurrency, formatMoney } from "../../utils/currency";
import { NAVY, AMBER, cardStyle, inputStyle, labelStyle, btnPrimary, btnSecondary, statCard, pageHeading, pageSubtitle, transition } from "../../theme";
import {
  getProducts, getFeedPosts, createFeedPost, updateFeedPost, deleteFeedPost, uploadMediaAsset,
  getAdminFeedTenants, getAdminFeedProducts, getAdminFeedQuota, getAdminFeedPosts,
  createAdminFeedPost, updateAdminFeedPost, deleteAdminFeedPost, uploadAdminFeedMedia,
  getFeedPostComments, createFeedPostComment, getAdminFeedPostComments, createAdminFeedPostComment,
} from "../../services/api";
import { usePermission } from "../../hooks/usePermission";
import { Loading, Empty, ErrorState } from "../layout/States";

// Mirrors the API media cap (see DUKA-BACKEND media.service.ts).
const MEDIA_MAX_BYTES = 50 * 1024 * 1024;
const MEDIA_MAX_ITEMS = 10;
export const CTA_MAX = 40;
export const CAPTION_MAX = 500;
const DEFAULT_CTA = "Buy Now";

const EMPTY_FORM = { caption: "", ctaLabel: DEFAULT_CTA, productId: "", media: [], music: null, status: "published" };

// Media count rules shared by the composer and validators:
// up to MEDIA_MAX_ITEMS items total, at most one video among them.
export function validateDraftMedia(media) {
  if (!media.length) return "Add a photo or pick a product to promote";
  if (media.length > MEDIA_MAX_ITEMS) return `Up to ${MEDIA_MAX_ITEMS} photos/videos per post`;
  if (media.filter(m => m.type === "video").length > 1) return "Only one video per post";
  return "";
}

export function validateDraftMusic(media, music) {
  if (!music) return "";
  if (media.some(item => item.type === "video")) return "Music can only be attached to image posts";
  if (!media.some(item => item.type === "image")) return "Add an image before attaching music";
  return "";
}

function firstFrame(media) {
  const frame = media.find(m => m.type === "image") || media[0];
  if (!frame?.url) return null;
  return frame.type === "video" ? (frame.posterUrl || null) : frame.url;
}

export function engagementTotals(posts) {
  return posts.reduce((acc, p) => ({
    likes: acc.likes + (Number(p.likeCount) || 0),
    shares: acc.shares + (Number(p.shareCount) || 0),
    patronage: acc.patronage + (Number(p.patronageCount) || 0),
  }), { likes: 0, shares: 0, patronage: 0 });
}

export default function Promotions() {
  const isMobile = useIsMobile();
  const { role } = usePermission();
  const isPlatformAdmin = role === "super_admin" || role === "platform_operator";
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [products, setProducts] = useState([]);
  const [adminTenants, setAdminTenants] = useState([]);
  const [selectedTenantId, setSelectedTenantId] = useState("");
  const [quota, setQuota] = useState(null);
  const [state, setState] = useState("loading");
  const [currency, setCurrency] = useState("NGN");
  const [showCreate, setShowCreate] = useState(false);
  const [commentPost, setCommentPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState("");
  const [commentDraft, setCommentDraft] = useState("");
  const [commentSending, setCommentSending] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);
  const fileRef = useRef(null);
  const musicRef = useRef(null);
  // Keeps multi-file uploads order-stable across async awaits.
  const mediaRef = useRef([]);
  // Whether the user touched media in this composer session — gates the
  // automatic product-photo layout so it never fights a fresh upload.
  const uploadStarted = useRef(false);

  useEffect(() => { setCurrency(getMerchantCurrency()); }, []);

  const load = async (targetTenantId = selectedTenantId, knownTenants = adminTenants) => {
    setState("loading");
    try {
      if (isPlatformAdmin) {
        const tenants = knownTenants.length ? knownTenants : await getAdminFeedTenants();
        setAdminTenants(tenants);
        const tenantId = tenants.some(tenant => tenant.id === targetTenantId) ? targetTenantId : tenants[0]?.id || "";
        setSelectedTenantId(tenantId);
        if (!tenantId) {
          setPosts([]);
          setProducts([]);
          setQuota(null);
          setState("ready");
          return;
        }
        const [feedPosts, tenantProducts, tenantQuota] = await Promise.all([
          getAdminFeedPosts(tenantId),
          getAdminFeedProducts(tenantId),
          getAdminFeedQuota(tenantId).catch(() => null),
        ]);
        setPosts(feedPosts);
        setProducts(tenantProducts);
        setQuota(tenantQuota);
      } else {
        const [feedPosts, tenantProducts] = await Promise.all([getFeedPosts(), getProducts()]);
        setPosts(feedPosts);
        setProducts(tenantProducts);
        setQuota(null);
      }
      setState("ready");
    } catch {
      setState("error");
    }
  };

  useEffect(() => { load(); }, [isPlatformAdmin]);

  // "Promote this product" deep link from the product detail card.
  useEffect(() => {
    const productId = params.get("product");
    if (!productId) return;
    setForm(f => ({ ...f, productId }));
    setShowCreate(true);
  }, [params]);

  // Auto layout: picking a product with no uploaded media fills the post
  // with the product's catalogue photos.
  useEffect(() => {
    if (!form.productId || form.media.length > 0 || uploadStarted.current) return;
    const product = products.find(p => p.id === form.productId);
    const auto = (product?.images || []).slice(0, MEDIA_MAX_ITEMS).map(url => ({ url, type: "image" }));
    if (auto.length) setForm(f => ({ ...f, media: auto }));
  }, [form.productId, form.media.length, products]);

  const syncMedia = (next) => { mediaRef.current = next; setForm(f => ({ ...f, media: next })); };

  const openCreate = () => { uploadStarted.current = false; setForm({ ...EMPTY_FORM }); setShowCreate(true); };

  const handleFiles = async (files) => {
    if (!files || !files.length) return;
    const room = MEDIA_MAX_ITEMS - mediaRef.current.length;
    if (room <= 0) { toast.error(`Up to ${MEDIA_MAX_ITEMS} photos/videos per post`); return; }
    uploadStarted.current = true;
    const accepted = Array.from(files).slice(0, room);
    for (const file of accepted) {
      if (file.size > MEDIA_MAX_BYTES) { toast.error(`${file.name} is over the 50MB limit`); continue; }
      const type = file.type.startsWith("video") ? "video" : "image";
      if (type === "video" && mediaRef.current.filter(m => m.type === "video").length >= 1) {
        toast.error("Only one video per post");
        continue;
      }
      const index = mediaRef.current.length;
      if (type === "video") setForm(current => ({ ...current, music: null }));
      syncMedia([...mediaRef.current, { url: "", type, name: file.name }]);
      setUploadingCount(c => c + 1);
      try {
        const asset = isPlatformAdmin
          ? await uploadAdminFeedMedia(selectedTenantId, file)
          : await uploadMediaAsset(file, { purpose: "feed", alt: "Promo post media" });
        const url = asset?.url;
        if (!url) throw new Error("Upload returned no URL");
        syncMedia(mediaRef.current.map((m, i) => (i === index ? { url, type, mediaId: asset.id } : m)));
      } catch (error) {
        toast.error(`${file.name} upload failed — ${error?.message || "try another file"}`);
        syncMedia(mediaRef.current.filter((_, i) => i !== index));
      } finally {
        setUploadingCount(c => c - 1);
      }
    }
  };

  const handleMusicFile = async (file) => {
    if (!file) return;
    const supportedAudio = ["audio/mpeg", "audio/wav", "audio/x-wav"].includes(file.type) || /\.(mp3|wav)$/i.test(file.name);
    if (!supportedAudio) { toast.error("Choose an MP3 or WAV file"); return; }
    if (file.size > MEDIA_MAX_BYTES) { toast.error("Music file is over the 50MB limit"); return; }
    if (mediaRef.current.some(item => item.type === "video")) { toast.error("Music can only be attached to image posts"); return; }
    setUploadingCount(count => count + 1);
    try {
      const asset = isPlatformAdmin
        ? await uploadAdminFeedMedia(selectedTenantId, file)
        : await uploadMediaAsset(file, { purpose: "feed-music", alt: file.name });
      if (!asset?.url) throw new Error("Upload returned no URL");
      setForm(current => ({ ...current, music: { mediaId: asset.id, url: asset.url, title: file.name } }));
    } catch (error) {
      toast.error(`${file.name} upload failed — ${error?.message || "try another file"}`);
    } finally {
      setUploadingCount(count => count - 1);
    }
  };

  const save = async () => {
    if (isPlatformAdmin && !selectedTenantId) { toast.error("Choose a merchant before posting"); return; }
    const media = form.media.filter(m => m.url);
    const mediaError = validateDraftMedia(media);
    if (mediaError) { toast.error(mediaError); return; }
    const musicError = validateDraftMusic(media, form.music);
    if (musicError) { toast.error(musicError); return; }
    if (form.ctaLabel.trim().length > CTA_MAX) { toast.error(`Button label must be ${CTA_MAX} characters or less`); return; }
    if ((form.caption || "").length > CAPTION_MAX) { toast.error(`Caption must be ${CAPTION_MAX} characters or less`); return; }
    if (uploadingCount > 0) { toast.info("Wait for the uploads to finish"); return; }
    const productName = products.find(p => p.id === form.productId)?.name ?? "";
    const caption = !editing && !form.caption.trim() && form.productId ? `${productName} is live` : form.caption;
    const postData = { ...form, caption, media };
    setSaving(true);
    try {
      if (editing) {
        if (isPlatformAdmin) await updateAdminFeedPost(selectedTenantId, editing.id, postData);
        else await updateFeedPost(editing.id, postData);
        toast.success("Promo post updated!");
      } else {
        if (isPlatformAdmin) await createAdminFeedPost(selectedTenantId, postData);
        else await createFeedPost(postData);
        toast.success("Your promo is live in the Feed!");
      }
      setShowCreate(false);
      setEditing(null);
      setForm({ ...EMPTY_FORM });
      await load();
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || "";
      toast.error(message ? String(message) : "Failed to save promo post");
    } finally {
      setSaving(false);
    }
  };

  const retire = async (post) => {
    try {
      const payload = { ...post, status: post.status === "published" ? "retired" : "published" };
      if (isPlatformAdmin) await updateAdminFeedPost(selectedTenantId, post.id, payload);
      else await updateFeedPost(post.id, payload);
      toast.success(post.status === "published" ? "Promo hidden from the Feed" : "Promo is live again");
      await load();
    } catch {
      toast.error("Failed to update promo post");
    }
  };

  const remove = async (post) => {
    try {
      if (isPlatformAdmin) await deleteAdminFeedPost(selectedTenantId, post.id);
      else await deleteFeedPost(post.id);
      setPosts(prev => prev.filter(p => p.id !== post.id));
      toast.info("Promo post deleted");
    } catch {
      toast.error("Failed to delete promo post");
    }
  };

  const openComments = async (post) => {
    setCommentPost(post);
    setComments([]);
    setCommentsError("");
    setCommentDraft("");
    setCommentsLoading(true);
    try {
      const thread = isPlatformAdmin
        ? await getAdminFeedPostComments(selectedTenantId, post.id)
        : await getFeedPostComments(post.id);
      setComments(thread);
    } catch (error) {
      setCommentsError(error?.message || "Could not load comments");
    } finally {
      setCommentsLoading(false);
    }
  };

  const submitComment = async () => {
    const body = commentDraft.trim();
    if (!commentPost || !body || commentSending) return;
    setCommentSending(true);
    setCommentsError("");
    try {
      const created = isPlatformAdmin
        ? await createAdminFeedPostComment(selectedTenantId, commentPost.id, body)
        : await createFeedPostComment(commentPost.id, body);
      setComments(current => [...current, created]);
      setCommentDraft("");
      setPosts(current => current.map(post => post.id === commentPost.id ? { ...post, commentCount: (post.commentCount || 0) + 1 } : post));
      setCommentPost(current => current ? { ...current, commentCount: (current.commentCount || 0) + 1 } : current);
    } catch (error) {
      setCommentsError(error?.message || "Could not post your comment");
    } finally {
      setCommentSending(false);
    }
  };

  const openEdit = (post) => {
    uploadStarted.current = true;
    setEditing(post);
    setForm({
      caption: post.caption || "",
      ctaLabel: post.ctaLabel || DEFAULT_CTA,
      productId: post.productId || "",
      media: post.media.map(m => ({ url: m.url, type: m.type, posterUrl: m.posterUrl || undefined })),
      music: post.music || null,
      status: post.status,
    });
    setShowCreate(true);
  };

  const totals = engagementTotals(posts);
  const media = form.media.filter(m => m.url);
  const mediaError = media.length ? validateDraftMedia(media) : null;
  const musicError = validateDraftMusic(media, form.music);
  const productsById = Object.fromEntries(products.map(p => [p.id, p]));
  const selectedTenant = adminTenants.find(tenant => tenant.id === selectedTenantId);
  const busy = saving || uploadingCount > 0;

  return (
    <div style={{ animation: "fadeIn 0.35s ease" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 4 }}>
        <div>
          <button onClick={() => navigate("/dashboard")} style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 14, marginBottom: 8, padding: 0 }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          <h2 style={pageHeading}>Promotions</h2>
          <p style={pageSubtitle}>Sparkle your products in the Feed — shoppers see posts from your live app</p>
        </div>
        <button onClick={openCreate} disabled={isPlatformAdmin && !selectedTenantId} style={{ ...btnPrimary, opacity: isPlatformAdmin && !selectedTenantId ? 0.6 : 1 }}>
          <Sparkles size={16} /> New Promo Post
        </button>
      </div>

      {isPlatformAdmin && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
          <label style={{ ...labelStyle, margin: 0 }}>Merchant
            <select value={selectedTenantId} onChange={event => {
              const tenantId = event.target.value;
              setSelectedTenantId(tenantId);
              setEditing(null);
              setForm({ ...EMPTY_FORM });
              void load(tenantId, adminTenants);
            }} disabled={showCreate} style={{ ...inputStyle, marginLeft: 10, width: isMobile ? "100%" : 320 }}>
              {adminTenants.length === 0 && <option value="">No published merchants</option>}
              {adminTenants.map(tenant => <option key={tenant.id} value={tenant.id}>{tenant.name} ({tenant.slug})</option>)}
            </select>
          </label>
          {quota && <span style={{ fontSize: 12, color: "#6B7280" }}>{quota.remaining ?? "Unlimited"} posts remaining today</span>}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 12, margin: "20px 0 24px" }}>
        <div style={statCard}>
          <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 600 }}>Live Posts</div>
          <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 26, color: NAVY }}>{posts.filter(p => p.status === "published").length}</div>
        </div>
        <div style={statCard}>
          <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 600 }}>Likes</div>
          <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 26, color: "#EC4899" }}>{totals.likes}</div>
        </div>
        <div style={statCard}>
          <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 600 }}>Shares</div>
          <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 26, color: AMBER }}>{totals.shares}</div>
        </div>
        <div style={statCard}>
          <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 600 }}>Button Taps</div>
          <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 26, color: "#0D9488" }}>{totals.patronage}</div>
        </div>
      </div>

      {state === "loading" && <Loading message="Loading your promos..." />}
      {state === "error" && <ErrorState onRetry={load} />}
      {state === "ready" && posts.length === 0 && (
        <Empty
          icon={Sparkles}
          message="No promo posts yet"
          sub="Post photos, a short video or promote a product — shoppers see it in the Feed tab of your app and in Explore."
          action={<button onClick={openCreate} disabled={isPlatformAdmin && !selectedTenantId} style={{ ...btnPrimary, opacity: isPlatformAdmin && !selectedTenantId ? 0.6 : 1 }}><Sparkles size={16} /> Sparkle a product</button>}
        />
      )}
      {state === "ready" && posts.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 16 }}>
          {posts.map((post) => {
            const frame = firstFrame(post.media);
            const retired = post.status !== "published";
            const product = post.productId ? productsById[post.productId] || null : null;
            return (
              <div key={post.id} style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
                <div style={{ height: 150, background: "#F9FAFB", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {frame ? (
                    <img src={frame} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><Film size={36} strokeWidth={1.5} color="#9CA3AF" /></div>
                  )}
                  {post.media.some(m => m.type === "video") && (
                    <span style={{ position: "absolute", top: 10, left: 10, background: "rgba(0,0,0,0.6)", color: "#fff", borderRadius: 8, padding: "3px 8px", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}><Film size={11} /> Video</span>
                  )}
                  {retired && (
                    <span style={{ position: "absolute", top: 10, right: 10, background: "#F3F4F6", color: "#6B7280", borderRadius: 8, padding: "3px 8px", fontSize: 11, fontWeight: 700 }}>Hidden</span>
                  )}
                </div>
                <div style={{ padding: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: NAVY, marginBottom: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{post.caption || "(no caption)"}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                    {product ? (
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#065F46", background: "#F0FDF4", padding: "3px 10px", borderRadius: 8, display: "flex", alignItems: "center", gap: 6 }}>
                        <ShoppingBag size={12} /> {product.name}
                      </span>
                    ) : (
                      <span style={{ fontSize: 12, color: "#9CA3AF", padding: "3px 0" }}>Brand post</span>
                    )}
                    <span style={{ fontSize: 12, color: NAVY, background: "#FFF8ED", padding: "3px 10px", borderRadius: 8, fontWeight: 600 }}>{post.ctaLabel}</span>
                    {product ? <span style={{ fontSize: 12, color: "#6B7280" }}>{formatMoney(product.price, currency)}</span> : null}
                  </div>
                  <div style={{ display: "flex", gap: 14, marginBottom: 14, fontSize: 12, color: "#6B7280" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Heart size={12} color="#EC4899" /> {post.likeCount}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Share2 size={12} color={AMBER} /> {post.shareCount}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><ShoppingBag size={12} color="#0D9488" /> {post.patronageCount}</span>
                    <button onClick={() => void openComments(post)} title="View and reply to comments" style={{ display: "flex", alignItems: "center", gap: 4, padding: 0, border: 0, background: "none", color: "#6B7280", cursor: "pointer", fontSize: 12 }}><MessageCircle size={13} /> {post.commentCount || 0}</button>
                    <button onClick={() => void openComments(post)} title="View and reply to comments" style={{ display: "flex", alignItems: "center", gap: 4, padding: 0, border: 0, background: "none", color: "#6B7280", cursor: "pointer", fontSize: 12 }}><MessageCircle size={13} /> {post.commentCount || 0}</button>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => openEdit(post)} style={{ flex: 1, border: "1px solid var(--border)", background: "#fff", borderRadius: 10, padding: "8px 0", fontSize: 13, fontWeight: 600, color: NAVY, cursor: "pointer", transition }}>
                      <Pencil size={13} style={{ verticalAlign: "-2px", marginRight: 6 }} />Edit
                    </button>
                    <button onClick={() => retire(post)} style={{ flex: 1, border: "1px solid var(--border)", background: "#fff", borderRadius: 10, padding: "8px 0", fontSize: 13, fontWeight: 600, color: retired ? "#065F46" : "#6B7280", cursor: "pointer", transition }}>
                      <EyeOff size={13} style={{ verticalAlign: "-2px", marginRight: 6 }} />{retired ? "Publish" : "Hide"}
                    </button>
                    <button onClick={() => remove(post)} title="Delete promo post" style={{ width: 40, border: "1px solid #FECACA", background: "#FEF2F2", borderRadius: 10, color: "#E74C3C", cursor: "pointer" }}>
                      <Trash2 size={14} style={{ verticalAlign: "-2px" }} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showCreate && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(15,15,26,0.5)", animation: "fadeIn 0.2s ease", padding: isMobile ? 12 : 0 }} onClick={() => { if (!busy) { setShowCreate(false); setEditing(null); } }}>
          <div style={{ ...cardStyle, width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto", animation: "fadeScaleIn 0.3s ease" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 18, color: NAVY, margin: 0 }}>{editing ? "Edit Promo Post" : "New Promo Post"}</h3>
              <button onClick={() => { if (!busy) { setShowCreate(false); setEditing(null); } }} style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer" }}><X size={18} /></button>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Promote a product (optional)</label>
              <select
                style={inputStyle}
                value={form.productId}
                onChange={(e) => {
                  const next = e.target.value;
                  uploadStarted.current = true;
                  setForm(f => ({ ...f, productId: next, media: f.media.every(m => !m.mediaId) ? [] : f.media }));
                }}
              >
                <option value="">No — brand post only</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name} — {formatMoney(p.price, currency)}</option>)}
              </select>
              <div style={{ fontSize: 12, color: "#6B7280", marginTop: 6 }}>
                The button on your post always opens this product in your app.
              </div>
            </div>

            <div style={{ marginBottom: 6 }}>
              <label style={labelStyle}>Photos / Video</label>
              <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 8 }}>
                Up to {MEDIA_MAX_ITEMS} photos or 1 video (50MB max). Likes stay anonymous to you.
              </div>
              {form.media.length > 0 && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                  {form.media.map((m, i) => (
                    <div key={i} style={{ position: "relative", width: 72, height: 72, borderRadius: 10, overflow: "hidden", border: "1px solid #E8E8F0", background: "#F9FAFB" }}>
                      {m.url ? (
                        m.type === "video" && !m.posterUrl ? (
                          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><Film size={22} color={NAVY} /></div>
                        ) : (
                          <img src={m.posterUrl || m.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        )
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><Loader2 size={18} color={AMBER} /></div>
                      )}
                      <button onClick={() => syncMedia(mediaRef.current.filter((_, j) => j !== i))} title="Remove media" style={{ position: "absolute", top: 2, right: 2, width: 20, height: 20, borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.6)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <X size={11} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {form.media.length < MEDIA_MAX_ITEMS && (
                <button onClick={() => fileRef.current?.click()} style={{ ...btnSecondary, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <Upload size={15} /> {form.media.length > 0 ? "Add another photo / video" : "Add photos or a video"}
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*,video/*" multiple style={{ display: "none" }} onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }} />
              {mediaError && (
                <div style={{ fontSize: 12, color: "#991B1B", background: "#FEF2F2", padding: "6px 10px", borderRadius: 8, marginTop: 8 }}>{mediaError}</div>
              )}
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Music for image posts (optional)</label>
              <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 8 }}>Add an MP3 or WAV track. Music is available on image posts only.</div>
              {form.music ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <Music2 size={16} color={AMBER} />
                  <span style={{ flex: 1, minWidth: 120, fontSize: 12, color: NAVY, overflow: "hidden", textOverflow: "ellipsis" }}>{form.music.title || "Attached music"}</span>
                  <audio controls src={form.music.url} style={{ maxWidth: "100%", height: 36 }} />
                  <button type="button" title="Remove music" onClick={() => setForm(current => ({ ...current, music: null }))} style={{ border: "1px solid #E8E8F0", background: "#fff", borderRadius: 8, padding: 7, cursor: "pointer" }}><X size={14} /></button>
                </div>
              ) : (
                <button type="button" disabled={form.media.some(item => item.type === "video")} onClick={() => musicRef.current?.click()} style={{ ...btnSecondary, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: form.media.some(item => item.type === "video") ? 0.55 : 1 }}>
                  <Music2 size={15} /> Choose music file
                </button>
              )}
              <input ref={musicRef} type="file" accept="audio/mpeg,audio/wav,.mp3,.wav" style={{ display: "none" }} onChange={event => { handleMusicFile(event.target.files?.[0]); event.target.value = ""; }} />
              {musicError && <div style={{ fontSize: 12, color: "#991B1B", background: "#FEF2F2", padding: "6px 10px", borderRadius: 8, marginTop: 8 }}>{musicError}</div>}
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Caption</label>
              <textarea
                style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
                maxLength={CAPTION_MAX}
                value={form.caption}
                onChange={e => setForm(f => ({ ...f, caption: e.target.value }))}
                placeholder="Get yours while stock lasts — preorder today!"
              />
              <div style={{ fontSize: 11, color: "#9CA3AF", textAlign: "right", marginTop: 2 }}>{(form.caption || "").length}/{CAPTION_MAX}</div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Button label</label>
              <input
                style={inputStyle}
                maxLength={CTA_MAX}
                value={form.ctaLabel}
                onChange={e => setForm(f => ({ ...f, ctaLabel: e.target.value }))}
                placeholder={DEFAULT_CTA}
              />
            </div>

            <div style={{ maxWidth: 400, margin: "0 auto 20px", border: "1px solid #E8E8F0", borderRadius: 12, overflow: "hidden", background: "#fff" }}>
              <div style={{ padding: "10px 12px", display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 13, color: NAVY }}>
                <Sparkles size={15} color={AMBER} /> {selectedTenant?.name || "Your store"}
              </div>
              {media[0] && (media[0].type === "video" ? (
                <video src={media[0].url} poster={media[0].posterUrl} controls style={{ display: "block", width: "100%", maxHeight: 420, objectFit: "cover", background: "#111827" }} />
              ) : (
                <img src={media[0].url} alt="Promo post preview" style={{ display: "block", width: "100%", maxHeight: 420, objectFit: "cover" }} />
              ))}
              <div style={{ padding: 12 }}>
                <div style={{ fontSize: 13, color: NAVY, whiteSpace: "pre-wrap" }}>{form.caption || "Your caption will appear here."}</div>
                {form.music?.url && <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}><Music2 size={15} color={AMBER} /><span style={{ fontSize: 12, color: "#6B7280" }}>{form.music.title || "Music"}</span><audio controls src={form.music.url} style={{ flex: 1, minWidth: 0, height: 34 }} /></div>}
                {form.productId && productsById[form.productId] && <div style={{ fontSize: 12, color: "#065F46", marginTop: 8 }}>{productsById[form.productId].name} · {formatMoney(productsById[form.productId].price, currency)}</div>}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginTop: 12 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#6B7280" }}><Heart size={14} /> 0 <Share2 size={14} /> 0</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 6, background: AMBER, color: NAVY, borderRadius: 8, padding: "8px 12px", fontSize: 12, fontWeight: 700 }}><Play size={12} />{form.ctaLabel || DEFAULT_CTA}</span>
                </div>
                <button onClick={save} disabled={busy || (isPlatformAdmin && !selectedTenantId)} style={{ ...btnPrimary, width: "100%", marginTop: 14, opacity: busy ? 0.7 : 1 }}>
                  {saving ? "Posting…" : editing ? "Save Changes" : "Post to Feed"}
                </button>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button onClick={() => { setShowCreate(false); setEditing(null); }} disabled={busy} style={btnSecondary}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {commentPost && (
        <div onClick={() => setCommentPost(null)} style={{ position: "fixed", inset: 0, zIndex: 350, background: "rgba(15,15,26,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: isMobile ? 12 : 24 }}>
          <div onClick={event => event.stopPropagation()} style={{ ...cardStyle, width: "100%", maxWidth: 560, maxHeight: "88vh", display: "flex", flexDirection: "column", gap: 12, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 18, color: NAVY, margin: 0 }}>Comments</h3>
                <div style={{ fontSize: 12, color: "#6B7280", marginTop: 3 }}>{selectedTenant?.name || "Your store"} · {commentPost.caption || "Promo post"}</div>
              </div>
              <button onClick={() => setCommentPost(null)} aria-label="Close comments" style={{ border: 0, background: "none", color: "#6B7280", cursor: "pointer" }}><X size={20} /></button>
            </div>
            {commentsError ? <div role="alert" style={{ color: "#991B1B", background: "#FEF2F2", borderRadius: 8, padding: 10, fontSize: 13 }}>{commentsError}</div> : null}
            <div style={{ flex: 1, minHeight: 140, overflowY: "auto", borderTop: "1px solid #E8E8F0", borderBottom: "1px solid #E8E8F0", padding: "4px 0" }}>
              {commentsLoading ? <div style={{ padding: 20, textAlign: "center", color: "#6B7280" }}>Loading comments…</div> : comments.length === 0 ? <div style={{ padding: 20, textAlign: "center", color: "#6B7280", fontSize: 13 }}>No comments yet.</div> : comments.map(comment => (
                <div key={comment.id} style={{ display: "flex", gap: 10, padding: "12px 4px", borderBottom: "1px solid #F3F4F6" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 16, flexShrink: 0, display: "grid", placeItems: "center", background: comment.authorType === "customer" ? "#E5E7EB" : "#1A1A2E", color: comment.authorType === "customer" ? NAVY : "#fff" }}>
                    {comment.authorType === "customer" ? <span style={{ fontSize: 12, fontWeight: 700 }}>{(comment.authorName || "U").slice(0, 1).toUpperCase()}</span> : <Store size={15} />}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <strong style={{ fontSize: 13, color: NAVY }}>{comment.authorName}</strong>
                      {comment.authorType !== "customer" ? <span style={{ fontSize: 9, fontWeight: 800, color: "#8A5C00" }}>{comment.authorType === "platform" ? "DUKADESK" : "MERCHANT"}</span> : null}
                      <span style={{ fontSize: 10, color: "#9CA3AF" }}>{comment.createdAt ? new Date(comment.createdAt).toLocaleString() : ""}</span>
                    </div>
                    <div style={{ fontSize: 13, color: "#343036", marginTop: 4, whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{comment.body}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
              <textarea value={commentDraft} onChange={event => setCommentDraft(event.target.value.slice(0, 1000))} maxLength={1000} placeholder="Reply as the merchant…" style={{ ...inputStyle, minHeight: 64, maxHeight: 120, resize: "vertical", flex: 1 }} />
              <button onClick={() => void submitComment()} disabled={!commentDraft.trim() || commentSending} aria-label="Send comment" style={{ ...btnPrimary, height: 42, padding: "0 14px", opacity: !commentDraft.trim() || commentSending ? 0.6 : 1 }}>
                {commentSending ? <Loader2 size={16} /> : <Send size={16} />}
              </button>
            </div>
            <div style={{ fontSize: 10, color: "#9CA3AF", textAlign: "right" }}>{commentDraft.length}/1000</div>
          </div>
        </div>
      )}

      {commentPost && (
        <div onClick={() => setCommentPost(null)} style={{ position: "fixed", inset: 0, zIndex: 350, background: "rgba(15,15,26,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: isMobile ? 12 : 24 }}>
          <div onClick={event => event.stopPropagation()} style={{ ...cardStyle, width: "100%", maxWidth: 560, maxHeight: "88vh", display: "flex", flexDirection: "column", gap: 12, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 18, color: NAVY, margin: 0 }}>Comments</h3>
                <div style={{ fontSize: 12, color: "#6B7280", marginTop: 3 }}>{selectedTenant?.name || "Your store"} · {commentPost.caption || "Promo post"}</div>
              </div>
              <button onClick={() => setCommentPost(null)} aria-label="Close comments" style={{ border: 0, background: "none", color: "#6B7280", cursor: "pointer" }}><X size={20} /></button>
            </div>
            {commentsError ? <div role="alert" style={{ color: "#991B1B", background: "#FEF2F2", borderRadius: 8, padding: 10, fontSize: 13 }}>{commentsError}</div> : null}
            <div style={{ flex: 1, minHeight: 140, overflowY: "auto", borderTop: "1px solid #E8E8F0", borderBottom: "1px solid #E8E8F0", padding: "4px 0" }}>
              {commentsLoading ? <div style={{ padding: 20, textAlign: "center", color: "#6B7280" }}>Loading comments…</div> : comments.length === 0 ? <div style={{ padding: 20, textAlign: "center", color: "#6B7280", fontSize: 13 }}>No comments yet.</div> : comments.map(comment => (
                <div key={comment.id} style={{ display: "flex", gap: 10, padding: "12px 4px", borderBottom: "1px solid #F3F4F6" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 16, flexShrink: 0, display: "grid", placeItems: "center", background: comment.authorType === "customer" ? "#E5E7EB" : "#1A1A2E", color: comment.authorType === "customer" ? NAVY : "#fff" }}>
                    {comment.authorType === "customer" ? <span style={{ fontSize: 12, fontWeight: 700 }}>{(comment.authorName || "U").slice(0, 1).toUpperCase()}</span> : <Store size={15} />}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <strong style={{ fontSize: 13, color: NAVY }}>{comment.authorName}</strong>
                      {comment.authorType !== "customer" ? <span style={{ fontSize: 9, fontWeight: 800, color: "#8A5C00" }}>{comment.authorType === "platform" ? "DUKADESK" : "MERCHANT"}</span> : null}
                      <span style={{ fontSize: 10, color: "#9CA3AF" }}>{comment.createdAt ? new Date(comment.createdAt).toLocaleString() : ""}</span>
                    </div>
                    <div style={{ fontSize: 13, color: "#343036", marginTop: 4, whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{comment.body}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
              <textarea value={commentDraft} onChange={event => setCommentDraft(event.target.value.slice(0, 1000))} maxLength={1000} placeholder="Reply as the merchant…" style={{ ...inputStyle, minHeight: 64, maxHeight: 120, resize: "vertical", flex: 1 }} />
              <button onClick={() => void submitComment()} disabled={!commentDraft.trim() || commentSending} aria-label="Send comment" style={{ ...btnPrimary, height: 42, padding: "0 14px", opacity: !commentDraft.trim() || commentSending ? 0.6 : 1 }}>
                {commentSending ? <Loader2 size={16} /> : <Send size={16} />}
              </button>
            </div>
            <div style={{ fontSize: 10, color: "#9CA3AF", textAlign: "right" }}>{commentDraft.length}/1000</div>
          </div>
        </div>
      )}
    </div>
  );
}
