export interface ModerationPayload {
  title: string;
  description?: string;
  priceAmount?: number;
  city?: string;
  phone?: string;
  email?: string;
}

export interface ModerationResult {
  passed: boolean;
  flags: string[];
  riskLevel: "low" | "medium" | "high";
}

const suspiciousKeywords = [
  "dolandırıcı", "sahte", "kaçak", "yasadışı", "imarsız", "ruhsatsız",
  "fake", "scam", "fraud", "illegal",
];

const spamPatterns = [
  /(.)\1{5,}/, // repeated characters
  /[A-Z]{10,}/, // all caps
  /\b(acil|ACIL|ACİL)\b.*\b(acil|ACIL|ACİL)\b/i, // repeated urgency
];

const suspiciousPhonePatterns = [
  /^\+1/, // US numbers in TR listings
  /^00/, // international prefix
];

export async function runModeration(payload: ModerationPayload): Promise<ModerationResult> {
  const flags: string[] = [];
  const text = `${payload.title} ${payload.description || ""}`.toLowerCase();

  // Check for suspicious keywords
  for (const kw of suspiciousKeywords) {
    if (text.includes(kw)) {
      flags.push(`Şüpheli anahtar kelime: "${kw}"`);
    }
  }

  // Check for spam patterns
  for (const pattern of spamPatterns) {
    if (pattern.test(payload.title)) {
      flags.push("Spam formatlı başlık");
      break;
    }
  }

  // Price validation
  if (payload.priceAmount !== undefined) {
    if (payload.priceAmount <= 0) {
      flags.push("Geçersiz fiyat (0 veya negatif)");
    }
    if (payload.priceAmount < 1000 && payload.city?.toLowerCase() === "istanbul") {
      flags.push("İstanbul için olağandışı düşük fiyat");
    }
    if (payload.priceAmount > 1_000_000_000) {
      flags.push("Olağandışı yüksek fiyat");
    }
  }

  // Phone validation
  if (payload.phone) {
    for (const pattern of suspiciousPhonePatterns) {
      if (pattern.test(payload.phone)) {
        flags.push("Şüpheli telefon numarası formatı");
        break;
      }
    }
  }

  // Description length check
  if (payload.description && payload.description.length < 20) {
    flags.push("Çok kısa açıklama");
  }

  // Title length check
  if (payload.title.length < 5) {
    flags.push("Çok kısa başlık");
  }

  const riskLevel: "low" | "medium" | "high" =
    flags.length === 0 ? "low" :
    flags.length <= 2 ? "medium" : "high";

  return {
    passed: riskLevel !== "high",
    flags,
    riskLevel,
  };
}
