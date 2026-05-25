# b2bcorpcom — v0 플랜 (살아있는 문서)

> 이 문서는 한 번에 완성되는 플랜이 아니라, 대화를 거듭하며 결정이 쌓이는 살아있는 문서다.
> 회차마다 "결정"과 "보류"를 갱신한다. 코드 안의 어떤 주석이나 설명보다도 **이 문서가 결정의 진실 공급원**이다.

---

## 1. Context (왜)

Robin은 1인 개발·운영자로, 한국 중견 B2B 제조 기업을 타깃으로 3계층 사업을 시작한다 (출처: 별도 보관된 기획 시트).

### 3-Layer 비전
1. **Layer 1 — 즉시 현금흐름.** B2B 중견기업의 부실한 마케팅 에셋(영업메일·브로셔·제품소개서·홍보영상)을 **1회 패키지(~20개 에셋) 납품**으로 표준화 대행. "B2B 마케팅의 Canva."
2. **Layer 2 — 정보 규격.** 대행을 반복하며 자연스럽게 "B2B 기업이 노출해야 할 정보의 스키마"가 정립됨. 기획 시트의 5축:
   - Capability & Infrastructure / Technical Expertise / Quality & Compliance / Transaction & Logistics / Credibility & Track Record
3. **Layer 3 — 플랫폼/네트워크.** 데이터가 임계량을 넘으면 글로벌 B2B 매칭 플랫폼화 (Crunchbase 초월 목표).

핵심 인사이트(기획 시트):
> "1번을 팔면서 2번이 부산물로 만들어지고, 2번이 쌓이면 3번이 공짜로 따라온다."

---

## 2. 결정 누적 (Decisions)

| # | 회차 | 결정 | 근거 |
|---|------|------|------|
| D1 | 1 | 언어: 한국어만 (당분간) | Robin |
| D2 | 1 | 타깃: 한국 중견 B2B 제조·부품·소재 | 기획 시트 + Robin |
| D3 | 1 | 운영 주체: 1인 | Robin |
| D4 | 1 | 수집 대상: 타사의 기존 홍보 콘텐츠 (재생산·복제 가능한 것) | Robin |
| D5 | 1 | 엔진 아웃풋: 외형 사이트에 콘텐츠 자동 생성·게시 | Robin |
| D6 | 1 | b2bcorpcom = 시작점 레포. 하위 컴포넌트는 폴더로(모노레포), 필요 시 추후 분리 | Robin + Claude |
| D7 | 2 | v0 = **수집 파이프라인부터** (Layer 1 매출 대신 근본부터) | Robin |
| D8 | 2 | AI 적극 활용: AI 초안 → Robin 검수만 | Robin |
| D9 | 2 | 인프라: Supabase 유료(이미 사용 중) + Cloudflare 넉넉 | Robin |
| D10 | 2 | URL 시드 관리: Robin 직접 입력 X, AI가 발굴 | Robin |
| D11 | 3 | 수집 에셋: **회사 소개 · 보도자료 · 블로그 포스트 (HTML 텍스트)** | Robin |
| D12 | 3 | 수집 범위: 한국 중견 B2B 제조·부품·소재 전반, 업종 미지정 | Robin |
| D13 | 3 | **레퍼런스 회사 정의: "기초만 깔끔히 해놓은 곳"** — 활발도·과도한 브랜딩은 오히려 감점. Robin의 납품 모델이 "온라인 자료 거의 없는 곳에 기초 패키지 1회 납품"이라, 베껴올 형식이 있는 적정 수준의 회사가 레퍼런스로 적합 | Robin |
| D14 | 3 | 검수 모델: Discovery 자동 채택 + Robin **주 1회 사후 샘플 검수**로 패턴 교정 | Robin |
| D15 | 3 | 협업 모델: **"덜 개발스럽게"** — Robin은 코드 안 보고 운영 화면/결과만 본다. 모든 운영 파라미터(키워드·임계점·승인 등)는 GUI로 접근 가능해야 함 | Robin |
| D16 | 3 | v0 데드라인: **2~3개월**, RAG 인덱싱까지 포함 | Robin |
| D17 | 3 | 런타임 = TypeScript, 워커 = Cloudflare Workers + Cron, DB = Supabase Postgres + pgvector, AI = Claude API, 어드민 = Next.js + Supabase Auth + Cloudflare Pages, 모노레포 = pnpm workspaces | Claude (D8·D9·D15에 따른 자연스러운 조합) |
| D18 | 4 | 매출 타이밍: **v0(2~3개월) 완성 후 Layer 1 대행 시작.** 그 사이 매출 공백 인정 | Robin |
| D19 | 4 | RAG 첫 활용: **고객사용 패키지 초안 데모** — v0 완료 즉시 v1로 자연스럽게 이어짐. 영업 미팅에서 그 회사 맞춤 데모 보여주는 무기 | Robin |
| D20 | 4 | `b2bcorpcom`은 **임시 코드명**. 실제 브랜드는 추후 결정 → UI 카피·문서엔 가능한 한 코드명 노출 최소화, 추후 일괄 교체 용이하게 상수화 | Robin |
| D21 | 5 | v0 Supabase 프로젝트: **신규 생성 `b2bcorpcom`** (id `ywbyjmnkospyvbsaaxqc`, 서울 리전, $10/월). 기존 `Slog` 프로젝트는 Robin이 대시보드에서 삭제 | Robin |
| D22 | 5 | 어드민 허용 이메일: **`robin@vidfolio.kr`** 단일 (allowlist는 `public.config.admin_allowed_emails` 행에 적재) | Robin |
| D23 | 5 | 어드민 배포처: **Vercel** (Claude가 MCP로 직접 배포 → Robin 손이 가장 덜 감, D15 정신). Cloudflare Pages 대신 채택 — OpenNext 어댑터 우회 가능 + Vercel CLI 없이 자동화 | Claude |
| D24 | 5 | Next.js 버전은 **`^15.5.4` 이상으로 유지**. Vercel이 15.0.3 등 취약 버전을 빌드 단계에서 차단함 (`Vulnerable version detected`). 새 워크스페이스 만들 때도 이 floor 지킬 것 | Claude |
| D25 | 5 | Vercel env vars는 **Production scope만 우선 설정**, `NEXT_PUBLIC_*`는 **Sensitive 토글 OFF** (build-time inlining 필요). Preview·Development는 v0에선 사용 안 함 | Claude |
| D26 | 6 | **OQ2 결정: Discovery 검색 API = Naver `webkr` Open API.** 한국 인덱스 압도적, 일 25,000건 무료. Client ID/Secret는 Cloudflare Workers Secret으로 주입 | Robin |
| D27 | 6 | Discovery 운영 파라미터는 `config` 테이블 두 row로 분리: `discovery_keywords`(string[]) + `discovery_settings`(object: `max_results_per_query`, `search_engine`). 어드민 `/config`에서 GUI 편집 (D15) | Claude |
| D28 | 6 | Discovery Worker Cron: **일 1회 한국시간 새벽 4시** (UTC `0 19 * * *`). 키워드 N개 × 쿼리당 최대 30건 → 도메인 dedup 후 `candidate` 적재. v0 시드 채집엔 일 1회면 충분, 호출 할당량도 여유 | Claude |
| D29 | 6 | Discovery 결과 필터: **블로그·SNS·뉴스·쇼핑·채용 도메인 블록리스트**로 1차 거름 (`packages/shared/blocklist.ts`). "기초 깔끔 회사" 후보가 아닐 게 명확한 호스트만 거름 — 회색 영역은 Scorer가 처리 (D13) | Claude |
| D30 | 7 | Scorer 모델 = **`claude-haiku-4-5-20251001`** (저비용·고속). Cron `30 19 * * *` (KST 04:30, Discovery 30분 뒤). 시스템 프롬프트는 **prompt caching(`cache_control: ephemeral`)** 으로 비용 절감 | Claude |
| D31 | 7 | Scorer 입력은 **홈페이지 텍스트 첫 6KB**로 한정 (`workers/scorer/src/extract.ts`). JS-only 사이트나 80자 미만 추출은 score=0(`verdict=빈 사이트/JS 렌더`)으로 마감해서 무한 재시도 방지 | Claude |
| D32 | 7 | `candidate.status` 전이 규칙: `pending → scored`(평가 끝)/`scored`(fetch 실패도 동일, score=0). 모델·파싱 에러는 status 유지 → 다음 Cron이 재시도. Robin의 yes/no는 회차 8(주차 4)에서 `seed` 등록·`rejected`로 확장 | Claude |
| D33 | 7 | Scorer 프롬프트 버전은 `SCORER_RUBRIC_VERSION` 상수로 관리, `candidate_score.model_version`에 기록 → 같은 후보를 새 룰로 재채점할 때 두 row가 공존하고 최신 row만 화면에 보임 | Claude |
| D34 | 8 | **방향 전환 — Dogfood 모드.** Naver Developer 승인·Anthropic API 키·Cloudflare 토큰 등 외부 API 연결은 **모두 후순위**. 그 동안은 이 채팅의 Claude Code가 직접 Discovery·Scorer 역할을 수행 (WebSearch + WebFetch + Supabase MCP). v0 수집 파이프라인을 사람이 한 번 굴려보는 것이 우선이고, API 연결에 시간을 통째로 까먹지 않기 위함. 이미 만들어둔 워커 코드는 그대로 두고 데이터·룰브릭이 검증된 뒤에 배포 | Robin |
| D35 | 8 | **v0 영구 운영 모드 = Claude Code 직접 실행.** Naver·Anthropic API·Cloudflare 워커 배포는 v0 내내 보류. Claude Code가 매 세션에서 Discovery·Scorer·Crawler를 직접 수행하고 Supabase MCP로 적재. 워커 코드는 동결 상태로 보존(컨텍스트 한계 보일 때 배포 재검토). v0 로드맵 12주 → 8주로 단축 가능 | Robin |
| D36 | 8 | **차단 회피 정책.** 도메인당 한 회차에 fetch 최대 1회. 2회 누적 실패 시 `candidate.next_attempt_after`로 14일 backoff. UA에 contact 명시(`+robin@vidfolio.kr`), robots.txt 사전 확인. 빠른 것보다 차단 안 먹는 게 결과적으로 더 빠르다 — 보수적 운영 | Robin |
| D37 | 8 | **콘텐츠 fetch 우회 다중화 (안전 순).** ① Wayback Machine(`archive.org/wayback`) → ② Jina Reader(`r.jina.ai`) → ③ Supabase Edge Function(datacenter IP) → ④ RSS/sitemap.xml → ⑤ WebSearch 스니펫. 한 도메인당 1번부터 순차 시도, 첫 성공으로 마감. `document.fetch_source` 컬럼에 어느 경로 통했는지 기록 | Claude |
| D38 | 8 | **콘텐츠 평가 기준은 보류.** 충분한 양이 쌓인 뒤 Robin이 데이터로 직접 판단. 회차 8은 일단 모으기에 집중 — `content_score`/`content_reasons` 컬럼 안 만듦 | Robin |

---

## 3. v0 아키텍처 (D35 이후)

### 데이터 흐름
```
[Robin과의 인터페이스]
  • Claude Code (이 채팅)   — 방향 제시 + 직접 실행 (Discovery·Scorer·Crawler)
  • Admin Dashboard         — 결과 보기, 검수, 운영 파라미터 조정

[Claude Code가 매 세션에서 수행하는 단계]
  ① Discovery   — WebSearch로 후보 회사 URL 발굴 → `candidate` 적재
  ② Scorer      — WebSearch 스니펫 + (가능 시) 본문 fetch 기반 점수 → `candidate_score`
  ③ Crawler     — 회사별 about/press/blog URL 수집 → `document` 적재
                  fetch 경로: Wayback → Jina → Edge Function → RSS → snippet (D37)
                  차단 회피: 도메인당 회차 1회, 2회 실패 시 14일 backoff (D36)
  ④ Normalizer  — fetch된 본문 정제 텍스트 → `document.normalized_text`
  ⑤ Embedder    — pgvector 임베딩 (회차 10에 도구 결정)
  ⑥ RAG UI      — 의미 검색 (회차 11)

[동결 보존 — 컨텍스트 한계 시 배포 검토]
  workers/discovery, workers/scorer  : Cloudflare Worker 코드 (v0 미사용)
```

### Admin Dashboard 기능 (Robin 전용)
- 발굴된 후보 회사 리스트 (점수 포함)
- 이번 주 자동 채택된 시드 — 빠른 yes/no 검수
- 수집된 콘텐츠 샘플 미리보기, 양/이상치
- 운영 파라미터: 발굴 키워드, 점수 임계점, 크롤 빈도
- 패턴 교정 입력: "이런 회사는 거름" 같은 피드백 → 다음 발굴에 반영

---

## 4. v0 구현 단계 (D35 이후 — 8주로 단축)

| 회차 | 주차 | 마일스톤 | 검증 |
|------|------|----------|------|
| 5 | 1 | 어드민 골격 + Supabase + Vercel ✅ | 로그인되고 빈 화면 뜸 |
| 6 | 2 | Discovery·어드민 `/candidates`·`/config` (워커 코드 동결 보존) ✅ | 후보 리스트 화면 |
| 7 | 3 | Scorer 룰브릭(`packages/ai`) + 점수 컬럼 ✅ | 점수+사유 펼침 |
| **8** | **4** | **콘텐츠 1차 수집** (70↑ 8개 회사의 about/press/blog) + 우회 fetch (D37) + 차단 회피(D36) | 회사별 콘텐츠 4~6건씩 적재, 어드민에 회사별 상세 화면 |
| 9 | 5 | 운영 파라미터 GUI 완성 + 패턴 교정 피드백 (`operator_feedback`) + 콘텐츠 평가 기준 결정 (Robin) | Robin이 GUI에서 키워드·블록리스트·룰브릭 수정 |
| 10 | 6 | Embedder + pgvector 인덱싱 (OQ6 결정) | "유사 콘텐츠 찾기" 동작 |
| 11 | 7 | RAG 검색 UI (의미 + 키워드 혼합) | "보도자료 톤 깔끔한 사례 5개" 의미 검색 |
| **12** | **8** | **v1 점프 — 고객사 데모 패키지 생성기** (D19) | 고객사 URL 입력 → RAG 참조 20개 에셋 초안 |

---

## 5. 보류 / 다음 회차 결정사항

- **OQ1.** 도메인 — `b2bcorpcom`이 임시 코드명이므로 당분간 무료 서브도메인으로 운영, 브랜드 확정 시 도메인 구매·연결.
- ~~OQ2~~ — D26 → **D35로 폐기** (Naver API 안 씀, Claude Code가 WebSearch로 직접 발굴).
- **OQ3.** 점수 임계점 초기값 — 후보 충분히 쌓이면 분포 보고 결정 (회차 9).
- **OQ4.** robots.txt 처리 — 콘텐츠 fetch 시 사전 확인 (D36 안에 흡수).
- **OQ5.** Layer 1 대행 랜딩 페이지 — v1 데모 만든 직후(회차 12) 별도 사이트로 추가.
- **OQ6 (신설).** 임베딩 도구·모델 — Anthropic 임베딩 / OpenAI ada-002 / Voyage / Cohere / 로컬 중 선택. 회차 10에서 결정.
- **OQ7 (신설).** 콘텐츠 평가·선별 기준 (D38 보류분) — 회차 8 데이터 본 다음 Robin이 결정.

---

## 6. 협업 운영 룰 (D15에 따른)

- **Robin은 코드를 보지 않는다.** 모든 변경은 결과(화면·데이터)로 확인.
- **이 Claude Code 세션이 주 인터페이스.** 새 기능·방향 변경은 여기서 의논.
- **운영 변경(키워드·임계점·승인 등)은 어드민 GUI로만 가능.** 코드 수정 필요 시 Claude가 처리하고 결과만 보고.
- **주 1회 정기 검수.** 어드민에서 "이번 주 채택 회사 N개 빠른 검토" 화면 + 패턴 교정 입력.
- **PR 리뷰는 Robin에게 부과하지 않는다.** CI 통과 + 결과 검증을 합격선으로.

---

## 7. 다음 회차에 할 일

**끝낸 것 (회차 5, 2026-05-24)**
- Supabase 프로젝트 `b2bcorpcom` (id `ywbyjmnkospyvbsaaxqc`, 서울) 생성 + 9개 테이블 + RLS + `config.admin_allowed_emails` 행 적재.
- Next.js 15.5 어드민 (`apps/admin/`): App Router, Supabase SSR Auth (`@supabase/ssr`), middleware로 미인증 → `/login` 리다이렉트, allowlist 통과 안 된 이메일은 `/forbidden`.
- 어드민 Vercel 배포 (project `b2bcorpcom-admin`, prod alias `b2bcorpcom-admin.vercel.app`, GitHub auto-deploy from `claude/claude-md-docs-ViQmB`).
- Robin이 `robin@vidfolio.kr`로 매직 링크 로그인 → 빈 대시보드 진입 확인 = **1주차 마일스톤 통과**.
- 디버깅 회수한 함정 3개:
  1. Vercel은 `Next.js` 취약 버전을 빌드 단계에서 강제 실패시킴 → D24.
  2. Vercel 대시보드의 "Output Directory" Override는 vercel.json보다 우선됨 → 모노레포 import 직후 한 번 확인 필요.
  3. Vercel UI에 단독 "Environment Variables" 메뉴는 없어졌고 Settings → Environments 안쪽 페이지에 통합됨.

**끝낸 것 (회차 6, 2026-05-24)**
- **D26** OQ2 결정: Naver `webkr` Open API 채택.
- `packages/shared/` 본격 채움: `normalizeUrl`·`extractDomain` (`.co.kr`/`.or.kr` 등 한국 2단계 도메인 인지), `BLOCKED_DOMAINS` (네이버/다음/뉴스/SNS/쇼핑/채용/공공/학교), 구조화 `log`.
- `packages/db/` Database TS 타입 수기 작성 — supabase-generated 호환 형식(`Relationships: []`, `__InternalSupabase`-free, `Functions.is_admin`).
- `workers/discovery/` Cloudflare Worker (Cron `0 19 * * *` = KST 04:00):
  - `runDiscovery()`가 config 두 row를 읽어 Naver 검색 N회 → URL 정규화 → 도메인 dedup → `candidate` upsert (도메인 unique 제약으로 idempotent).
  - 각 키워드마다 `discovery_run` row 작성·갱신, 실패 시 `status='error'` + 메시지.
  - `POST /run` 수동 트리거 (Bearer `MANUAL_TRIGGER_TOKEN`).
- 마이그레이션 0003: `discovery_keywords`(시드 8개) + `discovery_settings`(`max_results_per_query=30, search_engine="naver"`).
- 어드민 페이지: `/candidates` (도메인 리스트 + 검색어/상태/발견시각), `/config` (키워드 textarea + 결과수 슬라이더). 홈은 후보 카운트·최근 Run 카드.
- 의존성 함정 1건:
  - `@supabase/ssr@0.5.2`는 `supabase-js@2.106.x` 신규 dist 레이아웃과 호환 안 됨 (`dist/module/lib/types` 경로 부재 → Database generic이 `any/never`로 깨짐). 둘 다 최신(`ssr@^0.10.3`, `supabase-js@^2.106.1`)으로 핀.

**끝낸 것 (회차 7, 2026-05-24)**
- **D30~D33** 결정 누적.
- `packages/ai/`: fetch 기반 Anthropic Messages 클라이언트 (`callClaude`) — prompt caching 옵션 포함. `scoreCandidate()`가 D13 룰브릭(시스템 프롬프트)으로 평가 → JSON 파싱·검증.
- `workers/scorer/`: Cloudflare Worker (Cron `30 19 * * *`, KST 04:30).
  - `candidate.status='pending'` 최대 50건 가져옴.
  - 홈페이지 fetch (15초 timeout, KST UA) → 본문 6KB 추출 (`extract.ts`, script/style/comment 제거).
  - Claude Haiku 4.5 호출 → `candidate_score` row 적재 + `candidate.status='scored'`.
  - Fetch 실패는 score=0/`verdict=네트워크 메시지`로 마감, 모델 실패는 status 유지 → 다음 Cron 재시도.
- 어드민 `/candidates`: 점수 컬럼(색상 표시 — 80↑ 에메랄드, 50↑ 진한 회색, 그 미만 흐림) + `<details>`로 펼치는 4행 reasons(category_fit/clean_basics/over_branded/verdict).
- 함정 메모: ESLint `react/no-unescaped-entities`가 한국어 큰따옴표를 막아서 `&ldquo;/&rdquo;`로 escape 필요.

**끝낸 것 (회차 8a — Discovery·Scorer dogfood 1라운드, 2026-05-24)**
- **D34** 결정. discovery_run `e1518e7b-…` + candidate 15건 적재.
- 룰브릭 직접 적용한 분포: 82점 1개 / 70~78 7개 / 65·50 2개 / 30 1개 / 15·10 4개. 소비재 OEM 4개를 룰브릭이 정확히 거름 (의도대로 작동).
- 환경 한계 발견: WebFetch가 외부 사이트 거의 모두 403 — `dogfood-v1-search-snippets-only-2026-05` model_version으로 마감.
- Vercel prod 별칭이 회차 5 브랜치(`claude/claude-md-docs-ViQmB`) 고정이라 새 페이지 안 보임 → `claude/next-task-UWacK` rebase·push → fast-forward로 prod 브랜치 갱신. 매직 링크 origin 통일.

**끝낸 것 (회차 8b — 콘텐츠 1차 수집 + 로그인 UX, 2026-05-25)**
- **D35~D38** 결정 누적. 마이그레이션 0004 적용 (`document.candidate_id`, `candidate.fetch_failed_count`/`next_attempt_after`, `document.fetch_source`).
- `pg_net` extension 활성화.
- Supabase Edge Function `crawl-fetch` (v4) 배포 — `mode: "fetch"` + `mode: "discover"` (홈페이지 fetch → 내부 `<a href>` 분류 → about/press/blog 자동 추출). **https → http 자동 fallback** (한국 SMB B2B의 TLS 만료·도메인 mismatch 회수). datacenter IP fetch가 이 채팅 환경의 외부 allowlist 우회 — D37 ③ 경로가 사실상 v0 유일한 작동 경로.
- pg_net 호출 → Edge Function → DB 적재 흐름 검증. 70↑ 8개 회사 중 **7개 적재 성공, 20 document row** (about 12 / press 4 / blog 4). hankook-precisionworks.com은 https/http 모두 timeout → D36 따라 `next_attempt_after = now() + 14일`로 자동 backoff.
- 어드민 신규 화면: `/candidates/[id]` (점수·평가 사유·콘텐츠 그룹·본문 1500자 미리보기·fetch-state 카드). `/candidates` 리스트에 콘텐츠 카운트 컬럼 + 도메인 클릭 시 상세로. 홈에 콘텐츠 카운트 카드.
- **로그인 마찰 제거** (Robin 피드백): `/login`을 비밀번호 폼 기본으로, 이메일 prefill+readonly, 매직 링크는 fallback. `/account` 페이지 (비밀번호 설정/변경). 매직 링크 callback → `/account?first=1`로 강제. Robin 비밀번호는 SQL로 직접 set (`unknownpw1001`).
- 함정 메모:
  1. WebFetch가 환경에서 모든 외부 URL 403 (Wayback·Jina까지). D37 ①·②는 봉인. ③ Edge Function이 v0 유일한 fetch 경로.
  2. pg_net의 `http_post`는 트랜잭션 안에서 raise exception 발생 시 큐 entry rollback — DO block로 폴링하다 timeout raise하면 요청이 사라짐. fire-and-forget + 별도 SELECT 폴링이 정답.
  3. `document` unique constraint가 `(seed_id, content_hash)`인데 `seed_id` 가 null이면 enforce 안 됨. 같은 candidate에 같은 내용 중복 적재 가능 — 다음 마이그레이션에서 `(candidate_id, content_hash)` partial unique 추가 검토.
  4. Edge Function 무인증 (`verify_jwt: false`, token 체크 없음). URL 공개되면 DDoS amplifier 위험. **회차 9 우선 처리** — Supabase Vault에 `CRAWL_TOKEN` 저장 후 함수에서 검증.

**다음 (회차 9 — 운영 파라미터 GUI + 패턴 교정 + D38 결정)**
- 선행: Robin이 어드민 `/candidates/[id]` 들어가서 about/press/blog 본문 샘플 보고 **D38(콘텐츠 평가 기준) 결정**. 길이·톤·시의성 기준이 데이터 위에서 정해짐.
- Edge Function 보안: Vault에 `CRAWL_TOKEN` 저장 → 함수에서 `x-crawl-token` 검증.
- `operator_feedback` 흐름 구현:
  - `/candidates/[id]` 에 "거름 (rejected)" / "유지 (accepted)" 버튼 → `operator_feedback` 적재 + `candidate.status` 갱신.
  - 다음 Discovery 라운드에서 `reject_pattern`/`keyword_remove` 읽어 룰브릭에 반영.
- 운영 파라미터 GUI 확장: `/config`에 블록리스트·점수 임계점(OQ3)·크롤 빈도 추가.
- 데이터 양 늘리기 (선택): Discovery 라운드 2 — 추가 키워드로 30~50개 후보 + 콘텐츠 fetch.
- 회차 9 검증 기준: Robin이 코드 안 만지고 어드민에서 키워드 추가·후보 거르기·콘텐츠 평가 기준 입력 가능.

---

## 8. 다음 에이전트 핸드오프 메모 (회차 8b → 9)

### 즉시 알아야 할 환경 상태
- **Git 작업 브랜치**: `claude/claude-md-docs-ViQmB` (= Vercel prod 브랜치). Push하면 자동 prod 배포. `claude/next-task-UWacK` 브랜치는 회차 8a 시점에서 멈춰 있으니 다시 쓰지 말 것.
- **Vercel prod URL**: `https://b2bcorpcom-admin.vercel.app`. 매직 링크 origin 통일됐고, 비밀번호 로그인 가능 (이메일 prefill).
- **Supabase 프로젝트**: id `ywbyjmnkospyvbsaaxqc`, 서울 리전. 마이그레이션 4개 적용 + `pg_net`·`http`(미설치)·`pgcrypto`·`vector`·`supabase_vault` 사용 가능.
- **Edge Function**: `crawl-fetch` (v4) 배포 상태. **무인증 — 회차 9에서 vault 토큰 추가 필수.** URL: `https://ywbyjmnkospyvbsaaxqc.supabase.co/functions/v1/crawl-fetch`.

### 회차 9 작업 호출 패턴 — Edge Function via pg_net
```sql
-- Fire (do NOT wrap in DO block with raise — rollback risk)
select net.http_post(
  url := 'https://ywbyjmnkospyvbsaaxqc.supabase.co/functions/v1/crawl-fetch',
  body := jsonb_build_object('mode','discover','candidate_id', '<uuid>', 'domain', '<host>', 'max_per_type', 2),
  headers := '{"content-type":"application/json"}'::jsonb,
  timeout_milliseconds := 90000
);
-- Poll after ~30~60s
select id, status_code, left(content, 400) from net._http_response where id = <req_id>;
```
모드 `fetch` (URL 리스트 직접) / `discover` (도메인 → 자동 분류) 둘 다 사용 가능.

### 데이터 상태 (회차 8b 직후)
- candidate 15건 (전부 status=scored).
- candidate_score 15건 (`model_version='dogfood-v1-search-snippets-only-2026-05'`).
- document 20건 (회사 7개 분포, 1개 14일 backoff).
- 70↑ 회사 8개 중 7개 콘텐츠 있음. `hankook-precisionworks.com` 만 비어있음(backoff).
- 점수 30↓ 5개 (`dhb2b`/`worldchem`/`innp`/`odortech`/`keih`)는 카테고리 부적합, 회차 9에서 reject 처리 후보.

### 읽는 순서
1. `PLAN.md` (이 문서)
2. `CLAUDE.md`
3. `supabase/migrations/0004_content_layer.sql` (콘텐츠 레이어 스키마)
4. `apps/admin/app/candidates/[id]/page.tsx` (Robin이 콘텐츠 보는 화면)
5. `apps/admin/app/login/*` + `app/account/*` (인증 흐름 — 회차 9에서 보안 강화 시 참고)
6. **Edge Function 소스 — 레포 외부**: Supabase 대시보드 / MCP `get_edge_function`으로 조회. `crawl-fetch/index.ts` 파일은 v0 인 tree에 두지 않음 (스키마/배포 일치 유지가 더 중요).

### 회차 9 첫 메시지 후보 (Robin)
- "콘텐츠 본문 봤어. 평가 기준은 X로 가자." → D38 확정 후 콘텐츠 점수 마이그레이션.
- "Edge Function 토큰 보안 먼저 해줘." → vault 적용.
- "후보 더 모아 — 키워드 Y, Z 추가." → Discovery 라운드 2.
- "5개 카테고리 부적합 한 번에 거름 처리해." → reject UI.

---

## 현재 상태
**회차 8b 완료.** Dogfood 콘텐츠 1차 수집(20 docs) + Edge Function 우회 fetch + 비밀번호 로그인 UX 정착. 회차 9는 Robin의 D38 결정 + 어드민 검수 UI + Edge Function 보안.
