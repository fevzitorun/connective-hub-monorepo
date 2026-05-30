import Anthropic from "@anthropic-ai/sdk";

export interface LeadScoringPayload {
  name: string;
  inquiryText?: string;
  budget?: number;
  source?: string;
  phone?: string;
  email?: string;
  messageCount?: number;
}

export interface LeadScoringResult {
  score: number;
  reasoning: string;
}

function heuristicScore(payload: LeadScoringPayload): number {
  let score = 30; // base score

  if (payload.phone) score += 15;
  if (payload.email) score += 10;
  if (payload.budget && payload.budget > 0) score += 20;
  if (payload.inquiryText && payload.inquiryText.length > 100) score += 10;
  if (payload.messageCount && payload.messageCount > 1) score += 10;

  const highIntentKeywords = ["acil", "nakit", "hemen", "bu hafta", "görüşelim", "uygun", "alıyorum"];
  const lowIntentKeywords = ["sadece bakıyorum", "bilgi", "fiyat nedir", "ne kadar"];

  const text = (payload.inquiryText || "").toLowerCase();
  for (const kw of highIntentKeywords) {
    if (text.includes(kw)) { score += 5; break; }
  }
  for (const kw of lowIntentKeywords) {
    if (text.includes(kw)) { score -= 10; break; }
  }

  if (payload.source === "referral") score += 15;
  else if (payload.source === "social") score += 5;

  return Math.max(0, Math.min(100, score));
}

export async function runLeadScoring(payload: LeadScoringPayload): Promise<LeadScoringResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    const score = heuristicScore(payload);
    return { score, reasoning: "Heuristik puanlama (API anahtarı yok)." };
  }

  const client = new Anthropic({ apiKey });

  const details = [
    `İsim: ${payload.name}`,
    payload.inquiryText ? `Mesaj: ${payload.inquiryText}` : null,
    payload.budget ? `Bütçe: ${payload.budget.toLocaleString()} TRY` : null,
    payload.source ? `Kaynak: ${payload.source}` : null,
    `Telefon: ${payload.phone ? "Var" : "Yok"}`,
    `E-posta: ${payload.email ? "Var" : "Yok"}`,
    payload.messageCount ? `Mesaj sayısı: ${payload.messageCount}` : null,
  ].filter(Boolean).join("\n");

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      messages: [
        {
          role: "user",
          content: `Gayrimenkul lead'ini 0-100 arası puanla. Yüksek puan = yüksek satın alma niyeti.\n\n${details}\n\nJSON döndür: { "score": 75, "reasoning": "kısa açıklama" }`,
        },
      ],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]) as LeadScoringResult;
      return { score: Math.max(0, Math.min(100, parsed.score)), reasoning: parsed.reasoning };
    }
  } catch {
    // fall through
  }

  const score = heuristicScore(payload);
  return { score, reasoning: "Heuristik puanlama kullanıldı." };
}
