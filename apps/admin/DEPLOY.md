# Vercel 배포 (1회만, ~3분)

Vercel CLI는 컨테이너에서 인증이 막혀서 Robin이 한 번만 대시보드에서 클릭해주셔야 합니다. 그 다음부터는 git push 할 때마다 자동 배포됩니다.

> 주의: Vercel의 "Redeploy" 버튼은 옛 커밋·옛 설정을 그대로 재실행합니다. 설정을 바꿨다면 **새 커밋이 푸시될 때**까지 기다리거나 "Redeploy with new settings" 같은 옵션을 사용해야 합니다.

## 1. Vercel에 GitHub 레포 연결

1. https://vercel.com/new → "Import Git Repository" → `robin675/b2bcorpcom` 선택
2. **Framework Preset**: Next.js (자동 감지됨)
3. **Root Directory**: 기본값 `./` 유지 (루트 `vercel.json`이 `pnpm --filter` 로 admin만 빌드합니다)
4. **Environment Variables** — 아래 3개 추가:

   | 이름 | 값 |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://ywbyjmnkospyvbsaaxqc.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_BG_WRoa0CxoQVCi-qNDBSQ_vcPoyotD` |
   | `ADMIN_ALLOWED_EMAILS` | `robin@vidfolio.kr` |

5. **Deploy** 클릭. 약 2분 후 `https://<무작위>.vercel.app` URL 생성.

## 2. Supabase Auth 리다이렉트 URL 추가

매직 링크 이메일이 Vercel 도메인으로 돌아올 수 있게 허용 URL에 추가합니다.

1. https://supabase.com/dashboard/project/ywbyjmnkospyvbsaaxqc/auth/url-configuration
2. **Redirect URLs**에 다음 두 줄 추가:
   - `https://*.vercel.app/auth/callback` (프리뷰·프로덕션 모두)
   - 1번에서 생성된 Vercel 프로덕션 URL + `/auth/callback`
3. **Site URL**에는 1번 Vercel 프로덕션 URL 설정 (매직 링크 기본 호스트).
4. **Save** 클릭.

## 3. 검증

- Vercel URL 열기 → 자동으로 `/login`으로 이동
- 이메일에 `robin@vidfolio.kr` 입력 → "매직 링크 보내기"
- 이메일 확인 → 링크 클릭 → 빈 대시보드 진입

**1주차 마일스톤(PLAN.md §4: "어드민에 로그인되고 빈 화면 뜸") 완료.**

## 향후 배포

`claude/*` 브랜치에 push → 자동으로 Preview 환경 생성. `main`에 merge → 프로덕션 갱신.
