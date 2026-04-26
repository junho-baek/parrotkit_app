# ParrotKit App Web Recipe Parity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the native app recipe experience so it matches the web product model: scene cards first, per-scene Analysis and Recipe layers, selectable Recipe cue elements, and a native Shooting/Prompter surface that shows only selected elements.

**Architecture:** Keep the web `RecipeScene` contract as the product source of truth and add a native app adapter that can normalize current mock recipes into the same layered shape. Replace the app's console-like detail screen with scene-first surfaces: a compact scene rail/list, a focused scene workspace, a Recipe cue picker, and a camera prompter that consumes selected `prompter.blocks`.

**Tech Stack:** Expo Router, React Native 0.81, Expo Camera, NativeWind, TypeScript 5.9, current mock workspace provider state.

---

## Web Feature Analysis

The web implementation is centered on `RecipeResult` and the shared recipe domain in `src/types/recipe.ts`.

### Source Of Truth Data Model

`src/types/recipe.ts` defines `RecipeScene` as the core unit. Each scene contains:

- `analysis`: original reference layer with `transcriptOriginal`, `transcriptSnippet`, `motionDescription`, `whyItWorks`, and legacy `referenceSignals`.
- `recipe`: execution layer with `objective`, `appealPoint`, `keyLine`, `scriptLines`, `keyMood`, `keyAction`, `mustInclude`, `mustAvoid`, and optional `cta`.
- `prompter.blocks`: shooting layer with selectable/editable cue blocks. Each block has `id`, `type`, `label`, `content`, `visible`, `size`, `positionPreset`, `scale`, `x`, `y`, and `order`.

The product rule in `src/AGENTS.md` is explicit: ParrotKit is not a video summary tool. The flow is `원본 분석 -> 레시피 -> 촬영 실행`. The app must preserve those layers instead of flattening everything into summary cards.

### Web Recipe Generation Flow

`src/app/api/analyze/route.ts` builds scenes in three phases:

1. Detect scene boundaries and thumbnails.
2. Ask AI to design short-form creator recipe scenes with `why_it_works`, `objective`, `appeal_point`, `key_line`, `script_lines`, `key_mood`, `key_action`, `must_include`, `must_avoid`, `cta`, and `prompter_blocks`.
3. Normalize each item through `normalizeRecipeScene`.

`src/components/auth/URLInputForm.tsx` saves the analyzed result into `/api/recipes`, writes a `recipeData` session object, and routes to `/home?view=recipe&recipeId=...`.

`src/components/auth/DashboardContent.tsx` rehydrates saved recipes from `/api/recipes/:id`, normalizes scenes with `normalizeRecipeScenes`, and renders:

```tsx
<RecipeResult
  scenes={recipeData.scenes}
  videoUrl={recipeData.videoUrl}
  recipeId={recipeData.recipeId}
  initialCapturedVideos={recipeData.capturedVideos}
  initialMatchResults={recipeData.matchResults}
  brandBrief={recipeData.brandBrief}
  analysisMetadata={recipeData.analysisMetadata}
/>
```

### Web Recipe Result Flow

`src/components/common/RecipeResult.tsx` has two states:

- Recipe overview: vertical list of scene cards with thumbnail, scene title, stage/pattern metadata, time range, capture state, and open affordance.
- Selected scene workspace: full-screen scene detail with three tabs.

The selected scene tabs are:

- `analysis`: plays the reference video segment through `RecipeVideoPlayer` and opens a sheet for original script, motion view, and benchmarking points.
- `recipe`: shows the prompter block editor as a two-column cue board. Tapping toggles whether a cue appears in the prompter. Double-click edits text. Color dot cycles cue accent. Plus adds a custom cue. Dragging to trash hides or removes a cue.
- `prompter`, labeled `Shooting`: embeds `CameraShooting`, which opens the camera and overlays only `prompter.blocks` where `visible === true`.

The important point: the web "Recipe" tab is not just a read-only script summary. It is the place where the creator chooses the exact elements that will appear while shooting.

### Web Prompter Flow

`src/components/common/CameraShooting.tsx` consumes `PrompterBlock[]`, filters to visible blocks, and renders them directly on the camera preview. It also supports:

- adding custom blocks;
- toggling cue visibility;
- dragging blocks on the camera;
- resizing with scale;
- changing color accents;
- editing block text inline;
- review and save of captured takes.

The native app should not copy every web editing affordance in the first pass, but it must preserve the contract: `Recipe` chooses visible blocks, and `Shooting` shows those selected blocks.

## Current Native App Gap Analysis

### Current App Data Model

`parrotkit-app/src/core/mocks/parrotkit-data.ts` currently defines `MockRecipeScene` as:

```ts
export type MockRecipeScene = {
  id: string;
  title: string;
  summary: string;
  analysisLines: string[];
  recipeLines: string[];
  prompterLines: string[];
};
```

This loses the web's product layers:

- no `startTime`, `endTime`, or scene thumbnail;
- no separate `analysis.motionDescription`, `analysis.whyItWorks`, `analysis.transcriptOriginal`;
- no `recipe.objective`, `recipe.appealPoint`, `recipe.keyLine`, `recipe.keyAction`, `mustInclude`, `mustAvoid`, `cta`;
- no `prompter.blocks` metadata for visibility, size, position, color, order, and cue type.

### Current App Recipe Detail

`parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx` has the right high-level tab names, but the UX is not equivalent:

- top summary cards and metadata feel like an operations dashboard;
- `analysis` and `recipe` tabs render all scenes as read-only cards;
- the `prompter` tab is separated from the `recipe` tab, so the user's mental model becomes "open a prompter planner" instead of "choose what goes into this scene's shooting overlay";
- cue selection derives from `recipeLines` and `prompterLines`, not first-class `prompter.blocks`;
- scene selection only exists inside the prompter planner, not as the primary recipe workspace.

### Current App Prompter Camera

`parrotkit-app/src/features/recipes/screens/recipe-prompter-camera-screen.tsx` does open a native camera and display selected elements. That is the strongest piece to preserve. The gap is that it displays `MockPrompterElement` cards generated from flat strings rather than web-compatible `PrompterBlock`s, and the bottom panel still reads like a control console (`Show On Camera`, selected counts, labels) instead of a lightweight shooting surface.

## Target Product Shape

The native app should become:

1. Recipes tab: list saved recipes, then open a recipe.
2. Recipe detail: show the recipe as a scene sequence, not a dashboard.
3. Scene workspace: each scene opens into a focused screen or modal with tabs:
   - `Analysis`: original reference evidence.
   - `Recipe`: execution instructions and selectable cue blocks for shooting.
   - `Shoot`: native camera prompter.
4. Recipe tab: selectable cue cards use web-compatible `PrompterBlock.visible` as the selection state.
5. Shooting view: show only visible blocks from the active scene, with scene switching and minimal controls.

## File Structure

### Create

- `parrotkit-app/src/features/recipes/types/recipe-domain.ts`
  - Native copy of the web recipe domain types needed by the app.
  - Keeps the app independent while matching the web payload shape.

- `parrotkit-app/src/features/recipes/lib/recipe-domain-normalizer.ts`
  - Converts legacy `MockRecipe` and future API payloads into `NativeRecipe`.
  - Provides helpers for default `PrompterBlock`s and selectable recipe elements.

- `parrotkit-app/src/features/recipes/components/scene-sequence-rail.tsx`
  - Horizontal scene cards with thumbnail/title/time/capture hint.

- `parrotkit-app/src/features/recipes/components/scene-analysis-panel.tsx`
  - Displays transcript, motion view, and why-it-works bullets.

- `parrotkit-app/src/features/recipes/components/scene-recipe-panel.tsx`
  - Displays execution recipe fields and selectable prompter block cards.

- `parrotkit-app/src/features/recipes/components/prompter-block-card.tsx`
  - Small cue card used by Recipe tab and Shooting bottom selector.

- `parrotkit-app/src/features/recipes/components/shooting-scene-switcher.tsx`
  - Compact scene switcher for the camera screen.

### Modify

- `parrotkit-app/src/core/mocks/parrotkit-data.ts`
  - Extend mock scenes to include web-compatible `startTime`, `endTime`, `thumbnail`, `analysis`, `recipe`, and `prompter`.
  - Keep legacy flat fields during migration.

- `parrotkit-app/src/core/providers/mock-workspace-provider.tsx`
  - Store prompter visibility as block visibility updates instead of separate flat element selections.
  - Keep compatibility wrappers during the transition.

- `parrotkit-app/src/features/recipes/lib/mock-prompter-elements.ts`
  - Replace flat line-derived elements with `PrompterBlock` helpers or turn this file into a compatibility wrapper over the new normalizer.

- `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`
  - Replace console-like summary/detail cards with scene-first web parity flow.

- `parrotkit-app/src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
  - Consume selected `PrompterBlock`s and simplify shooting UI.

- `parrotkit-app/src/features/recipes/screens/recipes-screen.tsx`
  - Reduce summary copy and make recipe tiles enter the scene workflow.

- `context/context_20260426_parrotkit_app_web_recipe_parity.md`
  - Record implementation summary and verification.

## Task 1: Add Native Recipe Domain Types

**Files:**
- Create: `parrotkit-app/src/features/recipes/types/recipe-domain.ts`

- [ ] **Step 1: Create the type file**

Add:

```ts
export type ReferenceSignalType =
  | 'hook'
  | 'pacing'
  | 'motion'
  | 'caption'
  | 'emotion'
  | 'product'
  | 'cta';

export type PrompterBlockType =
  | 'key_line'
  | 'keyword'
  | 'appeal_point'
  | 'mood'
  | 'action'
  | 'warning'
  | 'cta';

export type PrompterBlockSize = 'sm' | 'md' | 'lg' | 'xl';
export type PrompterPositionPreset = 'top' | 'upperThird' | 'center' | 'lowerThird' | 'bottom';

export type SceneReferenceSignal = {
  type: ReferenceSignalType;
  text: string;
};

export type SceneAnalysis = {
  transcriptOriginal?: string[];
  transcriptSnippet?: string | null;
  motionDescription?: string;
  whyItWorks: string[];
  referenceSignals: SceneReferenceSignal[];
};

export type SceneRecipePlan = {
  objective: string;
  appealPoint: string;
  keyLine: string;
  scriptLines: string[];
  keyMood: string;
  keyAction: string;
  mustInclude: string[];
  mustAvoid: string[];
  cta?: string;
};

export type PrompterBlock = {
  id: string;
  type: PrompterBlockType;
  label?: string;
  content: string;
  accentColor?: string;
  visible: boolean;
  size: PrompterBlockSize;
  positionPreset: PrompterPositionPreset;
  scale?: number;
  x?: number;
  y?: number;
  order: number;
};

export type ScenePrompter = {
  blocks: PrompterBlock[];
};

export type NativeRecipeScene = {
  id: string;
  sceneNumber: number;
  title: string;
  startTime: string;
  endTime: string;
  thumbnail: string;
  analysis: SceneAnalysis;
  recipe: SceneRecipePlan;
  prompter: ScenePrompter;
  progress?: number;
  summary?: string;
  analysisLines?: string[];
  recipeLines?: string[];
  prompterLines?: string[];
};

export type NativeRecipe = {
  id: string;
  title: string;
  creator: string;
  platform: 'TikTok' | 'Instagram Reels' | 'YouTube Shorts';
  thumbnail: string;
  savedAt: string;
  sourceUrl: string;
  summary: string;
  niche: string;
  goal: string;
  notes: string;
  scenes: NativeRecipeScene[];
};
```

- [ ] **Step 2: Run TypeScript**

Run:

```bash
cd parrotkit-app
npx tsc --noEmit
```

Expected: TypeScript either passes or reports existing unrelated missing type setup. This step should not introduce errors because the new file is not imported yet.

- [ ] **Step 3: Commit**

```bash
git add parrotkit-app/src/features/recipes/types/recipe-domain.ts
git commit -m "feat(app): add recipe domain types"
```

## Task 2: Add Web-Compatible Normalizer

**Files:**
- Create: `parrotkit-app/src/features/recipes/lib/recipe-domain-normalizer.ts`
- Modify: `parrotkit-app/src/features/recipes/lib/mock-prompter-elements.ts`

- [ ] **Step 1: Add the normalizer**

Create `recipe-domain-normalizer.ts`:

```ts
import { MockRecipe, MockRecipeScene } from '@/core/mocks/parrotkit-data';
import {
  NativeRecipe,
  NativeRecipeScene,
  PrompterBlock,
  PrompterBlockSize,
  PrompterPositionPreset,
} from '@/features/recipes/types/recipe-domain';

function compactText(value: unknown) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function normalizeStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [] as string[];
  }

  return value.map((item) => compactText(item)).filter(Boolean);
}

function normalizePrompterSize(value: unknown): PrompterBlockSize {
  const supported: PrompterBlockSize[] = ['sm', 'md', 'lg', 'xl'];
  const normalized = compactText(value) as PrompterBlockSize;
  return supported.includes(normalized) ? normalized : 'lg';
}

function normalizePrompterPosition(value: unknown): PrompterPositionPreset {
  const supported: PrompterPositionPreset[] = ['top', 'upperThird', 'center', 'lowerThird', 'bottom'];
  const normalized = compactText(value) as PrompterPositionPreset;
  return supported.includes(normalized) ? normalized : 'lowerThird';
}

function createDefaultBlocks(scene: MockRecipeScene): PrompterBlock[] {
  const recipeLines = normalizeStringArray(scene.recipeLines);
  const prompterLines = normalizeStringArray(scene.prompterLines);
  const keyLine = compactText(scene.recipe?.keyLine) || recipeLines[0] || compactText(scene.summary) || 'Open with the clearest cue.';
  const keyAction = compactText(scene.recipe?.keyAction) || recipeLines[1] || compactText(scene.summary) || 'Match the reference beat.';

  const baseBlocks: PrompterBlock[] = [
    {
      id: 'key-line',
      type: 'key_line',
      label: 'Main Script',
      content: keyLine,
      accentColor: 'blue',
      visible: true,
      size: 'xl',
      positionPreset: 'lowerThird',
      scale: 1,
      order: 1,
    },
    {
      id: 'action',
      type: 'action',
      label: 'Action',
      content: keyAction,
      accentColor: 'coral',
      visible: false,
      size: 'md',
      positionPreset: 'bottom',
      scale: 1,
      order: 2,
    },
  ];

  const cueBlocks = prompterLines.map((line, index) => ({
    id: `cue-${index + 1}`,
    type: 'keyword' as const,
    label: 'Cue',
    content: line,
    accentColor: 'pink',
    visible: true,
    size: 'md' as const,
    positionPreset: 'upperThird' as const,
    scale: 1,
    order: index + 3,
  }));

  return [...baseBlocks, ...cueBlocks].filter((block, index, blocks) => {
    const key = block.content.toLowerCase();
    return key.length > 0 && blocks.findIndex((candidate) => candidate.content.toLowerCase() === key) === index;
  });
}

export function normalizeNativeRecipeScene(scene: MockRecipeScene, index: number, recipeThumbnail: string): NativeRecipeScene {
  const sceneNumber = Number(scene.sceneNumber ?? index + 1);
  const analysisLines = normalizeStringArray(scene.analysisLines);
  const recipeLines = normalizeStringArray(scene.recipeLines);
  const prompterBlocks = Array.isArray(scene.prompter?.blocks) && scene.prompter.blocks.length > 0
    ? scene.prompter.blocks
        .map((block, blockIndex) => ({
          id: compactText(block.id) || `block-${blockIndex + 1}`,
          type: block.type || 'keyword',
          label: compactText(block.label) || undefined,
          content: compactText(block.content),
          accentColor: compactText(block.accentColor) || undefined,
          visible: block.visible !== false,
          size: normalizePrompterSize(block.size),
          positionPreset: normalizePrompterPosition(block.positionPreset),
          scale: Number.isFinite(Number(block.scale)) ? Number(block.scale) : 1,
          x: Number.isFinite(Number(block.x)) ? Number(block.x) : undefined,
          y: Number.isFinite(Number(block.y)) ? Number(block.y) : undefined,
          order: Number.isFinite(Number(block.order)) ? Number(block.order) : blockIndex + 1,
        }))
        .filter((block) => block.content.length > 0)
        .sort((left, right) => left.order - right.order)
    : createDefaultBlocks(scene);

  return {
    id: compactText(scene.id) || `scene-${sceneNumber}`,
    sceneNumber,
    title: compactText(scene.title) || `Scene ${sceneNumber}`,
    startTime: compactText(scene.startTime) || `00:${String(index * 5).padStart(2, '0')}`,
    endTime: compactText(scene.endTime) || `00:${String(index * 5 + 5).padStart(2, '0')}`,
    thumbnail: compactText(scene.thumbnail) || recipeThumbnail,
    analysis: {
      transcriptOriginal: normalizeStringArray(scene.analysis?.transcriptOriginal),
      transcriptSnippet: compactText(scene.analysis?.transcriptSnippet) || analysisLines[0] || null,
      motionDescription: compactText(scene.analysis?.motionDescription) || compactText(scene.summary),
      whyItWorks: normalizeStringArray(scene.analysis?.whyItWorks).length > 0
        ? normalizeStringArray(scene.analysis?.whyItWorks)
        : analysisLines,
      referenceSignals: Array.isArray(scene.analysis?.referenceSignals) ? scene.analysis.referenceSignals : [],
    },
    recipe: {
      objective: compactText(scene.recipe?.objective) || compactText(scene.summary),
      appealPoint: compactText(scene.recipe?.appealPoint) || compactText(scene.summary),
      keyLine: compactText(scene.recipe?.keyLine) || recipeLines[0] || prompterBlocks[0]?.content || '',
      scriptLines: normalizeStringArray(scene.recipe?.scriptLines).length > 0
        ? normalizeStringArray(scene.recipe?.scriptLines)
        : recipeLines,
      keyMood: compactText(scene.recipe?.keyMood) || 'Clear and direct',
      keyAction: compactText(scene.recipe?.keyAction) || recipeLines[1] || compactText(scene.summary),
      mustInclude: normalizeStringArray(scene.recipe?.mustInclude),
      mustAvoid: normalizeStringArray(scene.recipe?.mustAvoid),
      cta: compactText(scene.recipe?.cta),
    },
    prompter: {
      blocks: prompterBlocks,
    },
    progress: typeof scene.progress === 'number' ? scene.progress : 0,
    summary: scene.summary,
    analysisLines,
    recipeLines,
    prompterLines: normalizeStringArray(scene.prompterLines),
  };
}

export function normalizeNativeRecipe(recipe: MockRecipe): NativeRecipe {
  return {
    ...recipe,
    scenes: recipe.scenes.map((scene, index) => normalizeNativeRecipeScene(scene, index, recipe.thumbnail)),
  };
}

export function getVisiblePrompterBlocks(scene: NativeRecipeScene) {
  return scene.prompter.blocks
    .filter((block) => block.visible)
    .sort((left, right) => left.order - right.order);
}
```

- [ ] **Step 2: Replace `mock-prompter-elements.ts` with compatibility wrappers**

Replace the file content with:

```ts
import { MockRecipeScene } from '@/core/mocks/parrotkit-data';
import { normalizeNativeRecipeScene } from '@/features/recipes/lib/recipe-domain-normalizer';
import { PrompterBlock } from '@/features/recipes/types/recipe-domain';

export type MockPrompterElementKind = PrompterBlock['type'];

export type MockPrompterElement = {
  id: string;
  kind: MockPrompterElementKind;
  label: string;
  text: string;
  visible: boolean;
};

export function getScenePrompterElements(scene: MockRecipeScene): MockPrompterElement[] {
  const normalized = normalizeNativeRecipeScene(scene, 0, '');

  return normalized.prompter.blocks.map((block) => ({
    id: block.id,
    kind: block.type,
    label: block.label || block.type.replace(/_/g, ' '),
    text: block.content,
    visible: block.visible,
  }));
}

export function getDefaultPrompterSelection(scene: MockRecipeScene) {
  return getScenePrompterElements(scene)
    .filter((element) => element.visible)
    .map((element) => element.id);
}

export function getSelectedPrompterElements(scene: MockRecipeScene, selectedIds: string[]) {
  const selected = new Set(selectedIds);
  return getScenePrompterElements(scene).filter((element) => selected.has(element.id));
}
```

- [ ] **Step 3: Run TypeScript**

```bash
cd parrotkit-app
npx tsc --noEmit
```

Expected: imports resolve and no new type errors from the normalizer.

- [ ] **Step 4: Commit**

```bash
git add parrotkit-app/src/features/recipes/lib/recipe-domain-normalizer.ts parrotkit-app/src/features/recipes/lib/mock-prompter-elements.ts
git commit -m "feat(app): normalize recipes to web scene model"
```

## Task 3: Extend Mock Recipe Data To Match Web Scenes

**Files:**
- Modify: `parrotkit-app/src/core/mocks/parrotkit-data.ts`

- [ ] **Step 1: Extend the `MockRecipeScene` type**

Replace the current `MockRecipeScene` type with:

```ts
export type MockRecipeScene = {
  id: string;
  sceneNumber?: number;
  title: string;
  summary: string;
  startTime?: string;
  endTime?: string;
  thumbnail?: string;
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
```

- [ ] **Step 2: Upgrade the first seed scene**

For `recipe-korean-diet-hook` scene 1, add these fields:

```ts
sceneNumber: 1,
startTime: '00:00',
endTime: '00:05',
thumbnail: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80',
analysis: {
  transcriptOriginal: ['I stopped overthinking diet food and this is what finally stuck.'],
  transcriptSnippet: 'I stopped overthinking diet food and this is what finally stuck.',
  motionDescription: 'The reference opens on the strongest food/result contrast, then cuts quickly to the creator reaction.',
  whyItWorks: [
    'The payoff appears before the explanation, so the viewer knows why to keep watching.',
    'The creator face arrives after the promise, which makes the reaction feel earned.',
  ],
  referenceSignals: [],
},
recipe: {
  objective: 'Turn the opening into a reusable promise-first hook.',
  appealPoint: 'Lead with the payoff before the process.',
  keyLine: 'I stopped overthinking diet food and this is what finally stuck.',
  scriptLines: [
    'I stopped overthinking diet food and this is what finally stuck.',
    'Cut from plated meal to creator reaction in under 1 second.',
  ],
  keyMood: 'Confident, relieved, direct',
  keyAction: 'Show plated result first, then creator reaction.',
  mustInclude: ['Payoff first', 'Creator reaction after promise'],
  mustAvoid: ['Do not explain the process before the result'],
  cta: '',
},
prompter: {
  blocks: [
    {
      id: 'key-line',
      type: 'key_line',
      label: 'Main Script',
      content: 'I stopped overthinking diet food and this is what finally stuck.',
      accentColor: 'blue',
      visible: true,
      size: 'xl',
      positionPreset: 'lowerThird',
      scale: 1,
      order: 1,
    },
    {
      id: 'action',
      type: 'action',
      label: 'Action',
      content: 'Meal first, reaction second',
      accentColor: 'coral',
      visible: true,
      size: 'md',
      positionPreset: 'upperThird',
      scale: 1,
      order: 2,
    },
    {
      id: 'avoid',
      type: 'warning',
      label: 'Avoid',
      content: 'Do not explain before payoff',
      accentColor: 'yellow',
      visible: false,
      size: 'sm',
      positionPreset: 'top',
      scale: 1,
      order: 3,
    },
  ],
},
```

- [ ] **Step 3: Upgrade remaining seed scenes**

For every remaining scene in `recipesSeed`, add `sceneNumber`, `startTime`, `endTime`, `thumbnail`, `analysis`, `recipe`, and `prompter` using the same pattern. Use each existing `analysisLines`, `recipeLines`, and `prompterLines` as the source values so the copy remains coherent.

- [ ] **Step 4: Run TypeScript**

```bash
cd parrotkit-app
npx tsc --noEmit
```

Expected: seed data conforms to the extended type.

- [ ] **Step 5: Commit**

```bash
git add parrotkit-app/src/core/mocks/parrotkit-data.ts
git commit -m "feat(app): enrich mock recipe scenes"
```

## Task 4: Persist Prompter Visibility On Recipe Blocks

**Files:**
- Modify: `parrotkit-app/src/core/providers/mock-workspace-provider.tsx`

- [ ] **Step 1: Add block visibility update API**

Add this function inside `MockWorkspaceProvider`:

```ts
const updateScenePrompterBlockVisibility = useCallback((recipeId: string, sceneId: string, blockId: string, visible: boolean) => {
  setRecipes((currentRecipes) =>
    currentRecipes.map((recipe) => {
      if (recipe.id !== recipeId) {
        return recipe;
      }

      return {
        ...recipe,
        scenes: recipe.scenes.map((scene) => {
          if (scene.id !== sceneId) {
            return scene;
          }

          const blocks = scene.prompter?.blocks ?? [];

          return {
            ...scene,
            prompter: {
              blocks: blocks.map((block) =>
                block.id === blockId
                  ? {
                      ...block,
                      visible,
                    }
                  : block
              ),
            },
          };
        }),
      };
    })
  );
}, []);
```

- [ ] **Step 2: Add block content update API**

Add:

```ts
const updateScenePrompterBlockContent = useCallback((recipeId: string, sceneId: string, blockId: string, content: string) => {
  const nextContent = content.trim();
  if (!nextContent) {
    return;
  }

  setRecipes((currentRecipes) =>
    currentRecipes.map((recipe) => {
      if (recipe.id !== recipeId) {
        return recipe;
      }

      return {
        ...recipe,
        scenes: recipe.scenes.map((scene) => {
          if (scene.id !== sceneId) {
            return scene;
          }

          return {
            ...scene,
            prompter: {
              blocks: (scene.prompter?.blocks ?? []).map((block) =>
                block.id === blockId
                  ? {
                      ...block,
                      content: nextContent,
                    }
                  : block
              ),
            },
          };
        }),
      };
    })
  );
}, []);
```

- [ ] **Step 3: Add these functions to the context type and value**

Extend `MockWorkspaceContextValue`:

```ts
updateScenePrompterBlockVisibility: (recipeId: string, sceneId: string, blockId: string, visible: boolean) => void;
updateScenePrompterBlockContent: (recipeId: string, sceneId: string, blockId: string, content: string) => void;
```

Add both functions to the `value` object and `useMemo` dependency list.

- [ ] **Step 4: Keep compatibility selection functions**

Update `togglePrompterSelection` to call block visibility when blocks exist:

```ts
const togglePrompterSelection = useCallback((recipeId: string, scene: MockRecipeScene, elementId: string) => {
  if (scene.prompter?.blocks?.some((block) => block.id === elementId)) {
    const currentBlock = scene.prompter.blocks.find((block) => block.id === elementId);
    updateScenePrompterBlockVisibility(recipeId, scene.id, elementId, !(currentBlock?.visible ?? false));
    return;
  }

  setPrompterSelections((current) => {
    const currentSelection = current[recipeId]?.[scene.id] ?? getDefaultPrompterSelection(scene);
    const nextSelection = currentSelection.includes(elementId)
      ? currentSelection.filter((id) => id !== elementId)
      : [...currentSelection, elementId];

    return {
      ...current,
      [recipeId]: {
        ...(current[recipeId] ?? {}),
        [scene.id]: nextSelection,
      },
    };
  });
}, [updateScenePrompterBlockVisibility]);
```

- [ ] **Step 5: Run TypeScript**

```bash
cd parrotkit-app
npx tsc --noEmit
```

Expected: provider context compiles.

- [ ] **Step 6: Commit**

```bash
git add parrotkit-app/src/core/providers/mock-workspace-provider.tsx
git commit -m "feat(app): persist scene cue visibility"
```

## Task 5: Build Scene Sequence And Panels

**Files:**
- Create: `parrotkit-app/src/features/recipes/components/scene-sequence-rail.tsx`
- Create: `parrotkit-app/src/features/recipes/components/scene-analysis-panel.tsx`
- Create: `parrotkit-app/src/features/recipes/components/prompter-block-card.tsx`
- Create: `parrotkit-app/src/features/recipes/components/scene-recipe-panel.tsx`

- [ ] **Step 1: Create scene sequence rail**

Add:

```tsx
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';

import { NativeRecipeScene } from '@/features/recipes/types/recipe-domain';

export function SceneSequenceRail({
  scenes,
  activeSceneId,
  onSelectScene,
}: {
  scenes: NativeRecipeScene[];
  activeSceneId: string;
  onSelectScene: (sceneId: string) => void;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row gap-3 pr-5">
        {scenes.map((scene) => {
          const active = scene.id === activeSceneId;

          return (
            <Pressable
              key={scene.id}
              className={`w-[128px] overflow-hidden rounded-[22px] border ${
                active ? 'border-violet bg-violet/5' : 'border-stroke bg-surface'
              }`}
              onPress={() => onSelectScene(scene.id)}
            >
              <View className="aspect-[9/12] bg-slate-100">
                {scene.thumbnail ? (
                  <Image className="h-full w-full" resizeMode="cover" source={{ uri: scene.thumbnail }} />
                ) : null}
              </View>
              <View className="gap-1 px-3 py-3">
                <View className="flex-row items-center gap-1">
                  <MaterialCommunityIcons color={active ? '#6366f1' : '#64748b'} name="movie-open-outline" size={14} />
                  <Text className={`text-[11px] font-semibold ${active ? 'text-violet' : 'text-muted'}`}>
                    {scene.startTime}-{scene.endTime}
                  </Text>
                </View>
                <Text className="text-[13px] font-black leading-[17px] text-ink" numberOfLines={2}>
                  {scene.title}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}
```

- [ ] **Step 2: Create analysis panel**

Add:

```tsx
import { Text, View } from 'react-native';

import { NativeRecipeScene } from '@/features/recipes/types/recipe-domain';

export function SceneAnalysisPanel({ scene }: { scene: NativeRecipeScene }) {
  const transcriptLines = scene.analysis.transcriptOriginal?.length
    ? scene.analysis.transcriptOriginal
    : scene.analysis.transcriptSnippet
      ? [scene.analysis.transcriptSnippet]
      : [];
  const whyItWorks = scene.analysis.whyItWorks.filter(Boolean);

  return (
    <View className="gap-4">
      <Section title="Original Script">
        {transcriptLines.length ? transcriptLines.map((line, index) => (
          <LineCard key={`${scene.id}-script-${index}`} index={index + 1} text={line} />
        )) : <EmptyCard text="No original transcript was captured for this cut." />}
      </Section>

      <Section title="Motion View">
        <View className="rounded-[22px] border border-sky-100 bg-sky-50 px-4 py-4">
          <Text className="text-sm leading-6 text-ink">
            {scene.analysis.motionDescription || 'No motion-specific description was extracted for this cut.'}
          </Text>
        </View>
      </Section>

      <Section title="Why It Works">
        {whyItWorks.length ? whyItWorks.map((line, index) => (
          <LineCard key={`${scene.id}-why-${index}`} index={index + 1} text={line} />
        )) : <EmptyCard text="No reasoning notes were captured for this cut." />}
      </Section>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="gap-2">
      <Text className="text-[12px] font-semibold uppercase tracking-[0.8px] text-muted">{title}</Text>
      <View className="gap-2">{children}</View>
    </View>
  );
}

function LineCard({ index, text }: { index: number; text: string }) {
  return (
    <View className="flex-row gap-3 rounded-[22px] border border-stroke bg-surface px-4 py-4">
      <View className="h-6 w-6 items-center justify-center rounded-full bg-slate-100">
        <Text className="text-xs font-black text-ink">{index}</Text>
      </View>
      <Text className="flex-1 text-sm leading-6 text-ink">{text}</Text>
    </View>
  );
}

function EmptyCard({ text }: { text: string }) {
  return (
    <View className="rounded-[22px] border border-dashed border-stroke bg-surface px-4 py-4">
      <Text className="text-sm leading-6 text-muted">{text}</Text>
    </View>
  );
}
```

- [ ] **Step 3: Create prompter block card**

Add:

```tsx
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, Text, View } from 'react-native';

import { PrompterBlock } from '@/features/recipes/types/recipe-domain';

function getTone(block: PrompterBlock) {
  if (block.accentColor === 'coral') return 'border-[#ffb299] bg-[#fff1eb]';
  if (block.accentColor === 'green') return 'border-[#9be4b6] bg-[#effcf4]';
  if (block.accentColor === 'yellow') return 'border-[#f4d774] bg-[#fff9e7]';
  if (block.accentColor === 'pink') return 'border-[#ffb6d9] bg-[#fff0f8]';
  return 'border-[#a8d1ff] bg-[#eef6ff]';
}

export function PrompterBlockCard({
  block,
  onToggle,
}: {
  block: PrompterBlock;
  onToggle: (blockId: string, visible: boolean) => void;
}) {
  return (
    <Pressable
      className={`min-h-[118px] flex-1 rounded-[22px] border px-4 py-4 ${block.visible ? getTone(block) : 'border-stroke bg-surface'}`}
      onPress={() => onToggle(block.id, !block.visible)}
    >
      <View className="mb-4 flex-row items-center justify-between">
        <View className={`h-3 w-3 rounded-full ${block.visible ? 'bg-violet' : 'bg-slate-300'}`} />
        <MaterialCommunityIcons
          color={block.visible ? '#6366f1' : '#cbd5e1'}
          name={block.visible ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
          size={20}
        />
      </View>
      <Text className="text-[13px] font-semibold leading-6 text-ink">{block.content}</Text>
    </Pressable>
  );
}
```

- [ ] **Step 4: Create recipe panel**

Add:

```tsx
import { Text, View } from 'react-native';

import { PrompterBlockCard } from '@/features/recipes/components/prompter-block-card';
import { NativeRecipeScene } from '@/features/recipes/types/recipe-domain';

export function SceneRecipePanel({
  scene,
  onToggleBlock,
}: {
  scene: NativeRecipeScene;
  onToggleBlock: (blockId: string, visible: boolean) => void;
}) {
  const scriptLines = scene.recipe.scriptLines.filter(Boolean);
  const visibleCount = scene.prompter.blocks.filter((block) => block.visible).length;

  return (
    <View className="gap-5">
      <View className="gap-3 rounded-[24px] border border-stroke bg-surface px-4 py-4">
        <Text className="text-[12px] font-semibold uppercase tracking-[0.8px] text-muted">Cut Goal</Text>
        <Text className="text-[20px] font-black leading-[26px] text-ink">{scene.recipe.appealPoint || scene.title}</Text>
        {scene.recipe.keyAction ? (
          <Text className="text-sm leading-6 text-muted">{scene.recipe.keyAction}</Text>
        ) : null}
      </View>

      <View className="gap-2">
        <Text className="text-[12px] font-semibold uppercase tracking-[0.8px] text-muted">Script</Text>
        {scriptLines.map((line, index) => (
          <View key={`${scene.id}-recipe-line-${index}`} className="flex-row gap-3 rounded-[22px] border border-stroke bg-surface px-4 py-4">
            <Text className="text-xs font-black text-violet">{index + 1}</Text>
            <Text className="flex-1 text-sm leading-6 text-ink">{line}</Text>
          </View>
        ))}
      </View>

      <View className="gap-3">
        <View className="flex-row items-end justify-between">
          <Text className="text-[12px] font-semibold uppercase tracking-[0.8px] text-muted">Prompter</Text>
          <Text className="text-[12px] font-semibold text-violet">{visibleCount} on camera</Text>
        </View>
        <View className="flex-row flex-wrap gap-3">
          {scene.prompter.blocks.map((block) => (
            <View key={block.id} className="w-[48%]">
              <PrompterBlockCard block={block} onToggle={onToggleBlock} />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
```

- [ ] **Step 5: Run TypeScript**

```bash
cd parrotkit-app
npx tsc --noEmit
```

Expected: new components compile.

- [ ] **Step 6: Commit**

```bash
git add parrotkit-app/src/features/recipes/components
git commit -m "feat(app): add scene recipe components"
```

## Task 6: Rebuild Recipe Detail Screen Around Scenes

**Files:**
- Modify: `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`

- [ ] **Step 1: Replace the top dashboard sections**

Remove the large `Recipe Summary` card, niche/goal chips, and the all-scenes read-only card list. The first viewport should contain:

- back button;
- recipe title and creator;
- `SceneSequenceRail`;
- selected scene title;
- `Analysis`, `Recipe`, `Shoot` segmented control.

- [ ] **Step 2: Normalize the selected recipe**

Add imports:

```ts
import { SceneAnalysisPanel } from '@/features/recipes/components/scene-analysis-panel';
import { SceneRecipePanel } from '@/features/recipes/components/scene-recipe-panel';
import { SceneSequenceRail } from '@/features/recipes/components/scene-sequence-rail';
import { normalizeNativeRecipe } from '@/features/recipes/lib/recipe-domain-normalizer';
```

Inside the component:

```ts
const nativeRecipe = useMemo(() => (recipe ? normalizeNativeRecipe(recipe) : null), [recipe]);
const [selectedSceneId, setSelectedSceneId] = useState(nativeRecipe?.scenes[0]?.id ?? '');
const selectedScene = useMemo(
  () => nativeRecipe?.scenes.find((scene) => scene.id === selectedSceneId) ?? nativeRecipe?.scenes[0] ?? null,
  [nativeRecipe, selectedSceneId]
);
```

Add an effect:

```ts
useEffect(() => {
  if (!selectedSceneId && nativeRecipe?.scenes[0]) {
    setSelectedSceneId(nativeRecipe.scenes[0].id);
  }
}, [nativeRecipe, selectedSceneId]);
```

- [ ] **Step 3: Change tabs**

Replace labels with:

```ts
type DetailTab = 'analysis' | 'recipe' | 'shoot';

const detailTabs: Array<{ id: DetailTab; label: string }> = [
  { id: 'analysis', label: 'Analysis' },
  { id: 'recipe', label: 'Recipe' },
  { id: 'shoot', label: 'Shoot' },
];
```

- [ ] **Step 4: Wire Recipe tab block toggles**

Use the provider API from Task 4:

```ts
const { getRecipeById, updateScenePrompterBlockVisibility } = useMockWorkspace();
```

In the `recipe` tab:

```tsx
<SceneRecipePanel
  scene={selectedScene}
  onToggleBlock={(blockId, visible) => {
    updateScenePrompterBlockVisibility(nativeRecipe.id, selectedScene.id, blockId, visible);
  }}
/>
```

- [ ] **Step 5: Wire Shoot tab**

Make the `Shoot` tab launch the native camera:

```ts
const handleOpenPrompter = () => {
  if (!nativeRecipe || !selectedScene) {
    return;
  }

  router.push(`/recipe/${nativeRecipe.id}/prompter?sceneId=${selectedScene.id}` as Href);
};
```

Render a compact shoot panel:

```tsx
<View className="gap-4 rounded-[24px] border border-stroke bg-surface px-4 py-5">
  <Text className="text-[20px] font-black text-ink">{selectedScene.title}</Text>
  <Text className="text-sm leading-6 text-muted">{selectedScene.recipe.keyLine || selectedScene.recipe.appealPoint}</Text>
  <Pressable onPress={handleOpenPrompter}>
    <LinearGradient colors={brandActionGradient} end={{ x: 1, y: 1 }} start={{ x: 0, y: 0 }} style={{ borderRadius: 24 }}>
      <View className="flex-row items-center justify-center gap-2 px-5 py-4">
        <MaterialCommunityIcons color="#fffdf8" name="camera-outline" size={20} />
        <Text className="text-[15px] font-semibold text-white">Open prompter</Text>
      </View>
    </LinearGradient>
  </Pressable>
</View>
```

- [ ] **Step 6: Run TypeScript**

```bash
cd parrotkit-app
npx tsc --noEmit
```

Expected: recipe detail compiles and no old `prompter` tab references remain.

- [ ] **Step 7: Manual simulator check**

Run:

```bash
cd parrotkit-app
npx expo start --dev-client --localhost
```

Open the installed iOS dev client and verify:

- Recipes tab opens a recipe.
- Scene rail changes the selected scene.
- Analysis tab shows original script, motion view, and why-it-works content.
- Recipe tab shows script and selectable cue cards.
- Tapping a cue changes the visible count.
- Shoot tab opens the native prompter for the selected scene.

- [ ] **Step 8: Commit**

```bash
git add parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx
git commit -m "feat(app): rebuild recipe detail around scenes"
```

## Task 7: Rebuild Native Prompter Around Prompter Blocks

**Files:**
- Create: `parrotkit-app/src/features/recipes/components/shooting-scene-switcher.tsx`
- Modify: `parrotkit-app/src/features/recipes/screens/recipe-prompter-camera-screen.tsx`

- [ ] **Step 1: Create scene switcher**

Add:

```tsx
import { Pressable, ScrollView, Text, View } from 'react-native';

import { NativeRecipeScene } from '@/features/recipes/types/recipe-domain';

export function ShootingSceneSwitcher({
  scenes,
  activeSceneId,
  onSelectScene,
}: {
  scenes: NativeRecipeScene[];
  activeSceneId: string;
  onSelectScene: (sceneId: string) => void;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row gap-2 pr-1">
        {scenes.map((scene) => {
          const active = scene.id === activeSceneId;

          return (
            <Pressable
              key={scene.id}
              className={`rounded-full border px-4 py-2 ${active ? 'border-white/70 bg-white' : 'border-white/10 bg-white/5'}`}
              onPress={() => onSelectScene(scene.id)}
            >
              <Text className={`text-sm font-semibold ${active ? 'text-slate-950' : 'text-white/65'}`}>
                {scene.sceneNumber}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}
```

- [ ] **Step 2: Normalize recipe in camera screen**

Add imports:

```ts
import { ShootingSceneSwitcher } from '@/features/recipes/components/shooting-scene-switcher';
import { getVisiblePrompterBlocks, normalizeNativeRecipe } from '@/features/recipes/lib/recipe-domain-normalizer';
import { PrompterBlock } from '@/features/recipes/types/recipe-domain';
```

Replace `recipe` and `activeScene` derivation with:

```ts
const rawRecipe = params.recipeId ? getRecipeById(params.recipeId) : null;
const recipe = useMemo(() => (rawRecipe ? normalizeNativeRecipe(rawRecipe) : null), [rawRecipe]);
const [activeSceneId, setActiveSceneId] = useState(params.sceneId ?? recipe?.scenes[0]?.id ?? '');
const activeScene = useMemo(
  () => recipe?.scenes.find((scene) => scene.id === activeSceneId) ?? recipe?.scenes[0] ?? null,
  [activeSceneId, recipe]
);
const selectedBlocks = activeScene ? getVisiblePrompterBlocks(activeScene) : [];
```

- [ ] **Step 3: Replace overlay element cards with block cards**

Replace the center overlay mapping with:

```tsx
{selectedBlocks.length ? (
  selectedBlocks.map((block) => (
    <OverlayCueCard key={block.id} block={block} />
  ))
) : (
  <View className="rounded-[24px] border border-dashed border-white/20 bg-black/35 px-5 py-5">
    <Text className="text-sm font-medium leading-6 text-white/70">
      Select cues in the Recipe tab before shooting.
    </Text>
  </View>
)}
```

Replace `OverlayCueCard` with:

```tsx
function OverlayCueCard({ block }: { block: PrompterBlock }) {
  const toneClass = block.type === 'key_line'
    ? 'border-[#ffb598]/60 bg-[#ff936b]/20'
    : 'border-[#c4b5fd]/60 bg-[#8b5cf6]/20';

  return (
    <View className={`rounded-[24px] border px-4 py-4 ${toneClass}`}>
      <Text className="text-[17px] font-semibold leading-6 text-white">{block.content}</Text>
    </View>
  );
}
```

- [ ] **Step 4: Simplify bottom camera controls**

Replace the bottom `Show On Camera` selector with `ShootingSceneSwitcher` and remove visible selected counts. The bottom sheet should show:

```tsx
<ShootingSceneSwitcher
  scenes={recipe.scenes}
  activeSceneId={activeScene.id}
  onSelectScene={setActiveSceneId}
/>
```

Keep the camera flip and back buttons. Do not add explanatory dashboard copy to the camera view.

- [ ] **Step 5: Run TypeScript**

```bash
cd parrotkit-app
npx tsc --noEmit
```

Expected: camera screen compiles and no `MockPrompterElement` import remains in the file.

- [ ] **Step 6: Manual simulator check**

Run:

```bash
cd parrotkit-app
npx expo start --dev-client --localhost
```

Verify on iOS simulator:

- Opening Shoot from scene 1 shows only visible blocks from scene 1.
- Toggling a block off in the Recipe tab removes it from the native camera overlay.
- Scene switcher changes the overlay content.
- Camera permission gate still appears when permission is missing.

- [ ] **Step 7: Commit**

```bash
git add parrotkit-app/src/features/recipes/components/shooting-scene-switcher.tsx parrotkit-app/src/features/recipes/screens/recipe-prompter-camera-screen.tsx
git commit -m "feat(app): use recipe blocks in native prompter"
```

## Task 8: Reduce Console-Like Copy Across Recipe Surfaces

**Files:**
- Modify: `parrotkit-app/src/features/recipes/screens/recipes-screen.tsx`
- Modify: `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`
- Modify: `parrotkit-app/src/features/recipes/screens/recipe-prompter-camera-screen.tsx`

- [ ] **Step 1: Recipes screen copy**

Change:

```tsx
<Text className="text-[32px] font-black leading-[36px] text-ink">My Recipes</Text>
<Text className="mt-2 text-center text-sm text-muted">Create your first recipe from a viral video.</Text>
```

To:

```tsx
<Text className="text-[32px] font-black leading-[36px] text-ink">Recipes</Text>
<Text className="mt-2 text-center text-sm text-muted">Turn a source into scenes, cues, and a shootable prompter.</Text>
```

- [ ] **Step 2: Recipe detail copy rules**

Use these visible labels only:

- `Analysis`
- `Recipe`
- `Shoot`
- `Original Script`
- `Motion View`
- `Why It Works`
- `Cut Goal`
- `Script`
- `Prompter`
- `Open prompter`

Remove platform/status/admin-like labels from the main recipe workspace unless they are necessary for navigation.

- [ ] **Step 3: Camera copy rules**

Use these camera labels only:

- recipe title chip;
- scene number chips;
- permission prompt when needed.

Remove:

- `Show On Camera`;
- selected counts;
- platform chip;
- long instruction copy.

- [ ] **Step 4: Run TypeScript**

```bash
cd parrotkit-app
npx tsc --noEmit
```

Expected: copy cleanup compiles.

- [ ] **Step 5: Commit**

```bash
git add parrotkit-app/src/features/recipes/screens/recipes-screen.tsx parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx parrotkit-app/src/features/recipes/screens/recipe-prompter-camera-screen.tsx
git commit -m "chore(app): simplify recipe surface copy"
```

## Task 9: Final Verification And Documentation

**Files:**
- Modify: `context/context_20260426_parrotkit_app_web_recipe_parity.md`
- Modify: `plans/20260426_parrotkit_app_web_recipe_parity_plan.md`

- [ ] **Step 1: TypeScript verification**

Run:

```bash
cd parrotkit-app
npx tsc --noEmit
```

Expected: exit code `0`.

- [ ] **Step 2: Native simulator verification**

Run:

```bash
cd parrotkit-app
npx expo start --dev-client --localhost
```

Use the existing iOS simulator/dev client and verify:

- Recipes tab opens `Korean Diet Viral Hook`.
- Scene rail appears in the first recipe detail viewport.
- Switching scenes changes Analysis and Recipe content.
- Recipe tab cue selection changes `Prompter` visible count.
- Shoot opens the native camera.
- Native camera only shows selected blocks.
- Native camera scene switcher changes the displayed cues.

- [ ] **Step 3: Write context**

Add to `context/context_20260426_parrotkit_app_web_recipe_parity.md`:

```md
# ParrotKit App Web Recipe Parity Context

## Date
2026-04-26

## Summary
Rebuilt the native app recipe flow around the web product model: scene sequence, Analysis layer, Recipe execution layer, selectable prompter blocks, and native Shooting overlay.

## Web Parity Points
- Preserved `analysis`, `recipe`, and `prompter.blocks` as separate scene layers.
- Made scene selection the primary recipe interaction.
- Moved cue selection into the Recipe tab.
- Made native Shooting consume selected/visible prompter blocks.

## Verification
- `cd parrotkit-app && npx tsc --noEmit`
- `cd parrotkit-app && npx expo start --dev-client --localhost`
- iOS simulator smoke test: recipe detail, scene switching, cue selection, and native prompter overlay.

## Risks
- Mock data now mirrors web payloads, but live API integration is still a later step.
- Native cue dragging/resizing is not included in this parity pass.
```

- [ ] **Step 4: Update AGENTS plan result**

Append to `plans/20260426_parrotkit_app_web_recipe_parity_plan.md`:

```md
## 결과
- 웹 `RecipeResult` 구조를 기준으로 앱 recipe detail을 scene-first 구조로 재정렬했다.
- `Recipe` 탭에서 촬영 중 띄울 prompter block을 선택하도록 구현했다.
- native camera prompter가 선택된 block만 표시하도록 연결했다.

## 연결 context
- `context/context_20260426_parrotkit_app_web_recipe_parity.md`
```

- [ ] **Step 5: Rebase with latest dev**

```bash
git fetch origin
git rebase origin/dev
```

Expected: clean rebase. If AppleDouble metadata errors appear, run `make cl`, then repeat `git rebase origin/dev`.

- [ ] **Step 6: Final status**

```bash
git status --short --branch
```

Expected: clean branch ahead of `origin/dev` by the local commits.

- [ ] **Step 7: Push**

```bash
git push origin dev
```

Expected: push succeeds.

## Rollback

Rollback can be done by reverting the commits from this plan in reverse order:

```bash
git revert <commit-from-task-8>
git revert <commit-from-task-7>
git revert <commit-from-task-6>
git revert <commit-from-task-5>
git revert <commit-from-task-4>
git revert <commit-from-task-3>
git revert <commit-from-task-2>
git revert <commit-from-task-1>
git push origin dev
```

If only the camera surface is problematic, revert Task 7 first and keep Tasks 1-6 because those are the recipe model and detail screen foundations.

## Self-Review

- Spec coverage: The plan covers the user's requested website behavior: scene card/list, per-scene Recipe tab, element selection, and shooting prompter overlay. It also addresses the complaint about console-like labels by adding a dedicated copy cleanup task.
- Placeholder scan: The plan has no `TBD` or unspecified implementation steps. Every code-changing task names files, snippets, commands, and expected verification.
- Type consistency: Native domain types match the web fields used by `src/types/recipe.ts`; later tasks consistently use `NativeRecipeScene`, `PrompterBlock`, `prompter.blocks`, and `visible`.
