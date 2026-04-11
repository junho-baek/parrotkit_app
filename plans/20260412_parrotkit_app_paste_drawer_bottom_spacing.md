# Plan - Parrotkit App Paste Drawer Bottom Spacing

## 배경
- 최신 `source-actions` 웹 패리티 구현 이후, 사용자는 시트 하단 여백이 과하다고 지적했다.
- 현재 RN 시트는 하단 여백을 `safe area + 16`으로 계산하고 있어, 웹 `PasteDrawer`의 `max(16px, safe-area)` 규칙보다 더 큰 공백이 생긴다.

## 목표
- `source-actions` 시트 하단 spacing을 웹 드로어와 같은 기준으로 조정한다.
- 시트 바깥이 아니라 내부 scroll content 기준으로 하단 safe area를 처리해 공백을 줄인다.

## 범위
- `parrotkit-app/src/features/source/screens/source-action-sheet-screen.tsx`
- 신규 plan/context 기록

## 변경 파일
- `plans/20260412_parrotkit_app_paste_drawer_bottom_spacing.md`
- `context/context_20260412_parrotkit_app_paste_drawer_bottom_spacing.md`
- `parrotkit-app/src/features/source/screens/source-action-sheet-screen.tsx`

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`

## 롤백
- 하단 spacing 계산을 이전 값으로 되돌린다.

## 리스크
- padding을 너무 줄이면 CTA가 홈 인디케이터와 너무 가까워질 수 있다.

## 결과
- 시트 바깥 컨테이너에서 `paddingBottom: insets.bottom + 16`으로 처리하던 방식을 제거했다.
- 하단 spacing은 scroll content 기준 `Math.max(insets.bottom, 16)`으로 옮겨 웹 `PasteDrawer`의 `max(16px, safe-area)` 규칙과 맞췄다.
- `cd parrotkit-app && npx tsc --noEmit` 검증을 통과했다.

## 연결 context
- `context/context_20260412_parrotkit_app_paste_drawer_bottom_spacing.md`
