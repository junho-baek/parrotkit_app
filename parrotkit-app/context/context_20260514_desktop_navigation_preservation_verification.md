# Context 2026-05-14 Desktop Navigation Preservation Verification

## Task
Sub-AC 8.2.1: Verify desktop navigation routes, labels, and active states from `job_46a1bf0280ed` remain unchanged.

## Source artifacts checked
- `AGENT.md`
- `context/parrotkit_v1_nav_realignment_followup_seed_20260514.yaml`
- `context/context_20260514_preserve_completed_fixes_inventory.md`
- `context/context_20260514_bottom_tabs_v1_scope.md`
- `plans/20260514_source_recipes_not_bottom_tabs.md`
- `src/core/navigation/root-tab-config.ts`
- `src/core/navigation/root-native-tabs.tsx`
- `src/core/navigation/root-tab-config.test.ts`
- `src/core/i18n/app-language.tsx`
- `src/app/(tabs)/_layout.tsx`

`src/AGENTS.md` was requested by the Seed constraints but is not present in this checkout.

## Verification notes
- `src/app/(tabs)/_layout.tsx` still delegates the tab layout to `RootNativeTabs`.
- `src/core/navigation/root-tab-config.ts` still defines `rootTabNames` as `index`, `explore`, and `my`.
- `RootNativeTabs` maps only `rootTabNames` into `NativeTabs.Trigger`, so `source` and `recipes` remain absent from the visible bottom tab trigger set.
- Tab labels remain read from `copy.nav` for the three visible routes:
  - English: `Home`, `Explore`, `My`
  - Korean: `홈`, `탐색`, `마이`
- Active/default icon states remain defined in `RootTabIcon`:
  - Home: `home-variant-outline` / `home-variant`, SF Symbols `house` / `house.fill`
  - Explore: `compass-outline` / `compass`, SF Symbols `safari` / `safari.fill`
  - My: `account-outline` / `account`, SF Symbols `person` / `person.fill`
- The route files for `source` and `recipes` still exist, preserving route integrity, but they are not visible bottom tab triggers.

## Verification commands
- Passed: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- Passed: `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts`

## Result
- Verified. Desktop/root navigation routes, labels, and active/default icon states remain unchanged for the visible Home, Explore, My tab set from the previous completed navigation work.
- No navigation product code changes were made for this sub-AC.

## Remaining risks
- This was a static and focused TypeScript verification. It did not add new simulator screenshot evidence.
