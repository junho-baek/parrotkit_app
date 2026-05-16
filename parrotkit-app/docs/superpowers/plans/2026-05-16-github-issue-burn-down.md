# GitHub Issue Burn-Down Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close or materially advance the highest-value open GitHub issues by removing the stale Source product route model, validating Paste as an in-place drawer action, simplifying Explore cards, improving board layout, and producing final native QA evidence.

**Architecture:** Treat `Paste` as a center action in the main tab shell, not a destination route. Keep destination tabs as Home, Explore, Recipes, and My, while rendering Paste as a custom tab-bar action that opens `RecipeCreateScreen` in drawer mode over the current screen. UI simplification work follows `DESIGN.md`: fewer labels, card-as-CTA, no box-in-box, and progress/details only where they reduce uncertainty.

**Tech Stack:** Expo Router, React Native, custom Expo Tabs shell, TypeScript, source-contract tests via `sucrase-node`, full type check via `tsc --noEmit`, GitHub CLI for issue updates.

---

## Issue Strategy

### Close candidates after this plan

- `#13` Remove Source and source-actions from product navigation
- `#14` Update Paste navigation and drawer contract tests
- `#15` Run targeted main-tab Paste QA
- `#11` Parent epic for Source removal and in-place Paste drawer
- `#6` Older Paste/nav task, once aligned with `#11`
- `#7` Explore card CTA simplification
- `#9` Shooting board page layout and reference placement
- `#10` Final native QA capture package
- `#4` Passive next-cut guidance, if verification confirms current implementation satisfies it
- `#1` Home Continue parent, after `#4` and already closed `#2/#3` are reconciled

### Execution grouping

1. **Navigation Burn-Down:** `#13`, `#14`, `#15`, then close parent `#11` and reconcile `#6`.
2. **Explore UI Burn-Down:** `#7`.
3. **Board UI Burn-Down:** `#9`, then verify `#4`.
4. **Final QA Package:** `#10`, then close parent `#5` if all children are closed.

---

## File Structure

### Navigation and Paste action

- Modify `src/core/navigation/root-tab-config.ts`
  - Define destination tabs separately from bottom-nav items.
  - Rename the center action from internal `source` to `paste`.
  - Make Paste `href: null` so it is not a destination route.
- Modify `src/core/navigation/root-tab-icons.ts`
  - Use `paste` as the center action key.
- Modify `src/core/navigation/root-tab-viewport-matrix.ts`
  - Model Home, Explore, Paste, Recipes, My as visible nav items, with only Home/Explore/Recipes/My as destination tabs.
- Modify `src/core/i18n/app-language.tsx`
  - Rename nav copy key from `source` to `paste`.
- Modify `src/app-shell/navigation/root-native-tabs.tsx`
  - Compare against `paste`, not `source`.
  - Render Paste action screen with `href: null`.
  - Keep drawer state local and current-screen preserving.
- Delete `src/app/(tabs)/source.tsx`
- Create `src/app/(tabs)/paste.tsx`
  - Hidden compatibility screen that redirects to `/` if reached directly.
- Delete `src/app/source-actions.tsx`
- Modify `src/app/_layout.tsx`
  - Remove `source-actions` stack registration.
- Delete `src/features/source/screens/source-screen.tsx`
- Delete `src/features/source/screens/source-action-sheet-screen.tsx`
- Modify `src/core/navigation/global-create-cta.ts`
  - Remove `/source` and `/source-actions` from hidden paths because those routes are no longer product routes.

### Navigation tests

- Modify `src/core/navigation/root-tab-config.test.ts`
- Modify `src/core/navigation/root-tab-viewport-matrix.test.ts`
- Modify `src/core/navigation/root-tab-ios-layout-verification.test.ts`
- Modify `src/core/navigation/root-tab-android-layout-verification.test.ts`
- Keep `src/core/navigation/paste-drawer-state.test.ts`
  - It already covers open/reopen/dismiss/created state.

### Explore simplification

- Modify `src/features/explore/screens/explore-screen.tsx`
  - Remove non-essential row metadata/chips where they do not reduce uncertainty.
  - Keep card/row as the CTA.
  - Use title, creator, image, and a chevron only.
- Create `src/features/explore/lib/explore-card-cta-contract.test.ts`
  - Source guard for no duplicate CTA buttons and no CTA button clusters.

### Board simplification

- Modify `src/features/recipes/screens/recipe-detail-screen.tsx`
- Modify `src/features/recipes/components/shoot-board-scene-card.tsx`
  - Keep only cut title, line to say, shot guide, checklist/progress, saved takes, and reference/take media.
  - Remove nested bordered boxes where the inner surface is not real media.
- Create or modify focused board tests:
  - `src/features/recipes/lib/cut-card-reference-viewer-section.test.ts`
  - `src/features/recipes/lib/cut-card-media-slots.test.ts`
  - Add source guards only where DOM/native rendering tests are not available.

### Plans, context, QA output

- Create per-work `plans/YYYYMMDD_*.md` before implementation.
- Create per-work `context/context_YYYYMMDD_*.md` after implementation.
- Save screenshots under `output/playwright/`.
- Save Markdown QA reports under `output/reports/`.
- Save final contact sheet under `output/playwright/native-qa-YYYYMMDD/`.

---

## Task 1: Prepare Navigation Burn-Down Plan

**Files:**
- Create: `plans/20260516_navigation_source_removal_paste_action.md`
- Create: `context/context_20260516_navigation_source_removal_paste_action.md` at the end of Task 4

- [ ] **Step 1: Create the AGENTS-compliant plan**

Create `plans/20260516_navigation_source_removal_paste_action.md`:

```markdown
# 2026-05-16 Navigation Source Removal Paste Action

## 배경

GitHub #11 supersedes the older Source route model. Paste must be a centered main-tab action that opens the reference recipe drawer in place, not a visible `/source` or `/source-actions` destination.

## 목표

- Remove user-facing Source route modules.
- Rename the internal center action from `source` to `paste`.
- Keep Home, Explore, Recipes, My as destination tabs.
- Keep Paste visible as a center action with button semantics and local drawer state.
- Update tests so regressions back to Source destination behavior fail.

## 범위

- Root tab config, icons, viewport matrix, app language nav copy.
- Root tab shell Paste action wiring.
- Source/source-actions route removal or compatibility redirect.
- Navigation contract tests and focused TypeScript validation.

## 변경 파일

- `src/core/navigation/root-tab-config.ts`
- `src/core/navigation/root-tab-icons.ts`
- `src/core/navigation/root-tab-viewport-matrix.ts`
- `src/core/i18n/app-language.tsx`
- `src/app-shell/navigation/root-native-tabs.tsx`
- `src/app/(tabs)/paste.tsx`
- `src/app/(tabs)/source.tsx`
- `src/app/source-actions.tsx`
- `src/app/_layout.tsx`
- `src/core/navigation/global-create-cta.ts`
- `src/core/navigation/root-tab-config.test.ts`
- `src/core/navigation/root-tab-viewport-matrix.test.ts`
- `src/core/navigation/root-tab-ios-layout-verification.test.ts`
- `src/core/navigation/root-tab-android-layout-verification.test.ts`

## 테스트

- `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts`
- `./node_modules/.bin/sucrase-node src/core/navigation/paste-drawer-state.test.ts`
- `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-viewport-matrix.test.ts`
- `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-ios-layout-verification.test.ts`
- `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-android-layout-verification.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`

## 롤백

Revert the navigation commit to restore the previous `source`-named Paste center action and route wrappers.

## 리스크

- Expo Tabs may require a screen module for the center action. Use hidden `/paste` redirect with `href: null` rather than a product route.
- Existing tests and viewport matrices currently use `source`; update all in one commit to avoid partial breakage.
```

- [ ] **Step 2: Commit only after Task 4 passes**

Do not commit this plan alone unless implementation is paused.

---

## Task 2: Rename Source Center Action to Paste and Remove Source Routes

**Files:**
- Modify: `src/core/navigation/root-tab-config.ts`
- Modify: `src/core/navigation/root-tab-icons.ts`
- Modify: `src/core/navigation/root-tab-viewport-matrix.ts`
- Modify: `src/core/i18n/app-language.tsx`
- Modify: `src/app-shell/navigation/root-native-tabs.tsx`
- Create: `src/app/(tabs)/paste.tsx`
- Delete: `src/app/(tabs)/source.tsx`
- Delete: `src/app/source-actions.tsx`
- Delete: `src/features/source/screens/source-screen.tsx`
- Delete: `src/features/source/screens/source-action-sheet-screen.tsx`
- Modify: `src/app/_layout.tsx`
- Modify: `src/core/navigation/global-create-cta.ts`

- [ ] **Step 1: Replace root tab config**

Replace `src/core/navigation/root-tab-config.ts` with:

```ts
export const rootDestinationTabNames = ['index', 'explore', 'recipes', 'my'] as const;
export const rootPasteActionName = 'paste' as const;
export const rootTabNames = ['index', 'explore', 'paste', 'recipes', 'my'] as const;
export const hiddenRootTabNames = [] as const;
export const rootPasteActionHref = '/recipe-create?mode=reference' as const;
export const rootTabMinimumTouchTarget = 48;

export const rootTabHrefs = {
  index: '/',
  explore: '/explore',
  paste: null,
  recipes: '/recipes',
  my: '/my',
} as const satisfies Record<(typeof rootTabNames)[number], string | null>;

export const rootDestinationTabHrefs = {
  index: '/',
  explore: '/explore',
  recipes: '/recipes',
  my: '/my',
} as const satisfies Record<(typeof rootDestinationTabNames)[number], string>;

export const rootTabAccessibilityRoles = {
  index: 'tab',
  explore: 'tab',
  paste: 'button',
  recipes: 'tab',
  my: 'tab',
} as const satisfies Record<(typeof rootTabNames)[number], 'button' | 'tab'>;

export type RootDestinationTabName = (typeof rootDestinationTabNames)[number];
export type RootPasteActionName = typeof rootPasteActionName;
export type RootTabName = (typeof rootTabNames)[number];
export type HiddenRootTabName = (typeof hiddenRootTabNames)[number];
```

- [ ] **Step 2: Update icon config**

Change `src/core/navigation/root-tab-icons.ts` so the center key is `paste`:

```ts
export const rootTabIconNames: Record<
  RootTabName,
  {
    focused: RootTabIconName;
    unfocused: RootTabIconName;
  }
> = {
  index: {
    focused: 'home-variant',
    unfocused: 'home-variant-outline',
  },
  explore: {
    focused: 'compass',
    unfocused: 'compass-outline',
  },
  paste: {
    focused: 'link-variant',
    unfocused: 'link-variant',
  },
  recipes: {
    focused: 'book-open-page-variant',
    unfocused: 'book-open-page-variant-outline',
  },
  my: {
    focused: 'account',
    unfocused: 'account-outline',
  },
};
```

Keep the existing `getVisibleRootTabName()` and `getRootTabIcon()` signatures.

- [ ] **Step 3: Rename nav copy key**

In `src/core/i18n/app-language.tsx`, change the `nav` type from:

```ts
nav: {
  explore: string;
  index: string;
  my: string;
  recipes: string;
  source: string;
};
```

to:

```ts
nav: {
  explore: string;
  index: string;
  my: string;
  paste: string;
  recipes: string;
};
```

In English copy, replace `source: 'Paste'` with:

```ts
paste: 'Paste',
```

In Korean copy, replace `source: 'Paste'` with:

```ts
paste: 'Paste',
```

- [ ] **Step 4: Update root tab shell comparisons**

In `src/app-shell/navigation/root-native-tabs.tsx`, replace every `visibleTabName === 'source'` comparison with:

```ts
visibleTabName === 'paste'
```

Keep this behavior:

```tsx
<RootTabButton
  {...props}
  active={pasteDrawerState.open}
  label={getRootTabLabel(copy.nav, visibleTabName)}
  onPress={openPasteDrawer}
  role={rootTabAccessibilityRoles[visibleTabName]}
/>
```

The important invariant is that Paste uses `onPress={openPasteDrawer}` and `options.href` is `null`, so it opens the local drawer instead of navigating.

- [ ] **Step 5: Add hidden Paste route compatibility wrapper**

Create `src/app/(tabs)/paste.tsx`:

```tsx
import { Redirect } from 'expo-router';

export default function PasteActionRoute() {
  return <Redirect href="/" />;
}
```

- [ ] **Step 6: Remove Source route files**

Delete:

```bash
git rm 'src/app/(tabs)/source.tsx' src/app/source-actions.tsx
git rm src/features/source/screens/source-screen.tsx src/features/source/screens/source-action-sheet-screen.tsx
```

- [ ] **Step 7: Remove source-actions stack screen**

In `src/app/_layout.tsx`, delete this whole block:

```tsx
<Stack.Screen
  name="source-actions"
  options={{
    animation: "slide_from_bottom",
    contentStyle: {
      backgroundColor: "transparent",
    },
    presentation: "transparentModal",
  }}
/>
```

- [ ] **Step 8: Remove obsolete hidden Source paths**

In `src/core/navigation/global-create-cta.ts`, change:

```ts
const hiddenCreateCtaPaths = new Set([
  "/",
  "/explore",
  "/recipe-create",
  "/source",
  "/source-actions",
  "/recipes",
]);
```

to:

```ts
const hiddenCreateCtaPaths = new Set([
  "/",
  "/explore",
  "/recipe-create",
  "/recipes",
]);
```

- [ ] **Step 9: Run source search**

Run:

```bash
rg -n "Source Inbox|source-actions|/source|name=\"source|source: 'Paste'|source: \"Paste\"|visibleTabName === 'source'|rootTabHrefs\\.source" src
```

Expected: no user-facing Source route references. Domain terms like `sourceUrl`, `sourceRecipeId`, and media source props may remain.

---

## Task 3: Update Navigation Contract Tests for Issue #14

**Files:**
- Modify: `src/core/navigation/root-tab-config.test.ts`
- Modify: `src/core/navigation/root-tab-viewport-matrix.test.ts`
- Modify: `src/core/navigation/root-tab-ios-layout-verification.test.ts`
- Modify: `src/core/navigation/root-tab-android-layout-verification.test.ts`

- [ ] **Step 1: Update root tab config test imports**

In `src/core/navigation/root-tab-config.test.ts`, import the new destination names:

```ts
import {
  hiddenRootTabNames,
  rootDestinationTabHrefs,
  rootDestinationTabNames,
  rootPasteActionHref,
  rootPasteActionName,
  rootTabAccessibilityRoles,
  rootTabHrefs,
  rootTabMinimumTouchTarget,
  rootTabNames,
} from './root-tab-config';
```

- [ ] **Step 2: Assert visible nav model and destination model separately**

Replace the expected tab constants with:

```ts
const expectedVisibleRootTabs = ['index', 'explore', 'paste', 'recipes', 'my'] as const;
const expectedDestinationRootTabs = ['index', 'explore', 'recipes', 'my'] as const;
const expectedHiddenRootTabs = [] as const;
```

Add this assertion after visible tab order:

```ts
if (rootDestinationTabNames.join(',') !== expectedDestinationRootTabs.join(',')) {
  throw new Error(
    `Root destination tabs must be Home, Explore, Recipes, My only. Found: ${rootDestinationTabNames.join(',')}`
  );
}

if (rootPasteActionName !== 'paste') {
  throw new Error(`Paste center action must be named paste, not ${rootPasteActionName}.`);
}
```

- [ ] **Step 3: Update label mapping**

In the label switch, replace the `source` case with:

```ts
case 'paste':
  return 'Paste';
```

- [ ] **Step 4: Assert Paste is not a destination route**

Add:

```ts
if (rootTabHrefs.paste !== null) {
  throw new Error('Paste must not have a route href; it opens the in-place recipe drawer.');
}

if ('paste' in rootDestinationTabHrefs) {
  throw new Error('Paste must not be counted as a destination tab.');
}
```

Then use:

```ts
const pasteHref = rootTabHrefs.paste;
const pasteActionHref: string = rootPasteActionHref;
```

and keep the Recipes/My negative checks against `pasteHref` and `pasteActionHref`.

- [ ] **Step 5: Update route file list**

Replace:

```ts
'../../app/(tabs)/source.tsx',
```

with:

```ts
'../../app/(tabs)/paste.tsx',
```

Add checks:

```ts
const rootLayoutSource = readFileSync(resolve(__dirname, '../../app/_layout.tsx'), 'utf8');

if (rootLayoutSource.includes('name="source-actions"')) {
  throw new Error('source-actions must not be registered as a product route.');
}

if (existsSync(resolve(__dirname, '../../app/(tabs)/source.tsx'))) {
  throw new Error('/source tab route module must be removed.');
}

if (existsSync(resolve(__dirname, '../../app/source-actions.tsx'))) {
  throw new Error('/source-actions route module must be removed.');
}
```

This requires adding `existsSync` to the existing `node:fs` import:

```ts
import { existsSync, readFileSync } from 'node:fs';
```

- [ ] **Step 6: Update Paste role assertion**

Replace:

```ts
if (tabName === 'source') {
```

with:

```ts
if (tabName === 'paste') {
```

- [ ] **Step 7: Update viewport matrix types**

In `src/core/navigation/root-tab-viewport-matrix.ts`, change:

```ts
expectedCenterAction: Extract<RootTabName, 'source'>;
```

to:

```ts
expectedCenterAction: Extract<RootTabName, 'paste'>;
```

Replace every:

```ts
expectedCenterAction: 'source',
```

with:

```ts
expectedCenterAction: 'paste',
```

- [ ] **Step 8: Update layout verification center index**

In both iOS and Android layout verification tests, replace:

```ts
const centerTabIndex = rootTabNames.indexOf('source');
```

with:

```ts
const centerTabIndex = rootTabNames.indexOf('paste');
```

- [ ] **Step 9: Run focused tests**

Run:

```bash
./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts
./node_modules/.bin/sucrase-node src/core/navigation/paste-drawer-state.test.ts
./node_modules/.bin/sucrase-node src/core/navigation/root-tab-viewport-matrix.test.ts
./node_modules/.bin/sucrase-node src/core/navigation/root-tab-ios-layout-verification.test.ts
./node_modules/.bin/sucrase-node src/core/navigation/root-tab-android-layout-verification.test.ts
```

Expected: all commands exit 0.

---

## Task 4: Verify, Document, Commit, and Close #13/#14

**Files:**
- Create: `context/context_20260516_navigation_source_removal_paste_action.md`
- Modify: `plans/20260516_navigation_source_removal_paste_action.md`

- [ ] **Step 1: Run full validation**

Run:

```bash
./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json
./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json
git diff --check
```

Expected: all pass.

- [ ] **Step 2: Write context summary**

Create `context/context_20260516_navigation_source_removal_paste_action.md`:

```markdown
# 2026-05-16 Navigation Source Removal Paste Action

## 요약

GitHub #13/#14 범위로 Source Inbox/product route 모델을 제거하고, Paste를 main tab shell의 in-place drawer action으로 정리했다.

## 변경

- Destination tabs are Home, Explore, Recipes, My.
- Paste remains visible as centered bottom action with button semantics.
- Paste no longer has a route href.
- `/source` and `/source-actions` route modules were removed.
- Root navigation tests now assert Paste is not counted as a destination route.

## 검증

- PASS: root tab config contract test
- PASS: paste drawer state contract test
- PASS: viewport matrix test
- PASS: iOS layout verification test
- PASS: Android layout verification test
- PASS: `tsc --noEmit -p tsconfig.root-tabs-check.json`
- PASS: `tsc --noEmit -p tsconfig.json`
- PASS: `git diff --check`

## 리스크

- Expo Tabs still needs an internal hidden `paste` screen module. It redirects to Home if directly reached and has `href: null` in the bottom nav.
```

- [ ] **Step 3: Update plan result**

Append to `plans/20260516_navigation_source_removal_paste_action.md`:

```markdown
## 결과

- Source route/product navigation was removed.
- Paste is a non-destination center action.
- Tests and TypeScript passed.
- 연결 context: `context/context_20260516_navigation_source_removal_paste_action.md`
```

- [ ] **Step 4: Commit navigation burn-down**

Run:

```bash
git status --short
git add src/core/navigation src/core/i18n/app-language.tsx src/app-shell/navigation/root-native-tabs.tsx src/app src/features/source plans/20260516_navigation_source_removal_paste_action.md context/context_20260516_navigation_source_removal_paste_action.md
git commit -m "fix: remove source routes from paste navigation"
git pull --ff-only origin main
git push origin main
```

Expected: commit and push succeed.

- [ ] **Step 5: Comment and close #13**

Run:

```bash
gh issue comment 13 --body "Implemented and pushed. Summary: removed visible Source/source-actions product routes, removed Source feature route modules, removed source-actions stack registration, and kept Paste as an in-place drawer action rather than a destination. Validation: root tab config tests, paste drawer state test, viewport/layout tests, root-tabs TypeScript check, full TypeScript check, and git diff check passed."
gh issue close 13 --comment "Closed after Source/source-actions product navigation removal landed on main."
```

- [ ] **Step 6: Comment and close #14**

Run:

```bash
gh issue comment 14 --body "Implemented and pushed. Tests now assert Home/Explore/Recipes/My as destination tabs, Paste as the centered non-destination action, no /source or /source-actions product route modules, drawer lifecycle open/reopen/dismiss/created behavior, and Paste button semantics."
gh issue close 14 --comment "Closed after Paste navigation and drawer contract tests landed on main."
```

---

## Task 5: Run Targeted Paste QA for #15 and Close #11/#6 if Clean

**Files:**
- Create: `plans/20260516_main_tab_paste_qa.md`
- Create: `context/context_20260516_main_tab_paste_qa.md`
- Create: `output/reports/20260516_main_tab_paste_qa.md`
- Create screenshots under: `output/playwright/main-tab-paste-qa-20260516/`

- [ ] **Step 1: Create QA plan**

Create `plans/20260516_main_tab_paste_qa.md` with sections 배경, 목표, 범위, 변경 파일, 테스트, 롤백, 리스크. Use this 목표:

```markdown
Home, Explore, Recipes, My에서 Paste 버튼이 route 이동 없이 현재 화면 위에 reference recipe drawer를 여는지 검증하고 #15/#11/#6 closure evidence를 만든다.
```

- [ ] **Step 2: Start Metro**

Run:

```bash
EXPO_NO_TELEMETRY=1 CI=1 npm run start -- --port 8090
```

Expected: Metro prints `Waiting on http://localhost:8090`.

- [ ] **Step 3: Capture iOS flow**

Use iOS Simulator if available:

```bash
xcrun simctl list devices booted
xcrun simctl io booted screenshot output/playwright/main-tab-paste-qa-20260516/ios-home-before-paste.png
```

Then manually or with available automation:

- Open Home, press Paste, capture `ios-home-paste-drawer.png`.
- Open Explore, press Paste, capture `ios-explore-paste-drawer.png`.
- Open Recipes, press Paste, capture `ios-recipes-paste-drawer.png`.
- Open My, press Paste, capture `ios-my-paste-drawer.png`.

- [ ] **Step 4: Capture Android flow**

Use Android emulator if available:

```bash
adb devices
adb exec-out screencap -p > output/playwright/main-tab-paste-qa-20260516/android-home-before-paste.png
```

Then manually or with available automation:

- Open Home, press Paste, capture `android-home-paste-drawer.png`.
- Open Explore, press Paste, capture `android-explore-paste-drawer.png`.
- Open Recipes, press Paste, capture `android-recipes-paste-drawer.png`.
- Open My, press Paste, capture `android-my-paste-drawer.png`.

- [ ] **Step 5: Write QA report**

Create `output/reports/20260516_main_tab_paste_qa.md`:

```markdown
# Main Tab Paste QA 2026-05-16

## 대상

- Repository: `junho-baek/parrotkit_app`
- Branch: `main`
- Feature: Paste center action opens reference recipe drawer in place

## 범위

- Home -> Paste
- Explore -> Paste
- Recipes -> Paste
- My -> Paste
- No visible Source Inbox label or route

## 결과

- iOS Home: PASS
- iOS Explore: PASS
- iOS Recipes: PASS
- iOS My: PASS
- Android Home: PASS
- Android Explore: PASS
- Android Recipes: PASS
- Android My: PASS
- Source Inbox visible copy: PASS, none found

## 증거

- `output/playwright/main-tab-paste-qa-20260516/ios-home-paste-drawer.png`
- `output/playwright/main-tab-paste-qa-20260516/ios-explore-paste-drawer.png`
- `output/playwright/main-tab-paste-qa-20260516/ios-recipes-paste-drawer.png`
- `output/playwright/main-tab-paste-qa-20260516/ios-my-paste-drawer.png`
- `output/playwright/main-tab-paste-qa-20260516/android-home-paste-drawer.png`
- `output/playwright/main-tab-paste-qa-20260516/android-explore-paste-drawer.png`
- `output/playwright/main-tab-paste-qa-20260516/android-recipes-paste-drawer.png`
- `output/playwright/main-tab-paste-qa-20260516/android-my-paste-drawer.png`

## 리스크

- Native route internals still include a hidden `/paste` compatibility module for Expo Tabs. It is not visible and redirects if directly reached.
```

- [ ] **Step 6: Commit QA artifacts**

Run:

```bash
git add plans/20260516_main_tab_paste_qa.md context/context_20260516_main_tab_paste_qa.md output/reports/20260516_main_tab_paste_qa.md output/playwright/main-tab-paste-qa-20260516
git commit -m "docs: add main tab paste qa evidence"
git pull --ff-only origin main
git push origin main
```

- [ ] **Step 7: Close #15, #11, and reconcile #6**

Run:

```bash
gh issue comment 15 --body-file output/reports/20260516_main_tab_paste_qa.md
gh issue close 15 --comment "Closed after targeted Home/Explore/Recipes/My Paste drawer QA evidence landed on main."
gh issue comment 11 --body "All child tasks are complete: #13 Source route removal, #14 navigation/drawer contract tests, and #15 targeted main-tab Paste QA. Paste now opens in place from Home, Explore, Recipes, and My."
gh issue close 11 --comment "Closed after Source Inbox removal and in-place Paste drawer behavior were verified."
gh issue comment 6 --body "Resolved through the newer #11 product clarification. Current main has Home / Explore / Paste / Recipes / My, with Paste as a centered in-place drawer action rather than Source route navigation."
gh issue close 6 --comment "Closed as completed by the #11 navigation model and QA."
```

---

## Task 6: Simplify Explore Card CTA Model for #7

**Files:**
- Create: `plans/20260516_explore_card_cta_simplification.md`
- Modify: `src/features/explore/screens/explore-screen.tsx`
- Create: `src/features/explore/lib/explore-card-cta-contract.test.ts`
- Create: `context/context_20260516_explore_card_cta_simplification.md`

- [ ] **Step 1: Create AGENTS plan**

Create `plans/20260516_explore_card_cta_simplification.md` with this 목표:

```markdown
Explore recommended cards and browse rows act as the CTA surface themselves, with no duplicate button clusters and less non-essential metadata.
```

- [ ] **Step 2: Add source guard test**

Create `src/features/explore/lib/explore-card-cta-contract.test.ts`:

```ts
import { readFileSync } from 'node:fs';

const exploreSource = readFileSync('src/features/explore/screens/explore-screen.tsx', 'utf8');

if (/Start filming|Use template|Copy template|Save recipe|Open guide/.test(exploreSource)) {
  throw new Error('Explore cards must not render duplicate CTA labels inside card surfaces.');
}

if (/recommendedCard[\s\S]*<Pressable[\s\S]*<Pressable/.test(exploreSource)) {
  throw new Error('Recommended Explore cards must not nest CTA buttons inside the card CTA.');
}

if (/BrowseRecipeRow[\s\S]*<Pressable[\s\S]*<Pressable/.test(exploreSource)) {
  throw new Error('Browse Explore rows must not nest CTA button clusters inside the row CTA.');
}

if (/formatCompactMetric\(card\.saveCount\)|formatCompactMetric\(card\.viewCount\)/.test(exploreSource)) {
  throw new Error('Explore browse rows should avoid low-value save/view metrics in the compact list.');
}
```

- [ ] **Step 3: Run the test and confirm it fails before the UI edit**

Run:

```bash
./node_modules/.bin/sucrase-node src/features/explore/lib/explore-card-cta-contract.test.ts
```

Expected: FAIL because current recommended card includes `Open guide` and browse row includes save/view metrics.

- [ ] **Step 4: Remove duplicate recommended card CTA label**

In `RecommendedRecipeCard`, replace:

```tsx
<View className="flex-row items-center gap-1.5">
  <Text className="text-[12px] font-black text-white">Open guide</Text>
  <MaterialCommunityIcons color="#fff" name="chevron-right" size={16} />
</View>
```

with:

```tsx
<MaterialCommunityIcons color="#fff" name="chevron-right" size={18} />
```

- [ ] **Step 5: Reduce browse row metadata**

In `BrowseRecipeRow`, remove these blocks:

```tsx
<View className="flex-row flex-wrap gap-1.5">
  {card.chips.slice(0, 3).map((tag) => (
    <View className="rounded-full bg-violet/10 px-2 py-1" key={tag}>
      <Text className="text-[9px] font-black text-violet">{tag}</Text>
    </View>
  ))}
</View>
<View className="min-w-0 flex-row gap-3">
  <Text className="text-[10px] font-bold text-muted">{formatCompactMetric(card.saveCount)} saves</Text>
  <Text className="text-[10px] font-bold text-muted">{formatCompactMetric(card.viewCount)} views</Text>
</View>
```

Keep title, one short description, creator/metadata line, and chevron.

- [ ] **Step 6: Remove dead helper if unused**

If `formatCompactMetric` is unused after Step 5, remove the function from `src/features/explore/screens/explore-screen.tsx`.

Run:

```bash
rg -n "formatCompactMetric" src/features/explore/screens/explore-screen.tsx
```

Expected after removal: no matches.

- [ ] **Step 7: Verify**

Run:

```bash
./node_modules/.bin/sucrase-node src/features/explore/lib/explore-card-cta-contract.test.ts
./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json
git diff --check
```

Expected: all pass.

- [ ] **Step 8: Commit and close #7**

Run:

```bash
git add src/features/explore/screens/explore-screen.tsx src/features/explore/lib/explore-card-cta-contract.test.ts plans/20260516_explore_card_cta_simplification.md context/context_20260516_explore_card_cta_simplification.md
git commit -m "fix: simplify explore card cta model"
git pull --ff-only origin main
git push origin main
gh issue comment 7 --body "Implemented and pushed. Explore recommended cards and browse rows now use the card/row as the CTA surface, with duplicate CTA labels and low-value compact metrics removed. Focused source guard, TypeScript, and diff checks passed."
gh issue close 7 --comment "Closed after Explore card CTA simplification landed on main."
```

---

## Task 7: Rework Shooting Board Layout for #9

**Files:**
- Create: `plans/20260516_shooting_board_layout_reference_placement.md`
- Modify: `src/features/recipes/screens/recipe-detail-screen.tsx`
- Modify: `src/features/recipes/components/shoot-board-scene-card.tsx`
- Modify or create focused tests under `src/features/recipes/lib/`
- Create: `context/context_20260516_shooting_board_layout_reference_placement.md`

- [ ] **Step 1: Create AGENTS plan**

Create `plans/20260516_shooting_board_layout_reference_placement.md` with this 목표:

```markdown
Recipe board remains a full page and each cut card keeps only useful execution content: line to say, shot guide, checklist/progress, saved takes, and reference/take media without nested decorative boxes.
```

- [ ] **Step 2: Add board source guard**

Create `src/features/recipes/lib/recipe-board-design-contract.test.ts`:

```ts
import { readFileSync } from 'node:fs';

const detailSource = readFileSync('src/features/recipes/screens/recipe-detail-screen.tsx', 'utf8');
const cutCardSource = readFileSync('src/features/recipes/components/shoot-board-scene-card.tsx', 'utf8');

if (/presentation: "transparentModal"|bottom sheet|drawer/i.test(detailSource)) {
  throw new Error('Recipe board must remain a page, not a drawer or sheet.');
}

if (/workflow|debug|console/i.test(detailSource)) {
  throw new Error('Recipe board user-facing copy must not expose workflow/debug/console language.');
}

if (/workflow|debug|console/i.test(cutCardSource)) {
  throw new Error('Cut cards must not expose workflow/debug/console language.');
}

if (!/Line to say|라인|촬영 가이드|Shot guide|Checklist|Saved takes|저장/.test(cutCardSource)) {
  throw new Error('Cut cards must preserve useful execution content.');
}
```

- [ ] **Step 3: Run the board contract test**

Run:

```bash
./node_modules/.bin/sucrase-node src/features/recipes/lib/recipe-board-design-contract.test.ts
```

Expected: if it fails, use the error to drive the minimal UI edit. If it passes, proceed to visual inspection and screenshot QA before closing #9.

- [ ] **Step 4: UI simplification edit**

In `shoot-board-scene-card.tsx`, keep these sections visible:

```tsx
<Text>{cut.title}</Text>
<Text>{lineToSay}</Text>
<Text>{shotGuide}</Text>
<Checklist ... />
<SavedTakes ... />
<ReferenceViewer ... />
```

Remove decorative nested bordered containers around non-media text. Preserve inner surfaces only for real media, inputs, checklist state, or saved take previews.

- [ ] **Step 5: Verify full page route**

Confirm `src/app/recipe/[recipeId]/index.tsx` remains a normal page wrapper:

```bash
sed -n '1,40p' src/app/recipe/[recipeId]/index.tsx
```

Expected:

```ts
export { RecipeDetailScreen as default } from '@/features/recipes/screens/recipe-detail-screen';
```

- [ ] **Step 6: Verify**

Run:

```bash
./node_modules/.bin/sucrase-node src/features/recipes/lib/recipe-board-design-contract.test.ts
./node_modules/.bin/sucrase-node src/features/recipes/lib/cut-card-reference-viewer-section.test.ts
./node_modules/.bin/sucrase-node src/features/recipes/lib/cut-card-media-slots.test.ts
./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json
git diff --check
```

Expected: all pass.

- [ ] **Step 7: Capture board screenshots**

Capture:

- `output/playwright/board-layout-20260516/ios-board-page.png`
- `output/playwright/board-layout-20260516/android-board-page.png`
- `output/playwright/board-layout-20260516/reference-copy-area.png`

- [ ] **Step 8: Commit and close #9**

Run:

```bash
git add src/features/recipes/screens/recipe-detail-screen.tsx src/features/recipes/components/shoot-board-scene-card.tsx src/features/recipes/lib/recipe-board-design-contract.test.ts plans/20260516_shooting_board_layout_reference_placement.md context/context_20260516_shooting_board_layout_reference_placement.md output/playwright/board-layout-20260516
git commit -m "fix: simplify shooting board layout"
git pull --ff-only origin main
git push origin main
gh issue comment 9 --body "Implemented and pushed. Recipe board remains a full page, cut cards retain useful execution content, redundant nested containers were reduced, and board/reference screenshots were added."
gh issue close 9 --comment "Closed after shooting board layout and reference placement verification landed on main."
```

---

## Task 8: Verify Passive Next-Cut Guidance for #4 and Close #1 if Complete

**Files:**
- Create: `plans/20260516_passive_next_cut_guidance_verification.md`
- Create: `context/context_20260516_passive_next_cut_guidance_verification.md`

- [ ] **Step 1: Create verification plan**

Create `plans/20260516_passive_next_cut_guidance_verification.md` with this 목표:

```markdown
Confirm Home Continue opens the board overview without camera jump, auto-open, auto-expand, scroll-focus, or force-highlight behavior, and only passive next-cut guidance remains.
```

- [ ] **Step 2: Run existing focused tests**

Run:

```bash
node -r sucrase/register -e "const Module=require('module'); const path=require('path'); const root=process.cwd(); const old=Module._resolveFilename; Module._resolveFilename=function(request,parent,isMain,options){ if(request.startsWith('@/')) return old.call(this,path.join(root,'src',request.slice(2)),parent,isMain,options); return old.call(this,request,parent,isMain,options); }; require('./src/features/home/lib/home-continue-workflow-card.test.ts');"
./node_modules/.bin/sucrase-node src/features/home/lib/home-workflow-resolution.test.ts
./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json
```

Expected: all pass. If `home-continue-workflow-card.test.ts` fails on stale source-regex expectations, update the regex to match the current DDD refactor only if the actual behavior is correct.

- [ ] **Step 3: Search for forbidden auto behavior**

Run:

```bash
rg -n "scrollTo|scrollToIndex|autoOpen|autoExpand|setExpanded|openCamera|prompter" src/features/recipes/screens/recipe-detail-screen.tsx src/features/recipes/components src/features/home
```

Expected: no Continue-entry code path auto-scrolls, auto-expands, or opens camera.

- [ ] **Step 4: Close #4 and #1 if clean**

Run:

```bash
gh issue comment 4 --body "Verified. Home Continue opens board overview, camera entry remains user-initiated, no auto-open/auto-expand/scroll-focus path was found, and focused Home Continue tests plus TypeScript passed."
gh issue close 4 --comment "Closed after passive next-cut guidance verification passed."
gh issue comment 1 --body "Follow-up children are resolved: #2 and #3 were already closed, and #4 passive next-cut guidance is now verified and closed."
gh issue close 1 --comment "Closed after remaining Home Continue follow-up verification completed."
```

---

## Task 9: Produce Final Native QA Capture Package for #10 and Parent #5

**Files:**
- Create: `plans/20260516_final_native_qa_capture_package.md`
- Create: `context/context_20260516_final_native_qa_capture_package.md`
- Create: `output/reports/20260516_final_native_qa_capture_package.md`
- Create: `output/playwright/native-qa-20260516/contact-sheet.png`

- [ ] **Step 1: Create QA plan**

Create `plans/20260516_final_native_qa_capture_package.md` with this 목표:

```markdown
Generate final iPhone and Android QA evidence for Home, Explore, Paste drawer, goal grid, board page, and reference/copy area, then close #10 and parent #5 if all child issues are closed.
```

- [ ] **Step 2: Run validation**

Run:

```bash
./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json
npx -y @google/design.md lint DESIGN.md
```

Expected:

- TypeScript exits 0.
- DESIGN.md lint exits 0. If the lint package cannot be installed because of network failure, record the exact failure and run the existing `rg` design guard checks instead.

- [ ] **Step 3: Capture required screens**

Capture iPhone:

- `output/playwright/native-qa-20260516/ios-home.png`
- `output/playwright/native-qa-20260516/ios-explore.png`
- `output/playwright/native-qa-20260516/ios-paste-drawer.png`
- `output/playwright/native-qa-20260516/ios-goal-grid.png`
- `output/playwright/native-qa-20260516/ios-board-page.png`
- `output/playwright/native-qa-20260516/ios-reference-copy-area.png`

Capture Android:

- `output/playwright/native-qa-20260516/android-home.png`
- `output/playwright/native-qa-20260516/android-explore.png`
- `output/playwright/native-qa-20260516/android-paste-drawer.png`
- `output/playwright/native-qa-20260516/android-goal-grid.png`
- `output/playwright/native-qa-20260516/android-board-page.png`
- `output/playwright/native-qa-20260516/android-reference-copy-area.png`

- [ ] **Step 4: Build contact sheet**

Use ImageMagick if installed:

```bash
magick montage output/playwright/native-qa-20260516/*.png -tile 3x4 -geometry 390x844+18+18 output/playwright/native-qa-20260516/contact-sheet.png
```

If `magick` is unavailable, use `sips` or a small local script only to compose screenshots; do not alter app source files for contact sheet generation.

- [ ] **Step 5: Write QA report**

Create `output/reports/20260516_final_native_qa_capture_package.md`:

```markdown
# Final Native QA Capture Package 2026-05-16

## 대상

- Branch: main
- Devices: iPhone simulator, Android emulator
- Scope: Home, Explore, Paste drawer, goal grid, board page, reference/copy area

## Validation

- TypeScript: PASS
- DESIGN.md lint: PASS

## Screenshots

- iPhone Home: `output/playwright/native-qa-20260516/ios-home.png`
- iPhone Explore: `output/playwright/native-qa-20260516/ios-explore.png`
- iPhone Paste drawer: `output/playwright/native-qa-20260516/ios-paste-drawer.png`
- iPhone goal grid: `output/playwright/native-qa-20260516/ios-goal-grid.png`
- iPhone board page: `output/playwright/native-qa-20260516/ios-board-page.png`
- iPhone reference/copy area: `output/playwright/native-qa-20260516/ios-reference-copy-area.png`
- Android Home: `output/playwright/native-qa-20260516/android-home.png`
- Android Explore: `output/playwright/native-qa-20260516/android-explore.png`
- Android Paste drawer: `output/playwright/native-qa-20260516/android-paste-drawer.png`
- Android goal grid: `output/playwright/native-qa-20260516/android-goal-grid.png`
- Android board page: `output/playwright/native-qa-20260516/android-board-page.png`
- Android reference/copy area: `output/playwright/native-qa-20260516/android-reference-copy-area.png`
- Contact sheet: `output/playwright/native-qa-20260516/contact-sheet.png`

## Result

All requested captures are present and reviewed.

## Residual Risk

No known blocker remains.
```

- [ ] **Step 6: Commit and close #10/#5**

Run:

```bash
git add plans/20260516_final_native_qa_capture_package.md context/context_20260516_final_native_qa_capture_package.md output/reports/20260516_final_native_qa_capture_package.md output/playwright/native-qa-20260516
git commit -m "docs: add final native qa package"
git pull --ff-only origin main
git push origin main
gh issue comment 10 --body-file output/reports/20260516_final_native_qa_capture_package.md
gh issue close 10 --comment "Closed after final native QA capture package landed on main."
gh issue comment 5 --body "Emergency native UI patch children are complete: #6, #7, #8, #9, and #10 are closed. Final QA package is attached in the repo."
gh issue close 5 --comment "Closed after all emergency UI patch child tasks completed."
```

---

## Recommended Parallelization

Use subagents only after Task 2/3 navigation edits are committed, because many later tasks depend on the corrected tab model.

- Agent A: Task 5 main-tab Paste QA (`#15/#11/#6`)
- Agent B: Task 6 Explore simplification (`#7`)
- Agent C: Task 7 board layout (`#9`)
- Main agent: Task 8 passive next-cut verification (`#4/#1`) and Task 9 final QA package (`#10/#5`)

Write scopes must not overlap:

- Agent A owns `output/playwright/main-tab-paste-qa-20260516/`, `output/reports/20260516_main_tab_paste_qa.md`, and the QA plan/context.
- Agent B owns `src/features/explore/` plus its plan/context.
- Agent C owns `src/features/recipes/screens/recipe-detail-screen.tsx`, `src/features/recipes/components/shoot-board-scene-card.tsx`, recipe board tests, and its plan/context.
- Main agent owns issue comments/closures and final QA package.

---

## Self-Review

### Spec coverage

- `#13`: Covered by Tasks 2 and 4.
- `#14`: Covered by Task 3 and Task 4.
- `#15`: Covered by Task 5.
- `#11`: Closed after Tasks 4 and 5.
- `#6`: Reconciled after Task 5.
- `#7`: Covered by Task 6.
- `#9`: Covered by Task 7.
- `#10`: Covered by Task 9.
- `#4/#1`: Covered by Task 8.
- `#5`: Closed after Task 9 when child issues are closed.

### Placeholder scan

This plan contains no `TBD`, `TODO`, or "implement later" placeholders. Every implementation task has concrete files, edits, commands, and expected outcomes.

### Type consistency

- `source` is replaced by `paste` only for navigation action naming.
- Domain fields such as `sourceUrl`, `sourceRecipeId`, image `source`, and reference `sourceKind` remain valid and are not part of Source Inbox product navigation.
- Destination tabs and bottom-nav items are explicitly separated to satisfy `#11/#14`.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-16-github-issue-burn-down.md`.

Two execution options:

1. **Subagent-Driven (recommended)** - Dispatch a fresh subagent per task after the navigation base commit, review between tasks, fast iteration.
2. **Inline Execution** - Execute tasks in this session using executing-plans, with commits after each issue group.

Recommended first move: execute Tasks 1-4 inline because they change the shared navigation contract. After that, parallelize Tasks 5-7.
