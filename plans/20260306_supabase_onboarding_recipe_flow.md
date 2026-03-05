# Supabase 온보딩/레시피 플로우 전환 계획 (2026-03-06)

## 배경
- 현재 인증/유저 데이터는 JWT + Drizzle + `mvp_users` 중심이고, 레시피/진행상태는 `localStorage`/`sessionStorage`에 저장된다.
- 이 구조는 재접속 복구, 멀티디바이스 사용, 모바일 안정성, 운영 로그 추적에 한계가 있다.
- 2026-03-13(금)까지 가입→온보딩→레퍼런스 입력→Recipe 생성→저장/재접속 재사용 흐름을 Supabase 기반으로 전환해야 한다.
- 기존 사용자 22명은 비밀번호 재설정 없이 로그인 유지가 필요하다.

## 목표
- Supabase Auth + Postgres + Storage로 핵심 사용자 여정을 서버 영속화한다.
- YouTube 세그먼트는 start/end 기반 구간 재생(종료 자동 정지), 비YouTube는 썸네일+원본 열기로 유지한다.
- 촬영본은 Storage에 저장하고 재접속 시 복구/ZIP 다운로드를 제공한다.
- 최소 이벤트 로깅을 GA4 + Supabase(`event_logs`)에 동시 기록한다.
- LemonSqueezy 연동 키를 `auth_user_id + email` 병행 매칭으로 전환한다.
- 기존 `mvp_users` 사용자는 Supabase Auth로 이관 후 기존 비밀번호로 로그인 가능하게 유지한다.

## 범위
- 포함
  - Supabase 클라이언트/인증 헬퍼 도입
  - Auth API(`signup/signin/refresh/signout`) Supabase 전환
  - 기존 사용자 이관 스크립트 추가(배치 이관)
  - 로그인 시 지연 이관 fallback 추가(누락 사용자 자동 보정)
  - profile/interests API Supabase 전환
  - recipes/events API 추가
  - 레시피/촬영 업로드/재접속 복구/ZIP export 프론트 연동
  - 결제 API/웹훅 매칭 키 전환
  - 모바일 안정성 관련 치명 구간 보정
- 제외
  - 비YouTube 세그먼트 클립 저장
  - 검색/태그/버전관리 등 고급 기능

## 변경 파일
- 계획 수립 시점 예상 변경
  - `package.json`, `.env.local.example`
  - `src/lib/supabase/*`, `src/lib/auth/*`, `src/lib/client-events.ts`
  - `src/app/api/auth/*`, `src/app/api/user/profile/route.ts`, `src/app/api/interests/route.ts`
  - `src/app/api/recipes/**/*`, `src/app/api/events/route.ts`
  - `src/app/api/checkout/route.ts`, `src/app/api/webhooks/lemonsqueezy/route.ts`
  - `src/components/auth/SignUpForm.tsx`, `SignInForm.tsx`, `InterestsForm.tsx`, `URLInputForm.tsx`, `DashboardContent.tsx`
  - `src/components/common/RecipeResult.tsx`, `RecipeVideoPlayer.tsx`
  - `supabase/migrations/*`, `app/types/supabase.generated.ts`
  - `scripts/migrate-legacy-users-to-supabase.*` (신규)
  - `context/context_*`

## 기존 사용자 이관 전략
- 배치 이관(1차)
  - 원본: `mvp_users(id,email,username,password,interests,subscription_*)`
  - 대상: `auth.users` + `public.profiles`
  - 방식: Supabase Admin `createUser`에 `password_hash` 사용(기존 bcrypt 해시 유지)
  - 메타: `legacy_user_id`를 user metadata 또는 profiles에 보존
- 지연 이관 fallback(2차)
  - 로그인 시 Supabase Auth 실패 + legacy 사용자 존재 + bcrypt 검증 성공이면 즉시 Supabase 사용자 생성 후 재로그인 처리
  - 누락 계정/운영 중 가입 경합을 런타임에서 자동 복구
- 종료 기준(3차)
  - 1~2주 모니터링 후 fallback 경로 호출 0건 확인 시 legacy 의존 제거

## 테스트
- 정적 검증: `npm run lint`, `npm run build`
- API 스모크
  - auth signup/signin/refresh/signout
  - legacy 계정 로그인(이관 전/후) 성공
  - fallback 경로로 자동 이관 생성 확인
  - interests/profile 조회/수정
  - recipes 생성/조회/진행상태 업데이트
  - captures 업로드 및 export zip
  - events 저장
  - checkout/webhook 매칭 확인
- 데이터 검증
  - legacy 22명 중 이메일 기준 전원 `auth.users`/`profiles` 반영 여부
  - 이관 전후 구독 상태 필드 일치 여부
- UX 검증
  - 가입→온보딩→paste→analyze→recipe 저장→재접속 재오픈
  - iOS Safari/Android Chrome에서 핵심 흐름 레이아웃 안정성

## 롤백
- Supabase 연동 브랜치를 revert하고 기존 JWT+Drizzle API로 복귀 가능하도록 API 응답 계약을 최대한 유지한다.
- 배치 이관 전 DB 백업을 수행하고, 실패 시 auth/profiles 레코드를 스냅샷 기준으로 되돌린다.
- 신규 API 라우트는 독립 경로로 추가하여 기존 화면에서 점진적으로 전환한다.

## 리스크
- Supabase 실환경 키/정책(RLS/Storage) 미설정 시 런타임 오류 가능성
- `password_hash` 포맷/알고리즘 불일치 시 일부 계정 로그인 실패 가능성
- username 기반 로그인 호환 누락 가능성
- YouTube IFrame end 제어 환경별 편차
- 촬영본 업로드 용량 증가에 따른 성능/비용 부담
- 마감 전 범위 증가 시 QA 시간 부족

## 결과
- Supabase Auth/API 전환 완료: `signup/signin/refresh/signout`, `profile/interests` 경로를 Supabase 기반으로 교체했다.
- 기존 사용자 로그인 유지 전략 반영: 배치 이관 스크립트(`password_hash`)와 로그인 시 지연 이관 fallback을 모두 구현했다.
- 레시피 영속화 완료: `recipes/progress/captures/export-zip` API와 프론트 연동으로 저장/재접속/복구 흐름을 연결했다.
- 최소 이벤트 로깅 완료: GA4 + `/api/events`(`event_logs`) 이중 기록으로 연결했다.
- 결제 연동 보정 완료: checkout/webhook 매칭 키를 `authUserId + email` 기준으로 전환했다.
- 검증 결과
  - `npm run db:schema`: 성공
  - `npx eslint <변경 핵심 파일>`: 오류 0 (경고만 존재)
  - `npm run build`: 성공
  - `npx tsc --noEmit`: `.next/dev/types/validator.ts` Typed Routes 오류로 실패(프로젝트 변경분 외 이슈)
  - `npm run lint`: 저장소 기존 대량 lint debt(특히 대형 player script 파일)로 실패

## 연결 Context
- `context/context_20260306_035745_supabase_schema_snapshot.md`
- `context/context_20260306_040500_supabase_onboarding_recipe_migration.md`
