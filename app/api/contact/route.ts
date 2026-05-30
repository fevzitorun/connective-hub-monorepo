import { db } from "@/app/lib/db";
import { z } from "zod";

const schema = z.object({
  name:    z.string().min(2),
  email:   z.string().email(),
  phone:   z.string().optional(),
  company: z.string().optional(),
  type:    z.enum(["agency", "investor", "partner", "press"]).default("agency"),
  message: z.string().optional(),
  city:    z.string().optional(),
  country: z.string().default("TR"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = schema.parse(body);
    const entry = await db.contactRequest.create({ data });
    return Response.json({ ok: true, id: entry.id });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return Response.json({ ok: false, error: err.issues[0]?.message ?? "Geçersiz veri" }, { status: 400 });
    }
    return Response.json({ ok: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function GET() {
  const requests = await db.contactRequest.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return Response.json({ requests });
}
