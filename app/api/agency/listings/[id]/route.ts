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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession(request);
  if (!session) {
    return Response.json({ ok: false, error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const { id } = await params;
  const agencyId = await getAgencyId(session.userId, session.role);

  const listing = await db.listing.findUnique({
    where: { id },
    include: { photos: true },
  });

  if (!listing || listing.agencyId !== agencyId) {
    return Response.json({ ok: false, error: "İlan bulunamadı." }, { status: 404 });
  }

  return Response.json({ ok: true, listing });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession(request);
  if (!session) {
    return Response.json({ ok: false, error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const { id } = await params;
  const agencyId = await getAgencyId(session.userId, session.role);

  const existing = await db.listing.findUnique({ where: { id } });
  if (!existing || existing.agencyId !== agencyId) {
    return Response.json({ ok: false, error: "İlan bulunamadı." }, { status: 404 });
  }

  try {
    const body = await request.json();
    const listing = await db.listing.update({ where: { id }, data: body });
    return Response.json({ ok: true, listing });
  } catch (err) {
    console.error(err);
    return Response.json({ ok: false, error: "İlan güncellenemedi." }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession(request);
  if (!session) {
    return Response.json({ ok: false, error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const { id } = await params;
  const agencyId = await getAgencyId(session.userId, session.role);

  const existing = await db.listing.findUnique({ where: { id } });
  if (!existing || existing.agencyId !== agencyId) {
    return Response.json({ ok: false, error: "İlan bulunamadı." }, { status: 404 });
  }

  const listing = await db.listing.update({ where: { id }, data: { status: "expired" } });
  return Response.json({ ok: true, listing });
}
