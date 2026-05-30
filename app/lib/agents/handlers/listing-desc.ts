import Anthropic from "@anthropic-ai/sdk";

export interface ListingDescPayload {
  title: string;
  city: string;
  district?: string;
  propertyType: string;
  listingType: string;
  rooms?: string;
  areaGross?: number;
  priceAmount?: number;
  priceCurrency?: string;
  features?: string[];
}

export interface ListingDescResult {
  description: string;
}

export async function runListingDesc(payload: ListingDescPayload): Promise<ListingDescResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    const location = [payload.district, payload.city].filter(Boolean).join(", ");
    return {
      description: `${location} bölgesinde ${payload.rooms ? payload.rooms + " " : ""}${payload.propertyType} ${payload.listingType === "sale" ? "satışa" : "kiraya"} sunulmaktadır. ${payload.areaGross ? `Toplam ${payload.areaGross} m² brüt alana sahip bu` : "Bu"} mülk, konforlu bir yaşam için gereken tüm özellikleri barındırmaktadır.`,
    };
  }

  const client = new Anthropic({ apiKey });

  const details = [
    `İlan: ${payload.title}`,
    `Konum: ${[payload.district, payload.city].filter(Boolean).join(", ")}`,
    `Tür: ${payload.propertyType}`,
    `İlan tipi: ${payload.listingType === "sale" ? "Satılık" : "Kiralık"}`,
    payload.rooms ? `Oda: ${payload.rooms}` : null,
    payload.areaGross ? `Alan: ${payload.areaGross} m²` : null,
    payload.priceAmount ? `Fiyat: ${payload.priceAmount.toLocaleString()} ${payload.priceCurrency || "TRY"}` : null,
    payload.features?.length ? `Özellikler: ${payload.features.join(", ")}` : null,
  ].filter(Boolean).join("\n");

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 400,
    messages: [
      {
        role: "user",
        content: `Aşağıdaki gayrimenkul ilanı için profesyonel Türkçe açıklama yaz (150-200 kelime):\n\n${details}\n\nSadece açıklama metnini döndür, başka bir şey ekleme.`,
      },
    ],
  });

  const description = message.content[0].type === "text" ? message.content[0].text.trim() : "";

  return { description: description || `${payload.title} - ${payload.city} bölgesinde ${payload.listingType === "sale" ? "satılık" : "kiralık"} mülk.` };
}
