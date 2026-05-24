# @b2bcorpcom/admin

운영자 1인용 어드민. Robin이 결과 확인·주 1회 검수·운영 파라미터 변경을 하는 화면.

스택: Next.js 15 (App Router) + Supabase Auth (magic link) + Tailwind. Cloudflare Pages 배포 예정.

## 로컬 실행

```bash
cp .env.local.example .env.local
# .env.local 채우기: SUPABASE_URL / ANON_KEY / ADMIN_ALLOWED_EMAILS
pnpm install
pnpm --filter @b2bcorpcom/admin dev
```

http://localhost:3000 → `/login` 으로 리다이렉트 → 매직 링크 → `/`(빈 대시보드).

## 접근 제어 (D15)

- 미들웨어가 인증 없는 요청을 `/login`으로 보낸다.
- 로그인 이메일이 `ADMIN_ALLOWED_EMAILS` 환경변수에 없으면 `/forbidden`.
- DB 레벨에서도 `public.is_admin()` 함수와 RLS 정책으로 이중 차단 (allowlist는 `config.admin_allowed_emails` 테이블 행에서 관리).

## 다음 마일스톤 (PLAN.md §4)

- 2주차: 후보 회사 리스트 페이지
- 4주차: 시드 검수 화면 (yes/no)
- 7주차: 운영 파라미터 GUI (키워드·임계점·빈도)
