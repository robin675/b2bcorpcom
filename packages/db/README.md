# @b2bcorpcom/db

Supabase 마이그레이션의 사실상 진입점이자, 생성된 TypeScript 타입을 다른 패키지가 import하는 곳.

실제 SQL 마이그레이션 파일은 `supabase/migrations/`에 있고, 이 패키지는 그 위에 얇은 TS 래퍼만 둔다.

**규칙 (CLAUDE.md §6):**
- 기존 마이그레이션 SQL은 절대 수정하지 않는다. 새 파일을 추가한다.
- 타입은 자동 생성, 직접 손으로 쓰지 않는다.
