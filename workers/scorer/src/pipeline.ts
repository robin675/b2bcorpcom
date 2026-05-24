import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@b2bcorpcom/db";
import { SCORER_RUBRIC_VERSION, scoreCandidate, type ScoreResult } from "@b2bcorpcom/ai";
import { log } from "@b2bcorpcom/shared";
import type { Env } from "./env";
import { extractText, extractTitle } from "./extract";

type Db = SupabaseClient<Database>;

const BATCH_SIZE = 50;
const FETCH_TIMEOUT_MS = 15_000;

export interface RunSummary {
  picked: number;
  scored: number;
  fetch_failed: number;
  model_errors: number;
}

export async function runScorer(env: Env): Promise<RunSummary> {
  const db = createClient<Database>(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  const { data: pending, error } = await db
    .from("candidate")
    .select("id, url")
    .eq("status", "pending")
    .order("discovered_at", { ascending: true })
    .limit(BATCH_SIZE);

  if (error) throw new Error(`scorer: load pending failed: ${error.message}`);

  const summary: RunSummary = {
    picked: pending?.length ?? 0,
    scored: 0,
    fetch_failed: 0,
    model_errors: 0,
  };

  for (const c of pending ?? []) {
    try {
      const html = await fetchHomepage(c.url);
      const title = extractTitle(html);
      const text = extractText(html);

      if (text.length < 80) {
        await persist(db, c.id, {
          score: 0,
          reasons: {
            category_fit: "본문 추출 실패 (홈페이지 텍스트가 너무 짧음)",
            clean_basics: "",
            over_branded: "",
            verdict: "사이트가 비어있거나 JS-only 렌더링",
          },
          raw_response: "",
        });
        summary.fetch_failed++;
        continue;
      }

      const result = await scoreCandidate({
        apiKey: env.ANTHROPIC_API_KEY,
        url: c.url,
        pageTitle: title,
        pageText: text,
      });
      await persist(db, c.id, result);
      summary.scored++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.startsWith("fetch:")) {
        await persist(db, c.id, {
          score: 0,
          reasons: {
            category_fit: "",
            clean_basics: "",
            over_branded: "",
            verdict: msg,
          },
          raw_response: "",
        });
        summary.fetch_failed++;
      } else {
        // Model/parse error — leave status='pending' so a future run retries.
        summary.model_errors++;
        log("error", "scorer: candidate failed", { id: c.id, url: c.url, err: msg });
      }
    }
  }

  log("info", "scorer: run complete", { ...summary });
  return summary;
}

async function fetchHomepage(url: string): Promise<string> {
  let res: Response;
  try {
    res = await fetch(url, {
      method: "GET",
      headers: {
        "user-agent": "b2bcorpcom-scorer/0.1 (+contact: robin@vidfolio.kr)",
        accept: "text/html,application/xhtml+xml",
        "accept-language": "ko,en;q=0.8",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`fetch: network — ${msg}`);
  }
  if (!res.ok) throw new Error(`fetch: ${res.status} ${res.statusText}`);

  const ctype = res.headers.get("content-type") ?? "";
  if (!/text\/html|application\/xhtml/i.test(ctype)) {
    throw new Error(`fetch: non-html content-type (${ctype.slice(0, 60)})`);
  }
  return await res.text();
}

async function persist(db: Db, candidateId: string, result: ScoreResult): Promise<void> {
  const { error: scoreErr } = await db.from("candidate_score").insert({
    candidate_id: candidateId,
    score: result.score,
    reasons: result.reasons as unknown as Database["public"]["Tables"]["candidate_score"]["Insert"]["reasons"],
    model_version: SCORER_RUBRIC_VERSION,
  });
  if (scoreErr) throw new Error(`scorer: insert candidate_score failed: ${scoreErr.message}`);

  const { error: candErr } = await db
    .from("candidate")
    .update({ status: "scored" })
    .eq("id", candidateId);
  if (candErr) throw new Error(`scorer: update candidate failed: ${candErr.message}`);
}
