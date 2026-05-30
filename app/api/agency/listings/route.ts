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
  const listingType = searchParams.get("type") ?? undefined;
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const perPage = parseInt(searchParams.get("perPage") ?? "20", 10);
  const skip = (page - 1) * perPage;

  const where = {
    agencyId,
    ...(status ? { status } : {}),
    ...(listingType ? { listingType } : {}),
  };

  const [listings, total] = await Promise.all([
    db.listing.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: perPage,
      include: { photos: { where: { isPrimary: true }, take: 1 } },
    }),
    db.listing.count({ where }),
  ]);

  return Response.json({ ok: true, listings, total, page, perPage });
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
    const { title, listingType, propertyType, city, description, priceAmount, priceCurrency, areaGross, rooms, ...rest } = body;

    if (!title || !listingType || !propertyType || !city) {
      return Response.json({ ok: false, error: "Zorunlu alanlar eksik." }, { status: 400 });
    }

    const slug = `${title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}-${Date.now()}`;

    const listing = await db.listing.create({
      data: {
        agencyId,
        title,
        slug,
        listingType,
        propertyType,
        city,
        description,
        priceAmount,
        priceCurrency: priceCurrency || "TRY",
        areaGross,
        rooms,
        status: "draft",
        ...rest,
      },
    });

    return Response.json({ ok: true, listing }, { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ ok: false, error: "İlan oluşturulamadı." }, { status: 500 });
  }
}
