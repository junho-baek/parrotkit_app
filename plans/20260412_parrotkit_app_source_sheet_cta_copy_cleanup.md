# Plan - Parrotkit App Source Sheet CTA Copy Cleanup

## 배경
- `source-actions` 시트의 바깥 하단 틈은 이미 수정됐고, 현재 사용자가 보는 여백은 시트 내부 패딩과 `Close sheet` 버튼이 차지하는 공간이다.
- 사용자 피드백은 마지막 CTA 카피를 `Make your video recipe`로 바꾸고, `Close sheet` 버튼은 제거해도 된다는 것이다.

## 목표
- 시트 마지막 CTA 카피를 `Make your video recipe`로 변경한다.
- `Close sheet` 버튼을 제거해 하단 공간을 정리한다.
- 시트 내부 여백을 더 자연스럽게 다듬는다.

## 범위
- `parrotkit-app/src/features/source/screens/source-action-sheet-screen.tsx`
- 신규 plan/context 기록

## 변경 파일
- `plans/20260412_parrotkit_app_source_sheet_cta_copy_cleanup.md`
- `context/context_20260412_parrotkit_app_source_sheet_cta_copy_cleanup.md`
- `parrotkit-app/src/features/source/screens/source-action-sheet-screen.tsx`

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`

## 롤백
- CTA 문구를 기존 `Create source draft`로 되돌리고, 필요하면 `Close sheet` 버튼을 다시 추가한다.

## 리스크
- `Close sheet` 버튼 제거 후 닫기 affordance는 backdrop tap에 더 의존하게 된다.
- 최종 CTA 문구가 너무 길게 느껴지면 줄바꿈이나 폰트 크기 조정이 추가로 필요할 수 있다.

## 결과
- 완료
- `source-actions` 시트 마지막 CTA를 `Make your video recipe`로 변경했다.
- `Close sheet` 버튼을 제거해 내부 하단 여백을 정리했다.
- `npx tsc --noEmit` 검증을 통과했다.

## 연결 context
- `context/context_20260412_parrotkit_app_source_sheet_cta_copy_cleanup.md`
