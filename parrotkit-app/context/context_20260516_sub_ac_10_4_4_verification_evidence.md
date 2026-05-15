# Context 2026-05-16 Sub-AC 10.4.4 Verification Evidence

## 작업
Issue 6 Sub-AC 10.4.4: tested configuration별 bottom navigation verification evidence를 기록했다.

## DESIGN.md 확인
- `DESIGN.md`를 변경 전 확인했다.
- 관련 guardrail: mobile safe-area clearance 유지, center Paste action은 recipe creation drawer로 연결, box-in-box/redundant CTA/debug/workflow/Shoot copy 회피.

## 변경
- `plans/20260516_sub_ac_10_4_4_verification_evidence.md`
  - Sub-AC 10.4.4 작업 계획과 리스크를 기록했다.
- `output/reports/20260516_sub_ac_10_4_4_verification_evidence.md`
  - iPhone 13 mini, iPhone 15, Pixel 8 gesture navigation, Galaxy compact navigation bar별 QA notes를 기록했다.
  - route/deep-link/Paste drawer evidence, screenshot availability, stale screenshot exclusion, edge-case findings를 기록했다.
- `context/context_20260516_sub_ac_10_4_4_verification_evidence.md`
  - 실행 결과를 요약했다.

## 검증
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- PASS: `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts`
- PASS: `./node_modules/.bin/sucrase-node src/core/navigation/paste-drawer-state.test.ts`
- PASS: `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-safe-area.test.ts`
- PASS: `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-viewport-matrix.test.ts`
- PASS: `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-ios-layout-verification.test.ts`
- PASS: `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-android-layout-verification.test.ts`
- PASS: `git diff --check -- plans/20260516_sub_ac_10_4_4_verification_evidence.md`
- BLOCKED: `npx --no-install @google/design.md lint DESIGN.md` failed with `ENOTFOUND registry.npmjs.org`; package is not installed locally and network is restricted.

## Evidence notes
- Fresh native iOS/Android screenshots were not captured in this sandbox. Prior iOS/Android Sub-AC contexts already recorded Simulator/CoreSimulator and Expo web capture blockers.
- Existing `output/playwright/20260516_sub_ac_11_1_iphone_home.png` and `output/playwright/20260516_sub_ac_11_2_android_home.png` show the older three-slot nav and were explicitly excluded as passing evidence for this five-slot Paste nav task.
- Focused forbidden-copy scan over the active nav/Paste route files found only internal identifier `homeQuickShootChromeHidden`; no user-facing nav/Paste copy hit Shoot, New Shoot, Start Shoot, workflow, console, or debug.
- Broad repo scan still has legacy/internal Shoot identifiers and older screen copy outside this navigation evidence scope.

## Tested configuration notes
- iPhone 13 mini (`375x812`, bottom inset `34`): five-slot nav source layout passes; slot width `72.6px`, Paste circle `64px`, tab bar height `100px`, bottom padding `34px`.
- iPhone 15 (`393x852`, bottom inset `34`): five-slot nav source layout passes; slot width `76.2px`, Paste circle `64px`, tab bar height `100px`, bottom padding `34px`.
- Pixel 8 gesture navigation (`412x915`, bottom inset `0`): five-slot nav source layout passes; slot width `80.0px`, Paste circle `64px`, tab bar height `76px`, bottom padding `10px`.
- Galaxy compact navigation bar (`360x800`, bottom inset `24`): five-slot nav source layout passes; slot width `69.6px`, Paste circle `64px`, tab bar height `90px`, bottom padding `24px`.

## 리스크
- This sub-AC has recorded QA notes and source-level layout/route evidence, but no fresh native screenshot evidence.
- Shared worktree contains many sibling-agent changes, so no commit/push was performed.
