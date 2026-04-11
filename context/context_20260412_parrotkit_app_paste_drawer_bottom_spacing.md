# Context - Parrotkit App Paste Drawer Bottom Spacing

## 작업 요약
- `source-actions` 시트 하단 여백이 과하게 보인 직접 원인은 RN 구현에서 `safe area + 16`을 outer sheet padding으로 더하고 있었기 때문이다.
- 이를 웹 `PasteDrawer`와 같은 기준인 `max(16px, safe-area)`로 조정했고, 하단 spacing 위치도 시트 바깥 padding이 아니라 scroll content padding으로 옮겼다.
- 결과적으로 CTA 아래 여백은 줄이고, 홈 인디케이터와의 안전 거리는 유지하는 방향으로 정리됐다.

## 변경 파일
- `plans/20260412_parrotkit_app_paste_drawer_bottom_spacing.md`
- `context/context_20260412_parrotkit_app_paste_drawer_bottom_spacing.md`
- `parrotkit-app/src/features/source/screens/source-action-sheet-screen.tsx`

## 검증
- `cd parrotkit-app && npx tsc --noEmit`
  - 결과: 통과

## 남은 리스크
- 실제 기기와 시뮬레이터의 safe area 체감이 조금 다를 수 있어, 시각적으로 더 바짝 붙이고 싶으면 `16` 기준값을 `12`까지 낮출 여지는 있다.
