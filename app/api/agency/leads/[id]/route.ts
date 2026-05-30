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

  const existing = await db.lead.findUnique({ where: { id } });
  if (!existing || existing.agencyId !== agencyId) {
    return Response.json({ ok: false, error: "Lead bulunamadı." }, { status: 404 });
  }

  try {
    const body = await request.json();
    const { status, score, notes, assigneeId, nextFollowUp } = body;

    const lead = await db.lead.update({
      where: { id },
      data: {
        ...(status !== undefined ? { status } : {}),
        ...(score !== undefined ? { score } : {}),
        ...(notes !== undefined ? { notes } : {}),
        ...(assigneeId !== undefined ? { assigneeId } : {}),
        ...(nextFollowUp !== undefined ? { nextFollowUp: new Date(nextFollowUp) } : {}),
      },
    });

    return Response.json({ ok: true, lead });
  } catch (err) {
    console.error(err);
    return Response.json({ ok: false, error: "Lead güncellenemedi." }, { status: 500 });
  }
}
