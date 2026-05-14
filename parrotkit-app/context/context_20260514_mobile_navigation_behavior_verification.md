# Context 2026-05-14 Mobile Navigation Behavior Verification

## 작업
Sub-AC 8.2.2: mobile navigation behavior verification for the ParrotKit v1 navigation realignment follow-up.

## 범위
- Verified existing mobile navigation behavior only.
- No product code changes.
- No web QA, commit, push, or merge.

## 확인
- `src/core/navigation/root-tab-config.ts` keeps visible root tabs limited to `index`, `explore`, and `my`.
- `src/core/navigation/root-native-tabs.tsx` renders `NativeTabs.Trigger` from that root tab contract only, so `Source` and `Recipes` are not bottom tabs.
- `src/app/(tabs)/source.tsx` and `src/app/(tabs)/recipes.tsx` still exist as route files, preserving route access without visible bottom tabs.
- `src/app/_layout.tsx` still registers stacked routes for recipe detail, explore recipe detail, prompter, quick shoot, recipe create, and `source-actions`.
- `source-actions` remains a `transparentModal` route, and `SourceActionSheetScreen` still closes through backdrop `router.back()`.
- Global floating create CTA remains routed to `/recipe-create?mode=manual` with Korean label/accessibility label `레시피 생성`.

## 검증
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json` passed.
- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts` passed.
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.global-create-cta-check.json` passed.
- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/global-create-cta.test.ts` passed.

## Simulator
- Attempted `xcrun simctl list devices booted`.
- Attempted `xcrun simctl list devices available`.
- Both failed because CoreSimulatorService was unavailable with `Connection refused` / `connection became invalid`.
- Live iPhone simulator UI evidence could not be produced from this sandbox.

## 결론
Mobile navigation contract remains aligned with the follow-up Seed constraints based on static inspection and focused runtime checks. The only gap is live simulator confirmation, blocked by the local CoreSimulatorService environment.
