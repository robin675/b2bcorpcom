import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-10">
        <p className="text-xs uppercase tracking-widest text-zinc-500">admin · v0 week 1</p>
        <h1 className="mt-2 text-2xl font-semibold">b2bcorpcom</h1>
        <p className="mt-1 text-sm text-zinc-600">
          로그인됨: <span className="font-mono">{user?.email}</span>
        </p>
      </header>

      <section className="rounded-lg border border-zinc-200 bg-white p-6">
        <h2 className="text-base font-semibold">아직 데이터가 없습니다.</h2>
        <p className="mt-2 text-sm text-zinc-600">
          이번 주 마일스톤은 &ldquo;로그인되고 빈 화면 뜸&rdquo;입니다 (PLAN.md §4).
          다음 주차에 Discovery Worker가 첫 후보를 적재하면 이 자리에 회사 리스트가 표시됩니다.
        </p>
      </section>

      <footer className="mt-10 text-xs text-zinc-500">
        <form action="/auth/sign-out" method="post">
          <button className="underline hover:text-zinc-800" type="submit">로그아웃</button>
        </form>
        <p className="mt-4">
          참고: <Link href="/forbidden" className="underline">forbidden</Link>
        </p>
      </footer>
    </main>
  );
}
