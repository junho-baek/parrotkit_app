# Context - Parrotkit App Source Sheet CTA Copy Cleanup

## 작업 요약
- `source-actions` 시트의 바깥 하단 틈은 이미 수정된 상태이며, 현재 보이는 여백은 시트 내부 패딩과 `Close sheet` 버튼이 만든 공간이라는 점을 다시 확인했다.
- 마지막 primary CTA 문구를 `Create source draft`에서 `Make your video recipe`로 변경했다.
- `Close sheet` 버튼을 제거해 시트 하단 여백이 더 짧고 자연스럽게 보이도록 정리했다.

## 변경 파일
- `plans/20260412_parrotkit_app_source_sheet_cta_copy_cleanup.md`
- `context/context_20260412_parrotkit_app_source_sheet_cta_copy_cleanup.md`
- `parrotkit-app/src/features/source/screens/source-action-sheet-screen.tsx`

## 검증
- `cd parrotkit-app && npx tsc --noEmit`
  - 결과: 통과

## 남은 리스크
- CTA 문구가 길어지면서 작은 기기 폭에서 답답해 보이면 아이콘 간격이나 폰트 크기를 한 번 더 조정할 수 있다.

## 메모
- 닫기 affordance는 이제 하단 버튼 대신 backdrop tap과 시스템 dismiss 제스처가 담당한다.
