"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ThumbsUp, MessageCircle, Bookmark, Share2, Award, CheckCircle2, Flag } from "lucide-react";

const POST = {
  id: "1",
  title: "H-1B RFE for 'specialty occupation' — what evidence actually worked for me",
  category: "H-1B",
  author: "techpro_ny",
  authorBadge: "Verified Member",
  time: "2 days ago",
  upvotes: 142,
  views: 1840,
  body: `I just got my H-1B approved after an RFE for specialty occupation. Wanted to share exactly what worked because I couldn't find good firsthand info when I was going through it.

**My situation:**
- Software Engineer at a mid-size consulting firm
- RFE claimed my position didn't require a specific degree
- Had 90 days to respond

**What we included in the response:**

1. **A very detailed job description** — We rewrote the entire position description to emphasize the specific technical skills (distributed systems, ML pipeline design, cloud architecture) and why each requires a CS/engineering degree. The original description was too generic.

2. **OES/OOH data** — Pulled Bureau of Labor Statistics data showing that 87% of Software Developer roles require a bachelor's degree. This is public data — just cite it.

3. **Comparable job postings** — We collected 15 job postings from Google, Amazon, Microsoft, and other comparable companies. All required a BS in CS or related field. This was powerful.

4. **Expert opinion letter** — Our attorney arranged for an occupational expert to write a letter. Expensive ($800) but the attorney said it made the difference. The expert specifically analyzed our job duties and confirmed they align with a recognized specialty.

5. **My transcripts** — Full academic transcripts showing relevant coursework (algorithms, OS, systems programming) and how it maps to what I do daily.

**Timeline:**
- RFE received: March 10
- Submitted response: April 15
- Approval: May 22

Total cost including attorney fees and expert letter: ~$3,500 additional.

Happy to answer questions. Please consult an attorney — this worked for me but every case is different.`,
  tags: ["H-1B", "RFE", "Specialty Occupation", "Approval"],
};

const REPLIES = [
  {
    id: "1", author: "ilovemyf1", time: "2 days ago", upvotes: 34, isBest: true,
    text: "This is exactly what I needed. We're at the job posting collection step right now. Did you only use postings for the exact same job title, or did you include similar roles like 'Senior Software Engineer' and 'Software Developer'?",
  },
  {
    id: "2", author: "techpro_ny", time: "2 days ago", upvotes: 28, isBest: false,
    text: "@ilovemyf1 We used a mix — same title and closely related ones (SWE, SDE, Software Developer). The key was that ALL of them listed a CS/EE/related degree as required. Our attorney said it builds a picture that this is industry standard, not just one employer's quirk.",
  },
  {
    id: "3", author: "immigratemate", time: "1 day ago", upvotes: 19, isBest: false,
    text: "The expert opinion letter tip is gold. My attorney quoted $600–1,000 for one and I was hesitant but everyone who's gone through H-1B RFEs seems to say it's worth every penny.",
  },
  {
    id: "4", author: "h1b_hopeful_2026", time: "1 day ago", upvotes: 11, isBest: false,
    text: "Did you use a specific service center? I'm at California SC and heard their specialty occupation RFE rate is higher than Vermont.",
  },
  {
    id: "5", author: "techpro_ny", time: "22 hours ago", upvotes: 15, isBest: false,
    text: "@h1b_hopeful_2026 California SC here. The RFE rate is indeed higher. My attorney said CSC has been more aggressive since 2023. That's part of why the expert letter was important — they wanted a formal citation.",
  },
  {
    id: "6", author: "niw_navigator", time: "18 hours ago", upvotes: 8, isBest: false,
    text: "Saving this post. I have an I-140 RFE coming up for NIW and while the issues differ, the general approach (detailed evidence, external expert, comparable data) applies. Thank you for posting this.",
  },
];

export default function CommunityPostPage() {
  const [reply, setReply] = useState("");
  const [upvoted, setUpvoted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [votes, setVotes] = useState<Record<string, boolean>>({});
  const [localReplies, setLocalReplies] = useState(REPLIES);
  const [submitting, setSubmitting] = useState(false);

  function toggleVote(id: string) {
    setVotes(v => ({ ...v, [id]: !v[id] }));
  }

  function handleSubmitReply() {
    if (!reply.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      setLocalReplies(r => [
        ...r,
        { id: Date.now().toString(), author: "you", time: "Just now", upvotes: 0, isBest: false, text: reply },
      ]);
      setReply("");
      setSubmitting(false);
    }, 600);
  }

  return (
    <div className="p-8 max-w-3xl">
      <Link href="/community" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Community
      </Link>

      {/* Post */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary" className="text-xs">{POST.category}</Badge>
            {POST.tags.map(t => (
              <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
            ))}
          </div>

          <h1 className="text-xl font-bold leading-snug mb-3">{POST.title}</h1>

          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
              {POST.author[0].toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium">{POST.author}</span>
                <Badge variant="secondary" className="text-[10px] px-1.5">{POST.authorBadge}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">{POST.time} · {POST.views.toLocaleString()} views</p>
            </div>
          </div>

          <div className="prose prose-sm max-w-none text-sm leading-6 text-foreground space-y-3">
            {POST.body.split("\n\n").map((para, i) => {
              if (para.startsWith("**") && para.endsWith("**")) {
                return <h3 key={i} className="font-bold text-base mt-4">{para.replace(/\*\*/g, "")}</h3>;
              }
              return (
                <p key={i} className="text-muted-foreground leading-6"
                  dangerouslySetInnerHTML={{
                    __html: para.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                  }}
                />
              );
            })}
          </div>

          <Separator className="my-5" />

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className={upvoted ? "border-primary text-primary bg-primary/5" : ""}
              onClick={() => setUpvoted(u => !u)}
            >
              <ThumbsUp className="mr-2 h-4 w-4" />
              {POST.upvotes + (upvoted ? 1 : 0)} Helpful
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={saved ? "border-primary text-primary bg-primary/5" : ""}
              onClick={() => setSaved(s => !s)}
            >
              <Bookmark className="mr-2 h-4 w-4" />
              {saved ? "Saved" : "Save"}
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
            <Button variant="ghost" size="sm" className="ml-auto text-muted-foreground">
              <Flag className="mr-2 h-4 w-4" /> Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Replies */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-base flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          {localReplies.length} Replies
        </h2>
      </div>

      <div className="space-y-3 mb-6">
        {localReplies.map(r => (
          <Card key={r.id} className={r.isBest ? "border-green-300 bg-green-50/30" : ""}>
            <CardContent className="p-4">
              {r.isBest && (
                <div className="flex items-center gap-1.5 text-xs text-green-700 font-semibold mb-2">
                  <Award className="h-3.5 w-3.5" /> Best Answer
                </div>
              )}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                  {r.author[0].toUpperCase()}
                </div>
                <span className="text-sm font-medium">{r.author}</span>
                <span className="text-xs text-muted-foreground">{r.time}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-5">{r.text}</p>
              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={() => toggleVote(r.id)}
                  className={`flex items-center gap-1.5 text-xs transition-colors ${votes[r.id] ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                  {r.upvotes + (votes[r.id] ? 1 : 0)}
                </button>
                <button className="text-xs text-muted-foreground hover:text-foreground">Reply</button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reply box */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <p className="text-sm font-semibold">Add a Reply</p>
          <Textarea
            value={reply}
            onChange={e => setReply(e.target.value)}
            placeholder="Share your experience or ask a follow-up question..."
            rows={4}
          />
          <div className="flex justify-end">
            <Button onClick={handleSubmitReply} disabled={!reply.trim() || submitting}>
              {submitting ? "Posting…" : "Post Reply"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
