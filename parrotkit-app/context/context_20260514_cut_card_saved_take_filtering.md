# Context 2026-05-14 Cut Card Saved Take Filtering

## 작업

Sub-AC 12.3.1 범위로 확장 컷 카드가 해당 컷 카드에 연결된 저장 테이크만 접근하도록 saved-take 조회 필터를 추가했다.

## 변경

- `src/features/recipes/lib/saved-take-storage.ts`
  - `ListSavedRecipeTakesOptions.cutId` 추가
  - 저장 테이크의 `cardIds`에 해당 cut id가 포함된 경우만 반환하도록 필터링
- `src/features/recipes/lib/saved-take-storage.test.ts`
  - 같은 scene에 서로 다른 cut-card 저장 테이크가 있을 때 `cutId` 조회가 해당 컷의 테이크만 반환하는 계약 추가
- `src/core/providers/mock-workspace-provider.tsx`
  - `getSavedRecipeTakes(recipeId, options)` 형태로 scene/cut 옵션을 전달할 수 있게 확장
- `src/features/recipes/screens/recipe-detail-screen.tsx`
  - 컷보드 hydration을 scene-wide take collection 대신 `recipeId + sceneId + cutId` saved-take 조회로 연결
  - 확장 컷 카드의 take count/review 진입이 같은 scene의 다른 컷 테이크를 섞지 않도록 함

## 검증

- Red: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.saved-take-storage-check.json`
  - `cutId` 옵션 미정의 오류로 실패 확인
- Green: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.saved-take-storage-check.json`
  - 통과
- Integration targeted: `/private/tmp/parrotkit-cut-card-saved-take-check.json` 임시 config로 provider/detail/storage 대상 `tsc` 실행
  - 통과
- Broad: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
  - 현재 worktree의 unrelated sibling file `src/features/recipes/lib/prompter-mode-state.test.ts`가 missing module로 실패

## 연결된 plan

- `plans/20260514_cut_card_saved_take_filtering.md`
