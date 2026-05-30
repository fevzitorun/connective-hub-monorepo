export async function POST() {
  const response = Response.json({ ok: true });
  const headers = new Headers(response.headers);
  headers.set("Set-Cookie", "session=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax");
  return new Response(response.body, { status: 200, headers });
}
