import { NextRequest } from "next/server";
import { db } from "@/app/lib/db";
import { getSession } from "@/app/lib/auth";

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) {
    return Response.json({ ok: false, error: "Giriş yapmalısınız." }, { status: 401 });
  }
  if (session.role !== "admin") {
    return Response.json({ ok: false, error: "Yetkiniz yok." }, { status: 403 });
  }

  const jobs = await db.agentJob.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return Response.json({ ok: true, jobs });
}
