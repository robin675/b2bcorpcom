import { env } from "@/lib/env";
import { sendMagicLink, signInWithPassword } from "./actions";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string; tab?: string }>;
}) {
  const sp = await searchParams;
  const defaultEmail = env.ALLOWED_EMAILS()[0] ?? "";
  const useMagic = sp.tab === "magic";

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <div className="rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="text-xs uppercase tracking-widest text-zinc-500">b2bcorpcom · admin</p>
        <h1 className="mt-1 text-xl font-semibold">로그인</h1>

        {sp.error && (
          <p className="mt-4 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
            오류: {sp.error}
          </p>
        )}

        {!useMagic ? (
          <form action={signInWithPassword} className="mt-6 space-y-3">
            <label className="block">
              <span className="text-xs font-medium text-zinc-700">이메일</span>
              <input
                type="email"
                name="email"
                required
                autoComplete="username"
                defaultValue={defaultEmail}
                readOnly={!!defaultEmail}
                className="mt-1 block w-full rounded-md border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 focus:border-zinc-500 focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-zinc-700">비밀번호</span>
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                autoFocus
                className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              로그인
            </button>
            <p className="pt-2 text-center text-xs text-zinc-500">
              비밀번호 없음?{" "}
              <a href="/login?tab=magic" className="underline hover:text-zinc-800">
                매직 링크로 1회 로그인
              </a>{" "}
              → 입장 후 비밀번호 설정
            </p>
          </form>
        ) : (
          <form action={sendMagicLink} className="mt-6 space-y-3">
            <label className="block">
              <span className="text-xs font-medium text-zinc-700">이메일</span>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                defaultValue={defaultEmail}
                readOnly={!!defaultEmail}
                className="mt-1 block w-full rounded-md border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 focus:border-zinc-500 focus:outline-none"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              매직 링크 보내기
            </button>
            <p className="pt-2 text-center text-xs text-zinc-500">
              <a href="/login" className="underline hover:text-zinc-800">← 비밀번호로 돌아가기</a>
            </p>
            {sp.sent && (
              <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                이메일을 확인해 보세요.
              </p>
            )}
          </form>
        )}
      </div>
    </main>
  );
}
