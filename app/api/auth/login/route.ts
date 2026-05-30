import { NextRequest } from "next/server";
import { db } from "@/app/lib/db";
import { verifyPassword, createSession } from "@/app/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json({ ok: false, error: "E-posta ve şifre gereklidir." }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return Response.json({ ok: false, error: "Geçersiz e-posta veya şifre." }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return Response.json({ ok: false, error: "Geçersiz e-posta veya şifre." }, { status: 401 });
    }

    if (!user.isActive) {
      return Response.json({ ok: false, error: "Bu hesap devre dışı bırakılmıştır." }, { status: 403 });
    }

    const token = await createSession(user.id, user.role);
    const maxAge = 7 * 24 * 60 * 60;
    const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";

    const response = Response.json({
      ok: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });

    const headers = new Headers(response.headers);
    headers.set(
      "Set-Cookie",
      `session=${token}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`
    );

    return new Response(response.body, { status: 200, headers });
  } catch (err) {
    console.error(err);
    return Response.json({ ok: false, error: "Giriş sırasında bir hata oluştu." }, { status: 500 });
  }
}
