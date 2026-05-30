import { NextRequest } from "next/server";
import { runAgent } from "@/app/lib/agents/runner";

const AGENT_KEY = process.env.AGENT_KEY || "dev-agent-key";

export async function POST(request: NextRequest) {
  const agentKey = request.headers.get("x-agent-key");
  if (agentKey !== AGENT_KEY) {
    return Response.json({ ok: false, error: "Yetkisiz erişim." }, { status: 401 });
  }

  try {
    const { agentType, payload } = await request.json();

    if (!agentType) {
      return Response.json({ ok: false, error: "agentType zorunludur." }, { status: 400 });
    }

    const result = await runAgent(agentType, payload ?? {});

    return Response.json({ ok: result.success, result });
  } catch (err) {
    console.error(err);
    return Response.json({ ok: false, error: "Agent çalıştırılamadı." }, { status: 500 });
  }
}
