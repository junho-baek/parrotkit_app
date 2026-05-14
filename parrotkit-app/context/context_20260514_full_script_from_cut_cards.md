# 2026-05-14 Full Script From Cut Cards

## 작업

Sub-AC 15.1.1 범위로 레시피의 카드 기반 컷 카드들을 재생 순서대로 정렬해 연속 전체 스크립트 문자열을 생성하는 경로를 추가했다.

## 변경

- `src/features/recipes/lib/shoot-board-model.ts`
  - `getShootBoardFullScript(board)` 추가
  - `cuts`를 `order` 기준으로 정렬
  - 각 컷의 `lineToSay`를 script text로 우선 사용하고, 비어 있으면 기존 `speakingLine`으로 fallback
  - 빈 문자열은 제외하고 `\n\n`로 이어 붙임
- `src/features/recipes/lib/shoot-board-model.test.ts`
  - 재정렬된 보드에서 전체 스크립트가 playback/order 순서로 생성되는지 검증
  - 빈 script text가 전체 스크립트에서 제외되는지 검증
- `src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
  - prompter가 저장된 editor board를 찾을 수 있으면 컷 카드 기반 전체 스크립트를 우선 표시하도록 연결

## 검증

- `npm exec --offline -- tsc --noEmit`는 기존/sibling 작업의 누락 파일 `src/features/recipes/lib/prompter-take-save-state.ts`, `src/features/recipes/lib/cut-card-body-preview.ts` 때문에 실패했다.
- 임시 focused tsconfig로 `src/features/recipes/lib/shoot-board-model.test.ts`와 `src/features/recipes/screens/recipe-prompter-camera-screen.tsx`를 포함해 `npm exec --offline -- tsc --noEmit -p tsconfig.full-script-check.json` 통과 후 임시 파일 삭제.

## 연결된 plan

- `plans/20260514_full_script_from_cut_cards.md`
