import Link from "next/link";
import { CONFIG_KEYS, type DiscoverySettings } from "@b2bcorpcom/db";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { saveDiscoveryKeywords, saveDiscoverySettings } from "./actions";

export const dynamic = "force-dynamic";

export default async function ConfigPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase
    .from("config")
    .select("key, value")
    .in("key", [CONFIG_KEYS.DiscoveryKeywords, CONFIG_KEYS.DiscoverySettings]);

  const keywordsRow = data?.find((r) => r.key === CONFIG_KEYS.DiscoveryKeywords);
  const settingsRow = data?.find((r) => r.key === CONFIG_KEYS.DiscoverySettings);

  const keywords: string[] = Array.isArray(keywordsRow?.value)
    ? (keywordsRow.value as unknown[]).filter((v): v is string => typeof v === "string")
    : [];

  const settings: DiscoverySettings =
    settingsRow?.value && typeof settingsRow.value === "object" && !Array.isArray(settingsRow.value)
      ? (settingsRow.value as DiscoverySettings)
      : { max_results_per_query: 30, search_engine: "naver" };

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <nav className="mb-6 text-xs text-zinc-500">
        <Link href="/" className="underline hover:text-zinc-800">← 대시보드</Link>
      </nav>

      <header className="mb-8">
        <p className="text-xs uppercase tracking-widest text-zinc-500">operator config</p>
        <h1 className="mt-1 text-2xl font-semibold">운영 파라미터</h1>
        <p className="mt-1 text-sm text-zinc-600">
          코드 수정 없이 GUI에서 변경 가능한 값입니다 (PLAN.md D15). 저장 즉시 다음 Discovery 실행부터 반영됩니다.
        </p>
      </header>

      {sp.saved && (
        <p className="mb-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          저장되었습니다.
        </p>
      )}
      {sp.error && (
        <p className="mb-4 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
          오류: {sp.error}
        </p>
      )}

      <section className="mb-8 rounded-lg border border-zinc-200 bg-white p-6">
        <h2 className="text-base font-semibold">Discovery 키워드</h2>
        <p className="mt-1 text-sm text-zinc-600">
          한 줄에 하나씩. 각 키워드마다 Naver 검색이 돌고, 결과 URL 중 비-블로그·비-뉴스 도메인이 후보로 적재됩니다.
        </p>
        <form action={saveDiscoveryKeywords} className="mt-4 space-y-3">
          <textarea
            name="keywords"
            rows={10}
            defaultValue={keywords.join("\n")}
            className="block w-full rounded-md border border-zinc-300 px-3 py-2 font-mono text-sm focus:border-zinc-500 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            키워드 저장
          </button>
        </form>
      </section>

      <section className="rounded-lg border border-zinc-200 bg-white p-6">
        <h2 className="text-base font-semibold">Discovery 설정</h2>
        <form action={saveDiscoverySettings} className="mt-4 space-y-4">
          <label className="block">
            <span className="text-xs font-medium text-zinc-700">쿼리당 최대 결과 수 (1–100)</span>
            <input
              type="number"
              name="max_results_per_query"
              min={1}
              max={100}
              defaultValue={settings.max_results_per_query}
              className="mt-1 block w-32 rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
            />
          </label>
          <p className="text-xs text-zinc-500">
            검색 엔진: <span className="font-mono">{settings.search_engine}</span> (D26 — 변경하려면 코드 작업 필요)
          </p>
          <button
            type="submit"
            className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            설정 저장
          </button>
        </form>
      </section>
    </main>
  );
}
