# b2bcorpcom

> `b2bcorpcom`은 임시 코드명입니다. 실제 서비스 브랜드는 추후 결정됩니다.

한국 중견 B2B 제조 기업을 위한 마케팅 에셋 표준화 사업의 코드 기반입니다.

**현재 단계 = v0:** "기초만 깔끔히 해놓은" 한국 중견 B2B 제조사의 회사 소개·보도자료·블로그 포스트를 자동 발굴·수집·평가·인덱싱하는 RAG 파이프라인을 만듭니다.

## 어디서부터 읽나

1. **[`PLAN.md`](./PLAN.md)** — 무엇을 왜 만드는지, 어떤 결정이 누적되어 있는지. 사업 의사결정의 진실 공급원.
2. **[`CLAUDE.md`](./CLAUDE.md)** — 이 저장소에서 코드를 만들 때 지킬 컨벤션과 명령어.

## 모노레포 구조

```
apps/admin/             Next.js 어드민 (운영자 1인용)
workers/                Cloudflare Workers (각 파이프라인 단계)
packages/               공유 코드 (db / ai / shared)
supabase/migrations/    시간순 SQL 마이그레이션
```

## 시작하기

```bash
pnpm install
```

세부 명령어는 [`CLAUDE.md` §5](./CLAUDE.md#5-명령어-현재--추후-추가).
