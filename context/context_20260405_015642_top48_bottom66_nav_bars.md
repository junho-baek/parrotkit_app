# Top 48 Bottom 66 Nav Bars

## 작업 요약
- 하단 네비게이션 총높이를 66px로 맞췄다.
- 상단 바 높이를 48px로 통일했다.
- 상단 바 하단 구분선과 그림자를 제거해 더 플랫한 느낌으로 정리했다.
- `.gitignore`에 `.gstack/`를 추가하는 변경도 함께 반영했다.

## 변경 파일
- `src/components/common/BottomTabBar.tsx`
- `src/app/(tabs)/layout.tsx`
- `src/components/auth/DashboardLayout.tsx`
- `src/app/submit-video/page.tsx`
- `src/app/video-options/page.tsx`
- `src/app/onboarding/page.tsx`
- `src/app/interests/page.tsx`
- `src/components/common/TopNav.tsx`
- `.gitignore`
- `plans/20260405_bottom_nav_height_66.md`

## 검증
- `npm run dev`
  - 로컬 서버 실행 확인
- 브라우저 확인
  - `430x932` 뷰포트 기준 `/home` 로드
  - 계산 결과:
    - `topHeight = 48`
    - `topBorderBottom = 0px`
    - `topBoxShadow = none`
    - `bottomHeight = 66`
- `npx tsc --noEmit`
  - `.next/dev/types` 생성 파일의 문법 오류로 실패
  - 이번 nav 높이 수정 코드 자체에서 새 타입 에러가 나온 것은 아님

## 메모
- 하단 바는 위쪽 border 1px를 포함해 총 높이가 66px가 되도록 내부 콘텐츠 영역 높이를 65px로 맞췄다.
- safe area는 `env(safe-area-inset-bottom, 0px)`만 사용해, 일반 브라우저에서는 추가 높이가 붙지 않게 했다.
