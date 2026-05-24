import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ count: candidateCount }, { count: runCount }, { data: latestRun }] = await Promise.all([
    supabase.from("candidate").select("*", { count: "exact", head: true }),
    supabase.from("discovery_run").select("*", { count: "exact", head: true }),
    supabase
      .from("discovery_run")
      .select("started_at, status, query, candidates_found")
      .order("started_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-10">
        <p className="text-xs uppercase tracking-widest text-zinc-500">admin · v0 week 2</p>
        <h1 className="mt-2 text-2xl font-semibold">b2bcorpcom</h1>
        <p className="mt-1 text-sm text-zinc-600">
          로그인됨: <span className="font-mono">{user?.email}</span>
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/candidates"
          className="rounded-lg border border-zinc-200 bg-white p-6 transition hover:border-zinc-400"
        >
          <p className="text-xs uppercase tracking-widest text-zinc-500">후보 회사</p>
          <p className="mt-2 text-3xl font-semibold">{candidateCount ?? 0}</p>
          <p className="mt-1 text-xs text-zinc-500">Discovery가 발굴한 도메인 → 리스트 보기</p>
        </Link>

        <Link
          href="/config"
          className="rounded-lg border border-zinc-200 bg-white p-6 transition hover:border-zinc-400"
        >
          <p className="text-xs uppercase tracking-widest text-zinc-500">운영 파라미터</p>
          <p className="mt-2 text-3xl font-semibold">⚙</p>
          <p className="mt-1 text-xs text-zinc-500">키워드·임계점 등 GUI에서 수정 (D15)</p>
        </Link>
      </section>

      <section className="mt-8 rounded-lg border border-zinc-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-zinc-700">최근 Discovery 실행</h2>
        {latestRun ? (
          <dl className="mt-3 grid grid-cols-2 gap-y-1 text-sm">
            <dt className="text-zinc-500">시각</dt>
            <dd>{new Date(latestRun.started_at).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}</dd>
            <dt className="text-zinc-500">상태</dt>
            <dd className="font-mono">{latestRun.status}</dd>
            <dt className="text-zinc-500">쿼리</dt>
            <dd className="font-mono text-xs">{latestRun.query}</dd>
            <dt className="text-zinc-500">신규 후보</dt>
            <dd>{latestRun.candidates_found}</dd>
          </dl>
        ) : (
          <p className="mt-2 text-sm text-zinc-500">
            아직 실행되지 않았습니다 ({runCount ?? 0}건). Cron이 처음 돌면 여기 표시됩니다.
          </p>
        )}
      </section>

      <footer className="mt-10 text-xs text-zinc-500">
        <form action="/auth/sign-out" method="post">
          <button className="underline hover:text-zinc-800" type="submit">로그아웃</button>
        </form>
      </footer>
    </main>
  );
}
