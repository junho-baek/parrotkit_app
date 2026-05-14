# 배경

Sub-AC 12.4.2는 expanded cut card의 Retake action이 해당 컷/테이크 상태에 연결되고, 그 카드의 새 촬영 흐름을 시작하거나 기존 review 상태를 초기화해야 한다. 12.4.1에서 Retake 버튼은 노출되었지만 일반 shoot callback을 재사용해 어떤 저장 테이크를 재촬영하는지 route/state contract가 명확하지 않다.

# 목표

- Retake action이 active cut id와 active/selected take id를 prompter route에 전달한다.
- Prompter가 같은 scene 안에서 cut/retake target이 바뀌어도 stale review/save state를 초기화한다.
- 저장된 take가 없는 기본 Shoot 흐름은 그대로 유지한다.

# 범위

- Retake prompter href helper 추가 및 타입 검증
- expanded cut card Retake 버튼에서 active take를 callback으로 전달
- draggable list/detail screen callback 타입 연결
- prompter route params 변경 시 review state reset
- 작업 결과 context 문서 추가

# 변경 파일

- `src/features/recipes/lib/shoot-board-model.ts`
- `src/features/recipes/lib/shoot-board-model.test.ts`
- `src/features/recipes/components/shoot-board-scene-card.tsx`
- `src/features/recipes/components/shoot-board-draggable-list.tsx`
- `src/features/recipes/screens/recipe-detail-screen.tsx`
- `src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
- `context/context_20260514_cut_card_retake_flow_wiring.md`

# 테스트

- Red: retake href helper contract가 구현 전 실패하는지 확인
- Green: targeted TypeScript check로 helper/callback wiring 검증
- 가능하면 전체 `npm exec --offline -- tsc --noEmit` 확인

# 롤백

- retake href helper와 test를 제거하고, Retake 버튼을 기존 `onShoot` no-arg 호출로 되돌린다.
- prompter reset dependency를 기존 scene-only reset으로 되돌린다.

# 리스크

- 공유 worktree가 sibling AC 변경으로 dirty 상태이므로 단독 commit/push는 안전하지 않다.
- `recipe-prompter-camera-screen.tsx`는 여러 AC가 겹친 파일이므로 reset dependency만 최소 수정한다.

# 결과

- `getRecipeRetakePrompterHref`를 추가해 Retake route가 `sceneId`, `cutId`, `retakeTakeId`를 함께 전달하도록 했다.
- expanded cut card Retake 버튼이 현재 active take를 `onShoot` callback으로 전달하도록 연결했다.
- `ShootBoardDraggableList`와 `RecipeDetailScreen` callback 타입을 확장해 Retake일 때 active take 기반 route를 사용한다.
- prompter screen이 같은 scene 안에서도 `cutId` 또는 `retakeTakeId`가 바뀌면 review/save state를 초기화하도록 했다.
- 연결 context: `context/context_20260514_cut_card_retake_flow_wiring.md`

# 검증

- Red: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json` failed with missing `getRecipeRetakePrompterHref`.
- Green: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json` passed.
