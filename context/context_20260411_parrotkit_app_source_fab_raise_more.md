# Context - Parrotkit App Source FAB Raise More

## 작업 요약
- `Source` 화면의 중앙 `+` 버튼을 직전 조정보다 더 위로 올렸다.
- 하단 탭 바와 액션 버튼 사이의 시각적 간격을 더 크게 만들어 버튼이 탭처럼 붙어 보이지 않게 했다.

## 변경 파일
- `plans/20260411_parrotkit_app_source_fab_raise_more.md`
- `parrotkit-app/src/features/source/screens/source-screen.tsx`
- `context/context_20260411_parrotkit_app_source_fab_raise_more.md`

## 구현 메모
- `SourceScreen` FAB bottom 값을 `insets.bottom + 32`에서 `insets.bottom + 52`로 다시 조정했다.
- 버튼 크기, 색상, 그림자는 유지했다.

## 검증
- `cd parrotkit-app && npx tsc --noEmit`
  - 통과
