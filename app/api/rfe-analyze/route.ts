import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getUserPlan } from "@/lib/supabase/subscription";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const SYSTEM_PROMPT = `You are an expert U.S. immigration attorney assistant specializing in USCIS Request for Evidence (RFE) responses. You help petitioners and their attorneys understand RFE issues and draft professional response frameworks.

When given an RFE notice, you must respond with a valid JSON object — no markdown, no code fences, just raw JSON — in exactly this structure:
{
  "issueCount": number,
  "deadline": "string (e.g. '87 days from notice date')",
  "visaType": "string (e.g. 'H-1B', 'O-1', 'EB-2')",
  "issues": [
    {
      "title": "Issue N: [short title]",
      "description": "1-2 sentence plain-language explanation of what USCIS is questioning",
      "checklist": ["specific document or evidence item 1", "item 2", ...],
      "sampleResponse": "A 3-5 sentence professional draft response framework the attorney can customize"
    }
  ]
}

Rules:
- Extract every distinct issue from the RFE
- Checklist items must be specific and actionable (not generic)
- Sample responses must sound like attorney-drafted legal writing
- Always include a disclaimer note that responses need attorney review
- Respond with ONLY the JSON object — no other text`;

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const plan = await getUserPlan(userId);
  if (plan === "free") {
    return NextResponse.json(
      { error: "The RFE Analyzer requires an active plan. Upgrade at /pricing to unlock it." },
      { status: 403 }
    );
  }

  const { rfeText } = await req.json();
  if (!rfeText || typeof rfeText !== "string" || rfeText.trim().length < 50) {
    return NextResponse.json({ error: "RFE text is too short or missing" }, { status: 400 });
  }

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Analyze this USCIS Request for Evidence and return the JSON response:\n\n${rfeText}`,
        },
      ],
    });

    const raw = message.content[0].type === "text" ? message.content[0].text : "";

    // Strip any accidental markdown code fences
    const cleaned = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();
    const parsed = JSON.parse(cleaned);

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("[rfe-analyze] error:", err);
    return NextResponse.json({ error: "Analysis failed. Please try again." }, { status: 500 });
  }
}
