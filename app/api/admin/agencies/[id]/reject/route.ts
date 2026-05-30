import { NextRequest } from "next/server";
import { db } from "@/app/lib/db";
import { getSession } from "@/app/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession(request);
  if (!session) {
    return Response.json({ ok: false, error: "Giriş yapmalısınız." }, { status: 401 });
  }
  if (session.role !== "admin") {
    return Response.json({ ok: false, error: "Yetkiniz yok." }, { status: 403 });
  }

  const { id } = await params;

  const agency = await db.agency.findUnique({ where: { id } });
  if (!agency) {
    return Response.json({ ok: false, error: "Ajans bulunamadı." }, { status: 404 });
  }

  const updated = await db.agency.update({
    where: { id },
    data: {
      isApproved: false,
    },
  });

  return Response.json({ ok: true, agency: updated });
}
