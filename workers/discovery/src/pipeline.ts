import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database, DiscoverySettings } from "@b2bcorpcom/db";
import { CONFIG_KEYS } from "@b2bcorpcom/db";
import { extractDomain, isBlockedDomain, log, normalizeUrl } from "@b2bcorpcom/shared";
import type { Env } from "./env";
import { naverSearchWebkr, stripHighlight } from "./naver";

type Db = SupabaseClient<Database>;

const DEFAULT_SETTINGS: DiscoverySettings = {
  max_results_per_query: 30,
  search_engine: "naver",
};

export interface RunSummary {
  runs: number;
  candidates_inserted: number;
  candidates_skipped: number;
  errors: number;
}

export async function runDiscovery(env: Env): Promise<RunSummary> {
  const db = createClient<Database>(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  const { keywords, settings } = await loadConfig(db);

  if (keywords.length === 0) {
    log("warn", "discovery: no keywords configured; nothing to do");
    return { runs: 0, candidates_inserted: 0, candidates_skipped: 0, errors: 0 };
  }

  const summary: RunSummary = { runs: 0, candidates_inserted: 0, candidates_skipped: 0, errors: 0 };

  for (const keyword of keywords) {
    summary.runs++;
    const { data: runRow, error: runErr } = await db
      .from("discovery_run")
      .insert({ query: keyword, status: "running" })
      .select("id")
      .single();

    if (runErr || !runRow) {
      summary.errors++;
      log("error", "discovery: failed to insert discovery_run", { keyword, err: runErr?.message });
      continue;
    }

    try {
      const result = await processQuery(db, env, runRow.id, keyword, settings);
      summary.candidates_inserted += result.inserted;
      summary.candidates_skipped += result.skipped;

      await db
        .from("discovery_run")
        .update({
          status: "ok",
          finished_at: new Date().toISOString(),
          candidates_found: result.inserted,
        })
        .eq("id", runRow.id);
    } catch (err) {
      summary.errors++;
      const message = err instanceof Error ? err.message : String(err);
      log("error", "discovery: query failed", { keyword, err: message });
      await db
        .from("discovery_run")
        .update({
          status: "error",
          finished_at: new Date().toISOString(),
          error: message.slice(0, 500),
        })
        .eq("id", runRow.id);
    }
  }

  log("info", "discovery: run complete", { ...summary });
  return summary;
}

async function loadConfig(db: Db): Promise<{ keywords: string[]; settings: DiscoverySettings }> {
  const { data, error } = await db
    .from("config")
    .select("key, value")
    .in("key", [CONFIG_KEYS.DiscoveryKeywords, CONFIG_KEYS.DiscoverySettings]);

  if (error) throw new Error(`config load failed: ${error.message}`);

  let keywords: string[] = [];
  let settings: DiscoverySettings = DEFAULT_SETTINGS;

  for (const row of data ?? []) {
    if (row.key === CONFIG_KEYS.DiscoveryKeywords && Array.isArray(row.value)) {
      keywords = row.value.filter((k): k is string => typeof k === "string" && k.trim().length > 0);
    } else if (row.key === CONFIG_KEYS.DiscoverySettings && row.value && typeof row.value === "object") {
      settings = { ...DEFAULT_SETTINGS, ...(row.value as Partial<DiscoverySettings>) };
    }
  }

  return { keywords, settings };
}

async function processQuery(
  db: Db,
  env: Env,
  discoveryRunId: string,
  keyword: string,
  settings: DiscoverySettings,
): Promise<{ inserted: number; skipped: number }> {
  const items = await naverSearchWebkr({
    clientId: env.NAVER_CLIENT_ID,
    clientSecret: env.NAVER_CLIENT_SECRET,
    query: keyword,
    display: settings.max_results_per_query,
  });

  let inserted = 0;
  let skipped = 0;
  const seenInThisQuery = new Set<string>();

  for (const item of items) {
    const url = normalizeUrl(item.link);
    if (!url) {
      skipped++;
      continue;
    }
    const domain = extractDomain(url);
    if (!domain || isBlockedDomain(domain)) {
      skipped++;
      continue;
    }
    if (seenInThisQuery.has(domain)) {
      skipped++;
      continue;
    }
    seenInThisQuery.add(domain);

    // Insert candidate; uniqueness on `domain` makes this idempotent across runs.
    const { error } = await db.from("candidate").insert({
      discovery_run: discoveryRunId,
      url,
      domain,
      display_name: stripHighlight(item.title).slice(0, 200) || null,
      search_query: keyword,
    });

    if (error) {
      if (error.code === "23505") {
        // Duplicate domain — already discovered in an earlier run.
        skipped++;
      } else {
        log("warn", "discovery: candidate insert failed", { domain, err: error.message });
        skipped++;
      }
    } else {
      inserted++;
    }
  }

  return { inserted, skipped };
}
