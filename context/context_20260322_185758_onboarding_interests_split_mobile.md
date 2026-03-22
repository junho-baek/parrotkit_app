# Onboarding Interests Split Mobile

## 작업 개요
- `/interests`에 함께 있던 creator profile 입력과 interests 선택을 두 단계로 분리했다.
- 신규 유저 흐름을 `onboarding -> interests -> paste` 순서로 정리하고, 모바일에서 위쪽 필드가 잘리는 문제를 줄이도록 레이아웃을 top-aligned 구조로 바꿨다.
- interest / activity purpose 선택 UI를 브랜드 토큰 기반으로 통일하고, my page에는 non-blocking profile completion recommendation을 추가했다.

## 주요 변경
- `src/components/auth/OnboardingForm.tsx`
  - 기존 소개 카드 대신 실제 creator profile 입력 폼으로 교체
  - age group, gender, domain, follower range, activity purpose만 입력받고 localStorage 저장 후 `/interests`로 이동
  - 미완료 경고를 inline 영어 문구로 전환
- `src/components/auth/InterestsForm.tsx`
  - creator profile 입력 섹션 제거
  - interest picker 전용 step으로 재구성
  - 선택 상태를 브랜드 토큰 기반 CTA/chip 스타일로 변경
  - 직접 진입 시 `profile extras 미완료 + interests 없음`이면 `/onboarding`으로 리다이렉트
  - 기존 interests가 있는 유저는 선택 상태를 불러와 편집 가능하게 유지
- `src/components/auth/CreatorProfileFields.tsx` (신규)
  - onboarding page와 my page modal이 공유하는 creator profile 입력 섹션 추가
- `src/components/auth/InterestPicker.tsx` (신규)
  - interests grid/chip 렌더링 분리
- `src/app/onboarding/page.tsx`, `src/app/interests/page.tsx`
  - 중앙 정렬 대신 top-aligned scroll 레이아웃으로 변경
  - sticky header와 safe-area 하단 패딩 반영
- `src/components/auth/SignUpForm.tsx`
  - 성공 후 `/interests` 대신 `/onboarding`으로 이동
- `src/components/auth/SignInForm.tsx`
  - interests가 없을 때 `/interests` 대신 `/onboarding`으로 이동
- `src/components/auth/DashboardContent.tsx`
  - creator profile modal을 shared form으로 교체
  - profile extras가 비어 있을 때 “Recommended” 상태 안내 및 update CTA 추가
  - profile이 완성된 경우 summary chip 표시
- `src/app/globals.css`
  - brand-form-field, brand-pill, brand-inline-error, brand-primary-button 등 공통 UI 클래스 추가
  - onboarding/interests에서 사용하는 soft surface / focus ring / selected pill 표현을 글로벌 토큰으로 정리

## 검증
- `PATH=/opt/homebrew/bin:$PATH npx tsc --noEmit`
  - 통과
- `PATH=/opt/homebrew/bin:$PATH npx eslint src/components/auth/OnboardingForm.tsx src/components/auth/InterestsForm.tsx src/components/auth/CreatorProfileFields.tsx src/components/auth/InterestPicker.tsx src/components/auth/SignUpForm.tsx src/components/auth/SignInForm.tsx src/components/auth/DashboardContent.tsx src/app/onboarding/page.tsx src/app/interests/page.tsx src/app/globals.css`
  - error 없음
  - 기존 `DashboardContent.tsx`의 `<img>` warning만 유지
- `PATH=/opt/homebrew/bin:$PATH npm run dev -- --webpack --hostname 127.0.0.1 --port 3000`
  - webpack dev 서버 정상 기동
- Playwright 모바일 screenshot
  - `/tmp/parrotkit_local_onboarding_auth.png`로 onboarding shell 확인
  - `/tmp/parrotkit_local_interests_auth_longwait_v3.png`로 interests shell 및 selected count 확인
- 로컬 API 인증 확인
  - `GET /api/user/profile` with bearer token 응답 정상

## 메모
- 재사용 테스트 계정에는 이미 interests가 저장돼 있어 브라우저에서 “로그인 후 자동으로 `/onboarding` 진입” 시나리오는 계정 상태상 직접 재현되지 않았다.
- 대신 `SignInForm` 라우팅 코드 변경과 local auth storage 기반 page QA로 흐름을 보완 검증했다.
- activity purpose / interest chip의 브랜드 선택 표현은 글로벌 CSS 클래스 기반이라 추후 my page나 다른 picker UI로도 확장하기 쉽다.
