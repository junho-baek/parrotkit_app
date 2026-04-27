# ParrotKit Native Recipe Detail Web Parity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the native recipe detail screen so it follows the Next web `RecipeResult` structure: recipe overview as a scene card list, then a focused scene workspace with Analysis, Recipe, and Shooting.

**Architecture:** Preserve the current native recipe domain adapter and prompter camera work. Replace the current hero/rail/tab stack in `RecipeDetailScreen` with a two-state flow: overview mode (`selectedSceneId === null`) and scene mode (`selectedSceneId !== null`). Move overview card rendering and scene metadata into focused helper/component files so the screen stays readable.

**Tech Stack:** Expo Router, React Native 0.81, NativeWind, TypeScript 5.9, existing `useMockWorkspace`, existing native `PrompterBlock` domain.

---

## Product Source Of Truth

The web implementation in `src/components/common/RecipeResult.tsx` is the reference:

- Overview state renders vertical scene cards.
- Scene card includes thumbnail, scene title, strategy metadata, capture state, and `Open ->`.
- Selected scene state opens a full scene workspace.
- Scene workspace has `Analysis`, `Recipe`, and `Shooting` tabs.
- `Recipe` is not a read-only script page. It is the cue board where the creator chooses the prompter ingredients.
- `Shooting` consumes `scene.prompter.blocks.filter(block => block.visible)`.

The native app already has:

- `parrotkit-app/src/features/recipes/types/recipe-domain.ts`
- `parrotkit-app/src/features/recipes/lib/recipe-domain-normalizer.ts`
- `parrotkit-app/src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
- `parrotkit-app/src/features/recipes/components/prompter-block-card.tsx`
- `parrotkit-app/src/features/recipes/components/scene-analysis-panel.tsx`
- `parrotkit-app/src/features/recipes/components/scene-recipe-panel.tsx`

This plan does not introduce a new product model. It translates the existing web model into the native app.

## UX Rules

- Do not keep the current large recipe hero card on recipe detail.
- Do not keep `SceneSequenceRail` on recipe overview.
- Do not make the overview feel like an operations console.
- Keep top controls compact.
- Use scene cards as the main overview content.
- Only use labels when they help the creator understand the content role, such as `HOOK`, `CTA`, `Problem-Led`, or `Outcome-First`.
- Avoid system/status labels like `SCENES`, `5 ready`, `PROMPTER`, and `3 on camera` on the main recipe surfaces.
- The Recipe tab should feel like choosing ingredients for the prompter, with large cue cards, color dots, and check states.
- The Shoot tab should lead to the existing native prompter camera route without duplicating camera implementation inside the detail screen.

## File Structure

### Create

- `parrotkit-app/src/features/recipes/lib/scene-strategy-meta.ts`
  - Pure helper copied conceptually from web `getSceneStrategyMeta`.
  - Computes `stageLabel`, `patternLabel`, support for reference analysis, and compact scene subtitles.

- `parrotkit-app/src/features/recipes/components/recipe-scene-card.tsx`
  - Native overview card that mirrors the web scene list card.
  - Owns thumbnail, title, strategy meta, capture badge, and open affordance.

- `plans/20260427_native_recipe_detail_web_parity.md`
  - Project-local plan summary required by `AGENTS.md`.

- `context/context_20260427_native_recipe_detail_web_parity.md`
  - Final implementation and verification context.

### Modify

- `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`
  - Replace current hero/rail/tab single screen with overview mode and scene mode.
  - Remove `SceneSequenceRail` usage from this screen.
  - Keep `SceneAnalysisPanel`, `SceneRecipePanel`, and prompter route integration.

- `parrotkit-app/src/features/recipes/components/scene-recipe-panel.tsx`
  - Remove console-like labels and counts.
  - Make cue board the primary content.
  - Keep `onToggleBlock` as the interface.

- `parrotkit-app/src/features/recipes/components/prompter-block-card.tsx`
  - Preserve current web-like dot/check/pastel card language.
  - Tighten copy density and visual state.

- `parrotkit-app/src/features/recipes/components/scene-analysis-panel.tsx`
  - Keep analysis content, but soften section labels where possible.

### Do Not Modify

- Do not change database schema.
- Do not change web `src/components/common/RecipeResult.tsx`.
- Do not rebuild native camera recording logic.
- Do not stage `.superpowers/` brainstorming artifacts.
- Do not push `main`.

## Task 1: Add Native Scene Strategy Helpers

**Files:**
- Create: `parrotkit-app/src/features/recipes/lib/scene-strategy-meta.ts`
- Verify: `parrotkit-app/src/features/recipes/lib/recipe-domain-normalizer.ts`

- [ ] **Step 1: Create the helper file**

Use `apply_patch` to create `parrotkit-app/src/features/recipes/lib/scene-strategy-meta.ts`:

```ts
import { NativeRecipeScene } from '@/features/recipes/types/recipe-domain';

function containsKeyword(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(keyword));
}

function searchableSceneText(scene: NativeRecipeScene) {
  return [
    scene.title,
    scene.summary || '',
    scene.recipe.objective,
    scene.recipe.appealPoint,
    scene.recipe.keyLine,
    scene.recipe.keyAction,
    scene.recipe.cta || '',
    scene.analysis.motionDescription || '',
    scene.analysis.transcriptSnippet || '',
  ]
    .join(' ')
    .toLowerCase();
}

function getHookPattern(text: string) {
  if (containsKeyword(text, ['myth', 'actually', 'truth', 'instead', 'secret', '속지', '몰랐', '반전'])) {
    return 'Myth-Busting';
  }

  if (containsKeyword(text, ['problem', 'mistake', 'avoid', 'stop', 'warning', 'wrong', '실수', '문제', '조심', '피하', '절대'])) {
    return 'Problem-Led';
  }

  return 'Outcome-First';
}

function getBasePattern(text: string) {
  if (containsKeyword(text, ['?', 'why', 'how', 'what', '여러분', '아세요'])) {
    return 'Question Lead';
  }

  if (containsKeyword(text, ['kitchen', 'store', 'shop', 'cafe', 'room', 'desk', 'table', 'outside', 'inside', '가서', '에서'])) {
    return 'Scene Change';
  }

  if (containsKeyword(text, ['expert', 'doctor', 'founder', 'coach', 'chef', 'specialist', 'authority', '전문가', '현직', '추천'])) {
    return 'Authority Cue';
  }

  return 'Real Example';
}

function getCtaPattern(text: string) {
  if (containsKeyword(text, ['now', 'today', 'must', 'save this', 'follow', 'click', 'buy', 'join', 'download', '지금', '바로', '꼭', '무조건'])) {
    return 'Hard CTA';
  }

  return 'Soft CTA';
}

export function sceneSupportsAnalysis(scene: NativeRecipeScene) {
  const transcriptLines = scene.analysis.transcriptOriginal?.filter((line) => line.trim().length > 0) || [];
  const hasTranscript = transcriptLines.length > 0 || Boolean(scene.analysis.transcriptSnippet?.trim());
  const hasMotion = Boolean(scene.analysis.motionDescription?.trim());
  const hasWhy = scene.analysis.whyItWorks.some((item) => item.trim().length > 0);

  return hasTranscript || hasMotion || hasWhy;
}

export function getSceneStrategyMeta(scene: NativeRecipeScene, sceneIndex: number, totalScenes: number) {
  const text = searchableSceneText(scene);

  if (sceneIndex === 0) {
    return { stageLabel: 'HOOK', patternLabel: getHookPattern(text) };
  }

  if (sceneIndex === totalScenes - 1) {
    return { stageLabel: 'CTA', patternLabel: getCtaPattern(text) };
  }

  return {
    stageLabel: `BASE #${sceneIndex}`,
    patternLabel: getBasePattern(text),
  };
}

export function getSceneCardSummary(scene: NativeRecipeScene) {
  return (
    scene.recipe.appealPoint.trim()
    || scene.recipe.keyLine.trim()
    || scene.analysis.motionDescription?.trim()
    || scene.summary?.trim()
    || scene.title
  );
}
```

- [ ] **Step 2: Run TypeScript check**

Run:

```bash
cd parrotkit-app && npx tsc --noEmit
```

Expected: TypeScript passes with no errors.

- [ ] **Step 3: Commit**

```bash
git add parrotkit-app/src/features/recipes/lib/scene-strategy-meta.ts
git commit -m "feat(app): add native scene strategy metadata"
```

## Task 2: Create Web-Parity Overview Scene Card

**Files:**
- Create: `parrotkit-app/src/features/recipes/components/recipe-scene-card.tsx`
- Uses: `parrotkit-app/src/features/recipes/lib/scene-strategy-meta.ts`

- [ ] **Step 1: Create `RecipeSceneCard`**

Use `apply_patch` to create:

```tsx
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image, Pressable, Text, View } from 'react-native';

import { getSceneCardSummary, getSceneStrategyMeta } from '@/features/recipes/lib/scene-strategy-meta';
import { NativeRecipeScene } from '@/features/recipes/types/recipe-domain';

export function RecipeSceneCard({
  scene,
  sceneIndex,
  totalScenes,
  captured = false,
  onPress,
}: {
  scene: NativeRecipeScene;
  sceneIndex: number;
  totalScenes: number;
  captured?: boolean;
  onPress: () => void;
}) {
  const meta = getSceneStrategyMeta(scene, sceneIndex, totalScenes);
  const summary = getSceneCardSummary(scene);

  return (
    <Pressable
      className={`overflow-hidden rounded-[22px] bg-surface ${
        captured ? 'border-2 border-emerald-500' : 'border border-stroke'
      }`}
      onPress={onPress}
    >
      <View className="flex-row gap-3 p-3">
        <View className="relative w-[108px] shrink-0 overflow-hidden rounded-[22px] bg-slate-100">
          <View className="aspect-[9/16] w-full">
            {scene.thumbnail ? (
              <Image className="h-full w-full" resizeMode="cover" source={{ uri: scene.thumbnail }} />
            ) : (
              <View className="h-full w-full bg-slate-200" />
            )}
          </View>
          <View className="absolute left-2 top-2 rounded-full bg-ink px-2 py-1">
            <Text className="text-[10px] font-black text-white">#{scene.sceneNumber}</Text>
          </View>
          {captured ? (
            <View className="absolute inset-0 items-center justify-center bg-emerald-500/20">
              <View className="h-6 w-6 items-center justify-center rounded-full bg-emerald-500">
                <MaterialCommunityIcons color="#fff" name="check" size={16} />
              </View>
            </View>
          ) : null}
        </View>

        <View className="min-w-0 flex-1 justify-between py-1">
          <View className="gap-2">
            <Text className="text-[16px] font-black leading-[20px] text-ink" numberOfLines={2}>
              {summary}
            </Text>
            <Text className="text-[10px] font-black uppercase tracking-[1.4px] text-muted">
              {meta.stageLabel}: {meta.patternLabel}
            </Text>
          </View>

          <View className="flex-row items-center justify-end gap-1 pt-4">
            <Text className="text-xs font-bold text-muted">Open</Text>
            <MaterialCommunityIcons color="#64748b" name="arrow-right" size={16} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}
```

- [ ] **Step 2: Run TypeScript check**

Run:

```bash
cd parrotkit-app && npx tsc --noEmit
```

Expected: TypeScript passes with no errors.

- [ ] **Step 3: Commit**

```bash
git add parrotkit-app/src/features/recipes/components/recipe-scene-card.tsx
git commit -m "feat(app): add web-parity recipe scene cards"
```

## Task 3: Refactor Recipe Detail Into Overview And Scene Workspace

**Files:**
- Modify: `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`
- Stop using: `parrotkit-app/src/features/recipes/components/scene-sequence-rail.tsx` in this screen
- Uses: `RecipeSceneCard`, `sceneSupportsAnalysis`

- [ ] **Step 1: Update imports and state**

In `recipe-detail-screen.tsx`, replace the `SceneSequenceRail` import with:

```tsx
import { RecipeSceneCard } from '@/features/recipes/components/recipe-scene-card';
import { sceneSupportsAnalysis } from '@/features/recipes/lib/scene-strategy-meta';
import { NativeRecipeScene } from '@/features/recipes/types/recipe-domain';
```

Change selected scene state from first scene id to nullable overview state:

```tsx
const [activeTab, setActiveTab] = useState<DetailTab>('recipe');
const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);
```

Replace the current `useEffect` that auto-selects the first scene with:

```tsx
useEffect(() => {
  if (!nativeRecipe?.scenes.length || selectedSceneId === null) {
    return;
  }

  if (!nativeRecipe.scenes.some((scene) => scene.id === selectedSceneId)) {
    setSelectedSceneId(null);
  }
}, [nativeRecipe, selectedSceneId]);
```

- [ ] **Step 2: Add scene selection helpers**

Add below the not-found guard:

```tsx
const selectedScene = selectedSceneId
  ? nativeRecipe.scenes.find((scene) => scene.id === selectedSceneId) ?? null
  : null;

const selectedSceneIndex = selectedScene
  ? nativeRecipe.scenes.findIndex((scene) => scene.id === selectedScene.id)
  : -1;

const availableDetailTabs = selectedScene && sceneSupportsAnalysis(selectedScene)
  ? detailTabs
  : detailTabs.filter((tab) => tab.id !== 'analysis');

const openScene = (scene: NativeRecipeScene) => {
  setSelectedSceneId(scene.id);
  setActiveTab(sceneSupportsAnalysis(scene) ? 'analysis' : 'recipe');
};

const closeScene = () => {
  setSelectedSceneId(null);
  setActiveTab('recipe');
};
```

Update `handleOpenPrompter`:

```tsx
const handleOpenPrompter = () => {
  if (!selectedScene) {
    return;
  }

  router.push(`/recipe/${nativeRecipe.id}/prompter?sceneId=${selectedScene.id}` as Href);
};
```

- [ ] **Step 3: Replace the return with two-state layout**

Replace the current `return (` block with:

```tsx
if (selectedScene) {
  return (
    <View className="flex-1 bg-canvas">
      <View className="border-b border-stroke bg-surface/95 px-5 pb-3 pt-4">
        <View className="flex-row items-center justify-between">
          <Pressable
            className="h-10 min-w-[70px] flex-row items-center gap-1"
            onPress={closeScene}
          >
            <MaterialCommunityIcons color="#6366f1" name="arrow-left" size={20} />
            <Text className="text-[15px] font-black text-violet">Back</Text>
          </Pressable>

          <Text className="max-w-[210px] text-center text-[14px] font-black text-ink" numberOfLines={1}>
            #{selectedScene.sceneNumber}: {selectedScene.title}
          </Text>

          <Text className="min-w-[70px] text-right text-[11px] font-bold text-muted">
            {activeTab === 'shoot' ? 'Shooting' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </Text>
        </View>
      </View>

      <View className="flex-row justify-center gap-2 bg-canvas px-5 py-3">
        {availableDetailTabs.map((tab) => {
          const active = tab.id === activeTab;

          return (
            <Pressable
              key={tab.id}
              className={`rounded-full px-5 py-2 ${active ? 'bg-ink' : 'border border-stroke bg-surface'}`}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text className={`text-[12px] font-bold ${active ? 'text-white' : 'text-muted'}`}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 44 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-5 px-5 pt-2">
          {activeTab === 'analysis' ? (
            <SceneAnalysisPanel scene={selectedScene} />
          ) : activeTab === 'recipe' ? (
            <SceneRecipePanel
              scene={selectedScene}
              onToggleBlock={(blockId, visible) => {
                updateScenePrompterBlockVisibility(nativeRecipe.id, selectedScene.id, blockId, visible);
              }}
            />
          ) : (
            <View className="gap-4 rounded-[24px] border border-stroke bg-surface px-4 py-5">
              <Text className="text-[24px] font-black leading-[29px] text-ink">
                {selectedScene.recipe.keyLine || selectedScene.title}
              </Text>
              <Text className="text-sm leading-6 text-muted">
                {selectedScene.recipe.keyAction || 'Open the camera with the selected cue cards from this scene.'}
              </Text>
              <Pressable onPress={handleOpenPrompter}>
                <LinearGradient
                  colors={brandActionGradient}
                  end={{ x: 1, y: 1 }}
                  start={{ x: 0, y: 0 }}
                  style={{ borderRadius: 24 }}
                >
                  <View className="flex-row items-center justify-center gap-2 px-5 py-4">
                    <MaterialCommunityIcons color="#fffdf8" name="camera-outline" size={20} />
                    <Text className="text-[15px] font-semibold text-white">Start shooting</Text>
                  </View>
                </LinearGradient>
              </Pressable>
            </View>
          )}

          <View className="flex-row justify-between">
            <Pressable
              className="rounded-full border border-stroke bg-surface px-4 py-2"
              disabled={selectedSceneIndex <= 0}
              onPress={() => {
                const previous = nativeRecipe.scenes[selectedSceneIndex - 1];
                if (previous) openScene(previous);
              }}
            >
              <Text className={`text-sm font-bold ${selectedSceneIndex <= 0 ? 'text-slate-300' : 'text-muted'}`}>
                Previous
              </Text>
            </Pressable>
            <Pressable
              className="rounded-full border border-stroke bg-surface px-4 py-2"
              disabled={selectedSceneIndex >= nativeRecipe.scenes.length - 1}
              onPress={() => {
                const next = nativeRecipe.scenes[selectedSceneIndex + 1];
                if (next) openScene(next);
              }}
            >
              <Text className={`text-sm font-bold ${selectedSceneIndex >= nativeRecipe.scenes.length - 1 ? 'text-slate-300' : 'text-muted'}`}>
                Next
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

return (
  <ScrollView
    className="flex-1 bg-canvas"
    contentContainerStyle={{ paddingBottom: 44 }}
    contentInsetAdjustmentBehavior="automatic"
    showsVerticalScrollIndicator={false}
  >
    <View className="gap-4 px-5 pt-4">
      <View className="flex-row items-center justify-between">
        <Pressable
          className="h-11 w-11 items-center justify-center rounded-full border border-stroke bg-surface"
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons color="#111827" name="arrow-left" size={20} />
        </Pressable>

        <Text className="max-w-[240px] text-center text-[15px] font-black text-ink" numberOfLines={1}>
          {nativeRecipe.title}
        </Text>

        <Pressable
          className="rounded-full bg-ink px-4 py-2"
          onPress={() => {
            const firstScene = nativeRecipe.scenes[0];
            if (firstScene) {
              openScene(firstScene);
              setActiveTab('shoot');
            }
          }}
        >
          <Text className="text-[12px] font-black text-white">Shoot</Text>
        </Pressable>
      </View>

      <View className="gap-2">
        <Text className="text-[24px] font-black leading-[30px] text-ink">{nativeRecipe.title}</Text>
        <Text className="text-sm leading-6 text-muted" numberOfLines={2}>
          {nativeRecipe.summary}
        </Text>
      </View>

      <View className="gap-3">
        {nativeRecipe.scenes.map((scene, index) => (
          <RecipeSceneCard
            key={scene.id}
            scene={scene}
            sceneIndex={index}
            totalScenes={nativeRecipe.scenes.length}
            onPress={() => openScene(scene)}
          />
        ))}
      </View>
    </View>
  </ScrollView>
);
```

- [ ] **Step 4: Remove stale import**

Confirm `SceneSequenceRail` is no longer imported in `recipe-detail-screen.tsx`.

Run:

```bash
rg -n "SceneSequenceRail" parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx
```

Expected: no output.

- [ ] **Step 5: Run TypeScript check**

Run:

```bash
cd parrotkit-app && npx tsc --noEmit
```

Expected: TypeScript passes with no errors.

- [ ] **Step 6: Commit**

```bash
git add parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx
git commit -m "feat(app): align recipe detail with web scene flow"
```

## Task 4: Polish The Recipe Cue Board

**Files:**
- Modify: `parrotkit-app/src/features/recipes/components/scene-recipe-panel.tsx`
- Modify: `parrotkit-app/src/features/recipes/components/prompter-block-card.tsx`

- [ ] **Step 1: Replace `SceneRecipePanel` content structure**

Change `scene-recipe-panel.tsx` to keep a compact recipe intro and make cue cards primary:

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

  return (
    <View className="gap-5">
      <View className="gap-3">
        <Text className="text-[28px] font-black leading-[33px] text-ink">
          {scene.recipe.appealPoint || scene.recipe.keyLine || scene.title}
        </Text>
        {scene.recipe.keyAction ? (
          <Text className="text-sm leading-6 text-muted">{scene.recipe.keyAction}</Text>
        ) : null}
      </View>

      {scriptLines.length > 0 ? (
        <View className="gap-2">
          {scriptLines.slice(0, 3).map((line, index) => (
            <View key={`${scene.id}-recipe-line-${index}`} className="flex-row gap-3 rounded-[22px] border border-stroke bg-surface px-4 py-4">
              <Text className="text-xs font-black text-violet">{index + 1}</Text>
              <Text className="flex-1 text-sm leading-6 text-ink">{line}</Text>
            </View>
          ))}
        </View>
      ) : null}

      <View className="flex-row flex-wrap gap-3">
        {scene.prompter.blocks.map((block) => (
          <View key={block.id} className="w-[48%]">
            <PrompterBlockCard block={block} onToggle={onToggleBlock} />
          </View>
        ))}
      </View>
    </View>
  );
}
```

- [ ] **Step 2: Update `PrompterBlockCard` to avoid system labels**

Keep the existing interface. Replace the return JSX with:

```tsx
return (
  <Pressable
    className={`min-h-[132px] rounded-[24px] border px-4 py-4 ${block.visible ? getTone(block) : 'border-stroke bg-surface'}`}
    onPress={() => onToggle(block.id, !block.visible)}
  >
    <View className="mb-5 flex-row items-center justify-between">
      <View className={`h-3 w-3 rounded-full ${block.visible ? 'bg-violet' : 'bg-slate-300'}`} />
      <MaterialCommunityIcons
        color={block.visible ? '#6366f1' : '#cbd5e1'}
        name={block.visible ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
        size={21}
      />
    </View>
    <Text className="text-[14px] font-bold leading-6 text-ink">{block.content}</Text>
  </Pressable>
);
```

- [ ] **Step 3: Run TypeScript check**

Run:

```bash
cd parrotkit-app && npx tsc --noEmit
```

Expected: TypeScript passes with no errors.

- [ ] **Step 4: Commit**

```bash
git add parrotkit-app/src/features/recipes/components/scene-recipe-panel.tsx parrotkit-app/src/features/recipes/components/prompter-block-card.tsx
git commit -m "fix(app): make recipe cues the primary scene surface"
```

## Task 5: Soften Analysis Panel Labels

**Files:**
- Modify: `parrotkit-app/src/features/recipes/components/scene-analysis-panel.tsx`

- [ ] **Step 1: Replace section labels with creator-facing wording**

Change the section calls:

```tsx
<Section title="Original Script">
```

to:

```tsx
<Section title="What they said">
```

Change:

```tsx
<Section title="Motion View">
```

to:

```tsx
<Section title="What happens on screen">
```

Change:

```tsx
<Section title="Why It Works">
```

to:

```tsx
<Section title="Why it works">
```

- [ ] **Step 2: Reduce uppercase tracking**

In `Section`, replace the title class:

```tsx
<Text className="text-[12px] font-semibold uppercase tracking-[0.8px] text-muted">{title}</Text>
```

with:

```tsx
<Text className="text-[13px] font-black text-muted">{title}</Text>
```

- [ ] **Step 3: Run TypeScript check**

Run:

```bash
cd parrotkit-app && npx tsc --noEmit
```

Expected: TypeScript passes with no errors.

- [ ] **Step 4: Commit**

```bash
git add parrotkit-app/src/features/recipes/components/scene-analysis-panel.tsx
git commit -m "fix(app): make scene analysis copy creator-facing"
```

## Task 6: Native QA In Simulator

**Files:**
- No code files.
- Evidence: `output/playwright/native-recipe-detail-web-parity-overview.png`
- Evidence: `output/playwright/native-recipe-detail-web-parity-scene.png`

- [ ] **Step 1: Start Metro on 8082**

Run:

```bash
cd parrotkit-app && npx expo start --dev-client --localhost --port 8082
```

Expected: Metro starts and prints a dev-client URL.

- [ ] **Step 2: Open recipe detail directly**

In another terminal, run:

```bash
xcrun simctl openurl booted "parrotkit-app:///recipe/recipe-korean-diet-hook"
```

Expected: iOS simulator opens the recipe overview.

- [ ] **Step 3: Capture overview screenshot**

Run:

```bash
mkdir -p output/playwright
xcrun simctl io booted screenshot output/playwright/native-recipe-detail-web-parity-overview.png
```

Expected: screenshot file exists and shows a scene card list, no large hero image, no scene rail.

- [ ] **Step 4: Manually tap first scene**

Expected:

- scene detail opens;
- top bar is compact;
- tabs are visible;
- `Recipe` tab shows large cue cards;
- `Analysis` appears only when the scene has analysis content;
- `Shoot` tab has a `Start shooting` action.

- [ ] **Step 5: Capture scene screenshot**

Run:

```bash
xcrun simctl io booted screenshot output/playwright/native-recipe-detail-web-parity-scene.png
```

Expected: screenshot file exists and shows the scene workspace.

- [ ] **Step 6: Test shooting route**

Tap `Shoot`, then `Start shooting`.

Expected:

- native prompter route opens;
- selected scene id is preserved;
- cue cards visible in Recipe tab are the cue blocks shown in the prompter.

- [ ] **Step 7: Commit QA evidence only if the project already tracks screenshots**

Run:

```bash
git status --short output/playwright
```

Expected: screenshots are untracked. Do not commit screenshots unless the repository already tracks similar QA evidence for this task.

## Task 7: Document Context And Project Plan Result

**Files:**
- Create: `plans/20260427_native_recipe_detail_web_parity.md`
- Create: `context/context_20260427_native_recipe_detail_web_parity.md`

- [ ] **Step 1: Add project-local plan result**

Create `plans/20260427_native_recipe_detail_web_parity.md`:

```md
# 20260427 Native Recipe Detail Web Parity

## 배경
- 네이티브 레시피 상세는 현재 큰 히어로, 장면 rail, 상단 탭이 한 화면에 섞여 웹 `RecipeResult`의 장면 리스트 중심 구조를 잃었다.
- 사용자는 웹의 레시피 오버뷰처럼 장면 리스트를 먼저 보여주고, 장면 안에서 분석/레시피/슈팅을 다루는 구조를 원한다.

## 목표
- 레시피 상세 첫 화면을 웹처럼 장면 카드 리스트로 바꾼다.
- 장면 선택 후 Analysis, Recipe, Shoot 탭을 제공한다.
- Recipe 탭은 프롬프터에 들어갈 cue ingredient 선택 보드가 되게 한다.
- Shoot 탭은 기존 네이티브 프롬프터 촬영 화면으로 연결한다.

## 범위
- `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`
- `parrotkit-app/src/features/recipes/components/recipe-scene-card.tsx`
- `parrotkit-app/src/features/recipes/lib/scene-strategy-meta.ts`
- `parrotkit-app/src/features/recipes/components/scene-recipe-panel.tsx`
- `parrotkit-app/src/features/recipes/components/prompter-block-card.tsx`
- `parrotkit-app/src/features/recipes/components/scene-analysis-panel.tsx`

## 변경 파일
- `docs/superpowers/plans/2026-04-27-parrotkit-native-recipe-detail-web-parity.md`
- `plans/20260427_native_recipe_detail_web_parity.md`
- `context/context_20260427_native_recipe_detail_web_parity.md`
- native app recipe files listed above

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`
- iOS dev-client recipe overview 수동 QA
- scene detail Analysis/Recipe/Shoot 수동 QA
- native prompter route 진입 QA

## 롤백
- `recipe-detail-screen.tsx`와 새 helper/component 파일을 이전 커밋으로 되돌리면 기존 hero/rail/tabs 화면으로 복구된다.
- prompter camera 파일은 변경하지 않으므로 촬영 기능 롤백 리스크는 낮다.

## 리스크
- 기존 mock data의 scene thumbnail 품질에 따라 overview card가 웹보다 약해 보일 수 있다.
- scene detail을 같은 파일에서 상태 분기하면 파일이 커질 수 있으므로 후속 작업에서 `RecipeSceneWorkspace` 분리를 검토한다.
```

- [ ] **Step 2: Add context document**

Create `context/context_20260427_native_recipe_detail_web_parity.md`:

```md
# 2026-04-27 Native Recipe Detail Web Parity

## Summary

- Reworked native recipe detail around the web `RecipeResult` structure.
- Recipe overview now shows vertical scene cards instead of a large hero and scene rail.
- Scene detail now opens into Analysis, Recipe, and Shoot tabs.
- Recipe tab focuses on selectable prompter cue cards.
- Shoot tab links to the existing native prompter route.

## Verification

- `cd parrotkit-app && npx tsc --noEmit`: passed.
- iOS dev-client recipe overview QA: passed.
- iOS scene detail QA: passed.
- Native prompter route from Shoot tab: passed.

## Evidence

- `output/playwright/native-recipe-detail-web-parity-overview.png`
- `output/playwright/native-recipe-detail-web-parity-scene.png`

## Notes

- `.superpowers/` brainstorming files were not committed.
- `SceneSequenceRail` remains in the codebase for now but is no longer used by `RecipeDetailScreen`.
```

- [ ] **Step 3: Commit docs**

```bash
git add plans/20260427_native_recipe_detail_web_parity.md context/context_20260427_native_recipe_detail_web_parity.md
git commit -m "docs: record native recipe detail web parity"
```

## Task 8: Sync With `origin/dev` And Push

**Files:**
- No code files.

- [ ] **Step 1: Check status**

Run:

```bash
git status --short --branch
```

Expected:

- branch is `dev`;
- `.superpowers/` may be untracked;
- no unstaged implementation files remain.

- [ ] **Step 2: Fetch latest dev**

Run:

```bash
git fetch origin dev
```

Expected: fetch succeeds.

- [ ] **Step 3: Rebase local commits onto latest origin/dev**

Run:

```bash
git rebase origin/dev
```

Expected: rebase succeeds without conflicts. If AppleDouble metadata conflicts appear, run `make cl`, then retry the rebase.

- [ ] **Step 4: Final TypeScript check**

Run:

```bash
cd parrotkit-app && npx tsc --noEmit
```

Expected: TypeScript passes with no errors.

- [ ] **Step 5: Push dev**

Run:

```bash
git push origin dev
```

Expected: push succeeds. Do not push `main`.

## Self-Review

### Spec Coverage

- Web overview scene card list: Task 2 and Task 3.
- Scene detail with Analysis/Recipe/Shoot: Task 3.
- Recipe cue ingredient board: Task 4.
- Avoid console/system labels: Task 4 and Task 5.
- Preserve existing native shooting route: Task 3 and Task 6.
- Documentation/context: Task 7.
- Dev-only push workflow: Task 8.

### Placeholder Scan

No placeholder markers, vague implementation steps, or unspecified test commands remain.

### Type Consistency

- `NativeRecipeScene` is imported from the existing native recipe domain.
- `sceneSupportsAnalysis`, `getSceneStrategyMeta`, and `getSceneCardSummary` are created in Task 1 and consumed in Tasks 2 and 3.
- `RecipeSceneCard` accepts `sceneIndex` and `totalScenes`, matching Task 2 usage in Task 3.
- `SceneRecipePanel` keeps the existing `onToggleBlock(blockId, visible)` interface.
