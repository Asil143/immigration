import Anthropic from "@anthropic-ai/sdk";

export function getAnthropicClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
}

export const SYSTEM_PROMPT = `You are VisaPilot, an AI immigration assistant specializing in US immigration law for international students and immigrants. You have deep expertise in:

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

FORMAT:
- Use clear, numbered steps for processes
- Bold important terms and deadlines
- Include relevant form numbers (I-20, I-765, etc.)
- End responses with "Need legal advice? Connect with a verified immigration attorney on VisaPilot." when the question is case-specific`;

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
