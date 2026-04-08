# Context - Prompter / Recipe 인라인 Cue 편집 통합

## 작업 요약
- `Prompter` 하단의 `Layout` 버튼을 recipe와 같은 `+` 버튼으로 바꾸고, 누르면 새 cue를 바로 추가하도록 정리했습니다.
- prompter overlay 블록은 라벨을 제거하고 cue 내용만 보이게 했으며, recipe에서 지정한 accent color를 그대로 반영하도록 맞췄습니다.
- `Recipe`와 `Prompter` 모두 더블클릭 시 별도 input box가 뜨지 않고 카드 안에서 직접 수정되는 형태로 통일했습니다.

## 변경 파일
- `src/components/common/CameraShooting.tsx`
- `src/components/common/RecipeResult.tsx`
- `plans/20260408_prompter_recipe_inline_cue_edit.md`

## 구현 메모
- prompter custom cue 기본값도 `New cue` + `blue` accent로 맞췄습니다.
- prompter overlay는 drag/resize는 유지하면서, editing 중에는 drag 시작을 막아 충돌을 줄였습니다.
- recipe cue 편집 textarea는 배경/보더를 제거해 기존 카드 UI 안에서 그대로 수정되는 느낌으로 정리했습니다.

## 검증
- 별도 실행 검증은 이번 턴에서 수행하지 않았습니다.

## 남은 리스크
- prompter의 예전 layout drawer는 현재 진입 버튼 없이 남아 있어, 이후 완전히 제거할지 유지할지 한 번 더 정리할 여지가 있습니다.
