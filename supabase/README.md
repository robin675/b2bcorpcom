# Supabase

`migrations/` 폴더의 SQL 파일이 시간순으로 적용된다.

**규칙:**
- 새 마이그레이션은 다음 번호 + 짧은 설명으로 파일 추가 (`0002_<설명>.sql`).
- 기존 마이그레이션 SQL은 절대 수정하지 않는다 — 이미 적용된 DB와 불일치 위험.
- 적용 후 `pnpm --filter @b2bcorpcom/db gen-types`로 TypeScript 타입 재생성.

현재 마이그레이션 파일:
- `0001_initial_schema.sql` — v0 파이프라인 테이블 골격 + pgvector + RLS 활성화.
