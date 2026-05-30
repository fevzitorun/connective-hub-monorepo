import { NextRequest } from "next/server";
import { db } from "@/app/lib/db";
import { getSession } from "@/app/lib/auth";

async function getAgencyId(userId: string, role: string): Promise<string | null> {
  if (role === "agency_owner") {
    const agency = await db.agency.findUnique({ where: { ownerId: userId } });
    return agency?.id ?? null;
  }
  if (role === "agency_member") {
    const member = await db.agencyMember.findUnique({ where: { userId } });
    return member?.agencyId ?? null;
  }
  return null;
}

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) {
    return Response.json({ ok: false, error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const agencyId = await getAgencyId(session.userId, session.role);
  if (!agencyId) {
    return Response.json({ ok: false, error: "Ajans bulunamadı." }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") ?? undefined;
  const source = searchParams.get("source") ?? undefined;
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const perPage = parseInt(searchParams.get("perPage") ?? "20", 10);
  const skip = (page - 1) * perPage;

  const where = {
    agencyId,
    ...(status ? { status } : {}),
    ...(source ? { source } : {}),
  };

  const [leads, total] = await Promise.all([
    db.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: perPage,
    }),
    db.lead.count({ where }),
  ]);

  return Response.json({ ok: true, leads, total, page, perPage });
}

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  if (!session) {
    return Response.json({ ok: false, error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const agencyId = await getAgencyId(session.userId, session.role);
  if (!agencyId) {
    return Response.json({ ok: false, error: "Ajans bulunamadı." }, { status: 404 });
  }

  try {
    const body = await request.json();
    const { name, email, phone, source, notes, budget, listingId } = body;

    if (!name) {
      return Response.json({ ok: false, error: "İsim zorunludur." }, { status: 400 });
    }

    const lead = await db.lead.create({
      data: {
        agencyId,
        name,
        email,
        phone,
        source: source || "platform",
        notes,
        budget,
        listingId,
        status: "new",
      },
    });

    return Response.json({ ok: true, lead }, { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ ok: false, error: "Lead oluşturulamadı." }, { status: 500 });
  }
}
