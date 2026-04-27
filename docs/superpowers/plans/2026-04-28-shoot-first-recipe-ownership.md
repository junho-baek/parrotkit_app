# Shoot-First Recipe Ownership Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make ParrotKit feel like a shoot-first UGC recipe app where the first screen prioritizes continuing a shoot, saved recipes are immediately shootable, and Explore is a verified-creator recipe network.

**Architecture:** Keep the current Expo Router tab structure and mock workspace provider, but promote recipes from passive cards into owned/downloadable shoot templates. Add small recipe ownership helpers, extend mock data with verification and library metadata, then update Home, Explore, Recipes, and tab labels to express the new product loop: continue shooting, pick a saved recipe, download a verified creator recipe, shoot it.

**Tech Stack:** Expo Router, React Native, NativeWind, Expo Linear Gradient, existing `MockWorkspaceProvider`, existing `MediaTileCard`, TypeScript.

---

## Scope Check

This plan deliberately implements the product direction locally inside the native app. It does not build backend accounts, public publishing, payments, real recipe URLs, or server-side ownership enforcement. The first shippable unit is a convincing product shell and state model:

- Home opens as a shoot-first surface.
- Continue Shoot appears first when a recipe has shot progress.
- If there is no active session, the newest saved/owned recipe appears first.
- If there are no recipes, Quick Shoot is the first action.
- Explore remains a bottom tab and becomes a recipe network.
- Explore prioritizes verified creator recipes, because the chosen validation basis is **B. original creator is verified**.
- Recipes shows the user's owned, downloaded, and remixed recipe library.

## File Structure

- Create `plans/20260428_shoot_first_recipe_ownership.md`
  - Repo-local AGENTS plan note for this implementation pass.
- Modify `parrotkit-app/src/core/mocks/parrotkit-data.ts`
  - Owns mock recipe, creator, ownership, verification, download, and shoot-progress seed data.
- Create `parrotkit-app/src/features/recipes/lib/recipe-ownership.ts`
  - Pure helper functions for ownership labels, verification labels, progress summaries, and home ordering.
- Modify `parrotkit-app/src/core/providers/mock-workspace-provider.tsx`
  - Exposes `exploreRecipes`, `downloadRecipe`, `getContinueShootRecipe`, and `getLatestShootableRecipe`.
- Create `parrotkit-app/src/features/recipes/components/shootable-recipe-card.tsx`
  - Shared card used by Home, Explore, and Recipes for recipe ownership and shoot actions.
- Modify `parrotkit-app/src/features/home/components/home-workspace-surface.tsx`
  - Replaces dashboard-first content with Continue Shoot, Recipe Shelf, and Quick Shoot fallback.
- Modify `parrotkit-app/src/features/explore/screens/explore-screen.tsx`
  - Replaces reference browsing with verified creator recipe discovery and download.
- Modify `parrotkit-app/src/features/recipes/screens/recipes-screen.tsx`
  - Shows the user's recipe library by ownership/status using the shared card.
- Modify `parrotkit-app/src/core/navigation/root-native-tabs.tsx`
  - Rename the first tab label from `Home` to `Shoot`; keep Explore as a bottom tab.
- Create `context/context_20260428_shoot_first_recipe_ownership.md`
  - Completion notes and QA checklist.

---

## Task 1: Add Repo Plan Note

**Files:**
- Create: `plans/20260428_shoot_first_recipe_ownership.md`
- Add: `docs/superpowers/plans/2026-04-28-shoot-first-recipe-ownership.md`

- [ ] **Step 1: Create the repo-local plan note**

Create `plans/20260428_shoot_first_recipe_ownership.md` with this content:

```markdown
# 20260428 Shoot First Recipe Ownership

## 배경
- ParrotKit의 핵심 습관은 앱을 열면 바로 촬영을 이어가거나 시작하는 것이다.
- Home은 운영 대시보드보다 Continue Shoot과 내가 소유한 shootable recipe shelf가 되어야 한다.
- Explore 탭은 유지하되 영상 구경이 아니라 인증 크리에이터 레시피를 다운로드하고 촬영하는 네트워크가 되어야 한다.

## 목표
- Home 최상단 우선순위를 A: 마지막 촬영 이어하기, 없으면 B: 최근 저장/소유 레시피, 둘 다 없으면 D: 빈 Quick Shoot으로 만든다.
- Explore를 verified creator recipe discovery로 바꾼다.
- Recipes를 로컬에서 소유/저장/다운로드/리믹스한 레시피 보관함으로 정리한다.
- 레시피 카드의 주요 액션을 `Shoot`로 통일한다.

## 범위
- Mock data/model 확장.
- MockWorkspaceProvider 상태/액션 확장.
- Home, Explore, Recipes 화면 개편.
- 하단 첫 탭 라벨을 Shoot로 변경.

## 변경 파일
- `parrotkit-app/src/core/mocks/parrotkit-data.ts`
- `parrotkit-app/src/core/providers/mock-workspace-provider.tsx`
- `parrotkit-app/src/core/navigation/root-native-tabs.tsx`
- `parrotkit-app/src/features/home/components/home-workspace-surface.tsx`
- `parrotkit-app/src/features/explore/screens/explore-screen.tsx`
- `parrotkit-app/src/features/recipes/screens/recipes-screen.tsx`
- `parrotkit-app/src/features/recipes/components/shootable-recipe-card.tsx`
- `parrotkit-app/src/features/recipes/lib/recipe-ownership.ts`
- `context/context_20260428_shoot_first_recipe_ownership.md`

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`
- 8081 Metro에서 Home, Explore, Recipes 수동 QA.
- Home: active progress recipe가 있으면 Continue Shoot이 먼저 보인다.
- Home: active progress recipe가 없으면 최신 shootable recipe가 먼저 보인다.
- Explore: verified creator recipe가 먼저 보이고 다운로드 후 Recipes/Home에 반영된다.
- Recipes: owned/downloaded/remixed label이 보이고 Shoot 액션이 recipe detail로 이동한다.

## 롤백
- 새 helper/card/context 파일을 제거한다.
- `parrotkit-data.ts`와 `mock-workspace-provider.tsx`를 이전 recipe/reference 중심 모델로 되돌린다.
- Home, Explore, Recipes 화면을 이전 카드 리스트로 되돌린다.
- RootNativeTabs 첫 탭 라벨을 Home으로 되돌린다.

## 리스크
- Mock-only ownership이므로 실제 서버 소유권과 다를 수 있다.
- Home과 Recipes가 같은 카드 컴포넌트를 공유하므로 카드 API가 과도하게 커지지 않게 유지해야 한다.
- Explore download는 로컬 복제 상태만 만든다. 실제 공유 링크/권한 모델은 다음 단계에서 따로 설계한다.
```

- [ ] **Step 2: Verify the plan note exists**

Run:

```bash
test -f plans/20260428_shoot_first_recipe_ownership.md && sed -n '1,120p' plans/20260428_shoot_first_recipe_ownership.md
```

Expected: the command prints the title and all required AGENTS sections.

- [ ] **Step 3: Commit the planning note**

Run:

```bash
git add plans/20260428_shoot_first_recipe_ownership.md docs/superpowers/plans/2026-04-28-shoot-first-recipe-ownership.md
git commit -m "docs: plan shoot first recipe ownership"
```

Expected: commit succeeds and includes the repo-local plan note plus this implementation plan.

---

## Task 2: Add Recipe Ownership Helpers And Mock Types

**Files:**
- Modify: `parrotkit-app/src/core/mocks/parrotkit-data.ts`
- Create: `parrotkit-app/src/features/recipes/lib/recipe-ownership.ts`

- [ ] **Step 1: Extend mock recipe and creator types**

In `parrotkit-app/src/core/mocks/parrotkit-data.ts`, add these exported types after `MockPlatform`:

```ts
export type MockCreatorTrust = 'verified' | 'community';
export type MockRecipeOwnership = 'owned' | 'downloaded' | 'remixed' | 'community';
export type MockRecipeVerification = 'verified_creator' | 'community';
export type MockRecipeShootStatus = 'continue' | 'ready' | 'draft';
```

Update `MockPartnerCreator` to:

```ts
export type MockPartnerCreator = {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  trust: MockCreatorTrust;
  specialty: string;
};
```

Update `MockRecipe` to include:

```ts
  ownership: MockRecipeOwnership;
  verification: MockRecipeVerification;
  ownerHandle: string;
  ownerName: string;
  downloadCount: number;
  shootStatus: MockRecipeShootStatus;
  shotSceneCount: number;
  totalSceneCount: number;
  lastShotAt?: string;
  remixOfRecipeId?: string;
```

- [ ] **Step 2: Update partner creator seeds**

Still in `parrotkit-app/src/core/mocks/parrotkit-data.ts`, update every `partnerCreators` item with `trust` and `specialty`.

Use these exact values:

```ts
export const partnerCreators: MockPartnerCreator[] = [
  {
    id: 'creator-1',
    name: 'Minho Eats',
    handle: '@minhoeats',
    avatar: 'https://img.youtube.com/vi/JhBOUaCkltg/mqdefault.jpg',
    trust: 'verified',
    specialty: 'Food hooks',
  },
  {
    id: 'creator-2',
    name: 'Ava Beauty',
    handle: '@avabeauty',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    trust: 'verified',
    specialty: 'Beauty routines',
  },
  {
    id: 'creator-3',
    name: 'Coach Leon',
    handle: '@coachleon',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    trust: 'verified',
    specialty: 'Fitness proof',
  },
  {
    id: 'creator-4',
    name: 'Lena Builds',
    handle: '@lenabuilds',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80',
    trust: 'community',
    specialty: 'Founder story',
  },
  {
    id: 'creator-5',
    name: 'Miles Away',
    handle: '@milesaway',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    trust: 'community',
    specialty: 'Travel edits',
  },
];
```

- [ ] **Step 3: Add ownership metadata to existing recipe seeds**

For `recipe-korean-diet-hook`, add:

```ts
    ownership: 'owned',
    verification: 'verified_creator',
    ownerHandle: '@fit.frames',
    ownerName: 'Fit Frames',
    downloadCount: 1280,
    shootStatus: 'continue',
    shotSceneCount: 2,
    totalSceneCount: 3,
    lastShotAt: 'Last shot 18m ago',
```

For the second existing recipe seed, add:

```ts
    ownership: 'downloaded',
    verification: 'verified_creator',
    ownerHandle: '@minhoeats',
    ownerName: 'Minho Eats',
    downloadCount: 894,
    shootStatus: 'ready',
    shotSceneCount: 0,
    totalSceneCount: 3,
```

If there are additional recipe seeds, assign:

```ts
    ownership: 'owned',
    verification: 'community',
    ownerHandle: '@parrotkitcodextest',
    ownerName: 'You',
    downloadCount: 0,
    shootStatus: 'draft',
    shotSceneCount: 0,
    totalSceneCount: recipe.scenes.length,
```

Replace `recipe.scenes.length` with the literal scene count inside the object. Do not reference `recipe` inside the object literal.

- [ ] **Step 4: Add shared Explore recipe seeds**

At the end of `parrotkit-app/src/core/mocks/parrotkit-data.ts`, add:

```ts
export const exploreRecipeSeeds: MockRecipe[] = [
  {
    id: 'market-recipe-beauty-proof-routine',
    title: 'Beauty Proof Routine',
    creator: '@avabeauty',
    platform: 'Instagram Reels',
    thumbnail: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
    savedAt: 'Verified recipe',
    sourceUrl: 'https://www.instagram.com/reel/DemoGlowRoutine',
    summary: 'A verified creator recipe for turning a routine into three proof-first beats before the product reveal.',
    niche: 'Beauty',
    goal: 'Show proof before product',
    notes: 'Downloaded recipes keep creator attribution and can be remixed after saving.',
    ownership: 'community',
    verification: 'verified_creator',
    ownerHandle: '@avabeauty',
    ownerName: 'Ava Beauty',
    downloadCount: 2140,
    shootStatus: 'ready',
    shotSceneCount: 0,
    totalSceneCount: 3,
    scenes: [
      {
        id: 'beauty-proof-1',
        sceneNumber: 1,
        title: 'Open on the finished look',
        summary: 'Start with the result so the routine has a reason to exist.',
        analysisLines: ['The result-first open makes the routine feel worth copying.'],
        recipeLines: ['Show the finished look first.', 'Say the visible problem in one short line.'],
        prompterLines: ['This is the glow I wanted before touching concealer.'],
      },
      {
        id: 'beauty-proof-2',
        sceneNumber: 2,
        title: 'Make the product earn attention',
        summary: 'Hold the product until the viewer understands the problem.',
        analysisLines: ['The reveal lands because the product appears after a visible need.'],
        recipeLines: ['Show texture close-up.', 'Name one reason the product matters.'],
        prompterLines: ['I only care because it fixes this patchy spot.'],
      },
      {
        id: 'beauty-proof-3',
        sceneNumber: 3,
        title: 'Close with repeatability',
        summary: 'End with a routine the viewer can save.',
        analysisLines: ['A repeatable close drives saves better than a generic CTA.'],
        recipeLines: ['Summarize the three steps.', 'Hold the final look for one beat.'],
        prompterLines: ['Result, patch, blend. That is the whole routine.'],
      },
    ],
  },
  {
    id: 'market-recipe-core-control-proof',
    title: 'Core Control Proof',
    creator: '@coachleon',
    platform: 'Instagram Reels',
    thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80',
    savedAt: 'Verified recipe',
    sourceUrl: 'https://www.instagram.com/reel/CoreControlSprint',
    summary: 'A verified fitness recipe for making form correction feel obvious in the first five seconds.',
    niche: 'Fitness',
    goal: 'Make form correction visible',
    notes: 'Use this when the creator needs proof before instruction.',
    ownership: 'community',
    verification: 'verified_creator',
    ownerHandle: '@coachleon',
    ownerName: 'Coach Leon',
    downloadCount: 1670,
    shootStatus: 'ready',
    shotSceneCount: 0,
    totalSceneCount: 3,
    scenes: [
      {
        id: 'core-proof-1',
        sceneNumber: 1,
        title: 'Show the mistake first',
        summary: 'Make the bad form visible before explaining it.',
        analysisLines: ['The mistake-first open makes the correction feel necessary.'],
        recipeLines: ['Show one bad rep.', 'Freeze the frame on the visible issue.'],
        prompterLines: ['If your ribs flare here, your core is not controlling the move.'],
      },
      {
        id: 'core-proof-2',
        sceneNumber: 2,
        title: 'Switch to the correction',
        summary: 'Contrast the fixed version immediately.',
        analysisLines: ['The back-to-back contrast makes the lesson easy to trust.'],
        recipeLines: ['Show one corrected rep.', 'Keep the camera angle identical.'],
        prompterLines: ['Now tuck, breathe, and keep the ribs down.'],
      },
      {
        id: 'core-proof-3',
        sceneNumber: 3,
        title: 'Give the viewer a test',
        summary: 'End with a small check they can repeat.',
        analysisLines: ['A test gives the viewer a reason to save the video.'],
        recipeLines: ['Name the one check.', 'Invite them to try it next set.'],
        prompterLines: ['Try three slow reps and watch whether the ribs move.'],
      },
    ],
  },
  {
    id: 'market-recipe-founder-problem-hook',
    title: 'Founder Problem Hook',
    creator: '@lenabuilds',
    platform: 'TikTok',
    thumbnail: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=80',
    savedAt: 'Community recipe',
    sourceUrl: '',
    summary: 'A community recipe for explaining a product problem without sounding like a pitch.',
    niche: 'Creator',
    goal: 'Make a product problem feel specific',
    notes: 'Community recipes are visible but not treated as verified.',
    ownership: 'community',
    verification: 'community',
    ownerHandle: '@lenabuilds',
    ownerName: 'Lena Builds',
    downloadCount: 340,
    shootStatus: 'ready',
    shotSceneCount: 0,
    totalSceneCount: 3,
    scenes: [
      {
        id: 'founder-hook-1',
        sceneNumber: 1,
        title: 'Name the annoying moment',
        summary: 'Use a concrete pain before naming the product.',
        analysisLines: [],
        recipeLines: ['Say the moment users already recognize.'],
        prompterLines: ['The worst part is not the task. It is losing the tiny details.'],
      },
      {
        id: 'founder-hook-2',
        sceneNumber: 2,
        title: 'Show the old workaround',
        summary: 'Make the pain visible with the current hack.',
        analysisLines: [],
        recipeLines: ['Show the messy workaround in one shot.'],
        prompterLines: ['So people build this weird little system around it.'],
      },
      {
        id: 'founder-hook-3',
        sceneNumber: 3,
        title: 'Introduce the cleaner habit',
        summary: 'Position the product as a habit upgrade.',
        analysisLines: [],
        recipeLines: ['Show the new clean action.', 'Keep the product name secondary.'],
        prompterLines: ['We made the habit smaller, so you actually keep doing it.'],
      },
    ],
  },
];
```

- [ ] **Step 5: Create ownership helper module**

Create `parrotkit-app/src/features/recipes/lib/recipe-ownership.ts`:

```ts
import type { MockRecipe } from '@/core/mocks/parrotkit-data';

export function getRecipeOwnershipLabel(recipe: MockRecipe) {
  if (recipe.ownership === 'owned') return 'Owned';
  if (recipe.ownership === 'downloaded') return 'Saved';
  if (recipe.ownership === 'remixed') return 'Remix';
  return 'Community';
}

export function getRecipeVerificationLabel(recipe: MockRecipe) {
  return recipe.verification === 'verified_creator' ? 'Verified creator' : 'Community recipe';
}

export function getRecipeShootProgressLabel(recipe: MockRecipe) {
  if (recipe.shootStatus === 'continue') {
    return `${recipe.shotSceneCount}/${recipe.totalSceneCount} shot`;
  }

  if (recipe.shootStatus === 'draft') {
    return 'Draft';
  }

  return `${recipe.totalSceneCount} scenes ready`;
}

export function getRecipePrimaryActionLabel(recipe: MockRecipe) {
  return recipe.shootStatus === 'continue' ? 'Continue Shoot' : 'Shoot';
}

export function isVerifiedCreatorRecipe(recipe: MockRecipe) {
  return recipe.verification === 'verified_creator';
}

export function sortShootableRecipes(recipes: MockRecipe[]) {
  return [...recipes].sort((first, second) => {
    if (first.shootStatus === 'continue' && second.shootStatus !== 'continue') return -1;
    if (first.shootStatus !== 'continue' && second.shootStatus === 'continue') return 1;
    if (first.ownership === 'owned' && second.ownership !== 'owned') return -1;
    if (first.ownership !== 'owned' && second.ownership === 'owned') return 1;
    return second.downloadCount - first.downloadCount;
  });
}

export function getContinueShootRecipe(recipes: MockRecipe[]) {
  return sortShootableRecipes(recipes).find((recipe) => recipe.shootStatus === 'continue') ?? null;
}

export function getLatestShootableRecipe(recipes: MockRecipe[]) {
  return sortShootableRecipes(recipes).find((recipe) => recipe.shootStatus !== 'draft') ?? null;
}
```

- [ ] **Step 6: Run TypeScript**

Run:

```bash
cd parrotkit-app && npx tsc --noEmit
```

Expected: TypeScript fails because existing recipe creation functions do not populate the newly required `MockRecipe` fields.

- [ ] **Step 7: Fix generated recipe objects**

In `parrotkit-app/src/core/providers/mock-workspace-provider.tsx`, update both `createRecipeDraft` and `createQuickShootRecipe` returned `MockRecipe` objects with:

For `createRecipeDraft`:

```ts
      ownership: 'owned',
      verification: 'community',
      ownerHandle: '@parrotkitcodextest',
      ownerName: 'You',
      downloadCount: 0,
      shootStatus: 'draft',
      shotSceneCount: 0,
      totalSceneCount: 3,
```

For `createQuickShootRecipe`, use the computed scene count:

```ts
      ownership: 'owned',
      verification: 'community',
      ownerHandle: '@parrotkitcodextest',
      ownerName: 'You',
      downloadCount: 0,
      shootStatus: 'continue',
      shotSceneCount: 0,
      totalSceneCount: scenes.length,
      lastShotAt: 'Created just now',
```

- [ ] **Step 8: Run TypeScript again**

Run:

```bash
cd parrotkit-app && npx tsc --noEmit
```

Expected: PASS with no TypeScript errors.

- [ ] **Step 9: Commit ownership model**

Run:

```bash
git add parrotkit-app/src/core/mocks/parrotkit-data.ts parrotkit-app/src/core/providers/mock-workspace-provider.tsx parrotkit-app/src/features/recipes/lib/recipe-ownership.ts
git commit -m "feat: add recipe ownership metadata"
```

Expected: commit succeeds.

---

## Task 3: Extend Mock Workspace For Explore Downloads

**Files:**
- Modify: `parrotkit-app/src/core/providers/mock-workspace-provider.tsx`

- [ ] **Step 1: Import Explore seeds and helper functions**

Update imports in `parrotkit-app/src/core/providers/mock-workspace-provider.tsx`:

```ts
import {
  MockPlatform,
  MockRecipe,
  MockRecipeScene,
  MockRecordedTake,
  MockReference,
  exploreRecipeSeeds,
  partnerCreators,
  profileSeed,
  recentReferencesSeed,
  recipesSeed,
  trendingReferencesSeed,
} from '@/core/mocks/parrotkit-data';
import {
  getContinueShootRecipe as selectContinueShootRecipe,
  getLatestShootableRecipe as selectLatestShootableRecipe,
} from '@/features/recipes/lib/recipe-ownership';
```

- [ ] **Step 2: Extend workspace context type**

Inside `MockWorkspaceContextValue`, add:

```ts
  exploreRecipes: MockRecipe[];
  downloadRecipe: (recipeId: string) => MockRecipe | null;
  getContinueShootRecipe: () => MockRecipe | null;
  getLatestShootableRecipe: () => MockRecipe | null;
  isRecipeDownloaded: (recipeId: string) => boolean;
```

- [ ] **Step 3: Add download action**

Inside `MockWorkspaceProvider`, add this callback after `createQuickShootRecipe`:

```ts
  const downloadRecipe = useCallback((recipeId: string) => {
    const sourceRecipe = exploreRecipeSeeds.find((recipe) => recipe.id === recipeId);

    if (!sourceRecipe) {
      return null;
    }

    const existingDownloadedRecipe = recipes.find(
      (recipe) => recipe.sourceUrl === sourceRecipe.sourceUrl && recipe.ownerHandle === sourceRecipe.ownerHandle
    );

    if (existingDownloadedRecipe) {
      return existingDownloadedRecipe;
    }

    const downloadedRecipe: MockRecipe = {
      ...sourceRecipe,
      id: `downloaded-${sourceRecipe.id}`,
      ownership: 'downloaded',
      savedAt: 'Saved just now',
      shootStatus: 'ready',
      shotSceneCount: 0,
      totalSceneCount: sourceRecipe.scenes.length,
    };

    setRecipes((current) => [downloadedRecipe, ...current]);

    return downloadedRecipe;
  }, [recipes, setRecipes]);
```

- [ ] **Step 4: Add selection helpers**

Inside `MockWorkspaceProvider`, add:

```ts
  const getContinueShootRecipe = useCallback(
    () => selectContinueShootRecipe(recipes),
    [recipes]
  );

  const getLatestShootableRecipe = useCallback(
    () => selectLatestShootableRecipe(recipes),
    [recipes]
  );

  const isRecipeDownloaded = useCallback(
    (recipeId: string) => {
      const sourceRecipe = exploreRecipeSeeds.find((recipe) => recipe.id === recipeId);

      if (!sourceRecipe) {
        return false;
      }

      return recipes.some(
        (recipe) => recipe.sourceUrl === sourceRecipe.sourceUrl && recipe.ownerHandle === sourceRecipe.ownerHandle
      );
    },
    [recipes]
  );
```

- [ ] **Step 5: Expose the new workspace values**

In the `value` object, add:

```ts
      exploreRecipes: exploreRecipeSeeds,
      downloadRecipe,
      getContinueShootRecipe,
      getLatestShootableRecipe,
      isRecipeDownloaded,
```

Add these functions to the `useMemo` dependency list:

```ts
      downloadRecipe,
      getContinueShootRecipe,
      getLatestShootableRecipe,
      isRecipeDownloaded,
```

- [ ] **Step 6: Make `getRecipeById` resolve downloaded Explore copies only**

Keep `getRecipeById` as:

```ts
  const getRecipeById = (recipeId: string) => recipes.find((recipe) => recipe.id === recipeId) ?? null;
```

Do not make recipe detail open market-only recipes directly in this pass. Explore recipes become shootable after download.

- [ ] **Step 7: Run TypeScript**

Run:

```bash
cd parrotkit-app && npx tsc --noEmit
```

Expected: PASS with no TypeScript errors.

- [ ] **Step 8: Commit workspace actions**

Run:

```bash
git add parrotkit-app/src/core/providers/mock-workspace-provider.tsx
git commit -m "feat: add recipe download workspace actions"
```

Expected: commit succeeds.

---

## Task 4: Create Shared Shootable Recipe Card

**Files:**
- Create: `parrotkit-app/src/features/recipes/components/shootable-recipe-card.tsx`

- [ ] **Step 1: Create the card component**

Create `parrotkit-app/src/features/recipes/components/shootable-recipe-card.tsx`:

```tsx
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';

import type { MockRecipe } from '@/core/mocks/parrotkit-data';
import { brandActionGradient } from '@/core/theme/colors';
import {
  getRecipeOwnershipLabel,
  getRecipePrimaryActionLabel,
  getRecipeShootProgressLabel,
  getRecipeVerificationLabel,
} from '@/features/recipes/lib/recipe-ownership';

type ShootableRecipeCardProps = {
  recipe: MockRecipe;
  mode?: 'hero' | 'grid';
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimary: () => void;
  onSecondary?: () => void;
};

export function ShootableRecipeCard({
  recipe,
  mode = 'grid',
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
}: ShootableRecipeCardProps) {
  const hero = mode === 'hero';
  const resolvedPrimaryLabel = primaryLabel ?? getRecipePrimaryActionLabel(recipe);
  const progressLabel = getRecipeShootProgressLabel(recipe);

  return (
    <View style={[styles.card, hero ? styles.heroCard : styles.gridCard]}>
      <ImageBackground
        imageStyle={styles.image}
        resizeMode="cover"
        source={{ uri: recipe.thumbnail }}
        style={hero ? styles.heroImage : styles.gridImage}
      >
        <LinearGradient
          colors={['rgba(2,6,23,0.04)', 'rgba(2,6,23,0.88)']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{getRecipeOwnershipLabel(recipe)}</Text>
          </View>
          <View style={styles.badge}>
            <MaterialCommunityIcons color="#fff" name="check-decagram" size={13} />
            <Text style={styles.badgeText}>{getRecipeVerificationLabel(recipe)}</Text>
          </View>
        </View>

        <View style={styles.body}>
          <Text numberOfLines={hero ? 2 : 3} style={hero ? styles.heroTitle : styles.gridTitle}>
            {recipe.title}
          </Text>
          <Text numberOfLines={2} style={styles.summary}>
            {recipe.summary}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>{recipe.ownerHandle}</Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaText}>{progressLabel}</Text>
          </View>

          <View style={styles.actionRow}>
            <Pressable accessibilityRole="button" onPress={onPrimary} style={styles.primaryButton}>
              <LinearGradient colors={brandActionGradient} end={{ x: 1, y: 1 }} start={{ x: 0, y: 0 }} style={styles.primaryGradient}>
                <MaterialCommunityIcons color="#fff" name="video-outline" size={16} />
                <Text style={styles.primaryText}>{resolvedPrimaryLabel}</Text>
              </LinearGradient>
            </Pressable>

            {onSecondary && secondaryLabel ? (
              <Pressable accessibilityRole="button" onPress={onSecondary} style={styles.secondaryButton}>
                <Text style={styles.secondaryText}>{secondaryLabel}</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  actionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  badge: {
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    borderColor: 'rgba(255,255,255,0.16)',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    padding: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  body: {
    marginTop: 'auto',
    padding: 14,
  },
  card: {
    backgroundColor: '#020617',
    borderColor: 'rgba(15, 23, 42, 0.1)',
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  gridCard: {
    minHeight: 254,
  },
  gridImage: {
    minHeight: 254,
  },
  gridTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 22,
  },
  heroCard: {
    minHeight: 300,
  },
  heroImage: {
    minHeight: 300,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 32,
  },
  image: {
    borderRadius: 24,
  },
  metaDot: {
    color: 'rgba(255,255,255,0.54)',
    fontSize: 12,
    fontWeight: '800',
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  metaText: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 12,
    fontWeight: '700',
  },
  primaryButton: {
    borderRadius: 999,
    overflow: 'hidden',
  },
  primaryGradient: {
    alignItems: 'center',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  primaryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  secondaryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  summary: {
    color: 'rgba(255,255,255,0.74)',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    marginTop: 8,
  },
});
```

- [ ] **Step 2: Run TypeScript**

Run:

```bash
cd parrotkit-app && npx tsc --noEmit
```

Expected: PASS with no TypeScript errors.

- [ ] **Step 3: Commit shared card**

Run:

```bash
git add parrotkit-app/src/features/recipes/components/shootable-recipe-card.tsx
git commit -m "feat: add shootable recipe card"
```

Expected: commit succeeds.

---

## Task 5: Rebuild Home As Shoot-First Surface

**Files:**
- Modify: `parrotkit-app/src/features/home/components/home-workspace-surface.tsx`

- [ ] **Step 1: Replace imports**

In `home-workspace-surface.tsx`, replace imports with:

```tsx
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { Href, useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { useMockWorkspace } from '@/core/providers/mock-workspace-provider';
import { brandActionGradient } from '@/core/theme/colors';
import { AppScreenScrollView } from '@/core/ui/app-screen-scroll-view';
import { ShootableRecipeCard } from '@/features/recipes/components/shootable-recipe-card';
```

Remove `compactFormatter`, `MediaTileCard`, `StatCard`, and `Chip`.

- [ ] **Step 2: Replace `HomeWorkspaceSurface` body**

Replace the component with:

```tsx
export function HomeWorkspaceSurface() {
  const router = useRouter();
  const {
    getContinueShootRecipe,
    getLatestShootableRecipe,
    recipes,
  } = useMockWorkspace();
  const continueRecipe = getContinueShootRecipe();
  const latestRecipe = continueRecipe ? null : getLatestShootableRecipe();
  const shelfRecipes = recipes.filter((recipe) => recipe.id !== continueRecipe?.id && recipe.id !== latestRecipe?.id);
  const heroRecipe = continueRecipe ?? latestRecipe;

  return (
    <View className="flex-1 bg-canvas">
      <AppScreenScrollView>
        <View className="gap-5 px-5">
          <View className="gap-1">
            <Text className="text-[32px] font-black leading-[36px] text-ink">Shoot</Text>
            <Text className="text-[15px] font-medium text-muted">Open a recipe, load the prompter, and record the next cut.</Text>
          </View>

          {heroRecipe ? (
            <View className="gap-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-[12px] font-black uppercase tracking-[1.2px] text-muted">
                  {continueRecipe ? 'Continue' : 'Ready to shoot'}
                </Text>
                <Text className="text-[12px] font-bold text-violet">
                  {heroRecipe.lastShotAt ?? heroRecipe.savedAt}
                </Text>
              </View>

              <ShootableRecipeCard
                mode="hero"
                recipe={heroRecipe}
                onPrimary={() => router.push(`/recipe/${heroRecipe.id}/prompter` as Href)}
                onSecondary={() => router.push(`/recipe/${heroRecipe.id}` as Href)}
                secondaryLabel="Recipe"
              />
            </View>
          ) : (
            <EmptyShootHero onQuickShoot={() => router.push('/quick-shoot' as Href)} />
          )}

          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-[18px] font-black text-ink">Your recipes</Text>
              <Text
                className="text-[13px] font-bold text-violet"
                onPress={() => router.push('/recipes' as Href)}
              >
                View all
              </Text>
            </View>

            {shelfRecipes.length > 0 ? (
              <View className="flex-row flex-wrap gap-3">
                {shelfRecipes.slice(0, 4).map((recipe) => (
                  <View key={recipe.id} className="w-[48%]">
                    <ShootableRecipeCard
                      recipe={recipe}
                      onPrimary={() => router.push(`/recipe/${recipe.id}/prompter` as Href)}
                      onSecondary={() => router.push(`/recipe/${recipe.id}` as Href)}
                      secondaryLabel="Open"
                    />
                  </View>
                ))}
              </View>
            ) : (
              <View className="rounded-[26px] border border-dashed border-stroke bg-surface px-5 py-8">
                <Text className="text-[17px] font-black text-ink">No saved recipe shelf yet</Text>
                <Text className="mt-2 text-sm leading-6 text-muted">
                  Download a verified creator recipe from Explore or make one from Source.
                </Text>
              </View>
            )}
          </View>

          <PressableAction
            body="Paste a script, link, or reference and turn it into a shootable recipe."
            cta="Make Recipe"
            onPress={() => router.push('/source-actions' as Href)}
            title="Add a source"
          />
        </View>
      </AppScreenScrollView>
    </View>
  );
}
```

- [ ] **Step 3: Add `EmptyShootHero` helper**

Add below `HomeWorkspaceSurface`:

```tsx
function EmptyShootHero({ onQuickShoot }: { onQuickShoot: () => void }) {
  return (
    <LinearGradient colors={['#111827', '#020617']} end={{ x: 1, y: 1 }} start={{ x: 0, y: 0 }} style={{ borderRadius: 28 }}>
      <View className="gap-4 px-5 py-6">
        <View className="h-12 w-12 items-center justify-center rounded-full bg-white/12">
          <MaterialCommunityIcons color="#fff" name="video-plus-outline" size={25} />
        </View>
        <View className="gap-2">
          <Text className="text-[28px] font-black leading-[32px] text-white">Start with a blank prompter</Text>
          <Text className="text-sm leading-6 text-white/70">
            No active shoot yet. Open Quick Shoot, write one cue, and record the first take.
          </Text>
        </View>
        <Pressable className="self-start rounded-full bg-white px-5 py-3" onPress={onQuickShoot}>
          <Text className="text-sm font-black text-slate-950">Quick Shoot</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}
```

- [ ] **Step 4: Replace `PressableAction` helper**

Keep `PressableAction`, but update it to use `Pressable` instead of `Text onPress`:

```tsx
function PressableAction({
  title,
  body,
  cta,
  onPress,
}: {
  title: string;
  body: string;
  cta: string;
  onPress: () => void;
}) {
  return (
    <LinearGradient colors={brandActionGradient} end={{ x: 1, y: 1 }} start={{ x: 0, y: 0 }} style={{ borderRadius: 24 }}>
      <View className="flex-row items-center justify-between rounded-[24px] px-5 py-5">
        <View className="flex-1 gap-1 pr-4">
          <Text className="text-[18px] font-bold text-white">{title}</Text>
          <Text className="text-[13px] leading-5 text-white/90">{body}</Text>
        </View>

        <Pressable className="rounded-2xl bg-white px-4 py-2.5" onPress={onPress}>
          <Text className="text-sm font-bold text-sky-600">{cta}</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}
```

- [ ] **Step 5: Run TypeScript**

Run:

```bash
cd parrotkit-app && npx tsc --noEmit
```

Expected: PASS with no TypeScript errors.

- [ ] **Step 6: Manual QA Home**

Run Metro if it is not already running:

```bash
cd parrotkit-app && npm run start -- --port 8081
```

Expected: Metro starts on port 8081.

Open the dev client. Verify:

- The first tab header says `Shoot`.
- Continue card appears first for `Korean Diet Viral Hook`.
- Primary action opens `/recipe/recipe-korean-diet-hook/prompter`.
- Secondary action opens `/recipe/recipe-korean-diet-hook`.
- `Your recipes` appears below the hero.
- `Add a source` appears after the shelf.

- [ ] **Step 7: Commit Home**

Run:

```bash
git add parrotkit-app/src/features/home/components/home-workspace-surface.tsx
git commit -m "feat: make home shoot first"
```

Expected: commit succeeds.

---

## Task 6: Rebuild Explore As Verified Creator Recipe Network

**Files:**
- Modify: `parrotkit-app/src/features/explore/screens/explore-screen.tsx`

- [ ] **Step 1: Replace imports**

Replace imports with:

```tsx
import { Href, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';

import { useMockWorkspace } from '@/core/providers/mock-workspace-provider';
import { AppScreenScrollView } from '@/core/ui/app-screen-scroll-view';
import { ShootableRecipeCard } from '@/features/recipes/components/shootable-recipe-card';
import { isVerifiedCreatorRecipe } from '@/features/recipes/lib/recipe-ownership';
```

- [ ] **Step 2: Replace category constants**

Replace `categories` with:

```ts
const recipeFilters = ['Verified', 'Community', 'All'] as const;
type RecipeFilter = (typeof recipeFilters)[number];
```

- [ ] **Step 3: Replace `ExploreScreen` component**

Replace the component body with:

```tsx
export function ExploreScreen() {
  const router = useRouter();
  const {
    downloadRecipe,
    exploreRecipes,
    isRecipeDownloaded,
    partnerCreators,
  } = useMockWorkspace();
  const [selectedFilter, setSelectedFilter] = useState<RecipeFilter>('Verified');

  const filteredRecipes = useMemo(() => {
    if (selectedFilter === 'Verified') {
      return exploreRecipes.filter(isVerifiedCreatorRecipe);
    }

    if (selectedFilter === 'Community') {
      return exploreRecipes.filter((recipe) => !isVerifiedCreatorRecipe(recipe));
    }

    return exploreRecipes;
  }, [exploreRecipes, selectedFilter]);

  const verifiedCreators = partnerCreators.filter((creator) => creator.trust === 'verified');

  const handleDownload = (recipeId: string) => {
    const downloadedRecipe = downloadRecipe(recipeId);

    if (downloadedRecipe) {
      router.push(`/recipe/${downloadedRecipe.id}` as Href);
    }
  };

  return (
    <AppScreenScrollView>
      <View className="gap-5 px-5">
        <View className="gap-1">
          <Text className="text-[32px] font-black leading-[36px] text-ink">Explore</Text>
          <Text className="text-[15px] text-muted">Verified creator recipes you can save, remix, and shoot.</Text>
        </View>

        <View className="gap-3">
          <Text className="text-[16px] font-black text-ink">Verified creators</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-4">
              {verifiedCreators.map((creator) => (
                <View key={creator.id} className="w-[96px]">
                  <View className="mb-2 h-[76px] w-[76px] overflow-hidden rounded-full border border-violet/30">
                    <MediaAvatar uri={creator.avatar} />
                  </View>
                  <Text className="text-[13px] font-black text-ink" numberOfLines={1}>
                    {creator.name}
                  </Text>
                  <Text className="text-[11px] font-semibold text-muted" numberOfLines={1}>
                    {creator.specialty}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {recipeFilters.map((filter) => {
              const selected = filter === selectedFilter;
              return (
                <Pressable
                  key={filter}
                  className={`rounded-full px-4 py-2 ${selected ? 'bg-violet' : 'bg-slate-100'}`}
                  onPress={() => setSelectedFilter(filter)}
                >
                  <Text className={`text-xs font-black ${selected ? 'text-white' : 'text-slate-700'}`}>
                    {filter}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        <View className="gap-3">
          <Text className="text-[18px] font-black text-ink">
            {selectedFilter === 'Verified' ? 'Verified recipes' : selectedFilter === 'Community' ? 'Community recipes' : 'All recipes'}
          </Text>

          <View className="flex-row flex-wrap gap-3">
            {filteredRecipes.map((recipe) => {
              const downloaded = isRecipeDownloaded(recipe.id);
              return (
                <View key={recipe.id} className="w-[48%]">
                  <ShootableRecipeCard
                    recipe={recipe}
                    primaryLabel={downloaded ? 'Open' : 'Download'}
                    secondaryLabel={downloaded ? 'Saved' : `${recipe.downloadCount}`}
                    onPrimary={() => handleDownload(recipe.id)}
                    onSecondary={downloaded ? () => handleDownload(recipe.id) : undefined}
                  />
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </AppScreenScrollView>
  );
}
```

- [ ] **Step 4: Keep `MediaAvatar` helper**

Keep:

```tsx
function MediaAvatar({ uri }: { uri: string }) {
  return <Image className="h-full w-full" resizeMode="cover" source={{ uri }} />;
}
```

- [ ] **Step 5: Run TypeScript**

Run:

```bash
cd parrotkit-app && npx tsc --noEmit
```

Expected: PASS with no TypeScript errors.

- [ ] **Step 6: Manual QA Explore**

With the app running on 8081, verify:

- Explore tab is still visible in bottom navigation.
- Header says `Explore`.
- Verified creators section only shows Minho Eats, Ava Beauty, and Coach Leon.
- `Verified` filter is selected by default.
- Verified recipe cards show `Verified creator`.
- Tapping `Download` opens the downloaded recipe detail.
- Returning to Explore changes that recipe action to `Open`.
- `Community` filter shows `Founder Problem Hook`.

- [ ] **Step 7: Commit Explore**

Run:

```bash
git add parrotkit-app/src/features/explore/screens/explore-screen.tsx
git commit -m "feat: make explore a recipe network"
```

Expected: commit succeeds.

---

## Task 7: Update Recipes Library Around Ownership

**Files:**
- Modify: `parrotkit-app/src/features/recipes/screens/recipes-screen.tsx`

- [ ] **Step 1: Replace imports**

Use:

```tsx
import { Href, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useMockWorkspace } from '@/core/providers/mock-workspace-provider';
import { AppScreenScrollView } from '@/core/ui/app-screen-scroll-view';
import { ShootableRecipeCard } from '@/features/recipes/components/shootable-recipe-card';
```

- [ ] **Step 2: Add filters**

Add above `RecipesScreen`:

```ts
const libraryFilters = ['All', 'Owned', 'Saved', 'Remixes'] as const;
type LibraryFilter = (typeof libraryFilters)[number];
```

- [ ] **Step 3: Replace `RecipesScreen` component**

Replace the component with:

```tsx
export function RecipesScreen() {
  const router = useRouter();
  const { recipes } = useMockWorkspace();
  const [selectedFilter, setSelectedFilter] = useState<LibraryFilter>('All');

  const filteredRecipes = useMemo(() => {
    if (selectedFilter === 'Owned') {
      return recipes.filter((recipe) => recipe.ownership === 'owned');
    }

    if (selectedFilter === 'Saved') {
      return recipes.filter((recipe) => recipe.ownership === 'downloaded');
    }

    if (selectedFilter === 'Remixes') {
      return recipes.filter((recipe) => recipe.ownership === 'remixed');
    }

    return recipes;
  }, [recipes, selectedFilter]);

  return (
    <AppScreenScrollView>
      <View className="gap-5 px-5">
        <View className="gap-1">
          <Text className="text-[32px] font-black leading-[36px] text-ink">Recipes</Text>
          <Text className="text-[15px] text-muted">Your owned, saved, and remixed shooting templates.</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {libraryFilters.map((filter) => {
              const selected = filter === selectedFilter;
              return (
                <Pressable
                  key={filter}
                  className={`rounded-full px-4 py-2 ${selected ? 'bg-violet' : 'bg-slate-100'}`}
                  onPress={() => setSelectedFilter(filter)}
                >
                  <Text className={`text-xs font-black ${selected ? 'text-white' : 'text-slate-700'}`}>
                    {filter}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        {filteredRecipes.length === 0 ? (
          <View className="rounded-[28px] border border-dashed border-stroke bg-surface px-5 py-12">
            <Text className="text-center text-[18px] font-bold text-ink">No recipes here yet</Text>
            <Text className="mt-2 text-center text-sm text-muted">
              Download a verified recipe from Explore or make one from a source.
            </Text>
            <Text
              className="mt-5 self-center rounded-full bg-violet px-5 py-3 text-sm font-bold text-white"
              onPress={() => router.push('/explore' as Href)}
            >
              Explore Recipes
            </Text>
          </View>
        ) : (
          <View className="flex-row flex-wrap gap-3">
            {filteredRecipes.map((recipe) => (
              <View key={recipe.id} className="w-[48%]">
                <ShootableRecipeCard
                  recipe={recipe}
                  onPrimary={() => router.push(`/recipe/${recipe.id}/prompter` as Href)}
                  onSecondary={() => router.push(`/recipe/${recipe.id}` as Href)}
                  secondaryLabel="Open"
                />
              </View>
            ))}
          </View>
        )}
      </View>
    </AppScreenScrollView>
  );
}
```

- [ ] **Step 4: Run TypeScript**

Run:

```bash
cd parrotkit-app && npx tsc --noEmit
```

Expected: PASS with no TypeScript errors.

- [ ] **Step 5: Manual QA Recipes**

With the app running on 8081, verify:

- Recipes copy says `Your owned, saved, and remixed shooting templates.`
- Filters `All`, `Owned`, `Saved`, `Remixes` are visible.
- `Owned` shows owned recipes.
- `Saved` shows downloaded recipes.
- `Shoot` opens `/recipe/<recipeId>/prompter`.
- `Open` opens `/recipe/<recipeId>`.

- [ ] **Step 6: Commit Recipes**

Run:

```bash
git add parrotkit-app/src/features/recipes/screens/recipes-screen.tsx
git commit -m "feat: organize recipe library by ownership"
```

Expected: commit succeeds.

---

## Task 8: Rename First Tab To Shoot

**Files:**
- Modify: `parrotkit-app/src/core/navigation/root-native-tabs.tsx`

- [ ] **Step 1: Change Home label**

In `root-native-tabs.tsx`, change:

```tsx
<Label hidden={homeQuickShootChromeHidden}>Home</Label>
```

to:

```tsx
<Label hidden={homeQuickShootChromeHidden}>Shoot</Label>
```

- [ ] **Step 2: Keep Explore label unchanged**

Verify this line remains:

```tsx
<Label hidden={homeQuickShootChromeHidden}>Explore</Label>
```

- [ ] **Step 3: Run TypeScript**

Run:

```bash
cd parrotkit-app && npx tsc --noEmit
```

Expected: PASS with no TypeScript errors.

- [ ] **Step 4: Manual QA navigation**

Verify:

- Bottom navigation first tab says `Shoot`.
- Bottom navigation still includes `Explore`.
- `Source`, `Recipes`, and `My` remain visible.
- Quick Shoot swipe still hides top chrome and floating source CTA.

- [ ] **Step 5: Commit navigation label**

Run:

```bash
git add parrotkit-app/src/core/navigation/root-native-tabs.tsx
git commit -m "feat: rename home tab to shoot"
```

Expected: commit succeeds.

---

## Task 9: Final Context, Verification, And Push

**Files:**
- Create: `context/context_20260428_shoot_first_recipe_ownership.md`

- [ ] **Step 1: Run final TypeScript check**

Run:

```bash
cd parrotkit-app && npx tsc --noEmit
```

Expected: PASS with no TypeScript errors.

- [ ] **Step 2: Run final local QA on 8081**

If Metro is not running:

```bash
cd parrotkit-app && npm run start -- --port 8081
```

Verify:

- App opens to the `Shoot` tab.
- Continue Shoot hero appears when a recipe has `shootStatus: 'continue'`.
- Hero primary action opens the prompter.
- Explore shows verified creator recipes first.
- Downloading a verified recipe creates a saved local recipe.
- Recipes `Saved` filter includes the downloaded recipe.
- Recipes `Shoot` opens the prompter for saved recipes.
- Existing Quick Shoot swipe still works from the Shoot tab.

- [ ] **Step 3: Create context note**

Create `context/context_20260428_shoot_first_recipe_ownership.md`:

```markdown
# 20260428 Shoot First Recipe Ownership

## 요약
- Home/Shoot 화면을 촬영 이어하기 중심으로 개편했다.
- 레시피에 ownership, verification, download, shoot progress metadata를 추가했다.
- Explore를 verified creator recipe network로 바꾸고 다운로드 액션을 mock workspace에 연결했다.
- Recipes를 owned/downloaded/remixed library로 정리했다.

## 검증
- `cd parrotkit-app && npx tsc --noEmit` 통과.
- 8081 dev client에서 Shoot, Explore, Recipes 주요 흐름을 수동 확인했다.

## 남은 리스크
- 소유권과 다운로드는 mock local state이며 서버 권한 모델은 없다.
- Verified creator 기준은 seed data의 `trust: 'verified'`와 recipe `verification: 'verified_creator'`에 의존한다.
- 실제 공유 링크, 리믹스 계보 저장, 공개/비공개 권한은 다음 계획에서 별도 구현해야 한다.
```

- [ ] **Step 4: Fetch latest dev**

Run:

```bash
git fetch origin dev
git rev-parse HEAD origin/dev FETCH_HEAD
```

Expected: if `HEAD`, `origin/dev`, and `FETCH_HEAD` differ, rebase before pushing:

```bash
git rebase origin/dev
```

Expected after rebase: no conflicts and TypeScript still passes.

- [ ] **Step 5: Commit context**

Run:

```bash
git add context/context_20260428_shoot_first_recipe_ownership.md
git commit -m "docs: record shoot first recipe ownership work"
```

Expected: commit succeeds.

- [ ] **Step 6: Push dev**

Run:

```bash
git push origin dev
```

Expected: push succeeds.

---

## Self-Review

Spec coverage:
- Shoot-first Home priority A/B/D is covered by Task 5.
- Explore tab remains and becomes recipe discovery in Task 6.
- Verified creator basis B is represented by `trust: 'verified'` and `verification: 'verified_creator'` in Task 2 and used in Task 6.
- Recipe ownership, download, and saved library are covered by Tasks 2, 3, and 7.
- Navigation keeps Explore and renames Home to Shoot in Task 8.

Placeholder scan:
- This plan contains no placeholder markers and no unnamed follow-up steps.
- Every code-changing step includes concrete code or exact replacement content.

Type consistency:
- `MockRecipeOwnership`, `MockRecipeVerification`, `MockRecipeShootStatus`, `MockCreatorTrust`, `downloadRecipe`, `getContinueShootRecipe`, `getLatestShootableRecipe`, and `ShootableRecipeCard` names are used consistently across tasks.
- Route targets use existing Expo Router paths: `/quick-shoot`, `/source-actions`, `/explore`, `/recipes`, `/recipe/${recipe.id}`, and `/recipe/${recipe.id}/prompter`.
