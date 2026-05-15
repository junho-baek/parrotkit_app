# Context 2026-05-16 Sub-AC 10.4.3 Android Bottom Nav Layout Verify

## 작업
Issue 6 Sub-AC 10.4.3: representative Android viewport에서 restored bottom navigation layout을 검증했다.

## DESIGN.md 확인
- Bottom navigation source of truth는 Home, Explore, Paste, Recipes, My five-slot model이다.
- Paste는 larger center action이며 reference link를 붙여 recipe creation drawer/flow로 이어져야 한다.
- Bottom inset/safe-area padding을 유지해야 한다.
- Box-in-box, redundant CTA cluster, Shoot/New Shoot/Start Shoot/debug/console copy를 user-facing UI에 추가하지 않아야 한다.

## 변경
- `src/core/navigation/root-tab-viewport-matrix.ts`
  - Android representative coverage를 `Galaxy compact navigation bar` (`360x800`, bottom inset `24`)까지 확장했다.
  - 기존 `Pixel 8 gesture navigation` (`412x915`, bottom inset `0`) coverage는 유지했다.
  - Android navigation mode union에 `android-navigation-bar`를 추가해 gesture navigation과 reported navigation-bar inset case를 분리했다.
- `src/core/navigation/root-tab-android-layout-verification.test.ts`
  - Android viewport별 five-slot spacing, centered Paste position, 48px tap target, prominent 64px Paste circle, edge target containment, bottom gesture/navigation padding, tab bar height를 검증한다.
- `tsconfig.root-tabs-check.json`
  - 새 Android layout verification test를 focused root-tabs check에 포함했다.
- `plans/20260516_sub_ac_10_4_3_android_bottom_nav_layout_verify.md`
  - verification plan과 결과를 기록했다.

## 검증
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- PASS: `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-safe-area.test.ts`
- PASS: `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-viewport-matrix.test.ts`
- PASS: `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-android-layout-verification.test.ts`
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- PASS: `git diff --check -- src/core/navigation/root-tab-viewport-matrix.ts src/core/navigation/root-tab-android-layout-verification.test.ts tsconfig.root-tabs-check.json plans/20260516_sub_ac_10_4_3_android_bottom_nav_layout_verify.md`
- PASS: forbidden user-facing copy scan returned no hits in the Android verification files and plan.
- BLOCKED: `npx --no-install @google/design.md lint DESIGN.md` failed with `ENOTFOUND registry.npmjs.org`; the package is not installed locally and network is restricted.

## Android layout measurements
- `Pixel 8 gesture navigation`: `412x915`, bottom inset `0`, slot width `80.0px`, minimum tap target `48px`, Paste circle `64px`, tab bar height `76px`, bottom padding `10px`.
- `Galaxy compact navigation bar`: `360x800`, bottom inset `24`, slot width `69.6px`, minimum tap target `48px`, Paste circle `64px`, tab bar height `90px`, bottom padding `24px`.

## 리스크
- Native Android emulator capture was not produced in this sandbox. This Sub-AC is covered by source-level layout verification and TypeScript contract checks.
- Shared worktree contains many sibling-agent changes, so no commit/push was performed.
