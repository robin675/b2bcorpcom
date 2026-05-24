import { sendMagicLink } from "./actions";

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  return <LoginInner searchParams={searchParams} />;
}

async function LoginInner({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const sp = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <div className="rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="text-xs uppercase tracking-widest text-zinc-500">b2bcorpcom · admin</p>
        <h1 className="mt-1 text-xl font-semibold">로그인</h1>
        <p className="mt-2 text-sm text-zinc-600">
          허용된 이메일로만 입장 가능합니다 (PLAN.md D15). 매직 링크를 보내드립니다.
        </p>

        <form action={sendMagicLink} className="mt-6 space-y-3">
          <label className="block">
            <span className="text-xs font-medium text-zinc-700">이메일</span>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            매직 링크 보내기
          </button>
        </form>

        {sp.sent && (
          <p className="mt-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            이메일을 확인해 보세요.
          </p>
        )}
        {sp.error && (
          <p className="mt-4 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
            오류: {sp.error}
          </p>
        )}
      </div>
    </main>
  );
}
