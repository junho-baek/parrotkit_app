# Cut Card Saved Take Filtering

## 배경

Sub-AC 12.3.1은 확장된 컷 카드가 해당 컷 카드에 연결된 저장 테이크만 접근할 수 있어야 한다. 현재 저장 테이크 목록은 recipe/scene 기준 조회만 지원한다.

## 목표

- 저장 테이크 조회에 cut-card id 필터를 추가한다.
- Provider에서 cut-card scoped saved-take 조회를 노출한다.
- 기존 recipe/scene 조회 계약은 유지한다.

## 범위

- local/mock saved-take storage helper
- mock workspace provider API
- focused TypeScript contract test

## 변경 파일

- `src/features/recipes/lib/saved-take-storage.ts`
- `src/features/recipes/lib/saved-take-storage.test.ts`
- `src/core/providers/mock-workspace-provider.tsx`
- `context/context_20260514_cut_card_saved_take_filtering.md`

## 테스트

- Red/Green: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.saved-take-storage-check.json`
- 가능하면 broad check: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`

## 롤백

- saved-take storage 옵션과 provider API 추가분을 되돌리면 기존 recipe/scene 조회만 남는다.

## 리스크

- 공유 worktree에 다른 Sub-AC 변경이 많아 커밋/푸시는 aggregate 조율 전에는 위험하다.
- UI가 scene 기반 take collection을 직접 쓰는 경로가 남아 있으면 후속 AC에서 card-scoped helper로 연결해야 한다.

## 결과

- saved-take storage에 `cutId` 필터를 추가했다.
- mock workspace의 `getSavedRecipeTakes`가 recipe id와 함께 scene/cut option을 받을 수 있게 확장했다.
- recipe detail 컷보드 hydration을 `recipeId + sceneId + cutId` 기준 saved-take 조회로 바꿔, expanded cut card의 take count/review 대상이 해당 컷 카드에 연결된 테이크만 보도록 했다.
- 연결 context: `context/context_20260514_cut_card_saved_take_filtering.md`
