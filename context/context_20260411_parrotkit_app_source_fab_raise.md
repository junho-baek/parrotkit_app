# Context - Parrotkit App Source FAB Raise

## 작업 요약
- `Source` 화면 하단의 중앙 `+` 버튼이 탭 바에 너무 가깝게 붙어 보이는 문제를 조정했다.
- FAB vertical offset을 올려 버튼이 탭 바와 조금 더 분리되어 보이게 만들었다.

## 변경 파일
- `plans/20260411_parrotkit_app_source_fab_raise.md`
- `parrotkit-app/src/features/source/screens/source-screen.tsx`
- `context/context_20260411_parrotkit_app_source_fab_raise.md`

## 구현 메모
- `SourceScreen`의 FAB `bottom` 값을 `insets.bottom + 14`에서 `insets.bottom + 32`로 변경했다.
- 크기나 그림자 스타일은 유지하고 위치만 조정했다.

## 검증
- `cd parrotkit-app && npx tsc --noEmit`
  - 통과
