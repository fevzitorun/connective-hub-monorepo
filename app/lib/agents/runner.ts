import { db } from "@/app/lib/db";
import { runGeoContent, type GeoContentPayload } from "./handlers/geo-content";
import { runListingDesc, type ListingDescPayload } from "./handlers/listing-desc";
import { runLeadScoring, type LeadScoringPayload } from "./handlers/lead-scoring";
import { runSeoMeta, type SeoMetaPayload } from "./handlers/seo-meta";
import { runModeration, type ModerationPayload } from "./handlers/moderation";

export interface AgentResult {
  success: boolean;
  data?: unknown;
  error?: string;
  durationMs: number;
}

export async function runAgent(type: string, payload: unknown): Promise<AgentResult> {
  const startedAt = new Date();
  const startMs = Date.now();

  // Create job record
  const job = await db.agentJob.create({
    data: {
      agentType: type,
      status: "running",
      payload: JSON.stringify(payload),
      startedAt,
    },
  });

  try {
    let result: unknown;

    switch (type) {
      case "geo_content":
        result = await runGeoContent(payload as GeoContentPayload);
        break;
      case "listing_desc":
        result = await runListingDesc(payload as ListingDescPayload);
        break;
      case "lead_scoring":
        result = await runLeadScoring(payload as LeadScoringPayload);
        break;
      case "seo_meta":
        result = await runSeoMeta(payload as SeoMetaPayload);
        break;
      case "moderation":
        result = await runModeration(payload as ModerationPayload);
        break;
      default:
        throw new Error(`Unknown agent type: ${type}`);
    }

    const durationMs = Date.now() - startMs;
    const completedAt = new Date();

    await db.agentJob.update({
      where: { id: job.id },
      data: {
        status: "completed",
        result: JSON.stringify(result),
        completedAt,
      },
    });

    await db.agentLog.create({
      data: {
        agentType: type,
        summary: `Agent "${type}" completed successfully`,
        itemsProcessed: 1,
        duration: durationMs,
      },
    });

    return { success: true, data: result, durationMs };
  } catch (err) {
    const durationMs = Date.now() - startMs;
    const errorMsg = err instanceof Error ? err.message : String(err);

    await db.agentJob.update({
      where: { id: job.id },
      data: {
        status: "failed",
        error: errorMsg,
        completedAt: new Date(),
      },
    });

    await db.agentLog.create({
      data: {
        agentType: type,
        summary: `Agent "${type}" failed: ${errorMsg}`,
        itemsProcessed: 0,
        duration: durationMs,
      },
    });

    return { success: false, error: errorMsg, durationMs };
  }
}
