# Context 2026-05-16 Paste Drawer Shell State

## 작업
Issue 6 Sub-AC 3.2.1: 중심 Paste 하단 네비게이션 액션이 reference-link recipe creation drawer/window shell을 local open/close state로 표시하도록 연결했다.

## DESIGN.md 확인
- Recipe creation drawer는 bottom drawer/modal sheet pattern을 유지해야 함을 확인했다.
- Preferred v1 bottom navigation model은 Home, Explore, Paste, Recipes, My이며 Paste는 reference link를 recipe generation source로 쓰는 중심 액션임을 확인했다.
- box-in-box, redundant CTA, Shoot/New Shoot/Start Shoot/workflow/console/debug user-facing copy 금지 guardrail을 확인했다.

## 변경
- `src/core/navigation/paste-drawer-state.ts`
  - Paste drawer `open`, `close`, `created` action에 대한 작은 state transition helper를 추가했다.
- `src/core/navigation/paste-drawer-state.test.ts`
  - open action이 drawer shell을 표시하고 close/created action이 drawer를 닫는 계약을 추가했다.
- `src/core/navigation/root-native-tabs.tsx`
  - 중심 `Paste` tab press가 route 이동 대신 local `pasteDrawerOpen` state를 켜도록 변경했다.
  - open 상태에서 `RecipeCreateScreen initialMode="reference"`를 absolute overlay로 렌더링한다.
  - drawer close/backdrop close는 local state를 닫고, recipe 생성 완료 시 drawer를 닫은 뒤 생성 recipe route로 이동한다.
- `src/features/recipes/screens/recipe-create-screen.tsx`
  - 기존 route modal 동작은 유지하면서 nav-owned drawer로도 재사용할 수 있게 optional `initialMode`, `onClose`, `onCreated` props를 추가했다.
- `tsconfig.root-tabs-check.json`
  - Paste drawer state contract와 root-native-tabs wiring을 포함하도록 확장했다.

## 검증
- RED 확인: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
  - 기대대로 `Cannot find module './paste-drawer-state'`에서 실패했다.
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- PASS: `git diff --check -- src/core/navigation/root-native-tabs.tsx src/core/navigation/paste-drawer-state.ts src/core/navigation/paste-drawer-state.test.ts src/features/recipes/screens/recipe-create-screen.tsx tsconfig.root-tabs-check.json plans/20260516_paste_drawer_shell_state.md`
- PASS: DESIGN.md source check
  - `rg -n "Recipe creation must use the bottom drawer|Paste as the larger center action|Paste is not a generic plus button|Do not create box-in-box|Do not add redundant CTA" DESIGN.md`
- PASS: 금지 copy 검색
  - `rg -n "Shoot|New Shoot|Start Shoot|workflow|console|debug" src/core/navigation src/features/recipes/screens/recipe-create-screen.tsx -S`
  - 결과는 기존 내부 식별자 `homeQuickShootChromeHidden` 및 test 문구뿐이며 새 user-facing 금지 copy 추가 없음.
- BLOCKED: `npx --no-install @google/design.md lint DESIGN.md`
  - sandbox network 제한으로 `registry.npmjs.org` DNS 조회가 실패했다 (`ENOTFOUND`).
  - repo-local `package.json`/`node_modules/.bin`에는 DESIGN.md lint script/binary가 없다.

## 리스크 / 후속
- 실제 iPhone/Android capture에서 center Paste press가 drawer를 여는지는 후속 simulator QA AC에서 확인해야 한다.
- shared worktree에 sibling-agent 변경이 많아 이번 subtask 파일만 분리 커밋하기 어렵다. 산출물/plan/context는 커밋 대상에서 제외하라는 Seed 제약도 있어 최종 통합 단계에서 선별 커밋이 필요하다.
