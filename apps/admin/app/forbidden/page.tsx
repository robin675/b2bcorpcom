export default function ForbiddenPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 text-center">
      <h1 className="text-xl font-semibold">접근 권한이 없습니다</h1>
      <p className="mt-2 text-sm text-zinc-600">
        이 이메일은 허용 목록에 없습니다 (PLAN.md D15).
      </p>
      <form action="/auth/sign-out" method="post" className="mt-6">
        <button className="text-sm underline" type="submit">로그아웃</button>
      </form>
    </main>
  );
}
