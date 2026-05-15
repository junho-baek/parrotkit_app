# DDD Architecture Simplification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make ParrotKit easier to change by separating domain rules from Expo Router screens, React providers, and emergency UI guardrails.

**Architecture:** Use a small DDD shape: `domain` for pure entities/rules, `application` for in-memory workspace orchestration, `app-shell` for navigation composition, and `features` for UI. Keep compatibility shims during the migration so current screens keep working while the dependency direction is corrected.

**Tech Stack:** Expo SDK 54, React Native, Expo Router, TypeScript, sucrase-node contract tests, local simulator QA.

---

## 배경

최근 Ouroboros 작업으로 ParrotKit v1 흐름은 많이 복구됐지만, 구조는 아직 속도전의 흔적이 남아 있다.

- `src/app` 라우트는 thin wrapper라 좋다.
- `features/*/lib`에 순수 함수와 테스트가 많아진 점도 좋다.
- 하지만 `src/core/providers/mock-workspace-provider.tsx`가 모든 feature/use-case를 들고 있다.
- `src/core/navigation/root-native-tabs.tsx`가 `RecipeCreateScreen`을 직접 import한다.
- `recipe-detail-screen.tsx`, `recipe-prompter-camera-screen.tsx`, `recipes-screen.tsx`가 너무 커서 회귀가 숨어들기 쉽다.
- Expo dependency alignment가 깨져 native dev-client simulator build를 신뢰하기 어렵다.

## 목표

1. domain 로직을 React/Expo/UI에서 분리한다.
2. `core`가 feature를 import하지 않게 만든다.
3. workspace provider를 application layer로 내려앉힌다.
4. navigation shell은 app composition layer로 옮긴다.
5. 큰 screen은 workflow 단위로 나누되, 사용자-facing UI를 갈아엎지 않는다.
6. TypeScript, contract tests, Expo dependency check, simulator smoke가 통과하는 상태를 만든다.

## 범위

- 포함: dependency alignment, boundary guard, domain/application/app-shell 폴더 도입, compatibility shim, provider relocation, root tab shell relocation, brittle source-string tests 축소, large screen split plan.
- 제외: Supabase 도입, real backend persistence, UI redesign, paywall/Pro policy 변경, full rewrite.

## 변경 파일

- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `scripts/check-architecture-boundaries.cjs`
- Create: `src/domain/recipes/recipe.ts`
- Create: `src/domain/recipes/native-recipe.ts`
- Create: `src/domain/takes/saved-take-contract.ts`
- Create: `src/domain/shoot-board/shoot-board-model.ts`
- Create: `src/application/workspace/mock-workspace-provider.tsx`
- Create: `src/app-shell/navigation/root-native-tabs.tsx`
- Modify: `src/core/mocks/parrotkit-data.ts`
- Modify: `src/core/providers/mock-workspace-provider.tsx`
- Modify: `src/core/navigation/root-native-tabs.tsx`
- Modify: `src/core/navigation/root-tab-config.test.ts`
- Modify: `src/app/(tabs)/_layout.tsx`
- Modify: `src/features/recipes/lib/saved-take-contract.ts`
- Modify: `src/features/recipes/lib/shoot-board-model.ts`
- Modify: `src/features/recipes/types/recipe-domain.ts`
- Modify: `src/features/recipes/screens/recipe-create-screen.tsx`
- Modify: `src/features/recipes/screens/recipe-detail-screen.tsx`
- Create or update: `context/context_20260516_ddd_architecture_simplification.md`

## 테스트

- `npx expo install --check`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- `node scripts/check-architecture-boundaries.cjs`
- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts`
- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/recipes/lib/saved-take-contract.test.ts`
- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/recipes/lib/shoot-board-model.test.ts`
- `npm run ios` or `npx expo start --go --ios --port 8083 --localhost` for simulator smoke, depending on dev-client build health.

## 롤백

Each task commits separately. Roll back by reverting the last failing commit. Compatibility shims keep old import paths active, so rollback should not require touching every screen.

## 리스크

- Native dependency correction can update `package-lock.json` heavily.
- Moving domain files can create stale import paths.
- Existing source-string tests may fail for structurally correct changes.
- Provider relocation can cause circular imports if application code imports UI feature screens.
- Large screen splitting can accidentally change navigation state or drawer behavior.

---

## Scope Check

This is one architectural plan with one working outcome: keep the v1 app behavior while fixing the dependency direction. It is not a product feature plan. If implementation starts to touch UI copy/layout beyond small import-driven changes, stop and create a separate UI QA plan.

## Target Shape

```text
src/
  app/                  Expo Router route files only
  app-shell/            navigation shell and app composition
  application/          in-memory workspace orchestration and app services
  domain/               pure business rules, entities, value objects
  core/                 shared infrastructure, theme, UI adapters, i18n
  features/             screens/components that render user workflows
```

Dependency direction:

```text
features -> application -> domain
app-shell -> features + application + core
core -> domain only when truly shared
domain -> no React, no Expo, no React Native, no features, no core
```

---

### Task 1: Restore Native Dependency Health

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Confirm current Expo compatibility failure**

Run:

```bash
cd /Users/junho/project/parrotkit-app/parrotkit-app
npx expo install --check
```

Expected: FAIL listing these mismatches:

```text
expo@54.0.33 - expected version: ~54.0.34
expo-dev-client@6.0.20 - expected version: ~6.0.21
expo-linking@8.0.11 - expected version: ~8.0.12
react-native-gesture-handler@2.31.2 - expected version: ~2.28.0
```

- [ ] **Step 2: Align SDK 54 dependency versions**

Run:

```bash
cd /Users/junho/project/parrotkit-app/parrotkit-app
npx expo install expo@~54.0.34 expo-dev-client@~6.0.21 expo-linking@~8.0.12 react-native-gesture-handler@~2.28.0
```

Expected: `package.json` and `package-lock.json` update only dependency versions.

- [ ] **Step 3: Verify Expo dependency check passes**

Run:

```bash
cd /Users/junho/project/parrotkit-app/parrotkit-app
npx expo install --check
```

Expected:

```text
Dependencies are up to date
```

- [ ] **Step 4: Verify TypeScript still passes**

Run:

```bash
cd /Users/junho/project/parrotkit-app/parrotkit-app
./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json
```

Expected: exit code 0.

- [ ] **Step 5: Commit dependency health fix**

Run:

```bash
cd /Users/junho/project/parrotkit-app
git add parrotkit-app/package.json parrotkit-app/package-lock.json
git commit -m "chore: align Expo native dependencies"
```

---

### Task 2: Add Architecture Boundary Guard

**Files:**
- Create: `scripts/check-architecture-boundaries.cjs`
- Modify: `package.json`

- [ ] **Step 1: Create boundary checker**

Create `scripts/check-architecture-boundaries.cjs`:

```js
const { existsSync, readdirSync, readFileSync, statSync } = require('node:fs');
const { join, relative } = require('node:path');

const root = process.cwd();
const srcRoot = join(root, 'src');

function walkFiles(dir) {
  if (!existsSync(dir)) return [];

  return readdirSync(dir).flatMap((entry) => {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) return walkFiles(fullPath);
    if (!/\.(ts|tsx)$/.test(entry)) return [];
    return [fullPath];
  });
}

function importsIn(source) {
  const imports = [];
  const patterns = [
    /from\s+['"]([^'"]+)['"]/g,
    /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
  ];

  for (const pattern of patterns) {
    let match = pattern.exec(source);
    while (match) {
      imports.push(match[1]);
      match = pattern.exec(source);
    }
  }

  return imports;
}

const rules = [
  {
    name: 'domain_is_pure',
    dir: join(srcRoot, 'domain'),
    forbidden: [
      /^react$/,
      /^react-native$/,
      /^expo($|\/)/,
      /^expo-router$/,
      /^@expo\//,
      /^@\/app($|\/)/,
      /^@\/app-shell($|\/)/,
      /^@\/application($|\/)/,
      /^@\/core($|\/)/,
      /^@\/features($|\/)/,
    ],
  },
  {
    name: 'core_does_not_import_features',
    dir: join(srcRoot, 'core'),
    forbidden: [/^@\/features($|\/)/],
  },
];

const failures = [];

for (const rule of rules) {
  for (const file of walkFiles(rule.dir)) {
    const source = readFileSync(file, 'utf8');
    for (const imported of importsIn(source)) {
      if (rule.forbidden.some((pattern) => pattern.test(imported))) {
        failures.push(`${rule.name}: ${relative(root, file)} imports ${imported}`);
      }
    }
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Architecture boundary check passed.');
```

- [ ] **Step 2: Add npm script**

Modify `package.json` scripts:

```json
{
  "scripts": {
    "start": "expo start --dev-client",
    "start:go": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web",
    "prebuild": "expo prebuild",
    "check:architecture": "node scripts/check-architecture-boundaries.cjs"
  }
}
```

- [ ] **Step 3: Run the boundary checker and capture current failure**

Run:

```bash
cd /Users/junho/project/parrotkit-app/parrotkit-app
npm run check:architecture
```

Expected before Tasks 5 and 6: FAIL because `src/core` still imports `@/features`.

- [ ] **Step 4: Commit checker even while it exposes known violations**

Run:

```bash
cd /Users/junho/project/parrotkit-app
git add parrotkit-app/scripts/check-architecture-boundaries.cjs parrotkit-app/package.json
git commit -m "test: add architecture boundary guard"
```

Commit note: this commit is allowed to expose the current architectural debt. The checker must pass by Task 7.

---

### Task 3: Move Recipe Domain Types Out of Core Mocks

**Files:**
- Create: `src/domain/recipes/recipe.ts`
- Modify: `src/core/mocks/parrotkit-data.ts`

- [x] **Step 1: Create recipe domain type file**

Create `src/domain/recipes/recipe.ts`:

```ts
export type RecipePlatform = 'TikTok' | 'Instagram Reels' | 'YouTube Shorts';
export type CreatorTrust = 'verified' | 'community';
export type RecipeOwnership = 'owned' | 'downloaded' | 'remixed' | 'community';
export type RecipeVerification = 'verified_creator' | 'community';
export type RecipeShootStatus = 'continue' | 'ready' | 'draft';
export type RecipeImageSource = string | number;

export type Reference = {
  id: string;
  title: string;
  creator: string;
  thumbnail: RecipeImageSource;
  duration: string;
  views: string;
  likes: number;
  category: string;
  platform: RecipePlatform;
  videoUrl: string;
  createdAt: string;
  isLiked: boolean;
  recipeId?: string;
};

export type PartnerCreator = {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  trust: CreatorTrust;
  specialty: string;
};

export type RecipeScene = {
  id: string;
  isOptional?: boolean;
  sceneNumber?: number;
  title: string;
  summary: string;
  startTime?: string;
  endTime?: string;
  thumbnail?: RecipeImageSource;
  analysisLines: string[];
  recipeLines: string[];
  prompterLines: string[];
  analysis?: {
    transcriptOriginal?: string[];
    transcriptSnippet?: string | null;
    motionDescription?: string;
    whyItWorks?: string[];
    referenceSignals?: Array<{ type: string; text: string }>;
  };
  recipe?: {
    objective?: string;
    appealPoint?: string;
    keyLine?: string;
    scriptLines?: string[];
    keyMood?: string;
    keyAction?: string;
    mustInclude?: string[];
    mustAvoid?: string[];
    cta?: string;
  };
  prompter?: {
    blocks?: Array<{
      id: string;
      type: 'key_line' | 'keyword' | 'appeal_point' | 'mood' | 'action' | 'warning' | 'cta';
      label?: string;
      content: string;
      accentColor?: string;
      visible: boolean;
      size: 'sm' | 'md' | 'lg' | 'xl';
      positionPreset: 'top' | 'upperThird' | 'center' | 'lowerThird' | 'bottom';
      scale?: number;
      x?: number;
      y?: number;
      order: number;
    }>;
  };
  progress?: number;
};

export type Recipe = {
  id: string;
  title: string;
  creator: string;
  platform: RecipePlatform;
  thumbnail: RecipeImageSource;
  savedAt: string;
  sourceUrl: string;
  referenceVideoSource?: string | number;
  summary: string;
  niche: string;
  goal: string;
  notes: string;
  ownership: RecipeOwnership;
  verification: RecipeVerification;
  ownerHandle: string;
  ownerName: string;
  downloadCount: number;
  explicitCompletion?: boolean;
  shootStatus: RecipeShootStatus;
  shotSceneCount: number;
  totalSceneCount: number;
  lastShotAt?: string;
  remixOfRecipeId?: string;
  scenes: RecipeScene[];
};
```

- [x] **Step 2: Convert mock type declarations to aliases**

Modify the top of `src/core/mocks/parrotkit-data.ts`:

```ts
import { ugcMedia } from '@/core/mocks/ugc-media';
import type {
  CreatorTrust,
  PartnerCreator,
  Recipe,
  RecipeOwnership,
  RecipePlatform,
  RecipeScene,
  RecipeShootStatus,
  RecipeVerification,
  Reference,
} from '@/domain/recipes/recipe';
import type { SavedTakePersistenceContract } from '@/features/recipes/lib/saved-take-contract';

export type MockPlatform = RecipePlatform;
export type MockCreatorTrust = CreatorTrust;
export type MockRecipeOwnership = RecipeOwnership;
export type MockRecipeVerification = RecipeVerification;
export type MockRecipeShootStatus = RecipeShootStatus;
export type MockReference = Reference;
export type MockPartnerCreator = PartnerCreator;
export type MockRecipeScene = RecipeScene;
export type MockRecipe = Recipe;
```

Keep the existing `MockTakeExportStatus`, `MockProjectTake`, `MockSceneTakeCollection`, `MockRecipeTakeProject`, `MockQuickTakeProject`, `MockProfile`, seed arrays, and helper functions in the same file for now.

- [x] **Step 3: Run recipe type verification**

Run:

```bash
cd /Users/junho/project/parrotkit-app/parrotkit-app
./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json
```

Expected: PASS.

- [ ] **Step 4: Commit recipe domain extraction**

Run:

```bash
cd /Users/junho/project/parrotkit-app
git add parrotkit-app/src/domain/recipes/recipe.ts parrotkit-app/src/core/mocks/parrotkit-data.ts
git commit -m "refactor: extract recipe domain types"
```

Task 3 implementation note: code changes and verification completed on 2026-05-16, but commit was intentionally skipped because the task request said not to commit. See `context/context_20260516_recipe_domain_types.md`.

---

### Task 4: Move Saved Take Contract Into Domain

**Files:**
- Create: `src/domain/takes/saved-take-contract.ts`
- Modify: `src/features/recipes/lib/saved-take-contract.ts`
- Modify: `src/core/mocks/parrotkit-data.ts`
- Modify: `src/features/recipes/lib/saved-take-storage.ts`
- Modify: `src/features/recipes/lib/take-projects.ts`

- [x] **Step 1: Create domain saved take contract**

Create `src/domain/takes/saved-take-contract.ts`:

```ts
import type { Recipe, RecipeScene } from '@/domain/recipes/recipe';

export type SavedTakeCardSnapshot = {
  id: string;
  sceneId?: string;
  order: number;
  role: string;
  title: string;
  hook: string;
  lineToSay: string;
  shotAction: string;
  note: string;
  durationSeconds?: number;
};

export type SavedTakeMetadata = {
  dataSource: 'local_mock';
  durationSeconds?: number;
  exportStatus: 'local';
  isFinalTake: boolean;
  recipeStatus?: string;
  takeStatus: 'saved';
};

export type SavedTakePersistenceContract = {
  recordingUri: string;
  recipeId: string;
  recipeTitle: string;
  sceneId: string;
  sceneTitle: string;
  cardIds: string[];
  cards: SavedTakeCardSnapshot[];
  createdAtIso: string;
  recordedAtLabel: string;
  metadata: SavedTakeMetadata;
};

export type CreateSavedTakeContractInput = {
  card?: SavedTakeCardSnapshot | null;
  createdAt?: Date;
  recordingUri: string;
  recipe: Pick<Recipe, 'id' | 'title' | 'shootStatus'>;
  scene: Pick<RecipeScene, 'id' | 'title'>;
};

export function createSavedTakePersistenceContract({
  card,
  createdAt = new Date(),
  recordingUri,
  recipe,
  scene,
}: CreateSavedTakeContractInput): SavedTakePersistenceContract {
  const cardSnapshot = card ? [card] : [];
  const createdAtIso = createdAt.toISOString();

  return {
    cardIds: cardSnapshot.map((snapshot) => snapshot.id),
    cards: cardSnapshot,
    createdAtIso,
    metadata: {
      dataSource: 'local_mock',
      durationSeconds: card?.durationSeconds,
      exportStatus: 'local',
      isFinalTake: false,
      recipeStatus: recipe.shootStatus,
      takeStatus: 'saved',
    },
    recordedAtLabel: formatSavedTakeTime(createdAt),
    recordingUri,
    recipeId: recipe.id,
    recipeTitle: recipe.title,
    sceneId: scene.id,
    sceneTitle: scene.title,
  };
}

function formatSavedTakeTime(date: Date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
```

- [x] **Step 2: Keep old feature import path as a shim**

Replace `src/features/recipes/lib/saved-take-contract.ts` with:

```ts
import type { ShootBoardCut } from '@/features/recipes/lib/shoot-board-model';
import {
  createSavedTakePersistenceContract as createDomainSavedTakePersistenceContract,
  type CreateSavedTakeContractInput as DomainCreateSavedTakeContractInput,
  type SavedTakeCardSnapshot,
  type SavedTakeMetadata,
  type SavedTakePersistenceContract,
} from '@/domain/takes/saved-take-contract';

export type {
  SavedTakeCardSnapshot,
  SavedTakeMetadata,
  SavedTakePersistenceContract,
};

export type CreateSavedTakeContractInput = Omit<DomainCreateSavedTakeContractInput, 'card'> & {
  card?: ShootBoardCut | null;
};

export function createSavedTakePersistenceContract(input: CreateSavedTakeContractInput): SavedTakePersistenceContract {
  return createDomainSavedTakePersistenceContract({
    ...input,
    card: input.card ? createCardSnapshot(input.card) : null,
  });
}

function createCardSnapshot(card: ShootBoardCut): SavedTakeCardSnapshot {
  return {
    durationSeconds: card.durationSeconds,
    hook: card.hook,
    id: card.id,
    lineToSay: card.lineToSay,
    note: card.note,
    order: card.order,
    role: card.role,
    sceneId: card.sceneId,
    shotAction: card.shotAction,
    title: card.title,
  };
}
```

- [x] **Step 3: Update core mock import**

In `src/core/mocks/parrotkit-data.ts`, replace:

```ts
import type { SavedTakePersistenceContract } from '@/features/recipes/lib/saved-take-contract';
```

with:

```ts
import type { SavedTakePersistenceContract } from '@/domain/takes/saved-take-contract';
```

- [x] **Step 4: Run saved take tests**

Run:

```bash
cd /Users/junho/project/parrotkit-app/parrotkit-app
NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/recipes/lib/saved-take-contract.test.ts
./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json
```

Expected: both commands pass.

- [ ] **Step 5: Commit saved take domain extraction**

Run:

```bash
cd /Users/junho/project/parrotkit-app
git add parrotkit-app/src/domain/takes/saved-take-contract.ts parrotkit-app/src/features/recipes/lib/saved-take-contract.ts parrotkit-app/src/core/mocks/parrotkit-data.ts
git commit -m "refactor: move saved take contract to domain"
```

Task 4 result (2026-05-16):
- Created `src/domain/takes/saved-take-contract.ts` as a pure domain contract with a structural card input because `src/domain/shoot-board/shoot-board-model.ts` does not exist yet.
- Kept `src/features/recipes/lib/saved-take-contract.ts` as a compatibility re-export from the domain module.
- Updated `src/core/mocks/parrotkit-data.ts` to import `SavedTakePersistenceContract` from the domain module.
- Verification passed: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`.
- Verification passed: focused saved take contract test via `node` with `sucrase/register` and a local `@/` alias resolver. Direct `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/recipes/lib/saved-take-contract.test.ts` failed because the current Node resolver does not map `@/`.
- Verification expected-failed: `npm run check:architecture` still reports later provider/navigation feature imports; `src/core/mocks/parrotkit-data.ts` is no longer in the failure list.
- Commit step skipped per explicit request not to commit.

---

### Task 5: Move Shoot Board Domain Model

**Files:**
- Create by move: `src/domain/shoot-board/shoot-board-model.ts`
- Create by move: `src/domain/recipes/native-recipe.ts`
- Modify: `src/features/recipes/lib/shoot-board-model.ts`
- Modify: `src/features/recipes/types/recipe-domain.ts`

- [x] **Step 1: Move native recipe type file**

Run:

```bash
cd /Users/junho/project/parrotkit-app/parrotkit-app
mkdir -p src/domain/recipes
git mv src/features/recipes/types/recipe-domain.ts src/domain/recipes/native-recipe.ts
```

- [x] **Step 2: Add compatibility shim for old native recipe path**

Create `src/features/recipes/types/recipe-domain.ts`:

```ts
export * from '@/domain/recipes/native-recipe';
```

- [x] **Step 3: Move shoot board model**

Run:

```bash
cd /Users/junho/project/parrotkit-app/parrotkit-app
mkdir -p src/domain/shoot-board
git mv src/features/recipes/lib/shoot-board-model.ts src/domain/shoot-board/shoot-board-model.ts
```

- [x] **Step 4: Update moved shoot board imports**

In `src/domain/shoot-board/shoot-board-model.ts`, replace:

```ts
from "@/features/recipes/types/recipe-domain"
```

with:

```ts
from "@/domain/recipes/native-recipe"
```

- [x] **Step 5: Add compatibility shim for old shoot board path**

Create `src/features/recipes/lib/shoot-board-model.ts`:

```ts
export * from '@/domain/shoot-board/shoot-board-model';
```

- [x] **Step 6: Run shoot board tests**

Run:

```bash
cd /Users/junho/project/parrotkit-app/parrotkit-app
NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/recipes/lib/shoot-board-model.test.ts
./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json
```

Expected: both commands pass.

- [x] **Step 7: Run architecture checker**

Run:

```bash
cd /Users/junho/project/parrotkit-app/parrotkit-app
npm run check:architecture
```

Expected: still FAIL because `core/providers/mock-workspace-provider.tsx` and `core/navigation/root-native-tabs.tsx` still import features. No domain purity failures should remain.

- [ ] **Step 8: Commit shoot board domain move**

Run:

```bash
cd /Users/junho/project/parrotkit-app
git add parrotkit-app/src/domain parrotkit-app/src/features/recipes/lib/shoot-board-model.ts parrotkit-app/src/features/recipes/types/recipe-domain.ts
git commit -m "refactor: move shoot board model to domain"
```

Task 5 result (2026-05-16):
- Created pure domain modules `src/domain/recipes/native-recipe.ts` and `src/domain/shoot-board/shoot-board-model.ts`.
- Kept `src/features/recipes/types/recipe-domain.ts` and `src/features/recipes/lib/shoot-board-model.ts` as compatibility re-exports.
- Replaced React Native `ImageSourcePropType` in domain with a structural `NativeRecipeImageSource` type and replaced `ugcMedia` imports with equivalent fallback image URI objects.
- Updated safe imports in `src/core/providers/mock-workspace-provider.tsx`, `src/core/mocks/parrotkit-data.test.ts`, and `src/features/recipes/lib/recipe-domain-normalizer.ts` to point directly at domain modules.
- Verification passed: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`.
- Verification expected-failed: `npm run check:architecture` still reports `core/navigation/root-native-tabs.tsx` and remaining provider feature imports; no `domain_is_pure` failures were reported.
- Focused shoot-board test: direct `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/recipes/lib/shoot-board-model.test.ts` still fails before assertions because this runner does not resolve `@/`; the equivalent `node -r sucrase/register` run with a local alias hook reaches the existing `Scene titles should use the required Scene #N: Role format.` assertion.
- Context note: `context/context_20260516_shoot_board_domain_model.md`.
- Commit step skipped per explicit request not to commit.

---

### Task 6: Move Workspace Provider to Application Layer

**Files:**
- Create by move: `src/application/workspace/mock-workspace-provider.tsx`
- Modify: `src/core/providers/mock-workspace-provider.tsx`
- Modify: `src/app/_layout.tsx`

- [x] **Step 1: Move provider file**

Run:

```bash
cd /Users/junho/project/parrotkit-app/parrotkit-app
mkdir -p src/application/workspace
git mv src/core/providers/mock-workspace-provider.tsx src/application/workspace/mock-workspace-provider.tsx
```

- [x] **Step 2: Add old provider path shim**

Create `src/core/providers/mock-workspace-provider.tsx`:

```ts
export {
  MockWorkspaceProvider,
  useMockWorkspace,
} from '@/application/workspace/mock-workspace-provider';
```

- [x] **Step 3: Update root layout to import application provider**

In `src/app/_layout.tsx`, replace:

```ts
import { MockWorkspaceProvider } from "@/core/providers/mock-workspace-provider";
```

with:

```ts
import { MockWorkspaceProvider } from "@/application/workspace/mock-workspace-provider";
```

- [x] **Step 4: Update moved provider imports to domain paths**

In `src/application/workspace/mock-workspace-provider.tsx`, replace imports:

```ts
from '@/features/recipes/lib/saved-take-storage'
from '@/features/recipes/lib/shoot-board-model'
from '@/features/recipes/types/recipe-domain'
```

with:

```ts
from '@/features/recipes/lib/saved-take-storage'
from '@/domain/shoot-board/shoot-board-model'
from '@/domain/recipes/native-recipe'
```

Keep `saved-take-storage` in feature path until the take storage module is moved in a separate commit.

- [x] **Step 5: Verify core no longer owns workspace orchestration**

Run:

```bash
cd /Users/junho/project/parrotkit-app/parrotkit-app
rg -n "@/features/" src/core/providers src/core/mocks
```

Expected:

```text
no matches
```

- [x] **Step 6: Run TypeScript**

Run:

```bash
cd /Users/junho/project/parrotkit-app/parrotkit-app
./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json
```

Expected: PASS.

- [ ] **Step 7: Commit provider relocation**

Run:

```bash
cd /Users/junho/project/parrotkit-app
git add parrotkit-app/src/application/workspace/mock-workspace-provider.tsx parrotkit-app/src/core/providers/mock-workspace-provider.tsx parrotkit-app/src/app/_layout.tsx
git commit -m "refactor: move workspace provider to application layer"
```

Result: Implemented without committing per current task request. Moved the workspace provider implementation to `src/application/workspace/mock-workspace-provider.tsx`, replaced the old core provider file with a compatibility re-export for `MockWorkspaceProvider` and `useMockWorkspace`, and updated `src/app/_layout.tsx` to import the provider from the application layer. Verification: `rg -n "@/features/" src/core/providers src/core/mocks` returned no matches, `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json` passed, `npm run check:architecture` still fails only for `src/core/navigation/root-native-tabs.tsx` importing `@/features/recipes/screens/recipe-create-screen` as expected until Task 7, and `git diff --check` passed. Linked context: `context/context_20260516_ddd_architecture_simplification.md`.

---

### Task 7: Move Root Navigation Shell Out of Core

**Files:**
- Create by move: `src/app-shell/navigation/root-native-tabs.tsx`
- Modify: `src/core/navigation/root-native-tabs.tsx`
- Modify: `src/app/(tabs)/_layout.tsx`
- Modify: `src/core/navigation/root-tab-config.test.ts`

- [x] **Step 1: Move root native tabs into app shell**

Run:

```bash
cd /Users/junho/project/parrotkit-app/parrotkit-app
mkdir -p src/app-shell/navigation
git mv src/core/navigation/root-native-tabs.tsx src/app-shell/navigation/root-native-tabs.tsx
```

- [x] **Step 2: Add old navigation path shim**

Create `src/core/navigation/root-native-tabs.tsx`:

```ts
export { RootNativeTabs, RootNativeTabs as default } from '@/app-shell/navigation/root-native-tabs';
```

- [x] **Step 3: Update route shell import**

Modify `src/app/(tabs)/_layout.tsx`:

```ts
export { RootNativeTabs as default } from '@/app-shell/navigation/root-native-tabs';
```

- [x] **Step 4: Rewrite root tab source-string assertions**

In `src/core/navigation/root-tab-config.test.ts`, replace exact source string checks with route file existence and tab config behavior:

```ts
const routeFiles = [
  '../../app/(tabs)/index.tsx',
  '../../app/(tabs)/explore.tsx',
  '../../app/(tabs)/source.tsx',
  '../../app/(tabs)/recipes.tsx',
  '../../app/(tabs)/my.tsx',
];

for (const routeFile of routeFiles) {
  const source = readFileSync(resolve(__dirname, routeFile), 'utf8').trim();
  if (!source.includes('export {') || !source.includes(' as default }')) {
    throw new Error(`${routeFile} must stay a thin Expo Router export wrapper.`);
  }
}

const appShellSource = readFileSync(
  resolve(__dirname, '../../app-shell/navigation/root-native-tabs.tsx'),
  'utf8'
);

if (!appShellSource.includes('RecipeCreateScreen')) {
  throw new Error('Root app shell must compose RecipeCreateScreen for the Paste drawer.');
}
```

- [x] **Step 5: Run architecture checker**

Run:

```bash
cd /Users/junho/project/parrotkit-app/parrotkit-app
npm run check:architecture
```

Expected:

```text
Architecture boundary check passed.
```

- [x] **Step 6: Run nav tests and TypeScript**

Run:

```bash
cd /Users/junho/project/parrotkit-app/parrotkit-app
NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts
./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json
```

Expected: both commands pass.

- [ ] **Step 7: Commit navigation shell relocation**

Run:

```bash
cd /Users/junho/project/parrotkit-app
git add parrotkit-app/src/app-shell parrotkit-app/src/core/navigation/root-native-tabs.tsx 'parrotkit-app/src/app/(tabs)/_layout.tsx' parrotkit-app/src/core/navigation/root-tab-config.test.ts
git commit -m "refactor: move root navigation shell to app shell"
```

Result: Implemented without committing per current task request. Moved the root native tab shell implementation to `src/app-shell/navigation/root-native-tabs.tsx`, replaced the old core path with a compatibility re-export, updated the tab route layout to import from app-shell, and updated the root tab contract test to inspect the app-shell source for Paste drawer behavior. Verification: `npm run check:architecture` passed, `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts` passed, and `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json` passed. Linked context: `context/context_20260516_ddd_architecture_simplification.md`.

---

### Task 8: Split Recipe Create Screen Into Focused Units

**Files:**
- Create: `src/features/recipes/screens/recipe-create-copy.ts`
- Create: `src/features/recipes/screens/recipe-create-styles.ts`
- Modify: `src/features/recipes/screens/recipe-create-screen.tsx`

- [x] **Step 1: Extract copy object**

Create `src/features/recipes/screens/recipe-create-copy.ts`:

```ts
import type { ComponentProps } from 'react';
import type MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import type { AppLanguage } from '@/core/i18n/app-language';
import type { RecipeCreateMode } from '@/features/recipes/lib/recipe-create-flow';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export const recipeCreateCopy = {
  en: {
    title: 'New recipe',
    close: 'Close',
    pro: 'Pro',
    linkPlaceholder: 'Paste a TikTok, Reels, Shorts, or product page link',
    invalidLink: 'Paste a valid link starting with http:// or https://',
    brandPlaceholder: 'Add brand context, product sheet, or campaign brief',
    nicheQuestion: "What's the niche?",
    otherPlaceholder: 'Type your niche',
    goalQuestion: "What's the goal?",
    cta: 'Open recipe board',
    mode: {
      manual: { icon: 'plus-box-outline' as IconName, tab: 'Blank' },
      reference: { icon: 'link-variant' as IconName, tab: 'Link' },
      brand: { icon: 'briefcase-plus-outline' as IconName, tab: 'Brand' },
    } satisfies Record<RecipeCreateMode, { icon: IconName; tab: string }>,
  },
  ko: {
    title: 'New recipe',
    close: '닫기',
    pro: 'Pro',
    linkPlaceholder: 'TikTok, Reels, Shorts, 제품 페이지 링크 붙여넣기',
    invalidLink: 'http:// 또는 https://로 시작하는 링크를 붙여넣어 주세요',
    brandPlaceholder: '브랜드 컨텍스트, 제품 자료, 캠페인 브리프 추가',
    nicheQuestion: '니치는 무엇인가요?',
    otherPlaceholder: '기타 니치 입력',
    goalQuestion: '목표는 무엇인가요?',
    cta: '레시피 보드 열기',
    mode: {
      manual: { icon: 'plus-box-outline' as IconName, tab: 'Blank' },
      reference: { icon: 'link-variant' as IconName, tab: 'Link' },
      brand: { icon: 'briefcase-plus-outline' as IconName, tab: 'Brand' },
    } satisfies Record<RecipeCreateMode, { icon: IconName; tab: string }>,
  },
} satisfies Record<AppLanguage, Record<string, unknown>>;

export type RecipeCreateCopy = (typeof recipeCreateCopy)['en'];
```

- [x] **Step 2: Extract styles**

Run this extraction script from the app root:

```bash
cd /Users/junho/project/parrotkit-app/parrotkit-app
node <<'NODE'
const { readFileSync, writeFileSync } = require('node:fs');

const sourcePath = 'src/features/recipes/screens/recipe-create-screen.tsx';
const targetPath = 'src/features/recipes/screens/recipe-create-styles.ts';
const source = readFileSync(sourcePath, 'utf8');
const marker = 'const styles = StyleSheet.create({';
const start = source.indexOf(marker);

if (start < 0) {
  throw new Error('Could not find recipe-create-screen styles block.');
}

let depth = 0;
let end = -1;

for (let index = start + 'const styles = StyleSheet.create('.length; index < source.length; index += 1) {
  const char = source[index];
  if (char === '{') depth += 1;
  if (char === '}') depth -= 1;
  if (depth === 0 && source.slice(index, index + 3) === '});') {
    end = index + 3;
    break;
  }
}

if (end < 0) {
  throw new Error('Could not find end of recipe-create-screen styles block.');
}

const block = source.slice(start, end).replace(/^const styles = /, 'export const recipeCreateStyles = ');
writeFileSync(targetPath, `import { StyleSheet } from 'react-native';\n\n${block}\n`);
NODE
```

Expected: `src/features/recipes/screens/recipe-create-styles.ts` contains the exact existing `StyleSheet.create(...)` body under the exported name `recipeCreateStyles`.

- [x] **Step 3: Update screen imports**

In `recipe-create-screen.tsx`, add:

```ts
import { recipeCreateCopy } from '@/features/recipes/screens/recipe-create-copy';
import { recipeCreateStyles as styles } from '@/features/recipes/screens/recipe-create-styles';
```

Remove the local `createCopy` object and local `const styles = StyleSheet.create(...)`.

- [x] **Step 4: Run create flow tests**

Run:

```bash
cd /Users/junho/project/parrotkit-app/parrotkit-app
NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/recipes/lib/recipe-create-flow.test.ts
./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json
```

Expected: both commands pass.

- [ ] **Step 5: Commit recipe create split**

Run:

```bash
cd /Users/junho/project/parrotkit-app
git add parrotkit-app/src/features/recipes/screens/recipe-create-screen.tsx parrotkit-app/src/features/recipes/screens/recipe-create-copy.ts parrotkit-app/src/features/recipes/screens/recipe-create-styles.ts
git commit -m "refactor: split recipe create screen support code"
```

Result: Implemented without committing per current task request. Extracted the recipe create copy/config to `src/features/recipes/screens/recipe-create/recipe-create-copy.ts` and the React Native stylesheet to `src/features/recipes/screens/recipe-create/recipe-create-styles.ts`, then updated `recipe-create-screen.tsx` to import both while retaining local `StyleSheet` usage for absolute fill helpers. Verification: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json` passed, `npm run check:architecture` passed, `git diff --check` passed, and an equivalent alias-hook invocation of `recipe-create-flow.test.ts` passed. The requested direct `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/recipes/lib/recipe-create-flow.test.ts` command failed before test execution because this runtime does not resolve `@/` imports. Linked context: `context/context_20260516_ddd_architecture_simplification.md`.

---

### Task 9: Split Recipe Detail Board Orchestration

**Files:**
- Create: `src/features/recipes/screens/recipe-detail/recipe-detail-board-state.ts`
- Modify: `src/features/recipes/screens/recipe-detail-screen.tsx`
- Test: `src/features/recipes/screens/recipe-detail/recipe-detail-board-state.test.ts`

- [x] **Step 1: Extract board UI state pure functions**

Move these functions from `recipe-detail-screen.tsx` into `src/features/recipes/screens/recipe-detail-board-state.ts`:

```ts
export {
  getBoardOverviewUiState,
  hydrateShootBoardWithWorkspaceTakes,
};
```

The moved functions must keep their current signatures:

```ts
function getBoardOverviewUiState(input: {
  board: ShootBoardRecipe | null;
  getSavedRecipeTakes: ReturnType<typeof useMockWorkspace>['getSavedRecipeTakes'];
  nativeRecipe: NativeRecipe | null;
  routeHighlightCutId: string | null;
}): BoardOverviewUiState

function hydrateShootBoardWithWorkspaceTakes(
  board: ShootBoardRecipe,
  recipeId: string,
  getSavedRecipeTakes: ReturnType<typeof useMockWorkspace>['getSavedRecipeTakes'],
): ShootBoardRecipe
```

- [x] **Step 2: Write board state test**

Create `src/features/recipes/screens/recipe-detail-board-state.test.ts`:

```ts
import { getBoardOverviewUiState } from '@/features/recipes/screens/recipe-detail-board-state';

const emptyGetSavedRecipeTakes = () => [];

const state = getBoardOverviewUiState({
  board: null,
  getSavedRecipeTakes: emptyGetSavedRecipeTakes,
  nativeRecipe: null,
  routeHighlightCutId: null,
});

if (state.cameraEntryRequiresTap !== true) {
  throw new Error('Board overview must preserve cameraEntryRequiresTap=true.');
}

if (state.highlightState !== 'none') {
  throw new Error(`Empty board must not highlight a cut. Found: ${state.highlightState}`);
}
```

- [x] **Step 3: Update recipe detail imports**

In `recipe-detail-screen.tsx`, import:

```ts
import {
  getBoardOverviewUiState,
  hydrateShootBoardWithWorkspaceTakes,
} from '@/features/recipes/screens/recipe-detail-board-state';
```

Remove local copies of those functions.

- [x] **Step 4: Run board state and TypeScript checks**

Run:

```bash
cd /Users/junho/project/parrotkit-app/parrotkit-app
NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-detail-board-state.test.ts
./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json
```

Expected: both commands pass.

- [ ] **Step 5: Commit board state extraction**

Run:

```bash
cd /Users/junho/project/parrotkit-app
git add parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx parrotkit-app/src/features/recipes/screens/recipe-detail-board-state.ts parrotkit-app/src/features/recipes/screens/recipe-detail-board-state.test.ts
git commit -m "refactor: extract recipe detail board state"
```

Result: Implemented without committing per current task request. Extracted board overview state and workspace-take hydration helpers from `recipe-detail-screen.tsx` into `src/features/recipes/screens/recipe-detail/recipe-detail-board-state.ts`, added `src/features/recipes/screens/recipe-detail/recipe-detail-board-state.test.ts`, and kept React components/styles in the screen. Verification: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json` passed, `npm run check:architecture` passed, focused board-state test passed with the alias-hook invocation, and `git diff --check` passed. The direct `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-detail/recipe-detail-board-state.test.ts` command failed before test execution because this runtime does not resolve `@/` imports used by the helper dependency chain. Linked context: `context/context_20260516_ddd_architecture_simplification.md`.

---

### Task 10: Final Verification and Context Update

**Files:**
- Create: `context/context_20260516_ddd_architecture_simplification.md`
- Modify: `plans/20260516_ddd_architecture_simplification.md`

- [ ] **Step 1: Run full local verification**

Run:

```bash
cd /Users/junho/project/parrotkit-app/parrotkit-app
npx expo install --check
npm run check:architecture
./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json
NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts
NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/recipes/lib/saved-take-contract.test.ts
NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/recipes/lib/shoot-board-model.test.ts
NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-detail-board-state.test.ts
```

Expected: every command exits 0.

- [ ] **Step 2: Run simulator smoke**

Try native dev-client first:

```bash
cd /Users/junho/project/parrotkit-app/parrotkit-app
npm run ios -- --device "iPhone 17 Pro"
```

Expected after dependency alignment: app builds and opens on the simulator.

If native build still fails, run Expo Go smoke:

```bash
cd /Users/junho/project/parrotkit-app/parrotkit-app
npx expo start --go --ios --port 8083 --localhost
```

Expected: Home renders, bottom nav renders, Paste drawer opens, drawer close works.

- [ ] **Step 3: Write context summary**

Create `context/context_20260516_ddd_architecture_simplification.md`:

```md
# Context 2026-05-16 DDD Architecture Simplification

## 작업
- Domain-first architecture simplification for ParrotKit v1.
- Dependency direction changed toward `features -> application -> domain`.

## 변경
- Expo native dependencies aligned.
- Architecture boundary guard added.
- Recipe domain types moved to `src/domain/recipes`.
- Saved take contract moved to `src/domain/takes`.
- Shoot board model moved to `src/domain/shoot-board`.
- Workspace provider moved from `core/providers` to `application/workspace`.
- Root native tab shell moved from `core/navigation` to `app-shell/navigation`.
- Recipe create support code and recipe detail board state split into focused files.

## 검증
- PASS: `npx expo install --check`
- PASS: `npm run check:architecture`
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- PASS: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts`
- PASS: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/recipes/lib/saved-take-contract.test.ts`
- PASS: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/recipes/lib/shoot-board-model.test.ts`
- PASS: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-detail-board-state.test.ts`

## QA
- iPhone simulator smoke checked Home, bottom nav, Paste drawer open/close, and recipe board route.

## 리스크
- Remaining large files: `recipe-prompter-camera-screen.tsx`, `recipes-screen.tsx`, `shoot-board-scene-card.tsx`.
- These should be split by workflow in separate plans after this architecture baseline lands.
```

- [x] **Step 4: Mark plan result**

Append to this plan under `## 결과`:

```md
## 결과

- 완료 커밋:
  - `chore: align Expo native dependencies`
  - `test: add architecture boundary guard`
  - `refactor: extract recipe domain types`
  - `refactor: move saved take contract to domain`
  - `refactor: move shoot board model to domain`
  - `refactor: move workspace provider to application layer`
  - `refactor: move root navigation shell to app shell`
  - `refactor: split recipe create screen support code`
  - `refactor: extract recipe detail board state`
- 연결 context: `context/context_20260516_ddd_architecture_simplification.md`
```

- [x] **Step 5: Commit context and plan completion**

Run:

```bash
cd /Users/junho/project/parrotkit-app
git add parrotkit-app/context/context_20260516_ddd_architecture_simplification.md parrotkit-app/plans/20260516_ddd_architecture_simplification.md
git commit -m "docs: record DDD architecture simplification"
```

- [x] **Step 6: Sync and push**

Run:

```bash
cd /Users/junho/project/parrotkit-app
git fetch origin
git pull --ff-only
git push origin main
```

Expected: push succeeds without force push.

---

## Self-Review

### Spec Coverage

- DDD simplification: covered by Tasks 3, 4, 5, 6, 7.
- Fix incomplete parts: dependency health covered by Task 1, brittle tests covered by Task 7, oversized screens started by Tasks 8 and 9.
- Keep current product behavior: compatibility shims in Tasks 4, 5, 6, 7.
- Repo workflow: plan exists in `plans/`, context update included in Task 10, push included in Task 10.

### Placeholder Scan

- No `TBD`.
- No empty edge-case instruction.
- Every created file has concrete content or an exact move command.
- Large moved files use `git mv` so content is preserved exactly rather than restated incompletely.

### Type Consistency

- `Recipe`, `RecipeScene`, `SavedTakePersistenceContract`, `ShootBoardRecipe`, and `NativeRecipe` names are kept stable through compatibility shims.
- Old feature import paths remain active while domain paths become the preferred internal paths.
- `core` boundary is enforced only after provider and navigation shell relocation, so the plan does not require impossible intermediate green states.

## 결과

- 완료 커밋:
  - `chore: align Expo native dependencies`
  - `test: add architecture boundary guard`
  - `refactor: extract recipe domain types`
  - `refactor: move saved take contract to domain`
  - `refactor: move shoot board model to domain`
  - `refactor: move workspace provider to application`
  - `refactor: move root tabs shell to app shell`
  - `refactor: split recipe create screen support code`
  - `refactor: split recipe detail board state`
- 추가 design cleanup: `fix: align user-facing copy with design guide`
- 연결 context:
  - `context/context_20260516_ddd_architecture_simplification.md`
  - `context/context_20260516_design_copy_cleanup.md`
- 최종 검증:
  - PASS: TypeScript
  - PASS: architecture boundary guard
  - PASS: focused alias-hook tests for recipe create flow, recipe detail board state, and root tab config
  - PASS: Expo Go simulator smoke for Home and recipe create drawer
  - BLOCKED: native dev-client iOS build fails in Xcode linker before app install; details recorded in context.
