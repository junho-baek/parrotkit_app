# Context - Parrotkit App Source FAB Shrink

## 작업 요약
- `Source` 화면 중앙 `+` 버튼의 원형 크기를 줄였다.
- 버튼 위치는 유지하고, 원 크기와 아이콘 크기만 줄여 전체 인상을 더 가볍게 만들었다.

## 변경 파일
- `plans/20260411_parrotkit_app_source_fab_shrink.md`
- `parrotkit-app/src/features/source/screens/source-screen.tsx`
- `context/context_20260411_parrotkit_app_source_fab_shrink.md`

## 구현 메모
- FAB 원형 크기를 `68x68`에서 `60x60`으로 줄였다.
- `+` 아이콘 크기를 `30`에서 `26`으로 줄였다.
- FAB bottom offset은 그대로 유지했다.

## 검증
- `cd parrotkit-app && npx tsc --noEmit`
  - 통과
