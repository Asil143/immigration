import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { I864_QUESTIONS } from "@/lib/forms/i864";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export async function GET() {
  return NextResponse.json({
    firstQuestion: I864_QUESTIONS[0],
    total: I864_QUESTIONS.length,
  });
}

export async function POST(req: NextRequest) {
  const { answer, currentFieldId } = await req.json();

  const currentIdx = I864_QUESTIONS.findIndex((q) => q.id === currentFieldId);
  if (currentIdx === -1) {
    return NextResponse.json({ error: "Invalid field" }, { status: 400 });
  }

  const currentQ = I864_QUESTIONS[currentIdx];
  const nextQ = I864_QUESTIONS[currentIdx + 1] ?? null;
  const progress = Math.round(((currentIdx + 1) / I864_QUESTIONS.length) * 100);

  // Use Claude Haiku to extract a clean normalized field value
  let extractedValue = answer.trim();
  try {
    const result = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 150,
      system: `You extract and normalize immigration form field values from conversational answers.
Return ONLY valid JSON: {"value": "<normalized value>"}
Normalization rules:
- Names: title case
- Dates: MM/DD/YYYY format
- States: 2-letter abbreviation (e.g., TX)
- SSN: XXX-XX-XXXX format
- Phone: (XXX) XXX-XXXX format
- Income: $X,XXX format
- "none"/"n/a"/"no" for optional fields → "N/A"
- Everything else: clean and capitalize appropriately`,
      messages: [
        {
          role: "user",
          content: `Field: "${currentQ.label}"\nUser answered: "${answer}"`,
        },
      ],
    });

    const text =
      result.content[0].type === "text" ? result.content[0].text : "";
    const match = text.match(/\{[^}]*"value"\s*:\s*"([^"]+)"[^}]*\}/);
    if (match) extractedValue = match[1];
  } catch {
    // use raw answer as fallback
  }

  // Generate a friendly confirmation + next question prompt
  let assistantMessage = `Got it — **${extractedValue}** noted.`;
  if (nextQ) {
    assistantMessage += `\n\n${nextQ.question}`;
  } else {
    assistantMessage =
      `All done! ✅ Here's a summary of everything you've provided.\n\nYou can now **download your filled I-864 data as a PDF** using the button below. Take it to your attorney or use it as a reference when completing the official USCIS form.`;
  }

  return NextResponse.json({
    extractedValue,
    assistantMessage,
    nextQuestion: nextQ,
    progress,
    isComplete: !nextQ,
  });
}
