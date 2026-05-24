// Scorer prompt — evaluates whether a candidate company is a good
// "cleanly basic" reference (PLAN.md D13). Activity ≠ score; over-branded ⇒ low.
import { callClaude } from "./anthropic";

// Latest Haiku — fast and cheap for high-volume scoring.
export const SCORER_MODEL = "claude-haiku-4-5-20251001";

// Bumping this string invalidates cache lookups even on the same row, so
// rescoring picks up a new rubric. Stored on candidate_score.model_version.
export const SCORER_RUBRIC_VERSION = "v1.2026-05";

const RUBRIC = `당신은 한국 중견 B2B 제조·부품·소재 회사의 홈페이지를 평가합니다.
이 평가의 목적은 "Robin이 1회 마케팅 패키지(~20개 에셋)를 납품할 때 베껴올 형식이 있는 레퍼런스 회사인지" 판단하는 것입니다.

채점 철학 (매우 중요):
- **80~100점 = "기초만 깔끔히 해놓은 회사"**. 회사 소개 한 페이지, 보도자료 한두 건, 블로그 포스트가 형식적으로 정돈되어 있으면 충분.
- **활발도(글 수, 업데이트 빈도)는 점수 지표가 아닙니다.** 자주 글이 올라온다고 가산하지 마세요.
- **과도한 브랜딩은 감점**: 슬릭한 디자인, 풍부한 비주얼/영상, 정교한 마케팅 카피, 화려한 인터랙션 → 30~50점대로 낮춥니다. "베껴올 수 없을 만큼 잘된 곳"은 레퍼런스로 부적합.
- 카테고리 부적합(소비재 브랜드 / 서비스업 / 언론·포털·정부기관 / 채용 사이트 / 쇼핑몰)은 **0~10점**.
- 한국 중견 B2B 제조·부품·소재가 아니면 카테고리 부적합으로 봅니다.
- 정보가 너무 빈약(기본 회사 소개조차 없음)하면 30점 이하.

응답은 **순수 JSON 하나만** (마크다운 펜스 금지, 다른 설명 금지):
{
  "score": 정수 0~100,
  "reasons": {
    "category_fit": "한 줄: 한국 중견 B2B 제조사 적합 여부와 근거",
    "clean_basics": "한 줄: 회사 소개/보도자료/블로그 등 기초 자료 정돈 정도",
    "over_branded": "한 줄: 과도한 브랜딩 여부 (없으면 '해당 없음')",
    "verdict": "한 줄: 종합 판단"
  }
}`;

export interface ScoreReasons {
  category_fit: string;
  clean_basics: string;
  over_branded: string;
  verdict: string;
}

export interface ScoreResult {
  score: number;
  reasons: ScoreReasons;
  raw_response: string;
}

export async function scoreCandidate(opts: {
  apiKey: string;
  url: string;
  pageTitle: string | null;
  pageText: string;
}): Promise<ScoreResult> {
  const userMsg =
    `[URL] ${opts.url}\n` +
    `[TITLE] ${opts.pageTitle ?? "(none)"}\n` +
    `[HOMEPAGE TEXT]\n${opts.pageText}`;

  const { text } = await callClaude({
    apiKey: opts.apiKey,
    model: SCORER_MODEL,
    system: RUBRIC,
    cacheSystem: true,
    messages: [{ role: "user", content: userMsg }],
    maxTokens: 600,
    temperature: 0,
  });

  return parseScoreResponse(text);
}

export function parseScoreResponse(raw: string): ScoreResult {
  const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "");
  let parsed: { score?: unknown; reasons?: unknown };
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(`scorer: model returned non-JSON: ${raw.slice(0, 200)}`);
  }

  const score = typeof parsed.score === "number" ? Math.round(parsed.score) : NaN;
  if (!Number.isFinite(score) || score < 0 || score > 100) {
    throw new Error(`scorer: invalid score in response: ${cleaned.slice(0, 200)}`);
  }

  const r = parsed.reasons as Record<string, unknown> | undefined;
  const str = (v: unknown): string => (typeof v === "string" ? v : "");
  const reasons: ScoreReasons = {
    category_fit: str(r?.category_fit),
    clean_basics: str(r?.clean_basics),
    over_branded: str(r?.over_branded),
    verdict: str(r?.verdict),
  };

  return { score, reasons, raw_response: raw };
}
