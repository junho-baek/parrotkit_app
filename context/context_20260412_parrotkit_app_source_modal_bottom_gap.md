# Context - Parrotkit App Source Modal Bottom Gap

## 작업 요약
- `source-actions` transparent modal 하단에 보이던 의도치 않은 여백 원인을 확인하고 수정했다.
- 원인은 시트 바깥을 `SafeAreaView edges={['bottom']}`로 감싸고 있었기 때문에, bottom inset이 시트 내부 패딩이 아니라 시트 아래 투명 공간처럼 보인 점이었다.
- safe area 처리를 `useSafeAreaInsets()` 기반의 내부 `paddingBottom`으로 바꿔, 시트는 화면 하단에 붙고 홈 인디케이터 여유만 내부에서 확보하도록 정리했다.

## 변경 파일
- `plans/20260412_parrotkit_app_source_modal_bottom_gap.md`
- `context/context_20260412_parrotkit_app_source_modal_bottom_gap.md`
- `parrotkit-app/src/features/source/screens/source-action-sheet-screen.tsx`

## 검증
- `cd parrotkit-app && npx tsc --noEmit`
  - 결과: 통과

## 남은 리스크
- 실제 기기에서 홈 인디케이터와 하단 버튼 간격이 너무 타이트하게 느껴지면 `paddingBottom: insets.bottom + 16` 값을 소폭 조정할 수 있다.

## 메모
- 원래 보이던 하단 여백은 modal presentation 자체 문제가 아니라 safe area 적용 위치 문제였다.
