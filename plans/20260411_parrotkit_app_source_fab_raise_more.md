# Plan - Parrotkit App Source FAB Raise More

## 배경
- 직전 조정으로 `Source` 화면의 중앙 `+` 버튼을 한 번 올렸지만, 실제 시뮬레이터 기준으로는 여전히 하단 탭 바에 가깝게 느껴진다.
- 사용자 요청은 버튼을 지금보다 조금 더 위로 올려 액션 버튼 성격을 더 분명하게 만드는 것이다.

## 목표
- `Source` 화면 FAB를 추가로 위로 올린다.
- 하단 탭 바와 버튼 사이의 시각적 분리를 더 강화한다.

## 범위
- `SourceScreen` FAB bottom offset 추가 조정
- 작업 결과 기록

## 변경 파일
- `plans/20260411_parrotkit_app_source_fab_raise_more.md`
- `parrotkit-app/src/features/source/screens/source-screen.tsx`
- `context/context_20260411_parrotkit_app_source_fab_raise_more.md`

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`

## 롤백
- FAB bottom offset을 직전 값으로 되돌린다.

## 리스크
- 버튼을 너무 많이 올리면 마지막 카드와 가까워져 리듬이 어색해질 수 있다.

## 결과
- `Source` FAB bottom offset을 `insets.bottom + 32`에서 `insets.bottom + 52`로 올렸다.
- 하단 탭 바와 액션 버튼의 간격을 더 벌려 버튼이 탭 바에 눌려 보이지 않게 조정했다.
- 연결 context: `context/context_20260411_parrotkit_app_source_fab_raise_more.md`
