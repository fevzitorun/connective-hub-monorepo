import Anthropic from "@anthropic-ai/sdk";

export interface GeoContentPayload {
  city: string;
  district?: string;
  neighborhood?: string;
  listingType?: string;
}

export interface GeoContentResult {
  title: string;
  h1: string;
  metaDesc: string;
  content: string;
}

export async function runGeoContent(payload: GeoContentPayload): Promise<GeoContentResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    // Return mock result when API key is not set
    const location = [payload.neighborhood, payload.district, payload.city].filter(Boolean).join(", ");
    return {
      title: `${location} Emlak İlanları | 7fil`,
      h1: `${location} Gayrimenkul`,
      metaDesc: `${location} bölgesindeki satılık ve kiralık mülk ilanlarını keşfedin. 7fil ile en uygun fiyatlı gayrimenkul fırsatları.`,
      content: `${location} bölgesi, Türkiye'nin en çok tercih edilen yaşam alanlarından biridir. Konut, ofis ve ticari mülk seçenekleriyle yatırımcılar ve alıcılar için cazip fırsatlar sunmaktadır.`,
    };
  }

  const client = new Anthropic({ apiKey });
  const location = [payload.neighborhood, payload.district, payload.city].filter(Boolean).join(", ");
  const typeText = payload.listingType === "sale" ? "satılık" : payload.listingType === "rent" ? "kiralık" : "satılık ve kiralık";

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 600,
    messages: [
      {
        role: "user",
        content: `Türk gayrimenkul platformu için ${location} bölgesinde ${typeText} mülkler hakkında SEO içeriği yaz. JSON formatında döndür: { "title": "...", "h1": "...", "metaDesc": "...", "content": "..." }. Türkçe olsun, 200 kelimelik içerik yaz.`,
      },
    ],
  });

  try {
    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as GeoContentResult;
    }
  } catch {
    // fall through to default
  }

  return {
    title: `${location} Emlak İlanları | 7fil`,
    h1: `${location} Gayrimenkul`,
    metaDesc: `${location} bölgesindeki ${typeText} mülk ilanlarını 7fil'de keşfedin.`,
    content: `${location} bölgesinde ${typeText} mülk arıyorsanız doğru yerdesiniz.`,
  };
}
