# Mobile Shell Width 500

## 작업 요약
- 웹에서 모바일 앱 쉘이 너무 좁게 느껴지는 문제를 완화하기 위해 최대 쉘 폭 기준을 500px로 조정했다.
- 바깥쪽 배경은 흰색에서 아주 옅은 회색으로 바꾸고, 웹/태블릿 폭에서만 은은한 쉘 그림자를 추가했다.
- 주요 content wrapper와 하단 탭 바, 레시피 화면 등도 500px 기준으로 맞췄다.

## 변경 파일
- `src/components/common/AppFrame.tsx`
- `src/components/common/Card.tsx`
- `src/app/(tabs)/layout.tsx`
- `src/components/common/BottomTabBar.tsx`
- `src/components/common/RecipeVideoPlayer.tsx`
- `src/components/common/RecipeResult.tsx`
- `src/components/auth/DashboardLayout.tsx`
- `src/app/onboarding/page.tsx`
- `src/app/interests/page.tsx`
- `src/app/video-options/page.tsx`
- `src/app/submit-video/page.tsx`
- `src/components/auth/SignInForm.tsx`
- `src/components/auth/SignUpForm.tsx`
- `src/components/common/PWARegistration.tsx`
- `plans/20260405_mobile_shell_width_500.md`

## 검증
- `npx tsc --noEmit`
  - 통과
- `npx eslint ...`
  - 이번 변경과 직접 관련된 신규 에러는 `AppFrame`의 `prefer-const`만 있었고 수정 후 해소
  - `PWARegistration`의 `setState in effect` 등 기존 경고/에러는 그대로 존재
- `npm run dev`
  - 로컬 dev 서버 실행 확인
- 브라우저 확인
  - 1440px 폭에서 `/signin` 페이지 로드
  - `.app-frame-container` 계산 결과:
    - `width: 500`
    - `maxWidth: 500px`
    - 그림자 적용 확인

## 메모
- 공통 `Card`는 `twMerge`를 도입해 기본 폭을 500px로 올리되, `max-w-2xl` 같은 개별 override가 자연스럽게 덮어쓰도록 정리했다.
- 모바일에서는 여전히 기기 폭을 그대로 사용하고, 500px 제한은 웹/태블릿처럼 넓은 뷰포트에서만 체감된다.
