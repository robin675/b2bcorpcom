// Naver "webkr" Open Search API client (per PLAN.md D26).
// Docs: https://developers.naver.com/docs/serviceapi/search/web/web.md

const NAVER_WEBKR = "https://openapi.naver.com/v1/search/webkr.json";

export interface NaverSearchItem {
  title: string;
  link: string;
  description: string;
}

interface NaverWebkrResponse {
  total: number;
  start: number;
  display: number;
  items: NaverSearchItem[];
}

export async function naverSearchWebkr(opts: {
  clientId: string;
  clientSecret: string;
  query: string;
  display: number;
}): Promise<NaverSearchItem[]> {
  const url = new URL(NAVER_WEBKR);
  url.searchParams.set("query", opts.query);
  url.searchParams.set("display", String(Math.min(Math.max(opts.display, 1), 100)));

  const res = await fetch(url, {
    headers: {
      "X-Naver-Client-Id": opts.clientId,
      "X-Naver-Client-Secret": opts.clientSecret,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Naver search failed: ${res.status} ${res.statusText} — ${body.slice(0, 200)}`);
  }

  const json = (await res.json()) as NaverWebkrResponse;
  return json.items ?? [];
}

// Strip Naver's <b>...</b> highlight tags from titles.
export function stripHighlight(html: string): string {
  return html.replace(/<\/?b>/g, "").trim();
}
