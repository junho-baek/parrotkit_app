# Context Update - Supabase 온보딩/레시피 전환 (2026-03-06 04:05 KST)

## 작업 요약
- Supabase Auth + Postgres + Storage 기반으로 가입/로그인/온보딩/레시피 저장/재접속 복구 흐름을 구현.
- 기존 `mvp_users` 계정 로그인 유지를 위해 배치 이관 스크립트 + 로그인 시 지연 이관 fallback을 추가.
- 이벤트 최소 로깅을 GA4 + `event_logs` 이중 기록으로 연결.
- 모바일 재생 안정화를 위해 YouTube 세그먼트 종료 시 자동 정지(루프 없음) 및 비YouTube fallback을 보강.

## 주요 변경
- Auth/API
  - `src/app/api/auth/signup/route.ts`
  - `src/app/api/auth/signin/route.ts`
  - `src/app/api/auth/refresh/route.ts` (신규)
  - `src/app/api/auth/signout/route.ts` (신규)
  - `src/lib/auth/server-auth.ts` (신규)
  - `src/lib/auth/legacy-migration.ts` (신규)
- Profile/Interests
  - `src/app/api/user/profile/route.ts`
  - `src/app/api/interests/route.ts`
- Recipes/Storage/Events
  - `src/app/api/recipes/route.ts` (신규)
  - `src/app/api/recipes/[id]/route.ts` (신규)
  - `src/app/api/recipes/[id]/progress/route.ts` (신규)
  - `src/app/api/recipes/[id]/captures/route.ts` (신규)
  - `src/app/api/recipes/[id]/export-zip/route.ts` (신규)
  - `src/app/api/events/route.ts` (신규)
- Billing
  - `src/app/api/checkout/route.ts`
  - `src/app/api/webhooks/lemonsqueezy/route.ts`
- Frontend 연결
  - `src/components/auth/SignUpForm.tsx`
  - `src/components/auth/SignInForm.tsx`
  - `src/components/auth/InterestsForm.tsx`
  - `src/components/auth/URLInputForm.tsx`
  - `src/components/auth/DashboardContent.tsx`
  - `src/components/common/RecipeResult.tsx`
  - `src/components/common/RecipeVideoPlayer.tsx`
  - `src/components/auth/PricingCard.tsx`
- Supabase/Schema/Script
  - `supabase/migrations/20260306_auth_recipe_storage.sql` (신규)
  - `scripts/db-schema.cjs` (신규)
  - `scripts/migrate-legacy-users-to-supabase.cjs` (신규)
  - `app/types/supabase.generated.ts` (신규 스텁)

## 검증 로그
- `npm run db:schema`
  - 성공
  - 생성 파일: `context/context_20260306_035745_supabase_schema_snapshot.md`
- `npx eslint <변경 핵심 파일 집합>`
  - 성공(오류 0, 경고만 존재)
- `npm run build`
  - 성공
- `npx tsc --noEmit`
  - 실패
  - 원인: `.next/dev/types/validator.ts`의 Typed Routes 제네릭 제약 오류(프로젝트 코드 변경분과 별개)
- `npm run lint`
  - 실패
  - 원인: 저장소 전체 기존 대량 lint debt (`17710475759xx-player-script.js` 포함, 총 15255 issues)

## 메모
- `.env.local`의 `DATABASE_URL=DATABASE_URL="..."` 형태를 스크립트에서 방어적으로 정규화하여 snapshot/migration 실행 가능 상태 유지.
- 현재 기준 기존 DB `mvp_users`는 22명.
