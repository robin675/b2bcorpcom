import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Reasons = {
  category_fit?: string;
  clean_basics?: string;
  over_branded?: string;
  verdict?: string;
};

const DOC_TYPE_LABEL: Record<string, string> = {
  about: "회사 소개",
  press: "보도자료",
  blog: "블로그",
};

export default async function CandidateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: candidate } = await supabase
    .from("candidate")
    .select(
      "id, url, domain, display_name, search_query, status, discovered_at, fetch_failed_count, next_attempt_after",
    )
    .eq("id", id)
    .maybeSingle();

  if (!candidate) notFound();

  const [{ data: scores }, { data: documents }] = await Promise.all([
    supabase
      .from("candidate_score")
      .select("score, reasons, model_version, evaluated_at")
      .eq("candidate_id", id)
      .order("evaluated_at", { ascending: false })
      .limit(1),
    supabase
      .from("document")
      .select("id, source_url, doc_type, title, normalized_text, fetch_source, fetched_at")
      .eq("candidate_id", id)
      .order("doc_type", { ascending: true })
      .order("fetched_at", { ascending: false }),
  ]);

  const score = scores?.[0];
  const reasons = (score?.reasons ?? {}) as Reasons;
  const docs = documents ?? [];
  const backedOff =
    candidate.next_attempt_after && new Date(candidate.next_attempt_after) > new Date();

  const byType = new Map<string, typeof docs>();
  for (const d of docs) {
    const arr = byType.get(d.doc_type) ?? [];
    arr.push(d);
    byType.set(d.doc_type, arr);
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <nav className="mb-6 text-xs text-zinc-500">
        <Link href="/candidates" className="underline hover:text-zinc-800">
          ← 후보 리스트
        </Link>
      </nav>

      <header className="mb-8">
        <p className="text-xs uppercase tracking-widest text-zinc-500">candidate detail</p>
        <h1 className="mt-1 font-mono text-2xl font-semibold">{candidate.domain}</h1>
        <p className="mt-1 text-sm text-zinc-700">{candidate.display_name ?? "—"}</p>
        <a
          href={candidate.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-block text-xs text-zinc-500 underline hover:text-zinc-800"
        >
          {candidate.url} ↗
        </a>
      </header>

      <section className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <p className="text-xs uppercase tracking-widest text-zinc-500">점수</p>
          <p
            className={`mt-1 text-3xl font-semibold ${
              !score
                ? "text-zinc-300"
                : Number(score.score) >= 80
                  ? "text-emerald-700"
                  : Number(score.score) >= 50
                    ? "text-zinc-700"
                    : "text-zinc-400"
            }`}
          >
            {score ? Number(score.score) : "—"}
          </p>
          {score?.model_version && (
            <p className="mt-1 text-[10px] font-mono text-zinc-400">{score.model_version}</p>
          )}
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <p className="text-xs uppercase tracking-widest text-zinc-500">수집된 콘텐츠</p>
          <p className="mt-1 text-3xl font-semibold">{docs.length}</p>
          <p className="mt-1 text-[11px] text-zinc-500">
            about {byType.get("about")?.length ?? 0} · press {byType.get("press")?.length ?? 0} · blog {byType.get("blog")?.length ?? 0}
          </p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Fetch 상태</p>
          {backedOff ? (
            <>
              <p className="mt-1 text-base font-semibold text-rose-700">14일 backoff</p>
              <p className="mt-1 text-[11px] text-zinc-500">
                재시도: {new Date(candidate.next_attempt_after!).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}
              </p>
            </>
          ) : (
            <>
              <p className="mt-1 text-base font-semibold text-zinc-700">활성</p>
              <p className="mt-1 text-[11px] text-zinc-500">
                실패 카운터: {candidate.fetch_failed_count}
              </p>
            </>
          )}
        </div>
      </section>

      {reasons.verdict && (
        <section className="mb-8 rounded-lg border border-zinc-200 bg-white p-4">
          <p className="text-xs uppercase tracking-widest text-zinc-500">평가</p>
          <p className="mt-2 text-sm font-medium text-zinc-800">{reasons.verdict}</p>
          <dl className="mt-3 space-y-1 text-xs text-zinc-600">
            {reasons.category_fit && (
              <div>
                <dt className="inline font-medium text-zinc-700">카테고리: </dt>
                <dd className="inline">{reasons.category_fit}</dd>
              </div>
            )}
            {reasons.clean_basics && (
              <div>
                <dt className="inline font-medium text-zinc-700">기초: </dt>
                <dd className="inline">{reasons.clean_basics}</dd>
              </div>
            )}
            {reasons.over_branded && (
              <div>
                <dt className="inline font-medium text-zinc-700">브랜딩: </dt>
                <dd className="inline">{reasons.over_branded}</dd>
              </div>
            )}
          </dl>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-base font-semibold text-zinc-800">수집된 콘텐츠</h2>
        {docs.length === 0 ? (
          <p className="rounded-lg border border-dashed border-zinc-300 bg-white px-4 py-12 text-center text-sm text-zinc-500">
            아직 수집된 콘텐츠가 없습니다.
          </p>
        ) : (
          <div className="space-y-6">
            {(["about", "press", "blog"] as const).map((type) => {
              const items = byType.get(type) ?? [];
              if (items.length === 0) return null;
              return (
                <div key={type}>
                  <h3 className="mb-2 text-sm font-medium text-zinc-700">
                    {DOC_TYPE_LABEL[type]} ({items.length})
                  </h3>
                  <ul className="space-y-3">
                    {items.map((d) => (
                      <li
                        key={d.id}
                        className="rounded-lg border border-zinc-200 bg-white p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-zinc-800">
                              {d.title ?? "(제목 없음)"}
                            </p>
                            <a
                              href={d.source_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-1 inline-block truncate font-mono text-[11px] text-zinc-500 underline hover:text-zinc-700"
                            >
                              {d.source_url} ↗
                            </a>
                          </div>
                          <div className="text-right text-[11px] text-zinc-500">
                            <p>{d.normalized_text?.length ?? 0} 자</p>
                            <p className="font-mono">{d.fetch_source ?? "—"}</p>
                          </div>
                        </div>
                        {d.normalized_text && (
                          <details className="mt-3 text-xs">
                            <summary className="cursor-pointer text-zinc-500 hover:text-zinc-700">
                              본문 미리보기
                            </summary>
                            <p className="mt-2 whitespace-pre-wrap break-words text-zinc-700">
                              {d.normalized_text.slice(0, 1500)}
                              {d.normalized_text.length > 1500 ? "…" : ""}
                            </p>
                          </details>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
