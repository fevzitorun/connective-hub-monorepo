import Anthropic from "@anthropic-ai/sdk";

export interface SeoMetaPayload {
  type: "listing" | "geo";
  title: string;
  city?: string;
  district?: string;
  propertyType?: string;
  listingType?: string;
  priceAmount?: number;
  priceCurrency?: string;
}

export interface SeoMetaResult {
  metaTitle: string;
  metaDesc: string;
}

export async function runSeoMeta(payload: SeoMetaPayload): Promise<SeoMetaResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    const location = [payload.district, payload.city].filter(Boolean).join(", ");
    if (payload.type === "listing") {
      return {
        metaTitle: `${payload.title} | 7fil Emlak`,
        metaDesc: `${payload.title}${location ? " - " + location : ""} bölgesinde ${payload.listingType === "sale" ? "satılık" : "kiralık"} mülk. 7fil'de inceleyin.`,
      };
    }
    return {
      metaTitle: `${location} Emlak İlanları | 7fil`,
      metaDesc: `${location} bölgesindeki satılık ve kiralık mülk ilanlarını 7fil'de keşfedin. Güncel fiyatlar ve detaylı bilgi.`,
    };
  }

  const client = new Anthropic({ apiKey });
  const context = payload.type === "listing"
    ? `İlan başlığı: ${payload.title}\nKonum: ${[payload.district, payload.city].filter(Boolean).join(", ")}\nTip: ${payload.listingType === "sale" ? "Satılık" : "Kiralık"} ${payload.propertyType}`
    : `Konum sayfası: ${[payload.district, payload.city].filter(Boolean).join(", ")}\nMülk tipi: ${payload.propertyType || "Tüm mülkler"}\nİlan tipi: ${payload.listingType === "sale" ? "Satılık" : payload.listingType === "rent" ? "Kiralık" : "Tümü"}`;

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      messages: [
        {
          role: "user",
          content: `Türk gayrimenkul platformu 7fil için SEO meta verisi oluştur. Max 60 karakter title, max 160 karakter açıklama.\n\n${context}\n\nJSON döndür: { "metaTitle": "...", "metaDesc": "..." }`,
        },
      ],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as SeoMetaResult;
    }
  } catch {
    // fall through
  }

  const location = [payload.district, payload.city].filter(Boolean).join(", ");
  return {
    metaTitle: `${payload.title} | 7fil`,
    metaDesc: `${location} emlak ilanları - 7fil.com.tr`,
  };
}
