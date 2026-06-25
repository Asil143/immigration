import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { visaType, rfeText, additionalContext } = await req.json();
  if (!rfeText?.trim()) return NextResponse.json({ error: "RFE text is required" }, { status: 400 });

  const prompt = `You are an expert immigration attorney specializing in USCIS Request for Evidence (RFE) responses. A client has received an RFE and needs a strategic response plan.

Visa Type: ${visaType || "Not specified"}
${additionalContext ? `Additional Context: ${additionalContext}` : ""}

RFE Text:
${rfeText}

Provide a comprehensive RFE response strategy in the following JSON format:
{
  "summary": "2-3 sentence plain-English summary of what USCIS is asking for",
  "issues": [
    {
      "title": "Issue title",
      "description": "What USCIS is questioning",
      "severity": "high|medium|low",
      "response_strategy": "How to address this specific issue",
      "evidence_needed": ["List", "of", "specific", "documents", "or", "evidence", "needed"]
    }
  ],
  "response_tips": ["General tips for the overall RFE response"],
  "deadline_note": "Important notes about the RFE deadline and timing",
  "attorney_recommendation": "When/why to hire an attorney for this type of RFE"
}

Be specific and actionable. Focus on what documents and arguments will be most persuasive to USCIS.`;

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid AI response format");

    const analysis = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ analysis });
  } catch (err) {
    console.error("RFE analysis error:", err);
    return NextResponse.json({ error: "Analysis failed. Please try again." }, { status: 500 });
  }
}
