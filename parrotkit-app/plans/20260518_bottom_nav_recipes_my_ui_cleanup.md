# Bottom Nav Recipes My UI Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore the bottom Paste drawer behavior and simplify Recipes/My screens so they match ParrotKit's DESIGN.md: creator-native, low-label, no box-in-box, and consistent with Home/Explore top rhythm.

**Architecture:** Keep this as a UI-only cleanup. Do not change reference-analysis provider work or recipe data contracts. Fix the Paste drawer at the app-shell boundary, then simplify Recipes/My screen composition by removing redundant sections and replacing nested cards with flat lists and concise headers.

**Tech Stack:** Expo Router, React Native, NativeWind className styles, existing pure contract tests via `sucrase-node`, `tsc --noEmit`, `npm run check:architecture`, Expo Go manual QA on iPhone/Android.

---

## 배경

- Issue #19 live adapter work is deferred.
- Current focus is product QA:
  - Bottom nav center Paste should open the recipe-create bottom drawer, but currently can fail or fall through.
  - Recipes tab should be a straightforward "my recipes" list, not search + filters + collections + Continue Shooting + publish/community UI.
  - My page has too many AI-slop surfaces: nested cards, pro/status copy, redundant section labels, extra CTAs, and boxed empty states.
- DESIGN.md rules that apply:
  - No box-in-box layouts.
  - Avoid mechanical label + heading + description blocks.
  - If a card/title explains the action, remove extra labels/descriptions/buttons.
  - Creation entry should open the recipe creation drawer.
  - Saved recipes and saved takes are user-owned content, not workflow records.

## 목표

- Bottom nav center action always opens the existing `RecipeCreateScreen` drawer from Home, Explore, Recipes, and My.
- Recipes tab becomes a simple user-owned recipe list with the same top rhythm as Home/Explore.
- Recipes removes search, filters, collections, Continue Shooting, Publish/community CTA, and duplicated "open/film" buttons.
- My page becomes a quiet account/content hub: profile heading, useful CTA/rows, saved takes/recipes links, language toggle.
- No UI regression to shooting board, Explore detail, or recipe create drawer.

## 범위

- Include:
  - `src/app-shell/navigation/root-native-tabs.tsx`
  - `src/core/navigation/root-tab-config.ts`
  - `src/core/navigation/root-tab-config.test.ts`
  - `src/core/navigation/paste-drawer-state.test.ts`
  - `src/features/recipes/screens/recipes-screen.tsx`
  - `src/features/profile/screens/profile-screen.tsx`
  - focused UI contract tests for Recipes/Profile copy and forbidden labels
  - context update after implementation
- Exclude:
  - #19 live adapter
  - DB/Supabase persistence
  - recipe detail / shooting board redesign
  - Explore detail reference analysis UI

## 변경 파일

- Modify: `src/app-shell/navigation/root-native-tabs.tsx`
  - Make Paste action press independent from Expo Router route fallback.
  - Ensure the drawer layer sits above tabs and can open from Explore.
  - Keep `RecipeCreateScreen initialMode="reference"` bottom drawer.
- Modify: `src/core/navigation/root-tab-config.ts`
  - Keep `rootPasteActionHref` as drawer intent.
  - Add a testable `rootPasteActionOpensDrawer = true` or equivalent contract if needed.
- Modify: `src/core/navigation/root-tab-config.test.ts`
  - Guard that `RootNativeTabs` uses `openPasteDrawer` and never `router.push(rootPasteActionHref)` for the bottom Paste button.
- Modify: `src/core/navigation/paste-drawer-state.test.ts`
  - Add reopen-from-tab test if missing.
- Modify: `src/features/recipes/screens/recipes-screen.tsx`
  - Delete/stop rendering `HeaderBlock`, `SearchRow`, `FilterRail`, `ContinueShootCard`, `CollectionFolderCard`, collection view, publish view, publish CTA, and FAB for this tab.
  - Render a simple header + recipe list.
  - Row press opens the board; no separate `Open` / `Film` buttons.
- Modify or create: `src/features/recipes/screens/recipes-screen-design-contract.test.ts`
  - Assert forbidden UI copy is absent from the Recipes tab source.
- Modify: `src/features/profile/screens/profile-screen.tsx`
  - Flatten profile card into header.
  - Remove pro/status card.
  - Remove nested list-card containers around rows.
  - Reduce saved-take metadata labels.
  - Keep language toggle but simplify its copy.
- Modify or create: `src/features/profile/screens/profile-screen-design-contract.test.ts`
  - Assert forbidden AI-slop copy/surfaces are absent from My screen source.
- Modify: `context/context_20260518_bottom_nav_recipes_my_ui_cleanup.md`
  - Record results, tests, and Expo QA link/captures if implementation runs.

## 테스트

- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts`
- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/core/navigation/paste-drawer-state.test.ts`
- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipes-screen-design-contract.test.ts`
- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/profile/screens/profile-screen-design-contract.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- `npm run check:architecture`
- `git diff --check`
- Manual QA in Expo Go:
  - Explore -> bottom center Paste -> recipe-create drawer visible.
  - Drawer backdrop, drag handle, X close, Blank/Link/Brand tabs visible.
  - Recipes tab shows many user recipes directly with concise header.
  - My tab has no box-in-box pro/status panel or redundant labels.

## 롤백

- Revert the UI cleanup commit. Since this is UI-only and does not change recipe data, rollback should restore the previous Recipes/Profile screens and nav drawer behavior without data migration.

## 리스크

- Expo Router tab behavior can differ between web, iOS, Android, and Expo Go. The Paste fix must be verified on the actual Expo Go link, not only source tests.
- Recipes currently has collection/publish subviews in the same file. Removing render paths is safe for this UI pass, but if hidden routes depend on `view=collection` or `view=publish`, those params should redirect to the simple Recipes list.
- My page copy comes from app language provider. Simplifying screen layout may expose unused copy keys; leave copy cleanup for a separate localization pass unless TypeScript requires removal.

## Task 1: Paste Drawer Reliability

**Files:**
- Modify: `src/app-shell/navigation/root-native-tabs.tsx`
- Modify: `src/core/navigation/root-tab-config.test.ts`
- Test: `src/core/navigation/paste-drawer-state.test.ts`

- [x] **Step 1: Add source contract assertions**

Add assertions to `root-tab-config.test.ts`:

```ts
if (!rootNativeTabsSource.includes('onPress={openPasteDrawer}')) {
  throw new Error('Bottom Paste action must open the in-place recipe-create drawer.');
}

if (rootNativeTabsSource.includes('router.push(rootPasteActionHref')) {
  throw new Error('Bottom Paste action must not navigate away from the current tab.');
}

if (!rootNativeTabsSource.includes('style={styles.pasteDrawerLayer}')) {
  throw new Error('Paste drawer must render in an app-shell overlay layer.');
}
```

- [x] **Step 2: Run the focused nav tests**

Run:

```bash
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/core/navigation/paste-drawer-state.test.ts
```

Expected: PASS or a clear failure showing the drawer press path mismatch.

- [x] **Step 3: Fix the app-shell if needed**

If source/test/manual QA shows the paste press falling through to `/`, update `RootTabButton` so the Paste button prevents default tab navigation and only calls `openPasteDrawer`:

```tsx
onPress={(event) => {
  if (!isStandardTab) {
    event.preventDefault?.();
  }
  onPress?.(event);
}}
```

Keep standard tabs unchanged.

- [ ] **Step 4: Manual QA**

Run Expo Go and verify from `/explore`, `/recipes`, and `/my`:

```bash
NODE_PATH=/opt/homebrew/lib/node_modules npx expo start --go --tunnel --port 8083 --clear
```

Expected: tapping center Paste opens the bottom drawer, not Home and not a full-page route.

Status: Source contract and Expo web smoke passed. Native simulator QA is left as a follow-up because Android had no attached device and `xcrun simctl` did not return in this environment.

## Task 2: Simplify Recipes Tab

**Files:**
- Modify: `src/features/recipes/screens/recipes-screen.tsx`
- Create: `src/features/recipes/screens/recipes-screen-design-contract.test.ts`

- [x] **Step 1: Add Recipes design guard test**

Create `src/features/recipes/screens/recipes-screen-design-contract.test.ts`:

```ts
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const source = readFileSync(resolve(__dirname, 'recipes-screen.tsx'), 'utf8');

const forbiddenCopy = [
  'Search recipes',
  'Collections',
  'Continue shooting',
  'Publish to community',
  'Share my recipe with other creators',
  'Prompter workspaces',
  'View all',
  'Open',
  'Film',
];

for (const copy of forbiddenCopy) {
  if (source.includes(copy)) {
    throw new Error(`Recipes tab should not render AI-slop or duplicate action copy: ${copy}`);
  }
}

const forbiddenComponents = [
  'FilterRail',
  'ContinueShootCard',
  'CollectionFolderCard',
  'PublishRecipeScreen',
  'PublishBottomCta',
  'RecipeCreateFab',
];

for (const component of forbiddenComponents) {
  if (source.includes(`function ${component}`) || source.includes(`<${component}`)) {
    throw new Error(`Recipes tab should not keep ${component} in the simplified list surface.`);
  }
}
```

- [x] **Step 2: Replace Recipes screen with a flat list**

Use a compact structure:

```tsx
return (
  <View className="flex-1 bg-canvas">
    <RecipesTabScrollView>
      <View className="gap-5 px-5">
        <View className="gap-1">
          <Text className="text-[32px] font-black leading-[37px] text-ink">
            {copy.title as string}
          </Text>
        </View>

        <View style={styles.recipeListFlat}>
          {recipes.map((recipe) => (
            <RecipeListRow
              key={recipe.id}
              language={language}
              onOpen={() => openRecipe(recipe)}
              recipe={recipe}
            />
          ))}
        </View>
      </View>
    </RecipesTabScrollView>
  </View>
);
```

- [x] **Step 3: Simplify recipe row**

Make the whole row the CTA:

```tsx
function RecipeListRow({
  language,
  onOpen,
  recipe,
}: {
  language: AppLanguage;
  onOpen: () => void;
  recipe: MockRecipe;
}) {
  return (
    <Pressable accessibilityRole="button" onPress={onOpen} style={styles.recipeRow}>
      <Image source={toImageSource(recipe.thumbnail)} style={styles.recipeRowImage} />
      <View className="min-w-0 flex-1">
        <Text className="text-[15px] font-black leading-5 text-ink" numberOfLines={1}>
          {recipe.title}
        </Text>
        <Text className="mt-1 text-[12px] font-semibold text-muted" numberOfLines={1}>
          {recipe.ownerHandle} · {recipe.totalSceneCount} {language === 'ko' ? '컷' : 'cuts'}
        </Text>
      </View>
      <MaterialCommunityIcons color="#94a3b8" name="chevron-right" size={21} />
    </Pressable>
  );
}
```

- [x] **Step 4: Run Recipes tests**

Run:

```bash
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipes-screen-design-contract.test.ts
./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json
```

Expected: PASS.

## Task 3: Simplify My Page

**Files:**
- Modify: `src/features/profile/screens/profile-screen.tsx`
- Create: `src/features/profile/screens/profile-screen-design-contract.test.ts`

- [x] **Step 1: Add My design guard test**

Create `src/features/profile/screens/profile-screen-design-contract.test.ts`:

```ts
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const source = readFileSync(resolve(__dirname, 'profile-screen.tsx'), 'utf8');

const forbiddenCopyOrComponents = [
  'proSection',
  'proStatusTitle',
  'proStatusBody',
  'savedTakeLocal',
  'listCard',
  'EmptyState',
  'Start filming',
  '촬영 시작',
];

for (const value of forbiddenCopyOrComponents) {
  if (source.includes(value)) {
    throw new Error(`My page should not keep AI-slop profile/list UI: ${value}`);
  }
}
```

- [x] **Step 2: Flatten profile header**

Replace the bordered profile card with an unframed header:

```tsx
<View className="gap-2 px-5">
  <Text className="text-[32px] font-black leading-[37px] text-ink">{profile.name}</Text>
  <Text className="text-[14px] font-semibold leading-5 text-muted">{profile.role}</Text>
</View>
```

Do not render `profile.bio` and `focusTags` by default in this pass.

- [x] **Step 3: Remove Pro/status panel**

Delete the `proSection` card. This is boxed status copy without a clear immediate action.

- [x] **Step 4: Flatten saved recipe rows**

Render saved recipes as direct rows, not inside `styles.listCard`, and remove the per-row `Start filming` button:

```tsx
<View className="gap-2">
  <Text className="px-5 text-[18px] font-black text-ink">{profileCopy.savedRecipesSection}</Text>
  {profileEntries.savedRecipes.map((recipe) => (
    <SavedRecipeRow
      key={recipe.recipeId}
      language={language}
      onPress={() => openDestination(recipe.destination)}
      recipe={recipe}
    />
  ))}
</View>
```

- [x] **Step 5: Keep saved takes compact**

Use one row title and one secondary line. Remove the right-side two-line status stack unless it is needed to identify final take.

- [x] **Step 6: Simplify empty states**

If empty, show one plain text line under the section title, not a bordered empty card with an icon:

```tsx
<Text className="px-5 text-[13px] font-semibold text-muted">
  {profileCopy.savedRecipesEmptyTitle}
</Text>
```

- [x] **Step 7: Run My tests**

Run:

```bash
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/profile/screens/profile-screen-design-contract.test.ts
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/profile/lib/profile-layout.test.ts
./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json
```

Expected: PASS.

## Task 4: Full Verification And Report

**Files:**
- Modify: `context/context_20260518_bottom_nav_recipes_my_ui_cleanup.md`
- Modify: `plans/20260518_bottom_nav_recipes_my_ui_cleanup.md`

- [x] **Step 1: Run full focused checks**

Run:

```bash
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/core/navigation/paste-drawer-state.test.ts
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipes-screen-design-contract.test.ts
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/profile/screens/profile-screen-design-contract.test.ts
./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json
npm run check:architecture
git diff --check
```

Expected: all pass.

- [ ] **Step 2: Expo Go QA**

Use the current Expo tunnel or restart it:

```bash
NODE_PATH=/opt/homebrew/lib/node_modules npx expo start --go --tunnel --port 8083 --clear
```

Capture/report:

- Explore screen before tapping bottom center Paste.
- Recipe-create drawer opened from Explore.
- Recipes tab after simplification.
- My tab after simplification.

Status: Expo web server returned HTTP 200 at `http://localhost:8084`. Native Expo Go screenshot QA remains follow-up for a simulator/device pass.

- [x] **Step 3: Update context**

Create `context/context_20260518_bottom_nav_recipes_my_ui_cleanup.md` with:

```md
# 2026-05-18 Bottom Nav / Recipes / My UI Cleanup

## Request

User deferred #19 live adapter and requested UI QA cleanup:
- bottom center Paste should open drawer
- Recipes should show owned recipes directly
- Recipes should remove search, collections, Continue Shooting, publish/community clutter
- My should remove AI-slop labels, nested boxes, and redundant CTA/copy

## Result

[fill with implemented summary]

## Verification

[fill with commands and Expo QA captures]
```

- [ ] **Step 4: Commit and push**

Run:

```bash
git add src/app-shell/navigation/root-native-tabs.tsx src/core/navigation/root-tab-config.test.ts src/core/navigation/paste-drawer-state.test.ts src/features/recipes/screens/recipes-screen.tsx src/features/recipes/screens/recipes-screen-design-contract.test.ts src/features/profile/screens/profile-screen.tsx src/features/profile/screens/profile-screen-design-contract.test.ts context/context_20260518_bottom_nav_recipes_my_ui_cleanup.md plans/20260518_bottom_nav_recipes_my_ui_cleanup.md
git commit -m "fix: simplify root content tabs"
git push origin main
```

## 실행 방식 추천

Subagent-driven으로 하기보다는 **inline execution**이 더 품질이 좋다. 이유는 세 화면이 같은 감도/문법으로 맞아야 해서, 여러 worker가 따로 만지면 Recipes/My/Home/Explore의 시각 언어가 다시 어긋날 가능성이 높다. 다만 QA 캡처는 별도 subagent 또는 별도 pass로 돌릴 수 있다.

## 결과

- Paste action: non-standard bottom tab presses now prevent default navigation and invoke the drawer action in place.
- Recipes: simplified to a direct owned-recipes list; search, filters, collections, Continue Shooting, publish/community, FAB, and duplicate row CTAs were removed.
- My: flattened to profile heading, saved recipe rows, saved take rows, and a compact language control; pro/status and nested list cards were removed.
- Added source-level design contract tests for Recipes and My.
- Context: `context/context_20260518_bottom_nav_recipes_my_ui_cleanup.md`
- Remaining QA: native Expo Go screenshots on iOS/Android are still recommended before release. This pass verified source contracts, TypeScript, architecture, diff whitespace, and Expo web HTTP smoke.
