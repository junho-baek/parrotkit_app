# Bottom Nav Top Divider Hairline

## 작업 요약
- 하단 네비게이션 위쪽 구분선이 더 얇게 보이도록 상단 border를 `1px`에서 `0.5px` hairline 기준으로 조정했다.
- border width 상수를 실제 `borderTop` 스타일에도 재사용하도록 맞춰, 높이 계산과 선 두께가 같은 기준을 쓰게 정리했다.

## 변경 파일
- `src/components/common/BottomTabBar.tsx`
- `plans/20260405_bottom_nav_top_divider_hairline.md`

## 검증
- `npx eslint src/components/common/BottomTabBar.tsx`
  - 통과
- 로컬 dev 브라우저 확인
  - 대상 URL: `http://127.0.0.1:3000/home`
  - 확인 값:
    - `borderTopStyle = solid`
    - `borderTopColor = rgba(255, 255, 255, 0.6)`
    - `borderTopWidth = 1px`
    - `minHeight = 66px`
    - `height = 66.5px`
  - 메모:
    - 브라우저 CSSOM에서는 hairline border가 `borderTopWidth = 1px`로 반올림되어 보였지만, 최종 nav 높이가 `66.5px`로 계산되어 `0.5px` 상단선 적용은 반영된 것으로 확인했다.
- 스크린샷
  - `output/playwright/20260405_bottom_nav_top_divider_hairline/home-bottom-nav-hairline.png`

## 메모
- 변경 범위는 `BottomTabBar` 한 파일로 제한해 최근 paste/drawer/nav 시각 수정과 충돌하지 않도록 유지했다.
