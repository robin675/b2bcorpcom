"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export type Reasons = {
  category_fit?: string;
  clean_basics?: string;
  over_branded?: string;
  verdict?: string;
};

export type DocCard = {
  id: string;
  doc_type: string;
  title: string | null;
  source_url: string;
  excerpt: string;
  truncated: boolean;
  char_count: number;
  fetch_source: string | null;
};

export type CandidateRow = {
  id: string;
  domain: string;
  url: string;
  display_name: string | null;
  search_query: string | null;
  status: string;
  discovered_at: string;
  score: number | null;
  reasons: Reasons;
  docCount: number;
  totalChars: number;
  substantial: number;
  docs: DocCard[];
};

type SortKey = "score" | "substantial" | "chars" | "docs" | "recent";
type FilterKey = "all" | "s80" | "s50" | "low" | "content";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "score", label: "점수순" },
  { key: "substantial", label: "충실한 콘텐츠순" },
  { key: "chars", label: "콘텐츠 총량순" },
  { key: "docs", label: "콘텐츠 수순" },
  { key: "recent", label: "최신 발견순" },
];

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "s80", label: "80+" },
  { key: "s50", label: "50–79" },
  { key: "low", label: "50↓" },
  { key: "content", label: "콘텐츠 보유" },
];

const DOC_LABEL: Record<string, string> = {
  about: "회사 소개",
  press: "보도자료",
  blog: "블로그",
};

const DOC_ACCENT: Record<string, string> = {
  about: "bg-sky-100 text-sky-700",
  press: "bg-amber-100 text-amber-700",
  blog: "bg-violet-100 text-violet-700",
};

function fmtChars(n: number): string {
  if (n >= 10000) return `${(n / 1000).toFixed(0)}k`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function num(v: number | null): number {
  return v == null ? -1 : v;
}

export function CandidateList({ rows, total }: { rows: CandidateRow[]; total: number }) {
  const [sort, setSort] = useState<SortKey>("score");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const visible = useMemo(() => {
    let r = rows;
    if (filter === "s80") r = r.filter((x) => num(x.score) >= 80);
    else if (filter === "s50") r = r.filter((x) => num(x.score) >= 50 && num(x.score) < 80);
    else if (filter === "low") r = r.filter((x) => num(x.score) < 50);
    else if (filter === "content") r = r.filter((x) => x.docCount > 0);

    return [...r].sort((a, b) => {
      switch (sort) {
        case "score":
          return num(b.score) - num(a.score) || b.totalChars - a.totalChars;
        case "substantial":
          return b.substantial - a.substantial || b.totalChars - a.totalChars;
        case "chars":
          return b.totalChars - a.totalChars;
        case "docs":
          return b.docCount - a.docCount || b.totalChars - a.totalChars;
        case "recent":
          return +new Date(b.discovered_at) - +new Date(a.discovered_at);
        default:
          return 0;
      }
    });
  }, [rows, sort, filter]);

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <section className="rounded-lg border border-zinc-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 px-4 py-3">
        <h2 className="text-sm font-medium text-zinc-700">
          전체 {total}개
          {filter !== "all" && <span className="text-zinc-400"> · 필터 {visible.length}개</span>}
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
                filter === f.key
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 border-b border-zinc-100 bg-zinc-50/60 px-4 py-2">
        <span className="mr-1 text-xs text-zinc-400">정렬</span>
        {SORTS.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setSort(s.key)}
            className={`rounded-md px-2 py-1 text-xs transition ${
              sort === s.key
                ? "bg-white font-medium text-zinc-900 shadow-sm ring-1 ring-zinc-200"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="px-4 py-12 text-center text-sm text-zinc-500">조건에 맞는 후보가 없습니다.</p>
      ) : (
        <ul className="divide-y divide-zinc-100">
          {visible.map((c) => {
            const open = expanded.has(c.id);
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => toggle(c.id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-zinc-50"
                >
                  <span
                    className={`grid h-5 w-5 shrink-0 place-items-center text-zinc-400 transition-transform ${
                      open ? "rotate-90" : ""
                    }`}
                    aria-hidden
                  >
                    ›
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline gap-2">
                      <span className="truncate font-mono text-sm text-zinc-900">{c.domain}</span>
                      {c.display_name && (
                        <span className="truncate text-xs text-zinc-500">{c.display_name}</span>
                      )}
                    </span>
                    {c.reasons.verdict && (
                      <span className="mt-0.5 block truncate text-xs text-zinc-500">
                        {c.reasons.verdict}
                      </span>
                    )}
                  </span>
                  <span className="flex shrink-0 items-center gap-3 text-xs">
                    <Metric label="콘텐츠" value={c.docCount} />
                    <Metric label="충실" value={c.substantial} />
                    <Metric label="총량" value={fmtChars(c.totalChars)} />
                    <ScoreBadge score={c.score} />
                  </span>
                </button>
                {open && <ExpandedDetail c={c} />}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <span className="hidden flex-col items-end leading-tight sm:flex">
      <span className="font-medium text-zinc-700">{value}</span>
      <span className="text-[10px] text-zinc-400">{label}</span>
    </span>
  );
}

function ScoreBadge({ score }: { score: number | null }) {
  if (score == null) return <span className="text-zinc-300">—</span>;
  const cls =
    score >= 80
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : score >= 50
        ? "bg-zinc-100 text-zinc-700 ring-zinc-200"
        : "bg-zinc-50 text-zinc-400 ring-zinc-200";
  return (
    <span className={`inline-flex w-9 justify-center rounded-md py-1 font-semibold ring-1 ${cls}`}>
      {score}
    </span>
  );
}

function ExpandedDetail({ c }: { c: CandidateRow }) {
  const hasReasons = c.reasons.category_fit || c.reasons.clean_basics || c.reasons.over_branded;
  return (
    <div className="border-t border-zinc-100 bg-zinc-50/50 px-4 py-4">
      {hasReasons && (
        <dl className="mb-4 grid gap-2 text-xs text-zinc-600 sm:grid-cols-3">
          {c.reasons.category_fit && (
            <div className="rounded-md bg-white p-2 ring-1 ring-zinc-100">
              <dt className="font-medium text-zinc-700">카테고리</dt>
              <dd className="mt-0.5">{c.reasons.category_fit}</dd>
            </div>
          )}
          {c.reasons.clean_basics && (
            <div className="rounded-md bg-white p-2 ring-1 ring-zinc-100">
              <dt className="font-medium text-zinc-700">기초</dt>
              <dd className="mt-0.5">{c.reasons.clean_basics}</dd>
            </div>
          )}
          {c.reasons.over_branded && (
            <div className="rounded-md bg-white p-2 ring-1 ring-zinc-100">
              <dt className="font-medium text-zinc-700">브랜딩</dt>
              <dd className="mt-0.5">{c.reasons.over_branded}</dd>
            </div>
          )}
        </dl>
      )}

      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-xs text-zinc-500">
          수집 콘텐츠 {c.docCount}건 · 총 {c.totalChars.toLocaleString()}자
        </p>
        <div className="flex shrink-0 gap-3 text-xs">
          <a
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 underline hover:text-zinc-800"
          >
            홈페이지 ↗
          </a>
          <Link href={`/candidates/${c.id}`} className="text-zinc-500 underline hover:text-zinc-800">
            전체 페이지 →
          </Link>
        </div>
      </div>

      {c.docs.length === 0 ? (
        <p className="rounded-md border border-dashed border-zinc-300 bg-white px-4 py-8 text-center text-xs text-zinc-500">
          아직 수집된 콘텐츠가 없습니다.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {c.docs.map((d) => (
            <DocCardView key={d.id} d={d} />
          ))}
        </div>
      )}
    </div>
  );
}

function DocCardView({ d }: { d: DocCard }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <div className="flex items-center justify-between px-3 pt-3">
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
            DOC_ACCENT[d.doc_type] ?? "bg-zinc-100 text-zinc-600"
          }`}
        >
          {DOC_LABEL[d.doc_type] ?? d.doc_type}
        </span>
        <span className="text-[10px] text-zinc-400">{d.char_count.toLocaleString()}자</span>
      </div>
      <h4 className="line-clamp-2 px-3 pt-2 text-sm font-medium text-zinc-800">
        {d.title ?? "(제목 없음)"}
      </h4>
      <p className="line-clamp-6 px-3 pb-3 pt-1.5 text-xs leading-relaxed text-zinc-600">
        {d.excerpt}
        {d.truncated ? "…" : ""}
      </p>
      <div className="mt-auto flex items-center justify-between gap-2 border-t border-zinc-100 px-3 py-2">
        <a
          href={d.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="truncate text-[10px] text-zinc-400 underline hover:text-zinc-700"
        >
          원문 ↗
        </a>
        {d.fetch_source && (
          <span className="shrink-0 font-mono text-[10px] text-zinc-300">{d.fetch_source}</span>
        )}
      </div>
    </article>
  );
}
