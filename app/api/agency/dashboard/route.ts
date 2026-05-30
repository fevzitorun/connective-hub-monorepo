import { NextRequest } from "next/server";
import { db } from "@/app/lib/db";
import { getSession } from "@/app/lib/auth";

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) {
    return Response.json({ ok: false, error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const { userId, role } = session;

  if (!["agency_owner", "agency_member", "admin"].includes(role)) {
    return Response.json({ ok: false, error: "Yetkiniz yok." }, { status: 403 });
  }

  // Find agency for this user
  let agencyId: string | null = null;

  if (role === "agency_owner") {
    const agency = await db.agency.findUnique({ where: { ownerId: userId } });
    agencyId = agency?.id ?? null;
  } else if (role === "agency_member") {
    const member = await db.agencyMember.findUnique({ where: { userId } });
    agencyId = member?.agencyId ?? null;
  }

  if (!agencyId) {
    return Response.json({ ok: false, error: "Ajans bulunamadı." }, { status: 404 });
  }

  const [agency, totalListings, activeListings, draftListings, featuredListings, totalLeads, newLeads, qualifiedLeads, subscription, recentLeads, recentListings, analytics] = await Promise.all([
    db.agency.findUnique({ where: { id: agencyId } }),
    db.listing.count({ where: { agencyId } }),
    db.listing.count({ where: { agencyId, status: "active" } }),
    db.listing.count({ where: { agencyId, status: "draft" } }),
    db.listing.count({ where: { agencyId, isFeatured: true } }),
    db.lead.count({ where: { agencyId } }),
    db.lead.count({ where: { agencyId, status: "new" } }),
    db.lead.count({ where: { agencyId, status: "qualified" } }),
    db.subscription.findUnique({ where: { agencyId } }),
    db.lead.findMany({
      where: { agencyId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    db.listing.findMany({
      where: { agencyId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    db.agencyAnalytics.findMany({
      where: {
        agencyId,
        date: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
      orderBy: { date: "asc" },
    }),
  ]);

  return Response.json({
    ok: true,
    agency,
    listings: { total: totalListings, active: activeListings, draft: draftListings, featured: featuredListings },
    leads: { total: totalLeads, new: newLeads, qualified: qualifiedLeads },
    subscription,
    recentLeads,
    recentListings,
    analytics: analytics,
  });
}
