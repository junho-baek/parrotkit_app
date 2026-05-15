# 2026-05-16 Paste Drawer Close Reset

## 배경
Issue 6 Sub-AC 3.2.3은 Paste drawer/window가 명확한 닫기 동작을 제공하고, 닫힘 후 입력/선택 상태가 다음 열림에 남지 않는 규칙을 가져야 한다.

## 목표
Paste drawer의 dismiss/create close transition을 명시적으로 테스트하고, root overlay가 close 이후 fresh drawer session으로 다시 열리도록 보장한다.

## 범위
- Paste drawer open/close state helper에 reset/session version 계약을 추가한다.
- Root navigation의 Paste drawer overlay에 session key를 연결한다.
- Recipe create drawer close/backdrop affordance와 reset 의도를 명확히 유지한다.
- route mapping, visual five-slot nav, recipe generation draft contract는 건드리지 않는다.

## 변경 파일
- `src/core/navigation/paste-drawer-state.ts`
- `src/core/navigation/paste-drawer-state.test.ts`
- `src/core/navigation/root-native-tabs.tsx`
- `plans/20260516_paste_drawer_close_reset.md`
- `context/context_20260516_paste_drawer_close_reset.md`

## 테스트
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- `git diff --check` on touched files
- DESIGN.md source/fallback lint checks and forbidden user-facing copy search

## 롤백
`paste-drawer-state`를 boolean-only helper로 되돌리고 root navigation의 session key 사용을 제거한다.

## 리스크
- shared worktree에 sibling-agent 변경이 많으므로 이번 subtask 파일만 좁게 수정해야 한다.
- reset session key가 open 상태에서 불필요하게 바뀌면 입력 중 drawer가 remount될 수 있으므로 close/create transition에서만 증가해야 한다.

## 결과
- `paste-drawer-state`를 boolean helper에서 `{ open, resetVersion }` session state helper로 확장했다.
- Paste drawer는 open 중 Paste를 다시 눌러도 reset되지 않고, backdrop/icon dismiss 또는 recipe created transition에서 닫히며 다음 open용 reset key가 증가한다.
- Root navigation overlay가 `resetVersion` 기반 `key`를 `RecipeCreateScreen`에 전달해 close/create 후 다음 Paste open이 fresh drawer state로 시작하도록 했다.
- Recipe creation drawer의 backdrop dismiss와 header close icon에 명시적인 `testID`를 추가하고 같은 dismiss path를 사용하도록 정리했다.

## 검증 결과
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.recipe-create-options-check.json`
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- PASS: `git diff --check -- src/core/navigation/paste-drawer-state.ts src/core/navigation/paste-drawer-state.test.ts src/core/navigation/root-native-tabs.tsx src/features/recipes/screens/recipe-create-screen.tsx plans/20260516_paste_drawer_close_reset.md`
- PASS: DESIGN.md source check for drawer, close affordance, Paste center action, and simplicity guardrails.
- PASS: 금지 copy 검색. 결과는 기존 internal identifier `homeQuickShootChromeHidden`뿐이며 새 user-facing `Shoot`, `New Shoot`, `Start Shoot`, `workflow`, `console`, `debug` copy는 추가하지 않았다.
- BLOCKED: `npx --no-install @google/design.md lint DESIGN.md`는 sandbox network 제한으로 `registry.npmjs.org` DNS 조회가 실패했다 (`ENOTFOUND`). `node_modules/.bin`에도 design lint binary가 없다.
- 연결 context: `context/context_20260516_paste_drawer_close_reset.md`
