# Plan - Parrotkit App Source FAB Shrink

## 배경
- `Source` 화면의 중앙 `+` 버튼 위치는 개선됐지만, 현재 원형 버튼 자체가 조금 크게 느껴진다.
- 사용자 요청은 버튼 원을 더 작게 만들어 탭 바와의 비례를 더 자연스럽게 맞추는 것이다.

## 목표
- `Source` FAB 원형 버튼 크기를 줄인다.
- `+` 아이콘도 비례에 맞게 함께 줄여 전체 인상을 더 가볍게 만든다.

## 범위
- `SourceScreen` FAB 크기와 아이콘 크기 조정
- 작업 결과 기록

## 변경 파일
- `plans/20260411_parrotkit_app_source_fab_shrink.md`
- `parrotkit-app/src/features/source/screens/source-screen.tsx`
- `context/context_20260411_parrotkit_app_source_fab_shrink.md`

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`

## 롤백
- FAB 원형 크기와 아이콘 크기를 직전 값으로 되돌린다.

## 리스크
- 버튼을 너무 작게 줄이면 center action 존재감이 약해질 수 있다.

## 결과
- FAB 원형 크기를 `68x68`에서 `60x60`으로 줄였다.
- `+` 아이콘 크기를 `30`에서 `26`으로 줄여 버튼 비례를 함께 조정했다.
- 연결 context: `context/context_20260411_parrotkit_app_source_fab_shrink.md`
