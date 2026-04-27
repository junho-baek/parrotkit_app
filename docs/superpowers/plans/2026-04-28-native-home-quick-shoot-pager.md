# Native Home Quick Shoot Pager Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace fake swipe preview panels with a real three-page native pager where Home stays alive, Quick Shoot UI is mounted but camera-inactive, and the camera activates when Quick Shoot exposure reaches 70%.

**Architecture:** Build a local pager around three sibling pages ordered `[RecipeDraftPreview, QuickShoot, Home]`. Home is the default active page, Quick Shoot remains mounted with its UI state alive, and `CameraView` only mounts/activates when the pager is settled on Quick Shoot or the drag exposure for Quick Shoot crosses 70%. Keep the standalone `/quick-shoot` route as a compatibility wrapper around the same Quick Shoot surface.

**Tech Stack:** Expo Router, React Native `Animated`, Expo Camera, Expo Media Library, NativeWind, existing mock workspace provider.

---

## Current State Notes

- Branch is `dev`.
- Existing committed baseline includes `dddb109 Add quick shoot swipe recipe flow`.
- There is uncommitted WIP from the interrupted fake-preview attempt:
  - `parrotkit-app/src/features/home/screens/home-screen.tsx`
  - `parrotkit-app/src/features/recipes/screens/quick-shoot-camera-screen.tsx`
  - `plans/20260428_native_swipe_live_previews.md`
  - `context/context_20260428_native_swipe_live_previews.md`
- Do not `git reset` or discard user-visible work. Replace the fake preview code as part of the edits in this plan, then decide whether to keep or supersede the WIP plan/context notes in the final context.

## File Structure

- Modify `parrotkit-app/src/app/(tabs)/index.tsx`
  - Export the new pager screen instead of exporting `HomeScreen` directly.
- Modify `parrotkit-app/src/features/home/screens/home-screen.tsx`
  - Convert to a thin compatibility wrapper or re-export of the pager screen.
  - Remove `QuickShootPeekPanel`, direct `/quick-shoot` push-on-swipe, and fake camera preview styles.
- Create `parrotkit-app/src/features/home/screens/home-quick-shoot-pager-screen.tsx`
  - Own pager state, page offsets, gesture handling, 70% camera prewarm state, and recipe creation navigation.
- Create `parrotkit-app/src/features/home/components/home-workspace-surface.tsx`
  - Render the real Home UI without pager/backdrop logic.
  - Keep Home mounted and scroll state alive while paging to Quick Shoot.
- Create `parrotkit-app/src/features/recipes/screens/quick-shoot-camera-surface.tsx`
  - Extract Quick Shoot UI, cue state, recording, gallery save, and toolbar from the current screen.
  - Accept `cameraActive`, `onExitHome`, `onBlocksChange`, and `onPrompterInteractionChange`.
- Modify `parrotkit-app/src/features/recipes/screens/quick-shoot-camera-screen.tsx`
  - Become a small standalone route wrapper around `QuickShootCameraSurface`.
  - Remove `QuickShootSwipeBackdrop`, fake Home/Recipe panels, and screen-level route gestures.
- Modify `parrotkit-app/src/features/recipes/components/native-prompter-block-overlay.tsx`
  - Add optional interaction callbacks so pager swipes do not fight prompt dragging.
- Create `parrotkit-app/src/features/recipes/components/quick-shoot-recipe-draft-preview.tsx`
  - Render a recipe overview-style page for the left side of the pager before a recipe exists.
- Create `plans/20260428_native_home_quick_shoot_pager.md`
  - Repo-local implementation note required by `AGENTS.md`.
- Create `context/context_20260428_native_home_quick_shoot_pager.md`
  - Completion context after implementation.

---

## Task 1: Add Repo Plan And Preserve Dirty-State Intent

**Files:**
- Create: `plans/20260428_native_home_quick_shoot_pager.md`

- [ ] **Step 1: Write the repo-local plan note**

Create `plans/20260428_native_home_quick_shoot_pager.md` with:

```markdown
# 20260428 Native Home Quick Shoot Pager

## 배경
- 현재 Home/Quick Shoot swipe는 실제 화면이 나란히 있는 구조가 아니라 fake preview panel을 뒤에 깔아둔 구조다.
- 사용자는 Instagram처럼 Home과 Camera 실제 UI가 서로 옆에 있고 현재 화면이 밀리며 다음 화면이 드러나는 감각을 원한다.
- Quick Shoot 카메라는 평소에는 꺼져 있어야 하며, Home은 살아있는 상태를 유지해야 한다.

## 목표
- Home, Quick Shoot, Recipe Draft Preview를 같은 pager 안의 sibling page로 구성한다.
- Home은 기본 active page이고, 스와이프 중에도 실제 Home UI가 유지된다.
- Quick Shoot UI는 mount되어 있지만 CameraView는 Quick Shoot 노출률이 70% 이상이거나 Quick Shoot에 settle되었을 때만 활성화된다.
- Quick Shoot에서 왼쪽에서 오른쪽으로 밀면 현재 cue들을 recipe로 만들고 recipe detail로 이동한다.
- Quick Shoot에서 오른쪽에서 왼쪽으로 밀면 Home page로 settle된다.

## 범위
- Native Home/Quick Shoot paging architecture.
- Quick Shoot surface extraction.
- Prompt drag와 page swipe 충돌 방지.
- 기존 native recording/gallery save 기능 유지.

## 변경 파일
- `parrotkit-app/src/app/(tabs)/index.tsx`
- `parrotkit-app/src/features/home/screens/home-screen.tsx`
- `parrotkit-app/src/features/home/screens/home-quick-shoot-pager-screen.tsx`
- `parrotkit-app/src/features/home/components/home-workspace-surface.tsx`
- `parrotkit-app/src/features/recipes/screens/quick-shoot-camera-screen.tsx`
- `parrotkit-app/src/features/recipes/screens/quick-shoot-camera-surface.tsx`
- `parrotkit-app/src/features/recipes/components/native-prompter-block-overlay.tsx`
- `parrotkit-app/src/features/recipes/components/quick-shoot-recipe-draft-preview.tsx`

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`
- `8081` Metro real-device dev-client launch.
- Home -> Quick Shoot left-to-right swipe: Home moves, real Quick Shoot UI appears, camera activates after 70% exposure.
- Quick Shoot -> Home right-to-left swipe: real Home UI appears and camera deactivates after settle.
- Quick Shoot -> Recipe left-to-right swipe: recipe is created from visible cue blocks and recipe detail opens.
- Prompt block drag does not trigger page navigation.

## 롤백
- `(tabs)/index.tsx`를 기존 `HomeScreen` export로 되돌린다.
- `HomeQuickShootPagerScreen`, `HomeWorkspaceSurface`, `QuickShootCameraSurface`, `QuickShootRecipeDraftPreview` 추가 파일을 제거한다.
- `quick-shoot-camera-screen.tsx`를 standalone full screen 구현으로 되돌린다.

## 리스크
- CameraView를 너무 일찍 mount하면 권한, 발열, 배터리 비용이 커질 수 있다.
- 70% activation threshold와 settle/cancel deactivation을 명확히 분리해야 한다.
- Prompt drag와 page swipe가 같은 touch stream을 공유하므로 prompter interaction guard가 필요하다.
```

- [ ] **Step 2: Verify the note exists**

Run:

```bash
test -f plans/20260428_native_home_quick_shoot_pager.md && sed -n '1,80p' plans/20260428_native_home_quick_shoot_pager.md
```

Expected: the command prints the plan title and required sections.

---

## Task 2: Extract Real Home Surface

**Files:**
- Create: `parrotkit-app/src/features/home/components/home-workspace-surface.tsx`
- Modify: `parrotkit-app/src/features/home/screens/home-screen.tsx`
- Modify: `parrotkit-app/src/app/(tabs)/index.tsx`

- [ ] **Step 1: Create the Home surface component**

Create `parrotkit-app/src/features/home/components/home-workspace-surface.tsx`. Move the existing Home content markup from `HomeScreen` into this file, but omit these fake-preview/pager pieces:

```tsx
<QuickShootPeekPanel />
```

```tsx
const homeTranslateX = useRef(new Animated.Value(0)).current;
const swipeStartRef = useRef({ x: 0, y: 0 });
const swipeTriggeredRef = useRef(false);
const openQuickShoot = useCallback(() => {
  router.push('/quick-shoot' as Href);
}, [router]);
```

Use this public component shape:

```tsx
import { Href, useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useMockWorkspace } from '@/core/providers/mock-workspace-provider';
import { brandActionGradient } from '@/core/theme/colors';
import { AppScreenScrollView } from '@/core/ui/app-screen-scroll-view';
import { MediaTileCard } from '@/core/ui/media-tile-card';

const compactFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

export function HomeWorkspaceSurface() {
  const router = useRouter();
  const { homeStats, recentReferences, recipes } = useMockWorkspace();

  return (
    <View className="flex-1 bg-canvas">
      <AppScreenScrollView>
        <View className="gap-5 px-5">
          <View className="gap-1">
            <Text className="text-[32px] font-black leading-[36px] text-ink">Welcome!</Text>
            <Text className="text-[15px] font-medium text-ink">Your creative workspace</Text>
          </View>

          <View className="flex-row gap-2.5">
            <StatCard tone="blue" title="References" value={String(homeStats.references)} />
            <StatCard tone="violet" title="Recipes" value={String(homeStats.recipes)} />
            <StatCard tone="rose" title="Views" value={compactFormatter.format(homeStats.views)} />
          </View>

          <PressableAction
            body="Turn viral videos into actionable recipes"
            cta="+ New"
            onPress={() => router.push('/source-actions' as Href)}
            title="Create Recipe"
          />

          {recipes[0] ? (
            <View className="gap-2 rounded-[28px] border border-stroke bg-surface px-5 py-5">
              <Text className="text-[12px] font-semibold uppercase tracking-[0.8px] text-muted">Latest draft</Text>
              <Text className="text-[22px] font-black leading-[28px] text-ink">{recipes[0].title}</Text>
              <Text className="text-sm leading-6 text-muted">{recipes[0].summary}</Text>
              <View className="flex-row gap-2">
                <Chip label={recipes[0].platform} />
                <Chip label={recipes[0].goal} />
              </View>
            </View>
          ) : null}

          <View className="gap-3">
            <Text className="text-[18px] font-bold text-ink">Recent References</Text>
            <View className="flex-row flex-wrap gap-3">
              {recentReferences.map((reference) => (
                <View key={reference.id} className="w-[48%]">
                  <MediaTileCard
                    actionLabel={reference.recipeId ? 'Open Recipe' : 'Paste Again'}
                    actionTone={reference.recipeId ? 'brand' : 'neutral'}
                    leftMetric={{ icon: 'eye', value: reference.views }}
                    onAction={() =>
                      reference.recipeId
                        ? router.push(`/recipe/${reference.recipeId}` as Href)
                        : router.push('/source-actions' as Href)
                    }
                    onPress={() =>
                      reference.recipeId
                        ? router.push(`/recipe/${reference.recipeId}` as Href)
                        : router.push('/source-actions' as Href)
                    }
                    subtitle={reference.creator}
                    thumbnail={reference.thumbnail}
                    title={reference.title}
                    topLeftLabel="NEW"
                    topLeftTone="brand"
                    topRightLabel={reference.duration}
                  />
                </View>
              ))}
            </View>
          </View>
        </View>
      </AppScreenScrollView>
    </View>
  );
}
```

Then copy the existing `StatCard`, `Chip`, and `PressableAction` helper components into the same file. Preserve the existing `brandActionGradient` usage.

- [ ] **Step 2: Replace `HomeScreen` with a pager wrapper**

Edit `parrotkit-app/src/features/home/screens/home-screen.tsx` to:

```tsx
export { HomeQuickShootPagerScreen as HomeScreen } from '@/features/home/screens/home-quick-shoot-pager-screen';
```

This removes direct Home swipe routing from `HomeScreen` and leaves pager ownership to the new screen.

- [ ] **Step 3: Keep tab index export stable**

Edit `parrotkit-app/src/app/(tabs)/index.tsx` to keep the same public default:

```tsx
export { HomeScreen as default } from '@/features/home/screens/home-screen';
```

- [ ] **Step 4: Run TypeScript to catch missing helper imports**

Run:

```bash
cd parrotkit-app && npx tsc --noEmit
```

Expected: FAIL if helper components or imports were not copied correctly. Fix only the missing imports or JSX helper names, then re-run until the command exits 0.

---

## Task 3: Extract Quick Shoot Surface With Lazy Camera Activation

**Files:**
- Create: `parrotkit-app/src/features/recipes/screens/quick-shoot-camera-surface.tsx`
- Modify: `parrotkit-app/src/features/recipes/screens/quick-shoot-camera-screen.tsx`

- [ ] **Step 1: Create `QuickShootCameraSurfaceProps`**

Create the top of `parrotkit-app/src/features/recipes/screens/quick-shoot-camera-surface.tsx` with:

```tsx
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  CameraType,
  CameraView,
  useCameraPermissions,
  useMicrophonePermissions,
} from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import * as MediaLibrary from 'expo-media-library';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NativePrompterBlockOverlay } from '@/features/recipes/components/native-prompter-block-overlay';
import { NativePrompterToolbar } from '@/features/recipes/components/native-prompter-toolbar';
import { NativeRecordButton } from '@/features/recipes/components/native-record-button';
import {
  NativeTakeReview,
  type NativeGallerySaveStatus,
} from '@/features/recipes/components/native-take-review';
import type { PrompterBlock } from '@/features/recipes/types/recipe-domain';

export type QuickShootCameraSurfaceProps = {
  cameraActive: boolean;
  onBlocksChange?: (blocks: PrompterBlock[]) => void;
  onExitHome: () => void;
  onPrompterInteractionChange?: (active: boolean) => void;
};
```

- [ ] **Step 2: Move Quick Shoot state and controls into the surface**

Move the existing state and helper functions from `QuickShootCameraScreen` into `QuickShootCameraSurface`. Keep this initial block definition at module scope:

```tsx
const initialBlocks: PrompterBlock[] = [
  {
    accentColor: 'blue',
    content: 'Double-tap to write your line.',
    id: 'quick-cue-1',
    order: 0,
    positionPreset: 'center',
    scale: 1,
    size: 'lg',
    type: 'key_line',
    visible: true,
    x: 0.5,
    y: 0.44,
  },
];
```

Inside `QuickShootCameraSurface`, add this effect after `blocks` state is declared:

```tsx
useEffect(() => {
  onBlocksChange?.(blocks);
}, [blocks, onBlocksChange]);
```

- [ ] **Step 3: Gate CameraView by `cameraActive`**

Replace the unconditional `CameraView` render with:

```tsx
{cameraActive && permission?.granted ? (
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
) : (
  <DormantCameraSurface />
)}
```

Add this dormant surface in the same file:

```tsx
function DormantCameraSurface() {
  return (
    <View style={styles.dormantCamera}>
      <LinearGradient
        colors={['#0f172a', '#020617', '#111827']}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.dormantLens}>
        <MaterialCommunityIcons color="rgba(255,255,255,0.82)" name="camera-iris" size={52} />
      </View>
    </View>
  );
}
```

Add these styles:

```tsx
dormantCamera: {
  ...StyleSheet.absoluteFillObject,
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 0,
},
dormantLens: {
  alignItems: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderColor: 'rgba(255, 255, 255, 0.16)',
  borderRadius: 999,
  borderWidth: 1,
  height: 112,
  justifyContent: 'center',
  width: 112,
},
```

- [ ] **Step 4: Defer camera permission gate until camera is active**

Change the permission early returns to:

```tsx
if (cameraActive && !permission) {
  return <View className="flex-1 bg-slate-950" />;
}

if (cameraActive && permission && !permission.granted) {
  return <CameraPermissionGate onBack={onExitHome} onRequest={requestPermission} />;
}
```

Expected behavior: when Quick Shoot is mounted beside Home but not active, it shows dormant UI without requesting camera permission.

- [ ] **Step 5: Make record button inactive while camera is dormant**

Change `NativeRecordButton` props to:

```tsx
<NativeRecordButton
  disabled={!cameraActive || Boolean(reviewUri)}
  onPress={handleRecordPress}
  recording={recording}
/>
```

At the top of `handleRecordPress`, add:

```tsx
if (!cameraActive) {
  setSaveMessage('Slide fully into Quick Shoot to record.');
  return;
}
```

Include `cameraActive` in the callback dependency list.

- [ ] **Step 6: Replace standalone route with wrapper**

Edit `parrotkit-app/src/features/recipes/screens/quick-shoot-camera-screen.tsx` to:

```tsx
import { Href, useRouter } from 'expo-router';
import { useCallback } from 'react';

import { QuickShootCameraSurface } from '@/features/recipes/screens/quick-shoot-camera-surface';

export function QuickShootCameraScreen() {
  const router = useRouter();

  const handleExitHome = useCallback(() => {
    router.replace('/(tabs)' as Href);
  }, [router]);

  return (
    <QuickShootCameraSurface
      cameraActive
      onExitHome={handleExitHome}
    />
  );
}
```

This preserves `/quick-shoot` for direct route launch while the Home tab moves to the real pager.

- [ ] **Step 7: Run TypeScript**

Run:

```bash
cd parrotkit-app && npx tsc --noEmit
```

Expected: PASS after imports and callback dependencies are fixed.

---

## Task 4: Add Prompter Interaction Guard

**Files:**
- Modify: `parrotkit-app/src/features/recipes/components/native-prompter-block-overlay.tsx`
- Modify: `parrotkit-app/src/features/recipes/screens/quick-shoot-camera-surface.tsx`

- [ ] **Step 1: Add optional prop**

In `NativePrompterBlockOverlay` props, add:

```tsx
onInteractionActiveChange?: (active: boolean) => void;
```

- [ ] **Step 2: Notify on prompt drag start/end**

Inside `PanResponder.create`, update these handlers:

```tsx
onPanResponderGrant: (event) => {
  onInteractionActiveChange?.(true);
  onFocus();
  // keep existing grant logic below this line
},
```

```tsx
onPanResponderRelease: () => {
  onInteractionActiveChange?.(false);
  commitGestureUpdates();
},
```

```tsx
onPanResponderTerminate: () => {
  onInteractionActiveChange?.(false);
  commitGestureUpdates();
},
```

Include `onInteractionActiveChange` in the `useMemo` dependency list that creates the pan responder.

- [ ] **Step 3: Pass the guard from Quick Shoot surface**

In the `visibleBlocks.map` render inside `QuickShootCameraSurface`, pass:

```tsx
onInteractionActiveChange={onPrompterInteractionChange}
```

Expected behavior: when a cue is dragged, the pager will not treat that drag as a page swipe.

- [ ] **Step 4: Run TypeScript**

Run:

```bash
cd parrotkit-app && npx tsc --noEmit
```

Expected: PASS.

---

## Task 5: Add Recipe Draft Preview Page

**Files:**
- Create: `parrotkit-app/src/features/recipes/components/quick-shoot-recipe-draft-preview.tsx`

- [ ] **Step 1: Create a screen-like recipe preview component**

Create `parrotkit-app/src/features/recipes/components/quick-shoot-recipe-draft-preview.tsx` with:

```tsx
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { PrompterBlock } from '@/features/recipes/types/recipe-domain';

type QuickShootRecipeDraftPreviewProps = {
  blocks: PrompterBlock[];
};

export function QuickShootRecipeDraftPreview({ blocks }: QuickShootRecipeDraftPreviewProps) {
  const insets = useSafeAreaInsets();
  const visibleBlocks = blocks
    .filter((block) => block.visible)
    .sort((first, second) => first.order - second.order);
  const sceneBlocks = visibleBlocks.length > 0 ? visibleBlocks : blocks.slice(0, 1);

  return (
    <View className="flex-1 bg-canvas px-5" style={{ paddingTop: insets.top + 12 }}>
      <View className="flex-row items-center justify-between">
        <View className="h-10 w-10 items-center justify-center rounded-full border border-stroke bg-surface">
          <MaterialCommunityIcons color="#111827" name="arrow-left" size={18} />
        </View>
        <Text className="text-[12px] font-black uppercase tracking-[0.8px] text-muted">
          Recipe
        </Text>
        <View className="h-10 w-10" />
      </View>

      <View className="mt-7 gap-2">
        <Text className="text-[32px] font-black leading-[36px] text-ink">Quick Shoot Recipe</Text>
        <Text className="text-[15px] font-semibold leading-6 text-muted">
          {sceneBlocks.length} cue{sceneBlocks.length === 1 ? '' : 's'} ready to become cut-by-cut scenes.
        </Text>
      </View>

      <View className="mt-6 gap-3">
        {sceneBlocks.slice(0, 4).map((block, index) => (
          <View
            key={block.id}
            className="flex-row gap-3 rounded-[24px] border border-stroke bg-surface px-4 py-4"
          >
            <Text className="text-[13px] font-black text-violet">
              {String(index + 1).padStart(2, '0')}
            </Text>
            <View className="flex-1 gap-1">
              <Text className="text-[16px] font-black leading-5 text-ink" numberOfLines={2}>
                {block.content.trim() || `Cut ${index + 1}`}
              </Text>
              <Text className="text-[12px] font-semibold leading-5 text-muted">
                This cue becomes one shootable scene.
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
```

- [ ] **Step 2: Run TypeScript**

Run:

```bash
cd parrotkit-app && npx tsc --noEmit
```

Expected: PASS.

---

## Task 6: Build The Three-Page Pager

**Files:**
- Create: `parrotkit-app/src/features/home/screens/home-quick-shoot-pager-screen.tsx`
- Modify: `parrotkit-app/src/features/home/screens/home-screen.tsx`

- [ ] **Step 1: Create pager constants and state**

Create `parrotkit-app/src/features/home/screens/home-quick-shoot-pager-screen.tsx` with this starting structure:

```tsx
import { Href, useRouter } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  useWindowDimensions,
  type GestureResponderEvent,
} from 'react-native';

import { useMockWorkspace } from '@/core/providers/mock-workspace-provider';
import { HomeWorkspaceSurface } from '@/features/home/components/home-workspace-surface';
import { QuickShootRecipeDraftPreview } from '@/features/recipes/components/quick-shoot-recipe-draft-preview';
import { QuickShootCameraSurface } from '@/features/recipes/screens/quick-shoot-camera-surface';
import type { PrompterBlock } from '@/features/recipes/types/recipe-domain';

type PagerPage = 'recipe' | 'quick' | 'home';

const PAGE_INDEX: Record<PagerPage, number> = {
  recipe: 0,
  quick: 1,
  home: 2,
};

const QUICK_CAMERA_EXPOSURE_THRESHOLD = 0.7;

export function HomeQuickShootPagerScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { createQuickShootRecipe } = useMockWorkspace();
  const [activePage, setActivePage] = useState<PagerPage>('home');
  const [quickCameraWarm, setQuickCameraWarm] = useState(false);
  const [prompterInteractionActive, setPrompterInteractionActive] = useState(false);
  const quickBlocksRef = useRef<PrompterBlock[]>([]);
  const translateX = useRef(new Animated.Value(0)).current;
  const dragStartRef = useRef({ x: 0, y: 0, offset: 0 });
  const swipeTriggeredRef = useRef(false);

  const pageOffset = useCallback((page: PagerPage) => -PAGE_INDEX[page] * width, [width]);

  return <View style={styles.root} />;
}
```

- [ ] **Step 2: Initialize pager offset when width is known**

Add this computed value inside the component:

```tsx
const homeOffset = useMemo(() => pageOffset('home'), [pageOffset]);
```

Add this callback:

```tsx
const resetToActivePage = useCallback((page: PagerPage) => {
  translateX.setValue(pageOffset(page));
}, [pageOffset, translateX]);
```

When `width` is `0`, render an empty root:

```tsx
if (width <= 0) {
  return <View style={styles.root} />;
}
```

Before that return, ensure the initial render starts on Home:

```tsx
if (dragStartRef.current.offset === 0 && activePage === 'home') {
  translateX.setValue(homeOffset);
  dragStartRef.current.offset = homeOffset;
}
```

- [ ] **Step 3: Add exposure calculation and camera warm setter**

Add:

```tsx
const updateQuickCameraWarm = useCallback((nextOffset: number, nextPage: PagerPage = activePage) => {
  const quickOffset = pageOffset('quick');
  const quickExposure = Math.max(0, Math.min(1, 1 - Math.abs(nextOffset - quickOffset) / width));
  const shouldWarm = nextPage === 'quick' || quickExposure >= QUICK_CAMERA_EXPOSURE_THRESHOLD;

  setQuickCameraWarm((current) => (current === shouldWarm ? current : shouldWarm));
}, [activePage, pageOffset, width]);
```

Expected behavior:
- Home settled offset: Quick exposure `0`, camera inactive.
- Home dragged 70% toward Quick: Quick exposure `0.7`, camera active.
- Quick settled offset: camera active.
- Quick dragged back to Home and settled: camera inactive.

- [ ] **Step 4: Add settle animation**

Add:

```tsx
const settleToPage = useCallback((page: PagerPage, afterSettle?: () => void) => {
  const targetOffset = pageOffset(page);

  Animated.timing(translateX, {
    duration: 210,
    easing: Easing.out(Easing.cubic),
    toValue: targetOffset,
    useNativeDriver: true,
  }).start(({ finished }) => {
    if (!finished) return;

    setActivePage(page);
    updateQuickCameraWarm(targetOffset, page);
    dragStartRef.current.offset = targetOffset;
    afterSettle?.();
  });
}, [pageOffset, translateX, updateQuickCameraWarm]);
```

- [ ] **Step 5: Add route action for recipe creation**

Add:

```tsx
const createRecipeFromQuickShoot = useCallback(() => {
  const recipe = createQuickShootRecipe({
    blocks: quickBlocksRef.current,
    title: 'Quick Shoot Recipe',
  });

  router.push(`/recipe/${recipe.id}` as Href);
}, [createQuickShootRecipe, router]);
```

- [ ] **Step 6: Add touch gesture handlers**

Add:

```tsx
const getDragState = useCallback((event: GestureResponderEvent) => {
  const start = dragStartRef.current;
  const dx = event.nativeEvent.pageX - start.x;
  const dy = event.nativeEvent.pageY - start.y;
  const horizontalIntent = Math.abs(dx) > 24 && Math.abs(dx) > Math.abs(dy) * 1.35;

  return { dx, dy, horizontalIntent };
}, []);

const handleTouchStart = useCallback((event: GestureResponderEvent) => {
  swipeTriggeredRef.current = false;
  translateX.stopAnimation((currentOffset) => {
    dragStartRef.current = {
      x: event.nativeEvent.pageX,
      y: event.nativeEvent.pageY,
      offset: currentOffset,
    };
  });
}, [translateX]);

const handleTouchMove = useCallback((event: GestureResponderEvent) => {
  if (swipeTriggeredRef.current || prompterInteractionActive) return;

  const { dx, horizontalIntent } = getDragState(event);

  if (!horizontalIntent) return;

  const minOffset = pageOffset('home');
  const maxOffset = pageOffset('recipe');
  const nextOffset = Math.max(minOffset, Math.min(maxOffset, dragStartRef.current.offset + dx));

  translateX.setValue(nextOffset);
  updateQuickCameraWarm(nextOffset);
}, [getDragState, pageOffset, prompterInteractionActive, translateX, updateQuickCameraWarm]);

const handleTouchEnd = useCallback((event: GestureResponderEvent) => {
  if (swipeTriggeredRef.current) return;

  const { dx, horizontalIntent } = getDragState(event);
  const threshold = Math.min(150, width * 0.32);

  if (!horizontalIntent || Math.abs(dx) < threshold || prompterInteractionActive) {
    settleToPage(activePage);
    return;
  }

  if (activePage === 'home' && dx > 0) {
    settleToPage('quick');
    return;
  }

  if (activePage === 'quick' && dx < 0) {
    settleToPage('home');
    return;
  }

  if (activePage === 'quick' && dx > 0) {
    settleToPage('recipe', createRecipeFromQuickShoot);
    return;
  }

  settleToPage(activePage);
}, [
  activePage,
  createRecipeFromQuickShoot,
  getDragState,
  prompterInteractionActive,
  settleToPage,
  width,
]);

const handleTouchCancel = useCallback(() => {
  settleToPage(activePage);
}, [activePage, settleToPage]);
```

- [ ] **Step 7: Render the three real sibling pages**

Replace the temporary empty root return with:

```tsx
return (
  <View
    style={styles.root}
    onTouchCancel={handleTouchCancel}
    onTouchEnd={handleTouchEnd}
    onTouchMove={handleTouchMove}
    onTouchStart={handleTouchStart}
  >
    <Animated.View
      style={[
        styles.track,
        {
          width: width * 3,
          transform: [{ translateX }],
        },
      ]}
    >
      <View style={[styles.page, { width }]}>
        <QuickShootRecipeDraftPreview blocks={quickBlocksRef.current} />
      </View>
      <View style={[styles.page, { width }]}>
        <QuickShootCameraSurface
          cameraActive={quickCameraWarm || activePage === 'quick'}
          onBlocksChange={(blocks) => {
            quickBlocksRef.current = blocks;
          }}
          onExitHome={() => settleToPage('home')}
          onPrompterInteractionChange={setPrompterInteractionActive}
        />
      </View>
      <View style={[styles.page, { width }]}>
        <HomeWorkspaceSurface />
      </View>
    </Animated.View>
  </View>
);
```

Add styles:

```tsx
const styles = StyleSheet.create({
  root: {
    backgroundColor: '#020617',
    flex: 1,
    overflow: 'hidden',
  },
  track: {
    flex: 1,
    flexDirection: 'row',
  },
  page: {
    flex: 1,
  },
});
```

- [ ] **Step 8: Fix recipe preview re-rendering when cue blocks change**

The `quickBlocksRef` update alone does not re-render the preview page. Add state:

```tsx
const [quickBlocksSnapshot, setQuickBlocksSnapshot] = useState<PrompterBlock[]>([]);
```

Replace the `onBlocksChange` inline body with:

```tsx
onBlocksChange={(blocks) => {
  quickBlocksRef.current = blocks;
  setQuickBlocksSnapshot(blocks);
}}
```

Pass the snapshot to preview:

```tsx
<QuickShootRecipeDraftPreview blocks={quickBlocksSnapshot} />
```

- [ ] **Step 9: Run TypeScript**

Run:

```bash
cd parrotkit-app && npx tsc --noEmit
```

Expected: PASS.

---

## Task 7: Remove Old Fake Preview Swipe Code

**Files:**
- Modify: `parrotkit-app/src/features/home/screens/home-screen.tsx`
- Modify: `parrotkit-app/src/features/recipes/screens/quick-shoot-camera-screen.tsx`

- [ ] **Step 1: Confirm fake preview symbols are gone**

Run:

```bash
rg -n "QuickShootPeekPanel|QuickShootSwipeBackdrop|RecipeSwipePreview|HomeSwipePreview|quickShootPreview|destinationPreview|swipePanelTitle|swipePanelBody" parrotkit-app/src/features
```

Expected: no matches.

- [ ] **Step 2: If matches remain, remove only the fake-preview components**

Delete component definitions and styles for:

```tsx
function QuickShootPeekPanel() {}
function QuickShootSwipeBackdrop() {}
function RecipeSwipePreview() {}
function HomeSwipePreview() {}
```

Do not remove:

```tsx
createQuickShootRecipe
QuickShootCameraSurface
QuickShootRecipeDraftPreview
HomeQuickShootPagerScreen
```

- [ ] **Step 3: Run TypeScript**

Run:

```bash
cd parrotkit-app && npx tsc --noEmit
```

Expected: PASS.

---

## Task 8: Real Device Smoke Test On 8081

**Files:**
- No code files.

- [ ] **Step 1: Confirm Metro is running**

Run:

```bash
curl -s --max-time 2 http://127.0.0.1:8081/status
```

Expected:

```text
packager-status:running
```

- [ ] **Step 2: Find the connected iPhone UDID**

Run:

```bash
xcrun xctrace list devices | sed -n '1,16p'
```

Expected: an unlocked physical iPhone appears under `== Devices ==`, for example:

```text
iPhone 13 Pro (3) (26.3.1) (00008110-0012708C2E82801E)
```

- [ ] **Step 3: Launch the dev client against 8081**

Use the real UDID from Step 2:

```bash
xcrun devicectl device process launch \
  --device 00008110-0012708C2E82801E \
  --terminate-existing \
  --payload-url 'exp+parrotkit-app://expo-development-client/?url=http%3A%2F%2F192.168.0.104%3A8081' \
  com.anonymous.parrotkitapp \
  --timeout 60
```

Expected:

```text
Launched application with com.anonymous.parrotkitapp bundle identifier.
```

If iOS reports the device is locked, unlock the iPhone and run the same command again.

- [ ] **Step 4: Manual QA Home to Quick Shoot**

On the device:

```text
1. Start on Home.
2. Swipe left edge/center from left to right.
3. Confirm the actual Quick Shoot UI moves into view beside Home.
4. Continue past roughly 70% of the screen.
5. Confirm the camera feed turns on before the page fully settles.
6. Let go.
7. Confirm Quick Shoot remains active and record controls are enabled.
```

- [ ] **Step 5: Manual QA Quick Shoot to Home**

On the device:

```text
1. Start on Quick Shoot.
2. Swipe from right to left.
3. Confirm the actual Home UI appears to the right, not a splash panel.
4. Let go after passing threshold.
5. Confirm Home settles and the camera feed turns off.
```

- [ ] **Step 6: Manual QA Quick Shoot to Recipe**

On the device:

```text
1. Start on Quick Shoot.
2. Add or edit at least two cue blocks.
3. Swipe from left to right.
4. Confirm recipe preview appears to the left while dragging.
5. Let go after passing threshold.
6. Confirm a new Quick Shoot Recipe opens.
7. Confirm the scene list count matches the visible cue count.
```

- [ ] **Step 7: Manual QA Prompt Drag Guard**

On the device:

```text
1. Start on Quick Shoot.
2. Drag a cue horizontally and vertically.
3. Confirm the cue moves.
4. Confirm the pager does not navigate while the cue is being dragged.
```

---

## Task 9: Context, Commit, And Push

**Files:**
- Create: `context/context_20260428_native_home_quick_shoot_pager.md`

- [ ] **Step 1: Write completion context**

Create `context/context_20260428_native_home_quick_shoot_pager.md` with:

```markdown
# Context 2026-04-28 Native Home Quick Shoot Pager

## Summary
- Replaced fake Home/Quick Shoot swipe preview panels with a real three-page pager.
- Home, Quick Shoot, and recipe draft preview now live as sibling pages in the same native surface.
- Home remains mounted and stateful while moving into Quick Shoot.
- Quick Shoot UI remains mounted, but CameraView activates only when Quick Shoot exposure reaches 70% or the page settles on Quick Shoot.
- Quick Shoot cue dragging now guards pager swipe handling.
- Quick Shoot can still create a recipe from visible cues by swiping toward the recipe preview page.

## Files
- `parrotkit-app/src/app/(tabs)/index.tsx`
- `parrotkit-app/src/features/home/screens/home-screen.tsx`
- `parrotkit-app/src/features/home/screens/home-quick-shoot-pager-screen.tsx`
- `parrotkit-app/src/features/home/components/home-workspace-surface.tsx`
- `parrotkit-app/src/features/recipes/screens/quick-shoot-camera-screen.tsx`
- `parrotkit-app/src/features/recipes/screens/quick-shoot-camera-surface.tsx`
- `parrotkit-app/src/features/recipes/components/native-prompter-block-overlay.tsx`
- `parrotkit-app/src/features/recipes/components/quick-shoot-recipe-draft-preview.tsx`
- `plans/20260428_native_home_quick_shoot_pager.md`

## Verification
- `cd parrotkit-app && npx tsc --noEmit` passed.
- Metro 8081 real-device dev-client launch was performed.
- Home -> Quick Shoot, Quick Shoot -> Home, Quick Shoot -> Recipe, and prompt drag guard were manually smoke-tested.

## Notes
- Existing `.superpowers/` artifacts remain untouched.
- The standalone `/quick-shoot` route remains available and uses the same `QuickShootCameraSurface` with `cameraActive=true`.
```

- [ ] **Step 2: Check status**

Run:

```bash
git status --short --branch
```

Expected: only intended files are modified or created, plus pre-existing `.superpowers/` untracked artifacts.

- [ ] **Step 3: Stage intended files**

Run:

```bash
git add \
  'parrotkit-app/src/app/(tabs)/index.tsx' \
  parrotkit-app/src/features/home/screens/home-screen.tsx \
  parrotkit-app/src/features/home/screens/home-quick-shoot-pager-screen.tsx \
  parrotkit-app/src/features/home/components/home-workspace-surface.tsx \
  parrotkit-app/src/features/recipes/screens/quick-shoot-camera-screen.tsx \
  parrotkit-app/src/features/recipes/screens/quick-shoot-camera-surface.tsx \
  parrotkit-app/src/features/recipes/components/native-prompter-block-overlay.tsx \
  parrotkit-app/src/features/recipes/components/quick-shoot-recipe-draft-preview.tsx \
  plans/20260428_native_home_quick_shoot_pager.md \
  context/context_20260428_native_home_quick_shoot_pager.md
```

- [ ] **Step 4: Commit**

Run:

```bash
git commit -m "Add native home quick shoot pager"
```

Expected: commit succeeds.

- [ ] **Step 5: Push to dev**

Run:

```bash
git fetch origin dev
git push origin dev
```

Expected: `dev -> dev` push succeeds. If fetch shows `origin/dev` advanced, rebase locally, resolve conflicts, re-run `cd parrotkit-app && npx tsc --noEmit`, then push.

---

## Self-Review

- Spec coverage: The plan covers real sibling pager architecture, Home alive, Quick Shoot mounted but camera-inactive, 70% camera activation, Home return, recipe creation, prompt drag guard, standalone route compatibility, TypeScript verification, and real-device QA.
- Red-flag scan: No incomplete markers or unspecified implementation steps remain.
- Type consistency: `QuickShootCameraSurfaceProps`, `HomeQuickShootPagerScreen`, `HomeWorkspaceSurface`, `QuickShootRecipeDraftPreview`, and `onPrompterInteractionChange` names are used consistently across tasks.
- Scope check: This is one focused subsystem: native Home/Quick Shoot pager navigation. Backend persistence, web parity analysis, and production recipe storage are outside this plan.
