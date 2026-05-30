import { NextRequest } from "next/server";
import { db } from "@/app/lib/db";
import { getSession } from "@/app/lib/auth";

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) {
    return Response.json({ ok: false, error: "Oturum bulunamadı." }, { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, role: true, phone: true, avatarUrl: true, isActive: true },
  });

  if (!user || !user.isActive) {
    return Response.json({ ok: false, error: "Kullanıcı bulunamadı." }, { status: 401 });
  }

  return Response.json({ ok: true, user });
}
