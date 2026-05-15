# Context 2026-05-16 Sub-AC 10.4.2 iOS Bottom Nav Layout Verify

## 작업
Issue 6 Sub-AC 10.4.2: representative iOS viewport에서 restored bottom navigation layout을 검증했다.

## DESIGN.md 확인
- Bottom navigation source of truth는 Home, Explore, Paste, Recipes, My five-slot model이다.
- Paste는 larger center action이며 reference link를 붙여 recipe creation drawer/flow로 이어져야 한다.
- Bottom inset/safe-area padding을 유지해야 한다.
- Box-in-box, redundant CTA cluster, Shoot/New Shoot/Start Shoot/debug/console copy를 user-facing UI에 추가하지 않아야 한다.

## 변경
- `src/core/navigation/root-tab-viewport-matrix.ts`
  - iOS representative coverage를 `iPhone 13 mini` (`375x812`, bottom inset `34`)까지 확장했다.
  - 기존 `iPhone 15` (`393x852`, bottom inset `34`) coverage는 유지했다.
- `src/core/navigation/root-tab-ios-layout-verification.test.ts`
  - iOS viewport별 five-slot spacing, centered Paste position, 48px tap target, prominent 64px Paste circle, edge target containment, bottom safe-area padding, tab bar height를 검증한다.
- `tsconfig.root-tabs-check.json`
  - 새 iOS layout verification test를 focused root-tabs check에 포함했다.
- `plans/20260516_sub_ac_10_4_2_ios_bottom_nav_layout_verify.md`
  - verification plan과 결과를 기록했다.

## 검증
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- PASS: `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-safe-area.test.ts`
- PASS: `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-viewport-matrix.test.ts`
- PASS: `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-ios-layout-verification.test.ts`
- PASS: `git diff --check -- src/core/navigation/root-tab-viewport-matrix.ts src/core/navigation/root-tab-ios-layout-verification.test.ts tsconfig.root-tabs-check.json plans/20260516_sub_ac_10_4_2_ios_bottom_nav_layout_verify.md`
- PASS: DESIGN.md guardrail scan confirmed the bottom navigation source requirements. Forbidden-copy hits are only `DESIGN.md` guardrail text and existing internal identifier `homeQuickShootChromeHidden`.
- BLOCKED: `npx --no-install @google/design.md lint DESIGN.md` failed with `ENOTFOUND registry.npmjs.org`; the design.md lint package is not installed locally and network is restricted.

## iOS layout measurements
- `iPhone 13 mini`: slot width `72.6px`, minimum tap target `48px`, Paste circle `64px`, tab bar height `100px`, bottom padding `34px`.
- `iPhone 15`: slot width `76.2px`, minimum tap target `48px`, Paste circle `64px`, tab bar height `100px`, bottom padding `34px`.

## Capture blockers
- Native Simulator capture could not be produced in this sandbox. Computer Use returned approval denied for Simulator, and `xcrun simctl` could not connect to `CoreSimulatorService`.
- Expo web capture could not be produced because `expo start --web --port 8090` never bound the port and exited with `ERR_SOCKET_BAD_PORT` from `freeport-async`.

## 리스크
- This Sub-AC has strong source-level layout verification but no fresh iOS screenshot because the available local execution paths were blocked.
- Shared worktree contains many sibling-agent changes, so no commit/push was performed.
