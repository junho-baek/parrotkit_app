# Context 2026-05-16 Sub-AC 13.1 iPhone Navigation States

## 작업
Issue 6 Sub-AC 13.1: Home, Explore, Recipes, My navigation states에 대한 iPhone QA evidence를 남겼다.

## DESIGN.md 확인
- 작업 전 `DESIGN.md`를 확인했다.
- 관련 기준: mobile safe-area clearance 유지, Home/Explore/Paste/Recipes/My bottom navigation, centered Paste primary action, box-in-box/redundant CTA/debug copy 회피.

## 변경
- `plans/20260516_sub_ac_13_1_iphone_nav_states.md`
  - Sub-AC 13.1 계획과 결과를 기록했다.
- `output/playwright/20260516_sub_ac_13_1_iphone_home.png`
- `output/playwright/20260516_sub_ac_13_1_iphone_explore.png`
- `output/playwright/20260516_sub_ac_13_1_iphone_recipes.png`
- `output/playwright/20260516_sub_ac_13_1_iphone_my.png`
  - iPhone `390x844` 크기의 route/navigation evidence image를 생성했다.
- `output/reports/20260516_sub_ac_13_1_iphone_nav_states.md`
  - 검증 범위, artifact, runtime capture blocker, stale screenshot exclusion을 기록했다.

## 검증
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- PASS: `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts`
- PASS: `git diff --check -- plans/20260516_sub_ac_13_1_iphone_nav_states.md`
- BLOCKED: `npx --no-install @google/design.md lint DESIGN.md` failed with `ENOTFOUND registry.npmjs.org`; package is not installed locally and network is restricted.

## Route evidence
- Home: `/` -> `src/app/(tabs)/index.tsx` -> `HomeScreen`.
- Explore: `/explore` -> `src/app/(tabs)/explore.tsx` -> `ExploreScreen`.
- Recipes: `/recipes` -> `src/app/(tabs)/recipes.tsx` -> `RecipesScreen`.
- My: `/my` -> `src/app/(tabs)/my.tsx` -> `ProfileScreen`.
- Root tab order remains Home, Explore, Paste, Recipes, My.
- Home QA paths remain covered by `root-tab-config.test.ts`, including `/`, `/(tabs)`, `/(tabs)/index`, and `/home` redirect.

## Runtime capture blockers
- Expo web with `--host 127.0.0.1` failed because Expo only accepts `lan`, `tunnel`, or `localhost`.
- Expo web with `--host localhost` failed in `freeport-async` with `RangeError [ERR_SOCKET_BAD_PORT]`.
- Shell local-port probes were denied by sandbox networking.
- Playwright CLI wrapper failed to fetch `@playwright/cli` due restricted network DNS.
- Computer Use access to Simulator and Chrome was denied.
- `screencapture` failed with `could not create image from display`.

## 리스크
- The saved PNGs are source-contract QA evidence images, not native Simulator screenshots.
- Existing stale three-slot screenshots were not reused as passing evidence.
- Shared worktree contains many sibling-agent changes, so no commit/push was performed for this sub-AC.
