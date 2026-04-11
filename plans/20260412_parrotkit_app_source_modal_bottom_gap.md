# Plan - Parrotkit App Source Modal Bottom Gap

## 배경
- `source-actions` transparent modal을 열었을 때 하단에 의도치 않은 여백이 보인다.
- 현재 구현은 시트 바깥을 `SafeAreaView edges={['bottom']}`로 감싸고 있어, bottom inset이 시트 내부 패딩이 아니라 시트 아래 투명 공간처럼 보일 가능성이 크다.
- 사용자는 시뮬레이터 기준으로 이 하단 여백 원인을 지적했고, 시트가 바닥에 자연스럽게 붙도록 정리할 필요가 있다.

## 목표
- `source-actions` 모달 시트가 화면 하단에 자연스럽게 붙도록 safe area 처리를 수정한다.
- bottom inset은 시트 바깥 여백이 아니라 시트 내부 패딩으로 적용한다.

## 범위
- `parrotkit-app/src/features/source/screens/source-action-sheet-screen.tsx`
- 신규 plan/context 기록

## 변경 파일
- `plans/20260412_parrotkit_app_source_modal_bottom_gap.md`
- `context/context_20260412_parrotkit_app_source_modal_bottom_gap.md`
- `parrotkit-app/src/features/source/screens/source-action-sheet-screen.tsx`

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`

## 롤백
- `source-action-sheet-screen.tsx`의 safe area wrapper를 이전 `SafeAreaView edges={['bottom']}` 구조로 되돌린다.

## 리스크
- bottom inset을 너무 적게 주면 홈 인디케이터와 하단 버튼이 가까워질 수 있다.
- 실제 기기와 시뮬레이터의 safe area 차이로 최종 미세 조정이 한 번 더 필요할 수 있다.

## 결과
- 완료
- `source-actions` 시트 바깥 `SafeAreaView`를 제거하고, `useSafeAreaInsets()` 기반 내부 bottom padding으로 교체했다.
- 시트는 화면 하단에 붙고, 홈 인디케이터 여백은 내부 컨텐츠 패딩으로만 확보되도록 정리했다.
- `npx tsc --noEmit` 검증을 통과했다.

## 연결 context
- `context/context_20260412_parrotkit_app_source_modal_bottom_gap.md`
