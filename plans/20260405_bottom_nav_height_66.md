# Bottom Nav 66 And Top Bar 48

## 배경
- 모바일 쉘 폭을 500px로 넓힌 뒤, 사용자는 하단 네비게이션 바를 `66px`, 상단 바를 `48px` 기준으로 더 명확하게 맞추길 원한다.
- 현재 하단 네비게이션은 padding 기반이고, 상단 바는 화면마다 높이와 구분선이 조금씩 달라 보인다.
- 함께 `.gitignore`에 남아 있던 `.gstack/` 변경도 이번에 원격 `dev`에 반영해야 한다.

## 목표
- 하단 네비게이션의 기본 시각 높이를 66px로 맞춘다.
- 상단 바는 48px 높이로 정리하고, 하단 구분선과 그림자를 제거한다.
- safe area는 유지하되, 기본 바 높이 기준이 흔들리지 않도록 정리한다.
- `.gitignore`의 `.gstack/` 변경도 함께 커밋/푸시한다.

## 범위
- `src/components/common/BottomTabBar.tsx`
- 상단 바 역할을 하는 레이아웃/페이지 헤더들
- `.gitignore`

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

## 테스트
- `npx tsc --noEmit`
- `npm run dev`
- 브라우저에서 하단 네비게이션 높이 계산 확인

## 롤백
- 하단 네비게이션 wrapper 높이를 기존 padding 기반 레이아웃으로 되돌린다.
- 상단 바 높이와 border/shadow를 기존 상태로 되돌린다.
- `.gitignore`의 `.gstack/` 라인을 제거한다.

## 리스크
- safe area가 있는 기기에서는 총 nav 영역이 66px보다 커 보일 수 있다.
- 상단 바를 48px로 줄이면 일부 화면에서 제목과 로고가 다소 타이트해질 수 있다.
- 내부 아이콘/라벨 정렬이 달라질 수 있어 한 번은 실제 화면 확인이 필요하다.

## 결과
- 하단 네비게이션 총높이를 66px 기준으로 고정했다.
- safe area는 유지하되, 기본 브라우저 환경에서는 추가 padding 없이 정확히 66px로 계산되도록 조정했다.
- 상단 바는 48px 높이로 맞췄다.
- 탭 레이아웃, 대시보드 레이아웃, 붙여넣기/비디오 옵션, 온보딩/관심사, `TopNav`의 상단 헤더에서 하단 구분선과 그림자를 제거했다.
- `.gitignore`의 `.gstack/` 변경도 이번 작업에 포함했다.
- 브라우저 확인 결과:
  - `topHeight = 48`
  - `topBorderBottom = 0px`
  - `topBoxShadow = none`
  - `bottomHeight = 66`

## 연결 Context
- `context/context_20260405_015642_top48_bottom66_nav_bars.md`
