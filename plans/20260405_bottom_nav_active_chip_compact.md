# Bottom Nav Active Chip Compact

## 배경
- 하단 네비게이션 총높이는 66px로 맞췄지만, 활성 탭의 배경 캡슐이 너무 크게 보여 네비 전체 높이와 거의 비슷하게 느껴진다.
- 사용자는 활성화된 탭이 더 작고 정제된 칩처럼 보이길 원한다.

## 목표
- 하단 네비게이션의 전체 높이는 유지한다.
- 활성 탭의 시각적 배경 캡슐만 더 작게 만든다.
- 클릭 영역은 유지하면서 active state가 덜 무겁고 덜 부풀어 보이도록 조정한다.

## 범위
- `src/components/common/BottomTabBar.tsx`

## 변경 파일
- `src/components/common/BottomTabBar.tsx`

## 테스트
- `npm run dev`
- 브라우저에서 `/home` 기준 active 탭 크기 시각 확인

## 롤백
- 활성 탭 배경을 기존 outer wrapper 전체 크기로 되돌린다.

## 리스크
- active chip을 너무 줄이면 아이콘과 라벨이 답답해 보일 수 있다.
- hover/inactive 상태와 active 상태의 균형이 어색해질 수 있어 실제 화면 확인이 필요하다.

## 결과
- 클릭 영역은 유지하고, 활성 탭의 보이는 배경을 바깥 링크 전체가 아니라 안쪽 작은 칩으로 옮겼다.
- active chip의 크기를 더 줄여 현재 브라우저 확인 기준으로 `48px x 48px` 정도로 맞췄다.
- 전체 바 높이 66px는 유지하면서, active state가 훨씬 덜 부풀어 보이도록 정리했다.
- 브라우저 계산 결과:
  - `activeLinkHeight = 56`
  - `activeChipHeight = 48`
  - `activeChipWidth = 48`

## 연결 Context
- `context/context_20260405_020002_bottom_nav_active_chip_compact.md`
