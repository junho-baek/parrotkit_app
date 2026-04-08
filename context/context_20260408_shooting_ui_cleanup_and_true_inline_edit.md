# Context - Shooting UI 정리 및 진짜 인라인 편집

## 작업 요약
- `Recipe`와 `Prompter` cue 편집 모두 더블클릭 시 기존 카드 폭/높이를 유지한 채 같은 자리에서 바로 수정되도록 바꿨습니다.
- `Prompter` 탭 이름을 `Shooting`으로 바꾸고, shooting 탭에서는 agent FAB가 뜨지 않도록 정리했습니다.
- shooting 화면 내부의 `Back` 버튼과 `Prompter` badge를 제거해 촬영에만 집중되는 화면으로 단순화했습니다.

## 변경 파일
- `src/components/common/RecipeResult.tsx`
- `src/components/common/CameraShooting.tsx`
- `plans/20260408_shooting_ui_cleanup_and_true_inline_edit.md`

## 구현 메모
- 편집 중에는 기존 텍스트를 투명하게 유지하고 동일 위치에 absolute textarea를 덮어 카드 크기 변형을 막았습니다.
- recipe 상단 tab label은 internal key 대신 display label helper로 렌더링하게 바꿨습니다.
- shooting 탭에서만 chat agent FAB를 숨기도록 조건을 추가했습니다.

## 검증
- 별도 실행 검증은 이번 턴에서 수행하지 않았습니다.

## 남은 리스크
- 편집 중 텍스트가 원본보다 훨씬 길어지면 commit 전까지는 기존 카드 크기 기준으로 보이므로, 아주 긴 수정은 저장 후 최종 배치를 다시 확인하는 편이 안전합니다.
