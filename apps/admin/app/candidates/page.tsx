import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 100;

type Reasons = {
  category_fit?: string;
  clean_basics?: string;
  over_branded?: string;
  verdict?: string;
};

export default async function CandidatesPage() {
  const supabase = await createSupabaseServerClient();

  const { data: candidates, error, count } = await supabase
    .from("candidate")
    .select("id, domain, url, display_name, search_query, status, discovered_at", { count: "exact" })
    .order("discovered_at", { ascending: false })
    .limit(PAGE_SIZE);

  const ids = (candidates ?? []).map((c) => c.id);
  const [{ data: scores }, { data: docCounts }] = await Promise.all([
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
          .select("candidate_id")
          .in("candidate_id", ids)
      : Promise.resolve({ data: [] as { candidate_id: string }[] }),
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

  const docCountByCandidate = new Map<string, number>();
  for (const d of docCounts ?? []) {
    if (!d.candidate_id) continue;
    docCountByCandidate.set(d.candidate_id, (docCountByCandidate.get(d.candidate_id) ?? 0) + 1);
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <nav className="mb-6 text-xs text-zinc-500">
        <Link href="/" className="underline hover:text-zinc-800">← 대시보드</Link>
      </nav>

      <header className="mb-8">
        <p className="text-xs uppercase tracking-widest text-zinc-500">discovery → scorer</p>
        <h1 className="mt-1 text-2xl font-semibold">후보 회사</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Discovery가 발굴 → Scorer가 &ldquo;기초 깔끔 점수&rdquo; 평가 (D13). 80점 이상이 시드 채택 후보입니다.
        </p>
      </header>

      {error && (
        <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
          오류: {error.message}
        </p>
      )}

      <section className="rounded-lg border border-zinc-200 bg-white">
        <div className="flex items-baseline justify-between border-b border-zinc-100 px-4 py-3">
          <h2 className="text-sm font-medium text-zinc-700">
            전체 {count ?? 0}개 (최근 {candidates?.length ?? 0}개 표시)
          </h2>
          <Link href="/config" className="text-xs text-zinc-500 underline hover:text-zinc-800">
            키워드 편집 →
          </Link>
        </div>

        {!candidates || candidates.length === 0 ? (
          <p className="px-4 py-12 text-center text-sm text-zinc-500">
            아직 발굴된 후보가 없습니다. Discovery Worker가 첫 Cron(매일 04:00 KST)에 실행되면 여기 채워집니다.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-4 py-2 font-medium">도메인</th>
                <th className="px-4 py-2 font-medium">표시명</th>
                <th className="px-4 py-2 font-medium">검색어</th>
                <th className="px-4 py-2 font-medium">상태</th>
                <th className="px-4 py-2 font-medium">점수</th>
                <th className="px-4 py-2 font-medium">콘텐츠</th>
                <th className="px-4 py-2 font-medium">평가</th>
                <th className="px-4 py-2 font-medium">발견 시각</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((c) => {
                const s = scoreByCandidate.get(c.id);
                const docCount = docCountByCandidate.get(c.id) ?? 0;
                return (
                  <tr key={c.id} className="border-t border-zinc-100 align-top">
                    <td className="px-4 py-2 font-mono text-xs">
                      <Link
                        href={`/candidates/${c.id}`}
                        className="text-zinc-900 underline hover:text-zinc-600"
                      >
                        {c.domain}
                      </Link>
                    </td>
                    <td className="px-4 py-2 text-zinc-700">{c.display_name ?? "—"}</td>
                    <td className="px-4 py-2 text-zinc-500">{c.search_query ?? "—"}</td>
                    <td className="px-4 py-2">
                      <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700">
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {s ? (
                        <span
                          className={
                            s.score >= 80
                              ? "font-semibold text-emerald-700"
                              : s.score >= 50
                                ? "text-zinc-700"
                                : "text-zinc-400"
                          }
                        >
                          {s.score}
                        </span>
                      ) : (
                        <span className="text-zinc-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-xs">
                      {docCount > 0 ? (
                        <Link
                          href={`/candidates/${c.id}`}
                          className="font-semibold text-zinc-800 underline hover:text-zinc-600"
                        >
                          {docCount}건
                        </Link>
                      ) : (
                        <span className="text-zinc-300">—</span>
                      )}
                    </td>
                    <td className="max-w-md px-4 py-2 text-xs text-zinc-600">
                      {s?.reasons.verdict ? (
                        <details>
                          <summary className="cursor-pointer">{s.reasons.verdict}</summary>
                          <dl className="mt-2 space-y-1 text-[11px] text-zinc-500">
                            {s.reasons.category_fit && (
                              <div>
                                <dt className="inline font-medium">카테고리: </dt>
                                <dd className="inline">{s.reasons.category_fit}</dd>
                              </div>
                            )}
                            {s.reasons.clean_basics && (
                              <div>
                                <dt className="inline font-medium">기초: </dt>
                                <dd className="inline">{s.reasons.clean_basics}</dd>
                              </div>
                            )}
                            {s.reasons.over_branded && (
                              <div>
                                <dt className="inline font-medium">브랜딩: </dt>
                                <dd className="inline">{s.reasons.over_branded}</dd>
                              </div>
                            )}
                          </dl>
                        </details>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-2 text-xs text-zinc-500">
                      {new Date(c.discovered_at).toLocaleString("ko-KR", {
                        timeZone: "Asia/Seoul",
                        year: "2-digit",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
