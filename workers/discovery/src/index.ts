import { log } from "@b2bcorpcom/shared";
import type { Env } from "./env";
import { runDiscovery } from "./pipeline";

export default {
  // Cron entrypoint (per PLAN.md D28).
  async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(
      runDiscovery(env).catch((err) => {
        log("error", "discovery: scheduled run threw", {
          cron: controller.cron,
          err: err instanceof Error ? err.message : String(err),
        });
      }),
    );
  },

  // Manual trigger for admin/dev — guarded by a shared token.
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (request.method === "POST" && url.pathname === "/run") {
      const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
      if (!token || token !== env.MANUAL_TRIGGER_TOKEN) {
        return new Response("forbidden", { status: 403 });
      }
      try {
        const summary = await runDiscovery(env);
        return Response.json(summary);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        log("error", "discovery: manual run threw", { err: message });
        return Response.json({ error: message }, { status: 500 });
      }
    }
    return new Response("b2bcorpcom-discovery: POST /run with Bearer token", { status: 200 });
  },
} satisfies ExportedHandler<Env>;
