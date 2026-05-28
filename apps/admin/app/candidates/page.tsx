import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CandidateList, type CandidateRow, type DocCard, type Reasons } from "./candidate-list";

export const dynamic = "force-dynamic";

const EXCERPT_LEN = 240;
const SUBSTANTIAL_MIN = 800;

export default async function CandidatesPage() {
  const supabase = await createSupabaseServerClient();

  const { data: candidates, error, count } = await supabase
    .from("candidate")
    .select("id, domain, url, display_name, search_query, status, discovered_at", { count: "exact" })
    .order("discovered_at", { ascending: false })
    .limit(500);

  const ids = (candidates ?? []).map((c) => c.id);

  const [{ data: scores }, { data: docs }] = await Promise.all([
    ids.length
      ? supabase
          .from("candidate_score")
          .select("candidate_id, score, reasons, evaluated_at")
          .in("candidate_id", ids)
          .order("evaluated_at", { ascending: false })
      : Promise.resolve({ data: [] as { candidate_id: string; score: number; reasons: unknown; evaluated_at: string }[] }),
    ids.length
      ? supabase
          .from("document")
          .select("id, candidate_id, doc_type, title, source_url, normalized_text, fetch_source, fetched_at")
          .in("candidate_id", ids)
          .order("fetched_at", { ascending: false })
      : Promise.resolve({ data: [] as Record<string, unknown>[] }),
  ]);

  const scoreByCandidate = new Map<string, { score: number; reasons: Reasons }>();
  for (const s of scores ?? []) {
    if (!scoreByCandidate.has(s.candidate_id)) {
      scoreByCandidate.set(s.candidate_id, {
        score: Number(s.score),
        reasons: (s.reasons ?? {}) as Reasons,
      });
    }
  }

  const docsByCandidate = new Map<string, DocCard[]>();
  for (const d of (docs ?? []) as {
    id: string;
    candidate_id: string | null;
    doc_type: string;
    title: string | null;
    source_url: string;
    normalized_text: string | null;
    fetch_source: string | null;
  }[]) {
    if (!d.candidate_id) continue;
    const text = d.normalized_text ?? "";
    const arr = docsByCandidate.get(d.candidate_id) ?? [];
    arr.push({
      id: d.id,
      doc_type: d.doc_type,
      title: d.title,
      source_url: d.source_url,
      excerpt: text.slice(0, EXCERPT_LEN).trim(),
      truncated: text.length > EXCERPT_LEN,
      char_count: text.length,
      fetch_source: d.fetch_source,
    });
    docsByCandidate.set(d.candidate_id, arr);
  }

  const docTypeOrder: Record<string, number> = { about: 0, press: 1, blog: 2 };
  const rows: CandidateRow[] = (candidates ?? []).map((c) => {
    const s = scoreByCandidate.get(c.id);
    const cdocs = (docsByCandidate.get(c.id) ?? []).sort(
      (a, b) => (docTypeOrder[a.doc_type] ?? 9) - (docTypeOrder[b.doc_type] ?? 9),
    );
    return {
      id: c.id,
      domain: c.domain,
      url: c.url,
      display_name: c.display_name,
      search_query: c.search_query,
      status: c.status,
      discovered_at: c.discovered_at,
      score: s ? s.score : null,
      reasons: s?.reasons ?? {},
      docCount: cdocs.length,
      totalChars: cdocs.reduce((n, d) => n + d.char_count, 0),
      substantial: cdocs.filter((d) => d.char_count >= SUBSTANTIAL_MIN).length,
      docs: cdocs,
    };
  });

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <nav className="mb-6 text-xs text-zinc-500">
        <Link href="/" className="underline hover:text-zinc-800">← 대시보드</Link>
      </nav>

      <header className="mb-8">
        <p className="text-xs uppercase tracking-widest text-zinc-500">discovery → scorer</p>
        <h1 className="mt-1 text-2xl font-semibold">후보 회사</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Discovery가 발굴 → Scorer가 &ldquo;기초 깔끔 점수&rdquo; 평가 (D13). 행을 누르면 콘텐츠가 펼쳐집니다.
        </p>
      </header>

      {error && (
        <p className="mb-4 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
          오류: {error.message}
        </p>
      )}

      <CandidateList rows={rows} total={count ?? rows.length} />
    </main>
  );
}
