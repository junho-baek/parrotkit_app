# Bottom Nav Active Chip Compact

## 작업 요약
- 하단 네비게이션의 전체 높이는 유지하고, 활성 탭의 보이는 배경 칩만 더 작게 줄였다.
- active state 배경을 outer link 전체 대신 inner chip에만 적용하도록 구조를 바꿨다.
- 아이콘/라벨/패딩을 함께 줄여 active chip이 전체 바 높이와 거의 비슷해 보이던 문제를 완화했다.

## 변경 파일
- `src/components/common/BottomTabBar.tsx`
- `plans/20260405_bottom_nav_active_chip_compact.md`

## 검증
- `npx eslint src/components/common/BottomTabBar.tsx`
  - 통과
- `npx next dev --webpack`
  - 로컬 서버 실행 확인
- 브라우저 확인
  - `430x932` 기준 `/home`
  - 계산 결과:
    - `activeLinkHeight = 56`
    - `activeChipHeight = 48`
    - `activeChipWidth = 48`

## 메모
- 전체 하단 바 높이 66px는 그대로 유지했다.
- 줄어든 것은 active 배경 칩의 시각적 크기이며, 클릭 영역 자체를 과하게 줄이지는 않았다.
