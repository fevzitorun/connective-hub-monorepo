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

  const [
    totalAgencies,
    pendingAgencies,
    totalListings,
    activeListings,
    totalUsers,
    recentAgencies,
    agentJobs,
  ] = await Promise.all([
    db.agency.count(),
    db.agency.count({ where: { isApproved: false } }),
    db.listing.count(),
    db.listing.count({ where: { status: "active" } }),
    db.user.count(),
    db.agency.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { owner: { select: { name: true, email: true } } },
    }),
    db.agentJob.groupBy({
      by: ["agentType", "status"],
      _count: { id: true },
    }),
  ]);

  return Response.json({
    ok: true,
    totalAgencies,
    pendingAgencies,
    totalListings,
    activeListings,
    totalUsers,
    recentAgencies,
    agentJobsSummary: agentJobs,
  });
}
