# ParrotKit Native Prompter Web Parity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the native app prompter up to the web `CameraShooting` feature level: movable cues, editable cue text, size/scale adjustment, add/hide cues, actual video recording, review, and saved takes.

**Architecture:** Continue from branch `codex/app-recipe-web-parity`, where recipes already normalize to `prompter.blocks`. Split native shooting into focused units: a camera screen container, draggable/editable prompter block overlay, recording/review controls, provider persistence for block layout/content/takes, and Expo camera/video permissions.

**Tech Stack:** Expo Router, React Native, Expo Camera, Expo Video, NativeWind, TypeScript, built-in `PanResponder`, current mock workspace provider.

---

## Why This Plan Exists

The prior recipe parity pass matched the web data model and high-level scene workflow, but it did not match the actual web shooting tool. The current native prompter is still display-only:

- cue blocks cannot be moved;
- cue text cannot be edited;
- size/scale cannot be changed;
- custom cues cannot be added from the camera;
- hidden cues cannot be toggled from the camera;
- there is no actual recording, review, or use-take flow.

That means it is not yet web parity. The web product's real shooting value is in `src/components/common/CameraShooting.tsx`, not only in `RecipeResult.tsx`.

## Web Behavior To Match

`src/components/common/CameraShooting.tsx` does the following:

- renders only `prompterBlocks.filter((block) => block.visible)`;
- positions blocks by normalized `x/y`, falling back to `positionPreset`;
- supports drag to move blocks;
- supports pinch/resize to change `scale`;
- supports inline text edit;
- supports add custom block;
- supports hide/remove block;
- supports cue color changes;
- records video;
- opens a review overlay after recording;
- lets the user retry or use the take;
- reports the saved take back to the recipe scene.

The native app should implement the same user-facing capabilities with native controls. The exact interaction can differ where mobile ergonomics demand it, but the capability must exist.

## Current Native Gap

Current file:

`parrotkit-app/src/features/recipes/screens/recipe-prompter-camera-screen.tsx`

Current behavior:

- uses `CameraView` only as preview;
- reads `getVisiblePrompterBlocks(activeScene)`;
- renders static `OverlayCueCard`;
- has scene switcher;
- has no `CameraViewRef`;
- has no `mode="video"`;
- has no `record()` / `stopRecording()`;
- has no `x/y/scale` mutation;
- has no text editing;
- has no review state;
- has no saved take state.

## File Structure

### Create

- `parrotkit-app/src/features/recipes/lib/prompter-layout.ts`
  - Shared native layout math: preset offsets, clamping, scale bounds, normalized position conversion.

- `parrotkit-app/src/features/recipes/components/native-prompter-block-overlay.tsx`
  - Draggable, pinch-scalable, editable cue block overlay.

- `parrotkit-app/src/features/recipes/components/native-prompter-toolbar.tsx`
  - Focused cue toolbar: color, smaller/larger, edit, hide, add cue.

- `parrotkit-app/src/features/recipes/components/native-take-review.tsx`
  - Recorded take review overlay using `expo-video`.

- `parrotkit-app/src/features/recipes/components/native-record-button.tsx`
  - Record/stop button and recording status.

### Modify

- `parrotkit-app/package.json`
  - Add `expo-video` through `npx expo install expo-video`.

- `parrotkit-app/app.json`
  - Add microphone permission strings for video recording with audio.

- `parrotkit-app/src/core/mocks/parrotkit-data.ts`
  - Add optional captured take fields to mock scene if provider persistence needs type support.

- `parrotkit-app/src/core/providers/mock-workspace-provider.tsx`
  - Add block layout/content/visibility mutation API.
  - Add custom block API.
  - Add scene recorded take API.

- `parrotkit-app/src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
  - Replace static cue rendering with movable/editable overlay.
  - Add recording, review, use-take, retry.

- `context/context_20260426_parrotkit_native_prompter_web_parity.md`
  - Record implementation and QA.

## Task 1: Install Video Review Dependency And Permissions

**Files:**
- Modify: `parrotkit-app/package.json`
- Modify: `parrotkit-app/package-lock.json`
- Modify: `parrotkit-app/app.json`

- [ ] **Step 1: Install Expo Video**

Run:

```bash
cd parrotkit-app
npx expo install expo-video
```

Expected: `expo-video` is added to `dependencies`, and lockfile updates only for the dependency install.

- [ ] **Step 2: Add microphone permissions**

In `parrotkit-app/app.json`, update `ios.infoPlist`:

```json
"NSMicrophoneUsageDescription": "Allow ParrotKit to record your voice while shooting recipe takes."
```

Update the `expo-camera` plugin:

```json
[
  "expo-camera",
  {
    "cameraPermission": "Allow ParrotKit to access your camera so you can shoot with recipe cues.",
    "microphonePermission": "Allow ParrotKit to record your voice while shooting recipe takes.",
    "recordAudioAndroid": true
  }
]
```

- [ ] **Step 3: Verify TypeScript**

Run:

```bash
cd parrotkit-app
npx tsc --noEmit
```

Expected: pass, with only the existing Node/npm engine warning if the local Node version is still `v20.15.0`.

- [ ] **Step 4: Commit**

```bash
git add parrotkit-app/package.json parrotkit-app/package-lock.json parrotkit-app/app.json
git commit -m "feat(app): enable native take review dependencies"
```

## Task 2: Add Prompter Layout Utilities

**Files:**
- Create: `parrotkit-app/src/features/recipes/lib/prompter-layout.ts`

- [ ] **Step 1: Create layout helper**

Add:

```ts
import { PrompterBlock, PrompterPositionPreset } from '@/features/recipes/types/recipe-domain';

export type PrompterPoint = {
  x: number;
  y: number;
};

export const PROMPTER_SCALE_MIN = 0.65;
export const PROMPTER_SCALE_MAX = 2.5;

export const presetOffsetMap: Record<PrompterPositionPreset, PrompterPoint> = {
  top: { x: 0.5, y: 0.14 },
  upperThird: { x: 0.5, y: 0.28 },
  center: { x: 0.5, y: 0.45 },
  lowerThird: { x: 0.5, y: 0.64 },
  bottom: { x: 0.5, y: 0.78 },
};

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function clampPrompterPoint(point: PrompterPoint) {
  return {
    x: clamp(point.x, 0.08, 0.92),
    y: clamp(point.y, 0.1, 0.84),
  };
}

export function normalizePrompterScale(value: number) {
  return clamp(value, PROMPTER_SCALE_MIN, PROMPTER_SCALE_MAX);
}

export function getBlockPoint(block: PrompterBlock) {
  return clampPrompterPoint({
    x: block.x ?? presetOffsetMap[block.positionPreset].x,
    y: block.y ?? presetOffsetMap[block.positionPreset].y,
  });
}

export function pointFromGesture({
  start,
  dx,
  dy,
  width,
  height,
}: {
  start: PrompterPoint;
  dx: number;
  dy: number;
  width: number;
  height: number;
}) {
  return clampPrompterPoint({
    x: start.x + dx / Math.max(width, 1),
    y: start.y + dy / Math.max(height, 1),
  });
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd parrotkit-app
npx tsc --noEmit
```

Expected: pass.

- [ ] **Step 3: Commit**

```bash
git add parrotkit-app/src/features/recipes/lib/prompter-layout.ts
git commit -m "feat(app): add native prompter layout helpers"
```

## Task 3: Extend Workspace Provider For Camera Editing

**Files:**
- Modify: `parrotkit-app/src/core/mocks/parrotkit-data.ts`
- Modify: `parrotkit-app/src/core/providers/mock-workspace-provider.tsx`

- [ ] **Step 1: Add recorded take type**

In `parrotkit-data.ts`, add:

```ts
export type MockRecordedTake = {
  uri: string;
  savedAt: string;
};
```

Extend `MockWorkspaceContextValue` later to use this type.

- [ ] **Step 2: Add full block update API**

In `mock-workspace-provider.tsx`, add to `MockWorkspaceContextValue`:

```ts
updateScenePrompterBlock: (
  recipeId: string,
  sceneId: string,
  blockId: string,
  updates: Partial<MockRecipeScene['prompter']['blocks'][number]>
) => void;
addScenePrompterBlock: (recipeId: string, sceneId: string) => string | null;
hideScenePrompterBlock: (recipeId: string, sceneId: string, blockId: string) => void;
getSceneRecordedTake: (recipeId: string, sceneId: string) => MockRecordedTake | null;
setSceneRecordedTake: (recipeId: string, sceneId: string, take: MockRecordedTake) => void;
clearSceneRecordedTake: (recipeId: string, sceneId: string) => void;
```

If the indexed access type is too noisy because `prompter` is optional, import `PrompterBlock` from `recipe-domain` and use:

```ts
updates: Partial<PrompterBlock>
```

- [ ] **Step 3: Implement `updateScenePrompterBlock`**

Add:

```ts
const updateScenePrompterBlock = useCallback((
  recipeId: string,
  sceneId: string,
  blockId: string,
  updates: Partial<PrompterBlock>
) => {
  setRecipes((currentRecipes) =>
    currentRecipes.map((recipe) => {
      if (recipe.id !== recipeId) return recipe;

      return {
        ...recipe,
        scenes: recipe.scenes.map((scene, sceneIndex) => {
          if (scene.id !== sceneId) return scene;

          const normalized = normalizeNativeRecipeScene(scene, sceneIndex, recipe.thumbnail);
          return {
            ...scene,
            prompter: {
              blocks: normalized.prompter.blocks.map((block) =>
                block.id === blockId
                  ? {
                      ...block,
                      ...updates,
                      content: typeof updates.content === 'string'
                        ? updates.content.trim() || block.content
                        : block.content,
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

Then rewrite `updateScenePrompterBlockVisibility` and `updateScenePrompterBlockContent` to call this generic function.

- [ ] **Step 4: Implement add/hide APIs**

Add:

```ts
const addScenePrompterBlock = useCallback((recipeId: string, sceneId: string) => {
  const newBlockId = `custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

  setRecipes((currentRecipes) =>
    currentRecipes.map((recipe) => {
      if (recipe.id !== recipeId) return recipe;

      return {
        ...recipe,
        scenes: recipe.scenes.map((scene, sceneIndex) => {
          if (scene.id !== sceneId) return scene;

          const normalized = normalizeNativeRecipeScene(scene, sceneIndex, recipe.thumbnail);
          const nextOrder = normalized.prompter.blocks.reduce((max, block) => Math.max(max, block.order), 0) + 1;

          return {
            ...scene,
            prompter: {
              blocks: [
                ...normalized.prompter.blocks,
                {
                  id: newBlockId,
                  type: 'keyword',
                  label: 'Cue',
                  content: 'New cue',
                  accentColor: 'blue',
                  visible: true,
                  size: 'md',
                  positionPreset: 'upperThird',
                  scale: 1,
                  order: nextOrder,
                },
              ],
            },
          };
        }),
      };
    })
  );

  return newBlockId;
}, []);

const hideScenePrompterBlock = useCallback((recipeId: string, sceneId: string, blockId: string) => {
  updateScenePrompterBlock(recipeId, sceneId, blockId, { visible: false });
}, [updateScenePrompterBlock]);
```

- [ ] **Step 5: Implement take state**

Add provider state:

```ts
type RecordedTakeState = Record<string, Record<string, MockRecordedTake>>;
const [recordedTakes, setRecordedTakes] = useState<RecordedTakeState>({});
```

Add:

```ts
const getSceneRecordedTake = useCallback(
  (recipeId: string, sceneId: string) => recordedTakes[recipeId]?.[sceneId] ?? null,
  [recordedTakes]
);

const setSceneRecordedTake = useCallback((recipeId: string, sceneId: string, take: MockRecordedTake) => {
  setRecordedTakes((current) => ({
    ...current,
    [recipeId]: {
      ...(current[recipeId] ?? {}),
      [sceneId]: take,
    },
  }));
}, []);

const clearSceneRecordedTake = useCallback((recipeId: string, sceneId: string) => {
  setRecordedTakes((current) => {
    const nextRecipe = { ...(current[recipeId] ?? {}) };
    delete nextRecipe[sceneId];

    return {
      ...current,
      [recipeId]: nextRecipe,
    };
  });
}, []);
```

- [ ] **Step 6: Verify TypeScript**

```bash
cd parrotkit-app
npx tsc --noEmit
```

Expected: pass.

- [ ] **Step 7: Commit**

```bash
git add parrotkit-app/src/core/mocks/parrotkit-data.ts parrotkit-app/src/core/providers/mock-workspace-provider.tsx
git commit -m "feat(app): persist native prompter edits and takes"
```

## Task 4: Build Movable Editable Block Overlay

**Files:**
- Create: `parrotkit-app/src/features/recipes/components/native-prompter-block-overlay.tsx`

- [ ] **Step 1: Create overlay component**

Add:

```tsx
import { useMemo, useRef, useState } from 'react';
import { PanResponder, StyleSheet, Text, TextInput, View } from 'react-native';

import {
  getBlockPoint,
  normalizePrompterScale,
  pointFromGesture,
  PrompterPoint,
} from '@/features/recipes/lib/prompter-layout';
import { PrompterBlock } from '@/features/recipes/types/recipe-domain';

type PrompterBlockUpdate = Partial<Pick<PrompterBlock, 'content' | 'scale' | 'x' | 'y'>>;

export function NativePrompterBlockOverlay({
  block,
  containerSize,
  focused,
  onFocus,
  onUpdate,
}: {
  block: PrompterBlock;
  containerSize: { width: number; height: number };
  focused: boolean;
  onFocus: () => void;
  onUpdate: (updates: PrompterBlockUpdate) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(block.content);
  const startPointRef = useRef<PrompterPoint>(getBlockPoint(block));
  const startScaleRef = useRef(block.scale ?? 1);
  const startDistanceRef = useRef<number | null>(null);
  const point = getBlockPoint(block);
  const scale = normalizePrompterScale(block.scale ?? 1);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !editing,
        onMoveShouldSetPanResponder: () => !editing,
        onPanResponderGrant: (event) => {
          onFocus();
          startPointRef.current = getBlockPoint(block);
          startScaleRef.current = block.scale ?? 1;
          startDistanceRef.current = getTouchDistance(event.nativeEvent.touches);
        },
        onPanResponderMove: (event, gesture) => {
          const touches = event.nativeEvent.touches;
          if (touches.length >= 2) {
            const nextDistance = getTouchDistance(touches);
            const startDistance = startDistanceRef.current;
            if (startDistance && nextDistance) {
              onUpdate({ scale: normalizePrompterScale(startScaleRef.current * (nextDistance / startDistance)) });
            }
            return;
          }

          const nextPoint = pointFromGesture({
            start: startPointRef.current,
            dx: gesture.dx,
            dy: gesture.dy,
            width: containerSize.width,
            height: containerSize.height,
          });
          onUpdate(nextPoint);
        },
        onPanResponderRelease: () => {
          startDistanceRef.current = null;
        },
        onPanResponderTerminate: () => {
          startDistanceRef.current = null;
        },
      }),
    [block, containerSize.height, containerSize.width, editing, onFocus, onUpdate]
  );

  const commitEdit = () => {
    const nextContent = draft.trim();
    if (nextContent && nextContent !== block.content) {
      onUpdate({ content: nextContent });
    }
    setEditing(false);
  };

  return (
    <View
      {...panResponder.panHandlers}
      style={[
        styles.block,
        getBlockTone(block),
        {
          left: point.x * containerSize.width,
          top: point.y * containerSize.height,
          transform: [{ translateX: -containerSize.width * 0.35 }, { scale }],
        },
        focused ? styles.focused : null,
      ]}
    >
      {editing ? (
        <TextInput
          autoFocus
          multiline
          value={draft}
          onBlur={commitEdit}
          onChangeText={setDraft}
          onSubmitEditing={commitEdit}
          style={styles.input}
        />
      ) : (
        <Text onLongPress={() => setEditing(true)} style={styles.text}>
          {block.content}
        </Text>
      )}
    </View>
  );
}

function getTouchDistance(touches: Array<{ pageX: number; pageY: number }>) {
  if (touches.length < 2) return null;
  const [first, second] = touches;
  return Math.hypot(second.pageX - first.pageX, second.pageY - first.pageY);
}

function getBlockTone(block: PrompterBlock) {
  if (block.type === 'key_line') return styles.keyLine;
  if (block.accentColor === 'coral') return styles.coral;
  if (block.accentColor === 'yellow') return styles.yellow;
  return styles.keyword;
}

const styles = StyleSheet.create({
  block: {
    position: 'absolute',
    width: '70%',
    borderWidth: 1.5,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 15,
  },
  focused: {
    shadowColor: '#ffffff',
    shadowOpacity: 0.25,
    shadowRadius: 18,
  },
  input: {
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 30,
  },
  text: {
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 30,
  },
  keyLine: {
    backgroundColor: 'rgba(255, 147, 107, 0.22)',
    borderColor: 'rgba(255, 181, 152, 0.68)',
  },
  keyword: {
    backgroundColor: 'rgba(139, 92, 246, 0.22)',
    borderColor: 'rgba(196, 181, 253, 0.68)',
  },
  coral: {
    backgroundColor: 'rgba(255, 122, 89, 0.22)',
    borderColor: 'rgba(255, 178, 153, 0.68)',
  },
  yellow: {
    backgroundColor: 'rgba(244, 215, 116, 0.22)',
    borderColor: 'rgba(244, 215, 116, 0.68)',
  },
});
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd parrotkit-app
npx tsc --noEmit
```

Expected: pass.

- [ ] **Step 3: Commit**

```bash
git add parrotkit-app/src/features/recipes/components/native-prompter-block-overlay.tsx
git commit -m "feat(app): add movable prompter block overlay"
```

## Task 5: Add Native Prompter Toolbar

**Files:**
- Create: `parrotkit-app/src/features/recipes/components/native-prompter-toolbar.tsx`

- [ ] **Step 1: Add toolbar component**

Add:

```tsx
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, Text, View } from 'react-native';

import { normalizePrompterScale } from '@/features/recipes/lib/prompter-layout';
import { PrompterBlock } from '@/features/recipes/types/recipe-domain';

export function NativePrompterToolbar({
  focusedBlock,
  onAddCue,
  onEditCue,
  onHideCue,
  onScaleCue,
}: {
  focusedBlock: PrompterBlock | null;
  onAddCue: () => void;
  onEditCue: () => void;
  onHideCue: () => void;
  onScaleCue: (scale: number) => void;
}) {
  return (
    <View className="items-center gap-3 px-4">
      {focusedBlock ? (
        <View className="flex-row items-center gap-2 rounded-full border border-white/12 bg-black/66 px-3 py-2">
          <ToolButton iconName="format-font-size-decrease" onPress={() => onScaleCue(normalizePrompterScale((focusedBlock.scale ?? 1) - 0.12))} />
          <ToolButton iconName="format-font-size-increase" onPress={() => onScaleCue(normalizePrompterScale((focusedBlock.scale ?? 1) + 0.12))} />
          <ToolButton iconName="pencil-outline" onPress={onEditCue} />
          <ToolButton iconName="eye-off-outline" onPress={onHideCue} />
        </View>
      ) : null}

      <Pressable className="h-12 w-12 items-center justify-center rounded-full bg-white" onPress={onAddCue}>
        <MaterialCommunityIcons color="#111827" name="plus" size={24} />
      </Pressable>
    </View>
  );
}

function ToolButton({
  iconName,
  onPress,
}: {
  iconName: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  onPress: () => void;
}) {
  return (
    <Pressable className="h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/8" onPress={onPress}>
      <MaterialCommunityIcons color="#fff" name={iconName} size={18} />
    </Pressable>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd parrotkit-app
npx tsc --noEmit
```

Expected: pass.

- [ ] **Step 3: Commit**

```bash
git add parrotkit-app/src/features/recipes/components/native-prompter-toolbar.tsx
git commit -m "feat(app): add native prompter toolbar"
```

## Task 6: Add Native Recording And Take Review

**Files:**
- Create: `parrotkit-app/src/features/recipes/components/native-record-button.tsx`
- Create: `parrotkit-app/src/features/recipes/components/native-take-review.tsx`

- [ ] **Step 1: Add record button**

Add:

```tsx
import { Pressable, Text, View } from 'react-native';

export function NativeRecordButton({
  recording,
  disabled,
  onPress,
}: {
  recording: boolean;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <View className="items-center gap-2">
      <Pressable
        disabled={disabled}
        className={`h-20 w-20 items-center justify-center rounded-full ${recording ? 'bg-red-500' : 'border-4 border-red-500 bg-white'} ${disabled ? 'opacity-45' : 'opacity-100'}`}
        onPress={onPress}
      >
        {recording ? (
          <View className="h-8 w-8 rounded-[8px] bg-white" />
        ) : (
          <View className="h-14 w-14 rounded-full bg-red-500" />
        )}
      </Pressable>
      {recording ? <Text className="text-xs font-bold text-red-100">REC</Text> : null}
    </View>
  );
}
```

- [ ] **Step 2: Add take review**

Add:

```tsx
import { useVideoPlayer, VideoView } from 'expo-video';
import { Pressable, Text, View } from 'react-native';

export function NativeTakeReview({
  uri,
  onRetry,
  onUseTake,
}: {
  uri: string;
  onRetry: () => void;
  onUseTake: () => void;
}) {
  const player = useVideoPlayer(uri, (instance) => {
    instance.loop = true;
    instance.play();
  });

  return (
    <View className="absolute inset-0 z-50 bg-black/88 px-5 py-6">
      <View className="flex-1 gap-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-[22px] font-black text-white">Review Take</Text>
          <Pressable className="rounded-full border border-white/15 bg-white/10 px-4 py-2" onPress={onRetry}>
            <Text className="text-sm font-semibold text-white">Close</Text>
          </Pressable>
        </View>

        <View className="flex-1 overflow-hidden rounded-[28px] border border-white/10 bg-black">
          <VideoView
            contentFit="contain"
            nativeControls
            player={player}
            style={{ flex: 1 }}
          />
        </View>

        <View className="grid grid-cols-2 gap-3">
          <Pressable className="rounded-[20px] border border-white/15 bg-white/10 px-4 py-4" onPress={onRetry}>
            <Text className="text-center text-sm font-semibold text-white">Retry</Text>
          </Pressable>
          <Pressable className="rounded-[20px] bg-white px-4 py-4" onPress={onUseTake}>
            <Text className="text-center text-sm font-black text-slate-950">Use Take</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
```

If NativeWind does not support `grid grid-cols-2` in React Native output, replace that wrapper with:

```tsx
<View className="flex-row gap-3">
```

and add `className="flex-1 ..."` to both buttons.

- [ ] **Step 3: Verify TypeScript**

```bash
cd parrotkit-app
npx tsc --noEmit
```

Expected: pass.

- [ ] **Step 4: Commit**

```bash
git add parrotkit-app/src/features/recipes/components/native-record-button.tsx parrotkit-app/src/features/recipes/components/native-take-review.tsx
git commit -m "feat(app): add native recording review components"
```

## Task 7: Rebuild Camera Screen Into Real Shooting Tool

**Files:**
- Modify: `parrotkit-app/src/features/recipes/screens/recipe-prompter-camera-screen.tsx`

- [ ] **Step 1: Add imports**

Add:

```ts
import { CameraType, CameraView, useCameraPermissions, useMicrophonePermissions, type CameraViewRef } from 'expo-camera';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';
import { NativePrompterBlockOverlay } from '@/features/recipes/components/native-prompter-block-overlay';
import { NativePrompterToolbar } from '@/features/recipes/components/native-prompter-toolbar';
import { NativeRecordButton } from '@/features/recipes/components/native-record-button';
import { NativeTakeReview } from '@/features/recipes/components/native-take-review';
```

Remove the static `OverlayCueCard` function after replacing usages.

- [ ] **Step 2: Pull new provider APIs**

Change:

```ts
const { getRecipeById } = useMockWorkspace();
```

to:

```ts
const {
  addScenePrompterBlock,
  getRecipeById,
  getSceneRecordedTake,
  hideScenePrompterBlock,
  setSceneRecordedTake,
  updateScenePrompterBlock,
} = useMockWorkspace();
```

- [ ] **Step 3: Add camera/recording state**

Add inside component:

```ts
const cameraRef = useRef<CameraViewRef | null>(null);
const recordingPromiseRef = useRef<Promise<{ uri: string } | undefined> | null>(null);
const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();
const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);
const [recording, setRecording] = useState(false);
const [reviewUri, setReviewUri] = useState<string | null>(null);
const [saveMessage, setSaveMessage] = useState<string | null>(null);
```

Add:

```ts
const savedTake = activeScene ? getSceneRecordedTake(recipe.id, activeScene.id) : null;
const focusedBlock = selectedBlocks.find((block) => block.id === focusedBlockId) ?? selectedBlocks[0] ?? null;
```

- [ ] **Step 4: Add block mutation callbacks**

Add:

```ts
const handleUpdateBlock = useCallback((blockId: string, updates: Partial<PrompterBlock>) => {
  if (!activeScene) return;
  updateScenePrompterBlock(recipe.id, activeScene.id, blockId, updates);
}, [activeScene, recipe.id, updateScenePrompterBlock]);

const handleAddCue = useCallback(() => {
  if (!activeScene) return;
  const blockId = addScenePrompterBlock(recipe.id, activeScene.id);
  if (blockId) {
    setFocusedBlockId(blockId);
  }
}, [activeScene, addScenePrompterBlock, recipe.id]);

const handleHideFocusedCue = useCallback(() => {
  if (!activeScene || !focusedBlock) return;
  hideScenePrompterBlock(recipe.id, activeScene.id, focusedBlock.id);
  setFocusedBlockId(null);
}, [activeScene, focusedBlock, hideScenePrompterBlock, recipe.id]);
```

- [ ] **Step 5: Add recording callbacks**

Add:

```ts
const startRecording = useCallback(async () => {
  if (!cameraRef.current || recording) return;

  if (!microphonePermission?.granted && microphonePermission?.canAskAgain) {
    await requestMicrophonePermission();
  }

  setReviewUri(null);
  setSaveMessage(null);
  setRecording(true);

  try {
    const promise = cameraRef.current.record({
      maxDuration: 90,
    });
    recordingPromiseRef.current = promise;
    const result = await promise;
    if (result?.uri) {
      setReviewUri(result.uri);
    }
  } catch (error) {
    console.warn('Native recording failed:', error);
  } finally {
    recordingPromiseRef.current = null;
    setRecording(false);
  }
}, [microphonePermission, recording, requestMicrophonePermission]);

const stopRecording = useCallback(() => {
  cameraRef.current?.stopRecording();
}, []);

const handleRecordPress = useCallback(() => {
  if (recording) {
    stopRecording();
    return;
  }

  void startRecording();
}, [recording, startRecording, stopRecording]);
```

- [ ] **Step 6: Add review callbacks**

Add:

```ts
const handleRetryTake = useCallback(() => {
  setReviewUri(null);
}, []);

const handleUseTake = useCallback(() => {
  if (!activeScene || !reviewUri) return;

  setSceneRecordedTake(recipe.id, activeScene.id, {
    uri: reviewUri,
    savedAt: 'Saved just now',
  });
  setReviewUri(null);
  setSaveMessage('Take saved');
}, [activeScene, recipe.id, reviewUri, setSceneRecordedTake]);
```

- [ ] **Step 7: Render `CameraView` in video mode**

Change `CameraView` to:

```tsx
<CameraView
  ref={cameraRef}
  active
  animateShutter={false}
  facing={facing}
  mirror={facing === 'front'}
  mode="video"
  mute={!microphonePermission?.granted}
  style={styles.camera}
/>
```

- [ ] **Step 8: Render movable cue overlays**

Replace the center static block area with:

```tsx
<View
  pointerEvents="box-none"
  className="flex-1"
  onLayout={(event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerSize({ width, height });
  }}
>
  {containerSize.width > 0 && selectedBlocks.map((block) => (
    <NativePrompterBlockOverlay
      key={block.id}
      block={block}
      containerSize={containerSize}
      focused={focusedBlockId === block.id}
      onFocus={() => setFocusedBlockId(block.id)}
      onUpdate={(updates) => handleUpdateBlock(block.id, updates)}
    />
  ))}
</View>
```

- [ ] **Step 9: Render toolbar, record button, scene switcher**

In bottom controls, render:

```tsx
<View className="gap-4">
  <NativePrompterToolbar
    focusedBlock={focusedBlock}
    onAddCue={handleAddCue}
    onEditCue={() => {
      if (focusedBlock) setFocusedBlockId(focusedBlock.id);
    }}
    onHideCue={handleHideFocusedCue}
    onScaleCue={(scale) => {
      if (focusedBlock) handleUpdateBlock(focusedBlock.id, { scale });
    }}
  />

  <View className="items-center">
    <NativeRecordButton recording={recording} onPress={handleRecordPress} />
    {saveMessage ? <Text className="mt-2 text-xs font-semibold text-white/75">{saveMessage}</Text> : null}
    {savedTake ? <Text className="mt-1 text-xs font-semibold text-white/55">{savedTake.savedAt}</Text> : null}
  </View>

  <ShootingSceneSwitcher
    activeSceneId={activeScene.id}
    onSelectScene={setActiveSceneId}
    scenes={recipe.scenes}
  />
</View>
```

- [ ] **Step 10: Render review overlay**

Near the end of return:

```tsx
{reviewUri ? (
  <NativeTakeReview
    uri={reviewUri}
    onRetry={handleRetryTake}
    onUseTake={handleUseTake}
  />
) : null}
```

- [ ] **Step 11: Verify TypeScript**

```bash
cd parrotkit-app
npx tsc --noEmit
```

Expected: pass.

- [ ] **Step 12: Commit**

```bash
git add parrotkit-app/src/features/recipes/screens/recipe-prompter-camera-screen.tsx
git commit -m "feat(app): make native prompter interactive and recordable"
```

## Task 8: Native QA

**Files:**
- Modify: `context/context_20260426_parrotkit_native_prompter_web_parity.md`

- [ ] **Step 1: Start dev server**

Run:

```bash
cd parrotkit-app
npx expo start --dev-client --localhost --port 8082
```

Expected: Metro bundles successfully.

- [ ] **Step 2: Open app on simulator**

Run:

```bash
xcrun simctl openurl booted 'parrotkit-app://expo-development-client/?url=http%3A%2F%2F127.0.0.1%3A8082'
```

Then:

```bash
xcrun simctl openurl booted 'parrotkit-app:///recipe/recipe-korean-diet-hook/prompter?sceneId=scene-1'
```

- [ ] **Step 3: Verify interactions manually**

On iOS simulator:

- cue card appears over camera;
- drag a cue and confirm it stays where dropped;
- pinch a cue or use toolbar size controls and confirm size changes;
- long press/edit a cue and confirm text changes;
- add cue and confirm new cue appears;
- hide cue and confirm it disappears;
- record button starts REC state;
- stop button opens review overlay;
- Use Take saves the take message;
- scene switcher changes scene and cue content.

- [ ] **Step 4: Capture screenshots**

Run:

```bash
mkdir -p output/playwright
xcrun simctl io booted screenshot output/playwright/native-prompter-web-parity.png
```

If review overlay is visible:

```bash
xcrun simctl io booted screenshot output/playwright/native-prompter-review.png
```

- [ ] **Step 5: Final type check**

```bash
cd parrotkit-app
npx tsc --noEmit
```

Expected: pass.

- [ ] **Step 6: Write context**

Create `context/context_20260426_parrotkit_native_prompter_web_parity.md`:

```md
# ParrotKit Native Prompter Web Parity Context

## Date
2026-04-26

## Summary
Implemented native prompter web parity: movable/editable/scalable cues, add/hide cue controls, video recording, take review, and saved take state.

## Verification
- `cd parrotkit-app && npx tsc --noEmit`
- `cd parrotkit-app && npx expo start --dev-client --localhost --port 8082`
- iOS simulator: drag cue, edit text, resize cue, add cue, hide cue, record, review, use take.

## Evidence
- `output/playwright/native-prompter-web-parity.png`
- `output/playwright/native-prompter-review.png`

## Notes
- Simulator camera may show placeholder/dark feed, but recording API and overlay UI must still be exercised.
```

- [ ] **Step 7: Commit**

```bash
git add context/context_20260426_parrotkit_native_prompter_web_parity.md output/playwright/native-prompter-web-parity.png output/playwright/native-prompter-review.png
git commit -m "docs: record native prompter parity qa"
```

If screenshot artifacts should not be committed because `output/` is ignored, commit only the context document and mention screenshot paths in final response.

## Task 9: Rebase, Push, And Finish

**Files:**
- None unless conflict resolution changes files.

- [ ] **Step 1: Rebase on latest dev**

Run:

```bash
git fetch origin
git rebase origin/dev
```

Expected: clean rebase. If macOS metadata files interfere, run:

```bash
make cl
git rebase origin/dev
```

- [ ] **Step 2: Verify after rebase**

Run:

```bash
cd parrotkit-app
npx tsc --noEmit
```

Expected: pass.

- [ ] **Step 3: Push feature branch**

Run:

```bash
git push -u origin codex/app-recipe-web-parity
```

Expected: branch pushes successfully.

- [ ] **Step 4: Complete branch workflow**

Use `superpowers:finishing-a-development-branch`.

Recommended option for this work:

```text
2. Push and create a Pull Request
```

Reason: the branch now contains the earlier scene parity work plus this larger native shooting parity. It should be reviewed as one coherent mobile app UX change before landing to `dev`.

## Rollback

If recording introduces native runtime problems:

```bash
git revert <commit-native-recording-screen>
git revert <commit-recording-review-components>
```

Keep the scene parity and provider block model if they are stable.

If provider mutation causes data issues:

```bash
git revert <commit-provider-prompter-edits>
```

Then restore static cue display temporarily while keeping `prompter.blocks`.

## Self-Review

- Spec coverage: This plan directly covers the user's missing functionality: move, edit, resize, add/hide, record, review, and use take.
- Web parity: Each native task maps back to a capability already present in `src/components/common/CameraShooting.tsx`.
- Type consistency: The plan uses existing `PrompterBlock` fields `content`, `visible`, `scale`, `x`, `y`, `positionPreset`, and `order`.
- Dependency risk: `expo-video` is explicitly installed for take review because the app currently lacks a video playback dependency.
- Verification: The plan includes TypeScript checks and simulator QA for all user-visible shooting interactions.
