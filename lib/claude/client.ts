import Anthropic from "@anthropic-ai/sdk";

export function getAnthropicClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
}

export const SYSTEM_PROMPT = `You are StatusClock, an AI immigration assistant specializing in US immigration law for international students and immigrants. You have deep expertise in:

- F-1 student visas, OPT, STEM OPT, CPT
- H-1B work visas, H-4 EADs, cap-gap
- J-1 exchange visitor visas
- L-1 intracompany transfer visas
- O-1 extraordinary ability visas
- EB-1, EB-2, EB-3 employment-based green cards
- EB-2 NIW (National Interest Waiver)
- Family-based immigration
- Naturalization and citizenship

IMPORTANT RULES:
1. Always clarify that you provide general information, NOT legal advice
2. Always recommend consulting a licensed immigration attorney for specific cases
3. Cite USCIS official sources when possible (uscis.gov)
4. Be accurate — immigration rules change; note if information may be outdated
5. When unsure, say so and recommend official USCIS resources
6. Be empathetic — immigration is stressful; be supportive and clear
7. Provide step-by-step guidance when asked about processes
8. Always mention relevant deadlines when applicable

FORMAT (use markdown — it is rendered in the UI):
- Use ## for section headings in longer answers
- Use numbered lists (1. 2. 3.) for step-by-step processes
- Use bullet lists (- item) for non-sequential items
- **Bold** important terms, deadlines, and form numbers
- Include relevant form numbers (I-20, I-765, I-129, etc.)
- Keep answers concise — no unnecessary filler
- When the user's profile is provided, reference their specific dates and status directly (e.g. "Your OPT ends on June 15, 2026")
- End case-specific answers with: "Need legal advice? Connect with a verified immigration attorney on StatusClock."
- Never start a response with "I" as the first word`;

export async function streamChatResponse(
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  onChunk: (text: string) => void
): Promise<string> {
  let fullResponse = "";

  const anthropic = getAnthropicClient();
  const stream = anthropic.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages,
  });

  for await (const chunk of stream) {
    if (
      chunk.type === "content_block_delta" &&
      chunk.delta.type === "text_delta"
    ) {
      fullResponse += chunk.delta.text;
      onChunk(chunk.delta.text);
    }
  }

  return fullResponse;
}

const IMMIGRATION_DOC_PROMPT = `You are an immigration document analysis system. Extract every visible field from this document.

Return ONLY a valid JSON object — no markdown fences, no explanation. Use this exact structure:
{
  "summary": "one sentence description of the document",
  "extracted_fields": {
    "first_name": null,
    "last_name": null,
    "middle_name": null,
    "date_of_birth": null,
    "country_of_birth": null,
    "nationality": null,
    "a_number": null,
    "passport_number": null,
    "passport_expiry": null,
    "employer_name": null,
    "visa_type": null,
    "receipt_number": null,
    "sevis_id": null,
    "school_name": null,
    "h1b_start_date": null,
    "h1b_expiry": null,
    "ead_expiry": null,
    "i20_end_date": null,
    "priority_date": null
  },
  "expiry_date": null,
  "issues": [],
  "recommendations": []
}

Rules:
- Only populate fields that are clearly readable in the document — never guess
- All dates must be in YYYY-MM-DD format
- A-Number format: A-XXXXXXXXX (9 digits after the dash)
- Leave null for any field not present or illegible`;

export async function extractDocumentFields(
  base64Data: string,
  mediaType: string,
  docType: string
): Promise<{
  summary: string;
  extracted_fields: Record<string, string | null>;
  expiry_date: string | null;
  issues: string[];
  recommendations: string[];
}> {
  const anthropic = getAnthropicClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const contentBlock: any =
    mediaType === "application/pdf"
      ? { type: "document", source: { type: "base64", media_type: "application/pdf", data: base64Data } }
      : { type: "image", source: { type: "base64", media_type: mediaType, data: base64Data } };

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1500,
    messages: [{
      role: "user",
      content: [
        contentBlock,
        { type: "text", text: `Document type selected by user: ${docType}\n\n${IMMIGRATION_DOC_PROMPT}` },
      ],
    }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  try {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
  } catch {}

  return {
    summary: "Could not parse document",
    extracted_fields: {},
    expiry_date: null,
    issues: ["Could not extract fields — please try a clearer scan or different file format."],
    recommendations: [],
  };
}

export async function analyzeDocument(
  base64Image: string,
  mediaType: "image/jpeg" | "image/png" | "image/gif" | "image/webp",
  documentType: string
): Promise<{
  summary: string;
  extracted_fields: Record<string, string>;
  issues: string[];
  recommendations: string[];
  expiry_date: string | null;
}> {
  const anthropic = getAnthropicClient();
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: mediaType, data: base64Image },
          },
          {
            type: "text",
            text: `Analyze this ${documentType} immigration document. Extract all key fields, identify any issues or inconsistencies, and provide recommendations. Return a JSON object with: summary, extracted_fields (key-value pairs), issues (array of strings), recommendations (array of strings), expiry_date (ISO date string or null).`,
          },
        ],
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch {}

  return {
    summary: text,
    extracted_fields: {},
    issues: [],
    recommendations: ["Please review this document with an immigration attorney."],
    expiry_date: null,
  };
}
