# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> 이 저장소의 사용자(Robin)는 코드를 직접 보지 않는다 (D15). 모든 변경은 결과 화면·데이터·이 채팅으로 검증된다. 운영 파라미터는 어드민 GUI로 접근 가능해야 한다.
> 결정의 출처는 항상 **`PLAN.md`** 이다. 새 회차 결정은 거기에 누적 기록한다.

---

## 1. 이 저장소가 무엇인지

`b2bcorpcom`은 **임시 코드명**이다 (D20). 실제 브랜드는 추후 결정. UI 카피·문서에는 가능한 한 코드명을 노출하지 않고, 환경변수·상수로 모아 추후 일괄 교체할 수 있게 한다.

3-Layer 사업 계획을 한 모노레포에서 점진적으로 구축한다.

1. **Layer 1 — 대행 서비스**: 한국 중견 B2B 제조사에게 표준화된 마케팅 에셋 패키지(~20개)를 1회 납품. (v1+)
2. **Layer 2 — 정보 규격**: 5축 스키마 (Capability / Technical / Quality / Transaction / Credibility).
3. **Layer 3 — 매칭 플랫폼**: 누적된 데이터로 검색·매칭 가능한 글로벌 B2B 플랫폼. (장기)

**현재 단계 = v0 (수집 파이프라인 + RAG 인덱싱, 2~3개월).** D7에 따라 매출 레이어보다 근본 데이터 파이프라인을 먼저 만든다.

---

## 2. v0 아키텍처 (큰 그림)

```
[Robin과의 인터페이스]
  • Claude Code (이 채팅)   — 방향 제시, 신규 기능, 의논
  • Admin Dashboard         — 결과, 주 1회 검수, 운영 파라미터 GUI

[자동 동작 시스템 (Cron 주기)]
  ① Discovery Worker  검색 API → 후보 회사 URL 발굴
  ② Scorer Worker     Claude API "기초 깔끔 점수" 평가
  ③ Seed Registry     임계점 통과 회사 자동 등록
  ④ Crawler Worker    회사소개·보도자료·블로그 포스트 수집
  ⑤ Normalizer        HTML → 정제 텍스트 + 메타데이터
  ⑥ Embedder          pgvector 인덱싱
  ⑦ RAG Storage       Supabase Postgres + pgvector + Storage(원본)
```

각 워커는 **Cloudflare Workers + Cron Triggers**에서 독립 배포된다. 공유 자원은 `packages/` 패키지로 묶는다.

---

## 3. 레포 레이아웃

| 경로 | 무엇인가 |
|------|----------|
| `apps/admin/` | Next.js 어드민 (Robin 전용 운영 화면). Supabase Auth + Cloudflare Pages 배포. |
| `workers/discovery/` | 검색으로 후보 회사 발굴. |
| `workers/scorer/` | Claude API로 "기초 깔끔 점수" 평가. |
| `workers/crawler/` | 시드 회사의 회사소개·보도자료·블로그 포스트 수집. |
| `workers/normalizer/` | HTML → 정제 텍스트. |
| `workers/embedder/` | pgvector 임베딩 인덱싱. |
| `packages/db/` | Supabase 마이그레이션 SQL + 생성된 TypeScript 타입. |
| `packages/ai/` | Claude API 클라이언트 + 프롬프트 모듈 (점수 평가 / 정제 / 임베딩 입력 생성 등). |
| `packages/shared/` | 공통 타입·유틸 (URL 정규화·로깅 등). |
| `supabase/migrations/` | 시간순 SQL 마이그레이션. 절대 기존 마이그레이션 수정 금지 — 새 파일 추가. |
| `PLAN.md` | 살아있는 의사결정 누적 문서. **모든 사업·아키텍처 결정의 진실 공급원.** |

---

## 4. 일관적으로 지킬 컨벤션

### 4.1 결정의 출처는 PLAN.md
- 새로운 기능·정책·임계점·키워드 변경 등은 먼저 `PLAN.md`의 **§2 결정 누적** 표에 회차 번호와 함께 기록한다.
- 코드 주석에는 결정 사유를 적지 않는다. PLAN.md의 `D#`을 참조한다 (예: `// per PLAN.md D13`).

### 4.2 "코드 안 보는 운영자" 원칙 (D15)
- Robin은 PR 리뷰·코드 검토를 하지 않는다.
- 운영 파라미터(검색 키워드·점수 임계점·크롤 빈도·승인 등)는 **반드시 어드민 GUI**에서 변경 가능해야 한다.
- 새 기능 추가 시 "코드 수정해야만 동작이 바뀌는 값"이 있다면 그것은 미완성이다. `config` 테이블 또는 환경변수로 빼서 GUI에서 변경 가능하게 만든다.

### 4.3 점수 평가 철학 (D13)
점수가 높을 회사는 "기초만 깔끔히 해놓은 곳"이다.
- **활발도(글 수·업데이트 빈도)는 점수 지표가 아니다.**
- **과도한 브랜딩(슬릭한 디자인·풍부한 자료)은 감점.** 베껴올 수 없을 만큼 잘된 곳은 레퍼런스로 부적합.
- 회사 소개 한 페이지, 보도자료 한두 건, 블로그 포스트가 형식적으로 정돈되어 있으면 충분.
- Scorer 프롬프트(`packages/ai/scorer.ts`)를 수정할 때 반드시 이 철학을 유지한다.

### 4.4 v0 수집 범위 (D11·D12)
- 에셋 타입: **회사 소개 / 보도자료 / 블로그 포스트** (HTML 텍스트). PDF·영상은 v0 범위 밖.
- 대상: 한국 중견 B2B 제조·부품·소재. 업종 무관.
- 언어: 한국어만.

### 4.5 검수 흐름 (D14)
- Discovery → Scorer 점수 통과 → **자동으로 `seed` 등록.**
- Robin은 주 1회 어드민에서 "이번 주 채택 회사 N개" 화면에서 yes/no 빠른 검수.
- "거름" 표시된 회사의 패턴은 `operator_feedback`에 적재되어 다음 발굴 라운드의 Scorer 프롬프트·필터에 반영된다.

### 4.6 robots.txt 준수
- Crawler Worker는 모든 도메인에 대해 robots.txt를 먼저 확인하고 허용된 경로만 수집한다.
- 수집된 콘텐츠는 v0 단계에서 **외부 노출 금지**. RAG 내부 검색 용도로만 사용 (OQ4).

### 4.7 모노레포 규칙
- 패키지 매니저: `pnpm` (workspaces). `npm`·`yarn` 혼용 금지.
- 워커 간 직접 import 금지. 공유 코드는 반드시 `packages/*`를 거친다.
- DB 타입은 `packages/db`에서 `supabase gen types`로 생성한 뒤 다른 패키지가 import한다.

---

## 5. 명령어 (현재 / 추후 추가)

| 목적 | 명령 | 상태 |
|------|------|------|
| 의존성 설치 | `pnpm install` | 사용 가능 |
| 전체 타입체크 | `pnpm -r typecheck` | 워크스페이스 추가 후 사용 가능 |
| 전체 빌드 | `pnpm -r build` | 워크스페이스 추가 후 |
| 어드민 로컬 실행 | `pnpm --filter @b2bcorpcom/admin dev` | apps/admin 추가 후 |
| 특정 워커 로컬 실행 | `pnpm --filter @b2bcorpcom/worker-discovery dev` | 해당 워커 추가 후 |
| 특정 워커 배포 | `pnpm --filter @b2bcorpcom/worker-discovery deploy` | wrangler 설정 후 |
| Supabase 타입 생성 | `pnpm --filter @b2bcorpcom/db gen-types` | 토큰 설정 후 |
| 단일 테스트 실행 | `pnpm --filter <pkg> test -- <pattern>` | vitest 도입 후 |

> 새 명령을 추가했다면 이 표도 갱신한다.

---

## 6. Supabase 사용 시

- 마이그레이션은 `supabase/migrations/` 시간순 파일로만 추가. **기존 파일을 수정해서는 안 된다.**
- 모든 테이블에 RLS를 켜고, 어드민용 권한(`service_role` 또는 Supabase Auth의 특정 사용자)만 통과시킨다 — 어드민은 1인 사용이지만 외부 노출 가능성 고려.
- pgvector 인덱스는 `ivfflat` 또는 `hnsw`로 도입. v0 초기엔 `ivfflat` 충분.

---

## 7. 비밀 / 환경변수

각 워커·앱은 자기 `wrangler.toml` / `.env.local`로 비밀을 관리한다. **루트에 .env를 두지 않는다.** 공유가 필요한 키는 Cloudflare Workers Secrets 또는 Supabase Vault로 옮긴다.

필요한 비밀 (현 시점 알려진 것):
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (워커용)
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (어드민용)
- `ANTHROPIC_API_KEY` (모든 AI 호출용)
- Discovery 검색 API 키 (OQ2에서 1주차에 결정)

---

## 8. Git 운영

- 작업 브랜치: `claude/claude-md-docs-ViQmB` (현 세션의 초기 브랜치). 이후 기능 단위로 다른 `claude/*` 브랜치 사용 가능.
- 푸시 후 PR 리뷰는 Robin에게 부과하지 않는다 (D15·§6). CI 통과 + 결과 화면 검증을 합격선으로 한다.

---

## 9. 어디서부터 읽을지

새 세션이 들어오면 다음 순서로 읽으면 빠르게 맥락에 올라탄다.

1. **`PLAN.md`** — 무엇을 왜 만드는지, 어디까지 결정됐는지.
2. 이 파일 (`CLAUDE.md`) — 어떻게 만들지의 컨벤션.
3. `supabase/migrations/` 최신 파일 — 현재 데이터 모델.
4. `apps/admin/` (생기면) — 운영 화면 구조.
5. `workers/<해당 워커>/` — 다룰 작업 영역.
