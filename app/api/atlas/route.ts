import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { LISTINGS } from "@/lib/data";

const client = new Anthropic();

// NLS parse prompt — returns structured JSON filter from Turkish natural language
const PARSE_SYSTEM = `Sen 7fil gayrimenkul platformunun arama asistanisın.
Kullanıcının Türkçe doğal dil sorgusundan JSON filtre objesi çıkar.
Sadece geçerli JSON döndür, başka metin ekleme.

Format:
{
  "district": string | null,
  "city": string | null,
  "kind": "satilik" | "kiralik" | null,
  "rooms": string | null,
  "maxPrice": number | null,
  "minArea": number | null,
  "hasBalcony": boolean | null,
  "nearMetro": boolean | null,
  "summary": string
}

Örnekler:
- "Kadıköy'de metroya yakın balkonlu 3+1 daire, bütçem 9 milyon"
  → {"city":"Kadıköy","kind":"satilik","rooms":"3+1","maxPrice":9000000,"nearMetro":true,"hasBalcony":true,"summary":"Kadıköy, 3+1, ≤9M ₺, metroya yakın, balkonlu"}
- "Beşiktaş kiralık ofis"
  → {"city":"Beşiktaş","kind":"kiralik","rooms":"Ofis","summary":"Beşiktaş kiralık ofis"}`;

// Conversational response prompt
const CHAT_SYSTEM = `Sen Atlas AI — 7fil gayrimenkul platformunun asistanısın.
"Bilge bir gayrimenkul avukatı büyükbaba" gibi konuş: sıcak, doğrudan, bilgili.
Kısa tut. Türkçe yanıt ver.
Bulunan ilanları öneride bulun, piyasa bağlamı ekle.
Her zaman: hukuki doğrulama, Atlas AI değerleme gibi 7fil özelliklerini nazikçe hatırlat.
Maksimum 3 paragraf.`;

export async function POST(req: NextRequest) {
  try {
    const { messages, mode } = await req.json() as {
      messages: { role: "user" | "assistant"; content: string }[];
      mode: "search" | "chat";
    };

    if (!messages?.length) {
      return NextResponse.json({ error: "messages required" }, { status: 400 });
    }

    const userQuery = messages[messages.length - 1].content;

    // Step 1: Parse NLS → structured filters
    const parseResponse = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 256,
      system: PARSE_SYSTEM,
      messages: [{ role: "user", content: userQuery }],
    });

    let filters: Record<string, unknown> = {};
    try {
      const raw = (parseResponse.content[0] as { text: string }).text.trim();
      filters = JSON.parse(raw);
    } catch {
      // If parse fails, proceed with empty filters
    }

    // Step 2: Filter LISTINGS
    const matched = LISTINGS.filter((l) => {
      if (filters.kind && l.kind !== filters.kind) return false;
      if (filters.city && !l.city.toLowerCase().includes((filters.city as string).toLowerCase())) return false;
      if (filters.rooms && l.rooms !== filters.rooms) return false;
      if (filters.maxPrice && l.price > (filters.maxPrice as number)) return false;
      if (filters.minArea && l.area < (filters.minArea as number)) return false;
      if (filters.nearMetro && !l.metro) return false;
      return true;
    });

    // Step 3: Build context for conversational response
    const listingContext = matched.length > 0
      ? matched.slice(0, 3).map(l =>
          `- ${l.title} | ${l.city} | ${l.price.toLocaleString("tr-TR")} ₺ | ${l.rooms} · ${l.area}m²${l.aiNote ? ` | Not: ${l.aiNote}` : ""}`
        ).join("\n")
      : "Bu kriterlere uyan ilan bulunamadı.";

    const systemWithContext = `${CHAT_SYSTEM}

Bulunan ilanlar (${matched.length} sonuç):
${listingContext}

Filtre özeti: ${(filters.summary as string) ?? userQuery}`;

    // Step 4: Streaming conversational response
    const stream = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 512,
      system: systemWithContext,
      messages,
      stream: true,
    });

    // Stream back to client
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        // First emit matched listing IDs
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "listings", ids: matched.slice(0, 3).map(l => l.id) })}\n\n`
          )
        );

        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: "text", text: event.delta.text })}\n\n`
              )
            );
          }
          if (event.type === "message_stop") {
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("Atlas API error:", err);
    return NextResponse.json({ error: "Atlas AI şu an kullanılamıyor." }, { status: 500 });
  }
}
