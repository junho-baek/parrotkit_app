# Context 2026-05-16 Sub-AC 13.2.1 iPhone Paste Drawer

## 작업
Issue 6 Sub-AC 13.2.1: iPhone QA evidence showing the centered Paste bottom-nav action opens the paste/reference-link drawer.

## DESIGN.md 확인
- 작업 전 `DESIGN.md`를 확인했다.
- 관련 기준: mobile safe-area clearance, centered Paste primary action, recipe creation drawer pattern, visible paste/link input affordance, debug/workflow copy 회피, redundant CTA/box-in-box 회피.

## 변경
- `plans/20260516_sub_ac_13_2_1_iphone_paste_drawer.md`
  - Sub-AC 13.2.1 계획과 결과를 기록했다.
- `output/playwright/20260516_sub_ac_13_2_1_iphone_paste_drawer.png`
  - iPhone `390x844` evidence image를 생성했다.
- `output/reports/20260516_sub_ac_13_2_1_iphone_paste_drawer.md`
  - 검증 범위, artifact, source contract, runtime capture blocker를 기록했다.

## 검증
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- PASS: `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts`
- PASS: `./node_modules/.bin/sucrase-node src/core/navigation/paste-drawer-state.test.ts`
- PASS: evidence PNG dimensions confirmed as `390 x 844`.
- BLOCKED: `npx --no-install @google/design.md lint DESIGN.md` failed with `ENOTFOUND registry.npmjs.org`; package is not installed locally and network is restricted.

## Evidence
- `output/playwright/20260516_sub_ac_13_2_1_iphone_paste_drawer.png`
- Shows Home behind the drawer backdrop, five-slot bottom nav, prominent active centered Paste, and a reference-link input drawer with create-recipe affordance.
- This is source-contract QA evidence, not a native Simulator screenshot.

## Runtime capture blocker
- Expo web command started but did not bind `localhost:8099` in the sandbox.
- `curl` to `http://localhost:8099` failed with connection refused.
- Browser/native screenshot capture could not be completed from this sandbox, so stale screenshots were not reused.

## 리스크
- Native iPhone Simulator evidence is still pending outside this sandbox.
- Shared worktree contains many sibling-agent changes, so this sub-AC was not committed or pushed.
