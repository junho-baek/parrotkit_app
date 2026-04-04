# Mobile Shell Width 500

## 배경
- 현재 ParrotKit는 모바일 앱처럼 보이도록 웹에서도 좁은 쉘 폭을 유지하고 있다.
- 사용자는 웹에서 볼 때 모바일 쉘이 조금 답답하게 느껴져, 쉘과 주요 content wrapper를 약간 더 넓히길 원한다.
- 함께 바깥 배경을 아주 옅은 회색으로 두고, 쉘에 은은한 그림자를 넣어 웹에서 보는 느낌을 개선하고자 한다.

## 목표
- 웹/태블릿 환경에서 앱 쉘 최대 폭을 500px 기준으로 넓힌다.
- 주요 content wrapper도 같은 500px 기준으로 맞춘다.
- 바깥 영역은 매우 옅은 회색으로 처리하고, 쉘에는 가벼운 그림자를 준다.

## 범위
- AppFrame 최대 폭 조정
- 탭 레이아웃 및 주요 wrapper 폭 조정
- 공통 Card 폭 기본값 조정
- 웹에서 쉘 바깥 배경과 그림자 스타일 추가

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
- 필요 시 관련 wrapper 파일

## 테스트
- `npx tsc --noEmit`
- `npm run dev`
- 웹 브라우저에서 쉘 폭, 바깥 배경, 그림자 확인

## 롤백
- 쉘 최대 폭을 기존 480/448 기준으로 되돌리고 배경/그림자 스타일을 제거한다.

## 리스크
- 공통 Card 폭 기본값 변경 시 예상보다 넓어지는 화면이 생길 수 있다.
- max-width 기준이 여러 파일에 퍼져 있어 일부 화면만 폭이 다르게 남을 수 있다.

## 결과
- `AppFrame`의 웹/태블릿 최대 폭을 500px로 조정했다.
- 바깥 레터박스 배경을 아주 옅은 회색으로 바꾸고, 데스크탑 폭에서만 은은한 쉘 그림자를 추가했다.
- 탭 레이아웃, 하단 탭 바, 레시피 플레이어/결과 화면, 대시보드 레이아웃, 온보딩/관심사/붙여넣기/비디오 옵션 화면의 주요 wrapper 폭을 500px 기준으로 맞췄다.
- 공통 `Card` 컴포넌트는 `twMerge`를 사용하도록 바꿔, 기본 폭을 500px로 올리면서도 개별 화면의 `max-w-*` override가 안전하게 동작하도록 정리했다.
- 웹 1440px 뷰포트에서 브라우저로 확인한 결과, `.app-frame-container`의 실제 폭은 `500px`로 계산됐고 그림자도 적용됐다.

## 연결 Context
- `context/context_20260405_014302_mobile_shell_width_500.md`
