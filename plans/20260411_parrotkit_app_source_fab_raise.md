# Plan - Parrotkit App Source FAB Raise

## 배경
- `Source` 탭 도입 후 중앙 `+` 버튼이 하단 네이티브 탭 바에 너무 가깝게 붙어 보여 시각적 여유가 부족하다.
- 사용자 요청은 버튼을 "좀 더 위로" 올려 탭 바와의 간격을 더 확보하는 것이다.

## 목표
- `Source` 화면의 중앙 `+` 버튼 위치를 위로 조정한다.
- 버튼과 탭 바의 겹침 없이 액션 버튼으로 더 분명하게 보이게 만든다.

## 범위
- `SourceScreen`의 FAB vertical offset 조정
- 작업 결과 기록

## 변경 파일
- `plans/20260411_parrotkit_app_source_fab_raise.md`
- `parrotkit-app/src/features/source/screens/source-screen.tsx`
- `context/context_20260411_parrotkit_app_source_fab_raise.md`

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`

## 롤백
- `SourceScreen`의 FAB `bottom` offset을 기존 값으로 되돌린다.

## 리스크
- 버튼을 너무 많이 올리면 Source 화면 하단 카드와 가까워져 시선 흐름이 오히려 답답해질 수 있다.

## 결과
- `Source` 화면의 FAB `bottom` offset을 `insets.bottom + 14`에서 `insets.bottom + 32`로 올렸다.
- 하단 탭 바와 액션 버튼 사이의 시각적 간격을 더 확보해 액션 버튼이 덜 눌려 보이게 조정했다.
- 연결 context: `context/context_20260411_parrotkit_app_source_fab_raise.md`
