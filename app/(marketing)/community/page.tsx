"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import {
  MessageSquare, ThumbsUp, Plus, X, Search, Loader2,
  ChevronUp, Clock, TrendingUp, Users, CheckCircle2, Pin,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Post {
  id: string;
  title: string;
  body: string;
  category: string;
  user_name: string;
  upvotes: number;
  reply_count: number;
  created_at: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "all",       label: "All Posts",    color: "#6366f1", bg: "#eef2ff" },
  { id: "F-1",       label: "F-1 Student",  color: "#2563eb", bg: "#eff6ff" },
  { id: "OPT",       label: "OPT / STEM",   color: "#7c3aed", bg: "#f5f3ff" },
  { id: "H-1B",      label: "H-1B",         color: "#059669", bg: "#ecfdf5" },
  { id: "Green Card",label: "Green Card",   color: "#b45309", bg: "#fffbeb" },
  { id: "General",   label: "General",      color: "#64748b", bg: "#f8fafc" },
];

const PINNED: Post[] = [
  {
    id: "pin-1",
    title: "Welcome to the VisaPilot Community — Read First",
    body: "This is a peer support space for international students and immigrants. Share experiences, ask questions, and help others navigate the US immigration system. Please be respectful and remember that answers here are not legal advice.",
    category: "General",
    user_name: "VisaPilot Team",
    upvotes: 248,
    reply_count: 12,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return `${Math.floor(d / 30)}mo ago`;
}

function catFor(id: string) {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1];
}

// ─── Post Card ────────────────────────────────────────────────────────────────
function PostCard({
  post, pinned = false, onUpvote,
}: { post: Post; pinned?: boolean; onUpvote?: (id: string) => void }) {
  const cat = catFor(post.category);
  return (
    <div
      className="bg-white rounded-xl border p-5 transition-shadow hover:shadow-md"
      style={{ borderColor: pinned ? cat.color + "60" : "#e2e8f0", background: pinned ? cat.bg + "88" : "white" }}
    >
      {pinned && (
        <div className="flex items-center gap-1 text-[11px] font-semibold mb-2" style={{ color: cat.color }}>
          <Pin className="h-3 w-3" /> Pinned
        </div>
      )}
      <div className="flex items-start gap-4">
        {/* Upvote col */}
        <div className="flex flex-col items-center gap-1 pt-0.5 min-w-[36px]">
          <button
            onClick={() => onUpvote?.(post.id)}
            className="flex flex-col items-center gap-0.5 group"
            disabled={pinned}
          >
            <ChevronUp className="h-5 w-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            <span className="text-[13px] font-bold text-slate-700">{post.upvotes}</span>
          </button>
        </div>
        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-800 text-[15px] leading-snug mb-1">{post.title}</h3>
          <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">{post.body}</p>
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <span
              className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
              style={{ color: cat.color, background: cat.bg }}
            >
              {post.category}
            </span>
            <span className="text-[12px] text-slate-400">by {post.user_name}</span>
            <span className="text-[12px] text-slate-400 flex items-center gap-1">
              <Clock className="h-3 w-3" /> {timeAgo(post.created_at)}
            </span>
            <span className="text-[12px] text-slate-400 flex items-center gap-1">
              <MessageSquare className="h-3 w-3" /> {post.reply_count} replies
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Ask Modal ────────────────────────────────────────────────────────────────
function AskModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (p: Partial<Post>) => Promise<void> }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("General");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!title.trim() || !body.trim()) { setError("Please fill in all fields."); return; }
    setSubmitting(true); setError("");
    try {
      await onSubmit({ title, body, category });
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to post. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-800">Ask the Community</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.filter((c) => c.id !== "all").map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className="text-[12px] font-semibold px-3 py-1.5 rounded-full border transition-all"
                  style={
                    category === c.id
                      ? { color: c.color, background: c.bg, borderColor: c.color }
                      : { color: "#64748b", background: "#f8fafc", borderColor: "#e2e8f0" }
                  }
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What do you want to ask?"
              className="w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-200"
              maxLength={200}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Details</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Describe your situation in detail…"
              rows={5}
              className="w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-200 resize-none"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60 transition-colors"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              Post Question
            </button>
            <button onClick={onClose} className="px-4 py-2.5 border rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors border-slate-200">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CommunityPage() {
  const { isSignedIn } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<"new" | "top">("new");
  const [search, setSearch] = useState("");
  const [showAsk, setShowAsk] = useState(false);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ category, sort });
      const res = await fetch(`/api/community?${params}`);
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [category, sort]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  async function handlePost(partial: Partial<Post>) {
    const res = await fetch("/api/community", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(partial),
    });
    if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
    await fetchPosts();
  }

  async function handleUpvote(id: string) {
    if (!isSignedIn) { setShowAsk(true); return; }
    await fetch("/api/community", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setPosts((prev) => prev.map((p) => p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p));
  }

  const visible = posts.filter((p) =>
    !search.trim() ||
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.body.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white">
        <div className="max-w-5xl mx-auto px-4 py-14 md:py-20">
          <div className="flex items-center gap-2 text-indigo-200 text-sm font-medium mb-4">
            <Users className="h-4 w-4" /> Community
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">VisaPilot Community</h1>
          <p className="text-indigo-200 text-lg max-w-xl mb-8">
            Ask questions, share experiences, and help fellow international students navigate US immigration.
          </p>
          {/* Stats */}
          <div className="flex flex-wrap gap-6">
            {[
              { icon: Users, label: "Members", value: "2,400+" },
              { icon: MessageSquare, label: "Questions", value: "1,800+" },
              { icon: ThumbsUp, label: "Helpful votes", value: "12k+" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-indigo-300" />
                <span className="text-white font-semibold">{value}</span>
                <span className="text-indigo-300 text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions…"
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSort("new")}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors"
              style={sort === "new" ? { background: "#eef2ff", color: "#4f46e5", borderColor: "#c7d2fe" } : { background: "white", color: "#64748b", borderColor: "#e2e8f0" }}
            >
              <Clock className="h-3.5 w-3.5" /> New
            </button>
            <button
              onClick={() => setSort("top")}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors"
              style={sort === "top" ? { background: "#eef2ff", color: "#4f46e5", borderColor: "#c7d2fe" } : { background: "white", color: "#64748b", borderColor: "#e2e8f0" }}
            >
              <TrendingUp className="h-3.5 w-3.5" /> Top
            </button>
            {isSignedIn && (
              <button
                onClick={() => setShowAsk(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                <Plus className="h-4 w-4" /> Ask
              </button>
            )}
          </div>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className="text-[12px] font-semibold px-3 py-1.5 rounded-full border transition-all"
              style={
                category === c.id
                  ? { color: c.color, background: c.bg, borderColor: c.color }
                  : { color: "#64748b", background: "white", borderColor: "#e2e8f0" }
              }
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Feed */}
          <div className="lg:col-span-2 space-y-3">
            {/* Pinned */}
            {(category === "all" || category === "General") && !search && (
              <PostCard post={PINNED[0]} pinned />
            )}

            {loading && (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
              </div>
            )}

            {!loading && visible.length === 0 && (
              <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
                <MessageSquare className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No posts yet in this category.</p>
                <p className="text-slate-400 text-sm mt-1">Be the first to ask a question!</p>
                {isSignedIn && (
                  <button
                    onClick={() => setShowAsk(true)}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" /> Ask a Question
                  </button>
                )}
              </div>
            )}

            {!loading && visible.map((p) => (
              <PostCard key={p.id} post={p} onUpvote={handleUpvote} />
            ))}

            {!isSignedIn && (
              <div className="text-center py-6 bg-indigo-50 rounded-xl border border-indigo-100 mt-4">
                <p className="text-indigo-700 font-medium text-sm">Sign in to ask questions and vote</p>
                <a href="/sign-in" className="inline-block mt-2 text-sm font-semibold text-indigo-600 underline underline-offset-2">
                  Sign in free →
                </a>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Guidelines */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-800 mb-3 text-sm">Community Guidelines</h3>
              <ul className="space-y-2">
                {[
                  "Be respectful and supportive",
                  "No legal advice — share experiences only",
                  "Search before posting duplicates",
                  "Add your visa type for context",
                  "Mark helpful answers with an upvote",
                ].map((g) => (
                  <li key={g} className="flex items-start gap-2 text-[13px] text-slate-600">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                    {g}
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular categories */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-800 mb-3 text-sm">Browse by Topic</h3>
              <div className="space-y-1.5">
                {CATEGORIES.filter((c) => c.id !== "all").map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCategory(c.id)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors text-left"
                    style={category === c.id ? { background: c.bg, color: c.color } : { color: "#475569" }}
                  >
                    <span className="font-medium">{c.label}</span>
                    <span className="text-xs" style={{ color: c.color }}>→</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
              <p className="text-[12px] text-amber-700 leading-relaxed">
                <strong>Disclaimer:</strong> Posts here are personal experiences and opinions, not legal advice.
                For legal matters, consult a qualified immigration attorney.
              </p>
            </div>
          </div>
        </div>
      </div>

      {showAsk && isSignedIn && (
        <AskModal onClose={() => setShowAsk(false)} onSubmit={handlePost} />
      )}
    </div>
  );
}
