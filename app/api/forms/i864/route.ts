import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { I864_QUESTIONS } from "@/lib/forms/i864";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export async function GET() {
  return NextResponse.json({ firstQuestion: I864_QUESTIONS[0], total: I864_QUESTIONS.length });
}

export async function POST(req: NextRequest) {
  const { answer, currentFieldId } = await req.json();

  const currentIdx = I864_QUESTIONS.findIndex(q => q.id === currentFieldId);
  if (currentIdx === -1) return NextResponse.json({ error: "Invalid field" }, { status: 400 });

  const currentQ = I864_QUESTIONS[currentIdx];
  const nextQ = I864_QUESTIONS[currentIdx + 1] ?? null;
  const progress = Math.round(((currentIdx + 1) / I864_QUESTIONS.length) * 100);

  // Normalize the answer with Claude Haiku
  let extractedValue = answer.trim();
  try {
    const result = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 150,
      system: `Extract and normalize an immigration form field value from a conversational answer.
Return ONLY valid JSON: {"value": "<normalized value>"}
Rules:
- Names: Title Case
- Dates: MM/DD/YYYY
- State: 2-letter code (TX, CA…)
- SSN: XXX-XX-XXXX
- Phone: (XXX) XXX-XXXX
- Income: $X,XXX format
- Yes/No questions: return "Yes" or "No"
- A-Number: A-XXXXXXXXX format
- "none"/"n/a"/"no" for optional → "N/A"
- Everything else: clean and capitalize appropriately`,
      messages: [{ role: "user", content: `Field: "${currentQ.label}"\nAnswer: "${answer}"` }],
    });
    const text = result.content[0].type === "text" ? result.content[0].text : "";
    const match = text.match(/\{[^}]*"value"\s*:\s*"([^"]+)"[^}]*\}/);
    if (match) extractedValue = match[1];
  } catch { /* use raw answer */ }

  let assistantMessage = `Got it — **${extractedValue}**.`;
  if (nextQ) {
    // If moving to a new Part, announce it
    if (nextQ.part !== currentQ.part) {
      assistantMessage += `\n\n---\n**${nextQ.part}: ${nextQ.partTitle}**\n\n${nextQ.question}`;
    } else {
      assistantMessage += `\n\n${nextQ.question}`;
    }
  } else {
    assistantMessage = "✅ All done! Every section of Form I-864 has been filled in.\n\nClick **Download PDF** above to get your completed data sheet. Take it to your attorney or use it as a reference when signing the official USCIS form.";
  }

  return NextResponse.json({
    extractedValue,
    assistantMessage,
    nextQuestion: nextQ,
    progress,
    isComplete: !nextQ,
  });
}
