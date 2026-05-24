import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { setPassword } from "./actions";

export const dynamic = "force-dynamic";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string; first?: string }>;
}) {
  const sp = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="mx-auto max-w-md px-6 py-12">
      <nav className="mb-6 text-xs text-zinc-500">
        <Link href="/" className="underline hover:text-zinc-800">← 대시보드</Link>
      </nav>

      <header className="mb-8">
        <p className="text-xs uppercase tracking-widest text-zinc-500">account</p>
        <h1 className="mt-1 text-2xl font-semibold">비밀번호 설정</h1>
        <p className="mt-1 text-sm text-zinc-600">
          로그인됨: <span className="font-mono">{user?.email}</span>
        </p>
      </header>

      {sp.first === "1" && (
        <p className="mb-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
          비밀번호 한 번 설정해두면 다음부터 매직 링크 없이 바로 들어올 수 있습니다.
        </p>
      )}
      {sp.saved && (
        <p className="mb-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          저장되었습니다. 다음 로그인부터 사용하세요.
        </p>
      )}
      {sp.error && (
        <p className="mb-4 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
          오류: {sp.error}
        </p>
      )}

      <form action={setPassword} className="space-y-3 rounded-lg border border-zinc-200 bg-white p-6">
        <input type="email" name="email" autoComplete="username" defaultValue={user?.email ?? ""} hidden readOnly />
        <label className="block">
          <span className="text-xs font-medium text-zinc-700">새 비밀번호 (8자 이상)</span>
          <input
            type="password"
            name="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-zinc-700">한 번 더 확인</span>
          <input
            type="password"
            name="password_confirm"
            required
            minLength={8}
            autoComplete="new-password"
            className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          비밀번호 저장
        </button>
      </form>
    </main>
  );
}
