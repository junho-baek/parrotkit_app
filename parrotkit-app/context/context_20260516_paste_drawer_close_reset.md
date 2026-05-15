# Context 2026-05-16 Paste Drawer Close Reset

## 작업
Issue 6 Sub-AC 3.2.3: Paste drawer/window의 dismiss controls와 close/reset state contract를 명확히 했다.

## DESIGN.md 확인
- Recipe creation은 bottom drawer/modal sheet pattern을 유지해야 함을 확인했다.
- Drawer 필수 요소에 dimmed backdrop, visible drag handle, close affordance, one primary CTA가 포함됨을 확인했다.
- Preferred bottom navigation model은 Home, Explore, Paste, Recipes, My이며 Paste는 reference link를 recipe generation source로 쓰는 중심 액션임을 확인했다.
- box-in-box, redundant CTA, Shoot/New Shoot/Start Shoot/workflow/console/debug user-facing copy 금지 guardrail을 확인했다.

## 변경
- `src/core/navigation/paste-drawer-state.ts`
  - Paste drawer state를 `{ open, resetVersion }` session state로 확장했다.
  - `open`은 drawer를 표시하되 이미 열린 세션의 입력 상태를 reset하지 않는다.
  - `dismiss`/`close`/`created`는 열린 drawer를 닫고 다음 open용 `resetVersion`을 증가시킨다.
- `src/core/navigation/paste-drawer-state.test.ts`
  - open, repeated open, dismiss, reopen, created, closed dismiss transition 계약을 추가했다.
- `src/core/navigation/root-native-tabs.tsx`
  - Root overlay가 `pasteDrawerState.open`을 기준으로 drawer를 표시하고, `resetVersion` 기반 key를 `RecipeCreateScreen`에 전달한다.
  - Backdrop/icon dismiss는 `dismiss` transition, recipe 생성 완료는 `created` transition을 사용한다.
- `src/features/recipes/screens/recipe-create-screen.tsx`
  - Backdrop dismiss와 header close icon이 같은 `dismissDrawer` path를 사용하도록 정리했다.
  - `recipe-create-dismiss-backdrop`, `recipe-create-close-button` testID를 추가했다.

## 검증
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.recipe-create-options-check.json`
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- PASS: `git diff --check -- src/core/navigation/paste-drawer-state.ts src/core/navigation/paste-drawer-state.test.ts src/core/navigation/root-native-tabs.tsx src/features/recipes/screens/recipe-create-screen.tsx plans/20260516_paste_drawer_close_reset.md`
- PASS: DESIGN.md source check
  - `rg -n "Recipe creation must use the bottom drawer|close affordance|Paste as the larger center action|Paste is not a generic plus button|Do not create box-in-box|Do not add redundant CTA" DESIGN.md`
- PASS: 금지 copy 검색
  - `rg -n "Shoot|New Shoot|Start Shoot|workflow|console|debug" src/core/navigation/paste-drawer-state.ts src/core/navigation/paste-drawer-state.test.ts src/core/navigation/root-native-tabs.tsx src/features/recipes/screens/recipe-create-screen.tsx -S`
  - 결과는 기존 internal identifier `homeQuickShootChromeHidden`뿐이며 새 user-facing 금지 copy는 추가하지 않았다.
- BLOCKED: `npx --no-install @google/design.md lint DESIGN.md`
  - sandbox network 제한으로 `registry.npmjs.org` DNS 조회가 실패했다 (`ENOTFOUND`).
  - repo-local `node_modules/.bin`에는 design lint binary가 없다.

## 리스크 / 후속
- 실제 iPhone/Android capture에서 close icon/backdrop dismiss와 reopen reset은 후속 simulator QA AC에서 확인해야 한다.
- shared worktree에 sibling-agent 변경이 많아 이번 subtask 파일만 분리 커밋하기 어렵다. Seed 제약상 QA screenshots/local plans는 커밋 대상에서 제외해야 한다.
