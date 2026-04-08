# Context - Recipe Prompter Only Cleanup

## 작업 요약
- `Recipe` 탭에서 creator에게 불필요한 `Must Include / Must Avoid` 섹션을 제거하고, prompter cue 카드 중심으로 단순화했습니다.
- `Prompter Picks`, helper copy, `2 visible` 같은 시스템 용어도 걷어내고, cue 카드 자체만 보이도록 정리했습니다.
- cue 카드 더블클릭 시 내용을 바로 수정할 수 있는 inline edit를 추가했습니다.
- 중복 cue가 보이던 원인은 legacy fallback block과 느슨한 merge 규칙이 겹친 영향이 커서, UI 레벨에서도 legacy/system block을 한 번 더 숨기도록 가드했습니다.

## 변경 파일
- `src/components/common/RecipeResult.tsx`
- `plans/20260408_recipe_prompter_only_cleanup.md`

## 구현 메모
- 단일 클릭은 기존 visible 토글을 유지하되, 더블클릭은 toggle 예약을 취소하고 edit mode로 진입하게 했습니다.
- 편집 입력은 blur / Enter 시 저장되고, Escape 시 취소됩니다.
- `Must Include / Must Avoid`는 recipe detail에서 완전히 제거했습니다.

## 검증
- 별도 실행 검증은 이번 턴에서 수행하지 않았습니다.

## 남은 리스크
- cue 카드의 click/double-click 구분은 타이밍 기반이라, 매우 빠른 상호작용에서는 사용감이 약간 다르게 느껴질 수 있습니다.
