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

---

## 3. v0 아키텍처

### 데이터 흐름
```
[Robin과의 인터페이스]
  • Claude Code (이 채팅)   — 방향 제시, 신규 기능 요청, 의논
  • Admin Dashboard         — 결과 보기, 주 1회 검수, 운영 파라미터 조정

[자동 동작 시스템 (백엔드, Cron 주기 동작)]
  ① Discovery Worker  — 검색 API로 "한국 중견 B2B 제조" 후보 회사 URL 발굴
  ② Scorer Worker     — Claude API로 "기초 깔끔 점수" 평가
                          (활발도 ≠ 점수, 과도한 브랜딩 = 감점)
  ③ Seed Registry     — 임계점 통과 회사 자동 등록 (Supabase Table)
  ④ Crawler Worker    — 시드의 회사소개·보도자료·블로그 포스트 수집
  ⑤ Normalizer        — HTML → 정제 텍스트 + 메타데이터
  ⑥ Embedder          — pgvector 임베딩 인덱싱
  ⑦ RAG Storage       — Supabase Postgres + pgvector + Storage(원본 HTML)
```

### Admin Dashboard 기능 (Robin 전용)
- 발굴된 후보 회사 리스트 (점수 포함)
- 이번 주 자동 채택된 시드 — 빠른 yes/no 검수
- 수집된 콘텐츠 샘플 미리보기, 양/이상치
- 운영 파라미터: 발굴 키워드, 점수 임계점, 크롤 빈도
- 패턴 교정 입력: "이런 회사는 거름" 같은 피드백 → 다음 발굴에 반영

---

## 4. v0 구현 단계 (12주, 2~3개월)

| 주차 | 마일스톤 | 검증(=Robin이 결과로 확인할 수 있는 것) |
|------|----------|------------------------------------------|
| 1 | 레포 초기화, Supabase 스키마 설계, Auth 어드민 골격 | 어드민에 로그인되고 빈 화면 뜸 |
| 2 | Discovery Worker v1: 키워드 검색 → 후보 URL 적재 | 어드민에서 "후보 회사 30~50개" 리스트 확인 |
| 3 | Scorer Worker v1: 페이지 fetch + Claude 평가 + 점수 저장 | 후보별 점수 + 짧은 평가 사유 표시 |
| 4 | Seed Registry + 임계점 자동 채택 + 검수 UI | "이번 주 채택 N개" 화면, 체크박스 yes/no |
| 5 | Crawler Worker v1: 회사소개·보도자료·블로그 포스트 수집 | 시드 1곳당 수집된 페이지 수 + 샘플 텍스트 |
| 6 | Normalizer + 원본/정제본 Storage | 정제된 마크다운 미리보기 |
| 7 | 운영 파라미터 UI (키워드·임계점·빈도 변경) | 코드 안 만지고 Robin이 직접 조정 |
| 8 | 패턴 교정 피드백 루프 → Discovery 프롬프트에 반영 | "거른 회사" 입력 후 다음 발굴에 그 패턴 회피 확인 |
| 9 | 크롤 변경 감지 + 재수집 스케줄 | 새 글이 올라온 시드 자동 갱신 |
| 10 | Embedder + pgvector 인덱싱 | 어드민에서 "유사 콘텐츠 찾기" 검색 동작 |
| 11 | RAG 검색 UI (의미 기반 + 키워드 혼합) | "보도자료 톤이 깔끔한 사례 5개" 식 질의 |
| 12 | 모니터링·알람·일일 운영 리포트 메일 | 매일 아침 "어제 N개 수집, M개 채택, 에러 K건" 메일 |
| 13+ | **v1 즉시 시작: 고객사용 패키지 초안 데모** (D19) — Layer 1 영업 무기로 활용 | 고객사명·홈페이지 입력 → RAG 참조한 20개 에셋 초안 생성 |

---

## 5. 보류 / 다음 회차 결정사항

- **OQ1.** 도메인 — `b2bcorpcom`이 임시 코드명이므로 당분간 무료 서브도메인(`*.workers.dev`, `*.pages.dev`)으로 운영, 브랜드 확정 시 도메인 구매·연결.
- **OQ2.** Discovery 검색 엔진 — Google CSE / Bing API / Brave Search 중 선택 (비용·할당량 봐서 v0 1주차에 결정).
- **OQ3.** 점수 임계점의 초기값 — 발굴 100개 중 채택 N개가 적절한지 6주차에 실측해 조정.
- **OQ4.** 저작권·robots.txt 처리 정책 — 일단 robots.txt 준수, RAG 내부 검색용에 한정, 외부 노출 시 별도 검토 (v0 단계에서 외부 노출 X).
- **OQ5.** Layer 1 대행 서비스 랜딩 페이지는 v0 이후로 보류 (v0가 안정되면 별도 사이트로 추가).

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

**다음 (회차 7 — 3주차 Scorer Worker)**
- 선행: Robin이 Naver 개발자 센터에서 앱 등록 후 `NAVER_CLIENT_ID`/`SECRET`을 Cloudflare Workers Secret으로 넣고, Discovery Worker 1회 수동 실행 → `/candidates`에 30~50개 행 확인.
- `workers/scorer/` Cloudflare Worker (Cron, Discovery 직후):
  - `candidate` 중 `status='pending'` 미평가 분 가져옴.
  - 후보 URL fetch → 본문 추출 → Claude API로 "기초만 깔끔 점수" 평가 (D13).
  - `candidate_score` 적재 + `candidate.status='scored'`.
- 어드민 `/candidates`에 점수·평가 사유 컬럼 추가.
- 검증 기준: 후보별 점수(0~100)와 짧은 이유 1~2줄이 화면에 표시됨.
- 후속 이슈 메모: `candidate.status`가 텍스트인데 enum이 더 안전 — 회차 7에서 마이그레이션 0004로 enum 검토.

---

## 8. 다음 에이전트 핸드오프 메모 (회차 6 → 7)

- **현재 작업 브랜치**: `claude/next-task-UWacK`. 회차 7는 같은 브랜치 이어가도 되고 `claude/scorer-worker` 같이 새 브랜치로 분기 가능.
- **Supabase 프로젝트**: id `ywbyjmnkospyvbsaaxqc`. 마이그레이션 3개 적용 완료 (`0001`, `0002`, `0003`). MCP `list_tables` / `execute_sql`로 검증 가능.
- **Vercel 프로젝트**: `b2bcorpcom-admin` (id `prj_13u8VAiiuAn2UhuUfDjQuoZi6fk4`, team `team_LDDIdXS3s1ojSGVviqkOqAd8`). 새 브랜치로 푸시되면 Vercel preview가 자동 생성, prod는 Robin이 promote.
- **Cloudflare Workers**: 아직 배포 안 됨. `wrangler` 토큰을 Robin이 발급한 뒤 `pnpm --filter @b2bcorpcom/worker-discovery deploy`. 필요 Secret: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET`, `MANUAL_TRIGGER_TOKEN`.
- **읽는 순서**: PLAN.md → CLAUDE.md → `apps/admin/DEPLOY.md` → `supabase/migrations/0003*` → `workers/discovery/src/pipeline.ts` (검색 흐름) → `apps/admin/app/{candidates,config}/` → 스코어러 위치 (`workers/scorer/`, 빈 상태).
- **회차 7 첫 메시지 예시 (Robin)**: "Naver 키 넣었어, 1회 돌려서 후보 채워봐 → 그다음 Scorer로." 또는 "OQ3(점수 임계점 초기값) 어떻게 잡을지부터 의논."

---

## 현재 상태
**회차 6 완료. 2주차 마일스톤 코드·DB는 ✅ 통과**, Naver 키 적용 + Worker 1회 실행으로 후보 30~50개 검증은 회차 7 진입 직전에 마무리 예정.
