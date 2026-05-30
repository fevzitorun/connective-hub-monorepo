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

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const perPage = parseInt(searchParams.get("perPage") ?? "20", 10);
  const pending = searchParams.get("pending") === "true";

  const where = pending ? { isApproved: false } : {};

  const [agencies, total] = await Promise.all([
    db.agency.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
      include: {
        owner: { select: { name: true, email: true } },
        subscription: true,
      },
    }),
    db.agency.count({ where }),
  ]);

  return Response.json({ ok: true, agencies, total, page, perPage });
}
