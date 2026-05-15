# Context 2026-05-16 Sub-AC 13.2.2 iPhone Paste Submit Flow

## 작업
Issue 6 Sub-AC 13.2.2: iPhone QA evidence showing a reference link submitted through Paste starts the recipe creation flow.

## DESIGN.md 확인
- 작업 전 `DESIGN.md`를 확인했다.
- 관련 기준: centered Paste primary action, reference-link-to-recipe creation, drawer/sheet pattern, mobile safe-area awareness, debug/workflow copy 회피, redundant CTA/box-in-box 회피.

## 변경
- `plans/20260516_sub_ac_13_2_2_iphone_paste_submit_flow.md`
  - Sub-AC 13.2.2 계획과 결과를 기록했다.
- `output/playwright/20260516_sub_ac_13_2_2_iphone_paste_submit_flow.svg`
  - verified source contract 기반의 iPhone-size evidence source를 생성했다.
- `output/playwright/20260516_sub_ac_13_2_2_iphone_paste_submit_flow.png`
  - `390x844` iPhone evidence PNG를 생성했다.
- `output/reports/20260516_sub_ac_13_2_2_iphone_paste_submit_flow.md`
  - 검증 범위, artifact, source contract, runtime capture blocker를 기록했다.

## 검증
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.recipe-create-options-check.json`
- PASS: `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts`
- PASS: `./node_modules/.bin/sucrase-node src/core/navigation/paste-drawer-state.test.ts`
- PASS: `reference-recipe-generation.test.ts` via `sucrase/register/ts` with a temporary `@/` resolver shim.
- PASS: `recipe-create-flow.test.ts` via `sucrase/register/ts` with a temporary `@/` resolver shim.
- PASS: evidence PNG dimensions confirmed as `390 x 844`.
- BLOCKED: `npx --no-install @google/design.md lint DESIGN.md` failed with `ENOTFOUND registry.npmjs.org`; package is not installed locally and network is restricted.

## Evidence
- `output/playwright/20260516_sub_ac_13_2_2_iphone_paste_submit_flow.png`
- Shows a submitted reference link preserved as source material and the resulting recipe board state after Paste submission.
- This is source-contract QA evidence, not a native Simulator screenshot.

## Runtime capture blocker
- Expo web command did not bind `127.0.0.1:8099`.
- Expo exited with `RangeError [ERR_SOCKET_BAD_PORT]: options.port should be >= 0 and < 65536. Received type number (65536).`
- Playwright CLI wrapper could not be used because `npx` attempted package resolution under restricted network.
- Chrome headless screenshot attempts against the local SVG exited without producing a file in this sandbox.

## 리스크
- Native iPhone Simulator evidence is still pending outside this sandbox.
- Shared worktree contains many sibling-agent changes, so this sub-AC was not committed or pushed.
