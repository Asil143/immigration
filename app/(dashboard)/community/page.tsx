"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Search, Plus, MessageSquare, ThumbsUp, Pin, CheckCircle2,
  TrendingUp, Clock, Flame, Users, ChevronRight,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const CATEGORIES = [
  { id: "all", label: "All Posts", icon: "💬" },
  { id: "f1-students", label: "F-1 Students", icon: "🎓" },
  { id: "opt-stem-opt", label: "OPT / STEM OPT", icon: "💼" },
  { id: "h1b-work-visa", label: "H-1B Work Visa", icon: "🏢" },
  { id: "green-card", label: "Green Card", icon: "🌿" },
  { id: "success-stories", label: "Success Stories", icon: "🎉" },
  { id: "lawyer-ama", label: "Attorney AMAs", icon: "⚖️" },
];

const MOCK_POSTS = [
  {
    id: "1", category: "opt-stem-opt",
    title: "Just got my EAD card after 4 months — tips for those waiting",
    body: "After 4 months of anxiety, my EAD finally arrived! Here's what I learned...",
    author: { name: "Priya S.", visa: "OPT", initials: "PS" },
    upvotes: 142, replies: 38, is_answered: true, is_pinned: false,
    tags: ["OPT", "EAD", "Success"],
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2", category: "h1b-work-visa",
    title: "H-1B Transfer during RFE — is it safe? Attorney answers inside",
    body: "I got an RFE on my pending H-1B and I'm thinking of changing employers. Verified attorney weighs in...",
    author: { name: "Atty. James R.", visa: "Attorney", initials: "JR" },
    upvotes: 89, replies: 22, is_answered: true, is_pinned: true,
    tags: ["H-1B", "RFE", "Transfer", "Legal"],
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3", category: "f1-students",
    title: "Can I work on campus more than 20 hrs/week during finals week?",
    body: "My employer wants me to work extra hours during finals. I've heard conflicting things about this...",
    author: { name: "Wei C.", visa: "F-1", initials: "WC" },
    upvotes: 54, replies: 15, is_answered: true, is_pinned: false,
    tags: ["F-1", "On-campus work", "USCIS rules"],
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4", category: "green-card",
    title: "EB-2 NIW approved in 8 months — my complete timeline and strategy",
    body: "I just got my I-140 approved for EB-2 NIW! Here's everything I did, including the petition letters...",
    author: { name: "Fatima A.", visa: "EB-2 NIW", initials: "FA" },
    upvotes: 231, replies: 67, is_answered: false, is_pinned: false,
    tags: ["EB-2", "NIW", "Success Story", "I-140"],
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5", category: "opt-stem-opt",
    title: "STEM OPT employer changed — how do I update my I-983?",
    body: "My startup was acquired and technically I have a new employer. What steps do I need to take for my STEM OPT?",
    author: { name: "Carlos M.", visa: "STEM OPT", initials: "CM" },
    upvotes: 33, replies: 9, is_answered: false, is_pinned: false,
    tags: ["STEM OPT", "Employer Change", "I-983"],
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "6", category: "success-stories",
    title: "From F-1 to Green Card in 4 years — my complete journey",
    body: "I came to the US on F-1 in 2019. Today I'm a permanent resident. Here's the full story...",
    author: { name: "Yuna K.", visa: "Green Card", initials: "YK" },
    upvotes: 387, replies: 112, is_answered: false, is_pinned: false,
    tags: ["Success Story", "F-1", "H-1B", "Green Card"],
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default function CommunityPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sort, setSort] = useState("hot");
  const [newPostOpen, setNewPostOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", body: "", category: "", tags: "" });

  const filtered = MOCK_POSTS
    .filter(p => activeCategory === "all" || p.category === activeCategory)
    .filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(search.toLowerCase())))
    .sort((a, b) => {
      if (sort === "hot") return b.upvotes - a.upvotes;
      if (sort === "new") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return b.replies - a.replies;
    });

  const stats = [
    { label: "Members", value: "48,200+", icon: Users },
    { label: "Posts", value: "12,400+", icon: MessageSquare },
    { label: "Answered", value: "9,800+", icon: CheckCircle2 },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Community</h1>
          <p className="mt-1 text-muted-foreground">Ask questions, share experiences, find support</p>
        </div>
        <Button onClick={() => setNewPostOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Post
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardContent className="flex items-center gap-3 p-4">
                <Icon className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex gap-6">
        {/* Sidebar categories */}
        <div className="hidden lg:block w-52 shrink-0">
          <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wide mb-3">Categories</p>
          <div className="space-y-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors text-left ${
                  activeCategory === cat.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* AMA Banner */}
          <div className="mt-6 rounded-lg bg-gradient-to-br from-purple-600 to-primary p-4 text-white">
            <p className="font-semibold text-sm">⚖️ Live AMA</p>
            <p className="text-xs mt-1 text-white/80">Attorney AMA: H-1B layoffs & grace period — Tonight 8PM ET</p>
            <Button variant="secondary" size="sm" className="mt-3 w-full text-xs h-7">Join Now</Button>
          </div>
        </div>

        {/* Main feed */}
        <div className="flex-1 min-w-0">
          {/* Search + Sort */}
          <div className="flex gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search posts..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hot"><span className="flex items-center gap-2"><Flame className="h-4 w-4" />Hot</span></SelectItem>
                <SelectItem value="new"><span className="flex items-center gap-2"><Clock className="h-4 w-4" />New</span></SelectItem>
                <SelectItem value="top"><span className="flex items-center gap-2"><TrendingUp className="h-4 w-4" />Top</span></SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Posts */}
          <div className="space-y-3">
            {filtered.map(post => (
              <Card key={post.id} className="hover:shadow-md transition-shadow cursor-pointer group">
                <CardContent className="p-5">
                  <div className="flex gap-4">
                    {/* Vote column */}
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <button className="rounded p-1 hover:bg-accent">
                        <ThumbsUp className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </button>
                      <span className="text-sm font-semibold">{post.upvotes}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 flex-wrap">
                        {post.is_pinned && <Badge variant="secondary" className="text-xs"><Pin className="mr-1 h-3 w-3" />Pinned</Badge>}
                        {post.is_answered && <Badge variant="success" className="text-xs"><CheckCircle2 className="mr-1 h-3 w-3" />Answered</Badge>}
                        <Badge variant="outline" className="text-xs capitalize">{post.category.replace(/-/g," ")}</Badge>
                      </div>

                      <h3 className="font-semibold mt-1.5 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{post.body}</p>

                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Avatar className="h-5 w-5">
                            <AvatarFallback className="text-[10px]">{post.author.initials}</AvatarFallback>
                          </Avatar>
                          <span>{post.author.name}</span>
                          <Badge variant="info" className="text-[10px] px-1.5 py-0">{post.author.visa}</Badge>
                        </div>
                        <span>·</span>
                        <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" />{post.replies} replies</span>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {post.tags.map(t => (
                          <span key={t} className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">#{t}</span>
                        ))}
                      </div>
                    </div>

                    <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>No posts found. Be the first to post!</p>
            </div>
          )}
        </div>
      </div>

      {/* New Post Dialog */}
      <Dialog open={newPostOpen} onOpenChange={setNewPostOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={newPost.category} onValueChange={v => setNewPost(p => ({ ...p, category: v }))}>
                <SelectTrigger><SelectValue placeholder="Select a category..." /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.filter(c => c.id !== "all").map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.icon} {c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input placeholder="Write a clear, specific title..." value={newPost.title} onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Body</Label>
              <Textarea placeholder="Share your question or experience in detail..." value={newPost.body} onChange={e => setNewPost(p => ({ ...p, body: e.target.value }))} rows={5} className="resize-none" />
            </div>
            <div className="space-y-1.5">
              <Label>Tags (comma separated)</Label>
              <Input placeholder="e.g. OPT, EAD, USCIS" value={newPost.tags} onChange={e => setNewPost(p => ({ ...p, tags: e.target.value }))} />
            </div>
            <div className="rounded-lg bg-orange-50 border border-orange-200 p-3 text-xs text-orange-800">
              ⚠️ Do not share personal identifiers (passport numbers, SEVIS IDs, etc.) in public posts.
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewPostOpen(false)}>Cancel</Button>
            <Button disabled={!newPost.title || !newPost.body || !newPost.category} onClick={() => setNewPostOpen(false)}>Post</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
