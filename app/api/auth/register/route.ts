import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/app/lib/db";
import { hashPassword, createSession } from "@/app/lib/auth";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
  role: z.enum(["agency_owner", "partner"]),
  agencyName: z.string().optional(),
  agencySlug: z.string().optional(),
  partnerType: z.string().optional(),
  companyName: z.string().optional(),
  licenseNo: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    const existing = await db.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return Response.json({ ok: false, error: "Bu e-posta adresi zaten kayıtlı." }, { status: 400 });
    }

    const passwordHash = await hashPassword(data.password);

    const user = await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        phone: data.phone,
        role: data.role,
      },
    });

    if (data.role === "agency_owner") {
      const slug = data.agencySlug || data.agencyName?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || user.id;
      const agency = await db.agency.create({
        data: {
          name: data.agencyName || data.name,
          slug,
          ownerId: user.id,
          email: data.email,
          phone: data.phone,
          city: data.city,
          country: data.country || "TR",
          isApproved: false,
          isActive: true,
        },
      });

      await db.subscription.create({
        data: {
          agencyId: agency.id,
          tier: "free",
          priceMonthly: 0,
          currency: "TRY",
          giftCredit: 1000,
        },
      });
    }

    if (data.role === "partner") {
      await db.partner.create({
        data: {
          userId: user.id,
          type: data.partnerType || "lawyer",
          companyName: data.companyName || data.name,
          licenseNo: data.licenseNo,
          isVerified: false,
          isActive: true,
        },
      });
    }

    const token = await createSession(user.id, user.role);

    const response = Response.json({
      ok: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });

    const headers = new Headers(response.headers);
    headers.set(
      "Set-Cookie",
      `session=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax`
    );

    return new Response(response.body, { status: 200, headers });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return Response.json({ ok: false, error: "Geçersiz form verisi.", issues: err.issues }, { status: 400 });
    }
    console.error(err);
    return Response.json({ ok: false, error: "Kayıt sırasında bir hata oluştu." }, { status: 500 });
  }
}
